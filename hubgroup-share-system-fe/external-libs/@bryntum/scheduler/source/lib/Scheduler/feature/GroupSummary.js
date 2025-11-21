import GridGroupSummary from '../../Grid/feature/GroupSummary.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';
import Tooltip from '../../Core/widget/Tooltip.js';
import SchedulerBase from '../../Scheduler/view/SchedulerBase.js';

// Actions that trigger rerendering of group summary rows
const refreshActions = {
    add       : 1,
    remove    : 1,
    update    : 1,
    removeAll : 1,
    filter    : 1
};

/**
 * @module Scheduler/feature/GroupSummary
 */

// noinspection JSClosureCompilerSyntax
/**
 * A special version of the Grid GroupSummary feature that enables summaries within scheduler. To use a single summary
 * it is easiest to configure {@link #config-renderer}, for multiple summaries see {@link #config-summaries}.
 *
 * This feature is <strong>disabled</strong> by default. It is **not** supported in vertical mode.
 *
 * @extends Grid/feature/GroupSummary test
 *
 * @classtype groupSummary
 * @feature
 * @inlineexample Scheduler/feature/GroupSummary.js
 * @demo Scheduler/groupsummary
 * @typings Grid/feature/GroupSummary -> Grid/feature/GridGroupSummary
 */
export default class GroupSummary extends GridGroupSummary {
    //region Config

    static get $name() {
        return 'GroupSummary';
    }

    static get defaultConfig() {
        return {
            /**
             * Show tooltip containing summary values and labels
             * @config {Boolean}
             * @default
             */
            showTooltip : true,

            /**
             * Array of summary configs which consists of a label and a {@link #config-renderer} function
             * ```
             *  summaries : [
             *      {
             *         label : 'Label',
             *         renderer : ({ startDate, endDate, eventStore, resourceStore, events, resources, groupRecord, groupField, groupValue }) => {
             *             // return display value
             *             returns '<div>Renderer output</div>';
             *         }
             *      }
             *  ]
             *  ```
             * @config {Object[]}
             */
            summaries : null,

            /**
             * Renderer function for a single time axis tick in a group summary row.
             * Should calculate a sum and return HTML as a result.
             *
             * ```javascript
             * new Scheduler({
             *     features : {
             *         groupSummary : {
             *             renderer : ({ startDate, endDate, eventStore, resourceStore, events, resources, groupRecord, groupField, groupValue }) => {
             *                 // return display value
             *                 returns '<div>Renderer output</div>';
             *             }
             *         }
             *     }
             * });
             * ```
             *
             * @param {Date} startDate Tick start date
             * @param {Date} endDate Tick end date
             * @param {Scheduler.model.EventModel[]} events Events which belong to the group
             * @param {Scheduler.model.ResourceModel[]} resources Resources which belong to the group
             * @param {Scheduler.data.EventStore} eventStore Event store
             * @param {Scheduler.data.ResourceStore} resourceStore Resource store
             * @param {Core.data.Model} groupRecord Current groups header row record
             * @param {String} groupField Current groups field name
             * @param {String} groupValue Current groups value
             * @returns {String} Html content
             * @config {Function}
             */
            renderer : null
        };
    }

    static get properties() {
        return {
            footersToUpdate : new Set()
        };
    }

    static get pluginConfig() {
        return {
            chain : ['render']
        };
    }

    //endregion

    //region Init

    construct(scheduler, config) {
        const me = this;

        if (scheduler.isVertical) {
            throw new Error('GroupSummary feature is not supported in vertical mode');
        }

        me.scheduler = scheduler;

        super.construct(scheduler, config);

        if (!me.summaries && me.renderer) {
            me.summaries = [{ renderer : me.renderer }];
        }

        me.isScheduler = scheduler instanceof SchedulerBase;

        if (me.isScheduler) {
            scheduler.eventStore.on({
                changePreCommit : me.onEventStoreChange,
                thisObj         : me
            });

            scheduler.on({
                timeAxisViewModelUpdate : me.onTimeAxisChange,
                thisObj                 : me
            });

            scheduler.project.on({
                dataReady : me.onProjectDataReady,
                thisObj   : me
            });
        }

        //<debug>
        if (!me.summaries) {
            throw new Error('Summaries required');
        }
        //</debug>
    }

    doDestroy() {
        this._tip?.destroy();

        super.doDestroy();
    }

    //endregion

    //region Events

    onTimeAxisChange() {
        this.scheduler.rowManager.forEach(row => {
            if (row.isGroupFooter) {
                row.render();
            }
        });
    }

    onEventStoreChange({ action, record, records, changes }) {
        // Scheduler does minimal update on event changes, it will not rerender the summary rows.
        // Need to handle that here
        if (refreshActions[action]) {
            const
                { rowManager } = this.scheduler,
                events         = record ? [record] : records,
                resources      = new Set();

            events.forEach(e => e.resources.forEach(r => resources.add(r)));

            // Include old resource on reassign
            if (changes?.resourceId?.oldValue != null) {
                const oldResource = this.scheduler.resourceStore.getById(changes.resourceId.oldValue);
                oldResource && resources.add(oldResource);
            }

            // Collect footers to update
            for (const resourceRecord of resources) {
                let footer = rowManager.getRowFor(resourceRecord);
                // Resource might not match a row (out of view, filtered out etc)
                // Move down until footer is found or we run out of rows (in case footer is below the buffer)
                while (footer && !footer.isGroupFooter) {
                    footer = rowManager.getRow(footer.index + 1);
                }

                footer && this.footersToUpdate.add(footer);
            }
        }
    }

