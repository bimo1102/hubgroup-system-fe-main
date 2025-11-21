//TODO: Expand function?
//TODO: Collapse function?
//TODO: Sorting breaks grouping if some groups are collapsed
//TODO: Grouping via context menu doesn't work

import DomDataStore from '../../Core/data/DomDataStore.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import InstancePlugin from '../../Core/mixin/InstancePlugin.js';
import GridFeatureManager from './GridFeatureManager.js';
import DomSync from '../../Core/helper/DomSync.js';
import StringHelper from '../../Core/helper/StringHelper.js';

/**
 * @module Grid/feature/Group
 */

/**
 * Enables rendering and handling of row groups. The actual grouping is done in the store, but triggered by [shift] +
 * clicking headers or by using two finger tap (one on header, one anywhere on grid). Groups can be expanded/collapsed
 * by clicking on the group row or pressing [space] when group row is selected.
 * The actual grouping is done by the store, see {@link Core.data.mixin.StoreGroup#function-group}.
 *
 * Grouping by a field performs sorting by the field automatically. It's not possible to prevent sorting.
 * If you group, the records have to be sorted so that records in a group stick together. You can either control sorting
 * direction, or provide a custom sorting function called {@link #config-groupSortFn} to your feature config object.
 *
 * For info on programmatically handling grouping, see {@link Core.data.mixin.StoreGroup StoreGroup}.
 *
 * Currently grouping is not supported when using pagination, the underlying store cannot group data that is split into pages.
 *
 * This feature is **enabled** by default.
 *
 * @example
 * // grouping feature is enabled, no default value though
 * let grid = new Grid({
 *     features : {
 *         group : true
 *     }
 * });
 *
 * // use initial grouping
 * let grid = new Grid({
 *     features : {
 *         group : 'city'
 *     }
 * });
 *
 * // default grouper and custom renderer, which will be applied to each cell except the "group" cell
 * let grid = new Grid({
 *   features : {
 *     group : {
 *       field : 'city',
 *       ascending : false,
 *       renderer : ({ isFirstColumn, count, groupRowFor, record }) => isFirstColumn ? `${groupRowFor} (${count})` : ''
 *     }
 *   }
 * });
 *
 * // group using custom sort function
 * let grid = new Grid({
 *     features : {
 *         group       : {
 *             field       : 'city',
 *             groupSortFn : (a, b) => a.city.length < b.city.length ? -1 : 1
 *         }
 *     }
 * });
 *
 * // can also be specified on the store
 * let grid = new Grid({
 *     store : {
 *         groupers : [
 *             { field : 'city', ascending : false }
 *         ]
 *     }
 * });
 *
 * // custom sorting function can also be specified on the store
 * let grid = new Grid({
 *     store : {
 *         groupers : [{
 *             field : 'city',
 *             fn : (recordA, recordB) => {
 *                 // apply custom logic, for example:
 *                 return recordA.city.length < recordB.city.length ? -1 : 1;
 *             }
 *         }]
 *     }
 * });
 *
 * @extends Core/mixin/InstancePlugin
 *
 * @demo Grid/grouping
 * @classtype group
 * @feature
 *
 * @inlineexample Grid/feature/Group.js
 */
export default class Group extends InstancePlugin {

    static get $name() {
        return 'Group';
    }

    static get configurable() {
        return {
            /**
             * The name of the record field to group by.
             * @config {String}
             * @default
             */
            field : null,

            /**
             * A function used to sort the groups
             * @config {Function}
             */
            groupSortFn : null,

            /**
             * A function which produces the HTML for a group header.
             * The function is called in the context of this Group feature object.
             * Default group renderer displays the `groupRowFor` and `count`.
             *
             * @config {Function}
             * @property {String} groupRowFor The value of the `field` for the group.
             * @property {Core.data.Model} record The group record representing the group.
             * @property {Object} record.meta Meta data with additional info about the grouping.
             * @property {Array} record.groupChildren The group child records.
             * @property {Number} count Number of records in the group.
             * @property {Grid.column.Column} column The column the renderer runs for.
             * @property {Boolean} isFirstColumn True, if `column` is the first column.
             * If `RowNumberColumn` is the real first column, it's not taken into account.
             * @property {Grid.column.Column} [groupColumn] The column under which the `field` is shown.
             * @property {Object} size Sizing information for the group header row, only `height` is relevant.
             * @property {Number} size.height The height of the row, set this if you want a custom height for the group header row
             * That is UI part, so do not rely on its existence.
             * @default
             */
            renderer : null
        };
    }

