//TODO: Maybe some more way to stop editing in touch mode (in case grid fills entire page...)

import DomHelper from '../../Core/helper/DomHelper.js';
import InstancePlugin from '../../Core/mixin/InstancePlugin.js';
import GridFeatureManager from '../feature/GridFeatureManager.js';
import Delayable from '../../Core/mixin/Delayable.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import Editor from '../../Core/widget/Editor.js';
import GlobalEvents from '../../Core/GlobalEvents.js';
import MessageDialog from '../../Core/widget/MessageDialog.js';
import '../../Core/widget/NumberField.js';
import '../../Core/widget/Combo.js';
import '../../Core/widget/DateField.js';
import '../../Core/widget/TimeField.js';

const
    validNonEditingKeys = {
        Enter : 1,
        F2    : 1
    },
    validEditingKeys = {
        ArrowUp    : 1,
        ArrowDown  : 1,
        ArrowLeft  : 1,
        ArrowRight : 1
    };

/**
 * @module Grid/feature/CellEdit
 */

/**
 * Adding this feature to the grid and other Bryntum products which are based on the Grid (i.e. Scheduler, SchedulerPro, and Gantt)
 * enables cell editing. Any subclass of {@link Core.widget.Field Field} can be used
 * as editor for the {@link Grid.column.Column Column}. The most popular are:
 *
 * - {@link Core.widget.TextField TextField}
 * - {@link Core.widget.NumberField NumberField}
 * - {@link Core.widget.DateField DateField}
 * - {@link Core.widget.TimeField TimeField}
 * - {@link Core.widget.Combo Combo}
 *
 * Usage instructions:
 * ## Start editing
 * * Double click on a cell
 * * Press [ENTER] or [F2] with a cell selected
 * * It is also possible to change double click to single click to start editing, using the {@link #config-triggerEvent} config
 *
 * ```javascript
 * new Grid({
 *    features : {
 *        cellEdit : {
 *            triggerEvent : 'cellclick'
 *        }
 *    }
 * });
 * ```
 *
 * ## While editing
 * * [ENTER] Finish editing and start editing the same cell in next row
 * * [SHIFT] + [ENTER] Same as above put with previous row
 * * [F2] Finish editing
 * * [CMD/CTRL] + [ENTER] Finish editing
 * * [ESC] By default, first reverts the value back to its original value, next press cancels editing
 * * [TAB] Finish editing and start editing the next cell
 * * [SHIFT] + [TAB] Finish editing and start editing the previous cell
 *
 * Columns specify editor in their configuration. Editor can also by set by using a column type. Columns
 * may also contain these three configurations which affect how their cells are edited:
 * * {@link Grid.column.Column#config-invalidAction}
 * * {@link Grid.column.Column#config-revertOnEscape}
 * * {@link Grid.column.Column#config-finalizeCellEdit}
 *
 * ## Preventing editing of certain cells
 * You can prevent editing on a column by setting `editor` to false:
 *
 * ```javascript
 * new Grid({
 *    columns : [
 *       {
 *          type   : 'number',
 *          text   : 'Age',
 *          field  : 'age',
 *          editor : false
 *       }
 *    ]
 * });
 * ```
 * To prevent editing in a specific cell, listen to the {@link #event-beforeCellEditStart} and return false:
 *
 * ```javascript
 * grid.on('beforeCellEditStart', ({ editorContext }) => {
 *     return editorContext.column.field !== 'id';
 * });
 * ```

 * ## Choosing field on the fly
 * To use an alternative input field to edit a cell, listen to the {@link #event-beforeCellEditStart} and
 * set the `editor` property of the context to the input field you want to use:
 *
 * ```javascript
 * grid.on('beforeCellEditStart', ({ editorContext }) => {
 *     return editorContext.editor = myDateField;
 * });
 * ```
 *
 * ## Loading remote data into a combo box cell editor
 * If you need to prepare or modify the data shown by the cell editor, e.g. load remote data into the store used by a combo,
 * listen to the {@link #event-startCellEdit} event:
 * ```javascript
 * const employeeStore = new AjaxStore({ readUrl : '/cities' }); // A server endpoint returning data like:
 *                                                               // [{ id : 123, name : 'Bob Mc Bob' }, { id : 345, name : 'Lind Mc Foo' }]
 *
 * new Grid({
 *     // Example data including a city field which is an id used to look up entries in the cityStore above
 *     data : [
 *         { id : 1, name : 'Task 1', employeeId : 123 },
 *         { id : 2, name : 'Task 2', employeeId : 345 }
 *     ],
 *     columns : [
 *       {
 *          text   : 'Task',
 *          field  : 'name'
 *       },
 *       {
 *          text   : 'Assigned to',
 *          field  : 'employeeId',
 *          editor : {
 *               type : 'combo',
 *               store : employeeStore,
 *               // specify valueField'/'displayField' to match the data format in the employeeStore store
 *               valueField : 'id',
 *               displayField : 'name'
 *           },
 *           renderer : ({ value }) {
 *                // Use a renderer to show the employee name, which we find by querying employeeStore by the id of the grid record
 *                return employeeStore.getById(value)?.name;
 *           }
 *       }
 *    ],
 *    listeners : {
 *        // When editing, you might want to fetch data for the combo store from a remote resource
 *        startCellEdit({ editorContext }) {
 *            const { record, editor, column } = editorContext;
 *            if (column.field === 'employeeId') {
 *                // Load possible employees to assign to this particular task
 *                editor.inputField.store.load({ task : record.id });
 *            }
 *       }
 *    }
 * });
 * ```
 * This feature is **enabled** by default.
 *
 * @extends Core/mixin/InstancePlugin
 *
 * @demo Grid/celledit
 * @classtype cellEdit
 * @inlineexample Grid/feature/CellEdit.js
 * @feature
 */
