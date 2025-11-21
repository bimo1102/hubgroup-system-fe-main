import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';
import ResourceTimeRangesBase from './base/ResourceTimeRangesBase.js';
import ResourceTimeRangeStore from '../data/ResourceTimeRangeStore.js';

/**
 * @module Scheduler/feature/ResourceTimeRanges
 */

/**
 * Feature that draws resource time ranges, shaded areas displayed behind events. These zones are similar to events in
 * that they have a start and end date but different in that they do not take part in the event layout and they always
 * occupy full row height.
 *
 * Each time range is represented by an instances of {@link Scheduler.model.ResourceTimeRangeModel ResourceTimeRangeModel}, held in a
 * {@link Scheduler.data.ResourceTimeRangeStore ResourceTimeRangeStore}. Currently the they are readonly UI-wise, but can be manipulated on
 * the data level. To style the rendered elements, use the {@link Scheduler.model.TimeSpan#field-cls cls} field or use the {@link Scheduler.model.ResourceTimeRangeModel#field-timeRangeColor} field.
 *
 * Data can be provided either using the {@link Scheduler.view.Scheduler#config-resourceTimeRanges resourceTimeRanges} config on the Scheduler config object:
 *
 * ```javascript
 * new Scheduler({
 *     ...
 *    features :  {
 *        resourceTimeRanges : true
 *    },
 *
 *    // Data specified directly on the Scheduler instance
 *    resourceTimeRanges : [
 *        // Either specify startDate & endDate or startDate & duration when defining a range
 *        { startDate : new Date(2019,0,1), endDate : new Date(2019,0,3), name : 'Occupied', timeRangeColor : 'red' },
 *        { startDate : new Date(2019,0,3), duration : 2, durationUnit : 'd', name : 'Available' },
 *    ]
 * })
 * ```
 *
 * or the {@link Scheduler.view.Scheduler#config-resourceTimeRangeStore resourceTimeRangeStore} config on the Scheduler config object:
 *
 * ```javascript
 * new Scheduler({
 *     ...
 *     features :  {
 *         resourceTimeRanges : true
 *     },
 *     resourceTimeRangeStore : new ResourceTimeRangeStore({
 *         readUrl : './resourceTimeRanges/'
 *     })
 * })
 * ```
 *
 * This feature is **off** by default. For info on enabling it, see {@link Grid.view.mixin.GridFeatures}.
 *
 * ## Recurring ranges support
 *
 * The feature supports recurring ranges in case the provided store and models
 * have {@link Scheduler.data.mixin.RecurringTimeSpansMixin RecurringTimeSpansMixin} and {@link Scheduler/model/mixin/RecurringTimeSpan RecurringTimeSpan}
 * mixins applied:
 *
 * ```js
 * // We want to use recurring time ranges
 * // so we make a special model extending standard ResourceTimeRangeModel
 * // with RecurringTimeSpan which adds recurrence support
 * class MyResourceTimeRange extends RecurringTimeSpan(ResourceTimeRangeModel) {};
 *
 * // Define a new store extending standard ResourceTimeRangeStore
 * // with RecurringTimeSpansMixin mixin to add recurrence support to the store.
 * // This store will contain time ranges.
 * class MyResourceTimeRangeStore extends RecurringTimeSpansMixin(ResourceTimeRangeStore) {
 *     static get defaultConfig() {
 *         return {
 *             // use our new MyResourceTimeRange model
 *             modelClass : MyResourceTimeRange
 *         };
 *     }
 * };
 *
 * // Instantiate store for resourceTimeRanges using our new classes
 * const resourceTimeRangeStore = new MyResourceTimeRangeStore({
 *     data : [{        {
 *         id             : 1,
 *         resourceId     : 'r1',
 *         startDate      : '2019-01-01T11:00',
 *         endDate        : '2019-01-01T13:00',
 *         name           : 'Lunch',
 *         // this time range should repeat every day
 *         recurrenceRule : 'FREQ=DAILY'
 *     }]
 * });
 *
 * const scheduler = new Scheduler({
 *     ...
 *     features : {
 *         resourceTimeRanges : true
 *     },
 *     // store for "resourceTimeRanges" feature
 *     resourceTimeRangeStore,
 *     ...
 * ```
 *
 * @extends Scheduler/feature/base/ResourceTimeRangesBase
 * @demo Scheduler/resourcetimeranges
 * @inlineexample Scheduler/feature/ResourceTimeRanges.js
 * @classtype resourceTimeRanges
 * @feature
 */
