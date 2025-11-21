import Container from './Container.js';
import Toolable from './mixin/Toolable.js';
import Objects from '../helper/util/Objects.js';
import FunctionHelper from '../helper/FunctionHelper.js';
import ArrayHelper from '../helper/ArrayHelper.js';
import DomHelper from '../helper/DomHelper.js';

import { canonicalDock } from './mixin/Rotatable.js';

import './layout/VBox.js';
import './Button.js';

/**
 * @module Core/widget/Toolbar
 */

const
    isToolbar = w => w.isToolbar,
    _axisProps = [{
        box            : 'hbox',
        clientSizeProp : 'clientWidth',
        edgeProp       : 'right',
        flexDir        : 'row',
        horizontal     : true,
        max            : 'maxX',
        overflow       : 'overflowX',
        pos            : 'x',
        scrollSize     : 'scrollWidth',
        sizeProp       : 'width'
    }, {
        box            : 'vbox',
        clientSizeProp : 'clientHeight',
        edgeProp       : 'bottom',
        flexDir        : 'column',
        horizontal     : false,
        max            : 'maxY',
        overflow       : 'overflowY',
        pos            : 'y',
        scrollSize     : 'scrollHeight',
        sizeProp       : 'height'
    }],
    defaultRepeat = {
        delay              : 0,
        startRate          : 40,
        endRate            : 200,
        accelerateDuration : 500
    };

/**
 * A container widget that can contain Buttons or other widgets, and is docked to the bottom or top of
 * a {@link Core.widget.Panel Panel}.
 *
 * @extends Core/widget/Container
 * @classType toolbar
 * @inlineexample Core/widget/Toolbar.js
 */
export default class Toolbar extends Container.mixin(Toolable) {
    static get $name() {
        return 'Toolbar';
    }

    // Factoryable type name
    static get type() {
        return 'toolbar';
    }

    static get delayable() {
        return {
            syncOverflowVisibility : {
                type              : 'raf',
                cancelOutstanding : true
            } // && 50   // restore the "&& 50" here to help when debugging syncOverflowVisibility
        };
    }

    static get configurable() {
        return {
            defaultType : 'button',

            dock : 'top',

            layout : {
                type : 'box'
            },

            /**
             * The {@link Core.widget.Tool tools} to add either before or after the content element (the element in
             * which {@link #config-overflow} occurs). Each property name is the reference by which an instantiated
             * tool may be retrieved from the live `{@link Core.widget.mixin.Toolable#property-tools}` property.
             * @config {Object} tools
             */

            /**
             * How this Toolbar should deal with items that overflow its main axis.
             *
             * Values may be:
             * - `'menu'` A button with a menu is shown and the menu contains the overflowing items.
             * - `'scroll'` The items overflow and mey be scrolled into view using the mouse or scroll buttons.
             * - `null` Disable overflow handling
             *
             * When mode is `'menu'`, clones of overflowing toolbar item are created and added to a Menu. Any config
             * changes to the original toolbar item are propagated to the menu's clone, so disabling a toolbar
             * item will make the clone in the menu disabled.
             *
             * The clone of an input field will propagate its `value` changes back to the original. The
             * overflow button, its menu, and the clones should not be accessed or manipulated by application code.
             *
             * Note that cloned items will be allocated a unique, generated ID because all IDs must be unique,
             * so CSS targeting an element ID will not apply to a clone in the overflow menu.
             *
             * Values may also be specified in object form containing the following properties:
             * @config {String|Object|null} overflow
             * @property {String} overflow.type `'scroll'` or `'menu'`
             * @property {Object} overflow.repeat A config object to reconfigure the {@link Core.util.ClickRepeater ClickRepeater}
             * which controls auto repeat speed when holding down the scroll buttons when `type` is `'scroll'`
             * @property {Function} overflow.filter A filter function which may return `false` to prevent toolbar
             * items from being cloned into the overflow menu.
             * @default 'menu'
             */
            overflow : {
                // Wait until first paint to evaluate so that we can read our CSS style.
                // Set to null on destroy which destroys the overflow Tools and Scroller.
                $config : ['lazy', 'nullify'],
                value   : 'menu'
            },

            toolDefaults : {
                overflowMenuButton : {
                    type   : 'button',
                    icon   : 'b-icon-menu',
                    hidden : true
                },
                overflowScrollEnd : {
                    handler : 'up.onEndScrollClick',
                    hidden  : true
                },
                overflowScrollStart : {
                    align   : 'start',
                    handler : 'up.onStartScrollClick',
                    hidden  : true
                }
            },

            /**
             * Custom CSS class to add to toolbar widgets
             * @config {String}
             * @category CSS
             */
            widgetCls : null
        };
    }

