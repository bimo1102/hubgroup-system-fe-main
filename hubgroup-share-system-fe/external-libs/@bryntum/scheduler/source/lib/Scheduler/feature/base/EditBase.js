import InstancePlugin from '../../../Core/mixin/InstancePlugin.js';
import DateField from '../../../Core/widget/DateField.js';
import DateHelper from '../../../Core/helper/DateHelper.js';
import ObjectHelper from '../../../Core/helper/ObjectHelper.js';
import VersionHelper from '../../../Core/helper/VersionHelper.js';
import Config from '../../../Core/Config.js';
import Objects from '../../../Core/helper/util/Objects.js';

/**
 * @module Scheduler/feature/base/EditBase
 */

const DH = DateHelper,
    makeDate = (fields) => {
        // single field, update record directly
        if (fields.length === 1) return fields[0].value;
        // two fields, date + time
        else if (fields.length === 2) {
            const
                [date, time] = fields[0] instanceof DateField ? fields : fields.reverse(),
                dateValue    = DH.parse(date.value);

            if (dateValue) {
                dateValue.setHours(
                    time.value.getHours(),
                    time.value.getMinutes(),
                    time.value.getSeconds(),
                    time.value.getMilliseconds()
                );
            }

            // Clone to not end up sharing dates
            return dateValue ? DateHelper.clone(dateValue) : null;
        }
        // shouldn't happen...
        return null;
    },
    copyTime = (dateTo, dateFrom) => {
        const d = new Date(dateTo.getTime());
        d.setHours(dateFrom.getHours(), dateFrom.getMinutes());
        return d;
    },
    adjustEndDate = (startDate, startTime, me) => {
        // The end datetime just moves in response to the changed start datetime, keeping the same duration.
        if (startDate && startTime && me.endDateField && me.endTimeField) {
            const newEndDate = DH.add(copyTime(me.startDateField.value, me.startTimeField.value), me.eventRecord.durationMS, 'milliseconds');
            me.endDateField.value = newEndDate;
            me.endTimeField.value = DH.clone(newEndDate);
        }
    };

/**
 * Base class for EventEdit (Scheduler) and TaskEdit (Gantt) features. Contains shared code. Not to be used directly.
 *
 * @extends Core/mixin/InstancePlugin
 */
export default class EditBase extends InstancePlugin {
    //region Config

