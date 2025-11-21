/* eslint-disable no-unused-expressions */
import InstancePlugin from '../../../Core/mixin/InstancePlugin.js';
import DateHelper from '../../../Core/helper/DateHelper.js';
import DomHelper from '../../../Core/helper/DomHelper.js';
import DragHelper from '../../../Core/helper/DragHelper.js';
import Rectangle from '../../../Core/helper/util/Rectangle.js';
import ClockTemplate from '../../tooltip/ClockTemplate.js';
import Tooltip from '../../../Core/widget/Tooltip.js';
import EventHelper from '../../../Core/helper/EventHelper.js';
import Objects from '../../../Core/helper/util/Objects.js';
import Widget from '../../../Core/widget/Widget.js';
import VersionHelper from '../../../Core/helper/VersionHelper.js';

/**
 * @module Scheduler/feature/base/DragBase
 */

//TODO: shift to copy
//TODO: dragging of event that starts & ends outside of view

/**
 * Base class for EventDrag (Scheduler) and TaskDrag (Gantt) features. Contains shared code. Not to be used directly.
 *
 * @extends Core/mixin/InstancePlugin
 * @abstract
 */
export default class DragBase extends InstancePlugin {
    //region Config

    static get defaultConfig() {
        return {
            // documented on Schedulers EventDrag feature and Gantt's TaskDrag
            tooltipTemplate : data => `
                <div class="b-sch-tip-${data.valid ? 'valid' : 'invalid'}">
                    ${data.startClockHtml}
                    ${data.endClockHtml}
                    <div class="b-sch-tip-message">${data.message}</div>
                </div>
            `,

            // documented on Schedulers EventDrag feature, not used for Gantt
            constrainDragToResource : true,

            /**
             * Specifies whether or not to show tooltip while dragging event
             * @config {Boolean}
             * @default
             */
            showTooltip : true,

            /**
             * When enabled, the event being dragged always "snaps" to the exact start date that it will have after drop.
             * @config {Boolean}
             * @default
             */
            showExactDropPosition : false,

            /**
             * Set to `false` to allow dragging tasks outside of the client Scheduler.
             * Useful when you want to drag tasks between multiple Scheduler instances
             * @config {Boolean}
             * @default
             */
            constrainDragToTimeline : true,

            /*
             * The store from which the dragged items are mapped to the UI.
             * In Scheduler's implementation of this base class, this will be
             * an EventStore, in Gantt's implementations, this will be a TaskStore.
             * Because both derive from this base, we must refer to it as this.store.
             * @private
             */
            store : null,

            /**
             * An object used to configure the internal {@link Core.helper.DragHelper} class
             * @config {Object}
             * @default
             */
            dragHelperConfig : null,

            tooltipCls : null
        };
    }

    // Plugin configuration. This plugin chains some of the functions in Grid.
    static get pluginConfig() {
        return {
            chain : ['onPaint']
        };
    }

    //endregion

    //region Init

