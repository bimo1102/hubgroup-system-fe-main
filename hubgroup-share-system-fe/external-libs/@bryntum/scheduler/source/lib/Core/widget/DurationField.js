import TextField from './TextField.js';
import DateHelper from '../helper/DateHelper.js';
import ObjectHelper from '../helper/ObjectHelper.js';
import Duration from '../data/Duration.js';

/**
 * @module Core/widget/DurationField
 */

/**
 * A specialized field allowing a user to also specify duration unit when editing the duration value.
 *
 * This field can be used as an {@link Grid.column.Column#config-editor editor} for the {@link Grid.column.Column Column}.
 * It is used as the default editor for the `DurationColumn`.
 *
 * @extends Core/widget/TextField
 * @classType durationfield
 * @inlineexample Core/widget/DurationField.js
 */
export default class DurationField extends TextField {
    static get $name() {
        return 'DurationField';
    }

    // Factoryable type name
    static get type() {
        return 'durationfield';
    }

    // Factoryable type alias
    static get alias() {
        return 'duration';
    }

    static get defaultConfig() {
        return {
            /**
             * The `value` config may be set in Object form specifying two properties,
             * `magnitude`, a Number, and `unit`, a String.
             *
             * If a String is passed, it is parsed in accordance with current locale rules.
             * The string is taken to be the numeric magnitude, followed by whitespace, then an abbreviation, or name of
             * the unit.
             * @config {Object|String}
             */
            value : null,

            /**
             * Step size for spin button clicks.
             * @config {Number}
             * @default
             */
            step : 1,

            /**
             * The duration unit to use with the current magnitude value.
             * @config {String}
             */
            unit : null,

            defaultUnit : 'day',

            /**
             * The duration magnitude to use with the current unit value. Can be either an integer or a float value.
             * Both "," and "." are valid decimal separators.
             * @config {Number}
             */
            magnitude : null,

            /**
             * When set to `true` the field will use short names of unit durations
             * (as returned by {@link Core.helper.DateHelper#function-getShortNameOfUnit-static}) when creating the
             * input field's display value.
             * @config {Boolean}
             */
            useAbbreviation : false,

            /**
             * Set to `true` to allow negative duration
             * @config {Boolean}
             */
            allowNegative : false,

            /**
             * The number of decimal places to allow. Defaults to no constraint.
             * @config {Number}
             * @default
             */
            decimalPrecision : null,

            triggers : {
                spin : {
                    type : 'spintrigger'
                }
            },

            nullValue : null
        };
    }

    /**
     * Fired when this field's value changes.
     * @event change
     * @param {Core.data.Duration} value - This field's value
     * @param {Core.data.Duration} oldValue - This field's previous value
     * @param {Boolean} valid - True if this field is in a valid state.
     * @param {Event} [event] - The triggering DOM event if any.
     * @param {Boolean} userAction - Triggered by user taking an action (`true`) or by setting a value (`false`)
     * @param {Core.widget.DurationField} source - This field
     */

    /**
     * User performed default action (typed into this field or hit the triggers).
     * @event action
     * @param {Core.data.Duration} value - This field's value
     * @param {Core.data.Duration} oldValue - This field's previous value
     * @param {Boolean} valid - True if this field is in a valid state.
     * @param {Event} [event] - The triggering DOM event if any.
     * @param {Boolean} userAction - Triggered by user taking an action (`true`) or by setting a value (`false`)
     * @param {Core.widget.DurationField} source - This field
     */

    static get configurable() {
        return {
            /**
             * Minimum duration value (e.g. 1d)
             * @config {String}
             */
            min : null,

            /**
             * Max duration value (e.g. 10d)
             * @config {String}
             */
            max : null,

            /**
             * Comma-separated list of units to allow in this field, e.g. "day,hour,year". Leave blank to allow all
             * valid units (the default)
             * @config {String}
             */
            allowedUnits : null
        };
    }

    changeMin(value) {
        return typeof value === 'string' ? new Duration(value) : value;
    }

    changeMax(value) {
        return typeof value === 'string' ? new Duration(value) : value;
    }

    changeAllowedUnits(units) {
        if (typeof units === 'string') {
            units = units.split(',');
        }

        return units;
    }

    updateAllowedUnits(units) {
        this.allowedUnitsRe = new RegExp(`(${units.join('|')})`, 'i');
    }

    get inputValue() {
        // Do not use the _value property. If called during configuration, this
        // will import the configured value from the config object.
        return this.value == null ? '' : this.calcValue(true).toString(this.useAbbreviation);
    }

    /**
     * Get/Set duration unit to use with the current magnitude value.
     * Valid values are:
     * - "millisecond" - Milliseconds
     * - "second" - Seconds
     * - "minute" - Minutes
     * - "hour" - Hours
     * - "day" - Days
     * - "week" - Weeks
     * - "month" - Months
     * - "quarter" - Quarters
     * - "year"- Years
     *
     * @property {String}
     */
    set unit(unit) {
        this._unit = unit;
        this.value = this.calcValue();
    }

    get unit() {
        return this._unit;
    }

