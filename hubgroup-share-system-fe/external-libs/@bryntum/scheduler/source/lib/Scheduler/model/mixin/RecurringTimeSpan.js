import TimeSpan from '../TimeSpan.js';
import RecurrenceModel from '../RecurrenceModel.js';
import DateHelper from '../../../Core/helper/DateHelper.js';
import AbstractRecurrenceIterator from '../../data/util/recurrence/AbstractRecurrenceIterator.js';

function convertExceptionDatesValue(value) {
    const
        result         = {},
        { dateFormat } = this;

    if (value) {
        value = typeof value == 'string' ? value.split(',') : Array.isArray(value) ? value : [value];

        value.forEach(item => {
            if (typeof item == 'string') {
                item = DateHelper.parse(item, dateFormat);
            }

            // If we've got a valid date out of the incoming item, add an exception key
            if (!isNaN(item)) {
                result[DateHelper.makeKey(item)] = 1;
            }
        });
    }

    return result;
}

function serializeExceptionDatesValue(value) {
    const
        result         = [],
        { dateFormat } = this;

    for (const date in value) {
        if (value[date]) {
            result.push(DateHelper.format(DateHelper.parseKey(date), dateFormat));
        }
    }

    return result;
}

const emptyArray = [];

/**
 * @module Scheduler/model/mixin/RecurringTimeSpan
 */

/**
 * This mixin class provides recurrence related fields and methods to a {@link Scheduler.model.TimeSpan timespan model}.
 *
 * The mixin introduces two types of timespans: __recurring timespan__ and its __occurrences__.
 * __Recurring timespan__ is a timespan having {@link #field-recurrenceRule recurrence rule} specified and its __occurrences__ are "fake" dynamically generated timespans.
 * Their set depends on the scheduler visible timespan and changes upon the timespan change.
 *
 * There are few methods allowing to distinguish a recurring event and an occurrence: {@link #property-isRecurring}, {@link #property-isOccurrence}
 * and {@link #property-recurringTimeSpan} (returns the event this record is an occurrence of).
 *
 * The {@link #field-recurrenceRule recurrence rule} defined for the event is parsed and
 * represented with {@link Scheduler.model.RecurrenceModel RecurrenceModel} class (can be changed by setting {@link #property-recurrenceModel} property) instance.
 * See: {@link #property-recurrence} property.
 * @mixin
 */
