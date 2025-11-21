import Base from '../Base.js';
import DayTime from './DayTime.js';
import Events from '../mixin/Events.js';
import DH from '../helper/DateHelper.js';
import ObjectHelper from '../helper/ObjectHelper.js';

/**
 * @module Core/util/Month
 */

/**
 * A class which encapsulates a calendar view of a month, and offers information about
 * the weeks and days within that calendar view.
 * ```
 *   // December 2018 using Monday as week start
 *   const m = new Month({
 *       date         : '2018-12-01',
 *       weekStartDay : 1
 *   });
 *
 *   m.eachWeek((week, dates) => console.log(dates.map(d => d.getDate())))
 * ```
 */
export default class Month  extends Events(Base) {
    static get configurable() {
        return {
            /**
             * The date which the month should encapsulate. May be a `Date` object, or a
             * `YYYY-MM-DD` format string.
             *
             * Mutating a passed `Date` after initializing a `Month` object has no effect on
             * the `Month` object.
             * @config {Date|String}
             */
            date : {
                $config : {
                    equal : 'date'
                },
                value : DH.clearTime(new Date())
            },

            month : null,

            year : null,

            /**
             * The week start day, 0 meaning Sunday, 6 meaning Saturday.
             * Defaults to {@link Core.helper.DateHelper#property-weekStartDay-static}.
             * @config {Number}
             */
            weekStartDay : null,

            /**
             * Configure as `true` to have the visibleDayColumnIndex and visibleColumnCount properties
             * respect the configured {@link #config-nonWorkingDays}.
             * @config {Boolean}
             */
            hideNonWorkingDays : null,

            /**
             * Non-working days as an object where keys are day indices, 0-6 (Sunday-Saturday), and the value is `true`.
             * Defaults to {@link Core.helper.DateHelper#property-nonWorkingDays-static}.
             * @config {Object}
             */
            nonWorkingDays : null,

            /**
             * Configure as `true` to always have the month encapsulate six weeks.
             * This is useful for UIs which must be a fixed height.
             * @config {Boolean}
             */
            sixWeeks : null
        };
    }

    //region events

    /**
     * Fired when setting the {@link #config-date} property causes the encapsulated date to change
     * in **any** way, date, week, month or year.
     * @event dateChange
     * @param {Core.util.Month} source The Month which triggered the event.
     * @param {Date} newDate The new encapsulated date value.
     * @param {Date} oldDate The previous encapsulated date value.
     * @param {Number} changes An object which contains properties which indicate what part of the date changed.
     * @param {Boolean} changes.d True if the date changed in any way.
     * @param {Boolean} changes.w True if the week changed (including same week in a different year).
     * @param {Boolean} changes.m True if the month changed (including same month in a different year).
     * @param {Boolean} changes.y True if the year changed.
     */

    /**
     * Fired when setting the {@link #config-date} property causes a change of week. Note that
     * weeks are calculated in the ISO standard form such that if there are fewer than four
     * days in the first week of a year, then that week is owned by the previous year.
     *
     * The {@link #config-weekStartDay} is honoured when making this calculation and this is a
     * locale-specific value which defaults to the ISO standard of 1 (Monday) in provided European
     * locales and 0 (Sunday) in the provided US English locale.
     * @event weekChange
     * @param {Core.util.Month} source The Month which triggered the event.
     * @param {Date} newDate The new encapsulated date value.
     * @param {Date} oldDate The previous encapsulated date value.
     * @param {Number} changes An object which contains properties which indicate what part of the date changed.
     * @param {Boolean} changes.d True if the date changed in any way.
     * @param {Boolean} changes.w True if the week changed (including same week in a different year).
     * @param {Boolean} changes.m True if the month changed (including same month in a different year).
     * @param {Boolean} changes.y True if the year changed.
     */

    /**
     * Fired when setting the {@link #config-date} property causes a change of month. This
     * will fire when changing to the same month in a different year.
     * @event monthChange
     * @param {Core.util.Month} source The Month which triggered the event.
     * @param {Date} newDate The new encapsulated date value.
     * @param {Date} oldDate The previous encapsulated date value.
     * @param {Number} changes An object which contains properties which indicate what part of the date changed.
     * @param {Boolean} changes.d True if the date changed in any way.
     * @param {Boolean} changes.w True if the week changed (including same week in a different year).
     * @param {Boolean} changes.m True if the month changed (including same month in a different year).
     * @param {Boolean} changes.y True if the year changed.
    */