export default class CellEdit extends Delayable(InstancePlugin) {
    //region Config

    static get $name() {
        return 'CellEdit';
    }

    // Default configuration
    static get defaultConfig() {
        return {
            /**
             * Set to true to select the field text when editing starts
             * @config {Boolean}
             * @default
             */
            autoSelect : true,

            /**
             * What action should be taken when focus moves leaves the cell editor, for example when clicking outside.
             * May be `'complete'` or `'cancel`'.
             * @config {String}
             * @default
             */
            blurAction : 'complete',

            /**
             * Set to true to have TAB key on the last cell (and ENTER anywhere in the last row) in the data set create a new record
             * and begin editing it at its first editable cell.
             *
             * If this is configured as an object, it is used as the default data value set for each new record.
             * @config {Boolean|Object}
             * @default
             */
            addNewAtEnd : null,

            /**
             * Set to true to start editing when user starts typing text on a focused cell (as in Excel)
             * @config {Boolean}
             * @default
             */
            autoEdit : false,

            /**
             * Class to use as an editor. Default value: {@link Core.widget.Editor}
             * @config {Core.widget.Widget}
             * @internal
             */
            editorClass : Editor,

            /**
             * The name of the grid event that will trigger cell editing. Defaults to
             * {@link Grid.view.mixin.GridElementEvents#event-cellDblClick celldblclick} but can be changed to any other event,
             * such as {@link Grid.view.mixin.GridElementEvents#event-cellClick cellclick}.
             *
             * ```javascript
             * features : {
             *     cellEdit : {
             *         triggerEvent : 'cellclick'
             *     }
             * }
             * ```
             *
             * @config {String}
             * @default
             */
            triggerEvent : 'celldblclick',

            focusCellAnimationDuration : false
        };
    }

    // Plugin configuration. This plugin chains some of the functions in Grid.
    static get pluginConfig() {
        return {
            assign : ['startEditing'],
            before : ['onElementKeyDown', 'onElementMouseDown'],
            chain  : ['onElementClick', 'bindStore']
        };
    }

    //endregion

    //region Init

    construct(grid, config) {
        super.construct(grid, config);

        const
            me            = this,
            gridListeners = {
                renderRows : 'onGridRefreshed',
                cellClick  : 'onCellClick',
                thisObj    : me
            };

        me.grid = grid;

        if (me.triggerEvent !== 'cellclick') {
            gridListeners[me.triggerEvent] = 'onTriggerEditEvent';
        }

        grid.on(gridListeners);

        grid.rowManager.on({
            changeTotalHeight : 'onGridRefreshed',
            thisObj           : me
        });
        me.bindStore(grid.store);
    }

    bindStore(store) {
        this.detachListeners('store');

        store.on({
            name    : 'store',
            update  : 'onStoreUpdate',
            thisObj : this
        });
    }

