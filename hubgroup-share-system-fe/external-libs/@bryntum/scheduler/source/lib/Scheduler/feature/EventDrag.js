/* eslint-disable no-unused-expressions */
import DragBase from './base/DragBase.js';
import DateHelper from '../../Core/helper/DateHelper.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import DomSync from '../../Core/helper/DomSync.js';
import Rectangle from '../../Core/helper/util/Rectangle.js';
import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';

/**
 * @module Scheduler/feature/EventDrag
 */

//TODO: relay events as in Dependencies. (drag -> eventdrag etc)
//TODO: shift to copy
//TODO: dragging of event that starts & ends outside of view

/**
 * Allows user to drag and drop events within the scheduler, to change startDate or resource assignment.
 *
 * This feature is **enabled** by default
 *
 * Note that changing record data during drag is not supported.
 *
 * ## Customizing the drag drop tooltip
 *
 * To show custom HTML in the tooltip, please see the {@link #config-tooltipTemplate} config. Example:
 *
 * ```javascript
 * features: {
 *     eventDrag : {
 *         // A minimal start date tooltip
 *         tooltipTemplate : ({ eventRecord, startDate }) => {
 *             return DateHelper.format(startDate, 'HH:mm');
 *         }
 *     }
 * }
 * ```
 * @example
 * // constrain drag to current resource
 * let scheduler = new Scheduler({
 *   features: {
 *     eventDrag: {
 *       constrainDragToResource: true
 *     }
 *   }
 * });
 *
 * @extends Scheduler/feature/base/DragBase
 * @demo Scheduler/basic
 * @inlineexample Scheduler/feature/EventDrag.js
 * @classtype eventDrag
 * @feature
 */
export default class EventDrag extends DragBase {
    //region Config

    static get $name() {
        return 'EventDrag';
    }

    static get defaultConfig() {
        return {
            /**
             * Template used to generate drag tooltip contents.
             * ```
             * const scheduler = new Scheduler({
             *   features : {
             *     eventDrag : {
             *       dragTipTemplate({eventRecord, startText}) {
             *         return `${eventRecord.name}: ${startText}`
             *       }
             *     }
             *   }
             * });
             * ```
             * @config {Function} tooltipTemplate
             * @param {Object} data Tooltip data
             * @param {Scheduler.model.EventModel} data.eventRecord
             * @param {Boolean} data.valid Currently over a valid drop target or not
             * @param {Date} data.startDate New start date
             * @param {Date} data.endDate New end date
             * @param {String} data.startText [DEPRECATED] Formatted new start date
             * @param {String} data.endText [DEPRECATED] Formatted new end date
             * @param {String} data.startClockHtml [DEPRECATED] Pre-generated HTML to display startDate as clock/calendar
             * @param {String} data.endClockHtml [DEPRECATED] Pre-generated HTML to display endDate as clock/calendar
             * @param {Object} data.dragData [DEPRECATED] Detailed drag context
             * @returns {String}
             */

            /**
             * Set to true to only allow dragging events within the same resource.
             * @config {Boolean}
             * @default
             */
            constrainDragToResource : false,

            /**
             * Set to true to only allow dragging events to different resources, and disallow rescheduling by dragging.
             * @config {Boolean}
             * @default
             */
            constrainDragToTimeSlot : false,

            /**
             * An empty function by default, but provided so that you can perform custom validation on
             * the item being dragged. This function is called during the drag and drop process and also after the drop is made.
             * Return true if the new position is valid, false to prevent the drag.
             * @param {Object} context A drag drop context object
             * @param {Date} context.startDate New start date
             * @param {Date} context.endDate New end date
             * @param {Scheduler.model.AssignmentModel[]} context.assignmentRecords Assignment records which were dragged
             * @param {Scheduler.model.EventModel[]} context.draggedRecords  **Deprecated** in 4.0. Use `context.eventRecords` instead.
             * @param {Scheduler.model.EventModel[]} context.eventRecords Event records which were dragged
             * @param {Scheduler.model.ResourceModel} context.newResource New resource record
             * @param {Event} event The event object
             * @return {Boolean|Object} `true` if this validation passes, `false` if it does not.
             *
             * Or an object with 2 properties: `valid` -  Boolean `true`/`false` depending on validity,
             * and `message` - String with a custom error message to display when invalid.
             * @config {Function}
             */
            validatorFn : () => {},

            /**
             * The `this` reference for the validatorFn
             * @config {Object}
             */
            validatorFnThisObj : null,

            /**
             * When the host Scheduler is `{@link Scheduler.view.mixin.EventSelection#config-multiEventSelect multiEventSelect}: true`
             * then, there are two modes of dragging *within the same Scheduler*.
             *
             * Non unified means that all selected events are dragged by the same number of resource rows.
             *
             * Unified means that all selected events are collected together and dragged as one, and are all dropped
             * on the same targeted resource row at the same targeted time.
             * @config {Boolean}
             * @default false
             */
            unifiedDrag : null
        };
    }