    compose() {
        const { axisProps, dock, endToolElementRefs, startToolElementRefs } = this;

        return {
            class : {
                [`b-dock-${dock}`]     : 1,
                [`b-${dock}-toolbar`]  : 1,
                [`b-${axisProps.box}`] : 1
            },

            children : {
                ...startToolElementRefs,
                toolbarContent : {
                    class : {
                        'b-box-center'      : 1,
                        'b-toolbar-content' : 1
                    }
                },
                ...endToolElementRefs
            }
        };
    }

    get axisProps() {
        return _axisProps[this.layout.horizontal ? 0 : 1];
    }

    get contentElement() {
        return this.toolbarContent;
    }

    get overflowMenuButton() {
        return this.tools?.overflowMenuButton;
    }

    get overflowType() {
        const { overflow } = this;

        return (typeof overflow === 'string') ? overflow : overflow?.type;
    }

    onChildAdd(item) {
        super.onChildAdd(item);

        this.processAddedLeafItem(item);

        item.syncRotationToDock?.(this.dock);
    }

    processAddedLeafItem(item) {
        // Any configurable config changes in the original are propagated to a possible clone.
        // Also a reevaluation of scroll state may be necessary. Any part of the UI may have changed,
        FunctionHelper.after(item, 'onConfigChange', this.onLeafItemConfigChange, item);

        // And all the way down. Eg, hiding a ButtonGroup must schedule a syncOverflowVisibility
        // but also hiding any of its children must also schedule a syncOverflowVisibility
        if (item.isContainer) {
            item.eachWidget(w => this.processAddedLeafItem(w));
        }
    }

    onPaint({ firstPaint }) {
        super.onPaint?.(...arguments);

        // Evaluate the overflow late so that we have access to styles and measurements.
        if (firstPaint) {
            this.getConfig('overflow');
        }
    }

    updateDock(dock) {
        const
            me = this,
            { layout } = me,
            { vertical } = layout;

        layout.vertical = canonicalDock(dock)[1];

        if (!me.initialItems) {
            if (vertical !== layout.vertical) {
                me.updateOverflow(me.overflow);
            }

            for (const item of me.childItems) {
                item.syncRotationToDock?.(dock);
            }
        }
    }

