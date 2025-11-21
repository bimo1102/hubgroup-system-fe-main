import Override from '../../mixin/Override.js';
import Navigator from '../../helper/util/Navigator.js';
import createTreeWalker, { NodeFilter } from './TreeWalker.js';

/*
 * This override fixes focus trapping inside the combobox and popup. Without it combobox items couldn't be navigated
 * with a keyboard and tabbing through fields won't keep focus inside the popup.
 * @private
 */
class NavigatorOverride {
    static get target() {
        return {
            class : Navigator
        };
    }

    setupTreeWalker(root, whatToShow, filter) {
        return createTreeWalker(root, NodeFilter.SHOW_ELEMENT, filter);
    }

    acceptNode(node) {
        return node.offsetParent && node.matches?.(this.itemSelector) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
}

Override.apply(NavigatorOverride);
