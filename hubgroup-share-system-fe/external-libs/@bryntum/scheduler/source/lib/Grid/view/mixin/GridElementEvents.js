// We declare consts inside case blocks in this file.
/* eslint-disable no-case-declarations */

//TODO: Should it fire more own events instead and rely less on function chaining?

import Base from '../../../Core/Base.js';
import DomDataStore from '../../../Core/data/DomDataStore.js';
import DomHelper from '../../../Core/helper/DomHelper.js';
import Rectangle from '../../../Core/helper/util/Rectangle.js';
import EventHelper from '../../../Core/helper/EventHelper.js';
import StringHelper from '../../../Core/helper/StringHelper.js';
import ObjectHelper from '../../../Core/helper/ObjectHelper.js';
import BrowserHelper from '../../../Core/helper/BrowserHelper.js';

const gridBodyElementEventHandlers = {
    touchstart  : 'onElementTouchStart',
    touchmove   : 'onElementTouchMove',
    touchend    : 'onElementTouchEnd',
    mouseover   : 'onElementMouseOver',
    mouseout    : 'onElementMouseOut',
    mousedown   : 'onElementMouseDown',
    mousemove   : 'onElementMouseMove',
    mouseup     : 'onElementMouseUp',
    click       : 'onHandleElementClick',
    dblclick    : 'onElementDblClick',
    keydown     : 'onElementKeyDown',
    keyup       : 'onElementKeyUp',
    keypress    : 'onElementKeyPress',
    contextmenu : 'onElementContextMenu'
};

/**
 * @module Grid/view/mixin/GridElementEvents
 */

/**
 * Mixin for Grid that handles dom events. Some listeners fire own events but all can be chained by features. None of
 * the functions in this class are indented to be called directly.
 *
 * @mixin
 */
