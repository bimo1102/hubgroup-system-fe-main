import Base from '../../Core/Base.js';
import DomDataStore from '../../Core/data/DomDataStore.js';
import BrowserHelper from '../../Core/helper/BrowserHelper.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import DomSync from '../../Core/helper/DomSync.js';
import Delayable from '../../Core/mixin/Delayable.js';
import DomClassList from '../../Core/helper/util/DomClassList.js';

/**
 * @module Grid/row/Row
 */

/**
 * Represents a single rendered row in the grid. Consists of one row element for each SubGrid in use. The grid only
 * creates as many rows as needed to fill the current viewport (and a buffer). As the grid scrolls
 * the rows are repositioned and reused, there is not a one to one relation between rows and records.
 *
 * For normal use cases you should not have to use this class directly. Rely on using renderers instead.
 * @extends Core/Base
 */
export default class Row extends Delayable(Base) {
    static get configurable() {
        return {
            /**
             * @member {Core.helper.util.DomClassList|Object} cls
             * When __read__, this a {@link Core.helper.util.DomClassList DomClassList} of class names to be
             * applied to this Row's elements.
             *
             * It can be __set__ using Object notation where each property name with a truthy value is added as
             * a class, or as a regular space-separated string.
             */
            /**
             * The class name to initially add to all row elements
             * @config {String|Core.helper.util.DomClassList|Object}
             */
            cls : {
                $config : {
                    equal : (c1, c2) => c1?.isDomClassList && c2?.isDomClassList && c1.isEqual(c2)
                },
                value : 'b-grid-row'
            }
        };
    }

    //region Init

    /**
     * Constructs a Row setting its index.
     * @param {Object} config A configuration object which must contain the following two properties:
     * @param {Grid.view.Grid} config.grid The owning Grid.
     * @param {Grid.row.RowManager} config.rowManager The owning RowManager.
     * @param {Number} config.index The index of the row within the RowManager's cache.
     * @function constructor
     * @internal
     */
    construct(config) {
        // Set up defaults and properties
        Object.assign(this, {
            _elements      : {},
            _elementsArray : [],
            _cells         : {},
            _allCells      : [],
            _regions       : [],
            lastHeight     : 0,
            lastTop        : -1,
            _dataIndex     : 0,
            _top           : 0,
            _height        : 0,
            _id            : null,
            forceInnerHTML : false,
            isGroupFooter  : false
        }, config);

        super.construct();
    }

    doDestroy() {
        const me = this;

        // No need to clean elements up if the entire thing is being destroyed
        if (!me.rowManager.isDestroying) {
            me.removeElements();

            if (me.rowManager.idMap[me.id] === me) {
                delete me.rowManager.idMap[me.id];
            }

        }

        super.doDestroy();
    }

    //endregion

    //region Data getters/setters

    /**
     * Get index in RowManagers rows array
     * @property {Number}
     * @readonly
     */
    get index() {
        return this._index;
    }

    set index(index) {
        this._index = index;
    }

    /**
     * Get/set this rows current index in grids store
     * @property {Number}
     */
    get dataIndex() {
        return this._dataIndex;
    }

    set dataIndex(dataIndex) {
        if (this._dataIndex !== dataIndex) {
            this._dataIndex = dataIndex;
            this.eachElement(element => element.dataset.index = dataIndex);
        }
    }

    /**
     * Get/set id for currently rendered record
     * @property {String|Number}
     */
    get id() {
        return this._id;
    }

    set id(id) {
        const
            me    = this,
            idObj = { id },
            idMap = me.rowManager.idMap;

        if (me._id !== id || idMap[id] !== me) {
            if (idMap[me._id] === me) delete idMap[me._id];
            idMap[id] = me;

            me._id = id;
            me.eachElement(element => {
                DomDataStore.assign(element, idObj);
                element.dataset.id = id;
            });
            me.eachCell(cell => DomDataStore.assign(cell, idObj));
        }
    }

    //endregion

    //region Row elements

    /**
     * Add a row element for specified region.
     * @param {String} region Region to add element for
     * @param {HTMLElement} element Element
     * @private
     */
    addElement(region, element) {
        const me = this;

        let cellElement = element.firstElementChild;

        me._elements[region] = element;
        me._elementsArray.push(element);
        me._regions.push(region);
        DomDataStore.assign(element, { index : me.index });

        me._cells[region] = [];

        while (cellElement) {
            me._cells[region].push(cellElement);
            me._allCells.push(cellElement);

            DomDataStore.set(cellElement, {
                column     : cellElement.dataset.column, // TODO: dataset is slow, read from columnstore using index instead
                columnId   : cellElement.dataset.columnId,
                rowElement : cellElement.parentNode,
                row        : me
            });

            cellElement = cellElement.nextElementSibling;
        }

        // making css selectors simpler, dataset has bad performance but it is only set once and never read
        element.dataset.index = me.index;
    }

