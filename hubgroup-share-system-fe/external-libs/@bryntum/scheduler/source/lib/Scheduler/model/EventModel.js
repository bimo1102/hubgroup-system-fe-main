import TimeSpan from './TimeSpan.js';
import RecurringTimeSpan from './mixin/RecurringTimeSpan.js';
import EventModelMixin from './mixin/EventModelMixin.js';
import PartOfProject from '../data/mixin/PartOfProject.js';

import { SchedulerCoreEvent } from '../../Engine/quark/model/scheduler_core/SchedulerCoreEvent.js';

const EngineMixin = SchedulerCoreEvent;

/**
 * @module Scheduler/model/EventModel
 */

/**
 * This class represent a single event in your schedule, usually added to a {@link Scheduler.data.EventStore}.
 *
 * It is a subclass of the {@link Scheduler.model.TimeSpan}, which is in turn subclass of {@link Core.data.Model}.
 * Please refer to documentation of that class to become familiar with the base interface of the event.
 *
 * ## Async date calculations
 *
 * A record created from an {@link Scheduler/model/EventModel} is normally part of an {@link Scheduler.data.EventStore},
 * which in turn is part of a project. When dates or the duration of an event is changed, the project performs async calculations
 * to normalize the other fields.
 * For example if {@link #field-duration} is changed, it will calculate {@link #field-endDate}.
 *
 * As a result of this being an async operation, the values of other fields are not guaranteed to be up to date
 * immediately after a change. To ensure data is up to date, await the calculations to finish.
 *
 * For example, {@link #field-endDate} is not up to date after this operation:
 *
 * ```javascript
 * eventRecord.duration = 5;
 * // endDate not yet calculated
 * ```
 *
 * But if calculations are awaited it is up to date:
 *
 * ```javascript
 * eventRecord.duration = 5;
 * await eventRecord.project.commitAsync();
 * // endDate is calculated
 * ```
 *
 * As an alternative, you can also use `setAsync()` to trigger calculations directly after the change:
 *
 * ```javascript
 * await eventRecord.setAsync({ duration : 5});
 * // endDate is calculated
 * ```
 *
 * ## Subclassing the Event model class
 * The Event model has a few predefined fields as seen below. If you want to add new fields or change the options for the existing fields,
 * you can do that by subclassing this class (see example below).
 *
 * ```
 * class MyEvent extends EventModel {
 *
 *     static get fields() {
 *         return [
 *            // Add new field
 *            { name: 'myField', type : 'number', defaultValue : 0 }
 *         ];
 *     },
 *
 *     myCheckMethod() {
 *         return this.myField > 0
 *     },
 *
 *     ...
 * });
 * ```
 * If you in your data want to use other names for the {@link #field-startDate}, {@link #field-endDate}, {@link #field-resourceId} and name fields you can configure
 * them as seen below:
 * ```
 * class MyEvent extends EventModel {
 *
 *     static get fields() {
 *         return [
 *            { name: 'startDate', dataSource 'taskStart' },
 *            { name: 'endDate', dataSource 'taskEnd', format: 'YYYY-MM-DD' },
 *            { name: 'resourceId', dataSource 'userId' },
 *            { name: 'name', dataSource 'taskTitle' },
 *         ];
 *     },
 *     ...
 * });
 * ```
 *
 * Please refer to {@link Core.data.Model} for additional details.
 *
 * @extends Scheduler/model/TimeSpan
 * @mixes Scheduler/model/mixin/RecurringTimeSpan
 * @mixes Scheduler/model/mixin/EventModelMixin
 */
export default class EventModel extends EngineMixin.derive(TimeSpan).mixin(RecurringTimeSpan, PartOfProject, EventModelMixin) {
    static get $name() {
        return 'EventModel';
    }
}

EventModel.exposeProperties();