    /**
     * Called when scheduler is rendered. Sets up drag and drop and hover tooltip.
     * @private
     */
    onPaint({ firstPaint }) {
        const
            me                                  = this,
            {
                client,
                constrainDragToTimeline,
                constrainDragToResource,
                constrainDragToTimeSlot,
                dragHelperConfig
            }                                   = me,
            { timeAxisViewModel, isHorizontal } = client,
            lockY                               = isHorizontal ? constrainDragToResource : constrainDragToTimeSlot,
            lockX                               = isHorizontal ? constrainDragToTimeSlot : constrainDragToResource,
            scrollables                         = [];

        me.drag?.destroy();

        if (!lockX) {
            scrollables.push({
                element   : client.timeAxisSubGrid.scrollable.element,
                direction : 'horizontal'
            });
        }

        if (!lockY) {
            scrollables.push({
                element   : client.scrollable.element,
                direction : 'vertical'
            });

        }

        me.drag = DragHelper.new({
            name                : me.constructor.name, // useful when debugging with multiple draggers
            mode                : 'translateXY',
            lockX,
            lockY,
            minX                : true, // Allows dropping with start before time axis
            maxX                : true, // Allows dropping with end after time axis
            constrain           : false,
            cloneTarget         : !constrainDragToTimeline,
            dragWithin          : constrainDragToTimeline ? null : document.body,
            hideOriginalElement : true,
            outerElement        : client.timeAxisSubGridElement,
            targetSelector      : client.eventSelector,
            scrollManager       : constrainDragToTimeline ? client.scrollManager : null,
            transitionDuration  : client.transitionDuration,
            snapCoordinates     : ({ element, newX, newY }) => {
                // Snapping not supported when dragging outside a scheduler

                if (constrainDragToTimeline && !me.constrainDragToTimeSlot && (me.showExactDropPosition || timeAxisViewModel.snap)) {
                    const
                        dd              = me.dragData,
                        snappedDate     = timeAxisViewModel.getDateFromPosition(me.getCoordinate(dd.draggedEntities[0], element, [newX, newY]), 'round'),
                        snappedPosition = snappedDate && timeAxisViewModel.getPositionFromDate(snappedDate);

                    if (snappedDate && snappedDate >= client.startDate && snappedPosition != null) {
                        if (isHorizontal) {
                            newX = snappedPosition;
                        }
                        else {
                            newY = snappedPosition;
                        }
                    }
                }

                return { x : newX, y : newY };
            },
            listeners : {
                beforedragstart : 'onBeforeDragStart',
                dragstart       : 'onDragStart',
                drag            : 'onDrag',
                drop            : 'onDrop',
                abort           : 'onDragAbort',
                reset           : 'onDragReset',
                thisObj         : me
            },
            monitoringConfig : {
                scrollables
            }
        }, dragHelperConfig, {
            isElementDraggable : (el, event) => {
                return (!dragHelperConfig || !dragHelperConfig.isElementDraggable || dragHelperConfig.isElementDraggable(el, event)) &&
                    me.isElementDraggable(el, event);
            }
        });

        if (firstPaint) {
            client.rowManager.on({
                changeTotalHeight : 'updateYConstraint',
                thisObj           : me
            });

            if (me.dragTipTemplate) {
                VersionHelper.deprecate('Scheduler', '5.0.0', 'Deprecated in favor of `tooltipTemplate`, will be removed in 5.0');
            }
        }

        if (me.showTooltip) {
            me.clockTemplate = new ClockTemplate({
                scheduler : client
            });
        }
    }

    doDestroy() {
        this.drag?.destroy();
        this.clockTemplate?.destroy();
        this.tip?.destroy();
        super.doDestroy();
    }

    //endregion

    //region Drag events

    onBeforeDragStart({ context, event }) {
        const
            me          = this,
            { client }  = me,
            name        = client.scheduledEventName,
            dragData    = me.getMinimalDragData(context, event),
            eventRecord = dragData?.[`${name}Record`];

        if (me.disabled || !eventRecord || eventRecord.isDraggable === false) {
            return false;
        }

        // Cache the date corresponding to the drag start point so that on drag, we can always
        // perform the same calculation to then find the time delta without having to calculate
        // the new start end end times from the position that the element is.
        context.pointerStartDate = client.getDateFromXY([context.startClientX, context.startPageY], null, false);

        const result = client.trigger(
            `before${name}Drag`,
            {
                ...dragData,
                event,
                // to be deprecated
                context : {
                    ...context,
                    ...dragData
                }
            }
        ) !== false;

        if (result) {
            me.updateYConstraint(eventRecord);
        }

        return result;
    }

    // Constrain to time slot means lockX if we're horizontal, otherwise lockY
    set constrainDragToTimeSlot(value) {
        const axis = this.client.isHorizontal ? 'lockX' : 'lockY';

        this._constrainDragToTimeSlot = value;

        if (this.drag) {
            this.drag[axis] = value;
        }
    }

    get constrainDragToTimeSlot() {
        return this._constrainDragToTimeSlot;
    }

    // Constrain to resource means lockY if we're horizontal, otherwise lockX
    set constrainDragToResource(value) {
        const axis = this.client.isHorizontal ? 'lockY' : 'lockX';

        this._constrainDragToResource = value;

        if (this.drag) {
            this.drag[axis] = value;
        }
    }

