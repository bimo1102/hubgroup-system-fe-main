import Field from './Field.js';
import NumberFormat from '../helper/util/NumberFormat.js';

/**
 * @module Core/widget/NumberField
 */

/**
 * Number field widget. Similar to native `<input type="number">`, but implemented as `<input type="text">` to support
 * formatting.
 *
 * This field can be used as an {@link Grid.column.Column#config-editor editor} for the {@link Grid.column.Column Column}.
 * It is used as the default editor for the {@link Grid.column.NumberColumn NumberColumn},
 * {@link Grid.column.PercentColumn PercentColumn}, {@link Grid.column.AggregateColumn AggregateColumn}.
 *
 * ```
 * const number = new NumberField({
 *   min   : 1,
 *   max   : 5,
 *   value : 3
 * });
 * ```
 *
 * @extends Core/widget/Field
 * @classType numberfield
 * @inlineexample Core/widget/NumberField.js
 */
export default class NumberField extends Field {

    //region Config

    static get $name() {
        return 'NumberField';
    }

    // Factoryable type name
    static get type() {
        return 'numberfield';
    }

    // Factoryable type alias
    static get alias() {
        return 'number';
    }

    static get configurable() {
        return {
            /**
             * Min value
             * @config {Number}
             */
            min : null,

            /**
             * Max value
             * @config {Number}
             */
            max : null,

            /**

             * Step size for spin button clicks.
             * @property {Number}
             * @name step
             */
            /**
             * Step size for spin button clicks. Also used when pressing up/down keys in the field.
             * @config {Number}
             * @default
             */
            step : 1,

            /**
             * Large step size, defaults to 10 * `step`. Applied when pressing SHIFT and stepping either by click or
             * using keyboard.
             * @config {Number}
             * @default 10
             */
            largeStep : 0,

            /**
             * Initial value
             * @config {Number}
             */
            value : null,

            /**
             * The format to use for rendering numbers.
             *
             * For example:
             * ```
             *  format: '9,999.00##'
             * ```
             * The above enables digit grouping and will display at least 2 (but no more than 4) fractional digits.
             * @config {String|Object|Core.helper.util.NumberFormat}
             * @default
             */
            format : '',

            /**
             * The number of decimal places to allow. Defaults to no constraint.
             *
             * This config has been replaced by {@link #config-format}. Instead of this:
             *```
             *  decimalPrecision : 3
             *```
             * Use `format`:
             *```
             *  format : '9.###'
             *```
             * To set both `decimalPrecision` and `leadingZeroes` (say to `3`), do this:
             *```
             *  format : '3>9.###'
             *```
             * @config {Number}
             * @default
             * @deprecated 3.1 Use {@link #config-format} instead.
             */
            decimalPrecision : null,

            /**
             * The maximum number of leading zeroes to show. Defaults to no constraint.
             *
             * This config has been replaced by {@link #config-format}. Instead of this:
             *```
             *  leadingZeros : 3
             *```
             * Use `format`:
             *```
             *  format : '3>9'
             *```
             * To set both `leadingZeroes` and `decimalPrecision` (say to `2`), do this:
             *```
             *  format : '3>9.##'
             *```
             * @config {Number}
             * @default
             * @deprecated 3.1 Use {@link #config-format} instead.
             */
            leadingZeroes : null,

            triggers : {
                spin : {
                    type : 'spintrigger'
                }
            },

            /**
             * Controls how change events are triggered when stepping the value up or down using either spinners or
             * arrow keys.
             *
             * Configure with:
             * * `true` to trigger a change event per step
             * * `false` to not trigger change while stepping. Will trigger on blur/Enter
             * * A number of milliseconds to buffer the change event, triggering when no steps are performed during that
             *   period of time.
             *
             * @config {Boolean|Number}
             * @default
             */
            changeOnSpin : true,

            // NOTE: using type="number" has several trade-offs:
            //
            // Negatives:
            //   - No access to caretPos/textSelection. This causes anomalies when replacing
            //     the input value with a formatted version of that value (the caret moves to
            //     the end of the input el on each character typed).
            //   - The above also prevents Siesta/synthetic events from mimicking typing.
            //   - Thousand separators cannot be displayed (input.value = '1,000' throws an
            //     exception).
            // Positives:
            //   - On mobile, the virtual keyboard only shows digits et al.
            //   - validity property on DOM node that handles min/max checks.
            //
            // The above may not be exhaustive, but there is not a compelling reason to
            // use type="number" except on mobile.

            /**
             * This can be set to `'number'` to enable the numeric virtual keyboard on
             * mobile devices. Doing so limits this component's ability to handle keystrokes
             * and format properly as the user types, so this is not recommended for
             * desktop applications. This will also limit similar features of automated
             * testing tools that mimic user input.
             * @config {String}
             * @default text
             */
            inputType : null
        };
    }

