import Popup from './Popup.js';
import './Button.js';
import './TextField.js';
import Widget from './Widget.js';
import BrowserHelper from '../helper/BrowserHelper.js';

/**
 * @module Core/widget/MessageDialog
 */

const items = [
    {
        ref     : 'cancelButton',
        cls     : 'b-messagedialog-cancelbutton b-gray',
        text    : 'L{Object.Cancel}',
        onClick : 'up.onCancelClick'
    },
    {
        ref     : 'okButton',
        cls     : 'b-messagedialog-okbutton b-raised b-blue',
        text    : 'L{Object.Ok}',
        onClick : 'up.onOkClick'
    }
];

// Windows has OK button to the left, Mac / Ubuntu to the right
if (BrowserHelper.isWindows) {
    items.reverse();
}

class MessageDialogConstructor extends Popup {

    static get $name() {
        return 'MessageDialog';
    }

    // Factoryable type name
    static get type() {
        return 'messagedialog';
    }

    static get configurable() {
        return {
            centered    : true,
            modal       : true,
            hidden      : true,
            autoShow    : false,
            closeAction : 'hide',
            title       : '\xa0',

            lazyItems : {
                $config : ['lazy'],
                value   : [{
                    cls : 'b-messagedialog-message',
                    ref : 'message'
                }, {
                    type : 'textfield',
                    cls  : 'b-messagedialog-input',
                    ref  : 'input'
                }]
            },

            // Do not remove. Assertion strings for Localization sanity check.
            // 'L{Object.Cancel}'
            // 'L{Object.Ok}'
            bbar : {
                items
            }
        };
    }

    construct() {
        /**
         * The enum value for the OK button
         * @member {Number} okButton
         * @readOnly
         */
        this.okButton = this.yesButton = 1;

        /**
         * The enum value for the Cancel button
         * @member {Number} cancelButton
         * @readOnly
         */
        this.cancelButton = 3;

        super.construct(...arguments);
    }

    /**
     * Shows a confirm dialog with "Ok" and "Cancel" buttons. The returned promise resolves passing the button identifier
     * of the button that was pressed ({@link #property-okButton} or {@link #property-cancelButton}).
     * @function confirm
     * @async
     * @param {Object} options An options object for what to show.
     * @param {String} [options.title] The title to show in the dialog header.
     * @param {String} [options.message] The message to show in the dialog body.
     * @param {String} [options.rootElement] The root element of this widget, defaults to document.body. Use this
     * if you use the MessageDialog inside a web component ShadowRoot
     * @param {String|Object} [options.cancelButton] A text or a config object to apply to the Cancel button.
     * @param {String|Object} [options.okButton] A text or config object to apply to the OK button.
     * @returns {Promise} A promise which is resolved when the dialog is closed
     */
    async confirm() {
        return this.showDialog('confirm', ...arguments);
    }

    /**
     * Shows an alert popup with a message. The returned promise resolves when the button is clicked.
     * @function alert
     * @async
     * @param {Object} options An options object for what to show.
     * @param {String} [options.title] The title to show in the dialog header.
     * @param {String} [options.message] The message to show in the dialog body.
     * @param {String} [options.rootElement] The root element of this widget, defaults to document.body. Use this
     * if you use the MessageDialog inside a web component ShadowRoot
     * @param {String|Object} [options.okButton] A text or config object to apply to the OK button.
     * @returns {Promise} A promise which is resolved when the dialog is closed
     */
    async alert() {
        return this.showDialog('alert', ...arguments);
    }

