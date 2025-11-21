import Model from '../../Core/data/Model.js';
import DomClassList from '../../Core/helper/util/DomClassList.js';
import DH from '../../Core/helper/DateHelper.js';
import VersionHelper from '../../Core/helper/VersionHelper.js';
import BrowserHelper from '../../Core/helper/BrowserHelper.js';
import Duration from '../../Core/data/Duration.js';

/**
 * @module Scheduler/model/TimeSpan
 */

/**
 * This class represent a simple date range. It is being used in various subclasses and plugins which operate on date ranges.
 *
 * Its a subclass of  {@link Core.data.Model}.
 * Please refer to documentation of those classes to become familiar with the base interface of this class.
 *
 * A TimeSpan has the following fields:
 *
 * - {@link #field-startDate}    - start date of the task in the ISO 8601 format
 * - {@link #field-endDate}      - end date of the task in the ISO 8601 format (not inclusive)
 * - {@link #field-duration}     - duration, time between start date and end date
 * - {@link #field-durationUnit} - unit used to express the duration
 * - {@link #field-name}         - an optional name of the range
 * - {@link #field-cls}          - an optional CSS class to be associated with the range.
 *
 * The data source of any field can be customized in the subclass. Please refer to {@link Core.data.Model} for details. To specify
 * another date format:
 *
 * ```javascript
 * class MyTimeSpan extends TimeSpan {
 *   static get fields() {
 *      { name: 'startDate', type: 'date', dateFormat: 'DD/MM/YY' }
 *   }
 * }
 * ```
 *
 * @extends Core/data/Model
 */
export default class TimeSpan extends Model {

    static get $name() {
        return 'TimeSpan';
    }

    //region Field definitions

    static get fields() {
        return [
            /**
             * The start date of a time span (or Event / Task).
             *
             * Uses {@link Core/helper/DateHelper#property-defaultFormat-static DateHelper.defaultFormat} to convert a
             * supplied string to a Date. To specify another format, either change that setting or subclass TimeSpan and
             * change the dateFormat for this field.
             *
             * @field {String|Date} startDate
             * @category Scheduling
             */
            {
                name : 'startDate',
                type : 'date'
            },

            /**
             * The end date of a time span (or Event / Task).
             *
             * Uses {@link Core/helper/DateHelper#property-defaultFormat-static DateHelper.defaultFormat} to convert a
             * supplied string to a Date. To specify another format, either change that setting or subclass TimeSpan and
             * change the dateFormat for this field.
             *
             * @field {String|Date} endDate
             * @category Scheduling
             */
            {
                name : 'endDate',
                type : 'date'
            },

            /**
             * The numeric part of the timespan's duration (the number of units).
             * @field {Number} duration
             * @category Scheduling
             */
            {
                name      : 'duration',
                type      : 'number',
                allowNull : true,
                internal  : true
            },

            /**
             * The unit part of the TimeSpan duration, defaults to "d" (days). Valid values are:
             *
             * - "ms" (milliseconds)
             * - "s" (seconds)
             * - "m" (minutes)
             * - "h" (hours)
             * - "d" (days)
             * - "w" (weeks)
             * - "M" (months)
             * - "y" (years)
             *
             * This field is readonly after creation, to change durationUnit use #setDuration().
             * @field {String} durationUnit
             * @category Scheduling
             */
            {
                name         : 'durationUnit',
                type         : 'string',
                defaultValue : 'd',
                internal     : true
            },

            {
                name    : 'fullDuration',
                persist : false,
                column  : {
                    type : 'duration'
                },
                internal : true // TODO: remove this when durationcolumn is in Scheduler
            },

            /**
             * An encapsulation of the CSS classes to add to the rendered time span element.
             * @field {Core.helper.util.DomClassList|String} cls
             *
             * This may be accessed as a string, but for granular control of adding and
             * removing individual classes, it is recommended to use the
             * {@link Core.helper.util.DomClassList DomClassList} API.
             * @category Styling
             */
            {
                name         : 'cls',
                defaultValue : '',
                internal     : true
            },

            /**
             * CSS class specifying an icon to apply to the rendered time span element.
             * @field {String} iconCls
             * @category Styling
             */
            {
                name     : 'iconCls',
                internal : true
            },

            /**
             * A CSS style string (applied to `style.cssText`) or object (applied to `style`)
             * ```
             * record.style = 'color: red;font-weight: 800';
             * ```
             *
             * @field {String} style
             * @category Styling
             */
            {
                name     : 'style',
                type     : 'object',
                internal : true
            },

            /**
             * The name of the time span (or Event / Task)
             * @field {String} name
             * @category Common
             */
            {
                name         : 'name',
                type         : 'string',
                defaultValue : ''
            }
        ];
    }

