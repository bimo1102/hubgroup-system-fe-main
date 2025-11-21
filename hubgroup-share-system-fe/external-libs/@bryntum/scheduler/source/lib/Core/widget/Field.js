import Widget from './Widget.js';
import Tooltip from './Tooltip.js';
import Badge from './mixin/Badge.js';
import BrowserHelper from '../helper/BrowserHelper.js';
import EventHelper from '../helper/EventHelper.js';
import FunctionHelper from '../helper/FunctionHelper.js';
import ObjectHelper from '../helper/ObjectHelper.js';
import DomHelper from '../helper/DomHelper.js';
import ClickRepeater from '../util/ClickRepeater.js';
import DynamicObject from '../util/DynamicObject.js';

/**
 * @module Core/widget/Field
 */

const
    byWeight        = (l, r) => (l.weight || 0) - (r.weight || 0),
    byWeightReverse = (l, r) => (r.weight || 0) - (l.weight || 0),
    triggerConfigs  = {
        align  : true,
        weight : true
    };

/**
 * Base class for {@link Core.widget.TextField TextField} and {@link Core.widget.NumberField NumberField}. Not to be used directly.
 * All subclasses can be used as editors for the {@link Grid.column.Column Column}. The most popular are:
 * - {@link Core.widget.TextField TextField}
 * - {@link Core.widget.NumberField NumberField}
 * - {@link Core.widget.DateField DateField}
 * - {@link Core.widget.TimeField TimeField}
 * - {@link Core.widget.Combo Combo}
 *
 * @extends Core/widget/Widget
 * @mixes Core/widget/mixin/Badge
 * @abstract
 */
export default class Field extends Widget.mixin(Badge) {

    //region Config
    static get $name() {
        return 'Field';
    }

    // Factoryable type name
    static get type() {
        return 'field';
    }