    //endregion

    //region Events

    /**
     * Fired on the owning Scheduler to allow implementer to prevent immediate finalization by setting `data.context.async = true`
     * in the listener, to show a confirmation popup etc
     * ```
     *  scheduler.on('beforeeventdropfinalize', ({context}) => {
     *      context.async = true;
     *      setTimeout(() => {
     *          // async code don't forget to call finalize
     *          context.finalize();
     *      }, 1000);
     *  })
     * ```
     * Changing record data during drag is not supported.
     *
     * @event beforeEventDropFinalize
     * @on-owner
     * @param {Scheduler.view.Scheduler} source Scheduler instance
     * @param {Object} context
     * @param {Boolean} context.async Set true to handle dragdrop asynchronously (e.g. to wait for user confirmation)
     * @param {Scheduler.model.EventModel[]} context.eventRecords Event records being dragged
     * @param {Scheduler.model.AssignmentModel[]} context.assignmentRecords Assignment records being dragged
     * @param {Scheduler.model.EventModel} context.targetEventRecord Event record for drop target
     * @param {Scheduler.model.ResourceModel} context.newResource Resource record for drop target
     * @param {Function} context.finalize Call this method to finalize drag drop. This method accepts one
     * argument: pass true to update records, or false, to ignore changes
     */

    /**
     * Fired on the owning Scheduler after event drop
     * @event afterEventDrop
     * @on-owner
     * @param {Scheduler.view.Scheduler} source
     * @param {Scheduler.model.AssignmentModel[]} assignmentRecords
     * @param {Scheduler.model.EventModel[]} eventRecords
     * @param {Boolean} valid
     * @param {Object} context
     */

    /**
     * Fired on the owning Scheduler when an event is dropped
     * @event eventDrop
     * @on-owner
     * @param {Scheduler.view.Scheduler} source
     * @param {Scheduler.model.EventModel[]} eventRecords
     * @param {Scheduler.model.AssignmentModel[]} assignmentRecords
     * @param {Boolean} isCopy
     * @param {Object} context
     * @param {Scheduler.model.EventModel} context.targetEventRecord Event record for drop target
     * @param {Scheduler.model.ResourceModel} context.newResource Resource record for drop target
     */

    /**
     * Fired on the owning Scheduler before event dragging starts. Return `false` to prevent the action.
     * @event beforeEventDrag
     * @on-owner
     * @preventable
     * @param {Scheduler.view.Scheduler} source Scheduler instance
     * @param {Scheduler.model.EventModel} eventRecord Event record the drag starts from
     * @param {Scheduler.model.ResourceModel} resourceRecord Resource record the drag starts from
     * @param {Scheduler.model.EventModel[]} eventRecords Event records being dragged
     * @param {Scheduler.model.AssignmentModel[]} assignmentRecords Assignment records being dragged
     * @param {MouseEvent} event Browser event
     * @param {Object} context **Deprecated** in 4.1.1
     */

    /**
     * Fired on the owning Scheduler when event dragging starts
     * @event eventDragStart
     * @on-owner
     * @param {Scheduler.view.Scheduler} source Scheduler instance
     * @param {Scheduler.model.ResourceModel} resourceRecord Resource record the drag starts from
     * @param {Scheduler.model.EventModel[]} eventRecords Event records being dragged
     * @param {Scheduler.model.AssignmentModel[]} assignmentRecords Assignment records being dragged
     * @param {MouseEvent} event Browser event
     * @param {Object} context **Deprecated** in 4.1.1
     */