    //region Init

    construct(grid, config) {
        const me = this;

        if (grid.features.tree) {
            return;
        }

        // groupSummary feature needs to be initialized first, if it is used
        me._thisIsAUsedExpression(grid.features.groupSummary);

        // process initial config into an actual config object
        config = me.processConfig(config);

        me.grid = grid;

        super.construct(grid, config);

        me.bindStore(grid.store);

        grid.rowManager.on({
            beforeRenderRow : 'onBeforeRenderRow',
            renderCell      : 'renderCell',

            // The feature gets to see cells being rendered before the GroupSummary feature
            // because this injects header content into group header rows and adds rendering
            // info to the cells renderData which GroupSummary must comply with.
            prio    : 1100,
            thisObj : me
        });
    }

    // Group feature handles special config cases, where user can supply a string or a group config object
    // instead of a normal config object
    processConfig(config) {
        if (typeof config === 'string') {
            return {
                field     : config,
                ascending : null
            };
        }

        return config;
    }

    // override setConfig to process config before applying it (used mainly from ReactGrid)
    setConfig(config) {
        if (config === null) {
            this.store.clearGroupers();
        }
        else {
            super.setConfig(this.processConfig(config));
        }
    }

    bindStore(store) {
        this.detachListeners('store');

        store.on({
            name    : 'store',
            group   : 'onStoreGroup',
            thisObj : this
        });
    }

    updateRenderer(renderer) {
        this.groupRenderer = renderer;
    }

    updateField(field) {
        this.store.group({
            field,
            ascending : this.ascending,
            fn        : this.groupSortFn
        });
    }

    updateGroupSortFn(fn) {
        if (!this.isConfiguring) {
            this.store.group({
                field     : this.field,
                ascending : this.ascending,
                fn
            });
        }
    }

    doDestroy() {
        super.doDestroy();
    }

    doDisable(disable) {
        const { store } = this;

        // Grouping mostly happens in store, need to clear groupers there to remove headers.
        // Use configured groupers as first sorters to somewhat maintain the order
        if (disable && store.isGrouped) {
            const { sorters } = store;
            sorters.unshift(...store.groupers);
            store.clearGroupers();
            store.sort(sorters);
        }

        super.doDisable(disable);
    }

    get store() {
        return this.grid.store;
    }

    //endregion

    //region Plugin config

    // Plugin configuration. This plugin chains some of the functions in Grid.
    static get pluginConfig() {
        return {
            assign : ['collapseAll', 'expandAll'],
            chain  : ['renderHeader', 'populateHeaderMenu', 'getColumnDragToolbarItems', 'onElementTouchStart',
                'onElementClick', 'onElementKeyDown', 'bindStore']
        };
    }

    //endregion

    //region Expand/collapse

    /**
     * Collapses or expands a group depending on its current state
     * @param {Core.data.Model|String} recordOrId Record or records id for a group row to collapse or expand
     * @param {Boolean} collapse Force collapse (true) or expand (true)
     * @fires togglegroup
     */
    toggleCollapse(recordOrId, collapse) {
        this.internalToggleCollapse(recordOrId, collapse);
    }

    /**
     * Collapses or expands a group depending on its current state
     * @param {Core.data.Model|String} recordOrId Record or records id for a group row to collapse or expand
     * @param {Boolean} collapse Force collapse (true) or expand (true)
     * @param {Boolean} skipRender True to not render rows
     * @internal
     * @fires togglegroup
     */
    internalToggleCollapse(recordOrId, collapse, skipRender = false) {
        //<debug>
        if (recordOrId == null) {
            throw new Error('Group#toggleCollapse must be passed a record');
        }
        //</debug>

        const
            me          = this,
            { store }   = me,
            groupRecord = store.getById(recordOrId);

        if (!groupRecord.isGroupHeader) {
            return;
        }

        collapse = collapse === undefined ? !groupRecord.meta.collapsed : collapse;

        if (collapse) {
            store.collapse(groupRecord);
        }
        else {
            store.expand(groupRecord);
        }

        /**
         * Group expanded or collapsed
         * @event toggleGroup
         * @param groupRecord Group record
         * @param {Boolean} collapse Collapsed (true) or expanded (false)
         */
        me.grid.trigger('toggleGroup', { groupRecord, collapse });

        if (!skipRender) {
            // render from grouprecord and down, no need to touch those above
            me.grid.rowManager.renderFromRecord(groupRecord);
        }
    }

