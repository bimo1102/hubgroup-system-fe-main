import ContextMenuBase from '../../Core/feature/base/ContextMenuBase.js';
import GridFeatureManager from '../feature/GridFeatureManager.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import VersionHelper from '../../Core/helper/VersionHelper.js';

/**
 * @module Grid/feature/CellMenu
 */

/**
 * Right click to display context menu for cells.
 *
 * ### Default cell menu items
 *
 * The Cell menu feature provides only one item by default and all the other items are populated by the other features:
 *
 * | Reference              | Text             | Weight | Feature                            | Description                                           |
 * |------------------------|------------------|--------|------------------------------------|-------------------------------------------------------|
 * | `removeRow`            | Delete record    | 100    | *This feature*                     | Remove record from the store                          |
 * | `search`               | Search for value | 200    | {@link Grid.feature.Search Search} | Search for the selected cell text                     |
 * | `filterDateEquals`     | On               | 300    | {@link Grid.feature.Filter Filter} | Filters by the column field, equal to the cell value  |
 * | `filterDateBefore`     | Before           | 310    | {@link Grid.feature.Filter Filter} | Filters by the column field, less than the cell value |
 * | `filterDateAfter`      | After            | 320    | {@link Grid.feature.Filter Filter} | Filters by the column field, more than the cell value |
 * | `filterNumberEquals`   | Equals           | 300    | {@link Grid.feature.Filter Filter} | Filters by the column field, equal to the cell value  |
 * | `filterNumberLess`     | Less than        | 310    | {@link Grid.feature.Filter Filter} | Filters by the column field, less than the cell value |
 * | `filterNumberMore`     | More than        | 320    | {@link Grid.feature.Filter Filter} | Filters by the column field, more than the cell value |
 * | `filterDurationEquals` | Equals           | 300    | {@link Grid.feature.Filter Filter} | Filters by the column field, equal to the cell value  |
 * | `filterDurationLess`   | Less than        | 310    | {@link Grid.feature.Filter Filter} | Filters by the column field, less than the cell value |
 * | `filterDurationMore`   | More than        | 320    | {@link Grid.feature.Filter Filter} | Filters by the column field, more than the cell value |
 * | `filterStringEquals`   | Equals           | 300    | {@link Grid.feature.Filter Filter} | Filters by the column field, equal to the cell value  |
 * | `filterRemove`         | Remove filter    | 400    | {@link Grid.feature.Filter Filter} | Stops filtering by selected column field              |
 *
 * ### Customizing the menu items
 *
 * The menu items in the Cell menu can be customized, existing items can be changed or removed,
 * and new items can be added. This is handled using the `items` config of the feature.
 *
 * Add extra items for all columns:
 *
 * ```javascript
 * const grid = new Grid({
 *   features : {
 *     cellMenu : {
 *       items : {
 *          extraItem : { text: 'My cell item', icon: 'fa fa-bus', weight: 200, onItem : () => ... }
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
 *       field: 'city',
 *       text: 'City',
 *       cellMenuItems: {
 *         columnItem : { text: 'My unique cell item', icon: 'fa fa-beer', onItem : () => ... }
 *       }
 *     }
 *   ]
 * });
 * ```
 *
 * Remove existing item:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     features : {
 *         cellMenu : {
 *             items : {
 *                 removeRow : false
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * Customize existing item:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     features : {
 *         cellMenu : {
 *             items : {
 *                 removeRow : {
 *                     text : 'Throw away',
 *                     icon : 'b-fa b-fa-dumpster'
 *                 }
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * It is also possible to manipulate the default items and add new items in the processing function:
 *
 * ```javascript
 * const grid = new Grid({
 *   features : {
 *     cellMenu : {
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
 * Full information of the menu customization can be found in the ["Customizing the Cell menu and the Header menu"](#Grid/guides/customization/contextmenu.md)
 * guide.
 *
 * This feature is **enabled** by default.
 *
 * @extends Core/feature/base/ContextMenuBase
 * @demo Grid/contextmenu
 * @classtype cellMenu
 * @inlineexample Grid/feature/CellMenu.js
 * @feature
 */
export default class CellMenu extends ContextMenuBase {
    //region Config

    static get $name() {
        return 'CellMenu';
    }

    static get defaultConfig() {
        return {
            /**
             * A function called before displaying the menu that allows manipulations of its items.
             * Returning `false` from this function prevents the menu being shown.
             *
             * ```javascript
             *   features         : {
             *      cellMenu : {
             *           processItems({ items, record, column }) {
             *               // Add or hide existing items here as needed
             *               items.myAction = {
             *                   text   : 'Cool action',
             *                   icon   : 'b-fa b-fa-fw b-fa-ban',
             *                   onItem : () => console.log(`Clicked ${record.name}`),
             *                   weight : 1000 // Move to end
             *               };
             *
             *               if (!record.allowDelete) {
             *                   items.removeRow.hidden = true;
             *               }
             *           }
             *       }
             *   },
             * ```
             * @param {Object} context An object with information about the menu being shown
             * @param {Core.data.Model} context.record The record representing the current row
             * @param {Grid.column.Column} context.column The current column
             * @param {Object} context.items An object containing the {@link Core.widget.MenuItem menu item} configs keyed by their id
             * @param {Event} context.event The DOM event object that triggered the show
             * @config {Function}
             * @preventable
             */
            processItems : null,

            /**
             * {@link Core.widget.Menu Menu} items object containing named child menu items to apply to the feature's
             * provided context menu.
             *
             * This may add extra items as below, but you can also configure, or remove any of the default items by
             * configuring the name of the item as `false`
             *
             * ```javascript
             * features : {
             *     cellMenu : {
             *         // This object is applied to the Feature's predefined default items
             *         items : {
             *             switchToDog : {
             *                 text : 'Dog',
             *                 icon : 'b-fa b-fa-fw b-fa-dog',
             *                 onItem({contextRecord}) {
             *                     contextRecord.dog = true;
             *                     contextRecord.cat = false;
             *                 },
             *                 weight : 500     // Make this second from end
             *             },
             *             switchToCat : {
             *                 text : 'Cat',
             *                 icon : 'b-fa b-fa-fw b-fa-cat',
             *                 onItem({contextRecord}) {
             *                     contextRecord.dog = false;
             *                     contextRecord.cat = true;
             *                 },
             *                 weight : 510     // Make this sink to end
             *             },
             *             removeRow : {
             *                 // Change icon for the delete item
             *                 icon : 'b-fa b-fa-times'
             *             }
             *         }
             *     }
             * }
             * ```
             *
             * @config {Object}
             */
            items : null,

            type : 'cell'
        };
    }

