import BrowserHelper from '../../Core/helper/BrowserHelper.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import Widget from '../../Core/widget/Widget.js';
import Column from '../column/Column.js';
import SubGridScroller from '../util/SubGridScroller.js';
import Rectangle from '../../Core/helper/util/Rectangle.js';
import Scroller from '../../Core/helper/util/Scroller.js';
import EventHelper from '../../Core/helper/EventHelper.js';

/**
 * @module Grid/view/SubGrid
 */

/**
 * A SubGrid is a part of the grid (it has at least one and normally no more than two, called locked and normal). It
 * has its own header, which holds the columns to display rows for in the SubGrid. SubGrids are created by Grid, you
 * should not need to create instances directly.
 *
 * If not configured with a width or flex, the SubGrid will be sized to fit its columns. In this case, if all columns
 * have a fixed width (not using flex) then toggling columns will also affect the width of the SubGrid.
 *
 * @extends Core/widget/Widget
 */
export default class SubGrid extends Widget {
    //region Config

    static get $name() {
        return 'SubGrid';
    }

    // Factoryable type name
    static get type() {
        return 'subgrid';
    }

    /**
     * Region (name) for this SubGrid
     * @config {String} region
     */

    /**
     * Column store, a store containing the columns for this SubGrid
     * @config {Grid.data.ColumnStore} columns
     */

    static get defaultConfig() {
        return {
            localizableProperties : ['emptyText'],

            insertRowsBefore : null,
            appendTo         : null,
            monitorResize    : true,
            headerClass      : null,
            footerClass      : null,

            /**
             * Set `true` to start subgrid collapsed. To operate collapsed state on subgrid use
             * {@link #function-collapse}/{@link #function-expand} methods.
             * @config {Boolean}
             * @default false
             */
            collapsed : null,

            scrollable : {
                // Each SubGrid only handles scrolling in the X axis.
                // The owning Grid handles the Y axis.
                overflowX : true
            },

            scrollerClass : SubGridScroller,

            // Will be set to true by GridSubGrids if it calculates the subgrids width based on its columns.
            // Used to determine if hiding a column should affect subgrids width
            hasCalculatedWidth : null,

            /**
             * Set `true` to disable moving columns into or out of this SubGrid.
             * @config {Boolean}
             * @default false
             * @private
             */
            sealedColumns : null,

            emptyText : null
        };
    }

    static get configurable() {
        return {
            element                : true,
            header                 : {},
            footer                 : {},
            virtualScrollerElement : true,
            splitterElement        : true,
            headerSplitter         : true,
            scrollerSplitter       : true,
            footerSplitter         : true,

            /**
             * Set to `false` to prevent this subgrid being resized with the {@link Grid.feature.RegionResize} feature
             * @internal
             * @config {Boolean}
             * @default true
             */
            resizable : null
        };
    }

    //endregion

    //region Init

    /**
     * SubGrid constructor
     * @param config
     * @private
     */
    construct(config) {
        super.construct(config);

        this.rowManager.on('addrows', this.onAddRow, this);
    }

    doDestroy() {
        const me = this;

        me.header.destroy();
        me.footer.destroy();
        me.fakeScroller?.destroy();

        me.virtualScrollerElement.remove();
        me.splitterElement.remove();
        me.headerSplitter.remove();
        me.scrollerSplitter.remove();
        me.footerSplitter.remove();

        super.doDestroy();
    }

    get barConfig() {
        const
            me              = this,
            { width, flex } = me.element.style,
            config          = {
                subGrid : me,
                parent  : me  // Contained widgets need to know their parents
            };

        // If we have been configured with sizing, construct the Bar in sync.
        if (flex) {
            config.flex = flex;
        }
        else if (width) {
            config.width = width;
        }

        return config;
    }

    changeHeader(header) {
        return new this.headerClass(ObjectHelper.assign({
            id : this.id + '-header'
        }, this.barConfig, header));
    }

    changeFooter(footer) {
        return new this.footerClass(ObjectHelper.assign({
            id : this.id + '-footer'
        }, this.barConfig, footer));
    }
    //endregion

    //region Splitters

    /**
     * Toggle (add/remove) class for splitters
     * @param {String} cls class name
     * @param {Boolean} [add] actions. Set to `true` to add class, `false` to remove
     * @private
     */
    toggleSplitterCls(cls, add = true) {
        const
            me        = this,
            splitters = [me.splitterElement, me.headerSplitter, me.footerSplitter, me.scrollerSplitter];
        splitters.forEach(el => el?.classList[add ? 'add' : 'remove'](cls));
    }

