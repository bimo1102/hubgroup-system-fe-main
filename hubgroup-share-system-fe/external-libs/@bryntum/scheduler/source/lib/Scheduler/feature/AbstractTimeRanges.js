import InstancePlugin from '../../Core/mixin/InstancePlugin.js';
import Store from '../../Core/data/Store.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import DragHelper from '../../Core/helper/DragHelper.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import Tooltip from '../../Core/widget/Tooltip.js';
import ClockTemplate from '../tooltip/ClockTemplate.js';
import DateHelper from '../../Core/helper/DateHelper.js';
import Delayable from '../../Core/mixin/Delayable.js';
import ResizeHelper from '../../Core/helper/ResizeHelper.js';
import TimeSpan from '../model/TimeSpan.js';

/**
 * @module Scheduler/feature/AbstractTimeRanges
 */

/**
 * Abstract base class, you should not use this class directly.
 * @abstract
 * @mixes Core/mixin/Delayable
 * @extends Core/mixin/InstancePlugin
 */
export default class AbstractTimeRanges extends InstancePlugin.mixin(Delayable) {
    //region Config

    static get defaultConfig() {
        return {
            // CSS class to apply to range elements
            rangeCls : 'b-sch-range',

            // CSS class to apply to line elements (0-duration time range)
            lineCls : 'b-sch-line',

            /**
             * Store that holds timeRanges (using the {@link Scheduler.model.TimeSpan} model or subclass thereof).
             * A store will be automatically created if none is specified
             * @config {Object|Core.data.Store}
             */
            store : {
                modelClass : TimeSpan
            },

            /**
             * Set to `true` to enable dragging and resizing of range elements in the header. Only relevant when {@link #config-showHeaderElements} is true.
             * @config {Boolean}
             * @defaultValue
             */
            enableResizing : false,

            /**
             * A Boolean specifying whether or not to show tooltip while resizing range elements, or a
             * {@link Core.widget.Tooltip} config object which is applied to the tooltip
             * @config {Boolean|Object}
             * @default
             */
            showTooltip : true,

            /**
             * `true` to render range elements into the time axis header
             * @config {Boolean}
             * @default
             */
            showHeaderElements : true,

            /**
             * Template used to generate the tooltip contents when hovering a time range header element.
             * ```
             * const scheduler = new Gantt({
             *   features : {
             *     timeRanges : {
             *       tooltipTemplate({ timeRange }) {
             *         return `${timeRange.name}`
             *       }
             *     }
             *   }
             * });
             * ```
             * @config {Function} tooltipTemplate
             * @param {Object} data Tooltip data
             * @param {Scheduler.model.TimeSpan} data.timeRange
             */
            tooltipTemplate : null,

            dragTipTemplate : data => `
                <div class="b-sch-tip-${data.valid ? 'valid' : 'invalid'}">
                    <div class="b-sch-tip-name">${data.name || ''}</div>
                    ${data.startClockHtml}
                    ${data.endClockHtml || ''}
                </div>
            `,

            baseCls : 'b-sch-timerange',

            // a unique cls used by subclasses to get custom styling of the elements rendered
            cls : '',

            narrowThreshold : 80
        };
    }

    // Plugin configuration. This plugin chains some of the functions in Grid.
    static get pluginConfig() {
        return {
            chain : [
                'onPaint',
                'populateHeaderMenu', // TODO: 'headerContextMenu' is deprecated. Please see https://bryntum.com/docs/scheduler/#Scheduler/guides/upgrades/3.1.0.md for more information.
                'populateTimeAxisHeaderMenu'
            ]
        };
    }

    //endregion

    //region Init & destroy

    construct(client, config) {
        const me = this;

        super.construct(client, config);

        if (client.isVertical) {
            client.on({
                renderRows : me.onUIReady,
                thisObj    : me,
                once       : true
            });
        }

        // Add a unique cls used by subclasses to get custom styling of the elements rendered
        // This makes sure that each class only removed its own elements from the DOM
        me.cls = me.cls || `b-timerange-${me.constructor.$$name}`;

        me.baseSelector = `.${me.baseCls}.${me.cls}`;

        // header elements are required for interaction
        if (me.enableResizing) {
            me.showHeaderElements = true;
        }
    }

