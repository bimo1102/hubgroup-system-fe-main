import Widget from '../Widget.js';
import StringHelper from '../../helper/StringHelper.js';
import BrowserHelper from '../../helper/BrowserHelper.js';
import DomSync from '../../helper/DomSync.js';
import Tooltip from '../Tooltip.js';

/**
 * @module Core/widget/graph/Histogram
 */
const
    ns = 'http://www.w3.org/2000/svg',
    // Outline series must overlay bars
    typePrio = {
        bar     : 1,
        outline : 2,
        text    : 3
    },
    byDatasetOrder = (l, r) => parseInt(l.dataset.order, 10) - parseInt(r.dataset.order, 10),
    getField = s => s.field,
    returnFalse = () => false;

/**
 * Displays a simple bar histogram based upon an array of data objects passed in the {@link #config-data} config.
 * @extends Core/widget/Widget
 * @classtype histogram
 */
export default class Histogram extends Widget {
    //region Config

    static get type() {
        return 'histogram';
    }

    static get $name() {
        return 'Histogram';
    }

    static get defaultConfig() {
        return {
            /**
             * An array of data objects used to drive the histogram. The property/properties used
             * are defined in the {@link #config-series} option.
             * @config {Object[]}
             * @default
             */
            data : null,

            /**
             * The values to represent in bar form.
             * @config {Number[]}
             */
            values : null,

            /**
             * Each item in the array must contain two properties:
             *  - `type` A String, either `'bar'` or `'outline'`
             *  - `field` A String, the name of the property to use from the data objects in the {@link #config-data} option.
             * @config {Object[]}
             */
            series : null,

            /**
             * By default, the bars are scaled based upon the detected max value across all the series.
             * A specific top value to represent the 100% height may be configured.
             * @config {Number}
             */
            topValue : null,

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
                        reference : 'scaledSvgGroup'
                    }, {
                        ns,
                        tag       : 'g',
                        reference : 'unscaledSvgGroup'
                    }]
                }]
            },

            /**
             * By default, all bars are rendered, even those with zero height. Configure this as `true`
             * to omit zero height bars.
             * @config {Number}
             */
            omitZeroHeightBars : null,

            monitorResize : true,

            /**
             * A Function which returns a CSS class name to add to a rectangle element.
             * The following parameters are passed:
             * @param {Object} series - The series being rendered
             * @param {Object} rectConfig - The rectangle configuration object
             * @param {Object} datum - The datum being rendered
             * @param {Number} index - The index of the datum being rendered
             * @config {Function}
             */
            getRectClass : null,

            /**
             * A Function which returns the tooltip text to display when hovering a bar.
             * The following parameters are passed:
             * @param {Object} series - The series being rendered
             * @param {Object} rectConfig - The rectangle configuration object
             * @param {Object} datum - The datum being rendered
             * @param {Number} index - The index of the datum being rendered
             * @config {Function}
             */
            getBarTip : null,

            /**
             * A Function which returns the text to render inside a bar.
             * The following parameters are passed:
             * @param {Object} datum - The datum being rendered
             * @param {Number} index - The index of the datum being rendered
             * @config {Function}
             */
            getBarText : null
        };
    }

    //endregion

    //region Init

    construct(config) {
        super.construct(config);
        this.scheduleRefresh = this.createOnFrame(this.refresh, [], this, true);
        this.refresh();
    }

    set tip(tip) {
        const me = this;

        me.tip?.destroy();

        if (tip) {
            me._tip = Tooltip.new({
                owner       : me,
                forElement  : me.svgElement,
                forSelector : 'rect',
                listeners   : {
                    beforeShow : 'up.onBeforeTipShow'
                }
            }, tip);
        }
        else {
            me._tip = null;
        }
    }

    onElementResize() {
        super.onElementResize(...arguments);

        const svgRect = this.svgElement.getBoundingClientRect();

        this.scaledSvgGroup.setAttribute('transform', `scale(${svgRect.width} ${svgRect.height})`);
    }

    onBeforeTipShow({ source : tip }) {
        const index = parseInt(tip.activeTarget.dataset.index);

        tip.html = tip.contentTemplate({
            histogram : this,
            index
        });
    }

    set series(value) {
        const
            me     = this,
            series = me._series = {};

        for (const id in value) {
            // Providing
            //
            // "series" : {
            //     "foo" : false
            //     ...
            //
            // disables the "foo" serie (that could be defined on a prototype level for example)

            if (value[id] !== false) {
                const data = series[id] = Object.assign({}, value[id]);

                // support type & field provided on config prototype level

                if (!data.type && value[id].type) {
                    data.type = value[id].type;
                }

                if (!data.field && value[id].field) {
                    data.field = value[id].field;
                }

                if (!('order' in series)) {
                    data.order = typePrio[data.type];
                }

                data.id = id;
            }
        }

        me.scheduleRefresh();
    }

    get series() {
        return this._series;
    }

    set data(data) {
        const me = this;

        // TODO:
        // me.topValue = undefined;

        me._data = data;

        // Calculate the top value from all the series
        if (!me.topValue) {
            const fields   = Object.values(me.series).map(getField);

            for (let i = 0, { length } = data; i < length; i++) {
                for (let j = 0, { length } = fields; j < length; j++) {
                    me.topValue = Math.max(me.topValue || 0, data[i][fields[j]]);
                }
            }
        }

        me.scheduleRefresh();
    }

    get data() {
        return this._data;
    }

    set topValue(value) {
        this._topValue = value;

        this.scheduleRefresh();
    }

    get topValue() {
        return this._topValue;
    }

    // Must exist from the start because configuration setters call it.
    // Once configured, will be replaced with a function which schedules a refresh for the next animation frame.
    scheduleRefresh() {

    }

    refresh() {
        const
            me             = this,
            {
                series,
                _tip
            }              = me,
            histogramElements = [];

        for (const id in series) {
            const
                data     = series[id],
                elConfig = me[`draw${StringHelper.capitalize(data.type)}`](data);

            if (Array.isArray(elConfig)) {
                histogramElements.push.apply(histogramElements, elConfig);
            }
            else {
                histogramElements.push(elConfig);
            }
        }

        histogramElements.sort(byDatasetOrder);

        DomSync.syncChildren({
            domConfig      : { children : histogramElements },
            configEquality : returnFalse
        }, me.scaledSvgGroup);

        DomSync.syncChildren({
            domConfig : { children : me.drawText() }
        }, me.unscaledSvgGroup);

        if (_tip && _tip.isVisible) {
            me.onBeforeTipShow({ source : _tip });
        }
    }

    drawBar(series) {
        const
            me           = this,
            {
                topValue,
                data,
                omitZeroHeightBars,
                barStyle
            }            = me,
            {
                field,
                order
            }            = series,
            defaultWidth = 1 / data.length,
            children     = [];

        let
            width;

        for (let index = 0, x = 0, { length } = data; index < length; index++, x += width) {
            const
                datum = data[index],
                value = datum[field],
                // limit height with topValue otherwise the histogram looks fine
                // yet the bar tooltip picks wrong Y-coordinate and there is an empty space between it and the bar
                height = (value > topValue ? topValue : value) / topValue,
                y = 1 - height,
                rectConfig = (datum.rectConfig = {
                    ns,
                    tag     : 'rect',
                    dataset : {}
                });

            // use either provided width or the calculated value
            width = datum.width || defaultWidth;

            if (BrowserHelper.isEdge || BrowserHelper.isIE11) {
                // Apparently in Edge height is calculated differently for scaled SVG content, height of the bounding client rect is calculated by formula
                // (height + 1) * scale. So visible height would be getBoundingClientRect().height - verticalScaleValue. In our case
                // verticalScaleValue is same as svgElement height.
                const svgRect = me.svgElement.getBoundingClientRect();

                rectConfig.dataset.scaleX = svgRect.width;
                rectConfig.dataset.scaleY = svgRect.height;
            }

            if (barStyle) {
                rectConfig.style = barStyle;
            }
            else {
                delete rectConfig.style;
            }
            Object.assign(rectConfig.dataset, {
                index,
                order
            });
            Object.assign(rectConfig, {
                x,
                y,
                width,
                height,
                class : me.callback('getRectClass', me, [series, rectConfig, datum, index])
            });
            const barTip = me.callback('getBarTip', me, [series, rectConfig, datum, index]);
            if (barTip) {
                rectConfig.dataset.btip = barTip;
            }
            else {
                delete rectConfig.dataset.btip;
            }

            if (height || !omitZeroHeightBars) {
                children.push(rectConfig);
            }
        }
        return children;
    }

    drawOutline(series) {
        const
            me           = this,
            {
                topValue,
                data
            }            = me,
            {
                field,
                order
            }            = series,
            defaultWidth = 1 / data.length,
            coords       = ['M 0,1'],
            result       = series.outlineElement || (series.outlineElement = {
                ns,
                tag     : 'path',
                dataset : {
                    order
                }
            });

        if (BrowserHelper.isEdge || BrowserHelper.isIE11) {
            const svgRect = me.svgElement.getBoundingClientRect();

            // Edge doesn't support `vector-effect` style and scales stroke-width too
            result.style = `stroke-width: ${1 / Math.min(svgRect.width, svgRect.height)}px`;
        }

        let
            barWidth,
            command1 = 'M',
            command2 = 'L';

        for (let i = 0, x = 0, { length } = data; i < length; i++) {
            const barHeight = 1 - data[i][field] / topValue;

            // use either provided with or the calculated value
            barWidth = data[i].width || defaultWidth;

            coords.push(`${command1} ${x},${barHeight} ${command2} ${x += barWidth},${barHeight}`);
            command1 = command2 = '';
        }
        // coords.push('1,1');

        result.d = coords.join(' ');

        return result;
    }

    drawText() {
        const
            me                = this,
            { data }          = me,
            defaultWidth      = 1 / data.length,
            y                 = '100%',
            unscaledSvgGroups = [];

        for (let index = 0, width, x = 0, { length } = data; index < length; index++, x += width) {
            width = data[index].width || defaultWidth;

            const barText = me.callback('getBarText', me, [data[index], index]);

            if (barText) {
                unscaledSvgGroups.push({
                    ns,
                    tag       : 'text',
                    className : 'b-bar-legend',
                    html      : me.callback('getBarText', me, [data[index], index]),
                    x         : `${(x + width / 2) * 100}%`,
                    y,
                    dataset   : {
                        index
                    }
                });
            }
        }

        return unscaledSvgGroups;
    }

    //endregion

    // Injectable method
    getBarText(datum, index) {
        return '';
    }

    // Injectable method
    getBarTip(series, rectConfig, datum, index) {

    }

    // Injectable method
    getRectClass(series, rectConfig, datum, index) {
        return '';
    }
}

Histogram.initClass();
