import Base from '../../../Core/Base.js';
import Collection from '../../../Core/util/Collection.js';
import ColumnStore from '../../data/ColumnStore.js';

const
    validIdTypes   = {
        string : 1,
        number : 1
    },
    isDataLoadAction = {
        dataset : 1,
        batch   : 1
    };

/**
 * @module Grid/view/mixin/GridSelection
 */

/**
 * A mixin for Grid that handles row and cell selection. See {@link #config-selectionMode} for details on how to control what should be selected (rows or cells)
 *
 * @example
 * // select a row
 * grid.selectedRow = 7;
 *
 * // select a cell
 * grid.selectedCell = { id: 5, columnId: 'column1' }
 *
 * // select a record
 * grid.selectedRecord = grid.store.last;
 *
 * // select multiple records by ids
 * grid.selectedRecords = [1, 2, 4, 6]
 *
 * @mixin
 */
export default Target => class GridSelection extends (Target || Base) {
    static get $name() {
        return 'GridSelection';
    }

    static get defaultConfig() {
        return {
            /**
             * The selection settings, where you can set these boolean flags to control what is selected. Options below:
             * @config {Object} selectionMode
             * @param {Boolean} selectionMode.row select rows
             * @param {Boolean} selectionMode.cell select cells
             * @param {Boolean} selectionMode.rowCheckboxSelection select rows only when clicking in the checkbox column
             * @param {Boolean} selectionMode.multiSelect Allow multiple selection
             * @param {Boolean} selectionMode.checkbox true to add a checkbox selection column to the grid
             * @param {Boolean} selectionMode.showCheckAll  true to add a checkbox to the selection column header to select/deselect all rows
             * @param {Boolean} selectionMode.deselectFilteredOutRecords true to deselect rows that are filtered out
             * @param {Boolean} selectionMode.includeChildren true to also select/deselect child nodes when a parent node is selected
             * @param {Boolean} selectionMode.preserveSelectionOnPageChange This flag controls whether the Grid should preserve
             * its selection when loading a new page of a paged data store
             * @param {Boolean} selectionMode.preserveSelectionOnDatasetChange This flag controls whether the Grid should preserve
             * its selection of cells / rows when loading a new dataset (assuming the selected records are included in
             * the newly loaded dataset)
             * @default
             * @category Selection
             */
            selectionMode : {
                row                              : true,
                cell                             : true,
                rowCheckboxSelection             : false,
                multiSelect                      : true,
                checkbox                         : false,
                showCheckAll                     : false,
                deselectFilteredOutRecords       : false,
                includeChildren                  : false,
                preserveSelectionOnPageChange    : false,
                preserveSelectionOnDatasetChange : true
            },

            selectedRecordCollection : {}
        };
    }

    //region Init

    afterConfigure() {
        const me = this;

        // Inject our CheckColumn into the ColumnStore
        if (me.selectionMode.checkbox) {
            const checkColumnClass = ColumnStore.getColumnClass('check');

            if (!checkColumnClass) {
                throw new Error('CheckColumn must be imported for checkbox selection mode to work');
            }

            const col = me.checkboxSelectionColumn = new checkColumnClass({
                id           : `${me.id}-selection-column`,
                width        : '4em',
                minWidth     : '4em', // Misaligned on IE11 without, since 4em is below columns default minWidth
                field        : null,
                cellCls      : 'b-checkbox-selection',
                // Always put the checkcolumn in the first region
                region       : me.items[0].region,
                showCheckAll : me.selectionMode.showCheckAll
            }, me.columns);

            col.isSelectionColumn = true;

            col.meta.depth = 0;
            // This is assigned in Column.js for normal columns
            col._grid      = me;

            // Override renderer to inject the rendered record's selected status into the value
            const checkboxRenderer = col.renderer;
            col.renderer           = renderData => {
                renderData.value = me.isSelected(renderData.record);
                checkboxRenderer.call(col, renderData);
            };

            col.on({
                toggle    : 'onCheckChange',
                toggleAll : 'onCheckAllChange',
                thisObj   : me
            });

            // Insert the checkbox after any rownumber column. If not there, -1 means in at 0.
            const insertIndex = me.columns.indexOf(me.columns.findRecord('type', 'rownumber')) + 1;

            me.columns.insert(insertIndex, col);
        }

        super.afterConfigure();
    }

    bindStore(store) {
        this.detachListeners('selectionStoreFilter');

        store.on({
            name    : 'selectionStoreFilter',
            filter  : 'onStoreFilter',
            thisObj : this
        });
        super.bindStore?.(store);
    }

    unbindStore(oldStore) {
        this.detachListeners('selectionStoreFilter');

        super.unbindStore(oldStore);
    }
    //endregion

    //region Events
    onStoreFilter({ records }) {
        if (this.selectionMode.deselectFilteredOutRecords) {
            const
                { filtersFunction } = this.store,
                filteredOutRecords  = this.selectedRecordCollection.values.filter(rec => !filtersFunction(rec));

            this.selectedRecordCollection.remove(filteredOutRecords);
        }
    }

    /**
     * Triggered from Grid view when the id of a record has changed.
     * Update the collection indices.
     * @private
     * @category Selection
     */
    onStoreRecordIdChange({ record, oldValue }) {
        // If the next mixin up the inheritance chain has an implementation, call it
        super.onStoreRecordIdChange && super.onStoreRecordIdChange(...arguments);

        const item = this.selectedRecordCollection.get(oldValue);

        // having the record registered by the oldValue means we need to rebuild indices
        if (item === record) {
            this.selectedRecordCollection.rebuildIndices();
        }
    }

    /**
     * The selection has been changed.
     * @event selectionChange
     * @param {String} action `'select'`/`'deselect'`
     * @param {String} mode `'row'`/`'cell'`
     * @param {Grid.view.Grid} source
     * @param {Core.data.Model[]|Object} deselected The records or cells (depending on the `mode`) deselected in this operation.
     * @param {Core.data.Model[]|Object} selected The records or cells (depending on the `mode`) selected in this operation.
     * @param {Core.data.Model[]|Object} selection  The records or cells (depending on the `mode`) in the new selection.
     */

    /**
     * Responds to mutations of the underlying storage Collection
     * @param {Object} event
     * @private
     */
    onSelectedRecordCollectionChange({ source: selectedRecordCollection, action, added = [], removed }) {
        const me = this;

        if (me._selectedCell && !me.isSelectable(me._selectedCell)) {
            me.deselectCell(me._selectedCell);
        }

        // Filter out unselectable rows
        added = added.filter(row => me.isSelectable(row));

        me.triggerChangeEvent({
            mode       : 'row',
            action     : added.length ? 'select' : 'deselect',
            selection  : me.selectedRecords,
            selected   : added,
            deselected : removed
        }, me.silent);
    }

    onCheckChange({ source: column, checked, record }) {
        const
            me                       = this,
            { selectionMode, store } = me,
            children                 = selectionMode.includeChildren && selectionMode.multiSelect !== false && !record.isLeaf && record.allChildren,
            records                  = [record, ...(children || [])];

        if (checked) {
            me.selectRows(records, selectionMode.multiSelect !== false);

            if (column.headerCheckbox && me.selectedRecords.length === store.count - (store.groupRecords ? store.groupRecords.length : 0)) {
                column.suspendEvents();
                column.headerCheckbox.checked = true;
                column.resumeEvents();
            }
        }
        else {
            me.deselectRows(records);

            if (column.headerCheckbox) {
                column.suspendEvents();
                column.headerCheckbox.checked = false;
                column.resumeEvents();
            }
        }
    }

    onCheckAllChange({ checked }) {
        this[checked ? 'selectAll' : 'deselectAll'](this.store.isPaged && this.selectionMode.preserveSelectionOnPageChange);
    }

    //endregion

    //region Selection collection

    set selectedRecordCollection(selectedRecordCollection) {
        if (!(selectedRecordCollection instanceof Collection)) {
            selectedRecordCollection = new Collection(selectedRecordCollection);
        }
        this._selectedRecordCollection = selectedRecordCollection;

        // Fire row change events from onSelectedRecordCollectionChange
        selectedRecordCollection.on({
            change  : 'onSelectedRecordCollectionChange',
            thisObj : this
        });
    }

    get selectedRecordCollection() {
        return this._selectedRecordCollection;
    }

    /**
     * Removes and adds records to/from the selection at the same time. Analogous
     * to the `Array` `splice` method.
     *
     * Note that if items that are specified for removal are also in the `toAdd` array,
     * then those items are *not* removed then appended. They remain in the same position
     * relative to all remaining items.
     *
     * @param {Number} index Index at which to remove a block of items. Only valid if the
     * second, `toRemove` argument is a number.
     * @param {Object[]|Number} toRemove Either the number of items to remove starting
     * at the passed `index`, or an array of items to remove (If an array is passed, the `index` is ignored).
     * @param  {Object[]|Object} toAdd An item, or an array of items to add.
     */
    spliceSelectedRecords(index, toRemove, toAdd) {
        this._selectedRecordCollection.splice(index, toRemove, toAdd);
    }

    //endregion

    //region Cell & row

    /**
     * Checks whether or not a cell or row is selected.
     * @param {Object|String|Number|Core.data.Model} cellSelectorOrId Cell selector { id: x, column: xx } or row id, or record
     * @returns {Boolean} true if cell or row is selected, otherwise false
     * @category Selection
     */
    isSelected(cellSelectorOrId) {
        const me = this;

        // A record passed
        // HACK: replaces instanceof check with this because it makes GridSelection test in Edge more stable
        if (cellSelectorOrId?.isModel) {
            cellSelectorOrId = cellSelectorOrId.id;
        }

        if (validIdTypes[typeof cellSelectorOrId]) {
            return me.selectedRecordCollection.includes(cellSelectorOrId);
        }
        else {
            return me._selectedCell && me._selectedCell.id == cellSelectorOrId.id &&
                me._selectedCell.columnId === cellSelectorOrId.columnId;
        }
    }

    /**
     * Checks whether or not a cell or row can be selected.
     * @param {Core.data.Model|Object|String|Number} recordCellOrId Record or cell or record id
     * @returns {Boolean} true if cell or row can be selected, otherwise false
     * @category Selection
     */
    isSelectable(recordCellOrId) {
        // Selection disabled for undefined record, special row (group header / footer) and
        // record which was already removed from store

        if (!recordCellOrId) {
            return false;
        }
        const row = this.store.getById(recordCellOrId.id || recordCellOrId);
        return row && !(row.meta && row.isSpecialRow);
    }

    /**
     * Cell selector for selected cell, set to select a cell or use {@link #function-selectCell()}.
     * @property {Object}
     * @category Selection
     */
    get selectedCell() {
        return this._selectedCell;
    }

    set selectedCell(cellSelector) {
        this.selectCell(cellSelector);
    }

    set selectionMode(mode) {
        if (mode && mode.rowCheckboxSelection) {
            mode.row  = mode.checkbox = true;
            mode.cell = false;
        }

        this._selectionMode = mode;
    }

    get selectionMode() {
        return this._selectionMode;
    }

    /**
     * The last selected record. Set to select a row or use Grid#selectRow. Set to null to
     * deselect all
     * @property {Core.data.Model}
     * @category Selection
     */
    get selectedRecord() {
        return this.selectedRecordCollection.last || null;
    }

    set selectedRecord(record) {
        this.selectRow({ record });
    }

    /**
     * Selected records.
     * Can be set as array of ids.
     * ```
     * grid.selectedRecords = [1, 2, 4, 6]
     * ```
     *
     * @property {Core.data.Model[]|Number[]}
     * @category Selection
     */
    get selectedRecords() {
        return this.selectedRecordCollection.values;
    }

    set selectedRecords(selectedRecords) {
        this.selectRows(selectedRecords);
    }

    /**
     * CSS selector for the currently selected cell. Format is "[data-index=index] [data-column-id=column]".
     * @type {String}
     * @category Selection
     * @readonly
     */
    get selectedCellCSSSelector() {
        const
            me   = this,
            cell = me._selectedCell,
            row  = cell && me.getRowById(cell.id);

        if (!cell || !row) return '';

        return `[data-index=${row.dataIndex}] [data-column-id=${cell.columnId}]`;
    }

    /**
     * Selects a row (without selecting a cell).
     * @param {Object|Core.data.Model} options A record to select or an config object describing the selection
     * @param {Core.data.Model|String|Number} options.record Record or record id, specifying null will deselect all
     * @param {Grid.column.Column} options.column The column to scroll into view if `scrollIntoView` is not specified as `false`. Defaults to the grid's first column.
     * @param {Boolean} [options.scrollIntoView] Specify `false` to prevent row from being scrolled into view
     * @param {Boolean} [options.addToSelection] Specify `true` to add to selection, defaults to `false` which replaces
     * @fires selectionChange
     * @category Selection
     */
    selectRow({
        record,
        column = this.columns.visibleColumns[0],
        scrollIntoView = true,
        addToSelection = false
    }) {
        const me = this;

        if (arguments[0].isModel) {
            record = arguments[0];
        }
        else {
            record = me.store.getById(record);
        }

        if (record) {
            me.selectCell({ id : record.id, column }, scrollIntoView, addToSelection);
        }
        else {
            me.deselectAll();
        }
    }

    /**
     * Selects a cell and/or its row (depending on {@link #config-selectionMode})
     * @param {Object} cellSelector { id: rowId, columnId: 'columnId' }
     * @param {Boolean} scrollIntoView Specify `false` to prevent row from being scrolled into view
     * @param {Boolean} addToSelection Specify `true` to add to selection, defaults to `false` which replaces
     * @param {Boolean} silent Specify `true` to not trigger any events when selecting the cell
     * @returns {Object} Cell selector
     * @fires selectionChange
     * @category Selection
     */
    selectCell(cellSelector, scrollIntoView = false, addToSelection = false, silent = false) {
        const
            me                                          = this,
            { selectedRecordCollection, selectionMode } = me,
            selector                                    = me.normalizeCellContext(cellSelector),
            record                                      = selector.record || me.store.getById(selector.id);

        // Clear selection if row is not selectable
        if (!me.isSelectable(record)) {
            me.deselectAll();
            return;
        }

        if (scrollIntoView) {
            me.scrollRowIntoView(selector.id, {
                column : selector.columnId
            });
        }

        // Row selection (both sides if locked columns)
        if (selectionMode.row) {
            if (silent) {
                me.silent = (me.silent || 0) + 1;
            }
            if (addToSelection) {
                selectedRecordCollection.add(record);
            }
            // Clear all others
            else {
                selectedRecordCollection.splice(0, selectedRecordCollection.count, record);
            }
            if (silent) {
                me.silent--;
            }

            // When starting a selection, register the start cell
            if (me.selectedRecordCollection.count === 1) {
                me.startCell = selector;
                me.lastRange = null;
            }
        }

        // Cell selection
        if (selectionMode.cell && (selector.columnId || selector.column) && !me.isSelected(selector)) {
            const deselected = (me._selectedCell) ? [me._selectedCell] : [];

            //Remember
            me._selectedCell = selector;

            me.triggerChangeEvent({
                mode      : 'cell',
                action    : 'select',
                selected  : [selector],
                deselected,
                selection : [selector]
            }, silent);
        }

        return selector;
    }

    /**
     * Selects all rows. If store is filtered, this will merge the selection of all visible rows with any selection made prior to filtering
     * @category Selection
     */
    selectAll() {
        const me = this;

        if (me.store.isFiltered && !me.selectionMode.deselectFilteredOutRecords) {
            me.selectedRecordCollection.add(...me.store.records.filter(r => !r.isSpecialRow));
        }
        else {
            me.selectRows(me.store.allRecords.filter(r => !r.isSpecialRow), true);
        }
    }

    /**
     * Deselects all selected rows and cells. If store is filtered, this will unselect all visible rows only. Any
     * selections made prior to filtering remains.
     * @param {Boolean} [removeCurrentRecordsOnly] Pass `false` to clear all selected records, and `true` to only
     * clear selected records in the current set of records
     * @category Selection
     */
    deselectAll(removeCurrentRecordsOnly = false) {
        const me = this;

        if (removeCurrentRecordsOnly) {
            me.selectedRecordCollection.remove(...me.store.records);
        }
        else {
            me.selectedRecordCollection.clear();
        }

        if (me._selectedCell) {
            me.deselectCell(me._selectedCell);
        }
    }

    /**
     * Deselect a row
     * @param {Core.data.Model|String|Number} recordOrId Record or an id for a record
     * @category Selection
     */
    deselectRow(record) {
        this.deselectRows(record);
    }

    /**
     * Select one or more rows
     * @param {Core.data.Model|String|Number|Core.data.Model[]|String[]|Number[]} recordOrIds An array of records or ids for a record
     * @param {Boolean} [addToSelection] `false` clears existing selections first, `true` adds to existing selection
     * @category Selection
     */
    selectRows(recordsOrIds, addToSelection = false) {
        const
            { store } = this,
            toSelect  = [];

        recordsOrIds = Array.isArray(recordsOrIds) ? recordsOrIds : recordsOrIds == null ? [] : [recordsOrIds];

        for (let record of recordsOrIds) {
            record = store.getById(record);
            if (record) {
                toSelect.push(record);
            }
        }

        if (addToSelection) {
            this.selectedRecordCollection.add(toSelect);
        }
        else {
            this.selectedRecordCollection.splice(0, this.selectedRecordCollection.count, toSelect);
        }
    }

    /**
     * Deselect one or more rows
     * @param {Core.data.Model|String|Number|Core.data.Model[]|String[]|Number[]} recordOrIds An array of records or ids for a record
     * @category Selection
     */
    deselectRows(recordsOrIds) {
        recordsOrIds = Array.isArray(recordsOrIds) ? recordsOrIds : [recordsOrIds];

        const records = recordsOrIds.map(recordOrId => this.store.getById(recordOrId));

        this.selectedRecordCollection.remove(records);
    }

    /**
     * Deselect a cell/row, depending on settings in Grid#selectionMode
     * @param {Object} cellSelector
     * @returns {Object} Normalized cell selector
     * @category Selection
     */
    deselectCell(cellSelector) {
        const
            me           = this,
            selector     = me.normalizeCellContext(cellSelector),
            selMode      = me.selectionMode,
            record       = selector.record || me.store.getById(selector.id),
            selectedCell = me._selectedCell;

        // Row selection (both sides if locked columns)
        if (selMode.row) {
            me.selectedRecordCollection.remove(record);
        }

        // Cell selection
        if (selMode.cell && selector.columnId && selectedCell) {
            if (selectedCell.id === selector.id && selectedCell.columnId === selector.columnId) {
                me._selectedCell = null;

                me.triggerChangeEvent({
                    mode       : 'cell',
                    action     : 'deselect',
                    selected   : [],
                    deselected : [selector],
                    selection  : []
                });
            }
        }

        return selector;
    }

    //endregion

    //region Record

    /**
     * Selects rows corresponding to a range of records (from fromId to toId)
     * @param {String|Number} fromId
     * @param {String|Number} toId
     * @category Selection
     */
    selectRange(fromId, toId) {
        const
            { store, selectedRecordCollection } = this,
            fromIndex                           = store.indexOf(fromId),
            toIndex                             = store.indexOf(toId),
            startIndex                          = Math.min(fromIndex, toIndex),
            endIndex                            = Math.max(fromIndex, toIndex);

        if (startIndex === -1 || endIndex === -1) {
            throw new Error('Record not found in selectRange');
        }

        selectedRecordCollection.splice(0, selectedRecordCollection.count, store.getRange(startIndex, endIndex + 1, false));
    }

    /**
     * Triggered from Grid view when records get removed from the store.
     * Deselects all records which have been removed.
     * @private
     * @category Selection
     */
    onStoreRemove(event) {
        // If the next mixin up the inheritance chain has an implementation, call it
        super.onStoreRemove && super.onStoreRemove(event);

        if (!event.isCollapse) {
            this.selectedRecordCollection.remove(event.records);
        }
    }

    /**
     * Triggered from Grid view when the store changes. This might happen
     * if store events are batched and then resumed.
     * Deselects all records which have been removed.
     * @private
     * @category Selection
     */

    onStoreDataChange({ action, source : store }) {
        const
            me = this,
            { selectionMode, checkboxSelectionColumn, selectedRecordCollection } = me;

        // If the next mixin up the inheritance chain has an implementation, call it
        super.onStoreDataChange && super.onStoreDataChange(...arguments);

        if (action === 'pageLoad') {
            if (!selectionMode.preserveSelectionOnPageChange) {
                // For paged grid scenario, we need to update the check-all checkbox in the checkbox column header
                // as we move between store pages
                me.deselectAll();
            }
            checkboxSelectionColumn?.updateCheckAllState(!store.find(record => !selectedRecordCollection.includes(record)));
        }
        else if (isDataLoadAction[action]) {
            const
                toRemove        = [];

            if (selectionMode.preserveSelectionOnDatasetChange === false) {
                me.deselectAll();
            }
            else {
                // Update selected records collection
                selectedRecordCollection.forEach(record => {
                    const newRecord = store.getById(record.id);
                    // If record still exists after reload, update selectedRecordCollection with a reference to the new task version
                    if (newRecord) {
                        const index = selectedRecordCollection.indexOf(record);
                        selectedRecordCollection.splice(index, 1, newRecord);
                    }
                    else {
                        toRemove.push(record);
                    }
                });

                // Remove in one go to fire a single selectionChange event
                selectedRecordCollection.remove(toRemove);
            }
        }
    }

    /**
     * Triggered from Grid view when all records get removed from the store.
     * Deselects all records.
     * @private
     * @category Selection
     */
    onStoreRemoveAll() {
        // If the next mixin up the inheritance chain has an implementation, call it
        super.onStoreRemoveAll && super.onStoreRemoveAll();

        this.deselectAll();
    }

    //endregion

    //region Handle multiSelect

    /**
     * Handles multi selection using the mouse. Called from GridElementEvents on mousedown in a cell and
     * simultaneously pressing a modifier key.
     * @param cellData
     * @param event
     * @private
     * @category Selection
     */
    handleMouseMultiSelect(cellData, event) {
        const
            me = this,
            id = cellData.id;

        function mergeRange(fromId, toId) {
            const
                { store, selectedRecordCollection } = me,
                fromIndex                           = store.indexOf(fromId),
                toIndex                             = store.indexOf(toId),
                startIndex                          = Math.min(fromIndex, toIndex),
                endIndex                            = Math.max(fromIndex, toIndex);

            if (startIndex === -1 || endIndex === -1) {
                throw new Error('Record not found in selectRange');
            }

            const newRange = store.getRange(startIndex, endIndex + 1, false).filter(row => me.isSelectable(row));
            selectedRecordCollection.splice(0, me.lastRange || 0, newRange);
            me.lastRange = newRange;
        }

        if ((event.metaKey || event.ctrlKey) && me.isSelected(id)) {
            // ctrl/cmd deselects row if selected
            me.deselectRow(id);
        }
        else if (me.selectionMode.multiSelect) {
            if (event.shiftKey && me.startCell) {
                // shift appends selected range (if we have previously focused cell)
                mergeRange(me.startCell.id, id);
            }
            else if (event.ctrlKey || event.metaKey) {
                // ctrl/cmd adds to selection if using multiselect (and not selected)
                me.selectRow({
                    record         : id,
                    scrollIntoView : false,
                    addToSelection : true
                });
            }
        }
    }

    //endregion

    //region Navigation

    /**
     * Triggered from GridNavigation when focus is moved to another cell within the grid. Selects the cell unless
     * modifier keys are pressed, in which case it has already been handled
     * @private
     * @category Selection
     */
    onCellNavigate(me, fromCellSelector, toCellSelector, event, doSelect = true) {
        // CheckColumn events are handled by the CheckColumn itself.
        if (me.columns.getById(toCellSelector.columnId) === me.checkboxSelectionColumn || me.selectionMode.rowCheckboxSelection) {
            return;
        }

        // 1.do not affect selection if focus is returning to the grid from some widget
        // 2. don't select when left clicking expander icon in a tree
        if (!doSelect || me.returningFocus || (event && event.button === 0 && event.target.closest('.b-tree-expander'))) {
            return;
        }

        const
            isSameRecord = fromCellSelector && toCellSelector.id === fromCellSelector.id,
            isMouse      = event && event.type === 'mousedown',
            isMouseCtrl  = isMouse && event.ctrlKey;

        // SHIFT for keyboard / mouse and CTRL for mouse events indicate multiselect
        if (event && (!event.button || event.button === 2) && (event.shiftKey || isMouseCtrl)) {
            me.handleMouseMultiSelect(toCellSelector, event);
        }
        else {
            const
                clickedSameRecordWithModifierKey = isSameRecord && (!event || event.shiftKey || event.ctrlKey),
                clickedAlreadySelectedRecord     = event && me.isSelected(toCellSelector.id),
                clickedWithModifierKey           = isMouseCtrl;

            // We intentionally do not clear existing selection here if clicking a selected record,
            // it's done in onCellClick where we know current interaction is not a drag drop operation
            me.selectCell(toCellSelector, false, clickedSameRecordWithModifierKey ||
                clickedWithModifierKey ||
                clickedAlreadySelectedRecord);
        }

        // Remember last cell with ctrl pressed
        if (!me.startCell || isMouseCtrl) {
            me.startCell = toCellSelector;
            me.lastRange = null;
        }

    }

    /**
     * Keeps the UI synced with the selectionChange event before firing it out.
     * Event is not fired if the `silent` parameter is truthy.
     * @param {Object} selectionChangeEvent The change event to sync the UI to, and to possibly fire.
     * @param {Boolean} silent Specify `true` to not trigger any the passed.
     * @private
     * @category Selection
     */
    triggerChangeEvent(selectionChangeEvent, silent) {
        const
            me = this,
            {
                mode,
                selected,
                deselected
            }  = selectionChangeEvent,
            {
                checkboxSelectionColumn
            }  = me;

        let i, len, row, cell;

        // Keep the UI up to date with the triggered changes.
        // A mode: 'row' change selects and/or deselects records.
        if (mode === 'row') {
            for (i = 0, len = selected.length; i < len; i++) {
                row = me.getRowFor(selected[i]);
                if (row) {
                    row.addCls('b-selected');
                    if (checkboxSelectionColumn && !checkboxSelectionColumn.hidden && !selected[i].isSpecialRow) {
                        row.getCell(checkboxSelectionColumn.id).widget.checked = true;
                    }
                }
            }
            for (i = 0, len = deselected.length; i < len; i++) {
                row = me.getRowFor(deselected[i]);
                if (row) {
                    row.removeCls('b-selected');
                    if (checkboxSelectionColumn && !checkboxSelectionColumn.hidden && !deselected[i].isSpecialRow) {
                        row.getCell(checkboxSelectionColumn.id).widget.checked = false;
                    }
                }
            }
        }
        // A mode: 'cell' change selects and/or deselects *one* cell right now.
        // But we always use an array for future-proofing.
        else if (mode === 'cell') {
            for (i = 0, len = selected.length; i < len; i++) {
                cell = me.getCell(selected[i]);
                if (cell) {
                    cell.classList.add('b-selected');
                }
            }
            for (i = 0, len = deselected.length; i < len; i++) {
                cell = me.getCell(deselected[i]);
                if (cell) {
                    cell.classList.remove('b-selected');
                }
            }
        }

        if (!silent) {
            me.trigger('selectionChange', selectionChangeEvent);
        }
    }

    onCellClick({ event, record }) {
        const me = this;

        if (!me.selectionMode.checkbox && me.selectionMode.multiSelect && !event.shiftKey && !event.metaKey && !event.ctrlKey) {
            me.deselectRows(me.selectedRecords.filter(rec => rec !== record));
        }
    }

    //endregion

    //region Getters/setters

    doDestroy() {
        this.selectedRecordCollection?.destroy();

        super.doDestroy();
    }

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement thus.
    get widgetClass() {}

    //endregion

};
