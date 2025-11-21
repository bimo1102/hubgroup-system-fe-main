import Field from './Field.js';
import TimeField from './TimeField.js';
import './DateField.js';
import DateHelper from '../helper/DateHelper.js';
import EventHelper from '../helper/EventHelper.js';
import ObjectHelper from '../helper/ObjectHelper.js';
import Widget from './Widget.js';

/**
 * @module Core/widget/DateTimeField
 */

/**
 * A field combining a {@link Core.widget.DateField} and a {@link Core.widget.TimeField}.
 *
 * @extends Core/widget/Field
 * @classtype datetimefield
 * @inlineexample Core/widget/DateTimeField.js
 */
export default class DateTimeField extends Field {
    static get configurable() {
        return {
            /**
             * Returns the TimeField instance
             * @readonly
             * @member {Core.widget.TimeField} timeField
             */
            /**
             * Configuration for {@link Core.widget.TimeField}
             * @config {Object}
             */
            timeField : {},

            /**
             * Returns the DateField instance
             * @readonly
             * @member {Core.widget.DateField} dateField
             */
            /**
             * Configuration for {@link Core.widget.DateField}
             * @config {Object}
             */
            dateField : {
                // To be able to use transformDateValue for parsing without loosing time, a bit of a hack
                keepTime : true,
                step     : '1 d'
            },

            /**
             * The week start day in the {@link Core.widget.DateField#config-picker}, 0 meaning Sunday, 6 meaning Saturday.
             * Uses localized value per default.
             *
             * @config {Number}
             */
            weekStartDay : null,

            inputTemplate : () => ''
        };
    }

    static get $name() {
        return 'DateTimeField';
    }

    static get type() {
        return 'datetimefield';
    }

    // Factoryable type alias
    static get alias() {
        return 'datetime';
    }

    get focusElement() {
        return this.dateField.input;
    }

    // Implementation needed at this level because it has two inner elements in its inputWrap
    get innerElements() {
        return [
            this.dateField.element,
            this.timeField.element
        ];
    }

    // Each subfield handles its own keystrokes
    internalOnKeyEvent() { }

    // CellEdit sets this dynamically on its editor field
    updateRevertOnEscape(revertOnEscape) {
        this.timeField.revertOnEscape = revertOnEscape;
        this.dateField.revertOnEscape = revertOnEscape;
    }

    // Converts the timeField config into a TimeField
    changeTimeField(config) {
        const
            me = this,
            result = TimeField.new({
                revertOnEscape : me.revertOnEscape,
                syncInvalid(...args) {
                    const updatingInvalid = me.updatingInvalid;

                    TimeField.prototype.syncInvalid.apply(this, args);
                    me.timeField && !updatingInvalid && me.syncInvalid();
                }
            }, config);

        EventHelper.on({
            element : result.element,
            keydown : 'onTimeFieldKeyDown',
            thisObj : me
        });

        // Must set *after* construction, otherwise it becomes the default state
        // to reset readOnly back to
        if (me.readOnly) {
            result.readOnly = true;
        }

        return result;
    }

    // Set up change listener when TimeField is available. Not in timeField config to enable users to supply their own
    // listeners block there
    updateTimeField(timeField) {
        const me = this;

        timeField.on({
            change({ userAction, value }) {
                if (userAction && !me.$settingValue) {
                    const dateAndTime = me.dateField.value;
                    me._isUserAction = true;
                    me.value = dateAndTime ? DateHelper.copyTimeValues(dateAndTime, value) : null;
                    me._isUserAction = false;
                }
            },
            thisObj : me
        });
    }

    // Converts the dateField config into a class based on { type : "..." } provided (DateField by default)
    changeDateField(config) {
        const
            me     = this,
            type   = config?.type || 'datefield',
            cls    = Widget.resolveType(config.type || 'datefield'),
            result = Widget.create(ObjectHelper.assign({
                type,
                revertOnEscape : me.revertOnEscape,
                syncInvalid(...args) {
                    const updatingInvalid = me.updatingInvalid;

                    cls.prototype.syncInvalid.apply(this, args);
                    me.dateField && !updatingInvalid && me.syncInvalid();
                }
            }, config));

        EventHelper.on({
            element : result.element,
            keydown : 'onDateFieldKeyDown',
            thisObj : me
        });

        // Must set *after* construction, otherwise it becomes the default state
        // to reset readOnly back to
        if (me.readOnly) {
            result.readOnly = true;
        }

        result.on(({
            keydown : ({ event }) => {
                if (event.key === 'Tab' && !event.shiftKey && this.timeField?.isVisible) {
                    event.stopPropagation();
                    event.cancelBubble = true;
                }
            }
        }));

        return result;
    }

