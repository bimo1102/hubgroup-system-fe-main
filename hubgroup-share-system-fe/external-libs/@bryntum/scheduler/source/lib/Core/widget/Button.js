import Widget from './Widget.js';
import Badge from './mixin/Badge.js';
import Rotatable from './mixin/Rotatable.js';
import DomClassList from '../helper/util/DomClassList.js';
import DomHelper from '../helper/DomHelper.js';
import Objects from '../helper/util/Objects.js';

//TODO: should togglebutton be own class implemented as input type=checkbox?
//TODO: A toggling widget's focusElement should be an opacity:0 input type=checkbox which covers the clickable area.

/**
 * @module Core/widget/Button
 */

const
    bIcon             = /(?:^|\s)b-icon-/,
    bFa               = /(?:^|\s)b-fa-/,
    defaultToggleable = Symbol('defaultToggleable');

/**
 * Button widget, wraps and styles a regular <code>&lt;button&gt;</code> element. Can display text and icon and also
 * allows specifying button {@link #config-color}. Supports different appearances, by setting {@link #config-cls} to one
 * of:
 *
 * * 'b-raised' - Raised buttons
 * * 'b-rounded' - Round buttons
 * * 'b-transparent' - Buttons without border or background
 *
 * ## Default appearance
 *
 * By default buttons uses a flat look in all themes:
 *
 * {@inlineexample Core/widget/ButtonDefault.js}
 *
 * ```javascript
 * // Green button with text and icon
 * const button = new Button({
 *     icon    : 'b-fa-plus-circle',
 *     text    : 'Add',
 *     color   : 'green',
 *     onClick : () => {}
 * });
 * ```
 *
 * ## Raised appearance
 *
 * By configuring a button with `cls : 'b-raised'` its appearance change. In Material the button appears raised, in the
 * other themes it is instead filled:
 *
 * {@inlineexample Core/widget/ButtonRaised.js}
 *
 * ```javascript
 * // Raised green button with text and icon
 * const button = new Button({
 *     cls     : 'b-raised',
 *     icon    : 'b-fa-plus-circle',
 *     text    : 'Add',
 *     color   : 'green',
 *     onClick : () => {}
 * });
 * ```
 *
 * ## Rounded appearance
 *
 * Configure a button with `cls : 'b-rounded'` to make it round. Works best for icon only buttons or buttons with very
 * short texts:
 *
 * {@inlineexample Core/widget/ButtonRounded.js}
 *
 * ```javascript
 * // Rounded button with icon
 * const button = new Button({
 *     cls     : 'b-raised b-rounded',
 *     icon    : 'b-fa-plus-circle',
 *     color   : 'green',
 *     onClick : () => {}
 * });
 * ```
 *
 * ## Transparent appearance
 *
 * Configure a button with `cls : 'b-transparent'` to display it without border or background:
 *
 * {@inlineexample Core/widget/ButtonTransparent.js}

 * ```javascript
 * // Transparent green button with text and icon
 * const button = new Button({
 *     cls     : 'b-transparent',
 *     icon    : 'b-fa-plus-circle',
 *     text    : 'Add',
 *     color   : 'green',
 *     onClick : () => {}
 * });
 * ```
 *
 * @classType button
 * @extends Core/widget/Widget
 * @mixes Core/widget/mixin/Badge
 */
export default class Button extends Widget.mixin(Badge, Rotatable) {
    //region Config
    static get $name() {
        return 'Button';
    }

    // Factoryable type name
    static get type() {
        return 'button';
    }