    static get configurable() {
        return {
            /**
             * @hideconfigs htmlCls, content, tag, scrollable, html
             */

            /**
             * Text to display in empty field.
             * @config {String} placeholder
             */
            placeholder : null,

            /**
             * Gets or sets the value. The returned type will depend upon the Field subclass.
             *
             * `TextField` returns a `String`.
             *
             * `NumberField` returns a `Number`.
             *
             * `DateField` and `TimeField` return a `Date` object, and `null` if the field is empty.
             *
             * `Combo` will return a `String` if configured with `items` as a simple string array.
             * Otherwise it will return the {@link Core.widget.Combo#config-valueField} value from the
             * selected record, or `null` if no selection has been made.
             * @property {*}
             * @name value
             */
            /**
             * Default value
             * @config {String}
             */
            value : '',

            /**
             * Name of the field which is used as a key to get/set values from/to the field.
             * Used prior to {@link Core.widget.Widget#config-ref ref} and {@link Core.widget.Widget#config-id id} in
             * {@link Core.widget.Container#property-values Container.values}.
             *
             * The config is useful when the field is used in EventEditor or TaskEditor to load/save values automatically.
             * @config {String}
             */
            name : null,

            /**
             * Get/set fields label. Please note that the Field needs to have a label specified from start for this to
             * work, otherwise no element is created.
             * @property {String}
             * @name label
             */

            /**
             * Label, prepended to field
             * @config {String}
             * @category Label
             */
            label : null,

            /**
             * Label position, either 'before' the field or or 'above' the field
             * @config {String}
             * @default
             * @category Label
             */
            labelPosition : 'before',

            /**
             * CSS class name or class names to add to any configured {@link #config-label}
             * @config {String|Object}
             * @category Label
             */
            labelCls : null,

            /**
             * The labels to add either before or after the input field.
             * Each label may have the following properties:
             * * `html` The label text.
             * * `align` `'start'` or `'end'` which end of the field the label should go.
             * @config {Object}
             * @category Label
             */
            labels : null,

            /**
             * The width to apply to the `<label>` element. If a number is specified, `px` will be used.
             * @config {String|Number}
             * @localizable
             * @category Label
             */
            labelWidth : {
                value   : null,
                $config : {
                    localeKey : 'L{labelWidth}'
                }
            },

            /**
             * Configure as `true` to indicate that a `null` field value is to be marked as invalid.
             * @config {Boolean}
             * @default false
             */
            required : null,

            /**
             * Show a trigger to clear field, and allow `ESC` key to clear field if this field is
             * not {@link #config-readOnly}. The trigger is available in the {@link #property-triggers} object
             * under the name `clear`. May also be an object which configures the `clear` {@link #property-triggers trigger}.
             * @config {Boolean|Object}
             * @default false
             */
            clearable : null,

            /**
             * If this field is not {@link #config-readOnly}, then setting this option means that pressing
             * the `ESCAPE` key after editing the field will revert the field to the value it had when
             * the user focused the field. If the field is _not_ changed from when focused, the {@link #config-clearable}
             * behaviour will be activated.
             * @config {Boolean}
             * @default false
             */
            revertOnEscape : null,

            /**
             * An optional string to display inside the input field as an overlay. This can be useful for displaying
             * a field's units.
             *
             * This config is ignored if {@link #config-hintHtml} is set.
             *
             * For example:
             * ```javascript
             *  {
             *      type  : 'numberfield',
             *      label : 'Temperature',
             *      hint  : '°C'
             *  }
             * ```
             *
             * This config can be set to a function to dynamically generate the `hint` text:
             * ```javascript
             *  {
             *      type  : 'numberfield',
             *      label : 'Duration',
             *      hint  : ({ value }) => (value === 1) ? 'Day' : 'Days'
             *  }
             * ```
             *
             * The function is passed an object with the following properties:
             *
             *  - `source` A reference to the field instance.
             *  - `value` The current value of the field.
             *
             * A `hint` function will be called when the field changes value.
             *
             * @config {String|Function}
             * @category Label
             */
            hint : null,

            /**
             * This config is similar to {@link #config-hint} except that this config is used to display HTML content.
             * Since this can allow malicious content to be executed, be sure not to include user-entered data or to
             * encode such data (see {@link Core.helper.StringHelper#function-encodeHtml-static}).
             *
             * If this config is set, {@link #config-hint} is ignored.
             *
             * For example:
             * ```javascript
             *  {
             *      type     : 'numberfield',
             *      label    : 'Temperature',
             *      hintHtml : '<i>°C</i>'
             *  }
             * ```
             *
             * This config can be set to a function to dynamically generate the `hintHtml` text:
             * ```javascript
             *  {
             *      type     : 'numberfield',
             *      label    : 'Duration',
             *      hintHtml : ({ value }) => (value === 1) ? '<i>Day</i>' : '<i>Days</i>'
             *  }
             * ```
             *
             * The function is passed an object with the following properties:
             *
             *  - `source` A reference to the field instance.
             *  - `value` The current value of the field.
             *
             * A `hintHtml` function will be called when the field changes value.
             *
             * @config {String|Function}
             * @category Label
             */
            hintHtml : null,

            /**
             * The width to apply to the `<input>` element. If a number is specified, `px` will be used.
             * @config {String|Number}
             * @category Input element
             */
            inputWidth : null,

            /**
             * The delay in milliseconds to wait after the last keystroke before triggering a change event.
             * Set to 0 to not trigger change events from keystrokes (listen for input event instead to have
             * immediate feedback, change will still be triggered on blur)
             * @config {Number}
             * @default
             */
            keyStrokeChangeDelay : 0,

            /**
             * Makes the field unmodifiable by user action. The input area is not editable, and triggers
             * are unresponsive.
             *
             * This is a wider-acting setting than {@link #config-editable} which *only* sets the
             * `readOnly` attribute of the `<input>` field.
             *
             * PickerFields such as `Combo` and `DateField` can be `editable : false`, but still
             * modifiable through the UI.
             * @config {Boolean}
             */
            readOnly : null,

            /**
             * Set to false to prevent user from editing the field. For TextFields it is basically the same as setting
             * {@link #config-readOnly}, but for PickerFields there is a distinction where it allows you to pick a value
             * but not to type one in the field.
             *
             * PickerFields such as `Combo` and `DateField` can be `editable : false`, but still
             * modifiable through the UI.
             * @config {Boolean}
             * @default true
             */
            editable : true,

            defaultAction : 'change',

            /**
             * The trigger Widgets as specified by the {@link #config-triggers} configuration and the
             * {@link #config-clearable} configuration. Each is a {@link Core.widget.Widget Widget} instance which may
             * be hidden, shown and observed and styled just like any other widget.
             * @property {Object}
             * @name triggers
             */
            /**
             * The triggers to add either before or after the input field. Each property name is the reference by which
             * an instantiated Trigger Widget may be retrieved from the live `{@link #property-triggers}` property.
             *
             * Each trigger may have the following properties:
             * * `cls` The CSS class to apply.
             * * `handler` A method in the field to call upon click
             * * `align` `'start'` or `'end'` which end of the field the trigger should go.
             * * `weight` (Optional) Higher weighted triggers gravitate towards the input field.
             *
             * ```javascript
             * const textField = new TextField({
             *   triggers : {
             *       check : {
             *           cls : 'b-fa b-fa-check',
             *           handler() {
             *               ...
             *           }
             *       },
             *       ...
             *   }
             * })
             * ```
             *
             * @config {Object}
             */
            triggers : null,

            /**
             * Specify `false` to prevent field from being highlighted when on external value changes
             * @config {Boolean}
             */
            highlightExternalChange : true,

            localizableProperties : ['label', 'title', 'placeholder', 'labelWidth'],

            /**
             * Specify `true` to auto select field contents on focus
             * @config {Boolean}
             * @default
             */
            autoSelect : false,

            /**
             * Sets the native `autocomplete` property of the underlying input element. For more information, please refer to
             * [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete)
             * @config {String}
             * @default
             * @category Input element
             */
            autoComplete : 'off',

            /**
             * Sets custom attributes of the underlying input element. For more information, please refer to
             * [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes)
             * @config {Object}
             * @default
             * @category Input element
             */
            inputAttributes : null,

            /**
             * Sets the `type` attribute of the underlying input element.
             * @config {String}
             * @private
             * @category Input element
             */
            inputType : 'text',

            /**
             * Text alignment for the input field.
             * @config {String}
             * @category Input element
             */
            inputAlign : null,

            /**
             * A list of property names to be set in the underlying input element from properties
             * by the same name in this Field object if the value is not `== null`.
             * @private
             * @category Input element
             */
            attributes : {
                value : [
                    'placeholder',
                    'autoComplete',
                    'minLength',
                    'maxLength',
                    'pattern',
                    'tabIndex',
                    'min',
                    'max'
                ],
                $config : {
                    merge : 'distinct'
                }
            },

            nullValue : {
                $config : null,
                value   : null,
                default : null    // store _value=null on prototype
            },

            updatedClsDuration : 500,

            inputReadOnly : false,

            testConfig : {
                updatedClsDuration : 10
            }
        };
    }

    static get delayable() {
        return {
            highlightChanged : 'raf'
        };
    }

