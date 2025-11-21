import Column from './Column.js';
import ColumnStore from '../data/ColumnStore.js';
import DateHelper from '../../Core/helper/DateHelper.js';

/**
 * @module Grid/column/DateColumn
 */

/**
 * A column that displays a date in the specified {@link #config-format}. By default `L` format is used, which
 * contains the following info: full year, 2-digit month, and 2-digit day. Depending on the browser locale,
 * the formatted date might look different. [Intl.DateTimeFormat API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat)
 * is used to format the date. Here is an example of possible outputs depending on the browser locale:
 *
 * ```javascript
 * // These options represent `L` format
 * const options = { year : 'numeric', month : '2-digit', day : '2-digit' };
 *
 * new Intl.DateTimeFormat('en-US', options).format(new Date(2021, 6, 1)); // "07/01/2021"
 * new Intl.DateTimeFormat('ru-RU', options).format(new Date(2021, 6, 1)); // "01.07.2021"
 *
 * // Formatting using Bryntum API
 * LocaleManager.applyLocale('En');
 * DateHelper.format(new Date(2021, 6, 1), 'L'); // "07/01/2021"
 * LocaleManager.applyLocale('Ru');
 * DateHelper.format(new Date(2021, 6, 1), 'L'); // "01.07.2021"
 * ```
 *
 * To learn more about available formats check out {@link Core.helper.DateHelper} docs.
 *
 * The {@link Core.data.field.DateDataField field} this column reads data from should be a type of date.
 *
 * Default editor is a {@link Core.widget.DateField}.
 *
 * @extends Grid/column/Column
 *
 * @example
 * new Grid({
 *     columns : [
 *          { type: 'date', text: 'Start date', format: 'YYYY-MM-DD', field: 'start' }
 *     ]
 * });
 *
 * @classType date
 * @inlineexample Grid/column/DateColumn.js
 */
export default class DateColumn extends Column {
    static get $name() {
        return 'DateColumn';
    }

    //region Config

    static get type() {
        return 'date';
    }

    // Type to use when auto adding field
    static get fieldType() {
        return 'date';
    }

    static get fields() {
        return ['format', 'pickerFormat', 'step'];
    }

    static get defaults() {
        return {
            /**
             * The {@link Core.data.field.DateDataField#config-name} of the data model date field to read data from.
             * @config {String} field
             * @category Common
             */

            /**
             * Date format to convert a given date object into a string to display. By default `L` format is used, which
             * contains the following info: full year, 2-digit month, and 2-digit day. Depending on the browser locale,
             * the formatted date might look different. [Intl.DateTimeFormat API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat)
             * is used to format the date. Here is an example of possible outputs depending on the browser locale:
             *
             * ```javascript
             * // These options represent `L` format
             * const options = { year : 'numeric', month : '2-digit', day : '2-digit' };
             *
             * new Intl.DateTimeFormat('en-US', options).format(new Date(2021, 6, 1)); // "07/01/2021"
             * new Intl.DateTimeFormat('ru-RU', options).format(new Date(2021, 6, 1)); // "01.07.2021"
             *
             * // Formatting using Bryntum API
             * LocaleManager.applyLocale('En');
             * DateHelper.format(new Date(2021, 6, 1), 'L'); // "07/01/2021"
             * LocaleManager.applyLocale('Ru');
             * DateHelper.format(new Date(2021, 6, 1), 'L'); // "01.07.2021"
             * ```
             *
             * To learn more about available formats check out {@link Core.helper.DateHelper} docs.
             *
             * Note, the {@link Core.data.field.DateDataField field} this column reads data from should be a type of date.
             * @config {String}
             * @default
             * @category Common
             */
            format : 'L',

            /**
             * Time increment duration value to apply when clicking the left / right trigger icons. See {@link Core.widget.DateField#config-step} for more information
             * Set to `null` to hide the step triggers.
             * @config {String|Number|Object}
             * @default
             * @category Common
             */
            step : 1,

            minWidth : 85,

            filterType : 'date'
        };
    }

    //endregion

    //region Init

    constructor(config, store) {
        super(...arguments);

        this.internalCellCls = 'b-date-cell';
    }

    //endregion

    //region Display

    /**
     * Renderer that displays the date with the specified format. Also adds cls 'date-cell' to the cell.
     * @private
     */
    defaultRenderer({ value }) {
        return value ? this.formatValue(value) : '';
    }

    /**
     * Group renderer that displays the date with the specified format.
     * @private
     */
    groupRenderer({ cellElement, groupRowFor }) {
        cellElement.innerHTML = this.formatValue(groupRowFor);
    }

    //endregion

    //region Formatter

    /**
     * Used by both renderer and groupRenderer to do the actual formatting of the date
     * @private
     * @param value
     * @returns {String}
     */
    formatValue(value) {
        // Ideally we should be served a date, but if not make it easier for the user by parsing
        if (typeof value === 'string') {
            value = DateHelper.parse(value, this.format || undefined); // null does not use default format
        }
        return DateHelper.format(value, this.format || undefined);
    }

    //endregion

    //region Getters/setters

    /**
     * Get/Set format for date displayed in cell and editor (see {@link Core.helper.DateHelper#function-format-static} for formatting options)
     * @property {String}
     */
    set format(value) {
        const
            me     = this,
            editor = me.data.editor;

        me.set('format', value);
        if (editor) {
            editor.format = me.format;
        }
    }

    get format() {
        return this.get('format');
    }

    get defaultEditor() {
        const me = this;

        return {
            name                 : me.field,
            type                 : 'date',
            calendarContainerCls : 'b-grid-cell-editor-related',
            weekStartDay         : me.grid.weekStartDay,
            format               : me.format,
            step                 : me.step
        };
    }

    //endregion

}

ColumnStore.registerColumnType(DateColumn, true);
DateColumn.exposeProperties();
