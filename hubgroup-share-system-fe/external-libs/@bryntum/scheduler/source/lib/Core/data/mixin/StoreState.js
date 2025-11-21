import Base from '../../Base.js';
import ObjectHelper from '../../helper/ObjectHelper.js';

/**
 * @module Core/data/mixin/StoreState
 */

/**
 * Mixin for Store that handles store state.
 *  * sorters
 *  * groupers
 *  * filters
 * @mixin
 */
export default Target => class StoreState extends (Target || Base) {
    static get $name() {
        return 'StoreState';
    }

    /**
     * Get store state. Used by State-plugin to serialize state
     * @private
     * @returns {{ sorters, groupers }}
     */
    getState() {
        const
            { sorters, groupers, filters } = this,
            state                          = {};

        if (sorters?.length) {
            state.sorters = sorters.map(sorter => {
                const clone = ObjectHelper.cleanupProperties(ObjectHelper.clone(sorter));

                // Remove sorting fns
                delete clone.fn;
                delete clone.sortFn;

                return clone;
            });
        }

        if (groupers?.length) {
            state.groupers = groupers.slice();
        }

        if (filters?.values.length) {
            state.filters = filters.values.map(filter => {
                const clone = ObjectHelper.cleanupProperties(ObjectHelper.clone(filter.config));

                // Apply value, needed because of filterable fn reusing instance (so not in config)
                clone.value = filter.value;

                // Remove default value, no need to store that in state
                if (clone.caseSensitive) {
                    delete clone.caseSensitive;
                }

                // Remove filtering fns
                // delete clone.filterBy; // Cannot remove it, required by export feature

                return clone;
            });
        }

        return state;
    }

    /**
     * Apply store state. Used by State-plugin to restore a previously serialized state
     * @private
     * @param {{ sorters, groupers }} state
     */
    applyState(state) {
        const
            me = this,
            {
                sorters  = [],
                groupers = [],
                filters  = []
            }  = state;

        me.sorters = sorters.slice();
        me.groupers = groupers.slice();
        me.sort();

        me.filters = filters.slice();
        me.filter();
    }
};