    doDestroy() {
        const
            me           = this,
            { triggers } = me,
            errorTip     = me.isPainted && Field.getSharedErrorTooltip(me.rootElement, true);

        me.inputListenerRemover?.();
        me.keyListenerRemover?.();

        super.doDestroy();

        if (triggers) {
            for (const t of Object.values(triggers)) {
                t.destroy();
            }
        }

        // The errorTip references this field, hide it when we die.
        if (errorTip?.field === me) {
            errorTip.hide();
        }
    }

    get invalidValueError() {
        return 'L{invalidValue}';
    }

    /**
     * A singleton error tooltip which activates on hover of invalid fields.
     * before show, it gets a reference to the field and interrogates its
     * active error list to display as the tip content.
     * @member {Core.widget.Tooltip}
     * @readonly
     */
    get errorTip() {
        return this.constructor.getSharedErrorTooltip(this.rootElement);
    }

    static getSharedErrorTooltip(rootElement, doNotCreate) {
        let sharedErrorTooltip = rootElement.bryntum?.errorTooltip;

        if (!sharedErrorTooltip && !doNotCreate) {
            rootElement.bryntum = rootElement.bryntum || {};

            sharedErrorTooltip = new Tooltip({
                cls          : 'b-field-error-tip',
                forSelector  : '.b-field.b-invalid .b-field-inner',
                align        : 'l-r',
                scrollAction : 'realign',
                rootElement,

                onBeforeShow() {
                    const tip   = this,
                        field = Widget.fromElement(tip.activeTarget);

                    if (field) {
                        const errors = field.getErrors();

                        if (errors) {
                            tip.html = errors.join('<br>');
                            tip.field = field;
                            return true;
                        }
                    }

                    // Veto show
                    return false;
                }
            });
            rootElement.bryntum.errorTooltip = sharedErrorTooltip;
        }

        return sharedErrorTooltip;
    }

    /**
     * A singleton error tooltip which activates on hover of invalid fields.
     * before show, it gets a reference to the field and interrogates its
     * active error list to display as the tip content.
     *
     * Please note: Not applicable when using widgets inside a shadow root
     * @member {Core.widget.Tooltip}
     * @readonly
     * @static
     */
    static get errorTip() {
        return this.getSharedErrorTooltip(document.body);
    }

    //endregion

    //region Event
    /**
     * Fired when the user types into this field.
     * @event input
     * @param {Core.widget.Field} source This field.
     * @param {String} value - This field's value
     * @param {Event} event - The triggering DOM event.
     */

    /**
     * Fired when this field's value changes.
     * @event change
     * @param {String} value - This field's value
     * @param {String} oldValue - This field's previous value
     * @param {Boolean} valid - True if this field is in a valid state.
     * @param {Event} [event] - The triggering DOM event if any.
     * @param {Boolean} userAction - Triggered by user taking an action (`true`) or by setting a value (`false`)
     * @param {Core.widget.Field} source - This Field
     */

    /**
     * User performed default action (typed into this field).
     * @event action
     * @param {String} value - This field's value
     * @param {String} oldValue - This field's previous value
     * @param {Boolean} valid - True if this field is in a valid state.
     * @param {Event} [event] - The triggering DOM event if any.
     * @param {Boolean} userAction - Triggered by user taking an action (`true`) or by setting a value (`false`)
     * @param {Core.widget.Field} source - This Field
     */

    /**
     * Fired when this field is {@link #function-clear cleared}.
     *
     * This will be triggered when a user clicks this field's clear {@link #property-triggers trigger}
     * @event clear
     * @param {Core.widget.Field} source - This Field
     */

    /**
     * User clicked one of this field's {@link #property-triggers}
     * @event trigger
     * @param {Core.widget.Field} source This field
     * @param {Core.widget.Widget} trigger The trigger activated by click or touch tap.
     */

    //endregion

    //region Init

    construct(config) {
        super.construct(config);

        const me = this;

        if (me.keyStrokeChangeDelay) {
            me.changeOnKeyStroke = me.buffer(me.internalOnChange, me.keyStrokeChangeDelay);
        }
    }

    onFocusIn(e) {
        const me = this;

        me.valueOnFocus = ObjectHelper.clone(me.value);
        me.validOnFocus = !(me.errors && Object.keys(me.errors).length);
        super.onFocusIn(e);
    }

    onFocusOut(e) {
        super.onFocusOut(e);

        // Required field not flagged with error initially, flag on blur instead for better appearance
        this.syncRequired();

        // Check field consistency on blur
        this.onEditComplete();
    }

    /**
     * Template function which may be implemented by subclasses to synchronize
     * input state and validity state upon completion of the edit.
     * @internal
     */
    onEditComplete() {

    }