    /**
     * Get the element for the specified region.
     * @param {String} region
     * @returns {HTMLElement}
     */
    getElement(region) {
        return this._elements[region];
    }

    /**
     * Execute supplied function for each regions element.
     * @param {Function} fn
     */
    eachElement(fn) {
        this._elementsArray.forEach(fn);
    }

    /**
     * Execute supplied function for each cell.
     * @param {Function} fn
     */
    eachCell(fn) {
        this._allCells.forEach(fn);
    }

    /**
     * Row elements (one for each region)
     * @type {HTMLElement[]}
     * @readonly
     */
    get elements() {
        return this._elements;
    }

    //endregion

    //region Cell elements

    /**
     * Row cell elements
     * @property {HTMLElement[]}
     * @readonly
     */
    get cells() {
        return this._allCells;
    }

    /**
     * Get cell elements for specified region.
     * @param {String} region Region to get elements for
     * @returns {HTMLElement[]} Array of cell elements
     */
    getCells(region) {
        return this._cells[region];
    }

    /**
     * Get the cell element for the specified column.
     * @param {String|Number} columnId Column id
     * @returns {HTMLElement} Cell element
     */
    getCell(columnId) {
        return this._allCells.find(cell => {
            const cellData = DomDataStore.get(cell);
            return cellData.columnId === columnId || cellData.column === columnId;
        });
    }

    removeElements(onlyRelease = false) {
        const me = this;

        // Triggered before the actual remove to allow cleaning up elements etc.
        me.rowManager.trigger('removeRow', { row : me });

        if (!onlyRelease) {
            me.eachElement(element => element.remove());
        }
        me._elements = {};
        me._cells = {};
        me._elementsArray.length = me._regions.length = me._allCells.length = me.lastHeight = me.height = 0;
        me.lastTop = -1;
    }

    //endregion

    //region Height

    /**
     * Get/set row height
     * @property {Number}
     */
    get height() {
        return this._height;
    }

    set height(height) {
        this._height = height;
    }

    /**
     * Get row height including border
     * @property {Number}
     */
    get offsetHeight() {
        // me.height is specified height, add border height to it to get cells height to match specified rowHeight
        // border height is measured in Grid#get rowManager
        return this.height + this.grid._rowBorderHeight;
    }

    /**
     * Sync elements height to rows height
     * @private
     */
    updateElementsHeight() {
        const me = this;
        me.rowManager.storeKnownHeight(me.id, me.height);
        // prevent unnecessary style updates
        if (me.lastHeight !== me.height) {
            this.eachElement(element => element.style.height = `${me.offsetHeight}px`);
            me.lastHeight = me.height;
        }
    }

    //endregion

    //region CSS

    /**
     * Add css classes to each element.
     * @param {...String|Object|Core.helper.util.DomClassList} classes
     */
    addCls(classes) {
        this.updateCls(this.cls.add(classes));
    }

    /**
     * Remove css classes from each element.
     * @param {...String|Object|Core.helper.util.DomClassList} classes
     */
    removeCls(classes) {
        this.updateCls(this.cls.remove(classes));
    }

    /**
     * Adds/removes class names according to the passed object's properties.
     *
     * Properties with truthy values are added.
     * Properties with false values are removed.
     * @param {Object} classes Object containing properties to set/clear
     */
    assignCls(classes) {
        this.updateCls(this.cls.assign(classes));
    }

    changeCls(cls) {
        return cls?.isDomClassList ? cls : new DomClassList(cls);
    }

    updateCls(cls) {
        this.eachElement(element => DomHelper.syncClassList(element, cls));
    }

    //endregion

    //region Position

    /**
     * Is this the very first row?
     * @property {Boolean}
     * @readonly
     */
    get isFirst() {
        return this.dataIndex === 0;
    }

    /**
     * Row top coordinate
     * @property {Number}
     * @readonly
     */
    get top() {
        return this._top;
    }

    /**
     * Row bottom coordinate
     * @property {Number}
     * @readonly
     */
    get bottom() {
        return this._top + this._height + this.grid._rowBorderHeight;
    }

