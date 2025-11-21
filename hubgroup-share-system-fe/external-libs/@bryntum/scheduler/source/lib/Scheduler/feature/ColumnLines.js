import DomHelper from '../../Core/helper/DomHelper.js';
import DomSync from '../../Core/helper/DomSync.js';
import InstancePlugin from '../../Core/mixin/InstancePlugin.js';
import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';
import Delayable from '../../Core/mixin/Delayable.js';

/**
 * @module Scheduler/feature/ColumnLines
 */
const emptyObject = Object.freeze({});

/**
 * Displays column lines for ticks, with a different styling for major ticks (by default they are darker). If this
 * feature is disabled, no lines are shown. If it's enabled, line are shown for the tick level which is set in current
 * ViewPreset. Please see {@link Scheduler.preset.ViewPreset#field-columnLinesFor} config for details.
 *
 * The lines are drawn as divs, with only visible lines available in DOM. The color and style of the lines are
 * determined the css rules for `.b-column-line` and `.b-column-line-major`.
 *
 * For vertical mode, this features also draws vertical resource column lines if scheduler is configured with
 * `columnLines : true` (which is the default, see {@link Grid.view.GridBase#config-columnLines}).
 *
 * This feature is **enabled** by default
 *
 * @extends Core/mixin/InstancePlugin
 * @mixes Core/mixin/Delayable
 * @demo Scheduler/basic
 * @inlineexample Scheduler/feature/ColumnLines.js
 * @classtype columnLines
 * @feature
 */
export default class ColumnLines extends Delayable(InstancePlugin) {
    //region Config

    static get $name() {
        return 'ColumnLines';
    }

    static get delayable() {
        return {
            refresh : {
                type              : 'raf',
                cancelOutstanding : true
            }
        };
    }

    // Plugin configuration. This plugin chains some of the functions in Grid.
    static get pluginConfig() {
        return {
            after : ['render', 'updateCanvasSize', 'onVisibleDateRangeChange', 'onVisibleResourceRangeChange']
        };
    }

    //endregion

    //region Init & destroy

    construct(client, config) {
        client.useBackgroundCanvas = true;

        super.construct(client, config);
    }

    doDisable(disable) {
        super.doDisable(disable);

        if (!this.isConfiguring) {
            this.refresh();
        }
    }

    //endregion

    //region Draw

    /**
     * Draw lines when scheduler/gantt is rendered.
     * @private
     */
    render() {
        this.refresh();
    }

    /**
     * Draw column lines that are in view
     * @private
     */
    refresh() {
        const
            me                                            = this,
            { client }                                    = me,
            { timeAxis, timeAxisViewModel, isHorizontal } = client,
            { columnConfig }                              = timeAxisViewModel,
            { startDate, endDate }                        = client.visibleDateRange || emptyObject,
            axisStart                                     = timeAxis.startDate;

        // Early bailout for timeaxis without start date
        if (!axisStart || !startDate) {
            return;
        }

        const
            linesForLevel      = timeAxisViewModel.columnLinesFor,
            majorLinesForLevel = Math.max(linesForLevel - 1, 0),
            start              = startDate.getTime(),
            end                = endDate.getTime(),
            domConfigs         = [],
            dates              = new Set(),
            dimension          = isHorizontal ? 'X' : 'Y';

        if (!me.element) {
            me.element = DomHelper.createElement({
                parent    : client.backgroundCanvas,
                className : 'b-column-lines-canvas'
            });
        }

        if (!me.disabled) {
            const addLineConfig = (tick, isMajor) => {
                const tickStart = tick.start.getTime();
                // Only start of tick matters.
                // Each tick has an exact calculated start position along the time axis
                // and carries a border on its left, so column lines follow from
                // tick 1 (zero-based) onwards.
                if (tickStart > start && tickStart < end && !dates.has(tickStart)) {
                    dates.add(tickStart);
                    domConfigs.push({
                        className : isMajor ? 'b-column-line-major' : 'b-column-line',
                        style     : {
                            transform : `translate${dimension}(${tick.coord}px)`
                        },
                        dataset : {
                            line : isMajor ? `major-${tick.index}` : `line-${tick.index}`
                        }
                    });
                }
            };

            // Collect configs for major lines
            if (linesForLevel !== majorLinesForLevel) {
                for (let i = 1; i <= columnConfig[majorLinesForLevel].length - 1; i++) {
                    addLineConfig(columnConfig[majorLinesForLevel][i], true);
                }
            }

            // And normal lines, skipping dates already occupied by major lines
            for (let i = 1; i <= columnConfig[linesForLevel].length - 1; i++) {
                addLineConfig(columnConfig[linesForLevel][i], false);
            }

            // Add vertical resource column lines, if grid is configured to show column lines
            if (!isHorizontal && client.columnLines) {
                const { columnWidth, firstResource, lastResource } = client.resourceColumns;

                for (let i = firstResource; i < lastResource + 1; i++) {
                    domConfigs.push({
                        className : 'b-column-line b-resource-column-line',
                        style     : {
                            transform : `translateX(${(i + 1) * columnWidth - 1}px)`
                        },
                        dataset : {
                            line : `resource-${i}`
                        }
                    });
                }
            }
        }

        DomSync.sync({
            targetElement : me.element,
            onlyChildren  : true,
            domConfig     : {
                children    : domConfigs,
                syncOptions : {
                    // When zooming in and out we risk getting a lot of released lines if we do not limit it
                    releaseThreshold : 4
                }
            },
            syncIdField : 'line'
        });
    }

    //endregion

    //region Events

    // Called when visible date range changes, for example from zooming, scrolling, resizing
    onVisibleDateRangeChange() {
        this.refresh();
    }

    // Called when visible resource range changes, for example on scroll and resize
    onVisibleResourceRangeChange({ firstResource, lastResource }) {
        this.refresh();
    }

    updateCanvasSize() {
        this.refresh();
    }

    //endregion
}

GridFeatureManager.registerFeature(ColumnLines, true, ['Scheduler', 'Gantt']);