    /**
     * Displays a OK / Cancel confirmation dialog box owned by the current Editor. This is intended to be
     * used by {@link Grid.column.Column#config-finalizeCellEdit} implementations. The returned promise resolves passing `true`
     * if the "OK" button is pressed, and `false` if the "Cancel" button is pressed. Typing `ESC` rejects.
     * @param {Object} options An options object for what to show.
     * @param {String} [options.title] The title to show in the dialog header.
     * @param {String} [options.message] The message to show in the dialog body.
     * @param {String|Object} [options.cancelButton] A text or a config object to apply to the Cancel button.
     * @param {String|Object} [options.okButton] A text or config object to apply to the OK button.
     * @async
     */
    async confirm(options) {
        let result = true;

        if (this.editorContext) {
            // The input field must not lose containment of focus during this confirmation
            // so temporarily make the MessageDialog a descendant widget.
            MessageDialog.owner = this.editorContext.editor.inputField;
            options.rootElement = this.grid.rootElement;
            result = await MessageDialog.confirm(options);
            MessageDialog.owner = null;
        }

        return result === MessageDialog.yesButton;
    }

    doDestroy() {
        // To kill timeouts
        this.grid.columns.allRecords.forEach(column => {
            column._cellEditor?.destroy();
        });

        super.doDestroy();
    }

    doDisable(disable) {
        if (disable) {
            this.cancelEditing(true);
        }

        super.doDisable(disable);
    }

    set disabled(disabled) {
        super.disabled = disabled;
    }

    get disabled() {
        const { grid } = this;

        return Boolean(super.disabled || grid.disabled || grid.readOnly);
    }

    //endregion

    //region Editing

    /**
     * Is any cell currently being edited?
     * @readonly
     * @property {Boolean}
     */
    get isEditing() {
        return Boolean(this.editorContext);
    }

    /**
     * Returns the record currently being edited, or `null`
     * @readonly
     * @property {Core.data.Model}
     */
    get activeRecord() {
        return this.editorContext?.record || null;
    }

    /**
     * Internal function to create or get existing editor for specified cell.
     * @private
     * @param cellContext Cell to get or create editor for
     * @returns {Core.widget.Editor} An Editor container which displays the input field.
     * @category Internal
     */
    getEditorForCell({ cell, column, selector, editor }) {
        const
            me       = this,
            { grid } = me;

        // Reuse the Editor by caching it on the column.
        let cellEditor = column._cellEditor,
            leftOffset = 0; // Only applicable for tree cells to show editor right of the icons etc

        // Help Editor match size and position
        if (column.editTargetSelector) {
            const editorTarget = cell.querySelector(column.editTargetSelector);

            leftOffset = editorTarget.offsetLeft;
        }

        editor.autoSelect = me.autoSelect;
        if (cellEditor) {
            // Already got the positioned Editor container which carries the input field.
            // just check if the actual field has been changed in a beforeCellEditStart handler.
            // If so, switch it out.
            if (cellEditor.inputField !== editor) {
                cellEditor.remove(cellEditor.items[0]);
                cellEditor.add(editor);
            }
            cellEditor.align.offset[0] = leftOffset;
        }
        else {
            cellEditor = column._cellEditor = new me.editorClass({
                constrainTo   : null,
                cls           : 'b-cell-editor',
                inputField    : editor,
                blurAction    : 'none',
                invalidAction : column.invalidAction,
                completeKey   : false,
                cancelKey     : false,
                owner         : grid,
                align         : {
                    align  : 't0-t0',
                    offset : [leftOffset, 0]
                },
                listeners : me.getEditorListeners()
            });
        }

        // Keep the record synced with the value
        if (column.instantUpdate && !editor.cellEditValueSetter) {
            ObjectHelper.wrapProperty(editor, 'value', null, value => {
                const { editorContext } = me;
                // Only tickle the record if the value has changed.
                if (editorContext?.editor.isValid && !ObjectHelper.isEqual(editorContext.record[editorContext.column.field], value)) {
                    editorContext.record[editorContext.column.field] = value;
                }
            });
            editor.cellEditValueSetter = true;
        }

        Object.assign(cellEditor.element.dataset, {
            rowId    : selector.id,
            columnId : selector.columnId,
            field    : column.field
        });

        // First ESC press reverts
        cellEditor.inputField.revertOnEscape = column.revertOnEscape;

        return me.editor = cellEditor;
    }

    // Turned into function to allow overriding in Gantt, and make more configurable in general
    getEditorListeners() {
        return {
            focusOut       : 'onEditorFocusOut',
            focusIn        : 'onEditorFocusIn',
            start          : 'onEditorStart',
            beforeComplete : 'onEditorBeforeComplete',
            complete       : 'onEditorComplete',
            cancel         : 'onEditorCancel',
            thisObj        : this
        };
    }

