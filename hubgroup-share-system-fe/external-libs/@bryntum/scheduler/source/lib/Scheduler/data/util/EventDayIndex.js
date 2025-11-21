import DayTime from '../../../Core/util/DayTime.js';

/**
 * @module Scheduler/data/util/EventDayIndex
 */

const
    // Maps an index name that can be requested to its storage property on the EventDayIndex instance:
    indexNameMap = {
        date      : '_dateIndex',
        startDate : '_startDateIndex'
    },
    indexProps         = Object.values(indexNameMap),
    emptyArray         = Object.freeze([]),
    { MILLIS_PER_DAY } = DayTime;

/**
 * This utility class is used by event stores to index events by their day (a "YYYY-MM-DD" value, also known as a
 * "date key"). This key is produced by a {@link Core.util.DayTime} instance. If two `DayTime` instances have a common
 * `startShift`, they can share an index.
 *
 * @internal
 */
export default class EventDayIndex {
    constructor(store, dayTime) {
        /**
         * The `DayTime` definition for this index. This is set to the initial DayTime instance but can be used for
         * any other {@link #function-register registered} `DayTime` instances since they all posses the same value for
         * `startShift`.
         *
         * This defaults to {@link Core.util.DayTime#property-MIDNIGHT-static}.
         * @member {Core.util.DayTime} dayTime
         * @readonly
         */
        this.dayTime = dayTime || DayTime.MIDNIGHT;

        /**
         * The owning store instance of this index.
         * @member {Scheduler.data.EventStore} store
         * @private
         * @readonly
         */
        this.store = store;

        /**
         * The `DayTime` instances {@link #function-register registered} with this index instance. As instances are
         * {@link #function-unregister unregistered} they are removed from this array. Once this array is empty, this
         * index can be discarded.
         * @member {Core.util.DayTime[]} users
         * @private
         */
        this.users = [this.dayTime];
    }

    /**
     * Adds an event record to the specified index (either "startDate" or "date") for a given `date`.
     * @param {String} indexName The index to which the event record is to be added (either "startDate" or "date").
     * @param {Date|Number} date A date for which the event record overlaps. The {@link Core.util.DayTime#function-dateKey}
     * method is used to convert this date to a "YYYY-MM-DD" key for the index.
     * @param {Scheduler.model.EventModel} eventRecord The event record.
     * @private
     */
    add(indexName, date, eventRecord) {
        const
            index    = this[indexNameMap[indexName]],
            key      = this.dayTime.dateKey(date),
            entry    = index[key] || (index[key] = new Set());

        entry.add(eventRecord);
    }

    /**
     * Adds an event record to all indexes for all dates which the event overlaps.
     * @param {Scheduler.model.EventModel} eventRecord The event record.
     * @private
     */
    addEvent(eventRecord) {
        let dateMS = this.dayTime.startOfDay(eventRecord.startDate)?.getTime(),
            endDateMS;

        if (dateMS) {
            endDateMS = eventRecord.endDate?.getTime() ?? dateMS;
            this.add('startDate', dateMS, eventRecord);

            do {
                this.add('date', dateMS, eventRecord);
                dateMS += MILLIS_PER_DAY;
            } while (dateMS < endDateMS);
        }
    }

    /**
     * Clear this index.
     */
    clear() {
        indexProps.forEach(name => this[name] = Object.create(null));
    }

    /**
     * Returns an object that has properties named by the {@link Core.util.DayTime#function-dateKey} method, or the
     * array of event records if a `date` is specified, or the event record array and the date key in a 2-element array
     * if `returnKey` is `true`.
     * @param {String} indexName The name of the desired index (either 'date' or 'startDate').
     * @param {Number|Date} date The date as a `Date` or the millisecond UTC epoch. When passed, this method will return
     * the array of event records for this date.
     * @param {Boolean} [returnKey] Specify `true` to return the date key along with the event record array.
     * @returns {Object|Scheduler.model.EventModel[]}
     */
    get(indexName, date, returnKey) {
        // Date indices are created on first usage and after that kept up to date on changes
        !this.initialized && this.initialize();

        let ret = this[indexNameMap[indexName]],
            key;

        if (date) {
            key = this.dayTime.dateKey(date);
            ret = returnKey ? [ret[key], key] : ret[key];
        }

        return ret;
    }

    /**
     * Called when this index is first used. Once called, further store changes will be used to maintain this index.
     * @private
     */
    initialize() {
        this.initialized = true;

        this.clear();
        this.sync('splice', this.store.storage.allValues);
    }

    invalidate() {
        this.initialized = false;

        indexProps.forEach(name => this[name] = null);
    }