    //endregion

    //region Template

    changeElement(element, was) {
        const { region } = this;

        return super.changeElement({
            className : {
                'b-grid-subgrid'             : 1,
                [`b-grid-subgrid-${region}`] : region,
                'b-grid-horizontal-scroller' : 1,
                'b-grid-subgrid-collapsed'   : this.collapsed
            },
            dataset : {
                region
            }
        }, was);
    }

    get rowElementConfig() {
        return {
            className : 'b-grid-row',
            children  : this.columns.visibleColumns.map(column => ({
                className : 'b-grid-cell',
                dataset   : {
                    column   : column.field || '',
                    columnId : column.id
                }
            }))
        };
    }

    // Added to DOM in  Grid `get bodyConfig`
    changeVirtualScrollerElement() {
        const references = DomHelper.createElement({
            reference : 'virtualScrollerElement',
            className : 'b-virtual-scroller',
            dataset   : {
                region : this.region
            },
            children : [
                {
                    reference : 'virtualScrollerWidth',
                    className : 'b-virtual-width'
                }
            ]
        });

        this.virtualScrollerWidth = references.virtualScrollerWidth;

        return references.virtualScrollerElement;
    }

    changeSplitterElement() {
        const references = DomHelper.createElement({
            reference : 'splitterElement',
            className : {
                'b-grid-splitter'           : 1,
                'b-grid-splitter-collapsed' : this.collapsed,
                'b-hide-display'            : 1 // GridSubGrids determines visibility
            },
            dataset : {
                region : this.region
            },
            children : [
                {
                    className : 'b-grid-splitter-inner b-grid-splitter-main',
                    children  : [
                        {
                            className : 'b-grid-splitter-buttons',
                            reference : 'splitterButtons',
                            children  : [
                                { tag : 'i', className : 'b-icon b-icon-collapse-gridregion' },
                                { tag : 'i', className : 'b-icon b-icon-expand-gridregion' }
                            ]
                        }
                    ]
                }
            ]
        });

        this.splitterButtons = references.splitterButtons;

        return references.splitterElement;
    }

    get splitterConfig() {
        return {
            className : this.splitterElement.className.trim(),
            children  : [{
                className : 'b-grid-splitter-inner'
            }],
            dataset : {
                region : this.region
            }
        };
    }

    changeHeaderSplitter() {
        return DomHelper.createElement(this.splitterConfig);
    }

    changeScrollerSplitter() {
        return DomHelper.createElement(this.splitterConfig);
    }

    changeFooterSplitter() {
        return DomHelper.createElement(this.splitterConfig);
    }

    hideSplitter() {
        this.splitterElement.classList.add('b-hide-display');
        this.headerSplitter.classList.add('b-hide-display');
        this.scrollerSplitter.classList.add('b-hide-display');
        this.footerSplitter.classList.add('b-hide-display');
        this.$showingSplitter = false;
    }

    showSplitter() {
        this.splitterElement.classList.remove('b-hide-display');
        this.headerSplitter.classList.remove('b-hide-display');
        this.scrollerSplitter.classList.remove('b-hide-display');
        this.footerSplitter.classList.remove('b-hide-display');
        this.$showingSplitter = true;
    }

    //endregion

    //region Render

    render(...args) {
        const me = this;

        super.render(...args);

        // Unit tests create naked SubGrids so we have to do this.
        if (me.grid) {
            me.updateHasFlex();

            me.element.parentNode.insertBefore(me.splitterElement, me.element.nextElementSibling);

            EventHelper.on({
                element   : me.grid.element,
                delegate  : `.b-grid-splitter[data-region=${me.region}]`,
                mouseover : 'onSplitterMouseOver',
                mouseout  : 'onSplitterMouseOut',
                thisObj   : me
            });

            me._collapsed && me.collapse();
        }
    }

    refreshHeader() {
        this.header.refreshContent();
    }

    refreshFooter() {
        this.footer?.refreshContent();
    }

    // Override to iterate header and footer.
    eachWidget(fn, deep = true) {
        const
            me      = this,
            widgets = [me.header, me.footer];

        for (let i = 0; i < widgets.length; i++) {
            const widget = widgets[i];

            if (fn(widget) === false) {
                return;
            }

            if (deep && widget.eachWidget) {
                widget.eachWidget(fn, deep);
            }
        }
    }

