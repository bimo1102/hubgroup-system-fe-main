import Base from '../../../Core/Base.js';
import ObjectHelper from '../../../Core/helper/ObjectHelper.js';

/**
 * @module Scheduler/view/mixin/SchedulerState
 */

const copyProperties = [
    'eventLayout',
    'barMargin',
    'mode',
    'eventColor',
    'eventStyle',
    'tickSize',
    'fillTicks'
];

/**
 * Mixin for Scheduler that handles state. It serializes the following scheduler properties:
 *
 * * eventLayout
 * * barMargin
 * * mode
 * * tickSize
 * * zoomLevel
 * * eventColor
 * * eventStyle
 *
 * See {@link Grid.view.mixin.GridState} and {@link Core.mixin.State} for more information on state.
 *
 * @mixin
 */
export default Target => class SchedulerState extends (Target || Base) {
    static get $name() {
        return 'SchedulerState';
    }

    /**
     * Gets or sets scheduler's state. Check out {@link Scheduler.view.mixin.SchedulerState SchedulerState} mixin for details.
     * @member {Object} state
     */

    /**
     * Get scheduler's current state for serialization. State includes rowHeight, headerHeight, readOnly, selectedCell,
     * selectedRecordId, column states and store state etc.
     * @returns {Object} State object to be serialized
     * @private
     */
    getState() {
        const
            me    = this,
            state = ObjectHelper.copyProperties(super.getState(), me, copyProperties);

        state.zoomLevel = me.zoomLevel;

        state.zoomLevelOptions = {
            startDate          : me.startDate,
            endDate            : me.endDate,
            viewportCenterDate : me.viewportCenterDate,
            width              : me.tickSize
        };

        return state;
    }

    /**
     * Apply previously stored state.
     * @param {Object} state
     * @private
     */
    applyState(state) {
        this.suspendRefresh();

        if (state.zoomLevel) {
            this.zoomToLevel(state.zoomLevel, state.zoomLevelOptions);
        }

        ObjectHelper.copyProperties(this, state, copyProperties);

        super.applyState(state);

        this.resumeRefresh(true);
    }

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement thus.
    get widgetClass() {}
};
