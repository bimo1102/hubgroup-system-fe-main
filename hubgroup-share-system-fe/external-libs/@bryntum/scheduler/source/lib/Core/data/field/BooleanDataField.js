import DataField from './DataField.js';

/**
 * @module Core/data/field/BooleanDataField
 */

/**
 * This field class handles field of type `Boolean`.
 *
 * ```javascript
 * class Person extends Model {
 *     static get fields() {
 *         return [
 *             'name',
 *             { name : 'active', type : 'boolean' }
 *         ];
 *     }
 * }
 * ```
 *
 * When a field is declared as a `'boolean'`, non-null values are promoted to `Boolean` type. This is seldom required,
 * but can be useful if a field value is received as a number but should be treated as a boolean.
 *
 * @extends Core/data/field/DataField
 * @classtype boolean
 */
export default class BooleanDataField extends DataField {
    static get $name() {
        return 'BooleanDataField';
    }

    static get type() {
        return 'boolean';
    }

    static get alias() {
        return 'bool';
    }

    static get prototypeProperties() {
        return {
            /**
             * The value to replace `null` when the field is not `nullable`.
             * @config {Boolean}
             * @default
             */
            nullValue : false
        };
    }

    convert(value) {
        return (value == null) ? (this.nullable ? value : this.nullValue) : Boolean(value);
    }
}

BooleanDataField.initClass();
