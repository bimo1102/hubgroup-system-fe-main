import Base from '../../../../Core/Base.js';
import DateHelper from '../../../../Core/helper/DateHelper.js';

/**
 * @module Scheduler/data/util/recurrence/AbstractRecurrenceIterator
 * @private
 */

const
    frequencyToUnitRe = /ly$/i,
    frequencyToUnit = frequency => {
        const result = frequency.replace(frequencyToUnitRe, '');

        return result === 'DAI' ? 'DAY' : result;
    },
    fn = (date, counter, isFirst, timeSpan) => timeSpan.buildOccurrence(date, isFirst),
    captureLastOccurrence = date => lastOccurrenceDate = date;

let lastOccurrenceDate;

export default class AbstractRecurrenceIterator extends Base {

    static processIterationConfig(config) {
        const
            { recurrence } = config,
            {
                frequency,
                interval,
                timeSpan,
                endDate : until,
                count
            } = recurrence;

        // Force the correction of the event to be in sync with its recurrence rule
        // before performing iteration. For example, if the event's configured startDate
        // is 1st January 2020, and the rule dictates that the event will take place
        // monthly, every Monday, then the first event is not until Monday 6th January, 2020.
        if (!config.syncingStartDate && !timeSpan.meta.isSyncedWithRule) {
            // Do not generate occurrences outside of the specified range
            const
                intervalEndDate = DateHelper.add(timeSpan.startDate, interval, frequencyToUnit(frequency)),
                endDate = DateHelper.min(
                    intervalEndDate,
                    config.endDate || intervalEndDate
                );

            this.forEachDate({
                syncingStartDate : true,
                startDate        : timeSpan.startDate,
                endDate,
                recurrence,
                fn
            });
        }

        // Capture the start after its been synced with its recurrence rule
        const timeSpanStart = timeSpan.startDate;

        // Extract the endDate from the config, defaulting to the recurrence UNTIL date
        let {
            startDate = timeSpanStart,
            endDate   = until
        } = config;

        // No point in starting the iteration before the event starts
        if (startDate < timeSpanStart) {
            startDate = timeSpanStart;
        }

        // The recurrence's stop date overrides the configured endDate.
        if (until) {
            if (!endDate || endDate > until) {
                endDate = until;
            }
        }
        // If we are limiting using count and we are not starting from the
        // first occurrence, then we have to calculate a stop date.
        // This is because for date ranges in the future we cannot calculate how many
        // preceding occurrences there may have been.
        else if (count && startDate > timeSpanStart) {
            // Iterate the occurrences from the start to capture the last one
            this.forEachDate({
                recurrence,
                fn : captureLastOccurrence
            });

            // The date of the last occurrence in the count sequence overrides the configured endDate.
            if (!endDate || endDate > lastOccurrenceDate) {
                endDate = lastOccurrenceDate;
            }
        }

        // Preserve the requested start of requested visits.
        const earliestVisibleDate = startDate;

        // Unless we are only asked for events which *start* within the time range. we must make
        // a best attempt to include any occurrences which span the start date.
        // So if we are asking for events from the 1st of the month, and there's an event
        // which runs every 2 months from the 15th to the 5th, we must include it. Start the
        // iteration <interval> full frequency quanta before the requested start.
        // This will only cause <interval> extra iterations.
        // We cannot step back to before the event's starting date though.
        if (!config.startOnly) {
            startDate = new Date(DateHelper.max(DateHelper.add(startDate, -interval, frequencyToUnit(frequency)), timeSpanStart));
        }

        return Object.assign({
            extraArgs : [],
            // Only check start date for time spans with 0 duration
            startOnly : !Boolean(timeSpan.durationMS)
        }, config, {
            startDate,
            endDate,
            timeSpan,
            timeSpanStart,
            earliestVisibleDate,
            durationMS : timeSpan.durationMS,
            spansStart : startDate <= timeSpanStart && endDate > timeSpanStart
        });
    }

    static get frequency() {
        return 'NONE';
    }

    static get MAX_OCCURRENCES_COUNT() {
        return 1000000;
    }

    static getOccurrenceIndex(event) {
        if (event.isOccurrence) {
            return DateHelper.diff(event.recurringTimeSpan.startDate, event.startDate, frequencyToUnit(event.recurringTimeSpan.recurrence.frequency));
        }
    }

    /**
     * Returns Nth occurrence of a week day in the provided period of time.
     * @param  {Date} startDate Period start date.
     * @param  {Date} endDate   Period end date.
     * @param  {Integer} day    Week day (0 - Sunday, 1 - Monday, 2 - Tuesday, etc.)
     * @param  {Integer} index  Index to find.
     * @return {Date}           Returns the found date or null if there is no `index`th entry.
     * @private
     */
    static getNthDayInPeriod(startDate, endDate, day, index) {
        let result, sign, borderDate;

        if (index) {
            const dayDurationInMs = 86400000,
                weekDurationInMs  = 604800000;

            if (index > 0) {
                sign = 1;
                borderDate = startDate;
            }
            else {
                sign = -1;
                borderDate = endDate;
            }

            // delta between requested day and border day
            const delta = day - borderDate.getDay();

            // if the requested day goes after (before, depending on borderDate used (start/end))
            // we adjust index +/-1
            if (sign * delta < 0) {
                index += sign;
            }

            // measure "index" weeks forward (or backward) ..take delta into account
            result = new Date(borderDate.getTime() + (index - sign) * weekDurationInMs + delta * dayDurationInMs);

            // if resulting date is outside of the provided range there is no "index"-th entry
            // of the day
            if (result < startDate || result > endDate) {
                result = null;
            }
        }

        return result;
    }

    static buildDate(year, month, date) {
        const dt = new Date(year, month, date);

        if (dt.getFullYear() === year && dt.getMonth() === month && dt.getDate() === date) {
            return dt;
        }
    }

    static isValidPosition(position) {
        return Boolean(position);
    }

    static forEachDateAtPositions(dates, positions, fn, scope) {
        const datesLength = dates.length,
            processed     = {};

        for (let i = 0; i < positions.length; i++) {

            const index = positions[i];

            if (this.isValidPosition(index)) {
                const date = index > 0 ? dates[index - 1] : dates[datesLength + index];

                if (date && !processed[date.getTime()]) {

                    // remember that we've returned the date
                    processed[date.getTime()] = true;

                    // return false if it's time to stop recurring
                    if (fn.call(scope, date) === false) {
                        return false;
                    }
                }
            }
        }
    }

    static isInView(startOnly, occurrenceDate, earliestVisibleDate, durationMS, timeSpan) {
        return (
            startOnly
                ? occurrenceDate >= earliestVisibleDate
                : occurrenceDate.valueOf() + durationMS > earliestVisibleDate
        ) && !timeSpan.hasException(occurrenceDate);
    }
}