    compose() {
        // Force evaluation of clearable so triggers include the clearable trigger. We can't bury this inside
        // changeTriggers since there may be no other triggers defined (which would mean changeTriggers would never
        // be run)
        this.getConfig('clearable');

        const
            { id, innerElements, label, labels = [], labelCls, readOnly, triggers } = this,
            triggerInstances = ObjectHelper.values(triggers, (k, v) => !v),
            // The triggers at each end are sorted "gravitationally".
            // Higher weight sorts towards the center which is the input element.
            startTriggers = triggerInstances.filter(t => t.align === 'start').sort(byWeight),
            endTriggers = triggerInstances.filter(t => t.align !== 'start').sort(byWeightReverse),
            setupLabel = lbl => ObjectHelper.assign({
                tag   : 'label',
                for   : `${id}-input`,
                class : `b-label b-align-${lbl.align || 'start'}`
            }, lbl);

        return {
            class : {
                'b-has-label'         : Boolean(label) || labels.length,
                'b-has-start-trigger' : startTriggers.length,
                'b-readonly'          : readOnly
            },
            children : [
                ...labels.filter(t => t && t.align !== 'end').map(setupLabel),
                (label || null) && setupLabel({
                    reference : 'labelElement',
                    class     : `b-label b-align-start ${labelCls || ''}`,
                    html      : label
                }),
                {
                    class     : 'b-field-inner',
                    reference : 'inputWrap',
                    children  : [
                        ...startTriggers.map(t => t.element),
                        ...innerElements,
                        ...endTriggers.map(t => t.element)
                    ]
                },
                ...labels.filter(t => t?.align === 'end').map(setupLabel)
            ]
        };
    }

    updateElement(element, was) {
        const
            me = this,
            value = me.initialConfig.value,
            { input } = me;

        super.updateElement(element, was);

        // Value must be injected into the input element after it has been constructed, not in the
        // initial template, otherwise the caret position will not be as expected.
        if (value != null) {
            me.value = value;
        }

        me.syncEmpty();
        me.updateInputReadOnly(me.inputReadOnly);
        me.syncInvalid();

        const keyEventElement = input || me.focusElement;

        me.keyListenerRemover?.();

        me.keyListenerRemover = keyEventElement && EventHelper.on({
            element  : keyEventElement,
            thisObj  : me,
            keydown  : 'internalOnKeyEvent',
            keypress : 'internalOnKeyEvent',
            keyup    : 'internalOnKeyEvent'
        });
    }

    // Subclasses may implement this.
    // Needed because Checkbox produces an array of two elements as its innerElements
    get innerElements() {
        return [this.inputElement];
    }

    get inputElement() {
        const
            { attributes, inputAttributes, id, inputCls, inputType, name } = this,
            domConfig = ObjectHelper.assign({
                reference     : 'input',
                tag           : 'input',
                type          : inputType,
                name          : name || id,
                id            : `${id}-input`,
                retainElement : true  // allow the input to be transplanted as in combo/chipView
            }, inputAttributes);

        if (inputCls) {
            domConfig.class = inputCls;
        }

        for (let key, value, i = attributes.length; i-- > 0; /* empty */) {
            key = attributes[i];
            value = this[key];

            if (value != null) {  // don't smash properties already in domConfig w/null values...
                domConfig[key] = value;
            }
        }

        return domConfig;
    }

    //endregion

    //region Focus & select

    get caretPos() {
        return this.textSelection[0];
    }

    set caretPos(value) {
        this.textSelection = value;
    }

    get focusElement() {
        return this.input;
    }

    get textSelection() {
        const input = this.input;

        let ret;

        try {
            ret = [input.selectionStart, input.selectionEnd, input.selectionDirection];
        }
        catch (e) {
            // ignore (some input types cannot do this)
            ret = input.value;
            ret = ret ? ret.length : 0;
            ret = [ret, ret];
        }

        return ret;
    }

    set textSelection(value) {
        if (typeof value === 'number') {
            this.select(value, value);
        }
        else {
            this.select(...value);
        }
    }

    get hasTextSelection() {
        const [selectionStart, selectionEnd] = this.textSelection;

        return selectionStart && selectionEnd - selectionStart > 0;
    }

    /**
     * Returns the input value for this field's input element that will be present if
     * the event carrying the given text is allowed to proceed.
     * @param {String} text
     * @returns {String}
     * @private
     */
    getAfterValue(text) {
        const
            [begin, end] = this.textSelection,
            value = this.input.value;

        return `${value.substr(0, begin)}${text}${value.substr(end || begin)}`;
    }

    /**
     * Selects the field contents. Optionally may be passed a start and end.
     * NOTE: This method is async for IE11
     * @param {Number} [start] The start index from which to select the input.
     * @param {Number} [end] The index at which to end the selection of the input.
     */
    select(start, end) {
        // Use focusElement which is the input field in this class
        // but allows subclasses to use other elements.
        // See, for example, TextAreaField
        const input = this.focusElement;

        if (input.value.length) {
            if (arguments.length === 0) {
                this.selectAll();
                return;
            }

            // Only allowed to select range in certain element / input types
            if (!this.supportsTextSelection) {
                return;
                // throw new Error('Trying to select text on an invalid element type');
            }

            if (BrowserHelper.isIE11) {
                // this.clearTimeout(this.selectTimeout);

                // HACK: IE focus processing is async and we can't select text until field is focused
                // Getting flaky exception in IE, something timing related. Found no way to detect it so using this
                // workaround for now
                input.focus();
                input.setSelectionRange(start, end);
                //
                // this.selectTimeout = this.setTimeout(() => {
                //     input && input.setSelectionRange(start, end);
                // }, 10);
            }
            else {
                input.setSelectionRange(start, end);
            }
        }
    }

    moveCaretToEnd() {
        const input = this.input;

        if (input.createTextRange) {
            const range = input.createTextRange();
            range.collapse(false);
            range.select();
        }
        else if (this.supportsTextSelection) {
            // Move caret to the end if possible
            this.select(input.value.length, input.value.length);
        }

    }

    selectAll() {
        this.focusElement.select();
    }

    // called on value changes to update styling of empty vs non-empty field
    syncEmpty() {
        const { isEmptyInput, isEmpty, element, clearIcon } = this,
            empty                                         = isEmptyInput && isEmpty;

        if (element) {
            if (clearIcon) {
                // IE11...
                clearIcon.classList[empty ? 'add' : 'remove']('b-icon-hidden');
            }

            // IE11...
            element.classList[empty ? 'add' : 'remove']('b-empty');
        }
    }

