/*
 * DomHelper.activeElement fix
 * https://github.com/salesforce/lwc/issues/1792
 *
 * Core uses shadowRoot to dive into webcomponents looking for active element. That doesn't work with LockerService.
 * This override relies on a bundle local (closure) variable `lwcElement`
 * @private
 */
import DomHelper from '../../helper/DomHelper.js';
import Override from '../../mixin/Override.js';

class DomHelperOverrideActiveElement {
    static get target() {
        return {
            class : DomHelper
        };
    }

    static getActiveElement(element) {
        if (element?.isWidget) {
            element = element.element;
        }

        return element?.getRootNode?.().activeElement;
    }
}

Override.apply(DomHelperOverrideActiveElement);
