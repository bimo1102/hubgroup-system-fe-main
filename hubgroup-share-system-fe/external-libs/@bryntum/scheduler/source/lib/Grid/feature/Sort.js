//TODO: Allow multisort using multitouch?
//TODO: UI sort of broken with grouped headers, take a look at groupedheaders demo

import DomHelper from '../../Core/helper/DomHelper.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import DomClassList from '../../Core/helper/util/DomClassList.js';
import InstancePlugin from '../../Core/mixin/InstancePlugin.js';
import GridFeatureManager from './GridFeatureManager.js';

/**
 * @module Grid/feature/Sort
 */

/**
 * Allows sorting of grid by clicking (or tapping) headers, also displays which columns grid is sorted by (numbered if
 * using multisort). Use modifier keys for multisorting: ctrl + click to add sorter, ctrl + alt + click to remove sorter.
 * The actual sorting is done by the store, see {@link Core.data.mixin.StoreSort#function-sort Store#sort()}.
 *
 * {@inlineexample Grid/feature/Sort.js}
 *
 * ```javascript
 * // sorting feature is enabled, no default value though
 * const grid = new Grid({
 *     features : {
 *         sort : true
 *     }
 * });
 *
 * // use initial sorting
 * const grid = new Grid({
 *     features : {
 *         sort : 'name'
 *     }
 * });
 *
 * // can also be specified on the store
 * const grid = new Grid({
 *     store : {
 *         sorters : [
 *             { field : 'name', ascending : false }
 *         ]
 *     }
 * });
 *
 * // custom sorting function can also be specified on the store
 * const grid = new Grid({
 *     store : {
 *         sorters : [{
 *             fn : (recordA, recordB) => {
 *                 // apply custom logic, for example:
 *                 return recordA.name.length < recordB.name.length ? -1 : 1;
 *             }
 *         }]
 *     }
 * });
 * ```
 *
 * For info on programmatically handling sorting, see {@link Core.data.mixin.StoreSort StoreSort}:
 *
 * ```javascript
 * const grid = new Grid({ });
 * // Programmatic sorting of the store, Grids rows and UI will be updated
 * grid.store.sort('age');
 * ```
 *
 * Grid columns can define custom sorting functions (see {@link Grid.column.Column#config-sortable Column#sortable}).
 * If this feature is configured with `prioritizeColumns: true`, those functions will also be used when sorting
 * programmatically:
 *
 * ```javascript
 * const grid = new Grid({
 *     columns : [
 *         {
 *             field : 'age',
 *             text : 'Age',
 *             sortable(lhs, rhs) {
 *               // Custom sorting, see Array#sort
 *             }
 *         }
 *     ],
 *
 *     features : {
 *         sort : {
 *             prioritizeColumns : true
 *         }
 *     }
 * });
 *
 * // Sortable fn will also be used when sorting programmatically
 * grid.store.sort('age');
 * ```
 *
 * This feature is **enabled** by default.
 *
 * @extends Core/mixin/InstancePlugin
 * @demo Grid/sorting
 * @classtype sort
 * @feature
 */
export default class Sort extends InstancePlugin {
    //region Config

    static get $name() {
        return 'Sort';
    }

    static get configurable() {
        return {
            /**
             * Enable multi sort
             * @config {Boolean}
             * @default
             */
            multiSort : true,

            /**
             * Use custom sorting functions defined on columns also when programmatically sorting by the columns field.
             *
             * ```javascript
             * const grid = new Grid({
             *     columns : [
             *         {
             *             field : 'age',
             *             text : 'Age',
             *             sortable(lhs, rhs) {
             *               // Custom sorting, see Array#sort
             *             }
             *         }
             *     ],
             *
             *     features : {
             *         sort : {
             *             prioritizeColumns : true
             *         }
             *     }
             * });
             *
             * grid.store.sort('age');
             * ```
             *
             * @config {Boolean}
             * @default
             */
            prioritizeColumns : false
        };
    }

    static get properties() {
        return {
            ignoreRe : new RegExp([
                // Stop this feature from having to know the internals of two other optional features.
                'b-grid-header-resize-handle',
                'b-filter-icon'
            ].join('|')),

            sortableCls   : 'b-sortable',
            sortedCls     : 'b-sort',
            sortedAscCls  : 'b-asc',
            sortedDescCls : 'b-desc'
        };
    }

    //endregion

    //region Init

    construct(grid, config) {
        // process initial config into an actual config object
        config = this.processConfig(config);

        this.grid = grid;

        this.bindStore(grid.store);

        super.construct(grid, config);
    }

    // Sort feature handles special config cases, where user can supply a string or an array of sorters
    // instead of a normal config object
    processConfig(config) {
        if (typeof config === 'string' || Array.isArray(config)) {
            return {
                field     : config,
                ascending : null
            };
        }

        return config;
    }

    // override setConfig to process config before applying it
    setConfig(config) {
        super.setConfig(this.processConfig(config));
    }

