import TimeSpan from './TimeSpan.js';
/**
 * @module Scheduler/model/ResourceTimeRangeModel
 */

/**
 * This class represent a single resource time range in your schedule.
 * To style the rendered elements, use {@link Scheduler.model.TimeSpan#field-cls cls} or {@link #field-timeRangeColor} field.
 * The class is used by the {@link Scheduler.feature.ResourceTimeRanges ResourceTimeRanges} feature.
 *
 * ## Recurring ranges support
 *
 * By default the class doesn't support recurrence.
 * In order to add its support please use {@link Scheduler/model/mixin/RecurringTimeSpan RecurringTimeSpan} mixin
 * (the store containing the model should in turn be mixed with {@link Scheduler.data.mixin.RecurringTimeSpansMixin RecurringTimeSpansMixin} class):
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
 * @extends Scheduler/model/TimeSpan
 */
export default class ResourceTimeRangeModel extends TimeSpan {
    static get $name() {
        return 'ResourceTimeRangeModel';
    }

    //region Fields

    static get fields() {
        return [
            /**
             * Id of the resource this time range is associated with
             * @field {String|Number} resourceId
             */
            'resourceId',

            /**
             * Controls this time ranges primary color, defaults to using current themes default time range color.
             * @field {String} timeRangeColor
             */
            'timeRangeColor'
        ];
    }

    static get relationConfig() {
        return [
            /**
             * The associated resource, retrieved using a relation to a ResourceStore determined by the value assigned
             * to `resourceId`. The relation also lets you access all time ranges on a resource through
             * `ResourceModel#timeRanges`.
             * @property {Scheduler.model.ResourceModel} resource
             */
            { relationName : 'resource', fieldName : 'resourceId', store : 'resourceStore', collectionName : 'timeRanges', nullFieldOnRemove : true }
        ];
    }

    //endregion

    // Used internally to differentiate between Event and ResourceTimeRange
    get isResourceTimeRange() {
        return true;
    }

    // To match EventModel API
    get resources() {
        return this.resource ? [this.resource] : [];
    }
}
