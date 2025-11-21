import AbstractTimeRanges from './AbstractTimeRanges.js';
import TimeSpan from '../model/TimeSpan.js';
import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';
import DateHelper from '../../Core/helper/DateHelper.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';

/**
 * @module Scheduler/feature/TimeRanges
 */

/**
 * Feature that renders global ranges of time in the timeline. Use this feature to visualize a `range` like a 1 hr lunch or some important point in time
 * (a `line`, i.e. a range with 0 duration). This feature can also show a current time indicator if you set {@link #config-showCurrentTimeLine} to true. To style
 * the rendered elements, use the {@link Scheduler.model.TimeSpan#field-cls cls} field of the `TimeSpan` class.
 *
 * Each time range is represented by an instances of {@link Scheduler.model.TimeSpan}, held in a simple {@link Core.data.Store}.
 * The feature uses {@link Scheduler/model/ProjectModel#property-timeRangeStore} defined on the project.
 * The store/persisting loading is handled by Crud Manager (if it's used by the component).
 *
 * This feature is **off** by default. For info on enabling it, see {@link Grid.view.mixin.GridFeatures}.
 *
 * @extends Scheduler/feature/AbstractTimeRanges
 * @classtype timeRanges
 * @feature
 * @demo Scheduler/timeranges
 * @inlineexample Scheduler/feature/TimeRanges.js
 */
export default class TimeRanges extends AbstractTimeRanges {
    //region Config

    static get $name() {
        return 'TimeRanges';
    }

    static get defaultConfig() {
        return {
            /**
             * Store that holds timeRanges (using the {@link Scheduler.model.TimeSpan} model or subclass thereof).
             * A store will be automatically created if none is specified
             * @config {Object|Core.data.Store}
             * @deprecated 4.0 Define `timeRangeStore` on Scheduler or its project
             */
            store : {
                modelClass : TimeSpan,
                storeId    : 'timeRanges'
            },

            /**
             * The interval (as amount of ms) defining how frequently the current timeline will be updated
             * @config {Number}
             * @default
             */
            currentTimeLineUpdateInterval : 10000,

            /**
             * The date format to show in the header for the current time line, see {@link #config-showCurrentTimeLine}
             * @config {String}
             * @default
             */
            currentDateFormat : 'HH:mm',

            /**
             * Range definitions (data to {@link Scheduler.model.TimeSpan} models). Will be added to store.
             * @config {Scheduler.model.TimeSpan[]|Object[]}
             * @deprecated 4.0 Define `timeRanges` on Scheduler or `timeRangesData` on its project
             */
            timeRanges : null,

            /**
             * Show a line indicating current time. Either `true` or `false` or a {@link Scheduler.model.TimeSpan} configuration object to apply to this
             * special time range (allowing you to provide a custom text):
             *
             * ```javascript
             * showCurrentTimeLine : {
             *     name : 'Now'
             * }
             * ```
             *
             * @config {Boolean|Object}
             * @default
             */
            showCurrentTimeLine : false
        };
    }

    //endregion

    //region Init & destroy

    construct(client, config) {
        const me = this;

        super.construct(client, config);

        if (!client._timeRangesExposed) {
            // expose getter/setter for timeRanges on scheduler/gantt
            Object.defineProperty(client, 'timeRanges', {
                get : () => me.timeRanges,
                set : timeRanges => me.store.data = timeRanges
            });
            client._timeRangesExposed = true;
        }

        // Pull in the timeRanges config before the store config if it exists.
        me.getConfig('timeRanges');
    }

    startConfigure(config) {
        const
            { client } = this;

        // If the client's project has a timeRangeStore, we must use that
        // unless we've configured feature with a store (e.g. with recurrence mixin)
        if (client.project && !this.initialConfig.store) {
            const store = client.project.timeRangeStore;

            if (store) {
                const data = ObjectHelper.getPath(config, 'store.data');

                if (data) {
                    store.data = data;
                }

                config.store = store;
            }
        }
    }

    set timeRanges(timeRanges) {
        const store = this.getConfig('store');

        if (store) {
            store.data = timeRanges;
        }
        else {
            this._timeRanges = timeRanges;
        }
    }

    /**
     * Returns the TimeRanges which occur within the client Scheduler's time axis.
     * @property {Scheduler.model.TimeSpan[]}
     */
    get timeRanges() {
        const
            { store }   = this,
            { records } = store;

        if (store.recurringEvents) {
            const
                result = [],
                {
                    startDate,
                    endDate
                } = this.client.timeAxis;

            // Collect occurrences for the recurring events in the record set
            records.forEach(timeSpan => {
                if (timeSpan.isRecurring) {
                    result.push.apply(result, timeSpan.getOccurrencesForDateRange(startDate, endDate));
                }
                else {
                    result.push(timeSpan);
                }
            });

            return result;
        }

        return records;
    }
    //endregion