    updateOverflow(overflow, oldOverflow) {
        const
            me                                          = this,
            { axisProps, contentElement, overflowType } = me,
            { flexDir }                                 = axisProps,
            overflowMenu                                = me.overflowMenuButton?._menu,
            overflowTools                               = {};

        if (overflowMenu) {
            // Save any clones from destruction
            if (overflow) {
                overflowMenu?.removeAll();
            }
            // Break link between original and clone
            else {
                overflowMenu.eachWidget(clone => {
                    clone._toolbarOverflowOriginal._toolbarOverflowClone = null;
                });
            }
        }

        if (oldOverflow === 'menu') {
            overflowTools.overflowMenuButton = null;
        }
        else if (oldOverflow === 'scroll') {
            overflowTools.overflowScrollStart = overflowTools.overflowScrollEnd = null;
        }

        if (overflowType === 'menu') {
            // Not needed for menu type overflowing
            me.scrollable?.destroy();

            // Must allow things like Badges to escape the bounds.
            contentElement.style.overflow =
                contentElement.style.overflowX =
                    contentElement.style.overflowY = '';

            overflowTools.overflowMenuButton = {
                cls : {
                    [`b-${flexDir}-menu`] : 1,
                    'b-overflow-button'   : 1
                }
            };
        }
        else if (overflowType === 'scroll') {
            const repeat = ((typeof overflow === 'object') && overflow?.repeat) || defaultRepeat;

            // We need a scroller.
            me.scrollable = {
                [axisProps.overflow] : 'hidden-scroll',
                element              : contentElement,
                listeners            : {
                    scroll  : 'onContentScroll',
                    thisObj : me
                }
            };

            overflowTools.overflowScrollStart = {
                repeat,
                invertRotate : true,
                cls          : {
                    [`b-${flexDir}-start-scroller`] : 1,
                    'b-icon-angle-left'             : 1,
                    'b-overflow-button'             : 1,
                    'b-icon'                        : 1
                }
            };

            overflowTools.overflowScrollEnd = {
                repeat,
                invertRotate : true,
                cls          : {
                    [`b-${flexDir}-end-scroller`] : 1,
                    'b-icon-angle-right'          : 1,
                    'b-overflow-button'           : 1,
                    'b-icon'                      : 1
                }
            };
        }

        me.tools = overflowTools;

        if (overflowType) {
            // Stops items from flex-shrinking down now that we have a way of showing them in full.
            contentElement.classList.add('b-overflow');

            // Need to hide/show overflow buttons when necessary
            me.monitorResize = true;
            me.syncOverflowVisibility();
        }
        else {
            contentElement.classList.remove('b-overflow');
            me.monitorResize = false;
        }
    }

    onContentScroll() {
        this.syncScrollerState();
    }

    onStartScrollClick() {
        this.scrollable[this.axisProps.pos] -= 2;
    }

    onEndScrollClick() {
        this.scrollable[this.axisProps.pos] += 2;
    }

    // Only called when monitorResize is true, which is only set when we have an overflow mode
    onInternalResize() {
        super.onInternalResize(...arguments);

        // If it's not the initial undefined->first size from the initial paint, reevaluate overflow
        if (this.isPainted) {
            this.syncOverflowVisibility();
        }
    }