    /**
     * Collapse all groups. This function is exposed on Grid and can thus be called as `grid.collapseAll()`
     * @on-owner
     */
    collapseAll() {
        const me = this;
        if (me.store.isGrouped && !me.disabled) {
            me.store.groupRecords.forEach(r => me.internalToggleCollapse(r, true, true));
            me.grid.refreshRows(true);
        }
    }

    /**
     * Expand all groups. This function is exposed on Grid and can thus be called as `grid.expandAll()`
     * @on-owner
     */
    expandAll() {
        const me = this;
        if (me.store.isGrouped && !me.disabled) {
            me.store.groupRecords.forEach(r => me.internalToggleCollapse(r, false, true));
            me.grid.refreshRows();
        }
    }

    //endregion

    //region Rendering

    /**
     * Called before rendering row contents, used to reset rows no longer used as group rows
     * @private
     */
    onBeforeRenderRow({ row }) {
        // row.id contains previous record id on before render
        const oldRecord = row.grid.store.getById(row.id);
        // force update of inner html if this row used for group data
        row.forceInnerHTML = row.forceInnerHTML || oldRecord?.isGroupHeader;
    }

    /**
     * Called when a cell is rendered, styles the group rows first cell.
     * @private
     */
    renderCell(renderData) {
        const
            me                  = this,
            {
                cellElement,
                row,
                column
            }                   = renderData,
            { meta }            = renderData.record,
            rowClasses          = {
                'b-group-row'            : 0,
                'b-grid-group-collapsed' : 0
            };

        if (!me.disabled && me.store.isGrouped) {
            if ('groupRowFor' in meta) {
                // do nothing with action column to make possible using actions for groups
                if (column.type === 'action') {
                    return;
                }
                // let column clear the cell, in case it needs to do some cleanup
                column.clearCell(cellElement);

                // this is a group row, add css classes
                rowClasses['b-grid-group-collapsed'] = meta.collapsed;
                rowClasses['b-group-row'] = 1;

                if (column === me.groupHeaderColumn) {
                    cellElement.classList.add('b-group-title');
                }

                me.buildGroupHeader(renderData);
            }
            else {
                cellElement.classList.remove('b-group-title');
            }
        }

        // Still need to sync row classes is disabled or not grouped.
        // Previous b-group-row and b-grid-group-collapsed classes must be removed.
        row.assignCls(rowClasses);
    }

