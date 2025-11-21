import Base from '../../../Core/Base.js';
import Column from '../../column/Column.js';
import GridBase from '../GridBase.js';
import SubGrid from '../SubGrid.js';
import ArrayHelper from '../../../Core/helper/ArrayHelper.js';
import DomHelper from '../../../Core/helper/DomHelper.js';
import ObjectHelper from '../../../Core/helper/ObjectHelper.js';

/**
 * @module Grid/view/mixin/GridSubGrids
 */

/**
 * Mixin for grid that handles SubGrids. Each SubGrid is scrollable horizontally separately from the other SubGrids.
 * Having two SubGrids allows you to achieve what is usually called locked or frozen columns.
 *
 * By default a Grid has two SubGrids, one named 'locked' and one 'normal'. The `locked` region has fixed width, while
 * the `normal` region grows to fill all available width (flex).
 *
 * Which SubGrid a column belongs to is determined using its {@link Grid.column.Column#config-region} config. For
 * example to put a column into the locked region, specify `{ region: 'locked' }`. For convenience, a column can be put
 * in the locked region using `{ locked: true }`.
 *
 * ```javascript
 * new Grid({
 *   columns : [
 *     // These two columns both end up in the "locked" region
 *     { field: 'name', text: 'Name', locked: true }
 *     { field: 'age', text: 'Age', region: 'locked' }
 *   ]
 * });
 * ```
 *
 * To customize the SubGrids, use {@link Grid.view.Grid#config-subGridConfigs}:
 *
 * ```javascript
 * // change the predefined subgrids
 * new Grid({
 *   subGridConfigs : {
 *       locked : { flex : 1 } ,
 *       normal : { flex : 3 }
 *   }
 * })
 *
 * // or define your own entirely
 * new Grid({
 *   subGridConfigs : {
 *       a : { width : 150 } ,
 *       b : { flex  : 1 },
 *       c : { width : 150 }
 *   },
 *
 *   columns : [
 *       { field : 'name', text : 'Name', region : 'a' },
 *       ...
 *   ]
 * })
 * ```
 *
 * @demo Grid/lockedcolumns
 * @mixin
 */
