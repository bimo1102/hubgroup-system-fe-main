import ArrayHelper from '../helper/ArrayHelper.js';
import ObjectHelper from '../helper/ObjectHelper.js';
import Panel from './Panel.js';
import Tab from './Tab.js';

import './TabBar.js';
import './layout/Card.js';
import GlobalEvents from '../GlobalEvents.js';

/**
 * @module Core/widget/TabPanel
 */

/**
 * A tab panel widget which displays a collection of tabs, each of which can contain other widgets (or simple HTML). This
 * widget has a {@link Core.widget.TabBar tab bar} on top of its contents, and each {@link Core.widget.Tab tab} can be
 * customized using the {@link Core.widget.Tab#config-tab} config.
 *
 * @extends Core/widget/Container
 * @example
 * let tabPanel = new TabPanel({
 *  items: [
 *      {
 *          title: 'First',
 *          items: [
 *              { type: 'textfield', label: 'Name' },
 *              ...
 *          ]
 *      }, {
 *          title: 'Settings',
 *          tab : {
 *              // Show an icon in the tab
 *              icon : 'b-fa b-fa-cog'
 *          },
 *          items: [
 *              ...
 *          ]
 *      }
 *  ]
 * });
 *
 * @classType tabpanel
 * @inlineexample Core/widget/TabPanel.js
 */
export default class TabPanel extends Panel {
    //region Config
    static get $name() {
        return 'TabPanel';
    }

    // Factoryable type name
    static get type() {
        return 'tabpanel';
    }

    // Factoryable type alias
    static get alias() {
        return 'tabs';
    }

    static get configurable() {
        return {
            /**
             * The index of the initially active tab.
             * @member {Number} activeTab
             */
            /**
             * The index of the initially active tab.
             * @config {Number}
             * @default
             */
            activeTab : 0,

            /**
             * Specifies whether to slide tabs in and out of visibility.
             * @config {Boolean}
             * @default
             */
            animateTabChange : true,

            /**
             * Set the height of all tabs to match the tab with the highest content.
             * @config {Boolean}
             * @default
             */
            autoHeight : false,

            defaultType : 'container',

            itemCls : 'b-tabpanel-item',

            layout : {
                type : 'card'
            },

            // Prevent child panels from displaying a header unless explicitly configured with one
            suppressChildHeaders : true,

            tabBar : {
                type   : 'tabbar',
                weight : -2000
            },

            /**
             * Min width of a tab title. 0 means no minimum width. This is default.
             * @config {Number}
             * @default
             */
            tabMinWidth : null,

            /**
             * Max width of a tab title. 0 means no maximum width. This is default.
             * @config {Number}
             * @default
             */
            tabMaxWidth : null
        };
    }

    //endregion

    //region Init

    /**
     * The active tab index. Setting must be done through {@link #property-activeTab}
     * @property {Number}
     * @readonly
     */
    get activeIndex() {
        return this.layout.activeIndex;
    }

    /**
     * The active child widget. Setting must be done through {@link #property-activeTab}
     * @property {Core.widget.Widget}
     * @readonly
     */
    get activeItem() {
        return this.layout.activeItem;
    }

    get activeTabItemIndex() {
        const { activeTab, items, tabBar } = this;

        return items.indexOf(tabBar.tabs[activeTab]?.item);
    }

    get bodyConfig() {
        return ObjectHelper.merge({
            className : {
                'b-tabpanel-body' : 1
            }
        }, super.bodyConfig);
    }

    get focusElement() {
        const activeTab = this.items[this.activeTab || 0];

        return activeTab?.focusElement || activeTab?.tab?.focusElement;
    }

    get tabPanelBody() {
        return this.bodyElement;
    }

    finalizeInit() {
        super.finalizeInit();

        const
            me                    = this,
            { activeTab, layout } = me,
            tabs                  = me.tabBar.tabs;

        if (activeTab >= 0 && activeTab < tabs.length) {
            layout.activeIndex = me.items.indexOf(tabs[activeTab].item);
        }
        else {
            throw new Error(`Invalid activeTab ${activeTab} (${tabs.length} tabs)`);
        }

        layout.animateCardChange = me.animateTabChange;
    }

