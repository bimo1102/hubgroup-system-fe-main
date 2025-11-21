import Combo from './Combo.js';
import Store from '../data/Store.js';

/**
 * @module Core/widget/BooleanCombo
 * Boolean combo, a combo box with two options corresponding to true or false.
 *
 * This field can be used as an {@link Grid/column/Column#config-editor} for the {@link Grid/column/Column}.
 *
 * @classType booleancombo
 * @extends Core/widget/Combo
 */
export default class BooleanCombo extends Combo {
    static get $name() {
        return 'BooleanCombo';
    }

    static get type() {
        return 'booleancombo';
    }

    //region Config
    static get configurable() {
        return {
            /**
             * Positive option value
             *
             * @config {*}
             */
            positiveValue : true,

            /**
             * Positive option display value
             *
             * @config {String}
             */
            positiveText : null,

            /**
             * Negative option value
             *
             * @config {*}
             */
            negativeValue : false,

            /**
             * False option display value
             *
             * @config {String}
             */
            negativeText : null,

            store : {
                value : [],

                $config : 'lazy'
            },

            /**
             * Default value
             *
             * @config {*}
             */
            value : false
        };
    }
    //endregion

    changeStore(store, oldStore) {
        const me = this;

        // We must call super.changeStore() in order to deduce valueField. We also cannot just pass an array since it
        // will convert to a store and call back here (infinite recursion).
        return super.changeStore(new Store({
            data : [{
                id   : me.positiveValue,
                text : me.positiveText || me.L('L{Object.Yes}')
            }, {
                id   : me.negativeValue,
                text : me.negativeText || me.L('L{Object.No}')
            }]
        }), oldStore);
    }
}

// Register this widget type with its Factory
BooleanCombo.initClass();
