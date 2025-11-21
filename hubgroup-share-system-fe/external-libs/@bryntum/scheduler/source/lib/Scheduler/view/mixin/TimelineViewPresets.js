import Base from '../../../Core/Base.js';
import PresetManager from '../../preset/PresetManager.js';
import ViewPreset from '../../preset/ViewPreset.js';
import ObjectHelper from '../../../Core/helper/ObjectHelper.js';
import PresetStore from '../../preset/PresetStore.js';

/**
 * @module Scheduler/view/mixin/TimelineViewPresets
 */

const
    datesDiffer = (d1 = 0, d2 = 0) => d2 - d1;

/**
 * View preset handling.
 *
 * A Scheduler's {@link #config-presets} are loaded with a default set of {@link Scheduler.preset.ViewPreset ViewPresets}
 * which are defined by the system in the {@link Scheduler.preset.PresetManager PresetManager}.
 *
 * The zooming feature works by reconfiguring the Scheduler with a new {@link Scheduler.preset.ViewPreset ViewPreset} selected
 * from the {@link #config-presets} store.
 *
 * {@link Scheduler.preset.ViewPreset ViewPresets} can be added and removed from the store to change the amount of available steps.
 * Range of zooming in/out can be also modified with {@link Scheduler.view.mixin.TimelineZoomable#config-maxZoomLevel} / {@link Scheduler.view.mixin.TimelineZoomable#config-minZoomLevel} properties.
 *
 * This mixin adds additional methods to the column : {@link Scheduler.view.mixin.TimelineZoomable#property-maxZoomLevel}, {@link Scheduler.view.mixin.TimelineZoomable#property-minZoomLevel}, {@link Scheduler.view.mixin.TimelineZoomable#function-zoomToLevel}, {@link Scheduler.view.mixin.TimelineZoomable#function-zoomIn},
 * {@link Scheduler.view.mixin.TimelineZoomable#function-zoomOut}, {@link Scheduler.view.mixin.TimelineZoomable#function-zoomInFull}, {@link Scheduler.view.mixin.TimelineZoomable#function-zoomOutFull}.
 *
 * **Notice**: Zooming is not supported when `forceFit` option is set to true for the Scheduler or for filtered timeaxis.
 *
 * @mixin
 */
