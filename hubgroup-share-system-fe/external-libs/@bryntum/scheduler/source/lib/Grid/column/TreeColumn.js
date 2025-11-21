import Column from './Column.js';
import ColumnStore from '../data/ColumnStore.js';

/**
 * @module Grid/column/TreeColumn
 */

let currentParentHasIcon = false;

/**
 * A column that displays a tree structure when using the {@link Grid.feature.Tree tree} feature.
 *
 * Default editor is a {@link Core.widget.TextField TextField}.
 *
 * TreeColumn provides configs to define icons for {@link #config-expandIconCls expanded} / {@link #config-collapseIconCls collapsed} nodes,
 * {@link #config-expandedFolderIconCls expanded folder} / {@link #config-collapsedFolderIconCls collapsed folder} nodes and
 * {@link #config-leafIconCls leaf} nodes.
 *
 * When the TreeColumn renders its cells, it will look for two special fields {@link Grid.data.GridRowModel#field-href}
 * and {@link Grid.data.GridRowModel#field-target}. Specifying `href` will produce a link for the TreeNode,
 * and `target` will have the same meaning as in an A tag:
 *
 * ```javascript
 * {
 *    id        : 1,
 *    name      : 'Some external link'
 *    href      : '//www.website.com",
 *    target    : '_blank"
 * }
 * ```
 *
 * @example
 * new TreeGrid({
 *     appendTo : document.body,
 *
 *     columns : [
 *          { type: 'tree', field: 'name' }
 *     ]
 * });
 *
 * @classType tree
 * @extends Grid/column/Column
 * @inlineexample Grid/column/TreeColumn.js
 */
export default class TreeColumn extends Column {
    static get defaults() {
        return {
            tree     : true,
            hideable : false,
            minWidth : 150
        };
    }

    static get fields() {
        return [
            /**
             * The icon to use for the collapse icon in collapsed state
             * @config {String} expandIconCls
             */
            { name : 'expandIconCls', defaultValue : 'b-icon b-icon-tree-expand' },

            /**
             * The icon to use for the collapse icon in expanded state
             * @config {String} collapseIconCls
             */
            { name : 'collapseIconCls', defaultValue : 'b-icon b-icon-tree-collapse' },

            /**
             * The icon to use for the collapse icon in expanded state
             * @config {String} collapsedFolderIconCls
             */
            { name : 'collapsedFolderIconCls' },

            /**
             * The icon to use for the collapse icon in expanded state
             * @config {String} expandedFolderIconCls
             */
            { name : 'expandedFolderIconCls' },

            /**
             * Size of the child indent in em. Resulting indent is indentSize multiplied by child level.
             * @config {Number} indentSize
             * @default 1.7
             */
            { name : 'indentSize', defaultValue : 1.7 },

            /**
             * The icon to use for the leaf nodes in the tree
             * @config {String} leafIconCls
             */
            { name : 'leafIconCls', defaultValue : 'b-icon b-icon-tree-leaf' },

            { name : 'editTargetSelector', defaultValue : '.b-tree-cell-value' }
        ];
    }

    static get type() {
        return 'tree';
    }

    constructor(config, store) {
        super(...arguments);

        const me = this;

        me.internalCellCls = 'b-tree-cell';

        // We handle htmlEncoding in this class rather than relying on the generic Row DOM manipulation
        // since this class requires quite a lot of DOM infrastructure around the actual rendered content
        me.shouldHtmlEncode = me.htmlEncode;
        me.setData('htmlEncode', false);

        // add tree renderer (which calls original renderer internally)
        if (me.renderer) {
            me.originalRenderer = me.renderer;
        }
        me.renderer = me.treeRenderer.bind(me);
    }

