import TimeSpanMenuBase from '../../Scheduler/feature/base/TimeSpanMenuBase.js';
import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import DomHelper from '../../Core/helper/DomHelper.js';

/**
 * @module Scheduler/feature/ScheduleMenu
 */

/**
 * Displays a context menu for empty parts of the schedule. Items are populated in the first place
 * by configurations of this Feature, then by other features and/or application code.
 *
 * ### Default scheduler zone menu items
 *
 * The Scheduler menu feature provides only one item:
 *
 * | Reference      | Text      | Weight | Feature        | Description                                                                                                          |
 * |----------------|-----------|--------|----------------|----------------------------------------------------------------------------------------------------------------------|
 * | `addEvent`     | Add event | 100    | *This feature* | Add a new event for the hovered resource starting at the clicked point in time. Hidden if the Scheduler is read-only |
 *
 * ### Customizing the menu items
 *
 * The menu items in the Scheduler menu can be customized, existing items can be changed or removed,
 * and new items can be added. This is handled using the `items` config of the feature.
 *
 * Add extra item:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     features : {
 *         scheduleMenu : {
 *             items : {
 *                 extraItem : {
 *                     text : 'Extra',
 *                     icon : 'b-fa b-fa-fw b-fa-flag',
 *                     onItem({date, resourceRecord, items}) {
 *                         // Custom date based action
 *                     }
 *                 }
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * Remove existing item:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     features : {
 *         scheduleMenu : {
 *             items : {
 *                 addEvent : false
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * Customize existing item:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     features : {
 *         scheduleMenu : {
 *             items : {
 *                 addEvent : {
 *                     text : 'Create new booking'
 *                 }
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * Manipulate existing items:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     features : {
 *         scheduleMenu : {
 *             // Process items before menu is shown
 *             processItems({date, resourceRecord, items}) {
 *                  // Add an extra item for ancient times
 *                  if (date < new Date(2018, 11, 17)) {
 *                      items.modernize = {
 *                          text : 'Modernize',
 *                          ontItem({date}) {
 *                              // Custom date based action
 *                          }
 *                      };
 *                  }
 *
 *                  // Do not show menu for Sundays
 *                  if (date.getDay() === 0) {
 *                      return false;
 *                  }
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * Full information of the menu customization can be found in the "Customizing the Event menu, the Schedule menu, and the TimeAxisHeader menu" guide.
 *
 * This feature is **enabled** by default
 *
 * @demo Scheduler/basic
 * @extends Scheduler/feature/base/TimeSpanMenuBase
 * @classtype scheduleMenu
 * @feature
 */
export default class ScheduleMenu extends TimeSpanMenuBase {
    //region Config

    static get $name() {
        return 'ScheduleMenu';
    }

    static get defaultConfig() {
        return {
            type : 'schedule',

            /**
             * This is a preconfigured set of items used to create the default context menu.
             *
             * The `items` provided by this feature are listed below. These are the predefined property names which you may
             * configure:
             *
             * - `addEvent` Add an event for at the resource and time indicated by the `contextmenu` event.
             *
             * To remove existing items, set corresponding keys to `false`
             *
             * ```javascript
             * const scheduler = new Scheduler({
             *     features : {
             *         scheduleMenu : {
             *             items : {
             *                 addEvent : false
             *             }
             *         }
             *     }
             * });
             * ```
             *
             * @config {Object} items
             */
            items : null,

            /**
             * A function called before displaying the menu that allows manipulations of its items.
             * Returning `false` from this function prevents the menu being shown.
             *
             * ```javascript
             * features         : {
             *    scheduleMenu : {
             *         processItems({ items, date, resourceRecord }) {
             *            // Add or hide existing items here as needed
             *            items.myAction = {
             *                text   : 'Cool action',
             *                icon   : 'b-fa b-fa-cat',
             *                onItem : () => console.log(`Clicked on ${resourceRecord.name} at ${date}`),
             *                weight : 1000 // Move to end
             *            };
             *
             *            if (!resourceRecord.allowAdd) {
             *                items.addEvent.hidden = true;
             *            }
             *        }
             *    }
             * },
             * ```
             * @param {Object} context An object with information about the menu being shown
             * @param {Scheduler.model.ResourceModel} context.resourceRecord The record representing the current resource
             * @param {Date} context.date The clicked date
             * @param {Object} context.items An object containing the {@link Core.widget.MenuItem menu item} configs keyed by their id
             * @param {Event} context.event The DOM event object that triggered the show
             * @config {Function}
             * @preventable
             */
            processItems : null
        };
    }

    static get pluginConfig() {
        const config = super.pluginConfig;

        config.chain.push('populateScheduleMenu');

        return config;
    }

    //endregion

    //region Events

    /**
     * Fired from scheduler before the context menu is shown for an event. Allows manipulation of the items
     * to show in the same way as in `processItems`. Returning `false` from a listener prevents the menu from
     * being shown.
     * @event scheduleMenuBeforeShow
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
     * @event scheduleMenuItem
     * @param {Scheduler.view.Scheduler} source
     * @param {Core.widget.MenuItem} item
     * @param {Scheduler.model.EventModel} eventRecord
     * @param {Scheduler.model.ResourceModel} resourceRecord
     * @param {Scheduler.model.AssignmentModel} assignmentRecord Assignment record, if assignments are used
     * @param {HTMLElement} eventElement
     */

    /**
     * Fired from scheduler after showing the context menu for an event
     * @event scheduleMenuShow
     * @param {Scheduler.view.Scheduler} source
     * @param {Core.widget.Menu} menu The menu
     * @param {Scheduler.model.EventModel} eventRecord Event record for which the menu was triggered
     * @param {Scheduler.model.ResourceModel} resourceRecord Resource record
     * @param {Scheduler.model.AssignmentModel} assignmentRecord Assignment record, if assignments are used
     * @param {HTMLElement} eventElement
     */

    //endregion

    shouldShowMenu(eventParams) {
        const
            { client } = this,
            {
                column,
                targetElement,
                resourceRecord
            } = eventParams,
            isTimeAxisColumn = column
                ? column === client.timeAxisColumn
                : client.timeAxisSubGrid.element === targetElement;

        return isTimeAxisColumn && !(resourceRecord && resourceRecord.isSpecialRow);
    }

    getDataFromEvent(event) {
        // Process event if it wasn't yet processed
        if (DomHelper.isDOMEvent(event)) {
            const
                { client }     = this,
                cellData       = client.getCellDataFromEvent(event),
                date           = client.getDateFromDomEvent(event, 'floor'),
                // For vertical mode the resource must be resolved from the event
                resourceRecord = client.resolveResourceRecord(event) || client.isVertical && client.resourceStore.last;

            return ObjectHelper.assign(super.getDataFromEvent(event), cellData, { date, resourceRecord });
        }

        return event;
    }

    populateScheduleMenu({ items, resourceRecord }) {
        const { client } = this;

        // Menu can work for ResourceHistogram which doesn't have event store
        if (!client.readOnly && client.eventStore) {
            items.addEvent = {
                text     : 'L{SchedulerBase.Add event}',
                icon     : 'b-icon b-icon-add',
                disabled : !resourceRecord || resourceRecord.readOnly,
                weight   : 100,
                onItem({ date, resourceRecord }) {
                    client.internalAddEvent(date, resourceRecord, client.getRowFor(resourceRecord));
                }
            };
        }
    }
}

ScheduleMenu.featureClass = '';

GridFeatureManager.registerFeature(ScheduleMenu, true, 'Scheduler');
