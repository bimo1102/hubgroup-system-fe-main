import Widget from '../../widget/Widget.js';
import Override from '../../mixin/Override.js';

/*
 * Setting drag image is not supported.
 * https://github.com/salesforce/lwc/issues/1809
 * @private
 */
class WidgetOverrideSetDragImage {
    static get target() {
        return {
            class : Widget
        };
    }

    setDragImage() {}
}

Override.apply(WidgetOverrideSetDragImage);
