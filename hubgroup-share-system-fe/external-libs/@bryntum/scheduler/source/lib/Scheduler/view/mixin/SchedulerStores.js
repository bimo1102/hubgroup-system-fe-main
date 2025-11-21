import Base from '../../../Core/Base.js';
import Store from '../../../Core/data/Store.js';
import GlobalEvents from '../../../Core/GlobalEvents.js';
import DomHelper from '../../../Core/helper/DomHelper.js';
import ProjectConsumer from '../../data/mixin/ProjectConsumer.js';

/**
 * @module Scheduler/view/mixin/SchedulerStores
 */

/**
 * Functions for store assignment and store event listeners.
 *
 * @mixin
 * @extends Scheduler/data/mixin/ProjectConsumer
 */
export default Target => class SchedulerStores extends ProjectConsumer(Target || Base) {
    static get $name() {
        return 'SchedulerStores';
    }

    //region Default config

    // This is the static definition of the Stores we consume from the project, and
    // which we must provide *TO* the project if we or our CrudManager is configured
    // with them.
    // The property name is the store name, and within that there is the dataname which
    // is the property which provides static data definition. And there is a listeners
    // definition which specifies the listeners *on this object* for each store.
    //
    // To process incoming stores, implement an updateXxxxxStore method such
    // as `updateEventStore(eventStore)`.
    //
    // To process an incoming Project implement `updateProject`. __Note that
    // `super.updateProject(...arguments)` must be called first.__
    static get projectStores() {
        return {
            resourceStore : {
                dataName : 'resources'
            },

            eventStore : {
                dataName  : 'events',
                listeners : {
                    batchedUpdate   : 'onEventStoreBatchedUpdate',
                    changePreCommit : 'onInternalEventStoreChange',
                    clearChanges    : 'onEventClearChanges',
                    commitStart     : 'onEventCommitStart',
                    commit          : 'onEventCommit',
                    exception       : 'onEventException',
                    idchange        : 'onEventIdChange',
                    beforeLoad      : 'applyStartEndParameters'
                }
            },

            assignmentStore : {
                dataName  : 'assignments',
                listeners : {
                    changePreCommit : 'onAssignmentChange', // In EventSelection.js
                    commitStart     : 'onAssignmentCommitStart',
                    commit          : 'onAssignmentCommit',
                    exception       : 'onAssignmentException',
                    beforeRemove    : {
                        fn   : 'onAssignmentBeforeRemove',
                        // We must go last in case an app vetoes a remove
                        // by returning false from a handler.
                        prio : -1000
                    }
                }
            },

            dependencyStore : {
                dataName : 'dependencies'
            },

            calendarManagerStore : {
            },

            timeRangeStore : {
            },

            resourceTimeRangeStore : {
            }
        };
    }

    static get configurable() {
        return {
            /**
             * Inline events, will be loaded into an internally created EventStore.
             * @config {Scheduler.model.EventModel[]|Object[]} events
             * @category Data events
             */

            /**
             * The {@link Scheduler.data.EventStore} holding the events to be rendered into the scheduler (required).
             * @config {Scheduler.data.EventStore|Object} eventStore
             * @category Data
             */

            /**
             * Inline resources, will be loaded into an internally created ResourceStore.
             * @config {Scheduler.model.ResourceModel[]|Object[]} resources
             * @category Data
             */

            /**
             * The {@link Scheduler.data.ResourceStore} holding the resources to be rendered into the scheduler (required).
             * @config {Scheduler.data.ResourceStore|Object} resourceStore
             * @category Data
             */

            /**
             * Inline assignments, will be loaded into an internally created AssignmentStore.
             * @config {Scheduler.model.AssignmentModel[]|Object[]} assignments
             * @category Data
             */

            /**
             * The optional {@link Scheduler.data.AssignmentStore}, holding assignments between resources and events.
             * Required for multi assignments.
             * @config {Scheduler.data.AssignmentStore|Object} assignmentStore
             * @category Data
             */

            /**
             * Inline dependencies, will be loaded into an internally created DependencyStore.
             * @config {Scheduler.model.DependencyModel[]|Object[]} dependencies
             * @category Data
             */

            /**
             * The optional {@link Scheduler.data.DependencyStore}.
             * @config {Scheduler.data.DependencyStore|Object} dependencyStore
             * @category Data
             */

            /**
             * Inline time ranges, will be loaded into an internally created store if {@link Scheduler.feature.TimeRanges TimeRanges}
             * is enabled.
             * @config {Scheduler.model.TimeSpan[]|Object[]}
             * @category Data
             */
            timeRanges : null,

            /**
             * Inline resource time ranges, will be loaded into an internally created store if
             * {@link Scheduler.feature.ResourceTimeRanges ResourceTimeRanges} is enabled.
             * @config {Scheduler.model.ResourceTimeRangeModel[]|Object[]}
             * @category Data
             */
            resourceTimeRanges : null,

            /**
             * Overridden to *not* auto create a store at the Scheduler level.
             * The store is the {@link #config-resourceStore} of the backing project
             * @config {Core.data.Store}
             * @private
             */
            store : null,

            /**
             * The name of the start date parameter that will be passed to in every `eventStore` load request.
             * @config {String}
             * @category Data
             */
            startParamName : 'startDate',

            /**
             * The name of the end date parameter that will be passed to in every `eventStore` load request.
             * @config {String}
             * @category Data
             */
            endParamName : 'endDate',

            /**
             * true to apply start and end dates of the current view to any `eventStore` load requests.
             * @config {Boolean}
             * @category Data
             */
            passStartEndParameters : false,

            /**
             * Configure with `true` to also remove the event when removing the last assignment.
             * @config {Boolean}
             * @default
             * @category Misc
             */
            removeUnassignedEvent : true,

            /**
             * Class that should be used to instantiate a CrudManager in case it's provided as a simple object to
             * {@link #config-crudManager} config.
             * @config {Scheduler.data.CrudManager}
             * @category Data
             */
            crudManagerClass : null,

            /**
             * Get/set the CrudManager instance
             * @member {Scheduler.data.CrudManager} crudManager
             * @category Data
             */
            /**
             * Supply a {@link Scheduler.data.CrudManager CrudManager} instance or a config object if you want to use
             * CrudManager for handling data.
             * @config {Object|Scheduler.data.CrudManager}
             * @category Data
             */
            crudManager : null
        };
    }

    //endregion

    //region Project

    updateProject(project, oldProject) {
        super.updateProject(project, oldProject);

        this.detachListeners('schedulerStores');

        project.on({
            name    : 'schedulerStores',
            refresh : 'onProjectRefresh',
            thisObj : this
        });
    }

    // Called when project changes are committed, before data is written back to records (but still ready to render
    // since data is fetched from engine)
    onProjectRefresh({ isInitialCommit }) {
        const me = this;

        if (isInitialCommit) {
            if (me.isVertical) {
                me.refreshAfterProjectRefresh = false;
                me.refreshWithTransition();
            }
        }

        if (me.navigateToAfterRefresh) {
            me.navigateTo(me.navigateToAfterRefresh);
            me.navigateToAfterRefresh = null;
        }

        if (me.refreshAfterProjectRefresh) {
            me.refreshWithTransition();
            me.refreshAfterProjectRefresh = false;
        }
    }

    //endregion

    //region CrudManager

    changeCrudManager(crudManager) {
        const me = this;

        if (crudManager && !crudManager.isCrudManager) {
            //<debug>
            if (!me.crudManagerClass) {
                throw new Error('No CrudManager class configured on CrudManager\'s View');
            }
            //</debug>

            // CrudManager injects itself into is Scheduler's _crudManager property
            // because code it triggers needs to access it through its getter.
            crudManager = me.crudManagerClass.new({
                scheduler : me
            }, crudManager);
        }
        // config setter will veto because of above described behaviour
        // of setting the property early on creation
        me._crudManager = crudManager;

        me.bindCrudManager(crudManager);
    }

    //endregion

    //region Row store

    get store() {
        // Vertical uses a dummy store
        if (!this._store && this.isVertical) {
            // TODO: Make this store readonly, since we are using single cell approach
            this._store = new Store({
                data : [
                    {
                        // Quoted to avoid commit-hook check:
                        'id' : 'verticalTimeAxisRow', // eslint-disable-line quote-props
                        cls  : 'b-verticaltimeaxis-row'
                    }
                ]
            });
        }

        return super.store;
    }

    set store(store) {
        super.store = store;
    }

    // Wrap w/ transition refreshFromRowOnStoreAdd() inherited from Grid
    refreshFromRowOnStoreAdd(row, { isExpand }) {
        const args = arguments;

        this.runWithTransition(() => {
            // Postpone drawing of events for a new resource until the following project refresh. Previously the draw
            // would not happen because engine was not ready, but now when we allow commits and can read values during
            // commit that block is no longer there
            this.currentOrientation.suspended = !isExpand;

            super.refreshFromRowOnStoreAdd(row, ...args);

            this.currentOrientation.suspended = false;
        }, !isExpand);
    }

    onStoreAdd(event) {
        super.onStoreAdd(event);

        this.calculateRowHeights(event.records);
    }

    onStoreUpdateRecord({ source : store, record, changes }) {
        // Ignore engine changes that do not affect row rendering
        let ignoreCount = 0;

        if ('assigned' in changes) {
            ignoreCount++;
        }

        if ('calendar' in changes) {
            ignoreCount++;
        }

        if (ignoreCount !== Object.keys(changes).length) {
            super.onStoreUpdateRecord(...arguments);
        }
    }

    //endregion

    //region ResourceStore

    /**
     * Get/set resources, applies to the backing project's ResourceStore.
     * @member {Scheduler.model.ResourceModel[]|Object[]} resources
     * @category Data
     */

    /**
     * Get/set the resource store instance of the backing project
     * @member {Scheduler.data.ResourceStore} resourceStore
     * @category Data
     */

    updateResourceStore(resourceStore) {
        // Reconfigure grid if resourceStore is backing the rows
        if (resourceStore && this.isHorizontal) {
            resourceStore.metaMapId = this.id;
            this.store = resourceStore;
        }
    }

    //endregion

    //region EventStore

    /**
     * Get/set events, applies to the backing project's EventStore.
     * @member {Scheduler.model.EventModel[]|Object[]} events
     * @category Data
     */

    /**
     * Get/set the event store instance of the backing project.
     * @member {Scheduler.data.EventStore} eventStore
     * @category Data
     */

    //endregion

    //region AssignmentStore

    /**
     * Get/set assignments, applies to the backing project's AssignmentStore.
     * @member {Scheduler.model.AssignmentModel[]|Object[]} assignments
     * @category Data
     */

    /**
     * Get/set the event store instance of the backing project.
     * @member {Scheduler.data.AssignmentStore} assignmentStore
     * @category Data
     */

    //endregion

    //region DependencyStore

    /**
     * Get/set dependencies, applies to the backing projects DependencyStore.
     * @member {Scheduler.model.DependencyModel[]|Object[]} dependencies
     * @category Data
     */

    /**
     * Get/set the dependencies store instance of the backing project.
     * @member {Scheduler.data.DependencyStore} dependencyStore
     * @category Data
     */

    //endregion

    //region CalendarManagerStore

    // TODO: document it when it works. The build process throws with this documented.
    // /**
    //  * Get/set the calendar manager store instance of the backing project
    //  * @member {Engine.store.CalendarManagerStoreMixin} calendarManagerStore
    //  * @category Data
    //  */

    //endregion

    //region Events

    onEventIdChange(params) {
        this.currentOrientation.onEventStoreIdChange && this.currentOrientation.onEventStoreIdChange(params);
    }

    /**
     * Listener to the batchedUpdate event which fires when a field is changed on a record which
     * is batch updating. Occasionally UIs must keep in sync with batched changes.
     * For example, the EventResize feature performs batched updating of the startDate/endDate
     * and it tells its client to listen to batchedUpdate.
     * @private
     */
    onEventStoreBatchedUpdate(event) {
        if (this.listenToBatchedUpdates) {
            return this.onInternalEventStoreChange(event);
        }
    }

    /**
     * Calls appropriate functions for current event layout when the event store is modified.
     * @private
     */
    // Named as Internal to avoid naming collision with wrappers that relay events
    onInternalEventStoreChange(params) {
        // Too early, bail out
        // Also bail out if this is a reassign using resourceId, any updates will be handled by AssignmentStore instead
        if (!this._mode || params.isAssign || this.assignmentStore.isRemovingAssignment) {
            return;
        }

        this.currentOrientation.onEventStoreChange(params);
    }

    /**
     * Refreshes committed events, to remove dirty/committing flag.
     * CSS is added
     * @private
     */
    onEventCommit({ changes }) {
        let resourcesToRepaint = [...changes.added, ...changes.modified].map(
            eventRecord => this.eventStore.getResourcesForEvent(eventRecord)
        );

        // getResourcesForEvent returns an array, so need to flatten resourcesToRepaint
        resourcesToRepaint = Array.prototype.concat.apply([], resourcesToRepaint);

        // repaint relevant resource rows
        new Set(resourcesToRepaint).forEach(
            resourceRecord => this.repaintEventsForResource(resourceRecord)
        );
    }

    /**
     * Adds the committing flag to changed events before commit.
     * @private
     */
    onEventCommitStart({ changes }) {
        const { currentOrientation, committingCls } = this;
        // Committing sets a flag in meta that during event rendering applies a CSS class. But to not mess up drag and
        // drop between resources no redraw is performed before committing, so class is never applied to the element(s).
        // Applying here instead
        [...changes.added, ...changes.modified].forEach(eventRecord =>
            eventRecord.assignments.forEach(
                assignmentRecord => currentOrientation.toggleCls(assignmentRecord, committingCls, true)
            )
        );
    }

    // Clear committing flag
    onEventException({ action }) {
        if (action === 'commit') {
            const { changes } = this.eventStore;

            [...changes.added, ...changes.modified, ...changes.removed].forEach(eventRecord =>
                this.repaintEvent(eventRecord)
            );
        }
    }

    onAssignmentCommit({ changes }) {
        this.repaintEventsForAssignmentChanges(changes);
    }

    onAssignmentCommitStart({ changes }) {
        const { currentOrientation, committingCls } = this;

        [...changes.added, ...changes.modified].forEach(assignmentRecord => {
            currentOrientation.toggleCls(assignmentRecord, committingCls, true);
        });
    }

    // Clear committing flag
    onAssignmentException({ action }) {
        if (action === 'commit') {
            this.repaintEventsForAssignmentChanges(this.assignmentStore.changes);
        }
    }

    repaintEventsForAssignmentChanges(changes) {
        const resourcesToRepaint = [...changes.added, ...changes.modified, ...changes.removed].map(
            assignmentRecord => assignmentRecord.getResource()
        );

        // repaint relevant resource rows
        new Set(resourcesToRepaint).forEach(
            resourceRecord => this.repaintEventsForResource(resourceRecord)
        );
    }

    /**
     * Refreshes scheduler when event changes are cleared.
     * @private
     */
    onEventClearChanges() {
        this.refresh();
    }

    onAssignmentBeforeRemove({ source, records, removingAll }) {
        if (removingAll) {
            return;
        }

        const me = this;

        let moveTo;

        // Deassigning the active assignment
        if (!me.isConfiguring && me.activeAssignment && records.includes(me.activeAssignment)) {
            // If being done by a keyboard gesture then look for a close target
            // until we find an existing record, not scheduled for removal.
            // Otherwise, per Mats, push focus outside of the Scheduler.
            if (GlobalEvents.lastInteractionType === 'key') {
                // Look for a close target until we find an existing record, not scheduled for removal
                for (let i = 0, l = records.length; i < l && (!moveTo || records.includes(moveTo)); i++) {
                    const assignment = records[i];

                    if (assignment.resource && assignment.resource.isModel) {
                        moveTo = me.getNext(assignment) || me.getPrevious(assignment);
                    }
                }
            }

            // Move focus away from the element which will soon have no
            // backing data.
            if (moveTo) {
                me.navigateTo(moveTo);
                me.navigateToAfterRefresh = moveTo;
            }
            // Focus must exit the Scheduler's subgrid, otherwise, if a navigation
            // key gesture is delivered before the outgoing event's element has faded
            // out and been removed, navigation will be attempted from a deleted
            // event. Animated hiding is problematic.
            //
            // We cannot just revertFocus() because that might move focus back to an
            // element in a floating EventEditor which is not yet faded out and
            // been removed. Animated hiding is problematic.
            //
            // We cannot focus scheduler.timeAxisColumn.element because the browser
            // would scroll it in some way if we have horizontal overflow.
            //
            // The only thing we can know about to focus here is the Scheduler itself.
            else {
                DomHelper.focusWithoutScrolling(me.focusElement);
            }
        }
    }

    // /**
    //  * Repaints affected resources when assignments are removed.
    //  * @private
    //  */
    // onAssignmentRemove({ records }) {
    //     if (this.isHorizontal) {
    //         records.forEach(assignment => {
    //             const resource = assignment.resource;
    //             // Removing a resource removes assignments, if resource is already removed no point in repainting here
    //             resource && !resource.isRemoved && this.repaintEventsForResource(resource);
    //         });
    //     }
    // }
    //
    // /**
    //  * Repaints resources when all assignments are removed.
    //  * @private
    //  */
    // onAssignmentRemoveAll() {
    //     if (this.isHorizontal) {
    //         this.currentOrientation.onAssignmentRemoveAll();
    //     }
    // }

    // /**
    //  * Refreshes scheduler when assignment store is filtered.
    //  */
    // onAssignmentFilter() {
    //     if (this.isHorizontal) {
    //         this.refresh();
    //     }
    // }

    //endregion

    //region TimeRangeStore

    /**
     * Get/set time ranges, applies to the backing project's TimeRangeStore.
     * @member {Scheduler.model.TimeSpan[]|Object[]} timeRanges
     * @category Data
     */

    /**
     * Get/set the time ranges store instance for {@link Scheduler.feature.TimeRanges TimeRanges} feature.
     * @property {Core.data.Store}
     * @category Data
     * @name timeRangeStore
     */

    /**
     * The time ranges store instance for {@link Scheduler.feature.TimeRanges TimeRanges} feature.
     * @config {Core.data.Store}
     * @category Data
     * @name timeRangeStore
     */

    //endregion

    //region ResourceTimeRangeStore

    /**
     * Get/set ime ranges, applies to the backing project's ResourceTimeRangeStore.
     * @member {Scheduler.model.ResourceTimeRangeModel[]|Object[]} resourceTimeRanges
     * @category Data
     */

    /**
     * Get/set the resource time ranges store instance for {@link Scheduler.feature.ResourceTimeRanges ResourceTimeRanges} feature.
     * @property {Scheduler.data.ResourceTimeRangeStore}
     * @category Data
     * @name resourceTimeRangeStore
     */

    /**
     * Resource time ranges store instance for {@link Scheduler.feature.ResourceTimeRanges ResourceTimeRanges} feature.
     * @config {Scheduler.data.ResourceTimeRangeStore}
     * @category Data
     * @name resourceTimeRangeStore
     */

    //endregion

    //region Other functions

    /**
     * Applies the start and end date to each event store request (formatted in the same way as the start date, defined
     * in the EventStore Model class).
     * @category Data
     */
    applyStartEndParameters({ source : eventStore, params }) {
        const
            me = this,
            field = eventStore.modelClass.fieldMap.startDate;

        if (me.passStartEndParameters) {
            params[me.startParamName] = field.print(me.startDate);
            params[me.endParamName] = field.print(me.endDate);
        }
    }

    /**
     * Get events grouped by timeAxis ticks from resources array
     * @category Data
     * @param {Scheduler.model.ResourceModel[]} resources An array of resources to process. If not passed, all resources will be used.
     * @param {Function} filterFn filter function to filter events if required. Optional.
     * @private
     */
    getResourcesEventsPerTick(resources, filterFn) {
        const
            { timeAxis, resourceStore } = this,
            eventsByTick                = [];

        resources = resources || resourceStore.records;
        resources.forEach(resource => {
            resource.events.forEach(event => {
                if (!timeAxis.isTimeSpanInAxis(event) || (filterFn && !filterFn.call(this, { resource, event }))) {
                    return;
                }
                // getTickFromDate may return float if event starts/ends in a middle of a tick
                let startTick = Math.floor(timeAxis.getTickFromDate(event.startDate)),
                    endTick = Math.ceil(timeAxis.getTickFromDate(event.endDate));

                // if startDate/endDate of the event is out of timeAxis' bounds, use first/last tick id instead
                if (startTick == -1) {
                    startTick = timeAxis.first.id;
                }
                if (endTick === -1) {
                    endTick = timeAxis.last.id;
                }

                do {
                    if (!eventsByTick[startTick]) {
                        eventsByTick[startTick] = [event];
                    }
                    else {
                        eventsByTick[startTick].push(event);
                    }
                    startTick = timeAxis.getNext(startTick).id;
                } while (startTick < endTick);
            });
        });

        return eventsByTick;
    }

    //endregion

    //region WidgetClass

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement thus.
    get widgetClass() {}

    //endregion
};