    onEditorStart({ source : editor }) {
        const
            me            = this,
            editorContext = me.editorContext = editor.cellEditorContext;

        if (editorContext) {
            const
                { grid } = me,
                { cell } = editorContext;

            cell.classList.add('b-editing');

            // Should move editing to new cell on click, unless click is configured to start editing - in which case it
            // will move anyway
            if (me.triggerEvent !== 'cellclick') {
                grid.on({
                    cellclick : 'onCellClickWhileEditing'
                }, me);
            }

            // Handle tapping outside of the grid element. Use GlobalEvents
            // because it uses a capture:true listener before any other handlers
            // might stop propagation.
            // Cannot use delegate here. A tapped cell will match :not(#body-container)
            me.removeEditingListeners = GlobalEvents.addListener({
                globaltap : 'onTapOut',
                thisObj   : me
            });

            /**
             * Fires on the owning Grid when editing starts
             * @event startCellEdit
             * @on-owner
             * @param {Grid.view.Grid} source Owner grid
             * @param {Object} editorContext Editing context
             * @param {Core.widget.Editor} editorContext.editor The Editor being used.
             * Will contain an `inputField` property which is the field being used to perform the editing.
             * @param {Grid.column.Column} editorContext.column Target column
             * @param {Core.data.Model} editorContext.record Target record
             * @param {HTMLElement} editorContext.cell Target cell
             * @param {*} editorContext.value Cell value
             */
            grid.trigger('startCellEdit', { grid, editorContext });
        }
    }

    onEditorBeforeComplete(context) {
        const
            { grid }      = this,
            editor        = context.source,
            editorContext = editor.cellEditorContext;

        context.grid = grid;
        context.editorContext = editorContext;

        /**
         * Fires on the owning Grid before the cell editing is finished, return false to signal that the value is invalid and editing should not be finalized.
         * @on-owner
         * @event beforeFinishCellEdit
         * @param {Grid.view.Grid} grid Target grid
         * @param {Object} editorContext Editing context
         * @param {Core.widget.Editor} editorContext.editor The Editor being used.
         * Will contain an `inputField` property which is the field being used to perform the editing.
         * @param {Grid.column.Column} editorContext.column Target column
         * @param {Core.data.Model} editorContext.record Target record
         * @param {HTMLElement} editorContext.cell Target cell
         * @param {*} editorContext.value Cell value
         */
        return grid.trigger('beforeFinishCellEdit', context);
    }

    onEditorComplete({ source : editor }) {
        const
            { grid }      = this,
            editorContext = editor.cellEditorContext;

        // Ensure the docs below are accurate!
        editorContext.value = editor.inputField.value;

        /**
         * Fires on the owning Grid when cell editing is finished
         * @event finishCellEdit
         * @on-owner
         * @param {Grid.view.Grid} grid Target grid
         * @param {Object} editorContext Editing context
         * @param {Core.widget.Editor} editorContext.editor The Editor being used.
         * Will contain an `inputField` property which is the field being used to perform the editing.
         * @param {Grid.column.Column} editorContext.column Target column
         * @param {Core.data.Model} editorContext.record Target record
         * @param {HTMLElement} editorContext.cell Target cell
         * @param {*} editorContext.value Cell value
         */
        grid.trigger('finishCellEdit', { grid, editorContext });
        this.cleanupAfterEdit(editorContext);
    }

    onEditorCancel({ event }) {
        const { editorContext, muteEvents, grid } = this;

        if (editorContext) {
            this.cleanupAfterEdit(editorContext);
        }
        if (!muteEvents) {
            /**
             * Fires on the owning Grid when editing is cancelled
             * @event cancelCellEdit
             * @on-owner
             * @param {Grid.view.Grid} source Owner grid
             * @param {Event} event Included if the cancellation was triggered by a DOM event
             */
            grid.trigger('cancelCellEdit', { grid, event });
        }
    }

    cleanupAfterEdit(editorContext) {
        const
            me         = this,
            { editor } = editorContext;

        editorContext.cell.classList.remove('b-editing');
        editor.cellEditorContext = me.editorContext = null;
        me.grid.un({
            cellclick      : 'onCellClickWhileEditing',
            viewportResize : 'onViewportResizeWhileEditing'
        }, me);
        me.removeEditingListeners();
        // MS Edge workaround.
        // At this moment active element is grid.element, but removing editor element still triggers focusout event
        // which is processed by the GlobalEvents, which decides that focus goes to body element. That, in turn, triggers
        // clearFocus on grid navigation, removing focused cell from cache etc, eventually focus actually goes to body.
        // Suspending listener to seamlessly remove element keeping focus where it belongs.
        // NOTE: not reproducible in IFrame, so our tests cannot catch this
        GlobalEvents.suspendFocusEvents();
        editor.element.remove();
        GlobalEvents.resumeFocusEvents();
    }

