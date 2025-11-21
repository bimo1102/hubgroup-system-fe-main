import Panel from '../../widget/Panel.js';
import Override from '../../mixin/Override.js';
import createTreeWalker, { NodeFilter } from './TreeWalker.js';
import DomHelper from '../../helper/DomHelper.js';

const acceptNode = e => !e.classList.contains('b-focus-trap') && DomHelper.isFocusable(e) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;

/*
 * TreeWalker doesn't function correctly in salesforce, node cannot be changed. So we use polyfill here instead of default.
 * https://github.com/salesforce/lwc/issues/1795
 * @private
 */
class PanelOverride {
    static get target() {
        return {
            class : Panel
        };
    }

    setupTreeWalker(root) {
        return createTreeWalker(root, NodeFilter.SHOW_ELEMENT, acceptNode);
    }
}

Override.apply(PanelOverride);