    static get configurable() {
        return {
            /**
             * Deprecated. Use the `editorConfig` config:
             * ```javascript
             * const scheduler = new Scheduler({
             *     features : {
             *         eventEdit  : {
             *             editorConfig : {
             *                 autoClose : false,
             *                 modal     : true
             *             }
             *         }
             *     }
             * });
             * ```
             * @config {Boolean}
             * @default
             * @category Editor
             * @deprecated 4.0.0 Configure the {@link #config-editorConfig}:
             */
            autoClose : true,

            /**
             * True to save and close this panel if ENTER is pressed in one of the input fields inside the panel.
             * @config {Boolean}
             * @default
             * @category Editor
             */
            saveAndCloseOnEnter : true,

            triggerEvent : null,

            /**
             * Deprecated. Use the `items` config:
             * ```javascript
             * const scheduler = new Scheduler({
             *     features : {
             *         eventEdit : {
             *             editorConfig : {
             *                 bbar : {
             *                     items : {
             *                         deleteButton : false
             *                     }
             *                 }
             *             }
             *         }
             *     }
             * });
             * ```
             * @config {Boolean}
             * @default
             * @category Editor widgets
             * @deprecated 4.0.0 Configure the {@link #config-editorConfig}:
             */
            showDeleteButton : true,

            /**
             * Deprecated. Use the `items` config:
             * ```javascript
             * const scheduler = new Scheduler({
             *     features : {
             *         eventEdit : {
             *             items : {
             *                 nameField : {
             *                     hidden : true
             *                 }
             *             }
             *         }
             *     }
             * });
             * ```
             * @config {Boolean}
             * @default
             * @category Editor widgets
             * @deprecated 4.0.0 Configure the {@link #config-items}:
             */
            showNameField : true,

            /**
             * Deprecated. Use the `items` config:
             * ```javascript
             * const scheduler = new Scheduler({
             *     features : {
             *         eventEdit : {
             *             timeFormat : 'HH:mm',
             *             items      : {
             *                 startTimeField : {
             *                     // We use 24 hour clock: use less space
             *                     flex   : '1 0 30%'
             *                 },
             *                 endTimeField : {
             *                     flex   : '1 0 30%'
             *                 }
             *             }
             *         }
             *     }
             * });
             * ```
             * @config {Object}
             * @category Editor widgets
             * @deprecated 4.0.0 Configure the {@link #config-editorConfig}:
             */
            startTimeConfig : null,

            /**
             * Deprecated. Use the `items` config:
             * ```javascript
             * const scheduler = new Scheduler({
             *     features : {
             *         eventEdit : {
             *             items : {
             *                 startDateField : {
             *                     // Allow click back and forward by 1 day
             *                     step: '1d'
             *                 },
             *                 endDateField : {
             *                     step: '1d'
             *                 }
             *             }
             *         }
             *     }
             * });
             * ```
             * @config {Object}
             * @category Editor widgets
             * @deprecated 4.0.0 Configure the {@link #config-editorConfig}:
             */
            startDateConfig : null,

            /**
             * Deprecated. Use the `items` config:
             * ```javascript
             * const scheduler = new Scheduler({
             *     features : {
             *         eventEdit  : {
             *             timeFormat : 'HH:mm',
             *             items : {
             *                 startTimeField : {
             *                     // We use 24 hour clock: use less space
             *                     flex   : '1 0 30%'
             *                 },
             *                 endTimeField : {
             *                     flex   : '1 0 30%'
             *                 }
             *             }
             *         }
             *     }
             * });
             * ```
             * @config {Object}
             * @category Editor widgets
             * @deprecated 4.0.0 Configure the {@link #config-editorConfig}:
             */
            endTimeConfig : null,

            /**
             * Deprecated. Use the `items` config:
             * ```javascript
             * const scheduler = new Scheduler({
             *     features : {
             *         eventEdit  : {
             *             items : {
             *                 startDateField : {
             *                     // Allow click back and forward by 1 day
             *                     step: '1d'
             *                 },
             *                 endDateField : {
             *                     step: '1d'
             *                 }
             *             }
             *         }
             *     }
             * });
             * ```
             * @config {Object}
             * @category Editor widgets
             * @deprecated 4.0.0 Configure the {@link #config-editorConfig}:
             */
            endDateConfig : null,

            /**
             * This config parameter is passed to the `startDateField` and `endDateField` constructor.
             * @config {String}
             * @default
             * @category Editor widgets
             */
            dateFormat : 'L', // date format that uses browser locale

            /**
             * This config parameter is passed to the `startTimeField` and `endTimeField` constructor.
             * @config {String}
             * @default
             * @category Editor widgets
             */
            timeFormat : 'LT', // date format that uses browser locale

            /**
             * Default editor configuration, which widgets it shows etc.
             *
             * This is the entry point into configuring any aspect of the editor.
             *
             * The {@link Core.widget.Container#config-items} configuration of a Container
             * is *deeply merged* with its default `items` value. This means that you can specify
             * an `editorConfig` object which configures the editor, or widgets inside the editor:
             * ```javascript
             * const scheduler = new Scheduler({
             *     features : {
             *         eventEdit  : {
             *             editorConfig : {
             *                 autoClose : false,
             *                 modal     : true,
             *                 cls       : 'editor-widget-cls',
             *                 items : {
             *                     resourceField : {
             *                         hidden : true
             *                     },
             *                     // Add our own event owner field at the top of the form.
             *                     // Weight -100 will make it sort top the top.
             *                     ownerField : {
             *                         weight : -100,
             *                         type   : 'usercombo',
             *                         name   : 'owner',
             *                         label  : 'Owner'
             *                     }
             *                 },
             *                 bbar : {
             *                     items : {
             *                         deleteButton : false
             *                     }
             *                 }
             *             }
             *         }
             *     }
             * });
             * ```
             * @config {Object}
             * @category Editor
             */
            editorConfig : null,

            /**
             * Deprecated. Use the `items` config:
             * ```javascript
             * const scheduler = new Scheduler({
             *     features : {
             *         eventEdit  : {
             *             items : {
             *                 owner : {
             *                     weight : -100, // Will sort above system-supplied fields which are weight 0
             *                     type   : 'usercombo',
             *                     name   : 'owner',
             *                     label  : 'Owner'
             *                 }
             *             }
             *         }
             *     }
             * });
             * ```
             * @config {String|Object[]}
             * @category Editor widgets
             * @deprecated 4.0.0 Use the {@link #config-items} config
             */
            extraItems : null,

            /**
             * An object to merge with the provided items config of the editor to override the
             * configuration of provided fields, or add new fields.
             *
             * Example:
             * ```javascript
             * const scheduler = new Scheduler({
             *     features : {
             *         eventEdit  : {
             *             items : {
             *                 // Merged with provided config of the resource field
             *                 resourceField : {
             *                     label : 'Calendar'
             *                 },
             *                 owner : {
             *                     weight : -100, // Will sort above system-supplied fields which are weight 0
             *                     type   : 'usercombo',
             *                     name   : 'owner',
             *                     label  : 'Owner'
             *                 }
             *             }
             *         }
             *     }
             * });
             *```
             *
             * The provided fields are called
             *  - `nameField`
             *  - `resourceField`
             *  - `startDateField`
             *  - `startTimeField`
             *  - `endDateField`
             *  - `endTimeField`
             *  - `recurrenceCombo`
             *  - `editRecurrenceButton`
             * @config {Object}
             * @category Editor widgets
             */
            items : null,

            /**
             * The week start day used in all date fields of the feature editor form by default.
             * 0 means Sunday, 6 means Saturday.
             * Defaults to the locale's week start day.
             * @config {Number}
             */
            weekStartDay : null
        };
    }

