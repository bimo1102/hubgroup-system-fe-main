import DomClassList from '../helper/util/DomClassList.js';
import Menu from './Menu.js';
import Widget from './Widget.js';
import DomHelper from '../helper/DomHelper.js';

/**
 * @module Core/widget/MenuItem
 */

const
    bIcon = /^b-icon-/,
    bFa   = /^b-fa-/;

/**
 * A widget representing a single menu item in a {@link Core.widget.Menu}. May be configured with a
 * {@link #config-checked} state which creates a checkbox which may be toggled. Can also be
 * {@link Core.widget.Widget#config-disabled}, which affects item appearance and blocks interactions.
 *
 * Fires events when activated which bubble up through the parent hierarchy
 * and may be listened for on an ancestor. See {@link Core.widget.Menu Menu}
 * for more details on usage.
 *
 * @extends Core/widget/Widget
 * @classType menuitem
 */
export default class MenuItem extends Widget {
    //region Config
    static get $name() {
        return 'MenuItem';
    }

    // Factoryable type name
    static get type() {
        return 'menuitem';
    }

    static get configurable() {
        return {
            /**
             * If configured with a `Boolean` value, a checkbox is displayed
             * as the start icon, and the {@link #event-toggle} event is fired
             * when the checked state changes.
             * @config {Boolean}
             */
            checked : null,

            /**
             * Indicates that this menu item is part of a group where only one can be checked. Assigning a value
             * also sets `toggleable` to `true`.
             * ```
             * const yesButton = new Button({
             *    toggleGroup : 'yesno',
             *    text        : 'Yes'
             * });
             *
             * const noButton = new Button({
             *    toggleGroup : 'yesno',
             *    text        : 'No'
             * });
             * ```
             * @config {String}
             */
            toggleGroup : null,

            /**
             * Returns the instantiated menu widget as configured by {@link #config-menu}.
             * @member {Core.widget.Widget} menu
             * @readonly
             */
            /**
             * A submenu configuration object, or an array of MenuItem configuration
             * objects from which to create a submenu.
             *
             * Configuration object example:
             * ```javascript
             * new Menu({
             *     // Menu items
             *     items : {
             *         move : {
             *             text : 'Main item',
             *             menu : {
             *                 // Submenu items
             *                 firstItem : {
             *                     text : 'Sub-item 1',
             *                     onItem({ eventRecord }) {}
             *                 },
             *                 secondItem : {
             *                     text : 'Sub-item 2',
             *                     onItem({ eventRecord }) {}
             *                 }
             *             }
             *         }
             *     }
             * });
             * ```
             *
             * Array of items example:
             * ```javascript
             * new Menu({
             *     // Menu items
             *     items : {
             *         move : {
             *             text : 'Main item',
             *             // Submenu items
             *             menu : [
             *                 {
             *                     text : 'Sub-item 1',
             *                     onItem({ eventRecord }) {}
             *                 },
             *                 {
             *                     text : 'Sub-item 2',
             *                     onItem({ eventRecord }) {}
             *                 }
             *             ]
             *         }
             *     }
             * });
             * ```
             *
             * Note that this does not have to be a Menu. The `type` config can be used to specify any widget as the submenu.
             * ```javascript
             * new Menu({
             *     // Menu items
             *     items : {
             *         move : {
             *             text : 'Main item',
             *             // Submenu items
             *             menu : [
             *                 {
             *                     type  : 'textfield',
             *                     label : 'Type here'
             *                 },
             *                 {
             *                     type : 'button',
             *                     text : 'Confirm'
             *                 }
             *             ]
             *         }
             *     }
             * });
             * ```
             *
             * @config {Object|Object[]}
             */
            menu : {
                value : null,

                $config : ['lazy', 'nullify']
            },

            /**
             * Item icon class.
             *
             * All [Font Awesome](https://fontawesome.com/cheatsheet) icons may also be specified as `'b-fa-' + iconName`.
             *
             * Otherwise this is a developer-defined CSS class string which results in the desired icon.
             * @config {String}
             */
            icon : null,

            name : null,

            /**
             * The text to be displayed in the item
             * @config {String} text
             */

            /**
             * By default, upon activate, non-checkbox menu items will collapse
             * the owning menu hierarchy.
             *
             * Configure this as `false` to cause the menu to persist after
             * activating an item
             * @config {Boolean}
             */
            closeParent : null,

            /**
             * If provided, turns the menu item into a link
             * @config {String}
             */
            href : null,

            /**
             * The `target` attribute for the {@link #config-href} config
             * @config {String}
             */
            target : null,

            localizableProperties : ['text']
        };
    }

