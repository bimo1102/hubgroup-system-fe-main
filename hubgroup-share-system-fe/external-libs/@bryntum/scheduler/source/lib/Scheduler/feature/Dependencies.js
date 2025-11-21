import BrowserHelper from '../../Core/helper/BrowserHelper.js';
import DateHelper from '../../Core/helper/DateHelper.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import StringHelper from '../../Core/helper/StringHelper.js';
import Rectangle from '../../Core/helper/util/Rectangle.js';
import TemplateHelper from '../../Core/helper/TemplateHelper.js';
import InstancePlugin from '../../Core/mixin/InstancePlugin.js';
import DomDataStore from '../../Core/data/DomDataStore.js';
import Tooltip from '../../Core/widget/Tooltip.js';
import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';

import DependencyCreation from './mixin/DependencyCreation.js';
import DependencyModel from '../model/DependencyModel.js';
import RectangularPathFinder from '../util/RectangularPathFinder.js';
import Delayable from '../../Core/mixin/Delayable.js';
import AttachToProjectMixin from '../data/mixin/AttachToProjectMixin.js';

/**
 * @module Scheduler/feature/Dependencies
 */

const
    resourceRefreshAllActions = {
        add       : 1,
        dataset   : 1,
        remove    : 1,
        removeAll : 1
    },
    fromBoxSide               = [
        'left',
        'left',
        'right',
        'right'
    ],
    toBoxSide                 = [
        'left',
        'right',
        'left',
        'right'
    ];

/**
 * Feature that draws dependencies between events Uses a {@link Scheduler.data.DependencyStore DependencyStore} to
 * determine which dependencies to draw, if none is defined one will be created automatically. Dependencies can also be
 * specified as Scheduler#dependencies, see example below.
 *
 * To customize the dependency tooltip, you can provide the {@link #config-tooltip} config and specify a {@link Core.widget.Tooltip#config-getHtml} function.
 * For example:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     features : {
 *         dependencies : {
 *             tooltip : {
 *                 getHtml({ activeTarget }) {
 *                     const dependencyModel = scheduler.resolveDependencyRecord(activeTarget);
 *
 *                     if (!dependencyModel) return null;
 *
 *                     const { fromEvent, toEvent } = dependencyModel;
 *
 *                     return `${fromEvent.name} (${fromEvent.id}) -> ${toEvent.name} (${toEvent.id})`;
 *                 }
 *             }
 *         }
 *     }
 * }
 * ```
 *
 * This feature is **off** by default. It is **not** supported in vertical mode.
 * For info on enabling it, see {@link Grid.view.mixin.GridFeatures}.
 *
 * @mixes Core/mixin/Delayable
 * @mixes Scheduler/feature/mixin/DependencyCreation
 *
 * @extends Core/mixin/InstancePlugin
 * @demo Scheduler/dependencies
 * @inlineexample Scheduler/feature/Dependencies.js
 * @classtype dependencies
 * @feature
 */