    //endregion

    //region Init & destroy

    construct(client, config) {
        const me = this;

        client.eventEdit = me;

        super.construct(client, ObjectHelper.assign({
            weekStartDay : client.weekStartDay
        }, config));

        me.clientListenersDetacher = client.on({
            [me.triggerEvent] : 'onActivateEditor',
            dragCreatEend     : 'onDragCreateEnd',

            // Not fired at the Scheduler level.
            // Calendar, which inherits this, implements this event.
            eventAutoCreated : 'onEventAutoCreated',
            thisObj          : me
        });
    }

    doDestroy() {
        this.clientListenersDetacher();

        this.editor?.destroy();

        super.doDestroy();
    }

    //endregion

    //region Editing

    changeEditorConfig(editorConfig) {
        // extraItems is deprecated
        const { items, extraItems } = this;

        // Merge extraItems in either format into a copy of the default editorConfig.
        if (extraItems) {
            editorConfig = Objects.clone(editorConfig);
            editorConfig = this.insertExtraWidgetsIntoDefaultWidgets(editorConfig);
        }
        // Merge items which is an Object with the default editorConfig's items
        else if (items) {
            editorConfig = Objects.clone(editorConfig);
            editorConfig.items = Config.merge(items, editorConfig.items);
        }

        return editorConfig;
    }

    changeItems(items) {
        this.cleanItemsConfig(items);
        return items;
    }

    // Remove any items configured as === true which just means default config options
    cleanItemsConfig(items) {
        for (const ref in items) {
            const itemCfg = items[ref];

            if (itemCfg === true) {
                delete items[ref];
            }
            else if (itemCfg?.items) {
                this.cleanItemsConfig(itemCfg.items);
            }
        }
    }

