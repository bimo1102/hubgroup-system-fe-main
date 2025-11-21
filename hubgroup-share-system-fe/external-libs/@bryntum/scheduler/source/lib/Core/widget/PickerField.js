import TextField from './TextField.js';
import GlobalEvents from '../GlobalEvents.js';
import EventHelper from '../helper/EventHelper.js';
import DomHelper from '../helper/DomHelper.js';

/**
 * @module Core/widget/PickerField
 */

/**
 * Base class used for {@link Core.widget.Combo Combo}, {@link Core.widget.DateField DateField}, and {@link Core.widget.TimeField TimeField}.
 * Displays a picker ({@link Core.widget.List List}, {@link Core.widget.DatePicker DatePicker}) anchored to the field.
 * Not intended to be used directly.
 *
 * This field's subclasses can be used as editors for the {@link Grid.column.Column Column}.
 *
 * When focused by means of *touch* tapping on the trigger element (eg, the down arrow on a Combo)
 * on a tablet, the keyboard will not be shown by default to allow for interaction with the dropdown.
 *
 * A second tap on the input area will then show the keyboard if required.
 *
 * @extends Core/widget/TextField
 * @abstract
 */
export default class PickerField extends TextField {
    //region Config
    static get $name() {
        return 'PickerField';
    }

    // Factoryable type name
    static get type() {
        return 'pickerfield';
    }

    static get configurable() {
        return {

            /**
             * User can edit text in text field (otherwise only pick from attached picker)
             * @config {Boolean}
             * @default
             */
            editable : true,

            /**
             * The name of the element property to which the picker should size and align itself.
             * @config {String}
             * @default element
             */
            pickerAlignElement : 'inputWrap',

            // Does not get set, but prevents PickerFields inheriting value:'' from Field.
            value : null,

            triggers : {
                expand : {
                    cls : 'bars'
                }
            },

            /**
             * By default PickerField's picker is transient, and will {@link #function-hidePicker} when the user clicks or
             * taps outside or when focus moves outside picker.
             *
             * Configure as `false` to make picker non-transient.
             * @config {Boolean}
             * @default
             */
            autoClose : true,

            /**
             * Configure as `true` to have the picker expand upon focus enter.
             * @config {Boolean}
             */
            autoExpand : null,

            /**
             * Returns the instantiated picker widget as configured by {@link #config-picker}.
             * @readonly
             * @member {Core.widget.Widget} picker
             */
            /**
             * A config object which is merged into the generated picker configuration to allow specific use cases
             * to override behaviour. For example:
             *
             *     picker: {
             *         align: {
             *             anchor: true
             *         }
             *     }
             *
             * @config {Object}
             */
            picker : {
                value : {
                    floating : true
                },

                $config : ['lazy', 'nullify']
            },

            inputType : 'text',

            // We need to realign the picker if we resize (eg a multiSelect Combo's ChipView wrapping)
            monitorResize : true,

            nullValue : null
        };
    }

    //endregion

    //region Init & destroy

    doDestroy() {
        // Remove touch keyboard showing listener if we added it
        this.globalTapListener?.();

        super.doDestroy();
    }

    updateEditable(editable) {
        const
            me          = this,
            element     = me.element;

        super.updateEditable(...arguments);

        if (editable === false) {
            me.globalTapListener?.();
            element.classList.add('b-not-editable');
            EventHelper.on({
                element : me.input,
                click   : 'onTriggerClick',
                thisObj : me
            });
        }
        else {
            // In case the field was temporarily set to readOnly="true" to prevent
            // the intrusive keyboard (This happens when tapping the trigger
            // and when focused by the container in response to a touch tap),
            // allow a subsequent touch tap to show the keyboard.
            me.globalTapListener = GlobalEvents.on({
                globaltap : 'showKeyboard',
                thisObj   : me
            });
        }
    }

    //endregion

    //region Picker

    /* TODO
    changePicker(picker, was) {
        if (was) {
            was.hide();
            was.destroy();
        }

        if (picker && !(picker instanceof Widget)) {
            picker = this.createPicker(picker);
        }

        return picker;
    }

    createPicker() {
        throw new Error('createPicker must be implemented in PickerField subclass implementations');
    }
    */