    /**
     * Returns `true` if the given `dayTime` matches this index.
     * @param {Core.util.DayTime} dayTime
     * @returns {Boolean}
     */
    matches(dayTime) {
        return this.dayTime.startShift === dayTime.startShift;
    }

    /**
     * Removes an event record from the specified index (either "startDate" or "date") for a given `date`.
     * @param {String} indexName The index to which the event record is to be removed (either "startDate" or "date").
     * @param {Date|Number} date A date for which the event record overlaps. The {@link Core.util.DayTime#function-dateKey}
     * method is used to convert this date to a "YYYY-MM-DD" key for the index.
     * @param {Scheduler.model.EventModel} eventRecord The event record.
     * @private
     */
    remove(indexName, date, eventRecord) {
        const
            index = this[indexNameMap[indexName]],
            key   = this.dayTime.dateKey(date),
            entry = index[key];

        if (entry) {
            entry.delete(eventRecord);
        }
    }

    /**
     * Removes an event record from all indexes for all dates which the event overlaps.
     * @param {Scheduler.model.EventModel} eventRecord The event record.
     * @param {Date} startDate The start date for the event. This may be different from the `startDate` of the given
     * `eventRecord` when the event is rescheduled.
     * @param {Date} endDate The end date for the event. This may be different from the `endDate` of the given
     * `eventRecord` when the event is rescheduled.
     * @private
     */
    removeEvent(eventRecord, startDate, endDate) {
        let dateMS = this.dayTime.startOfDay(startDate)?.getTime(),
            endDateMS;

        if (dateMS) {
            endDateMS = endDate?.getTime() ?? dateMS;
            this.remove('startDate', dateMS, eventRecord);

            do {
                this.remove('date', dateMS, eventRecord);
                dateMS += MILLIS_PER_DAY;
            } while (dateMS < endDateMS);
        }
    }

    // TODO: Improve Collection indices to handle this
    // Keeps date & startDate indices up to date, used by Calendar and recurrence
    // The indices are initialized lazily on first access, and then kept up to date on changes
    sync(action, added, removed, replaced, wasSet) {
        added = added || emptyArray;
        removed = removed || emptyArray;

        const
            me            = this,
            addedCount    = added.length,
            removedCount  = removed.length,
            replacedCount = replaced?.length;

        let i, newEvent, outgoingEvent;

        if (!me.initialized) {
            return;
        }

        switch (action) {
            case 'clear':
                me.clear();
                break;

            // Add and remove
            case 'splice':
                // Handle replacement of records by instances with same ID
                if (replacedCount) {
                    added = added.slice();
                    removed = removed.slice();

                    for (i = 0; i < replacedCount; i++) {
                        removed.push(replaced[i][0]);
                        added.push(replaced[i][1]);
                    }
                }

                // Remove entries from indices
                if (removedCount) {
                    for (i = 0; i < removedCount; i++) {
                        outgoingEvent = removed[i];

                        me.removeEvent(outgoingEvent, outgoingEvent.startDate, outgoingEvent.endDate);
                    }
                }

                // Add entries to indices
                if (addedCount) {
                    for (i = 0; i < addedCount; i++) {
                        newEvent = added[i];

                        // Can only be date-indexed if it's scheduled
                        if (newEvent.isScheduled) {
                            me.addEvent(newEvent);
                        }
                    }
                }
                break;

            // invoked when the start or end changes so that the event can be re-indexed.
            case 'reschedule':
                outgoingEvent = added[0];

                me.removeEvent(outgoingEvent, wasSet.startDate?.oldValue || outgoingEvent.startDate,
                    wasSet.endDate?.oldValue || outgoingEvent.endDate);

                // Now process as as splice with an add and no removes.
                me.sync('splice', added);

                break;
        }
    }

    /**
     * This method registers a `dayTime` instance with this index in the `users` array.
     * @param {Core.util.DayTime} dayTime The instance to register.
     */
    register(dayTime) {
        this.users.push(dayTime);
    }

    /**
     * This method unregisters a `dayTime` instance, removing it from the `users` array. This method returns `true` if
     * this was the last registered instance and this index is no longer needed.
     * @param {Core.util.DayTime} dayTime The instance to register.
     * @returns {Boolean}
     */
    unregister(dayTime) {
        const
            { users } = this,
            i = users.indexOf(dayTime);

        if (i > -1) {
            users.splice(i, 1);
        }

        return !users.length;
    }
};

// To avoid shape changes:
const proto = EventDayIndex.prototype;

indexProps.forEach(name => proto[name] = null);
proto.initialized = false;
