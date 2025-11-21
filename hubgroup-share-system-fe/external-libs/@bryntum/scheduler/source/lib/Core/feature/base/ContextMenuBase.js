import InstancePlugin from '../../mixin/InstancePlugin.js';
import Menu from '../../widget/Menu.js';
import Objects from '../../helper/util/Objects.js';
import DomHelper from '../../helper/DomHelper.js';
import StringHelper from '../../helper/StringHelper.js';
import Rectangle from '../../helper/util/Rectangle.js';
import VersionHelper from '../../helper/VersionHelper.js';
import EventHelper from '../../helper/EventHelper.js';

/**
 * @module Core/feature/base/ContextMenuBase
 */

/**
 * Abstract base class used by other context menu features.
 * @extends Core/mixin/InstancePlugin
 * @abstract
 */
export default class ContextMenuBase extends InstancePlugin {
    static get $name() {
        return 'ContextMenuBase';
    }

    //region Config

    static get configurable() {
        return {
            /**
             * This is a type of the context menu used to generate correct names for methods and events.
             * Should be in camel case. Required to be set in subclass.
             * @config {String}
             * @readonly
             */
            type : null,

            /**
             * Gets the Menu instance that this feature is using.
             * @member {Core.widget.Menu} menu
             * @readonly
             */
            /**
             * A config which will be applied when creating the Menu component.
             * @config {Object}
             */
            menu : {
                $config : ['lazy', 'nullify'],
                value   : {
                    type         : 'menu',
                    autoShow     : false,
                    closeAction  : 'hide',
                    scrollAction : 'hide',
                    constrainTo  : window
                }
            },

            /**
             * A config which will be applied when creating the Menu component.
             * @config {Object}
             * @deprecated 4.0.5 Use {@link #config-menu} instead.
             */
            menuConfig : null,

            /**
             * {@link Core.widget.Menu Menu} items object containing named child menu items to apply to the feature's
             * provided context menu.
             *
             * This may add extra items as below, but may also remove any of the default items by configuring the name
             * of the item as `false`
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
             *             add : false // We do not want the "Add" submenu to be available
             *         }
             *     }
             * }
             * ```
             *
             * @config {Object}
             */
            items : {},

            /**
             * Event which is used to show context menu.
             * Available options are: 'contextmenu', 'click', 'dblclick'.
             * Default value is used from {@link Grid/view/GridBase#config-contextMenuTriggerEvent}
             * @config {String}
             */
            triggerEvent : false
        };
    }

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

    //region Init

    construct(...args) {
        const config = args[args.length === 1 ? 0 : 1];

        // Copy deprecated config into its correct place.
        if (config && ('menuConfig' in config)) {
            VersionHelper.deprecate('Grid', '5.0.0', '`menuConfig` attribute deprecated, in favour of `menu`');
            config.menu = config.menuConfig;
        }

        super.construct(...args);

        if (!this.type?.length) {
            throw new Error(`Config 'type' is required to be specified for context menu`);
        }
    }

    //endregion

    //region Events

    /**
     * Fired from the owning widget when an item is selected in the context menu.
     * @event contextMenuItem
     * @param {Core.widget.Widget} source The owning widget
     * @param {Core.widget.Menu} menu The menu
     * @param {Object} item Selected menu item
     */

    /**
     * Fired from the owning widget when a check item is toggled in the context menu.
     * @event contextMenuToggleItem
     * @param {Core.widget.Widget} source The owning widget
     * @param {Core.widget.Menu} menu The menu
     * @param {Object} item Selected menu item
     * @param {Boolean} checked Checked or not
     */

    onElementContextMenu(event) {
        this.onElementEvent(event);
    }

    onElementClick(event) {
        this.onElementEvent(event);
    }

    onElementDblClick(event) {
        this.onElementEvent(event);
    }

    onElementEvent(event) {
        this.triggerEvent === event.type && this.internalShowContextMenu(event);
    }

    onElementKeyDown(event) {
    }

    //endregion

    //region Menu handlers