    changePicker(picker, oldPicker) {
        throw new Error('changePicker(oldPicker, newPicker) must be implemented in PickerField subclass implementations');
    }

    /**
     * Iterate over all widgets owned by this widget and any descendants.
     *
     * *Note*: Due to this method aborting when the function returns `false`, beware of using short form arrow
     * functions. If the expression executed evaluates to `false`, iteration will terminate.
     *
     * _Due to the {@link #config-picker} config being a lazy config and only being converted to be a
     * `List` instance just before it's shown, the picker will not be part of the iteration before
     * it has been shown once_.
     * @function eachWidget
     * @param {Function} fn A function to execute upon all descendant widgets.
     * Iteration terminates if this function returns `false`.
     * @param {Boolean} [deep=true] Pass as `false` to only consider immediate child widgets.
     * @returns {Boolean} Returns `true` if iteration was not aborted by a step returning `false`
     */

    get childItems() {
        if (this._picker) {
            return [this.picker];
        }
    }

    //endregion

    //region Events

    /**
     * Check if field value is valid
     * @internal
     */
    onEditComplete() {
        super.onEditComplete();
        this.autoClosePicker();
    }

    onElementResize(resizedElement) {
        const me = this;

        // If the field changes size while the picker is visible, the picker
        // must be kept in alignment. For example a multiSelect: true
        // ComboBox with a wrapped ChipView.
        if (me.pickerVisible) {
            // Push realignment out to the next AF, because this picker itself may move in
            // response to the element resize, and the picker must realign *after* that happens.
            // For example a multiSelect: true ComboBox with a wrapped ChipView inside
            // a Popup that is aligned *above* an element. When the ChipView gains or
            // loses height, the Popup must realign first, and then the List must align to the
            // new position of the ComboBox.
            me.picker.requestAnimationFrame(me.picker.realign, null, me.picker);
        }

        super.onElementResize(resizedElement);
    }

    /**
     * Allows using arrow keys to open/close list. Relays other keypresses to list if open.
     * @private
     */
    internalOnKeyEvent(event) {
        const me = this;

        let callSuper = true;

        if (event.type === 'keydown' && !me.disabled) {
            if (me.pickerVisible) {
                const { picker } = me;

                if (event.key === 'Escape') {
                    event.stopImmediatePropagation();
                    me.hidePicker();

                    // EC has multiple effects. First stage is hide the picker.
                    // If we do this, then the superclass's ESC handling must
                    // not be called.
                    callSuper = false;
                }
                else if (picker.onInternalKeyDown) {
                    // if picker is visible, give it a shot at the event
                    picker.onInternalKeyDown(event);
                }
                else if (event.key === 'ArrowDown') {
                    if (picker.focusable) {
                        picker.focus();
                    }
                }
            }
            else if (event.key === 'ArrowDown') {
                // navigator should not react to initial DOWN keypress that triggers the List to show
                event.stopImmediatePropagation();

                // If we not prevent default handler page might scroll. Siesta cannot reproduce this behavior, have to
                // leave it untested.
                // https://github.com/bryntum/support/issues/885
                event.preventDefault();

                me.onTriggerClick(event);
            }
        }

        if (callSuper) {
            super.internalOnKeyEvent(event);
        }
    }

    onFocusIn(e) {
        super.onFocusIn(e);

        if (this.autoExpand) {
            // IE triggers an input event on focus.
            // If expand is configured for focus, minChars should be zero.
            this.minChars = 0;
            this.onTriggerClick(e);
        }
    }

    onFocusOut(e) {
        this.autoClosePicker();

        super.onFocusOut(e);
    }

    /**
     * User clicked trigger icon, toggle list.
     * @private
     */
    onTriggerClick(event) {
        if (!this.disabled) {
            // Pass focus flag as true if invoked by a key event
            this.togglePicker('key' in event);
        }
    }

