import Base from '../../../Core/Base.js';
import RecurringTimeSpansMixin from './RecurringTimeSpansMixin.js';

/**
 * @module Scheduler/data/mixin/RecurringEventsMixin
 */

/**
 * This mixin class provides recurring events functionality to the {@link Scheduler.data.EventStore event store}.
 * @extends Scheduler/data/mixin/RecurringTimeSpansMixin
 * @mixin
 */
export default Target => class RecurringEventsMixin extends RecurringTimeSpansMixin(Target || Base) {

    static get $name() {
        return 'RecurringEventsMixin';
    }

    /**
     * Returns all the recurring events.
     *
     * **An alias for ** {@link Scheduler.data.mixin.RecurringTimeSpansMixin#function-getRecurringTimeSpans} method.
     *
     * @return {Scheduler.model.EventModel[]} Array of recurring events.
     * @category Recurrence
     */
    getRecurringEvents() {
        return this.getRecurringTimeSpans();
    }

    isEventPersistable(event) {
        // occurrences are not persistable
        return super.isEventPersistable(event) && (!event.supportsRecurring || !event.isOccurrence);
    }
};
