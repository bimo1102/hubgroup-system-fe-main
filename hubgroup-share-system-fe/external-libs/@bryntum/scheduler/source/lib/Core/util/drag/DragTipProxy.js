import DragProxy from './DragProxy.js';
import Widget from '../../widget/Widget.js';
import Rectangle from '../../helper/util/Rectangle.js';

import '../../widget/Tooltip.js';

/**
 * @module Core/util/drag/DragTipProxy
 */

/**
 * This drag proxy manages a {@link #config-tooltip} (or derived class) and aligns the tooltip to the current drag
 * position adjusted by the {@link #config-align} config.
 * @extends Core/util/drag/DragProxy
 * @classtype tip
 * @internal
 */
export default class DragTipProxy extends DragProxy {
    static get type() {
        return 'tip';
    }

    static get configurable() {
        return {
            /**
             * Controls how the tooltip will be aligned to the current drag position.
             *
             * See {@link Core.helper.util.Rectangle#function-alignTo} for details.
             * @config {String}
             * @default
             */
            align : 't10-b50',

            /**
             * The number of pixels to offset from the drag position.
             * @config {Number}
             * @default
             */
            offset : 20,

            /**
             * The tooltip to be shown, hidden and repositioned to track the drag position.
             * @config {Core.widget.Tooltip}
             */
            tooltip : {
                $config : ['lazy', 'nullify'],

                value : {
                    type : 'tooltip'
                }
            }
        };
    }

    open() {
        this.getConfig('tooltip');  // trigger creation
    }

    close() {
        this.tooltip?.hide();
    }

    dragMove(drag) {
        const
            { offset, tooltip } = this,
            { event } = drag;

        if (tooltip) {
            if (!tooltip.isVisible) {
                tooltip.show();
            }

            tooltip.alignTo({
                align  : this.align,
                target : new Rectangle(event.clientX - offset, event.clientY - offset, offset * 2, offset * 2)
            });
        }
    }

    changeTooltip(config, existing) {
        return Widget.reconfigure(existing, config, /* owner = */ this);
    }
}

DragTipProxy.initClass();
