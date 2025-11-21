import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';
import TimeSpanMenuBase from './base/TimeSpanMenuBase.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import Objects from '../../Core/helper/util/Objects.js';

/**
 * @module Scheduler/feature/EventMenu
 */

/**
 * Displays a context menu for events. Items are populated by other features and/or application code.
 *
 * ### Default event menu items
 *
 * Here is the list of menu items provided by the feature and populated by the other features:
 *
 * | Reference       | Text           | Weight | Feature                             | Description                                                             |
 * |-----------------|----------------|--------|-------------------------------------|-------------------------------------------------------------------------|
 * | `editEvent`     | Edit event     | 100    | {@link Scheduler.feature.EventEdit} | Open the event editor. Hidden for read-only Scheduler                   |
 * | `deleteEvent`   | Delete event   | 200    | *This feature*                      | Remove the event. Hidden for read-only Scheduler                        |
 * | `unassignEvent` | Unassign event | 300    | *This feature*                      | Unassign the event. Shown when using multi-assignment and not read-only |
 *
 * ### Customizing the menu items
 *
 * The menu items in the Event menu can be customized, existing items can be changed or removed,
 * and new items can be added. This is handled using the `items` config of the feature.
 *
 * Add extra items for all events:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     features : {
 *         eventMenu : {
 *             items : {
 *                 extraItem : {
 *                     text : 'Extra',
 *                     icon : 'b-fa b-fa-fw b-fa-flag',
 *                     onItem({eventRecord}) {
 *                         eventRecord.flagged = true;
 *                     }
 *                 }
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * Remove existing items:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     features : {
 *         eventMenu : {
 *             items : {
 *                 deleteEvent   : false,
 *                 unassignEvent : false
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
 *         eventMenu : {
 *             items : {
 *                 deleteEvent : {
 *                     text : 'Delete booking'
 *                 }
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * Manipulate existing items for all events or specific events:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     features : {
 *         eventMenu : {
 *             // Process items before menu is shown
 *             processItems({eventRecord, items}) {
 *                  // Push an extra item for conferences
 *                  if (eventRecord.type === 'conference') {
 *                      items.showSessionItem = {
 *                          text : 'Show sessions',
 *                          onItem({eventRecord}) {
 *                              // ...
 *                          }
 *                      };
 *                  }
 *
 *                  // Do not show menu for secret events
 *                  if (eventRecord.type === 'secret') {
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
 * @extends Scheduler/feature/base/TimeSpanMenuBase
 * @demo Scheduler/eventmenu
 * @classtype eventMenu
 * @feature
 */
export default class EventMenu extends TimeSpanMenuBase {
    //region Config

    static get $name() {
        return 'EventMenu';
    }

    static get configurable() {
        return {
            /**
             * A function called before displaying the menu that allows manipulations of its items.
             * Returning `false` from this function prevents the menu being shown.
             *
             * ```javascript
             * features         : {
             *    eventMenu : {
             *         processItems({ items, eventRecord, assignmentRecord, resourceRecord }) {
             *             // Add or hide existing items here as needed
             *             items.myAction = {
             *                 text   : 'Cool action',
             *                 icon   : 'b-fa b-fa-fw b-fa-ban',
             *                 onItem : () => console.log(`Clicked ${eventRecord.name}`),
             *                 weight : 1000 // Move to end
             *             };
             *
             *            if (!eventRecord.allowDelete) {
             *                 items.deleteEvent.hidden = true;
             *             }
             *         }
             *     }
             * },
             * ```
             * @param {Object} context An object with information about the menu being shown
             * @param {Scheduler.model.EventModel} context.eventRecord The record representing the current event
             * @param {Scheduler.model.ResourceModel} context.resourceRecord The record representing the current resource
             * @param {Scheduler.model.AssignmentModel} context.assignmentRecord The assignment record
             * @param {Object} context.items An object containing the {@link Core.widget.MenuItem menu item} configs keyed by their id
             * @param {Event} context.event The DOM event object that triggered the show
             * @config {Function}
             * @preventable
             */
            processItems : null,

            type : 'event'

            /**
             * This is a preconfigured set of items used to create the default context menu.
             *
             * The `items` provided by this feature are listed below. These are the property names which you may
             * configure:
             *
             * - `deleteEvent` Deletes the context event.
             * - `unassignEvent` Unassigns the context event from the current resource (only added when multi assignment is used).
             *
             * To remove existing items, set corresponding keys to `false`
             *
             * ```javascript
             * const scheduler = new Scheduler({
             *     features : {
             *         eventMenu : {
             *             items : {
             *                 deleteEvent   : false,
             *                 unassignEvent : false
             *             }
             *         }
             *     }
             * });
             * ```
             *
             * See the feature config in the above example for details.
             *
             * @config {Object} items
             */
        };
    }

    static get pluginConfig() {
        const config = super.pluginConfig;

        config.chain.push('populateEventMenu');

        return config;
    }

    //endregion

    //region Events

    /**
     * Fired from scheduler before the context menu is shown for an event. Allows manipulation of the items
     * to show in the same way as in `processItems`. Returning `false` from a listener prevents the menu from
     * being shown.
     * @event eventMenuBeforeShow
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
     * @event eventMenuItem
     * @param {Scheduler.view.Scheduler} source
     * @param {Core.widget.MenuItem} item
     * @param {Scheduler.model.EventModel} eventRecord
     * @param {Scheduler.model.ResourceModel} resourceRecord
     * @param {Scheduler.model.AssignmentModel} assignmentRecord Assignment record, if assignments are used
     * @param {HTMLElement} eventElement
     */

