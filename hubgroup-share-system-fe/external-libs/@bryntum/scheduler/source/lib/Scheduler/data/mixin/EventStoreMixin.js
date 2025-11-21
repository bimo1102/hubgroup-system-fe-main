import Base from '../../../Core/Base.js';
import Model from '../../../Core/data/Model.js';
import DateHelper from '../../../Core/helper/DateHelper.js';
import VersionHelper from '../../../Core/helper/VersionHelper.js';
import DayTime from '../../../Core/util/DayTime.js';
import EventDayIndex from '../util/EventDayIndex.js';
import FunctionHelper from '../../../Core/helper/FunctionHelper.js';

/**
 * @module Scheduler/data/mixin/EventStoreMixin
 */

const
    { MIDNIGHT } = DayTime,
    returnTrue   = () => true,
    notRecurring = event => !event.isRecurring;

/**
 * This is a mixin, containing functionality related to managing events.
 *
 * It is consumed by the regular {@link Scheduler.data.EventStore} class and the Gantt `TaskStore` classes
 * to allow data sharing between a Gantt chart and a Scheduler.
 *
 * @mixin
 */
export default Target => class EventStoreMixin extends (Target || Base) {
    static get $name() {
        return 'EventStoreMixin';
    }

    //region Init & destroy

    construct(config) {
        super.construct(config);

        this.autoTree = true;
        this.dayIndices = null;
    }

    //endregion

    //region Indices

    // Override to syncIndices on initial load
    afterLoadData() {
        this.syncIndices('splice', this.storage.allValues);
        // Babel cannot transpile ?. version of this correctly for some reason
        super.afterLoadData && super.afterLoadData();
    }

    /**
     * Responds to mutations of the underlying storage Collection.
     *
     * Maintain indices for fast finding of events by date.
     * @param {Object} event
     * @private
     */
    onDataChange({ action, added, removed, replaced }) {
        // Indices must be synced before responding to change
        this.syncIndices(action, added, removed, replaced);

        super.onDataChange(...arguments);
    }

    onDataReplaced(action, data) {
        // Indices must be synced before responding to change
        this.syncIndices('clear');
        this.syncIndices('splice', this.storage.values);

        super.onDataReplaced(action, data);
    }

    onModelChange(record, toSet, wasSet, silent, fromRelationUpdate) {
        // Ensure by-date indices are up to date.
        if (('startDate' in wasSet) || ('endDate' in wasSet)) {
            this.syncIndices('reschedule', [record], null, null, wasSet);
        }

        super.onModelChange(...arguments);
    }

    //endregion

    //region Events records, iteration etc.

    set filtersFunction(filtersFunction) {
        super.filtersFunction = filtersFunction;
    }

    get filtersFunction() {
        // Generate the real filterFn.
        const result = super.filtersFunction;

        // We always filter *in* records which are being created by the UI.
        if (result && result !== FunctionHelper.returnTrue) {
            return r => r.meta.isCreating || result(r);
        }
        return result;
    }

    /**
     * Returns events between the supplied start and end date
     *
     * @param {Date} startDate The start date
     * @param {Date} endDate The end date
     * @param {Boolean} allowPartial false to only include events that start and end inside of the span
     * @param {Boolean} onlyAssigned true to only include events that are assigned to a resource
     * @return {Scheduler.model.EventModel[]} the events
     * @category Events
     * @deprecated 4.0.0 Use {@link #function-getEvents}
     */
    getEventsInTimeSpan(startDate, endDate, allowPartial = true, onlyAssigned = false) {
        VersionHelper.deprecate('Scheduler', '5.0.0', '`getEventsInTimeSpan` method deprecated, in favor of `getEvents`');

        return this.getEvents({
            startDate,
            endDate,
            allowPartial,
            onlyAssigned
        });
    }

    /**
     * Returns all events that starts on the specified day.
     *
     * @param {Date} startDate Start date
     * @returns {Scheduler.model.EventModel[]} Events starting on specified day
     * @category Events
     * @deprecated 4.0.0 Use {@link #function-getEvents}
     */
    getEventsByStartDate(startDate) {
        VersionHelper.deprecate('Scheduler', '5.0.0', '`getEventsByStartDate` method deprecated, in favor of `getEvents`');

        return this.getEvents({
            startDate,
            startOnly : true
        });
    }

    /**
     * Returns an array of events for the date range specified by the `startDate` and `endDate` options.
     *
     * By default, for any date, this includes any event which *intersects* that date.
     *
     * To only include events that are fully contained *within* the date range, pass the `allowPartial`
     * option as `false`
     *
     * By default, any occurrences of recurring events are included in the resulting array. If that is not
     * required, pass the `includeOccurrences` option as `false`. **Note that if
     * `includeOccurrences` is `true`, the start date and end date options are mandatory. The method
     * must know what range of occurrences needs to be generated and returned.**
     *
     * example:
     *
     * ```javascript
     *  visibleEvents = eventStore.getEvents({
     *      resourceRecord : myResource,
     *      startDate      : scheduler.timeAxis.startDate,
     *      endDate        : scheduler.timeAxis.endDate
     *  });
     * ```
     *
     * @param {Object} options An options object determining which events to return
     * @param {Date} [options.date] If only one date is required, pass this option instead of the
     * `startDate` and `endDate` options.
     * @param {Date} options.startDate The start date for the range of events to include.
     * @param {Date} [options.endDate] The end date for the range of events to include.
     * @param {Scheduler.model.ResourceModel} options.resourceRecord Pass a resource to only return events assigned to
     *   this resource. Not supported when using the `dateMap` option (see below)
     * @param {Function} [options.filter] A function to filter out events which are not required.
     * @param {Boolean} [options.includeOccurrences=true] Occurrences of recurring events are included by default.
     * @param {Boolean} [options.allowPartial=true] Events which start before or after the range, but *intersect* the
     *   range are included by default.
     * @param {Boolean} [options.startOnly] Pass `true` to only include events which *start on* each date in the range.
     * @param {Boolean} [options.onlyAssigned] Pass `true` to only include events that are assigned to a resource
     * @param {Boolean|Map} [options.dateMap] Populates the passed `Map`, or if passed as `true`, creates and
     * returns a new `Map`. The keys are `YYYY-MM-DD` date strings and the entries are arrays of {@link Scheduler.model.EventModel EventModel}s.
     * @returns {Scheduler.model.EventModel[]|Map} Events which match the passed configuration.
     * @category Events
     */
    getEvents({
        filter,
        date,
        startDate,                  // Events which intersect the startDate/endDate
        endDate,                    // will be returned
        startOnly,                  // Only events which start on each date will be returned
        includeOccurrences,         // Interpolate occurrences into the returned event set
        allowPartial,               // Include events which *intersect* the date range
        onlyAssigned = false,       // Only include events that are assigned to a resource
        dateMap = false,            // Return a Map keyed by date each value being an array of events
        dayTime = null,

        // Private option. Select which date index to look up events in depending on the date
        // we are examining in the date iteration process. Some callers may want to use
        // different indices depending on the stage through the date iteration.
        // See Calendar package for usage.
        getDateIndex
    }) {
        const
            me                = this,
            options           = arguments[0],
            {
                lastDateRange,
                added,
                filtersFunction
            } = me,
            passedFilter      = filter;

        // Add filtering for only assigned events if requested.
        if (onlyAssigned) {
            options.filter = passedFilter ? e => passedFilter(e) && e.resources.length : e => e.resources.length;
        }

        // Note that we cannot use defaulting in the argument block because we pass
        // the incoming options object down into implementations.
        if (!('startDate' in options)) {
            startDate = options.startDate = date;
        }
        if (!('includeOccurrences' in options)) {
            includeOccurrences = options.includeOccurrences = true;
        }
        if (!('allowPartial' in options)) {
            allowPartial = options.allowPartial = !startOnly;
        }

        // We can't use me.filtersFunction if reapplyFilterOnAdd is false because there may be newly
        // added events which may not be subject to the filter. Records which are still in
        // the added bag must be tested for presence using indexOf so as to be always in sync
        // with the store being refiltered. Parens help readability.
        // eslint-disable-next-line no-extra-parens
        options.storeFilterFn = me.isFiltered ? (me.reapplyFilterOnAdd ? filtersFunction : (eventRecord => added.includes(eventRecord) ? me.indexOf(eventRecord) > -1 : filtersFunction(eventRecord))) : null;

        // Default to a one day range if only startDate passed
        if (!endDate) {
            if (startDate) {
                endDate = options.endDate = DateHelper.clearTime(startDate);
                endDate.setDate(endDate.getDate() + 1);
            }
            // If no dates passed, the dateFilter will include all.
            else {
                // We need to know what occurrences to generate.
                if (includeOccurrences) {
                    throw new Error('getEvents MUST be passed startDate and endDate if recurring occurrences are requested');
                }
                options.dateFilter = returnTrue;
            }
        }

        if (!options.dateFilter) {
            // Must start in the date range
            if (startOnly) {
                options.dateFilter = e => {
                    // Avoid hitting getter twice. Use batched value if present.
                    const eventStartDate = e.hasBatchedChange('startDate') ? e.get('startDate') : e.startDate;

                    return eventStartDate && !(DateHelper.clearTime(eventStartDate) - startDate);
                };
            }
            // Any intersection with our date range
            else if (allowPartial) {
                options.dateFilter = e => {
                    // Avoid hitting getter twice. Use batched value if present.
                    const
                        eventStartDate = e.hasBatchedChange('startDate') ? e.get('startDate') : e.startDate,
                        eventEndDate   = e.hasBatchedChange('endDate') ? e.get('endDate') : e.endDate || eventStartDate;

                    return eventStartDate && DateHelper.intersectSpans(eventStartDate, eventEndDate, startDate, endDate);
                };
            }
            // Must be wholly contained with the our range
            else {
                options.dateFilter = e => {
                    // Avoid hitting getter twice. Use batched value if present.
                    const
                        eventStartDate = e.hasBatchedChange('startDate') ? e.get('startDate') : e.startDate,
                        eventEndDate   = e.hasBatchedChange('endDate') ? e.get('endDate') : e.endDate || eventStartDate;

                    return eventStartDate && eventStartDate >= startDate && eventEndDate <= endDate;
                };
            }
        }

        const
            newDateRange    = {
                startDate,
                endDate
            },
            dateRangeChange = !lastDateRange || (lastDateRange.startDate - newDateRange.startDate || lastDateRange.endDate - newDateRange.endDate);

        if (dateRangeChange) {
            // Ensure the listeners are present
            me.processConfiguredListeners();

            /**
             * Fired when a range of events is requested from the {@link #function-getEvents} method.
             * @event loadDateRange
             * @param {Scheduler.data.EventStore} source This EventStore
             * @param {Object} old The old date range
             * @param {Date} old.startDate the old start date.
             * @param {Date} old.endDate the old end date.
             * @param {Object} new The new date range
             * @param {Date} new.startDate the new start date.
             * @param {Date} new.endDate the new end date.
             */
            me.trigger('loadDateRange', {
                old : lastDateRange || {},
                new : Object.assign({}, newDateRange)
            });
            me.lastDateRange = newDateRange;
        }

        return dateMap ? me.getEventsAsMap(options) : me.getEventsAsArray(options);
    }

    /**
     * Internal implementation for {@link #function-getEvents} to use when not using dateMap.
     * @private
     */
    getEventsAsArray({
        filter,
        date,
        resourceRecord,
        startDate = date,           // Events which intersect the startDate/endDate
        endDate,                    // will be returned
        startOnly,                  // Only events which start on each date will be returned
        includeOccurrences = true,  // Interpolate occurrences into the returned event set
        dayTime = null,

        // Injected by the getEvents master method
        dateFilter,

        storeFilterFn,

        // Private option. Select which date index to look up events in depending on the date
        // we are examining in the date iteration process. Some callers may want to use
        // different indices depending on the stage through the date iteration.
        // See Calendar package for usage.
        getDateIndex
    }) {
        const
            me     = this,
            events = [];

        if (me.count) {
            let candidateEvents = resourceRecord ? me.getEventsForResource(resourceRecord) : null;

            // If there *was* a resourceRecord, candidateEvents will already be set up using me.getEventsForResource.
            // If no resourceRecord specified, we are gathering by date, so use the indices.
            if (!resourceRecord) {
                const
                    dateIndex = me.useDayIndex(dayTime),
                    eventSet  = new Set(),
                    indexName = startOnly ? 'startDate' : 'date';

                // Add all recurring events which started on or before our date range.
                me.recurringEvents.forEach(e => {
                    if (dateIndex.dayTime.startOfDay(e.startDate) <= startDate) {
                        eventSet.add(e);
                    }
                });

                // Iterate the date range, using the indices to find qualified events.
                for (const date = new Date(startDate); date < endDate; date.setDate(date.getDate() + 1)) {
                    const coincidingEvents = dateIndex.get(getDateIndex ? getDateIndex(date) : indexName, date);

                    coincidingEvents?.forEach(e => eventSet.add(e));
                }

                // We gathered all events which *coincide* with each date.
                // We also added in all recurring events which started on or before our date range.
                // All these were made unique by the Set.
                // Return it to array form.
                candidateEvents = [...eventSet];
            }

            // Events found from the date indices won't be filtered.
            // On the other side, when using getEventForResource we will get all events for
            // the resource even if the EventStore is filtered, handle this by excluding "invisible" events here
            if (storeFilterFn) {
                candidateEvents = candidateEvents.filter(storeFilterFn);
            }

            // Go through candidates.
            // For a recurring event, and we are including recurrences, add date-qualifying occurrences.
            // For a non-recurring event, add it if it's date-qualified.
            for (let i = 0, { length } = candidateEvents; i < length; i++) {
                const e = candidateEvents[i];

                // For recurring events, add date-qualifying occurrences, not the base
                if (includeOccurrences && e.isRecurring) {
                    events.push.apply(events, e.getOccurrencesForDateRange(startDate, endDate).filter(dateFilter));
                }
                // For ordinary events, add if it's date-qualified
                else if (dateFilter(e)) {
                    events.push(e);
                }
            }
        }

        return filter ? events.filter(filter) : events;
    }

    /**
     * Internal implementation for {@link #function-getEvents} to use when using dateMap.
     * @private
     */
    getEventsAsMap({
        filter : passedFilter,
        date,
        resourceRecord,             // Not supported yet. Will add if ever requested.
        startDate = date,           // Events which intersect the startDate/endDate
        endDate,                    // will be returned
        startOnly,                  // Only events which start on each date will be returned
        includeOccurrences = true,  // Interpolate occurrences into the returned event set
        dateMap,                    // Return a Map keyed by date each value being an array of events
        dayTime = null,

        storeFilterFn,

        // Private option. Select which date index to look up events in depending on the date
        // we are examining in the date iteration process. Some callers may want to use
        // different indices depending on the stage through the date iteration.
        // See Calendar package for usage.
        getDateIndex
    }) {
        const me = this;

        // Convert `true` to a Map.
        if (dateMap.clear) {
            dateMap.clear();
        }
        else {
            dateMap = new Map();
        }

        if (me.count) {
            const
                dateIndex       = me.useDayIndex(dayTime),
                indexName       = startOnly ? 'startDate' : 'date',
                recurringEvents = [],
                filter          = e => (!passedFilter || passedFilter(e)) && (!storeFilterFn || storeFilterFn(e));

            dayTime = dateIndex.dayTime;  // dayTime=null becomes DayTime instance for midnight

            // We can't yet do this for just a resource.
            if (resourceRecord) {
                throw new Error('Querying for events for a resource and returning a date-keyed Map is not supported');
            }
            else {
                // Add all recurring events which started before the end of our date range.
                me.recurringEvents.forEach(e => {
                    if (dayTime.startOfDay(e.startDate) < endDate) {
                        recurringEvents.push(e);
                    }
                });

                // Iterate the date range, using the indices to find qualified events.
                for (const date = new Date(startDate); date < endDate; date.setDate(date.getDate() + 1)) {
                    let [coincidingEvents, key] = dateIndex.get(getDateIndex ? getDateIndex(date) : indexName, date, true);

                    if (coincidingEvents) {
                        // Convert Set which index holds into an Array.
                        // A recurring event doesn't go into the Map, its occurrences do.
                        // Then filter by the passed filter and this Store's filter function
                        // because events found from the date indices won't be filtered.
                        coincidingEvents = [...coincidingEvents].filter(notRecurring).filter(filter);

                        (dateMap.get(key) || (dateMap.set(key, []).get(key))).push(...coincidingEvents);
                    }
                }
            }

            // Go through matching recurring events.
            for (let i = 0, { length } = recurringEvents; i < length; i++) {
                const e = recurringEvents[i];

                // For each recurring event, add occurrences if we are including occurrences else, add the base.
                // Then filter by the passed filter and this Store's filter function
                // because events found from the date indices won't be filtered.
                const occurrences = (includeOccurrences ? e.getOccurrencesForDateRange(startDate, endDate) : [e]).filter(filter);

                // Add occurrences to dateMap
                for (let bucket, i = 0, { length } = occurrences; i < length; i++) {
                    const
                        occurrence = occurrences[i],
                        date = dayTime.startOfDay(occurrence.startDate),
                        indexName = getDateIndex ? getDateIndex(date) : (startOnly ? 'startDate' : 'date'),
                        lastInteresctingDate = (indexName === 'startDate')
                            ? DateHelper.add(date, 1, 'day')
                            : occurrence.endDate || DateHelper.add(occurrence.startDate, occurrence.duration, occurrence.durationUnit);

                    // Loop through covered dates, adding to dateMap if required
                    for (; date < lastInteresctingDate; date.setDate(date.getDate() + 1)) {
                        const key = dayTime.dateKey(date);

                        (bucket = dateMap.get(key)) || dateMap.set(key, bucket = []);

                        bucket.push(occurrence);
                    }
                }
            }
        }

        return dateMap;
    }

    /**
     * Calls the supplied iterator function once for every scheduled event, providing these arguments
     * - event : the event record
     * - startDate : the event start date
     * - endDate : the event end date
     *
     * Returning false cancels the iteration.
     *
     * @param {Function} fn iterator function
     * @param {Object} thisObj `this` reference for the function
     * @category Events
     */
    forEachScheduledEvent(fn, thisObj = this) {
        this.forEach(event => {
            const { startDate, endDate } = event;

            if (startDate && endDate) {
                return fn.call(thisObj, event, startDate, endDate);
            }
        });
    }

    /**
     * Returns an object defining the earliest start date and the latest end date of all the events in the store.
     *
     * @return {Object} An object with 'start' and 'end' Date properties (or null values if data is missing).
     * @category Events
     */
    getTotalTimeSpan() {
        let earliest = new Date(9999, 0, 1),
            latest   = new Date(0);

        this.forEach(event => {
            if (event.startDate) {
                earliest = DateHelper.min(event.startDate, earliest);
            }
            if (event.endDate) {
                latest = DateHelper.max(event.endDate, latest);
            }
        });

        // TODO: this will fail in programs designed to work with events in the past (after Jan 1, 1970)
        earliest = earliest < new Date(9999, 0, 1) ? earliest : null;
        latest   = latest > new Date(0) ? latest : null;

        // keep last calculated value to be able to track total timespan changes
        return (this.lastTotalTimeSpan = {
            startDate : earliest || null,
            endDate   : latest || earliest || null
        });
    }

    /**
     * Checks if given event record is persistable. By default it always is, override EventModels `isPersistable` if you
     * need custom logic.
     *
     * @param {Scheduler.model.EventModel} event
     * @return {Boolean}
     * @category Events
     */
    isEventPersistable(event) {
        return event.isPersistable;
    }

    //endregion

    //region Resource

    /**
     * Checks if a date range is allocated or not for a given resource.
     * @param {Date} start The start date
     * @param {Date} end The end date
     * @param {Scheduler.model.EventModel|null} excludeEvent An event to exclude from the check (or null)
     * @param {Scheduler.model.ResourceModel} resource The resource
     * @return {Boolean} True if the timespan is available for the resource
     * @category Resource
     */
    isDateRangeAvailable(start, end, excludeEvent, resource) {
        // NOTE: Also exists in TaskStore.js

        // This should be a collection of unique event records
        const allEvents = new Set(this.getEventsForResource(resource));

        // In private mode we can pass an AssignmentModel. In this case, we assume that multi-assignment is used.
        // So we need to make sure that other resources are available for this time too.
        // No matter if the event retrieved from the assignment belongs to the target resource or not.
        // We gather all events from from the resources the event is assigned to except of the one from the assignment record.
        // Note, events from the target resource are added above.
        if (excludeEvent?.isAssignment) {
            const
                currentEvent = excludeEvent.event,
                resources    = currentEvent.resources;

            resources.forEach(resource => {
                // Ignore events for the resource which is passed as an AssignmentModel to excludeEvent
                if (resource.id !== excludeEvent.resourceId) {
                    this.getEventsForResource(resource).forEach(event => allEvents.add(event));
                }
            });
        }

        if (excludeEvent) {
            const eventToRemove = excludeEvent.isAssignment ? excludeEvent.event : excludeEvent;
            allEvents.delete(eventToRemove);
        }

        return !Array.from(allEvents).some(event => event.isScheduled && DateHelper.intersectSpans(start, end, event.startDate, event.endDate));
    }

    /**
     * Filters the events associated with a resource, based on the function provided. An array will be returned for those
     * events where the passed function returns true.
     * @param {Scheduler.model.ResourceModel} resource
     * @param {Function} fn The function
     * @param {Object} [thisObj] `this` reference for the function
     * @return {Scheduler.model.EventModel[]} the events in the time span
     * @private
     * @category Resource
     */
    filterEventsForResource(resource, fn, thisObj = this) {
        return resource.getEvents(this).filter(fn.bind(thisObj));
    }

    /**
     * Returns all resources assigned to an event.
     *
     * @param {Scheduler.model.EventModel|String|Number} event
     * @return {Scheduler.model.ResourceModel[]}
     * @category Resource
     */
    getResourcesForEvent(event) {
        // If we are sent an occurrence, use its parent
        if (event.isOccurrence) {
            event = event.recurringTimeSpan;
        }

        return this.assignmentStore.getResourcesForEvent(event);
    }

    /**
     * Returns all events assigned to a resource.
     *
     * @param {Scheduler.model.ResourceModel|String|Number} resource Resource or resource id.
     *   *NOTE:* this does not include occurrences of recurring events. Use the {@link #function-getEvents} API
     *   to include occurrences of recurring events.
     * @return {Scheduler.model.EventModel[]}
     * @category Resource
     */
    getEventsForResource(resource) {
        return this.assignmentStore.getEventsForResource(resource);
    }

    //endregion

    //region Assignment

    /**
     * Returns all assignments for a given event.
     *
     * @param {Scheduler.model.EventModel|String|Number} event
     * @return {Scheduler.model.AssignmentModel[]}
     * @category Assignment
     */
    getAssignmentsForEvent(event) {
        return this.assignmentStore.getAssignmentsForEvent(event) || [];
    }

    /**
     * Returns all assignments for a given resource.
     *
     * @param {Scheduler.model.ResourceModel|String|Number} resource
     * @return {Scheduler.model.AssignmentModel[]}
     * @category Assignment
     */
    getAssignmentsForResource(resource) {
        return this.assignmentStore.getAssignmentsForResource(resource) || [];
    }

    /**
     * Creates and adds assignment record for a given event and a resource.
     *
     * @param {Scheduler.model.EventModel|String|Number} event
     * @param {Scheduler.model.ResourceModel|String|Number|Scheduler.model.ResourceModel[]|String[]|Number[]} resource The resource(s) to assign to the event
     * @param {Boolean} [removeExistingAssignments] `true` to first remove existing assignments
     * @return {Scheduler.model.AssignmentModel[]} An array with the created assignment(s)
     * @category Assignment
     */
    assignEventToResource(event, resource, removeExistingAssignments = false) {
        return this.assignmentStore.assignEventToResource(event, resource, undefined, removeExistingAssignments);
    }

    /**
     * Removes assignment record for a given event and a resource.
     *
     * @param {Scheduler.model.EventModel|String|Number} event
     * @param {Scheduler.model.ResourceModel|String|Number} resource
     * @category Assignment
     */
    unassignEventFromResource(event, resource) {
        this.assignmentStore.unassignEventFromResource(event, resource);
    }

    /**
     * Reassigns an event from an old resource to a new resource
     *
     * @param {Scheduler.model.EventModel}    event    An event or id of the event to reassign
     * @param {Scheduler.model.ResourceModel|Scheduler.model.ResourceModel[]} oldResource A resource or id to unassign from
     * @param {Scheduler.model.ResourceModel|Scheduler.model.ResourceModel[]} newResource A resource or id to assign to
     * @category Assignment
     */
    reassignEventFromResourceToResource(event, oldResource, newResource) {
        const
            me            = this,
            newResourceId = Model.asId(newResource),
            assignment    = me.assignmentStore.getAssignmentForEventAndResource(event, oldResource);

        if (assignment) {
            assignment.resourceId = newResourceId;
        }
        else {
            me.assignmentStore.assignEventToResource(event, newResource);
        }

    }

    /**
     * Checks whether an event is assigned to a resource.
     *
     * @param {Scheduler.model.EventModel|String|Number} event
     * @param {Scheduler.model.ResourceModel|String|Number} resource
     * @return {Boolean}
     * @category Assignment
     */
    isEventAssignedToResource(event, resource) {
        return this.assignmentStore.isEventAssignedToResource(event, resource);
    }

    /**
     * Removes all assignments for given event
     *
     * @param {Scheduler.model.EventModel|String|Number} event
     * @category Assignment
     */
    removeAssignmentsForEvent(event) {
        this.assignmentStore.removeAssignmentsForEvent(event);
    }

    /**
     * Removes all assignments for given resource
     *
     * @param {Scheduler.model.ResourceModel|String|Number} resource
     * @category Assignment
     */
    removeAssignmentsForResource(resource) {
        this.assignmentStore.removeAssignmentsForResource(resource);
    }

    //endregion

    //region Indexing

    /**
     * Invalidates associated day indices.
     * @internal
     */
    invalidateDayIndices() {
        this.dayIndices?.forEach(dayIndex => dayIndex.invalidate());
    }

    /**
     * Registers a `DayTime` instance, creating an `EventDayIndex` for each distinct `startShift`. This index is
     * maintained until all instances with a matching `startShift` are {@link #function-unregisterDayIndex unregistered}.
     * @param {Core.util.DayTime} dayTime The instance to register.
     * @internal
     * @category Indexing
     */
    registerDayIndex(dayTime) {
        const
            me = this,
            dayIndices = me.dayIndices || (me.dayIndices = []);

        let dayIndex, i;

        for (i = 0; !dayIndex && i < dayIndices.length; ++i) {
            if (dayIndices[i].matches(dayTime)) {
                (dayIndex = dayIndices[i]).register(dayTime);
            }
        }

        !dayIndex && dayIndices.push(dayIndex = new EventDayIndex(me, dayTime));

        return dayIndex;
    }

    syncIndices(...args) {
        this.dayIndices?.forEach(dayIndex => dayIndex.sync(...args));
    }

    /**
     * Removes a registered `DayTime` instance. If this is the last instance registered to an `EventDayIndex`, that
     * index is removed.
     * @param {Core.util.DayTime} dayTime The instance to unregister.
     * @internal
     * @category Indexing
     */
    unregisterDayIndex(dayTime) {
        const
            me = this,
            { dayIndices } = me;

        for (let i = dayIndices?.length; i-- > 0; /* empty */) {
            if (dayIndices[i].matches(dayTime)) {
                if (dayIndices[i].unregister(dayTime)) {
                    dayIndices.splice(i, 1);
                }

                break;
            }
        }
    }

    /**
     * Returns the `EventDayIndex` to use for the given `DayTime` instance. This may be the primary instance or a
     * child instance created by {@link #function-registerDayIndex}.
     * @param {Core.util.DayTime} dayTime The `DayTime` of the desired index.
     * @return {Scheduler.data.util.EventDayIndex}
     * @private
     * @category Indexing
     */
    useDayIndex(dayTime) {
        const
            me             = this,
            { dayIndices } = me;

        dayTime = dayTime || MIDNIGHT;

        for (let i = 0; dayIndices && i < dayIndices.length; ++i) {
            if (dayIndices[i].matches(dayTime)) {
                return dayIndices[i];
            }
        }

        if (dayTime.startShift) {
            throw new Error(`No day index registered for ${dayTime} on ${me.id}`);
        }

        return me.registerDayIndex(MIDNIGHT);
    }

    //endregion
};
