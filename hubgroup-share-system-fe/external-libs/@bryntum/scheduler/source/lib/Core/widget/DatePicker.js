import CalendarPanel from './CalendarPanel.js';
import DateHelper from '../helper/DateHelper.js';
import EventHelper from '../helper/EventHelper.js';
import Combo from './Combo.js';
import VersionHelper from '../helper/VersionHelper.js';

const
    generateMonthNames = () => DateHelper.getMonthNames().map((m, i) => [i, m]),
    yearItems          = [],
    middle             = new Date().getFullYear();

for (let y = middle - 20; y < middle + 21; y++) {
    yearItems.push(y);
}

class ReadOnlyCombo extends Combo {
    static get $name() {
        return 'ReadOnlyCombo';
    }

    static get type() {
        return 'readonlycombo';
    }

    static get configurable() {
        return {
            editable        : false,
            inputAttributes : {
                tag      : 'div',
                tabIndex : -1
            },
            highlightExternalChange : false,
            triggers                : {
                expand : false
            },
            picker : {
                align : {
                    align     : 't-b',
                    axisLock  : true,
                    matchSize : false
                },
                cls        : 'b-readonly-combo-list',
                scrollable : {
                    overflowX : false
                }
            }
        };
    }

    onSelect({ record }) {
        this.value = record.value;
    }

    set value(value) {
        super.value = value;
        this.input.innerHTML = this.input.value;
    }

    get value() {
        return super.value;
    }
}

ReadOnlyCombo.initClass();

/**
 * @module Core/widget/DatePicker
 */

/**
 * A Panel which can display a month of date cells, which navigates between the cells,
 * fires events upon user selection actions, optionally navigates to other months
 * in response to UI gestures, and optionally displays information about each date cell.
 *
 * This class is used by the {@link Core.widget.DateField} class.
 *
 * {@inlineexample Core/widget/DatePicker.js}
 *
 * ## Custom cell rendering
 * You can easily control the content of each date cell using the {@link #config-cellRenderer}. The example below shows a view
 * typically seen when booking hotel rooms or apartments.
 *
 * {@inlineexample Core/widget/DatePickerCellRenderer.js}
 *
 * @classtype datepicker
 * @extends Core/widget/CalendarPanel
 */
export default class DatePicker extends CalendarPanel {
    static get $name() {
        return 'DatePicker';
    }

    // Factoryable type name
    static get type() {
        return 'datepicker';
    }

    static get delayable() {
        return {
            refresh : 'raf'
        };
    }

    static get configurable() {
        return {
            /**
             * The date that the user has navigated to using the UI *prior* to setting the widget's
             * value by selecting.
             *
             * This may be changed using keyboard navigation. The {@link Core.widget.CalendarPanel#property-date} is set
             * by pressing `ENTER` when the desired date is reached.
             *
             * Programmatically setting the {@link Core.widget.CalendarPanel#config-date}, or using the UI to select the date
             * by clicking it also sets the `activeDate`
             * @config {Date}
             */
            activeDate : {
                value   : null,
                $config : {
                    equal : 'date'
                }
            },

            focusable   : true,
            textContent : false,
            tbar        : {
                overflow : null,
                items    : [
                    {
                        ref      : 'prevMonth',
                        cls      : 'b-icon b-icon-prev',
                        onAction : 'up.gotoPrevMonth'
                    },
                    {
                        type        : 'container',
                        flex        : 1,
                        defaultType : 'readonlycombo',
                        cls         : 'b-datepicker-title',
                        items       : [
                            {
                                ref       : 'monthField',
                                cls       : 'b-datepicker-monthfield',
                                items     : generateMonthNames(),
                                listeners : {
                                    select : 'up.onMonthPicked'
                                }
                            },
                            {
                                ref       : 'yearField',
                                cls       : 'b-datepicker-yearfield',
                                items     : yearItems,
                                listeners : {
                                    select : 'up.onYearPicked'
                                }
                            }
                        ]
                    },
                    {
                        ref      : 'nextMonth',
                        cls      : 'b-icon b-icon-next',
                        onAction : 'up.gotoNextMonth'
                    }
                ]
            },

            /**
             * The initially selected date.
             * @config {Date}
             * @default
             */
            date : new Date(),

            /**
             * The minimum selectable date. Selection of and navigation to dates prior
             * to this date will not be possible.
             * @config {Date}
             */
            minDate : {
                value   : null,
                $config : {
                    equal : 'date'
                }
            },

            /**
             * The maximum selectable date. Selection of and navigation to dates after
             * this date will not be possible.
             * @config {Date}
             */
            maxDate : {
                value   : null,
                $config : {
                    equal : 'date'
                }
            },

            /**
             * By default, disabled dates cannot be navigated to, and they are skipped over
             * during keyboard navigation. Configure this as `true` to enable navigation to
             * disabled dates.
             * @config {Boolean}
             * @default
             */
            focusDisabledDates : null,

            /**
             * Configure as `true` to enable selecting a single date range by selecting a
             * start and end date. Hold "SHIFT" button to select date range.
             * @config {Boolean}
             * @default
             */
            multiSelect : false,

            /**
             * DEPRECATED - This config is no longer used
             * @deprecated 5.0.0
             * @config {Boolean}
             * @default
             */
            editOnHover : true,

            /**
             * By default, the month and year are editable. Configure this as `false` to prevent that.
             * @config {Boolean}
             * @default
             */
            editMonth : true,

            /**
             * The {@link Core.helper.DateHelper DateHelper} format string to format the day names.
             * @config {String}
             * @default
             */
            dayNameFormat : 'dd'
        };
    }

