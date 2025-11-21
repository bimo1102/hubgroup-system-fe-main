import Field from './Field.js';

/**
 * @module Core/widget/FileField
 */

/**
 * FileField widget. Wraps native &lt;input type="file"&gt;.
 *
 * {@inlineexample Core/widget/FileField.js vertical}
 *
 * There is a nicer styled wrapper for this field, see {@link Core/widget/FilePicker}
 *
 * @extends Core/widget/Field
 * @classType filefield
 */
export default class FileField extends Field {
    static get $name() {
        return 'FileField';
    }

    // Factoryable type name
    static get type() {
        return 'filefield';
    }

    internalOnChange(event) {
        // Event order is not consistent across browsers:
        //
        //  Chrome/Firefox:             IE11:                       Edge:
        //      internalOnInput             internalOnChange            internalOnChange
        //      internalOnChange            internalOnInput
        //
        // The problem this creates is that the onChange logic expects value != lastValue which is ensured by the
        // onInput handler. In the IE11/Edge sequence, the first change event is ignored, but with a file input that
        // is the only one you get and so the component's change event does not fire. The user has to make a second
        // file selection to get the event to fire.
        //
        // Fortunately, the event sequence for a file input is simple, so we can just force that order here:
        super.internalOnInput(event);
        super.internalOnChange(event);
    }

    internalOnInput() {
        // ignore -- see internalOnChange above
    }

    static get configurable() {
        return {
            /**
             * Set to true to allow picking multiple files. Note that when set to a truthy value,
             * the field is set to accept multiple files, but the value returned will be
             * an empty string since this is what is rendered into the HTML.
             * @config {Boolean}
             * @default
             */
            multiple : null,

            /**
             * Comma-separated list of file extensions or MIME type to to accept. E.g.
             * ".jpg,.png,.doc" or "image/*". Null by default, allowing all files.
             * @config {String}
             */
            accept : null,

            inputType : 'file',

            attributes : ['multiple', 'accept']
        };
    }

    /**
     * Returns list of selected files
     * @property {FileList}
     * @readonly
     */
    get files() {
        return this.input.files;
    }

    /**
     * Opens browser file picker
     * @internal
     */
    pickFile() {
        this.input.click();
    }

    get multiple() {
        return this._multiple ? '' : null;
    }

    /**
     * Clears field value
     */
    clear() {
        this.input.value = null;
    }

    triggerChange(event) {
        this.triggerFieldChange({
            event,
            value      : this.input.value,
            oldValue   : this._lastValue,
            userAction : true,
            valid      : true
        });
    }
}

// Register this widget type with its Factory
FileField.initClass();