    // renderData.cellElement is required
    buildGroupHeader(renderData) {
        const
            me                  = this,
            {
                record,
                cellElement,
                column,
                persist
            }                   = renderData,
            { grid }            = me,
            meta                = record.meta,
            { groupRowFor }     = meta,
            // Need to adjust count if group summary is used
            // TODO remove this when grouping has been refactored to not store group headers/footers in the Store
            count               = meta.childCount - (grid.features.groupSummary ? 1 : 0);

        let html         = null,
            applyDefault = true;

        if (persist || column) {
            const
                groupColumn         = grid.columns.get(meta.groupField),
                isGroupHeaderColumn = renderData.isFirstColumn = column === me.groupHeaderColumn;
            // First try using columns groupRenderer (might not even have a column if grouping programmatically)
            if (groupColumn?.groupRenderer) {
                if (isGroupHeaderColumn) {
                    // groupRenderer could return nothing and just apply changes directly to DOM element
                    html = groupColumn.groupRenderer({
                        ...renderData,
                        groupRowFor,
                        groupRecords : record.groupChildren,
                        groupColumn,
                        count
                    });

                    applyDefault = false;
                }
            }
            // Secondly use features groupRenderer, if configured with one
            else if (me.groupRenderer) {
                // groupRenderer could return nothing and just apply changes directly to DOM element
                html = me.groupRenderer({
                    ...renderData,
                    groupRowFor,
                    groupRecords  : record.groupChildren,
                    groupColumn,
                    count,
                    isFirstColumn : isGroupHeaderColumn
                });
            }

            // Third, just display unformatted value and child count (also applied for features groupRenderer that do
            // not output any html of their own)
            if (isGroupHeaderColumn && html == null && applyDefault && DomHelper.getChildElementCount(cellElement) === 0) {
                html = StringHelper.encodeHtml(`${groupRowFor === '__novalue__' ? '' : groupRowFor} (${count})`);
            }
        }
        else if (me.groupRenderer) {
            // groupRenderer could return nothing and just apply changes directly to DOM element
            html = me.groupRenderer(renderData);
        }

        // Renderers could return nothing and just apply changes directly to DOM element
        if (typeof html === 'string') {
            cellElement.innerHTML = html;
        }
        else if (typeof html === 'object') {
            DomSync.sync({
                targetElement : cellElement,
                domConfig     : {
                    onlyChildren : true,
                    children     : Array.isArray(html) ? html : [
                        html
                    ]
                }
            });
        }

        // If groupRenderer added elements to the cell, we need to remember that to clear it on re-usage as a normal cell
        if (DomHelper.getChildElementCount(cellElement) > 0) {
            cellElement._hasHtml = true;
        }

        return cellElement.innerHTML;
    }

    get groupHeaderColumn() {
        return this.grid.columns.visibleColumns.find(column => !column.groupHeaderReserved);
    }

    /**
     * Called when an header is rendered, adds grouping icon if grouped by that column.
     * @private
     * @param headerContainerElement
     */
    renderHeader(headerContainerElement) {
        const { store, grid } = this;

        if (store.isGrouped) {
            // Sorted from start, reflect in rendering
            for (const groupInfo of store.groupers) {
                // Might be grouping by field without column, which is valid
                const
                    column = grid.columns.get(groupInfo.field),
                    header = column && grid.getHeaderElement(column.id);
                // IE11 doesnt support this
                //header && header.classList.add('b-group', groupInfo.ascending ? 'b-asc' : 'b-desc');
                if (header) {
                    header.classList.add('b-group');
                    header.classList.add(groupInfo.ascending ? 'b-asc' : 'b-desc');
                }
            }
        }
    }

    //endregion

    //region Context menu

    /**
     * Supply items for headers context menu.
     * @param {Object} options Contains menu items and extra data retrieved from the menu target.
     * @param {Grid.column.Column} options.column Column for which the menu will be shown
     * @param {Object} options.items A named object to describe menu items
     * @internal
     */
    populateHeaderMenu({ column, items }) {
        const me = this;

        if (column.groupable !== false) {

            items.groupAsc = {
                text        : 'L{groupAscending}',
                localeClass : me,
                icon        : 'b-fw-icon b-icon-group-asc',
                name        : 'groupAsc',
                cls         : 'b-separator',
                weight      : 400,
                disabled    : me.disabled,
                onItem      : () => me.store.group(column.field, true)
            };

            items.groupDesc = {
                text        : 'L{groupDescending}',
                localeClass : me,
                icon        : 'b-fw-icon b-icon-group-desc',
                name        : 'groupDesc',
                weight      : 410,
                disabled    : me.disabled,
                onItem      : () => me.store.group(column.field, false)
            };
        }

        if (me.store.isGrouped) {
            items.groupRemove = {
                text        : 'L{stopGrouping}',
                localeClass : me,
                icon        : 'b-fw-icon b-icon-clear',
                name        : 'groupRemove',
                cls         : column.groupable ? '' : 'b-separator',
                weight      : 420,
                disabled    : me.disabled,
                onItem      : () => me.store.clearGroupers()
            };
        }
    }

