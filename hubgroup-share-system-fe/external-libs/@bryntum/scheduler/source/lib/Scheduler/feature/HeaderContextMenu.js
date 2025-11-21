import InstancePlugin from '../../Core/mixin/InstancePlugin.js';
import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';
import DateHelper from '../../Core/helper/DateHelper.js';
import DateField from '../../Core/widget/DateField.js';
import VersionHelper from '../../Core/helper/VersionHelper.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import '../../Core/widget/Button.js';
import '../../Core/widget/Popup.js';
import '../../Core/widget/Slider.js';

/**
 * @module Scheduler/feature/HeaderContextMenu
 */
const setTimeSpanOptions = {
    maintainVisibleStart : true
};

/**
 * **DEPRECATED: This class is deprecated since v4.0.0,
 * use {@link Scheduler.feature.TimeAxisHeaderMenu TimeAxisHeaderMenu} feature instead.**
 *
 * Adds scheduler specific menu items to the timeline header context menu.
 *
 * This feature is **off** by default. For info on enabling it, see {@link Grid.view.mixin.GridFeatures}.
 *
 * @extends Core/mixin/InstancePlugin
 * @deprecated 4.0.0
 * @classtype headerContextMenu
 * @feature
 */
export default class HeaderContextMenu extends InstancePlugin {

    static get $name() {
        return 'HeaderContextMenu';
    }

    static get defaultConfig() {
        return {
            /**
             * An array of additional items to add to the menu
             * @config {Object[]}
             * @default
             */
            extraItems : null,

            /**
             * A function called before displaying the menu that allows manipulations of its items. Called with a
             * single parameter with format { eventRecord, resourceRecord, eventElement, items }.
             *
             * ```javascript
             * features : {
             *     headerContextMenu : {
             *         processItems({ items }) {
             *             // Add or remove items here as needed
             *             items.push({ text: 'Some action', icon : 'b-fa b-fa-fw b-fa-ban' })
             *         }
             *     }
             * }
             * ```
             *
             * @config {Function}
             */
            processItems : null
        };
    }

    // Plugin configuration. This plugin chains some of the functions in Grid.
    static get pluginConfig() {
        return {
            chain : ['populateHeaderMenu']
        };
    }

    construct(scheduler, config) {
        super.construct(scheduler, config);

        this.scheduler = scheduler;

        VersionHelper.deprecate('Scheduler', '5.0.0', '`HeaderContextMenu` feature is deprecated, in favor of `TimeAxisHeaderMenu` feature. Please see https://bryntum.com/docs/scheduler/#Scheduler/guides/upgrades/3.1.0.md for more information.');

        // If this feature is enabled, need to disable TimeAxisHeaderMenu. They are mutually exclusive.
        if (scheduler.features.timeAxisHeaderMenu) {
            scheduler.features.timeAxisHeaderMenu.disabled = true;
        }

        // By default this feature works based on ContextMenu feature.
        // In case new HeaderMenu feature is used, need to make sure it shows menu for timeAxis too
        if (scheduler.features.headerMenu) {
            scheduler.features.headerMenu._showForTimeAxis = true;
        }
    }

    /**
     * Populates the TimeAxis header context menu items.
     * @param {Object} options Contains menu items and extra data retrieved from the menu target.
     * @param {Grid.column.Column} options.column Column for which the menu will be shown
     * @param {Object} options.items A named object to describe menu items
     * @internal
     */
    populateHeaderMenu({ column, items, menu }) {
        const me = this;

        if (column.type !== 'timeAxis') {
            return;
        }

        if (menu) {
            // the TimeAxis's context menu probably will cause scrolls because it manipulates the dates.
            // The menu should not hide on scroll when for a TimeAxisColumn
            menu.scrollAction = 'realign';
        }

        ObjectHelper.merge(items, me.defaultItems);

        const arrayOfItems = ObjectHelper.transformNamedObjectToArray(items);

        if (me.extraItems) {
            arrayOfItems.push(...me.extraItems);
        }

        if (me.processItems) {
            me.processItems({ items : arrayOfItems });
        }

        const namedItems = ObjectHelper.transformArrayToNamedObject(arrayOfItems);

        // replace items in original object with the new items
        ObjectHelper.removeAllProperties(items);
        ObjectHelper.merge(items, namedItems);
    }