    get constrainDragToResource() {
        return this._constrainDragToResource;
    }

    /**
     * Triggered when dragging of an event starts. Initializes drag data associated with the event being dragged.
     * @private
     */
    onDragStart({ context }) {
        const
            me         = this,
            { client } = me;

        me.currentOverClient = client;

        me.onMouseOverNewTimeline(client, true);

        const dragData = me.dragData = me.getDragData(context);

        // Do not let DomSync reuse the element
        context.element.retainElement = true;

        if (me.showTooltip) {
            const tipTarget = dragData.context.dragProxy ? dragData.context.dragProxy.firstChild : context.element;

            if (!me.tip) {
                me.tip = new Tooltip({
                    id                       : `${client.id}-event-drag-tip`,
                    align                    : 'b-t',
                    autoShow                 : true,
                    updateContentOnMouseMove : true,
                    clippedBy                : me.constrainDragToTimeline ? client.bodyContainer : null,
                    forElement               : tipTarget,
                    getHtml                  : me.getTipHtml.bind(me),
                    // During drag, it must be impossible for the mouse to be over the tip.
                    style                    : 'pointer-events:none',
                    cls                      : me.tooltipCls
                });

                me.tip.on('innerhtmlupdate', me.updateDateIndicator, me);
            }
            else {
                me.tip.showBy(tipTarget);
            }
        }

        // me.copyKeyPressed = me.isCopyKeyPressed();
        //
        // if (me.copyKeyPressed) {
        //     dragData.refElements.addCls('sch-event-copy');
        //     dragData.originalHidden = true;
        // }

        me.triggerDragStart(dragData);

        const
            {
                eventMenu,
                taskMenu,
                // TODO: 'eventContextMenu' is deprecated. Please see https://bryntum.com/docs/scheduler/#Scheduler/guides/upgrades/4.0.0.md for more information.
                eventContextMenu,
                taskContextMenu
            }           = client.features,
            menuFeature = eventMenu || taskMenu || eventContextMenu || taskContextMenu;

        // If this is a touch action, hide the context menu which may have shown
        menuFeature?.hideContextMenu(false);
    }

    updateDateIndicator() {
        const
            { startDate, endDate } = this.dragData,
            { tip }                = this,
            endDateElement         = tip.element.querySelector('.b-sch-tooltip-enddate');

        this.clockTemplate.updateDateIndicator(tip.element, startDate);

        endDateElement && this.clockTemplate.updateDateIndicator(endDateElement, endDate);
    }

    /**
     * Triggered while dragging an event. Updates drag data, validation etc.
     * @private
     */
    onDrag({ context, event }) {
        const
            me    = this,
            dd    = me.dragData,
            start = dd.startDate;

        let client;

        if (me.constrainDragToTimeline) {
            client = me.client;
        }
        else {
            let target = event.target;

            // Can't detect target under a touch event
            if (/^touch/.test(event.type)) {
                const center = Rectangle.from(dd.context.element, null, true).center;

                target = DomHelper.elementFromPoint(center.x, center.y);
            }

            client = Widget.fromElement(target, 'timelinebase');
            // Do not allow drops on histogram widgets
            client = client?.isResourceHistogram ? null : client;
        }

        const
            depFeature = me.client.features.dependencies;

        if (!client) {
            if (depFeature) {
                depFeature.updateDependenciesForTimeSpan(dd.draggedEntities[0], dd.context.element);
            }
            return;
        }

        if (client !== me.currentOverClient) {
            me.onMouseOverNewTimeline(client);
        }

        //this.checkShiftChange();
        me.updateDragContext(context, event);

        // Let product specific implementations trigger drag event (eventDrag, taskDrag)
        me.triggerEventDrag(dd, start);

        let valid = me.checkDragValidity(dd, event);

        if (valid && typeof valid !== 'boolean') {
            context.message = valid.message || '';
            valid = valid.valid;
        }

        context.valid = valid !== false;

        if (me.showTooltip) {
            me.tip.realign();
        }

        if (depFeature) {
            depFeature.updateDependenciesForTimeSpan(dd.draggedEntities[0], dd.context.element.querySelector(client.eventInnerSelector), dd.newResource);
        }
    }

