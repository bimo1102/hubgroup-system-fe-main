import DragCreateBase from './base/DragCreateBase.js';
import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';
import DateHelper from '../../Core/helper/DateHelper.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';

/**
 * @module Scheduler/feature/EventDragCreate
 */

/**
 * Feature that allows the user to create new events by dragging in empty parts of the scheduler rows.
 *
 * This feature is **enabled** by default
 *
 * **NOTE:** Incompatible with the {@link Scheduler.feature.EventDragSelect EventDragSelect} and the {@link Scheduler.feature.Pan Pan} features.
 *
 * @extends Scheduler/feature/base/DragCreateBase
 * @demo Scheduler/basic
 * @inlineexample Scheduler/feature/EventDragCreate.js
 * @classtype eventDragCreate
 * @feature
 */
export default class EventDragCreate extends DragCreateBase {
    //region Config

    static get $name() {
        return 'EventDragCreate';
    }

    static get configurable() {
        return {
            /**
             * An empty function by default, but provided so that you can perform custom validation on the event being created.
             * Return true if the new event is valid, false to prevent an event being created.
             * @param {Object} context A drag create context
             * @param {Date} context.startDate Event start date
             * @param {Date} context.endDate Event end date
             * @param {Scheduler.model.EventModel} context.record Event record
             * @param {Scheduler.model.ResourceModel} context.resourceRecord Resource record
             * @param {Event} event The event object
             * @return {Boolean} `true` if this validation passes
             * @config {function}
             */
            validatorFn : () => true
        };
    }

    //endregion

    //region Events

    /**
     * Fires on the owning Scheduler after the new event has been created.
     * @event dragCreateEnd
     * @on-owner
     * @param {Scheduler.view.Scheduler} source
     * @param {Scheduler.model.EventModel} eventRecord The new `EventModel` record.
     * @param {Scheduler.model.EventModel} newEventRecord DEPRECATED: will be removed in 5.0, use `eventRecord` instead.
     * @param {Scheduler.model.ResourceModel} resourceRecord The resource for the row in which the event is being created.
     * @param {MouseEvent} event The ending mouseup event.
     * @param {HTMLElement} eventElement The DOM element representing the newly created event un the UI.
     * @param {HTMLElement} proxyElement DEPRECATED: will be removed in 5.0, use `eventElement` instead.
     */

    /**
     * Fires on the owning Scheduler at the beginning of the drag gesture
     * @event beforeDragCreate
     * @on-owner
     * @param {Scheduler.view.Scheduler} source
     * @param {Scheduler.model.ResourceModel} resourceRecord
     * @param {Date} date The datetime associated with the drag start point.
     */

    /**
     * Fires on the owning Scheduler after the drag start has created a proxy element.
     * @event dragCreateStart
     * @on-owner
     * @param {Scheduler.view.Scheduler} source
     * @param {HTMLElement} proxyElement The proxy representing the new event.
     */

    /**
     * Fires on the owning Scheduler to allow implementer to prevent immediate finalization by setting `data.context.async = true`
     * in the listener, to show a confirmation popup etc
     * ```
     *  scheduler.on('beforedragcreatefinalize', ({context}) => {
     *      context.async = true;
     *      setTimeout(() => {
     *          // async code don't forget to call finalize
     *          context.finalize();
     *      }, 1000);
     *  })
     * ```
     * @event beforeDragCreateFinalize
     * @on-owner
     * @param {Scheduler.view.Scheduler} source Scheduler instance
     * @param {HTMLElement} proxyElement Proxy element, representing future event
     * @param {Object} context
     * @param {Boolean} context.async Set true to handle drag create asynchronously (e.g. to wait for user
     * confirmation)
     * @param {Function} context.finalize Call this method to finalize drag create. This method accepts one
     * argument: pass true to update records, or false, to ignore changes
     */

    /**
     * Fires on the owning Scheduler at the end of the drag create gesture whether or not
     * a new event was created by the gesture.
     * @event afterDragCreate
     * @on-owner
     * @param {Scheduler.view.Scheduler} source
     * @param {HTMLElement} proxyElement The proxy element showing the drag creation zone.
     */

    //endregion

    //region Init

    construct(scheduler, config) {
        this.scheduler = scheduler;

        super.construct(scheduler, config);
    }

    get store() {
        return this.scheduler.eventStore;
    }

    //endregion

    //region Scheduler specific implementation

