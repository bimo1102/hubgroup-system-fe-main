import ContextMenuBase from '../../Core/feature/base/ContextMenuBase.js';
import GridFeatureManager from '../feature/GridFeatureManager.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import VersionHelper from '../../Core/helper/VersionHelper.js';

/**
 * @module Grid/feature/HeaderMenu
 */

/**
 * Right click column header or focus it and press SPACE key to show the context menu for headers.
 *
 * ### Default header menu items
 *
 * The Header menu has no default items provided by the `HeaderMenu` feature, but there are other features
 * that populate the header menu with the following items:
 *
 * | Reference         | Text                              | Weight | Feature                                        | Description                                      |
 * |-------------------|-----------------------------------|--------|------------------------------------------------|--------------------------------------------------|
 * | `filter`          | Filter                            | 100    | {@link Grid.feature.Filter Filter}             | Shows the filter popup to add a filter           |
 * | `editFilter`      | Edit filter                       | 100    | {@link Grid.feature.Filter Filter}             | Shows the filter popup to change/remove a filter |
 * | `removeFilter`    | Remove filter                     | 110    | {@link Grid.feature.Filter Filter}             | Stops filtering by selected column field         |
 * | `toggleFilterBar` | Hide filter bar / Show filter bar | 120    | {@link Grid.feature.FilterBar FilterBar}       | Toggles filter bar visibility                    |
 * | `columnPicker`    | Columns                           | 200    | {@link Grid.feature.ColumnPicker ColumnPicker} | Shows a submenu to control columns visibility    |
 * | \>column.id*      | column.text*                      |        | {@link Grid.feature.ColumnPicker ColumnPicker} | Check item to hide/show corresponding column     |
 * | `hideColumn`      | Hide column                       | 210    | {@link Grid.feature.ColumnPicker ColumnPicker} | Hides selected column                            |
 * | `sortAsc`         | Sort ascending                    | 300    | {@link Grid.feature.Sort Sort}                 | Sort by the column field in ascending order      |
 * | `sortDesc`        | Sort descending                   | 310    | {@link Grid.feature.Sort Sort}                 | Sort by the column field in descending order      |
 * | `multiSort`       | Multi sort                        | 320    | {@link Grid.feature.Sort Sort}                 | Shows a submenu to control multi-sorting         |
 * | \>`addSortAsc`    | Add ascending sorting             | 330    | {@link Grid.feature.Sort Sort}                 | Adds ascending sorter using the column field     |
 * | \>`addSortDesc`   | Add descending sorting            | 340    | {@link Grid.feature.Sort Sort}                 | Adds descending sorter using the column field    |
 * | \>`removeSorter`  | Remove sorter                     | 350    | {@link Grid.feature.Sort Sort}                 | Stops sorting by selected column field           |
 * | `groupAsc`        | Group ascending                   | 400    | {@link Grid.feature.Group Group}               | Group by the column field in ascending order     |
 * | `groupDesc`       | Group descending                  | 410    | {@link Grid.feature.Group Group}               | Group by the column field in descending order     |
 * | `groupRemove`     | Stop grouping                     | 420    | {@link Grid.feature.Group Group}               | Stops grouping                                   |
 *
 * \* - items that are generated dynamically
 *
 * \> - first level of submenu
 *
 * ### Customizing the menu items
 *
 * The menu items in the Header menu can be customized, existing items can be changed or removed,
 * and new items can be added. This is handled using the `items` config of the feature.
 *
 * Add extra items for all columns:
 *
 * ```javascript
 * const grid = new Grid({
 *   features : {
 *     headerMenu : {
 *       items : {
 *         extraItem : { text: 'My header item', icon: 'fa fa-car', weight: 200, onItem : () => ... }
 *       }
 *     }
 *   }
 * });
 * ```
 *
 * It is also possible to add items using columns config. See examples below.
 *
 * Add extra items for a single column:
 *
 * ```javascript
 * const grid = new Grid({
 *   columns: [
 *     {
 *       field: 'name',
 *       text: 'Name',
 *       headerMenuItems: {
 *         columnItem : { text: 'My unique header item', icon: 'fa fa-flask', onItem : () => ... }
 *       }
 *     }
 *   ]
 * });
 * ```
 *
 * Remove built in item:
 *
 * ```javascript
 * const grid = new Grid({
 *   features : {
 *     headerMenu : {
 *       items : {
 *          // Hide 'Stop grouping'
 *          groupRemove : false
 *       }
 *     }
 *   }
 * });
 * ```
 *
 * Customize built in item:
 *
 * ```javascript
 * const grid = new Grid({
 *   features : {
 *     headerMenu : {
 *       items : {
 *          hideColumn : {
 *              text : 'Bye bye column'
 *          }
 *       }
 *     }
 *   }
 * });
 * ```
 *
 * It is also possible to manipulate the default items and add new items in the processing function:
 *
 * ```javascript
 * const grid = new Grid({
 *   features : {
 *     headerMenu : {
 *       processItems({items, record}) {
 *           if (record.cost > 5000) {
 *              items.myItem = { text : 'Split cost' };
 *           }
 *       }
 *     }
 *   }
 * });
 * ```
 *
 * Full information of the menu customization can be found in the "Customizing the Cell menu and the Header menu" guide.
 *
 * This feature is <strong>enabled</strong> by default.
 *
 * @extends Core/feature/base/ContextMenuBase
 * @demo Grid/contextmenu
 * @classtype headerMenu
 * @feature
 *
 * @inlineexample Grid/feature/HeaderMenu.js
 */
