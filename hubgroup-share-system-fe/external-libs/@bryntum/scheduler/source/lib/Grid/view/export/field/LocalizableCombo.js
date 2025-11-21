import LocalizableComboItems from '../../../../Core/widget/mixin/LocalizableComboItems.js';
import Combo from '../../../../Core/widget/Combo.js';

export default class LocalizableCombo extends LocalizableComboItems(Combo) {
    static get $name() {
        return 'LocalizableCombo';
    }

    // Factoryable type name
    static get type() {
        return 'localizablecombo';
    }
}

// Register this widget type with its Factory
LocalizableCombo.initClass();
