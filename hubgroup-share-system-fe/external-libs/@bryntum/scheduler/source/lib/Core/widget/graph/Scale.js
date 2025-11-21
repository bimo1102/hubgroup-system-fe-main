import Widget from '../Widget.js';
import DomSync from '../../helper/DomSync.js';

/**
 * @module Core/widget/graph/Scale
 */
const
    ns = 'http://www.w3.org/2000/svg';

/**
 * Displays a scale with ticks and labels.
 * @extends Core/widget/Widget
 * @classtype scale
 */
export default class Scale extends Widget {
    //region Config

    static get type() {
        return 'scale';
    }

    static get $name() {
        return 'Scale';
    }

    static get configurable() {
        return {
            scalePoints : null,

            // Padding after the max scale point.
            // Expressed as the share of the height.
            scaleMaxPadding : 0.1,

            /**
             * Configure as `true` to create a horizontal scale. Scales are vertical by default.
             * @config {Boolean}
             */
            horizontal : false,

            /**
             * Side to align the scale to. Defaults to `bottom` for {@link #config-horizontal} Scales
             * and `right` for vertical Scales.
             * @config {String}
             */
            align : {
                value   : false,
                $config : {
                    merge : 'replace'
                }
            },

            element : {
                children : [{
                    ns,
                    tag                 : 'svg',
                    reference           : 'svgElement',
                    width               : '100%',
                    height              : '100%',
                    preserveAspectRatio : 'none',
                    children            : [{
                        ns,
                        tag       : 'g',
                        reference : 'scaledSvgGroup',
                        children  : [{
                            ns,
                            tag       : 'path',
                            reference : 'pathElement'
                        }]
                    }, {
                        ns,
                        tag       : 'g',
                        reference : 'unscaledSvgGroup'
                    }]
                }]
            },

            monitorResize : true
        };
    }

    //endregion

    //region Init

    construct(config) {
        super.construct(config);
        this.scheduleRefresh = this.createOnFrame(this.refresh, [], this, true);
        this.refresh();
    }

    changeAlign(align) {
        if (!align) {
            align = this.horizontal ? 'bottom' : 'right';
        }
        return align;
    }

    updateAlign(align, oldAlign) {
        this.element.classList.remove(`b-align-${oldAlign}`);
        this.element.classList.add(`b-align-${align}`);
    }

    updateHorizontal(horizontal, oldHorizontal) {
        this.element.classList.remove(`b-scale-${oldHorizontal ? 'horizontal' : 'vertical'}`);
        this.element.classList.add(`b-scale-${horizontal ? 'horizontal' : 'vertical'}`);
    }

    onElementResize() {
        super.onElementResize(...arguments);
        this.scheduleRefresh();
    }

    // Must exist from the start because configuration setters call it.
    // Once configured, will be replaced with a function which schedules a refresh for the next animation frame.
    scheduleRefresh() {

    }

    refresh() {
        const
            me             = this,
            {
                horizontal,
                width,
                height,
                align,
                scalePoints,
                scaleMaxPadding
            }                  = me,
            scaleMax           = scalePoints[scalePoints.length - 1].value,
            path               = [],
            labels             = [];

        const posFactor = 1 / (scaleMax + scaleMaxPadding * scaleMax);

        me.scaledSvgGroup.setAttribute('transform', `scale(${horizontal ? width : 1} ${horizontal ? 1 : height})`);

        for (const point of scalePoints) {
            const isLabelStep = Boolean(point.text),
                pos = posFactor * point.value;

            if (isLabelStep) {
                const label = {
                    ns,
                    tag       : 'text',
                    className : 'b-scale-tick-label',
                    html      : point.text,
                    dataset   : {
                        tick : point.value
                    }
                };

                if (horizontal) {
                    label.x = `${pos * 100}%`;
                    label.y = align === 'top' ? '1.6em' : height - 12;
                }
                else {
                    label.x = align === 'left' ? '12' : `${width - 12}`;
                    label.y = `${(1 - pos) * 100}%`;
                }
                labels.push(label);
            }

            if (horizontal) {
                if (align === 'top') {
                    path.push(`M${pos},0 L${pos},${isLabelStep ? 10 : 5}`);
                }
                else {
                    path.push(`M${pos},${height} L${pos},${height - (isLabelStep ? 10 : 5)}`);
                }
            }
            else {
                if (align === 'left') {
                    path.push(`M0,${1 - pos} L${isLabelStep ? 10 : 5},${1 - pos}`);
                }
                else {
                    path.push(`M${width},${1 - pos} L${width - (isLabelStep ? 10 : 5)},${1 - pos}`);
                }
            }
        }
        me.pathElement.setAttribute('d', path.join(''));
        DomSync.syncChildren({
            domConfig : { children : labels }
        }, me.unscaledSvgGroup);
    }

    //endregion
}