    compose() {
        const
            { checked, href, hasMenu, name, target, text } = this,
            icon = this.icon || ((typeof checked === 'boolean') ? 'b-fw-icon' : '');

        return {
            tag      : href ? 'a' : 'div',
            tabIndex : -1,

            href,
            target,

            class : {
                'b-has-submenu' : hasMenu
            },
            dataset : {
                name,
                group : this.toggleGroup
            },

            children : {
                iconElement : icon && {
                    tag   : 'i',
                    class : {
                        'b-fa'             : bFa.test(icon),
                        'b-icon'           : bIcon.test(icon),
                        'b-icon-checked'   : checked === true,
                        'b-icon-unchecked' : checked === false,
                        'b-menuitem-icon'  : 1,

                        ...DomClassList.normalize(icon, 'object')
                    }
                },

                textElement : {
                    tag   : 'span',
                    html  : text,
                    class : {
                        'b-menu-text' : 1
                    }
                },

                subMenuIcon : hasMenu && {
                    tag   : 'i',
                    class : {
                        'b-fw-icon'       : 1,
                        'b-icon-sub-menu' : 1
                    }
                }
            }
        };
    }

    /**
     * Actions this item. Fires the {@link #event-item} event, and if this
     * if a {@link #config-checked} item, toggles the checked state, firing
     * the {@link #event-toggle} event.
     */
    doAction(event) {
        const
            item      = this,
            menu      = this.parent,
            itemEvent = { menu, item, element : item.element, bubbles : true };

        if (typeof item.checked === 'boolean') {
            const newCheckedState = !item.checked;

            // Do not allow uncheck in a toggleGroup.
            // A toggleGroup means that one member must always be checked.
            if (!item.toggleGroup || newCheckedState) {
                item.checked = !item.checked;
            }
        }

        // Give internal handlers a chance to inject extra information before
        // user-supplied "item" handlers see the event.
        // Grid's CellMenu feature, HeaderMenu feature and other context menu features do this.
        item.trigger('beforeItem', itemEvent);

        /**
         * This menu item has been activated.
         *
         * Note that this event bubbles up through parents and can be
         * listened for on a top level {@link Core.widget.Menu Menu} for convenience.
         * @event item
         * @param {Core.widget.MenuItem} item - The menu item which is being actioned.
         * @param {Core.widget.Menu} menu - Menu containing the menu item
         */
        item.trigger('item', itemEvent);

        // Collapse the owning menu hierarchy if configured to do so
        if (item.closeParent && menu) {
            menu.rootMenu.close();

            // Don't prevent links doing their thing
            if (event && !item.href) {
                event.preventDefault();
            }
        }
    }

    get focusElement() {
        return this.element;
    }

    get contentElement() {
        return this.textElement;
    }

    get isFocusable() {
        const focusElement = this.focusElement;

        // We are only focusable if the focusEl is deeply visible, that means
        // it must have layout - an offsetParent. Body does not have offsetParent.
        // Disabled menu items are focusable but cannot be activated.
        // https://www.w3.org/TR/wai-aria-practices/#h-note-17
        return focusElement && this.isVisible && (focusElement === document.body || focusElement.offsetParent);
    }

