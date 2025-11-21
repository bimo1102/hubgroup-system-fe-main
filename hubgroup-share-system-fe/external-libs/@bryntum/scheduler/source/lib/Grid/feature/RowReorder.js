/**
 * @module Grid/feature/RowReorder
 */

import GridFeatureManager from './GridFeatureManager.js';
import DragHelper from '../../Core/helper/DragHelper.js';
import InstancePlugin from '../../Core/mixin/InstancePlugin.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import EventHelper from '../../Core/helper/EventHelper.js';
import Delayable from '../../Core/mixin/Delayable.js';

/**
 * Allows user to reorder rows by dragging them. To get notified about row reorder listen to `change` event
 * on the grid {@link Core.data.Store store}.
 *
 * This feature is **off** by default. For info on enabling it, see {@link Grid.view.mixin.GridFeatures}.
 * This feature is **enabled** by default for Gantt.
 *
 * If the grid is set to {@link Grid.view.Grid#config-readOnly}, reordering is disabled. Inside all event listeners you have access a `context` object which has a `record` property (the dragged record).
 *
 * You can validate the drag drop flow by listening to the `gridrowdrag` event. Inside this listener you have access the `index` property which is the target drop position.
 * For trees you get access to the `parent` record and `index`, where index means the child index inside the parent.
 *
 * You can also have an async finalization step using the {@link #event-gridRowBeforeDropFinalize}, for showing a
 * confirmation dialog or making a network request to decide if drag operation is valid (see code snippet below)
 *
 * ```
 * features : {
 *     rowReorder : {
 *         listeners : {
 *             gridRowDrag : ({ context }) => {
 *                // Here you have access to context.insertBefore, and additionally context.parent for trees
 *             },
 *
 *             gridRowBeforeDropFinalize : async ({ context }) => {
 *                const result = await MessageDialog.confirm({
 *                    title   : 'Please confirm',
 *                    message : 'Did you want the row here?'
 *                });
 *
 *                // true to accept the drop or false to reject
 *                return result === MessageDialog.yesButton;
 *             }
 *         }
 *     }
 * }
 * ```
 *
 * Note, that this feature uses the concept of "insert before" when choosing a drop point in the data.
 *
 * So the dropped record's position is *before the visual next record's position*.
 *
 * This may look like a pointless distinction, but consider the case when a Store is filtered.
 *
 * The record *above* may he several filtered out records below it. When unfiltered, the dropped
 * record will be *below* these because of the "insert before" behaviour.
 *
 * @extends Core/mixin/InstancePlugin
 * @demo Grid/rowreordering
 * @classtype rowReorder
 * @feature
 */
export default class RowReorder extends Delayable(InstancePlugin) {
    //region Events
    /**
     * Fired before dragging starts, return false to prevent the drag operation.
     * @preventable
     * @event gridRowBeforeDragStart
     * @param {Core.helper.DragHelper} source
     * @param {Object} context
     * @param {Core.data.Model} context.record [DEPRECATED] The dragged row record
     * @param {Core.data.Model[]} context.records The dragged row records
     * @param {MouseEvent|TouchEvent} event
     */

    /**
     * Fired when dragging starts.
     * @event gridRowDragStart
     * @param {Core.helper.DragHelper} source
     * @param {Object} context
     * @param {Core.data.Model} context.record [DEPRECATED] The dragged row record
     * @param {Core.data.Model[]} context.records The dragged row records
     * @param {MouseEvent|TouchEvent} event
     */

    /**
     * Fired while the row is being dragged, in the listener function you have access to `context.insertBefore` a grid / tree record, and additionally `context.parent` (a TreeNode) for trees. You can
     * signal that the drop position is valid or invalid by setting `context.valid = false;`
     * @event gridRowDrag
     * @param {Core.helper.DragHelper} source
     * @param {Object} context
     * @param {Boolean} context.valid Set this to true or false to indicate whether the drop position is valid.
     * @param {Core.data.Model} context.insertBefore The record to insert before (`null` if inserting at last position of a parent node)
     * @param {Core.data.Model} context.parent The parent record of the current drop position (only applicable for trees)
     * @param {Core.data.Model} context.record [DEPRECATED] The dragged row record
     * @param {Core.data.Model[]} context.records The dragged row records
     * @param {MouseEvent} event
     */

