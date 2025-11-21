import TimeAxisBase from './TimeAxisBase.js';

/**
 * @module Scheduler/view/VerticalTimeAxis
 */

/**
 * Widget that renders a vertical time axis. Only renders ticks in view. Used in vertical mode.
 * @extends Core/widget/Widget
 * @private
 */
export default class VerticalTimeAxis extends TimeAxisBase {

    static get $name() {
        return 'VerticalTimeAxis';
    }

    static get configurable() {
        return {
            cls : 'b-verticaltimeaxis',

            sizeProperty : 'height',

            positionProperty : 'top',

            wrapText : true
        };
    }

    // All cells overlayed in the same space.
    // For future use.
    buildHorizontalCells() {
        const
            me                   = this,
            { client }           = me,
            stickyHeaders        = client?.stickyHeaders,
            featureHeaderConfigs = [],
            cellConfigs          = me.levels.reduce((result, level, i) => {
                if (level.cells) {
                    result.push(...level.cells?.filter(cell => cell.start < me.endDate && cell.end > me.startDate).map((cell, j, cells) => ({
                        className : {
                            'b-sch-header-timeaxis-cell' : 1,
                            [cell.headerCellCls]         : cell.headerCellCls,
                            [`b-align-${cell.align}`]    : cell.align,
                            'b-last'                     : j === cells.length - 1,
                            'b-lowest'                   : i === me.levels.length - 1
                        },
                        dataset : {
                            tickIndex      : cell.index,
                            cellId         : `${i}-${cell.index}`,
                            headerPosition : i,
                            // Used in export tests to resolve dates from tick elements
                            ...window.DEBUG && { date : cell.start.getTime() }
                        },
                        style : {
                            // DomHelper appends px to numeric dimensions
                            top       : cell.coord,
                            height    : cell.width,
                            minHeight : cell.width
                        },
                        children : [
                            {
                                className : {
                                    'b-sch-header-text' : 1,
                                    'b-sticky-header'   : stickyHeaders
                                },
                                html : cell.value
                            }
                        ]
                    })));
                }
                return result;
            }, []);

        // When tested in isolation there is no client
        client?.getHeaderDomConfigs(featureHeaderConfigs);

        cellConfigs.push(...featureHeaderConfigs);

        // noinspection JSSuspiciousNameCombination
        return {
            className : me.widgetClassList,
            dataset   : {
                headerFeature  : `headerRow0`,
                headerPosition : 0
            },
            syncOptions : {
                // Keep a maximum of 5 released cells. Might be fine with fewer since ticks are fixed width.
                // Prevents an unnecessary amount of cells from sticking around when switching from narrow to
                // wide tickSizes
                releaseThreshold : 5,
                syncIdField      : 'cellId'
            },
            children : cellConfigs
        };
    }

    get height() {
        return this.size;
    }
}