    static get prototypeProperties() {
        return {
            /**
             * The class name to add to the calendar cell whose date which is outside of the
             * {@link #config-minDate}/{@link #config-maxDate} range.
             * @config {String}
             * @private
             */
            outOfRangeCls : 'b-out-of-range',

            /**
             * The class name to add to the currently focused calendar cell.
             * @config {String}
             * @private
             */
            activeCls : 'b-active-date',

            /**
             * The class name to add to selected calendar cells.
             * @config {String}
             * @private
             */
            selectedCls : 'b-selected-date'
        };
    }

    /**
     * Fires when a date is selected. If {@link #config-multiSelect} is specified, this
     * will fire upon deselection and selection of dates.
     * @event selectionChange
     * @param {Date[]} selection The selected date. If {@link #config-multiSelect} is specified
     * this may be a two element array specifying start and end dates.
     * @param {Boolean} userAction This will be `true` if the change was caused by user interaction
     * as opposed to programmatic setting.
     */

    /* ...disconnect doc comment above from method below... */

    // region Init

    construct(config) {
        const
            me = this;

        if (config.editOnHover) {
            VersionHelper.deprecate('Grid', '5.0.0', '`editOnHover` config deprecated, it now has no effect and will be removed in 5.0');
        }

        me.selection = config.date ? [config.date] : [];
        super.construct(config);

        me.externalCellRenderer = me.cellRenderer;
        me.cellRenderer         = me.internalCellRenderer;

        me.element.setAttribute('aria-activedescendant', `${me.id}-active-day`);

        EventHelper.on({
            element  : me.weeksElement,
            click    : 'onCellClick',
            delegate : `.${me.dayCellCls}:not(.${me.disabledCls}):not(.${me.outOfRangeCls})`,
            thisObj  : me
        });

        me.widgetMap.monthField.readOnly = me.widgetMap.yearField.readOnly = !me.editMonth;
    }

    doDestroy() {
        this.yearField?.destroy();
        this.monthField?.destroy();
        super.doDestroy();
    }

    // endregion

    get focusElement() {
        return this.element;
    }

    internalCellRenderer({ cell, date }) {
        const me = this,
            { activeCls, selectedCls } = me,
            cellClassList = cell.classList;

        cell.innerHTML = date.getDate();
        cell.setAttribute('aria-label', DateHelper.format(date, 'MMMM D, YYYY'));

        if (me.isActiveDate(date)) {
            cellClassList.add(activeCls);
            cell.id = `${me.id}-active-day`;
        }
        else {
            cell.removeAttribute('id');
        }

        if (me.isSelectedDate(date)) {
            cellClassList.add(selectedCls);
        }
        if (me.minDate && date < me.minDate) {
            cellClassList.add(me.outOfRangeCls);
        }
        else if (me.maxDate && date > me.maxDate) {
            cellClassList.add(me.outOfRangeCls);
        }

        me.externalCellRenderer?.(...arguments);
    }

