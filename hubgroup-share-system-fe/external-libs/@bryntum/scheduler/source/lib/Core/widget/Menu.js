import Popup from './Popup.js';
import DomHelper from '../helper/DomHelper.js';
import EventHelper from '../helper/EventHelper.js';
import MenuItem from './MenuItem.js';
import Widget from './Widget.js';

const validKeys = {
    ArrowUp    : 1,
    ArrowDown  : 1,
    ArrowRight : 1,
    ArrowLeft  : 1,
    Enter      : 1,
    Escape     : 1
};

/**
 * @module Core/widget/Menu
 */

/**
 * Menu widget, displays a list of items which the user can select from using mouse or keyboard. Can have submenus.
 *
 * @example
 * let menu = new Menu({
 *     forElement : btn.element,
 *     items      : [
 *         {
 *             icon : 'b-icon b-icon-add',
 *             text : 'Add'
 *         },
 *         {
 *             icon : 'b-icon b-icon-trash',
 *             text : 'Remove'
 *         },
 *         {
 *             icon     : 'b-icon b-icon-lock',
 *             disabled : true,
 *             text     : 'I am disabled'
 *         },
 *         {
 *             text : 'Sub menu',
 *             menu : [{
 *                 icon : 'b-icon b-fa-play',
 *                 text : 'Play'
 *             }]
 *         }
 *     ],
 *     // Method is called for all ancestor levels
 *     onItem({ item }) {
 *         Toast.show('You clicked ' + item.text);
 *     }
 * });
 *
 * @classType menu
 * @inlineexample Core/widget/Menu.js
 *
 * @extends Core/widget/Popup
 */
export default class Menu extends Popup {
    //region Config
    static get $name() {
        return 'Menu';
    }

    // Factoryable type name
    static get type() {
        return 'menu';
    }

    static get configurable() {
        return {
            focusable : true,

            align : 't-b',

            scrollAction : 'hide',

            /**
             * Specify false to prevent the menu from getting focus when hovering items
             * @default
             * @config {Boolean}
             */
            focusOnHover : null,

            // We do need a Scroller so that we can use its API to scroll around.
            // But the overflow flags default to false.
            scrollable : false,

            defaultType : 'menuitem',

            tools : {
                // To get rid of the close tool from Popup
                close : false
            }
        };
    }

    //endregion

    /**
     * A descendant menu item has been activated.
     *
     * Note that this event bubbles up through parents and can be
     * listened for on a top level {@link Core.widget.Menu Menu} for convenience.
     * @event item
     * @param {Core.widget.MenuItem} item - The menu item which is being actioned.
     * @param {Core.widget.Menu} menu - Menu containing the menu item
     */

    /**
     * The checked state of a descendant menu item has changed.
     *
     * Note that this event bubbles up through parents and can be
     * listened for on a top level {@link Core.widget.Menu Menu} for convenience.
     * @event toggle
     * @param {Core.widget.MenuItem} item - The menu item whose checked state changed.
     * @param {Core.widget.Menu} menu - Menu containing the menu item
     * @param {Boolean} checked - The _new_ checked state.
     */

    /* break doc comment */

    //region Init

    construct(config) {
        if (Array.isArray(config)) {
            config = {
                lazyItems : config
            };
        }

        super.construct(config);

        EventHelper.on({
            element    : this.element,
            click      : 'onMouseClick',
            mouseover  : 'onMouseOver',
            mouseleave : 'onMouseLeave',
            thisObj    : this
        });
    }

    afterShow(resolveFn) {
        // Don't instantiate all our items' subMenus right now.
        // Use our private _menu property which will still be a config item.
        const
            me = this,
            hasSubmenu = me.items.some(item => Boolean(item._menu));

        // afterShow is called before alignment, so this is the correct time
        // to mutate things which will change this Widget's size.
        if (hasSubmenu) {
            me.element.classList.add('b-menu-with-submenu');
        }

        // Add CSS class to menu if any item has an icon, to allow aligning icon-less items
        const hasIcon = me.items.some(item => item.icon);

        if (hasIcon) {
            me.element.classList.add('b-menu-with-icon');
        }

        super.afterShow(resolveFn);
    }

    createWidget(item) {
        if (typeof item === 'string') {
            item = {
                text : item
            };
        }

        return super.createWidget(item);
    }

    get focusElement() {
        const
            me = this,
            fromParentMenu = me.parentMenu?.element.contains(DomHelper.getActiveElement(me.parentMenu)),
            firstWidget    = me.items[0];

        if (fromParentMenu || !(firstWidget instanceof MenuItem)) {
            return super.focusElement;
        }

        return me.element;
    }

    //endregion

    onDocumentMouseDown(event) {
        // It's not a click outside if its a click on our owner Menu
        if (!this.parentMenu || !this.parentMenu.owns(event.event.target)) {
            super.onDocumentMouseDown(event);
        }
    }

    //region Show

