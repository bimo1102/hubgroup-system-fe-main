//TODO: Handle date columns
//TODO: Icons to navigate between hits in the header? or in each cell?
//TODO: Icon to clear quickfind in header
//TODO: regex for valid key pressed?

import DomDataStore from '../../Core/data/DomDataStore.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import InstancePlugin from '../../Core/mixin/InstancePlugin.js';
import GridFeatureManager from '../feature/GridFeatureManager.js';
import BrowserHelper from '../../Core/helper/BrowserHelper.js';
import StringHelper from '../../Core/helper/StringHelper.js';

/**
 * @module Grid/feature/QuickFind
 */

/**
 * Feature that allows the user to search in a column by focusing a cell and typing. Navigate between hits using the
 * keyboard, [f3] or [ctrl]/[cmd] + [g] moves to next, also pressing [shift] moves to previous.
 *
 * This feature is <strong>disabled</strong> by default.
 *
 * @extends Core/mixin/InstancePlugin
 *
 * @example
 * // enable QuickFind
 * let grid = new Grid({
 *   features: {
 *     quickFind: true
 *   }
 * });
 *
 * // navigate to next hit programmatically
 * grid.features.quickFind.gotoNextHit();
 *
 * @demo Grid/quickfind
 * @classtype quickFind
 * @inlineexample Grid/feature/QuickFind.js
 * @feature
 */
export default class QuickFind extends InstancePlugin {
    //region Config

    static get $name() {
        return 'QuickFind';
    }

    static get defaultConfig() {
        return {
            mode : 'header',
            find : ''
        };
    }

    // Plugin configuration. This plugin chains some of the functions in Grid.
    static get pluginConfig() {
        return {
            chain : ['onElementKeyDown', 'onElementKeyPress', 'onCellNavigate']
        };
    }

    //endregion

    //region Init

    construct(grid, config) {
        this.grid = grid;

        super.construct(grid, config);
    }

    doDisable(disable) {
        if (disable) {
            this.clear();
        }

        super.doDisable(disable);
    }

    get store() {
        return this.grid.store;
    }

    //endregion

    //region Show/hide QuickFind

    /**
     * Shows a "searchfield" in the header. Triggered automatically when you have a cell focused and start typing.
     * @private
     */
    showQuickFind() {
        const
            me     = this,
            header = me.grid.getHeaderElement(me.columnId);

        if (header) {
            if (!me.headerField) {
                const [element, field, badge] = DomHelper.createElement({
                    tag       : 'div',
                    className : 'b-quick-hit-header',
                    children  : [
                        { tag : 'div', className : 'b-quick-hit-field' },
                        { tag : 'div', className : 'b-quick-hit-badge' }
                    ]
                }, true);

                if (me.mode === 'header') {
                    header.appendChild(element);
                }
                else {
                    element.className += ' b-quick-hit-mode-grid';
                    me.grid.element.appendChild(element);
                }

                me.headerField = {
                    header    : element,
                    field     : field,
                    badge     : badge,
                    colHeader : header
                };
            }

            me.headerField.field.innerHTML = me.find;
            me.headerField.badge.innerHTML = me.found.length;

            header.classList.add('b-quick-find-header');

            if (!me.renderListenerInitialized) {
                me.grid.rowManager.on({
                    rendercell : me.renderCell,
                    thisObj    : me
                });
                me.renderListenerInitialized = true;
            }
        }
    }

    /**
     * Hide the "searchfield" and remove highlighted hits. Called automatically when pressing [esc] or backspacing away
     * the keywords.
     * @private
     */
    hideQuickFind() {
        const
            me                    = this,
            { grid, headerField } = me;

        // rerender cells to remove quick-find markup
        for (const hit of (me.prevFound || me.found)) {
            const row = grid.getRowById(hit.id);
            if (row) {
                // Need to force replace quick finds markup
                row.forceInnerHTML = true;

                const cellElement = row.getCell(me.columnId);
                cellElement._content = null;
                row.renderCell({ cellElement, record : hit.data });

                row.forceInnerHTML = false;
            }
        }

        if (headerField) {
            headerField.header.parentNode.removeChild(headerField.header);
            headerField.colHeader.classList.remove('b-quick-find-header');
            me.headerField = null;
        }

        if (me.renderListenerInitialized) {
            grid.rowManager.un({ rendercell : me.renderCell }, me);
            me.renderListenerInitialized = false;
        }

        grid.trigger('hideQuickFind');
    }

    //endregion

    //region Search

