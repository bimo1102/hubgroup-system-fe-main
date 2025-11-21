import Toolbar from './Toolbar.js';
import ArrayHelper from '../helper/ArrayHelper.js';

import './Tab.js';

/**
 * @module Core/widget/TabBar
 */

const
    isTab = t => t.isTab;

/**
 * A special toolbar used by {@link Core.widget.TabPanel} to present {@link Core.widget.Tab tabs} for the container's
 * items.
 *
 * The {@link Core.widget.Container#config-items} of a tab bar are typically managed by the tab panel, however,
 * items can be added that do not correspond to items in the tab panel. The {@link Core.widget.Widget#config-weight}
 * config of each tab defaults to 0 or the weight of its corresponding item.
 *
 * @extends Core/widget/Toolbar
 * @classType tabbar
 */
export default class TabBar extends Toolbar {
    static get $name() {
        return 'TabBar';
    }

    // Factoryable type name
    static get type() {
        return 'tabbar';
    }

    static get configurable() {
        return {
            defaultType : 'tab',

            overflow : 'scroll'
        };
    }

    get firstTab() {
        return this.tabAt(0);
    }

    get lastTab() {
        return this.tabAt(-1);
    }

    get tabCount() {
        return this._items.countOf(isTab);
    }

    get tabs() {
        return ArrayHelper.from(this._items, isTab);
    }

    compose() {
        return {
            children : {
                toolbarContent : {
                    class : {
                        'b-tabpanel-tabs' : 1
                    }
                }
            }
        };
    }

    indexOfTab(tab) {
        return this._items.indexOf(tab, isTab);
    }

    onChildAdd(child) {
        super.onChildAdd(child);

        if (child.index == null) {
            this.syncTabs();
        }
    }

    onChildRemove(child) {
        super.onChildRemove(child);

        this.syncTabs();
    }

    syncTabs() {
        const { tabs } = this;

        for (let i = 0, n = tabs.length; i < n; ++i) {
            tabs[i].index = i;
            tabs[i].isFirst = !i;
            tabs[i].isLast = i === n - 1;
        }
    }

    tabAt(index) {
        return this._items.find(isTab, index) || null;
    }
}

// Register this widget type with its Factory
TabBar.initClass();
