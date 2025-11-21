import Column from '../../Grid/column/Column.js';
import ColumnStore from '../../Grid/data/ColumnStore.js';

/**
 * @module Scheduler/column/ResourceCollapseColumn
 */

/**
 * A column toggling the resource {@link Scheduler.model.ResourceModel#field-eventLayout} between `none` and `stack`.
 *
 * @inlineexample Scheduler/column/ResourceCollapseColumn.js
 * @classType resourceCollapse
 * @extends Grid/column/Column
 */
export default class ResourceCollapseColumn extends Column {

    static get $name() {
        return 'ResourceCollapseColumn';
    }

    static get type() {
        return 'resourceCollapse';
    }

    static get defaults() {
        return {
            /** @hideconfigs renderer */
            width     : '3em',
            align     : 'center',
            sortable  : false,
            groupable : false,
            editor    : false,
            minWidth  : 0,
            cellCls   : 'b-resourcecollapse-cell',
            renderer  : ({ record }) => ({
                tag   : 'i',
                class : {
                    'b-icon'                 : 1,
                    'b-icon-expand-resource' : 1,
                    'b-flip'                 : record.eventLayout !== 'none'
                }
            })
        };
    }

    onCellClick({ record, event }) {
        // Prevent native scrolling on space key press
        event.preventDefault();
        record.eventLayout = record.eventLayout !== 'none' ? 'none' : 'stack';
    }
}

ColumnStore.registerColumnType(ResourceCollapseColumn);