    syncOverflowVisibility() {
        const
            me = this,
            { overflowType, contentElement, isVisible } = me,
            { clientSizeProp, edgeProp, sizeProp } = me.axisProps,
            { overflowMenuButton, overflowScrollStart, overflowScrollEnd } = me.tools,
            menuOverflow = overflowType === 'menu';

        // Method can be called for hidden toolbar (e.g. after event editor is hidden), bail out early in such case
        if (!isVisible || !overflowType) {
            return;
        }

        // Prevent recursion
        me.inSyncOverflowVisibility = true;

        // Give the contents a chance to lay out with no scroll tools taking space.
        overflowMenuButton?.hide();
        // NOTE: if we hide the scroller buttons that will affect the scroll range and can trigger a scroll. The scroll
        // does not fire synchronously (at least in Chrome) so it cannot be swallowed here.

        let overflowIndex = 0,
            availableSpace, itemRect, overflowable, visibleItems;

        // Iterate all leaf widgets.
        // Restore only the ones that we hid to visibility so that we can accurately ascertain overflow.
        // Collect all visible leaf widgets. These are what we are interested in hiding and showing.
        // Anything may have changed. Text inside buttons, label of fields, visibility or
        // disabled status. The only way to ascertain overflow is to show them all, and
        // force a synchronous layout by measuring the resulting scrollWidth/Height
        me.eachWidget((item, control) => {
            if (item.floating) {
                control.down = false;
                return;
            }

            // We want to descend into containers (esp ButtonGroup) but don't want to descend into normal widgets (like
            // button's which may have menus).
            control.down = !(overflowable = item.overflowable);

            if (overflowable && item.innerItem) {
                if (item._toolbarOverflow) {
                    // Order is important here. _toolbarOverflow must be set first
                    // so that onLeafItemConfigChange doesn't recurse infinitely.
                    item.hidden = item._toolbarOverflow = false;
                }

                if (item.isVisible) {
                    (visibleItems || (visibleItems = [])).push(item);
                    ++overflowIndex;
                }
            }
        });

        if (visibleItems) {
            // Firefox doesn't calculate scrollWidth correctly if overflow is hidden which it has to be.
            itemRect = visibleItems[--overflowIndex].rectangle(contentElement);

            availableSpace = Math.ceil(
                contentElement[clientSizeProp] +
                // Since we cannot simply hide these to remove their influence, we need to add their width/height to
                // the availableSpace here:
                ((!overflowScrollStart || overflowScrollStart.hidden) ? 0 : overflowScrollStart.rectangle('outer')[sizeProp]) +
                ((!overflowScrollEnd || overflowScrollEnd.hidden) ? 0 : overflowScrollEnd.rectangle('outer')[sizeProp])
            );
        }

        if (visibleItems && Math.floor(itemRect[edgeProp]) > availableSpace) {
            if (menuOverflow) {
                overflowMenuButton.show();
                availableSpace = contentElement[clientSizeProp]; // get the new size of the content area

                // We know the last item's edgeProp overflows, so skip that one and start at the prior item:
                while (overflowIndex-- > 0) {
                    itemRect = visibleItems[overflowIndex].rectangle(contentElement);

                    if (Math.floor(itemRect[edgeProp]) <= availableSpace) {
                        break;
                    }
                }
                // overflowIndex is the index of the item that did not overflow (or -1 if all items overflow)

                me.syncOverflowMenuButton(visibleItems.slice(overflowIndex + 1));
            }
            else {
                overflowScrollEnd.show();
                overflowScrollStart.show();
                me.syncScrollerState();
            }
        }
        else if (!menuOverflow) {
            overflowScrollEnd?.hide();
            overflowScrollStart?.hide();
        }

        me.inSyncOverflowVisibility = false;
    }

    syncOverflowMenuButton(overflowItems) {
        const
            me = this,
            { axisProps, overflowMenuButton } = me,
            menu = {
                cls      : 'b-toolbar-overflow-menu',
                minWidth : 280,
                items    : [],
                align    : {
                    align    : axisProps.horizontal ? 't100-b100' : 'r100-l100',
                    axisLock : 'flexible'
                }
            };

        // Hide the things that overflow
        for (let overflowingItem, i = 0, { length } = overflowItems; i < length; i++) {
            overflowingItem = overflowItems[i];

            // Cache the width so that we can make it look right in the menu
            overflowingItem._toolbarOverflowWidth = overflowingItem.width;

            // Order is important here. _toolbarOverflow must be set first
            // so that onLeafItemConfigChange doesn't recurse infinitely.
            overflowingItem._toolbarOverflow = true;
            overflowingItem.hidden = true;
        }

        // Add clones, or surrogates of the overflowing things to the menu.
        // Input fields will be cloned, buttons will result in a MenuItem.
        // Any Containers
        me.addToMenu(menu, overflowItems.filter(() => me.overflowItemFilter));

        if (overflowMenuButton._menu?.isMenu) {
            const
                existingMenu = overflowMenuButton.menu,
                {
                    toAdd,
                    toRemove
                } = ArrayHelper.delta(menu.items, existingMenu.items, 1);

            existingMenu.remove(toRemove);

            if (existingMenu.items.length) {
                // Insert the ones which we just got too narrow to show at the top of the menu
                for (let i = toAdd.length - 1; i >= 0; i--) {
                    existingMenu.insert(toAdd[i], 0);
                }
            }
            else {
                existingMenu.add(toAdd);
            }
        }
        else {
            overflowMenuButton.menu = menu;
        }
    }