    onMouseOverNewTimeline(newTimeline, initial) {
        const
            me                          = this,
            { drag : { lockX, lockY } } = me,
            scrollables                 = [];

        me.currentOverClient.element.classList.remove('b-dragging-' + me.currentOverClient.scheduledEventName);

        newTimeline.element.classList.add('b-dragging-' + newTimeline.scheduledEventName);

        if (!initial) {
            me.currentOverClient.scrollManager.stopMonitoring();
        }

        if (!lockX) {
            scrollables.push({
                element   : newTimeline.timeAxisSubGrid.scrollable.element,
                direction : 'horizontal'
            });
        }

        if (!lockY) {
            scrollables.push({
                element   : newTimeline.scrollable.element,
                direction : 'vertical'
            });
        }

        newTimeline.scrollManager.startMonitoring({
            scrollables
        });

        me.currentOverClient = newTimeline;
    }

    /**
     * Triggered when dropping an event. Finalizes the operation.
     * @private
     */
    onDrop({ context, event }) {
        const
            me                              = this,
            { currentOverClient, dragData } = me;

        let modified = false;

        me.updateDragContext(context, event);

        me.tip?.hide();

        if (context.valid && dragData.startDate && dragData.endDate) {
            dragData.finalize = async(...params) => {
                await me.finalize(...params);
                context.finalize(...params);
            };

            // Allow implementer to take control of the flow, by returning false from this listener,
            // to show a confirmation popup etc. This event is documented in EventDrag and TaskDrag
            currentOverClient.trigger(`before${currentOverClient.capitalizedEventName}DropFinalize`, {
                context : dragData,
                event
            });

            context.async = dragData.async;

            // Internal validation, making sure all dragged records fit inside the view
            if (!context.async && me.isValidDrop(dragData)) {
                modified = (dragData.startDate - dragData.origStart) !== 0 || dragData.newResource !== dragData.resourceRecord;
            }
        }

        if (!context.async) {
            me.finalize(dragData.valid && context.valid && modified);
        }
    }

    onDragAbort({ context }) {
        const me = this;

        me.client.currentOrientation.onDragAbort({ context, dragData : me.dragData });

        // otherwise the event disappears on next refresh (#62)
        me.resumeElementRedrawing(me.dragData.record);

        me.tip?.hide();

        // Trigger eventDragAbort / taskDragAbort depending on product
        me.triggerDragAbort(me.dragData);
    }

    // For the drag across multiple schedulers, tell all involved scroll managers to stop monitoring
    onDragReset({ source : dragHelper }) {
        const
            me = this,
            currentTimeline = me.currentOverClient;

        currentTimeline?.scrollManager.stopMonitoring();

        if (dragHelper.context && dragHelper.context.started) {
            const { eventBarEls } = me.dragData;

            eventBarEls[0].classList.remove('b-drag-main');
            eventBarEls.forEach(el => el.classList.remove('b-dragging'));
        }

        currentTimeline?.element.classList.remove('b-dragging-' + me.currentOverClient.scheduledEventName);

        // Dependencies are updated dynamically during drag, so ensure they are redrawn
        // if the event snaps back with no change after abort or an invalid drop.
        if (me.dragData?.context.valid === false && currentTimeline?.features.dependencies) {
            currentTimeline?.features.dependencies.scheduleDraw(true);
        }

        me.dragData = null;
    }

    /**
     * Triggered internally on invalid drop.
     * @private
     */
    onInternalInvalidDrop() {
        this.tip?.hide();

        this.triggerAfterDrop(this.dragData, false);

        this.drag.abort();
    }

    //endregion

    //region Finalization & validation

