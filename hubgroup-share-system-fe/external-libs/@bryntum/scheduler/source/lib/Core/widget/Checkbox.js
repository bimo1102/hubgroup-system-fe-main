import Field from './Field.js';
import Widget from './Widget.js';
import DomHelper from '../helper/DomHelper.js';
import ObjectHelper from '../helper/ObjectHelper.js';

/**
 * @module Core/widget/Checkbox
 */

/**
 * Checkbox field, wraps <code>&lt;input type="checkbox"&gt;</code>.
 * Color can be specified and you can optionally configure {@link #config-text}
 * to display in a label to the right of the checkbox in addition to a standard
 * field {@link #config-label}.
 *
 * {@inlineexample Core/widget/Checkbox.js vertical}
 *
 * This field can be used as an {@link Grid.column.Column#config-editor} for the {@link Grid.column.Column}.
 *
 * @extends Core/widget/Field
 * @classType checkbox
 */
export default class Checkbox extends Field {
    //region Config
    static get $name() {
        return 'Checkbox';
    }

    // Factoryable type name
    static get type() {
        return 'checkbox';
    }

    // Factoryable type alias
    static get alias() {
        return 'check';
    }

    static get configurable() {
        return {
            inputType : 'checkbox',

            /**
             * Get/set label
             * @member {String} name
             */
            /**
             * Text to display on checkbox label
             * @config {String}
             */
            text : '',

            /**
             * The checked state. The same as `value`.
             * @config {Boolean} checked
             */

            /**
             * Checkbox color, must have match in css
             * @config {String}
             */
            color : null,

            /**
             * Get/set value
             * @member {String} value
             */
            /**
             * Sets input fields value attribute
             * @config {String}
             */
            value : '',

            toggleGroup : null,

            defaultBindProperty : 'value',

            localizableProperties : ['label', 'text']
        };
    }

    //endregion

    //region Init

    construct(config) {
        // Convert checked to value so that initializing getter can read it if requested prior to trying to set it.
        if ('checked' in config) {
            config = ObjectHelper.assign({}, config);  // copy inherited properties unlike Object.assign()
            config.value = config.checked;
            delete config.checked;
        }

        super.construct(config);

        this.syncHasText();
    }

    // Implementation needed at this level because it has two inner elements in its inputWrap
    get innerElements() {
        return [
            this.inputElement,
            {
                tag       : 'label',
                class     : 'b-checkbox-label',
                for       : `${this.id}-input`,
                reference : 'textLabel',
                html      : this.text || ''
            }
        ];
    }

    get inputElement() {
        const
            me     = this,
            config = super.inputElement;

        if (me.readOnly) {
            config.disabled = true;
        }

        if (me.toggleGroup) {
            config.dataset = {
                group : me.toggleGroup
            };
        }

        return config;
    }

    //endregion

    //region Toggle

    /**
     * Get/set checked state. Equivalent to `value` config.
     * @property {Boolean}
     */
    get checked() {
        return this.value;
    }

    set checked(value) {
        this.value = value;
    }

    syncHasText() {
        this.element.classList[this.text ? 'add' : 'remove']('b-text');
    }

    updateText(value) {
        if (this.textLabel) {
            this.syncHasText();
            this.textLabel.innerHTML = value;
        }
    }

    changeValue(value) {
        return (value === 'false') ? false : Boolean(value);
    }

    updateValue(value) {
        const
            me      = this,
            changed = me.input.checked !== value;

        me.input.checked = value;

        if (changed && !me.inputting) {
            me.uncheckToggleGroupMembers();

            // The change event does not fire on programmatic change of input.
            if (!me.isConfiguring) {
                me.triggerChange(false);
            }
        }
    }

    get inputValueAttr() {
        return 'checked';
    }

    updateColor(value, was) {
        const classes = this.element.classList;

        if (was) {
            classes.remove(was);
        }

        if (value) {
            classes.add(value);
        }
    }

    getToggleGroupMembers() {
        const
            me = this,
            { checked, toggleGroup, input : checkedElement } = me,
            result = [];

        if (checked && toggleGroup) {
            DomHelper.forEachSelector(me.rootElement, `input[type=checkbox][data-group=${toggleGroup}]`, inputEl => {
                if (inputEl !== checkedElement) {
                    const partnerCheckbox = Widget.fromElement(inputEl);
                    partnerCheckbox && result.push(partnerCheckbox);
                }
            });
        }

        return result;
    }

    uncheckToggleGroupMembers() {
        if (this.checked && this.toggleGroup) {
            this.getToggleGroupMembers().forEach(widget => widget.checked = false);
        }
    }

    updateReadOnly(readOnly) {
        if (this.input) {
            this.input.disabled = readOnly;
        }

        // Field and Widget have a say too. Widget adds the class and fires the event
        super.updateReadOnly(readOnly);
    }

    /**
     * Check the box
     */
    check() {
        this.checked = true;
    }

    /**
     * Uncheck the box
     */
    uncheck() {
        this.checked = false;
    }

    /**
     * Toggle checked state. If you want to force a certain state, assign to {@link #property-checked} instead.
     */
    toggle() {
        this.checked = !this.checked;
    }

    //endregion

    //region Events

    /**
     * Triggers events when user toggles the checkbox
     * @fires beforeChange
     * @fires change
     * @fires action
     * @private
     */
    internalOnChange(event) {
        const me = this;
        me.value = me.input.checked;

        if (!me.inputting) {
            me.inputting = true;

            me.triggerChange(true);

            me.inputting = false;
        }
    }

    /**
     * Triggers events when checked state is changed
     * @fires beforeChange
     * @fires change
     * @fires action
     * @private
     */
    triggerChange(userAction) {
        const
            me = this,
            { checked } = me.input;

        /**
         * Fired before checkbox is toggled. Returning false from a listener prevents the checkbox from being toggled.
         * @event beforeChange
         * @preventable
         * @param {Core.widget.Checkbox} source Checkbox
         * @param {Boolean} checked Checked or not
         */

        /**
         * Fired when checkbox is toggled
         * @event change
         * @param {Core.widget.Checkbox} source Checkbox
         * @param {Boolean} checked Checked or not
         */
        // Prevent uncheck if this checkbox is part of a toggleGroup (radio-button mode) ..also ensure the group has
        // visible active members
        const
            eventObject  = { checked, value : checked, userAction, valid : true },
            prevented = (!checked && userAction && me.toggleGroup &&
                me.getToggleGroupMembers().filter(widget => widget.isVisible && !widget.disabled).length) ||
                // Since Widget has Events mixed in configured with 'callOnFunctions' this will also call onBeforeChange,
                // onChange and onAction
                me.trigger('beforeChange', eventObject) === false;

        // If prevented need to rollback the checkbox input
        if (prevented) {
            // Input change is not preventable, so need to revert the changes
            // The change event does not fire on programmatic change of input, so no need to suspend
            me.input.checked = me._value = !checked;
        }
        else {
            me.triggerFieldChange(eventObject, false);

            if (userAction) {
                me.uncheckToggleGroupMembers();
            }

            /**
             * User performed the default action (toggled the checkbox)
             * @event action
             * @param {Core.widget.Checkbox} source Checkbox
             * @param {Boolean} checked Checked or not
             */
            me.trigger('action', eventObject);
            me.trigger('change', eventObject) === false;

            return true;
        }
    }

    //endregion
}

// Register this widget type with its Factory
Checkbox.initClass();
