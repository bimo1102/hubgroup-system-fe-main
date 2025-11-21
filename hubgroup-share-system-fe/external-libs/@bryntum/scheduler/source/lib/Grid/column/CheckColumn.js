import StringHelper from '../../Core/helper/StringHelper.js';
import ColumnStore from '../data/ColumnStore.js';
import WidgetColumn from './WidgetColumn.js';
import Checkbox from '../../Core/widget/Checkbox.js';

/**
 * @module Grid/column/CheckColumn
 */

/**
 * A column that displays a checkbox in the cell. The value of the backing field is toggled by the checkbox.
 *
 * This column uses a {@link Core.widget.Checkbox checkbox} as its editor, and it is not intended to be changed.
 * If you want to hide certain checkboxes, you can use the {@link #config-renderer} method to access the checkbox widget
 * as it is being rendered.
 *
 * @extends Grid/column/WidgetColumn
 *
 * @example
 * new Grid({
 *     appendTo : document.body,
 *
 *     columns : [
 *         {
 *              type: 'check',
 *              field: 'allow',
 *              // In the column renderer, we get access to the record and CheckBox widget
 *              renderer({ record, widgets }) {
 *                  // Hide checkboxes in certain rows
 *                  widgets[0].hidden = record.readOnly;
 *              }
 *         }
 *     ]
 * });
 *
 * @classType check
 * @inlineexample Grid/column/CheckColumn.js
 */
export default class CheckColumn extends WidgetColumn {
    //region Config

    static get type() {
        return 'check';
    }

    static get fields() {
        return ['checkCls', 'showCheckAll', 'onAfterWidgetSetValue', 'onBeforeWidgetSetValue'];
    }

    static get defaults() {
        return {
            align : 'center',

            /**
             * CSS class name to add to checkbox
             * @config {String}
             * @category Rendering
             */
            checkCls : null,

            /**
             * True to show a checkbox in the column header to be able to select/deselect all rows
             * @config {Boolean}
             */
            showCheckAll : false,

            widgets : [{
                type          : 'checkbox',
                valueProperty : 'checked'
            }]
        };
    }

    construct(config, store) {
        super.construct(...arguments);

        const me = this;

        me.externalHeaderRenderer = me.headerRenderer;
        me.externalOnBeforeWidgetSetValue = me.onBeforeWidgetSetValue;
        me.externalOnAfterWidgetSetValue = me.onAfterWidgetSetValue;

        me.onBeforeWidgetSetValue = me.internalOnBeforeWidgetSetValue;
        me.onAfterWidgetSetValue = me.internalOnAfterWidgetSetValue;
        me.headerRenderer = me.internalHeaderRenderer;

        me.internalCellCls = 'b-check-cell';

        me.grid?.on({
            destroy : () => me.headerCheckbox?.destroy(),
            thisObj : me
        });
    }

    internalHeaderRenderer({ headerElement, column }) {
        let returnValue;

        headerElement.classList.add('b-check-header');

        if (column.showCheckAll) {
            headerElement.classList.add('b-check-header-with-checkbox');

            if (column.headerCheckbox) {
                headerElement.appendChild(column.headerCheckbox.element);
            }
            else {
                column.headerCheckbox = new Checkbox({
                    appendTo  : headerElement,
                    owner     : this.grid,
                    listeners : {
                        change : ({ checked }) => {
                            /**
                             * Fired when the header checkbox is clicked to toggle its checked status.
                             * @event toggleAll
                             * @param {Grid.column.CheckColumn} source This Column
                             * @param {Boolean} checked The checked status of the header checkbox.
                             */
                            column.trigger('toggleAll', { checked });
                        }
                    }
                });
            }
        }
        else {
            returnValue = column.headerText;
        }

        returnValue = column.externalHeaderRenderer ? column.externalHeaderRenderer.call(this, ...arguments) : returnValue;

        return column.showCheckAll ? undefined : returnValue;
    }

    updateCheckAllState(value) {
        if (this.headerCheckbox) {
            this.suspendEvents();
            this.headerCheckbox.checked = value;
            this.resumeEvents();
        }
    }
    //endregion

    internalRenderer({ value, isExport }) {
        if (isExport) {
            return value == null ? '' : value;
        }
        return super.internalRenderer(...arguments);
    }

    //region Widget rendering

    onBeforeWidgetCreate(widgetCfg, event) {
        widgetCfg.cls = this.checkCls;
    }

    onAfterWidgetCreate(widget, event) {
        event.cellElement.widget = widget;

        widget.on({
            beforeChange : 'onBeforeCheckboxChange',
            change       : 'onCheckboxChange',
            thisObj      : this
        });
    }

    internalOnBeforeWidgetSetValue(widget) {
        widget.record     = widget.cellInfo.record;
        this.isInitialSet = true;
        this.externalOnBeforeWidgetSetValue?.(...arguments);
    }

    internalOnAfterWidgetSetValue(widget) {
        this.isInitialSet = false;
        this.externalOnAfterWidgetSetValue?.(...arguments);
    }

    //endregion

    //region Events

    onBeforeCheckboxChange({ source, checked }) {
        if (!this.isInitialSet) {
            /**
             * Fired when a cell is clicked to toggle its checked status. Returning `false` will prevent status change.
             * @event beforeToggle
             * @param {Grid.column.Column} source This Column
             * @param {Core.data.Model} record The record for the row containing the cell.
             * @param {Boolean} checked The new checked status of the cell.
             */
            return this.trigger('beforeToggle', { record : source.cellInfo.record, checked });
        }
    }

    onCheckboxChange({ source, checked }) {
        if (!this.isInitialSet) {
            const
                record = source.cellInfo.record,
                field  = this.field;

            if (field) {
                const setterName = `set${StringHelper.capitalize(field)}`;
                if (record[setterName]) {
                    record[setterName](checked);
                }
                else {
                    record.set(field, checked);
                }
            }

            /**
             * Fired when a cell is clicked to toggle its checked status.
             * @event toggle
             * @param {Grid.column.Column} source This Column
             * @param {Core.data.Model} record The record for the row containing the cell.
             * @param {Boolean} checked The new checked status of the cell.
             */
            this.trigger('toggle', { record, checked });
        }
    }

    //endregion

    onCellKeyDown({ event, cellElement }) {
        // SPACE key toggles the checkbox
        if (event.key === ' ') {
            const checkbox = cellElement.widget;

            checkbox?.toggle();

            // Prevent native browser scrolling
            event.preventDefault();
        }
    }
}

ColumnStore.registerColumnType(CheckColumn, true);
