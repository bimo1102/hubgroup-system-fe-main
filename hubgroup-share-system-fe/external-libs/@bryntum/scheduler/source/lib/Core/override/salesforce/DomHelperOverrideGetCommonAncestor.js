import DomHelper from '../../helper/DomHelper.js';
import Override from '../../mixin/Override.js';

/*
 * In some cases root LWC element might report that it doesn't contains own children:
 * ```
 * to.parentElement....parentElement === from // true
 * from.contains(to) // false
 * ```
 * At the same time shadow root reports it correctly:
 * ```
 * from.parentElement.contains(to) // true
 * ```
 *
 * It means that method goes one level too high and we need to take first child of the shadow root.
 * @private
 */
class DomHelperOverrideGetCommonAncestor {
    static get target() {
        return {
            class : DomHelper
        };
    }

    static getCommonAncestor(from, to) {
        let result = this._overridden.getCommonAncestor.call(this, from, to);

        // some element reported that it is a common ancestor of two element
        // if this element is a shadow root, we need to return first child (there is always one and only)
        if (result != null && result.isConnected && !result.parentElement) {
            result = result.firstChild;
        }

        return result;
    }
}

Override.apply(DomHelperOverrideGetCommonAncestor);
