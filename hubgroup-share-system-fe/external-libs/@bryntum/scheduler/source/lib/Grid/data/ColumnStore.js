import Store from '../../Core/data/Store.js';
import Column from '../column/Column.js';
import Localizable from '../../Core/localization/Localizable.js';
import StringHelper from '../../Core/helper/StringHelper.js';
import Objects from '../../Core/helper/util/Objects.js';

/**
 * @module Grid/data/ColumnStore
 */

const columnDefinitions = {
    boolean : {
        type : 'check'
    },
    date : {
        type : 'date'
    },
    integer : {
        type   : 'number',
        format : {
            maximumFractionDigits : 0
        }
    },
    number : {
        type : 'number'
    }
};

/**
 * A store specialized in handling columns. Used by the Grid to hold its columns and used as a chained store by each SubGrid
 * to hold theirs. Should not be instanced directly, instead access it through `grid.columns` or `subGrid.columns`
 *
 * ```
 * // resize first column
 * grid.columns.first.width = 200;
 *
 * // remove city column
 * grid.columns.get('city').remove();
 *
 * // add new column
 * grid.columns.add({text : 'New column'});
 *
 * // add new column to specific region (SubGrid)
 * grid.columns.add({text : 'New column', region : 'locked'});
 *
 * // add new column to 'locked' region (SubGrid)
 * grid.columns.add({text : 'New column', locked : true});
 * ```
 *
 * @extends Core/data/Store
 */
export default class ColumnStore extends Localizable(Store) {

    //region Events

    /**
     * Fires when a column is shown.
     * @event columnShow
     * @param {Grid.data.ColumnStore} source The store which triggered the event.
     * @param {Grid.column.Column} column The column which status has been changed.
     */

    /**
     * Fires when a column has been hidden.
     * @event columnHide
     * @param {Grid.data.ColumnStore} source The store which triggered the event.
     * @param {Grid.column.Column} column The column which status has been changed.
     */

    //endregion

    static get defaultConfig() {
        return {
            modelClass : Column,
            tree       : true,

            /**
             * Automatically adds a field definition to the store used by the Grid when adding a new Column displaying a
             * non-existing field.
             *
             * To enable this behaviour:
             *
             * ```javascript
             * const grid = new Grid({
             *     columns : {
             *         autoAddField : true,
             *         data         : [
             *             // Column definitions here
             *         ]
             *     }
             * }
             *
             * @config {Boolean}
             * @default
             */
            autoAddField : false
        };
    }

    construct(config) {
        const me = this;

        // Consequences of ColumnStore construction can cause reading of grid.columns
        // so set the property early.
        if (config.grid) {
            config.grid._columnStore = me;
            me.id = `${config.grid.id}-columns`;

            // Visible columns must be invalidated on expand/collapse
            config.grid.on({
                subGridCollapse : 'clearSubGridCaches',
                subGridExpand   : 'clearSubGridCaches',
                thisObj         : me
            });
        }

        super.construct(config);

        // So that we can invalidate cached collections which take computing so that we compute them
        // only when necessary. For example when asking for the visible leaf columns, we do not want
        // to compute that each time.
        me.on({
            change  : me.onStoreChange,
            thisObj : me,
            prio    : 1
        });
    }

    get modelClass() {
        return this._modelClass;
    }

    set modelClass(ClassDef) {
        this._modelClass = ClassDef;
    }

    doDestroy() {
        const allColumns = [];

        if (!this.isChained) {
            this.traverse(column => allColumns.push(column));
        }

        super.doDestroy();

        // Store's destroy unjoins all records. Destroy all columns *after* that.
        if (!this.isChained) {
            allColumns.forEach(column => column.destroy());
        }
    }

    // Overridden because the flat collection only contains top level columns,
    // not leaves - group columns are *not* expanded.
    getById(id) {
        return super.getById(id) || this.idRegister[id];
    }

    forEach(fn, thisObj = this) {
        // Override to omit root
        this.traverseWhile((n, i) => fn.call(thisObj, n, i), true);
    }

    get totalFixedWidth() {
        let result = 0;

        for (const col of this) {
            if (!col.hidden) {
                // if column has children (grouped header) use they to width increment
                if (col.children) {
                    col.children.forEach(childCol => result += this.calculateFixedWidth(childCol));
                }
                else {
                    result += this.calculateFixedWidth(col);
                }
            }
        }

        return result;
    }