    hide(animate) {
        const me = this;

        // We need to be _hidden when any focused descendants try to revertFocus
        // so that they continue to fall back through the getFocusRevertTarget upward chain.
        super.hide(animate);

        if (me.currentSubMenu && !me.currentSubMenu.isDestroyed) {
            me.currentSubMenu.hide(animate);
        }

        if (me.parentMenu) {
            me.parentMenu.currentSubMenu = null;
        }
    }

    //endregion

    //region Events

    /**
     * Activates a menu item if user clicks on it
     * @private
     */
    onMouseClick(event) {
        const menuItem = event.target.closest('.b-menuitem');

        if (menuItem) {
            this.triggerElement(menuItem, event);

            // IE / Edge still triggers event listeners that were removed in a listener - prevent this
            event.stopImmediatePropagation();
        }
    }

    /**
     * Activates menu items on hover. On real mouse hover, not on a touchstart.
     * @private
     */
    onMouseOver(event) {
        if (this.focusOnHover !== false) {
            const
                fromItemElement = DomHelper.up(event.relatedTarget, '.b-widget'),
                toItemElement   = DomHelper.up(event.target, '.b-widget'),
                overItem        = Widget.fromElement(toItemElement);

            // Activate soon in case they're moving fast over items.
            if (!DomHelper.isTouchEvent && toItemElement && toItemElement !== fromItemElement && overItem.parent === this) {
                this.setTimeout({
                    fn                : 'handleMouseOver',
                    delay             : 30,
                    args              : [overItem],
                    cancelOutstanding : true
                });
            }
        }
    }

    handleMouseOver(overItem) {
        overItem.focus();
    }

    // unselect any menu item if mouse leaves the menu element (unless it enters a child menu)
    onMouseLeave(event) {
        const
            me                = this,
            { relatedTarget } = event,
            leavingToChild    = relatedTarget && me.owns(relatedTarget);

        let targetCmp = relatedTarget && relatedTarget instanceof HTMLElement && Widget.fromElement(relatedTarget),
            shouldHideMenu = !leavingToChild;

        if (targetCmp) {
            while (targetCmp.ownerCmp) {
                targetCmp = targetCmp.ownerCmp;
            }

            // Or was found and does not belong to current menu DOM tree
            // This condition will not allow possibly existing picker to hide
            // Covered by Menu.t.js
            shouldHideMenu &= !DomHelper.getAncestor(targetCmp.element, [event.target]);
        }

        if (!leavingToChild && shouldHideMenu) {
            me.currentSubMenu && me.currentSubMenu.hide();
            me.currentSubMenu = me.selectedElement = null;

            // Deactivate currently active *menu items* on mouseleave
            if (me.element.contains(DomHelper.getActiveElement(me)) && DomHelper.getActiveElement(me).matches('.b-menuitem')) {
                me.focusElement.focus();
            }
        }
    }

    /**
     * Keyboard navigation. Up/down, close with esc, activate with enter
     * @private
     */
    onInternalKeyDown(event) {
        const
            sourceWidget = Widget.fromElement(event),
            isFromWidget = sourceWidget && sourceWidget !== this && !(sourceWidget instanceof MenuItem);

        if (event.key === 'Escape') {
            // Only close this menu if the ESC was in a child input Widget
            (isFromWidget ? this : this.rootMenu).close();
            return;
        }

        super.onInternalKeyDown(event);

        // Do not process keys from certain elements
        if (isFromWidget) {
            return;
        }

        if (validKeys[event.key]) {
            event.preventDefault();
        }

        const
            el = this.element,
            active = DomHelper.getActiveElement(el);

        this.navigateFrom(active !== el && el.contains(active) ? active : null, event.key, event);
    }

    navigateFrom(active, key, event) {
        const
            me         = this,
            treeWalker = me.treeWalker,
            item       = active && me.getItem(active);

        let toActivate;

        switch (key) {
            case 'ArrowUp':
                treeWalker.currentNode = active || (active = me.bottomFocusTrap);
                treeWalker.previousNode();
                toActivate = treeWalker.currentNode;
                break;

            case 'ArrowDown':
                treeWalker.currentNode = active || (active = me.topFocusTrap);
                treeWalker.nextNode();
                toActivate = treeWalker.currentNode;
                break;

            case ' ':
                if (active && !active.classList.contains('b-disabled')) {
                    if (item && item.menu) {
                        me.openSubMenu(active, item);
                    }
                    else {
                        me.triggerElement(active, event);
                    }
                }
                break;

            case 'ArrowRight':
                if (active && item && item.menu && !active.classList.contains('b-disabled')) {
                    // opening with arrow keys highlights first item (as in menus on mac)
                    const openedMenu = me.openSubMenu(active, item);

                    // If show hs not been vetoed, ask it to focus.
                    // Container will delegate focus inward if possible.
                    if (openedMenu) {
                        openedMenu.focus();
                    }
                }
                else {
                    treeWalker.currentNode = active || (active = me.topFocusTrap);
                    treeWalker.nextNode();
                    toActivate = treeWalker.currentNode;
                }
                break;

            case 'ArrowLeft':
                if (me.isSubMenu) {
                    me.hide();
                }
                else if (!active) {
                    treeWalker.currentNode = active || (active = me.topFocusTrap);
                    treeWalker.nextNode();
                    toActivate = treeWalker.currentNode;
                }
                break;

            case 'Enter':
                if (active && !active.classList.contains('b-disabled')) {
                    me.triggerElement(active, event);
                }
                break;
        }

        // Move focus to wherever we have calculated
        if (toActivate) {
            // Previous moved to encapsulating element; wrap from end
            if (toActivate === me.element) {
                me.navigateFrom(me.bottomFocusTrap, 'ArrowUp', event);
            }
            // Next could not move because we're at the end; wrap from top
            else if (toActivate === active) {
                me.navigateFrom(me.topFocusTrap, 'ArrowDown', event);
            }
            else {
                toActivate.focus();
            }
        }
    }

