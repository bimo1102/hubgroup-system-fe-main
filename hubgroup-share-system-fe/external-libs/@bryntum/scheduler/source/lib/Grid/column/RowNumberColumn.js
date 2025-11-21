import Column from './Column.js';
import ColumnStore from '../data/ColumnStore.js';
import DomHelper from '../../Core/helper/DomHelper.js';

/**
 * @module Grid/column/RowNumberColumn
 */

/**
 * A column that displays the row number in each cell.
 *
 * There is no `editor`, since value is read-only.
 *
 * ```javascript
 * const grid = new Grid({
 *   appendTo : targetElement,
 *   width    : 300,
 *   columns  : [
 *     { type : 'rownumber' }
 *   ]
 * });
 *
 * @extends Grid/column/Column
 *
 * @classType rownumber
 * @inlineexample Grid/column/RowNumberColumn.js
 */
export default class RowNumberColumn extends Column {
    static get defaults() {
        return {
            /**
             * @config {Boolean} groupable
             * @hide
             */
            groupable : false,

            /**
             * @config {Boolean} sortable
             * @hide
             */
            sortable : false,

            /**
             * @config {Boolean} filterable
             * @hide
             */
            filterable : false,

            /**
             * @config {Boolean} searchable
             * @hide
             */
            searchable : false,

            /**
             * @config {Boolean} resizable
             * @hide
             */
            resizable : false,

            minWidth : 50,
            width    : 50,
            align    : 'right',
            text     : '#',
            editor   : false
        };
    }

    construct(config) {
        super.construct(...arguments);

        const
            me       = this,
            { grid } = me;

        me.internalCellCls = 'b-row-number-cell';

        if (grid) {
            // Update our width when the store mutates (tests test Columns in isolation with no grid, so we must handle that!)
            grid.on({
                bindStore : 'bindStore',
                thisObj   : me
            });

            me.bindStore({ store : grid.store, initial : true });

            if (grid.store.count && !grid.rendered) {
                grid.on({
                    paint   : 'resizeToFitContent',
                    thisObj : me,
                    once    : true
                });
            }
        }
    }

    static get type() {
        return 'rownumber';
    }

    get groupHeaderReserved() {
        return true;
    }

    bindStore({ store, initial }) {
        const me = this;

        me.detachListeners('grid');

        store.on({
            name                                  : 'grid',
            [`change${me.grid.asyncEventSuffix}`] : 'onStoreChange',
            thisObj                               : me
        });

        if (!initial) {
            me.resizeToFitContent();
        }
    }

    onStoreChange({ action }) {
        if (action === 'dataset' || action === 'add' || action === 'remove' || action === 'removeall') {
            this.resizeToFitContent();
        }
    }

    /**
     * Renderer that displays the row number in the cell.
     * @private
     */
    renderer({ record, grid }) {
        return record.isSpecialRow ? '' : grid.store.indexOf(record, true) + 1;
    }

    /**
     * Resizes the column to match the widest string in it. Called when you double click the edge between column
     * headers
     */
    resizeToFitContent() {
        const
            { grid }  = this,
            { store } = grid,
            { count } = store;

        if (count && !this.hidden) {
            const cellElement = grid.element.querySelector(`.b-grid-cell[data-column-id="${this.id}"]`);

            // cellElement might not exist, e.g. when trial is expired
            if (cellElement) {
                const
                    cellPadding = parseInt(DomHelper.getStyleValue(cellElement, 'padding-left')),
                    maxWidth    = DomHelper.measureText(count, cellElement);

                this.width = Math.max(this.minWidth, maxWidth + 2 * cellPadding);
            }
        }
    }

    set flex(f) {
        //<debug>
        if (f != null) {
            throw new Error('RowNumberer column may not be flexed');
        }
        //</debug>
    }
}

ColumnStore.registerColumnType(RowNumberColumn, true);