    /**
     * Fired before the row drop operation is finalized. You can return false to abort the drop operation, or a
     * Promise yielding `true` / `false` which allows for asynchronous abort (e.g. first show user a confirmation dialog).
     * @event gridRowBeforeDropFinalize
     * @preventable
     * @async
     * @param {Core.helper.DragHelper} source
     * @param {Object} context
     * @param {Boolean} context.valid Set this to true or false to indicate whether the drop position is valid
     * @param {Core.data.Model} context.insertBefore The record to insert before (`null` if inserting at last position of a parent node)
     * @param {Core.data.Model} context.parent The parent record of the current drop position (only applicable for trees)
     * @param {Core.data.Model} context.record [DEPRECATED] The dragged row record
     * @param {Core.data.Model[]} context.records The dragged row records
     * @param {MouseEvent} event
     */

    /**
     * Fired after the row drop operation has completed, regardless of validity
     * @event gridRowDrop
     * @param {Core.helper.DragHelper} source
     * @param {Object} context
     * @param {Boolean} context.valid true or false depending on whether the drop position was valid
     * @param {Core.data.Model} context.insertBefore The record to insert before (`null` if inserting at last position of a parent node)
     * @param {Core.data.Model} context.parent The parent record of the current drop position (only applicable for trees)
     * @param {Core.data.Model} context.record [DEPRECATED] The dragged row record
     * @param {Core.data.Model[]} context.records The dragged row records
     * @param {MouseEvent} event
     */

    /**
     * Fired when a row drag operation is aborted
     * @event gridRowAbort
     * @param {Core.helper.DragHelper} source
     * @param {Object} context
     * @param {MouseEvent} event
     */
    //endregion

    //region Init

    static get $name() {
        return 'RowReorder';
    }

    static get defaultConfig() {
        return {
            /**
             * If hovering over a parent node for this period of a time in a tree, the node will expand
             * @config {Number}
             */
            hoverExpandTimeout : 1000
        };
    }

    construct(grid, config) {
        this.grid = grid;

        super.construct(...arguments);
    }

    doDestroy() {
        this.dragHelper?.destroy();

        super.doDestroy();
    }

    /**
     * Initialize drag & drop (called from render)
     * @private
     */
    init() {
        const
            me       = this,
            { grid } = me;

        me.dragHelper = new DragHelper({
            name               : 'rowReorder',
            mode               : 'translateXY',
            cloneTarget        : true,
            dragThreshold      : 10,
            targetSelector     : '.b-grid-row',
            lockX              : true,
            transitionDuration : grid.transitionDuration,
            scrollManager      : grid.scrollManager,
            dragWithin         : grid.element,
            outerElement       : grid.verticalScroller,

            monitoringConfig : {
                scrollables : [
                    {
                        element   : grid.scrollable.element,
                        direction : 'vertical'
                    }
                ]
            },

            // Since parent nodes can expand after hovering, meaning original drag start position now refers to a different point in the tree
            ignoreSamePositionDrop : false,
            createProxy(element) {
                const
                    clone     = element.cloneNode(true),
                    container = document.createElement('div');

                clone.removeAttribute('id');
                // The containing element will be positioned instead
                clone.style.transform = '';

                container.appendChild(clone);

                if (grid.selectedRecords.length > 1) {
                    const clone2 = clone.cloneNode(true);

                    clone2.classList.add('b-row-dragging-multiple');

                    container.appendChild(clone2);
                }

                DomHelper.removeClsGlobally(container, 'b-selected', 'b-hover', 'b-focused');

                return container;
            },

            listeners : {
                beforedragstart : me.onBeforeDragStart,
                dragstart       : me.onDragStart,
                drag            : me.onDrag,
                drop            : me.onDrop,
                reset           : me.onReset,
                prio            : 10000, // To ensure our listener is run before the relayed listeners (for the outside world)
                thisObj         : me
            }
        });

        me.dropIndicator = DomHelper.createElement({
            parent    : grid.bodyContainer,
            className : 'b-row-drop-indicator'
        });

        me.relayEvents(me.dragHelper, ['beforeDragStart', 'dragStart', 'drag', 'abort'], 'gridRow');
    }