    /**
     * A column renderer that is automatically added to the column with { tree: true }. It adds padding and node icons
     * to the cell to make the grid appear to be a tree. The original renderer is called in the process.
     * @private
     */
    treeRenderer(renderData) {
        const
            me       = this,
            {
                grid,
                column,
                cellElement,
                row,
                record,
                isExport
            }           = renderData,
            gridMeta    = record.instanceMeta(grid.store),
            innerConfig = {
                className : 'b-tree-cell-value'
            },
            children    = [innerConfig],
            result      = {
                className : 'b-tree-cell-inner',
                tag       : record.href ? 'a' : 'div',
                href      : record.href,
                target    : record.target,
                children
            },
            rowClasses  = {
                'b-tree-parent-row'  : 0,
                'b-tree-collapsed'   : 0,
                'b-tree-expanded'    : 0,
                'b-loading-children' : 0
            };

        let outputIsObject, iconCls, { value } = renderData;

        if (me.originalRenderer) {
            const
                rendererHtml         = me.originalRenderer(renderData),
                // Check if the cell content is going to be rendered by framework
                hasFrameworkRenderer = grid.hasFrameworkRenderer?.({
                    cellContent : rendererHtml,
                    column
                });

            outputIsObject = typeof rendererHtml === 'object' && !hasFrameworkRenderer;

            // Reset the value when framework is responsible for the cell content
            value = hasFrameworkRenderer ? '' : (rendererHtml === false ? cellElement.innerHTML : rendererHtml);

            // Save content to the `rendererHtml` to be used in processCellContent implemented by framework
            renderData.rendererHtml = rendererHtml;
        }

        if (!outputIsObject) {
            value = String(value ?? '');
        }

        if (isExport) {
            return value;
        }

        if (!record.isLeaf) {
            const
                isCollapsed     = gridMeta.collapsed,
                expanderIconCls = isCollapsed ? me.expandIconCls : me.collapseIconCls,
                folderIconCls   = isCollapsed ? me.collapsedFolderIconCls : me.expandedFolderIconCls;

            rowClasses['b-tree-parent-row']  = 1;
            rowClasses['b-tree-collapsed']   = isCollapsed;
            rowClasses['b-tree-expanded']    = !isCollapsed;
            rowClasses['b-loading-children'] = gridMeta.isLoadingChildren;

            cellElement.classList.add('b-tree-parent-cell');

            children.unshift({
                className : 'b-tree-expander',
                children  : expanderIconCls ? [{
                    tag       : 'i',
                    className : {
                        [expanderIconCls] : 1
                    }
                }] : null
            });

            // Allow user to customize tree icon or opt out entirely
            currentParentHasIcon = iconCls = renderData.iconCls || record.iconCls || folderIconCls;
        }
        else {
            // TODO: Cleanup for reusing dom nodes should be done elsewhere, also cleanup selection
            cellElement.classList.add('b-tree-leaf-cell');

            // Allow user to customize tree icon or opt out entirely
            iconCls = renderData.iconCls || record.iconCls || me.leafIconCls;
        }

        // Row can be just a dummy object for example when the renderer is called from Column#resizeToFitContent.
        // Add/remove the various tree node classes.
        if (row.isRow) {
            row.assignCls(rowClasses);
        }

        // If we are encoding HTML, or there's no raw HTML, we can use the children property
        // with the raw value as a child, and DomSync will create a TextNode from that.
        if (outputIsObject || me.shouldHtmlEncode || !value.includes('<')) {
            if (outputIsObject) {
                Object.assign(innerConfig, value);
            }
            innerConfig.children = innerConfig.children || [];

            innerConfig.children.unshift(iconCls ? {
                tag       : 'i',
                className : {
                    'b-tree-icon' : 1,
                    [iconCls]     : 1
                }
            } : null, outputIsObject ? null : value);
        }
        // If we are accepting HTML without encoding it, and there is HTML we must use html property
        else {
            innerConfig.html = `${iconCls ? `<i class="b-tree-icon ${iconCls}"></i>` : ''}${value}`;
        }

        const padding = (record.childLevel * me.indentSize + (record.isLeaf ? (currentParentHasIcon ? 2.0 : (iconCls ? 0.5 : 0.4)) : 0));

        result.style = `padding-left:${padding}em`;

        return result;
    }
}

ColumnStore.registerColumnType(TreeColumn, true);
TreeColumn.exposeProperties();
