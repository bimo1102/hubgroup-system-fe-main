import BrowserHelper from '../../helper/BrowserHelper.js';
import Override from '../../mixin/Override.js';

/*
 * This override replaces instanceof check with a specific property lookup to determine if pointer events are supported
 * @private
 */
class BrowserHelperOverridePointerEvents {
    static get target() {
        return {
            class : BrowserHelper
        };
    }

    static get supportsPointerEvents() {
        // PointerEvent is not supported
        // https://developer.salesforce.com/docs/component-library/tools/locker-service-viewer
        return 'onpointerdown' in HTMLElement.prototype;
    }
}

Override.apply(BrowserHelperOverridePointerEvents);
