import Base from '../../../Core/Base.js';
// TODO: prevent multiple rerenders

/**
 * @module Grid/view/mixin/GridState
 */
const
    suspendStoreEvents = subGrid => subGrid.columns.suspendEvents(),
    resumeStoreEvents = subGrid => subGrid.columns.resumeEvents(),
    fillSubGridColumns = subGrid => {
        subGrid.columns.clearCaches();
        subGrid.columns.fillFromMaster();
    },
    compareStateSortIndex = (a, b) => a.stateSortIndex - b.stateSortIndex;

/**
 * Mixin for Grid that handles state. It serializes the following grid properties:
 *
 * * rowHeight
 * * readOnly
 * * selectedCell
 * * selectedRecords
 * * columns (order, widths, visibility)
 * * store (sorters, groupers, filters)
 * * scroll position
 *
 * See {@link Core.mixin.State} for more information on state.
 *
 * @demo Grid/state
 * @inlineexample Grid/view/mixin/GridState.js
 * @mixin
 */
export default Target => class GridState extends (Target || Base) {
    static get $name() {
        return 'GridState';
    }

    /**
     * Gets or sets grid's state. Check out {@link Grid.view.mixin.GridState GridState} mixin for details.
     * @member {Object} state
     */

    /**
     * Get grid's current state for serialization. State includes rowHeight, headerHeight, readOnly, selectedCell,
     * selectedRecordId, column states and store state etc.
     * @returns {Object} State object to be serialized
     * @private
     */
    getState() {
        const
            me    = this,
            style = me.element.style.cssText,
            state = {
                rowHeight : me.rowHeight,
                readOnly  : me.readOnly
            };

        if (style) {
            state.style = style;
        }

        if (me.selectedCell) {
            // TODO: Create wrapper class to avoid JSON.stringify recursion in state.selectedCell.
            const { id, columnId } = me.selectedCell;
            state.selectedCell = { id, columnId };
        }

        state.selectedRecords = me.selectedRecords.map(entry => entry.id);
        state.columns = me.columns.map(column => column.getState());
        state.store = me.store.state;
        state.scroll = me.storeScroll();

        state.subGrids = {};

        me.eachSubGrid(subGrid => {
            const config = state.subGrids[subGrid.region] = state.subGrids[subGrid.region] || {};

            if (subGrid.flex == null) {
                config.width = subGrid.width;
            }

            config.collapsed = subGrid.collapsed ?? false;

            // Part of a collapsed SubGrid's state is the state to restore to when expanding again.
            if (config.collapsed) {
                config._beforeCollapseState = subGrid._beforeCollapseState;
            }
        });

        return state;
    }

    /**
     * Apply previously stored state.
     * @param {Object} state
     * @private
     */
    applyState(state) {
        const me = this;

        // Do this first since it might perform full rendering of contents, recreating filterbar header fields
        if ('columns' in state) {
            let columnsChanged = false,
                needSort = false;

            // We're going to renderContents anyway, so stop the ColumnStores from updating the UI
            me.columns.suspendEvents();
            me.eachSubGrid(suspendStoreEvents);

            // each column triggers rerender at least once...
            state.columns.forEach((columnState, index) => {
                const column = me.columns.getById(columnState.id);

                if (column) {
                    const columnGeneration = column.generation;

                    column.applyState(columnState);
                    columnsChanged = columnsChanged || (column.generation !== columnGeneration);

                    // In case a sort is needed, stamp in the ordinal position.
                    column.stateSortIndex = index;

                    // If we find one out of order, only then do we need to sort
                    if (column.allIndex !== index) {
                        needSort = columnsChanged = true;
                    }
                }
            });

            if (columnsChanged) {
                me.eachSubGrid(fillSubGridColumns);
            }
            if (needSort) {
                me.eachSubGrid(subGrid => {
                    subGrid.columns.records.sort(compareStateSortIndex);
                    subGrid.columns.allRecords.sort(compareStateSortIndex);
                });
                me.columns.sort({
                    fn        : compareStateSortIndex,
                    // always sort ascending
                    ascending : true
                });
            }

            // If we have been painted, and column restoration changed the column layout, refresh contents
            if (me.isPainted && columnsChanged) {
                me.renderContents();
            }

            // Allow ColumnStores to update the UI again
            me.columns.resumeEvents();
            me.eachSubGrid(resumeStoreEvents);
        }

        if ('subGrids' in state) {
            me.eachSubGrid(subGrid => {
                if (subGrid.region in state.subGrids) {
                    const subGridState = state.subGrids[subGrid.region];

                    if ('width' in subGridState) {
                        subGrid.width = subGridState.width;
                    }

                    if ('collapsed' in subGridState) {
                        subGrid.collapsed = subGridState.collapsed;
                        subGrid._beforeCollapseState = subGridState._beforeCollapseState;
                    }
                }
            });
        }

        if ('readOnly' in state) {
            me.readOnly = state.readOnly;
        }

        if ('rowHeight' in state) {
            me.rowHeight = state.rowHeight;
        }

        if ('style' in state) {
            me.style = state.style;
        }

        if ('selectedCell' in state) {
            me.selectedCell = state.selectedCell;
        }

        if ('store' in state) {
            me.store.state = state.store;
        }

        if ('selectedRecords' in state) {
            me.selectedRecords = state.selectedRecords;
        }

        if ('scroll' in state) {
            me.restoreScroll(state.scroll);
        }
    }

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement thus.
    get widgetClass() {
    }
};
