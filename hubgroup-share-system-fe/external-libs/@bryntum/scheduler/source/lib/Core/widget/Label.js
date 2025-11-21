import Widget from './Widget.js';

export default class Label extends Widget {
    static $name = 'Label';
    static type = 'label';

    static configurable = {
        text : null
    }

    compose() {
        const { text, html } = this;

        return {
            tag : 'label',
            text,
            html
        };
    }
}

Label.initClass();