    handleBeforeDragCreate(drag, eventRecord, event) {
        const
            result = this.scheduler.trigger('beforeDragCreate', {
                resourceRecord : drag.resourceRecord,
                date           : drag.mousedownDate,
                event
            });

        // Save date constraints
        this.dateConstraints = this.scheduler.getDateConstraints(drag.resourceRecord, eventRecord);

        return result;
    }

    dragStart(drag) {
        const
            me               = this,
            { client }       = me,
            {
                eventStore,
                assignmentStore,
                enableEventAnimations,
                features
            }                  = client,
            { resourceRecord } = drag,
            eventRecord        = me.createEventRecord(drag),
            eventEditAvailable = Boolean(features.eventEdit && !features.eventEdit.disabled || features.taskEdit && !features.taskEdit.disabled || features.simpleEventEdit && !features.simpleEventEdit.disabled),
            resourceRecords    = [resourceRecord];

        eventRecord.set('duration', DateHelper.diff(eventRecord.startDate, eventRecord.endDate, eventRecord.durationUnit, true));

        // This presents the event to be scheduled for validation at the proposed mouse/date point
        // If rejected, we cancel operation
        if (me.handleBeforeDragCreate(drag, eventRecord, drag.event) === false) {
            return false;
        }

        // If we're drag-creating in a resource-based view...
        // Assign resource before toggling isCreating to process assignments
        if (resourceRecord) {
            assignmentStore.assignEventToResource(eventRecord, resourceRecord);
        }

        // It's only a provisional event if there is an event edit feature available to
        // cancel the add (by removing it). Otherwise it's a definite event creation.
        eventRecord.isCreating = eventEditAvailable;

        // Vetoable beforeEventAdd allows cancel of this operation
        if (client.trigger('beforeEventAdd', { eventRecord, resourceRecords }) === false) {
            return false;
        }
        client.onEventCreated?.(eventRecord);

        client.enableEventAnimations = false;
        eventStore.add(eventRecord);
        client.project.commitAsync().then(() => client.enableEventAnimations = enableEventAnimations);

        // Element must be created synchronously, not after the project's normalizing delays.
        // Overrides the check for isEngineReady in VerticalRendering so that the newly added record
        // will be rendered when we call refreshRows.
        client.isCreating = true;
        client.refreshRows();
        client.isCreating = false;

        // Set the element we are dragging
        drag.itemElement = drag.element = client.getEventElement(eventRecord);

        return super.dragStart(drag);
    }

    checkValidity(context, event) {
        const
            me         = this,
            { client } = me;

        // Nicer for users of validatorFn
        context.resourceRecord = me.dragging.resourceRecord;
        return (
            client.allowOverlap ||
            client.isDateRangeAvailable(context.startDate, context.endDate, context.eventRecord, context.resourceRecord)
        ) && me.createValidatorFn.call(me.validatorFnThisObj || me, context, event);
    }

    // Determine if resource already has events or not
    isRowEmpty(resourceRecord) {
        const events = this.store.getEventsForResource(resourceRecord);
        return !events || !events.length;
    }

    //endregion

    triggerBeforeFinalize(event) {
        this.client.trigger(`beforeDragCreateFinalize`, event);
    }

    /**
     * Creates an event by the event object coordinates
     * @param {Object} drag The Bryntum event object
     * @private
     */
    createEventRecord(drag) {
        const
            me          = this,
            { client }  = me,
            dimension   = client.isHorizontal ? 'X' : 'Y',
            {
                timeAxis,
                eventStore
            }           = client,
            {
                event,
                mousedownDate,
                date
            }           = drag,
            draggingEnd = me.draggingEnd = event[`page${dimension}`] > drag.startEvent[`page${dimension}`],
            eventConfig = {
                name      : eventStore.modelClass.fieldMap.name.defaultValue || me.L('L{Object.newEvent}'),
                startDate : DateHelper.floor(draggingEnd ? mousedownDate : date, timeAxis.resolution),
                endDate   : DateHelper.ceil(draggingEnd ? date : mousedownDate, timeAxis.resolution)
            };

        /**
         * if project model has been imported from Gantt, we have to define constaint data directly to correct
         * auto-scheduling while dragCreate
         */
        if (client.project.isGanttProjectMixin) {
            ObjectHelper.assign(eventConfig, {
                constraintDate : eventConfig.startDate,
                constraintType : 'startnoearlierthan'
            });
        }
        return eventStore.createRecord(eventConfig);
    }
}

GridFeatureManager.registerFeature(EventDragCreate, true, 'Scheduler');
GridFeatureManager.registerFeature(EventDragCreate, false, 'ResourceHistogram');