    get defaultItems() {
        const
            me            = this,
            { scheduler } = me,
            { timeAxis }  = scheduler,
            dateStep      = {
                magnitude : timeAxis.shiftIncrement,
                unit      : timeAxis.shiftUnit
            },
            items         = {};

        items.pickZoomLevel = {
            text        : 'L{pickZoomLevel}',
            localeClass : this,
            icon        : 'b-fw-icon b-icon-search-plus',
            disabled    : !scheduler.presets.count || me.disabled,
            menu        : {
                type  : 'popup',
                items : [{
                    type      : 'slider',
                    minWidth  : 130, // for IE11
                    showValue : false
                }],
                onBeforeShow({ source : menu }) {
                    const [zoom] = menu.items;

                    zoom.min = scheduler.minZoomLevel;
                    zoom.max = scheduler.maxZoomLevel;
                    zoom.value = scheduler.zoomLevel;

                    // Default slider value is 50 which causes the above to trigger onZoomSliderChange (when
                    // maxZoomLevel < 50) if we add our listener prior to this point.
                    me.zoomDetatcher = zoom.on('input', 'onZoomSliderChange', me);
                },
                onHide() {
                    if (me.zoomDetatcher) {
                        me.zoomDetatcher();
                        me.zoomDetatcher = null;
                    }
                }
            }
        };

        me.startDateField = new DateField({
            label      : me.L('L{startText}'),
            labelWidth : '6em',
            required   : true,
            step       : dateStep,
            listeners  : {
                change  : me.onRangeDateFieldChange,
                thisObj : me
            }
        });

        me.endDateField = new DateField({
            label      : me.L('L{endText}'),
            labelWidth : '6em',
            required   : true,
            step       : dateStep,
            listeners  : {
                change  : me.onRangeDateFieldChange,
                thisObj : me
            }
        });

        items.activeDateRange = {
            text        : 'L{activeDateRange}',
            localeClass : this,
            icon        : 'b-fw-icon b-icon-calendar',
            disabled    : me.disabled,
            menu        : {
                type  : 'popup',
                width : '20em',
                items : [
                    me.startDateField,
                    me.endDateField,
                    {
                        type      : 'button',
                        cls       : 'b-left-nav-btn',
                        icon      : 'b-icon b-icon-prev',
                        color     : 'b-blue b-raised',
                        flex      : 1,
                        margin    : 0,
                        listeners : {
                            click   : me.onLeftShiftBtnClick,
                            thisObj : me
                        }
                    },
                    {
                        type        : 'button',
                        cls         : 'b-today-nav-btn',
                        color       : 'b-blue b-raised',
                        text        : 'L{todayText}',
                        localeClass : this,
                        flex        : 4,
                        margin      : '0 8',
                        listeners   : {
                            click   : me.onTodayBtnClick,
                            thisObj : me
                        }
                    },
                    {
                        type      : 'button',
                        cls       : 'b-right-nav-btn',
                        icon      : 'b-icon b-icon-next',
                        color     : 'b-blue b-raised',
                        flex      : 1,
                        listeners : {
                            click   : me.onRightShiftBtnClick,
                            thisObj : me
                        }
                    }
                ],
                onBeforeShow : () => me.initDates()
            }
        };

        return items;
    }

    onZoomSliderChange({ value }) {
        this.scheduler.zoomLevel = value;
    }

    initDates() {
        const me = this;

        me.startDateField.suspendEvents();
        me.endDateField.suspendEvents();

        // The actual scheduler start dates may include time, but our Date field cannot currently handle
        // a time portion and throws it away, so when we need the value from an unchanged field, we need
        // to use the initialValue set from the timeAxis values.
        // Until our DateField can optionally include a time value, this is the solution.
        me.startDateField.value = me.startDateFieldInitialValue = me.scheduler.startDate;
        me.endDateField.value   = me.endDateFieldInitialValue = me.scheduler.endDate;

        me.startDateField.resumeEvents();
        me.endDateField.resumeEvents();
    }

    onRangeDateFieldChange({ source }) {
        const
            me                 = this,
            startDateChanged   = (source === me.startDateField),
            { client }         = me,
            { timeAxis }       = client,
            startDate          = me.startDateFieldInitialValue && !startDateChanged ? me.startDateFieldInitialValue : me.startDateField.value;

        let endDate = me.endDateFieldInitialValue && startDateChanged ? me.endDateFieldInitialValue : me.endDateField.value;

        // When either of the fields is changed, we no longer use its initialValue from the timeAxis start or end
        // so that gets nulled to indicate that it's unavailable and the real field value is to be used.
        if (startDateChanged) {
            me.startDateFieldInitialValue = null;
        }
        else {
            me.endDateFieldInitialValue = null;
        }

        // Because the start and end dates are exclusive, avoid a zero
        // length time axis by incrementing the end by one tick unit
        // if they are the same.
        if (!(endDate - startDate)) {
            endDate = DateHelper.add(endDate, timeAxis.shiftIncrement, timeAxis.shiftUnit);
        }
        // if start date got bigger than end date set end date to start date plus one tick
        else if (endDate < startDate) {
            endDate = DateHelper.add(startDate, timeAxis.shiftIncrement, timeAxis.shiftUnit);
        }

        // setTimeSpan will try to keep the scroll position the same.
        client.setTimeSpan(startDate, endDate, setTimeSpanOptions);

        me.initDates();
    }

    onLeftShiftBtnClick() {
        const me = this;

        me.scheduler.timeAxis.shiftPrevious();
        me.initDates();
    }

    onTodayBtnClick() {
        const me = this,
            today = DateHelper.clearTime(new Date());

        me.scheduler.setTimeSpan(today, DateHelper.add(today, 1, 'day'));
        me.initDates();
    }

    onRightShiftBtnClick() {
        const me = this;

        me.scheduler.timeAxis.shiftNext();
        me.initDates();
    }
}

HeaderContextMenu.featureClass = '';

GridFeatureManager.registerFeature(HeaderContextMenu);