    /**
     * Insert extra fields into default Editor fields according to specific rules:
     * - If no index provided insert them into `extraItems` placeholder (or at the end if not);
     * - If index provided sort ASC and insert one by one, but only after no-index fields are inserted;
     * - If `extraItems` placeholder exists, don't take widgets that go after it into account;
     * @private
     */
    insertExtraWidgetsIntoDefaultWidgets(editorConfig) {
        VersionHelper.deprecate('Scheduler', '5.0.0', 'extraItems replaced by items in EditFeature.');

        const
            me                = this,
            { extraItems }    = me,
            { items }         = editorConfig,
            extraItemsAsArray = Array.isArray(extraItems) ? extraItems : extraItems && Object.values(extraItems);

        if (!extraItems || !Object.keys(extraItemsAsArray).length) {
            return editorConfig;
        }

        // If they still use index instead of weight, we honour it for now.
        const hasIndex = Object.values(extraItemsAsArray).some(i => 'index' in i);

        if (hasIndex) {
            const extraItemsAsArray = Array.isArray(extraItems) ? extraItems : extraItems && ObjectHelper.transformNamedObjectToArray(extraItems);

            VersionHelper.deprecate('Scheduler', '5.0.0', 'index in extraItems replaced by weight to sort editor items');

            // items needs to be an array to have extra items inserted at an index.
            let itemsAsArray = ObjectHelper.transformNamedObjectToArray(items),
                lastItem     = itemsAsArray[itemsAsArray.length - 1];

            // Find default extra widgets position
            let index = itemsAsArray.findIndex(widget => widget.type === 'extraItems'),
                tail;

            // If extra widgets placeholder exists
            if (index > -1) {
                // Remove extra widgets placeholder from its position
                itemsAsArray.splice(index, 1);

                // Backup everything that goes after extra widgets placeholder, like Save/Delete/Cancel buttons
                tail = itemsAsArray.splice(index);
            }

            // Split extra widgets on 2 parts: those which have index and those which haven't
            const withIndex    = extraItemsAsArray.filter(widget => widget.index >= 0),
                withoutIndex = extraItemsAsArray.filter(widget => !(widget.index >= 0));

            // Add those without index to the end of the default widgets
            withoutIndex.forEach((item, index) => item.weight = lastItem.weight + index * 100);
            itemsAsArray = itemsAsArray.concat(withoutIndex);

            // Sort those which have index in ASC order, so we insert fields in series
            withIndex.sort((widgetA, widgetB) => widgetA.index - widgetB.index);

            // And now insert extra widgets at their individually specified index
            withIndex.forEach(widget => {
                const previousWidget = itemsAsArray[Math.min(widget.index, itemsAsArray.length) - 1];

                widget.weight = previousWidget ? previousWidget.weight + 1 : -100;
                itemsAsArray.splice(widget.index, 0, widget);
            });

            if (tail && tail.length) {
                // Return backuped fields to the end of the widgets
                itemsAsArray = itemsAsArray.concat(tail);
            }

            // Convert it back to object form.
            editorConfig.items = ObjectHelper.transformArrayToNamedObject(itemsAsArray);
        }
        // Merge object form of extraItems into editorConfig's items
        else {
            // Default is to append so make high weight
            let weight = 900;
            for (const item of (Array.isArray(extraItems) ? extraItems : Object.values(extraItems))) {
                if (!item.ref) {
                    item.ref = item.id;
                }
                item.weight = (weight += 100);
            }
            editorConfig.items = { ...items, ...(Array.isArray(extraItems) ? ObjectHelper.transformArrayToNamedObject(extraItems) : extraItems) };
        }

        return editorConfig;
    }

    onDatesChange(params) {
        const me = this,
            field = params.source,
            value = params.value;

        switch (field.ref) {
            case 'startDateField':
                me.startTimeField && adjustEndDate(value, me.startTimeField.value, me);
                break;

            case 'startTimeField':
                me.startDateField && adjustEndDate(me.startDateField.value, value, me);
                break;
        }

        // End date can never be less than start date
        if (me.startDateField && me.endDateField) {
            me.endDateField.min = me.startDateField.value;
        }

        if (me.endTimeField) {
            // If the event starts and ends on the same day, the time fields need
            // to have their min and max set against each other.
            if (DH.isEqual(DH.clearTime(me.startDateField?.value), DH.clearTime(me.endDateField?.value))) {
                me.endTimeField.min = me.startTimeField.value;
            }
            else {
                me.endTimeField.min = null;
            }
        }
    }

    //endregion

    //region Save

    async save() {
        throw new Error('Implement in subclass');
    }

    get isValid() {
        const me = this;
        return Object.values(me.editor.widgetMap).every(field => {
            if (!field.name || field.hidden) {
                return true;
            }

            return field.isValid !== false;
        });
    }

    get values() {
        const
            me          = this,
            { editor }  = me,
            startFields = [],
            endFields   = [],
            values      = {};

        editor.eachWidget(widget => {
            const name = widget.name;

            // If the widget is part of the recurrence editor, we don't gather it.
            if (!name || widget.hidden || widget.up(w => w === me.recurrenceEditor)) {
                return;
            }

            switch (name) {
                case 'startDate':
                    startFields.push(widget);
                    break;
                case 'endDate':
                    endFields.push(widget);
                    break;
                case 'resource':
                    values[name] = widget.record;
                    break;
                case 'recurrenceRule':
                    // If recurrence set to null, completely clear the recurrenceRule.
                    // Otherwise it will still be perceived as recurring with the rule 'FREQ=none'
                    values[name] = editor.widgetMap.recurrenceCombo?.value === 'none' ? '' : widget.value;
                    break;
                default:
                    values[name] = widget.value;
            }
        }, true);

        // if is changing from not allDay to allDay should consider time fields to not change them on makeDate
        if (values.allDay && !me.eventRecord.allDay) {
            startFields.push(me.startTimeField);
            endFields.push(me.endTimeField);
        }

        // Handle fields being configured away
        if (startFields.length) {
            values.startDate = makeDate(startFields);
        }
        if (endFields.length) {
            values.endDate = makeDate(endFields);
        }

        // Since there is no duration field in the editor,
        // we don't need to recalc duration value on each date change.
        // It's enough to return correct duration value in `values`,
        // so the record will get updated with the correct data.
        if (('startDate' in values) && ('endDate' in values)) {
            values.duration = DH.diff(values.startDate, values.endDate, me.editor.record.durationUnit, true);
        }

        return values;
    }

