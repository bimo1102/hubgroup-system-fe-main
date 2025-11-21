import HeaderMenu from '../../Grid/feature/HeaderMenu.js';
import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';
import DateHelper from '../../Core/helper/DateHelper.js';
import '../../Core/widget/Slider.js';

/**
 * @module Scheduler/feature/TimeAxisHeaderMenu
 */
const setTimeSpanOptions = {
    maintainVisibleStart : true
};

/**
 * Adds scheduler specific menu items to the timeline header context menu.
 *
 * ## Default timeaxis header menu items
 *
 * Here is the list of menu items provided by this and other features:
 *
 * | Reference          | Text                  | Weight | Feature                                           | Description                  |
 * |--------------------|-----------------------|--------|---------------------------------------------------|------------------------------|
 * | `eventsFilter`     | Filter tasks          | 100    | {@link Scheduler.feature.EventFilter EventFilter} | Submenu for event filtering  |
 * | \>`nameFilter`     | By name               | 110    | {@link Scheduler.feature.EventFilter EventFilter} | Filter by `name`             |
 * | `zoomLevel`        | Zoom                  | 200    | *This feature*                                    | Submenu for timeline zooming |
 * | \>`zoomSlider`     | -                     | 210    | *This feature*                                    | Changes current zoom level   |
 * | `dateRange`        | Date range            | 300    | *This feature*                                    | Submenu for timeline range   |
 * | \>`startDateField` | Start date            | 310    | *This feature*                                    | Start date for the timeline  |
 * | \>`endDateField`   | End date              | 320    | *This feature*                                    | End date for the timeline    |
 * | \>`leftShiftBtn`   | <                     | 330    | *This feature*                                    | Shift backward               |
 * | \>`todayBtn`       | Today                 | 340    | *This feature*                                    | Go to today                  |
 * | \>`rightShiftBtn`  | \>                    | 350    | *This feature*                                    | Shift forward                |
 * | `currentTimeLine`  | Show current timeline | 400    | {@link Scheduler.feature.TimeRanges TimeRanges}   | Show current time line       |
 *
 * \> - first level of submenu
 *
 * ## Customizing the menu items
 *
 * The menu items in the TimeAxis Header menu can be customized, existing items can be changed or removed,
 * and new items can be added. This is handled using the `items` config of the feature.
 *
 * ### Add extra items:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     features : {
 *         timeAxisHeaderMenu : {
 *             items : {
 *                 extraItem : {
 *                     text : 'Extra',
 *                     icon : 'b-fa b-fa-fw b-fa-flag',
 *                     onItem() {
 *                         ...
 *                     }
 *                 }
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * ### Remove existing items:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     features : {
 *         timeAxisHeaderMenu : {
 *             items : {
 *                 zoomLevel : false
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * ### Customize existing item:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     features : {
 *         timeAxisHeaderMenu : {
 *             items : {
 *                 zoomLevel : {
 *                     text : 'Scale'
 *                 }
 *             }
 *         }
 *     }
 * });
 * ```
 * ### Customizing submenu items:
 *
 * ```
 * const scheduler = new Scheduler({
 *      features : {
 *          timeAxisHeaderMenu : {
 *              items : {
 *                  dateRange : {
 *                      menu : {
 *                          items : {
 *                              todayBtn : {
 *                                  text : 'Now'
 *                              }
 *                          }
 *                      }
 *                  }
 *              }
 *          }
 *      }
 * });
 * ```
 *
 * ### Manipulate existing items:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     features : {
 *         timeAxisHeaderMenu : {
 *             // Process items before menu is shown
 *             processItems({ items }) {
 *                  // Add an extra item dynamically
 *                 items.coolItem = {
 *                     text : 'Cool action',
 *                     onItem() {
 *                           // ...
 *                     }
 *                 }
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * Full information of the menu customization can be found in the ["Customizing the Event menu, the Schedule menu, and the TimeAxisHeader menu"](#Scheduler/guides/customization/contextmenu.md)
 * guide.
 *
 * This feature is **enabled** by default
 *
 * @extends Grid/feature/HeaderMenu
 * @demo Scheduler/basic
 * @classtype timeAxisHeaderMenu
 * @feature
 * @inlineexample Scheduler/feature/TimeAxisHeaderMenu.js
 */
export default class TimeAxisHeaderMenu extends HeaderMenu {

    //region Config

    static get $name() {
        return 'TimeAxisHeaderMenu';
    }

