import InstancePlugin from '../../Core/mixin/InstancePlugin.js';
import GridFeatureManager from '../feature/GridFeatureManager.js';
import SummaryFormatter from './mixin/SummaryFormatter.js';
import DomHelper from '../../Core/helper/DomHelper.js';

/**
 * @module Grid/feature/GroupSummary
 */

/**
 * Displays a summary row as a group footer in a grouped grid. Uses same configuration options on columns as
 * {@link Grid.feature.Summary}.
 *
 * This feature is <strong>disabled</strong> by default.
 *
 * ```
 * features : {
 *     group        : 'city',
 *     groupSummary : true
 * }
 * ```
 *
 * @extends Core/mixin/InstancePlugin
 *
 * @demo Grid/groupsummary
 * @classtype groupSummary
 * @feature
 *
 * @inlineexample Grid/feature/GroupSummary.js
 */
export default class GroupSummary extends SummaryFormatter(InstancePlugin) {
    //region Init

    static get $name() {
        return 'GroupSummary';
    }

    static get configurable() {
        return {
            /**
             * Configure as true to have group summaries rendered in the group header when a group is collapsed.
             * @config {Boolean}
             */
            collapseToHeader : null
        };
    }

    construct(grid, config) {
        this.grid = grid;

        super.construct(grid, config);

        if (!grid.features.group) {
            throw new Error('Requires Group feature to work, please enable');
        }

        this.bindStore(grid.store);

        grid.rowManager.on({
            beforeRenderRow : 'onBeforeRenderRow',
            renderCell      : 'renderCell',

            // The feature gets to see cells being rendered after the Group feature
            // because the Group feature injects header content into group header rows
            // and adds rendering info to the cells renderData which we must comply with.
            // In particular, it calculates the isFirstColumn flag which it adds to
            // the cell renderData which we interrogate.
            prio    : 1000,
            thisObj : this
        });
    }

    bindStore(store) {
        this.detachListeners('store');

        store.on({
            name    : 'store',
            update  : 'onStoreUpdate',
            // need to run before grids listener, to flag for full refresh
            prio    : 1,
            thisObj : this
        });
    }

    get store() {
        return this.grid.store;
    }

    doDisable(disable) {
        // Flag that will make the Store insert rows for group footers
        this.store.useGroupFooters = !disable;

        // Refresh groups to show/hide footers
        if (!this.isConfiguring) {
            this.store.group();
        }

        super.doDisable(disable);
    }

    //endregion

    //region Plugin config

    // Plugin configuration. This plugin chains some of the functions in Grid.
    static get pluginConfig() {
        return {
            chain : ['bindStore']
        };
    }

    //endregion

    //region Render

    /**
     * Called before rendering row contents, used to reset rows no longer used as group summary rows
     * @private
     */
    onBeforeRenderRow({ row, record }) {
        if (row.isGroupFooter && !('groupFooterFor' in record.meta)) {
            // not a group row.
            row.isGroupFooter = false;
            // force full "redraw" when rendering cells
            row.forceInnerHTML = true;
        }
        else if (row.isGroupHeader && !record.meta.collapsed) {
            // remove any summary elements
            row.eachElement(this.removeSummaryElements);
        }
    }

    removeSummaryElements(rowEl) {
    }

    /**
     * Called when a cell is rendered, styles the group rows first cell.
     * @private
     */
    renderCell({ column, cellElement, row, record, size, isFirstColumn }) {
        const
            me            = this,
            { meta }      = record,
            isGroupHeader = 'groupRowFor' in meta,
            isGroupFooter = 'groupFooterFor' in meta,
            rowClasses    = {
                'b-group-footer'   : 0,
                'b-header-summary' : 0
            };

        // Should we generate summary content in this cell?
        // We should if this is a group footer row.
        // We also should if it's a collapsed group header and we are configured to put
        // the summary in the header on collapse, *and* if it's not the first column
        // as defined by the Group feature.
        if (me.store.isGrouped && (isGroupFooter || (me.collapseToHeader && isGroupHeader && meta.collapsed && !isFirstColumn))) {
            const groupRecord = isGroupHeader ? record : meta.groupRecord;

            row.isGroupFooter = isGroupFooter;
            row.isGroupHeader = isGroupHeader;

            // This is a group footer row, add css
            if (isGroupFooter) {
                rowClasses['b-group-footer'] = 1;
            }
            // This is a header row which is being used during collapsed state
            // to contain summary data because of the collapseToHeader config.
            else {
                rowClasses['b-header-summary'] = 1;
            }

            // returns height config or count. config format is { height, count }. where `height is in px and should be
            // added to value calculated from `count
            const
                heightSetting = me.updateSummaryHtml(cellElement, column, groupRecord),
                count         = typeof heightSetting === 'number' ? heightSetting : heightSetting.count;

            // number of summaries returned, use to calculate cell height
            if (count > 1) {
                size.height = me.grid.rowHeight + (record.meta.collapsed ? 0 : count * me.grid.rowHeight * 0.1);
            }

            // height config with height specified, added to cell height
            if (heightSetting.height) {
                size.height += heightSetting.height;
            }
        }

        // Sync row's classes with its status as a group header or footer.
        row.assignCls(rowClasses);
    }

    updateSummaryHtml(cellElement, column, groupRecord) {
        const records = groupRecord.groupChildren.slice();
        records.pop(); // last record is group footer, remove

        const html = this.generateHtml(column, records, 'b-grid-group-summary', groupRecord, groupRecord.meta.groupField, groupRecord.meta.groupRowFor);

        // First time, set table
        if (!cellElement.children.length) {
            cellElement.innerHTML = html;
        }
        // Following times, sync changes
        else {
            DomHelper.sync(html, cellElement.firstElementChild);
        }

        // return summary "count", used to set row height
        return column.summaries ? column.summaries.length : column.sum ? 1 : 0;
    }

    //endregion

    //region Events

    /**
     * Updates summaries on store changes (except record update, handled below)
     * @private
     */
    onStoreUpdate({ source : store, changes }) {
        if (!this.disabled && store.isGrouped) {
            // If a grouping field is among the changes, StoreGroup#onDataChanged will
            // take care of the update by re-sorting.
            if (changes && store.groupers.find(grouper => grouper.field in changes)) {
                return;
            }
            // only update summary when a field that affects summary is changed
            // TODO: this should maybe be removed, another column might depend on the value for its summary?
            const shouldUpdate = Object.keys(changes).some(field => {
                const colField = this.grid.columns.get(field);
                // check existence, since a field not used in a column might have changed
                return Boolean(colField) && (Boolean(colField.sum) || Boolean(colField.summaries));
            });

            if (shouldUpdate) {
                this.grid.forceFullRefresh = true;
            }
        }
    }

    //endregion

    /**
     * Refreshes the summaries
     */
    refresh() {
        this.grid.columns.visibleColumns.forEach(column => {
            if (this.hasSummary(column)) {
                this.grid.refreshColumn(column);
            }
        });
    }

    hasSummary(column) {
        return column.sum || column.summaries;
    }
}

GroupSummary.featureClass = 'b-group-summary';

GridFeatureManager.registerFeature(GroupSummary);
