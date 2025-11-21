import Button from '../../../Core/widget/Button.js';
import RecurrenceLegend from '../../data/util/recurrence/RecurrenceLegend.js';

/**
 * @module Scheduler/view/recurrence/RecurrenceLegendButton
 */

/**
 * Class implementing a button which text displays the associated recurrence info in a human readable form.
 * @extends Core/widget/Button
 * @classType recurrencelegendbutton
 */
export default class RecurrenceLegendButton extends Button {

    static get $name() {
        return 'RecurrenceLegendButton';
    }

    // Factoryable type name
    static get type() {
        return 'recurrencelegendbutton';
    }

    static get defaultConfig() {
        return {
            localizableProperties : [],
            recurrence            : null
        };
    }

    /**
     * Sets / gets the recurrence to display description for.
     * @property {Scheduler.model.RecurrenceModel}
     */
    set recurrence(recurrence) {
        this._recurrence = recurrence;
        this.updateLegend();
    }

    get recurrence() {
        return this._recurrence;
    }

    set eventStartDate(eventStartDate) {
        this._eventStartDate = eventStartDate;
        this.updateLegend();
    }

    get eventStartDate() {
        return this._eventStartDate;
    }

    updateLegend() {
        const
            me             = this,
            { recurrence } = me;

        me.text = recurrence ? RecurrenceLegend.getLegend(recurrence, me.eventStartDate) : '';
    }

    onLocaleChange() {
        // on locale switch we update the button text to use proper language
        this.updateLegend();
    }

    updateLocalization() {
        this.onLocaleChange();
        super.updateLocalization();
    }
}

// Register this widget type with its Factory
RecurrenceLegendButton.initClass();