    //endregion

    //region Init

    construct(config) {
        super.construct(config);

        const me = this;

        // Support for selecting all by double click in empty input area
        // Browsers work differently at this case
        me.input.addEventListener('dblclick', () => {
            me.select();
        });

        if (typeof me.changeOnSpin === 'number') {
            me.bufferedSpinChange = me.buffer(me.triggerChange, me.changeOnSpin);
        }
    }

    //endregion

    //region Internal functions

    acceptValue(value, rawValue) {
        let accept = !isNaN(value);

        // https://github.com/bryntum/support/issues/1349
        // Pass through if there is a text selection in the field. This fixes the case when
        // valid value is typed already and we are replacing it by selecting complete string and typing over it.
        // Cannot be tested in siesta, see ticket for more info.
        if (accept && !this.hasTextSelection) {
            accept = false;

            const
                raw = this.input.value,
                current = parseFloat(raw);

            if (raw !== rawValue) {
                // The new value is out of range, but we accept it if the current value
                // is also problematic. Consider the case where the input is empty and the
                // minimum value is 100. The user must first type "1" and we must accept it
                // if they are to get the opportunity to type the "0"s.
                accept = !this.acceptValue(current, raw);

                // Also, if we are checking the current value, be sure not to infinitely
                // recurse here.
            }
        }

        return accept;
    }

    okMax(value) {
        return isNaN(this.max) || value <= this.max;
    }

    okMin(value) {
        return isNaN(this.min) || value >= this.min;
    }

    internalOnKeyEvent(e) {
        if (e.type === 'keydown') {
            const
                me = this,
                key = e.key;

            let block;

            // Native arrow key spin behaviour differs between browsers, so we replace
            // the native spinners w/our own triggers and handle arrows keys as well.
            if (key === 'ArrowUp') {
                me.doSpinUp(e.shiftKey);
                block = true;
            }
            else if (key === 'ArrowDown') {
                me.doSpinDown(e.shiftKey);
                block = true;
            }
            else if (!e.altKey && !e.ctrlKey && key && key.length === 1) {
                // The key property contains the character or key name... so ignore
                // keys that aren't a single character.
                const
                    after      = me.getAfterValue(key),
                    afterValue = me.formatter.parseStrict(after),
                    // no need to check if typing same value or - if negative numbers are allowed
                    accepted   = afterValue === me.value || (after === '-' && (isNaN(me.min) || me.min < 0));

                block = !accepted && !me.acceptValue(afterValue, after);
            }

            if (key === 'Enter' && me._changedBySilentSpin) {
                me.triggerChange(e, true);

                // reset the flag
                me._changedBySilentSpin = false;
            }

            if (block) {
                e.preventDefault();
            }
        }

        super.internalOnKeyEvent(e);
    }

    doSpinUp(largeStep = false) {
        const me = this;

        let newValue = (me.value || 0) + (largeStep ? me.largeStep : me.step);

        if (!me.okMin(newValue)) {
            newValue = me.min;
        }

        if (me.okMax(newValue)) {
            me.applySpinChange(newValue);
        }
    }

    doSpinDown(largeStep = false) {
        const me = this;

        let newValue = (me.value || 0) - (largeStep ? me.largeStep : me.step);

        if (!me.okMax(newValue)) {
            newValue = me.max;
        }

        if (me.okMin(newValue)) {
            me.applySpinChange(newValue);
        }
    }

    applySpinChange(newValue) {
        const me = this;

        me._isUserAction = true;

        // Should not trigger change immediately?
        if (me.changeOnSpin !== true) {
            me._changedBySilentSpin = true;
            // Silence the change
            me.silenceChange = true;
            // Optionally buffer the change
            me.bufferedSpinChange && me.bufferedSpinChange(null, true);
        }

        me.value = newValue;

        me._isUserAction = false;
        me.silenceChange = false;
    }

