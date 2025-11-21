import TextField from '../../Core/widget/TextField.js';

/**
 * @module Core/widget/FilterField
 */

/**
 * A simple text field for filtering a store.
 *
 * Allows filtering by {@link #config-field field}:
 *
 * ```javascript
 * const filterField = new FilterField({
 *    store : eventStore,
 *    field : 'name'
 * });
 * ```
 *
 * Or by using a {@link #config-filterFunction filter function} for greater control/custom logic:
 *
 * ```javascript
 * const filterField = new FilterField({
 *    store          : eventStore,
 *    filterFunction : (record, value) => record.name.includes(value)
 * });
 * ```
 *
 * @extends Core/widget/TextField
 * @classType filterfield
 */
export default class FilterField extends TextField {
    static get $name() {
        return 'FilterField';
    }

    // Factoryable type name
    static get type() {
        return 'filterfield';
    }

    static get configurable() {
        return {
            /**
             * The model field name to filter by. Can optionally be replaced by {@link #config-filterFunction}
             * @config {String}
             * @category Filtering
             */
            field : null,

            /**
             * The store to filter.
             * @config {Core.data.Store}
             * @category Filtering
             */
            store : null,

            /**
             * Optional filter function to be called with record and value as parameters for store filtering.
             * ```javascript
             * {
             *     type           : 'filterfield',
             *     store          : myStore,
             *     filterFunction : (record, value)  => {
             *        return record.text.includes(value);
             *     }
             * }
             * ```
             * @param {Core.data.Model} record Record for comparison
             * @param {String} value Value to compare with
             * @return {Boolean} Return true if record matches comparison requirements
             * @config {Function}
             * @category Filtering
             */
            filterFunction : null,

            clearable : true,

            keyStrokeChangeDelay : 100,

            onChange({ value }) {
                const { store, field, filterFunction } = this;

                if (store) {
                    const filterId = `${field || this.id}-Filter`;

                    if (value.length === 0) {
                        store.removeFilter(filterId);
                    }
                    else {
                        let filterBy;

                        if (filterFunction) {
                            filterBy = record => filterFunction(record, value);
                        }
                        else {
                            // We filter using a RegExp, so quote significant characters
                            value = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

                            filterBy = record => record.get(field).match(new RegExp(value, 'i'));
                        }

                        // A filter with an id replaces any previous filter with that id.
                        // Leave any other filters which may be in use in place.
                        store.filter({
                            id : filterId,
                            filterBy
                        });
                    }
                }
            }
        };
    }

    updateValue(value, old) {
        super.updateValue(value, old);

        // Initial value, apply it
        if (value && this.isConfiguring) {
            this.onChange({ value });
        }
    }
};

FilterField.initClass();