    get childItems() {
        return [this.dateField, this.timeField];
    }

    // Set up change listener when DateField is available. Not in dateField config to enable users to supply their own
    // listeners block there
    updateDateField(dateField) {
        const me = this;

        dateField.on({
            change({ userAction, value }) {
                if (userAction && !me.$isInternalChange) {
                    me._isUserAction = true;
                    me.value = value;
                    me._isUserAction = false;
                }
            },
            thisObj : me
        });
    }

    updateWeekStartDay(weekStartDay) {
        if (this.dateField) {
            this.dateField.weekStartDay = weekStartDay;
        }
    }

    changeWeekStartDay(value) {
        return typeof value === 'number' ? value : (this.dateField?.weekStartDay ?? DateHelper.weekStartDay);
    }

    // Apply our value to our underlying fields
    syncInputFieldValue(skipHighlight = this.isConfiguring) {
        super.syncInputFieldValue(true);

        if (!skipHighlight && !this.highlightExternalChange) {
            skipHighlight = true;
        }

        const
            me            = this,
            highlightDate = me.dateField.highlightExternalChange,
            highlightTime = me.timeField.highlightExternalChange;

        me.$isInternalChange = true;

        me.dateField.highlightExternalChange = false;

        // Prevent dateField from keeping its time value
        // TODO: Should be doable without this hack
        me.dateField.value = null;

        me.dateField.highlightExternalChange = highlightDate;

        if (skipHighlight) {
            me.timeField.highlightExternalChange = me.dateField.highlightExternalChange = false;
        }

        me.timeField.value = me.dateField.value = me.inputValue;

        me.dateField.highlightExternalChange = highlightDate;
        me.timeField.highlightExternalChange = highlightTime;

        me.$isInternalChange = false;

        // Must evaluate after child fields have been updated since our validity state depends on theirs.
        me.syncInvalid();
    }

    onTimeFieldKeyDown(e) {
        const me = this;

        // we need to handle keydown for composed field manually and before it's done by cellEdit feature
        if (e.key === 'Enter' || e.key === 'Tab') {
            const dateAndTime = me.dateField.value;
            me._isUserAction = true;
            me.value = dateAndTime ? DateHelper.copyTimeValues(dateAndTime, me.timeField.value) : null;
            me._isUserAction = false;
        }
    }

    onDateFieldKeyDown(e) {
        const me = this;

        if (e.key === 'Tab') {
            e.stopPropagation();
            e.preventDefault();
            me.timeField.focus();
        }
        // we need to handle keydown for composed field manually and before it's done by cellEdit feature
        if (e.key === 'Enter') {
            me.value = me.dateField.value;
        }
    }

    // Make us and our underlying fields required
    updateRequired(required, was) {
        this.timeField.required = this.dateField.required = required;
    }

    updateReadOnly(readOnly, was) {
        super.updateReadOnly(readOnly, was);

        if (!this.isConfiguring) {
            this.timeField.readOnly = this.dateField.readOnly = readOnly;
        }
    }

    // Make us and our underlying fields disabled
    onDisabled(value) {
        this.timeField.disabled = this.dateField.disabled = value;
    }

    focus() {
        this.dateField.focus();
    }

    hasChanged(oldValue, newValue) {
        return !DateHelper.isEqual(oldValue, newValue);
    }

    get isValid() {
        return this.timeField.isValid && this.dateField.isValid;
    }

    setError(error, silent) {
        [this.dateField, this.timeField].forEach(f => f.setError(error, silent));
    }

    getErrors() {
        const errors = [...(this.dateField.getErrors() || []), ...(this.timeField.getErrors() || [])];

        return errors.length ? errors : null;
    }

    clearError(error, silent) {
        [this.dateField, this.timeField].forEach(f => f.clearError(error, silent));
    }

    updateInvalid() {
        // use this flag in this level to avoid looping
        this.updatingInvalid = true;
        [this.dateField, this.timeField].forEach(f => f.updateInvalid());
        this.updatingInvalid = false;
    }
}

DateTimeField.initClass();
