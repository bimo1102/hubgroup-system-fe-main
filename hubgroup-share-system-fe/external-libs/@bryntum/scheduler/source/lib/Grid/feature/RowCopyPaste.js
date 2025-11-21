import InstancePlugin from '../../Core/mixin/InstancePlugin.js';
import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';

/**
 * @module Grid/feature/RowCopyPaste
 */

/**
 * Allow using [Ctrl/CMD + C/X] and [Ctrl/CMD + V] to copy/cut and paste rows
 *
 * This feature is **enabled** by default
 *
 * ```javascript
 * const grid = new Grid({
 *     features : {
 *         rowCopyPaste : true
 *     }
 * });
 * ```
 *
 * @extends Core/mixin/InstancePlugin
 * @inlineexample Grid/feature/RowCopyPaste.js
 * @classtype rowCopyPaste
 * @feature
 */
export default class RowCopyPaste extends InstancePlugin {

    static get $name() {
        return 'RowCopyPaste';
    }

    static get type() {
        return 'rowCopyPaste';
    }

    static get pluginConfig() {
        return {
            assign : [
                'copyRows',
                'pasteRows'
            ],
            chain : [
                'onElementKeyDown',
                'populateCellMenu'
            ]
        };
    }

    static get properties() {
        return {
            recordsFromClipboard : []
        };
    }

    static get configurable() {
        return {
            copyRecordText        : 'L{copyRecord}',
            cutRecordText         : 'L{cutRecord}',
            pasteRecordText       : 'L{pasteRecord}',
            localizableProperties : [
                'copyRecordText',
                'cutRecordText',
                'pasteRecordText'
            ]
        };
    }

    construct(grid, config) {
        super.construct(grid, config);

        grid.rowManager.on({
            beforeRenderRow : 'onBeforeRenderRow',
            thisObj         : this
        });

        this.grid = grid;
    }

    onBeforeRenderRow({ row, record }) {
        row.cls['b-cut-row'] = record.meta.isCut;
    }

    onElementKeyDown(event) {
        if (event.ctrlKey) {
            switch (event.key.toLowerCase()) {
                // copy
                case 'c':
                    this.onCtrlCKey();
                    break;
                // cut
                case 'x':
                    this.onCtrlXKey();
                    break;
                // paste
                case 'v':
                    this.onCtrlVKey();
                    break;
            }
        }
    }

    /**
     * Copy rows to clipboard to paste later
     *
     * @param {Boolean} [isCut] Copies by default, pass `true` to cut
     * @category Common
     * @on-owner
     */
    copyRows(isCut = false) {
        const
            me         = this,
            { client } = me;

        if (client.readOnly) {
            return;
        }

        me._isCut = isCut;
        me.recordsFromClipboard = [...client.selectedRecords];

        client.store.forEach(rec => {
            rec.meta.isCut = me._isCut && me.recordsFromClipboard.includes(rec);
        });

        // refresh to call reapply the cls for records where the cut was canceled
        client.refreshRows();
    }

    onCtrlCKey() {
        this.copyRows();
    }

    onCtrlXKey() {
        this.copyRows(true);
    }

    onCtrlVKey() {
        this.pasteRows();
    }

    /**
     * Paste rows above selected or passed record
     *
     * @param {Object} [record] Paste above this record, or currently selected record if left out
     * @category Common
     * @on-owner
     */
    pasteRows(record) {
        const
            me        = this,
            records   = me.recordsFromClipboard,
            recRef    = record || me.client.selectedRecord,
            toMove    = [],
            toInsert  = [];

        if (!records.length) {
            return;
        }

        records.forEach(rec => {
            const recCfg = {};

            if (me._isCut) {
                toMove.push(rec);
                // reset record cut state
                rec.meta.isCut = false;
            }
            else {
                recCfg.name = `${rec.name} - copy`;
                toInsert.push(rec.copy(recCfg));
            }
        });

        if (toInsert.length) {
            me.doCloneRecords(recRef, toInsert);
        }
        else if (toMove.length) {
            me.doMoveRecords(recRef, toMove, records);
        }

        if (me._isCut) {
            // reset clipboard
            me._isCut = false;
            me.recordsFromClipboard = [];
        }
    }

    doCloneRecords(recordReference, toInsert) {
        const
            { store } = this.client,
            idxPaste  = store.indexOf(recordReference);

        if (store.tree) {
            return recordReference.parent.insertChild(toInsert, recordReference);
        }
        else {
            return store.insert(idxPaste, toInsert);
        }
    }

    doMoveRecords(recordReference, toMove) {
        const { store } = this.client;

        if (store.tree) {
            return recordReference.parent.insertChild(toMove, recordReference);
        }
        else {
            store.move(toMove, recordReference);
        }
    }

    populateCellMenu({ record, items }) {
        const me = this;

        if (!me.client.readOnly && record && !record.isSpecialRow) {

            items.copyRow = {
                text        : me.copyRecordText,
                localeClass : me,
                icon        : 'b-icon b-icon-copy',
                name        : 'copyRow',
                weight      : 10,
                onItem      : () => me.copyRows()
            };

            items.cutRow = {
                text        : me.cutRecordText,
                localeClass : me,
                icon        : 'b-icon b-icon-cut',
                name        : 'cutRow',
                weight      : 10,
                onItem      : () => me.copyRows(true)
            };

            const toPaste = me.recordsFromClipboard;

            if (toPaste.length) {
                items.pasteRow = {
                    text        : me.pasteRecordText,
                    localeClass : me,
                    icon        : 'b-icon b-icon-paste',
                    name        : 'pasteRow',
                    weight      : 10,
                    onItem      : () => me.pasteRows(record)
                };
            }
        }
    }
}

RowCopyPaste.featureClass = 'b-row-copypaste';

GridFeatureManager.registerFeature(RowCopyPaste, true, 'Grid');
GridFeatureManager.registerFeature(RowCopyPaste, false, 'Gantt');
GridFeatureManager.registerFeature(RowCopyPaste, false, 'SchedulerPro');
GridFeatureManager.registerFeature(RowCopyPaste, false, 'ResourceHistogram');