    /**
     * Fired on the owning Scheduler when event is dragged
     * @event eventDrag
     * @on-owner
     * @param {Scheduler.view.Scheduler} source Scheduler instance
     * @param {Scheduler.model.EventModel[]} eventRecords Event records being dragged
     * @param {Scheduler.model.AssignmentModel[]} assignmentRecords Assignment records being dragged
     * @param {Date} startDate
     * @param {Date} endDate
     * @param {Scheduler.model.ResourceModel} newResource
     * @param {Object} context **Deprecated** in 4.1.1
     */

    /**
     * Fired on the owning Scheduler after an event drag operation has been aborted
     * @event eventDragAbort
     * @on-owner
     * @param {Scheduler.view.Scheduler} source Scheduler instance
     * @param {Scheduler.model.EventModel[]} eventRecords Event records being dragged
     * @param {Scheduler.model.AssignmentModel[]} assignmentRecords Assignment records being dragged
     * @param {Object} context **Deprecated** in 4.1.1
     */
    //endregion

    //region Data layer

    // Deprecated. Use this.client instead
    get scheduler() {
        return this.client;
    }

    //endregion

    //region Drag events

    isElementDraggable(el, event) {
        const
            { scheduler }   = this,
            eventElement    = DomHelper.up(el, scheduler.eventSelector),
            { eventResize } = scheduler.features;

        if (!eventElement || this.disabled) {
            return false;
        }

        // displaying something resizable within the event?
        if (el.matches('[class$="-handle"]')) {
            return false;
        }

        const
            // It is possible to click element for non-existing event. It works like this:
            // 1. you drag create event with eventEdit feature turned on
            // 2. you click event element
            // 3. editor loses focus, removes record from the store, but `remove` event is not triggered until project
            // update
            eventRecord    = scheduler.resolveEventRecord(eventElement),
            eventResizable = eventRecord?.resizable,
            resizable      = eventResizable &&
                // EventResize feature present?
                eventResize && !eventResize.disabled &&
                // Milestones cannot be resized
                !eventRecord.isMilestone &&
                // over a virtual handle?
                (((eventResizable === true || eventResizable === 'start') && eventResize.isOverStartHandle(event, eventElement)) ||
                ((eventResizable === true || eventResizable === 'end') && eventResize.isOverEndHandle(event, eventElement)));

        return !resizable && !scheduler.readOnly;
    }

    getTriggerParams(dragData) {
        const { assignmentRecords, eventRecords, resourceRecord, browserEvent : event } = dragData;

        return {
            // `context` to be deprecated
            context        : dragData,
            // Backward compatibility, `draggedRecords` is deprecated
            draggedRecords : eventRecords,
            eventRecords,
            resourceRecord,
            assignmentRecords,
            event
        };
    }

    triggerEventDrag(dragData, start) {
        // If there has been a change...
        if (dragData.startDate - start !== 0 || dragData.newResource !== dragData.resourceRecord) {
            this.scheduler.trigger('eventDrag', Object.assign(this.getTriggerParams(dragData), {
                startDate   : dragData.startDate,
                endDate     : dragData.endDate,
                newResource : dragData.newResource
            }));
        }
    }

    triggerDragStart(dragData) {
        this.drag.startEvent.ignoreNavigation = true;

        this.scheduler.trigger('eventDragStart', this.getTriggerParams(dragData));
    }

    triggerDragAbort(dragData) {
        this.scheduler.trigger('eventDragAbort', this.getTriggerParams(dragData));
    }

    triggerAfterDrop(dragData, valid) {
        this.currentOverClient.trigger('afterEventDrop', Object.assign(this.getTriggerParams(dragData), {
            valid
        }));
    }

    onDragAbort() {
        // Edge cases:
        // 1. If this drag was a no-op, and underlying data was changed while drag was ongoing (e.g. web socket
        // push), we need to manually force a view refresh to ensure a correct render state
        //
        // or
        // 2. Events were removed before we dropped at an invalid point
        const
            { assignmentStore, eventStore } = this.client,
            needRefresh = this.dragData.initialAssignmentsState.find(({ resource, assignment }, i) => {
                return !assignmentStore.includes(assignment) ||
                    !eventStore.includes(assignment.event) ||
                    resource.id !== this.dragData.assignmentRecords[i]?.resourceId;
            });

        if (needRefresh) {
            this.client.refresh();
        }

        super.onDragAbort(...arguments);
    }

    //endregion

    //region Finalization & validation

