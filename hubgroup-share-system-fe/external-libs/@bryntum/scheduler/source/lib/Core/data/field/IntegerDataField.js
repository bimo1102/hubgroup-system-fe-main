import DataField from './DataField.js';

/**
 * @module Core/data/field/IntegerDataField
 */

/**
 * This field class handles field of type `Number` with no decimal digits.
 *
 * ```javascript
 * class Person extends Model {
 *     static get fields() {
 *         return [
 *             'name',
 *             { name : 'age', type : 'int' }
 *         ];
 *     }
 * }
 * ```
 *
 * When a field is declared as a `'int'`, non-null values are promoted to `Number` type and decimals are removed using
 * a specified `rounding`. This field type can be useful if a field value is received as a string but should be stored
 * as a number or has a fractional component that must be rounded or truncated.
 *
 * @extends Core/data/field/DataField
 * @classtype integer
 */
export default class IntegerDataField extends DataField {
    static get $name() {
        return 'IntegerDataField';
    }

    static get type() {
        return 'integer';
    }

    static get alias() {
        return 'int';
    }

    static get prototypeProperties() {
        return {
            /**
             * The value to replace `null` when the field is not `nullable`.
             * @config {Number}
             * @default
             */
            nullValue : 0,

            /**
             * The `Math` method to use to ensure fractional component is removed.
             * This can be `'round'` (the default value), `'floor'` or `'ceil'`.
             * @config {String}
             * @default
             */
            rounding : 'round'
        };
    }

    convert(value) {
        return (value == null) ? (this.nullable ? value : this.nullValue) : Math[this.rounding](Number(value));
    }
}

IntegerDataField.initClass();
