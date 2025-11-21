import Override from '../../mixin/Override.js';
import Widget from '../../widget/Widget.js';

/*
 * This override replaces usage of DocumentFragment with an easier approach of moving several elements one by one
 * @private
 */
class WidgetOverrideToFront {
    static get target() {
        return {
            class : Widget
        };
    }

    toFront() {
        const
            { element } = this,
            parent      = this.floating ? this.floatRoot : this.positioned ? element?.parentNode : null;

        //<debug>
        if (!parent) {
            throw new Error('Only floating or positioned Widgets can use toFront');
        }
        //</debug>

        let currentSibling;

        while (element && (currentSibling = element.nextSibling)) {
            parent.insertBefore(currentSibling, element);
        }
    }
}

Override.apply(WidgetOverrideToFront);