    updateHint() {
        this.syncHint();
    }

    updateHintHtml() {
        this.syncHint();
    }

    syncHint() {
        const
            me = this,
            { input, hint, hintHtml } = me,
            parent = input?.parentElement;

        if (input) {
            let hintValue = hintHtml || hint;

            const hintElement = me.hintElement || hintValue && (me.hintElement = DomHelper.createElement({
                parent,
                className   : 'b-field-hint',
                nextSibling : input.nextSibling,
                children    : [{
                    className : 'b-field-hint-content'
                }]
            }));

            if (hintElement) {
                if (typeof hintValue === 'function') {
                    hintValue = hintValue({ source : me, value : me.value });
                }

                hintElement.firstChild[hintHtml ? 'innerHTML' : 'textContent'] = hintValue || '';
            }

            me.element.classList[hintValue ? 'remove' : 'add']('b-field-no-hint');
        }
    }

    syncInvalid() {
        this.updatingInvalid = true;

        const { isPainted } = this;

        if (isPainted) {
            const { isValid, element, inputWrap } = this;

            // errorTip needs Tooltip.listenersTarget to be there
            // otherwise it doesn't setup listeners and cannot notice we mouseover an invalid field
            const errorTip = this.errorTip;

            element.classList[isValid ? 'remove' : 'add']('b-invalid');

            // We achieved validity, so ensure the error tip is hidden
            if (isValid) {
                if (errorTip?.isVisible && errorTip.field === this) {
                    errorTip.hide();
                }
            }
            // If the mouse is over, the tip should spring into view
            else if (errorTip && inputWrap.contains(Tooltip.currentOverElement)) {
                // Already shown by this field's inputWrap, just update content.
                if (errorTip.activeTarget === inputWrap && errorTip.isVisible) {
                    errorTip.onBeforeShow();
                }
                else {
                    errorTip.activeTarget = inputWrap;
                    errorTip.showBy(inputWrap);
                }
            }
        }

        this.updatingInvalid = false;
    }

    //endregion

    //region Getters/setters

    updateEditable() {
        this.syncInputReadOnly();
    }

    syncInputReadOnly() {
        this.getConfig('readOnly');  // make sure our config is initialized...

        // but since the readOnly getter conflates disabled into it, we ultimately have to look at _readOnly:
        this.inputReadOnly = this._readOnly || this.editable === false;
    }

    updateInputReadOnly(readOnly) {
        const
            me    = this,
            { input, inputListenerRemover } = me;

        // Editable refers *ONLY* to the readOnly state of the <input> field within the field.
        // It does *NOT* imply that the field is not modifiable by user interaction.
        // For example, a Combo or DateField may be not editable, but may still be set through the UI.
        // It is the readOnly config which disables user interaction from modifying the field.
        if (input) {
            input.readOnly = readOnly ? 'readOnly' : null;

            if (readOnly) {
                me.inputListenerRemover = inputListenerRemover?.();
            }
            else if (!inputListenerRemover) {
                me.inputListenerRemover = EventHelper.on({
                    element : input,
                    thisObj : me,
                    focus   : 'internalOnInputFocus',
                    change  : 'internalOnChange',
                    input   : 'internalOnInput'
                });
            }
        }
    }

    changeReadOnly(value) {
        return Boolean(value);
    }

    updateReadOnly(readOnly) {
        this.syncInputReadOnly();
    }

    updateClearable(clearable) {
        const me = this;

        me.getConfig('triggers');

        me.triggers = {
            clear : clearable && ObjectHelper.assign({
                cls    : 'b-icon-remove',
                weight : 1000,
                handler() {
                    me._isUserAction = true;
                    me.clear();
                    me._isUserAction = false;
                }
            }, clearable) || null
        };
    }

    changeTriggers(triggers, was) {
        const
            me = this,
            manager = me.$triggers || (me.$triggers = new DynamicObject({
                configName : 'triggers',
                factory    : Field.Trigger,
                inferType  : false,  // the name of a trigger in the triggers object is not its type
                owner      : me,

                created(instance) {
                    FunctionHelper.after(instance, 'onConfigChange', (ret, { name }) => {
                        if (triggerConfigs[name]) {
                            me.onConfigChange({
                                name  : 'triggers',
                                value : manager.target
                            });
                        }
                    });
                },

                setup(config, name) {
                    config.reference = config.ref = name;
                    config.parent = me;
                }
            }));

        if (me.stepTriggers === false && (triggers.back || triggers.forward)) {
            triggers = ObjectHelper.assign({}, triggers);
            delete triggers.back;
            delete triggers.forward;
        }

        manager.update(triggers);

        if (!was) {
            // Only return the target once. Further calls are processed above so we need to return undefined to ensure
            // onConfigChange is called. By returning the same target on 2nd+ call, it passes the === test and won't
            // trigger onConfigChange.
            return manager.target;
        }
    }

    updateLabelWidth(newValue) {
        if (this.labelElement) {
            this.labelElement.style.flex = `0 0 ${DomHelper.setLength(newValue)}`;
            // If there's a label width, the input must conform with it, and not try to expand to 100%
            this.inputWrap.style.flexBasis = newValue == null ? '' : 0;
        }
    }

    updateInputWidth(newValue) {
        this.input.style.width = DomHelper.setLength(newValue);

        // requires to make "Should support inputWidth with label" test green
        if (BrowserHelper.isIE11) {
            this.input.parentElement.style.flexBasis = this.input.style.width;
        }

        this.element.classList.add('b-has-width');
    }