    internalShowContextMenu(event) {
        const me = this;

        if (me.disabled) {
            return;
        }

        const data = me.getDataFromEvent(event);

        if (me.shouldShowMenu(data)) {
            me.showContextMenu(data);
        }
    }

    getDataFromEvent(event) {
        return {
            event,
            targetElement : this.getTargetElementFromEvent(event)
        };
    }

    getTargetElementFromEvent(event) {
        return event.target;
    }

    /**
     * Shows the context menu.
     * @param {Event} event The initiating event.
     * @param {Object|HTMLElement} [alignSpec] Menu alignment specification, or an element to align to
     * @param {HTMLElement|Core.helper.util.Rectangle} alignSpec.target The Element or Rectangle to align to.
     * @param {Boolean} [alignSpec.anchor] True to show a pointer arrow connecting to the target. Defaults to false.
     * @param {Boolean} [alignSpec.overlap] True to allow this to overlap the target.
     * @param {String} alignSpec.align The alignment specification string, `[trbl]n-[trbl]n`.
     * @on-owner
     */
    showContextMenu(domEvent, alignSpec) {
        const
            me          = this,
            menuContext = DomHelper.isDOMEvent(domEvent) ? me.getDataFromEvent(domEvent) : domEvent;

        // If our menu was visible from last invocation, hide it.
        // Apps may need the ${type}MenuShow event which is triggered in onShow.
        me._menu?.hide();

        if (me.disabled) {
            return;
        }

        /**
         * @member {Object} menuContext
         * An informational object containing contextual information about the last activation
         * of the context menu. The base properties are listed below. Some subclasses may add extra
         * contextual information such as `eventRecord` and `resourceRecord` to the block.
         * @property {Event} menuContext.event The initiating event.
         * @property {Number[]} menuContext.point The client `X` and `Y` position of the initiating event.
         * @property {HTMLElement} menuContext.targetElement The target to which the menu is being applied.
         * @property {Object} menuContext.items The context menu **configuration** items.
         * @property {Core.data.Model[]} menuContext.selection The record selection in the client (Grid, Scheduler, Gantt or Calendar).
         * @readonly
         */
        me.menuContext = menuContext;

        const
            {
                type,
                client,
                processItems
            }         = me,
            { event } = menuContext,
            elCenter  = event ?? Rectangle.from(menuContext.targetElement).center;

        Objects.assign(menuContext, {
            point     : event ? [event.clientX + 1, event.clientY + 1] : [elCenter.x, elCenter.y],
            items     : {},
            selection : me.client.selectedRecords
        });

        // Call the chainable method which other features use to add or remove their own menu items.
        me.callChainablePopulateMenuMethod(menuContext);

        // Merge with user defined items
        Objects.merge(menuContext.items, me.baseItems);

        // Allow user a chance at processing the items and preventing the menu from showing
        if ((!processItems || processItems(menuContext) !== false) && me.hasActiveMenuItems(menuContext)) {
            me.populateItemsWithData(menuContext);
            me.preventDefaultEvent(menuContext);

            // beforeContextMenuShow is a lifecycle method which may be implemented in subclasses to preprocess the event.
            if (me.beforeContextMenuShow(menuContext) !== false) {
                // Trigger event that allows preventing menu or manipulating its items
                if (client.trigger(`${type}MenuBeforeShow`, menuContext) !== false &&
                    // TODO: cellContextMenuBeforeShow and headerContextMenuBeforeShow events are deprecated in ContextMenu feature
                    client.trigger(`${type}ContextMenuBeforeShow`, menuContext) !== false
                ) {
                    me.menu.items = menuContext.items;
                    if (alignSpec) {
                        me.menu.showBy(alignSpec);
                    }
                    else {
                        me.menu.showByPoint(menuContext.point);
                    }

                    // Any drag drop type action should hide the menu
                    me.touchMoveDetacher?.();
                    me.touchMoveDetacher = EventHelper.on({
                        element   : client.element,
                        touchmove : () => me.menu.hide(),
                        once      : true
                    });
                }
            }
        }
    }

