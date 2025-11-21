import Widget from './Widget.js';
import ClickRepeater from '../util/ClickRepeater.js';
import Rotatable from './mixin/Rotatable.js';

/**
 * @module Core/widget/Tool
 */

/**
 * Base class for tools.
 *
 * May be configured with a `cls` and a `handler` which is a function (or name of a function)
 * in the owning Panel.
 * @extends Core/widget/Widget
 *
 * @classType tool
 */
export default class Tool extends Widget.mixin(Rotatable) {
    static get $name() {
        return 'Tool';
    }

    // Factoryable type name
    static get type() {
        return 'tool';
    }

    static get configurable() {
        return {
            /**
             * Specify `'start'` to place the tool before the owner's central element (e.g., the `title` of the panel).
             * @config {String}
             * @default 'end'
             * @category Float & align
             */
            align : {
                value   : null,
                $config : {
                    merge : 'replace'
                }
            },

            /**
             * The function to call when this tool is clicked.
             * @config {Function} handler
             */

            /**
             * A {@link Core.util.ClickRepeater ClickRepeater} config object to specify how
             * click-and-hold gestures repeat the click action.
             * @config {Object}
             */
            repeat : null,

            ariaLabel : null
        };
    }

    compose() {
        const { align, ariaLabel } = this;

        return {
            tag   : 'button',
            class : {
                [`b-align-${align || 'end'}`] : 1,
                'b-icon'                      : 1
            },
            'aria-label' : ariaLabel,
            listeners    : {
                click : 'onClick'
            }
        };
    }

    get focusElement() {
        return this.element;
    }

    get panel() {
        return this.parent;
    }

    changeAlign(align) {
        return align;  // replace Widget.changeAlign
    }

    onClick(e) {
        const { handler, panel } = this;

        if (panel?.trigger('toolclick', { domEvent : e, tool : this }) !== false) {
            handler && this.callback(handler, panel, [e]);
        }
    }

    onInternalKeyDown(keyEvent) {
        const keyName = keyEvent.key.trim() || keyEvent.code;

        // Don't allow key invocations to bubble and trigger owning
        // widget's key handlers.
        if (keyName === 'Enter') {
            keyEvent.cancelBubble = true;
            keyEvent.stopPropagation();
        }
    }

    updateDisabled(disabled, was) {
        super.updateDisabled(disabled, was);

        disabled && this.repeat?.cancel();
    }

    changeRepeat(repeat, oldRepeat) {
        oldRepeat?.destroy();

        return repeat && ClickRepeater.new({
            element : this.element
        }, repeat);
    }
}

// Register this widget type with its Factory
Tool.initClass();