export default Target => class TimelineViewPresets extends (Target || Base) {
    static get $name() {
        return 'TimelineViewPresets';
    }

    //region Default config

    static get configurable() {
        return {
            /**
             * A string key used to lookup a predefined {@link Scheduler.preset.ViewPreset} (e.g. 'weekAndDay', 'hourAndDay'),
             * managed by {@link Scheduler.preset.PresetManager}. See {@link Scheduler.preset.PresetManager} for more information.
             * Or a config object for a viewPreset.
             *
             * Options:
             * - 'secondAndMinute'
             * - 'minuteAndHour'
             * - 'hourAndDay'
             * - 'dayAndWeek'
             * - 'weekAndDay'
             * - 'weekAndMonth',
             * - 'monthAndYear'
             * - 'year'
             * - 'manyYears'
             * - 'weekAndDayLetter'
             * - 'weekDateAndMonth'
             * - 'day'
             * - 'week'
             *
             * If passed as a config object, the settings from the viewPreset with the provided `base` property will be used along
             * with any overridden values in your object.
             *
             * To override:
             * ```javascript
             * viewPreset : {
             *   base    : 'hourAndDay',
             *   id      : 'myHourAndDayPreset',
             *   headers : [
             *       {
             *           unit      : "hour",
             *           increment : 12,
             *           renderer  : (startDate, endDate, headerConfig, cellIdx) => {
             *               return "";
             *           }
             *       }
             *   ]
             * }
             * ```
             * or set a new valid preset config if the preset is not registered in the {@link Scheduler.preset.PresetManager}.
             *
             * When you use scheduler in weekview mode, this config is used to pick view preset. If passed view preset is not
             * supported by weekview (only 2 supported by default - 'day' and 'week') default preset will be used - 'week'.
             * @config {String|Object}
             * @default
             * @category Common
             */
            viewPreset : 'weekAndDayLetter'
        };
    }

    static get defaultConfig() {
        return {
            /**
             * Defines how dates will be formatted in tooltips etc. This config has priority over similar config on the
             * view preset. For allowed values see {@link Core.helper.DateHelper#function-format-static}.
             * @config {String}
             * @category Scheduled events
             */
            displayDateFormat : null,

            /**
             * An array of {@link Scheduler.preset.ViewPreset ViewPreset} config objects
             * which describes the available timeline layouts for this scheduler.
             *
             * By default, a predefined set is loaded from the {@link Scheduler.preset.PresetManager PresetManager}.
             *
             * A {@link Scheduler.preset.ViewPreset ViewPreset} describes the granularity of the
             * timeline view and the layout and subdivisions of the timeline header.
             * @config {Object[]} presets
             *
             * @category Common
             */
            presets : true
        };
    }

    //endregion

    /**
     * Get/set the current view preset
     * @member {Scheduler.preset.ViewPreset|String} viewPreset
     * @param [viewPreset.options]
     * @param {Date} [viewPreset.options.startDate] A new start date for the time axis
     * @param {Date} [viewPreset.options.endDate] A new end date for the time axis
     * @param {Date} [viewPreset.options.centerDate] Where to center the new time axis
     * @category Common
    */

    //region Get/set

    /**
     * Get the {@link Scheduler.preset.PresetStore PresetStore} created for the Scheduler,
     * or set an array of {@link Scheduler.preset.ViewPreset ViewPreset} config objects.
     * @property {Scheduler.preset.PresetStore|Object[]}
     * @category Common
     */
    set presets(presets) {
        if (presets === true) {
            presets = PresetManager.allRecords;
        }

        this._presets = new PresetStore({
            owner : this,
            data  : presets
        });
    }

    get presets() {
        return this._presets;
    }

    normalizePreset(preset) {
        const
            me          = this,
            input       = preset,
            { presets } = me;

        // They may have passed a string id, an number index, or ViewPreset config object.
        if (!(preset instanceof ViewPreset)) {
            // A config of a preset, instantiate it based upon any base that may be requested.
            // This may be one that's supplied by Bryntum in the PresetManager, or one that has been
            // previously added to this Scheduler's preset store.
            if (typeof preset === 'object') {
                // Look up any existing ViewPreset that it is based upon.
                if (preset.base) {
                    // Look locally first, then in the PresetManager
                    const base = presets.getById(preset.base) || PresetManager.getById(preset.base);

                    if (!base) {
                        throw new Error(`ViewPreset base '${preset.base}' does not exist`);
                    }
                    // The config is based upon the base's data with the new Preset type's normalized data object merged in.
                    // MUST run the incoming data block through the constructor in order to apply the backward compatibility
                    // processing to the data block to be merged with the base.
                    preset = ObjectHelper.merge(ObjectHelper.clone(base.data), PresetManager.createRecord(preset).data);
                }

                // Ensure the new ViewPreset has a legible, logical id which does not already
                // exist in our store.
                if (preset.id) {
                    preset = presets.createRecord(preset);
                }
                else {
                    preset = presets.createRecord(ObjectHelper.assign({}, preset));
                    preset.id = preset.generateId(presets);
                }
            }
            // Must be an index or id
            else {
                if (typeof preset === 'number') {
                    preset = presets.getAt(preset);
                }
                else {
                    preset = presets.getById(preset) || PresetManager.getById(preset);
                }
            }

            if (!preset) {
                const validPresets = presets.map(preset => preset.id);
                throw new Error(`Invalid ViewPreset: ${input}. Valid strings are ${validPresets.join(', ')}`);
            }
        }

        // An instance.
        // If an existing id is used, this will replace it.
        return presets.add(preset)[0];
    }

    changeViewPreset(viewPreset, oldViewPreset) {
        const me = this;

        // Throw on use of expired deprecated usage.
        if (!(viewPreset instanceof ViewPreset) && viewPreset.name && !viewPreset.base) {
            throw new Error('ViewPreset name config replaced by base config. See https://www.bryntum.com/docs/scheduler/#guides/upgrades/3.0.0.md');
        }

        viewPreset = me.normalizePreset(viewPreset);

        const
            lastOpts = me.lastViewPresetOptions || {},
            options  = viewPreset.options || (viewPreset.options = {}),
            event    = options.event = {
                startDate : options.startDate,
                endDate   : options.endDate,
                from      : oldViewPreset,
                to        : viewPreset,
                preset    : viewPreset
            },
            presetChanged  = !me._viewPreset || !me._viewPreset.equals(viewPreset),
            optionsChanged = datesDiffer(options.startDate, lastOpts.startDate) ||
                datesDiffer(options.endDate, lastOpts.endDate) ||
                datesDiffer(options.centerDate, lastOpts.centerDate) ||
                (options.startDate && datesDiffer(options.startDate, me.startDate)) ||
                (options.endDate && datesDiffer(options.endDate, me.endDate));

        // Only return the value for onward processing if there's a change
        if (presetChanged || optionsChanged) {

            // Bypass the no-change check if the viewPreset is the same and we only got in here
            // because different options were asked for.
            if (!presetChanged) {
                me._viewPreset = null;
            }

            /**
             * Fired before the {@link #config-viewPreset} is changed.
             * @event beforePresetChange
             * @param {Scheduler.view.Scheduler} source This Scheduler instance.
             * @param {Date} startDate The new start date of the timeline.
             * @param {Date} endDate The new end date of the timeline.
             * @param {Scheduler.preset.ViewPreset} from The outgoing ViewPreset.
             * @param {Scheduler.preset.ViewPreset} to The ViewPreset being switched to.
             * @preventable
             */
            // Do not trigger events for the initial preset
            if (me.isConfiguring || me.trigger('beforePresetChange', event) !== false) {
                return viewPreset;
            }
        }
    }

    updateViewPreset(preset) {
        const
            me          = this,
            { options } = preset,
            {
                event,
                startDate,
                endDate
            }           = options,
            {
                isHorizontal,
                _timeAxis : timeAxis    // Do not tickle the getter, we are just peeking to see if it's there yet.
            } = me;

        let { centerDate } = options;

        // Raise flag to prevent partner from changing view preset if one is in progress
        me._viewPresetChanging = true;

        // prefer to use displayDateFormat configured on the panel
        me.displayDateFormat = me.config.displayDateFormat || preset.displayDateFormat;

        if (timeAxis && !me.isConfiguring) {
            // Cache options only when they are applied so that non-change vetoing in changeViewPreset is accurate
            me.lastViewPresetOptions = options;

            // Timeaxis may already be configured (in case of sharing with the timeline partner), no need to reconfigure it
            if (timeAxis.isConfigured) {
                // None of this reconfiguring should cause a refresh
                me.suspendRefresh();

                const timeAxisCfg = {
                    weekStartDay : me.weekStartDay,
                    startTime    : me.startTime,
                    endTime      : me.endTime
                };

                // if startDate is provided we use it and the provided endDate
                if (startDate) {
                    timeAxisCfg.startDate = startDate;
                    timeAxisCfg.endDate = endDate;

                    // if both dates are provided we can calculate centerDate for the viewport
                    if (!centerDate && endDate) {
                        // TODO: PORT infiniteScroll stuff
                        // if (me.infiniteScroll && view.cachedScrollDate && view.cachedScrollDateIsCentered) {
                        //     centerDate = view.cachedScrollDate;
                        // } else {
                        centerDate = new Date((startDate.getTime() + endDate.getTime()) / 2);
                        //}
                    }

                    // when no start/end dates are provided we use the current timespan
                }
                else {
                    timeAxisCfg.startDate = timeAxis.startDate;
                    timeAxisCfg.endDate = endDate || timeAxis.endDate;

                    if (!centerDate) {
                        // TODO: PORT infiniteScroll stuff
                        // if (me.infiniteScroll && view.cachedScrollDate && view.cachedScrollDateIsCentered) {
                        //     centerDate = view.cachedScrollDate;
                        // } else {
                        centerDate = me.viewportCenterDate;
                    }
                }

                timeAxis.isConfigured = false;
                timeAxis.viewPreset = preset;
                timeAxis.reconfigure(timeAxisCfg, true);

                me.timeAxisViewModel.reconfigure({
                    viewPreset : me.viewPreset,
                    headers    : preset.headers,

                    // This was hardcoded to 'middle' prior to the Preset refactor.
                    // In the old code, the default headers were 'top' and 'middle', which
                    // meant that 'middle' meant the lowest header.
                    // So this is now length - 1.
                    columnLinesFor : preset.columnLinesFor != null ? preset.columnLinesFor : preset.headers.length - 1,

                    // TODO: PORT rowHeightHorizontal??
                    // rowHeightHorizontal : me.readRowHeightFromPreset ? preset.rowHeight : me.rowHeight,
                    tickSize : isHorizontal ? preset.tickWidth : preset.tickHeight || preset.tickWidth || 60
                });

                // Allow refresh to run after the reconfiguring
                me.resumeRefresh();
            }

            me.refresh();

            // if view is rendered and scroll is not disabled by "notScroll" option
            if (!options.notScroll && me.isPainted) {
                // and we have centerDate to scroll to
                if (centerDate) {
                    // remember the central date we scroll to (it gets reset after user scroll)
                    me.cachedCenterDate = centerDate;

                    // setViewPreset method on a partner panels should be executed with same arguments.
                    // if one partner was provided with a centerDate, other one has to be too to generate exact
                    // header and set same scroll
                    event.centerDate = centerDate;

                    const
                        viewportSize = me.isHorizontal ? me.timeAxisSubGrid.width : me.scrollable.clientHeight,
                        coord    = Math.max(me.getCoordinateFromDate(centerDate, true) - viewportSize / 2, 0);

                    me.viewPresetActiveScroll = me.isHorizontal ? { left : coord } : { top : coord };

                    // The horizontal scroll handler must not invalidate the cached center
                    // when this scroll event rolls round on the next frame.
                    me.scrollingToCenter = true;

                    if (me.isHorizontal) {
                        me.scrollHorizontallyTo(coord, false);
                    }
                    else {
                        me.scrollVerticallyTo(coord, false);
                    }

                    // Release the lock on scrolling invalidating the cached center.
                    me.setTimeout(() => {
                        me.scrollingToCenter = false;
                    }, 100);
                }
                else {
                    // if we don't have a center date to scroll to, we reset scroll (this is bw compatible behavior)
                    if (me.isHorizontal) {
                        me.scrollHorizontallyTo(0, false);
                    }
                    else {
                        me.scrollVerticallyTo(0, false);
                    }
                }
            }
        }

        // Update Scheduler element showing what preset is applied
        me.dataset.presetId = preset.id;

        /**
         * Fired after the {@link #config-viewPreset} has changed.
         * @event presetChange
         * @param {Scheduler.view.Scheduler} source This Scheduler instance.
         * @param {Date} startDate The new start date of the timeline.
         * @param {Date} centerDate The new center date of the timeline.
         * @param {Date} endDate The new end date of the timeline.
         * @param {Scheduler.preset.ViewPreset} from The outgoing ViewPreset.
         * @param {Scheduler.preset.ViewPreset} to The ViewPreset being switched to.
         * @preventable
         */
        me.trigger('presetChange', event);

        me._viewPresetChanging = false;
    }

    //endregion

    doDestroy() {
        if (this._presets.owner === this) {
            this._presets.destroy();
        }
        super.doDestroy();
    }

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement thus.
    get widgetClass() {}
};