    /**
     * Template method, intended to be overridden. Called before the event record has been updated.
     * @param {Scheduler.model.EventModel} eventRecord The event record
     *
     **/
    onBeforeSave(eventRecord) {}

    /**
     * Template method, intended to be overridden. Called after the event record has been updated.
     * @param {Scheduler.model.EventModel} eventRecord The event record
     *
     **/
    onAfterSave(eventRecord) {}

    /**
     * Updates record being edited with values from the editor
     * @private
     */
    updateRecord(record) {
        const { values } = this;

        // Clean resourceId / resources out of values when using assignment store, it will handle the assignment
        if (this.assignmentStore) {
            delete values.resource;
        }

        return record.set(values);
    }

    //endregion

    //region Events

    onBeforeEditorShow() {
        const
            { eventRecord, editor } = this.editingContext,
            { nameField } = editor.widgetMap;

        // Editing new event. Make sure user doesn't have to clear the input field.
        // Record field value still should be there because a rendered event block
        // looks bad with no text in it.
        // nameField may have been configured away.
        if (nameField && eventRecord.isCreating) {
            // Avoid initial invalid because required state.
            editor._isSettingValues = true;
            nameField.value = '';
            editor._isSettingValues = false;

            // Show new event text as a placeholder
            nameField._configuredPlaceholder = nameField.placeholder;
            nameField.placeholder = eventRecord.name;
        }
    }

    resetEditingContext() {
        const
            me              = this,
            {
                eventRecord,
                client
            } = me,
            { eventStore }  = client,
            { nameField }   = me.editor.widgetMap;

        // This will remove the record from the store, *and* from the added bag, so no sync will take place.
        if (eventRecord.isCreating) {
            // Ensure that during the engine's async processing of the remove, the element is non-interactive.
            // Mousedown on the just-created element itself passes through here, and the immediate mouseup
            // after that instigates a click which will find no corresponding event.
            if (client.isTimelineBase) {
                me.editingContext.eventElement?.closest('[data-event-id]').classList.add('b-released');
            }

            eventStore.remove(eventRecord);

            // Clear isCreating *after* removal.
            // Store doesn't register as a removed record if isCreating is set
            eventRecord.isCreating = false;
        }

        // Revert any placeholder that we may have set
        // nameField may have been configured away.
        if (nameField) {
            nameField.placeholder = nameField._configuredPlaceholder;
        }

        me.targetEventElement = null;
        me.client.element.classList.remove('b-eventeditor-editing');
    }

    onPopupKeyDown({ event }) {
        const me = this;

        if (!me.readOnly && event.key === 'Enter' && me.saveAndCloseOnEnter && event.target.tagName.toLowerCase() === 'input') {
            // Need to prevent this key events from being fired on whatever receives focus after the editor is hidden
            event.preventDefault();

            // If enter key was hit in an input element of a start field, need to adjust end date fields (the same way as if #onDatesChange handler was called)
            if (event.target.name === 'startDate') {
                adjustEndDate(me.startDateField.value, me.startTimeField.value, me);
            }

            me.onSaveClick();
        }
    }

    async onSaveClick() {
        // TODO add new API on Container: blurFocusedField which manages this scenario
        // of blurring active field just before hiding
        this.editor.focus();

        const saved = await this.save();

        if (saved) {
            this.editor.close();
        }
        return saved;
    }

    async onDeleteClick() {
        const removed = await this.deleteEvent();

        if (removed) {
            // We expect deleteEvent will trigger close if autoClose is true and focus has moved out,
            // otherwise need to call it manually
            if (!this.editor.autoClose || this.editor.containsFocus) {
                this.editor.close();
            }
        }
    }

    onCancelClick() {
        this.editor.close();
    }

    //endregion
}