    //region Current time line

    initCurrentTimeLine() {
        const
            me  = this;

        if (me.currentTimeLine || !me.showCurrentTimeLine) {
            return;
        }

        const data = typeof me.showCurrentTimeLine === 'object' ? me.showCurrentTimeLine : {};

        me.currentTimeLine = me.store.modelClass.new({
            // eslint-disable-next-line quote-props
            'id' : 'currentTime',
            cls  : 'b-sch-current-time'
        }, data);

        me.updateCurrentTimeLine = me.updateCurrentTimeLine.bind(me);

        me.currentTimeInterval = me.setInterval(me.updateCurrentTimeLine, me.currentTimeLineUpdateInterval);
        me.updateCurrentTimeLine();

        if (me.client.isPainted) {
            me.renderRanges();
        }
    }

    updateCurrentTimeLine() {
        const
            me                = this,
            currentTimeRecord = me.currentTimeLine;

        currentTimeRecord.startDate = new Date();

        if (!currentTimeRecord.originalData.name) {
            me.currentTimeLine.name = DateHelper.format(me.currentTimeLine.startDate, me.currentDateFormat);
        }

        me.onStoreChanged({ action : 'update', record : me.currentTimeLine, changes : {} });
    }

    hideCurrentTimeLine() {
        const me = this;

        if (!me.currentTimeLine) {
            return;
        }

        me.clearInterval(me.currentTimeInterval);
        me.currentTimeLine = null;

        if (me.client.isPainted) {
            me.renderRanges();
        }
    }

    renderRanges() {
        const me = this;

        super.renderRanges();

        if (me.showCurrentTimeLine && !me.disabled) {
            me.renderRange(me.currentTimeLine, true);
        }
    }

    /**
     * Get/set the current time line display state
     * @property {Boolean}
     */
    get showCurrentTimeLine() {
        return this._showCurrentTimeLine;
    }

    set showCurrentTimeLine(show) {
        this._showCurrentTimeLine = show;

        if (show) {
            this.initCurrentTimeLine();
        }
        else {
            this.hideCurrentTimeLine();
        }
    }

    //endregion

    //region Menu items

    // TODO: 'headerContextMenu' is deprecated. Please see https://bryntum.com/docs/scheduler/#Scheduler/guides/upgrades/4.0.0.md for more information.
    /**
     * Adds a menu item to show/hide current time line.
     * @param {Object} options Contains menu items and extra data retrieved from the menu target.
     * @param {Grid.column.Column} options.column Column for which the menu will be shown
     * @param {Object} options.items A named object to describe menu items
     * @deprecated 4.0.0 Use `populateTimeAxisHeaderMenu` instead
     */
    populateHeaderMenu({ column, items }) {
        if (column.type !== 'timeAxis') {
            return;
        }

        this.populateTimeAxisHeaderMenu(...arguments);
    }

    /**
     * Adds a menu item to show/hide current time line.
     * @param {Object} options Contains menu items and extra data retrieved from the menu target.
     * @param {Grid.column.Column} options.column Column for which the menu will be shown
     * @param {Object} options.items A named object to describe menu items
     * @internal
     */
    populateTimeAxisHeaderMenu({ column, items }) {
        const me = this;

        items.currentTimeLine = {
            weight   : 400,
            text     : me.L('L{showCurrentTimeLine}'),
            checked  : me.showCurrentTimeLine,
            onToggle : ({ checked }) => {
                me.showCurrentTimeLine = checked;
            }
        };
    }

    //endregion

    //region Disable

    /**
     * Get/set the features disabled state
     * @property {Boolean}
     */
    get disabled() {
        return this._disabled;
    }

    set disabled(disabled) {
        this._disabled = disabled;

        if (this.client.isPainted) {
            this.renderRanges();
        }
    }

    /**
     * Returns the {@link Core.data.Store store} used by this feature
     * @property {Core.data.Store}
     */
    get store() {
        return this._store;
    }

    set store(store) {
        const
            me     = this,
            client = me.client;

        if (!store.storeId) {
            store.storeId = 'timeRanges';
        }

        super.store = store;

        // timeRanges can be set on scheduler/gantt or feature, for convenience. Should only be processed by the TimeRanges
        // and not any subclasses
        if (client.timeRanges && !client._timeRangesExposed) {
            me._store.add(client.timeRanges);
            delete client.timeRanges;
        }

        if (me.timeRanges) {
            me._store.add(me.timeRanges);
            delete me.timeRanges;
        }
    }

    //endregion
}

GridFeatureManager.registerFeature(TimeRanges, false, ['Scheduler', 'Gantt']);