    /**
     * Shows a popup with a basic {@link Core.widget.TextField} along with a message. The returned promise resolves when
     * the dialog is closed and yields an Object with a `button` ({@link #property-okButton} or {@link #property-cancelButton})
     * and a `text` property with the text the user provided
     * @function prompt
     * @async
     * @param {Object} options An options object for what to show.
     * @param {String} [options.title] The title to show in the dialog header.
     * @param {String} [options.message] The message to show in the dialog body.
     * @param {String} [options.rootElement] The root element of this widget, defaults to document.body. Use this
     * if you use the MessageDialog inside a web component ShadowRoot
     * @param {Object} [options.textField] A config object to apply to the TextField.
     * @param {String|Object} [options.cancelButton] A text or a config object to apply to the Cancel button.
     * @param {String|Object} [options.okButton] A text or config object to apply to the OK button.
     * @returns {Promise} A promise which is resolved when the dialog is closed. The promise yields an Object with
     * a `button` ({@link #property-okButton} or {@link #property-cancelButton}) and a `text` property with the text the
     * user provided
     */
    async prompt({
        textField
    }) {
        const field = this.widgetMap.input;

        Widget.reconfigure(field, textField);
        field.value = '';

        return this.showDialog('prompt', ...arguments);
    }

    showDialog(mode, {
        message = '',
        title = '\xa0',
        cancelButton,
        okButton,
        rootElement = document.body
    }) {
        const me = this;

        me.rootElement = rootElement;

        // Ensure our child items are instanced
        me.getConfig('lazyItems');

        me.title                  = me.optionalL(title);
        me.widgetMap.message.html = me.optionalL(message);

        me.element.classList.remove(me.showClass);
        me.showClass = `b-messagedialog-${mode}`;
        me.element.classList.add(me.showClass);

        // Normalize string input to config object
        if (okButton) {
            okButton = typeof okButton === 'string' ? { text : okButton } : okButton;
        }

        if (cancelButton) {
            cancelButton = typeof cancelButton === 'string' ? { text : cancelButton } : cancelButton;
        }

        // Ensure default configs are applied
        okButton = Object.assign({}, me.widgetMap.okButton.initialConfig, okButton);
        cancelButton = Object.assign({}, me.widgetMap.cancelButton.initialConfig, cancelButton);

        // Ensure strings are localized
        okButton.text = me.optionalL(okButton.text);
        cancelButton.text = me.optionalL(cancelButton.text);

        Widget.reconfigure(me.widgetMap.okButton, okButton);
        Widget.reconfigure(me.widgetMap.cancelButton, cancelButton);

        me.show();

        return me.promise = new Promise(resolve => {
            me.resolve = resolve;
        });
    }

    doResolve(value) {
        const
            me          = this,
            { resolve } = me;

        if (resolve) {
            const isPrompt = me.showClass === 'b-messagedialog-prompt';

            if (isPrompt && value === me.okButton && !me.widgetMap.input.isValid) {
                return;
            }

            me.resolve = me.reject = me.promise = null;
            resolve(isPrompt ? { button : value, text : me.widgetMap.input.value } : value);
            me.hide();
        }
    }

    onInternalKeyDown(event) {
        // Cancel on escape key
        if (event.key === 'Escape') {
            event.stopImmediatePropagation();
            this.onCancelClick();
        }
        if (event.key === 'Enter') {
            event.stopImmediatePropagation();
            event.preventDefault(); // Needed to not spill over into next MessageDialog if closing this opens another
            this.onOkClick();
        }
        super.onInternalKeyDown(event);
    }

    onOkClick() {
        this.doResolve(MessageDialog.okButton);
    }

    onCancelClick() {
        this.doResolve(MessageDialog.cancelButton);
    }
}

// Register this widget type with its Factory
MessageDialogConstructor.initClass();

const MessageDialog = new MessageDialogConstructor();

/**
 * A singleton class which shows common dialogs, similar to the native browser APIs (though these methods do not block the UI thread):
 * - {@link Core.widget.MessageDialog#function-confirm} shows a confirmation dialog with Ok / Cancel buttons
 * - {@link Core.widget.MessageDialog#function-alert} shows an dialog with a message
 * - {@link Core.widget.MessageDialog#function-prompt} shows a dialog with a text input field
 *
 * @class
 * @singleton
 * @inlineexample Core/widget/MessageDialog.js
 * @extends Core/widget/Popup
 */
export default MessageDialog;
