import DomHelper from '../../helper/DomHelper.js';
import Override from '../../mixin/Override.js';

/*
 * elementFromPoint could return not instance of HTMLElement. element`s`FromPoint seems not to have this issue
 * @private
 */
class DomHelperOverrideElementFromPoint {
    static get target() {
        return {
            class : DomHelper
        };
    }

    static elementFromPoint(x, y) {
        return document.elementsFromPoint(x, y)[0];
    }
}

Override.apply(DomHelperOverrideElementFromPoint);
