import { Orientation } from '../../../feature/export/Utils.js';
import LocalizableCombo from './LocalizableCombo.js';

export default class ExportOrientationCombo extends LocalizableCombo {

    //region Config

    static get $name() {
        return 'ExportOrientationCombo';
    }

    // Factoryable type name
    static get type() {
        return 'exportorientationcombo';
    }

    static get defaultConfig() {
        return {
            editable : false
        };
    }

    //endregion

    buildLocalizedItems() {
        const me = this;

        return [
            { id : Orientation.portrait, text : me.L('L{portrait}') },
            { id : Orientation.landscape, text : me.L('L{landscape}') }
        ];
    }
}

// Register this widget type with its Factory
ExportOrientationCombo.initClass();