    //endregion

    //region Size & resize

    /**
     * Sets cell widths. Cannot be done in template because of CSP
     * @private
     */
    fixCellWidths(rowElement) {
        const { visibleColumns } = this.columns;

        // fix cell widths, no longer allowed in template because of CSP
        let cell = rowElement.firstElementChild,
            i    = 0;

        while (cell) {
            const column = visibleColumns[i];

            if (column.minWidth) {
                cell.style.minWidth = DomHelper.setLength(column.minWidth);
            }

            // either flex or width, flex has precedence
            if (column.flex) {
                cell.style.flex = column.flex;
                cell.style.width = '';
            }
            else if (column.width) {
                // https://app.assembla.com/spaces/bryntum/tickets/8041
                // Although header and footer elements must be sized using flex-basis to avoid the busting out problem,
                // grid cells MUST be sized using width since rows are absolutely positioned and will not cause the
                // busting out problem, and rows will not stretch to shrinkwrap the cells unless they are widthed with
                // width.
                cell.style.width = DomHelper.setLength(column.width);

                // IE11 calculates flexbox container width based on min-width rather than actual width. When column
                // has width defined greater than minWidth, row may have incorrect width
                if (BrowserHelper.isIE11) {
                    cell.style.flex = '';
                    cell.style.minWidth = DomHelper.setLength(column.calcMinWidth);
                }
            }
            else {
                cell.style.flex = cell.style.width = cell.style.minWidth = '';
            }

            cell = cell.nextElementSibling;
            i++;
        }
    }

    get totalFixedWidth() {
        return this.columns.totalFixedWidth;
    }

    /**
     * Sets header width and scroller width (if needed, depending on if using flex). Might also change the subgrids
     * width, if it uses a width calculated from its columns.
     * @private
     */
    fixWidths() {
        const
            me = this,
            {
                element,
                header,
                footer
            }  = me;

        if (!me.collapsed) {
            if (me.flex) {
                header.flex = me.flex;
                if (footer) {
                    footer.flex = me.flex;
                }
                element.style.flex = me.flex;
            }
            else {
                // If width is calculated and no column is using flex, check if total width is less than width. If so,
                // recalculate width and bail out of further processing (since setting width will trigger again)
                if (
                    me.hasCalculatedWidth &&
                    !me.columns.some(col => !col.hidden && col.flex) &&
                    me.totalFixedWidth !== me.width
                ) {
                    me.width = me.totalFixedWidth;
                    // Setting width above clears the hasCalculatedWidth flag, but we want to keep it set to react
                    // correctly next time
                    me.hasCalculatedWidth = true;
                    return;
                }

                let totalWidth = me.width;

                if (!totalWidth) {
                    totalWidth = 0;

                    // summarize column widths, needed as container width when not using flex widths and for correct
                    // overflow check in Edge
                    for (const col of me.columns) {
                        if (!col.flex && !col.hidden) totalWidth += col.width;
                    }
                }

                // rows are absolutely positioned, meaning that their width won't affect container width
                // hence we must set it, if not using flex
                element.style.width = `${totalWidth}px`;

                header.width = totalWidth;
                if (footer) {
                    footer.width = totalWidth;
                }
            }

            me.syncScrollingPartners(false);
        }
    }

    // Safari/Edge do not shrink cells the same way as chrome & ff does without having a width set on the row
    fixRowWidthsInSafariEdge() {
        if (BrowserHelper.isSafari || BrowserHelper.isEdge) {
            const
                me                 = this,
                { region, header } = me,
                minWidth           = header.calculateMinWidthForSafari();

            // fix row widths for safari, it does not size flex cells correctly at small widths otherwise.
            // there should be a css solution, but I have failed to find it
            me.rowManager.forEach(row => {
                // This function runs on resize and rendering a SubGrid triggers a resize. When adding a new SubGrid
                // on the fly elements wont exists for it yet, so ignore...
                const element = row.getElement(region);
                // it is worth noting that setting a width does not prevent the row from growing beyond that with
                // when making view wider, it is used in flex calculation more like a min-width
                if (element) {
                    element.style.width = `${minWidth}px`;
                }
            });

            header.headersElement.style.width = `${minWidth}px`;
        }
    }