    onChildAdd(child) {
        // The layout will hide inactive new items.
        // And we must add our beforeHide listener *after* call super.
        super.onChildAdd(child);

        if (!this.initialItems) {
            const
                me          = this,
                { tabBar }  = me,
                config      = me.makeTabConfig(child),
                // if child.tab === false, config will be null... no tab for this one
                firstTab    = config && tabBar.firstTab,
                // if there are no tabs yet, this will be the first so we can skip all the indexing...
                tabBarItems = firstTab && tabBar._items,
                // not all items have tabs but the new child won't have one yet:
                tabItems    = firstTab && ArrayHelper.from(me._items, it => it.tab || it === child),
                // non-tabs could be in the tabBar, but the tabs must be contiguous:
                index       = firstTab ? tabItems.indexOf(child) + tabBarItems.indexOf(firstTab) : 0;

            if (config) {
                if (firstTab && child.weight == null && index < tabBarItems.count - 1) {
                    tabBar.insert(config, index);
                }
                else {
                    tabBar.add(config);
                }
            }
        }
    }

    onChildRemove(child) {
        child.tab?.destroy?.();  // tab can be false... so child.tab?.destroy() is not enough

        super.onChildRemove(child);
    }

    //endregion

    //region Tabs

    isDisabledOrHiddenTab(tabIndex) {
        const
            { tabs } = this.tabBar,
            tab      = tabs?.[tabIndex];
        return tab && (tab.disabled || tab.hidden);
    }

    findAvailableTab(item, delta = 1) {
        const
            { tabs }  = this.tabBar,
            tabCount  = tabs.length,
            itemIndex = Math.max(0, tabs.indexOf(item.tab));

        if (itemIndex) {
            delta = -delta;
        }

        let activeTab;

        for (let n = 1; n <= tabCount; ++n) {
            //  itemIndex=2, tabCount=5:
            //               n : 1, 2, 3, 4, 5
            //      delta =  1 : 3, 4, 0, 1, 2
            //      delta = -1 : 1, 0, 4, 3, 2
            activeTab = (itemIndex + ((delta < 0) ? tabCount : 0) + n * delta) % tabCount;
            if (!this.isDisabledOrHiddenTab(activeTab)) {
                break;
            }
        }
        return activeTab;
    }

    activateAvailableTab(item, delta = 1) {
        this.activeTab = this.findAvailableTab(item, delta);
    }

    changeActiveTab(activeTab) {
        const
            me           = this,
            { tabBar }   = me,
            { tabCount } = tabBar;

        if (activeTab.isWidget || ObjectHelper.isObject(activeTab)) {
            // Must be a child widget, so add if it's not already in our items.
            if (me.items.indexOf(activeTab) === -1) {
                activeTab = me.add(activeTab);
            }

            activeTab = tabBar.indexOfTab(activeTab.tab);
        }
        else {
            activeTab = parseInt(activeTab, 10);
        }

        if (!me.initialItems && (activeTab < -1 || activeTab >= tabCount)) {
            throw new Error(`Invalid activeTab ${activeTab} (${tabCount} tabs)`);
        }

        if (me.isDisabledOrHiddenTab(activeTab)) {
            activeTab = me.findAvailableTab(activeTab);
        }
        return activeTab;
    }

    updateActiveTab() {
        if (!this.initialItems) {
            const { activeTabItemIndex } = this;

            if (activeTabItemIndex > -1) {
                this.layout.activeIndex = activeTabItemIndex;
            }
        }
    }

    changeTabBar(bar) {
        this.getConfig('strips');

        this.strips = {
            tabBar : bar
        };

        return this.strips.tabBar;
    }

    makeTabConfig(item) {
        const
            { tab } = item,
            config  = {
                item,

                type      : 'tab',
                tabPanel  : this,
                disabled  : Boolean(item.disabled),
                hidden    : item.initialConfig.hidden,
                weight    : item.weight || 0,
                listeners : {
                    click   : 'onTabClick',
                    thisObj : this
                },
                localizableProperties : {
                    // our tabs copy their text from the item's title and so are not directly localized
                    text : false
                }
            };

        if (tab === false) {
            return null;
        }

        return ObjectHelper.isObject(tab) ? Tab.mergeConfigs(config, tab) : config;
    }