    /**
     * Find the next succeeding or preceding cell which is editable (column.editor != false)
     * @param {Object} cellInfo
     * @param {Boolean} isForward
     * @returns {Object}
     * @private
     * @category Internal
     */
    getAdjacentEditableCell(cellInfo, isForward) {
        const
            { grid }           = this,
            { store, columns } = grid,
            { visibleColumns } = columns;

        let
            rowId    = cellInfo.id,
            column   = columns.getAdjacentVisibleLeafColumn(cellInfo.columnId, isForward);

        while (rowId) {
            if (column) {
                if (column.editor && column.canEdit(store.getById(rowId))) {
                    return { id : rowId, columnId : column.id };
                }

                column = columns.getAdjacentVisibleLeafColumn(column, isForward);
            }
            else {
                const record = store.getAdjacent(cellInfo.id, isForward, false, true);

                rowId = record?.id;

                if (record) {
                    column = isForward ? visibleColumns[0] : visibleColumns[visibleColumns.length - 1];
                }
            }
        }

        return null;
    }

    /**
     * Adds a new, empty record at the end of the TaskStore with the initial
     * data specified by the {@link Grid.feature.CellEdit#config-addNewAtEnd} setting.
     *
     * @private
     * @returns {Core.data.Model} Newly added record
     */
    doAddNewAtEnd() {
        const
            newRecordConfig = typeof this.addNewAtEnd === 'object' ? ObjectHelper.clone(this.addNewAtEnd) : {},
            { grid }        = this,
            record          = grid.store.add(newRecordConfig)[0];

        // If the new record was not added due to it being off the end of the rendered block
        // ensure we force it to be there before we attempt to edit it.
        if (!grid.rowManager.getRowFor(record)) {
            grid.rowManager.displayRecordAtBottom();
        }

        return record;
    }

    /**
     * Creates an editing context object for the passed cell context (target cell must be in the DOM).
     *
     * If the referenced cell is editable, an object returned will
     * be returned containing the following properties:
     *
     *     - column
     *     - record
     *     - cell
     *     - value
     *     - selector
     *
     * If the references cell is _not_ editable, `false` will be returned.
     * @param {Object} cellContext an object which encapsulates a cell.
     * @param {String} cellContext.id The record id of the row to edit
     * @param {String} cellContext.columnId The column id of the column to edit
     * @private
     */
    getEditingContext(cellContext) {
        cellContext = this.grid.normalizeCellContext(cellContext);

        const
            me       = this,
            { grid } = me,
            column   = grid.columns.getById(cellContext.columnId),
            record   = grid.store.getById(cellContext.id);

        // Cell must be in the DOM to edit.
        // Cannot edit hidden columns and columns without an editor.
        // Cannot edit special rows (groups etc).
        if (column && !column.hidden && column.editor && record && !record.isSpecialRow && column.canEdit(record)) {
            const value = record?.[column.field];

            return {
                column,
                record,
                value    : value === undefined ? null : value,
                selector : cellContext,
                editor   : column.editor
            };
        }
        else {
            return false;
        }
    }