    /**
     * Get/set SubGrid width, which also sets header and footer width (if available).
     * @property {Number}
     */
    set width(width) {
        const me = this;

        // Width explicitly set, remember that
        me.hasCalculatedWidth = false;

        super.width = width;

        me.header.width = width;
        me.footer.width = width;

        // When we're live, we can't wait until the  throttled resize occurs - it looks bad.
        if (me.isPainted) {
            me.onElementResize();
        }
    }

    get width() {
        return super.width;
    }

    /**
     * Get/set SubGrid flex, which also sets header and footer flex (if available).
     * @property {Number|String}
     */
    set flex(flex) {
        const me = this;

        // Width explicitly set, remember that
        me.hasCalculatedWidth = false;

        me.header.flex = flex;
        me.footer.flex = flex;

        super.flex = flex;

        // When we're live, we can't wait until the  throttled resize occurs - it looks bad.
        if (me.isPainted) {
            me.onElementResize();
        }
    }

    get flex() {
        return super.flex;
    }

    /**
     * Called when grid changes size. SubGrid determines if it has changed size and triggers scroll (for virtual
     * rendering in cells to work when resizing etc.)
     * @private
     */
    onInternalResize(element, newWidth, newHeight, oldWidth, oldHeight) {
        const
            me       = this,
            { grid } = me;

        // Widget caches dimensions
        super.onInternalResize(element, newWidth, newHeight, oldWidth, oldHeight);

        // Unit tests create naked SubGrids so we have to do this.
        if (grid) {
            me.syncSplitterButtonPosition();

            if (newWidth !== oldWidth) {
                // trigger scroll, in case anything is done on scroll it needs to be done now also
                grid.trigger('horizontalScroll', { subGrid : me, grid, scrollLeft : me.scrollable.x });

                // Update virtual scrollers, if they are ready
                me.fakeScroller && me.refreshFakeScroll();

                me.fixRowWidthsInSafariEdge();
            }

            me.trigger('afterInternalResize', me);
        }
    }

    /**
     * Keeps the parallel splitters in the header, footer and fake scroller synced in terms
     * of being collapsed or not.
     * @private
     */
    syncParallelSplitters(collapsed) {
        const
            me       = this,
            { grid } = me;

        if (me.splitterElement && me.$showingSplitter) {
            me.toggleSplitterCls('b-grid-splitter-collapsed', collapsed);
        }
        else {
            // If we're the last, we don't own a splitter, we use the previous region's splitter
            const prevGrid = grid.getSubGrid(grid.getPreviousRegion(me.region));

            // If there's a splitter before us, sync it with our state.
            if (prevGrid && prevGrid.splitterElement) {
                prevGrid.syncParallelSplitters(collapsed);
            }
        }
    }

    onSplitterMouseOver() {
        const
            me              = this,
            { nextSibling } = me;

        // No hover effect when collapsed
        if (!me.collapsed && (!nextSibling || !nextSibling.collapsed)) {
            me.toggleSplitterCls('b-hover');
        }

        me.startSplitterButtonSyncing();
    }

    onSplitterMouseOut() {
        const
            me              = this,
            { nextSibling } = me;

        me.toggleSplitterCls('b-hover', false);
        if (!me.collapsed && (!nextSibling || !nextSibling.collapsed)) {
            me.stopSplitterButtonSyncing();
        }
    }

    startSplitterButtonSyncing() {
        const me = this;

        if (me.splitterElement) {
            me.syncSplitterButtonPosition();
            if (!me.splitterSyncScrollListener) {
                me.splitterSyncScrollListener = me.grid.scrollable.on({
                    scroll  : 'syncSplitterButtonPosition',
                    thisObj : me
                });
            }
        }
    }

    stopSplitterButtonSyncing() {
        if (this.splitterSyncScrollListener) {
            this.splitterSyncScrollListener();
            this.splitterSyncScrollListener = null;
        }
    }

    syncSplitterButtonPosition() {
        const me = this;
        me.splitterButtons.style.transform = `translateY(${(me.grid.scrollable.y + me.grid.bodyHeight / 2) - (me.headerSplitter ? me.grid.headerHeight : 0)}px)`;
    }

    /**
     * Get the "viewport" for the SubGrid as a Rectangle
     * @property {Core.helper.util.Rectangle}
     * @readonly
     */
    get viewRectangle() {
        const { scrollable } = this;

        return new Rectangle(scrollable.x, scrollable.y, this.width || 0, this.rowManager.viewHeight);
    }