    /**
     * Get/Set numeric magnitude `value` to use with the current unit value.
     * @property {Number}
     */
    set magnitude(magnitude) {
        this.clearError('L{invalidUnit}');

        this._magnitude = magnitude;
        super.value = this.calcValue();
    }

    get magnitude() {
        return this._magnitude;
    }

    roundMagnitude(value) {
        return value && this.decimalPrecision != null ? ObjectHelper.round(value, this.decimalPrecision) : value;
    }

    get allowDecimals() {
        return this.decimalPrecision !== 0;
    }

    get isValid() {
        const
            me      = this,
            isEmpty = me.value == null || (me.value && me.value.magnitude == null);

        return super.isValid && ((isEmpty && !me.required) || !isEmpty && (me.allowNegative || me.value.magnitude >= 0));
    }

    internalOnChange(event) {
        const
            me     = this,
            value  = me.value,
            oldVal = me._lastValue;

        if (me.hasChanged(oldVal, value)) {
            me._lastValue = value;
            me.triggerFieldChange({ value, event, userAction : true, valid : me.isValid });
        }
    }

    onFocusOut(e) {
        this.syncInputFieldValue(true);

        return super.onFocusOut(e);
    }

    /**
     * The `value` property may be set in Object form specifying two properties, `magnitude`, a Number, and `unit`, a
     * String.
     *
     * If a Number is passed, the field's current unit is used and just the magnitude is changed.
     *
     * If a String is passed, it is parsed in accordance with current locale rules. The string is taken to be the
     * numeric magnitude, followed by whitespace, then an abbreviation, or name of the unit.
     *
     * Upon read, the value is always a {@link Core.data.Duration Duration} object containing `magnitude` and `unit`.
     * @property {String|Number|Object|Core.data.Duration}
     */
    set value(value) {
        const
            me = this;
        let newMagnitude, newUnit;

        this.clearError('L{invalidUnit}');

        if (typeof value === 'number') {
            // A number means preserving existing unit value
            newMagnitude = value;
            newUnit = me._unit;
        }
        else if (typeof value === 'string') {
            // Parse as a string
            const
                parsedDuration = DateHelper.parseDuration(value, me.allowDecimals, me._unit || DurationField.defaultConfig.defaultUnit);
            if (parsedDuration) {

                if (!me.allowedUnitsRe || me.allowedUnitsRe.test(parsedDuration.unit)) {
                    newUnit = parsedDuration.unit;
                    newMagnitude = parsedDuration.magnitude;
                }
                else {
                    me.setError('L{invalidUnit}');
                }
            }
        }
        else {
            // Using value object with unit and magnitude
            if (value && 'unit' in value && 'magnitude' in value) {
                newUnit = value.unit;
                newMagnitude = value.magnitude;
            }
            else {
                newUnit = null;
                newMagnitude = null;
            }
        }

        if (me._magnitude !== newMagnitude || me._unit !== newUnit) {
            me._magnitude = newMagnitude;
            me._unit      = newUnit;
            super.value   = me.calcValue();
        }
    }

    okMax(value) {
        return this.max == null || value <= this.max;
    }

    okMin(value) {
        return this.min == null || value >= this.min;
    }

    get validity() {
        const
            value    = this.value,
            validity = {};

        // Assert range for non-empty fields, empty fields will turn invalid if `required: true`
        if (value != null) {
            validity.rangeUnderflow = !this.okMin(value);
            validity.rangeOverflow  = !this.okMax(value);
        }
        validity.valid = !validity.rangeUnderflow && !validity.rangeOverflow;

        return validity;
    }

    get value() {
        return super.value;
    }

    calcValue(round = false) {
        const
            me = this;

        if ((!me._unit || me._magnitude == null) && me.clearable) {
            return null;
        }
        else {
            return new Duration(round ? this.roundMagnitude(me._magnitude) : this._magnitude, me._unit || DurationField.defaultConfig.defaultUnit);
        }
    }

    hasChanged(oldValue, newValue) {
        return newValue && !oldValue ||
            !newValue && oldValue ||
            newValue && oldValue && !oldValue.isEqual(newValue);
    }

    /**
     * The `milliseconds` property is a read only property which returns the number of milliseconds in this field's
     * value
     * @property {Number}
     */
    get milliseconds() {
        return this.value ? this.value.milliseconds : 0;
    }

    onInternalKeyDown(keyEvent) {
        if (keyEvent.key === 'ArrowUp') {
            this.doSpinUp();
        }
        else if (keyEvent.key === 'ArrowDown') {
            this.doSpinDown();
        }
    }

    doSpinUp() {
        const
            me = this;

        let newValue = (me.magnitude || 0) + me.step;

        me._isUserAction = true;

        if (!me.okMin(newValue)) {
            newValue = me.min;
        }

        if (me.okMax(newValue)) {
            me.value = newValue;
        }

        me._isUserAction = false;
    }

    doSpinDown() {
        const
            me = this;

        let newValue = (me.magnitude || 0) - me.step;

        if (!me.okMax(newValue)) {
            newValue = me.max;
        }

        if (me.okMin(newValue) && me.allowNegative || (me.magnitude || 0) > 0) {
            me._isUserAction = true;
            me.value         = newValue;

            me._isUserAction = false;
        }
    }
}

// Register this widget type with its Factory
DurationField.initClass();