    //endregion

    //region Init

    afterConstruct() {
        super.afterConstruct();

        // This should probably be a property setter of some mandatory config, then we would not need an afterConfigure implementation.
        this.normalize();
    }

    /**
     * Returns the event store this event is part of.
     *
     * @property {Scheduler.data.EventStore}
     * @readonly
     */
    get eventStore() {
        const me = this;

        // If we are an occurrence, return our base recurring event's store
        if (me.isOccurrence) {
            return me.recurringTimeSpan.eventStore;
        }
        if (!me._eventStore) {
            me._eventStore = me.stores?.find(s => s.isEventStore);
        }
        return me._eventStore;
    }

    normalize() {
        const
            me                                             = this,
            { startDate, endDate, duration, durationUnit } = me,
            hasDuration                                    = duration != null;

        // need to calculate duration (checking first since seemed most likely to happen)
        if (startDate && endDate && !hasDuration) {
            me.setData('duration', DH.diff(startDate, endDate, durationUnit, true));
        }
        // need to calculate endDate?
        else if (startDate && !endDate && hasDuration) {
            me.setData('endDate', DH.add(startDate, duration, durationUnit));
        }
        // need to calculate startDate
        else if (!startDate && endDate && hasDuration) {
            me.setData('startDate', DH.add(endDate, -duration, durationUnit));
        }
    }

    //endregion

    //region Getters & Setters

    get cls() {
        if (!this._cls) {
            this._cls = new DomClassList(super.get('cls'));
        }
        return this._cls;
    }

    set cls(cls) {
        const me = this;

        if (me._cls) {
            me._cls.value = cls;
        }
        else {
            me._cls = new DomClassList(cls);
        }
        me.set('cls', me._cls.value);
    }

    get startDate() {
        return this.get('startDate');
    }

    set startDate(date) {
        this.setStartDate(date);
    }

    get endDate() {
        return this.get('endDate');
    }

    set endDate(date) {
        this.setEndDate(date);
    }

    get duration() {
        return this.get('duration');
    }

    set duration(duration) {
        this.setDuration(duration, this.durationUnit);
    }

    get durationUnit() {
        return this.get('durationUnit');
    }

    /**
     * Sets duration and durationUnit in one go. Only allowed way to change durationUnit, the durationUnit field is
     * readonly after creation
     * @param {Number} duration Duration value
     * @param {String} durationUnit Unit for specified duration value, see {@link #field-durationUnit} for valid values
     */
    setDuration(duration, durationUnit = this.durationUnit) {
        // Must be a number
        duration = parseFloat(duration);

        const toSet = {
            duration,
            durationUnit
        };

        if (this.startDate) {
            toSet.endDate = DH.add(this.startDate, duration, durationUnit);
        }
        else if (this.endDate) {
            toSet.startDate = DH.add(this.endDate, -duration, durationUnit);
        }

        this.set(toSet);
    }

    /**
     * Returns duration of the event in given unit. This is a wrapper for {@link Core.helper.DateHelper#function-getDurationInUnit-static}
     * @param {String} unit
     * @param {Boolean} [doNotRound]
     * @private
     * @returns {Number}
     */
    getDurationInUnit(unit, doNotRound) {
        if (this.starDate && this.endDate) {
            return DH.getDurationInUnit(this.startDate, this.endDate, unit, doNotRound);
        }
        else {
            return DH.as(unit, this.duration, this.durationUnit);
        }
    }

    /**
     * Property which encapsulates the duration's magnitude and units.
     * @property {Core.data.Duration}
     */
    get fullDuration() {
        // Used for formatting during export
        return new Duration({
            unit      : this.durationUnit,
            magnitude : this.duration
        });
    }