    updateInputAlign(newValue) {
        this.input.style.textAlign = newValue;
    }

    changeLabel(label) {
        return (label == null) ? '' : label;
    }

    updateLabel(label) {
        // since value is used in template it is not certain that element is available
        // TODO: move the code from template here instead
        if (this.labelElement) {
            // using innerHTML since we sometimes use icons as label
            this.labelElement.innerHTML = label;
        }
    }

    updateLabelPosition(position, oldPosition) {
        const { classList } = this.element;

        classList.remove(`b-label-${oldPosition}`);
        classList.add(`b-label-${position}`);
    }

    /**
     * Returns true if the field value is valid
     * @type {Boolean}
     * @readonly
     */
    get isValid() {
        const me = this;

        // Disabled fields are considered valid
        if (!me.disabled) {
            me.syncRequired();

            if (me.errors && Object.keys(me.errors).length) {
                return false;
            }

            const validity = me.validity;

            if (validity) {
                return validity.valid;
            }
        }

        return true;
    }

    /**
     * Returns `true` if this field is empty. That is, if it would violate the {@link #config-required}
     * setting.
     *
     * This may have different definitions in subclasses from simple text fields.
     * @type {Boolean}
     * @readonly
     */
    get isEmpty() {
        return this.value == null || this.value === '';
    }

    /**
     * Returns true if the field's input is empty
     * @type {Boolean}
     * @readonly
     */
    get isEmptyInput() {
        return !this.input || this.input.value == null || this.input.value === '';
    }

    /**
     * Returns the DOM `ValidityState` for this widget's input element, or `null` if there
     * isn't one.
     * @returns {ValidityState}
     * @private
     */
    get validity() {
        const input = this.input;

        return input && input.validity;
    }

    changeValue(value, was) {
        if (value == null) {
            value = this.nullValue;
        }

        // In cases of arrays, for example, we need to return "was" to pass the === check in the setter to convince
        // the config that, in fact, no change has occurred.
        if (this.hasChanged(was, value)) {
            return value;
        }

        // When loading a record into a form, an empty value might be loaded into a field, which is not detected as a
        // change. In this scenario it should still be flagged as invalid
        if (value === '') {
            this.syncRequired();
        }

        return was;
    }

    updateValue(value, oldValue) {
        const me = this;

        // Do not flag with error if configured empty, looks ugly to have fields start red
        if (!me.isConfiguring) {
            me.syncRequired();

            // Do not trigger change event during configuration phase
            // or during keyboard input
            if (!me.inputting) {
                // trigger change event, signaling that origin is from set operation,
                // makes it easier to ignore such events in applications that set value on load etc
                me.triggerChange();
            }
        }

        // lastValue is used for IE to check if a change event should be triggered when pressing ENTER
        if (!me.inputting) {
            me._lastValue = value;
        }

        me.syncInputFieldValue();
    }

    /**
     * Compares this field's value with its previous value. May be overridden in subclasses
     * which have more complex value types. See, for example, {@link Core.widget.DurationField}.
     * @param {*} oldValue
     * @param {*} newValue
     * @private
     */
    hasChanged(oldValue, newValue) {
        return newValue !== oldValue;
    }

    /**
     * Called by the base Field class's `set value` to sync the state of the UI with the field's value.
     *
     * Relies upon the class implementation of `get inputValue` to return a string representation of
     * the value for user consumption and editing.
     * @private
     */
    syncInputFieldValue(skipHighlight = false) {
        const
            me        = this,
            { input, parent, inputValueAttr, inputValue } = me;

        // If we are updating from internalOnInput, we must not update the input field
        if (input && !me.inputting && input[inputValueAttr] !== inputValue) {
            // Subclasses may implement their own read only inputValue property.
            input[inputValueAttr] = inputValue;

            // TODO : This highlighting logic needs extracting/clarifying

            // If it's being manipulated from the outside, highlight it
            if (!me.isConfiguring && !me.containsFocus && me.highlightExternalChange) {
                input.classList.remove('b-field-updated');

                me.clearTimeout('removeUpdatedCls');

                if (!skipHighlight && (!parent || !(parent.isSettingValues || parent._isSettingValues?.preventHighlight))) {
                    me.highlightChanged();
                }
            }
        }

        me.syncEmpty();
        me.syncInvalid();
    }

    highlightChanged() {
        this.input.classList.add('b-field-updated');
        this.setTimeout('removeUpdatedCls', this.updatedClsDuration);
    }

    removeUpdatedCls() {
        this.input.classList.remove('b-field-updated');
    }

    /**
     * A String representation of the value of this field for {@link #function-syncInputFieldValue} to use
     * as the input element's value.
     *
     * Subclasses may override this to create string representations.
     *
     * For example, {@link Core.widget.DateField}'s implementation will format the field date
     * value according to its configured {@link Core.widget.DateField#config-format}. And {@link Core.widget.Combo}'s
     * implementation will return the {@link Core.widget.Combo#config-displayField} of the selected record.
     * @internal
     * @readOnly
     */
    get inputValue() {
        // Do not use the _value property. If called during configuration, this
        // will import the configured value from the config object.
        return this.value == null ? '' : this.value;
    }

    get inputValueAttr() {
        return 'value';
    }

    get supportsTextSelection() {
        const input = this.focusElement;

        // Text selection using setSelectionRange is allowed in Chrome for certain elements. Edge supports it even for input[type=number]
        return input && (input.tagName.toLowerCase() === 'textarea' || (input.type && (/text|search|password|tel|url/.test(input.type) || BrowserHelper.isEdge)));
    }

