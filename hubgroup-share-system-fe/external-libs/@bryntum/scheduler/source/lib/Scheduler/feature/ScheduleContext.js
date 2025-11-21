import DomHelper from '../../Core/helper/DomHelper.js';
import InstancePlugin from '../../Core/mixin/InstancePlugin.js';
import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';

/**
 * @module Scheduler/feature/ScheduleContext
 */

/**
 * Allow selecting a schedule "cell" by clicking
 *
 * This feature is **disabled** by default
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     features : {
 *         scheduleContext : true // `false` by default, set to `true` to enable the feature
 *     }
 * });
 * ```
 *
 * @extends Core/mixin/InstancePlugin
 * @inlineexample Scheduler/feature/ScheduleContext.js
 * @classtype scheduleContext
 * @feature
 */
export default class ScheduleContext extends InstancePlugin {
    static get $name() {
        return 'ScheduleContext';
    }

    static get pluginConfig() {
        return {
            after : ['render']
        };
    }

    construct(scheduler, config) {
        // required to work
        scheduler.useBackgroundCanvas = true;

        scheduler.on('scheduleclick', this.onSchedulerClick, this);

        this.scheduler = scheduler;

        super.construct(scheduler, config);
    }

    render() {
        const { scheduler } = this;

        this.element = DomHelper.createElement({
            parent    : scheduler.backgroundCanvas,
            className : 'b-schedule-selected-tick',
            style     : `${scheduler.isVertical ? 'height' : 'width'}:${scheduler.tickSize}px;`
        });
    }

    onSchedulerClick(context) {
        const
            {
                scheduler,
                element
            } = this,
            {
                tickStartDate,
                tickEndDate,
                resourceRecord
            } = context,
            // get the position clicked based on dates
            renderData = scheduler.currentOrientation.getTimeSpanRenderData({
                startDate   : tickStartDate,
                endDate     : tickEndDate,
                startDateMS : tickStartDate.getTime(),
                endDateMS   : tickEndDate.getTime()
            }, resourceRecord);

        let top;

        if (scheduler.isVertical) {
            top = renderData.top;
            // set the width with the cell width
            element.style.width = renderData.width + 'px';
        }
        else {
            const row = scheduler.getRowFor(resourceRecord);

            top = row.top;
            // set the height with the cell height
            element.style.height = row.height + 'px';
        }

        // move to current cell
        DomHelper.setTranslateXY(element, renderData.left, top);
    }
}

ScheduleContext.featureClass = 'b-scheduler-context';

GridFeatureManager.registerFeature(ScheduleContext, false, ['Scheduler']);