export default Target => class GridElementEvents extends (Target || Base) {
    static get $name() {
        return 'GridElementEvents';
    }

    //region Config

    static get configurable() {
        return {
            /**
             * Time in ms until a longpress is triggered
             * @config {Number}
             * @default
             * @category Events
             */
            longPressTime : 400,

            /**
             * Set to true to listen for CTRL-Z (CMD-Z on Mac OS) keyboard event and trigger undo (redo when SHIFT is pressed).
             * Only applicable when using a {@link Core.data.stm.StateTrackingManager}.
             * @config {Boolean}
             * @default
             * @category Events
             */
            enableUndoRedoKeys : true
        };
    }

    //endregion

    //region Events

    /**
     * Fired when user clicks in a grid cell
     * @event cellClick
     * @param {Grid.view.Grid} grid The grid instance
     * @param {Core.data.Model} record The record representing the row
     * @param {Grid.column.Column} column The column to which the cell belongs
     * @param {HTMLElement} cellElement The cell HTML element
     * @param {HTMLElement} target The target element
     * @param {MouseEvent} event The native DOM event
     */

    /**
     * Fired when user double clicks a grid cell
     * @event cellDblClick
     * @param {Grid.view.Grid} grid The grid instance
     * @param {Core.data.Model} record The record representing the row
     * @param {Grid.column.Column} column The column to which the cell belongs
     * @param {HTMLElement} cellElement The cell HTML element
     * @param {HTMLElement} target The target element
     * @param {MouseEvent} event The native DOM event
     */

    /**
     * Fired when user activates contextmenu in a grid cell
     * @event cellContextMenu
     * @param {Grid.view.Grid} grid The grid instance
     * @param {Core.data.Model} record The record representing the row
     * @param {Grid.column.Column} column The column to which the cell belongs
     * @param {HTMLElement} cellElement The cell HTML element
     * @param {HTMLElement} target The target element
     * @param {MouseEvent} event The native DOM event
     */

    /**
     * Fired when user moves the mouse over a grid cell
     * @event cellMouseOver
     * @param {Grid.view.Grid} grid The grid instance
     * @param {Core.data.Model} record The record representing the row
     * @param {Grid.column.Column} column The column to which the cell belongs
     * @param {HTMLElement} cellElement The cell HTML element
     * @param {HTMLElement} target The target element
     * @param {MouseEvent} event The native DOM event
     */

    /**
     * Fired when a user moves the mouse out of a grid cell
     * @event cellMouseOut
     * @param {Grid.view.Grid} grid The grid instance
     * @param {Core.data.Model} record The record representing the row
     * @param {Grid.column.Column} column The column to which the cell belongs
     * @param {HTMLElement} cellElement The cell HTML element
     * @param {HTMLElement} target The target element
     * @param {MouseEvent} event The native DOM event
     */

    //endregion

    //region Event handling

    /**
     * Init listeners for a bunch of dom events. All events are handled by handleEvent().
     * @private
     * @category Events
     */
    initInternalEvents() {
        const
            handledEvents = Object.keys(gridBodyElementEventHandlers),
            len           = handledEvents.length,
            listeners     = {
                element : this.bodyElement,
                thisObj : this
            };

        // Route all events through handleEvent, so that we can capture this.event
        // before we route to the handlers
        for (let i = 0; i < len; i++) {
            listeners[handledEvents[i]] = 'handleEvent';
        }

        EventHelper.on(listeners);

        EventHelper.on({
            focus   : 'onGridElementFocus',
            element : this.focusElement,
            thisObj : this
        });
    }

    /**
     * This method finds the cell location of the passed event. It returns an object describing the cell.
     * @param {Event} event A Mouse, Pointer or Touch event targeted at part of the grid.
     * @returns {Object} An object containing the following properties:
     * - `cellElement` - The cell element clicked on.
     * - `column` - The {@link Grid.column.Column column} clicked under.
     * - `columnId` - The `id` of the {@link Grid.column.Column column} clicked under.
     * - `record` - The {@link Core.data.Model record} clicked on.
     * - `id` - The `id` of the {@link Core.data.Model record} clicked on.
     * @internal
     * @category Events
     */
    getCellDataFromEvent(event) {
        const
            me          = this,
            cellElement = DomHelper.up(event.target, '.b-grid-cell');

        // There is a cell
        if (cellElement) {
            const
                cellData         = DomDataStore.get(cellElement),
                { id, columnId } = cellData,
                record           = me.store.getById(id),
                column           = me.columns.getById(columnId);

            // Row might not have a record, since we transition record removal
            // https://app.assembla.com/spaces/bryntum/tickets/6805
            return record ? {
                cellElement,
                cellData,
                columnId,
                id,
                record,
                column,
                cellSelector : { id, columnId }
            } : null;
        }
    }

    /**
     * This method finds the header location of the passed event. It returns an object describing the header.
     * @param {Event} event A Mouse, Pointer or Touch event targeted at part of the grid.
     * @returns {Object} An object containing the following properties:
     * - `headerElement` - The header element clicked on.
     * - `column` - The {@link Grid.column.Column column} clicked under.
     * - `columnId` - The `id` of the {@link Grid.column.Column column} clicked under.
     * @internal
     * @category Events
     */
    getHeaderDataFromEvent(event) {
        const headerElement = DomHelper.up(event.target, '.b-grid-header');

        // There is a header
        if (headerElement) {
            const
                headerData   = ObjectHelper.assign({}, headerElement.dataset),
                { columnId } = headerData,
                column       = this.columns.getById(columnId);

            return column ? {
                headerElement,
                headerData,
                columnId,
                column
            } : null;
        }
    }

    /**
     * Handles all dom events, routing them to correct functions (touchstart -> onElementTouchStart)
     * @param event
     * @private
     * @category Events
     */
    handleEvent(event) {
        if (!this.disabled) {

            if (gridBodyElementEventHandlers[event.type]) {
                this[gridBodyElementEventHandlers[event.type]](event);
            }
        }
    }

    //endregion

    //region Touch events

    /**
     * Touch start, chain this function in features to handle the event.
     * @param event
     * @category Touch events
     * @internal
     */
    onElementTouchStart(event) {
        const
            me       = this,
            cellData = me.getCellDataFromEvent(event);

        DomHelper.isTouchEvent = true;

        if (event.touches.length === 1) {
            me.longPressTimeout = me.setTimeout(() => {
                me.onElementLongPress(event);
                event.preventDefault();
                me.longPressPerformed = true;
            }, me.longPressTime);
        }

        if (cellData && !event.defaultPrevented) {
            me.onFocusGesture(cellData, event);
        }
    }

    /**
     * Touch move, chain this function in features to handle the event.
     * @param event
     * @category Touch events
     * @internal
     */
    onElementTouchMove(event) {
        const me = this;

        if (me.longPressTimeout) {
            me.clearTimeout(me.longPressTimeout);
            me.longPressTimeout = null;
        }
    }

    /**
     * Touch end, chain this function in features to handle the event.
     * @param event
     * @category Touch events
     * @internal
     */
    onElementTouchEnd(event) {
        const me = this;

        if (me.longPressPerformed) {
            if (event.cancelable) {
                event.preventDefault();
            }
            me.longPressPerformed = false;
        }

        if (me.longPressTimeout) {
            me.clearTimeout(me.longPressTimeout);
            me.longPressTimeout = null;
        }
    }

    onElementLongPress(event) {}

    //endregion

    //region Mouse events

    // Trigger events in same style when clicking, dblclicking and for contextmenu
    triggerCellMouseEvent(name, event) {
        const
            me       = this,
            cellData = me.getCellDataFromEvent(event);

        // There is a cell
        if (cellData) {
            const
                column    = me.columns.getById(cellData.columnId),
                eventData = {
                    grid         : me,
                    record       : cellData.record,
                    column,
                    cellSelector : cellData.cellSelector,
                    cellElement  : cellData.cellElement,
                    target       : event.target,
                    event
                };

            me.trigger('cell' + StringHelper.capitalize(name), eventData);

            if (name === 'click') {
                column.onCellClick?.(eventData);
            }
        }
    }

    /**
     * Mouse down, chain this function in features to handle the event.
     * @param event
     * @category Mouse events
     * @internal
     */
    onElementMouseDown(event) {
        const
            me       = this,
            cellData = me.getCellDataFromEvent(event);

        me.skipFocusSelection = true;

        // If click was on a scrollbar, preventDefault to not steal focus
        if (me.isScrollbarClick(event)) {
            event.preventDefault();
        }
        else {
            me.triggerCellMouseEvent('mousedown', event);

            // Browser event unification fires a mousedown on touch tap prior to focus.
            if (cellData && !event.defaultPrevented) {
                me.onFocusGesture(cellData, event);
            }
        }
    }

    isScrollbarClick({ target, x, y }) {
        if (target.matches('.b-vertical-overflow')) {
            const rect = target.getBoundingClientRect();
            return x > rect.right - DomHelper.scrollBarWidth;
        }
        else if (target.matches('.b-horizontal-overflow')) {
            const rect = target.getBoundingClientRect();
            return y > rect.bottom - DomHelper.scrollBarWidth;
        }
    }

    /**
     * Mouse move, chain this function in features to handle the event.
     * @param event
     * @category Mouse events
     * @internal
     */
    onElementMouseMove(event) {
        // Keep track of the last mouse position in case, due to OSX sloppy focusing,
        // focus is moved into the browser before a mousedown is delivered.
        // The cached mousemove event will provide the correct target in
        // GridNavigation#onGridElementFocus.
        this.mouseMoveEvent = event;
    }

    /**
     * Mouse up, chain this function in features to handle the event.
     * @param event
     * @category Mouse events
     * @internal
     */
    onElementMouseUp(event) {}

    /**
     * Called before {@link #function-onElementClick}.
     * Fires 'beforeElementClick' event which can return false to cancel further onElementClick actions.
     * @param event
     * @fires beforeElementClick
     * @category Mouse events
     * @internal
     */

    onHandleElementClick(event) {
        if (this.trigger('beforeElementClick', { event }) !== false) {
            this.onElementClick(event);
        }
    }

    /**
     * Click, select cell on click and also fire 'cellClick' event.
     * Chain this function in features to handle the dom event.
     * @param event
     * @fires cellClick
     * @category Mouse events
     * @internal
     */
    onElementClick(event) {
        const
            me       = this,
            cellData = me.getCellDataFromEvent(event);

        // There is a cell
        if (cellData) {
            me.triggerCellMouseEvent('click', event);

            // Clear hover styling when clicking in a row to avoid having it stick around if you keyboard navigate
            // away from it
            // https://app.assembla.com/spaces/bryntum/tickets/5848
            DomDataStore.get(cellData.cellElement).row.removeCls('b-hover');
        }
    }

    onFocusGesture(cellData, event) {
        //TODO: should be able to cancel focusCell from listeners
        if (cellData && !event.target.matches('.b-icon-tree-expand, .b-icon-tree-collapse')) {
            this.focusCell(cellData.cellSelector, {
                scroll   : false,
                doSelect : true,
                event
            });
        }
    }

    /**
     * Double click, fires 'cellDblClick' event.
     * Chain this function in features to handle the dom event.
     * @param {Event} event
     * @fires cellDblClick
     * @category Mouse events
     * @internal
     */
    onElementDblClick(event) {
        const { target } = event;

        this.triggerCellMouseEvent('dblClick', event);

        if (target.classList.contains('b-grid-header-resize-handle')) {
            const
                header = DomHelper.up(target, '.b-grid-header'),
                column = this.columns.getById(header.dataset.columnId);

            column.resizeToFitContent();
        }
    }

    /**
     * Mouse over, adds 'hover' class to elements.
     * @param event
     * @fires mouseOver
     * @category Mouse events
     * @internal
     */
    onElementMouseOver(event) {
        // bail out early if scrolling
        if (!this.scrolling) {
            const cellElement = DomHelper.up(event.target, '.b-grid-cell');

            if (cellElement) {
                const row = DomDataStore.get(cellElement).row;

                // No hover effect needed if a mouse button is pressed (like when resizing window, region, or resizing something etc).
                // NOTE: 'buttons' not supported in Safari
                if (row && (typeof event.buttons !== 'number' || event.buttons === 0)) {
                    this.hoveredRow = row;
                }

                this.triggerCellMouseEvent('mouseOver', event);
            }

            /**
             * Mouse moved in over element in grid
             * @event mouseOver
             * @param {MouseEvent} event The native browser event
             */
            this.trigger('mouseOver', { event });
        }
    }

    /**
     * Mouse out, removes 'hover' class from elements.
     * @param event
     * @fires mouseOut
     * @category Mouse events
     * @internal
     */
    onElementMouseOut(event) {
        this.hoveredRow = null;

        // bail out early if scrolling
        if (!this.scrolling) {
            const cellElement = DomHelper.up(event.target, '.b-grid-cell');

            if (cellElement) {
                this.triggerCellMouseEvent('mouseOut', event);
            }

            /**
             * Mouse moved out from element in grid
             * @event mouseOut
             * @param {MouseEvent} event The native browser event
             */
            this.trigger('mouseOut', { event });
        }
    }

    set hoveredRow(row) {
        const me = this;

        // Unhover
        if (me._hoveredRow && !me._hoveredRow.isDestroyed) {
            me._hoveredRow.removeCls('b-hover');
            me._hoveredRow = null;
        }

        // Hover
        if (row && !me.scrolling) {
            me._hoveredRow = row;
            row.addCls('b-hover');
        }
    }

    //endregion

    //region Keyboard events

    /**
     * Key down, handles arrow keys for selection.
     * Chain this function in features to handle the dom event.
     * @param event
     * @category Keyboard events
     * @internal
     */
    onElementKeyDown(event) {
        const
            me                                      = this,
            { target, currentTarget, ctrlKey, key } = event;

        // flagging event with handled = true used to signal that other features should probably not care about it.
        // for this to work you should specify overrides for onElementKeyDown to be run before this function
        // (see for example CellEdit feature)
        if (event.handled) return;

        // Read this to refresh cached reference in case this keystroke lead to the removal of current row
        const
            focusedCell = me.focusedCell,
            stm         = me.store.stm;

        if (stm && ctrlKey && key.toLowerCase() === 'z' && me.enableUndoRedoKeys && !me.features.cellEdit?.isEditing) {
            stm.onUndoKeyPress(event);
        }
        if (target.matches('.b-grid-header.b-depth-0')) {
            me.handleHeaderKeyDown(event);
        }
        else if (target === me.focusElement || (BrowserHelper.isIE11 && currentTarget === me.focusElement)) {
            // IE11 Browser check is not placed in EventHelper to maintain built-in delegated functionality
            me.handleViewKeyDown(event);

            // If a cell is focused and column is interested - call special callback
            if (focusedCell) {
                const
                    cellElement = focusedCell.element,
                    column      = me.columns.getById(cellElement.dataset.columnId);

                column.onCellKeyDown?.({ event, cellElement });

                // Trigger column.onCellClick when space bar is pressed
                if (key === ' ' && column.onCellClick) {
                    column.onCellClick({
                        grid   : me,
                        column,
                        record : me.store.getById(focusedCell.id),
                        cellElement,
                        target,
                        event
                    });
                }
            }
        }
        // If focus is *within* a cell (eg WidgetColumn or CheckColumn), jump up to focus the cell.
        else if (key === 'Escape' && me.isActionableLocation) {
            const focusedCellClone   = ObjectHelper.clone(focusedCell);
            focusedCellClone.element = null;
            me.focusCell(focusedCellClone);
            DomHelper.focusWithoutScrolling(me.element);
        }
    }

    handleViewKeyDown(event) {
        const me = this;

        switch (event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                return me.navigateLeft(event);
            case 'ArrowRight':
                event.preventDefault();
                return me.navigateRight(event);
            case 'ArrowUp':
                event.preventDefault();
                return me.navigateUp(event);
            case 'ArrowDown':
                event.preventDefault();
                return me.navigateDown(event);
        }
    }

    handleHeaderKeyDown(event) {
        const
            me     = this,
            column = me.columns.getById(event.target.dataset.columnId);

        column.onKeyDown && column.onKeyDown(event);

        switch (event.key) {
            case 'ArrowLeft':
                me.onHeaderLeftKey(column);
                break;

            case 'ArrowRight':
                me.onHeaderRightKey(column);
                break;

            case 'ArrowDown':
                event.preventDefault();
                me.onHeaderDownKey(column);
                break;

            case 'Enter':
                me.onHeaderEnterKey(column);
                break;
        }
    }

    onHeaderLeftKey(column) {
        const prev = this.columns.getAdjacentVisibleLeafColumn(column, false);

        if (prev) {
            this.getHeaderElement(prev.id).focus();
        }
    }

    onHeaderRightKey(column) {
        const next = this.columns.getAdjacentVisibleLeafColumn(column, true);

        if (next) {
            this.getHeaderElement(next.id).focus();
        }
    }

    onHeaderDownKey(column) {
        const row = this.firstFullyVisibleRow;

        if (row) {
            this.focusCell({
                columnId : column.id,
                id       : row.id
            });
        }
    }

    onHeaderEnterKey(column) {
        this.getHeaderElement(column.id).click();
    }

    /**
     * Key press, chain this function in features to handle the dom event.
     * @param event
     * @category Keyboard events
     * @internal
     */
    onElementKeyPress(event) {}

    /**
     * Key up, chain this function in features to handle the dom event.
     * @param event
     * @category Keyboard events
     * @internal
     */
    onElementKeyUp(event) {}

    //endregion

    //region Other events

    /**
     * Context menu, chain this function in features to handle the dom event.
     * In most cases, include ContextMenu feature instead.
     * @param event
     * @category Other events
     * @internal
     */
    onElementContextMenu(event) {
        const
            me       = this,
            cellData = me.getCellDataFromEvent(event);

        // There is a cell
        if (cellData) {
            me.triggerCellMouseEvent('contextMenu', event);

            // Focus on tap for touch events.
            // Selection follows from focus.
            if (DomHelper.isTouchEvent) {
                me.onFocusGesture(cellData, event);
            }
        }
    }

    /**
     * Overrides empty base function in View, called when view is resized.
     * @fires resize
     * @param element
     * @param width
     * @param height
     * @param oldWidth
     * @param oldHeight
     * @category Other events
     * @internal
     */
    onInternalResize(element, width, height, oldWidth, oldHeight) {
        const me = this;

        if (me._devicePixelRatio && me._devicePixelRatio !== window.devicePixelRatio) {
            // Pixel ratio changed, likely because of browser zoom. This affects the relative scrollbar width also
            DomHelper.resetScrollBarWidth();
        }

        me._devicePixelRatio = window.devicePixelRatio;
        // cache to avoid recalculations in the middle of rendering code (RowManger#getRecordCoords())
        me._bodyRectangle    = Rectangle.client(me.bodyContainer);

        super.onInternalResize(...arguments);

        if (height !== oldHeight) {
            me._bodyHeight = me.bodyContainer.offsetHeight;
            if (me.isPainted) {
                // initial height will be set from render(),
                // it reaches onInternalResize too early when rendering, headers/footers are not sized yet
                me.rowManager.initWithHeight(me._bodyHeight);
            }
        }
        me.refreshVirtualScrollbars();

        if (width !== oldWidth) {
            // Slightly delay to avoid resize loops.
            me.setTimeout(() => {
                if (!me.isDestroyed) {
                    me.updateResponsive(width, oldWidth);
                }
            }, 0);
        }
    }

    //endregion

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement thus.
    get widgetClass() {}
};