    bindStore(store) {
        this.detachListeners('store');

        store.on({
            name       : 'store',
            beforeSort : 'onStoreBeforeSort',
            sort       : 'syncHeaderSortState',
            thisObj    : this
        });
    }

    set field(field) {
        // Use columns sortable config for initial sorting if it is specified
        const column = this.grid.columns.get(field);

        if (column && typeof column.sortable === 'object') {
            // Normalization of Store & CollectionSorter differences
            column.sortable.field = column.sortable.property || field;
            field = column.sortable;
        }

        this.store.sort(field, this.ascending);
    }

    // Avoid caching store, it might change
    get store() {
        return this.grid.store;
    }

    //endregion

    //region Plugin config

    // Plugin configuration. This plugin chains some of the functions in Grid.
    static get pluginConfig() {
        return {
            chain : ['onElementClick', 'populateHeaderMenu', 'getColumnDragToolbarItems', 'renderHeader', 'onPaint', 'bindStore']
        };
    }

    //endregion

    //region Headers

    /**
     * Update headers to match stores sorters (displays sort icon in correct direction on them)
     * @private
     */
    syncHeaderSortState() {
        const
            me       = this,
            { grid } = me;

        if (!grid.hideHeaders && grid.isPainted) {
            const
                storeSorters = me.store.sorters,
                sorterCount  = storeSorters.length,
                classList    = new DomClassList();
            let
                sorter;

            // Sync the sortable, sorted, and sortIndex state of each leaf header element
            for (const leafColumn of grid.columns.visibleColumns) {
                const
                    leafHeader = leafColumn.element,
                    // TimeAxisColumn in Scheduler has no textWrapper, since it has custom rendering,
                    // but since it cannot be sorted by anyway lets just ignore it
                    dataset    = leafColumn.textWrapper?.dataset;

                // data-sortIndex is 1-based, and only set if there is > 1 sorter.
                // iOS Safari throws a JS error if the requested delete property is not present.
                dataset?.sortIndex && delete dataset.sortIndex;

                classList.value = leafHeader.classList;

                if (leafColumn.sortable !== false) {
                    classList.add(me.sortableCls);

                    sorter = storeSorters.find(sort =>
                        sort.field === leafColumn.field ||
                        (sort.sortFn && sort.sortFn === leafColumn.sortable.sortFn)
                    );

                    if (sorter) {
                        if (sorterCount > 1 && dataset) {
                            dataset.sortIndex = storeSorters.indexOf(sorter) + 1;
                        }
                        classList.add(me.sortedCls);
                        if (sorter.ascending) {
                            classList.add(me.sortedAscCls);
                            classList.remove(me.sortedDescCls);
                        }
                        else {
                            classList.add(me.sortedDescCls);
                            classList.remove(me.sortedAscCls);
                        }
                    }
                    else {
                        classList.remove(me.sortedCls);
                        // Not optimal, but easiest way to make sure sort feature does not remove needed classes.
                        // Better solution would be to use different names for sorting and grouping
                        if (!classList['b-group']) {
                            classList.remove(me.sortedAscCls);
                            classList.remove(me.sortedDescCls);
                        }
                    }
                }
                else {
                    classList.remove(me.sortableCls);
                }

                // Update the element's classList
                DomHelper.syncClassList(leafHeader, classList);
            }
        }
    }

    //endregion

    //region Context menu

