import InstancePlugin from '../../Core/mixin/InstancePlugin.js';
import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';

/**
 * @module Scheduler/feature/EventFilter
 */

/**
 * Adds event filter menu items to the timeline header context menu.
 *
 * This feature is **enabled** by default
 *
 * @extends Core/mixin/InstancePlugin
 *
 * @example
 * let scheduler = new Scheduler({
 *   features : {
 *     eventFilter : true // `true` by default, set to `false` to disable the feature and remove the menu item from the timeline header
 *   }
 * });
 *
 * @classtype eventFilter
 * @feature
 * @inlineexample Scheduler/feature/EventFilter.js
 */
export default class EventFilter extends InstancePlugin {
    // Plugin configuration. This plugin chains some of the functions in Grid.

    static get $name() {
        return 'EventFilter';
    }

    static get pluginConfig() {
        return {
            chain : [
                'populateHeaderMenu', // TODO: 'headerContextMenu' is deprecated. Please see https://bryntum.com/docs/scheduler/#Scheduler/guides/upgrades/4.0.0.md for more information.
                'populateTimeAxisHeaderMenu'
            ]
        };
    }

    construct(scheduler, config) {
        super.construct(scheduler, config);

        this.scheduler = scheduler;
    }

    // TODO: 'headerContextMenu' is deprecated. Please see https://bryntum.com/docs/scheduler/#Scheduler/guides/upgrades/4.0.0.md for more information.
    /**
     * Populates the header context menu items.
     * @param {Object} options Contains menu items and extra data retrieved from the menu target.
     * @param {Grid.column.Column} options.column Column for which the menu will be shown
     * @param {Object} options.items A named object to describe menu items
     * @internal
     * @deprecated 4.0.0 Use `populateTimeAxisHeaderMenu` instead
     */
    populateHeaderMenu({ column, items }) {
        if (column.type !== 'timeAxis') {
            return;
        }

        this.populateTimeAxisHeaderMenu(...arguments);
    }

    /**
     * Populates the header context menu items.
     * @param {Object} options Contains menu items and extra data retrieved from the menu target.
     * @param {Grid.column.Column} options.column Column for which the menu will be shown
     * @param {Object} options.items A named object to describe menu items
     * @internal
     */
    populateTimeAxisHeaderMenu({ column, items }) {
        const me = this;

        items.eventsFilter = {
            text        : 'L{filterEvents}',
            icon        : 'b-fw-icon b-icon-filter',
            disabled    : me.disabled,
            localeClass : this,
            weight      : 100,
            menu        : {
                type        : 'popup',
                localeClass : this,
                items       : {
                    nameFilter : {
                        weight               : 110,
                        type                 : 'textfield',
                        cls                  : 'b-eventfilter b-last-row',
                        clearable            : true,
                        keyStrokeChangeDelay : 300,
                        label                : 'L{byName}',
                        localeClass          : this,
                        width                : 200,
                        listeners            : {
                            change  : me.onEventFilterChange,
                            thisObj : me
                        }
                    }
                },
                onBeforeShow({ source : menu }) {
                    const
                        [filterByName] = menu.items,
                        filter         = me.scheduler.eventStore.filters.getBy('property', 'name');

                    filterByName.value = filter && filter.value || '';
                }
            }
        };
    }

    onEventFilterChange({ value }) {
        const me = this;

        if (value !== '') {
            me.scheduler.eventStore.filter('name', value);
        }
        else {
            me.scheduler.eventStore.removeFilter('name');
        }
    }
}

EventFilter.featureClass = 'b-event-filter';

GridFeatureManager.registerFeature(EventFilter, true, ['Scheduler', 'Gantt']);
GridFeatureManager.registerFeature(EventFilter, false, 'ResourceHistogram');