export default class Dependencies extends InstancePlugin.mixin(
    DependencyCreation,
    AttachToProjectMixin,
    Delayable
) {

    /**
     * Fired when dependencies are rendered
     * @event dependenciesDrawn
     * @param {Boolean} [partial] Optional event parameter. `true` when subset of dependencies is repainted, omitted
     * when all lines were repainted.
     */

    //region Config

    static get $name() {
        return 'Dependencies';
    }

    static get defaultConfig() {
        return {
            /**
             * Path finder instance configuration
             * @config {Object}
             */
            pathFinderConfig : null,

            /**
             * The CSS class to add to a dependency line when hovering over it
             * @config {String}
             * @default
             * @private
             */
            overCls : 'b-sch-dependency-over',

            /**
             * The CSS class applied to dependency lines
             * @config {String}
             * @default
             * @private
             */
            baseCls : 'b-sch-dependency',

            highlightDependenciesOnEventHover : false,

            /**
             * Set to true to show a tooltip when hovering a dependency line
             * @config {Boolean}
             */
            showTooltip : true,

            /**
             * A tooltip config object that will be applied to the dependency hover tooltip. Can be used to for example
             * customize delay
             * @config {Object}
             */
            tooltip : null,

            bufferSize : 50,

            // Used to determine the size of the cells in the virtual grid used to cache intersecting dependencies
            cacheGridSize : {
                // the width of an intersection cell expressed in timeaxis ticks
                ticks : 25,

                // the height of an intersection cell express in amount of rows
                // (could be named rows, but that wont match if we add support for vertical mode)
                index : 25
            }
        };
    }

    static get properties() {
        return {
            toDrawOnProjectRefresh : new Set(),
            dependenciesToRefresh  : new Map(),
            drawnDependencies      : [],
            drawnLines             : []
        };
    }

    // Plugin configuration. This plugin chains some of the functions in Grid.
    static get pluginConfig() {
        return {
            chain : ['render', 'renderContents', 'onElementClick', 'onElementDblClick', 'onElementMouseOver',
                'onElementMouseOut', 'onProjectRefresh'],
            assign : ['getElementForDependency', 'getElementsForDependency', 'resolveDependencyRecord']
        };
    }

    //endregion

    //region Init & destroy

    construct(scheduler, config = {}) {
        const me = this;

        if (scheduler.isVertical) {
            throw new Error('Dependencies feature is not supported in vertical mode');
        }

        // Many things may schedule a draw. Ensure it only happens once, on the next frame.
        // And Ensure it really is on the *next* frame after invocation by passing
        // the cancelOutstanding flag.
        me.doScheduleDraw = me.createOnFrame('draw', [], me, true);

        super.construct(scheduler, config);

        me.pathFinder = new RectangularPathFinder(me.pathFinderConfig);
        delete me.pathFinderConfig;

        me.lineDefAdjusters = me.createLineDefAdjusters();

        scheduler.rowManager.on({
            refresh : 'onRefresh',
            thisObj : me
        });
    }

    doDestroy() {
        this.tooltip?.destroy();
        super.doDestroy();
    }

    doDisable(disable) {
        const
            me          = this,
            { project } = me;

        me.updateCreateListeners();

        // detach/attach store listeners
        if (project || disable) {
            me.attachToResourceStore(disable ? null : project.resourceStore);
            me.attachToEventStore(disable ? null : project.eventStore);
            me.attachToAssignmentStore(disable ? null : project.assignmentStore);
            me.attachToDependencyStore(disable ? null : project.dependencyStore);
        }

        if (me.client.isPainted) {
            // draw() needs "me.dependencyStore" to be provided
            me.draw();
        }

        super.doDisable(disable);
    }

    //endregion

    //region Dependency types

    static getLocalizedDependencyType(type) {
        // Do not remove. Assertion strings for Localization sanity check.
        // 'L{DependencyType.SS}'
        // 'L{DependencyType.SF}'
        // 'L{DependencyType.FS}'
        // 'L{DependencyType.FF}'
        // 'L{DependencyType.StartToStart}'
        // 'L{DependencyType.StartToEnd}'
        // 'L{DependencyType.EndToStart}'
        // 'L{DependencyType.EndToEnd}'
        // 'L{DependencyType.long}'
        // 'L{DependencyType.short}'

        return type ? this.L(`L{DependencyType.${type}}`) : '';
    }

    findDependencyIndex(dependencies = [], dependency, assignmentData) {
        return dependencies.findIndex(item => (
            item.dependency === dependency &&
            (item.assignmentData === assignmentData ||
                (
                    item.assignmentData && assignmentData &&
                    item.assignmentData.from === assignmentData.from &&
                    item.assignmentData.to === assignmentData.to
                )
            )
        ));
    }

    includesDependency() {
        return this.findDependencyIndex(...arguments) >= 0;
    }

    //endregion

    //region Stores

    attachToResourceStore(store) {
        super.attachToResourceStore(store);

        if (store && !this.disabled) {
            store.on({
                name             : 'resourceStore',
                changePreCommit  : 'onResourceStoreChange',
                refreshPreCommit : 'onResourceStoreRefresh',
                thisObj          : this
            });
        }
    }

    attachToDependencyStore(store) {
        const me = this;

        super.attachToDependencyStore(store);

        // When assigning a new store there is no point in keeping anything cached
        me.resetGridCache();
        me.resetBoundsCache();

        if (store && !me.disabled) {
            // TODO: This is rather doubtful code, investigate it
            // used to store meta per scheduler on models, in case they are used in multiple schedulers
            store.metaMapId = me.client.id;

            store.on({
                name            : 'dependencyStore',
                changePreCommit : 'onDependencyChange',
                idChange        : 'onDependencyIdChange',
                thisObj         : me
            });
        }
    }

    attachToAssignmentStore(store) {
        super.attachToAssignmentStore(store);

        if (store && !this.disabled) {
            store.on({
                name             : 'assignmentStore',
                changePreCommit  : 'onAssignmentChange',
                refreshPreCommit : 'onAssignmentRefresh',
                thisObj          : this
            });
        }
    }

    attachToEventStore(store) {
        super.attachToEventStore(store);

        if (store && !this.disabled) {
            store.on({
                name            : 'eventStore',
                changePreCommit : 'onEventChange',
                batchedUpdate   : 'onEventBatchedUpdate',
                thisObj         : this
            });
        }
    }

    //endregion

    //region Markers

    createMarkers() {
        const
            me        = this,
            svg       = me.client.svgCanvas,
            endMarker = me.endMarker = me.initMarkerElement('arrowEnd', '8', 'M0,0 L0,6 L9,3 z');

        // Edge and IE11 do not support required svg 2.0 orient value
        if (BrowserHelper.isEdge || BrowserHelper.isIE11) {
            const startMarker = me.startMarker = me.initMarkerElement('arrowStart', '1', 'M0,3 L9,6 L9,0 z');

            svg.appendChild(startMarker);
        }
        else {
            endMarker.setAttribute('orient', 'auto-start-reverse');
        }

        svg.appendChild(endMarker);
    }

    /**
     * Creates SVG marker element (arrow) which is used for all dependency lines
     * @private
     * @param {String} id Id of the marker element
     * @param {String} refX
     * @param {String} arrowPath Path defining arrow
     */
    initMarkerElement(id, refX, arrowPath) {
        return DomHelper.createElement({
            id,
            tag          : 'marker',
            className    : 'b-sch-dependency-arrow',
            ns           : 'http://www.w3.org/2000/svg',
            markerHeight : 11,
            markerWidth  : 11,
            refX,
            refY         : 3,
            viewBox      : '0 0 9 6',
            orient       : 'auto',
            markerUnits  : 'userSpaceOnUse',
            children     : [{
                tag : 'path',
                ns  : 'http://www.w3.org/2000/svg',
                d   : arrowPath
            }]
        });
    }

    /**
     * Returns an array of functions used to alter path config when no path found.
     * It first tries to shrink arrow margins and secondly hides arrows entirely
     * @private
     * @returns {Function[]}
     */
    createLineDefAdjusters() {
        const scheduler = this.client;

        function shrinkArrowMargins(lineDef) {
            let adjusted = false;

            if (lineDef.startArrowMargin > scheduler.barMargin || lineDef.endArrowMargin > scheduler.barMargin) {
                lineDef.startArrowMargin = lineDef.endArrowMargin = scheduler.barMargin;
                adjusted = true;
            }

            return adjusted ? lineDef : adjusted;
        }

        function resetArrowMargins(lineDef) {
            let adjusted = false;

            if (lineDef.startArrowMargin > 0 || lineDef.endArrowMargin > 0) {
                lineDef.startArrowMargin = lineDef.endArrowMargin = 0;
                adjusted = true;
            }

            return adjusted ? lineDef : adjusted;
        }

        return [
            shrinkArrowMargins,
            resetArrowMargins
        ];
    }

    //endregion

    //region Elements

    getElementForDependency(dependency, assignmentData = null) {
        return this.getElementsForDependency(dependency, assignmentData)[0];
    }

    getElementsForDependency(dependency, assignmentData = null) {
        // Selector targeting all instances of a dependency
        let selector = `[depId="${dependency.id}"]`;

        // Optionally narrow it down to a single instance (assignment)
        if (assignmentData) {
            selector += `[fromId="${assignmentData.from.id}"][toId="${assignmentData.to.id}"]`;
        }

        return Array.from(this.client.svgCanvas.querySelectorAll(selector));
    }

    /**
     * Returns the dependency record for a DOM element
     * @param {HTMLElement} element The dependency line element
     * @return {Scheduler.model.DependencyModel} The dependency record
     */
    resolveDependencyRecord(element) {
        // getAttribute return a string or null
        const id = typeof element === 'string' ? element : element.getAttribute('depId');

        return id ? this.dependencyStore.getById(id) : null;
    }

    //endregion

    //region Events

    //region Events that triggers redraw

    // Refresh dependencies when grid is refreshed
    onRefresh() {
        if (this.client.isEngineReady) {
            this.onProjectRefresh();
        }
    }

    onProjectRefresh() {
        const me = this;

        if (!me.client.refreshSuspended) {
            // Mainly for operations involving rows, adding or removing invalidates all resources
            if (me.refreshAllWhenReady) {
                me.resetGridCache();
                me.scheduleDraw(true);
                me.refreshAllWhenReady = false;
            }
            else if (me.toDrawOnProjectRefresh) {
                // Check if there is a cache exists. If it does - use it,
                // if not - create one after all records are drawn, this will cache all existing records
                const cache = me._dependencyGridCache;

                cache && me.toDrawOnProjectRefresh.forEach(dependency => {
                    // Previously this code would draw added dependencies here, no matter if in view or not. To not have
                    // to have the logic for determining whats in view or not here also, simply do a full draw below.
                    // Old approach was especially costly when using CrudManager, which adds on load

                    me.addToGridCache(dependency);
                });

                if (!cache) {
                    me._thisIsAUsedExpression(me.dependencyGridCache);
                }

                me.toDrawOnProjectRefresh.clear();

                me.scheduleDraw();
            }
        }
    }

    onToggleNode() {
        // Need to repopulate grid cache
        this.resetGridCache();
        // node toggled in tree, can affect resources both above and below, need to redraw all.
        this.scheduleDraw(true);
    }

    onViewportResize() {
        // More or fewer dependencies might be in view, but their locations has not changed so no need to invalidate
        // grid cache
        this.scheduleDraw(true);
    }

    /**
     * Flags for redrawing if a rows height has changed
     * @private
     */
    onTranslateRow({ row }) {
        // a changetotalheight event is fired after translations, if a rowHeight change is detected here it will redraw
        // all dependencies
        if (row.lastTop >= 0 && row.top !== row.lastTop) {
            this.scheduleDraw(true);
        }
    }

    /**
     * Redraws all dependencies if a rows height changed, as detected in onTranslateRow
     * @private
     */
    onChangeTotalHeight() {
        if (this.client.isEngineReady) {
            // redraw all dependencies if the height changes. Could be caused by resource add/remove.
            // in reality not all deps needs to be redrawn, those fully above the row which changed height could be left
            // as is, but determining that would likely require more processing than redrawing
            this.scheduleDraw(true);
        }
    }

    /**
     * Draws dependencies on horizontal scroll
     * @private
     */
    onHorizontalScroll({ subGrid }) {
        // ResizeMonitor triggers scroll during render, make sure we have been drawn some other way before redrawing
        if (this.isDrawn && subGrid === this.client.timeAxisSubGrid) {
            this.scheduleDraw(false);
        }
    }

    /**
     * Draws dependencies on vertical scroll
     * @private
     */
    onVerticalScroll() {
        // ResizeMonitor triggers scroll during render, make sure render is done
        if (this.isDrawn) {
            // Do not invalidate on scroll, if height changes it will be invalidated anyway
            this.scheduleDraw(false);
        }
    }

    onRowsRefresh() {
        this.scheduleDraw(true);
    }

    onResourceStoreChange({ action }) {
        // bail out in case we are finalizing the propagation caused by project loading
        // we've already scheduled dependencies draw in the project "refresh" listener
        if (this.client.project.propagatingLoadChanges) {
            return;
        }

        // Adding/removing resources affects all dependencies that intersect or are fully below the resources.
        // Instead of determining which those are, do a full redraw when project have been recalculated
        if (resourceRefreshAllActions[action]) {
            this.refreshAllWhenReady = true;
        }
    }

    /**
     * Redraws dependencies when a row has changed
     * @private
     */
    onResourceStoreRefresh({ action }) {
        // bail out in case we are finalizing the propagation caused by project loading
        // we've already scheduled dependencies draw in the project "refresh" listener
        if (this.client.project.propagatingLoadChanges) {
            return;
        }

        switch (action) {
            case 'sort':
            case 'filter':
            case 'batch':
                // Will need to recreate grid cache after sort, filter, and any unspecified
                // set of operations encapsulated by a batch, and redraw everything
                this.resetGridCache();
                this.scheduleDraw(true);
        }
    }

    /**
     * Redraws dependencies when a dependency has changed
     * @private
     */
    async onDependencyChange({ action, record, records }) {
        const
            me         = this,
            { client } = me;

        // bail out in case:
        // - client is not painted yet
        // - client has rendering suspended
        // - or we are finalizing the propagation caused by project loading
        // we've already scheduled dependencies draw in the project "refresh" listener
        if (!client.isPainted || client.suspendRendering || this.client.project.propagatingLoadChanges) {
            return;
        }

        switch (action) {
            case 'dataset':
                me.dependencyGridCache = {};
                me.toDrawOnProjectRefresh = new Set(records);
                return;
            case 'add':
                // Dependency added, draw it on project refresh. Cannot draw it earlier since adding it will have
                // invalidated the graph, making it impossible to determine coords
                records.forEach(record => me.toDrawOnProjectRefresh.add(record));
                return;
            case 'update': {
                // Not drawn, either out of view or not properly configured earlier
                if (!me.drawnDependencies.some(d => d.dependency === record)) {
                    me.addToGridCache(record);
                    me.scheduleDraw();
                }
                else {
                    // Dependency updated. Might have changed source or target, redraw it completely
                    return me.scheduleRefreshDependency(record);
                }
                break;
            }
            case 'remove':
                // dependencies removed, release elements and remove from cache
                records.forEach(dependency => {
                    me.releaseDependency(dependency, true);
                    me.removeFromCache(dependency);
                    // Dependency might got scheduled to be refreshed before it is removed
                    me.dependenciesToRefresh.delete(dependency);
                });
                client.trigger('dependenciesDrawn');
                return;
            // Removing all or filtering -> full redraw
            case 'removeall':
            case 'filter':
                me.resetGridCache();
                // continue to schedule draw
                break;
        }

        // other changes (removeall, filter) trigger full redraw
        me.scheduleDraw(true);
    }

    onDependencyIdChange({ record, oldValue }) {
        // Dependency has real id now and we should remove cache for phantom id
        this.removeFromCache(record, null, oldValue);
        this.addToGridCache(record);
    }

    onEventBatchedUpdate(event) {
        if (this.client.listenToBatchedUpdates) {
            // EventResize only changes the end point.
            // onEventChange insists that >1 fields are changed unless we pass this flag.
            event.fromBatched = true;
            this.onEventChange(...arguments);
        }
    }

    /**
     * Redraws dependencies when an event has changed
     * @private
     */
    onEventChange({ action, record, changes, fromBatched }) {
        // TODO : In Gantt this will be the same as the row store, only need one
        const me = this;

        // bail out in case we are finalizing the propagation caused by project loading
        // we've already scheduled dependencies draw in the project "refresh" listener
        if (me.client.project.propagatingLoadChanges) {
            return;
        }

        switch (action) {
            case 'filter':
                // filtering events, need to redraw all dependencies
                me.scheduleDraw(true);
                break;
            case 'update':
                // Ignore normalization of single field unless it's from a batched update, ie EventResize
                if (!fromBatched && Object.keys(changes).length === 1 && (changes.startDate || changes.endDate || changes.duration)) {
                    return;
                }

                if (!record.isEvent) {
                    me.drawForTimeSpan(record, true);
                }
                else {
                    // event updated, need to redraw dependencies for all events in its row since it might have changed
                    // vertical position (from changing startDate, duration, name or anything if using custom sorter)
                    const eventRecords = [record];
                    // Collect all events for all resources which have this event assigned... they might all be affected
                    record.resources.forEach(resourceRecord => eventRecords.push(...resourceRecord.events));
                    new Set(eventRecords).forEach(eventRecord => me.drawForTimeSpan(eventRecord, true));
                }
                break;
            case 'removeall':
                me.resetGridCache();
                me.scheduleDraw(true);
                break;
        }

        // adding event has no effect on dependencies, unless it changes row height. in which case it will be handled
        // by onTranslateRow().
        // updating an event might also change row height, handled the same way.
        // removing events will also remove dependencies, thus handled in onDependencyChange
    }

    onAssignmentRefresh({ action }) {
        // bail out in case we are finalizing the propagation caused by project loading
        // we've already scheduled dependencies draw in the project "refresh" listener
        if (this.client.project.propagatingLoadChanges) {
            return;
        }

        if (action === 'dataset') {
            // Assigning using EventEdit replaces all assignments. Taking the easy way out, throwing cache away
            this.resetGridCache();
            this.scheduleDraw(true);
        }
    }

    onAssignmentChange({ action, record, records, changes }) {
        const me = this;

        // bail out in case we are finalizing the propagation caused by project loading
        // we've already scheduled dependencies draw in the project "refresh" listener
        if (me.client.project.propagatingLoadChanges) {
            return;
        }

        if (record) {
            records = [record];
        }

        // Unusual case probably, not worth figuring out which was filtered out
        if (action === 'filter') {
            me.resetGridCache();
            me.scheduleDraw(true);
        }

        if (action === 'add' || action === 'remove' || action === 'update') {
            // Ignore normalization of event & resource
            if (
                action === 'update' &&
                // Only care about the normalization case, where changes are exactly 2 = event + resource
                Object.keys(changes).length === 2 &&
                // And those changed from not being models
                changes.event && changes.resource && !changes.event.isModel && !changes.resource.isModel
            ) {
                return;
            }

            records.forEach(assignment => {
                const
                    { assignmentStore, eventStore } = me.client,
                    // Engine clears assignment.event on remove, have to look it up
                    event                           = eventStore.getById(assignment.eventId);

                // Event might have been removed with the assignment, if not all its deps might need refreshing
                event && event.dependencies.forEach(dependency => {
                    // New assignment added by other means than EventEdit
                    if (action === 'add') {
                        me.toDrawOnProjectRefresh.add(dependency);
                        //me.scheduleRefreshDependency(dependency);
                    }
                    // Event unassigned, remove dep line (directly, nothing is redrawn so engine state can be ignored)
                    else if (action === 'remove') {
                        let assignments;

                        // Removed source?
                        if (dependency.fromEvent === event) {
                            // Might point to a multi assigned event, need to remove all lines
                            assignments = dependency.toEvent.assignments.map(
                                to => ({ from : assignment, to })
                            );
                        }
                        // Nope, target
                        else {
                            // Might point to a multi assigned event, need to remove all lines
                            assignments = dependency.fromEvent.assignments.map(
                                from => ({ from, to : assignment })
                            );
                        }

                        assignments.forEach(assignmentData => {
                            me.releaseDependency(dependency, assignmentData);
                            me.removeFromCache(dependency, assignmentData);
                        });
                    }
                    // Single assignment updated, redraw lines for it
                    else if (action === 'update') {
                        me.getDependencyAssignmentsAsFromToArray({ dependency, assignmentStore }).filter(
                            a => (a.from === record || a.to === record)
                        ).forEach(assignmentData => {
                            me.scheduleRefreshDependency(dependency, assignmentData);
                        });
                    }
                });
            });
        }
    }

    // TODO: this function is called often, use cache to avoid searching in store
    getDependencyAssignmentsAsFromToArray({ dependency, assignmentStore }) {
        const
            { fromEvent, toEvent } = dependency,
            assignments            = [];

        if (fromEvent && toEvent) {
            const
                fromAssignments = this.getEventAssignments(fromEvent, assignmentStore),
                toAssignments = this.getEventAssignments(toEvent, assignmentStore);

            fromAssignments.forEach(from => {
                toAssignments.forEach(to => {
                    assignments.push({ from, to });
                });
            });
        }

        return assignments;
    }

    getEventAssignments(event, assignmentStore) {
        if (!event.isRemoved) {
            return event.assignments;
        }
        // If event is removed assignments might be either removed or planned to be removed
        else {
            const assignments = assignmentStore.removed.values.filter(assignment => assignment.event === event);

            for (const assignment of assignmentStore.assignmentsForRemoval) {
                if (assignment.event === event) {
                    assignments.push(assignment);
                }
            }

            return assignments;
        }
    }

    //endregion

    onElementClick(event) {
        const me = this;

        if (event.target.matches('.' + me.baseCls)) {
            const
                dependency = DomDataStore.get(event.target).dependency,
                eventName  = event.type === 'click' ? 'Click' : 'DblClick';

            /**
             * Fires on the owning Scheduler/Gantt when a click is registered on a dependency line.
             * @event dependencyClick
             * @on-owner
             * @param {Scheduler.view.Scheduler} source The scheduler
             * @param {Scheduler.model.DependencyModel} dependency
             * @param {MouseEvent} event
             */
            /**
             * Fires on the owning Scheduler/Gantt when a click is registered on a dependency line.
             * @event dependencyDblClick
             * @on-owner
             * @param {Scheduler.view.Scheduler} source The scheduler
             * @param {Scheduler.model.DependencyModel} dependency
             * @param {MouseEvent} event
             */
            me.client.trigger(`dependency${eventName}`, {
                dependency,
                event
            });
        }
    }

    onElementDblClick(event) {
        return this.onElementClick(event);
    }

    onElementMouseOver(event) {
        const me = this;

        if (event.target.matches('.' + me.baseCls)) {
            const dependency = DomDataStore.get(event.target).dependency;

            /**
             * Fires on the owning Scheduler/Gantt when the mouse moves over a dependency line.
             * @event dependencyMouseOver
             * @on-owner
             * @param {Scheduler.view.Scheduler} source The scheduler
             * @param {Scheduler.model.DependencyModel} dependency
             * @param {MouseEvent} event
             */
            me.client.trigger('dependencyMouseOver', {
                dependency,
                event
            });

            if (me.overCls) {
                me.highlight(dependency, me.overCls);
            }
        }
    }

    onElementMouseOut(event) {
        const me = this;

        if (event.target.matches('.' + me.baseCls)) {
            const dependency = DomDataStore.get(event.target).dependency;

            /**
             * Fires on the owning Scheduler/Gantt when the mouse moves out of a dependency line.
             * @event dependencyMouseOut
             * @on-owner
             * @param {Scheduler.view.Scheduler} source The scheduler
             * @param {Scheduler.model.DependencyModel} dependency
             * @param {MouseEvent} event
             */
            me.client.trigger('dependencyMouseOut', {
                dependency,
                event
            });

            if (me.overCls && !dependency.isRemoved) me.unhighlight(dependency);
        }
    }

    //endregion

    //region Highlight

    highlight(dependency, cls = this.overCls) {
        const elements = this.getElementsForDependency(dependency);

        elements.forEach(element => {
            element.classList.add(cls);
        });

        dependency.highlight(cls);
    }

    unhighlight(dependency, cls = this.overCls) {
        const elements = this.getElementsForDependency(dependency);

        elements.forEach(element => {
            element.classList.remove(cls);
        });

        dependency.unhighlight(cls);
    }

    highlightEventDependencies(timespan) {
        timespan.dependencies.forEach(dep => this.highlight(dep));
    }

    unhighlightEventDependencies(timespan) {
        timespan.dependencies.forEach(dep => this.unhighlight(dep));
    }

    //endregion

    //region Determining dependencies to draw

    // Neither resource can be hidden for a dependency to be considered visible
    isDependencyVisible(dependency, assignmentData = null) {
        const
            me                                             = this,
            { assignmentStore, resourceStore, eventStore } = me.client,
            { fromEvent, toEvent }                         = dependency;

        // Bail out early in case source or target doesn't exist
        if (!(fromEvent && toEvent)) {
            return false;
        }

        let fromResource, toResource;

        // Using multi-assignment, resource obtained from assignment
        if (assignmentData) {
            const { from, to } = assignmentData;

            fromResource = from.resource;
            toResource =  to.resource;

            // EventStore or AssignmentStore might be filtered, or assignment might opt out of dependency drawing
            if (
                (from.drawDependencies === false || to.drawDependencies === false) ||
                (eventStore.isFiltered && (!eventStore.includes(fromEvent) || !eventStore.includes(toEvent))) ||
                (assignmentStore.isFiltered && (!assignmentStore.includes(from) || !assignmentStore.includes(to)))
            ) {
                return false;
            }
        }
        // Not using assignments, resource obtained from event
        else {
            fromResource = fromEvent.resource;
            toResource = toEvent.resource;
        }

        // Verify these are real existing Resources and collapsed away (resource not existing in resource store)
        if (!resourceStore.isAvailable(fromResource) || !resourceStore.isAvailable(toResource)) {
            return false;
        }

        return fromEvent.isModel &&
            !fromResource.instanceMeta(resourceStore).hidden &&
            !toResource.instanceMeta(resourceStore).hidden;
    }

    // Get the bounding box for either the source or the target event
    getBox(dependency, source, assignmentData = null, roughly = false) {
        const eventRecord = this.getTimeSpanRecordFromDependency(dependency, source);

        let resourceRecord;

        // Multi-assignment, get resource from assignment
        if (assignmentData) {
            resourceRecord = assignmentData[source ? 'from' : 'to'].resource;
        }
        // Single, get resource from event
        else {
            // resourceRecord = this.dataApi.getEventResource({ event : eventRecord, resourceStore : this.resourceStore });
            resourceRecord = eventRecord.resource;
        }

        return this.client.getResourceEventBox(eventRecord, resourceRecord, true, roughly);
    }

    // Get source or target events resource
    getRowRecordFromDependency(dependency, source, assignmentData) {
        let rowRecord;

        // Multi-assigned, use assignments resource
        if (assignmentData) {
            rowRecord = assignmentData[source ? 'from' : 'to'].resource;
        }
        // Not multi-assigned, get events resource
        else {
            rowRecord = this.getTimeSpanRecordFromDependency(dependency, source).resource;
        }

        return rowRecord;
    }

    // Get from or to event
    getTimeSpanRecordFromDependency(dependency, from = true) {
        return dependency[`${from ? 'from' : 'to'}Event`];
    }

    getMetaId(assignmentData = null) {
        return assignmentData ? `${this.client.id}-ass${assignmentData.from.id}-ass${assignmentData.to.id}` : this.client.id;
    }

    // Gets the source and target events bounds and unions them to determine the dependency bounds
    getDependencyBounds(dependency, assignmentData, roughly = false) {
        const
            me        = this,
            scheduler = me.client,
            ddr       = dependency.getDateRange();

        // quick bailout for hidden rows
        if (!scheduler.rowManager.rowCount || !me.isDependencyVisible(dependency, assignmentData)) {
            return null;
        }
        // quick bailout in case dependency dates and view dates do not intersect
        if (!(ddr && scheduler.timeAxis.count && DateHelper.intersectSpans(ddr.start, ddr.end, scheduler.startDate, scheduler.endDate))) {
            return null;
        }

        const
            metaId         = me.getMetaId(assignmentData),
            instanceMeta   = dependency.instanceMeta(metaId),
            startRectangle = me.getBox(dependency, true, assignmentData, roughly),
            endRectangle   = me.getBox(dependency, false, assignmentData, roughly);

        // Can't draw dependency if either start or end is in collapsed row
        if (!startRectangle || !endRectangle) {
            return null;
        }

        // If we are forcing recalculation of dep bounds, or there are no calculated bounds for this dependency
        // or the calculated bounds were based on a "best guess", then recalculate the bounds.
        if (me._resetBoundsCache || !instanceMeta.bounds || !instanceMeta.bounds.layout) {
            const
                from   = me.getTimeSpanRecordFromDependency(dependency, true),
                to     = me.getTimeSpanRecordFromDependency(dependency, false),
                bounds = Rectangle.union(startRectangle, endRectangle);

            if (!scheduler.isGantt) {
                [[from, startRectangle, assignmentData.from], [to, endRectangle, assignmentData.to]].map(([record, rectangle, assignment]) => {
                // When using other milestoneLayoutMode than default milestones should be treated as normal events.
                // Milestones are zero width by default, so we must measure the milestone el's height
                // (or icon el width) and use that as the width. We cannot use the event's calculated height because
                // if there are labels, the milestone diamond will be smaller.
                // If the event doesn't have an element, then it's outside of the rendered block and the exact
                // width doesn't matter.
                    if (scheduler.milestoneLayoutMode === 'default' && record.isMilestone) {
                        if (!scheduler.milestoneWidth) {
                            const milestoneElement = scheduler.getElementFromAssignmentRecord(assignment);
                            if (milestoneElement) {
                                scheduler.milestoneWidth = milestoneElement.offsetWidth;

                                // The line above used to have this, but that does not allow mixin icons with non-icons.
                                // With the new milestone styling, we seem fine without it anyway
                                //record.iconCls ? milestoneElement.offsetWidth : parseInt(window.getComputedStyle(milestoneElement, ':before').fontSize);
                            }
                        }

                        // If it could not be measured due to the event being outside of the rendered block
                        // we have to use the calculated height.
                        const milestoneWidth = scheduler.milestoneWidth || rectangle.height;
                        rectangle.left -= milestoneWidth / 2;
                        rectangle.right += milestoneWidth / 2;
                    }
                });
            }

            instanceMeta.bounds = {
                bounds,
                startRectangle,
                endRectangle,

                // Cache whether both rectangles are based on the true layout
                // or a best guess approximation to be recalculated
                // next time through.
                layout : startRectangle.layout || endRectangle.layout
            };
        }

        return dependency.instanceMeta(metaId).bounds;
    }

    // Grid cache is a virtual grid holding info on which dependencies intersects its virtual cells.
    // Used to determine which dependencies should be considered for drawing, iterating over all dependencies each update
    // gets too costly when count increases (>10000).
    //
    // Illustration shows entire schedule area, dddd is a dependency line, vvv is viewport, xxx virtual cell border:
    //
    // ----------------------------------
    // |     vvvvvxvvvvv                |
    // |     v    x    v                |
    // |     v d  x    v                |
    // |     v d  x    v                |
    // |xxxxxvxdxxx    v                |
    // |     vvdvvxvvvvv                |
    // |       d  x                     |
    // |       d  x                     |
    // |       d  x                     |
    // |xxxxxxxdxxxxxxx                 |
    // |       d  x                     |
    // |       d  x                     |
    // |          x                     |
    // |          x                     |
    // |xxxxxxxxxxxxxxx                 |
    // ----------------------------------
    //
    // The dependency crosses three virtual grid cells [0,0], [0,1] and [0,2]. Stored in a map in cache:
    // {
    //    0 : {
    //      0 : [ d, ... ],
    //      1 : [ d, ... ],
    //      2 : [ d, ... ]
    //    }
    // }
    //
    // Viewport crosses four virtual grid cells [0,0], [1,0], [0,1], [1,1]. Those cells are checked in the cached map to
    // find out which rows should be considered for drawing.
    //
    // This approach minimizes the amount of iteration needed
    get dependencyGridCache() {
        const me = this;

        if (!me._dependencyGridCache) {
            me._dependencyGridCache = {};
            me.dependencyStore.forEach(dependency => me.addToGridCache(dependency));
        }

        return me._dependencyGridCache;
    }

    get dependencyStore() {
        return this.project.dependencyStore;
    }

    getIteratableDependencyAssignments(dependency) {
        return this.assignmentStore ? this.getDependencyAssignmentsAsFromToArray({
            dependency,
            assignmentStore : this.assignmentStore
        }) : [null]; // On purpose, to be iterable
    }

    addToGridCache(dependency) {
        const
            me                       = this,
            { client }               = me,
            { store }                = client,
            {
                dependencyGridCache,
                cacheGridSize
            }                        = me,
            assignmentDataArray      = me.getIteratableDependencyAssignments(dependency),
            axisStartMS              = client.startDate.getTime(),
            axisEndMS                = client.endDate.getTime(),
            cacheGridSizeTicksMS     = DateHelper.asMilliseconds(client.timeAxis.unit) * cacheGridSize.ticks;

        assignmentDataArray.forEach(assignmentData => {
            const
                metaId        = me.getMetaId(assignmentData),
                meta          = dependency.instanceMeta(metaId),
                metaGridCache = meta.gridCache = [],

                // Using index vertically rather than y for reliability with variable row height
                fromIndex     = store.indexOf(me.getRowRecordFromDependency(dependency, true, assignmentData)),
                toIndex       = store.indexOf(me.getRowRecordFromDependency(dependency, false, assignmentData)),

                // Using dates horizontally rather than x for performance reasons
                dates         = dependency.getDateRange(),
                startDateMS   = dates?.start.getTime(),
                endDateMS     = dates?.end.getTime();

            if (fromIndex !== -1 && toIndex !== -1 && dates && endDateMS > axisStartMS && startDateMS < axisEndMS) {
                const
                    topIndex    = Math.min(fromIndex, toIndex),
                    bottomIndex = Math.max(fromIndex, toIndex),

                    boxTop      = Math.floor(topIndex / cacheGridSize.index),
                    boxBottom   = Math.floor(bottomIndex / cacheGridSize.index),

                    boxLeft     = Math.floor(Math.max(startDateMS - axisStartMS, 0) / cacheGridSizeTicksMS),
                    boxRight    = Math.floor(Math.max(endDateMS - axisStartMS, 0) / cacheGridSizeTicksMS),

                    key         = `${dependency.id}.-.${metaId}`;

                let cacheX, cacheY, cacheYMap, x, y;

                // Store the dependency in the virtual cells which it intersects
                for (x = boxLeft; x <= boxRight; x++) {
                    cacheX = dependencyGridCache[x] || (dependencyGridCache[x] = {});

                    for (y = boxTop; y <= boxBottom; y++) {
                        cacheY = cacheX[y] || (cacheX[y] = []);

                        cacheYMap = cacheY.cached || (cacheY.cached = {});

                        // Only push to the cache if it is not already there
                        if (!cacheYMap[key]) {
                            cacheYMap[key] = true;
                            cacheY.push({ dependency, assignmentData, metaId });
                        }
                        metaGridCache.push([x, y]);
                    }
                }
            }
        });
    }

    removeFromCache(dependency, assignmentData = null, dependencyId = dependency.id) {
        const
            me                       = this,
            { _dependencyGridCache } = me;

        let assignments;

        // Some short-cut case
        if (assignmentData) {
            assignments = [assignmentData];
        }
        else {
            assignments = this.getIteratableDependencyAssignments(dependency);
        }

        assignments.forEach(assignmentData => {
            const
                metaId = me.getMetaId(assignmentData),
                meta   = dependency.instanceMeta(metaId),
                key    = `${dependencyId}.-.${metaId}`;

            _dependencyGridCache && meta.gridCache?.forEach(([x, y]) => {
                if (_dependencyGridCache[x]?.hasOwnProperty(y)) {
                    const entries = me._dependencyGridCache[x][y];

                    if (entries?.cached[key]) {
                        const index = me.findDependencyIndex(entries, dependency, assignmentData);

                        delete entries.cached[key];

                        // Cannot use ArrayHelper#remove since it cannot compare deeply
                        if (index > -1) {
                            entries.splice(index, 1);
                        }
                    }
                }
            });

            meta.bounds = null;
            meta.gridCache = null;
        });
    }

    set dependencyGridCache(cache) {
        this._dependencyGridCache = cache;
    }

    // Reset cached bounds, not grid cache since it is expensive to create. It is so coarse anyway so should be fine
    // with most changes, except for sorting and similar. Reset on demand instead
    resetBoundsCache() {
        // Not actually resetting here, would just be costly to iterate and reset per dependency, instead flagging to
        // force cached value to be updated
        this._resetBoundsCache = true;
    }

    // In some cases we do need to reset cache, like when time axis is reconfigured
    resetGridCache() {
        this.dependencyGridCache = null;
    }

    //endregion

    //region Draw & render

    //region Lines

    /**
     * Generates `otherBoxes` config for rectangular path finder, which push dependency line to the row boundary.
     * It should be enough to return single box with top/bottom taken from row top/bottom and left/right taken from source
     * box, extended by start arrow margin to both sides.
     * @param {Core.helper.util.Rectangle} box Box for which other boxes are required
     * @param {String} side Side of the box where line starts
     * @returns {Object[]}
     * @private
     */
    generateBoundaryBoxes(box, side) {
        const boxes = [];

        // We need two boxes for the bottom edge, because otherwise path cannot be found. Ideally that shouldn't be
        // necessary. Other solution would be to adjust bottom by -1px, but that would make some dependency lines to take
        // 1px different path on a row boundary, which doesn't look nice (but slightly more performant)
        if (side === 'bottom') {
            boxes.push(
                {
                    start  : box.left,
                    end    : box.left + box.width / 2,
                    top    : box.rowTop,
                    bottom : box.rowBottom
                },
                {
                    start  : box.left + box.width / 2,
                    end    : box.right,
                    top    : box.rowTop,
                    bottom : box.rowBottom
                }
            );
        }
        else {
            boxes.push(
                {
                    start  : box.left - this.pathFinder.startArrowMargin,
                    end    : box.right + this.pathFinder.startArrowMargin,
                    top    : box.rowTop,
                    bottom : box.rowBottom
                }
            );
        }

        //<debug>
        window.DEBUG && boxes.forEach(box => {
            DomHelper.createElement({
                parent : document.querySelector('.b-sch-foreground-canvas'),
                html   : `<div style="left:${box.start}px;top:${box.top}px;width:${box.end - box.start}px;height:${box.bottom - box.top}px;border:1px solid green;position:absolute;"></div>`
            });
        });
        //</debug>

        return boxes;
    }

    getDependencyStartSide(dependency) {
        const
            me     = this,
            source = me.getTimeSpanRecordFromDependency(dependency, true),
            type   = dependency.type;

        let startSide = dependency.fromSide;

        if (!startSide) {
            switch (true) {
                case type === DependencyModel.Type.StartToEnd:
                    startSide = me.getConnectorStartSide(source);
                    break;

                case type === DependencyModel.Type.StartToStart:
                    startSide = me.getConnectorStartSide(source);
                    break;

                case type === DependencyModel.Type.EndToStart:
                    startSide = me.getConnectorEndSide(source);
                    break;

                case type === DependencyModel.Type.EndToEnd:
                    startSide = me.getConnectorEndSide(source);
                    break;

                default:
                    throw new Error('Invalid dependency type: ' + type);
            }
        }

        return startSide;
    }

    getDependencyEndSide(dependency) {
        const
            me     = this,
            target = me.getTimeSpanRecordFromDependency(dependency, false),
            type   = dependency.type;

        let endSide = dependency.toSide;

        // Fallback to view trait if dependency end side is not given /*or can be obtained from type*/
        if (!endSide) {
            switch (true) {
                case type === DependencyModel.Type.StartToEnd:
                    endSide = me.getConnectorEndSide(target);
                    break;

                case type === DependencyModel.Type.StartToStart:
                    endSide = me.getConnectorStartSide(target);
                    break;

                case type === DependencyModel.Type.EndToStart:
                    endSide = me.getConnectorStartSide(target);
                    break;

                case type === DependencyModel.Type.EndToEnd:
                    endSide = me.getConnectorEndSide(target);
                    break;

                default:
                    throw new Error('Invalid dependency type: ' + type);
            }
        }

        return endSide;
    }

    prepareLineDef(dependency, dependencyDrawData, assignmentData = null) {
        const
            me                               = this,
            startSide                        = me.getDependencyStartSide(dependency),
            endSide                          = me.getDependencyEndSide(dependency),
            { startRectangle, endRectangle } = dependencyDrawData,
            intraRowDependency               = startRectangle.rowTop != null && startRectangle.rowTop !== endRectangle.rowTop,
            otherBoxes                       = [];

        // Only add otherBoxes if there is a rowTop and those are not equal - which means assignments are is different
        // resources
        if (intraRowDependency) {
            otherBoxes.push(...me.generateBoundaryBoxes(startRectangle, startSide));
        }

        let { startArrowMargin, verticalMargin } = me.pathFinder;

        // Do not change start arrow margin in case dependency is bidirectional
        if (!dependency.bidirectional) {
            if (/(top|bottom)/.test(startSide)) {
                startArrowMargin = me.client.barMargin / 2;
            }

            verticalMargin = me.client.barMargin / 2;
        }

        return {
            startBox : {
                start  : startRectangle.x,
                end    : startRectangle.right,
                top    : startRectangle.y,
                bottom : startRectangle.bottom
            },

            endBox : {
                start  : endRectangle.x,
                end    : endRectangle.right,
                top    : endRectangle.y,
                bottom : endRectangle.bottom
            },
            otherBoxes,
            startArrowMargin,
            verticalMargin,
            otherVerticalMargin   : 0,
            otherHorizontalMargin : 0,
            startSide             : startSide,
            endSide               : endSide
        };
    }

    // Draws a single SVG line that represents the dependency
    drawLine(canvas, dependency, points, assignmentData = null, cache = true) {
        const
            scheduler = this.client,
            metaId    = this.getMetaId(assignmentData);

        // Reuse existing element if possible
        let line = dependency.instanceMeta(metaId).lineElement;

        if (!line || !cache) {
            line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');

            if (cache) {
                dependency.instanceMeta(metaId).lineElement = line;
            }

            line.setAttribute('depId', dependency.id);
            if (assignmentData) {
                line.setAttribute('fromId', assignmentData.from.id);
                line.setAttribute('toId', assignmentData.to.id);
            }
            canvas.appendChild(line);
        }

        // TODO: Use DomHelper.syncClassList

        // className is SVGAnimatedString for svg elements, reading attribute instead
        line.classList.length && line.classList.remove.apply(line.classList, line.getAttribute('class').split(' '));

        line.classList.add(this.baseCls);

        if (dependency.cls) {
            line.classList.add(dependency.cls);
        }
        if (dependency.bidirectional) {
            line.classList.add('b-sch-bidirectional-line');
        }
        if (dependency.highlighted) {
            line.classList.add(...dependency.highlighted.split(' '));
        }
        if (BrowserHelper.isIE11) {
            const
                ddr       = dependency.getDateRange(true),
                viewStart = scheduler.startDate;

            if (ddr.start < viewStart) {
                line.classList.add('b-no-start-marker');
            }
            if (ddr.end < viewStart) {
                line.classList.add('b-no-end-marker');
            }
        }

        line.setAttribute('points', !points ? '' : points.map((p, i) => i !== points.length - 1 ? `${p.x1},${p.y1}` : `${p.x1},${p.y1} ${p.x2},${p.y2}`).join(' '));

        DomDataStore.set(line, {
            dependency
        });

        return line;
    }

    //endregion

    /**
     * Re-caches and redraws a dependency, for all assignments.
     * @param {Scheduler.model.DependencyModel} dependency Dependency to refresh
     */
    refreshDependency(dependency) {
        const
            me          = this,
            assignments = me.getIteratableDependencyAssignments(dependency);

        // Release dependency element, for all assignments if using AssignmentStore
        me.releaseDependency(dependency, assignments[0] !== null);
        // Remove it from grid & bounds cache
        me.removeFromCache(dependency);
        // Re-add it to grid cache
        me.addToGridCache(dependency);
        // Draw all assignments
        assignments.forEach(assignmentData =>
            me.drawDependency(dependency, null, assignmentData)
        );
    }

    /**
     * Re-caches and redraws a dependency for given assignment.
     * @param {Scheduler.model.DependencyModel} dependency Dependency to refresh
     * @param {Object} assignmentData
     * @param {Scheduler.model.AssignmentModel} assignmentData.from Source assignment
     * @param {Scheduler.model.AssignmentModel} assignmentData.to Target assignment
     * @private
     */
    refreshDependencyAssignment(dependency, assignmentData) {
        const me = this;

        // In case it was assigned to something not in view/timeline, release the line
        me.releaseDependency(dependency, assignmentData);
        // Update cache to only contain whats left of it
        me.removeFromCache(dependency, assignmentData);
        me.addToGridCache(dependency);
        // Draw lines
        me.drawDependency(dependency, null, assignmentData);
    }

    /**
     * Stores all dependencies/assignments that were requested to refresh and schedules repaint on next animation frame
     * @param {Scheduler.model.DependencyModel} dependency Dependency model to refresh
     * @param {Object} [assignmentData] Assignment data
     * @param {Scheduler.model.AssignmentModel} [assignmentData.from] Source assignment
     * @param {Scheduler.model.AssignmentModel} [assignmentData.to] Target assignment
     * @private
     */
    scheduleRefreshDependency(dependency, assignmentData = null) {
        const
            me  = this,
            map = me.dependenciesToRefresh;

        // Ignore undrawn dependencies, they cannot be refreshed
        if (!me.drawnDependencies.find(d => d.dependency === dependency)) {
            // Nevertheless update the cache, we might land here from method which updates dependency for modified event
            me.removeFromCache(dependency);
            me.addToGridCache(dependency);
            return;
        }

        // If this method was called once without assignment data - all lines related should be repainted
        if (!assignmentData) {
            map.set(dependency, true);
        }
        else if (map.has(dependency)) {
            if (map.get(dependency) !== true) {
                map.get(dependency).add(assignmentData);
            }
        }
        else {
            map.set(dependency, new Set([assignmentData]));
        }

        if (map.size === 1) {
            me.requestAnimationFrame(() => me.refreshDependencyOnFrame());
        }
    }

    /**
     * Implement on subclass when a certain sort order is needed
     * @returns {Map} Dependencies
     * @private
     */
    getSortedDependenciesToRefresh() {
        return this.dependenciesToRefresh;
    }

    /**
     * Repaints scheduled dependencies/assignments
     * @private
     */
    refreshDependencyOnFrame() {
        const
            me  = this,
            map = me.getSortedDependenciesToRefresh();

        if (me.client.isPainted) {
            // First clear cache and release dependencies. This will modify DOM
            map.forEach((assignments, dependency) => {
                if (assignments === true) {
                    const assignments = me.getIteratableDependencyAssignments(dependency);
                    // Release dependency element, for all assignments if using AssignmentStore
                    me.releaseDependency(dependency, assignments[0] !== null);
                    // Remove it from grid & bounds cache
                    me.removeFromCache(dependency);
                }
                else {
                    assignments.forEach(assignment => {
                        // In case it was assigned to something not in view/timeline, release the line
                        me.releaseDependency(dependency, assignment);
                        // Update cache to only contain whats left of it
                        me.removeFromCache(dependency, assignment);
                    });
                }
            });

            // Then fill cache before drawing dependencies. This will read the DOM forcing reflow
            map.forEach((assignments, dependency) => {
                // Re-add it to grid cache
                me.addToGridCache(dependency);
            });

            // Finally append elements to the DOM
            map.forEach((assignments, dependency) => {
                if (assignments === true) {
                    assignments = me.getIteratableDependencyAssignments(dependency);
                }

                assignments.forEach(assignmentData => {
                    me.drawDependency(dependency, null, assignmentData);
                });
            });

            // Cannot clear `map`, since it is a sorted copy of the actual map.
            me.dependenciesToRefresh.clear();

            me.client.trigger('dependenciesDrawn', { partial : true });
        }
    }

    /**
     * Draws a single dependency (for a single assignment if using multiple), if in view.
     * @param {Scheduler.model.DependencyModel} dependency Dependency to draw
     */
    drawDependency(dependency, drawData = null, assignmentData = null, canvas = this.client.svgCanvas, cache = true) {
        const
            me                 = this,
            {
                drawnDependencies,
                oldDrawnDependencies
            }                  = me,
            // Determines if a dependency should be draw, and if so returns the coordinates of its events
            dependencyDrawData = drawData || me.getDependencyBounds(dependency, assignmentData);

        if (!me.disabled && dependencyDrawData) {
            // Build line defs
            const
                lineDef = me.prepareLineDef(dependency, dependencyDrawData),
                lines   = me.pathFinder.findPath(lineDef, me.lineDefAdjusters);

            me.drawLine(canvas, dependency, lines, assignmentData, cache);

            // Do not push dependency to drawn deps if this is a temporary render
            // Cannot use ArrayHelper#include since object wont be the same, only its contents
            if (cache && !this.includesDependency(drawnDependencies, dependency, assignmentData)) {
                drawnDependencies.push({ dependency, assignmentData });
            }
        }

        // Remove from oldDrawnDeps, to not have element removed. Cannot use ArrayHelper#remove as stated above
        const oldIndex = this.findDependencyIndex(oldDrawnDependencies, dependency, assignmentData);
        if (oldIndex >= 0) {
            oldDrawnDependencies.splice(oldIndex, 1);
        }
    }

    /**
     * Draws multiple dependencies, called from drawForEvent() or drawFromTask().
     * @private
     */
    drawForTimeSpan(timeSpanRecord, async = false) {
        const me = this;
        // If the client is doing an animated update, we must update at end.
        // That will be asynchronous relative to now, so do not pass on the async flag.
        if (me.client.isAnimating) {
            me.client.on({
                transitionend() {
                    // Because of asyncness record might be removed during the transition
                    !timeSpanRecord.isRemoved && me.drawForTimeSpan(timeSpanRecord, true);
                },
                once : true
            });
        }
        // Otherwise, schedule the draw for the next frame.
        else {
            me.dependencyStore.getTimeSpanDependencies(timeSpanRecord).forEach(dependency => {
                if (async) {
                    me.scheduleRefreshDependency(dependency);
                }
                else {
                    me.refreshDependency(dependency);
                }
            });
        }
    }

    /**
     * Draws all dependencies for the specified event.
     */
    drawForEvent(eventRecord) {
        this.drawForTimeSpan(eventRecord);
    }

    // Redraw all dependencies for a particular eventRecord, using its current element instead of calculating a box
    // Used to do live redraw while resizing or dragging events
    updateDependenciesForTimeSpan(timeSpanRecord, element, newResource = null) {
        const
            me               = this,
            eventRecord      = timeSpanRecord.isAssignment ? timeSpanRecord.event : timeSpanRecord,
            deps             = me.dependencyStore.getTimeSpanDependencies(eventRecord),
            metaId           = me.getMetaId(),
            scheduler        = me.client,
            originalTaskRect = Rectangle.from(element, scheduler.timeAxisSubGridElement),
            row              = newResource && scheduler.getRowFor(newResource);

        let bounds;

        deps.forEach(dep => {
            const assignments = this.getIteratableDependencyAssignments(dep);

            assignments.forEach(assignmentData => {
                const taskRect = originalTaskRect.clone();
                let startRectangle, endRectangle;

                if (row) {
                    taskRect.rowTop = row.top;
                    taskRect.rowBottom = row.bottom;
                }

                // If dragging one multi assigned event the others wont move until it is dropped. Prevent their dep
                // lines from updating by bailing out
                if (assignmentData && assignmentData.from !== timeSpanRecord && assignmentData.to !== timeSpanRecord) {
                    return;
                }

                // Bail out if dependency is not visible (other end might be collapsed)
                if (!me.isDependencyVisible(dep, assignmentData)) {
                    return;
                }

                if (me.getTimeSpanRecordFromDependency(dep, true) === eventRecord) {
                    startRectangle = taskRect;

                    // try to look into dependency cache first
                    if ((bounds = dep.instanceMeta(metaId).bounds)) {
                        endRectangle = bounds.endRectangle;
                    }
                    else {
                        endRectangle = me.getBox(dep, false, assignmentData);
                    }
                }
                else {
                    // try to look into dependency cache first
                    if ((bounds = dep.instanceMeta(metaId).bounds)) {
                        startRectangle = bounds.startRectangle;
                    }
                    else {
                        startRectangle = me.getBox(dep, true, assignmentData);
                    }

                    endRectangle = taskRect;
                }

                if (startRectangle && endRectangle) {
                    me.drawDependency(dep, { startRectangle, endRectangle }, assignmentData);
                }
            });
        });
    }

    scheduleDraw(relayout = false) {
        const me = this;

        if (me.disabled) {
            return;
        }

        // There may be number of concurrent calls to this method, we need to reset cache if at least
        // once it was called with relayout = true
        if (relayout) {
            me.resetBoundsCache();
        }

        // If the scheduler/gantt is doing an animated update, schedule the draw
        // for when that's done so that we get correct element boxes.
        if (me.client.isAnimating) {
            if (!me.clientTransitionRemover) {
                me.clientTransitionRemover = me.client.on({
                    transitionend() {
                        me.clientTransitionRemover();
                        me.clientTransitionRemover = null;
                        me.draw();
                    },
                    once : true
                });
            }
        }
        // Otherwise, schedule the draw for the next frame.
        else {
            me.doScheduleDraw();
        }
    }

    /**
     * Draws all dependencies that overlap the current viewport
     */
    draw(reLayout = false) {
        const
            me        = this,
            scheduler = me.client;

        // Early bailout if we get here before we have any deps or rows rendered
        if (!me.oldDrawnDependencies && !me.dependencyStore.count || !scheduler.isPainted) {
            return;
        }

        // if animation is in progress, schedule drawing and skip current one
        if (scheduler.isAnimating) {
            scheduler.on({
                transitionend() {
                    me.scheduleDraw(true);
                },
                once : true
            });

            return;
        }

        // viewBox is the bounds of the current viewport, used to determine which dependencies to draw
        const viewBox = scheduler.timeAxisSubGrid.viewRectangle;

        if (reLayout) {
            me.resetBoundsCache();
        }

        // If there is no visible area for dependencies to display, we should stop redrawing and keep info about current dependencies.
        // Next time when visible area appears all dependencies will be redrawn.
        if (!viewBox.width || !viewBox.height) {
            return;
        }

        me.oldDrawnDependencies = me.drawnDependencies;
        me.drawnDependencies = [];

        // expand viewBox with buffer size
        viewBox.inflate(me.bufferSize);

        const { startDate, visibleDateRange } = scheduler;

        // Do not draw if no rows or no ticks
        if (!me.disabled && !scheduler.suspendRendering &&
            scheduler.store.count && scheduler.rowManager.rowCount &&
            startDate && visibleDateRange.startDate && visibleDateRange.endDate
        ) {

            // dependencies might start rendering before the 1st propagation which ends up having an empty dependencies cache
            // and thus never rendered dependencies
            if (!scheduler.project.isInitialCommitPerformed) {
                // Restore drawn dependencies, otherwise the unused ones will not be released next time we draw
                me.drawnDependencies = me.oldDrawnDependencies;
                me.refreshAllWhenReady = true;
                return;
            }

            const
                consideredDependencies   = {},
                {
                    dependencyGridCache,
                    cacheGridSize
                }                        = me,
                cacheGridSizeTicksMS     = DateHelper.asMilliseconds(scheduler.timeAxis.unit) * cacheGridSize.ticks,
                visibleStartMS           = visibleDateRange.startDate.getTime() - startDate.getTime(),
                visibleEndMS             = visibleDateRange.endDate.getTime() - startDate.getTime(),
                viewLeft                 = Math.floor(visibleStartMS / cacheGridSizeTicksMS),
                viewRight                = Math.floor(visibleEndMS / cacheGridSizeTicksMS),
                topIndex                 = Math.floor(scheduler.rowManager.topRow.dataIndex / cacheGridSize.index),
                bottomIndex              = Math.floor(scheduler.rowManager.bottomRow.dataIndex / cacheGridSize.index),
                dependenciesToDraw       = [];

            let x, rowIndex, i;

            // Iterate over virtual dependency grid cells, pushing each dependency that intersects that cell
            for (x = viewLeft; x <= viewRight; x++) {
                for (rowIndex = topIndex; rowIndex <= bottomIndex; rowIndex++) {
                    const
                        cacheX = dependencyGridCache[x],
                        deps   = cacheX?.[rowIndex];

                    for (i = 0; deps && i < deps.length; i++) {
                        const
                            { dependency, assignmentData, metaId } = deps[i],
                            // Unique id for dependency combined with assignment
                            flagId                                 = dependency.id + '-' + metaId;

                        if (!consideredDependencies[flagId]) {
                            // Only draw those actually in view
                            const bounds = me.getDependencyBounds(dependency, assignmentData);
                            // TODO: get rid of this export-specific flag
                            if (bounds?.bounds.intersect(viewBox, true, true) || scheduler.ignoreViewBox) {
                                dependenciesToDraw.push([dependency, bounds, assignmentData]);
                            }

                            consideredDependencies[flagId] = true;
                        }
                    }
                }
            }

            // Append dependencies to the DOM only after all have been calculated
            dependenciesToDraw.forEach(([dependency, bounds, assignmentData]) => {
                me.drawDependency(dependency, bounds, assignmentData);
            });
        }

        // Stop forcing recalculation of bounds
        me._resetBoundsCache = false;

        // Release elements for any dependencies that wasn't drawn
        me.oldDrawnDependencies.forEach(data => me.releaseDependency(data.dependency, data.assignmentData));

        scheduler.trigger('dependenciesDrawn');

        me.isDrawn = true;
    }

    /**
     * Release a dependency that is determined to be no longer visible
     * @param {Scheduler.model.DependencyModel} dependency
     */
    releaseDependency(dependency, assignmentData = null) {
        // Remove for all assignments (related to this client, store might be shared)
        if (assignmentData === true) {
            const clientDataKeys = Object.keys(dependency.meta.map || {}).filter(key => key.startsWith(this.client.id));

            clientDataKeys.forEach(key => {
                const data = dependency.meta.map[key];
                if (data.lineElement) {
                    data.lineElement.remove();
                    data.lineElement = null;
                }
            });
        }
        // Remove specific
        else {
            const
                metaId      = this.getMetaId(assignmentData),
                lineElement = dependency.instanceMeta(metaId).lineElement;

            if (lineElement) {
                dependency.instanceMeta(metaId).lineElement = null;
                // Not reusing elements for other lines currently
                lineElement.remove();
            }
        }
    }

    render() {
        const
            me        = this,
            scheduler = me.client;

        if (me.showTooltip) {
            me.tooltip = me.createTooltip();
        }

        scheduler.timeAxis.on({
            endreconfigure : 'resetGridCache',
            thisObj        : me
        });

        scheduler.rowManager.on({
            refresh           : 'onRowsRefresh', // redraws dependencies after zoom
            changetotalheight : 'onChangeTotalHeight', // redrawn dependencies after group collapse
            thisObj           : me
        });

        // dependencies are drawn on scroll, both horizontal and vertical
        scheduler.on({
            horizontalscroll       : 'onHorizontalScroll',
            svgcanvascreated       : 'createMarkers',
            togglenode             : 'onToggleNode',
            scroll                 : 'onVerticalScroll',
            timelineviewportresize : 'onViewportResize',
            thisObj                : me
        });

        if (me.highlightDependenciesOnEventHover) {
            scheduler.on(scheduler.scheduledEventName + 'MouseEnter', (params) => me.highlightEventDependencies(params.eventRecord || params.taskRecord));
            scheduler.on(scheduler.scheduledEventName + 'MouseLeave', (params) => me.unhighlightEventDependencies(params.eventRecord || params.taskRecord));
        }
    }

    renderContents() {
        this.draw();
    }

    //endregion

    //region Connector sides

    /**
     * Gets displaying item start side
     *
     * @param {Scheduler.model.TimeSpan} timeSpanRecord
     * @return {String} 'left' / 'right' / 'top' / 'bottom'
     */
    getConnectorStartSide(timeSpanRecord) {
        return this.client.currentOrientation.getConnectorStartSide(timeSpanRecord);
    }

    /**
     * Gets displaying item end side
     *
     * @param {Scheduler.model.TimeSpan} timeSpanRecord
     * @return {String} 'left' / 'right' / 'top' / 'bottom'
     */
    getConnectorEndSide(timeSpanRecord) {
        return this.client.currentOrientation.getConnectorEndSide(timeSpanRecord);
    }

    //endregion

    //region Tooltip

    createTooltip() {
        const
            me        = this,
            scheduler = me.client;

        return Tooltip.new({
            align          : 'b-t',
            id             : `${scheduler.id}-dependency-tip`,
            //TODO: need some way better to specify this. maybe each feature should be queried?
            forSelector    : `.b-timelinebase:not(.b-eventeditor-editing):not(.b-resizing-event):not(.b-dragcreating):not(.b-dragging-event):not(.b-creating-dependency) .${me.baseCls}`,
            clippedBy      : [scheduler.timeAxisSubGridElement, scheduler.bodyContainer],
            forElement     : scheduler.timeAxisSubGridElement,
            showOnHover    : true,
            hoverDelay     : 0,
            hideDelay      : 0,
            anchorToTarget : false,
            textContent    : false, // Skip max-width setting
            trackMouse     : false,
            getHtml        : me.getHoverTipHtml.bind(me)
        }, me.tooltip || {});
    }

    /**
     * Generates html for the tooltip shown when hovering a dependency
     * @param {Object} tooltipConfig
     * @returns {String} Html to display in the tooltip
     * @private
     */
    getHoverTipHtml({ activeTarget }) {
        const
            me                     = this,
            dependency             = me.resolveDependencyRecord(activeTarget),
            { fromEvent, toEvent } = dependency;

        return TemplateHelper.tpl`
             <table class="b-sch-dependency-tooltip">
                <tr>
                    <td>${me.L('L{from}')}: </td>
                    <td>${StringHelper.encodeHtml(fromEvent.name)}</td>
                    <td>
                        <div class="b-sch-box b-${fromBoxSide[dependency.type]}"></div>
                    </td>
                </tr>
                <tr>
                    <td>${me.L('L{to}')}: </td>
                    <td>${StringHelper.encodeHtml(toEvent.name)}</td>
                    <td><div class="b-sch-box b-${toBoxSide[dependency.type]}"></div></td>
                </tr>
            </table>
        `;
    }

    //endregion
}

