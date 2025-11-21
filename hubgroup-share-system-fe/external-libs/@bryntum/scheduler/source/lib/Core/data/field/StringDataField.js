import DataField from './DataField.js';

/**
 * @module Core/data/field/StringDataField
 */

/**
 * This field class handles field of type `String`.
 *
 * ```javascript
 * class Person extends Model {
 *     static get fields() {
 *         return [
 *             { name : 'name', type : 'string' }
 *         ];
 *     }
 * }
 * ```
 *
 * When a field is declared as a `'string'`, non-null values are promoted to `String` type. This is seldom required, but
 * can be useful if a field value is received as a number but should be treated as a string.
 *
 * @extends Core/data/field/DataField
 * @classtype string
 */
export default class StringDataField extends DataField {
    static get $name() {
        return 'StringDataField';
    }

    static get type() {
        return 'string';
    }

    static get prototypeProperties() {
        return {
            /**
             * The value to replace `null` when the field is not `nullable`.
             * @config {String}
             * @default
             */
            nullValue : ''
        };
    }

    convert(value) {
        return (value == null) ? (this.nullable ? value : this.nullValue) : String(value);
    }
}

StringDataField.initClass();