    /**
     * Start editing specified cell. If no cellContext is given it starts with the first cell in the first row.
     * This function is exposed on Grid and can thus be called as `grid.startEditing(...)`
     * @param {Object} cellContext Cell specified in format { id: 'x', columnId/column/field: 'xxx' }. See {@link Grid.view.Grid#function-getCell} for details.
     * @fires startCellEdit
     * @returns {Boolean} editingStarted
     * @category Editing
     * @on-owner
     */
    startEditing(cellContext = {}) {
        const me = this;

        // If disabled no can do.
        if (!me.disabled) {
            const
                { grid }          = me,
                normalizedContext = grid.normalizeCellContext(cellContext),
                editorContext     = me.getEditingContext(normalizedContext);

            // Cannot edit hidden columns and columns without an editor
            // Cannot edit special rows (groups etc).
            if (!editorContext) {
                return false;
            }

            if (me.editorContext) {
                me.cancelEditing();
            }

            // Now that we know we can edit this cell, scroll the record into view and register it as last focusedCell
            // TODO this is potentially async and should be awaited
            grid.focusCell(cellContext);

            editorContext.cell = grid.getCell(cellContext);

            /**
             * Fires on the owning Grid before editing starts, return `false` to prevent editing
             * @event beforeCellEditStart
             * @on-owner
             * @preventable
             * @param {Grid.view.Grid} source Owner grid
             * @param {Object} editorContext Editing context
             * @param {Grid.column.Column} editorContext.column Target column
             * @param {Core.data.Model} editorContext.record Target record
             * @param {HTMLElement} editorContext.cell Target cell
             * @param {Core.widget.Field} editorContext.editor The input field that the column is configured
             * with (see {@link Grid.column.Column#config-field}). This property mey be replaced
             * to be a different {@link Core.widget.Field field} in the handler, to take effect
             * just for the impending edit.
             * @param {Function} [editorContext.finalize] An async function may be injected into this property
             * which performs asynchronous finalization tasks such as complex validation of confirmation. The
             * value `true` or `false` must be returned.
             * @param {Object} [editorContext.finalize.context] An object describing the editing context upon requested completion of the edit.
             * @param {*} editorContext.value Cell value
             */
            if (grid.trigger('beforeCellEditStart', { grid, editorContext }) === false) {
                return false;
            }

            // Focus grid element to preserve focus inside once editing is started
            // https://app.assembla.com/spaces/bryntum/tickets/8155-grid-cell-not-properly-focused-in-advanced-demo
            DomHelper.focusWithoutScrolling(grid.focusElement);

            const
                editor                   = editorContext.editor = me.getEditorForCell(editorContext),
                { cell, record, column } = editorContext;

            // Prevent highlight when setting the value in the editor
            editor.inputField.highlightExternalChange = false;

            editor.cellEditorContext = editorContext;
            editor.render(me.grid.getSubGridFromColumn(column).element);

            // Attempt to start edit.
            // We will set up our context in onEditorStart *if* the start was successful.
            editor.startEdit({
                target : cell,
                record,
                field  : editor.inputField.name || editorContext.column.field
            });

            return true;
        }

        return false;
    }

    /**
     * Cancel editing, destroys the editor
     * @param {Boolean} silent Pass true to prevent method from firing event
     * @fires cancelCellEdit
     * @category Editing
     */
    cancelEditing(silent = false, triggeredByEvent) {
        const
            me                              = this,
            { editorContext, editor, grid } = me;

        if (editorContext) {
            // If cancel was not called from onEditorFocusOut, then refocus the grid.
            if (editor.containsFocus) {
                // Kill editorContext before we destroy the editor so that we know we are not editing
                // in ensuing focusout event handling
                me.editorContext = null;

                // Control focus reversion if we own focus
                if (!grid.isDestroying && editor.inputField.owns(DomHelper.getActiveElement(grid))) {
                    DomHelper.focusWithoutScrolling(grid.focusElement);
                }
                me.editorContext = editorContext;
            }

            me.muteEvents = silent;
            editor.cancelEdit(triggeredByEvent);
            me.muteEvents = false;
        }
    }

    /**
     * Finish editing, update the underlying record and destroy the editor
     * @fires finishCellEdit
     * @category Editing
     * @returns `false` if the edit could not be finished due to the value being invalid or the
     * Editor's `complete` event was vetoed.
     * @async
     */
    async finishEditing() {
        const
            me                = this,
            { editorContext } = me;

        let result = false;

        if (editorContext) {
            const { column } = editorContext;

            // If completeEdit finds that the editor context has a finalize method in it,
            // it will *await* the completion of that method before completing the edit
            // so we must await completeEdit.
            // We can override that finalize method by passing the column's own finalizeCellEdit.
            // Set a flag (promise) indicating that we are in the middle of editing finalization
            me.finishEditingPromise = editorContext.editor.completeEdit(column.bindCallback(column.finalizeCellEdit));
            result = await me.finishEditingPromise;

            // If grid is animating, wait for it to finish to not start a follow up edit when things are moving
            // (only applies to Scheduler for now, tested in Schedulers CellEdit.t.js)
            await me.grid.waitForAnimations();

            // reset the flag
            me.finishEditingPromise = null;
        }

        return result;
    }

    //endregion

    //region Events

    /**
     * Event handler added when editing is active called when user clicks a cell in the grid during editing.
     * It finishes editing and moves editor to the selected cell instead.
     * @private
     * @category Internal event handling
     */
    async onCellClickWhileEditing({ event, cellSelector }) {
        const me = this;

        // Ignore clicks if async finalization is running
        if (me.finishEditingPromise) {
            return;
        }

        // Ignore clicks in the editor.
        if (me.editorContext && !me.editorContext.editor.owns(event.target)) {
            if (me.getEditingContext(cellSelector)) {
                // Attempt to finish the current edit.
                // Will return false if the field is invalid.
                if (await me.finishEditing()) {
                    me.startEditing(cellSelector);
                }
                // Previous edit was invalid, return to it.
                else {
                    me.grid.focusCell(me.editorContext.selector);
                    me.editor.inputField.focus();
                }
            }
            else {
                me.finishEditing();
            }
        }
    }

