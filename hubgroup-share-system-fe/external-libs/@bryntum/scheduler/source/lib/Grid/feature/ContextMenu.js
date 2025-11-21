import VersionHelper from '../../Core/helper/VersionHelper.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import WidgetHelper from '../../Core/helper/WidgetHelper.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import InstancePlugin from '../../Core/mixin/InstancePlugin.js';
import GridFeatureManager from '../feature/GridFeatureManager.js';
import MenuItem from '../../Core/widget/MenuItem.js';

/**
 * @module Grid/feature/ContextMenu
 */

/**
 * **DEPRECATED: This class is deprecated since v4.0.0,
 * use {@link Grid.feature.CellMenu CellMenu} feature for cell context menu and
 * {@link Grid.feature.HeaderMenu HeaderMenu} feature for header context menu instead.**
 *
 * Right click to display context menu for headers and cells.
 *
 * This feature is **off** by default in favor of `CellMenu` and `HeaderMenu`.
 * For info on enabling it, see {@link Grid.view.mixin.GridFeatures}.
 *
 * @extends Core/mixin/InstancePlugin
 * @classtype contextMenu
 * @deprecated 4.0.0
 * @feature
 */
export default class ContextMenu extends InstancePlugin {

    //region Config

    static get $name() {
        return 'ContextMenu';
    }

    static get defaultConfig() {
        return {
            /**
             * Extra items to add to the header context menu. See {@link Core.widget.MenuItem} for more info.
             *
             * ```javascript
             * features : {
             *     contextMenu : {
             *         headerItems : [
             *             { text : 'Header item', onItem : () => ... }
             *         ]
             *     }
             * }
             * ```
             *
             * @config {Object[]}
             */
            headerItems : [],

            /**
             * A function called before displaying the header menu that allows manipulations of its items. Called with a
             * single parameter with format { column, items }. Returning `false` from this function prevents
             * the menu from being shown.
             *
             * ```javascript
             * features : {
             *     contextMenu : {
             *         processHeaderItems({record, items}) {
             *             // Add or remove items here as needed
             *             if (column.field === 'age') {
             *                 items.push({ text: 'Hide youngsters', icon : 'b-fa b-fa-fw b-fa-baby' })
             *             }
             *         }
             *     }
             * }
             * ```
             *
             * @config {Function}
             */
            processHeaderItems : null,

            /**
             * Extra items to add to the cell context menu. See {@link Core.widget.MenuItem} for more info.
             *
             * ```javascript
             * features : {
             *     contextMenu : {
             *         cellItems : [
             *             { text : 'Cell item', onItem : () => ... }
             *         ]
             *     }
             * }
             * ```
             *
             * @config {Object[]}
             */
            cellItems : [],

            /**
             * A function called before displaying the cell menu that allows manipulations of its items. Called with a
             * single parameter with format { record, items }. Returning `false` from this function prevents
             * the menu from being shown.
             *
             * ```javascript
             * features : {
             *     contextMenu : {
             *         processCellItems({record, items}) {
             *             // Add or remove items here as needed
             *             if (record.age > 50) {
             *                 items.push({ text: 'Add extra vacation', icon : 'b-fa b-fa-fw b-fa-umbrella-beach' })
             *             }
             *         }
             *     }
             * }
             * ```
             *
             * @config {Function}
             */
            processCellItems : null,

            /**
             * Event which is used to show context menu.
             * Available options are: 'contextmenu', 'click', 'dblclick'.
             * Default value is used from {@link Grid/view/Grid#config-contextMenuTriggerEvent}
             * @config {String}
             */
            triggerEvent : null,

            // Private config to disable context menu for cells, raised when
            // taskContextMenu is enabled
            disableCellContextMenu : null
        };
    }

    //endregion

    //region Events

    /**
     * Fired from grid before the context menu is shown for a header. Allows manipulation of the items
     * to show in the same way as in `processHeaderItems`. Returning false from a listener prevents the
     * menu from being shown.
     * @event headerContextMenuBeforeShow
     * @deprecated 4.0.0 Renamed to headerMenuBeforeShow
     * @preventable
     * @param {Grid.view.Grid} source
     * @param {Object} items Menu item configs
     * @param {Grid.column.Column} column Column
     */

    /**
     * Fired from grid after showing the context menu for a header
     * @event headerContextMenuShow
     * @deprecated 4.0.0 Renamed to headerMenuShow
     * @preventable
     * @param {Grid.view.Grid} source
     * @param {Core.widget.Menu} menu The menu
     * @param {Grid.column.Column} column Column
     */