    calculateFixedWidth(column) {
        if (column.flex) {
            return column.measureSize(Column.defaultWidth);
        }
        else {
            return Math.max(column.measureSize(column.width), column.measureSize(column.minWidth));
        }
    }

    /**
     * Returns the top level columns. If using grouped columns, this is the top level columns. If no grouped
     * columns are being used, this is the leaf columns.
     * @property {Grid.column.Column[]}
     * @readonly
     */
    get topColumns() {
        return this.isChained ? this.masterStore.rootNode.children.filter(this.chainedFilterFn) : this.rootNode.children;
    }

    /**
     * Returns the visible leaf headers which drive the rows' cell content.
     * @property {Grid.column.Column[]}
     * @readonly
     */
    get visibleColumns() {
        const me = this;

        if (!me._visibleColumns) {
            me._visibleColumns = me.leaves.filter(column => !column.hidden && (!column.subGrid || !column.subGrid.collapsed));
        }

        return me._visibleColumns;
    }

    onStoreChange({ action, changes }) {
        // no need to clear cache while resizing, or if column changes name
        if (action === 'update' && !('hidden' in changes)) {
            return;
        }
        this.clearCaches();
    }

    clearSubGridCaches(subGrid) {
        subGrid.columns.clearCaches();
        this.clearCaches();
    }

    clearCaches() {
        this._visibleColumns = null;
        this.masterStore?.clearCaches();
    }

    onMasterDataChanged(event) {
        super.onMasterDataChanged(event);

        // If master store has changes we also need to clear cached columns, in case a column was hidden
        // no need to clear cache while resizing, or if column changes name
        if (event.action !== 'update' || ('hidden' in event.changes)) {
            this.clearCaches();
        }
    }

    getAdjacentVisibleLeafColumn(columnOrId, next = true, wrap = false) {
        const
            columns = this.visibleColumns,
            column  = (columnOrId instanceof Column) ? columnOrId : this.getById(columnOrId);
        let idx = columns.indexOf(column) + (next ? 1 : -1);

        // If we walked off either end, wrap if directed to do so,
        // otherwise, return null;
        if (!columns[idx]) {
            if (wrap) {
                idx = next ? 0 : columns.length - 1;
            }
            else {
                return null;
            }
        }

        return columns[idx];
    }

    /**
     * Bottom columns are the ones displayed in the bottom row of a grouped header, or all columns if not using a grouped
     * header. They are the columns that actually display any data.
     * @property {Grid.column.Column[]}
     * @readonly
     */
    get bottomColumns() {
        return this.leaves;
    }

    /**
     * Get column by field. To be sure that you are getting exactly the intended column, use {@link Core.data.Store#function-getById Store#getById()} with the
     * columns id instead.
     * @param {String} field Field name
     * @returns {Grid.column.Column}
     */
    get(field) {
        return this.findRecord('field', field, true);
    }

    /**
     * Used internally to create a new record in the store. Creates a column of the correct type by looking up the
     * specified type among registered columns.
     * @private
     */
    createRecord(data) {
        const
            { grid = {} } = this, // Some ColumnStore tests lacks Grid
            { store }     = grid,
            dataField     = store?.modelClass?.fieldMap?.[data.field];

        let columnClass = this.modelClass;

        // Use the DataField's column definition as a default into which the incoming data is merged
        if (dataField?.column) {
            data = Objects.merge({}, dataField.column, data);
        }

        if (data.type) {
            columnClass = ColumnStore.getColumnClass(data.type);
            if (!columnClass) {
                throw new Error(`Column type '${data.type}' not registered`);
            }
        }

        if (data.locked) {
            data.region = 'locked';
            delete data.locked;
        }

        const column = new columnClass(data, this);

        // Doing this after construction, in case the columnClass has a default value for region (Schedulers
        // TimeAxisColumn has)
        if (!column.data.region) {
            column.data.region = grid.defaultRegion || 'normal';
        }

        // Add missing fields to Grids stores model
        if (this.autoAddField && !column.noFieldSpecified && store && !dataField) {
            let fieldDefinition = column.field;

            // Some columns define the type to use for new fields (date, number etc)
            if (column.constructor.fieldType) {
                fieldDefinition = {
                    name : column.field,
                    type : column.constructor.fieldType
                };
            }

            store.modelClass.addField(fieldDefinition);
        }

        return column;
    }

