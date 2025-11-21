import AjaxStore from '../../Core/data/AjaxStore.js';
import ResourceTimeRangeModel from '../model/ResourceTimeRangeModel.js';

/**
 * @module Scheduler/data/ResourceTimeRangeStore
 */

/**
 * A class representing a collection of resource time ranges.
 * Contains a collection of {@link Scheduler.model.ResourceTimeRangeModel ResourceTimeRangeModel} records.
 * The class is used by the {@link Scheduler.feature.ResourceTimeRanges ResourceTimeRanges} feature.
 *
 * ## Recurring ranges support
 *
 * By default the class doesn't support recurrence. In order to add its support
 * please use {@link Scheduler.data.mixin.RecurringTimeSpansMixin RecurringTimeSpansMixin} mixin
 * (the store model in turn should be mixed with {@link Scheduler/model/mixin/RecurringTimeSpan RecurringTimeSpan} class):
 *
 * ```js
 * // Mix RecurringTimeSpan (which adds recurrence support) to ResourceTimeRangeModel
 * class MyResourceTimeRange extends RecurringTimeSpan(ResourceTimeRangeModel) {};
 *
 * // Mix RecurringTimeSpansMixin (which adds recurrence support) to ResourceTimeRangeStore
 * class MyResourceTimeRangeStore extends RecurringTimeSpansMixin(ResourceTimeRangeStore) {
 *     static get defaultConfig() {
 *         return {
 *             // use our new MyResourceTimeRange model
 *             modelClass : MyResourceTimeRange
 *         };
 *     }
 * };
 *
 * // Make new store that supports time ranges recurrence
 * const store = new MyResourceTimeRangeStore({
 *     data : [{        {
 *         id             : 1,
 *         resourceId     : 'r1',
 *         startDate      : '2019-01-01T11:00',
 *         endDate        : '2019-01-01T13:00',
 *         name           : 'Coffee break',
 *         // this time range should repeat every day
 *         recurrenceRule : 'FREQ=DAILY'
 *     }]
 * });
 * ```
 *
 * @extends Core/data/AjaxStore
 */
export default class ResourceTimeRangeStore extends AjaxStore {
    static get defaultConfig() {
        return {
            /**
             * CrudManager must load stores in the correct order. Lowest first.
             * @private
             */
            loadPriority : 500,

            /**
             * CrudManager must sync stores in the correct order. Lowest first.
             * @private
             */
            syncPriority : 500,

            /**
             * This store should be linked to a ResourceStore to link the time ranges to resources
             * @config {Scheduler.data.ResourceStore}
             */
            resourceStore : null,

            modelClass : ResourceTimeRangeModel,
            storeId    : 'resourceTimeRanges'
        };
    }

    set resourceStore(store) {
        this._resourceStore = store;

        // If store is assigned after configuration we need to init relations
        if (!this.isConfiguring) {
            this.initRelations(true);
        }
    }

    get resourceStore() {
        return this._resourceStore;
    }

    // Matching signature in EventStore to allow reusage of SchedulerStores#onInternalEventStoreChange()
    getResourcesForEvent(resourceTimeRange) {
        return [resourceTimeRange.resource];
    }
}