    /**
     * Adds sort menu items to header context menu.
     * @param {Object} options Contains menu items and extra data retrieved from the menu target.
     * @param {Grid.column.Column} options.column Column for which the menu will be shown
     * @param {Object} options.items A named object to describe menu items
     * @internal
     */
    populateHeaderMenu({ column, items }) {
        const
            me        = this,
            { store } = me,
            sortBy    = {  ...column.sortable, field : column.field, columnOwned : true };

        if (column.sortable !== false) {
            items.sortAsc = {
                text        : 'L{sortAscending}',
                localeClass : me,
                icon        : 'b-fw-icon b-icon-sort-asc',
                name        : 'sortAsc',
                cls         : 'b-separator',
                weight      : 300,
                disabled    : me.disabled,
                onItem      : () => store.sort(sortBy, true)
            };

            items.sortDesc = {
                text        : 'L{sortDescending}',
                localeClass : me,
                icon        : 'b-fw-icon b-icon-sort-desc',
                name        : 'sortDesc',
                weight      : 310,
                disabled    : me.disabled,
                onItem      : () => store.sort(sortBy, false)
            };

            if (me.multiSort && me.grid.columns.records.some(col => col.sortable)) {
                const sorter = store.sorters.find(s => s.field === column.field || (column.sortable.sortFn && column.sortable.sortFn === s.sortFn));

                items.multiSort = {
                    text        : 'L{multiSort}',
                    localeClass : me,
                    icon        : 'b-fw-icon b-icon-sort',
                    name        : 'multiSort',
                    weight      : 320,
                    disabled    : me.disabled,
                    menu        : {
                        addSortAsc : {
                            text        : sorter ? 'L{toggleSortAscending}' : 'L{addSortAscending}',
                            localeClass : me,
                            icon        : 'b-fw-icon b-icon-sort-asc',
                            name        : 'addSortAsc',
                            disabled    : sorter && sorter?.ascending,
                            weight      : 330,
                            onItem      : () => store.addSorter(sortBy, true)
                        },
                        addSortDesc : {
                            text        : sorter ? 'L{toggleSortDescending}' : 'L{addSortDescending}',
                            localeClass : me,
                            icon        : 'b-fw-icon b-icon-sort-desc',
                            name        : 'addSortDesc',
                            disabled    : sorter && !sorter.ascending,
                            weight      : 340,
                            onItem      : () => store.addSorter(sortBy, false)
                        },
                        removeSorter : {
                            text        : 'L{removeSorter}',
                            localeClass : me,
                            icon        : 'b-fw-icon b-icon-remove',
                            name        : 'removeSorter',
                            weight      : 350,
                            disabled    : !sorter,
                            onItem      : () => {
                                store.removeSorter(sortBy.field);
                            }
                        }
                    }
                };
            }
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

        if (column.sortable !== false) {
            const sorter = store.sorters.find(s => s.field === column.field);

            items.push(
                {
                    text        : 'L{sortAscendingShort}',
                    group       : 'L{sort}',
                    localeClass : me,
                    icon        : 'b-icon b-icon-sort-asc',
                    name        : 'sortAsc',
                    cls         : 'b-separator',
                    weight      : 105,
                    disabled,
                    onDrop      : ({ column }) => store.sort(column.field, true)
                },
                {
                    text        : 'L{sortDescendingShort}',
                    group       : 'L{sort}',
                    localeClass : me,
                    icon        : 'b-icon b-icon-sort-desc',
                    name        : 'sortDesc',
                    weight      : 105,
                    disabled,
                    onDrop      : ({ column }) => store.sort(column.field, false)
                },
                {
                    text        : 'L{addSortAscendingShort}',
                    group       : 'L{multiSort}',
                    localeClass : me,
                    icon        : 'b-icon b-icon-sort-asc',
                    name        : 'multisortAddAsc',
                    disabled    : disabled || (sorter && sorter.ascending),
                    weight      : 105,
                    onDrop      : ({ column }) => store.addSorter(column.field, true)
                }, {
                    text        : 'L{addSortDescendingShort}',
                    group       : 'L{multiSort}',
                    localeClass : me,
                    icon        : 'b-icon b-icon-sort-desc',
                    name        : 'multisortAddDesc',
                    disabled    : disabled || (sorter && !sorter.ascending),
                    weight      : 105,
                    onDrop      : ({ column }) => store.addSorter(column.field, false)
                }, {
                    text        : 'L{removeSorterShort}',
                    group       : 'L{multiSort}',
                    localeClass : me,
                    icon        : 'b-icon b-icon-remove',
                    name        : 'multisortRemove',
                    weight      : 105,
                    disabled    : disabled || !sorter,
                    onDrop      : ({ column }) => store.removeSorter(column.field)
                }
            );
        }
        return items;
    }

    //endregion

    //region Events

    // Intercept sorting by a column that has a custom sorting fn, and inject that fn
    onStoreBeforeSort({ sorters }) {
        const { columns } = this.client;

        for (let i = 0; i < sorters.length; i++) {
            const
                sorter = sorters[i],
                column = (sorter.columnOwned || this.prioritizeColumns) && columns.get(sorter.field);

            if (column?.sortable?.sortFn) {
                sorters[i] = { ...sorter, ...column.sortable, columnOwned : true };
            }
        }
    }

    /**
     * Clicked on header, sort Store.
     * @private
     */
    onElementClick(event) {
        const
            me     = this,
            store  = me.store,
            target = event.target,
            header = DomHelper.up(target, '.b-grid-header.b-sortable'),
            field  = header?.dataset.column;

        if (me.ignoreRe.test(target.className) || me.disabled) {
            return;
        }

        //Header
        if (header && field) {
            const
                column        = me.grid.columns.getById(header.dataset.columnId),
                columnGrouper = store.isGrouped && store.groupers.find(g => g.field === field);

            // The Group feature will handle the change of the grouper's direction
            if (columnGrouper && !event.shiftKey) {
                return;
            }

            if (column.sortable && !event.shiftKey) {
                if (event.ctrlKey && event.altKey) {
                    store.removeSorter(column.field);
                }
                else {
                    const sortBy = {
                        columnOwned : true,
                        field       : column.field
                    };

                    // sortable as a function is handled by onStoreBeforeSort() above

                    if (typeof column.sortable === 'object') {
                        ObjectHelper.assign(sortBy, column.sortable);
                    }

                    store.sort(sortBy, null, event.ctrlKey);
                }
            }
        }
    }

    /**
     * Called when grid headers are rendered, make headers match current sorters.
     * @private
     */
    renderHeader() {
        this.syncHeaderSortState();
    }

    onPaint() {
        this.syncHeaderSortState();
    }

    //endregion
}

Sort.featureClass = 'b-sort';

GridFeatureManager.registerFeature(Sort, true);
