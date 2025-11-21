import Widget from './Widget.js';
import Tooltip from './Tooltip.js';
import Rectangle from '../helper/util/Rectangle.js';

/**
 * @module Core/widget/Slider
 */

/**
 * Wraps native &lt;input type="range"&gt;
 *
 * @extends Core/widget/Widget
 *
 * @example
 * let slider = new Slider({
 *   text: 'Choose value'
 * });
 *
 * @classType slider
 * @inlineexample Core/widget/Slider.js
 */
export default class Slider extends Widget {
    //region Config

    static get $name() {
        return 'Slider';
    }

    // Factoryable type name
    static get type() {
        return 'slider';
    }

    static get configurable() {
        return {
            /**
             * Get/set text. Appends value if Slider.showValue is true
             * @member {String} text
             */
            /**
             * Slider label text
             * @config {String}
             */
            text : null,

            /**
             * Show value in label (appends in () if text is set)
             * @config {Boolean}
             * @default
             */
            showValue : true,

            /**
             * Show value in tooltip
             * @config {Boolean}
             * @default
             */
            showTooltip : false,

            /**
             * Get/set min value
             * @member {Number} min
             */
            /**
             * Minimum value
             * @config {Number}
             * @default
             */
            min : 0,

            /**
             * Get/set max value
             * @member {Number} max
             */
            /**
             * Maximum value
             * @config {Number}
             * @default
             */
            max : 100,

            /**
             * Get/set step size
             * @member {Number} step
             */
            /**
             * Step size
             * @config {Number}
             * @default
             */
            step : 1,

            /**
             * Get/set value
             * @member {Number} value
             */
            /**
             * Initial value
             * @config {Number}
             */
            value : 50,

            // The value is set in the Light theme. The Material theme will have different value.
            thumbSize : 20,

            tooltip : {
                $config : ['lazy', 'nullify'],
                value   : {
                    type     : 'tooltip',
                    align    : 'b-t',
                    anchor   : false, // No anchor displayed since thumbSize is different for different themes
                    axisLock : true
                }
            },

            localizableProperties : ['text']
        };
    }

    //endregion

    //region Init

    compose() {
        const
            { id, min, max, showValue, step, text, value } = this,
            inputId = `${id}-input`,
            hasText = Boolean(text || showValue);

        return {
            class : {
                'b-has-label' : hasText,
                'b-text'      : hasText
            },

            children : {
                input : {
                    tag       : 'input',
                    type      : 'range',
                    id        : inputId,
                    reference : 'input',

                    min,
                    max,
                    step,
                    value,
                    listeners : {
                        input     : 'onInternalInput',
                        change    : 'onInternalChange',
                        mouseover : 'onInternalMouseOver',
                        mouseout  : 'onInternalMouseOut'
                    }
                },

                label : {
                    tag  : 'label',
                    for  : inputId,
                    html : showValue ? (text ? `${text} (${value})` : value) : text
                }
            }
        };
    }

    get focusElement() {
        return this.input;
    }

    get percentProgress() {
        return (this.value - this.min) / (this.max - this.min) * 100;
    }

    //endregion

    //region Events

    /**
     * Fired while slider thumb is being dragged.
     * @event input
     * @param {Core.widget.Slider} source The slider
     * @param {String} value The value
     */

    /**
     * Fired after the slider value changes (on mouse up following slider interaction).
     * @event change
     * @param {String} value The value
     * @param {Boolean} userAction Triggered by user taking an action (`true`) or by setting a value (`false`)
     * @param {Core.widget.Slider} source The slider
     */

    /* break from doc comment */

    onInternalChange() {
        this.updateUI();
        this.triggerChange(true);
        this.trigger('action', { value : this.value });
    }

    onInternalInput() {
        this.value = parseInt(this.input.value, 10);

        this.trigger('input', { value : this.value });
    }

    onInternalMouseOver() {
        this.tooltip?.showBy({
            target : this.calcThumbPosition(),
            offset : 5
        });
    }

    onInternalMouseOut() {
        this.tooltip?.hide();
    }

    triggerChange(userAction) {
        this.triggerFieldChange({
            value : this.value,
            valid : true,
            userAction
        });
    }

    //endregion

    //region Config Handling

    // max
    updateMax(max) {
        const me = this;

        if (me.input && me._value > max) {
            me.value = max;
            me.trigger('input', { value : me.value });
        }
    }

    // min
    updateMin(min) {
        const me = this;

        if (me.input && me._value < min) {
            me.value = min;
            me.trigger('input', { value : me.value });
        }
    }

    // tooltip
    changeTooltip(config, existingTooltip) {
        if (config) {
            config.owner = this;
        }

        return Tooltip.reconfigure(existingTooltip, config, {
            owner    : this,
            defaults : {
                forElement : this.input,
                html       : String(this.value)
            }
        });
    }

    // value
    updateValue(value) {
        const
            me = this,
            { input, _tooltip } = me;

        if (_tooltip) {
            _tooltip.html = me.value;
        }

        if (input && input.value !== String(value)) {
            input.value = value;
            me.triggerChange(false);
        }

        me.updateUI();
    }

    //endregion

    //region Util

    calcThumbPosition() {
        const
            me = this,
            inputRect = Rectangle.from(me.input),
            offset = (inputRect.width - me.thumbSize) * me.percentProgress / 100;

        return new Rectangle(
            inputRect.x + offset,
            inputRect.y + inputRect.height / 2 - me.thumbSize / 2,
            me.thumbSize,
            me.thumbSize
        );
    }

    updateUI() {
        this._tooltip?.alignTo({
            target : this.calcThumbPosition(),
            offset : 5
        });
    }

    //endregion
}

// Register this widget type with its Factory
Slider.initClass();
