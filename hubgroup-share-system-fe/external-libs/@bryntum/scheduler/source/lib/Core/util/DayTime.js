import DH from '../../Core/helper/DateHelper.js';

/**
 * @module Core/util/DayTime
 */

const
    MILLIS_PER_MINUTE = 60 * 1000,
    MILLIS_PER_HOUR   = 60 * MILLIS_PER_MINUTE,
    MILLIS_PER_DAY    = 24 * MILLIS_PER_HOUR,
    timeRe            = /(\d+)?:?(\d*)/;

/**
 * This class encapsulates time of day calculations.
 *
 * The goal is to describe a "day" (a 24-hour period) that starts at a specific time (other than midnight). In a
 * calendar day view, this would look like this:
 * ```
 *              startShift=0                          startShift='12:00'
 *       00:00  +-------+                      12:00  +-------+
 *              |       |                             |       |
 *       01:00  |- - - -|                      13:00  |- - - -|
 *                 ...                                   ...
 *              |       |                             |       |
 *       08:00  |- - - -|   <-- timeStart -->  20:00  |- - - -|
 *              |       |                             |       |
 *       09:00  |- - - -|                      21:00  |- - - -|
 *              |       |                             |       |
 *       10:00  |- - - -|                      22:00  |- - - -|
 *              |       |                             |       |
 *       11:00  |- - - -|                      23:00  |- - - -|
 *              |       |                             |       |
 *       12:00  |- - - -|                      00:00  |- - - -|
 *              |       |                             |       |
 *       13:00  |- - - -|                      01:00  |- - - -|
 *              |       |                             |       |
 *       14:00  |- - - -|                      02:00  |- - - -|
 *              |       |                             |       |
 *       15:00  |- - - -|                      03:00  |- - - -|
 *              |       |                             |       |
 *       16:00  |- - - -|                      04:00  |- - - -|
 *              |       |                             |       |
 *       17:00  |- - - -|    <-- timeEnd -->   05:00  |- - - -|
 *              |       |                             |       |
 *                 ...                                   ...
 *              |       |                             |       |
 *       23:00  |- - - -|                      11:00  |- - - -|
 *              |       |                             |       |
 *       00:00  +-------+                      12:00  +-------+
 * ```
 * In a horizontal format with X for times to render:
 * ```
 *  startShift = 0
 *
 *      +---+---+---  --+---+---+---+--   --+---+---+---+--   --+---+
 *      |   |   |  ...  |   |XXX|XXX|  ...  |XXX|XXX|   |  ...  |   |
 *      +---+---+---  --+---+---+---+--   --+---+---+---+--   --+---+
 *      00  01  02      07  08  09  10      15  16  17  18      23  00
 *                          ^                       ^
 *                      timeStart               timeEnd
 *
 *  startShift = '12:00'
 *
 *      +---+---+---  --+---+---+---+--   --+---+---+---+--   --+---+
 *      |   |   |  ...  |   |XXX|XXX|X ... X|XXX|XXX|   |  ...  |   |
 *      +---+---+---  --+---+---+---+--   --+---+---+---+--   --+---+
 *      12  13  14      19  20  21  22      03  04  05  06      11  12
 *                          ^                       ^
 *                      timeStart               timeEnd
 * ```
 * When the day wraps over midnight, it is describing this (note timeEnd < timeStart):
 * ```
 *      +---+---+---  --+---+---+---+--   --+---+---+---+--   --+---+
 *      |XXX|XXX|X ... X|XXX|   |   |  ...  |   |   |XXX|X ... X|XXX|
 *      +---+---+---  --+---+---+---+--   --+---+---+---+--   --+---+
 *      00  01  02      04  05  06  07      18  19  20  21      23  00
 *                          ^                       ^
 *                      timeEnd                 timeStart
 * ```
 * @internal
 */
export default class DayTime {
    /**
     * Returns a string of "HH:MM" for a given time of day in milliseconds.
     * @param {Number} timeOfDay The time of day in milliseconds.
     * @returns {String}
     * @private
     */
    static format(timeOfDay) {
        const
            h = Math.floor(timeOfDay / MILLIS_PER_HOUR),
            m = Math.floor(timeOfDay / MILLIS_PER_MINUTE) % 60;

        return `${h}:${m < 10 ? '0' : ''}${m}`;
    }