    /**
     * Fired from scheduler after showing the context menu for an event
     * @event eventMenuShow
     * @param {Scheduler.view.Scheduler} source
     * @param {Core.widget.Menu} menu The menu
     * @param {Scheduler.model.EventModel} eventRecord Event record for which the menu was triggered
     * @param {Scheduler.model.ResourceModel} resourceRecord Resource record
     * @param {Scheduler.model.AssignmentModel} assignmentRecord Assignment record, if assignments are used
     * @param {HTMLElement} eventElement
     */

    //endregion

    onElementKeyDown(event) {
        if (!event.handled && event.target.matches(this.client.eventSelector)) {
            if (event.key === ' ') {
                this.internalShowContextMenu(this.createContextMenuEventForElement(event.target));
            }
        }
    }

    getDataFromEvent(event) {
        const
            data             = super.getDataFromEvent(event),
            eventElement     = data.targetElement,
            { client }       = this,
            eventRecord      = client.resolveEventRecord(eventElement),
            // For vertical mode the resource must be resolved from the event
            resourceRecord   = eventRecord && (client.resolveResourceRecord(eventElement) || client.resourceStore.last),
            assignmentRecord = eventRecord && client.resolveAssignmentRecord(eventElement);

        return Object.assign(data, {
            eventElement,
            eventRecord,
            resourceRecord,
            assignmentRecord
        });
    }

    getTargetElementFromEvent({ target }) {
        return DomHelper.up(target, this.client.eventSelector) || target;
    }

    shouldShowMenu(eventParams) {
        return eventParams.eventRecord;
    }

    /**
     * Shows context menu for the provided event. If record is not rendered (outside of time span/filtered)
     * menu won't appear.
     * @param {Scheduler.model.EventModel} eventRecord Event record to show menu for.
     * @param {Object} [options]
     * @param {HTMLElement} options.targetElement Element to align context menu to.
     * @param {MouseEvent} options.event Browser event.
     * If provided menu will be aligned according to clientX/clientY coordinates.
     * If omitted, context menu will be centered to event element.
     */
    showContextMenuFor(eventRecord, { targetElement, event } = {}) {
        if (this.disabled) {
            return;
        }

        if (!targetElement) {
            targetElement = this.getElementFromRecord(eventRecord);

            // If record is not rendered, do nothing
            if (!targetElement) {
                return;
            }
        }

        event = event || this.createContextMenuEventForElement(targetElement);

        this.internalShowContextMenu(event);
    }

    getElementFromRecord(record) {
        return this.client.getElementsFromEventRecord(record)[0];
    }

    populateEventMenu({ items }) {
        const { client } = this;

        items.deleteEvent = {
            hidden : client.readOnly
        };
        items.unassignEvent = {
            hidden : client.readOnly || client.eventStore.usesSingleAssignment
        };
    }

    // This generates the fixed, unchanging part of the items and is only called once
    // to generate the baseItems of the feature.
    // The dynamic parts which are set by populateEventMenu have this merged into them.
    changeItems(items) {
        const { client } = this;

        return Objects.merge({
            deleteEvent : {
                text   : 'L{SchedulerBase.Delete event}',
                icon   : 'b-icon b-icon-trash',
                weight : 200,
                onItem({ menu, eventRecord }) {
                    // We must synchronously push focus back into the menu's triggering
                    // event so that the our beforeRemove handlers can move focus onwards
                    // to the closest remaining event.
                    // Otherwise, the menu's default hide processing on hide will attempt
                    // to move focus back to the menu's triggering event which will
                    // by then have been deleted.
                    const revertTarget = menu.focusInEvent?.relatedTarget;
                    if (revertTarget) {
                        revertTarget.focus();
                        client.navigator.activeItem = revertTarget;
                    }
                    client.removeEvents(client.isEventSelected(eventRecord) ? client.selectedEvents : [eventRecord]);
                }
            },
            unassignEvent : {
                text   : 'L{SchedulerBase.Unassign event}',
                icon   : 'b-icon b-icon-unassign',
                weight : 300,
                name   : 'unassignEvent',
                onItem({ menu, eventRecord, resourceRecord }) {
                    // We must synchronously push focus back into the menu's triggering
                    // event so that the our beforeRemove handlers can move focus onwards
                    // to the closest remaining event.
                    // Otherwise, the menu's default hide processing on hide will attempt
                    // to move focus back to the menu's triggering event which will
                    // by then have been deleted.
                    const revertTarget = menu.focusInEvent?.relatedTarget;
                    if (revertTarget) {
                        revertTarget.focus();
                        client.navigator.activeItem = revertTarget;
                    }
                    eventRecord.unassign(resourceRecord);
                }
            }
        }, items);
    }

    changeMenu(menu, oldMenu) {
        if (menu) {
            menu.clippedBy = undefined;
        }
        return super.changeMenu(menu, oldMenu);
    }
}

EventMenu.featureClass = '';

GridFeatureManager.registerFeature(EventMenu, true, 'Scheduler');
GridFeatureManager.registerFeature(EventMenu, false, 'ResourceHistogram');
