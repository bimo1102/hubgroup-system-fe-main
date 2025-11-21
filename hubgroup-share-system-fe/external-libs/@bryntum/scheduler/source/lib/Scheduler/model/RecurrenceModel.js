import Model from '../../Core/data/Model.js';
import DateHelper from '../../Core/helper/DateHelper.js';
import RecurrenceDayRuleEncoder from '../data/util/recurrence/RecurrenceDayRuleEncoder.js';
import DailyRecurrenceIterator from '../data/util/recurrence/DailyRecurrenceIterator.js';
import WeeklyRecurrenceIterator from '../data/util/recurrence/WeeklyRecurrenceIterator.js';
import MonthlyRecurrenceIterator from '../data/util/recurrence/MonthlyRecurrenceIterator.js';
import YearlyRecurrenceIterator from '../data/util/recurrence/YearlyRecurrenceIterator.js';

/**
 * @module Scheduler/model/RecurrenceModel
 */

const recurrenceIterators = {};

[DailyRecurrenceIterator, WeeklyRecurrenceIterator, MonthlyRecurrenceIterator, YearlyRecurrenceIterator].forEach(it => {
    recurrenceIterators[it.frequency] = it;
});

function convertStringOfIntegerItemsValue(value) {
    if (value) {
        if (typeof value == 'string') {
            value = value.split(',').map(item => parseInt(item, 10));
        }
    }
    else {
        value = null;
    }

    return value;
}

function convertStringOfItemsValue(value) {
    if (value) {
        if (typeof value == 'string') {
            value = value.split(',');
        }
    }
    else {
        value = null;
    }

    return value;
}

function isEqualAsString(value1, value2) {
    return String(value1) === String(value2);
}

function convertInteger(value) {
    if (this.defaultValue && value === undefined) {
        return this.defaultValue;
    }

    if (this.allowNull && value == null) {
        return null;
    }

    value = parseInt(value);

    return isNaN(value) ? undefined : value;
}

/**
 * This class represents a timespan recurrence settings.
 * It is a subclass of {@link Core.data.Model} class.
 * Please refer to the documentation for that class to become familiar with the base interface of this class.
 *
 * The data source for these fields can be customized by subclassing this class.
 *
 * @extends Core/data/Model
 */
export default class RecurrenceModel extends Model {

    static get $name() {
        return 'RecurrenceModel';
    }

    /**
     * Indicates that this is a `RecurrenceModel` class instance
     * (allows to avoid using `instanceof`).
     * @property {Boolean}
     * @readonly
     */
    get isRecurrenceModel() {
        return true;
    }

    //region Fields
    static get fields() {
        return [
            /**
             * Field defines the recurrence frequency. Supported values are: `DAILY`, `WEEKLY`, `MONTHLY`, `YEARLY`.
             * @field {String} frequency
             */
            { name : 'frequency', defaultValue : 'DAILY' },
            /**
             * Field defines how often the recurrence repeats.
             * For example, if the recurrence is weekly its interval is 2, then the timespan repeats every two weeks.
             * @field {Number} interval
             */
            { name : 'interval', defaultValue : 1, convert : convertInteger },
            /**
             * End date of the recurrence. Specifies when the recurrence ends.
             * The value is optional, the recurrence can as well be stopped using {@link #field-count} field value.
             * @field {Date} endDate
             */
            { name : 'endDate', type : 'date' },
            /**
             * Specifies the number of occurrences after which the recurrence ends.
             * The value includes the associated timespan itself so values less than 2 make no sense.
             * The field is optional, the recurrence as well can be stopped using {@link #field-endDate} field value.
             * @field {Number} count
             */
            { name : 'count', allowNull : true, convert : convertInteger },
            /**
             * Specifies days of the week on which the timespan should occur.
             * An array of string values `SU`, `MO`, `TU`, `WE`, `TH`, `FR`, `SA`
             * corresponding to Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, and Saturday days of the week.
             * Each value can also be preceded by a positive (+n) or negative (-n) integer.
             * If present, this indicates the nth occurrence of a specific day within the monthly or yearly recurrence.
             *
             * **Not applicable** for daily {@link #field-frequency}.
             * @field {String[]} days
             */
            {
                name    : 'days',
                convert : convertStringOfItemsValue,
                isEqual : isEqualAsString
            },
            /**
             * Specifies days of the month on which the timespan should occur.
             * An array of integer values (-31..-1 - +1..+31, negative values mean counting backwards from the month end).
             * **Applicable only** for monthly {@link #field-frequency}.
             * @field {Number[]} monthDays
             */
            {
                name    : 'monthDays',
                convert : convertStringOfIntegerItemsValue,
                isEqual : isEqualAsString
            },
            /**
             * Specifies months of the year on which the timespan should occur.
             * An array of integer values (1 - 12).
             * **Applicable only** for yearly {@link #field-frequency}.
             * @field {Number[]} months
             */
            {
                name    : 'months',
                convert : convertStringOfIntegerItemsValue,
                isEqual : isEqualAsString
            },
            /**
             * The positions to include in the recurrence. The values operate on a set of recurrence instances **in one interval** of the recurrence rule.
             * An array of integer values (valid values are 1 to 366 or -366 to -1, negative values mean counting backwards from the end of the built list of occurrences).
             * **Not applicable** for daily {@link #field-frequency}.
             * @field {Number} positions
             */
            {
                name    : 'positions',
                convert : convertStringOfIntegerItemsValue,
                isEqual : isEqualAsString
            }
        ];
    }