    /**
     * Fired when setting the {@link #config-date} property causes a change of year.
     * @event yearChange
     * @param {Core.util.Month} source The Month which triggered the event.
     * @param {Date} newDate The new encapsulated date value.
     * @param {Date} oldDate The previous encapsulated date value.
     * @param {Number} changes An object which contains properties which indicate what part of the date changed.
     * @param {Boolean} changes.d True if the date changed in any way.
     * @param {Boolean} changes.w True if the week changed (including same week in a different year).
     * @param {Boolean} changes.m True if the month changed (including same month in a different year).
     * @param {Boolean} changes.y True if the year changed.
     */

    //endRegion

    /**
     * For use when this Month's `weekStartDay` is non-zero.
     *
     * An array to map the days of the week 0-6 of this Calendar to the canonical day numbers
     * used by the Javascript [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) object.
     * @member {Number[]} canonicalDayNumbers
     * @readonly
     */

    /**
     * An array to map a canonical day number to a *visible* column index.
     * For example, if we have `weekStartDay` as Monday which is 1, and non working days as
     * Wednesday, and `hideNonWorkingDays : true`, then the calendar would look like
     *
     *```
     * ┌────┬────┬────┬────┬────┬────┐
     * | Mo | Tu | Th | Fr | Sa | Su |
     * └────┴────┴────┴────┴────┴────┘
     *```
     *
     * So we'd need this array: `[ 5, 0, 1, undefined, 2, 3, 4]`
     * @member {Number[]} visibleDayColumnIndex
     * @readonly
     */

    /**
     * An array to map a canonical day number to a 0-6 column index.
     * For example, if we have `weekStartDay` as Monday which is 1, then the calendar would look like
     *
     *```
     * ┌────┬────┬────┬────┬────┬────┬────┐
     * | Mo | Tu | We | Th | Fr | Sa | Su |
     * └────┴────┴────┴────┴────┴────┴────┘
     *```
     *
     * So we'd need this array: `[ 6, 0, 1, 2, 3, 4, 5]`
     * @member {Number[]} dayColumnIndex
     * @readonly
     */

    /**
     * The number of visible days in the week as defined by the `nonWorkingDays` and
     * `hideNonWorkingDays` options.
     * @member {Number} weekLength
     * @readonly
     */

    configure(config) {
        super.configure(config);

        this.updateDayNumbers();

        // The set is rejected during configuration because everything else has to be set up.
        if (config.date) {
            this.date = config.date;
        }
    }

    changeDate(date) {
        // Date has to be set after we know everything else
        if (this.isConfiguring) {
            return;
        }

        date = typeof date === 'string' ? DH.parse(date, 'YYYY-MM-DD') : new Date(date);

        if (isNaN(date)) {
            throw new Error('Month date ingestion must be passed a Date, or a valid YYYY-MM-DD date string');
        }

        return date;
    }

    updateDate(newDate, oldDate) {
        const
            me            = this,
            {
                dayColumnIndex
            }             = me,
            monthStart    = DH.getFirstDateOfMonth(newDate),
            monthEnd      = DH.getLastDateOfMonth(monthStart),
            startWeekDay  = dayColumnIndex[monthStart.getDay()],
            endWeekDay    = dayColumnIndex[monthEnd.getDay()],
            yearChanged   = !oldDate || (newDate.getFullYear() !== oldDate.getFullYear()),
            // Collect changes as bitwise flags if we have any listeners:
            // 0001 = date has changed.
            // 0010 = week has changed.
            // 0100 = month has changed.
            // 1000 = year has changed.
            // We need this because 10/1/2010 -> 10/1/2011 must fire a dateChange
            // and a monthChange in addition to the yearChange.
            // And 10/1/2010 -> 10/2/2010 must fire a dateChange in addition to the monthChange.
            changes = me.eventListeners && (oldDate ? (newDate.getDate() !== oldDate.getDate()) |
            (me.getWeekId(newDate) !== me.getWeekId(oldDate)) << 1 |
            (newDate.getMonth() !== oldDate.getMonth()) << 2 |
            yearChanged << 3 : 15);

        // Keep our properties in sync with reality.
        // Access the private properties directly to avoid recursion.
        me._year = newDate.getFullYear();
        me._month = newDate.getMonth();

        // These comments assume ISO standard of Monday as week start day.
        //
        // This is the date of month that is the beginning of the first week row.
        // So this may be -ve. Eg: for Dec 2018, Monday 26th Nov is the first
        // cell on the calendar which is the -4th of December. Note that the 0th
        // of December was 31st of November, so needs -4 to get back to the 26th.
        me.startDayOfMonth = 1 - startWeekDay;

        // This is the date of month that is the end of the last week row.
        // So this may be > month end. Eg: for Dec 2018, Sunday 6th Jan is the last
        // cell on the calendar which is the 37th of December.
        me.endDayOfMonth = monthEnd.getDate() + (6 - endWeekDay);

        if (me.sixWeeks) {
            me.endDayOfMonth += (6 - me.weekCount) * 7;
        }

        // Calculate the start point of where we calculate weeks from if we need to.
        // It's either the first "weekStartDay" in this year if this year's
        // first week is last year's, and so should work out as zero,
        // or the "weekStartDay" of the week before, so that dates in the first week
        // the Math.floor(DH.diff(weekBase, date, 'day') / 7) calculates as 1.
        if (!me.weekBase || yearChanged) {
            me.calculateWeekBase();
        }

        if (changes) {
            const event = {
                newDate,
                oldDate,
                changes : {
                    d : true,
                    w : Boolean(changes & 2),
                    m : Boolean(changes & 12),
                    y : Boolean(changes & 8)
                }
            };

            // If either date, month or year changes, we fire a dateChange
            me.trigger('dateChange', event);

            // If the week has changed, fire a weekChange
            if (changes & 2) {
                me.trigger('weekChange', event);
            }

            // If month or year changed, we fire a monthChange
            if (changes & 12) {
                me.trigger('monthChange', event);
            }

            // If the year has changed, fire a yearChange
            if (changes & 8) {
                me.trigger('yearChange', event);
            }
        }
    }