    set fullDuration(duration) {
        if (typeof duration === 'string') {
            duration = DH.parseDuration(duration, true, this.durationUnit);
        }

        this.setDuration(duration.magnitude, duration.unit);
    }

    /**
     * Sets the range start date
     *
     * @param {Date} date The new start date
     * @param {Boolean} keepDuration Pass `true` to keep the duration of the task ("move" the event), `false` to change the duration ("resize" the event).
     * Defaults to `true`
     */
    setStartDate(date, keepDuration = true) {
        const
            me    = this,
            toSet = {
                startDate : date
            };

        if (date) {
            let calcEndDate;

            if (keepDuration) {
                calcEndDate = me.duration != null;
            }
            else {
                if (me.endDate) {
                    toSet.duration = DH.diff(date, me.endDate, me.durationUnit, true);

                    if (toSet.duration < 0) throw new Error('Negative duration');
                }
                else {
                    calcEndDate = this.duration != null;
                }
            }

            if (calcEndDate) {
                // Use hours to set end date in order to correctly process DST crossings
                toSet.endDate = DH.add(date, me.getDurationInUnit('h'), 'h');
            }
        }
        else {
            toSet.duration = null;
        }

        me.set(toSet);
    }

    /**
     * Sets the range end date
     *
     * @param {Date} date The new end date
     * @param {Boolean} keepDuration Pass `true` to keep the duration of the task ("move" the event), `false` to change the duration ("resize" the event).
     * Defaults to `false`
     */
    setEndDate(date, keepDuration = false) {
        const
            me    = this,
            toSet = {
                endDate : date
            };

        if (date) {
            let calcStartDate;

            if (keepDuration === true) {
                calcStartDate = me.duration != null;
            }
            else {
                if (me.startDate) {
                    toSet.duration = DH.diff(me.startDate, date, me.durationUnit, true);

                    if (toSet.duration < 0) throw new Error('Negative duration');
                }
                else {
                    calcStartDate = this.duration != null;
                }
            }

            if (calcStartDate) {
                toSet.startDate = DH.add(date, -me.duration, me.durationUnit);
            }
        }

        me.set(toSet);
    }

    /**
     * Sets the event start and end dates
     *
     * @param {Date} start The new start date
     * @param {Date} end The new end date
     * @param {Boolean} [silent] Pass `true` to not trigger events
     */
    setStartEndDate(start, end, silent) {
        this.set({
            startDate : start,
            endDate   : end
        }, null, silent);
    }

    /**
     * Returns an array of dates in this range. If the range starts/ends not at the beginning of day, the whole day will be included.
     * @readonly
     * @property {Date[]}
     */
    get dates() {
        const
            dates     = [],
            startDate = DH.startOf(this.startDate, 'day'),
            endDate   = this.endDate;

        for (let date = startDate; date < endDate; date = DH.add(date, 1, 'day')) {
            dates.push(date);
        }

        return dates;
    }

    get startDateMS() {
        return (this.hasBatchedChange('startDate') ? this.get('startDate') : this.startDate)?.getTime();
    }

    get endDateMS() {
        return (this.hasBatchedChange('endDate') ? this.get('endDate') : this.endDate)?.getTime();
    }

    /**
     * Returns the duration of this Event in milliseconds.
     * @readonly
     * @property {Number}
     */
    get durationMS() {
        const me = this;

        if (me.endDate && me.startDate) {
            return me.endDateMS - me.startDateMS;
        }
        else {
            return DH.asMilliseconds(me.duration || 0, me.durationUnit);
        }
    }

    get isMilestone() {
        return this.durationMS === 0;
    }