    /**
     * Performs a search and highlights hits. If find is empty, QuickFind is closed.
     * @param {String} find Text to search for
     * @param {String} columnFieldOrId Column to search
     */
    search(find, columnFieldOrId = this.columnId) {
        const
            me       = this,
            { grid } = me,
            column   = grid.columns.getById(columnFieldOrId) || grid.columns.get(columnFieldOrId),
            found    = me.store.findByField(column.field, find);

        let  i = 1;

        Object.assign(me, {
            foundMap  : {},
            prevFound : me.found,
            found     : found,
            find      : find,
            columnId  : column.id
        });

        if (find) {
            me.showQuickFind();
        }
        else {
            me.hideQuickFind();
        }

        // clear old hits
        for (const cellElement of DomHelper.children(grid.element, '.b-quick-hit')) {
            //IE11 doesnt support this
            //cell.classList.remove('b-quick-hit', 'b-quick-hit-cell');
            cellElement.classList.remove('b-quick-hit');
            cellElement.classList.remove('b-quick-hit-cell');

            // rerender cell to remove quick-hit-text
            const row = DomDataStore.get(cellElement).row;
            // Cell caches its content for faster comparison, need to clear cache to have it rerendered
            cellElement._content = cellElement.lastDomConfig = null;

            // We need to clear the real content because if DomSync is being used
            // It will not work with QuickFind's extra, injected content.
            cellElement.innerHTML = '';
            row.renderCell({ cellElement });
        }

        if (!found) {
            return;
        }

        if (found.length > 0) {
            me.gotoClosestHit(grid.focusedCell, found);
        }

        // highlight hits for visible cells
        for (const hit of found) {
            me.foundMap[hit.id] = i++;

            const row = grid.getRowById(hit.data.id);
            row?.renderCell({ cellElement : row.getCell(column.id) });

            // limit highlighted hits
            if (i > 1000) {
                break;
            }
        }

        grid.trigger('quickFind', { find, found });
    }

    /**
     * Clears and closes QuickFind.
     */
    clear() {
        if (this.found?.length) {
            this.search('');
        }
    }

    /**
     * Number of results found
     * @type {Number}
     * @readonly
     */
    get foundCount() {
        return this.found?.length ?? 0;
    }

    /**
     * Found results (as returned by Store#findByField), an array in format { index: x, data: record }
     * @member {Object[]} found
     * @readonly
     */

    //endregion

    //region Navigation

    /**
     * Go to specified hit.
     * @param {Number} index
     */
    gotoHit(index) {
        const nextHit = this.found[index];

        if (nextHit) {
            this.grid.focusCell({
                columnId : this.columnId,
                id       : nextHit.id
            });
        }

        return !!nextHit;
    }

    gotoClosestHit(focusedCell, found) {
        const
            focusedIndex = focusedCell ? this.grid.store.indexOf(focusedCell.id) : 0,
            foundSorted  = found.slice().sort(
                (a, b) => Math.abs(a.index - focusedIndex) - Math.abs(b.index - focusedIndex)
            );

        this.gotoHit(found.indexOf(foundSorted[0]));
    }

    /**
     * Go to the first hit.
     */
    gotoFirstHit() {
        this.gotoHit(0);
    }

    /**
     * Go to the last hit.
     */
    gotoLastHit() {
        this.gotoHit(this.found.length - 1);
    }

    /**
     * Select the next hit, scrolling it into view. Triggered with [f3] or [ctrl]/[cmd] + [g].
     */
    gotoNextHit() {
        const
            me           = this,
            { grid }     = me,
            // start from focused cell, or if focus has left grid use lastFocusedCell
            currentId    = grid._focusedCell ? grid._focusedCell.id : grid.lastFocusedCell?.id,
            currentIndex = grid.store.indexOf(currentId) || 0,
            nextHit      = me.found.find(hit => hit.index > currentIndex);

        if (nextHit) {
            grid.focusCell({
                columnId : me.columnId,
                id       : nextHit.id
            });
        }
        else {
            me.gotoFirstHit();
        }
    }

    /**
     * Select the previous hit, scrolling it into view. Triggered with [shift] + [f3] or [shift] + [ctrl]/[cmd] + [g].
     */
    gotoPrevHit() {
        const
            me              = this,
            { grid, found } = me,
            currentId       = grid._focusedCell ? grid._focusedCell.id : grid.lastFocusedCell?.id,
            currentIndex    = grid.store.indexOf(currentId) || 0;

        let prevHit;

        if (!found.length) {
            return;
        }

        for (let i = found.length - 1; i--; i >= 0) {
            if (found[i].index < currentIndex) {
                prevHit = found[i];
                break;
            }
        }

        if (prevHit) {
            grid.focusCell({
                columnId : me.columnId,
                id       : prevHit.id
            });
        }
        else {
            me.gotoLastHit();
        }
    }

