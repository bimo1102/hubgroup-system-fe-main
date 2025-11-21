/**
 * @module Scheduler/data/util/recurrence/YearlyRecurrenceIterator
 */

import AbstractRecurrenceIterator from './AbstractRecurrenceIterator.js';
import DateHelper from '../../../../Core/helper/DateHelper.js';
import DayRuleEncoder from './RecurrenceDayRuleEncoder.js';

/**
 * A class which provides iteration to call a function for dates specified by a
 * {@link Scheduler.model.RecurrenceModel RecurrenceModel} over a specified date range.
 * @private
 */
export default class YearlyRecurrenceIterator extends AbstractRecurrenceIterator {

    static get frequency() {
        return 'YEARLY';
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
            }              = this.processIterationConfig(config),
            {
                interval,
                days,
                count,
                positions
            } = recurrence,
            weekDays       = DayRuleEncoder.decode(days),
            hasPositions   = positions && positions.length,
            processedDate  = {};

        let
            { months }     = recurrence,
            counter        = 0,
            i, occurrenceDate, dates, yearStartDate, yearEndDate, weekDayPosition;

        // if the recurrence is limited w/ "Count" or not every interval should match
        // we need to 1st count passed occurrences so we always start iteration from the event start date
        yearStartDate = DateHelper.startOf(count || interval > 1 ? timeSpanStart : startDate, 'year');
        yearEndDate   = new Date(DateHelper.getNext(yearStartDate, 'year', 1) - 1);

        months && months.sort((a, b) => a - b);

        // if no months provided let's use the event month
        if (!(months && months.length) && !(weekDays && weekDays.length)) {
            months = [timeSpanStart.getMonth() + 1];
        }

        if (weekDays && weekDays.length) {
            // Collect hash of positions indexed by week days
            weekDays.forEach(day => {
                if (day[1]) {
                    weekDayPosition         = weekDayPosition || {};
                    weekDayPosition[day[0]] = day[1];
                }
            });
        }

        while ((!endDate || endDate >= yearStartDate) && (!count || counter < count)) {

            dates = [];

            if (weekDays && weekDays.length) {

                weekDays.forEach(day => {
                    const weekDay = day[0];

                    let
                        from = 1,
                        till = 53;

                    // if position provided
                    if (day[1]) {
                        from = till = day[1];
                    }

                    for (i = from; i <= till; i++) {
                        if ((occurrenceDate = this.getNthDayInPeriod(yearStartDate, yearEndDate, weekDay, i))) {
                            occurrenceDate = DateHelper.copyTimeValues(occurrenceDate, timeSpanStart);

                            if (!processedDate[occurrenceDate.getTime()]) {
                                // remember we processed the date
                                processedDate[occurrenceDate.getTime()] = true;

                                dates.push(occurrenceDate);
                            }
                        }
                    }
                });

                dates.sort((a, b) => a - b);

                if (!hasPositions) {
                    for (i = 0; i < dates.length; i++) {
                        occurrenceDate = dates[i];

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
                }

            }
            else {
                for (i = 0; i < months.length; i++) {

                    if ((occurrenceDate = this.buildDate(yearStartDate.getFullYear(), months[i] - 1, timeSpanStart.getDate()))) {
                        occurrenceDate = DateHelper.copyTimeValues(occurrenceDate, timeSpanStart);

                        // check if the date wasn't iterated over yet
                        if (!processedDate[occurrenceDate.getTime()]) {
                            processedDate[occurrenceDate.getTime()] = true;

                            if (hasPositions) {
                                dates.push(occurrenceDate);
                            }
                            else if (occurrenceDate >= timeSpanStart) {
                                const inView = startOnly ? occurrenceDate >= earliestVisibleDate : occurrenceDate.valueOf() + durationMS > earliestVisibleDate && !timeSpan.hasException(occurrenceDate);

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
                    }
                }
            }

            if (hasPositions && dates.length) {
                this.forEachDateAtPositions(dates, positions, occurrenceDate => {
                    if (occurrenceDate >= timeSpanStart) {
                        const inView = startOnly ? occurrenceDate >= earliestVisibleDate : occurrenceDate.valueOf() + durationMS > earliestVisibleDate && !timeSpan.hasException(occurrenceDate);

                        counter++;

                        // Ignore dates outside of the [startDate, endDate] range
                        if (inView && (!endDate || occurrenceDate <= endDate)) {
                            // return false if it's time to stop recurring
                            if (fn.apply(scope, [occurrenceDate, counter, counter === 1 && spansStart, timeSpan, ...extraArgs]) === false || (count && counter >= count)) {
                                return false;
                            }
                        }
                    }
                });
            }

            // get next month start
            yearStartDate = DateHelper.getNext(yearStartDate, 'year', interval);
            yearEndDate   = new Date(DateHelper.getNext(yearStartDate, 'year', 1) - 1);
        }

    }
}