    /**
     * indexOf extended to also accept a columns field, for backward compatibility.
     * ```
     * grid.columns.indexOf('name');
     * ```
     * @param {Core.data.Model|String} recordOrId
     * @returns {Number}
     */
    indexOf(recordOrId) {
        // TODO: build the need for field away
        const index = super.indexOf(recordOrId);
        if (index > -1) return index;
        // no record found by id, find by field since old code relies on that instead of id
        // TODO: replace such cases with columns id
        return this.records.findIndex(r => r.field === recordOrId);
    }

    /**
     * Checks if any column uses autoHeight
     * @internal
     * @property {Boolean}
     * @readonly
     */
    get usesAutoHeight() {
        return this.find(column => column.autoHeight);
    }

    /**
     * Checks if any flex column uses autoHeight
     * @internal
     * @property {Boolean}
     * @readonly
     */
    get usesFlexAutoHeight() {
        return this.find(column => column.autoHeight && column.flex != null);
    }

    //region Column types

    /**
     * Call from custom column to register it with ColumnStore. Required to be able to specify type in column config.
     * @param {Function} columnClass The {@link Grid.column.Column} subclass to register.
     * @param {Boolean} simpleRenderer Pass `true` if its default renderer does *not* use other fields from the passed
     * record than its configured {@link Grid.column.Column#config-field}. This enables more granular cell updating
     * upon record mutation.
     * @example
     * // create and register custom column
     * class CustomColumn {
     *  static get type() {
     *      return 'custom';
     *  }
     * }
     * ColumnStore.registerColumnType(CustomColumn, true);
     * // now possible to specify in column config
     * let grid = new Grid({
     *   columns: [
     *     { type: 'custom', field: 'id' }
     *   ]
     * });
     */
    static registerColumnType(columnClass, simpleRenderer = false) {
        if (!ColumnStore.columnTypes) ColumnStore.columnTypes = {};
        columnClass.simpleRenderer = simpleRenderer;
        ColumnStore.columnTypes[columnClass.type] = columnClass;
    }

    /**
     * Returns registered column class for specified type.
     * @param type Type name
     * @returns {Grid.column.Column}
     * @internal
     */
    static getColumnClass(type) {
        return ColumnStore.columnTypes && ColumnStore.columnTypes[type];
    }

    /**
     * Generates a <strong>new </strong> {@link Grid.column.Column} instance which may be subsequently added to this
     * store to represent the passed {@link Core.data.field.DataField} of the owning Grid's store.
     * @param {Core.data.field.DataField|String} dataField The {@link Core.data.field.DataField field}
     * instance or field name to generate a new {@link Grid.column.Column} for.
     * @param {Object} [defaults] Defaults to apply to the new column.
     * @returns {Grid.column.Column} A new Column which will render and edit the field correctly.
     * @example
     * // Add column for the "team" field.
     * grid.columns.add(grid.columns.generateColumnForField('team', {
     *     width : 200
     * }));
     * @internal
     */
    generateColumnForField(dataField, defaults) {
        if (typeof dataField === 'string' && this.grid) {
            dataField = this.grid.store?.modelClass.fieldMap[dataField];
        }
        let column = dataField.column || columnDefinitions[dataField.type] || {};

        // Upgrade string to be the column tyope
        if (typeof column === 'string') {
            column = { type : column };
        }

        // Configure over defaults
        column = Object.assign({
            text  : dataField.text || StringHelper.separate(dataField.name),
            field : dataField.name
        }, defaults, column);

        // Special formatting for columns which represent number and integer fields.
        if (dataField.precision != null) {
            column.format.maximumFractionDigits = dataField.precision;
        }
        if (dataField.columnType) {
            column.type = dataField.columnType;
        }

        // Upgrade object to a Column instance.
        return this.createRecord(column);
    }

    //endregion
}

/**
 * Custom {@link Grid.data.ColumnStore} event which triggers when a column is resized, i.e. its width has been changed
 *
 * @param {Function} handler
 * @param {Object} [thisObj]
 */
export const columnResizeEvent = (handler, thisObj) => ({
    update : ({ store, record, changes }) => {
        let result = true;

        if ('width' in changes || 'minWidth' in changes || 'flex' in changes) {
            result = handler.call(thisObj, { store, record, changes });
        }

        return result;
    }
});
// Can't have this in Column due to circular dependencies
ColumnStore.registerColumnType(Column, true);
