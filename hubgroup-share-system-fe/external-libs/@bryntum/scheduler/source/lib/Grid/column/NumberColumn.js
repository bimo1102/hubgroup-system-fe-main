import Column from './Column.js';
import ColumnStore from '../data/ColumnStore.js';
import NumberFormat from '../../Core/helper/util/NumberFormat.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';

/**
 * @module Grid/column/NumberColumn
 */

/**
 * A column for showing/editing numbers.
 *
 * Default editor is a {@link Core.widget.NumberField NumberField}.
 *
 * @extends Grid/column/Column
 * @example
 * new Grid({
 *     appendTo : document.body,
 *
 *     columns : [
 *         { type: 'number', min: 0, max : 100, field: 'score' }
 *     ]
 * });
 *
 * @classType number
 * @inlineexample Grid/column/NumberColumn.js
 */
export default class NumberColumn extends Column {
    //region Config

    static get type() {
        return 'number';
    }

    // Type to use when auto adding field
    static get fieldType() {
        return 'number';
    }

    static get fields() {
        return [
            'format',

            /**
             * The minimum value for the field used during editing.
             * @config {Number} min
             * @category Common
             */
            'min',

            /**
             * The maximum value for the field used during editing.
             * @config {Number} max
             * @category Common
             */
            'max',

            /**
             * Step size for the field used during editing.
             * @config {Number} step
             * @category Common
             */
            'step',

            /**
             * Large step size for the field used during editing. In effect for `SHIFT + click/arrows`
             * @config {Number} largeStep
             * @category Common
             */
            'largeStep',

            /**
             * Unit to append to displayed value.
             * @config {String} unit
             * @category Common
             */
            'unit'
        ];
    }

    static get defaults() {
        return {
            filterType : 'number',

            /**
             * The format to use for rendering numbers.
             *
             * By default, the locale's default number formatter is used. For `en-US`, the
             * locale default is a maximum of 3 decimal digits, using thousands-based grouping.
             * This would render the number `1234567.98765` as `'1,234,567.988'`.
             *
             * @config {String|Object|Core.helper.util.NumberFormat}
             */
            format : ''
        };
    }

    constructor(config, store) {
        super(...arguments);

        this.internalCellCls = 'b-number-cell';
    }

    //endregion

    //region Init

    get defaultEditor() {
        const { format, name, max, min, step, largeStep, align } = this;

        // Remove any undefined configs, to allow config system to use default values instead
        return ObjectHelper.cleanupProperties({
            type      : 'numberfield',
            format,
            name,
            max,
            min,
            step,
            largeStep,
            textAlign : align
        });
    }

    get formatter() {
        const
            me         = this,
            { format } = me;

        let formatter = me._formatter;

        if (!formatter || me._lastFormat !== format) {
            me._formatter = formatter = NumberFormat.get(me._lastFormat = format);
        }

        return formatter;
    }

    /**
     * Renderer that displays value + optional unit in the cell
     * @private
     */
    defaultRenderer({ value }) {
        if (value != null) {
            value = this.formatter.format(value);

            if (this.unit) {
                value = `${value}${this.unit}`;
            }
        }
        return value;
    }
}

ColumnStore.registerColumnType(NumberColumn, true);
NumberColumn.exposeProperties();