    /**
     * Called on drop to update the record of the event being dropped.
     * @private
     * @param {Boolean} updateRecords Specify true to update the record, false to treat as invalid
     */
    async finalize(updateRecords) {
        const
            me                           = this,
            { dragData }                 = me,
            { context, draggedEntities } = dragData;

        let result;

        draggedEntities.forEach((record, i) => {
            me.resumeElementRedrawing(record);

            dragData.eventBarEls[i].classList.remove(me.drag.draggingCls);
            dragData.eventBarEls[i].retainElement = false;
        });

        if (updateRecords) {
            // updateRecords may or may not be async.
            // We see if it returns a Promise.
            result = me.updateRecords(dragData);

            // If updateRecords is async, the calling DragHelper must know this and
            // go into a awaitingFinalization state.
            if (Objects.isPromise(result)) {
                context.async = true;
                await result;
            }

            // If the finalize handler decided to change the dragData's validity...
            if (!dragData.valid) {
                me.onInternalInvalidDrop();
            }
            else {
                me.drag.reset();

                me.triggerAfterDrop(dragData, true);
            }
        }
        else {
            me.onInternalInvalidDrop();
        }

        return result;
    }

    //endregion

    //region Drag data

    /**
     * Updates drag data's dates and validity (calls #validatorFn if specified)
     * @private
     */
    updateDragContext(info, event) {
        const
            me                  = this,
            { drag }            = me,
            dd                  = me.dragData,
            client              = me.currentOverClient,
            { isHorizontal }    = client,
            { stickyEvents }    = client.features,
            record              = dd.draggedEntities[0],
            eventRecord         = record.isAssignment ? record.event : record,
            constrainToTimeSlot = me.constrainDragToTimeSlot || (isHorizontal ? drag.lockX : drag.lockY);

        dd.browserEvent = event;

        if (constrainToTimeSlot) {
            dd.timeDiff = 0;
        }
        else {
            if (client.timeAxis.isContinuous) {
                const
                    { dateConstraints } = dd,
                    { timeAxisSubGrid } = client,
                    { scrollable }      = timeAxisSubGrid,
                    timeAxisRegion      = scrollable.viewport,
                    timeAxisPosition    = client.isHorizontal ? info.pageX - timeAxisRegion.x + scrollable.x : info.pageY - timeAxisRegion.y + scrollable.y,

                    // Use the localized coordinates to ask the TimeAxisViewModel what date the mouse is at.
                    // Pass allowOutOfRange as true in case we have dragged out of either side of the timeline viewport.
                    pointerDate         = client.timeAxisViewModel.getDateFromPosition(timeAxisPosition, null, true),
                    timeDiff            = dd.timeDiff = pointerDate - info.pointerStartDate;

                // calculate and round new startDate based on actual dd.timeDiff
                dd.startDate = me.adjustStartDate(dd.origStart, timeDiff);

                if (dateConstraints) {
                    dd.startDate = DateHelper.constrain(dd.startDate, dateConstraints.start, new Date(dateConstraints.end - eventRecord.durationMS));
                }
                dd.endDate = new Date(dd.startDate - 0 + dd.duration);
            }
            else {
                const range = me.resolveStartEndDates(info.element);

                // if dragging is out of timeAxis rect bounds, we will not be able to get dates
                dd.valid = Boolean(range.startDate && range.endDate);

                if (dd.valid) {
                    dd.startDate = range.startDate;
                    dd.endDate = range.endDate;
                }
            }
            if (dd.valid) {
                dd.timeDiff = dd.startDate - dd.origStart;
            }
        }

        // getProductDragContext may switch valid flag, need to keep it here
        Object.assign(dd, me.getProductDragContext(dd));

        if (dd.valid) {
            // If it's fully outside, we don't allow them to drop it - the event would disappear from their control.
            if ((dd.endDate <= client.timeAxis.startDate || dd.startDate >= client.timeAxis.endDate)) {
                dd.context.valid = false;
                dd.context.message = me.L('L{EventDrag.noDropOutsideTimeline}');
            }
            else {
                const result = !event || me.checkDragValidity(dd, event);

                if (!result || typeof result === 'boolean') {
                    dd.context.valid = result !== false;
                    dd.context.message = '';
                }
                else {
                    dd.context.valid = result.valid !== false;
                    dd.context.message = result.message;
                }
            }
        }
        else {
            dd.context.valid = false;
        }

        // Give the sticky event content feature a chance to sync content position.
        if (dd.context.valid && stickyEvents) {
            dd.eventBarEls.forEach((eventBar, i) => stickyEvents.onEventDrag(eventBar));
        }
    }

