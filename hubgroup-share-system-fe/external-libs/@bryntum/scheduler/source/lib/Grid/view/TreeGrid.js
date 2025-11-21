import Grid from './Grid.js';

// tree feature will be added by default to TreeGrid, but needs to be imported
import '../feature/Tree.js';
// not used here but enables using `type : tree` in a column config (exactly one required)
import '../column/TreeColumn.js';

/**
 * @module Grid/view/TreeGrid
 */

/**
 * A TreeGrid, a Tree combined with a Grid. Must be configured with exactly one {@link Grid.column.TreeColumn} (`type: tree`), but can also have an
 * arbitrary number of other columns. Most features that can be used with Grid also works with TreeGrid, with the
 * exception of the Group feature.
 * @extends Grid/view/Grid
 *
 * @classtype treegrid
 * @inlineexample Grid/view/TreeGrid.js
 */
export default class TreeGrid extends Grid {

    static get $name() {
        return 'TreeGrid';
    }

    // Factoryable type name
    static get type() {
        return 'treegrid';
    }

    static get configurable() {
        return {
            /**
             * The store instance or config object that holds the records to be displayed by this TreeGrid. If assigning
             * a store instance, it must be configured with `tree: true`.
             *
             * A store will be created if none is specified.
             * @config {Core.data.Store|Object} store
             * @category Common
             */
            store : {
                tree : true
            }
        };
    }

    //region Plugged in functions / inherited configs

    /**
     * Collapse an expanded node or expand a collapsed. Optionally forcing a certain state.
     *
     * @function toggleCollapse
     * @param {String|Number|Core.data.Model} idOrRecord Record (the node itself) or id of a node to toggle
     * @param {Boolean} [collapse] Force collapse (true) or expand (false)
     * @param {Boolean} [skipRefresh] Set to true to not refresh rows (if calling in batch)
     * @returns {Promise}
     * @category Feature shortcuts
     */

    /**
     * Collapse a single node.
     *
     * @function collapse
     * @param {String|Number|Core.data.Model} idOrRecord Record (the node itself) or id of a node to collapse
     * @returns {Promise}
     * @category Feature shortcuts
     */

    /**
     * Expand a single node.
     *
     * @function expand
     * @param {String|Number|Core.data.Model} idOrRecord Record (the node itself) or id of a node to expand
     * @returns {Promise}
     * @category Feature shortcuts
     */

    /**
     * Expands parent nodes to make this node "visible".
     *
     * @function expandTo
     * @param {String|Number|Core.data.Model} idOrRecord Record (the node itself) or id of a node
     * @returns {Promise}
     * @category Feature shortcuts
     */

    //endregion

    /* disconnect doc comment */

    //region Store

    updateStore(store, was) {
        if (store && !store.tree) {
            throw new Error('TreeGrid requires a Store configured with tree : true');
        }

        super.updateStore(store, was);
    }

    //endregion
}

// Register this widget type with its Factory
TreeGrid.initClass();
