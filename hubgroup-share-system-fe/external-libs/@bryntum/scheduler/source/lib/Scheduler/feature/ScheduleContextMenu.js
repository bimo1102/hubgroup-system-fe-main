import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';
import ScheduleMenu from '../../Scheduler/feature/ScheduleMenu.js';
import VersionHelper from '../../Core/helper/VersionHelper.js';

/**
 * @module Scheduler/feature/ScheduleContextMenu
 */

/**
 * **DEPRECATED: This class is deprecated since v4.0.0,
 * use {@link Scheduler.feature.ScheduleMenu ScheduleMenu} feature instead.**
 *
 * Displays a context menu for empty parts of the schedule. Items are populated by other features and/or application code.
 *
 * This feature is **off** by default. For info on enabling it, see {@link Grid.view.mixin.GridFeatures}.
 *
 * @deprecated 4.0.0
 * @extends Scheduler/feature/ScheduleMenu
 * @classtype scheduleContextMenu
 * @feature
 */
export default class ScheduleContextMenu extends ScheduleMenu {
    //region Config

    static get $name() {
        return 'ScheduleContextMenu';
    }

    construct(scheduler, config) {
        super.construct(scheduler, config);

        this.scheduler = scheduler;

        VersionHelper.deprecate('Scheduler', '5.0.0', '`ScheduleContextMenu` feature is deprecated, in favor of `ScheduleMenu` feature. Please see https://bryntum.com/docs/scheduler/#Scheduler/guides/upgrades/3.1.0.md for more information.');

        // If this feature is enabled, need to disable ScheduleMenu. They are mutually exclusive.
        if (scheduler.features.scheduleMenu) {
            scheduler.features.scheduleMenu.disabled = true;
        }
    }

    //endregion

    //region Events

    /**
     * Fired from scheduler before the context menu is shown for an event. Allows manipulation of the items
     * to show in the same way as in `processItems`. Returning `false` from a listener prevents the menu from
     * being shown.
     * @event scheduleContextMenuBeforeShow
     * @deprecated 4.0.0 Renamed to scheduleMenuBeforeShow
     * @preventable
     * @param {Scheduler.view.Scheduler} source
     * @param {Object} items Menu item configs
     * @param {Scheduler.model.EventModel} eventRecord Event record for which the menu was triggered
     * @param {Scheduler.model.ResourceModel} resourceRecord Resource record
     * @param {Scheduler.model.AssignmentModel} assignmentRecord Assignment record, if assignments are used
     * @param {HTMLElement} eventElement
     */

    /**
     * Fired from scheduler when an item is selected in the context menu.
     * @event scheduleContextMenuItem
     * @deprecated 4.0.0 Renamed to scheduleMenuItem
     * @param {Scheduler.view.Scheduler} source
     * @param {Core.widget.MenuItem} item
     * @param {Scheduler.model.EventModel} eventRecord
     * @param {Scheduler.model.ResourceModel} resourceRecord
     * @param {Scheduler.model.AssignmentModel} assignmentRecord Assignment record, if assignments are used
     * @param {HTMLElement} eventElement
     */

    /**
     * Fired from scheduler after showing the context menu for an event
     * @event scheduleContextMenuShow
     * @deprecated 4.0.0 Renamed to eventMenuShow
     * @param {Scheduler.view.Scheduler} source
     * @param {Core.widget.Menu} menu The menu
     * @param {Scheduler.model.EventModel} eventRecord Event record for which the menu was triggered
     * @param {Scheduler.model.ResourceModel} resourceRecord Resource record
     * @param {Scheduler.model.AssignmentModel} assignmentRecord Assignment record, if assignments are used
     * @param {HTMLElement} eventElement
     */

    //endregion

}

ScheduleContextMenu.featureClass = '';

GridFeatureManager.registerFeature(ScheduleContextMenu);