    /**
     * Checks if an event can be dropped on the specified resource.
     * @private
     * @returns {Boolean} Valid (true) or invalid (false)
     */
    isValidDrop(dragData) {
        const
            { newResource, resourceRecord } = dragData,
            sourceRecord                    = dragData.draggedEntities[0];

        // Not allowed to drop an event to group header
        if (!newResource || newResource.isSpecialRow) {
            return false;
        }

        // Not allowed to assign an event twice to the same resource
        if (resourceRecord !== newResource) {
            return !sourceRecord.event.resources.includes(newResource);
        }

        return true;
    }

    checkDragValidity(dragData, event) {
        const
            me        = this,
            scheduler = me.currentOverClient;

        let result = me.dragData.context.valid;

        if (result) {
            // First make sure DragHelper thinks it's a valid drag, then scheduler domain checks
            if (!scheduler.allowOverlap && !scheduler.isDateRangeAvailable(
                dragData.startDate,
                dragData.endDate,
                dragData.draggedEntities[0],
                dragData.newResource
            )) {
                result = {
                    valid   : false,
                    message : me.L('L{eventOverlapsExisting}')
                };
            }
            else {
                result = me.validatorFn.call(
                    me.validatorFnThisObj || me,
                    dragData,
                    event
                );
            }
        }

        return result;
    }

    //endregion

    //region Update records

    /**
     * Update events being dragged.
     * @private
     * @param context Drag data.
     * @async
     */
    async updateRecords(context) {
        const
            me             = this,
            fromScheduler  = me.scheduler,
            toScheduler    = me.currentOverClient,
            copyKeyPressed = false;

        fromScheduler.eventStore.suspendAutoCommit();
        toScheduler.eventStore.suspendAutoCommit();

        const result = await me.updateAssignments(fromScheduler, toScheduler, context, copyKeyPressed);

        fromScheduler.eventStore.resumeAutoCommit();
        toScheduler.eventStore.resumeAutoCommit();

        // Tell the world there was a successful drop
        toScheduler.trigger('eventDrop', Object.assign(me.getTriggerParams(context), {
            isCopy               : copyKeyPressed,
            event                : context.browserEvent,
            targetEventRecord    : context.targetEventRecord,
            targetResourceRecord : context.newResource
        }));

        return result;
    }

