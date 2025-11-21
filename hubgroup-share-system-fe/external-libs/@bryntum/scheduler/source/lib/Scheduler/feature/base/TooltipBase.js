import InstancePlugin from '../../../Core/mixin/InstancePlugin.js';
import Tooltip from '../../../Core/widget/Tooltip.js';
import ClockTemplate from '../../tooltip/ClockTemplate.js';

/**
 * @module Scheduler/feature/base/TooltipBase
 */

/**
 * Base class for `EventTooltip` (Scheduler) and `TaskTooltip` (Gantt) features. Contains shared code. Not to be used directly.
 *
 * @extends Core/mixin/InstancePlugin
 * @extendsconfigs Core/widget/Tooltip
 */
export default class TooltipBase extends InstancePlugin {
    //region Config

    static get defaultConfig() {
        return {

            /**
             * Specify true to have tooltip updated when mouse moves, if you for example want to display date at mouse
             * position.
             * @config {Boolean}
             * @default
             * @category Misc
             */
            autoUpdate : false,

            /**
             * The amount of time to hover before showing
             * @config {Number}
             * @default
             */
            hoverDelay : 250,

            /**
             * The time (in milliseconds) for which the Tooltip remains visible when the mouse leaves the target.
             *
             * May be configured as `false` to persist visible after the mouse exits the target element. Configure it
             * as 0 to always retrigger `hoverDelay` even when moving mouse inside `fromElement`
             * @config {Number}
             * @default
             */
            hideDelay : 100,

            // TODO: Rename to tooltipTemplate, deprecate template
            template : null,

            cls : null,

            align : {
                align : 'b-t'
            },

            clockTemplate : null,

            // Set to true to update tooltip contents if record changes while tip is open
            monitorRecordUpdate : null,

            testConfig : {
                hoverDelay : 0
            }
        };
    }

    // Plugin configuration. This plugin chains some of the functions in Grid.
    static get pluginConfig() {
        return {
            chain : ['onPaint']
        };
    }

    //endregion

    //region Events

    /**
     * Triggered before a tooltip is shown. Return `false` to prevent the action.
     * @preventable
     * @event beforeShow
     * @param {Core.widget.Tooltip} source The tooltip being shown.
     * @param {Scheduler.model.EventModel} source.eventRecord The event record.
     */

    /**
     * Triggered after a tooltip is shown.
     * @event show
     * @param {Core.widget.Tooltip} source The tooltip.
     * @param {Scheduler.model.EventModel} source.eventRecord The event record.
     */

    //endregion

    //region Init

    construct(client, config) {
        const me = this;

        // process initial config into an actual config object
        config = me.processConfig(config);

        super.construct(client, config);

        // Default triggering selector is the client's inner element selector
        if (!me.forSelector) {
            me.forSelector = `${client.eventInnerSelector}:not(.b-dragproxy)`;
        }

        me.clockTemplate = new ClockTemplate({
            scheduler : client
        });

        client.on({
            [`before${client.scheduledEventName}drag`] : () => me.tooltip?.hide()
        });
    }

    // TooltipBase feature handles special config cases, where user can supply a function to use as template
    // instead of a normal config object
    processConfig(config) {
        if (typeof config === 'function') {
            return {
                template : config
            };
        }

        return config;
    }

    // override setConfig to process config before applying it (used mainly from ReactScheduler)
    setConfig(config) {
        super.setConfig(this.processConfig(config));
    }

    doDestroy() {
        this.clockTemplate?.destroy();
        this.tooltip?.destroy();

        super.doDestroy();
    }

    doDisable(disable) {
        if (this.tooltip) {
            this.tooltip.disabled = disable;
        }

        super.doDisable(disable);
    }

    //endregion