    static get defaultConfig() {
        return {
            /**
             * A function called before displaying the menu that allows manipulations of its items.
             * Returning `false` from this function prevents the menu being shown.
             *
             * ```javascript
             *   features         : {
             *       timeAxisHeaderMenu : {
             *           processItems({ items }) {
             *               // Add or hide existing items here as needed
             *               items.myAction = {
             *                   text   : 'Cool action',
             *                   icon   : 'b-fa b-fa-fw b-fa-ban',
             *                   onItem : () => console.log('Some coolness'),
             *                   weight : 300 // Move to end
             *               };
             *
             *               // Hide zoom slider
             *               items.zoomLevel.hidden = true;
             *           }
             *       }
             *   },
             * ```
             *
             * @param {Object} context An object with information about the menu being shown
             * @param {Object} context.items An object containing the {@link Core.widget.MenuItem menu item} configs keyed by their id
             * @param {Event} context.event The DOM event object that triggered the show
             * @config {Function}
             * @preventable
             */
            processItems : null,

            /**
             * This is a preconfigured set of items used to create the default context menu.
             *
             * The `items` provided by this feature are listed in the intro section of this class. You can
             * configure existing items by passing a configuration object to the keyed items.
             *
             * To remove existing
             * items, set corresponding keys to `false`
             *
             * ```javascript
             * const scheduler = new Scheduler({
             *     features : {
             *         timeAxisHeaderMenu : {
             *             items : {
             *                 eventsFilter        : false
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
            items : null,

            type : 'timeAxisHeader'
        };
    }

    static get pluginConfig() {
        const config = super.pluginConfig;

        config.chain.push('populateTimeAxisHeaderMenu');

        return config;
    }

    //endregion

    //region Events

    /**
     * Fired from Scheduler before the context menu is shown for the time axis header.
     * Allows manipulation of the items to show in the same way as in the {@link #config-processItems}.
     *
     * Returning `false` from a listener prevents the menu from being shown.
     *
     * @event timeAxisHeaderContextMenuBeforeShow
     * @preventable
     * @param {Scheduler.view.Scheduler} source The scheduler
     * @param {Core.widget.Menu} menu The menu
     * @param {Object} items Menu item configs
     * @param {Grid.column.Column} column Time axis column
     */

    /**
     * Fired from grid after the context menu is shown for a header
     * @event timeAxisHeaderContextMenuShow
     * @param {Scheduler.view.Scheduler} source The scheduler
     * @param {Core.widget.Menu} menu The menu
     * @param {Object} items Menu item configs
     * @param {Grid.column.Column} column Time axis column
     */

    /**
     * Fired from grid when an item is selected in the header context menu.
     * @event timeAxisHeaderContextMenuItem
     * @param {Scheduler.view.Scheduler} source The scheduler
     * @param {Core.widget.Menu} menu The menu
     * @param {Object} item Selected menu item
     * @param {Grid.column.Column} column Time axis column
     */

    //endregion

    construct() {
        super.construct(...arguments);

        if (this.triggerEvent.includes('click') && this.client.zoomOnTimeAxisDoubleClick) {
            this.client.zoomOnTimeAxisDoubleClick = false;
        }
    }

    shouldShowMenu(eventParams) {
        const { column } = eventParams;

        return column && column.enableHeaderContextMenu !== false && column === this.client.timeAxisColumn;
    }

    showContextMenu(eventParams) {
        super.showContextMenu(...arguments);

        if (this.menu) {
            // the TimeAxis's context menu probably will cause scrolls because it manipulates the dates.
            // The menu should not hide on scroll when for a TimeAxisColumn
            this.menu.scrollAction = 'realign';
        }
    }

    populateTimeAxisHeaderMenu({ items }) {
        const
            me         = this,
            { client } = me,
            dateStep   = {
                magnitude : client.timeAxis.shiftIncrement,
                unit      : client.timeAxis.shiftUnit
            };

        Object.assign(items, {
            zoomLevel : {
                text        : 'L{pickZoomLevel}',
                localeClass : me,
                icon        : 'b-fw-icon b-icon-search-plus',
                disabled    : !client.presets.count || me.disabled,
                weight      : 200,
                menu        : {
                    type  : 'popup',
                    items : {
                        zoomSlider : {
                            weight    : 210,
                            type      : 'slider',
                            minWidth  : 130, // for IE11
                            showValue : false
                        }
                    },
                    onBeforeShow({ source : menu }) {
                        const [zoom] = menu.items;

                        zoom.min = client.minZoomLevel;
                        zoom.max = client.maxZoomLevel;
                        zoom.value = client.zoomLevel;

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
            },
            dateRange : {
                text        : 'L{activeDateRange}',
                localeClass : me,
                icon        : 'b-fw-icon b-icon-calendar',
                weight      : 300,
                menu        : {
                    type     : 'popup',
                    width    : '20em',
                    defaults : {
                        localeClass : me
                    },
                    items : {
                        startDateField : {
                            type       : 'datefield',
                            label      : 'L{startText}',
                            weight     : 310,
                            labelWidth : '6em',
                            required   : true,
                            step       : dateStep,
                            listeners  : {
                                change  : me.onRangeDateFieldChange,
                                thisObj : me
                            }
                        },
                        endDateField : {
                            type       : 'datefield',
                            label      : 'L{endText}',
                            weight     : 320,
                            labelWidth : '6em',
                            required   : true,
                            step       : dateStep,
                            listeners  : {
                                change  : me.onRangeDateFieldChange,
                                thisObj : me
                            }
                        },
                        leftShiftBtn : {
                            type      : 'button',
                            weight    : 330,
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
                        todayBtn : {
                            type      : 'button',
                            weight    : 340,
                            cls       : 'b-today-nav-btn',
                            color     : 'b-blue b-raised',
                            text      : 'L{todayText}',
                            flex      : 4,
                            margin    : '0 8',
                            listeners : {
                                click   : me.onTodayBtnClick,
                                thisObj : me
                            }
                        },
                        rightShiftBtn : {
                            type      : 'button',
                            weight    : 350,
                            cls       : 'b-right-nav-btn',
                            icon      : 'b-icon b-icon-next',
                            color     : 'b-blue b-raised',
                            flex      : 1,
                            listeners : {
                                click   : me.onRightShiftBtnClick,
                                thisObj : me
                            }
                        }
                    },
                    listeners : {
                        paint   : me.initDateRangeFields,
                        thisObj : me
                    }
                }
            }
        });
    }

    onZoomSliderChange({ value }) {
        const me = this;

        // Zooming maintains timeline center point by scrolling the newly rerendered timeline to the
        // correct point to maintain the visual center. Temporarily inhibit context menu hide on scroll
        // of its context element.
        me.menu.scrollAction = 'realign';

        me.client.zoomLevel = value;

        me.menu.setTimeout({
            fn                : () => me.menu.scrollAction = 'hide',
            delay             : 100,
            cancelOutstanding : true
        });
    }

    initDateRangeFields({ source : dateRange, firstPaint }) {
        if (firstPaint) {
            const { widgetMap } = dateRange;

            this.startDateField = widgetMap.startDateField;
            this.endDateField = widgetMap.endDateField;
        }

        this.initDates();
    }

    initDates() {
        const me = this;

        me.startDateField.suspendEvents();
        me.endDateField.suspendEvents();

        // The actual scheduler start dates may include time, but our Date field cannot currently handle
        // a time portion and throws it away, so when we need the value from an unchanged field, we need
        // to use the initialValue set from the timeAxis values.
        // Until our DateField can optionally include a time value, this is the solution.
        me.startDateField.value = me.startDateFieldInitialValue = me.client.startDate;
        me.endDateField.value = me.endDateFieldInitialValue = me.client.endDate;

        me.startDateField.resumeEvents();
        me.endDateField.resumeEvents();
    }

    onRangeDateFieldChange({ source }) {
        const
            me               = this,
            startDateChanged = (source === me.startDateField),
            { client }       = me,
            { timeAxis }     = client,
            startDate        = me.startDateFieldInitialValue && !startDateChanged ? me.startDateFieldInitialValue : me.startDateField.value;

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
        this.client.timeAxis.shiftPrevious();
        this.initDates();
    }

    onTodayBtnClick() {
        const today = DateHelper.clearTime(new Date());

        this.client.setTimeSpan(today, DateHelper.add(today, 1, 'day'));
        this.initDates();
    }

    onRightShiftBtnClick() {
        this.client.timeAxis.shiftNext();
        this.initDates();
    }
}

GridFeatureManager.registerFeature(TimeAxisHeaderMenu, true, ['Scheduler', 'Gantt']);
GridFeatureManager.registerFeature(TimeAxisHeaderMenu, false, 'ResourceHistogram');