export default class HeaderMenu extends ContextMenuBase {
    //region Config

    static get $name() {
        return 'HeaderMenu';
    }

    static get defaultConfig() {
        return {
            /**
             * A function called before displaying the menu that allows manipulations of its items.
             * Returning `false` from this function prevents the menu being shown.
             *
             * ```javascript
             *   features         : {
             *       headerMenu : {
             *           processItems({ column, items }) {
             *               // Add or hide existing items here as needed
             *               items.myAction = {
             *                   text   : 'Cool action',
             *                   icon   : 'b-fa b-fa-fw b-fa-ban',
             *                   onItem : () => console.log('Some coolness'),
             *                   weight : 300 // Move to end
             *               };
             *
             *               // Hide column picker
             *               items.columnPicker.hidden = true;
             *           }
             *       }
             *   },
             * ```
             * @param {Object} context An object with information about the menu being shown
             * @param {Grid.column.Column} context.column The current column
             * @param {Object} context.items An object containing the {@link Core.widget.MenuItem menu item} configs keyed by their id
             * @param {Event} context.event The DOM event object that triggered the show
             * @config {Function}
             * @preventable
             */
            processItems : null,

            /**
             * This is a preconfigured set of items used to create the default context menu.
             *
             * The `items` provided by this feature are listed in the intro section of this class. You can
             * configure existing items by passing a configuration object to the keyed items.
             *
             * To remove existing
             * items, set corresponding keys to `false`
             *
             * ```javascript
             * const scheduler = new Scheduler({
             *     features : {
             *         headerMenu : {
             *             items : {
             *                 filter        : false,
             *                 columnPicker  : false
             *             }
             *         }
             *     }
             * });
             * ```
             *
             * See the feature config in the above example for details.
             *
             * @config {Object} items
             */
            items : null,

            type : 'header',

            // private "hack" to provide backward compatibility for deprecated HeaderContextMenu feature in Scheduler
            _showForTimeAxis : false
        };
    }

    static get pluginConfig() {
        const config = super.pluginConfig;

        config.chain.push('populateHeaderMenu');

        return config;
    }

    //endregion

    //region Events

    /**
     * Fired from grid before the context menu is shown for a header.
     * Allows manipulation of the items to show in the same way as in the {@link #config-processItems}.
     *
     * Returning `false` from a listener prevents the menu from being shown.
     *
     * @event headerMenuBeforeShow
     * @preventable
     * @param {Grid.view.Grid} source The grid
     * @param {Core.widget.Menu} menu The menu
     * @param {Object} items Menu item configs
     * @param {Grid.column.Column} column Column
     */

    /**
     * Fired from grid after the context menu is shown for a header
     * @event headerMenuShow
     * @param {Grid.view.Grid} source The grid
     * @param {Core.widget.Menu} menu The menu
     * @param {Object} items Menu item configs
     * @param {Grid.column.Column} column Column
     */

    /**
     * Fired from grid when an item is selected in the header context menu.
     * @event headerMenuItem
     * @param {Grid.view.Grid} source The grid
     * @param {Core.widget.Menu} menu The menu
     * @param {Core.widget.MenuItem} item Selected menu item
     * @param {Grid.column.Column} column Column
     */

    /**
     * Fired from grid when a check item is toggled in the header context menu.
     * @event headerMenuToggleItem
     * @param {Grid.view.Grid} source The grid
     * @param {Core.widget.Menu} menu The menu
     * @param {Core.widget.MenuItem} item Selected menu item
     * @param {Grid.column.Column} column Column
     * @param {Boolean} checked Checked or not
     */

    //endregion

    onElementKeyDown(event) {
        if (!event.handled && event.target.matches('.b-grid-header.b-depth-0')) {
            switch (event.key) {
                case ' ':
                    this.internalShowContextMenu(this.createContextMenuEventForElement(event.target));
                    break;
            }
        }
    }

    //region Menu handlers

    shouldShowMenu(eventParams) {
        const { column } = eventParams;

        // TODO: remove "this._showForTimeAxis || " when support for HeaderContextMenu feature in Scheduler is dropped.
        return column && column.enableHeaderContextMenu !== false && (this._showForTimeAxis || column !== this.client.timeAxisColumn);
    }

    // TODO: remove "showContextMenu" override completely when support for HeaderContextMenu feature in Scheduler is dropped.
    showContextMenu({ column }) {
        super.showContextMenu(...arguments);

        if (column === this.client.timeAxisColumn && this.menu) {
            // the TimeAxis's context menu probably will cause scrolls because it manipulates the dates.
            // The menu should not hide on scroll when for a TimeAxisColumn
            this.menu.scrollAction = 'realign';
        }
    }

    getDataFromEvent(event) {
        return ObjectHelper.assign(super.getDataFromEvent(event), this.client.getHeaderDataFromEvent(event));
    }

    populateHeaderMenu({ items, column }) {
        if (column?.headerMenuItems) {
            if (Array.isArray(column.headerMenuItems)) {
                VersionHelper.deprecate('Grid', '5.0.0', '`headerMenuItems` column config specified as an array is deprecated, need to specify the config as a named object. Please see https://bryntum.com/docs/grid/#Grid/guides/upgrades/4.0.0.md for more information.');
            }

            // Array works smoothly since number index turns into a key for named object
            ObjectHelper.merge(items, column.headerMenuItems);
        }

        return items;
    }
}

HeaderMenu.featureClass = '';

GridFeatureManager.registerFeature(HeaderMenu, true);