    calculateWeekBase() {
        const
            me      = this,
            {
                dayColumnIndex
            }       = me,
            jan1    = new Date(me.year, 0, 1),
            dec31   = new Date(me.year, 11, 31),
            january = me.month ? me.getOtherMonth(jan1) : me;

        // First 7 days are in last week of previous year if the year
        // starts after our 4th day of week.
        if (me.dayColumnIndex[jan1.getDay()] > 3) {
            // Week base is calculated from the year start
            me.weekBase = january.startDate;
        }
        // First 7 days are in week 1 of this year
        else {
            // Week base is the start of week before
            me.weekBase = new Date(me.year, 0, january.startDayOfMonth - 7);
        }

        const dec31Week = Math.floor(DH.diff(me.weekBase, dec31, 'day') / 7);

        // Our year only has a 53rd week if 53rd week ends after our week's 3rd day
        me.has53weeks = dec31Week === 53 && dayColumnIndex[dec31.getDay()] > 2;
    }

    /**
     * Returns the week start date, based on the configured {@link #config-weekStartDay} of the
     * passed week.
     * @param {Number| Number[]} week The week number in the current year, or an array containing
     * `[year, weekOfYear]` for any year.
     *
     * Week numbers greater than the number of weeks in the year just wrap into the following year.
     */
    getWeekStart(week) {
        // Week number n of current year
        if (typeof week === 'number') {
            return DH.add(this.weekBase, Math.max(week, 1) * 7, 'day');
        }

        // Week n of year nnnn
        const
            me = this,
            [year, weekOfYear] = week;

        // nnnn is our year, so we know it
        if (year === me.year) {
            return me.getWeekStart(weekOfYear);
        }

        return me.getOtherMonth(new Date(year, 0, 1)).getWeekStart(weekOfYear);
    }

    getOtherMonth(date) {
        const
            me     = this,
            result = (me === otherMonth) ? new Month(null) : otherMonth;

        result.configure({
            weekBase           : null,
            weekStartDay       : me.weekStartDay,
            nonWorkingDays     : me.nonWorkingDays,
            hideNonWorkingDays : me.hideNonWorkingDays,
            sixWeeks           : me.sixWeeks,
            date               : new Date(date.getFullYear(), 0, 1) // Make it easy to calculate its own weekBase
        });

        result.date = date;

        // in this case, the date config ignores changes w/=== getTime so we have to force the update because we
        // also cleared weekBase above
        result.updateDate(result.date, result.date);

        return result;
    }

    changeYear(year) {
        const newDate = new Date(this.date);

        newDate.setFullYear(year);

        // changeDate rejects non-changes, otherwise a change event will be emitted
        this.date = newDate;
    }

    changeMonth(month) {
        const newDate = new Date(this.date);

        newDate.setMonth(month);

        // changeDate rejects non-changes, otherwise a change event will be emitted
        this.date = newDate;
    }

    get weekStartDay() {
        // This trick allows our weekStartDay to float w/the locale even if the locale changes
        return typeof this._weekStartDay === 'number' ? this._weekStartDay : DH.weekStartDay;
    }