    /**
     * Parses a time of day which may be a number (0-24 for the hour of the day) or a string in "H:MM" format and
     * returns the time of day as a number of milliseconds.
     *
     * If `time` is a `Date` instance, its time of day is returned.
     * @param {Date|Number|String} time
     * @returns {Number}
     * @private
     */
    static parse(time) {
        const type = typeof time;

        if (type === 'string') {
            const match = timeRe.exec(time);

            time = Number(match[1] || 0) * MILLIS_PER_HOUR + Number(match[2] || 0) * MILLIS_PER_MINUTE;
        }
        else if (type !== 'number') {
            time = DH.getTimeOfDay(time);
        }
        else if (time <= 24) {  // if number of hours (as provided during config)
            time *= MILLIS_PER_HOUR;
        }

        return Math.min(Math.max(Math.floor(time), 0), MILLIS_PER_DAY);
    }

    constructor(config) {
        let startShift = 0,
            startTime, endTime;

        if (config?.isDayView) {
            // These are raw configs in hrs or 'HH:MM' on construction and millis after:
            startShift = config.dayStartShift;
            startTime = config.dayStartTime;
            endTime = config.dayEndTime;
        }
        else if (typeof config === 'number') {
            startShift = startTime = endTime = config;
        }
        else if (config) {
            /**
             * Either the hour number or a *24 hour* `HH:MM` string denoting the start time for the day. This is
             * midnight by default.
             * @config {Number|String} startShift
             * @default 0
             */
            startShift = config.startShift;

            /**
             * Either the hour number or a *24 hour* `HH:MM` string denoting the first visible time of day. You can also
             * set this value to a ms timestamp representing time from midnight.
             * @config {Number|String} timeStart
             * @default 0
             */
            startTime = config.timeStart;

            /**
             * Either the hour number or a *24 hour* `HH:MM` string denoting the last visible time of day. You can also
             * set this value to a ms timestamp representing time from midnight.
             * @config {Number|String} timeEnd
             * @default 24
             */
            endTime = config.timeEnd;
        }

        this.startShift = startShift = DayTime.parse(startShift || 0);
        this.timeEnd    = ((endTime == null)
            ? (startShift + MILLIS_PER_DAY) % MILLIS_PER_DAY
            : DayTime.parse(endTime)) || MILLIS_PER_DAY;
        this.timeStart  = (startTime == null) ? startShift : DayTime.parse(startTime);
    }

    get startHour() {
        return Math.floor(this.timeStart / MILLIS_PER_HOUR);
    }

    /**
     * The number of milliseconds from the day's `startShift` to its `timeStart`.
     * @member {Number}
     */
    get startTimeOffsetMs() {
        const { startShift, timeStart } = this;

        return (timeStart < startShift) ? MILLIS_PER_DAY - startShift + timeStart : (timeStart - startShift);
    }

    /**
     * The `Date` object for the most recently started, shifted day. The time of this `Date` will be the `startShift`.
     * It is possible for this date to be yesterday on a midnight-based calendar. For example, if the `startShift` is
     * 6PM and the current time is 6AM on May 20, this value will be 6PM of May 19 (the most recently started day).
     * @member {Date}
     */
    get today() {
        return this.startOfDay(new Date());
    }

    /**
     * Returns `Date` object for the nearest (shifted) day ending after the given `date`. The time of this `Date` will
     * be the `startShift`.
     *
     * It is possible for this date to be in the next day on a midnight-based calendar. For example, if the `startShift`
     * is 6PM and `date` is 7PM on May 20, this method will return 6PM of May 21 (the nearest day ending).
     * @param {Date} date The date for which to find the nearest day ending.
     * @returns {Date}
     */
    ceil(date) {
        const ret = this.startOfDay(date);

        if (ret < date) {
            ret.setDate(ret.getDate() + 1);
        }

        return ret;
    }

    /**
     * Returns `true` if the time of day for the given `date` is between `timeStart` and `timeEnd`.
     * @param {Date|Number|String} date The hour number, 'HH:MM' time or a `Date` instance to test.
     * @returns {Boolean}
     */
    contains(date) {
        return !this.outside(date);
    }

    /**
     * Returns a "YYYY-MM-DD" string for the given `date`. This value will match the `date` if the time of day is at or
     * after `startShift`, but will be the prior date otherwise.
     * @param {Date|Number} date The date from which to compute the 'YYYY-MM-DD' key.
     * @returns {String}
     */
    dateKey(date) {
        date = this.shiftDate(date, -1);

        return DH.makeKey(date);
    }