    doDestroy() {
        const me = this;

        me.storeDetacher?.();
        me.detachListeners('timeAxisViewModel');
        me.detachListeners('timeAxis');

        me.clockTemplate?.destroy();
        me.tip?.destroy();

        me.drag?.destroy();
        me.resize?.destroy();

        super.doDestroy();
    }

    doDisable(disable) {
        if (this.client.isPainted) {
            this.renderRanges();
        }

        super.doDisable(disable);
    }

    //endregion

    //region Draw

    onPaint({ firstPaint }) {
        if (firstPaint && this.client.isHorizontal) {
            this.onUIReady();
        }
    }

    onUIReady() {
        const
            me         = this,
            { client } = me;

        // If timeAxisViewModel is swapped, re-setup listeners to new instance
        me.client.on({
            timeAxisViewModelChange : me.setupTimeAxisViewModelListeners,
            thisObj                 : me
        });

        me.setupTimeAxisViewModelListeners();

        if (me.enableResizing && !client.hideHeaders) {
            me.drag = new DragHelper({
                name               : 'rangeDrag',
                mode               : client.isVertical ? 'translateY' : 'translateX',
                constrain          : true,
                outerElement       : me.headerContainerElement,
                targetSelector     : `${me.baseSelector}`,
                isElementDraggable : (el, event) => !client.readOnly && me.isElementDraggable(el, event),
                transitionDuration : client.transitionDuration,

                listeners : {
                    dragstart : 'onDragStart',
                    drag      : 'onDrag',
                    drop      : 'onDrop',
                    abort     : 'onInvalidDrop',
                    thisObj   : me
                }
            });

            me.resize = new ResizeHelper({
                direction          : client.mode,
                targetSelector     : `${me.baseSelector}.b-sch-range`,
                outerElement       : me.headerContainerElement,
                isElementResizable : el => !el.closest('.b-dragging'),
                listeners          : {
                    resizestart : 'onResizeStart',
                    resizing    : 'onResizeDrag',
                    resize      : 'onResize',
                    cancel      : 'onInvalidResize',
                    thisObj     : me
                }
            });
        }

        me.renderRanges();

        if (me.tooltipTemplate) {
            me.hoverTooltip = new Tooltip({
                forElement : me.headerContainerElement,
                getHtml({ activeTarget }) {
                    const timeRange = me.getRecordByElement(activeTarget);

                    return me.tooltipTemplate({ timeRange });
                },
                forSelector : '.' + me.baseCls + (me.cls ? '.' + me.cls : '')
            });
        }
    }

    setupTimeAxisViewModelListeners() {
        const me = this;

        me.detachListeners('timeAxisViewModel');
        me.detachListeners('timeAxis');

        me.client.timeAxisViewModel.on({
            name    : 'timeAxisViewModel',
            update  : 'onTimeAxisViewModelUpdate',
            thisObj : me
        });

        me.client.timeAxis.on({
            name          : 'timeAxis',
            includeChange : 'renderRanges',
            thisObj       : me
        });
    }

    onTimeAxisViewModelUpdate() {
        this.renderRanges();
    }

    renderRanges() {
        const
            me      = this,
            element = me.client.foregroundCanvas;

        // Scheduler/Gantt might not yet be rendered
        if (element) {
            const { headerContainerElement } = me;

            // remove existing timeRanges
            DomHelper.removeEachSelector(element, me.baseSelector);

            // Partnered Scheduler might not have header container element
            if (headerContainerElement) {
                DomHelper.removeEachSelector(headerContainerElement, me.baseSelector);
            }

            if (!me.disabled) {
                // add timeRanges
                for (const range of me.timeRanges) {
                    me.renderRange(range, true);
                }
            }
        }
    }