    //endregion

    //region Events

    internalOnInputFocus() {
        const
            me     = this,
            length = me.input.value.length;

        // Help IE to set caret at the end like the other browsers
        if (BrowserHelper.isIE11 && length && !me.autoSelect) {
            me.select(length, length);
        }

        if (me.autoSelect) {
            me.selectAll();
        }
    }

    /**
     * Trigger event when fields input changes
     * @fires change
     * @private
     */
    internalOnChange(event) {
        const me = this;

        // Don't trigger change if we enter invalid value or if value has not changed (for IE when pressing ENTER)
        if (me.isValid && me.hasChanged(me._lastValue, me.value)) {
            me.triggerChange(event, true);
            me._lastValue = me.value;
        }
    }

    triggerChange(event, userAction = Boolean(this._isUserAction)) {
        const
            me = this,
            {
                value,
                _lastValue : oldValue,
                // TODO: The `internalOnChange`-path excludes invalid changes, while the `set value`-path includes them
                isValid    : valid
            }  = me;

        me.syncHint();
        // trigger change event, signaling that origin is from user
        me.triggerFieldChange({ value, oldValue, event, userAction, valid });

        // per default Field triggers action event on change, but might be reconfigured in subclasses (such as Combo)
        if (me.defaultAction === 'change') {
            me.trigger('action', { value, oldValue, event, userAction, valid });
        }

        // since Widget has Events mixed in configured with 'callOnFunctions' this will also call onClick and onAction
    }

    /**
     * Trigger event when user inputs into field
     * @fires input
     * @param event
     * @private
     */
    internalOnInput(event) {
        const me = this;

        // Keep the value synced with the inputValue at all times.
        me.inputting = true;
        me.value = me.input.value;
        me.inputting = false;

        me.trigger('input', { value : me.value, event });

        me.changeOnKeyStroke?.(event);

        // since Widget has Events mixed in configured with 'callOnFunctions' this will also call onInput
    }

    internalOnKeyEvent(event) {
        const
            me        = this,
            { value } = me;

        let stopEvent = false;

        if (event.type === 'keydown') {
            if (event.key === 'Escape' && !(me.readOnly || me.disabled)) {
                // We can be started with an initialValue which takes precedence over the valueOnFocus.
                // Because in some situations focus can move out and back in after a change which needs
                // to be revertable. For example in cell editing.
                const
                    wasValid       = me.isValid,
                    initialValue   = ('initialValue' in me) ? me.initialValue : me.valueOnFocus,
                    valueChanged   = me.hasChanged(initialValue, value),
                    needsInputSync = me.input.value !== String(me.inputValue);

                // We revert on escape if we are configured to do so AND:
                // We are in an invalid state, or the value has changed, or the displayed value doesn't match the field value.
                if (me.revertOnEscape && (!wasValid || valueChanged || needsInputSync)) {
                    if (valueChanged) {
                        me.value = initialValue;
                    }
                    if (needsInputSync) {
                        me.syncInputFieldValue(true);
                    }
                    me.clearError();

                    // If this processing changed the value back to valid, or
                    // the validity state was different to that upon focus
                    // then this was a revert operation, so prevent further ESC processing.
                    stopEvent = (valueChanged && me.isValid) || (wasValid !== me.validOnFocus);
                }
                else if (me.clearable && (value || me.input.value)) {
                    me.clear();
                }
            }
            // #5730 - IE11 doesn't trigger "change" event by Enter click
            else if (event.key === 'Enter' && BrowserHelper.isIE11) {
                me.internalOnChange(event);
            }
        }

        // The above processing might have destructive consequences.
        if (!me.isDestroyed) {
            // If the keystroke had the effect of changing the field, prevent other handlers
            // which may mask that effect. Such as ESC exiting some UI context. Keep it contained.
            if (stopEvent) {
                event.stopImmediatePropagation();
            }
            me.trigger(event.type, { event });
        }
    }

    /**
     * Clears the value of this Field, and triggers the {@link #event-clear} event.
     */
    clear() {
        this.value = this.nullValue;

        this.trigger('clear');
    }

    /**
     * Called when disabled state is changed.
     * Used to add or remove 'b-invalid' class for the invalid field based on current disabled state.
     * @private
     */
    onDisabled() {
        this.syncInvalid();
    }

    //endregion

    //region Error

    syncRequired() {
        const me = this;

        // Empty valid if any ancestor Container is setting values
        if (!me.isConfiguring && me.required && me.isEmpty && !me.parent?.isSettingValues) {
            me.setError('L{fieldRequired}', me.updatingInvalid);
        }
        else {
            me.clearError('L{fieldRequired}', me.updatingInvalid);
        }
    }

    /**
     * Adds an error message to the list of errors on this field.
     * By default the field's valid/invalid state is updated; pass
     * `false` as the second parameter to disable that if multiple
     * changes are being made to the error state.
     * @param {String} error A locale string, or message to use as an error message.
     * @param {Boolean} [silent=false] Pass as `true` to skip updating the field's valid/invalid state.
     */
    setError(error, silent) {
        // Error messages are deduplicated by using them as the property names in an object.
        (this.errors || (this.errors = {}))[this.optionalL(error)] = 1;

        if (!silent) {
            this.syncInvalid();
        }
    }