    /**
     * Update assignments being dragged
     * @private
     * @async
     */
    async updateAssignments(fromScheduler, toScheduler, context, copy) {
        // The code is written to emit as few store events as possible
        const
            me                  = this,
            isCrossScheduler    = (fromScheduler !== toScheduler),
            isVertical          = toScheduler.mode === 'vertical',
            {
                assignmentStore : fromAssignmentStore,
                eventStore      : fromEventStore,
                resourceStore
            }                   = fromScheduler,
            {
                assignmentStore : toAssignmentStore,
                eventStore      : toEventStore,
                resourceStore   : toResourceStore
            }                   = toScheduler,
            {
                eventRecords,
                assignmentRecords,
                timeDiff,
                initialAssignmentsState,
                resourceRecord : fromResource,
                newResource    : toResource
            }                   = context,
            unifiedDrag         = me.unifiedDrag,
            event1Date          = me.adjustStartDate(assignmentRecords[0].event.startDate, timeDiff),
            eventsToAdd         = [],
            eventsToRemove      = [],
            assignmentsToAdd    = [],
            assignmentsToRemove = [],
            eventsToCheck       = [],
            resourcesToRefresh  = new Set(),
            eventsToBatch       = new Set();

        fromScheduler.suspendRefresh();
        toScheduler.suspendRefresh();

        let updated = false,
            updatedEvent = false,
            indexDiff; // By how many resource rows has the drag moved.

        if (isCrossScheduler) {
            // The difference in indices via first dragged event will help us to find resources for all the rest events accordingly
            indexDiff = toResourceStore.indexOf(toResource) - resourceStore.indexOf(fromResource);
        }
        else {
            indexDiff = me.constrainDragToResource ? 0 : resourceStore.indexOf(fromResource) - resourceStore.indexOf(toResource);
        }

        if (isVertical) {
            // TODO : Broken after merge, figure it out
            eventRecords.forEach((draggedEvent, i) => {
                const eventBar = context.eventBarEls[i];

                delete draggedEvent.instanceMeta(fromScheduler).hasTemporaryDragElement;

                // If it was created by a call to scheduler.currentOrientation.addTemporaryDragElement
                // then release it back to be available to DomSync next time the rendered event block
                // is synced.
                if (eventBar.dataset.transient) {
                    eventBar.remove();
                }
            });
        }

        const eventBarEls = context.eventBarEls.slice();
        // Using for to support await inside
        for (let i = 0; i < assignmentRecords.length; i++) {
            // Reassigned when dropped on other scheduler, thus not const
            let draggedAssignment = assignmentRecords[i],
                draggedEvent      = draggedAssignment.event;

            if (!draggedAssignment.isOccurrenceAssignment && (!fromAssignmentStore.includes(draggedAssignment) || !fromEventStore.includes(draggedEvent))) {
                // Event was removed externally during the drag, just remove element from DOM (DomSync already has
                // tried to clean it up at this point, but could not due to retainElement being set)
                eventBarEls[i].remove();
                eventBarEls.splice(i, 1);
                assignmentRecords.splice(i, 1);
                i--;
                continue;
            }

            const
                initialState           = initialAssignmentsState[i],
                originalEventRecord    = draggedEvent,
                originalStartDate      = initialState.startDate,
                // grabbing resource early, since after ".copy()" the record won't belong to any store
                // and ".getResources()" won't work. If it's a move to another scheduler, ensure the
                // array still has a length. The process function will do an assign as opposed
                // to a reassign
                originalResourceRecord = initialState.resource,
                // Calculate new startDate (and round it) based on timeDiff up here, might be added to another
                // eventstore below in which case it is invalidated. But this is anyway the target date
                newStartDate           = this.constrainDragToTimeSlot
                    ? originalStartDate
                    : (unifiedDrag
                        ? event1Date
                        : me.adjustStartDate(originalStartDate, timeDiff));

            resourcesToRefresh.add(originalResourceRecord);

            if (copy) {
                draggedAssignment = draggedAssignment.copy(null);
                assignmentsToAdd.push(draggedAssignment);
            }
            // Dropped on another scheduler, not sharing assignmentStore
            else if (fromAssignmentStore !== toAssignmentStore) {
                const
                    // Single assignment from a multi assigned event dragged over, event needs to be copied over
                    keepEvent     = originalEventRecord.assignments.length > 1,
                    newAssignment = draggedAssignment.copy();

                // Remove assignment from source scheduler
                assignmentsToRemove.push(draggedAssignment);

                // If it was the last assignment, the event should also be removed
                if (!keepEvent) {
                    eventsToRemove.push(originalEventRecord);
                }

                // If event does not already exist in target scheduler a copy is added
                if (!toEventStore.getById(originalEventRecord.id)) {
                    // Clone keeping the same id
                    const clonedData = Object.assign({}, originalEventRecord.data, {
                        id       : originalEventRecord.id,
                        // Engine gets mad if not nulled
                        calendar : null
                    });
                    draggedEvent = clonedData;
                    eventsToAdd.push(clonedData);
                }

                // And add it to the target scheduler
                // TODO: Should be handled on the data layer ideally

                if (!toEventStore.usesSingleAssignment) {
                    assignmentsToAdd.push(newAssignment);
                }
                draggedAssignment = newAssignment;
            }

            let newResource = toResource;

            if (!unifiedDrag) {
                if (!isCrossScheduler) {
                    // If not dragging events as a unified block, distribute each to a new resource
                    // using the same offset as the dragged event.
                    if (indexDiff !== 0) {
                        const newIndex = Math.max(
                            Math.min(
                                resourceStore.indexOf(originalResourceRecord) - indexDiff,
                                resourceStore.count - 1
                            ),
                            0
                        );

                        newResource = resourceStore.getAt(newIndex);
                    }
                    else {
                        newResource = originalResourceRecord;
                    }
                }
                // we have a resource for first dragged event in toResource
                else if (i > 0) {
                    const draggedEventResourceIndex = originalResourceRecord.resourceStore.indexOf(originalResourceRecord);
                    newResource = newResource.resourceStore.getAt(draggedEventResourceIndex + indexDiff) || newResource;
                }
            }

            resourcesToRefresh.add(newResource);

            // Cannot rely on assignment generation to detect update, since it might be a new assignment
            if (draggedAssignment.resource !== newResource) {
                draggedAssignment.resource = newResource;
                // Actual events should be batched, not data for new events when dragging between
                draggedEvent.isEvent && eventsToBatch.add(draggedEvent);
                updated = true;

                // When dragging an occurrence, the assignment is only temporary. We have to tag the newResource along
                // to be picked up by the occurrence -> event conversion
                // TODO: A hack, figure a better way out
                if (draggedEvent.isOccurrence) {
                    draggedEvent.set('newResource', newResource);
                }

                // TODO: Should be handled on the datalayer somehow, but it is kind of edge casey
                if (isCrossScheduler && toEventStore.usesSingleAssignment) {
                    // In single assignment mode, when dragged to another scheduler it will not copy the assignment
                    // over but instead set the resourceId of the event. To better match expected behaviour
                    draggedEvent.resourceId = newResource.id;
                }
            }

            // Same for event
            if (!eventsToCheck.find(ev => ev.draggedEvent === draggedEvent) && !DateHelper.isEqual(draggedEvent.startDate, newStartDate)) {
                draggedEvent.startDate = newStartDate;

                eventsToCheck.push({ draggedEvent, originalStartDate });

                draggedEvent.isEvent && eventsToBatch.add(draggedEvent);
                updatedEvent = true;

                // When changing date, all assignments are affected so might need to redraw more resources
                // (might be a clone, no resources then)
                draggedEvent.resources?.forEach(resource => resourcesToRefresh.add(resource));
            }
        }

        fromAssignmentStore.remove(assignmentsToRemove);
        fromEventStore.remove(eventsToRemove);
        toAssignmentStore.add(assignmentsToAdd);

        const addedEvents = toEventStore.add(eventsToAdd);

        // When not constrained to timeline we are dragging a clone and need to manually do some cleanup if
        // dropped in view
        if (!me.constrainDragToTimeline) {
            // go through assignmentRecords again after events has been added to toEventStore (if any)
            // now we have updated assignment ids and can properly reuse event HTML elements
            for (let i = 0; i < assignmentRecords.length; i++) {
                const
                    originalDraggedEvent = assignmentRecords[i].event,
                    // try to get dragged event from addedEvents array, it will be there with updated ids
                    // if toScheduler is different
                    draggedEvent = addedEvents?.find(r => r.id === originalDraggedEvent.id) || originalDraggedEvent,
                    eventBar     = context.eventBarEls[i],
                    element      = i === 0 ? context.context.element : context.context.relatedElements[i - 1],
                    // Determine if in time axis here also, since the records date might be invalidated further below
                    inTimeAxis   = toScheduler.isInTimeAxis(draggedEvent);

                // Remove original element properly
                DomSync.removeChild(fromScheduler.foregroundCanvas, eventBar);

                if (draggedEvent.resource && toScheduler.rowManager.getRowFor(draggedEvent.resource) && inTimeAxis) {
                    const elRect = Rectangle.from(element, toScheduler.foregroundCanvas, true);

                    // Ensure that after inserting the dragged element clone into the toScheduler's foregroundCanvas
                    // it's at the same visual position that it was dragged to.
                    DomHelper.setTranslateXY(element, elRect.x, elRect.y);
                    element.classList.remove('b-sch-event-hover');
                    element.classList.remove('b-active');
                    element.classList.remove('b-drag-proxy');
                    element.classList.remove('b-dragging');
                    element.retainElement = false;

                    // Add element properly, so that DomSync will reuse it on next update
                    DomSync.addChild(toScheduler.foregroundCanvas, element, draggedEvent.assignments[0].id);
                }
            }
        }

        addedEvents?.forEach(added => eventsToBatch.add(added));

        // addedEvents order is the same with [context.element, ..context.relatedElements]
        // Any added or removed events or assignments => something changed
        if (assignmentsToRemove.length || eventsToRemove.length || assignmentsToAdd.length || eventsToAdd.length) {
            updated = true;
        }

        // Commit changes to affected projects
        if (updated || updatedEvent) {
            // By batching event changes when using single assignment we avoid two updates, without it there will be one
            // for date change and one when changed assignment updates resourceId on the event
            toEventStore.usesSingleAssignment && eventsToBatch.forEach(eventRecord => eventRecord.beginBatch());

            await Promise.all([
                toScheduler.project !== fromScheduler.project ? toScheduler.project.commitAsync() : null,
                fromScheduler.project.commitAsync()
            ]);

            // End batch in engine friendly way, avoiding to have `set()` trigger another round of calculations
            toEventStore.usesSingleAssignment && eventsToBatch.forEach(eventRecord => eventRecord.endBatch(false, true));
        }

        if (!updated) {
            // Engine might have reverted the date change, in which case this should be considered an invalid op
            updated = eventsToCheck.some(({ draggedEvent, originalStartDate }) =>
                !DateHelper.isEqual(draggedEvent.startDate, originalStartDate)
            );
        }

        // Resumes self twice if not cross scheduler, but was suspended twice above also so all good
        toScheduler.resumeRefresh();
        fromScheduler.resumeRefresh();

        if (assignmentRecords.length > 0) {
            if (!updated) {
                context.valid = false;
            }
            else {
                // Not doing full refresh above, to allow for animations
                toScheduler.refreshWithTransition();

                if (isCrossScheduler) {
                    fromScheduler.refreshWithTransition();
                }
            }
        }
    }

