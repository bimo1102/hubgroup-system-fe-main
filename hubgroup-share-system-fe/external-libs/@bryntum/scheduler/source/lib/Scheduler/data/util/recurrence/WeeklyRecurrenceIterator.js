/**
 * @module Scheduler/data/util/recurrence/WeeklyRecurrenceIterator
 */

import AbstractRecurrenceIterator from './AbstractRecurrenceIterator.js';
import DateHelper from '../../../../Core/helper/DateHelper.js';
import DayRuleEncoder from './RecurrenceDayRuleEncoder.js';

/**
 * A class which provides iteration to call a function for dates specified by a
 * {@link Scheduler.model.RecurrenceModel RecurrenceModel} over a specified date range.
 * @private
 */
export default class WeeklyRecurrenceIterator extends AbstractRecurrenceIterator {

    static get frequency() {
        return 'WEEKLY';
    }

    /**
     * Iterates over the passed date range, calling the passed callback on each date on which
     * starts an event which matches the passed recurrence rule and overlaps the start and end dates.
     * @param {Object} config An object which describes how to iterate.
     * @param {Date} config.startDate The point in time to begin iteration.
     * @param {Date} config.endDate The point in time to end iteration.
     * @param {Boolean} [config.startOnly] By default, all occurrences which intersect the date range
     * will be visited. Pass `true` to only visit occurrences which *start* in the date range.
     * @param {Scheduler.model.RecurrenceModel} config.recurrence The point in time to end iteration.
     * @param {Function} config.fn The function to call for each date which matches the recurrence in the date range.
     * @param {Date} config.fn.date The occurrence date.
     * @param {Number} config.fn.counter A counter of how many dates have been visited in this iteration.
     * @param {Boolean} config.fn.isFirst A flag which is `true` if the date is the first occurrence in the specified recurrence rule.
     * @param {Array} [config.extraArgs] Extra arguments to pass to the callback after the `isFirst` argument.
     */
    static forEachDate(config) {
        const
            {
                startOnly,
                startDate,
                endDate,
                timeSpan,
                timeSpanStart,
                earliestVisibleDate,
                durationMS,
                spansStart,
                recurrence,
                fn,
                extraArgs,
                scope = this
            }          = this.processIterationConfig(config),
            {
                interval,
                days
            }          = recurrence;

        let counter    = 0,
            { count }  = recurrence,
            weekDays   = DayRuleEncoder.decode(days),
            weekStartDate, occurrenceDate;

        // days could be provided in any order so it's important to sort them
        if (weekDays && weekDays.length) {
            weekDays.sort((a, b) => a[0] - b[0]);
        }
        // "Days" might be skipped then we use the event start day
        else {
            weekDays = [[timeSpanStart.getDay()]];
        }

        // if the recurrence is limited w/ "Count" or not every interval should match
        // we need to 1st count passed occurrences so we always start iteration from the event start date
        weekStartDate = DateHelper.getNext(count || interval > 1 ? timeSpanStart : startDate, 'week', 0, 0);

        if (!endDate && !count) {
            count = this.MAX_OCCURRENCES_COUNT;
        }

        while (!endDate || weekStartDate <= endDate) {

            for (let i = 0; i < weekDays.length; i++) {
                occurrenceDate = DateHelper.copyTimeValues(DateHelper.add(weekStartDate, weekDays[i][0], 'day'), timeSpanStart);

                if (occurrenceDate >= timeSpanStart) {
                    const inView = this.isInView(startOnly, occurrenceDate, earliestVisibleDate, durationMS, timeSpan);

                    counter++;

                    if (inView &&
                        ((endDate && occurrenceDate > endDate) ||
                        (fn.apply(scope, [occurrenceDate, counter, counter === 1 && spansStart, timeSpan, ...extraArgs]) === false) ||
                        (count && counter >= count))
                    ) {
                        return;
                    }
                }
            }

            // get next week start
            weekStartDate = DateHelper.getNext(weekStartDate, 'week', interval, 0);
        }
    }

}