    /**
     * Returns the TimeRanges in the store.
     * @property {Scheduler.model.TimeSpan[]}
     */
    get timeRanges() {
        return this.store.records;
    }

    /**
     * Based on this method result the feature decides whether the provided range should
     * be rendered or not.
     * The method checks that the range has non-zero {@link Scheduler.model.TimeSpan#field-duration}
     * and lays in the visible timespan.
     *
     * Override the method to implement your custom range rendering vetoing logic.
     * @param {Scheduler.model.TimeSpan} range Range to render.
     * @returns {Boolean} `true` if the range should be rendered and `false` otherwise.
     */
    shouldRenderRange(range) {
        const { timeAxis } = this.client;

        return range.duration && timeAxis.timeSpanInAxis(range.startDate, range.endDate) ||
            (range.startDate && timeAxis.dateInAxis(range.startDate));
    }

    renderRange(timeRange, injectIntoDom) {
        const
            me     = this,
            client = me.client;

        if (me.shouldRenderRange(timeRange)) {
            const
                startPos    = client.getCoordinateFromDate(DateHelper.max(timeRange.startDate, client.timeAxis.startDate), {
                    respectExclusion : true
                }),
                endPos      = timeRange.duration && client.getCoordinateFromDate(DateHelper.min(timeRange.endDate, client.timeAxis.endDate), {
                    respectExclusion : true,
                    isEnd            : true
                }),
                size        = endPos - startPos,
                labelTpl    = (timeRange.name || timeRange.iconCls) ? `<label>${timeRange.iconCls ? `<i class="${timeRange.iconCls}"></i>` : ''} ${timeRange.name || '&nbsp;'}</label>` : '',
                config      = {
                    className : {
                        [me.baseCls]     : 1,
                        [me.cls]         : me.cls,
                        [me.rangeCls]    : endPos,
                        [me.lineCls]     : !endPos,
                        [timeRange.cls]  : timeRange.cls,
                        'b-narrow-range' : endPos && size < me.narrowThreshold
                    }, //`${me.baseCls} ${me.cls} ${endPos ? me.rangeCls : me.lineCls} ${range.cls || ''}`,
                    dataset : {
                        id : timeRange.id
                    },
                    style : client.isVertical
                        ? `transform: translateY(${startPos}px); ${endPos ? `height:${size}px` : ''};`
                        : `transform: translateX(${startPos}px); ${endPos ? `width:${size}px` : ''};`,
                    retainElement : true // To prevent DomHelper.sync from reusing the element
                },
                bodyElement = DomHelper.createElement(Object.assign({}, config, {
                    parent : injectIntoDom && client.foregroundCanvas,
                    style  : config.style + (timeRange.style || ''),
                    html   : me.showHeaderElements && !me.showLabelInBody ? '' : labelTpl
                }));

            let headerElement;

            if (me.showHeaderElements) {
                headerElement = DomHelper.createElement(Object.assign({
                    parent : injectIntoDom && me.headerContainerElement,
                    html   : !me.showLabelInBody ? labelTpl : ''
                }, config));
            }

            const result = { bodyElement, headerElement };

            if (injectIntoDom) {
                // Make the label run vertically if it overflows the width
                me.rotateLabel(timeRange, result);
            }

            return result;
        }
    }

    rotateLabel(range, { bodyElement }) {
        // Lines have no label. Do not check label content to do not force DOM layout!
        if (!range.iconCls && !range.name) {
            return;
        }

        const label = bodyElement.firstChild;

        // Check if label is rendered
        if (!label) {
            return;
        }

        // Remove any rotation so with can be measured.
        label.classList.remove('b-vertical');

        const rotate = this.client.isVertical
            ? label.offsetHeight < bodyElement.offsetHeight
            : label.offsetWidth > bodyElement.offsetWidth;

        // If it overflows, rotate it.
        label.classList[rotate ? 'add' : 'remove']('b-vertical');
    }

