import Popup from '../../Core/widget/Popup.js';

/**
 * @module Scheduler/view/EventEditor
 */

/**
 * Provided event editor dialog.
 *
 * @extends Core/widget/Popup
 * @private
 */
export default class EventEditor extends Popup {
    // Factoryable type name
    static get type() {
        return 'eventeditor';
    }

    static get $name() {
        return 'EventEditor';
    }

    static get configurable() {
        return {
            items     : [],
            draggable : {
                handleSelector : ':not(button,.b-field-inner)' // Ignore buttons and field inners
            },
            axisLock : 'flexible',

            scrollable : {
                // In case editor is very tall or window is small, make it scrollable
                overflowY : true
            },
            readOnly : null,

            /**
             * A Function (or *name* of a function) which produces a customized Panel header based upon the event being edited.
             * @config {Function|String}
             * @param {Scheduler.model.EventModel} eventRecord The record being edited
             * @returns {String} The Panel title.
             */
            titleRenderer : null
        };
    }

    updateLocalization() {
        super.updateLocalization(...arguments);

        // Use this if there's no titleRenderer
        this.initialTitle = this.title || '';
    }

    chainResourceStore() {
        return this.eventEditFeature.resourceStore.makeChained(
            record => !record.isSpecialRow,
            null,
            {
                // Need to show all records in the combo. Required in case resource store is a tree.
                excludeCollapsedRecords : false
            }
        );
    }

    processWidgetConfig(widget) {
        const { eventEditFeature } = this;

        if (widget.type?.includes('date') && widget.weekStartDay == null) {
            widget.weekStartDay = this.weekStartDay;
        }

        if (widget.type === 'extraItems') {
            return false;
        }

        let fieldConfig = {};

        if (widget.ref === 'resourceField') {
            if (!eventEditFeature.showResourceField) {
                return false;
            }

            // Can't use store directly since it may be grouped and then contains irrelevant group records
            widget.store = this.chainResourceStore();

            // When events are loaded with resourceId, we should only support single select
            widget.multiSelect = !eventEditFeature.eventStore.usesSingleAssignment;

            if (eventEditFeature.resourceFieldConfig) {
                fieldConfig = eventEditFeature.resourceFieldConfig;
            }
        }

        if (widget.ref === 'nameField' && !eventEditFeature.showNameField) {
            return false;
        }

        if (widget.ref === 'deleteButton' && !eventEditFeature.showDeleteButton) {
            return false;
        }

        if ((widget.name === 'startDate' || widget.name === 'endDate') && widget.type === 'date') {
            fieldConfig.format = eventEditFeature.dateFormat;
        }

        if ((widget.name === 'startDate' || widget.name === 'endDate') && widget.type === 'time') {
            fieldConfig.format = eventEditFeature.timeFormat;
        }

        if (eventEditFeature.startDateConfig && widget.name === 'startDate' && widget.type === 'date') {
            fieldConfig = eventEditFeature.startDateConfig;
        }

        if (eventEditFeature.startTimeConfig && widget.name === 'startDate' && widget.type === 'time') {
            fieldConfig = eventEditFeature.startTimeConfig;
        }

        if (eventEditFeature.endDateConfig && widget.name === 'endDate' && widget.type === 'date') {
            fieldConfig = eventEditFeature.endDateConfig;
        }

        if (eventEditFeature.endTimeConfig && widget.name === 'endDate' && widget.type === 'time') {
            fieldConfig = eventEditFeature.endTimeConfig;
        }

        Object.assign(widget, fieldConfig);

        return super.processWidgetConfig(widget);
    }

    show(...args) {
        const { resourceField } = this.widgetMap;

        // Updated chained store. It is not done automatically for grouping/trees or when project is replaced
        if (resourceField) {
            resourceField.store = this.chainResourceStore();
        }

        super.show(...args);
    }

    onBeforeShow(...args) {
        const
            me           = this,
            {
                record,
                titleRenderer
            }            = me,
            deleteButton = me.widgetMap.deleteButton;

        // Hide delete button if we are readOnly or the event is in a create phase
        // which means we\re editing a dblclick-created or drag-created event.
        if (deleteButton) {
            deleteButton.hidden = me.readOnly || record.isCreating;
        }

        if (titleRenderer) {
            me.title = me.callback(titleRenderer, me, [record]);
        }
        else {
            me.title = me.initialTitle;
        }

        super.onBeforeShow && super.onBeforeShow(...args);
    }

    onInternalKeyDown(event) {
        this.trigger('keyDown', { event });
        super.onInternalKeyDown(event);
    }

    updateReadOnly(readOnly) {
        const
            {
                deleteButton,
                saveButton,
                cancelButton
            } = this.widgetMap;

        super.updateReadOnly(readOnly);

        if (deleteButton) {
            deleteButton.hidden = readOnly;
        }

        if (saveButton) {
            saveButton.hidden = readOnly;
        }

        if (cancelButton) {
            cancelButton.hidden = readOnly;
        }
    }
}

// Register this widget type with its Factory
EventEditor.initClass();