    //endregion

    //region Render

    /**
     * Called from SubGrid when a cell is rendered.
     * @private
     */
    renderCell(renderData) {
        const
            me          = this,
            cellElement = renderData.cellElement,
            foundMap    = me.columnId === renderData.column.id && me.foundMap?.[renderData.record.id];

        if (foundMap) {
            // Check also TreeColumn's special internal `shouldHtmlEncode` flag
            const htmlEncoded = renderData.column.htmlEncode || renderData.column.shouldHtmlEncode;

            // highlight cell
            cellElement.classList.add('b-quick-hit');

            // Special treatment of columns outputting HTML, just highlight whole cell
            if (!htmlEncoded) {
                cellElement.classList.add('b-quick-hit-cell');
            }
            else {
                // if features have added other stuff to the cell, value is in div.b-grid-cell-value
                // highlight in cell if found in innerHTML
                const inner = DomHelper.down(cellElement, '.b-grid-cell-value,.b-tree-cell-value') || cellElement;
                let html = StringHelper.encodeHtml(inner.innerText);
                const where = html?.toLowerCase().indexOf(me.find.toLowerCase());

                if (where > -1) {
                    const
                        end       = where + me.find.length,
                        casedFind = html.slice(where, end);

                    let spaceChar = '';

                    // Insert a space if matching char preceded by whitespace
                    if (html[where - 1] === ' ') {
                        spaceChar = '&nbsp;';
                    }

                    html            = html.slice(0, where) + `<span class="b-quick-hit-text">${spaceChar}${casedFind}</span>` + html.slice(end);
                    inner.innerHTML = html + `<div class="b-quick-hit-cell-badge">${foundMap}</div>`;
                }
                else {
                    cellElement.classList.add('b-quick-hit-cell');
                }
            }
        }
    }

    //endregion

    //region Events

    /**
     * Chained function called on grids keydown event. Handles backspace, escape, f3 and ctrl/cmd + g keys.
     * @private
     * @param event KeyboardEvent
     */
    onElementKeyDown(event) {
        const
            me            = this,
            filterFeature = me.grid.features.filter;

        // Only react to keystrokes on grid cell elements. IE11 gets event.target wrong compared to other browsers...
        if (me.disabled || DomHelper.up(event.target, BrowserHelper.isIE11 ? '.b-widget:not(.b-grid-subgrid):not(.b-grid)' : '.b-widget:not(.b-grid)')) {
            return;
        }

        if (me.find.length > 0) {
            // backspace
            if (event.key === 'Backspace') {
                event.preventDefault();
                me.find = me.find.substr(0, me.find.length - 1);
                me.search(me.find);
            }

            // escape
            else if (event.key === 'Escape') {
                event.preventDefault();
                me.find = '';
                me.search(me.find);
            }

            // F3 or CTRL+g
            else if (event.key === 'F3' || (event.key.toLowerCase() === 'g' && (event.ctrlKey || event.metaKey))) {
                event.preventDefault();
                if (event.shiftKey) {
                    me.gotoPrevHit();
                }
                else {
                    me.gotoNextHit();
                }
            }
            // Ctrl+Shift+F
            else if (filterFeature && me.columnId && me.foundCount && event.ctrlKey && event.shiftKey && event.key === 'F') {
                me.clear();
                filterFeature.showFilterEditor(me.grid.columns.getById(me.columnId), me.find);
            }
        }
    }

    /**
     * Chained function called on grids keypress event. Handles input for "searchfield".
     * @private
     * @param event
     */
    onElementKeyPress(event) {
        const
            me       = this,
            { grid } = me;

        // Only react to keystrokes on grid cell elements
        if (me.disabled || DomHelper.up(event.target, BrowserHelper.isIE11 ? '.b-widget:not(.b-grid-subgrid):not(.b-grid)' : '.b-widget:not(.b-grid)') || event.key === 'Enter') {
            return;
        }

        if (grid._focusedCell) {
            const column = grid.columns.getById(grid._focusedCell.columnId);
            // if trying to search in invalid column, it's a hard failure
            //<debug>
            console.assert(column, 'Focused cell column not found');
            //</debug>
            if (column && column.searchable !== false) {
                me.columnId = grid._focusedCell.columnId;

                if (event.key?.length === 1) {
                    me.find += event.key;
                    me.search(me.find);
                }
            }
        }
    }

    onCellNavigate(grid, fromCellSelector, toCellSelector) {
        const
            me    = this,
            found = me.prevFound || me.found;

        if (found && (!toCellSelector || toCellSelector.columnId !== me.columnId)) {
            me.clear();
        }
    }

    //endregion
}

GridFeatureManager.registerFeature(QuickFind);