    static get configurable() {
        return {
            /**
             * Get/set the Button icon
             * @property {String}
             * @name icon
             */
            /**
             * Button icon class.
             *
             * All [Font Awesome](https://fontawesome.com/cheatsheet) icons may also be specified as `'b-fa-' + iconName`.
             *
             * Otherwise this is a developer-defined CSS class string which results in the desired icon.
             * @config {String}
             */
            icon : null,

            /**
             * Get/set the Button pressed icon
             * @property {String}
             * @name pressedIcon
             */
            /**
             * Icon class for the buttons pressed state. Only applies to toggle buttons
             *
             * All [Font Awesome](https://fontawesome.com/cheatsheet) icons may also be specified as `'b-fa-' + iconName`.
             *
             * Otherwise this is a developer-defined CSS class string which results in the desired icon.
             *
             * ```
             * new Button({
             *    // Icon for unpressed button
             *    icon        : 'b-fa-wine-glass',
             *
             *    // Icon for pressed button
             *    pressedIcon : 'b-fa-wine-glass-alt',
             *
             *    // Only applies to toggle buttons
             *    toggleable  : true
             * });
             * ```
             *
             * @config {String}
             */
            pressedIcon : null,

            /**
             * Get/Set the Button icon alignment.
             * May be `'start'` or `'end'`. Defaults to `'start'`
             * @property {String}
             * @name iconAlign
             */
            /**
             * Button icon alignment. May be `'start'` or `'end'`. Defaults to `'start'`
             * @config {String}
             */
            iconAlign : 'start',

            /**
             * Get/set text displayed on the button.
             * @property {String}
             * @name text
             */
            /**
             * The button's text.
             * @config {String}
             */
            text : {
                value   : null,
                $config : null,
                default : ''
            },

            /**
             * Button color (should have match in button.scss or your custom styling). Valid values in Bryntum themes
             * are:
             * * b-amber
             * * b-blue
             * * b-dark-gray
             * * b-deep-orange
             * * b-gray
             * * b-green
             * * b-indigo
             * * b-lime
             * * b-light-gray
             * * b-light-green
             * * b-orange
             * * b-purple
             * * b-red
             * * b-teal
             * * b-white
             * * b-yellow
             * Combine with specifying `b-raised` for raised/filled style (theme dependent).
             *
             * ```
             * new Button({
             *    color : 'b-teal b-raised'
             * });
             * ```
             *
             * @config {String}
             */
            color : null,

            /**
             * Enabled toggling of the button (stays pressed when pressed).
             * @config {Boolean}
             * @default false
             */
            toggleable : defaultToggleable,

            /**
             * Get/set button pressed state
             * @property {Boolean}
             * @name pressed
             */
            /**
             * Initially pressed or not. Only applies with `toggleable = true`.
             * ```
             * const toggleButton = new Button({
             *    toggleable : true,
             *    text : 'Enable cool action'
             * });
             * ```
             * @config {Boolean}
             * @default
             */
            pressed : false,

            /**
             * Indicates that this button is part of a group where only one button can be pressed. Assigning a value
             * also sets `toggleable` to `true`.
             *
             * When part of a {@link Core.widget.ButtonGroup}, you can set {@link Core.widget.ButtonGroup#config-toggleGroup}
             * on it as an alternative to on each button. This config can then be used to override that value if needed.
             *
             * ```javascript
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

            ripple : {
                radius : 75
            },

            defaultBindProperty : 'text',

            localizableProperties : ['text'],

            /**
             * Returns the instantiated menu widget as configured by {@link #config-menu}.
             * @property {Core.widget.Widget}
             * @name menu
             */
            /**
             * A submenu configuration object, or an array of MenuItem configuration
             * objects from which to create a submenu which is shown when this button is pressed.
             *
             * Note that this does not have to be a Menu. The `type` config can be used
             * to specify any widget as the submenu.
             *
             * May also be specified as a fully instantiated {@link Core.widget.Widget#config-floating floating Widget}
             * such as a {@link Core/widget/Popup}.
             * @config {Object|Object[]|Core.widget.Widget}
             */
            menu : {
                $config : ['lazy', 'nullify'],
                value   : null
            },

            menuDefaults : {
                type         : 'menu',
                autoShow     : false,
                autoClose    : true,
                floating     : true,
                scrollAction : 'realign',
                align        : 't0-b0'
            },

            /**
             * If provided, turns the button into a link
             * @config {String}
             */
            href : null,

            /**
             * The `target` attribute for the {@link #config-href} config
             * @config {String}
             */
            target : null,

            onMenuHideTimeout : 300,

            testConfig : {
                onMenuHideTimeout : 0
            }
        };
    }