    /**
     * Returns a `Date` instance with `startShift` as the time of day and the Y/M/D of the given `date`.
     * @param {Date} date The date's year, month, and day values.
     * @returns {Date}
     */
    dayOfDate(date) {
        return this.shiftDate(DH.clearTime(date));  // return the Date w/the matching YYYY-MM-DD value
    }

    /**
     * Returns the day of week (0-8) for the given `date`. This value will match the `date` if the time of day is at or
     * after `startShift`, but will be the prior day otherwise.
     * @param {Date|Number} date The date from which to compute the day of week.
     * @returns {Number}
     */
    dayOfWeek(date) {
        date = this.shiftDate(date, -1);

        return date.getDay();
    }

    /**
     * Returns the difference between the time of day of the given `date` and `timeStart` in the specified time `unit`.
     * @param {Date|Number|String} date The hour number, 'HH:MM' time or a `Date` instance.
     * @param {String} unit The desired unit of time to return (see {@link Core.helper.DateHelper#function-as-static}).
     * @returns {Number}
     */
    delta(date, unit = 'ms') {
        const
            { timeStart } = this,
            time = DayTime.parse(date),
            t = ((time < timeStart) ? time + MILLIS_PER_DAY : time) - timeStart;

        return (unit === 'ms') ? t : DH.as(unit, t, 'ms');
    }

    /**
     * Returns the duration of the visible day (between `timeStart` and `timeEnd`) in the specified time `unit`.
     * @param {String} unit The desired unit of time to return (see {@link Core.helper.DateHelper#function-as-static}).
     * @returns {Number}
     */
    duration(unit = 'ms') {
        const
            { timeStart, timeEnd } = this,
            millis = (timeStart < timeEnd) ? timeEnd - timeStart : (MILLIS_PER_DAY - timeStart + timeEnd);

        return (unit === 'ms') ? millis : DH.as(unit, millis, 'ms');
    }

    /**
     * Returns `true` if this instance describes the same day as the `other`.
     * @param {Core.util.DayTime} other The other instance to which `this` instance should be tested for equality.
     * @returns {Boolean}
     */
    equals(other) {
        // we only need on "?." operator since we short-circuit
        return this.startShift === other?.startShift && this.timeStart === other.timeStart && this.timeEnd === other.timeEnd;
    }

    /**
     * Returns `true` if the times of day described by `startDate` and `endDate` intersect the visible time of this day.
     * @param {Date} startDate The start date of the date range or an event record containing both startDate and endDate
     * fields.
     * @param {Date} [endDate] The end date if `startDate` is not an event record.
     * @returns {Boolean}
     */
    intersects(startDate, endDate) {
        const
            me                     = this,
            { timeStart, timeEnd } = me,
            [date0, date1]         = me._dateRangeArgs(startDate, endDate),
            [start, end]           = me.timeRange(date0, date1);

        if (timeStart < timeEnd) {
            if (start < end) {
                return start < timeEnd && timeStart <= end;
            }

            return start < timeEnd || timeStart <= end;
        }

        return !(start < end) || start < timeEnd || timeStart <= end;
    }

    /**
     * Returns `true` if the given date range is contained within one day.
     * @param {Date} startDate The start date of the date range or an event record containing both startDate and endDate
     * fields.
     * @param {Date} [endDate] The end date if `startDate` is not an event record.
     * @returns {Boolean}
     */
    isIntraDay(startDate, endDate) {
        const
            me             = this,
            [date0, date1] = me._dateRangeArgs(startDate, endDate),
            dayStart       = me.startOfDay(date0),
            diff           = MILLIS_PER_DAY - DH.diff(dayStart, date1, 'ms');

        // Not <= to match isInterDay
        if (diff < 0) {
            return false;
        }

        // diff > 0 means less than 24hrs, so intraDay... diff==0 means date1 was EOD so we are intraDay if date0 is not
        // also at EOD.
        return diff > 0 || dayStart < date0;
    }