    //endregion

    //region Activate menu item

    getItem(item) {
        // Cannot use truthiness test because index zero may be passed.
        if (item != null) {
            // Access by index
            if (typeof item === 'number') {
                return this.items[item];
            }

            // Access by element
            if (item.nodeType === Element.ELEMENT_NODE) {
                return Widget.fromElement(item, 'menuitem', this.contentElement);
            }

            // Access by id
            return this.items.find(c => c.id == item);
        }
    }

    /**
     * Activate a menu item (from its element)
     * @private
     * @fires item
     * @param menuItemElement
     */
    triggerElement(menuItemElement, event) {
        const item = this.getItem(menuItemElement);

        // If the trigger gesture happened on a non-MenuItem
        // item will be undefined. Do not action on a non-MenuItem
        // or a disabled MenuItem
        if (item && !item.disabled) {
            item.doAction(event);
        }
    }

    /**
     * Returns true if this menu is a sub menu.
     * To find out which menu is the parent, check {@link #property-parentMenu}.
     * @type {Boolean}
     * @readonly
     */
    get isSubMenu() {
        return this === this.owner?.menu;
    }

    /**
     * Opens a submenu anchored to a menu item
     * @private
     * @param element
     * @param item
     */
    openSubMenu(element, item) {
        const
            me = this,
            subMenu = item.menu;

        if (subMenu) {
            if (!subMenu.isVisible) {
                const event = { item, element };

                if (me.trigger('beforeSubMenu', event) === false) {
                    return;
                }
                if (item.onBeforeSubMenu && item.onBeforeSubMenu(event) === false) {
                    return;
                }
                subMenu.show();
            }

            /**
             * Currently open sub menu, if any
             * @member {Core.widget.Menu} currentSubMenu
             * @readonly
             */
            return me.currentSubMenu = subMenu;
        }
    }

    /**
     * Get/set focused menu item.
     * Shows submenu if newly focused item has a menu and is not disabled.
     * @property {HTMLElement}
     */
    set selectedElement(element) {
        const
            me = this,
            lastSelected = me._selectedElement;

        if (lastSelected) {
            const
                lastItem     = me.getItem(lastSelected),
                lastItemMenu = lastItem && lastItem.menu;

            if (lastItemMenu) {
                lastItemMenu.hide();
            }
            lastSelected.classList.remove('b-active');
        }

        me._selectedElement = element;

        // might set to null to deselect
        if (element) {
            const doFocus = DomHelper.isFocusable(element);

            element.classList.add('b-active');
            me.scrollable.scrollIntoView(element, {
                animate : !doFocus,
                focus   : doFocus
            });
        }
    }

    get selectedElement() {
        return this._selectedElement;
    }

    selectFirst() {
        const treeWalker = this.treeWalker;

        treeWalker.currentNode = this.topFocusTrap;
        treeWalker.nextNode();

        // If we are under keyboard control, this must happen in the next
        // animation frame so that the keydown event doesn't fire on the
        // newly focused node.
        this.requestAnimationFrame(() => treeWalker.currentNode.focus());
    }

    //endregion

    //region Close

    /**
     * Gets the parent Menu if this Menu is a submenu, or `undefined`.
     * @property {Core.widget.Menu}
     */
    get parentMenu() {
        let result = this.owner;

        if (result instanceof MenuItem) {
            result = result.owner;
        }
        if (result instanceof Menu) {
            return result;
        }
    }

    /**
     * Gets this menus root menu, the very first menu shown in a sub menu hierarchy
     * @property {Core.widget.Menu}
     * @private
     */
    get rootMenu() {
        let menu = this;

        while (menu.parentMenu && menu.parentMenu instanceof this.constructor) {
            menu = menu.parentMenu;
        }

        return menu;
    }

    //endregion
}

// Register this widget type with its Factory
Menu.initClass();