    compose() {
        const
            { color, href, icon, iconAlign, pressed, pressedIcon, target, text, toggleable, toggleGroup } = this,
            iconCls = (pressed && pressedIcon) ? pressedIcon : icon;

        return {
            tag : href ? 'a' : 'button',
            href,
            target,

            class : {
                [`b-icon-align-${iconAlign}`] : icon,
                [color]                       : Boolean(color),
                'b-pressed'                   : pressed && toggleable,
                'b-text'                      : Boolean(text)
            },

            dataset : {
                group : toggleGroup
            },

            listeners : {
                click : 'onInternalClick'
            },

            children : {
                iconElement : (icon || pressedIcon) && {
                    tag   : 'i',
                    class : {
                        ...DomClassList.normalize(iconCls, 'object'),
                        'b-icon' : bIcon.test(iconCls),
                        'b-fa'   : bFa.test(iconCls)
                    }
                },
                label : text && {
                    tag : 'label',
                    text
                }
            }
        };
    }

    //endregion

    onHide() {
        // Stop a menu from being visually orphaned if this button is hidden while its menu is visible
        this._menu?.hide();
    }

    /**
     * Iterate over all widgets owned by this widget and any descendants.
     *
     * *Note*: Due to this method aborting when the function returns `false`, beware of using short form arrow
     * functions. If the expression executed evaluates to `false`, iteration will terminate.
     *
     * _Due to the {@link #config-menu} config being a lazy config and only being converted to be a
     * `Menu` instance just before it's shown, the menu will not be part of the iteration before
     * it has been shown once_.
     * @function eachWidget
     * @param {Function} fn A function to execute upon all descendant widgets.
     * Iteration terminates if this function returns `false`.
     * @param {Boolean} [deep=true] Pass as `false` to only consider immediate child widgets.
     * @returns {Boolean} Returns `true` if iteration was not aborted by a step returning `false`
     */

    get childItems() {
        return this._menu && [this.menu];
    }

    onFocusOut(e) {
        super.onFocusOut(e);

        this.menu?.hide();
    }

    //region Getters/Setters

    get focusElement() {
        return this.element;
    }

    changeText(text) {
        return (text == null) ? '' : text;
    }

    changeToggleable(toggleable) {
        if (toggleable === defaultToggleable) {
            return this.toggleGroup || this.config.menu;
        }

        return toggleable;
    }

    changeMenu(menu, oldMenu) {
        const me = this;

        if (menu) {
            // In case the reason for the hide is a mousedown
            // on this button, and it's not hiding because we are being destroyed,
            // wait until after any impending click handler to sync our state with the visibility.
            const onHide = () => !me.isDestroying && me.setTimeout(() => me.toggle(false), me.onMenuHideTimeout);

            if (menu.isWidget) {
                menu.forElement = me.element;
                menu.owner = me;
                menu.on('hide', onHide);
            }
            else {
                // This covers both Array and Object which are valid items config formats.
                // menu could be { itemRef : { text : 'sub item 1 } }. But if it has
                // child items or html property in it, it's the main config
                if (typeof menu === 'object' && !('type' in menu || 'items' in menu || 'widgets' in menu || 'html' in menu)) {
                    menu = {
                        lazyItems : menu
                    };
                }

                menu = Widget.reconfigure(oldMenu, menu ? Objects.merge({
                    constrainTo : me.rootElement,
                    forElement  : me.element,
                    owner       : me,
                    onHide
                }, me.menuDefaults, menu) : null, me);
            }
        }
        else {
            if (oldMenu) {
                oldMenu.destroy();
            }
        }

        return menu;
    }