    get hasMenu() {
        return this.hasConfig('menu');
    }

    get childItems() {
        const { menu } = this;

        return menu ? [menu] : [];
    }

    get text() {
        return this.html;
    }

    set text(text) {
        this.html = text;
    }

    onFocusIn(e) {
        super.onFocusIn(e);

        if (!this.disabled && this.menu) {
            this.openMenu();
        }
    }

    onFocusOut(e) {
        super.onFocusOut(e);

        this.closeMenu();
    }

    openMenu(andFocus) {
        const menu = this.menu;

        if (!this.disabled && menu) {
            menu.focusOnToFront = andFocus;
            menu.show();
            this.owner.currentSubMenu = menu;
        }
    }

    closeMenu() {
        if (this._menu instanceof Widget) {
            this.menu.close();
        }
    }

    changeToggleGroup(toggleGroup) {
        if (toggleGroup && typeof this.checked !== 'boolean') {
            this.checked = false;
        }
        return toggleGroup;
    }

    /**
     * Get/sets the checked state of this `MenuItem` and fires the {@link #event-toggle}
     * event upon change.
     *
     * Note that this must be configured as a `Boolean` to enable the checkbox UI.
     * @member {Boolean} checked
     */

    changeChecked(checked, old) {
        if (this.isConfiguring || typeof old === 'boolean') {
            return Boolean(checked);
        }
    }

    updateChecked(checked) {
        const me = this;

        if (!me.isConfiguring) {
            if (me.toggleGroup) {
                me.uncheckToggleGroupMembers();
            }

            /**
             * The checked state of this menu item has changed.
             *
             * Note that this event bubbles up through parents and can be listened for on a top level
             * {@link Core.widget.Menu Menu} for convenience.
             * @event toggle
             * @param {Core.widget.MenuItem} item - The menu item whose checked state changed.
             * @param {Core.widget.Menu} menu - Menu containing the menu item
             * @param {Boolean} checked - The _new_ checked state.
             */
            me.trigger('toggle', {
                menu    : me.owner,
                item    : me,
                element : me.element,
                bubbles : true,
                checked
            });
        }
    }

    getToggleGroupMembers() {
        const
            me = this,
            { checked, toggleGroup, element } = me,
            result = [];

        if (checked && toggleGroup) {
            DomHelper.forEachSelector(me.rootElement, `[data-group=${toggleGroup}]`, otherElement => {
                if (otherElement !== element) {
                    const partnerCheckItem = Widget.fromElement(otherElement);
                    partnerCheckItem && result.push(partnerCheckItem);
                }
            });
        }

        return result;
    }

    uncheckToggleGroupMembers() {
        if (this.checked && this.toggleGroup) {
            this.getToggleGroupMembers().forEach(widget => widget.checked = false);
        }
    }

    get closeParent() {
        const result = (typeof this.checked === 'boolean') ? this._closeParent : (this._closeParent !== false);

        return result && !this.hasMenu;
    }

    changeMenu(config, existingMenu) {
        const
            me = this,
            { constrainTo, scrollAction } = me.owner;

        // This covers both Array and Object which are valid items config formats.
        // menu could be { itemRef : { text : 'sub item 1 } }. But if it has
        // child items or html property in it, it's the main config
        if (config && typeof config === 'object' && !('items' in config) && !('widgets' in config) && !('html' in config)) {
            config = {
                lazyItems : config
            };
        }

        return Menu.reconfigure(existingMenu, config, {
            owner    : me,
            defaults : {
                type       : 'menu',
                align      : 'l0-r0',
                anchor     : true,
                autoClose  : true,
                autoShow   : false,
                cls        : 'b-sub-menu', // Makes the anchor hoverable to avoid mouseleave
                forElement : me.element,
                owner      : me,

                constrainTo,
                scrollAction
            }
        });
    }
}

// Register this widget type with its Factory
MenuItem.initClass();