    /**
     * Sets top coordinate, translating elements position.
     * @param {Number} top Top coordinate
     * @param {Boolean} [silent] Specify `true` to not trigger translation event
     * @internal
     */
    setTop(top, silent) {
        if (this._top !== top) {
            this._top = top;
            this.translateElements(silent);
        }
    }

    /**
     * Sets bottom coordinate, translating elements position.
     * @param {Number} bottom Bottom coordinate
     * @param {Boolean} [silent] Specify `true` to not trigger translation event
     * @private
     */
    setBottom(bottom, silent) {
        this.setTop(bottom - this.offsetHeight, silent);
    }

    /**
     * Sets css transform to position elements at correct top position (translateY)
     * @private
     */
    translateElements(silent) {
        const
            me           = this,
            positionMode = me.grid.positionMode;

        if (me.lastTop !== me.top) {
            me.eachElement(element => {
                const style = element.style;

                if (positionMode === 'translate') {
                    style.transform = `translate(0,${me.top}px)`;
                }
                else if (positionMode === 'translate3d') {
                    style.transform = `translate3d(0,${me.top}px,0)`;
                }
                else if (positionMode === 'position') {
                    style.top = `${me.top}px`;
                }
            });

            if (!silent) {
                me.rowManager.trigger('translateRow', { row : me });
            }

            me.lastTop = me.top;
        }
    }

    /**
     * Moves all row elements up or down and updates model.
     * @param {Number} offsetTop Pixels to offset the elements
     * @private
     */
    offset(offsetTop) {
        let newTop = this._top + offsetTop;

        // Not allowed to go below zero (won't be reachable on scroll in that case)
        if (newTop < 0) {
            offsetTop -= newTop;
            newTop = 0;
        }
        this.setTop(newTop);
        return offsetTop;
    }

    //endregion

    //region Render

    /**
     * Renders a record into this rows elements (trigger event that subgrids catch to do the actual rendering).
     * @param {Number} recordIndex
     * @param {Core.data.Model} record
     * @param {Boolean} [updatingSingleRow]
     * @param {Boolean} [batch]
     * @private
     */
    render(recordIndex, record, updatingSingleRow = true, batch = false) {
        const
            me            = this,
            {
                cls,
                cells,
                grid,
                rowManager,
                height         : oldHeight,
                _id            : oldId
            }             = me,
            rowElData     = DomDataStore.get(me._elementsArray[0]),
            rowHeight     = rowManager._rowHeight;

        let i = 0,
            cellElement,
            size;

        // no record specified, try looking up in store (false indicates empty row, don't do lookup
        if (!record && record !== false) {
            record = grid.store.getById(rowElData.id);
            recordIndex = grid.store.indexOf(record);
        }

        // Now we have acquired a record, see what classes it requires on the
        const
            rCls          = record?.cls,
            recordCls     = rCls ? (rCls.isDomClassList ? rCls : new DomClassList(rCls)) : null;

        cls.assign({
            'b-grid-row-updating' : updatingSingleRow && grid.transitionDuration,
            'b-selected'          : grid.isSelected(record?.id)
        });

        // These are DomClassLists, so they have to have their properties processed by add/remove
        if (me.lastRecordCls) {
            cls.remove(me.lastRecordCls);
        }

        // Assign our record's cls to the row, and cache the value so it can be removed next time round
        if (recordCls) {
            cls.add(recordCls);
            me.lastRecordCls = Object.assign({}, recordCls);
        }
        else {
            me.lastRecordCls = null;
        }

        // Flush any changes to our DomClassList to the Row's DOM
        me.updateCls(cls);

        // used by GroupSummary feature to clear row before
        rowManager.trigger('beforeRenderRow', { row : me, record, recordIndex, oldId });

        if (updatingSingleRow && grid.transitionDuration) {
            me.setTimeout(() => {
                cls.remove('b-grid-row-updating');
                me.updateCls(cls);
            }, grid.transitionDuration);
        }

        me.id = record.id;
        me.dataIndex = recordIndex;
        //<debug>
        if (me.dataIndex === -1) {
            throw new Error(`Row's record, id: ${record.id} not found in store`);
        }
        //</debug>

        // Configured height, used as row height if renderers do not specify otherwise
        const height = (!grid.fixedRowHeight && grid.getRowHeight(record)) || rowHeight;

        // Max height returned by renderers
        let maxRequestedHeight = me.maxRequestedHeight = null;

        for (i = 0; i < cells.length; i++) {
            cellElement = cells[i];

            size = me.renderCell({
                cellElement,
                record,
                height,
                maxRequestedHeight,
                updatingSingleRow
            });

            if (!rowManager.fixedRowHeight) {
                // We want to make row in all regions as high as the highest cell
                if (size.height != null) {
                    me.maxRequestedHeight = maxRequestedHeight = Math.max(maxRequestedHeight, size.height);
                }
            }
        }

        me.height = maxRequestedHeight ?? height;

        // Height gets set during render, reflect on elements
        me.updateElementsHeight();

        // Rerendering a row might change its height, which forces translation of all following rows
        if (updatingSingleRow) {
            if (oldHeight !== me.height) {
                rowManager.translateFromRow(me, batch);
            }
            rowManager.trigger('updateRow', { row : me, record, recordIndex, oldId });
            rowManager.trigger('renderDone');
        }

        rowManager.trigger('renderRow', { row : me, record, recordIndex, oldId });

        me.forceInnerHTML = false;
    }