GridFeatureManager.registerFeature(Dependencies, false, ['Scheduler', 'ResourceHistogram']);
GridFeatureManager.registerFeature(Dependencies, true, 'SchedulerPro');

// region polyfills
// from https://github.com/eligrey/classList.js
if (document.createElementNS && !('classList' in document.createElementNS('http://www.w3.org/2000/svg', 'g'))) {
    (function(view) {
        if (!('Element' in view)) return;

        const
            classListProp         = 'classList',
            protoProp             = 'prototype',
            elemCtrProto          = view.Element[protoProp],
            objCtr                = Object,
            strTrim               = String[protoProp].trim || function() {
                return this.replace(/^\s+|\s+$/g, '');
            },
            arrIndexOf            = Array[protoProp].indexOf || function(item) {
                for (let i = 0, len = this.length; i < len; i++) {
                    if (i in this && this[i] === item) {
                        return i;
                    }
                }
                return -1;
            },
            // Vendors: please allow content code to instantiate DOMExceptions
            DOMEx                 = function(type, message) {
                this.name = type;
                this.code = DOMException[type]; // eslint-disable-line no-undef
                this.message = message;
            },
            checkTokenAndGetIndex = function(classList, token) {
                if (token === '') {
                    throw new DOMEx('SYNTAX_ERR', 'The token must not be empty.');
                }
                if (/\s/.test(token)) {
                    throw new DOMEx('INVALID_CHARACTER_ERR', 'The token must not contain space characters.');
                }
                return arrIndexOf.call(classList, token);
            },
            ClassList             = function(elem) {
                const
                    trimmedClasses = strTrim.call(elem.getAttribute('class') || ''),
                    classes        = trimmedClasses ? trimmedClasses.split(/\s+/) : [];

                for (let i = 0, len = classes.length; i < len; i++) {
                    this.push(classes[i]);
                }
                this._updateClassName = function() {
                    elem.setAttribute('class', this.toString());
                };
            },
            classListProto        = ClassList[protoProp] = [],
            classListGetter       = function() {
                return new ClassList(this);
            };

        // Most DOMException implementations don't allow calling DOMException's toString()
        // on non-DOMExceptions. Error's toString() is sufficient here.
        DOMEx[protoProp] = Error[protoProp];
        classListProto.item = function(i) {
            return this[i] || null;
        };
        classListProto.contains = function(token) {
            return ~checkTokenAndGetIndex(this, token + '');
        };
        classListProto.add = function() {
            let tokens  = arguments,
                i       = 0,
                l       = tokens.length,
                token,
                updated = false;

            do {
                token = tokens[i] + '';
                if (!~checkTokenAndGetIndex(this, token)) {
                    this.push(token);
                    updated = true;
                }
            }
            while (++i < l);

            if (updated) {
                this._updateClassName();
            }
        };
        classListProto.remove = function() {
            let tokens  = arguments,
                i       = 0,
                l       = tokens.length,
                token,
                updated = false,
                index;

            do {
                token = tokens[i] + '';
                index = checkTokenAndGetIndex(this, token);
                while (~index) {
                    this.splice(index, 1);
                    updated = true;
                    index = checkTokenAndGetIndex(this, token);
                }
            }
            while (++i < l);

            if (updated) {
                this._updateClassName();
            }
        };
        classListProto.toggle = function(token, force) {
            const
                result = this.contains(token),
                method = result ? force !== true && 'remove' : force !== false && 'add';

            if (method) {
                this[method](token);
            }

            if (force === true || force === false) {
                return force;
            }
            else {
                return !result;
            }
        };
        classListProto.replace = function(token, replacementToken) {
            const index = checkTokenAndGetIndex(token + '');
            if (~index) {
                this.splice(index, 1, replacementToken);
                this._updateClassName();
            }
        };
        classListProto.toString = function() {
            return this.join(' ');
        };

        if (objCtr.defineProperty) {
            const classListPropDesc = {
                get          : classListGetter,
                enumerable   : true,
                configurable : true
            };
            try {
                objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
            }
            catch (ex) { // IE 8 doesn't support enumerable:true
                // adding undefined to fight this issue https://github.com/eligrey/classList.js/issues/36
                // modern IE8-MSW7 machine has IE8 8.0.6001.18702 and is affected
                if (ex.number === undefined || ex.number === -0x7FF5EC54) {
                    classListPropDesc.enumerable = false;
                    objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
                }
            }
        }
        else if (objCtr[protoProp].__defineGetter__) {
            elemCtrProto.__defineGetter__(classListProp, classListGetter);
        }
    }(window));
}