    updateWeekStartDay() {
        const me = this;

        me.updateDayNumbers();

        if (!me.isConfiguring && me.date) {
            me.weekBase = null;  // force a calculateWeekBase
            me.updateDate(me.date, me.date);
        }
        // else date will be set soon and weekBase is null so calculateWeekBase will be called by updateDate
    }

    get nonWorkingDays() {
        return this._nonWorkingDays || DH.nonWorkingDays;
    }

    changeNonWorkingDays(nonWorkingDays) {
        return ObjectHelper.assign({}, nonWorkingDays);
    }

    updateNonWorkingDays() {
        this.updateDayNumbers();
    }

    updateHideNonWorkingDays() {
        this.updateDayNumbers();
    }

    updateSixWeeks() {
        if (!this.isConfiguring) {
            this.updateDate(this.date);
        }
    }

    /**
     * The number of days in the calendar for this month. This will always be
     * a multiple of 7, because this represents the number of calendar cells
     * occupied by this month.
     * @property {Number}
     * @readonly
     */
    get dayCount() {
        // So for the example month, Dec 2018 has 42 days, from Mon 26th Nov (-4th Dec) 2018
        // to Sun 6th Jan (37th Dec) 2019
        return (this.endDayOfMonth + 1) - this.startDayOfMonth;
    }

    /**
     * The number of weeks in the calendar for this month.
     * @property {Number}
     * @readonly
     */
    get weekCount() {
        return this.dayCount / 7;
    }

    /**
     * The date of the first cell in the calendar view of this month.
     * @property {Date}
     * @readonly
     */
    get startDate() {
        const me = this;

        if (me.year != null && me.month != null && me.startDayOfMonth != null) {
            return new Date(me.year, me.month, me.startDayOfMonth);
        }
    }

    /**
     * The date of the last cell in the calendar view of this month.
     * @property {Date}
     * @readonly
     */
    get endDate() {
        const me = this;

        if (me.year != null && me.month != null && me.startDayOfMonth != null) {
            return new Date(me.year, me.month, me.endDayOfMonth);
        }
    }

    /**
     * Iterates through all calendar cells in this month, calling the passed function for each date.
     * @param {Function} fn The function to call.
     * @param {Date} fn.date The date for the cell.
     */
    eachDay(fn) {
        for (let dayOfMonth = this.startDayOfMonth; dayOfMonth <= this.endDayOfMonth; dayOfMonth++) {
            fn(new Date(this.year, this.month, dayOfMonth));
        }
    }

    /**
     * Iterates through all weeks in this month, calling the passed function
     * for each week.
     * @param {Function} fn The function to call.
     * @param {Number[]} fn.week An array containing `[year, weekNumber]`
     * @param {Date[]} fn.dates The dates for the week.
     */
    eachWeek(fn) {
        const me = this,
            { weekCount } = me;

        for (let dayOfMonth = me.startDayOfMonth, week = 0; week < weekCount; week++) {
            const weekDates  = [],
                weekOfYear = me.getWeekNumber(new Date(me.year, me.month, dayOfMonth));

            for (let day = 0; day < 7; day++, dayOfMonth++) {
                weekDates.push(new Date(me.year, me.month, dayOfMonth));
            }
            fn(weekOfYear, weekDates);
        }
    }

    /**
     * Returns the week of the year for the passed date. This returns an array containing *two* values,
     * the year **and** the week number are returned.
     *
     * The week number is calculated according to ISO rules, meaning that if the first week of the year
     * contains less than four days, it is considered to be the last week of the preceding year.
     *
     * The configured {@link #config-weekStartDay} is honoured in this calculation. So if the weekStartDay
     * is **NOT** the ISO standard of `1`, (Monday), then the weeks do not coincide with ISO weeks.
     * @param {Date} date The date to calculate the week for.
     * @returns {Number[]} A numeric array: `[year, week]`
     */
    getWeekNumber(date) {
        const me = this;

        date = DH.clearTime(date);

        // If it's a date in another year, use our otherMonth to find the answer.
        if (date.getFullYear() !== me.year) {
            return me.getOtherMonth(new Date(date.getFullYear(), 0, 1)).getWeekNumber(date);
        }

        let weekNo = Math.floor(DH.diff(me.weekBase, date, 'day') / 7),
            year = date.getFullYear();

        // No week 0. It's the last week of last year
        if (!weekNo) {
            // Week is the week of last year's 31st Dec
            return me.getOtherMonth(new Date(me.year - 1, 0, 1)).getWeekNumber(new Date(me.year, 0, 0));
        }
        // Only week 53 if year ends before our week's 5th day
        else if (weekNo === 53 && !me.has53weeks) {
            weekNo = 1;
            year++;
        }
        // 54 wraps round to 2 of next year
        else if (weekNo > 53) {
            weekNo = weekNo % 52;
        }

        // Return array of year and week number
        return [year, weekNo];
    }

