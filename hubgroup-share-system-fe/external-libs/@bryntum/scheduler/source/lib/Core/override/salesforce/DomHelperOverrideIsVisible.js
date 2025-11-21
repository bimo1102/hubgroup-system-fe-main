import DomHelper from '../../helper/DomHelper.js';
import Override from '../../mixin/Override.js';

const
    parentNode = el => el.parentNode || el.host,
    isVisible  = e => {
        const style = e.ownerDocument.defaultView.getComputedStyle(e);

        return style.getPropertyValue('display') !== 'none' && style.getPropertyValue('visibility') !== 'hidden';
    };

/*
 * This override constrains isVisible lookup to LWC container element as we're not allowed to go above
 * @private
 */
class DomHelperOverrideIsVisible {
    static get target() {
        return {
            class : DomHelper
        };
    }

    static isVisible(element) {
        const document = element.ownerDocument;

        // Use the parentNode function so that we can traverse upwards through shadow DOM
        // to correctly ascertain visibility of nodes in web components.
        for (; element; element = parentNode(element)) {
            // Visible if we've reached top of the owning document without finding a hidden Element.
            if (element === document) {
                return true;
            }
            // Must not evaluate a shadow DOM's root fragment.
            if (element.nodeType === Element.ELEMENT_NODE && !isVisible(element)) {
                return false;
            }

            // Locker Service locks DOM traverse inside the shadow root. If node is connected to the DOM but the
            // parent element is null it apparently means that we have reached web component element and are not able
            // to continue lookup. Let's just return true here.
            if (!element.parentNode && element.isConnected) {
                return true;
            }
        }

        // We get here if the node is detached.
        return false;
    }
}

Override.apply(DomHelperOverrideIsVisible);