    // returns one body el (+ optionally one header el) that represents a time range, or null if timeRanges is not currently rendered
    getElementsByRecord(idOrRecord) {
        const
            me            = this,
            id            = typeof idOrRecord !== 'object' ? idOrRecord : idOrRecord.id,
            bodyElement   = me.client.foregroundCanvas?.querySelector(`${me.baseSelector}[data-id="${id}"]`),
            headerElement = me.headerContainerElement?.querySelector(`${me.baseSelector}[data-id="${id}"]`);

        return bodyElement ? { bodyElement, headerElement } : null;
    }

    getBodyElementByRecord(idOrRecord) {
        const id = typeof idOrRecord === 'string' ? idOrRecord : idOrRecord.id;

        return this.client.foregroundCanvas.querySelector(`${this.baseSelector}[data-id="${id}"]`);
    }

    getRecordByElement(el) {
        return this.store.getById(el.dataset.id);
    }

    get headerContainerElement() {
        const { isVertical, timeView, timeAxisColumn } = this.client;
        let element = null;

        // Render into the subGrid´s header element or the vertical timeaxis depending on mode
        if (isVertical && timeView.element) {
            element = timeView.element.parentElement;
        }
        else if (!isVertical) {
            element = timeAxisColumn.element;
        }

        return element;
    }

    //endregion

    //region Settings

    /**
     * Get/set if header elements should be rendered
     * @property {Boolean}
     */
    get showHeaderElements() {
        return !this.client.hideHeaders && this._showHeaderElements;
    }

    set showHeaderElements(show) {
        this._showHeaderElements = show;

        if (!this.client.isPainted) return;

        if (show) {
            this.client.element.classList.add('b-sch-timeranges-with-headerelements');
        }
        else {
            this.client.element.classList.remove('b-sch-timeranges-with-headerelements');
        }
        this.renderRanges();
    }

    //endregion

    //region Menu items

    // TODO: 'headerContextMenu' is deprecated. Please see https://bryntum.com/docs/scheduler/#Scheduler/guides/upgrades/4.0.0.md for more information.
    /**
     * Adds menu items for the context menu.
     * @param {Object} options Contains menu items and extra data retrieved from the menu target.
     * @param {Grid.column.Column} options.column Column for which the menu will be shown
     * @param {Object} options.items A named object to describe menu items
     * @internal
     * @deprecated 4.0.0 Use `populateTimeAxisHeaderMenu` instead.
     */
    populateHeaderMenu({ column, items }) {
        if (column.type !== 'timeAxis') {
            return;
        }

        this.populateTimeAxisHeaderMenu(...arguments);
    }

    /**
     * Adds menu items for the context menu, and may mutate the menu configuration.
     * @param {Object} options Contains menu items and extra data retrieved from the menu target.
     * @param {Grid.column.Column} options.column Column for which the menu will be shown
     * @param {Object} options.items A named object to describe menu items
     * @internal
     */
    populateTimeAxisHeaderMenu({ column, items }) {}

    //endregion

    //region Store

    /**
     * Returns the {@link Core.data.Store store} used by this feature
     * @property {Core.data.Store}
     */
    get store() {
        return this._store;
    }

    set store(store) {
        const
            me = this;

        me._store = Store.getStore(store, Store);

        let renderRanges = false;

        // if we had some store assigned before we need to detach it
        if (me.storeDetacher) {
            me.storeDetacher();
            // then we'll need to render ranges provided by the new store
            renderRanges = true;
        }

        me.storeDetacher = me._store.on({
            change  : me.onStoreChanged,
            refresh : me.onStoreChanged,
            thisObj : me
        });

        // render ranges if needed
        renderRanges && this.renderRanges();
    }

    //endregion

    //region Events