    onPaint({ firstPaint }) {
        if (firstPaint) {
            const
                me             = this,
                { client }     = me,
                ignoreSelector = [
                    '.b-dragselecting',
                    '.b-eventeditor-editing',
                    '.b-taskeditor-editing',
                    '.b-resizing-event',
                    '.b-dragcreating',
                    `.b-dragging-${client.scheduledEventName}`,
                    '.b-creating-dependency',
                    '.b-dragproxy'
                ].map(cls => `:not(${cls})`).join('');

            me.tooltip?.destroy();

            /**
             * A reference to the tooltip instance, which will have a special `eventRecord` property that
             * you can use to get data from the contextual event record to which this tooltip is related.
             * @member {Core.widget.Tooltip} tooltip
             * @readonly
             * @category Misc
             */
            me.tooltip = new Tooltip({
                axisLock       : 'flexible',
                id             : me.tipId || `${me.client.id}-event-tip`,
                cls            : me.tipCls,
                forSelector    : `.b-timelinebase${ignoreSelector} .b-grid-body-container:not(.b-scrolling) ${me.forSelector}`,
                scrollAction   : 'realign',
                clippedBy      : [client.timeAxisSubGridElement, client.bodyContainer],
                forElement     : client.timeAxisSubGridElement,
                showOnHover    : true,
                anchorToTarget : true,
                allowOver      : Boolean(me.config.items || me.config.tools),
                getHtml        : me.getTipHtml.bind(me),
                disabled       : me.disabled,
                // on Core/mixin/Events constructor, me.config.listeners is deleted and attributed its value to me.configuredListeners
                // to then on processConfiguredListeners it set me.listeners to our TooltipBase
                // but since we need our initial config.listeners to set to our internal tooltip, we leave processConfiguredListeners empty
                // to avoid lost our listeners to apply for our internal tooltip here and force our feature has all Tooltip events firing
                ...me.config,
                listeners      : me.configuredListeners
            });

            me.tooltip.on({
                innerhtmlupdate : 'updateDateIndicator',
                overtarget      : 'onOverNewTarget',
                show            : 'onTipShow',
                hide            : 'onTipHide',
                thisObj         : me
            });
        }
    }

    //region Listeners

    // leave configuredListeners alone until render time at which they are used on the tooltip
    processConfiguredListeners() {}

    addListener(...args) {
        // Add listener to the `tooltip` instance
        this.tooltip?.addListener(...args);
    }

    removeListener(...args) {
        // Remove listener from the `tooltip` instance
        this.tooltip?.removeListener(...args);
    }

    //endregion

    updateDateIndicator() {
        const
            me             = this,
            tip            = me.tooltip,
            endDateElement = tip.element.querySelector('.b-sch-tooltip-enddate');

        if (!me.record) {
            return;
        }

        me.clockTemplate.updateDateIndicator(tip.element, me.record.startDate);

        endDateElement && me.clockTemplate.updateDateIndicator(endDateElement, me.record.endDate);
    }

    resolveTimeSpanRecord(forElement) {
        return this.client.resolveTimeSpanRecord(forElement);
    }

    getTipHtml({ tip, activeTarget }) {
        const
            me             = this,
            { client }     = me,
            recordProp     = me.recordType || `${client.scheduledEventName}Record`,
            timeSpanRecord = me.resolveTimeSpanRecord(activeTarget);

        // If user has mouseovered a fading away element of a deleted event,
        // an event record will not be found. In this case the tip must hide.
        // Instance of check is to not display while propagating
        if (timeSpanRecord?.startDate instanceof Date) {
            const
                { startDate, endDate } = timeSpanRecord,
                startText              = client.getFormattedDate(startDate),
                endDateValue           = client.getDisplayEndDate(endDate, startDate),
                endText                = client.getFormattedDate(endDateValue);

            tip.eventRecord = timeSpanRecord;

            return me.template({
                tip,
                // eventRecord for Scheduler, taskRecord for Gantt
                [`${recordProp}`] : timeSpanRecord,
                startDate,
                endDate,
                startText,
                endText,
                startClockHtml    : me.clockTemplate.template({
                    date : startDate,
                    text : startText,
                    cls  : 'b-sch-tooltip-startdate'
                }),
                endClockHtml : timeSpanRecord.isMilestone ? '' : me.clockTemplate.template({
                    date : endDateValue,
                    text : endText,
                    cls  : 'b-sch-tooltip-enddate'
                })
            });
        }
        else {
            tip.hide();
            return '';
        }
    }

    get record() {
        return this.tooltip.eventRecord;
    }

    onTipShow() {
        const me = this;

        if (me.monitorRecordUpdate && !me.updateListener) {
            me.updateListener = me.client.eventStore.on({
                update  : me.onRecordUpdate,
                thisObj : me
            });
        }
    }

    onTipHide() {
        // To not retain full project when changing project
        this.tooltip.eventRecord = null;

        this.updateListener?.();
        this.updateListener = null;
    }

    onOverNewTarget({ newTarget }) {
        this.tooltip.eventRecord = this.resolveTimeSpanRecord(newTarget);
    }

    onRecordUpdate({ record }) {
        // make sure the record we are showing the tip for is still relevant
        if (record === this.record) {
            // Stop aligning at this point
            this.tooltip.alignTo();
            this.tooltip.updateContent();
        }
    }
}