    /**
     * Called when updating column widths to apply 'b-has-flex' which is used when fillLastColumn is configured.
     * @internal
     */
    updateHasFlex() {
        const hasFlex = this.columns.visibleColumns.some(column => column.flex);

        DomHelper.toggleClasses(this.element, ['b-has-flex'], hasFlex);
    }

    updateResizable(resizable) {
        const me = this;

        [me.splitterElement, me.headerSplitter,  me.scrollerSplitter, me.footerSplitter].forEach(splitter => DomHelper.toggleClasses(splitter, ['b-disabled'], !resizable));
    }

    /**
     * Resize all columns in the SubGrid to fit their width, according to their configured
     * {@link Grid.column.Column#config-fitMode}
     */
    resizeColumnsToFitContent() {
        this.grid.beginGridMeasuring();

        this.columns.visibleColumns.forEach(column => {
            column.resizeToFitContent(null, null, true);
        });

        this.grid.endGridMeasuring();
    }

    //endregion

    //region Scroll

    get overflowingHorizontally() {
        const { scrollable } = this;

        // This is if *this* subGrid has horizontal overflow
        // +1 is for Edge, it messes up otherwise
        return scrollable.scrollWidth > scrollable.clientWidth + (BrowserHelper.isEdge ? 1 : 0);
    }

    get overflowingVertically() {
        const { scrollable } = this;

        // This is if *this* subGrid has vertical overflow
        // +1 is for Edge, it messes up otherwise
        return scrollable.scrollHeight > scrollable.clientHeight + (BrowserHelper.isEdge ? 1 : 0);
    }

    /**
     * Fixes widths of fake scrollers
     * @private
     */
    refreshFakeScroll() {
        const
            me = this,
            {
                element,
                virtualScrollerElement,
                virtualScrollerWidth,
                totalFixedWidth,
                header,
                footer,
                scrollable
            }  = me;

        // Always use (at least) a fixed scroll width so when grid becomes empty (e.g after filtering with no matches),
        // it maintains scroll-x position
        // https://github.com/bryntum/support/issues/3247
        scrollable.scrollWidth = totalFixedWidth;

        // Scroller lays out in the same way as subgrid.
        // If we are flexed, the scroller is flexed etc.
        virtualScrollerElement.style.width = element.style.width;
        virtualScrollerElement.style.flex = element.style.flex;

        if (!me.collapsed) {
            if (me.overflowingHorizontally) {
                virtualScrollerWidth.style.width = `${scrollable.scrollWidth || 0}px`;
                header.element.classList.add('b-overflowing');
                footer.element.classList.add('b-overflowing');
                // If *any* SubGrids have horizontal overflow, the main grid
                // has to show its virtual horizontal scrollbar.
                me.grid.virtualScrollers.classList.remove('b-hide-display');
            }
            else {
                virtualScrollerWidth.style.width = 0;
                header.element.classList.remove('b-overflowing');
                footer.element.classList.remove('b-overflowing');
            }
        }
    }

    /**
     * Init scroll syncing for header and footer (if available).
     * @private
     */
    initScroll() {
        const
            me = this,
            {
                scrollable,
                virtualScrollerElement
            }  = me;

        me.syncPartnersOnFrame = me.createOnFrame(me.syncScrollingPartners);

        if (BrowserHelper.isFirefox) {
            scrollable.element.addEventListener('wheel', event => {
                if (event.deltaX) {
                    scrollable.x += event.deltaX;
                    event.preventDefault();
                }
            });
        }

        scrollable.yScroller = me.grid.scrollable;

        // Add our Scroller to the controlling GridScroller
        scrollable.yScroller.addScroller(scrollable);

        // Create a Scroller for the fake horizontal scrollbar so that it can partner
        me.fakeScroller = new Scroller({
            element   : virtualScrollerElement,
            overflowX : true
        });

        // Sync scrolling partners (header, footer) when our xScroller reports a scroll.
        // Also fires horizontalscroll
        scrollable.on({
            scroll    : 'onSubGridScroll',
            scrollend : 'onSubGridScrollEnd',
            thisObj   : me
        });

        scrollable.addPartner(me.fakeScroller, 'x');
        scrollable.addPartner(me.header.scrollable, 'x');
        scrollable.addPartner(me.footer.scrollable, 'x');

        // Update virtual scrollers (previously updated too early from onInternalResize)
        me.refreshFakeScroll();
    }