    /**
     * Removes an error message from the list of errors on this field.
     * By default the field's valid/invalid state is updated; pass
     * `false` as the second parameter to disable that if multiple
     * changes are being made to the error state.
     * @param {String} [error] A locale string, or message to remove. If not passed, all errors are cleared.
     * @param {Boolean} [silent=false] Pass as `true` to skip updating the field's valid/invalid state.
     */
    clearError(error, silent) {
        const me = this;

        if (me.errors) {
            if (error) {
                delete this.errors[this.optionalL(error)];
            }
            else {
                me.errors = {};
            }

            if (!silent) {
                me.syncInvalid();
            }
        }
    }

    /**
     * Returns an array of error messages as set by {@link #function-setError}, or
     * `undefined` if there are currently no errors.
     * @return {String[]} The errors for this field, or `undefined` if there are no errors.
     */
    getErrors() {
        const me = this;

        if (!me.isValid) {
            const
                validity  = me.validity,
                // See possible state names: https://developer.mozilla.org/en-US/docs/Web/API/ValidityState
                stateName = ObjectHelper.keys(validity).find(key => key !== 'valid' && key !== 'customError' && validity[key]),
                errorKeys = me.errors && Object.keys(me.errors);

            let errors;

            if (errorKeys?.length) {
                errors = errorKeys;
            }
            // If custom error message was set using https://developer.mozilla.org/en-US/docs/Web/API/HTMLObjectElement/setCustomValidity
            else if (validity.customError) {
                errors = [me.input.validationMessage];
            }
            // If invalid state found, translate it
            else if (stateName) {
                // Do not remove. Assertion strings for Localization sanity check.
                // 'L{foo}'
                // 'L{badInput}'
                // 'L{patternMismatch}'
                // 'L{rangeOverflow}'
                // 'L{rangeUnderflow}'
                // 'L{stepMismatch}'
                // 'L{tooLong}'
                // 'L{tooShort}'
                // 'L{typeMismatch}'
                // 'L{valueMissing}'

                errors = [me.L(stateName, {
                    // In case min/max limits are present they will be used in the translation
                    min : me.min,
                    max : me.max
                })];
            }
            // If built-in state is 'valid' but me.isValid is false, show our invalid message
            else {
                errors = [me.L(me.invalidValueError)];
            }

            if (errors && errors.length > 0) {
                return errors;
            }
        }
    }

    //endregion

}

/**
 * Base class for field triggers May be configured with a `cls` and a `handler` which is a function (or name of a function)
 * in the owning Field.
 * @classtype trigger
 * @extends Core/widget/Widget
 */
Field.Trigger = class FieldTrigger extends Widget {
    static get $name() {
        return 'FieldTrigger';
    }

    static get factoryable() {
        return {
            defaultType : Field.Trigger,
            extends     : null
        };
    }

    // Factoryable type name
    static get type() {
        return 'trigger';
    }

    // Align is a simple string at this level
    static get configurable() {
        return {
            align  : null,
            weight : null
        };
    }

    get field() {
        return this.parent;
    }

    compose() {
        return {
            class : {
                [`b-align-${this.align || 'end'}`] : 1,
                'b-icon'                           : 1
            },
            listeners : {
                click     : 'onClick',
                mousedown : 'onMousedown'
            }
        };
    }

    changeAlign(align) {
        return align;  // Widget base class converts to an object
    }

    onClick(e) {
        const
            me        = this,
            { field } = me,
            handler   = (typeof me.handler === 'function') ? me.handler : field[me.handler];

        if (!(field.disabled || field.readOnly)) {
            if (field.trigger('trigger', { trigger : me }) !== false) {
                handler?.call(field, e);
            }
        }
    }

    onMousedown(e) {
        const
            field      = this.field,
            isKeyEvent = ('key' in e);

        // If it's a touch tap on the trigger of an editable, then
        // avoid the keyboard by setting the field to not be editable
        // before focusing the field. Reset to be editable after focusing
        // has happened. Keyboard will not appear.
        if (!isKeyEvent && DomHelper.isTouchEvent) {
            if (field.editable) {
                field.editable = false;
                field.setTimeout(() => field.editable = true, 500);
            }
        }

        e.preventDefault();

        if (DomHelper.getActiveElement(field.input) !== field.input) {
            field.focus();
        }
    }
};

Field.SpinTrigger = class SpinTrigger extends Field.Trigger {
    static get $name() {
        return 'SpinTrigger';
    }

    // Factoryable type name
    static get type() {
        return 'spintrigger';
    }

    static get configurable() {
        return {
            repeat : {
                $config : ['nullify'],
                value   : true
            }
        };
    }

    compose() {
        return {
            children : {
                upButton : {
                    class : {
                        'b-icon'    : 1,
                        'b-spin-up' : 1
                    }
                },
                downButton : {
                    class : {
                        'b-icon'      : 1,
                        'b-spin-down' : 1
                    }
                }
            }
        };
    }

    updateRepeat(repeat) {
        this.clickRepeater?.destroy();

        this.clickRepeater = repeat ? ClickRepeater.new({
            element : this.element
        }, repeat) : null;
    }

    onClick(e) {
        const
            me        = this,
            { field } = me;

        if (!(field.disabled || field.readOnly)) {
            if (e.target === me.upButton) {
                field.doSpinUp(e.shiftKey);
            }
            else if (e.target === me.downButton) {
                field.doSpinDown(e.shiftKey);
            }
        }
    }
};

// Register trigger widgets type with their Factory
Field.Trigger.initClass();
Field.SpinTrigger.initClass();

Widget.register(Field.Trigger, 'trigger');
Widget.register(Field.SpinTrigger, 'spintrigger');