    suspendElementRedrawing(record, suspend = true) {
        const element = this.getRecordElement(record);

        if (element) {
            element.retainElement = suspend;
        }

        record.instanceMeta(this.client).retainElement = suspend;
    }

    resumeElementRedrawing(record) {
        this.suspendElementRedrawing(record, false);
    }

    /**
     * Initializes drag data (dates, constraints, dragged events etc). Called when drag starts.
     * @private
     * @param info
     * @returns {*}
     */
    getDragData(info) {
        const
            me                = this,
            { client, drag }  = me,
            {
                record,
                dateConstraints,
                eventBarEls,
                draggedEntities
            }                 = me.setupProductDragData(info),
            { startEvent }    = drag,
            timespan          = record.isAssignment ? record.event : record,
            origStart         = timespan.startDate,
            origEnd           = timespan.endDate,
            timeAxis          = client.timeAxis,
            startsOutsideView = origStart < timeAxis.startDate,
            endsOutsideView   = origEnd > timeAxis.endDate,
            coordinate        = me.getCoordinate(timespan, info.element, [info.elementStartX, info.elementStartY]),
            clientCoordinate  = me.getCoordinate(timespan, info.element, [info.startClientX, info.startClientY]);

        // prevent elements from being released when out of view
        draggedEntities.forEach(record => me.suspendElementRedrawing(record));

        // Make sure the dragged event is selected (no-op for already selected)
        // Preserve other selected events if ctrl/meta is pressed
        if (record.isAssignment) {
            client.selectAssignment(record, startEvent.ctrlKey);
        }
        else {
            client.selectEvent(record, startEvent.ctrlKey);
        }

        const dragData = {
            context : info,

            dateConstraints,

            eventBarEls,

            record,
            draggedEntities,

            sourceDate       : startsOutsideView ? origStart : client.getDateFromCoordinate(coordinate),
            screenSourceDate : client.getDateFromCoordinate(clientCoordinate, null, false),

            startDate : origStart,
            endDate   : origEnd,
            timeDiff  : 0,

            origStart,
            origEnd,
            startsOutsideView,
            endsOutsideView,

            duration     : origEnd - origStart,
            browserEvent : startEvent // So we can know if SHIFT/CTRL was pressed
        };

        eventBarEls.forEach(el => {
            el.classList.add(drag.draggingCls);
            el.classList.remove('b-sch-event-hover');
            el.classList.remove('b-active');
        });

        if (eventBarEls.length > 1) {
            // RelatedElements are secondary elements moved by the same delta as the grabbed element
            if (!me.constrainDragToTimeline) {
                // Will be dragging a clone, need to do the same for all selected elements
                // TODO: This should be handled by DragHelper! It is basically a copy of code there for the main element
                info.relatedElements = eventBarEls.slice(1).map(eventBar => {
                    // TODO: Should be able to simplify this to only use DomSync.addChild
                    const
                        offsetX      = DomHelper.getOffsetX(eventBar, drag.dragWithin),
                        offsetY      = DomHelper.getOffsetY(eventBar, drag.dragWithin),
                        offsetWidth  = eventBar.offsetWidth,
                        offsetHeight = eventBar.offsetHeight,
                        element      = drag.createProxy(eventBar);

                    // Match the grabbed element's size and position.
                    DomHelper.setTranslateXY(element, offsetX, offsetY);
                    element.style.width = `${offsetWidth}px`;
                    element.style.height = `${offsetHeight}px`;

                    //element.classList.add(drag.dragProxyCls);
                    drag.dragWithin.appendChild(element);

                    eventBar.classList.add('b-drag-original');

                    if (drag.hideOriginalElement) {
                        eventBar.classList.add('b-hidden');
                    }

                    return element;
                });
            }
            else {
                info.relatedElements = eventBarEls.slice(1);
            }
            info.relatedElStartPos = [];
            info.relatedElDragFromPos = [];

            // Move the selected events into a unified cascade.
            if (me.unifiedDrag) {
                // EventBarEls should animate into the cascade
                me.client.isAnimating = true;

                eventBarEls.forEach(el => {
                    el.classList.add('b-drag-animation');
                });

                EventHelper.onTransitionEnd({
                    element  : eventBarEls[1],
                    property : 'transform',
                    handler() {
                        me.client.isAnimating = false;
                        eventBarEls.forEach(el => {
                            el.classList.remove('b-drag-animation');
                        });
                    },
                    thisObj : me.client,
                    once    : true
                });

                // Main dragged element should not look different. The relatedElements do.
                eventBarEls[0].classList.add('b-drag-main');

                let [x, y] = DomHelper.getTranslateXY(info.element);

                info.relatedElements.forEach((el, i) => {
                    // Cache the start pos for reversion in case of invalid drag
                    info.relatedElStartPos[i] = DomHelper.getTranslateXY(el);

                    // Move into cascade and cache the dragFrom pos
                    x += 10;
                    y += 10;
                    DomHelper.setTranslateXY(el, x, y);
                    info.relatedElDragFromPos[i] = [x, y];
                });
            }
            else {
                // Start pos and dragFrom pos are the same for non-unified
                info.relatedElements.forEach((el, i) => {
                    info.relatedElStartPos[i] = info.relatedElDragFromPos[i] = DomHelper.getTranslateXY(el);
                });
            }
        }

        return dragData;
    }

