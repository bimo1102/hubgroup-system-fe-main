import TimeAxisBase from './TimeAxisBase.js';

/**
 * @module Scheduler/view/HorizontalTimeAxis
 */

/**
 * A visual horizontal representation of the time axis described in the
 * {@link Scheduler.preset.ViewPreset#field-headers headers}.
 * Normally you should not interact with this class directly.
 *
 * @extends Scheduler/view/TimeAxisBase
 * @private
 */
export default class HorizontalTimeAxis extends TimeAxisBase {

    //region Config

    static get $name() {
        return 'HorizontalTimeAxis';
    }

    static get type() {
        return 'horizontaltimeaxis';
    }

    static get configurable() {
        return {
            model        : null,
            sizeProperty : 'width',

            positionProperty : 'left'
        };
    }

    //endregion

    get width() {
        return this.size;
    }

    onModelUpdate() {
        // Force rebuild when availableSpace has changed, to recalculate width and maybe apply compact styling
        if (this.model.availableSpace !== this.width) {
            this.refresh(true);
        }
    }

    updateModel(timeAxisViewModel) {
        this.detachListeners('tavm');

        timeAxisViewModel?.on({
            name    : 'tavm',
            update  : 'onModelUpdate',
            thisObj : this
        });
    }
}
