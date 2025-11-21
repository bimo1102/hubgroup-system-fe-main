/* eslint-disable no-unused-expressions */

/**
 * @module Scheduler/data/mixin/SharedEventStoreMixin
 */

/**
 * This is a mixin, containing functionality related to managing events.
 *
 * It is consumed by the regular {@link Scheduler.data.EventStore} class and Scheduler Pros counterpart.
 *
 * @mixin
 */
export default Target => class SharedEventStoreMixin extends Target {
    static get $name() {
        return 'SharedEventStoreMixin';
    }

    /**
     * Add events to the store.
     *
     * NOTE: Dates, durations and references (assignments, resources) on the events are determined async by a calculation
     * engine. Thus they cannot be directly accessed after using this function.
     *
     * For example:
     *
     * ```javascript
     * eventStore.add({ startDate, duration });
     * // endDate is not yet calculated
     * ```
     *
     * To guarantee data is in a calculated state, wait for calculations for finish:
     *
     * ```javascript
     * eventStore.add({ startDate, duration });
     * await eventStore.project.commitAsync();
     * // endDate is calculated
     * ```
     *
     * Alternatively use `addAsync()` instead:
     *
     * ```javascript
     * await eventStore.addAsync({ startDate, duration });
     * // endDate is calculated
     * ```
     *
     * @param {Scheduler.model.EventModel|Scheduler.model.EventModel[]|Object|Object[]} records
     * Array of records/data or a single record/data to add to store
     * @param {Boolean} [silent] Specify `true` to suppress events
     * @returns {Scheduler.model.EventModel[]} Added records
     * @function add
     * @category CRUD
     */

    /**
     * Add events to the store and triggers calculations directly after. Await this function to have up to date data on
     * the added events.
     *
     * ```javascript
     * await eventStore.addAsync({ startDate, duration });
     * // endDate is calculated
     * ```
     *
     * @param {Scheduler.model.EventModel|Scheduler.model.EventModel[]|Object|Object[]} records
     * Array of records/data or a single record/data to add to store
     * @param {Boolean} [silent] Specify `true` to suppress events
     * @returns {Scheduler.model.EventModel[]} Added records
     * @function addAsync
     * @category CRUD
     * @async
     */

    /**
     * Applies a new dataset to the EventStore. Use it to plug externally fetched data into the store.
     *
     * NOTE: Dates, durations and relations (assignments, resources) on the events are determined async by a calculation
     * engine. Thus they cannot be directly accessed after assigning the new dataset.
     *
     * For example:
     *
     * ```javascript
     * eventStore.data = [{ startDate, duration }];
     * // eventStore.first.endDate is not yet calculated
     * ```
     *
     * To guarantee data is in a calculated state, wait for calculations for finish:
     *
     * ```javascript
     * eventStore.data = [{ startDate, duration }];
     * await eventStore.project.commitAsync();
     * // eventStore.first.endDate is calculated
     * ```
     *
     * Alternatively use `loadDataAsync()` instead:
     *
     * ```javascript
     * await eventStore.loadDataAsync([{ startDate, duration }]);
     * // eventStore.first.endDate is calculated
     * ```
     *
     * @member {Object[]} data
     * @category Records
     */

    /**
     * Applies a new dataset to the EventStore and triggers calculations directly after. Use it to plug externally
     * fetched data into the store.
     *
     * ```javascript
     * await eventStore.loadDataAsync([{ startDate, duration }]);
     * // eventStore.first.endDate is calculated
     * ```
     *
     * @param {Object[]} data Array of EventModel data objects
     * @function loadDataAsync
     * @category CRUD
     * @async
     */

    static get defaultConfig() {
        return {
            /**
             * CrudManager must load stores in the correct order. Lowest first.
             * @private
             */
            loadPriority : 100,
            /**
             * CrudManager must sync stores in the correct order. Lowest first.
             * @private
             */
            syncPriority : 200,

            storeId : 'events',

            /**
             * Configure with `true` to also remove the event when removing the last assignment from the linked
             * AssignmentStore. This config has not effect when using EventStore in legacy `resourceId`-mode.
             * @config {Boolean}
             * @default
             * @category Common
             */
            removeUnassignedEvent : true
        };
    }

    /**
     * Class used to represent records. Defaults to class EventModel.
     * @property {Scheduler.model.EventModel}
     * @category Records
     * @name modelClass
     * @typings {typeof EventModel}
     */

    construct(config) {
        super.construct(config, true);

        if (!this.modelClass.isEventModel) {
            throw new Error('The model for the EventStore must subclass EventModel');
        }
    }

    /**
     * Appends a new record to the store
     * @param {Scheduler.model.EventModel} record The record to append to the store
     * @category CRUD
     */
    append(record) {
        return this.add(record);
    }

    //region Project

    get project() {
        return super.project;
    }

    set project(project) {
        super.project = project;

        this.detachListeners('project');

        if (project) {
            // Project already has AssignmentStore instance? Attach to it.
            if (project.assignmentStore?.isAssignmentStore) {
                this.attachToAssignmentStore(project.assignmentStore);
            }

            // Accessing assignmentStore would trigger `assignmentStoreChange` event on the project, so we set up
            // the listener after
            project.on({
                name                  : 'project',
                assignmentStoreChange : 'onProjectAssignmentStoreChange',
                thisObj               : this,
                prio                  : 200 // Before UI updates
            });
        }
    }

    //endregion

    //region Single assignment

    processRecords(eventRecords) {
        const
            { assignmentStore } = this,
            assignmentsToAdd = [];

        eventRecords = super.processRecords(eventRecords, assignmentStore && !this.stm?.isRestoring && (eventRecord => {
            // AssignmentStore found, add an assignment to it if this is not a dataset operation
            const resourceId = eventRecord.get('resourceId');

            if (!eventRecord.reassignedFromReplace && resourceId != null) {
                // Check if the event is already assigned to the resource, though it's not in the event store.
                // It could happen when you remove an event, so both event and assignment records are removed,
                // then you "undo" the action and the assignment is restored before the event is restored.
                if (!assignmentStore.includesAssignment(eventRecord.id, resourceId)) {
                    // Cannot use `event.assign(resourceId)` since event is not part of store yet
                    // Using a bit shorter generated id to not look so ugly in DOM
                    assignmentsToAdd.push({
                        id      : assignmentStore.modelClass.generateId(''),
                        resourceId,
                        eventId : eventRecord.id
                    });
                }
            }

            // clear flag
            eventRecord.reassignedFromReplace = false;
        }) || undefined);

        assignmentStore?.add(assignmentsToAdd);

        return eventRecords;
    }

    joinRecordsToStore(records) {
        const { assignmentStore } = this;

        if (assignmentStore) {
            // When adding a number of event records CoreEventMixin#joinProject method will clear/rebuild cache in a loop.
            // We raise this flag to skip invalidating assignment store indices for the time we are joining records to
            // the store. When they're added and indices are read, we will invalidate them.
            assignmentStore.skipInvalidateIndices = true;

            super.joinRecordsToStore(records);

            assignmentStore.storage.invalidateIndices();

            assignmentStore.skipInvalidateIndices = false;
        }
        else {
            super.joinRecordsToStore(records);
        }
    }

    processRecord(eventRecord, isDataset = false) {
        eventRecord = super.processRecord(eventRecord, isDataset);

        const resourceId = eventRecord.get('resourceId');

        if (resourceId != null) {
            const
                me                  = this,
                { assignmentStore } = me,
                existingRecord      = me.getById(eventRecord.id),
                isReplacing         = existingRecord && existingRecord !== eventRecord && !isDataset;

            // Replacing an existing event, repoint the resource of its assignment
            // (already repointed to the new event by engine in EventStoreMixin)
            if (isReplacing) {
                // Have to look assignment up on store, removed by engine in super call above
                const assignment = assignmentStore.find(e => e.eventId === eventRecord.id);
                if (assignment) {
                    assignment.resource = resourceId;
                    eventRecord.reassignedFromReplace = true;
                }
            }
            // No AssignmentStore assigned yet, need to process when that happens. Or if it is a dataset operation,
            // processing will happen at the end of it to not add individual assignment (bad for performance)
            else {
                me.$processResourceIds = true;
            }

            // Flag that we have been loaded using resourceId, checked by CrudManager to exclude the internal
            // AssignmentStore from sync
            me.usesSingleAssignment = true;
        }

        return eventRecord;
    }

    processResourceIds() {
        const { assignmentStore } = this;

        if (this.$processResourceIds && assignmentStore?.isAssignmentStore) {
            const assignments = [];

            // resourceIds used during initialization, convert into assignments
            this.forEach(eventRecord => {
                const { resourceId, id : eventId } = eventRecord;
                if (resourceId != null) {
                    // Using a bit shorter generated id to not look so ugly in DOM
                    assignments.push({
                        id : assignmentStore.modelClass.generateId(''),
                        resourceId,
                        eventId
                    });
                }
            });

            // Disable as much as possible, since we are in full control of this store when using single assignment mode
            assignmentStore.useRawData = {
                disableDefaultValue     : true,
                disableDuplicateIdCheck : true,
                disableTypeConversion   : true
            };
            // Flag that throws in AssignmentStore if data is loaded some other way when using single assignment
            assignmentStore.usesSingleAssignment = false;

            assignmentStore.data = assignments;

            assignmentStore.usesSingleAssignment = true;

            this.$processResourceIds = false;
        }
    }

    loadData() {
        super.loadData(...arguments);

        this.processResourceIds();
    }

    // Optionally remove unassigned events
    onBeforeRemoveAssignment({ records }) {
        const me = this;

        if (
            me.removeUnassignedEvent && !me.isRemoving && !me.isSettingData && (!me.stm?.isRestoring) &&
            !me.usesSingleAssignment
        ) {
            const toRemove = new Set();
            // Collect all events that are unassigned after the remove
            records.forEach(assignmentRecord => {
                const { event } = assignmentRecord;
                // Assignment might not have an event or the event might already be removed
                if (event && !event.isRemoved && event.assignments.every(a => records.includes(a))) {
                    toRemove.add(event);
                }
            });

            // And remove them
            if (toRemove.size) {
                me.remove([...toRemove]);
            }
        }
    }

    onProjectAssignmentStoreChange({ store }) {
        this.attachToAssignmentStore(store);
    }

    attachToAssignmentStore(assignmentStore) {
        const me = this;

        me.detachListeners('assignmentStore');

        if (assignmentStore) {
            me.processResourceIds();

            assignmentStore.on({
                name : 'assignmentStore',

                // Adding an assignment in single assignment mode should set events resourceId if needed
                addPreCommit({ records }) {
                    if (me.usesSingleAssignment && !me.isSettingData && !me.isAssigning) {
                        records.forEach(assignment => {
                            const { event } = assignment;
                            if (event?.isEvent && event.resourceId !== assignment.resourceId) {
                                event.meta.isAssigning = true;
                                event.set('resourceId', assignment.resourceId);
                                event.meta.isAssigning = false;
                            }
                        });
                    }
                },

                // Called both for remove and removeAll
                beforeRemove : 'onBeforeRemoveAssignment',

                // Removing an assignment in single assignment mode should set events resourceId to null
                removePreCommit({ records }) {
                    if (me.usesSingleAssignment) {
                        records.forEach(assignment => {
                            // With engine link to event is already broken when we get here, hence the lookup
                            me.getById(assignment.eventId)?.set('resourceId', null);
                        });
                    }
                },

                removeAllPreCommit() {
                    if (me.usesSingleAssignment && !me.isSettingData) {
                        me.allRecords.forEach(eventRecord => eventRecord.set('resourceId', null));
                    }
                },

                // Keep events resourceId in sync with assignment on changes in single assignment mode
                update({ record, changes }) {
                    if (me.usesSingleAssignment && 'resourceId' in changes) {
                        const { event } = record;
                        event.meta.isAssigning = true;
                        event.set('resourceId', changes.resourceId.value);
                        event.meta.isAssigning = false;
                    }
                },
                thisObj : me
            });
        }
    }

    set data(data) {
        this.isSettingData = true;

        // // When using single assignment, remove all assignments when loading a new set of events
        if (this.usesSingleAssignment && !this.syncDataOnLoad) {
            this.assignmentStore.removeAll(true);
        }

        super.data = data;

        this.isSettingData = false;
    }

    // Override trigger to decorate update/change events with a flag if resourceId was the only thing changed, in which
    // case the change most likely can be ignored since the assignment will also change
    trigger(eventName, params) {
        const { changes } = params || {};

        if (changes && 'resourceId' in changes && Object.keys(changes).length === 1) {
            params.isAssign = true;
        }

        return super.trigger(...arguments);
    }

    //endregion
};