    updateItems(items, was) {
        const
            me                          = this,
            { activeTab, initialItems } = me;

        let index = 0,
            tabs;

        super.updateItems(items, was);

        if (initialItems) {
            tabs = Array.from(items, it => me.makeTabConfig(it)).filter(it => {
                if (it) {
                    it.index = index++;
                    return true;
                }
            });

            if (index) {
                tabs[0].isFirst = true;
                tabs[index - 1].isLast = true;
                tabs[activeTab].active = true;

                me.tabBar.add(tabs);
                me.activeTab = activeTab;  // now we can validate the activeTab value
            }
        }
    }

    updateTabMinWidth(tabMinWidth) {
        this.tabBar?.items.forEach(tab => {
            if (tab.isTab) {
                tab.minWidth = tabMinWidth;
            }
        });
    }

    updateTabMaxWidth(tabMaxWidth) {
        this.tabBar?.items.forEach(tab => {
            if (tab.isTab) {
                tab.maxWidth = tabMaxWidth;
            }
        });
    }

    //endregion

    //region Auto height

    updateAutoHeight(autoHeight) {
        this.detachListeners('themeAutoHeight');

        autoHeight && GlobalEvents.on({
            name    : 'themeAutoHeight',
            theme   : 'internalOnThemeChange',
            thisObj : this
        });

        this.$measureHeight = autoHeight;
    }

    applyAutoHeight() {
        const
            me                             = this,
            { layout, activeTab, element } = me,
            { animateCardChange }          = layout;

        // stop animate to change tabs on back stage.
        layout.animateCardChange = false;

        // override any previously applied height when measuring
        me.height = null;

        // get the max height comparing all tabs and apply to the tab
        me.height = Math.max(...me.items.map(tab => {
            me.activeTab = tab;
            return element.clientHeight;
        })) + 1;

        // Go back to initial configs
        me.activeTab = activeTab;
        layout.animateCardChange = animateCardChange;

        me.$measureHeight = false;
    }

    internalOnThemeChange() {
        if (this.isVisible) {
            this.applyAutoHeight();
        }
        else {
            this.$measureHeight = true;
        }
    }

    //endregion

    //region Events

    // Called after beforeActiveItemChange has fired and not been vetoed before animation and activeItemChange
    onBeginActiveItemChange(activeItemChangeEvent) {
        const
            tabs                           = this.tabBar.tabs,
            { activeItem, prevActiveItem } = activeItemChangeEvent;

        // Our UI changes immediately, our state must be accurate
        this.activeTab = tabs.indexOf(activeItem?.tab);

        // Deactivate previous active tab
        if (prevActiveItem?.tab) {
            prevActiveItem.tab.active = false;
        }

        if (activeItem?.tab) {
            activeItem.tab.active = true;
            activeItem.tab.show();
        }
    }

    // Auto called because Card layout triggers the beforeActiveItemChange on its owner
    onBeforeActiveItemChange(activeItemChangeEvent) {
        /**
         * The active tab is about to be changed. Return `false` to prevent this.
         * @event beforeTabChange
         * @preventable
         * @param {Number} activeIndex - The new active index.
         * @param {Core.widget.Widget} activeItem - The new active child widget.
         * @param {Number} prevActiveIndex - The previous active index.
         * @param {Core.widget.Widget} prevActiveItem - The previous active child widget.
         */
        return this.trigger('beforeTabChange', activeItemChangeEvent);
    }

    // Auto called because Card layout triggers the activeItemChange on its owner
    onActiveItemChange(activeItemChangeEvent) {
        /**
         * The active tab has changed.
         * @event tabChange
         * @param {Number} activeIndex - The new active index.
         * @param {Core.widget.Widget} activeItem - The new active child widget.
         * @param {Number} prevActiveIndex - The previous active index.
         * @param {Core.widget.Widget} prevActiveItem - The previous active child widget.
         */
        this.trigger('tabChange', activeItemChangeEvent);
    }

    onTabClick(event) {
        this.activeTab = event.source.item;
    }

    onPaint() {
        super.onPaint(...arguments);

        // Measure tabs on first paint if configured to do so
        if (this.$measureHeight) {
            this.applyAutoHeight();
        }
    }

    //endregion
}

// Register this widget type with its Factory
TabPanel.initClass();
