import TextField from './TextField.js';
import StringHelper from '../helper/StringHelper.js';

/**
 * @module Core/widget/DisplayField
 */

/**
 * A widget used to show a read only value. Can also use a {@link #config-template template string} to show custom
 * markup inside a Container.
 *
 * @extends Core/widget/Field
 *
 * @example
 * let displayField = new DisplayField({
 *   appendTo : document.body,
 *   label: 'name',
 *   value : 'John Doe',
 *   // or use a template
 *   // template : name => `${name} is the name`
 * });
 *
 * @classType displayField
 * @inlineexample Core/widget/DisplayField.js
 */
export default class DisplayField extends TextField {
    static get $name() {
        return 'DisplayField';
    }

    // Factoryable type name
    static get type() {
        return 'displayfield';
    }

    // Factoryable type alias
    static get alias() {
        return 'display';
    }

    static get configurable() {
        return {
            readOnly : true,
            editable : false,
            cls      : 'b-display-field',

            /**
             * A template string used to render the value of this field. Please note you are responsible for encoding
             * any strings protecting against XSS.
             *
             * ```javascript
             * new DisplayField({
             *     appendTo : document.body,
             *     name     : 'age',
             *     label    : 'Age',
             *     template : data => `${data.value} years old`
             * })
             * ```
             * @config {Function}
             */
            template : null
        };
    }

    get focusElement() {
        // we're not focusable.
    }

    changeReadOnly() {
        return true;
    }

    changeEditable() {
        return false;
    }

    get inputElement() {
        return {
            tag  : 'span',
            html : this.template ? this.template(this.value) : StringHelper.encodeHtml(this.value)
        };
    }
}

// Register this widget type with its Factory
DisplayField.initClass();