    onProjectDataReady() {
        const { footersToUpdate } = this;

        // Re-render only affected footers, once
        if (footersToUpdate.size) {
            for (const footer of footersToUpdate) {
                // Things happen async, footer might have been destroyed
                footer.render?.();
            }

            footersToUpdate.clear();
        }
    }

    //endregion

    //region Render

    /**
     * Called before rendering row contents, used to reset rows no longer used as group summary rows
     * @private
     */
    onBeforeRenderRow({ row, record }) {
        if (row.isGroupFooter && !record.meta.hasOwnProperty('groupFooterFor')) {
            const timeaxisCell = row.elements.normal.querySelector('.b-sch-timeaxis-cell');

            // remove summary cells if exist
            if (timeaxisCell) {
                timeaxisCell.innerHTML = '';
            }
        }

        super.onBeforeRenderRow(...arguments);
    }

    /**
     * Called by parent class to fill timeaxis with summary contents. Generates tick "cells" and populates them with
     * summaries.
     * ```
     * <div class="b-timeaxis-group-summary">
     *     <div class="b-timeaxis-tick">
     *         <div class="b-timeaxix-summary-value">x</div>
     *         ...
     *     </div>
     *     ...
     * </div>
     * ```
     * @private
     */
    generateHtml(column, records, cls, groupRecord, groupField, groupValue) {
        // TODO: Use DOM config object instead of strings
        if (column.type === 'timeAxis') {
            const
                me              = this,
                { scheduler }   = me,
                { eventStore }  = scheduler,
                colCfg          = scheduler.timeAxisViewModel.columnConfig;

            let html = '';

            if (scheduler.isEngineReady) {
                // group events by ticks info once here to avoid performace lags
                // should be inside `scheduler.isEngineReady` check to make sure all events were calculated
                // https://github.com/bryntum/support/issues/2977
                const eventsByTick = scheduler.getResourcesEventsPerTick(records, ({ event }) => {
                    return event.resources.some(resource => records.includes(resource)) && (!eventStore.isFiltered || eventStore.records.includes(event));
                });

                scheduler.timeAxis.forEach((tick, idx) => {
                    const
                        groupEvents = eventsByTick[idx] || [],
                        // TODO: could turn this into a template
                        sumHtml = me.summaries.map(config => {
                            // summary renderer used to calculate and format value
                            const value = config.renderer({
                                startDate     : tick.startDate,
                                endDate       : tick.endDate,
                                resourceStore : scheduler.resourceStore,
                                events        : groupEvents,
                                resources     : records,
                                eventStore,
                                groupRecord,
                                groupField,
                                groupValue
                            });

                            return `<div class="b-timeaxis-summary-value">${value}</div>`;
                        }).join('');

                    // get width on column index from the last header config
                    html += `<div class="b-timeaxis-tick" style="width: ${colCfg[colCfg.length - 1][idx].width}px">${sumHtml}</div>`;
                });
            }

            return `<div class="b-timeaxis-group-summary">${html}</div>`;
        }

        return super.generateHtml(column, records, cls, groupRecord, groupField, groupValue);
    }

    /**
     * Overrides parents function to return correct summary count, used when sizing row
     * @private
     */
    updateSummaryHtml(cellElement, column, records) {
        const count = super.updateSummaryHtml(cellElement, column, records);

        if (column.type === 'timeAxis') {
            const result = {
                count  : 0,
                height : 0
            };

            this.summaries.forEach(config => {
                if (config.height) {
                    result.height += config.height;
                }
                else {
                    result.count++;
                }
            });

            return result;
        }

        return count;
    }

    /**
     * Generates tooltip contents for hovered summary tick
     * @private
     */
    getTipHtml({ activeTarget }) {
        const
            me    = this,
            index = Array.from(activeTarget.parentElement.children).indexOf(activeTarget),
            tick  = me.scheduler.timeAxis.getAt(index);

        let tipHtml = `<header>${me.L('L{Summary.Summary for}', me.scheduler.getFormattedDate(tick.startDate))}</header>`,
            showTip = false;

        DomHelper.forEachSelector(activeTarget, '.b-timeaxis-summary-value', (element, i) => {
            const
                label = me._labels[i],
                text  = element.innerText.trim();

            tipHtml += `<label>${label || ''}</label><div class="b-timeaxis-summary-value">${text}</div>`;

            if (element.innerHTML) {
                showTip = true;
            }
        });

        return showTip ? tipHtml : null;
    }

    /**
     * Initialize tooltip on render
     * @private
     */
    render() {
        const
            me            = this,
            { scheduler } = me;

        if (me.isScheduler) {
            // if any sum config has a label, init tooltip
            if (me.summaries?.some(config => config.label) && me.showTooltip && !me._tip) {
                me._labels = me.summaries.map(config => config.label || '');

                me._tip = new Tooltip({
                    id             : `${scheduler.id}-groupsummary-tip`,
                    cls            : 'b-timeaxis-summary-tip',
                    hoverDelay     : 0,
                    hideDelay      : 0,
                    forElement     : scheduler.timeAxisSubGridElement,
                    anchorToTarget : true,
                    forSelector    : '.b-timeaxis-group-summary .b-timeaxis-tick',
                    clippedBy      : [scheduler.timeAxisSubGridElement, scheduler.bodyContainer],
                    getHtml        : me.getTipHtml.bind(me)
                });
            }
        }
    }

    //endregion

    removeSummaryElements(rowEl) {
        const summaryElement = rowEl.querySelector('.b-timeaxis-group-summary');

        summaryElement?.remove();

        super.removeSummaryElements();
    }

    hasSummary(column) {
        return super.hasSummary(column) || column.isTimeAxisColumn;
    }
}

// Override Grids GroupSummary with this improved version
GridFeatureManager.registerFeature(GroupSummary, false, 'Scheduler');
