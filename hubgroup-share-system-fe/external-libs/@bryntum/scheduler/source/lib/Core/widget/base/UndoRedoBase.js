import Container from '../Container.js';
import '../Combo.js';

/**
 * @module Core/widget/base/UndoRedoBase
 */

/**
 * Abstract base class used by UndoRedo widgets in Scheduler and TaskBoard.
 *
 * @extends Core/widget/Container
 * @abstract
 */
export default class UndoRedoBase extends Container {
    static get $name() {
        return 'UndoRedoBase';
    }

    static get type() {
        return 'undoredobase';
    }

    static get configurable() {
        return {
            // Documented on subclasses
            project : null,

            stm : null,

            /**
             * Configure as `true` to show "Undo" and "Redo" as button texts. The buttons always have a tooltip
             * as a hint to the user as to their purpose.
             * @config {Boolean}
             */
            text : null,

            /**
             * Button color for the undo and redo buttons. See {@link Core.widget.Button#config-color}.
             * @config {String}
             */
            color : null,

            /**
             * Configure as `true` to show "0" badge on the undo and redo buttons when they have no actions
             * left to perform. By default when there are no actions, no badge is displayed.
             * @config {Boolean}
             */
            showZeroActionBadge : null,

            cls : 'b-undo-controls b-toolbar',

            layoutStyle : {
                alignItems : 'stretch',
                flexFlow   : 'row nowrap',
                overflow   : 'visible'
            },

            items : {
                undoBtn : {
                    type     : 'button',
                    icon     : 'b-icon-undo',
                    tooltip  : 'L{UndoRedo.UndoLastAction}',
                    onAction : 'up.onUndo'     // 'up.' means method is on a parent Widget.
                },
                transactionsCombo : {
                    type                 : 'combo',
                    valueField           : 'idx',
                    editable             : false,
                    store                : {},
                    emptyText            : 'No items in the undo queue',
                    onAction             : 'up.onTransactionSelected',
                    displayValueRenderer : 'up.transactionsDisplayValueRenderer'
                },
                redoBtn : {
                    type     : 'button',
                    icon     : 'b-icon-redo',
                    tooltip  : 'L{UndoRedo.RedoLastAction}',
                    onAction : 'up.onRedo'
                }
            }
        };
    }

    afterConstruct() {
        this.updateUndoRedoControls();
    }

    changeStm(stm) {
        stm.on({
            recordingstop : 'updateUndoRedoControls',
            restoringstop : 'updateUndoRedoControls',
            queueReset    : 'updateUndoRedoControls',
            disabled      : 'updateUndoRedoControls',
            thisObj       : this
        });

        return stm;
    }

    changeItems(items) {
        const { undoBtn, redoBtn } = items;

        if (this.color) {
            undoBtn && (undoBtn.color = this.color);
            redoBtn && (redoBtn.color = this.color);
        }
        if (this.text) {
            undoBtn && (undoBtn.text = 'L{UndoRedo.Undo}');
            redoBtn && (redoBtn.text = 'L{UndoRedo.Redo}');
        }

        return super.changeItems(items);
    }

    updateProject(project) {
        this.stm = project.stm;
    }

    fillUndoRedoCombo() {
        const { transactionsCombo } = this.widgetMap;
        // The transactionsCombo may be configured away if only undo and redo buttons are wanted
        transactionsCombo && (transactionsCombo.items = this.stm.queue.map((title, idx) => [idx, title || `Transaction ${idx}`]));
    }

    updateUndoRedoControls() {
        const
            {
                stm,
                showZeroActionBadge
            } = this,
            {
                undoBtn,
                redoBtn
            } = this.widgetMap;

        undoBtn.badge = stm.position || (showZeroActionBadge ? '0' : '');
        redoBtn.badge = (stm.length - stm.position) || (showZeroActionBadge ? '0' : '');

        undoBtn.disabled = !stm.canUndo;
        redoBtn.disabled = !stm.canRedo;

        this.fillUndoRedoCombo();
    }

    transactionsDisplayValueRenderer(record, combo) {
        const stmPos = this.stm?.position || 0;

        return `${stmPos} undo actions / ${combo.store.count - stmPos} redo actions`;
    }

    onUndo() {
        this.stm.canUndo && this.stm.undo();
    }

    onRedo() {
        this.stm.canRedo && this.stm.redo();
    }

    onTransactionSelected(combo) {
        const
            stm   = this.stm,
            value = combo.value;

        if (value >= 0) {
            if (stm.canUndo && value < stm.position) {
                stm.undo(stm.position - value);
            }
            else if (stm.canRedo && value >= stm.position) {
                stm.redo(value - stm.position + 1);
            }
        }
    }
}