    inSetNormalize(field) {
        if (typeof field !== 'string') {
            // If user is updating multiple properties in one go using an object, we help out
            // by filling out missing schedule related data

            let { startDate, endDate, duration, durationUnit = this.durationUnit } = field;

            // Conversion is usually handled in inSet, but we are normalizing prior to that and have to handle it here
            if (typeof startDate === 'string') {
                startDate = this.getFieldDefinition('startDate').convert(startDate);
            }

            if (typeof endDate === 'string') {
                endDate = this.getFieldDefinition('endDate').convert(endDate);
            }

            if ('duration' in field) {
                if (startDate && !endDate) {
                    endDate = DH.add(startDate, duration, durationUnit, true, true);
                }

                if (!startDate && endDate) {
                    startDate = DH.add(endDate, -duration, durationUnit, true, true);
                }
            }
            else if (startDate && endDate) {
                // Calculate duration in hours and covert to target duration unit in order to avoid extra DST conversion
                duration = DH.as(durationUnit, DH.diff(startDate, endDate, 'h', true), 'h');
            }

            startDate && (field.startDate = startDate);
            endDate && (field.endDate = endDate);
            duration != null && (field.duration = duration);

            return field;
        }
    }

    inSet(field, value, silent, fromRelationUpdate, skipAccessors) {
        if (!skipAccessors) {
            field = this.inSetNormalize(field) || field;
        }
        return super.inSet(field, value, silent, fromRelationUpdate, skipAccessors);
    }

    //endregion

    //region Iteration

    /**
     * Iterates over the {@link #property-dates}
     * @param {Function} func The function to call for each date
     * @param {Object} thisObj `this` reference for the function
     */
    forEachDate(func, thisObj) {
        return this.dates.forEach(func.bind(thisObj));
    }

    //endregion

    /**
     * Checks if the range record has both start and end dates set and start <= end
     *
     * @property {Boolean}
     */
    get isScheduled() {
        const me = this;
        return Boolean(me.startDate && me.endDate && me.hasValidDates);
    }

    // Simple check if end date is greater than start date
    get isValid() {
        let result = true; //super.isValid(),

        if (result) {
            const { startDate, endDate } = this;
            result = !startDate || !endDate || (endDate - startDate >= 0);
        }

        return result;
    }

    // Simple check if just end date is greater than start date
    get hasValidDates() {
        const { startDateMS, endDateMS } = this;

        return !startDateMS || !endDateMS || (endDateMS - startDateMS >= 0);
    }

    /**
     * Shift the dates for the date range by the passed amount and unit
     * @param {String} unit The unit to shift by, see {@link Core.helper.DateHelper} for more information on valid formats.
     * @param {Number} amount The amount to shift
     */
    shift(amount, unit = this.durationUnit) {
        // TODO REMOVE FOR 2.0
        if (typeof amount === 'string') {
            const u = amount;

            amount = unit;
            unit = u;
        }

        return this.setStartDate(DH.add(this.startDate, amount, unit, true), true);
    }

    /**
     * Returns the WBS code of this model (e.g '2.1.3'). Only relevant when part of a tree store, as in the Gantt chart.
     * @property {String}
     */
    get wbsCode() {
        return this._wbsCode || this.indexPath.join('.');
    }

    set wbsCode(value) {
        // wbsCode needs to be writable to interop w/TaskModel and Baselines which copy this field value
        this._wbsCode = value;
    }

    fullCopy() {
        //NOT PORTED

        return this.copy.apply(this, arguments);
    }

    intersects(timeSpan) {
        return this.intersectsRange(timeSpan.startDate, timeSpan.endDate);
    }

    intersectsRange(start, end) {
        const
            myStart = this.startDate,
            myEnd   = this.endDate;

        return myStart && myEnd && DH.intersectSpans(myStart, myEnd, start, end);
    }

    /**
     * Splits this event into two pieces at the desired position.
     *
     * @param {Number} splitPoint A number greater than 0 and less than 1, indicating how this event will be split. 0.5 means cut it in half
     * @return {Scheduler.model.TimeSpan} The newly created split section of the timespan
     */
    split(splitPoint = 0.5) {
        const
            me                               = this,
            clone                            = me.copy(),
            { eventStore,  assignmentStore } = me,
            ownNewDuration                   = me.duration * splitPoint,
            cloneDuration                    = me.duration - ownNewDuration;

        if (splitPoint <= 0 || splitPoint >= 1) {
            throw new Error('Split point must be > 0 and < 1');
        }

        clone.startDate = DH.add(me.startDate, ownNewDuration, me.durationUnit);
        clone.duration  = cloneDuration;

        me.duration = ownNewDuration;

        if (eventStore) {
            eventStore.add(clone);

            if (assignmentStore && !eventStore.usesSingleAssignment) {
                assignmentStore.add(
                    me.assignments.map(assignment => {
                        const clonedData = Object.assign({}, assignment.data, {
                            eventId  : clone.id,
                            // From engine
                            event    : null,
                            resource : null
                        });
                        delete clonedData.id;

                        return clonedData;
                    })
                );
            }
        }

        return clone;
    }