    get dateFormat() {
        return this._dateFormat || 'YYYYMMDDTHHmmss';
    }

    set dateFormat(format) {
        this._dateFormat = format;
    }

    get recurrenceIterator() {
        //<debug>
        if (!recurrenceIterators[this.frequency]) {
            throw new Error(`Can't find iterator for ${this.frequency} frequency`);
        }
        //</debug>

        return recurrenceIterators[this.frequency];
    }

    /**
     * The timespan this recurrence is associated with.
     * @property {Scheduler.model.TimeSpan}
     */
    get timeSpan() {
        return this._timeSpan;
    }

    set timeSpan(value) {
        this._timeSpan = value;
    }

    /**
     * The recurrence rule. A string in [RFC-5545](https://tools.ietf.org/html/rfc5545#section-3.3.10) described format ("RRULE" expression).
     * @property {String}
     */
    get rule() {
        const
            me     = this,
            result = [];

        if (me.frequency) {
            result.push(`FREQ=${me.frequency}`);

            if (me.interval > 1) {
                result.push(`INTERVAL=${me.interval}`);
            }
            if (me.days && me.days.length) {
                result.push('BYDAY=' + me.days.join(','));
            }
            if (me.monthDays && me.monthDays.length) {
                result.push('BYMONTHDAY=' + me.monthDays.join(','));
            }
            if (me.months && me.months.length) {
                result.push('BYMONTH=' + me.months.join(','));
            }
            if (me.count) {
                result.push(`COUNT=${me.count}`);
            }
            if (me.endDate) {
                result.push('UNTIL=' + DateHelper.format(me.endDate, me.dateFormat));
            }
            if (me.positions && me.positions.length) {
                result.push('BYSETPOS=' + me.positions.join(','));
            }
        }

        return result.join(';');
    }

    set rule(rule) {
        const me = this;

        me.beginBatch();

        if (rule) {
            const parts = rule.split(';');

            for (let i = 0, len = parts.length; i < len; i++) {
                const
                    part = parts[i].split('='),
                    value  = part[1];

                switch (part[0]) {
                    case 'FREQ':
                        me.frequency = value;
                        break;
                    case 'INTERVAL':
                        me.interval = value;
                        break;
                    case 'COUNT':
                        me.count = value;
                        me.until = null;
                        break;
                    case 'UNTIL':
                        if (value) {
                            me.endDate = DateHelper.parse(value, me.dateFormat);
                        }
                        else {
                            me.endDate = null;
                        }
                        me.count = null;
                        break;
                    case 'BYDAY':
                        me.days = value;
                        break;
                    case 'BYMONTHDAY':
                        me.monthDays = value;
                        break;
                    case 'BYMONTH':
                        me.months = value;
                        break;
                    case 'BYSETPOS':
                        me.positions = value;
                        break;
                }
            }

            me.sanitize();
        }
        else {
            me.set({
                frequency : null,
                interval  : null,
                count     : null,
                endDate   : null,
                days      : null,
                monthDays : null,
                months    : null,
                positions : null
            });
        }

        me.endBatch();
    }

    construct(data = {}) {
        const
            me                 = this,
            { rule, timeSpan } = data;

        me._suspendedTimeSpanNotifying = 0;

        delete data.timeSpan;
        delete data.rule;

        super.construct(...arguments);

        if (rule) {
            me.suspendTimeSpanNotifying();
            me.rule = rule;
            me.resumeTimeSpanNotifying();
        }

        me.timeSpan = timeSpan;
    }