    static get pluginConfig() {
        const config = super.pluginConfig;

        config.chain.push('populateCellMenu');

        return config;
    }

    //endregion

    //region Events

    /**
     * Fired from grid before the context menu is shown for a cell.
     * Allows manipulation of the items to show in the same way as in the {@link #config-processItems}.
     *
     * Returning `false` from a listener prevents the menu from being shown.
     *
     * @event cellMenuBeforeShow
     * @preventable
     * @param {Grid.view.Grid} source The grid
     * @param {Core.widget.Menu} menu The menu
     * @param {Object} items Menu item configs
     * @param {Grid.column.Column} column Column
     * @param {Core.data.Model} record Record
     */

    /**
     * Fired from grid after the context menu is shown for a cell.
     * @event cellMenuShow
     * @param {Grid.view.Grid} source The grid
     * @param {Core.widget.Menu} menu The menu
     * @param {Object} items Menu item configs
     * @param {Grid.column.Column} column Column
     * @param {Core.data.Model} record Record
     */

    /**
     * Fired from grid when an item is selected in the cell context menu.
     * @event cellMenuItem
     * @param {Grid.view.Grid} source The grid
     * @param {Core.widget.Menu} menu The menu
     * @param {Core.widget.MenuItem} item Selected menu item
     * @param {Grid.column.Column} column Column
     * @param {Core.data.Model} record Record
     */

    /**
     * Fired from grid when a check item is toggled in the cell context menu.
     * @event cellMenuToggleItem
     * @param {Grid.view.Grid} source The grid
     * @param {Core.widget.Menu} menu The menu
     * @param {Core.widget.MenuItem} item Selected menu item
     * @param {Grid.column.Column} column Column
     * @param {Core.data.Model} record Record
     * @param {Boolean} checked Checked or not
     */

    //endregion

    //region Menu handlers

    showContextMenu(eventParams) {
        const
            me = this,
            {
                cellSelector,
                id,
                event
            }  = eventParams;

        // Process the gesture as navigation so that the use may select/multiselect
        // the items to include in their context menu operation.
        // Also select if not already selected.
        me.client.focusCell(cellSelector, {
            doSelect : !me.client.isSelected(id),
            event
        });

        super.showContextMenu(eventParams);
    }

    shouldShowMenu({ column }) {
        return column && column.enableCellContextMenu !== false;
    }

    getDataFromEvent(event) {
        return ObjectHelper.assign(super.getDataFromEvent(event), this.client.getCellDataFromEvent(event));
    }

    beforeContextMenuShow(eventParams) {
        if (!eventParams.record || eventParams.record.isSpecialRow) {
            eventParams.items.removeRow = false;
        }
    }

    //endregion

    //region Getters/Setters

    populateCellMenu({ items, column }) {
        const { client } = this;

        if (column?.cellMenuItems) {
            if (Array.isArray(column.cellMenuItems)) {
                VersionHelper.deprecate('Grid', '5.0.0', '`cellMenuItems` column config specified as an array is deprecated, need to specify the config as a named object. Please see https://bryntum.com/docs/grid/#Grid/guides/upgrades/4.0.0.md for more information.');
            }

            // Array works smoothly since number index turns into a key for named object
            ObjectHelper.merge(items, column.cellMenuItems);
        }

        if (!client.readOnly) {
            items.removeRow = {
                text        : 'L{removeRow}',
                localeClass : this,
                icon        : 'b-fw-icon b-icon-trash',
                name        : 'removeRow',
                cls         : 'b-separator',
                weight      : 100,
                onItem      : () => client.store.remove(client.selectedRecords)
            };

            if (!client.showRemoveRowInContextMenu) {
                VersionHelper.deprecate('Grid', '5.0.0', '`showRemoveRowInContextMenu` config is deprecated, in favor of `CellMenu` feature configuration. Please see https://bryntum.com/docs/grid/#Grid/guides/upgrades/4.0.0.md for more information.');
                items.removeRow = false;
            }
        }
    }

    get showMenu() {
        return true;
    }

    //endregion
}

CellMenu.featureClass = '';

GridFeatureManager.registerFeature(CellMenu, true, ['Grid', 'Scheduler']);
GridFeatureManager.registerFeature(CellMenu, false, ['Gantt']);