    /**
     * User clicked on an editable input field. If it's a touch event
     * ensure that the keyboard is shown.
     * @private
     */
    showKeyboard({ event }) {
        const input = this.input;

        if (DomHelper.isTouchEvent && DomHelper.getActiveElement(input) === input && event.target === input) {
            GlobalEvents.suspendFocusEvents();
            input.blur();
            input.focus();
            GlobalEvents.resumeFocusEvents();
        }
    }

    //endregion

    //region Toggle picker

    /**
     * Toggle the {@link #property-picker} visibility
     * @privateparam {Boolean} [focus] Pass `true` to focus the picker when it gets shown.
     */
    togglePicker(focus) {
        if (this.pickerVisible) {
            this.hidePicker();
        }
        else {
            this.showPicker(focus);
        }
    }

    /**
     * Show the {@link #property-picker}
     * @privateparam {Boolean} [focus] Pass `true` to focus the picker when it gets shown.
     */
    showPicker(focus) {
        const
            me         = this,
            { picker } = me;

        if (!me.pickerHideShowListenersAdded) {
            picker.on({
                show    : 'onPickerShow',
                hide    : 'onPickerHide',
                thisObj : me
            });
            me.pickerHideShowListenersAdded = true;
        }

        picker.autoClose = me.autoClose;
        picker.show();

        // Not been vetoed
        if (picker.isVisible) {
            if (focus) {
                me.focusPicker();
            }
        }
    }

    onPickerShow() {
        const me = this;

        me.pickerVisible = true;
        me.element.classList.add('b-open');
        me.trigger('togglePicker', { show : true });
        me.pickerTapOutRemover = GlobalEvents.on({
            globaltap : 'onPickerTapOut',
            thisObj   : me
        });
        me.pickerKeyDownRemover = EventHelper.on({
            element : me.picker.element,
            keydown : 'onPickerKeyDown',
            thisObj : me
        });
    }

    onPickerHide() {
        const me = this;

        me.pickerVisible = false;
        me.element.classList.remove('b-open');
        me.trigger('togglePicker', { show : false });
        me.pickerTapOutRemover && me.pickerTapOutRemover();
        me.pickerKeyDownRemover && me.pickerKeyDownRemover();
    }

    onPickerTapOut({ event }) {
        if (!this.owns(event.target)) {
            this.autoClosePicker();
        }
    }

    onPickerKeyDown(event) {
        if (event.key === 'Tab') {
            const
                activeEl = DomHelper.getActiveElement(this.input),
                forwardedEvent = new KeyboardEvent('keydown', event);

            // Offer our own element a shot at the TAB event.
            // Some widgets or plugins may actively navigate.
            this.input.dispatchEvent(forwardedEvent);

            // Somebody might preventDefault on the synthesized event. We must honour that.
            // For example if we are the field for a cell Editor, and it started an edit on the adjacent cell.
            if (forwardedEvent.defaultPrevented) {
                event.preventDefault();
            }

            // No listener intervened, point the TAB event at the input,
            // and user agent default navigation will proceed.
            if (DomHelper.getActiveElement(this.input) === activeEl) {
                this.input.focus();
            }
            // Some listener *did* navigate, prevent user agent default.
            else {
                event.preventDefault();
            }

            // If listeners have not destroyed us, close our picker.
            if (!this.isDestroyed) {
                this.hidePicker();
            }
        }
    }

    //endregion

    //region Visibility

    autoClosePicker() {
        if (this.autoClose) {
            this.hidePicker();
        }
    }

    /**
     * Hide picker
     */
    hidePicker() {
        if (this.pickerVisible) {
            this.picker.hide();
        }
    }

    focusPicker() {

    }

    focus() {
        const input = this.input;

        // If we are focusing an editable PickerField from a touch event, temporarily
        // set it to readOnly to prevent the showing of the intrusive keyboard.
        // It's more likely that a user on a touch device will interact with the picker
        // rather than the input field.
        // A second touch tap on an already focused input will show the keyboard;
        // see the showKeyboard method.
        if (DomHelper.isTouchEvent && this.editable) {
            input.readOnly = true;
            this.setTimeout(() => input.readOnly = false, 500);
        }
        super.focus();
    }

    //endregion

}
