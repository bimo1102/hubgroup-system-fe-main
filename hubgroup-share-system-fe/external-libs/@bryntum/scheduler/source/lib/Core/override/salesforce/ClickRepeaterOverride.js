import Override from '../../mixin/Override.js';
import ClickRepeater from '../../util/ClickRepeater.js';

/*
 * Fixes problem with Click Repeater in LWC
 * https://github.com/bryntum/support/issues/2321
 *
 * There are two issues behind it:
 * 1. Cannot instantiate MouseEvent passing old mouse event because some configs (sourceCapabilities, view) do not pass
 * instanceof check.
 * 2. Dispatch target is wrong. By the time fireClick is called, stored event target is pointing to the document.body.
 * We have to store real target additionally in mousedown listener.
 * @private
 */

class ClickRepeaterOverride {
    static get target() {
        return {
            class : ClickRepeater
        };
    }

    onMouseDown(e) {
        this._overridden.onMouseDown.apply(this, arguments);

        this.eventTarget = e.target;
    }

    fireClick() {
        const
            me     = this,
            config = {};

        [
            'altKey',
            'bubbles',
            'button',
            'buttons',
            'cancelBubble',
            'cancelable',
            'clientX',
            'clientY',
            'ctrlKey',
            'layerX',
            'layerY',
            'metaKey',
            'pageX',
            'pageY',
            'returnValue',
            'screenX',
            'screenY',
            'shiftKey'
        ].forEach(key => {
            config[key] = me.triggerEvent[key];
        });

        const clickEvent = new MouseEvent('click', config);

        me.eventTarget?.dispatchEvent(clickEvent);
        me.repeatTimer = me.setTimeout(me.fireClick, me.interval);
    }
}

Override.apply(ClickRepeaterOverride);
