import DomHelper from '../../Core/helper/DomHelper.js';
import InstancePlugin from '../../Core/mixin/InstancePlugin.js';
import GridFeatureManager from '../feature/GridFeatureManager.js';
import Rectangle from '../../Core/helper/util/Rectangle.js';

/**
 * @module Grid/feature/StickyCells
 */

/**
 * A feature which pins configurable content from a grid row to the top of the grid
 * while the row scrolls off the top but is still visible.
 *
 * As soon as the row becomes too small to contain the content, it is unpinned, and
 * scrolls out naturally, and the following row's configured content becomes pinned.
 *
 * For example:
 *
 * ```javascript
 *     new Grid({
 *         features : {
 *             stickyCells : {
 *                 // Identifies elements to clone and pin to the grid top.
 *                 contentSelector : '.myClassName'
 *             }
 *         }
 *     });
 * ```
 * @extends Core/mixin/InstancePlugin
 * @classtype stickyCells
 * @feature
 */
export default class StickyCells extends InstancePlugin {
    //region Config

    static get $name() {
        return 'StickyCells';
    }

    static get defaultConfig() {
        return {
            /**
             * A CSS selector which must identify the content within your grid row which you
             * require to be pinned to the grid while the row if the topmost row, and remains visible.
             * @config {String}
             */
            contentSelector : null,

            currentTopRowCls : 'b-sticky-cells-current-top-row'
        };
    }

    // Plugin configuration. This plugin chains some of the functions in Grid.
    static get pluginConfig() {
        return {
            before : ['renderRows']
        };
    }
    //endregion

    //region Init

    construct(grid, config) {
        super.construct(grid, config);

        // We cannot chain our client's onGridScroll because that is now a delayable injected method.
        grid.on({
            scroll  : 'onGridScroll',
            thisObj : this
        });
        Object.assign(this, DomHelper.createElement({
            reference : 'element',
            parent    : grid.element,
            className : 'b-grid-sticky-row',
            children  : [{
                reference : 'contentElement',
                className : 'b-grid-cell'
            }]
        }, false, {}));

        // Clean these classes from copied cell and row classLists
        this.removeClasses = {
            'b-focused'             : false,
            'b-hover'               : false,
            'b-selected'            : false,
            [this.currentTopRowCls] : false
        };
    }

    renderRows() {
        // Do not leave stranded sticky row visible on data change
        this.element.classList.add('b-hide-visibility');
    }

    onGridScroll() {
        const
            me = this,
            {
                client : grid,
                element,
                contentElement
            } = me,
            gridViewport  = Rectangle.client(grid.bodyContainer).roundPx(),
            currentTopRow = grid.rowManager.getRowAt(gridViewport.y),
            topRowChanged = currentTopRow !== me.currentTopRow;

        if (currentTopRow) {
            if (topRowChanged) {
                if (me.currentTopRow) {
                    me.currentTopRow.removeCls(me.currentTopRowCls);
                    me.currentTopRow.removeCls('b-not-enough-height');
                }

                me.currentTopRow = currentTopRow;
                currentTopRow.addCls(me.currentTopRowCls);

                contentElement.innerHTML = '';
                contentElement.appendChild(me.updateStickyContent());
            }

            // If the outgoing row is not not too tall, and doesn't *need* the content
            // pinning to the top, hide the sticky row, and make the source sticky
            // elements pin themselves to the bottom of the cell using the b-not-enough-height
            // class to switch them to align-self: flex-end
            const notEnoughHeight = me.currentTopRow.bottom - me.client.scrollable.y <= me.stickyContentHeight;
            me.element.classList[notEnoughHeight ? 'add' : 'remove']('b-hide-visibility');
            me.currentTopRow[notEnoughHeight ? 'addCls' : 'removeCls']('b-not-enough-height');

            // Keep sticky row aligned while constrained to the viewport.
            // This keeps it pinned to the top.
            gridViewport.y += me.stickyContentTop;
            DomHelper.alignTo(element, me.stickyEls[0], { align : 't0-t0', constrainTo : gridViewport }, true);
        }

        me.lastProcessedTopRow = currentTopRow;
    }

    updateStickyContent() {
        const
            me            = this,
            {
                currentTopRow,
                removeClasses
            }             = me,
            rowClasses   = {
                'b-grid-sticky-row' : 1
            },
            cellClasses  = {},
            stickyContent = me.stickyContent || (me.stickyContent = document.createDocumentFragment()),
            stickyEls     = me.stickyEls || (me.stickyEls = []);

        // Release the sticky state on the previous row's sticky elements
        stickyEls.forEach(e => {
            e.classList.remove('b-sticky-content-el');
        });

        // Collect the elements we need to clone from the current top row
        stickyEls.length = 0;
        currentTopRow.eachElement(rowEl => {
            stickyEls.push(...rowEl.querySelectorAll(me.contentSelector));
        });

        // Clear the documentFragment which we use to hold our clones
        while (stickyContent.firstChild) {
            stickyContent.remove(stickyContent.firstChild);
        }

        me.stickyContentHeight = 0;
        me.stickyContentTop = 0;

        // Clone the selected elements and measure them for alignment.
        stickyEls.map(e => {
            // Collect the app classes that may be necessary on the cell and row elements.
            e.closest('.b-grid-cell').classList.forEach(cls => cellClasses[cls] = 1);
            e.closest('.b-grid-row').classList.forEach(cls => rowClasses[cls] = 1);

            // Clean out grid's classes from the class sets.
            Object.assign(cellClasses, removeClasses);
            Object.assign(rowClasses,  removeClasses);

            const eTop = e.offsetTop;

            me.stickyContentTop = Math.max(me.stickyContentTop, eTop);

            // We need to know how tall the sticky content is
            e.style.alignSelf = 'flex-end';
            me.stickyContentHeight = Math.max(me.stickyContentHeight, me.currentTopRow.height - e.offsetTop + eTop);
            e.style.alignSelf = '';

            const result = e.cloneNode(true);

            // Tag the content al *after* cloning it.
            e.classList.add('b-sticky-content-el');

            stickyContent.appendChild(result);

            return result;
        });

        cellClasses['b-focused'] = false;
        DomHelper.syncClassList(me.contentElement, cellClasses);
        DomHelper.syncClassList(me.element, rowClasses);

        return stickyContent;
    }
}

GridFeatureManager.registerFeature(StickyCells, false);
