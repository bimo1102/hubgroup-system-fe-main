import DomHelper from '../../helper/DomHelper.js';
import Widget from '../../widget/Widget.js';

// Fixing issue: https://github.com/bryntum/support/issues/2659
const descriptor = Object.getOwnPropertyDescriptor(Widget.prototype, 'floatRoot');
const old = descriptor.get;

Object.defineProperty(Widget.prototype, 'floatRoot', {
    get : function() {
        const
            me          = this,
            rootElement = me.rootElement || me.owner?.rootElement;

        let { floatRoot } = rootElement;

        if (!floatRoot) {
            floatRoot = old.call(this);
        }
        // element.contains is broken for nodes that we do not control
        else if (DomHelper.getRootElement(floatRoot) !== rootElement) {
            rootElement.appendChild(floatRoot);
        }

        return floatRoot;
    }
});