    toICSString(icsEventConfig = {}) {
        if (!this.isScheduled) {
            return '';
        }

        const
            nowAsUTC       = DH.toUTC(new Date()),
            startAsUTC     = DH.toUTC(this.startDate),
            endAsUTC       = DH.toUTC(this.endDate),
            fullDateFormat = 'YYYYMMDDTHHmmss',
            // To allow testing using a fixed timestamp value
            timestamp      = icsEventConfig.DTSTAMP || DH.format(nowAsUTC, fullDateFormat) + 'Z';

        delete icsEventConfig.DTSTAMP;

        let startEnd       = {};

        if (this.allDay) {
            const dateFormat = 'YYYYMMDD';

            startEnd = {
                'DTSTART;VALUE=DATE' : DH.format(startAsUTC, dateFormat),
                'DTEND;VALUE=DATE'   : DH.format(endAsUTC, dateFormat)
            };
        }
        else {
            startEnd = {
                DTSTART : DH.format(startAsUTC, fullDateFormat) + 'Z',
                DTEND   : DH.format(endAsUTC, fullDateFormat) + 'Z'
            };
        }

        const
            version       = (VersionHelper.scheduler && VersionHelper.getVersion('scheduler')) || (VersionHelper.calendar && VersionHelper.getVersion('calendar')) || '',
            icsWrapConfig = {
                BEGIN    : 'VCALENDAR',
                VERSION  : '2.0',
                CALSCALE : 'GREGORIAN',
                PRODID   : `-//Bryntum AB//Bryntum Scheduler ${version} //EN`,
                END      : 'VCALENDAR'
            },
            eventConfig   = {
                BEGIN   : 'VEVENT',
                UID     : this.id + '@bryntum.com',
                CLASS   : 'PUBLIC',
                SUMMARY : this.name,
                DTSTAMP : timestamp,
                ...startEnd,
                ...(this.recurrenceRule ? { RRULE : this.recurrenceRule } : {}),
                ...icsEventConfig,
                END     : 'VEVENT'
            },
            icsItems      = Object.keys(icsWrapConfig).map(key => `${key}:${icsWrapConfig[key]}`),
            eventItems    = Object.keys(eventConfig).map(key => `${key}:${eventConfig[key]}`);

        // Inject event details before the closing VCALENDAR entry
        icsItems.splice(icsItems.length - 1, 0, ...eventItems);

        return icsItems.join('\n');
    }

    /**
     * Triggers a download of this time span in ICS format (for import in Outlook etc.)
     *
     * ```javascript
     * timeSpan.downloadAsICS({
     *      LOCATION : timeSpan.location
     *  });
     * ```
     * @param {Object} [icsEventConfig] A config object with properties to be added in to `BEGIN:VEVENT` section of the
     * exported event.
     */
    exportToICS(icsEventConfig) {
        if (this.isScheduled) {
            const blob = new Blob([this.toICSString(icsEventConfig)], { type : 'text/calendar' });

            BrowserHelper.downloadBlob(blob, (this.name || 'Event') + '.ics');
        }
    }

    /**
     * Defines if the given event field should be manually editable in UI.
     * You can override this method to provide your own logic.
     *
     * By default the method defines all the event fields as editable.
     *
     * @param {String} fieldName Name of the field
     * @returns {Boolean} Returns `true` if the field is editable, `false` if it is not and `undefined` if the model has no such field.
     */
    isEditable(fieldName) {
        // return undefined for unknown fields
        return this.getFieldDefinition(fieldName) ? true : undefined;
    }

    isFieldModified(fieldName) {
        if (fieldName === 'fullDuration') {
            return super.isFieldModified('duration') || super.isFieldModified('durationUnit');
        }
        return super.isFieldModified(fieldName);
    }
}