    /**
     * Fired from grid before the context menu is shown for a cell. Allows manipulation of the items
     * to show in the same way as in `processCellItems`. Returning false from a listener prevents the
     * menu from being shown.
     * @event cellContextMenuBeforeShow
     * @deprecated 4.0.0 Renamed to cellMenuBeforeShow
     * @preventable
     * @param {Grid.view.Grid} source
     * @param {Object} items Menu item configs
     * @param {Grid.column.Column} column Column
     * @param {Core.data.Model} record Record
     */

    /**
     * Fired from grid after showing the context menu for a cell
     * @event cellContextMenuShow
     * @deprecated 4.0.0 Renamed to cellMenuShow
     * @preventable
     * @param {Grid.view.Grid} source
     * @param {Core.widget.Menu} menu The menu
     * @param {Grid.column.Column} column Column
     * @param {Core.data.Model} record Record
     */

    /**
     * Fired when an item is selected in the context menu.
     * @event contextMenuItem
     * @deprecated 4.0.0 Renamed to cellMenuItem and headerMenuItem
     * @param {Grid.view.Grid} grid The grid
     * @param {Object} item Selected menu item
     * @param {Grid.column.Column} column Column
     * @param {HTMLElement} itemEl Menu item element
     */

    /**
     * Fired when a check item is toggled in the context menu.
     * @event contextMenuToggleItem
     * @deprecated 4.0.0 Renamed to cellMenuToggleItem and headerMenuToggleItem
     * @param {Grid.view.Grid} grid The grid
     * @param {Object} item Selected menu item
     * @param {Grid.column.Column} column Column
     * @param {Boolean} checked Checked or not
     * @param {HTMLElement} itemEl Menu item element
     */

    //endregion

    //region Init

    construct(grid, config) {
        super.construct(grid, config);

        this.grid = grid;

        VersionHelper.deprecate('Grid', '5.0.0', '`ContextMenu` feature is deprecated, in favor of `CellMenu` and `HeaderMenu` features. Please see https://bryntum.com/docs/grid/#Grid/guides/upgrades/3.1.0.md for more information.');

        // If this feature is enabled, need to disable CellMenu and HeaderMenu. They are mutually exclusive.
        if (grid.features.cellMenu) {
            grid.features.cellMenu.disabled = true;
        }

        if (grid.features.headerMenu) {
            grid.features.headerMenu.disabled = true;
        }
    }

    doDestroy() {
        if (this.currentMenu) {
            this.currentMenu.destroy();
        }

        super.doDestroy();
    }

    //endregion

    //region Plugin config

    // Plugin configuration. This plugin chains some of the functions in Grid.
    // The contextmenu event is emulated from a taphold gesture on touch platforms.
    static get pluginConfig() {
        return {
            assign : ['showContextMenu'],
            chain  : [
                'onElementContextMenu',
                'onElementClick',
                'onElementDblClick',
                'onElementKeyDown'
            ]
        };
    }

    //endregion

    //region Events

    onElementContextMenu(event) {
        this.triggerEvent === 'contextmenu' && this.showContextMenu(event);
    }

    onElementClick(event) {
        this.triggerEvent === 'click' && this.showContextMenu(event);
    }

    onElementDblClick(event) {
        this.triggerEvent === 'dblclick' && this.showContextMenu(event);
    }

    onElementKeyDown(event) {
        if (!event.handled && event.target.matches('.b-grid-header.b-depth-0')) {
            switch (event.key) {
                case ' ':
                case 'ArrowDown':
                    this.showContextMenu(event);
                    break;
            }
        }
    }

    /**
     * Show context menu.
     * @param event
     * @on-owner
     * @private
     */
    showContextMenu(event) {
        if (!this.disabled) {
            const
                header   = DomHelper.up(event.target, '.b-grid-header'),
                cellData = this.grid.getCellDataFromEvent(event);

            if (header) {
                this.handleHeaderContextMenu(header, event);
            }
            else if (cellData && !this.disableCellContextMenu) {
                this.handleCellContextMenu(cellData, event);
            }
        }
    }