    //endregion

    //region Drag data

    getProductDragContext(dragData) {
        const targetEventRecord = this.scheduler.resolveEventRecord(dragData.browserEvent.target);

        let newResource;

        if (this.constrainDragToResource) {
            newResource = dragData.resourceRecord;
        }
        else if (!this.constrainDragToTimeline) {
            // If we're dragging freely on the page, require to drag onto a resource row always
            newResource = this.resolveResource();
        }
        else {
            newResource = this.resolveResource() || dragData.newResource || dragData.resourceRecord;
        }

        const { assignmentRecords, eventRecords } = dragData;

        return {
            valid          : Boolean(newResource),
            // `draggedRecords` is deprecated
            draggedRecords : eventRecords,
            eventRecords,
            assignmentRecords,
            newResource,
            targetEventRecord
        };
    }

    getMinimalDragData(info) {
        const
            me                = this,
            { scheduler }     = me,
            element           = me.getElementFromContext(info),
            eventRecord       = scheduler.resolveEventRecord(element),
            resourceRecord    = scheduler.resolveResourceRecord(element),
            assignmentRecord  = scheduler.resolveAssignmentRecord(element),
            assignmentRecords = assignmentRecord ? [assignmentRecord] : [];

        // We multi drag other selected events if multiEventSelect is set and
        // (the dragged event is already selected, or the ctrl key is pressed)
        if (scheduler.multiEventSelect && assignmentRecord && (scheduler.isAssignmentSelected(assignmentRecords[0]) || me.drag.startEvent.ctrlKey)) {
            assignmentRecords.push.apply(assignmentRecords, me.getRelatedRecords(assignmentRecord));
        }

        const eventRecords = [...new Set(assignmentRecords.map(assignment => assignment.event))];

        return {
            eventRecord,
            resourceRecord,
            assignmentRecord,
            eventRecords,
            assignmentRecords
        };
    }