    /**
     * Iterate occurrences for the owning timespan across the specified date range. This method can be called even
     * if the timespan is not yet a member of a store, however, the occurrences returned will not be cached across
     * subsequent calls to this method.
     * @param {Date} startDate The start date of the iteration.
     * @param {Date} endDate The end date of the iteration.
     * @param {Function} fn The function to call for each occurrence.
     * @param {Scheduler.model.TimeSpan} fn.occurrence The occurrence.
     * @param {Boolean} fn.first A flag which is `true` for the first occurrence of this recurrence.
     * @param {Number} fn.counter A counter of how many dates have been visited in this iteration.
     * @param {Date} fn.date The occurrence date.
     * @internal
     */
    forEachOccurrence(startDate, endDate, fn) {
        if (this.timeSpan.startDate) {
            this.recurrenceIterator.forEachDate({
                recurrence : this,
                startDate,
                endDate,

                fn(date, counter, first, timeSpan) {
                    fn(timeSpan.buildOccurrence(date, first), first, counter, date);
                }
            });
        }
    }

    /**
     * Cleans up fields that do not makes sense for the current {@link #field-frequency} value.
     * @private
     */
    sanitize() {
        const
            me                = this,
            timeSpan          = me.timeSpan,
            timeSpanStartDate = timeSpan && timeSpan.startDate;

        me.beginBatch();

        me.isSanitizing = true;

        switch (me.frequency) {
            case 'DAILY' :
                me.positions    = null;
                me.days         = null;
                me.monthDays    = null;
                me.months       = null;
                break;

            case 'WEEKLY' :
                me.positions    = null;
                me.monthDays    = null;
                me.months       = null;

                const days = me.days;

                if (timeSpanStartDate && days && days.length == 1 && days[0] == RecurrenceDayRuleEncoder.encodeDay(timeSpanStartDate.getDay())) {
                    me.days = null;
                }
                break;

            case 'MONTHLY' :
                if (me.monthDays && me.monthDays.length) {
                    me.positions = null;
                    me.days      = null;
                }

                me.months = null;

                const monthDays = me.monthDays;

                if (timeSpanStartDate && monthDays && monthDays.length == 1 && monthDays[0] == timeSpanStartDate.getDate()) {
                    me.monthDays = null;
                }
                break;

            case 'YEARLY' :
                me.monthDays = null;

                const months = me.months;

                if (timeSpanStartDate && months && months.length == 1 && months[0] == timeSpanStartDate.getMonth() + 1) {
                    me.months = null;
                }
                break;
        }

        me.isSanitizing = false;

        me.endBatch();
    }

    copy(...args) {
        const result = super.copy(...args);

        result.dateFormat = this.dateFormat;
        result.timeSpan   = this.timeSpan;

        return result;
    }

    afterChange(toSet, wasSet, silent) {
        const
            result       = super.afterChange(toSet, wasSet, silent),
            { timeSpan } = this;

        if (!this.isSanitizing) {
            // cleanup data to match the chosen frequency
            this.sanitize();
        }

        if (timeSpan) {
            // Remove all exceptionsDates that our owning timeSpan had that are
            // now after our end date and therefore redundant.
            if ('endDate' in wasSet) {
                const
                    endDate            = DateHelper.clearTime(wasSet.endDate.value),
                    { exceptionDates } = timeSpan;

                // Clear any now-invalid cached occurrences
                timeSpan.removeOccurrencesFrom(endDate);

                // If we had any exceptions on or after this date, remove them.
                if (exceptionDates) {
                    for (const dateKey in exceptionDates) {
                        const exceptionDate = DateHelper.parseKey(dateKey);

                        if (exceptionDate >= endDate) {
                            delete exceptionDates[dateKey];
                        }
                    }
                }
            }

            if (!this.isTimeSpanNotifyingSuspended) {
                timeSpan.onRecurrenceChanged();
            }
        }

        return result;
    }

    get count() {
        return this.get('count');
    }

    set count(value) {
        if (value) this.endDate = null;
        this.set('count', value);
    }

    get endDate() {
        return this.get('endDate');
    }

    set endDate(value) {
        if (value) this.count = null;
        this.set('endDate', value);
    }

    get isTimeSpanNotifyingSuspended() {
        return Boolean(this._suspendedTimeSpanNotifying);
    }

    suspendTimeSpanNotifying() {
        this._suspendedTimeSpanNotifying++;
    }

    resumeTimeSpanNotifying() {
        if (this._suspendedTimeSpanNotifying) this._suspendedTimeSpanNotifying--;
    }
}