export default Target => class RecurringTimeSpan extends (Target || TimeSpan) {
    static get $name() {
        return 'RecurringTimeSpan';
    }

    /**
     * Returns `true` if this timespan supports recurring.
     * @property {Boolean}
     */
    get supportsRecurring() {
        return true;
    }

    static get fields() {
        return [
            /**
             * The timespan recurrence rule. A string in [RFC-5545](https://tools.ietf.org/html/rfc5545#section-3.3.10) described format ("RRULE" expression).
             * @field {String} recurrenceRule
             * @category Scheduling
             */
            {
                name     : 'recurrenceRule',
                internal : true
            },
            /**
             * The timespan exception dates. The dates that must be skipped when generating occurrences for a repeating timespan.
             * This is used to modify only individual occurrences of the timespan so the further regenerations
             * won't create another copy of this occurrence again.
             * Use {@link #function-addExceptionDate} method to add an individual entry to the dates array:
             *
             * ```javascript
             * // Break the link between the occurrence and its base.
             * // This also adds the occurrence date as an exception date
             * // so that the base timespan knows that this date should be skipped when regenerating its occurrences.
             * occurrence.recurringTimeSpan = null;
             *
             * // now the occurrence is an individual record that can be changed & persisted freely
             * occurrence.setStartEndDate(new Date(2018, 6, 2), new Date(2018, 6, 3));
             * ```
             * **Note:** The dates in this field get automatically removed when the event changes its {@link Scheduler.model.TimeSpan#field-startDate start date}.
             *
             * @field {Object} exceptionDates
             * @category Scheduling
             */
            {
                name      : 'exceptionDates',
                convert   : convertExceptionDatesValue,
                serialize : serializeExceptionDatesValue,
                internal  : true
            }
        ];
    }

    /**
     * Override of {@link Core.data.Model Model}'s method. If an {@link #property-isOccurrence}
     * is passed, it is detached from its parent recurring event. If it still has a recurrence
     * then the recurring event is changed to stop at the occurrence date. If it has no recurrence
     * an exception is added at the occurrence date.
     */
    remove() {
        if (this.isOccurrence) {
            this.cancelBatch();
            this.detachFromRecurringEvent();
        }
        else {
            return super.remove(...arguments);
        }
    }

    get eventStore() {
        let result = this.isOccurrence ? this.recurringEvent.eventStore : super.eventStore;

        // Recurrence methods are called on `eventStore`, but in case we have a regular
        // store with recurrence mixin, we won't event store and should return own
        // store instead
        if (!result && this.firstStore?.isRecurringTimeSpansMixin) {
            result = this.firstStore;
        }

        return result;
    }

    /**
     * Name of the class representing the recurrence model, defaults to {@link Scheduler.model.RecurrenceModel}
     * @property {String}
     */
    get recurrenceModel() {
        return this._recurrenceModel || RecurrenceModel;
    }

    set recurrenceModel(model) {
        this._recurrenceModel = model;
    }

    /**
     * Sets a recurrence for the timespan with a given frequency, interval, and end.
     * @param {Object|String|Scheduler.model.RecurrenceModel} recurrence A data object for an instance of {@link Scheduler.model.RecurrenceModel RecurrenceModel}.
     * May also be the frequency string: `DAILY`, `WEEKLY`, `MONTHLY`, or `YEARLY`.
     *
     * ```javascript
     * // repeat the event every other week till Jan 2 2039
     * event.setRecurrence({
     *     frequency : "WEEKLY",
     *     interval  : 2,
     *     endDate   : new Date(2039, 0, 2)
     * });
     * ```
     *
     * Also a {@link Scheduler.model.RecurrenceModel recurrence model} can be provided as the only argument for this method:
     *
     * ```javascript
     * const recurrence = new RecurrenceModel({ frequency : 'DAILY', interval : 5 });
     *
     * event.setRecurrence(recurrence);
     * ```
     *
     * or
     *
     * ```javascript
     * event.setRecurrence("WEEKLY", 2, new Date(2039, 0, 2));
     * ```
     * @param {Number} [interval] The interval between occurrences (instances of this recurrence). For example, a daily recurrence with an interval of 2 occurs every other day. Must be greater than 0.
     * @param {Number|Date} [recurrenceEnd] The end of the recurrence. The value can be specified by a date or by a maximum count of occurrences (has to greater than 1, since 1 means the event itself).
     */
    setRecurrence(recurrence, interval, recurrenceEnd) {
        const me = this;

        let recurrenceRule;

        if (recurrence) {
            if (!recurrence.isRecurrenceModel) {
                if (typeof recurrence === 'string') {
                    recurrence = {
                        frequency : recurrence
                    };

                    if (interval) {
                        recurrence.interval = interval;
                    }

                    // If the recurrence is limited
                    if (recurrenceEnd) {
                        if (recurrenceEnd instanceof Date) {
                            recurrence.endDate = recurrenceEnd;
                        }
                        else {
                            recurrence.count = recurrenceEnd;
                        }
                    }
                }
                recurrence = new me.recurrenceModel(recurrence);
            }

            // The RecurrenceModel has a reference to its owning recurring event.
            // It uses this to remove the owning event's exceptions after its new endDate
            // whenever its endDate is changed.
            recurrence.timeSpan = me;

            recurrenceRule = recurrence.rule;
        }

        me.recurrence     = recurrence;
        me.recurrenceRule = recurrenceRule;
    }

    /**
     * The recurrence model used for the timespan.
     * @property {Scheduler.model.RecurrenceModel}
     */
    get recurrence() {
        const
            me = this,
            rule = me.recurrenceRule;

        if (!me._recurrence && rule) {
            me._recurrence = new me.recurrenceModel({ rule, timeSpan : me, id : `${me.id}-recurrence` });
        }

        return me._recurrence;
    }

    set recurrence(recurrence) {
        const me = this;

        me._recurrence = recurrence;

        if (recurrence) {
            // bind recurrence instance to the model
            recurrence.timeSpan = me;
            me.recurrenceRule   = recurrence.rule;
        }
        else {
            // If this is being done to an occurrence, it's a signal that we are being
            // made an exception. Apply the change immediately, directly to the data.
            if (me.isOccurrence) {
                me.setData('recurrenceRule', null);
            }
            else {
                me.recurrenceRule = null;
            }
        }
    }

    /**
     * Indicates if the timespan is recurring.
     * @property {Boolean}
     * @readonly
     */
    get isRecurring() {
        // MUST evaluate in this order so that if it is an occurrence,
        // the recurrence getter does not refresh the rule
        return Boolean(!this.isOccurrence && this.recurrence);
    }

    /**
     * Indicates if the timespan is an occurrence of another recurring timespan.
     * @property {Boolean}
     * @readonly
     */
    get isOccurrence() {
        return Boolean(this.recurringTimeSpan);
    }

    /**
     * The "main" timespan this model is an occurrence of. For non-occurrences returns `null`.
     * @property {Scheduler.model.TimeSpan}
     * @readonly
     * @internal
     */
    get recurringTimeSpan() {
        return this._recurringTimeSpan;
    }

    get isPersistable() {
        return super.isPersistable && (!this.supportsRecurring || !this.isOccurrence);
    }

    set recurringTimeSpan(recurringTimeSpan) {
        this._recurringTimeSpan = recurringTimeSpan;
    }

    /**
     * Returns the occurrences of this event over the specified time range. If the first
     * occurrence is in the time range `*this*` record is included in that position.
     * @param {Date} startDate The start date of the range for which to include occurrences.
     * @param {Date} [endDate] The end date of the range for which to include occurrences.
     * Defaults to the startDate.
     * @returns {Scheduler.model.TimeSpan[]} The array of occurrences which occur over the specified range.
     */
    getOccurrencesForDateRange(startDate, endDate = startDate) {
        return this.eventStore.getOccurrencesForTimeSpan(this, startDate, endDate);
    }

    /**
     * Array of this recurring timespan's cached occurrences. __Not including the owning recurring
     * event__.
     *
     * Empty if the timespan is not recurring.
     *
     * __Note that this is an internal accessor and is cleared whenever changes are made to the
     * owning recurring event__.
     * @property {Scheduler.model.TimeSpan[]}
     * @readonly
     * @internal
     */
    get occurrences() {
        if (this.isRecurring) {
            const result = [];

            // The occurrencesMap contains entries for each occurrence date.
            this.occurrenceMap.forEach(occurrence => {
                if (occurrence !== this) {
                    result.push(occurrence);
                }
            });

            return result;
        }

        return emptyArray;
    }

    /**
     * A Map, keyed by each date an occurrence intersects, of occurrences of this event.
     * @property {Map}
     * @readonly
     * @internal
     */
    get occurrenceMap() {
        return this._occurrencesMap || (this._occurrencesMap = new Map());
    }

    /**
     * Removes an occurrence from this recurring timespan's cached occurrences.
     * @param dateOrTimeSpan occurrence date or occurrence TimeSpan
     * @internal
     */
    removeOccurrence(dateOrTimeSpan) {
        const date = dateOrTimeSpan.isTimeSpan ? dateOrTimeSpan.occurrenceDate : dateOrTimeSpan;

        // Clear the occurrences *is* we are in an EventStore.
        this.eventStore?.globalOccurrences.delete(this.createRecurrenceKey(date));
        // Remove occurrence from its by-startDate cache
        this.occurrenceMap.delete(DateHelper.makeKey(date));
    }

    /**
     * Removes all cached occurrences on or after the passed date from this recurring timespan's cached occurrences.
     * @internal
     */
    removeOccurrencesFrom(date) {
        this.occurrenceMap.forEach((occurrence, dateKey) => {
            if (DateHelper.parseKey(dateKey) >= date) {
                this.removeOccurrence(occurrence);
            }
        });
    }

    /**
     * Removes this recurring timespan's cached occurrences.
     * @internal
     */
    removeOccurrences() {
        // This recurring event must also be removed from the occurrenceMap if it's there
        // So insert it as the first element. Can also be found from the store's global occurrence
        // Map using [...this.eventStore.globalOccurrences.keys()].filter(e => e.startsWith(`_generated:${this.id}`))
        [this, ...this.occurrences].forEach(occurrence => this.removeOccurrence(occurrence));
    }

    /**
     * The method is triggered when the timespan recurrence settings get changed.
     * It updates the {@link #field-recurrenceRule} field in this case.
     * @internal
     */
    onRecurrenceChanged() {
        this.recurrenceRule = this.recurrence?.rule || null;
    }

    /**
     * The original {@lScheduler.model.TimeSpan#field-startDate startDate} of this event before any modifications
     * took place. Used by {@link #function-removeOccurrence} and {@link #function-detachFromRecurringEvent}
     * @internal
     * @readonly
     */
    get occurrenceDate() {
        return this.meta.modified?.startDate || this.startDate;
    }

    /**
     * If this event is an {@link #property-isOccurrence occurrence} of a recurring event, then this
     * property yields its zero-based occurrence index in the sequence.
     * @property {Number}
     * @readonly
     */
    get occurrenceIndex() {
        return AbstractRecurrenceIterator.getOccurrenceIndex(this);
    }

    /**
     * Builds an occurrence of this recurring event by cloning the timespan data.
     * The method is used internally by the __RecurringTimeSpans__ mixin.
     * Override it if you need to customize the generated occurrences.
     *
     * If the date requested is the start date of the event sequence, `this`
     * record is returned. All runs of recurring events begin with the base record.
     * @param  {Date} occurrenceDate The occurrence start date.
     * @param  {Boolean} isFirst `true` if this is the first occurrence.
     * @return {Scheduler.model.TimeSpan} The occurrence.
     * @internal
     */
    buildOccurrence(occurrenceDate, isFirst) {
        const
            me                    = this,
            {
                occurrenceMap,
                recurrence,
                meta
            }                     = me,
            globalOccurrences     = me.eventStore?.globalOccurrences,
            id                    = me.createRecurrenceKey(occurrenceDate),
            onStartDate           = !(occurrenceDate - me.startDate),
            { fieldMap }          = me.constructor;

        // An occurrence has a unique ID which identifies it by its base recurring event and its time.
        let occurrence   = globalOccurrences?.get(id),
            { duration } = me;

        // If there's no duration, or it's an all day event (which makes the event ceil and floor its
        // start and end dates, but does *NOT* as of 27/5/2020 adjust its duration) then
        // we calculate the duration of the occurrence.
        if (me.endDate && (me.allDay || !duration)) {
            duration = DateHelper.as(me.durationUnit, me.endDate.getTime() - me.startDate.getTime());
        }

        // Don't let NaN in record data
        const occurrenceEndDate = duration !== undefined ? DateHelper.add(occurrenceDate, duration, me.durationUnit) : undefined;

        if (!occurrence) {
            // If this is the first occurrence (start times may not match), or it's right on the start
            // then this recurring event *IS* the occurrence
            if (isFirst || onStartDate) {
                occurrence = me;

                // We are the first occurrence.
                // But if our start time is not as the rule requires, adjust ourself *silently*
                if (!onStartDate) {
                    me.setStartEndDate(occurrenceDate, occurrenceEndDate, true);
                    // Since we've changed the event start date the recurrence "Days"/"MonthDays"/"Months"
                    // might get redundant in case the event start date matches the fields values
                    // Calling recurrence sanitize() will clean the fields in this case.
                    recurrence.suspendTimeSpanNotifying();
                    recurrence.sanitize();
                    recurrence.resumeTimeSpanNotifying();
                }

                // Either way, because of adjustment above, or initial correctness, we are in sync
                // with our recurrence rule. A RecurrenceIterator is now able to calculate a correct
                // UNTIL date from a COUNT value. See AbstractRecurrenceIterator#processIterationConfig
                meta.isSyncedWithRule = true;
            }
            // Generate an occurrence which references this as its parent
            else {
                occurrence = me.copy({
                    [fieldMap.id.dataSource]        : id,
                    [fieldMap.startDate.dataSource] : occurrenceDate,
                    [fieldMap.endDate.dataSource]   : occurrenceEndDate,
                    [fieldMap.duration.dataSource]  : duration
                });
                occurrence.recurringTimeSpan = me;
            }

            globalOccurrences?.set(id, occurrence);

            // A recurring timespan keeps a by-startDate index of occurrences.
            // And itself will be among those.
            occurrenceMap.set(DateHelper.makeKey(occurrenceDate), occurrence);
        }

        return occurrence;
    }

    createRecurrenceKey(date = this.startDate) {
        return `_generated:${this.id}:${DateHelper.format(date, 'YYYYMMDD')}`;
    }

    afterChange(toSet, wasSet, silent, ...args) {
        const
            me             = this,
            { eventStore } = me;

        // reset cached recurrence instance in case "recurrenceRule" is changed
        if ('recurrenceRule' in wasSet) {
            me._recurrence = null;

            // If we are a recurring event, we must be in the recurringEvents cache.
            // If we are *not* a recurring event, we must *not* be in there.
            // An event not yet in a store (eg dragging to create) won't have an eventStore.
            // eslint-disable-next-line no-unused-expressions
            eventStore?.recurringEvents[wasSet.recurrenceRule.value ? 'add' : 'delete'](me);
        }

        // Any change to an occurrence adds it to an event store, at which point
        // it ceases to be an occurrence.
        //
        // If it has a recurrenceRule it becomes the start of a new recurring event series,
        // and the old owning recurring event stops on the day before.
        //
        // If it has no recurrenceRule, it becomes an exception to its owning recurring event.
        if (me.isOccurrence) {
            const
                {
                    recurringTimeSpan,
                    resource,
                    occurrenceIndex,
                    recurrence
                }               = me,
                startDate       = wasSet.startDate?.value || me.startDate,
                count           = recurrence && recurringTimeSpan.recurrence.count,
                // resourceRecords is a temporary property of occurrence events to handle cases
                // if only resources has been updated. (change only resources won't mark record as dirty)
                newResource     = wasSet.resourceRecords?.value || me.data.newResource;

            recurringTimeSpan.beginBatch();

            me.detachFromRecurringEvent();

            me.clearChanges();

            // Must silently set our own ID, not be the key generated from our parent id and occurrence date.
            // Must not result in the id field being in the modified state.
            me.setData('id', me.generateId(recurringTimeSpan.eventStore));

            if (newResource) {
                // clear resourceId to avoid auto-adding to assignmentStore, it handled manually bellow
                delete me.data.resourceId;
            }

            // Add to the store silently. We do not want a UI update now.
            // The impending changes to the former parent recurring event trigger a full refresh.
            recurringTimeSpan.eventStore.add(me, true);

            me.startDate = startDate;

            // Ensure that the original count is honoured.
            // If we are the 8th occurrence of 10, OUR repeat count must be 3.
            if (count) {
                me.recurrence.count = count - occurrenceIndex;
            }

            me.assign(newResource || resource);

            // remove data afer apply
            delete me.data.resourceRecords;
            delete wasSet.resourceRecords;

            // Any change to a recurring events triggers a store refresh event.
            recurringTimeSpan.endBatch();
        }
        else {
            // Setting a newException date must mark the exceptionDates as modified
            if ('newExceptionDate' in wasSet) {
                me.meta.modified.exceptionDates = true;
                delete me.meta.modified.newExceptionDate;

                // Remove any occurrence on that date from our by-startDate cache
                // and from the global occurrences cache
                me.removeOccurrence(wasSet.newExceptionDate.value);
            }
        }

        return super.afterChange(toSet, wasSet, silent, ...args);
    }

    /**
     * Detaches an occurrence from its owning recurring event so that it can be added to the eventStore
     * either as an exception, or as the start of a new recurring sequence.
     * @internal
     */
    detachFromRecurringEvent() {
        const
            me                                    = this,
            // For access further down, breaking the link involves engine if trying to get the occurrenceDate later,
            // resulting in the wrong date
            { recurringTimeSpan, occurrenceDate, startDate } = me;

        // Break the link
        me.recurringTimeSpan = null;

        // The occurrenceDate is injected into the data when an occurrence is created.
        // the recurringTimeSpan's afterChange will remove any cache occurrence
        // for this date; see above
        recurringTimeSpan.addExceptionDate(occurrenceDate);

        // If we still have a recurrenceRule, we're being promoted to be a new recurring event.
        // The recurrence setter applies the rule immediately to occurrences, so this will
        // always be correct.
        if (me.recurrenceRule) {
            // The RecurrenceModel removes occurrences and exceptions after this date
            recurringTimeSpan.recurrence.endDate = DateHelper.add(startDate, -1, 'minute');
        }
    }

    /**
     * The setter used by Model#inSet when {@link #function-addExceptionDate} is called.
     * Adding an exception must trigger change processing in a recurring event, so it must
     * be changed through a {@link Core.data.Model#function-set} call. Also, the change must be batchable
     * with other changes.
     * @private
     * @readonly
     */
    set newExceptionDate(date) {
        if (date) {
            const exceptionDates = this.exceptionDates || (this.exceptionDates = {});

            exceptionDates[DateHelper.makeKey(date)] = 1;
        }
    }

    /**
     * Adds an exception date that should be skipped when generating occurrences for the timespan.
     * The methods adds an entry to the array kept in {@link #field-exceptionDates} field.
     * @param {Date} date Exception date.
     * @internal
     */
    addExceptionDate(newExceptionDate) {
        return this.set({
            newExceptionDate
        });
    }

    /**
     * Does this recurring event have an exception on the passed date.
     * @param {Date} date The date to find an exception for.
     * @returns {Boolean} `true` if the event has an exception starting on the passed date.
     */
    hasException(date) {
        return this.exceptionDates?.[DateHelper.makeKey(date)];
    }
};