    onCellClick(event) {
        const cell = event.target.closest('[data-date]');
        this.onUIDateSelect(DateHelper.parseKey(cell.dataset.date), event);
    }

    /**
     * Called when the user uses the UI to select the current activeDate. So ENTER when focused
     * or clicking a date cell.
     * @param {Date} date The active date to select
     * @param {Event} event the instigating event, either a `click` event or a `keydown` event.
     * @internal
     */
    onUIDateSelect(date, event) {
        const me = this,
            { lastClickedDate, selection } = me;

        me.activeDate = date;
        me.lastClickedDate = date;

        if (!me.isDisabledDate(date)) {
            me.activatingEvent = event;

            // Handle multi selecting.
            // * single contiguous date range, eg: an event start and end
            // * multiple discontiguous ranges
            if (me.multiSelect) {
                if (me.multiRange) {
                    // TODO: multiple date ranges
                }
                else if (!lastClickedDate || date.getTime() !== lastClickedDate.getTime()) {
                    if (lastClickedDate && event.shiftKey) {
                        selection[1] = date;
                        selection.sort();
                    }
                    else {
                        selection.length = 0;
                        selection[0] = date;
                    }

                    me.trigger('selectionChange', {
                        selection,
                        userAction : Boolean(event)
                    });
                }
            }
            else {
                if (!me.value || me.value.getTime() !== date.getTime()) {
                    me.value = date;
                }
                else if (me.floating) {
                    me.hide();
                }
            }

            me.activatingEvent = null;
        }

        // Ensure the b-selected-date class is on the correct cell(s).
        me.refresh();
    }

    onInternalKeyDown(keyEvent) {
        const
            me         = this,
            keyName    = keyEvent.key.trim() || keyEvent.code,
            activeDate = me.activeDate;

        let newDate    = new Date(activeDate);

        if (keyName === 'Escape' && me.floating) {
            return me.hide();
        }

        // Only navigate if not focused on one of our child widgets.
        // We have a prevMonth and nextMonth tool and possibly month and year pickers.
        if (activeDate && keyEvent.target === me.focusElement) {
            do {
                switch (keyName) {
                    case 'ArrowLeft':
                        // Disable browser use of this key.
                        // Ctrl+ArrowLeft navigates back.
                        // ArrowLeft scrolls if there is horizontal scroll.
                        keyEvent.preventDefault();

                        if (keyEvent.ctrlKey) {
                            newDate = me.gotoPrevMonth();
                        }
                        else {
                            newDate.setDate(newDate.getDate() - 1);
                        }
                        break;
                    case 'ArrowUp':
                        // Disable browser use of this key.
                        // ArrowUp scrolls if there is vertical scroll.
                        keyEvent.preventDefault();

                        newDate.setDate(newDate.getDate() - 7);
                        break;
                    case 'ArrowRight':
                        // Disable browser use of this key.
                        // Ctrl+ArrowRight navigates forwards.
                        // ArrowRight scrolls if there is horizontal scroll.
                        keyEvent.preventDefault();

                        if (keyEvent.ctrlKey) {
                            newDate = me.gotoNextMonth();
                        }
                        else {
                            newDate.setDate(newDate.getDate() + 1);
                        }
                        break;
                    case 'ArrowDown':
                        // Disable browser use of this key.
                        // ArrowDown scrolls if there is vertical scroll.
                        keyEvent.preventDefault();

                        newDate.setDate(newDate.getDate() + 7);
                        break;
                    case 'Enter':
                        return me.onUIDateSelect(activeDate, keyEvent);
                }
            } while (me.isDisabledDate(newDate) && !me.focusDisabledDates);

            // Don't allow navigation to outside of date bounds.
            if (me.minDate && newDate < me.minDate) {
                return;
            }
            if (me.maxDate && newDate > me.maxDate) {
                return;
            }
            me.activeDate = newDate;
        }
    }