    updateMenu(menu) {
        // We are toggleable if there's a menu.
        // Pressed means menu visible, not pressed means menu hidden.
        this.toggleable = Boolean(menu);
    }

    updatePressed(pressed) {
        const me = this;

        if (!me.isConfiguring && pressed && me.toggleGroup) {
            DomHelper.forEachSelector(me.rootElement, `button[data-group=${me.toggleGroup}]`, btnEl => {
                if (btnEl !== me.element) {
                    Widget.getById(btnEl.id).toggle(false);
                }
            });
        }
    }

    //endregion

    //region Events

    /**
     * Triggers events when user clicks button
     * @fires click
     * @fires action
     * @internal
     */
    onInternalClick(event) {
        const
            me           = this,
            bryntumEvent = { event };

        if (me.toggleable) {
            // Clicking the pressed button in a toggle group should do nothing
            if (me.toggleGroup && me.pressed) {
                return;
            }

            me.toggle(!me.pressed);

            // Edge case in dragfromgrid demo, where toggling mode destroys the Scheduler and thus destroys the toolbar
            // and the button in it
            if (me.isDestroyed) {
                return;
            }
        }

        /**
         * Fires when the button is clicked
         * @event click
         * @param {Core.widget.Button} source The button
         * @param {Event} event DOM event
         */
        me.trigger('click', bryntumEvent);

        /**
         * Fires when the default action is performed (the button is clicked)
         * @event action
         * @param {Core.widget.Button} source The button
         * @param {Event} event DOM event
         */
        // A handler may have resulted in destruction.
        if (!me.isDestroyed) {
            me.trigger('action', bryntumEvent);
        }

        // since Widget has Events mixed in configured with 'callOnFunctions' this will also call onClick and onAction

        if (!me.href) {
            // stop the event since it has been handled
            event.preventDefault();
            event.stopPropagation();
        }
    }

    //endregion

    //region Misc

    /**
     * Toggle button state (only use with toggleable = true)
     * @param {Boolean} pressed Specify to force a certain toggle state
     * @fires toggle
     */
    toggle(pressed = null) {
        const
            me       = this,
            { menu } = me;

        if (!me.toggleable) {
            return;
        }

        if (pressed === null) {
            pressed = !me.pressed;
        }

        // The pressed state is not going to be changed, ignore toggling
        if (me.pressed === pressed) {
            return;
        }

        // For handlers from the code below to detect and avoid recursion
        me.toggling = true;

        me.pressed = pressed;

        if (menu) {
            if (!menu.initialConfig.minWidth) {
                menu.minWidth = me.width;
            }

            // Menu will shrink and fit inside a 10px inset of viewport.
            // Rectangle.alignTo prioritizes alignment if the target edge is closer to
            // the constrainTo edge than this in order to produce visually correct results.
            menu.align.constrainTo = window;
            menu.align.constrainPadding = 10;

            // The presence of a number indicates to the align constraining algorithm
            // that it is *willing* to shrink in that dimension. It will never end up this small.
            // Use the properties because the getter will return 0 if not set.
            menu.align.minHeight = menu._minHeight ?? 100;
            menu.align.minWidth  = menu._minWidth ?? 100;

            menu[pressed ? 'show' : 'hide']();
        }

        /**
         * Fires when the button is toggled (the {@link #property-pressed} state is changed). If the button is part of a
         * {@link #config-toggleGroup} and you need to process the pressed button only, consider using
         * {@link #event-click} event or {@link #event-action} event.
         * @event toggle
         * @param {Core.widget.Button} source Toggled button
         * @param {Boolean} pressed New pressed state
         * @param {Event} event DOM event
         */
        me.trigger('toggle', { pressed });

        me.toggling = false;
    }

    //endregion
}

// Register this widget type with its Factory
Button.initClass();