    //endregion

    //region Constraints

    // private
    setupConstraints(constrainRegion, elRegion, tickSize, constrained) {
        const
            me        = this,
            xTickSize = !me.showExactDropPosition && tickSize > 1 ? tickSize : 0,
            yTickSize = 0;

        // If `constrained` is false then we haven't specified getDateConstraint method and should constrain mouse position to scheduling area
        // else we have specified date constraints and so we should limit mouse position to smaller region inside of constrained region using offsets and width.
        if (constrained) {
            me.setXConstraint(constrainRegion.left, constrainRegion.right - elRegion.width, xTickSize);
        }
        // And if not constrained, release any constraints from the previous drag.
        else {
            // minX being true means allow the start to be before the time axis.
            // maxX being true means allow the end to be after the time axis.
            me.setXConstraint(true, true, xTickSize);
        }
        me.setYConstraint(constrainRegion.top, constrainRegion.bottom - elRegion.height, yTickSize);
    }

    updateYConstraint(eventRecord) {
        const
            me          = this,
            { client }  = me,
            { context } = me.drag,
            tickSize    = client.timeAxisViewModel.snapPixelAmount;

        // If we're dragging when the vertical size is recalculated by the host grid,
        // we must update our Y constraint unless we are locked in the Y axis.
        if (context && !me.drag.lockY) {
            let constrainRegion;

            // This calculates a relative region which the DragHelper uses within its outerElement
            if (me.constrainDragToTimeline) {
                constrainRegion = client.getScheduleRegion(null, eventRecord);
            }
            // Not constraining to timeline.
            // Unusual configuration, but this must mean no Y constraining.
            else {
                me.setYConstraint(null, null, tickSize);
                return;
            }

            me.setYConstraint(
                constrainRegion.top,
                constrainRegion.bottom - context.element.offsetHeight,
                tickSize
            );
        }
        else {
            me.setYConstraint(null, null, tickSize);
        }
    }

    setXConstraint(iLeft, iRight, iTickSize) {
        const { drag } = this;

        drag.leftConstraint = iLeft;
        drag.rightConstraint = iRight;

        drag.minX = iLeft;
        drag.maxX = iRight;
    }

    setYConstraint(iUp, iDown, iTickSize) {
        const { drag } = this;

        drag.topConstraint = iUp;
        drag.bottomConstraint = iDown;

        drag.minY = iUp;
        drag.maxY = iDown;
    }

    //endregion

    //region Other stuff

    adjustStartDate(startDate, timeDiff) {
        return this.client.timeAxis.roundDate(
            new Date(startDate - 0 + timeDiff),
            this.client.snapRelativeToEventStartDate ? startDate : false
        );
    }