export default Target => class GridSubGrids extends (Target || Base) {
    static get $name() {
        return 'GridSubGrids';
    }

    static get properties() {
        return {
            /**
             * An object containing the {@link Grid.view.SubGrid} region instances, indexed by subGrid id ('locked', normal'...)
             * @property {Object} subGrids
             * @type {Object}
             * @readonly
             * @category Common
             */
            subGrids : {}
        };
    }

    //region Init

    changeSubGridConfigs(configs) {
        const
            me                 = this,
            usedRegions        = new Set();

        for (const column of me.columns) {
            const { region } = column;

            // Allow specifying regions for undefined subgrids
            if (region) {
                if (!configs[region]) {
                    configs[region] = {};
                }
                usedRegions.add(region);
            }
        }

        // Implementer has provided configs for other subGrids but not normal, put defaults in place
        if (configs.normal && ObjectHelper.isEmpty(configs.normal)) {
            configs.normal = GridBase.defaultConfig.subGridConfigs.normal;
        }

        for (const region of usedRegions) {
            me.createSubGrid(region, configs[region]);
        }

        // Add them to Grid
        me.items = me.subGrids;

        return configs;
    }

    createSubGrid(region, config = null) {
        const
            me             = this,
            subGridColumns = me.columns.makeChained(column => column.region === region, ['region']),
            subGridConfig  = ObjectHelper.assign({
                type        : 'subgrid',
                id          : `${me.id}-${region}Subgrid`,
                grid        : me,
                region      : region,
                headerClass : me.headerClass,
                footerClass : me.footerClass,
                columns     : subGridColumns,
                // Sort by region unless weight is explicitly defined
                weight      : region
            }, config || me.subGridConfigs[region]);

        let hasCalculatedWidth = false;

        if (!subGridConfig.flex && !subGridConfig.width) {
            subGridConfig.width = subGridColumns.totalFixedWidth;
            hasCalculatedWidth = true;
        }

        // Subclasses may inject a type property to create custom SubGrids
        const subGrid = me.subGrids[region] = SubGrid.create(subGridConfig);

        // Must be set after creation, otherwise reset in SubGrid#set width
        subGrid.hasCalculatedWidth = hasCalculatedWidth;

        if (region === me.regions[0]) {
            // Have already done lookups for this in a couple of places, might as well store it...
            subGrid.isFirstRegion = true;
        }

        return subGrid;
    }

    // A SubGrid is added to Grid, add its header etc too
    onChildAdd(subGrid) {
        if (subGrid.isSubGrid) {
            const
                me    = this,
                {
                    items,
                    headerContainer,
                    virtualScrollers,
                    footerContainer
                }     = me,
                // 2 elements per index, actual element + splitter
                index = items.indexOf(subGrid) * 2;

            if (!me.hideHeaders) {
                DomHelper.insertAt(headerContainer, subGrid.headerSplitter, index);
                DomHelper.insertAt(headerContainer, subGrid.header.element, index);
            }

            DomHelper.insertAt(virtualScrollers, subGrid.scrollerSplitter, index);
            DomHelper.insertAt(virtualScrollers, subGrid.virtualScrollerElement, index);

            DomHelper.insertAt(footerContainer, subGrid.footerSplitter, index);
            DomHelper.insertAt(footerContainer, subGrid.footer.element, index);

            // Show splitter for all except last (new might not sort last, depending on weight)
            items.forEach((subGrid, i) => {
                if (i < items.length - 1) {
                    subGrid.showSplitter();
                }
            });
        }

        return super.onChildAdd(subGrid);
    }

    // A SubGrid is remove from grid, remove its header etc too
    onChildRemove(subGrid) {
        super.onChildRemove(subGrid);

        if (subGrid.isSubGrid) {
            const { items } = this;

            delete this.subGrids[subGrid.region];
            ArrayHelper.remove(this.regions, subGrid.region);
            subGrid.destroy();

            // Make sure the new last splitter is hidden
            if (items.length) {
                items[items.length - 1].hideSplitter();
            }
        }
    }

    doDestroy() {
        this.eachSubGrid(subGrid => subGrid.destroy());
        super.doDestroy();
    }

    //endregion

    //region Iteration & calling

    /**
     * Iterate over all subGrids, calling the supplied function for each.
     * @param {Function} fn Function to call for each instance
     * @param {Object} thisObj `this` reference to call the function in, defaults to the subGrid itself
     * @category SubGrid
     * @internal
     */
    eachSubGrid(fn, thisObj = null) {
        this.items.forEach((subGrid, i) => {
            subGrid.isSubGrid && fn.call(thisObj || subGrid, subGrid, i++);
        });
    }

    /**
     * Call a function by name for all subGrids (that have the function).
     * @param {String} fnName Name of function to call, uses the subGrid itself as `this` reference
     * @param params Parameters to call the function with
     * @return {*} Return value from first SubGrid is returned
     * @category SubGrid
     * @internal
     */
    callEachSubGrid(fnName, ...params) {
        // TODO: make object { normal: retval, locked: retval } to return? or store. revisit when needed
        let returnValue = null;
        this.items.forEach((subGrid, i) => {
            if (subGrid[fnName]) {
                const partialReturnValue = subGrid[fnName](...params);
                if (i === 0) returnValue = partialReturnValue;
            }
        });
        return returnValue;
    }

    //endregion

    //region Getters

    get regions() {
        return this.items.map(item => item.region);
    }

    /**
     * This method should return names of the two last regions in the grid as they are visible in the UI. In case
     * `regions` property cannot be trusted, use different approach. Used by SubGrid and RegionResize to figure out
     * which region should collapse or expand.
     * @returns {String[]}
     * @private
     * @category SubGrid
     */
    getLastRegions() {
        const result = this.regions.slice(-2);
        // ALWAYS return array of length 2 in order to avoid extra conditions. Normally should not be called with 1 region
        return result.length === 2 ? result : [result[0], result[0]];
    }

    /**
     * This method should return right neighbour for passed region, or left neighbour in case last visible region is passed.
     * This method is used to decide which subgrid should take space of the collapsed one.
     * @param {String} region
     * @returns {String}
     * @private
     * @category SubGrid
     */
    getNextRegion(region) {
        const regions = this.regions;

        // return next region or next to last
        return regions[regions.indexOf(region) + 1] || regions[regions.length - 2];
    }

    getPreviousRegion(region) {
        return this.regions[this.regions.indexOf(region) - 1];
    }

    /**
     * Returns the subGrid for the specified region.
     * @param {String} region Region, eg. locked or normal (per default)
     * @returns {Grid.view.SubGrid} A subGrid
     * @category SubGrid
     */
    getSubGrid(region) {
        return this.subGrids[region];
    }

    /**
     * Get the SubGrid that contains specified column
     * @param {String|Grid.column.Column} column Column "name" or column object
     * @returns {Grid.view.SubGrid}
     * @category SubGrid
     */
    getSubGridFromColumn(column) {
        column = column instanceof Column ? column : this.columns.getById(column) || this.columns.get(column);

        return this.getSubGrid(column.region);
    }

    //endregion

    /**
     * Returns splitter element for subgrid
     * @param {Grid.view.SubGrid|String} subGrid
     * @returns {HTMLElement}
     * @private
     * @category SubGrid
     */
    resolveSplitter(subGrid) {
        const regions = this.getLastRegions();

        let region = subGrid instanceof SubGrid ? subGrid.region : subGrid;

        if (regions[1] === region) {
            region = regions[0];
        }

        return this.subGrids[region].splitterElement;
    }

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement thus.
    get widgetClass() {}
};