    getWeekId(date) {
        const week = this.getWeekNumber(date);

        return week[0] * 100 + week[1];
    }

    getCellData(date, ownerMonth, dayTime = DayTime.MIDNIGHT) {
        const
            me                 = this,
            day                = date.getDay(),
            visibleColumnIndex = me.visibleDayColumnIndex[day],
            isNonWorking       = me.nonWorkingDays[day],
            isHiddenDay        = me.hideNonWorkingDays && isNonWorking;

        // Automatically move to required month
        if (date < me.startDate || date > me.endDate) {
            me.month = date.getMonth();
        }

        return  {
            day,
            dayTime,
            visibleColumnIndex,
            isNonWorking,
            week        : me.getOtherMonth(date).getWeekNumber(date),
            key         : DH.format(date, 'YYYY-MM-DD'),
            columnIndex : me.dayColumnIndex[day],
            date        : new Date(date),

            // These two properties are only significant when used by a CalendarPanel which encapsulates
            // a single month.
            isOtherMonth : Math.sign((date.getMonth() + date.getFullYear() * 12) - (ownerMonth.month + ownerMonth.year * 12)),
            visible      : !isHiddenDay && (date >= ownerMonth.startDate && date < DH.add(ownerMonth.endDate, 1, 'day')),
            tomorrow     : dayTime.dayOfDate(DH.add(date, 1, 'day')),
            isRowStart   : visibleColumnIndex === 0,
            isRowEnd     : visibleColumnIndex === me.visibleColumnCount - 1
        };
    }

    updateDayNumbers() {
        const
            me                    = this,
            {
                weekStartDay,
                nonWorkingDays,
                hideNonWorkingDays
            }                     = me,
            dayColumnIndex        = me.dayColumnIndex = [],
            canonicalDayNumbers   = me.canonicalDayNumbers = [],
            visibleDayColumnIndex = me.visibleDayColumnIndex = [];

        // So, if they set weekStartDay to 1 meaning Monday which is ISO standard, we will
        // have mapping of internal day number to canonical day number (as used by Date class)
        // and to abbreviated day name like this:
        // canonicalDayNumbers = [1, 2, 3, 4, 5, 6, 0] // Use for translation from our day number to Date class's day number
        //
        // Also, we need a map from canonical day number to *visible* cell index.
        // for example, if we have weekStartDay as Monday which is 1, and non working days as
        // Wednesday, and hideNonWorkingDays:true, then the calendar would look like
        // +----+----+----+----+----+----+
        // | Mo | Tu | Th | Fr | Sa | Su |
        // +----+----+----+----+----+----+
        //
        // So we'd need this array
        // [ 5, 0, 1, undefined, 2, 3, 4]
        // Or think of it as this map:
        // {
        //      1 : 0,
        //      2 : 1,
        //      4 : 2,
        //      5 : 3,
        //      6 : 4,
        //      0 : 5
        // }
        // To be able to ascertain the cell index directly from the canonical day number.
        //
        // We also need a logical column map which would be
        // +----+----+----+----+----+----+----+
        // | Mo | Tu | We | Th | Fr | Sa | Su |
        // +----+----+----+----+----+----+----+
        //
        // So we'd need this array
        // [ 6, 0, 1, 2, 3, 4, 5]
        // Or think of it as this map:
        // {
        //      1 : 0,
        //      2 : 1,
        //      3 : 2
        //      4 : 3,
        //      5 : 4,
        //      6 : 5,
        //      0 : 6
        // }

        // We use this to cache the number of visible columns so that cell renderers can tell whether
        // they are on the last visible column.
        let visibleColumnIndex = 0;

        for (let columnIndex = 0; columnIndex < 7; columnIndex++) {
            const canonicalDay = (weekStartDay + columnIndex) % 7;

            canonicalDayNumbers[columnIndex] = canonicalDay;
            dayColumnIndex[canonicalDay] = columnIndex;

            // If this day is going to have visible representation, we need to
            // map it to a columnIndex;
            if (!hideNonWorkingDays || !nonWorkingDays[canonicalDay]) {
                visibleDayColumnIndex[canonicalDay] = visibleColumnIndex++;
            }
        }
        me.visibleColumnCount = visibleColumnIndex;
        me.weekLength = hideNonWorkingDays ? 7 - ObjectHelper.keys(nonWorkingDays).length : 7;
    }
}

// Instance needed for internal tasks
const otherMonth = new Month(null);
