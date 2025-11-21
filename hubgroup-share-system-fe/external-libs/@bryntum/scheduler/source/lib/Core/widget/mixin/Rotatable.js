import Base from '../../Base.js';

/**
 * @module Core/widget/mixin/Rotatable
 */

// we set rotate to 'LEFT' or 'RIGHT' when we auto rotate so we can tell it was (most likely) us:
const
    autoRotateRe  = /^(?:undefined|null|LEFT|RIGHT)$/,
    inverted = {
        TOP    : 'BOTTOM',
        RIGHT  : 'LEFT',
        BOTTOM : 'TOP',
        LEFT   : 'RIGHT'
    };

export const canonicalDock = dock => {
    const DOCK = dock?.toUpperCase();
    return [DOCK, DOCK === 'LEFT' || DOCK === 'RIGHT'];
};

/**
 * A mixin that provides support for rotating a widget's primary element.
 * @mixin
 * @internal
 */
export default Target => class Rotatable extends (Target || Base) {
    static get $name() {
        return 'Rotatable';
    }

    static get configurable() {
        return {
            /**
             * Set to `'left'` to rotate the button content 90 degrees counter-clockwise or `'right'` for clockwise.
             * @member {String} rotate
             */
            /**
             * Specify `'left'` to rotate the button content 90 degrees counter-clockwise or `'right'` for clockwise.
             * @config {String} rotate
             */
            rotate : null,

            invertRotate : null
        };
    }

    compose() {
        const { rotate } = this;

        return {
            class : {
                [`b-rotate-${(rotate || '').toLowerCase()}`] : rotate,
                'b-rotate-vertical'                          : rotate
            }
        };
    }

    syncRotationToDock(dock) {
        if (autoRotateRe.test(String(this.rotate))) {
            const [DOCK, vertical] = canonicalDock(dock);

            this.rotate = vertical ? (this.invertRotate ? inverted[DOCK] : DOCK) : null;
        }
    }

    get widgetClass() {
        return null;
    }
};