    /**
     * Starts editing if user taps selected cell again on touch device. Chained function called when user clicks a cell.
     * @private
     * @category Internal event handling
     */
    onCellClick({ source : grid, cellSelector, target, event, column }) {
        if (column.onCellClick) {
            // Columns may provide their own handling of cell editing
            return;
        }

        const selected = grid.focusedCell || {};

        if (target.closest('.b-tree-expander')) {
            this.cancelEditing(undefined, event);
            return false;
        }
        else if (DomHelper.isTouchEvent &&
            cellSelector.id == selected.id &&
            cellSelector.columnId == selected.columnId) {

            this.startEditing(cellSelector);
        }
        else if (this.triggerEvent === 'cellclick') {
            this.onTriggerEditEvent({ cellSelector, target });
        }
    }

    /**
     * Called when the user triggers the edit action in {@link #config-triggerEvent} config. Starts editing.
     * @private
     * @category Internal event handling
     */
    async onTriggerEditEvent({ cellSelector, target }) {
        if (target.closest('.b-tree-expander')) {
            return;
        }

        if (this.editorContext) {
            if (!(await this.finishEditing())) {
                return;
            }
        }

        this.startEditing(cellSelector);
    }

    /**
     * Update the input field if underlying data changes during edit.
     * @private
     * @category Internal event handling
     */
    onStoreUpdate({ changes, record }) {
        const { editorContext } = this;

        if (editorContext?.editor.isVisible) {
            if (record === editorContext.record && editorContext.editor.dataField in changes) {
                editorContext.editor.refreshEdit();
            }
        }
    }

    /**
     * Realign editor if grid renders rows while editing is ongoing (as a result to autoCommit or WebSocket data received).
     * @private
     * @category Internal event handling
     */
    onGridRefreshed() {
        const
            me       = this,
            { grid } = me;

        if (me.editorContext && grid.focusedCell) {
            const cell = grid.getCell(grid.focusedCell);

            if (cell) {
                me.editorContext.editor.showBy(cell);
            }
            else {
                me.cancelEditing();
            }
        }
    }

    /**
     * Chained function called on key down. [enter] or [f2] starts editing. [enter] also finishes editing and starts
     * editing next row, [f2] also finishes editing without moving to the next row. [esc] cancels editing. [tab]
     * edits next column, [shift] + [tab] edits previous.
     * @param event
     * @private
     * @category Internal event handling
     */
    async onElementKeyDown(event) {
        const me = this;

        // flagging event with handled = true used to signal that other features should probably not care about it
        if (event.handled || !me.grid.focusElement.contains(event.target)) {
            return;
        }

        if (!me.editorContext) {
            const
                { key }   = event,
                backspace = key === 'Backspace',
                autoEdit  = me.autoEdit && (key.length === 1 || backspace);

            // enter or f2 to edit, or any character key if autoEdit is enabled
            if ((autoEdit || validNonEditingKeys[key]) && me.grid.focusedCell) {
                if (me.startEditing(me.grid.focusedCell)) {
                    const
                        { inputField } = me.editor,
                        { input } = inputField;

                    // if editing started with a keypress and the editor has an input field, set its value
                    if (autoEdit && input) {
                        // Simulate a keydown in an input field by setting input value
                        // plus running our internal processing of that event
                        inputField.internalOnKeyEvent(event);

                        if (!event.defaultPrevented) {
                            input.value = backspace ? '' : key;
                            inputField.internalOnInput(event);

                            // IE11 + Edge put caret at 0 when focusing
                            inputField.moveCaretToEnd();
                        }
                    }
                }

                event.preventDefault();
            }
        }
        else {
            switch (event.key) {
                case 'Enter':
                    me.onEnterKeyPress(event);
                    break;

                case 'F2':
                    event.preventDefault();
                    me.finishEditing();
                    break;

                case 'Escape':
                    event.stopPropagation();
                    event.preventDefault();
                    me.cancelEditing(undefined, event);
                    break;

                case 'Tab':
                    me.onTabKeyPress(event);
                    break;
            }

            // prevent arrow keys from moving editor
            if (validEditingKeys[event.key]) {
                event.handled = true;
            }
        }
    }

