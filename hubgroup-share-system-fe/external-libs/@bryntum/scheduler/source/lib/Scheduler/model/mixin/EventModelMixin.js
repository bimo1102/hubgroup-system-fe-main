import DH from '../../../Core/helper/DateHelper.js';
import ArrayHelper from '../../../Core/helper/ArrayHelper.js';

const
    oneDayMS = 1000 * 60 * 60 * 24;

/**
 * @module Scheduler/model/mixin/EventModelMixin
 */

/**
 * Mixin that holds configuration shared between events in Scheduler and Scheduler Pro.
 * @mixin
 */
export default Target => class EventModelMixin extends Target {
    static get $name() {
        return 'EventModelMixin';
    }

    // Flag checked by EventStore to make sure it uses a valid subclass
    static get isEventModel() {
        return true;
    }

    /**
     * Set value for the specified field(s), triggering engine calculations immediately. See
     * {@link Core.data.Model#function-set Model#set()} for arguments.
     *
     * ```javascript
     * eventRecord.set('duration', 4);
     * // eventRecord.endDate is not yet calculated
     *
     * await eventRecord.setAsync('duration', 4);
     * // eventRecord.endDate is calculated
     * ```
     *
     * @param {String|Object} field The field to set value for, or an object with multiple values to set in one call
     * @param {*} value Value to set
     * @param {Boolean} [silent=false] Set to true to not trigger events. If event is recurring, occurrences won't be updated
     * automatically.
     * @function setAsync
     * @category Editing
     * @async
     */

    //region Fields

    static get fields() {
        return [
            // TODO: below startDate/endDate/duration fields docs copy-paste should be cleaned up after supporting @localdoc & @inheritdoc combination

            /**
             * The start date of a time span (or Event / Task).
             *
             * Uses {@link Core/helper/DateHelper#property-defaultFormat-static DateHelper.defaultFormat} to convert a
             * supplied string to a Date. To specify another format, either change that setting or subclass TimeSpan and
             * change the dateFormat for this field.
             *
             * UI fields representing this data field are disabled for summary tasks. See {@link #function-isEditable} for details.
             *
             * @field {String|Date} startDate
             * @category Scheduling
             */

            /**
             * The end date of a time span (or Event / Task).
             *
             * Uses {@link Core/helper/DateHelper#property-defaultFormat-static DateHelper.defaultFormat} to convert a
             * supplied string to a Date. To specify another format, either change that setting or subclass TimeSpan and
             * change the dateFormat for this field.
             *
             * UI fields representing this data field are disabled for summary tasks. See {@link #function-isEditable} for details.
             *
             * @field {String|Date} endDate
             * @category Scheduling
             */

            /**
             * The numeric part of the timespan's duration (the number of units).
             *
             * UI fields representing this data field are disabled for summary tasks. See {@link #function-isEditable} for details.
             *
             * @field {Number} duration
             * @category Scheduling
             */

            /**
             * Property which encapsulates the duration's magnitude and units.
             * @property {Core.data.Duration}
             * @name fullDuration
             */

            /**
             * The unique identifier of a task (mandatory)
             * @field {String|Number} id
             * @category Common
             */

            /**
             * Id of the resource this event is associated with (only usable for single assignments). We recommend
             * using assignments in an AssignmentStore over this approach. Internally any Event using `resourceId`
             * will have an assignment in AssignmentStore generated.
             * @field {String|Number} resourceId
             * @category Common
             */
            {
                name     : 'resourceId',
                internal : true
            },

            /**
             * The array of {@link Scheduler.model.ResourceModel resources} which are assigned to this event.
             * @field {String|Number} resources
             * @category Common
             */
            {
                name   : 'resources',
                column : {
                    type : 'resourceassignment'
                },
                persist  : false,
                internal : true // TODO: remove this when resourcecolumn is in Scheduler
            },

            /**
             * Specify false to prevent the event from being dragged (if EventDrag feature is used)
             * @field {Boolean} draggable
             * @default true
             * @category Interaction
             */
            {
                name         : 'draggable',
                type         : 'boolean',
                persist      : false,
                defaultValue : true,
                internal     : true
            },

            /**
             * Specify false to prevent the event from being resized (if EventResize feature is used). You can also
             * specify 'start' or 'end' to only allow resizing in one direction
             * @field {Boolean|String} resizable
             * @default true
             * @category Interaction
             */
            {
                name         : 'resizable',
                persist      : false,
                defaultValue : true,
                internal     : true
            }, // true, false, 'start' or 'end'

            /**
             * A field marking event as all day(s) spanning event.
             * For example, a holiday day may be represented by a `startDate`, and the `allDay` flag.
             * @field {Boolean} allDay
             * @category Scheduling
             */
            {
                name         : 'allDay',
                type         : 'boolean',
                defaultValue : false
            },

            /**
             * Controls this events appearance, see Schedulers
             * {@link Scheduler.view.mixin.TimelineEventRendering#config-eventStyle eventStyle config} for
             * available options.
             * @field {String} eventStyle
             * @category Styling
             */
            {
                name     : 'eventStyle',
                internal : true
            },

            /**
             * Controls the primary color of the event, see Schedulers
             * {@link Scheduler.view.mixin.TimelineEventRendering#config-eventColor eventColor config} for
             * available colors.
             * @field {String} eventColor
             * @category Styling
             */
            {
                name     : 'eventColor',
                internal : true
            },

            /**
             * Width (in px) to use for this milestone when using Scheduler#milestoneLayoutMode 'data'.
             * @field {Number} milestoneWidth
             * @category Styling
             */
            {
                name     : 'milestoneWidth',
                internal : true
            },

            {
                name     : '$highlight',
                persist  : false,
                internal : true
            },

            /**
             * Set this field to false to opt out of {@link Scheduler.feature.StickyEvents sticky event content}
             * (keeping event text in view while scrolling).
             * @field {Boolean} stickyContents
             * @category Styling
             */
            {
                name     : 'stickyContents',
                internal : true
            }
        ];
    }

    //endregion

    //region Id change

    updateAssignmentEventIds() {
        this.assigned.forEach(assignment => {
            assignment.eventId = this.id;
        });
    }

    syncId(value) {
        super.syncId(value);

        this.updateAssignmentEventIds();
    }

    //endregion

    //region Resources

    /**
     * Returns all resources assigned to an event.
     *
     * @property {Scheduler.model.ResourceModel[]}
     * @readonly
     */
    get resources() {
        // Only include valid resources, to not have nulls in the result
        return this.assignments.reduce((resources, assignment) => {
            assignment.resource && resources.push(assignment.resource);
            return resources;
        }, []);
    }

    set resources(resources) {
        if (!Array.isArray(resources)) {
            resources = [resources];
        }

        const
            me                                      = this,
            newResourceIds                          = resources.map(me.constructor.asId),
            existingResourceIds                     = me.assignments.map(a => a.resource.id),
            { onlyInA : toAdd, onlyInB : toRemove } = ArrayHelper.delta(newResourceIds, existingResourceIds);

        // Add first, remove after. Otherwise event might get removed with its last assignment
        me.assignmentStore.add(toAdd.map(resourceId => ({ resource : resourceId, event : me })));
        me.assignmentStore.remove(toRemove.map(resourceId => me.assignments.find(a => a.resource.id === resourceId)));
    }

    /**
     * Iterate over all associated resources
     * @private
     */
    forEachResource(fn, thisObj = this) {
        for (const resource of this.resources) {
            if (fn.call(thisObj, resource) === false) return;
        }
    }

    /**
     * Returns either the resource associated with this event (when called w/o `resourceId`) or resource
     * with specified id.
     *
     * @param {String} [resourceId] To retrieve a specific resource
     * @return {Scheduler.model.ResourceModel}
     */
    getResource(resourceId) {
        if (resourceId == null) {
            return this.resource;
        }

        return this.resourceStore ? this.resourceStore.getById(resourceId) : null;
    }

    //endregion

    //region Dates

    get startDate() {
        let dt;

        if (this.isOccurrence) {
            dt = this.get('startDate');
        }
        else {
            // Micro optimization to avoid expensive super call. super will be hit in Scheduler Pro
            dt = this._startDate ?? super.startDate;
        }

        if (this.allDay) {
            dt = this.constructor.getAllDayStartDate(dt);
        }

        return dt;
    }

    set startDate(startDate) {
        if (this.batching) {
            this._startDate = startDate;
            this.set({ startDate });
        }
        else {
            super.startDate = startDate;
        }
    }

    get endDate() {
        let dt;

        if (this.isOccurrence) {
            dt = this.get('endDate');
        }
        else {
            // Micro optimization to avoid expensive super call. super will be hit in Scheduler Pro
            dt = this._endDate ?? super.endDate;
        }

        if (this.allDay) {
            dt = this.constructor.getAllDayEndDate(dt);
        }

        return dt;
    }

    set endDate(endDate) {
        if (this.batching) {
            this._endDate = endDate;
            this.set({ endDate });
        }
        else {
            super.endDate = endDate;
        }
    }

    /**
     * Shift the dates for the date range by the passed amount and unit
     * @param {String} unit The unit to shift by, see {@link Core.helper.DateHelper} for more information on valid formats.
     * @param {Number} amount The amount to shift
     * @returns {Promise} A promise which is resolved when shift calculations are done
     * @async
     * @method shift
     */

    //endregion

    //region Is

    // Used internally to differentiate between Event and ResourceTimeRange
    get isEvent() {
        return true;
    }

    /**
     * Returns true if event can be drag and dropped
     * @property {Boolean}
     */
    get isDraggable() {
        return this.draggable;
    }

    /**
     * Returns true if event can be resized, but can additionally return 'start' or 'end' indicating how this event can be resized.
     * @property {Boolean|String}
     * @readonly
     */
    get isResizable() {
        return !this.isMilestone && this.resizable;
    }

    /**
     * Returns false if the event is not persistable. By default it always is, override this getter if you need
     * custom logic.
     *
     * @property {Boolean}
     * @readonly
     */
    get isPersistable() {
        // Records not yet fully created cannot be persisted
        return super.isPersistable && !this.meta.isCreating;
    }

    endBatch() {
        const { isPersistable : wasPersistable } = this;

        super.endBatch(...arguments);

        // If this event newly persistable, its assignments are eligible for syncing.
        if (this.isPersistable && !wasPersistable) {
            this.assignments.forEach(assignment => {
                assignment.stores.forEach(s => {
                    s.updateModifiedBagForRecord(assignment);
                });
            });
        }
    }

    get isCreating() {
        return super.isCreating;
    }

    set isCreating(value) {
        super.isCreating = value;

        this.assignments.forEach(record => record.isCreating = value);
    }

    //endregion

    //region Single assignment compatibility

    get usesSingleAssignment() {
        return !this.eventStore || this.eventStore.usesSingleAssignment;
    }

    /**
     * Override persistable getter to prevent sending resourceId when using multiple resource assignment mode
     * https://github.com/bryntum/support/issues/1345
     * @private
     */
    get persistableData() {
        const data = super.persistableData;
        if (!this.usesSingleAssignment) {
            delete data.resourceId;
        }
        return data;
    }

    /**
     * Returns the first assigned resource, or assigns a resource
     * @member {Scheduler.model.ResourceModel} resource
     */
    get resource() {
        const { resources } = this;
        return resources.length ? resources[0] : null;
    }

    set resource(resourceRecord) {
        // Use the resourceId setter for single assignment
        this.resourceId = this.constructor.asId(resourceRecord);
    }

    get resourceId() {
        return this.usesSingleAssignment ? this.get('resourceId') : this.resource?.id;
    }

    set resourceId(resourceId) {
        this.applyResourceId(resourceId);
    }

    applyResourceId(resourceId, fromApplyValue = false) {
        const
            me                                           = this,
            { assignments, assignmentStore, eventStore } = me;

        // When part of an EventStore, resourceIds are changed to be AssignmentModels
        if (eventStore) {
            if (resourceId != null) {
                if (!me.skipEnforcingSingleAssignment) {
                    eventStore.usesSingleAssignment = true;
                }

                // Reassign if already assigned, only single assignment allowed
                if (assignments?.length && resourceId !== assignments[0].resourceId) {
                    //assignments[0].set('resourceId', resourceId, Boolean(me.eventStore.eventsSuspended));
                    // Silent reassign if events are suspended on event store, wont be expecting UI update then
                    const eventsSuspended = Boolean(eventStore.eventsSuspended);

                    eventsSuspended && assignmentStore.suspendEvents();
                    assignments[0].resource = resourceId;
                    eventsSuspended && assignmentStore.resumeEvents();
                }
                // Otherwise assign
                else {
                    assignmentStore.assignEventToResource(me, resourceId);
                }
            }
            else {
                // Setting resourceId to null removes all assignments
                assignmentStore.remove(me.assignments);
            }
        }
        // Not part of an EventStore, edge case. Set to data unless we are in such operation already
        else if (!fromApplyValue) {
            me.set({ resourceId });
        }
    }

    // Special handling of setting resourceId, creates assignment
    applyValue(useProp, mapping, value, skipAccessors, field) {
        if (field && field.name === 'resourceId' && !this.meta.isAssigning) {
            const { eventStore } = this;

            eventStore && (eventStore.isAssigning = true);

            this.applyResourceId(value, true);

            eventStore && (eventStore.isAssigning = false);
        }

        super.applyValue(useProp, mapping, value, skipAccessors, field);
    }

    //endregion

    //region Assignment

    /**
     * Returns all assignments for the event. Event must be part of the store for this method to work.
     * @property {Scheduler.model.AssignmentModel[]}
     * @readonly
     */
    get assignments() {
        return [...(this.assigned || [])];
    }

    /**
     * Assigns this event to the specified resource.
     *
     * *Note:* The event must be part of an EventStore for this to work. If the EventStore uses single assignment
     * (loaded using resourceId) existing assignments will always be removed.
     *
     * @param {Scheduler.model.ResourceModel|String|Number|Scheduler.model.ResourceModel[]|String[]|Number[]} resource A new resource for this event, either as a full
     *        Resource record or an id (or an array of such).
     * @param {Boolean} [removeExistingAssignments] `true` to first remove existing assignments
     */
    assign(resource, removeExistingAssignments = false) {
        const { eventStore } = this;

        if (eventStore && !eventStore.usesSingleAssignment) {
            eventStore.assignEventToResource(this, resource, removeExistingAssignments);
        }
        else {
            // Remember what resource to assign,  directly in single assignment mode or for later when we are joined to
            // an EventStore
            this.resourceId = this.constructor.asId(resource);

            if (!eventStore) {
                // Prevent flagging EventStore as using single assignment when that happens, we cannot know that here
                this.meta.skipEnforcingSingleAssignment = true;
            }
        }
    }

    /**
     * Unassigns this event from the specified resource
     *
     * @param {Scheduler.model.ResourceModel|String|Number} [resource] The resource to unassign from.
     */
    unassign(resource, removingResource = false) {
        const me = this;

        resource = me.constructor.asId(resource);

        // If unassigned is caused by removing the resource the UI should be able to find out to not do extra redraws etc.
        me.meta.removingResource = removingResource;

        me.eventStore?.unassignEventFromResource(me, resource);

        me.meta.removingResource = null;
    }

    /**
     * Reassigns an event from an old resource to a new resource
     *
     * @param {Scheduler.model.ResourceModel|String|Number} oldResourceId A resource to unassign from or its id
     * @param {Scheduler.model.ResourceModel|String|Number} newResourceId A resource to assign to or its id
     */
    reassign(oldResourceId, newResourceId) {
        this.eventStore && this.eventStore.reassignEventFromResourceToResource(this, oldResourceId, newResourceId);
    }

    /**
     * Returns true if this event is assigned to a certain resource.
     *
     * @param {Scheduler.model.ResourceModel|String|Number} resource The resource to query for
     * @return {Boolean}
     */
    isAssignedTo(resource) {
        const resourceId = this.constructor.asId(resource);
        return this.assignments.some(assignment => assignment.resourceId === resourceId);
    }

    //endregion

    //region Dependencies

    /**
     * Returns all predecessor dependencies of this event
     *
     * @readonly
     * @property {Scheduler.model.DependencyBaseModel[]}
     */
    get predecessors() {
        return [...this.incomingDeps];
    }

    /**
     * Returns all successor dependencies of this event
     *
     * @readonly
     * @property {Scheduler.model.DependencyBaseModel[]}
     */
    get successors() {
        return [...this.outgoingDeps];
    }

    get dependencies() {
        return [...this.incomingDeps, ...this.outgoingDeps];
    }

    //endregion

    normalize() {
        // Normalization handled by SchedulingEngine
    }

    inSetNormalize() {
        // Normalization handled by SchedulingEngine
    }

    /**
     * The "main" event this model is an occurrence of.
     * Returns `null` for non-occurrences.
     * @property {Scheduler.model.EventModel}
     * @alias #Scheduler.model.mixin.RecurringTimeSpan#property-recurringTimeSpan
     * @readonly
     */
    get recurringEvent() {
        return this.recurringTimeSpan;
    }

    /**
     * Flag which indicates that this event is an inter day event. This means that it spans
     * an entire day or multiple days.
     *
     * This is essentially used by the Calendar package to determine if an event should
     * go into the all day zone of a DayView.
     *
     * @property {Boolean}
     * @readonly
     */
    get isInterDay() {
        const { durationMS } = this;

        // A full day (86400000 or more) marks as it as interDay,
        // which means it belongs in the all day row of a Calendar DayView
        if (durationMS >= oneDayMS) {
            return true;
        }

        // Working out whether it crosses midnight is a little more difficult
        const
            {
                endDate,
                startDate
            } = this,
            eventStartMidnight = DH.clearTime(startDate);

        // If either is null or NaN, we have to answer falsy
        if (startDate && endDate) {
            eventStartMidnight.setDate(eventStartMidnight.getDate() + 1);

            // If the endDate is past midnight, it's interDay and goes in the all day row of a Calendar DayView
            return (endDate || DH.add(startDate, durationMS)) > eventStartMidnight;
        }
    }

    //region All day statics

    static getAllDayStartDate(dt) {
        if (dt && dt.isEvent) {
            dt = dt.get('startDate');
        }

        if (dt) {
            dt = DH.clearTime(dt, true);
        }

        return dt;
    }

    static getAllDayEndDate(dt) {
        if (dt && dt.isEvent) {
            dt = dt.get('endDate');
        }

        if (dt && (dt.getHours() > 0 || dt.getMinutes() > 0 || dt.getSeconds() > 0 || dt.getMilliseconds() > 0)) {
            dt = DH.getNext(dt, 'd', 1);
        }

        return dt;
    }

    static getAllDayDisplayStartDate(dt) {
        if (dt && dt.isEvent) {
            dt = dt.get('startDate');
        }

        return DH.clearTime(dt, true);
    }

    static getAllDayDisplayEndDate(startDate, endDate) {
        if (startDate && startDate.isEvent) {
            endDate   = startDate.get('endDate');
            startDate = startDate.get('startDate');
        }

        if (endDate) {
            startDate = this.constructor.getAllDayDisplayStartDate(startDate);

            // If date falls on start of the day - subtract one day to show end date correctly
            // e.g. event starts on 2017-01-01 00:00 and ends on 2017-01-02 00:00, editor should show
            // 2017-01-01 for both start and end
            if (DH.clearTime(endDate, true).valueOf() === endDate.valueOf()) {
                endDate = DH.add(endDate, DH.DAY, -1);
            }
            else if (startDate.valueOf() !== endDate.valueOf()) {
                endDate = DH.clearTime(endDate, true);
            }
        }

        return endDate;
    }

    /**
     * Defines if the given event field should be manually editable in UI.
     * You can override this method to provide your own logic.
     *
     * By default the method defines {@link #field-endDate}, {@link #field-duration} and {@link #property-fullDuration} fields
     * editable for leaf events only (in case the event is part of a tree store) and all other fields as editable.
     *
     * @param {String} fieldName Name of the field
     * @returns {Boolean} Returns `true` if the field is editable, `false` if it is not and `undefined` if the event has no such field.
     */
    isEditable(fieldName) {
        switch (fieldName) {
            // end/duration is allowed to edit for leafs
            case 'endDate' :
            case 'duration' :
            case 'fullDuration' :
                return this.isLeaf;
        }

        return super.isEditable(fieldName);
    }

    //endregion
};