    resolveStartEndDates(draggedElement) {
        const
            timeline     = this.currentOverClient,
            { timeAxis } = timeline,
            proxyRect    = Rectangle.from(draggedElement, timeline.timeAxisSubGridElement),
            dd           = this.dragData;

        // Non continuous time axis will return null instead of date for a rectangle outside of the view unless
        // told to estimate date
        let { start : startDate, end : endDate } = timeline.getStartEndDatesFromRectangle(proxyRect, 'round', dd.duration, !timeAxis.isContinuous);

        // if dragging is out of timeAxis rect bounds, we will not be able to get dates
        if (startDate && endDate) {
            startDate = this.adjustStartDate(startDate, 0);

            if (!dd.startsOutsideView) {
                // Make sure we didn't target a start date that is filtered out, if we target last hour cell (e.g. 21:00) of
                // the time axis, and the next tick is 08:00 following day. Trying to drop at end of 21:00 cell should target start of next cell
                if (!timeline.timeAxis.dateInAxis(startDate, false)) {
                    const tick = timeline.timeAxis.getTickFromDate(startDate);

                    if (tick >= 0) {
                        startDate = timeline.timeAxis.getDateFromTick(tick);
                    }
                }

                endDate = startDate && DateHelper.add(startDate, dd.duration, 'ms');
            }
            else if (!dd.endsOutsideView) {
                startDate = endDate && DateHelper.add(endDate, -dd.duration, 'ms');
            }
        }

        return {
            startDate,
            endDate
        };
    }

    //endregion

    //region Dragtip

    /**
     * Gets html to display in tooltip while dragging event. Uses clockTemplate to display start & end dates.
     */
    getTipHtml() {
        const
            me                                     = this,
            { dragData, client }                   = me,
            { startDate, endDate, draggedEntities } = dragData,
            startText                              = client.getFormattedDate(startDate),
            endText                                = client.getFormattedEndDate(endDate, startDate),
            { valid, message }                     = dragData.context,
            dragged                                = draggedEntities[0],
            // Scheduler always drags assignments
            timeSpanRecord                         = dragged.isTask ? dragged : dragged.event,
            // TODO REMOVE dragTipTemplate FOR 5.0
            tooltipTemplate = me.tooltipTemplate || me.dragTipTemplate;

        return tooltipTemplate({
            valid,
            startDate,
            endDate,
            startText,
            endText,
            dragData,
            message                                : message || '',
            [client.scheduledEventName + 'Record'] : timeSpanRecord,
            startClockHtml                         : me.clockTemplate.template({
                date : startDate,
                text : startText,
                cls  : 'b-sch-tooltip-startdate'
            }),
            endClockHtml : timeSpanRecord.isMilestone
                ? ''
                : me.clockTemplate.template({
                    date : endDate,
                    text : endText,
                    cls  : 'b-sch-tooltip-enddate'
                })
        });
    }

    //endregion

    //region Product specific, implemented in subclasses
    getElementFromContext(context) {
        return context.grabbed || context.dragProxy || context.element;
    }

    // Provide your custom implementation of this to allow additional selected records to be dragged together with the original one.
    getRelatedRecords(record) {
        return [];
    }

    getMinimalDragData(info, event) {
        // Can be overridden in subclass
        return {};
    }

    // Check if element can be dropped at desired location
    isValidDrop(dragData) {
        throw new Error('Implement in subclass');
    }

    // Similar to the fn above but also calls validatorFn
    checkDragValidity(dragData) {
        throw new Error('Implement in subclass');
    }

    // Update records being dragged
    updateRecords(context) {
        throw new Error('Implement in subclass');
    }

    // Determine if an element can be dragged
    isElementDraggable(el, event) {
        throw new Error('Implement in subclass');
    }

    // Get coordinate for correct axis
    getCoordinate(record, element, coord) {
        throw new Error('Implement in subclass');
    }

    // Product specific drag data
    setupProductDragData(info) {
        throw new Error('Implement in subclass');
    }

    // Product specific data in drag context
    getProductDragContext(dd) {
        throw new Error('Implement in subclass');
    }

    getRecordElement(record) {
        throw new Error('Implement in subclass');
    }

    //endregion
}