    triggerChange() {
        if (!this.silenceChange) {
            super.triggerChange(...arguments);
        }
    }

    onFocusOut(e) {
        super.onFocusOut(...arguments);

        const
            me = this,
            { input } = me,
            raw = input.value,
            value = me.formatter.truncate(raw),
            formatted = isNaN(value) ? raw : me.formatValue(value);

        if (raw !== formatted) {
            input.value = formatted;
        }

        if (me._changedBySilentSpin) {
            me.triggerChange(e, true);

            // reset the flag
            me._changedBySilentSpin = false;
        }
    }

    internalOnInput(event) {
        const
            me = this,
            { formatter, input } = me,
            { parser } = formatter,
            raw = input.value,
            decimals = parser.decimalPlaces(raw);

        if (formatter.truncator && decimals) {
            let value = raw;

            const trunc = formatter.truncate(raw);

            if (!isNaN(trunc)) {
                value = me.formatValue(trunc);

                if (parser.decimalPlaces(value) < decimals) {
                    // If typing has caused truncation or rounding, reset. To best preserve
                    // the caret pos (which is reset by assigning input.value), we grab and
                    // restore the distance from the end. This allows special things to format
                    // into the string (such as thousands separators) since they always go to
                    // the front of the input.
                    const pos = raw.length - me.caretPos;

                    input.value = value;

                    me.caretPos = value.length - pos;
                }
            }
        }

        super.internalOnInput(event);
    }

    formatValue(value) {
        return this.formatter.format(value);
    }

    changeFormat(format) {
        const me = this;

        if (format === '') {
            const { leadingZeroes, decimalPrecision } = me;

            format = leadingZeroes ? `${leadingZeroes}>9` : null;

            if (decimalPrecision != null) {
                format = `${format || ''}9.${'#'.repeat(decimalPrecision)}`;
            }
            else if (format) {
                // When we only have leadingZeroes, we'll have a format like "4>9", but
                // that will default to 3 decimal digits. Prior behavior implied no limit
                // on decimal digits unless decimalPrecision was specified.
                format += '.*';
            }
        }

        return format;
    }

    get formatter() {
        const
            me = this,
            format = me.format;

        let formatter = me._formatter;

        if (!formatter || me._lastFormat !== format) {
            formatter = NumberFormat.get(me._lastFormat = format);

            // TODO use this.formatter.is.from.currency/percent visually...
            // if (!formatter.is.decimal) {
            //     formatter = formatter.as('decimal');
            // }

            me._formatter = formatter;
        }

        return formatter;
    }

    //endregion

    //region Getters/Setters

    updateStep(step) {
        this.element.classList[step ? 'remove' : 'add']('b-hide-spinner');
        this._step = step;
    }

    changeLargeStep(largeStep) {
        return largeStep || (this.step * 10);
    }

    get validity() {
        const
            value    = this.value,
            validity = {};

        // Assert range for non-empty fields, empty fields will turn invalid if `required: true`
        if (value != null) {
            validity.rangeUnderflow = !this.okMin(value);
            validity.rangeOverflow = !this.okMax(value);
        }
        validity.valid = !validity.rangeUnderflow && !validity.rangeOverflow;

        return validity;
    }

    /**
     * Get/set the NumberField's value, or `undefined` if the input field is empty
     * @property {Number}
     */
    changeValue(value, was) {
        const me = this;

        if (value || value === 0) {
            let valueIsNaN;

            // We insist on a number as the value
            if (typeof value !== 'number') {
                value = (typeof value === 'string') ? me.formatter.parse(value) : Number(value);

                valueIsNaN = isNaN(value);
                if (valueIsNaN) {
                    value = '';
                }
            }

            if (!valueIsNaN && me.format) {
                value = me.formatter.round(value);
            }
        }
        else {
            value = undefined;
        }

        return super.changeValue(value, was);
    }

    get inputValue() {
        let value = this.value;

        if (value != null && this.format) {
            value = this.formatValue(value);
        }

        return value;
    }

    //endregion
}

// Register this widget type with its Factory
NumberField.initClass();