    syncScrollerState() {
        const
            me            = this,
            { axisProps, scrollable } = me,
            { overflowScrollStart, overflowScrollEnd } = me.tools,
            scrollPos    = scrollable[axisProps.pos],
            maxScrollPos = scrollable[axisProps.max];

        overflowScrollStart.disabled = !scrollPos;
        overflowScrollEnd.disabled = Math.ceil(scrollPos) >= maxScrollPos;
    }

    overflowItemFilter(w) {
        // If no Elements, for example displaying text which will have a Node type 3
        // or a toolbar spacer or separator, then omit it from the menu
        const
            result     = Boolean(DomHelper.getChildElementCount(w)),
            { filter } = this.overflow;

        // Allow user-defined filter
        return result && (filter ? filter(w) : 1);
    }

    addToMenu(menu, overflowingItems) {
        const { horizontal } = this;

        for (let i = 0, { length } = overflowingItems; i < length; i++) {
            const item = overflowingItems[i];

            let clone = item._toolbarOverflowClone,
                type = item.constructor;

            if (!clone) {
                const config = Objects.clone(item.initialConfig);

                // Must not duplicate IDs
                delete config.id;

                // Item must obey menu's align-items : stretch style.
                // CSS unset not supported on IE11.
                config.width = '';

                // Don't allow horizontal flex styles to apply in the vertical
                // layout of the Menu.
                if (horizontal) {
                    config.flex = '';
                }

                config.minWidth = item._toolbarOverflowWidth;
                config.type = item.type;
                config._toolbarOverflowOriginal = item;

                // These properties are things that may be changed frequently from the initialConfig state.
                config.disabled = item.disabled;
                if ('value' in item) {
                    config.value = item.value;
                }

                // Icon-only buttons are not useful in a menu.
                // Use any tooltip text as the button text.
                if (config.type === 'button') {
                    // TODO - will look better but need be clever - https://github.com/bryntum/support/issues/2298
                    // config.type = type = type.resolveType('menuitem');

                    if (!config.text) {
                        config.text = item.tooltipText;
                    }
                }

                item._toolbarOverflowClone = clone = type.create(config);
                clone.element.style.margin = '';

                // Clone's changes must propagate to original.
                if (item.isField) {
                    clone.on({
                        change : this.onFieldCloneChange
                    });
                }
            }

            menu.items.push(clone);
        }
    }

    onFieldCloneChange({ source, value }) {
        source._toolbarOverflowOriginal.value = value;
    }

    // Note that this is called with the thisObj of the tbar item being reconfigured.
    // It propagates the new setting into its toolbar overflow clone.
    onLeafItemConfigChange(origResult, { name, value }) {
        const
            me                        = this,
            toolbar                   = me.up(isToolbar),
            { _toolbarOverflowClone } = me;

        // If it's a hide/show, and its in sync with its _toolbarOverflow state, do nothing
        if (toolbar?.inSyncOverflowVisibility || (name === 'hidden' && value === me._toolbarOverflow)) {
            return;
        }

        // If the changed item has a clone in the overflow menu, sync the clone
        if (_toolbarOverflowClone) {
            _toolbarOverflowClone[name] = value;
        }

        // Any part of the UI might have changed shape, so we must reevaluate scroll state.
        if (toolbar?.isPainted && me.ref !== 'overflowMenuButton') {
            toolbar.syncOverflowVisibility();
        }
    }

    createWidget(widget) {
        if (widget === '->') {
            widget = {
                type : 'widget',
                cls  : 'b-toolbar-fill'
            };
        }
        else if (widget === '|') {
            widget = {
                type : 'widget',
                cls  : 'b-toolbar-separator'
            };
        }
        else if (typeof widget === 'string') {
            widget = {
                type : 'widget',
                cls  : 'b-toolbar-text',
                html : widget
            };
        }

        const result = super.createWidget(widget);

        if (this.widgetCls) {
            result.element.classList.add(this.widgetCls);
        }

        return result;
    }
}

// Register this widget type with its Factory
Toolbar.initClass();