    /**
     * Renders a single cell, calling features to allow them to hook.
     * @param {Object} options Rendering options
     * @param {HTMLElement} options.cellElement Cell element to render
     * @param {Core.data.Model} options.record Record, fetched from store if undefined
     * @param {Number} [options.height] Configured row height
     * @param {Number} [options.maxRequestedHeight] Maximum proposed row height from renderers
     * @param {Boolean} [options.updatingSingleRow] Rendered as part of updating a single row
     * @param {Boolean} [options.isMeasuring] Rendered as part of a measuring operation
     * @private
     */
    renderCell({
        cellElement,
        record,
        height,
        maxRequestedHeight,
        updatingSingleRow = true,
        isMeasuring = false
    }) {
        const
            me              = this,
            { grid }        = me,
            cellElementData = DomDataStore.get(cellElement),
            column          = grid.columns.getById(cellElementData.columnId),
            rowElement      = cellElementData.rowElement,
            rowElementData  = DomDataStore.get(rowElement),
            { // Avoid two calls to col's getters by gathering these fields.
                internalCellCls,
                cellCls,
                align,
                renderer,
                defaultRenderer,
                id : columnId
            }               = column,
            cellContext     = { columnId, id : rowElementData.id };

        if (!record) {
            // Clear out row without record
            // Edge case, only happens if groups/tree is collapsed leading to fewer records than row elements
            if (rowElementData.id === null) {
                // setting to ' ' (space) makes it not remove firstChild, thus not breaking
                // when doing real render the next time
                // NOTE: have opted to not clear cell. might be confusing in DOM but simplifies for cells reusing
                // elements internally. Another option would be to have a derenderer per column which is called
                // cell.innerHTML = ' ';
                cellElement.className = 'b-grid-cell';
                return;
            }

            record = grid.store.getById(rowElementData.id);

            if (!record) {
                return;
            }
        }

        let cellContent = column.getRawValue(record);

        const
            dataField    = record.fieldMap[column.field],
            size         = { configuredHeight : height, height : null, maxRequestedHeight },
            rendererData = {
                cellElement,
                dataField,
                rowElement,
                value : cellContent,
                record,
                column,
                size,
                grid,
                row   : cellElementData.row,
                updatingSingleRow,
                isMeasuring
            },
            newCellClass = {
                'b-grid-cell'                  : 1,
                [internalCellCls]              : internalCellCls,
                // Check cell CSS should not be applied to group header rows
                [cellCls]                      : record.isSpecialRow && column.internalCellCls === 'b-check-cell' ? undefined : cellCls,
                'b-cell-dirty'                 : record.isFieldModified(column.field),
                [`b-grid-cell-align-${align}`] : align,
                'b-selected'                   : grid.isSelected(cellContext),
                'b-focused'                    : grid.isFocused(cellContext),
                'b-auto-height'                : column.autoHeight
            },
            useRenderer  = renderer || defaultRenderer;

        DomHelper.syncClassList(cellElement, newCellClass);

        let shouldSetContent = true;

        // By default, `cellContent` is raw value extracted from Record based on Column field.
        // Call `renderer` if present, otherwise set innerHTML directly.
        if (useRenderer) {
            // `cellContent` could be anything here:
            // - null
            // - undefined when nothing is returned, used when column modifies cell content, for example Widget column
            // - number as cell value, to be converted to string
            // - string as cell value
            // - string which contains custom DOM element which is handled by Angular after we render it as cell value
            // - object with special $$typeof property equals to Symbol(react.element) handled by React when JSX is returned
            // - object which has no special properties but understood by Vue because the column is marked as "Vue" column
            // - object that should be passed to the `DomSync.sync` to update the cell content
            cellContent = useRenderer.call(column, rendererData);

            if (cellContent === undefined) {
                shouldSetContent = false;
            }
        }
        else if (dataField) {
            cellContent = dataField.print(cellContent);
        }

        // Check if the cell content is going to be rendered by framework
        const hasFrameworkRenderer = grid.hasFrameworkRenderer?.({ cellContent, column });

        // This is exceptional case, using framework rendering while grouping is not supported.
        // Need to reset the content in case of JSX is returned from the renderer.
        // Normally, if a renderer returns some content, the Grouping feature will overwrite it with the grouped value.
        // But useRenderer cannot be ignored completely, since a column might want to render additional content to the
        // grouped row. For example, Action Column may render an action button the the grouped row.
        if (hasFrameworkRenderer && record.isSpecialRow) {
            cellContent = '';
        }

        // If present, framework may decide if it wants our renderer to prerender the cell content or not.
        // In case of normal cells in flat grids, React and Vue perform the full rendering into the root cell element.
        // But in case of tree cell in tree grids, React and Vue require our renderer to prerender internals
        // and they perform rendering into inner "b-tree-cell-value" element. This way we can see our expand controls, bullets, etc.
        const frameworkPerformsFullRendering = hasFrameworkRenderer && !column.data.tree && !record.isSpecialRow;

        // `shouldSetContent` false means content is already set by the column (i.e. Widget column).
        // `frameworkPerformsFullRendering` true means full cell content is set by framework renderer.
        if (shouldSetContent && !frameworkPerformsFullRendering) {
            const
                hasObjectContent = cellContent != null && typeof cellContent === 'object',
                hasStringContent = typeof cellContent === 'string',
                text             = (hasObjectContent || cellContent == null) ? '' : String(cellContent);

            // row might be flagged by GroupSummary to require full "redraw"
            if (me.forceInnerHTML) {
                // To allow minimal updates below, we must remove custom markup inserted by the GroupSummary feature
                cellElement.innerHTML = '';
                // Delete cached content value
                delete cellElement._content;

                cellElement.lastDomConfig = null;
            }

            // display cell contents as text or use actual html?
            // (disableHtmlEncode set by features that decorate cell contents)
            if (!hasObjectContent && column.htmlEncode && !column.disableHtmlEncode) {
                // Set innerText if cell currently has html content (from for example group renderer),
                // always do it on Linux, it does not have firstChild.data
                if (BrowserHelper.isLinux || cellElement._hasHtml) {
                    cellElement.innerText = text;
                    cellElement._hasHtml = false;
                }
                else {
                    DomHelper.setInnerText(cellElement, text);
                }
            }
            else {
                if (column.autoSyncHtml && (!hasStringContent || DomHelper.getChildElementCount(cellElement))) {
                    // String content in html column is handled as a html template string
                    if (hasStringContent) {
                        // update cell with only changed attributes etc.
                        DomHelper.sync(text, cellElement.firstElementChild);
                    }
                    // Other content is considered to be a DomHelper config object
                    else if (hasObjectContent) {
                        DomSync.sync({
                            domConfig     : cellContent,
                            targetElement : cellElement
                        });
                    }
                }
                // Consider all returned plain objects to be DomHelper configs for cell content
                else if (hasObjectContent) {
                    DomSync.sync({
                        targetElement : cellElement,
                        domConfig     : {
                            onlyChildren : true,
                            children     : Array.isArray(cellContent) ? cellContent : [
                                cellContent
                            ]
                        }
                    });
                }
                // Apply text as innerHTML only if it has changed
                else if (cellElement._content !== text) {
                    cellElement.innerHTML = cellElement._content = text;
                }
            }
        }

        // If present, framework renders content into the cell element.
        // Ignore special rows, like grouping.
        if (!record.isSpecialRow) {
            // processCellContent is implemented in the framework wrappers
            grid.processCellContent?.({
                cellElementData,
                rendererData,
                // In case of TreeColumn we should prerender inner cell content like expand controls, bullets, etc
                // Then the framework renders the content into the nested "b-tree-cell-value" element.
                // rendererHtml is set in TreeColumn.treeRenderer
                rendererHtml : rendererData.rendererHtml || cellContent
            });
        }

        if (column.autoHeight && size.height == null) {
            cellElement.classList.add('b-measuring-auto-height');

            size.height = cellElement.offsetHeight;

            cellElement.classList.remove('b-measuring-auto-height');
        }

        if (!isMeasuring) {
            // Allow others to affect rendering
            me.rowManager.trigger('renderCell', rendererData);
        }

        return size;
    }

//endregion
}