    onSubGridScrollEnd() {
        // If we do not have the direct update flag set which would ensure a sync in each scroll event
        // then ensure syncing happens on scroll end. This is for animated scrolls where the scroll
        // impulses come through animation frames.
        if (!this.forceScrollUpdate) {
            this.syncScrollingPartners();
        }
        this.scrolling = false;
    }

    onSubGridScroll() {
        // Force direct update, without waiting for next animation frame
        // TODO: Only used in Scheduler, could perhaps live in Scheduler specific SubGrid in the future
        if (this.forceScrollUpdate) {
            this.syncScrollingPartners();
            this.forceScrollUpdate = false;
        }
        else {
            this.syncPartnersOnFrame();
        }
    }

    set scrolling(scrolling) {
        this._scrolling = scrolling;
    }

    get scrolling() {
        return this._scrolling;
    }

    /**
     * This syncs the horizontal scroll position of the header and the footer with
     * the horizontal scroll position of the grid. Usually, this will be called automatically
     * when the grid scrolls. In some cases, such as a refresh caused by column changes
     * it will need to be called from elsewhere.
     * @internal
     */
    syncScrollingPartners(addCls = true) {
        const
            subGrid  = this,
            { grid } = subGrid;

        if (!subGrid.scrolling && addCls) {
            subGrid.scrolling = true;
        }

        grid.trigger('horizontalScroll', { subGrid, grid, scrollLeft : subGrid.scrollable.x });
    }

    /**
     * Scrolls a column into view (if it is not already). Called by Grid#scrollColumnIntoView, use it instead to not
     * have to care about which SubGrid contains a column.
     * @param {Grid.column.Column|String|Number} column Column name (data) or column index or actual column object.
     * @param {Object} [options] How to scroll.
     * @param {String} [options.block] How far to scroll the element: `start/end/center/nearest`.
     * @param {Number} [options.edgeOffset] edgeOffset A margin around the element or rectangle to bring into view.
     * @param {Object|Boolean|Number} [options.animate] Set to `true` to animate the scroll by 300ms,
     * or the number of milliseconds to animate over, or an animation config object.
     * @param {Number} [options.animate.duration] The number of milliseconds to animate over.
     * @param {String} [options.animate.easing] The name of an easing function.
     * @param {Boolean} [options.highlight] Set to `true` to highlight the element when it is in view.
     * @param {Boolean} [options.focus] Set to `true` to focus the element when it is in view.
     * @returns {Promise} If the column exists, a promise which is resolved when the column header element has been scrolled into view.
     */
    scrollColumnIntoView(column, options) {
        const
            me       = this,
            scroller = me.header.scrollable;

        // Allow column,column id,or column index to be passed
        column = (column instanceof Column) ? column : me.columns.get(column) || me.columns.getById(column) || me.columns.getAt(column);

        if (column) {
            // Get the current column header element.
            const columnHeaderElement = me.header.getHeader(column.id);

            if (columnHeaderElement) {
                return scroller.scrollIntoView(Rectangle.from(columnHeaderElement, null, true), options);
            }
        }
    }

    //endregion

    //region Rows

    /**
     * Creates elements for the new rows when RowManager has determined that more rows are needed
     * @private
     */
    onAddRow({ rows }) {
        const
            me             = this,
            config         = me.rowElementConfig,
            frag           = document.createDocumentFragment();

        rows.forEach(row => {
            const rowElement = DomHelper.createElement(config);

            frag.appendChild(rowElement);
            row.addElement(me.region, rowElement);

            // TODO: Stamp the correct width into the cells on creation
            me.fixCellWidths(rowElement);
        });

        me.fixRowWidthsInSafariEdge();

        // Put the row elements into the SubGrid en masse.
        // If 2nd param is null, insertBefore appends.
        me.element.insertBefore(frag, me.insertRowsBefore);
    }

    /**
     * Get all row elements for this SubGrid.
     * @property {HTMLElement[]}
     * @readonly
     */
    get rowElements() {
        return this.fromCache('.b-grid-row', true);
    }

    /**
     * Removes all row elements from the subgrids body and empties cache
     * @private
     */
    clearRows() {
        this.emptyCache();
        const all   = this.element.querySelectorAll('.b-grid-row'),
            range = document.createRange();

        if (all.length) {
            range.setStartBefore(all[0]);
            range.setEndAfter(all[all.length - 1]);
            range.deleteContents();
        }
    }

    // only called when RowManager.rowScrollMode = 'dom', which is not intended to be used
    addNewRowElement() {
        const rowElement = DomHelper.append(this.element, this.rowElementConfig);

        this.fixCellWidths(rowElement);

        return rowElement;
    }