    setupProductDragData(info) {
        const
            me               = this,
            { scheduler }    = me,
            element          = me.getElementFromContext(info),
            {
                eventRecord,
                resourceRecord,
                assignmentRecord,
                assignmentRecords
            } = me.getMinimalDragData(info),
            eventRegion      = Rectangle.from(element),
            eventBarEls      = [];

        if (me.constrainDragToResource && !resourceRecord) {
            throw new Error('Resource could not be resolved for event: ' + eventRecord.id);
        }

        const dateConstraints = scheduler.getDateConstraints(me.constrainDragToResource ? resourceRecord : null, eventRecord);

        if (me.constrainDragToTimeline) {
            me.setupConstraints(
                scheduler.getScheduleRegion(me.constrainDragToResource ? resourceRecord : null, eventRecord),
                eventRegion,
                scheduler.timeAxisViewModel.snapPixelAmount,
                Boolean(dateConstraints)
            );
        }

        // Collecting all elements to drag
        assignmentRecords.forEach(assignment => {
            let eventBarEl = scheduler.getElementFromAssignmentRecord(assignment);

            if (!eventBarEl) {
                eventBarEl = scheduler.currentOrientation.addTemporaryDragElement(assignment.event, assignment.resource);

                eventBarEl = eventBarEl.innerElement;
            }

            eventBarEls.push(eventBarEl);
        });

        // What is dragged is the wrapper.
        eventBarEls.forEach((el, i) => eventBarEls[i] = el.parentNode);

        return {
            record          : assignmentRecord,
            draggedEntities : assignmentRecords,
            dateConstraints,
            eventBarEls
        };
    }