    /**
     * Supply items to ColumnDragToolbar
     * @private
     */
    getColumnDragToolbarItems(column, items) {
        const
            me                  = this,
            { store, disabled } = me;

        items.push({
            text        : 'L{groupAscendingShort}',
            group       : 'L{group}',
            localeClass : me,
            icon        : 'b-icon b-icon-group-asc',
            name        : 'groupAsc',
            cls         : 'b-separator',
            weight      : 110,
            disabled,
            onDrop      : ({ column }) => store.group(column.field, true)
        });

        items.push({
            text        : 'L{groupDescendingShort}',
            group       : 'L{group}',
            localeClass : me,
            icon        : 'b-icon b-icon-group-desc',
            name        : 'groupDesc',
            weight      : 110,
            disabled,
            onDrop      : ({ column }) => store.group(column.field, false)
        });

        const grouped = store.groupers?.some(col => col.field === column.field) && !disabled;
        items.push({
            text        : 'L{stopGroupingShort}',
            group       : 'L{group}',
            localeClass : me,
            icon        : 'b-icon b-icon-clear',
            name        : 'groupRemove',
            disabled    : !grouped,
            weight      : 110,
            onDrop      : ({ column }) => store.removeGrouper(column.field)
        });

        return items;
    }

    //endregion

    //region Events - Store

    /**
     * Called when store grouping changes. Reflects on header and rerenders rows.
     * @private
     */
    onStoreGroup({ groupers }) {
        const
            { grid }        = this,
            { element }     = grid,
            curGroupHeaders = element && DomHelper.children(element, '.b-grid-header.b-group');

        if (element) {
            for (const header of curGroupHeaders) {
                DomHelper.removeClasses(header, ['b-group', 'b-asc', 'b-desc']);
            }

            if (groupers) {
                for (const groupInfo of groupers) {
                    const header = grid.getHeaderElementByField(groupInfo.field);
                    if (header) {
                        DomHelper.addClasses(header, ['b-group', groupInfo.ascending ? 'b-asc' : 'b-desc']);
                    }
                }
            }
        }
    }

    //endregion

    //region Events - Grid

    /**
     * Store touches when user touches header, used in onElementTouchEnd.
     * @private
     */
    onElementTouchStart(event) {
        const
            me         = this,
            { target } = event,
            header     = DomHelper.up(target, '.b-grid-header'),
            column     = header && me.grid.getColumnFromElement(header);

        // If it's a multi touch, group.
        if (event.touches.length > 1 && column && column.groupable !== false && !me.disabled) {
            me.store.group(column.field);
        }
    }

    /**
     * React to click on headers (to group by that column if [alt] is pressed) and on group rows (expand/collapse).
     * @private
     * @param event
     * @returns {Boolean}
     */
    onElementClick(event) {
        const
            me         = this,
            { store }  = me,
            { target } = event,
            row        = DomHelper.up(target, '.b-group-row'),
            header     = DomHelper.up(target, '.b-grid-header'),
            field      = header?.dataset.column;

        // prevent expand/collapse if disabled or clicked on item with own handler
        if (
            target.classList.contains('b-resizer') ||
            me.disabled ||
            target.classList.contains('b-action-item')
        ) {
            return;
        }

        // Header
        if (header && field) {
            const columnGrouper = store.groupers?.find(g => g.field === field);

            // Store has a grouper for this column's field; flip grouper order
            if (columnGrouper && !event.shiftKey) {
                store.group(field, !columnGrouper.ascending);
                return false;
            }
            // Group or ungroup
            else if (event.shiftKey) {
                const column = me.grid.columns.get(field);

                if (column.groupable !== false) {
                    if (event.altKey) {
                        store.removeGrouper(field);
                    }
                    else {
                        store.group(field);
                    }
                }
            }
        }

        // Anywhere on group-row
        if (row) {
            me.internalToggleCollapse(DomDataStore.get(row).id);
            return false;
        }
    }

    /**
     * Toggle groups with [space].
     * @private
     * @param event
     * @returns {*}
     */
    onElementKeyDown(event) {
        const
            me       = this,
            { grid } = me;

        // only catch space on grid element, not in editors etc...
        if (!me.disabled && me.store.isGrouped && event.target === grid.focusElement && event.key === ' ' && grid.focusedCell) {
            event.preventDefault();

            me.internalToggleCollapse(grid.focusedCell.id);
        }
    }

    //endregion
}

GridFeatureManager.registerFeature(Group, true, ['Grid', 'Scheduler']);