    handleHeaderContextMenu(header, event) {
        if (header.dataset.column) {
            const
                me        = this,
                grid      = me.grid,
                column    = grid.columns.getById(header.dataset.columnId);

            if (column.enableHeaderContextMenu !== false) {
                const
                    arrayOfItems = [...me.headerItems, ...(column.headerMenuItems || [])],
                    namedItems   = ObjectHelper.transformArrayToNamedObject(arrayOfItems),
                    menu         = {
                        owner       : me.client,
                        constrainTo : document,
                        cls         : 'b-context-menu',

                        scrollAction : 'hide',
                        onItem({ item, element }) {
                            grid.trigger('contextMenuItem', { source : grid, item, column, element });
                        },

                        onToggle({ item, checked, element }) {
                            grid.trigger('contextMenuToggleItem', {
                                source : grid,
                                item,
                                column,
                                checked,
                                element
                            });
                        },

                        onDestroy() {
                            // If menu is destroyed by WidgetHelper, make sure we don't keep a reference to it anymore
                            me.currentMenu = null;
                        },

                        listeners : {
                            show({ source : menu }) {
                                eventParams.menu = menu;
                                grid.trigger('headerContextMenuShow', eventParams);
                            }
                        }
                    };

                // `populateHeaderMenu` is chained by mixins, thus each feature can supply items
                grid.populateHeaderMenu({ column, items : namedItems, menu });

                const
                    items                  = ObjectHelper.transformNamedObjectToArray(namedItems),
                    { processHeaderItems } = me,
                    eventParams            = { items, column, event, element : header };

                ObjectHelper.merge(menu, { items });

                if ((!processHeaderItems || processHeaderItems(eventParams) !== false) && items.length > 0) {
                    event.preventDefault();

                    items.sort((a, b) => ((a.weight || 150) - (b.weight || 150)));

                    // Trigger event that allows preventing menu or manipulating its items
                    if (grid.trigger('headerContextMenuBeforeShow', eventParams) !== false) {
                        // Align to header element when using arrow down key
                        me.currentMenu = WidgetHelper.showContextMenu(event.type === 'keydown' ? header : [event.clientX + 1, event.clientY + 1], menu);

                        // Propagate the operating column down to all MenuItem levels
                        // Will not override if they are preconfigured with a column.
                        me.currentMenu.eachWidget(item => {
                            if (!item.column && item instanceof MenuItem) {
                                item.column = column;
                            }
                        }, true);
                    }
                }
            }
        }
    }

    handleCellContextMenu(cellData, event) {
        const
            me     = this,
            grid   = me.grid,
            column = grid.columns.getById(cellData.columnId);

        if (column.enableCellContextMenu !== false) {

            // Process the gesture as navigation so that the use may select/multiselect
            // the items to include in their context menu operation.
            // Also select if not already selected.
            grid.focusCell(cellData.cellSelector, {
                doSelect : !grid.isSelected(cellData.id),
                event
            });

            const
                record       = cellData.record,
                arrayOfItems = [...(me.cellItems || []), ...(column.cellMenuItems || [])],
                namedItems = ObjectHelper.transformArrayToNamedObject(arrayOfItems);

            // `populateCellMenu` is chained by mixins, thus each feature can supply items
            grid.populateCellMenu({ column, record, items : namedItems });

            const
                items                = ObjectHelper.transformNamedObjectToArray(namedItems),
                { processCellItems } = me,
                cell                 = cellData.cellElement,
                eventParams          = { items, column, event, record, element : cell },
                menu                 = {
                    owner : me.client,
                    items : items,

                    // Load up the item event with the contextual info
                    onBeforeItem : itemEvent => {
                        Object.assign(itemEvent, eventParams);
                    },

                    onItem({ item }) {
                        grid.trigger('contextMenuItem', { source : grid, item, column, record, cell });
                    },

                    onClose({ reason }) {
                        // return focus to grid when context menu is closed, if not cause by clicking outside of grid
                        if (reason !== 'outside') {
                            grid.focus();
                        }
                    },

                    onDestroy() {
                        // If menu is destroyed by WidgetHelper, make sure we don't keep a reference to it anymore
                        me.currentMenu = null;
                    },

                    listeners : {
                        show({ source : menu }) {
                            eventParams.menu = menu;
                            grid.trigger('cellContextMenuShow', eventParams);
                        }
                    }
                };

            if ((!processCellItems || processCellItems(eventParams) !== false) && items.length > 0) {

                items.forEach(item => {
                    item.column = column;
                    item.record = record;
                });

                event.preventDefault();

                items.sort((a, b) => ((a.weight || 150) - (b.weight || 150)));

                // Trigger event that allows preventing menu or manipulating its items
                if (grid.trigger('cellContextMenuBeforeShow', eventParams) !== false) {
                    me.currentMenu = WidgetHelper.showContextMenu([event.clientX + 1, event.clientY + 1], menu);
                }
            }
        }
    }

    /**
     * Hides the context menu
     * @internal
     */
    hideContextMenu(animate) {
        this.currentMenu?.hide(animate);
    }

    //endregion

    //region Getters/Setters

    get triggerEvent() {
        return this._triggerEvent || this.client.contextMenuTriggerEvent;
    }

    set triggerEvent(value) {
        this._triggerEvent = value;
    }

    //endregion

}

ContextMenu.featureClass = '';

GridFeatureManager.registerFeature(ContextMenu);