    /**
     * Initializes drag data (dates, constraints, dragged events etc). Called when drag starts.
     * @private
     * @param info
     * @returns {*}
     */
    getDragData(info) {
        const dragData = this.getMinimalDragData(info) || {};

        return {
            ...super.getDragData(info),
            ...dragData,
            initialAssignmentsState : dragData.assignmentRecords.map(assignment => ({
                startDate : assignment.event.startDate,
                resource  : assignment.resource,
                assignment
            }))
        };
    }

    /**
     * Provide your custom implementation of this to allow additional selected records to be dragged together with the original one.
     * @param {Scheduler.model.AssignmentModel} assignmentRecord The assignment about to be dragged
     * @return {Scheduler.model.AssignmentModel[]} An array of assignment records to drag together with the original
     */
    getRelatedRecords(assignmentRecord) {
        return this.scheduler.selectedAssignments.filter(selectedRecord => selectedRecord !== assignmentRecord && selectedRecord.event.isDraggable);
    }

    /**
     * Get correct axis coordinate depending on schedulers mode (horizontal -> x, vertical -> y). Also takes milestone
     * layout into account.
     * @private
     * @param {Scheduler.model.EventModel} eventRecord Record being dragged
     * @param {HTMLElement} element Element being dragged
     * @param {Number[]} coord XY coordinates
     * @returns {Number|Number[]} X,Y or XY
     */
    getCoordinate(eventRecord, element, coord) {
        const scheduler = this.currentOverClient;

        if (scheduler.isHorizontal) {
            let x = coord[0];

            // Adjust coordinate for milestones if using a layout mode, since they are aligned differently than events
            if (scheduler.milestoneLayoutMode !== 'default' && eventRecord.isMilestone) {
                switch (scheduler.milestoneAlign) {
                    case 'center':
                        x += element.offsetWidth / 2;
                        break;
                    case 'end':
                        x += element.offsetWidth;
                        break;
                }
            }

            return x;
        }
        else {
            let y = coord[1];
            // Adjust coordinate for milestones if using a layout mode, since they are aligned differently than events
            if (scheduler.milestoneLayoutMode !== 'default' && eventRecord.isMilestone) {
                switch (scheduler.milestoneAlign) {
                    case 'center':
                        y += element.offsetHeight / 2;
                        break;
                    case 'end':
                        y += element.offsetHeight;
                        break;
                }
            }

            return y;
        }
    }

    /**
     * Get resource record occluded by the drag proxy.
     * @private
     * @returns {Scheduler.model.ResourceModel}
     */
    resolveResource() {
        const
            element            = this.dragData.dragProxy || this.dragData.context.element,
            client             = this.currentOverClient,
            { isHorizontal }   = client,
            { context }        = this.dragData,
            // Page coords for elementFromPoint
            pageRect           = Rectangle.from(element, null, true),
            y                  = (client.isVertical || this.unifiedDrag) ? context.clientY : pageRect.center.y,
            // Local coords to resolve resource in vertical
            localRect          = Rectangle.from(element, client.timeAxisSubGridElement, true),
            { x : lx, y : ly } = localRect.center;

        let resource;
        // This is benchmarked as the fastest way to find a Grid Row from a viewport Y coordinate
        // so use it in preference to elementFromPoint (which causes a forced synchronous layout) in horizontal mode.
        if (isHorizontal) {
            const row = client.rowManager.getRowAt(y);

            resource = row && client.resourceStore.getAt(row.dataIndex);
        }
        else {
            // In vertical mode, just use the X coordinate to find out which resource we are under.
            // The method requires that a .b-sch-timeaxis-cell element be passed.
            // There is only one in vertical mode, so use that.
            resource = client.resolveResourceRecord(client.timeAxisSubGridElement.querySelector('.b-sch-timeaxis-cell'), [lx, ly]);
        }

        return resource;
    }

    //endregion

    //region Other stuff

    adjustStartDate(startDate, timeDiff) {
        const scheduler = this.currentOverClient;

        return scheduler.timeAxis.roundDate(new Date(startDate - 0 + timeDiff), scheduler.snapRelativeToEventStartDate ? startDate : false);
    }

    getRecordElement(assignmentRecord) {
        return this.scheduler.getElementFromAssignmentRecord(assignmentRecord, true);
    }

    //endregion
}

GridFeatureManager.registerFeature(EventDrag, true, 'Scheduler');
GridFeatureManager.registerFeature(EventDrag, false, 'ResourceHistogram');