    onStoreChanged(event) {
        const me = this;

        // https://github.com/bryntum/support/issues/1398 - checking also if scheduler is visible to change elements
        if (me.disabled || !me.client.isVisible || me.isConfiguring || (event.type === 'refresh' && event.action !== 'batch')) {
            return;
        }

        // Only animate changes that happen as a result of a pure data change, i.e. not after a drag drop
        if (event.action === 'update') {
            const
                range            = event.record,
                id               = event.changes.hasOwnProperty('id') ? event.changes.id.oldValue : range.id,
                existingElements = me.getElementsByRecord(id),
                redrawnElements  = me.renderRange(range, !existingElements);

            if (existingElements && !redrawnElements) {
                existingElements.bodyElement.remove();
                existingElements.headerElement && existingElements.headerElement.remove();
            }

            if (!existingElements || !redrawnElements) return;

            me.client.runWithTransition(() => {
                DomHelper.sync(redrawnElements.bodyElement, existingElements.bodyElement);

                if (me.showHeaderElements) {
                    DomHelper.sync(redrawnElements.headerElement, existingElements.headerElement);
                }

                // Make the label run vertically if it overflows the width
                me.rotateLabel(range, existingElements);
            });
        }
        else {
            me.renderRanges();
        }
    }

    //endregion

    //region Drag drop

    showTip(context) {
        const me = this;

        if (me.showTooltip) {
            me.clockTemplate = new ClockTemplate({
                scheduler : me.client
            });

            me.tip = new Tooltip(ObjectHelper.assign({
                id                       : `${me.client.id}-time-range-tip`,
                cls                      : 'b-interaction-tooltip',
                align                    : 'b-t',
                autoShow                 : true,
                updateContentOnMouseMove : true,
                forElement               : context.element,
                getHtml                  : () => me.getTipHtml(context.record, context.element)
            }, me.showTooltip));
        }
    }

    isElementDraggable(el) {
        el = el.closest(this.baseSelector + ':not(.b-resizing)');

        return el && !el.classList.contains('b-over-resize-handle');
    }

    onDragStart({ context }) {
        const
            me                = this,
            record            = me.getRecordByElement(context.element.closest(me.baseSelector)),
            rangeBodyEl       = me.getBodyElementByRecord(record),
            timeAxisViewModel = me.client.timeAxisViewModel,
            drag              = me.drag;

        Object.assign(context, {
            record,
            rangeBodyEl,
            originRangeX : DomHelper.getTranslateX(rangeBodyEl),
            originRangeY : DomHelper.getTranslateY(rangeBodyEl)
        });

        if (me.client.isVertical) {
            drag.minY = 0;
            // Moving the range, you can drag the start marker down until the end of the range hits the time axis end
            drag.maxY = timeAxisViewModel.totalSize - context.rangeBodyEl.offsetHeight;
            // Setting min/max for X makes drag right of the header valid, but visually still constrained vertically
            drag.minX = 0;
            drag.maxX = Number.MAX_SAFE_INTEGER;
        }
        else {
            drag.minX = 0;
            // Moving the range, you can drag the start marker right until the end of the range hits the time axis end
            drag.maxX = timeAxisViewModel.totalSize - context.rangeBodyEl.offsetWidth;
            // Setting min/max for Y makes drag below header valid, but visually still constrained horizontally
            drag.minY = 0;
            drag.maxY = Number.MAX_SAFE_INTEGER;
        }

        me.client.element.classList.add('b-dragging-timerange');

        me.showTip(context);
    }

    onDrag({ context }) {
        // sync body element with header element (x + width)
        if (this.client.isVertical) {
            DomHelper.setTranslateY(context.rangeBodyEl, DomHelper.getTranslateY(context.element));
        }
        else {
            DomHelper.setTranslateX(context.rangeBodyEl, DomHelper.getTranslateX(context.element));
        }
    }