    /**
     * Returns -1, 0, or 1 based on whether the time of day for the given `date` is before `timeStart` (-1), or after
     * `timeEnd` (1), or between these times (0).
     * @param {Date|Number|String} date The hour number, 'HH:MM' time or a `Date` instance to test.
     * @returns {Number}
     */
    outside(date) {
        const
            { startShift, timeStart, timeEnd } = this,
            time = DayTime.parse(date);

        if (timeStart < timeEnd) {
            /*
             *      +---+---+---  --+---+---+---+--   --+---+---+---+--   --+---+
             *      |   |   |  ...  |   |XXX|XXX|  ...  |XXX|XXX|   |  ...  |   |
             *      +---+---+---  --+---+---+---+--   --+---+---+---+--   --+---+
             *      00  01  02      07  08  09  10      15  16  17  18      23  00
             *                          ^                       ^
             *                      timeStart               timeEnd
             */
            if (time < timeStart) {
                return (time < startShift) ? 1 : -1;
            }

            if (time < timeEnd) {
                return 0;
            }

            return (time < startShift) ? -1 : 1;
        }

        /*
         *      +---+---+---  --+---+---+---+--   --+---+---+---+--   --+---+
         *      |XXX|XXX|X ... X|XXX|   |   |  ...  |   |   |XXX|X ... X|XXX|
         *      +---+---+---  --+---+---+---+--   --+---+---+---+--   --+---+
         *      00  01  02      04  05  06  07      18  19  20  21      23  00
         *                          ^                       ^
         *                      timeEnd                 timeStart
         */
        if (time < timeEnd || time >= timeStart) {
            return 0;
        }

        return (time < startShift) ? 1 : -1;
    }

    /**
     * Returns the given `date` shifted forward (`direction` > 0) or backward (`direction` < 0) by the `startShift`.
     * @param {Number|Date} date The date as a `Date` or the millisecond UTC epoch.
     * @param {Number} direction A value > 0 to shift `date` forward, or < 0 to shift it backwards.
     * @returns {Date}
     */
    shiftDate(date, direction = 1) {
        const { startShift } = this;

        date = (typeof date === 'number') ? new Date(date) : date;

        return (direction && startShift) ? DH.add(date, (direction > 0) ? startShift : -startShift, 'ms') : date;
    }

    /**
     * Returns `Date` object for the nearest started (shifted) day prior to the given `date`. The time of this `Date`
     * will be the `startShift`.
     *
     * It is possible for this date to be in the prior day on a midnight-based calendar. For example, if the `startShift`
     * is 6PM and `date` is 6AM on May 20, this method will return 6PM of May 19 (the nearest started day).
     * @param {Date} date The date for which to find the nearest started day.
     * @returns {Date}
     */
    startOfDay(date) {
        date = this.shiftDate(date, -1);
        date = DH.clearTime(date);
        date = this.shiftDate(date);

        return date;
    }

    /**
     * TODO
     * @param {Date} startDate The start date of the date range or an event record containing both startDate and endDate
     * fields.
     * @param {Date} [endDate] The end date if `startDate` is not an event record.
     * @returns {Number[]}
     */
    timeRange(startDate, endDate) {
        const [start, end] = this._dateRangeArgs(startDate, endDate);

        return [DH.getTimeOfDay(start), DH.getTimeOfDay(end)];
    }

    toString() {
        const
            { startShift, timeEnd, timeStart } = this,
            suffix = startShift ? `@${DayTime.format(startShift)}` : '',
            prefix = DayTime.format(timeStart);

        if (timeStart === timeEnd) {
            return startShift ? suffix : prefix;
        }

        return `${prefix}-${DayTime.format(timeEnd)}${suffix}`;
    };

    /**
     * Decodes the arguments and returns a pair of `Date` objects for the start and end of the date range.
     * @param {Date} startDate The start date of the date range or an event record containing both startDate and endDate
     * fields.
     * @param {Date} [endDate] The end date if `startDate` is not an event record.
     * @returns {Date[]}
     * @private
     */
    _dateRangeArgs(startDate, endDate) {
        return startDate.isModel ? [startDate.startDate, startDate.endingDate] : [startDate, endDate];
    }

}

/**
 * The `DayTime` instance representing a canonical calendar day (starting at midnight).
 * @member {Core.util.DayTime} MIDNIGHT
 * @static
 * @readonly
 */
DayTime.MIDNIGHT = new DayTime({
    startShift : 0,
    startTime  : 0,
    endTime    : 24
});

DayTime.MILLIS_PER_MINUTE = MILLIS_PER_MINUTE;
DayTime.MILLIS_PER_HOUR = MILLIS_PER_HOUR;
DayTime.MILLIS_PER_DAY = MILLIS_PER_DAY;