    //endregion

    //region Plugin config

    static get pluginConfig() {
        return {
            after : ['onPaint']
        };
    }

    //endregion

    //region Events (drop)

    onBeforeDragStart({ context }) {
        const
            me            = this,
            grid          = me.grid,
            targetSubGrid = grid.regions[0],
            subGridEl     = grid.subGrids[targetSubGrid].element;

        // Only dragging enabled in the leftmost grid section
        if (me.disabled || grid.readOnly || !subGridEl.contains(context.element)) {
            return false;
        }
        const records = context.records = grid.selectedRecords.slice().sort((r1, r2) => grid.store.indexOf(r1) - grid.store.indexOf(r2));

        context.startRecord = grid.getRecordFromElement(context.element);
        context.originalRowTop = grid.rowManager.getRowFor(context.startRecord).top;

        // Backwards compat, @deprecated - remove in 5.0
        context.record = context.startRecord;

        return records.length > 0 && !records.some(rec => rec.isSpecialRow);
    }

    onDragStart({ context }) {
        const
            me                                              = this,
            { cellEdit, contextMenu, cellMenu, headerMenu } = me.grid.features;

        if (cellEdit) {
            me.cellEditDisabledState = cellEdit.disabled;
            cellEdit.disabled = true; // prevent editing from being started through keystroke during row reordering
        }

        // TODO: 'contextMenu' is deprecated. Please see https://bryntum.com/docs/grid/#Grid/guides/upgrades/4.0.0.md for more information.
        contextMenu?.hideContextMenu?.(false);
        cellMenu?.hideContextMenu?.(false);
        headerMenu?.hideContextMenu?.(false);

        me.grid.element.classList.add('b-row-reordering');

        const focusedCell = context.element.querySelector('.b-focused');
        focusedCell?.classList.remove('b-focused');

        DomHelper.removeClasses(context.element.firstElementChild, ['b-selected', 'b-hover']);
    }

    onDrag({ context, event }) {
        const
            me                    = this,
            { grid }              = me,
            { store, rowManager } = grid,
            { dragWithin }        = me.dragHelper;

        // Ignore if user drags outside grid area
        if (!dragWithin.contains(event.target)) {
            context.valid = false;
            return;
        }

        let valid = context.valid,
            row   = grid.rowManager.getRowAt(event.clientY),
            overRecord,
            dataIndex,
            after,
            insertBefore;

        if (row) {
            const
                rowTop  = row.top + grid._bodyRectangle.y - grid.scrollable.y,
                middleY = rowTop + (row.height / 2);

            dataIndex = row.dataIndex;
            overRecord = store.getAt(dataIndex);

            // Drop after row below if mouse is in bottom half of hovered row
            after = event.clientY > middleY;
        }
        // User dragged below last row or above the top row.
        else {
            if (event.clientY < grid._bodyRectangle.y) {
                dataIndex  = 0;
                overRecord = store.first;
                after      = false;
            }
            else {
                dataIndex  = store.count - 1;
                overRecord = store.last;
                after      = true;
            }
            row = grid.rowManager.getRow(dataIndex);
        }

        if (overRecord === me.overRecord && me.after === after) {
            context.valid = me.reorderValid;
            // nothing's changed
            return;
        }

        me.overRecord = overRecord;
        me.after = after;

        // Hovering the dragged record. This is a no-op.
        // But still gather the contextual data.
        if (overRecord === context.startRecord) {
            valid = false;
        }

        if (store.tree) {
            insertBefore = after ? overRecord.nextSibling : overRecord;

            // For trees, prevent moving a parent into its own hierarchy
            if (context.records.some(rec => rec.contains(overRecord))) {
                valid = false;
            }

            if (context.parent) {
                const oldParentRow = rowManager.getRowById(context.parent);

                oldParentRow?.removeCls('b-row-reordering-target-parent');
            }

            context.parent = overRecord.parent;

            if (!context.parent.isRoot) {
                const parentRow = rowManager.getRowById(context.parent);

                parentRow?.addCls('b-row-reordering-target-parent');
            }

            me.clearTimeout(me.hoverTimer);

            if (overRecord && overRecord.isParent && !overRecord.isExpanded(store)) {
                me.hoverTimer = me.setTimeout(() => grid.expand(overRecord), me.hoverExpandTimeout);
            }
        }
        else {
            insertBefore = after ? store.getAt(dataIndex + 1) : overRecord;
        }

        // Provide visual clue to user of the drop position
        DomHelper.setTranslateY(me.dropIndicator, row.top + (after ? row.height : 0));

        // Public property used for validation
        context.insertBefore = insertBefore;

        context.valid = me.reorderValid = valid;
    }