export default class ResourceTimeRanges extends ResourceTimeRangesBase {
    //region Config

    static get $name() {
        return 'ResourceTimeRanges';
    }

    static get defaultConfig() {
        return {
            idPrefix : 'resourcetimerange',
            rangeCls : 'b-sch-resourcetimerange',

            /**
             * Store that holds resource time ranges (using ResourceTimeRangeModel or subclass thereof). A store will be
             * automatically created if none is specified
             * @config {Scheduler.data.ResourceTimeRangeStore}
             * @deprecated 4.0 Define `resourceTimeRangeStore` on Scheduler or its project
             */
            store : false,

            /**
             * Time range definitions (data to ResourceTimeRangeModels). Will be added to store. Can also be specified
             * on Scheduler for convenience
             * @config {Scheduler.model.ResourceTimeRangeModel[]|Object[]}
             * @deprecated 4.0 Define `resourceTimeRanges` on Scheduler or `resourceTimeRangesData` on its project
             */
            resourceTimeRanges : null
        };
    }

    //endregion

    //region Init

    attachToProject(project) {
        const
            me            = this,
            { scheduler } = me;

        super.attachToProject(project);

        if (!project.resourceTimeRangeStore) {
            project.resourceTimeRangeStore = me._store || scheduler.resourceTimeRangeStore || new ResourceTimeRangeStore({
                owner : me
            });

            const { crudManager } = scheduler;

            if (crudManager && !crudManager.resourceTimeRangeStore) {
                crudManager.resourceTimeRangeStore = project.resourceTimeRangeStore;
            }
        }

        const store = project.resourceTimeRangeStore;

        if (!me.exposedOnScheduler) {
            // ResourceZones can be set on scheduler or feature, for convenience
            if (scheduler.resourceTimeRanges) {
                store.add(scheduler.resourceTimeRanges);
                delete scheduler.resourceTimeRanges;
            }

            // expose getter/setter for resourceTimeRanges on scheduler
            Object.defineProperty(scheduler, 'resourceTimeRanges', {
                get : () => store.records,
                set : resourceTimeRanges => store.data = resourceTimeRanges
            });

            me.exposedOnScheduler = true;
        }

        // Link to projects resourceStore if not already linked to one
        if (!store.resourceStore) {
            store.resourceStore = project.resourceStore;
        }

        me.detachListeners('store');

        store.on({
            name    : 'store',
            change  : me.onStoreChange,
            thisObj : me
        });
    }

    /**
     * Called during construction to do product specific store setup
     * @private
     */
    set store(store) {
        // For backwards compatibility, we now want the store on the project
        this._store = store;
    }

    get store() {
        return this.project.resourceTimeRangeStore;
    }

    //endregion

    // Called on render of resources events to get events to render. Add any ranges
    // (chained function from Scheduler)
    getEventsToRender(resource, events) {
        const { timeRanges } = resource;

        // if we have ranges and the feature is enabled
        if (timeRanges?.length && !this.disabled) {

            const { startDate, endDate } = this.client;

            timeRanges.forEach(timeRange => {
                // if this a recurring event let's include its visible occurrences
                if (timeRange.isRecurring) {
                    events.push(...timeRange.getOccurrencesForDateRange(startDate, endDate));
                }
                else {
                    events.push(timeRange);
                }
            });
        }

        return events;
    }

    shouldInclude(eventRecord) {
        return eventRecord.isResourceTimeRange && !eventRecord.isNonWorking;
    }

    doDestroy() {
        if (this.store?.owner === this) {
            this.store.destroy();
        }
        super.doDestroy();
    }
}

// No feature based styling needed, do not add a cls to Scheduler
ResourceTimeRanges.featureClass = '';

GridFeatureManager.registerFeature(ResourceTimeRanges, false, 'Scheduler');