// There is full or partial native classList support, so just check if we need
// to normalize the add/remove and toggle APIs.

(function() {
    let testElement = document.createElement('_');

    testElement.classList.add('c1', 'c2');

    // Polyfill for IE 10/11 and Firefox <26, where classList.add and
    // classList.remove exist but support only one argument at a time.
    if (!testElement.classList.contains('c2')) {
        const createMethod = function(method) {
            const original = DOMTokenList.prototype[method]; // eslint-disable-line no-undef

            DOMTokenList.prototype[method] = function(token) { // eslint-disable-line no-undef
                for (let i = 0, len = arguments.length; i < len; i++) {
                    token = arguments[i];
                    original.call(this, token);
                }
            };
        };
        createMethod('add');
        createMethod('remove');
    }

    testElement.classList.toggle('c3', false);

    // Polyfill for IE 10 and Firefox <24, where classList.toggle does not
    // support the second argument.
    if (testElement.classList.contains('c3')) {
        const _toggle = DOMTokenList.prototype.toggle; // eslint-disable-line no-undef

        DOMTokenList.prototype.toggle = function(token, force) { // eslint-disable-line no-undef
            if (1 in arguments && !this.contains(token) === !force) {
                return force;
            }
            else {
                return _toggle.call(this, token);
            }
        };
    }

    // replace() polyfill
    if (!('replace' in document.createElement('_').classList)) {
        DOMTokenList.prototype.replace = function(token, replacementToken) { // eslint-disable-line no-undef
            let tokens = this.toString().split(' '),
                index  = tokens.indexOf(token + '');

            if (~index) {
                tokens = tokens.slice(index);
                this.remove.apply(this, tokens);
                this.add(replacementToken);
                this.add.apply(this, tokens.slice(1));
            }
        };
    }

    testElement = null;
}());
// endregion