    onDrop({ context }) {
        if (!context.valid) {
            return this.onInvalidDrop({ context });
        }

        const
            me          = this,
            record      = context.record,
            box         = context.rangeBodyEl.getBoundingClientRect(),
            newStart    = me.client.getDateFromCoordinate(me.client.isVertical ? box.top : box.left, 'round', false),
            wasModified = (record.startDate - newStart !== 0);

        if (wasModified) {
            record.setStartDate(newStart);
        }
        else {
            me.onInvalidDrop();
        }

        if (me.tip) {
            me.tip.destroy();
            me.tip = null;
        }

        me.client.element.classList.remove('b-dragging-timerange');
    }

    onInvalidDrop() {
        const me = this;

        me.drag.reset();
        me.renderRanges();
        me.client.element.classList.remove('b-dragging-timerange');

        if (me.tip) {
            me.tip.destroy();
            me.tip = null;
        }
    }

    // endregion

    // region Resize

    onResizeStart({ context }) {
        const
            me          = this,
            record      = me.getRecordByElement(context.element.closest(me.baseSelector)),
            rangeBodyEl = me.getBodyElementByRecord(record);

        Object.assign(context, {
            record,
            rangeBodyEl
        });

        me.showTip(context);
    }

    onResizeDrag({ context }) {
        const me = this;

        if (me.client.isVertical) {
            if (context.edge === 'top') {
                DomHelper.setTranslateY(context.rangeBodyEl, context.newY);
            }

            context.rangeBodyEl.style.height = context.newHeight + 'px';
        }
        else {
            if (context.edge === 'left') {
                DomHelper.setTranslateX(context.rangeBodyEl, context.newX);
            }

            context.rangeBodyEl.style.width = context.newWidth + 'px';
        }
    }

    onResize({ context }) {
        if (!context.valid) return this.onInvalidDrop({ context });

        const
            me          = this,
            { client }  = me,
            record      = context.record,
            box         = context.element.getBoundingClientRect(),
            startPos    = client.isVertical ? box.top : box.left,
            endPos      = client.isVertical ? box.bottom : box.right,
            newStart    = client.getDateFromCoordinate(startPos, 'round', false),
            isStart     = context.edge === 'left' || context.edge === 'top',
            newEnd      = client.getDateFromCoordinate(endPos, 'round', false),
            wasModified = (isStart && record.startDate - newStart !== 0) ||
                  (newEnd && record.endDate - newEnd !== 0);

        if (wasModified && newEnd > newStart) {
            if (isStart) {
                // could be that the drag operation placed the range with start/end outside the axis
                record.setStartDate(newStart, false);
            }
            else {
                record.setEndDate(newEnd, false);
            }
        }
        else {
            me.onInvalidResize();
        }

        if (me.tip) {
            me.tip.destroy();
            me.tip = null;
        }
    }

    onInvalidResize() {
        const me = this;

        me.resize.reset();
        me.renderRanges();

        if (me.tip) {
            me.tip.destroy();
            me.tip = null;
        }
    }

    //endregion

    //region Tooltip

    /**
     * Generates the html to display in the tooltip during drag drop.
     */
    getTipHtml(record, element) {
        const
            me         = this,
            { client } = me,
            box        = element.getBoundingClientRect(),
            startPos   = client.isVertical ? box.top : box.left,
            endPos     = client.isVertical ? box.bottom : box.right,
            startDate  = client.getDateFromCoordinate(startPos, 'round', false),
            endDate    = record.endDate && client.getDateFromCoordinate(endPos, 'round', false),
            startText  = client.getFormattedDate(startDate),
            endText    = endDate && client.getFormattedEndDate(endDate, startDate);

        return me.dragTipTemplate({
            name           : record.name || '',
            startDate      : startDate,
            endDate        : endDate,
            startText      : startText,
            endText        : endText,
            startClockHtml : me.clockTemplate.template({
                date : startDate,
                text : startText,
                cls  : 'b-sch-tooltip-startdate'
            }),
            endClockHtml : endText && me.clockTemplate.template({
                date : endDate,
                text : endText,
                cls  : 'b-sch-tooltip-enddate'
            })
        });
    }

    //endregion
}