    get emptyText() {
        return this._emptyText;
    }

    set emptyText(text) {
        this._emptyText = text;

        this.element.dataset.emptyText = text;
    }

    get store() {
        return this.grid.store;
    }

    get rowManager() {
        return this.grid?.rowManager;
    }

    //endregion

    // region Expand/collapse

    // All usages are commented, uncomment when this is resolved: https://app.assembla.com/spaces/bryntum/tickets/5472
    toggleTransitionClasses(doRemove = false) {
        const
            me         = this,
            grid       = me.grid,
            nextRegion = grid.getSubGrid(grid.getNextRegion(me.region)),
            splitter   = grid.resolveSplitter(nextRegion);

        nextRegion.element.classList[doRemove ? 'remove' : 'add']('b-grid-subgrid-animate-collapse');
        nextRegion.header.element.classList[doRemove ? 'remove' : 'add']('b-grid-subgrid-animate-collapse');

        me.element.classList[doRemove ? 'remove' : 'add']('b-grid-subgrid-animate-collapse');
        me.header.element.classList[doRemove ? 'remove' : 'add']('b-grid-subgrid-animate-collapse');

        splitter.classList[doRemove ? 'remove' : 'add']('b-grid-splitter-animate');
    }

    /**
     * Get/set collapsed state
     * @property {Boolean}
     */
    get collapsed() {
        return this._collapsed;
    }

    set collapsed(collapsed) {
        if (this.isConfiguring) {
            this._collapsed = collapsed;
        }
        else {
            if (collapsed) {
                this.collapse();
            }
            else {
                this.expand();
            }
        }
    }

    /**
     * Collapses subgrid. If collapsing subgrid is the only one expanded, next subgrid to the right (or previous) will
     * be expanded.
     *
     * @example
     * let locked = grid.getSubGrid('locked');
     * locked.collapse().then(() => {
     *     console.log(locked.collapsed); // Logs 'True'
     * });
     *
     * let normal = grid.getSubGrid('normal');
     * normal.collapse().then(() => {
     *     console.log(locked.collapsed); // Logs 'False'
     *     console.log(normal.collapsed); // Logs 'True'
     * });
     *
     * @async
     * @returns {Promise} A Promise which resolves when this SubGrid is fully collapsed.
     */
    async collapse() {
        const
            me            = this,
            grid          = me.grid,
            nextRegion    = grid.getSubGrid(grid.getNextRegion(me.region)),
            splitterOwner = me.splitterElement ? me : me.previousSibling;

        // Count all expanded regions. Grid must have always have at least one expanded
        let expandedRegions = 0;

        grid.eachSubGrid(subGrid => {
            subGrid !== me && !subGrid._collapsed && ++expandedRegions;
        });

        // Current region is the only one expanded, expand next region
        if (expandedRegions === 0) {
            // expandPromise = nextRegion.expand();
            await nextRegion.expand();
        }

        return new Promise((resolve) => {
            if (!me._beforeCollapseState) {
                me._beforeCollapseState = {};

                let widthChanged = false;

                // If current width is zero, the resize event will not be fired. In such case we want to trigger callback immediately
                if (me.width) {
                    widthChanged = true;

                    // Toggle transition classes here, we will actually change width below
                    // me.toggleTransitionClasses();

                    // afterinternalresize event is buffered, it will be fired only once after animation is finished
                    // and element size is final
                    me.on({
                        afterinternalresize : () => {
                            // me.toggleTransitionClasses(true);
                            resolve(me);
                        },
                        thisObj : me,
                        once    : true
                    });
                }

                // When trying to collapse region we need its partner to occupy free space. Considering multiple
                // regions, several cases are possible:
                // 1) Both left and right regions have fixed width
                // 2) Left region has fixed width, right region is flexed
                // 3) Left region is flexed, right region has fixed width
                // 4) Both regions are flexed
                //
                // To collapse flexed region we need to remove flex style, remember it somehow and set fixed width.
                // If another region is flexed, it will fill the space. If it has fixed width, we need to increase
                // its width by collapsing region width. Same logic should be applied to headers.
                //
                // Save region width first
                me._beforeCollapseState.width = me.width;
                me._beforeCollapseState.elementWidth = me.element.style.width;

                // Next region is not flexed, need to make it fill the space
                if (nextRegion.element.style.flex === '') {
                    me._beforeCollapseState.nextRegionWidth = nextRegion.width;
                    nextRegion.width += me._beforeCollapseState.width;
                }

                // Current region is flexed, store style to restore on expand
                if (me.element.style.flex !== '') {
                    me._beforeCollapseState.flex = me.element.style.flex;
                    // remove flex state to reduce width later
                    me.header.element.style.flex = me.element.style.flex = '';
                }

                // Sets the grid to its collapsed width as defined in SASS: zero
                me.element.classList.add('b-grid-subgrid-collapsed');

                // The parallel elements which must be in sync width-wise must know about collapsing
                me.virtualScrollerElement.classList.add('b-collapsed');
                me.header.element.classList.add('b-collapsed');
                me.footer.element.classList.add('b-collapsed');

                me.width = '';
                me._collapsed = true;

                if (!widthChanged) {
                    // sync splitters in case subGrid was collapsed by state (https://github.com/bryntum/support/issues/1857)
                    me.syncParallelSplitters(true);

                    resolve(false);
                }
            }
        }).then((value) => {
            if (!me.isDestroyed) {
                if (value !== false) {
                    me.syncParallelSplitters(true);

                    // Our splitter is permanently visible when collapsed, so keep splitter button set
                    // synced in the vertical centre of the view just in time for paint.
                    // Uses translateY so will not cause a further layout.
                    splitterOwner.startSplitterButtonSyncing?.();
                }

                me.grid.trigger('subGridCollapse', me);
            }
        });
    }