    async onEnterKeyPress(event) {
        const
            me       = this,
            { grid } = me;

        event.preventDefault();
        event.stopPropagation();

        if (await me.finishEditing()) {
            // Might be destroyed during the async operation
            if (me.isDestroyed) {
                return;
            }

            // Finalizing might have been blocked by an invalid value
            if (!me.isEditing) {
                if (event.ctrlKey || event.metaKey || event.altKey || grid.touch) {
                    // Enter in combination with special keys finishes editing
                    // On touch Enter always finishes editing. Feels more natural since no tab-key etc.
                    return;
                }

                // Edit previous
                if (event.shiftKey) {
                    if (grid.internalNextPrevRow(false, true, event, false)) {
                        me.startEditing(grid.focusedCell);
                    }
                }
                // Edit next
                else {
                    // If we are at the last editable cell, optionally add a new row
                    if (me.addNewAtEnd) {
                        const record = grid.store.getById(grid.focusedCell?.id);

                        if (record === grid.store.last) {
                            await me.doAddNewAtEnd();
                        }
                    }

                    if (grid.internalNextPrevRow(true, true)) {
                        me.startEditing(grid.focusedCell);
                    }
                }
            }
        }
    }

    async onTabKeyPress(event) {
        event.preventDefault();

        const
            me              = this,
            { focusedCell } = me.grid;

        if (focusedCell) {
            const isForward = !event.shiftKey;

            let cellInfo = me.getAdjacentEditableCell(focusedCell, isForward);

            // If we are at the last editable cell, optionally add a new row
            if (!cellInfo && isForward && me.addNewAtEnd) {
                const currentEditableFinalizationResult = await me.finishEditing();

                if (currentEditableFinalizationResult === true) {
                    await this.doAddNewAtEnd();

                    // Re-grab the next editable cell
                    cellInfo = me.getAdjacentEditableCell(focusedCell, isForward);
                }
            }

            if (cellInfo) {
                let finalizationResult = true;

                if (me.isEditing) {
                    finalizationResult = await me.finishEditing();
                }

                if (finalizationResult) {
                    me.grid.focusCell(cellInfo, {
                        animate : me.focusCellAnimationDuration
                    });

                    me.startEditing(cellInfo);
                }
                else {
                    // finishing cell editing was not allowed, current editor value is invalid
                }
            }
        }
    }

    onElementMouseDown(event) {
        // If it's a contextmenu mousedown during cell edit, prevent default
        // because the contextmenu handler will move focus directly to the context menu.
        // If we allow it to go through the grid, the edit will not terminate because
        // that usually means begin editing somewhere else in the grid.
        // TODO: This won't be necessary when cells are the focusable DOM unit.
        if (event.button === 2 && this.editorContext) {
            event.preventDefault();
        }
    }

    /**
     * Cancel editing on widget focusout
     * @private
     */
    onEditorFocusOut(event) {
        const
            me       = this,
            {
                grid,
                editor,
                editorContext
            } = me;

        // If the editor is not losing focus as a result of its tidying up process
        // And focus is moving to outside of the grid, or back to the initiating cell
        // (which indicates a click on empty space below rows), then explicitly terminate.
        if (editorContext && !editor.isFinishing && editor.inputField.owns(event._target) &&
            (event.toWidget !== grid || grid.isLocationEqual(grid.focusedCell, editorContext.selector))) {
            if (me.blurAction === 'cancel') {
                me.cancelEditing(undefined, event);
            }
            // if not already in the middle of editing finalization (that could be async)
            else if (!me.finishEditingPromise) {
                me.finishEditing();
            }
        }
    }

    onEditorFocusIn(event) {
        const widget = event.toWidget;

        if (widget === this.editor.inputField) {
            if (this.autoSelect && widget.selectAll && !widget.readOnly && !widget.disabled) {
                widget.selectAll();
            }
        }
    }

    /**
     * Cancel edit on touch outside of grid for mobile Safari (focusout not triggering unless you touch something focusable)
     * @private
     */
    onTapOut({ event }) {
        const me = this;

        if (!me.grid.bodyContainer.contains(event.target)) {
            if (!me.editor.owns(event.target)) {
                if (me.blurAction === 'cancel') {
                    me.cancelEditing(undefined, event);
                }
                else {
                    me.finishEditing();
                }
            }
        }
    }

    /**
     * Finish editing if clicking below rows (only applies when grid is higher than rows).
     * @private
     * @category Internal event handling
     */
    onElementClick(event) {
        if (event.target.classList.contains('b-grid-body-container') && this.editorContext) {
            this.finishEditing();
        }
    }

    //endregion
}

GridFeatureManager.registerFeature(CellEdit, true);
