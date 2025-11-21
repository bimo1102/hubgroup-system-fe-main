import Column from './Column.js';
import ColumnStore from '../data/ColumnStore.js';

/**
 * @module Grid/column/PercentColumn
 */

/**
 * A column that display a basic progress bar.
 *
 * Default editor is a {@link Core.widget.NumberField NumberField}.
 *
 * @extends Grid/column/Column
 *
 * @example
 * new Grid({
 *     appendTo : document.body,
 *
 *     columns : [
 *         { type: 'percent', text: 'Progress', data: 'progress' }
 *     ]
 * });
 *
 * @classType percent
 * @inlineexample Grid/column/PercentColumn.js
 */
export default class PercentColumn extends Column {
    static get type() {
        return 'percent';
    }

    // Type to use when auto adding field
    static get fieldType() {
        return 'number';
    }

    static get fields() {
        return ['showValue', 'lowThreshold'];
    }

    static get defaults() {
        return {
            /**
             * PercentColumn uses a {@link Core.widget.NumberField} configured with an allowed interval 0 - 100 as
             * its default editor.
             * @config {Object|String}
             * @default Core.widget.NumberField
             * @category Misc
             */
            editor : {
                type : 'number',
                min  : 0,
                max  : 100
            },

            /**
             * Set to `true` to render the number value inside the bar, for example "15%"
             * @config {Boolean}
             * @default
             * @category Rendering
             */
            showValue : false,

            /**
             * When below this percentage the bar will have `b-low` CSS class added. By default it turns the bar red.
             * @config {Number}
             * @default
             * @category Rendering
             */
            lowThreshold : 20,

            filterType      : 'number',
            htmlEncode      : false,
            searchable      : false,
            summaryRenderer : sum => `${sum}%`,
            fitMode         : false
        };
    }

    constructor(config, store) {
        super(...arguments);

        this.internalCellCls = 'b-percent-bar-cell';
    }

    /**
     * Renderer that displays a progress bar in the cell.
     * @private
     */
    defaultRenderer({ value }) {
        value = value || 0;

        return {
            className : 'b-percent-bar-outer',
            children  : [
                {
                    tag       : 'div',
                    className : {
                        'b-percent-bar' : 1,
                        'b-zero'        : value === 0,
                        'b-low'         : value < this.lowThreshold
                    },
                    style : {
                        width : value + '%'
                    },
                    children : [
                        this.showValue ? {
                            tag  : 'span',
                            text : value + '%'
                        } : undefined
                    ]
                }
            ]
        };
    }

    // Null implementation because the column width drives the width of its content.
    // So the concept of sizing to content is invalid here.
    resizeToFitContent() {}
}

PercentColumn.sum = 'average';

ColumnStore.registerColumnType(PercentColumn, true);