    /**
     * Handle drop
     * @private
     */
    async onDrop(event) {
        const
            me             = this,
            context        = event.context;

        context.valid = context.valid && me.reorderValid;

        if (context.valid) {
            context.asyncCleanup = context.async = true;

            // Outside world provided us one or more Promises to wait for
            const result = await me.trigger('gridRowBeforeDropFinalize', event);

            if (result === false) {
                context.valid = false;
            }

            if (!context.valid) {
                // TODO set correct return position for cloned row
            }

            context.element.classList.add('b-dropping');

            await EventHelper.waitForTransitionEnd({
                element  : context.element.firstElementChild,
                property : 'transform',
                thisObj  : me.client
            });
            await me.finalizeReorder(context);
        }

        // already dropped the node, don't have to expand any node hovered anymore
        // (cancelling expand action after timeout)
        me.clearTimeout(me.hoverTimer);
        
        me.trigger('gridRowDrop', event);
    }

    async finalizeReorder(context) {
        const
            me          = this,
            { grid }    = me,
            { store }   = grid;

        let records = context.records;

        context.valid = context.valid && !records.some(rec => !store.includes(rec));

        if (context.valid) {
            let result;

            if (store.tree) {
                // Remove any selected child records of parent nodes
                records = records.filter(record => !record.parent || !records.includes(record.parent));
                result  = await context.parent.tryInsertChild(records, context.insertBefore);
                // remove reorder cls from preview parent element dropped
                grid.rowManager.forEach(r => r.removeCls('b-row-reordering-target-parent'));

                context.valid = result !== false;
            }
            else {
                store.move(records, context.insertBefore);
            }

            store.clearSorters();
        }

        context.finalize(context.valid);

        grid.element.classList.remove('b-row-reordering');
    }

    /**
     * Clean up on reset
     * @private
     */
    onReset() {
        const
            me       = this,
            cellEdit = me.grid.features.cellEdit;

        me.grid.element.classList.remove('b-row-reordering');

        if (cellEdit) {
            cellEdit.disabled = me.cellEditDisabledState;
        }

        DomHelper.removeClsGlobally(
            me.grid.element,
            'b-row-reordering-target-parent'
        );
    }

    //endregion

    //region Render

    /**
     * Updates DragHelper with updated headers when grid contents is rerendered
     * @private
     */
    onPaint() {
        // columns shown, hidden or reordered
        this.init();
    }

    //endregion
}

RowReorder.featureClass = '';

GridFeatureManager.registerFeature(RowReorder, false);
GridFeatureManager.registerFeature(RowReorder, true, 'Gantt');
