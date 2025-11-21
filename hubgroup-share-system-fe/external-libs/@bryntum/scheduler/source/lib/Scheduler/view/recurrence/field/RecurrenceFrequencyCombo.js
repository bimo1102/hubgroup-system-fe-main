import Combo from '../../../../Core/widget/Combo.js';
import LocalizableComboItems from '../../../../Core/widget/mixin/LocalizableComboItems.js';

/**
 * @module Scheduler/view/recurrence/field/RecurrenceFrequencyCombo
 */

/**
 * A combobox field allowing to pick frequency in the {@link Scheduler.view.recurrence.RecurrenceEditor recurrence dialog}.
 *
 * @extends Core/widget/Combo
 * @classType recurrencefrequencycombo
 */
export default class RecurrenceFrequencyCombo extends LocalizableComboItems(Combo) {

    static get $name() {
        return 'RecurrenceFrequencyCombo';
    }

    // Factoryable type name
    static get type() {
        return 'recurrencefrequencycombo';
    }

    static get defaultConfig() {
        return {
            editable     : false,
            displayField : 'text',
            valueField   : 'value'
        };
    }

    buildLocalizedItems() {
        return [
            { value : 'DAILY',   text : this.L('L{Daily}') },
            { value : 'WEEKLY',  text : this.L('L{Weekly}') },
            { value : 'MONTHLY', text : this.L('L{Monthly}') },
            { value : 'YEARLY',  text : this.L('L{Yearly}') }
        ];
    }
};

// Register this widget type with its Factory
RecurrenceFrequencyCombo.initClass();