    /**
     * Returns the base, configured-in menu items set from the configured items, taking into
     * account the namedItems the feature offers.
     * @property {Object[]}
     * @readonly
     * @internal
     */
    get baseItems() {
        if (!this._baseItems) {
            const
                me             = this,
                { namedItems } = me,
                baseItems      = (me._baseItems = Objects.assign({}, me.items));

            // Substitute any named items into any of our items that reference them.
            for (const ref in baseItems) {
                const item = baseItems[ref];

                if (item) {
                    // If this class or instance has a "namedItems" object
                    // named by this ref, then use it as the basis for the item
                    if (namedItems && (ref in namedItems)) {
                        baseItems[ref] = typeof item === 'object' ? Objects.merge(Objects.clone(namedItems[ref]), item) : namedItems[ref];
                    }
                    else if (item === true) {
                        delete baseItems[ref];
                    }
                }
            }
        }

        return this._baseItems;
    }

    /**
     * Hides the context menu
     * @internal
     */
    hideContextMenu(animate) {
        this.menu?.hide(animate);
    }

    callChainablePopulateMenuMethod(eventParams) {
        // For example `populateCellMenu`
        this.client[`populate${StringHelper.capitalize(this.type)}Menu`]?.(eventParams);
    }

    createContextMenuEventForElement(targetElement) {
        const
            targetPoint      = Rectangle.from(targetElement).center,
            contextmenuEvent = new MouseEvent(this.triggerEvent, {
                clientX : targetPoint.x,
                clientY : targetPoint.y
            });

        Object.defineProperty(contextmenuEvent, 'target', {
            get() {
                return targetElement;
            }
        });

        return contextmenuEvent;
    }

    hasActiveMenuItems(eventParams) {
        return Object.values(eventParams.items).some(item => item);
    }

    /**
     * Override this function and return `false` to prevent the context menu from being shown. Returns `true` by default.
     * @return {Boolean}
     * @internal
     */
    shouldShowMenu() {
        return true;
    }

    beforeContextMenuShow(eventParams) {}

    populateItemsWithData(eventParams) {}

    preventDefaultEvent(eventParams) {
        eventParams.event?.preventDefault();
    }

    //endregion

    //region Configurables

    changeTriggerEvent(triggerEvent) {
        return triggerEvent || this.client.contextMenuTriggerEvent;
    }

    changeMenu(menu, oldMenu) {
        const
            me = this,
            {
                client,
                type
            } = me;

        if (menu) {
            return Menu.reconfigure(oldMenu, menu ? Menu.mergeConfigs({
                owner       : client,
                rootElement : client.rootElement,
                onItem(itemEvent) {
                    client.trigger(`${type}MenuItem`, itemEvent);
                    // TODO: contextMenuItem event is deprecated in ContextMenu feature
                    client.trigger('contextMenuItem', itemEvent);
                    // TODO: eventContextMenuItem event and schedulerContextMenuItem event are deprecated
                    client.trigger(`${type}ContextMenuItem`, itemEvent);
                },
                onToggle(itemEvent) {
                    client.trigger(`${type}MenuToggleItem`, itemEvent);
                    // TODO: contextMenuToggleItem event is deprecated in ContextMenu feature
                    client.trigger('contextMenuToggleItem', itemEvent);
                },
                onDestroy() {
                    me.menu = null;
                },
                // Load up the item event with the contextual info
                onBeforeItem(itemEvent) {
                    Object.assign(itemEvent, me.menuContext);
                },
                onShow({ source : menu }) {
                    me.menuContext.menu = menu;
                    client.trigger(`${type}MenuShow`, me.menuContext);
                    // TODO: cellContextMenuShow and headerContextMenuShow events are deprecated in ContextMenu feature
                    client.trigger(`${type}ContextMenuShow`, me.menuContext);
                }
            }, menu) : null, me);
        }
        else if (oldMenu?.isWidget) {
            oldMenu.destroy();
        }
    }

    //endregion

}