    /**
     * Expands subgrid.
     *
     * @example
     * grid.getSubGrid('locked').expand().then(() => console.log('locked grid expanded'));
     *
     * @async
     * @returns {Promise} A Promise which resolves when this SubGrid is fully expanded.
     */
    async expand() {
        const
            me            = this,
            grid          = me.grid,
            nextRegion    = grid.getSubGrid(grid.getNextRegion(me.region)),
            splitterOwner = me.splitterElement ? me : me.previousSibling;

        return new Promise((resolve) => {
            if (me._beforeCollapseState != null) {
                // If current width matches width expected after expand resize event will not be fired. In such case
                // we want to trigger callback immediately
                let widthChanged = false;

                // See similar clause in collapse method above
                if (me.width !== me._beforeCollapseState.elementWidth) {
                    widthChanged = true;

                    // Toggle transition classes here, we will actually change width below
                    // me.toggleTransitionClasses();

                    me.on({
                        afterinternalresize : () => {
                            // me.toggleTransitionClasses(true);

                            // Delay the resolve to avoid "ResizeObserver loop limit exceeded" errors
                            // collapsing the only expanded region and it has to expand its nextRegion
                            // before it can collapse.
                            me.setTimeout(() => resolve(me), 10);
                        },
                        thisObj : me,
                        once    : true
                    });
                }

                // previous region is not flexed, reduce its width as it was increased in collapse
                if (nextRegion.element.style.flex === '') {
                    nextRegion.width = me._beforeCollapseState.nextRegionWidth;
                }

                me.element.classList.remove('b-grid-subgrid-collapsed');
                me._collapsed = false;

                // The parallel elements which must be in sync width-wise must know about collapsing
                me.virtualScrollerElement.classList.remove('b-collapsed');
                me.header.element.classList.remove('b-collapsed');
                me.footer.element.classList.remove('b-collapsed');

                // This region used to be flex, let's restore it
                if (me._beforeCollapseState.flex) {
                    // Always restore width, restoring flex wont trigger resize otherwise
                    me.width = me._beforeCollapseState.width;

                    // Widget flex setting clears style width
                    me.header.flex = me.flex = me._beforeCollapseState.flex;
                    me.footer.flex = me._beforeCollapseState.flex;
                    me._width = null;
                }
                else {
                    me.width = me._beforeCollapseState.elementWidth;
                }

                me.element.classList.remove('b-grid-subgrid-collapsed');
                me._collapsed = false;

                if (!widthChanged) {
                    resolve(false);
                }

                delete me._beforeCollapseState;
            }
        }).then((value) => {
            if (value !== false) {
                // Our splitter is hidden when expanded, so we no longer need to keep splitter button set
                // synced in the vertical centre of the view.
                splitterOwner.stopSplitterButtonSyncing();

                me.syncParallelSplitters(false);
                me.grid.trigger('subGridExpand', me);
            }
        });
    }

    //endregion
}

// Register this widget type with its Factory
SubGrid.initClass();
