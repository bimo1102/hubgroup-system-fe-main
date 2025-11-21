/**
 * @module Scheduler/data/util/recurrence/DailyRecurrenceIterator
 */

import AbstractRecurrenceIterator from './AbstractRecurrenceIterator.js';
import DateHelper from '../../../../Core/helper/DateHelper.js';
/**
 * A class which provides iteration to call a function for dates specified by a
 * {@link Scheduler.model.RecurrenceModel RecurrenceModel} over a specified date range.
 * @private
 */
export default class DailyRecurrenceIterator extends AbstractRecurrenceIterator {

    static get frequency() {
        return 'DAILY';
    }

    /**
     * Iterates over the passed date range, calling the passed callback on each date on which
     * starts a recurring event which matches the passed recurrence rule and overlaps the start and end dates
     * and is not an {@link Scheduler.model.mixin.RecurringTimeSpan#field-exceptionDates exceptionDate}
     * in the recurring event.
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
            }                = this.processIterationConfig(config),
            { interval }     = recurrence,
            delay            = startDate - timeSpanStart,
            // recurrence interval duration in ms (86400000 is a single day duration in ms)
            intervalDuration = interval * 86400000,
            delayInIntervals = Math.floor(delay / intervalDuration);

        let count          = recurrence.count,
            counter        = 0,
            occurrenceDate = DateHelper.add(timeSpanStart, delayInIntervals * interval, 'day');

        if (!endDate && !count) {
            count = this.MAX_OCCURRENCES_COUNT;
        }

        while (!endDate || occurrenceDate <= endDate) {
            const inView = this.isInView(startOnly, occurrenceDate, earliestVisibleDate, durationMS, timeSpan);

            counter++;

            if (inView &&
                ((endDate && occurrenceDate > endDate) || fn.apply(scope, [occurrenceDate, counter, counter === 1 && spansStart, timeSpan, ...extraArgs]) === false || (count && counter >= count))
            ) {
                break;
            }

            // shift to the next day
            occurrenceDate = DateHelper.add(occurrenceDate, interval, 'day');
        }
    }
}