    changeMinDate(minDate) {
        return minDate ? this.changeDate(minDate) : null;
    }

    updateMinDate() {
        this.refresh();
    }

    changeMaxDate(maxDate) {
        return maxDate ? this.changeDate(maxDate) : null;
    }

    updateMaxDate() {
        this.refresh();
    }

    updateDate(date) {
        super.updateDate(date);
        this.activeDate = date;
    }

    changeActiveDate(activeDate) {
        activeDate =  activeDate ? this.changeDate(activeDate) : this.date || (this.date = DateHelper.clearTime(new Date()));

        if (isNaN(activeDate)) {
            throw new Error('DatePicker date ingestion must be passed a Date, or a YYYY-MM-DD date string');
        }

        return activeDate;
    }

    updateActiveDate(activeDate) {
        // Month's date setter protects it from non-changes.
        this.month.date                 = activeDate;
        this.widgetMap.monthField.value = activeDate.getMonth();
        this.widgetMap.yearField.value  = activeDate.getFullYear();
        // Must refresh so that the active cell gets a refresh.
        this.refresh();
    }

    set value(value) {
        const me = this,
            { selection } = me;

        let changed;

        if (value) {
            value = me.changeDate(value, me.value);

            // Undefined return value means no change
            if (value === undefined) {
                return;
            }

            if (!me.value || value.getTime() !== me.value.getTime()) {
                selection.length = 0;
                selection[0] = value;
                changed = true;
            }
            me.date = value;
        }
        else {
            changed = selection.length;
            selection.length = 0;

            // Clearing the value - go to today's calendar
            me.date = new Date();
        }

        if (changed) {
            me.trigger('selectionChange', {
                selection,
                userAction : Boolean(me.activatingEvent)
            });
        }
    }

    get value() {
        return this.selection[this.selection.length - 1];
    }

    gotoPrevMonth() {
        const
            me                  = this,
            { activeDate }      = me,
            // Navigate from the activeDate if the activeDate is in the UI.
            baseDate            = activeDate && me.getCell(activeDate) ? activeDate : me.date,
            newDate             = DateHelper.add(baseDate, -1, 'month'),
            lastDateOfPrevMonth = new Date(baseDate).setDate(0);

        if (!me.minDate || lastDateOfPrevMonth >= me.minDate) {
            return me.date = newDate;
        }
    }

    gotoNextMonth() {
        const
            me             = this,
            { activeDate } = me,
            // Navigate from the activeDate if the activeDate is in the UI.
            baseDate       = activeDate && me.getCell(activeDate) ? activeDate : me.date,
            newDate = DateHelper.add(baseDate, 1, 'month'),
            firstDateOfNextMonth = new Date(newDate).setDate(1);

        if (!me.maxDate || firstDateOfNextMonth <= me.maxDate) {
            return me.date = newDate;
        }
    }

    isActiveDate(date) {
        return this.activeDate && this.changeDate(date).getTime() === this.activeDate.getTime();
    }

    isSelectedDate(date) {
        return this.selection.some(d => DateHelper.isEqual(d, date, 'day'));
    }

    onMonthPicked({ record }) {
        this.activeDate = DateHelper.add(this.activeDate, record.value - this.activeDate.getMonth(), 'month');
        this.focusElement.focus();
    }

    onYearPicked({ record }) {
        const newDate = new Date(this.activeDate);

        newDate.setFullYear(record.value);

        this.activeDate = newDate;
        this.focusElement.focus();
    }

    get yearItems() {
        const
            result = [],
            middle = new Date().getFullYear();

        for (let y = middle - 20; y < middle + 21; y++) {
            result.push(y);
        }

        return result;
    }

    updateLocalization() {
        const
            monthField = this.widgetMap.monthField,
            newData    = generateMonthNames();

        newData[monthField.value].selected = true;
        monthField.items = newData;

        super.updateLocalization();
    }
}

// Register this widget type with its Factory
DatePicker.initClass();
