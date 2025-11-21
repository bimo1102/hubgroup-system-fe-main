/**
 * React wrapper for Bryntum Grid
 */
import React, { Component } from 'react';
import WrapperHelper from './WrapperHelper.js';
import { Grid } from '@bryntum/scheduler/scheduler.umd';

export default class BryntumGrid extends Component {
    static instanceClass = Grid;

    // Component is View class
    static isView = true;

    dataStores = {};

    featureNames = [
        'cellEditFeature',
        'cellMenuFeature',
        'cellTooltipFeature',
        'columnAutoWidthFeature',
        'columnDragToolbarFeature',
        'columnPickerFeature',
        'columnReorderFeature',
        'columnResizeFeature',
        'contextMenuFeature',
        'excelExporterFeature',
        'filterFeature',
        'filterBarFeature',
        'groupFeature',
        'groupSummaryFeature',
        'headerMenuFeature',
        'pdfExportFeature',
        'quickFindFeature',
        'regionResizeFeature',
        'rowCopyPasteFeature',
        'rowReorderFeature',
        'searchFeature',
        'sortFeature',
        'stickyCellsFeature',
        'stripeFeature',
        'summaryFeature',
        'treeFeature'
    ];

    // Hidden div to host unused portals DOM
    portalsCache = undefined;

    // CSS class used for individual portal containers
    portalContainerClass = 'b-react-portal-container';

    state = {
        // Holds React portals
        portals: new Map(),

        // Needed to trigger refresh when portals change
        generation: 0
    };

    configNames = [
        'adopt',
        'align',
        'anchor',
        'animateRemovingRows',
        'appendTo',
        'autoHeight',
        'bbar',
        'bodyCls',
        'bubbleEvents',
        'centered',
        'cls',
        'columns',
        'config',
        'constrainTo',
        'contentElementCls',
        'contextMenuTriggerEvent',
        'defaultBindProperty',
        'defaultRegion',
        'defaults',
        'destroyStore',
        'disableGridRowModelWarning',
        'dock',
        'draggable',
        'emptyText',
        'enableSticky',
        'enableTextSelection',
        'enableUndoRedoKeys',
        'features',
        'fillLastColumn',
        'fixedRowHeight',
        'floating',
        'footer',
        'fullRowRefresh',
        'getRowHeight',
        'header',
        'hideAnimation',
        'hideHeaders',
        'hideWhenEmpty',
        'htmlCls',
        'insertBefore',
        'insertFirst',
        'itemCls',
        'lazyItems',
        'listeners',
        'loadMask',
        'loadMaskDefaults',
        'loadMaskError',
        'localeClass',
        'localizableProperties',
        'longPressTime',
        'maskDefaults',
        'masked',
        'monitorResize',
        'namedItems',
        'owner',
        'plugins',
        'positioned',
        'preserveFocusOnDatasetChange',
        'preserveScrollOnDatasetChange',
        'preventTooltipOnTouch',
        'resizeToFitIncludesHeader',
        'responsiveLevels',
        'ripple',
        'rootElement',
        'scrollAction',
        'scrollerClass',
        'scrollManager',
        'selectionMode',
        'showAnimation',
        'showDirty',
        'showRemoveRowInContextMenu',
        'showTooltipWhenDisabled',
        'strips',
        'subGridConfigs',
        'syncMask',
        'tab',
        'tag',
        'tbar',
        'textAlign',
        'textContent',
        'title',
        'trapFocus',
        'weight'
    ];

    propertyConfigNames = [
        'alignSelf',
        'columnLines',
        'content',
        'data',
        'dataset',
        'disabled',
        'extraData',
        'flex',
        'height',
        'hidden',
        'html',
        'id',
        'items',
        'layout',
        'layoutStyle',
        'margin',
        'maxHeight',
        'maxWidth',
        'minHeight',
        'minWidth',
        'onBeforeCellEditStart',
        'onBeforeDestroy',
        'onBeforeExport',
        'onBeforeFinishCellEdit',
        'onBeforeHide',
        'onBeforeRenderRows',
        'onBeforeSetRecord',
        'onBeforeShow',
        'onBeforeToggleNode',
        'onCancelCellEdit',
        'onCatchAll',
        'onCellClick',
        'onCellContextMenu',
        'onCellContextMenuBeforeShow',
        'onCellContextMenuShow',
        'onCellDblClick',
        'onCellMenuBeforeShow',
        'onCellMenuItem',
        'onCellMenuShow',
        'onCellMenuToggleItem',
        'onCellMouseOut',
        'onCellMouseOver',
        'onCollapseNode',
        'onContextMenuItem',
        'onContextMenuToggleItem',
        'onDestroy',
        'onExpandNode',
        'onExport',
        'onFinishCellEdit',
        'onFocusIn',
        'onFocusOut',
        'onHeaderContextMenuBeforeShow',
        'onHeaderContextMenuShow',
        'onHeaderMenuBeforeShow',
        'onHeaderMenuItem',
        'onHeaderMenuShow',
        'onHeaderMenuToggleItem',
        'onHide',
        'onMouseOut',
        'onMouseOver',
        'onPaint',
        'onReadOnly',
        'onRenderRows',
        'onResize',
        'onResponsive',
        'onScroll',
        'onSelectionChange',
        'onShow',
        'onStartCellEdit',
        'onSubGridCollapse',
        'onSubGridExpand',
        'onToggleNode',
        'onToolClick',
        'readOnly',
        'rowHeight',
        'scrollable',
        'store',
        'tools',
        'tooltip',
        'transitionDuration',
        'width',
        'x',
        'y'
    ];

    propertyNames = [
        'anchorSize',
        'isSettingValues',
        'isValid',
        'record',
        'selectedCell',
        'selectedRecord',
        'selectedRecords',
        'state',
        'values'
    ];

    // Component instance
    instance = undefined;

    // Component element
    element = undefined;

    /**
     * Invoked immediately after a component is mounted (inserted into the tree)
     */
    componentDidMount() {
        const { createWidget } = WrapperHelper();
        this.instance = createWidget(this);
    }

    // React component removed, destroy instance
    componentWillUnmount() {
        if (this.instance) {
            this.instance.destroy();
        }
    }

    /**
     * Component about to be updated, from changing a prop using state.
     * React to it depending on what changed and prevent react from re-rendering our component.
     * @param nextProps
     * @param nextState
     * @return {boolean}
     */
    shouldComponentUpdate(nextProps, nextState) {
        const { shouldComponentUpdate } = WrapperHelper();
        return shouldComponentUpdate(this, nextProps, nextState);
    }

    render() {
        const className = `b-react-${this.constructor.instanceClass.$name.toLowerCase()}-container`;
        return (
            <React.Fragment>
                <div className={className} ref={(element) => (this.element = element)}>
                    {[...this.state.portals].map((item) => item[1])}
                </div>
                <div ref={(el) => (this.portalsCache = el)} className="b-react-portals-cache" style={{ display: 'none' }}></div>
            </React.Fragment>
        );
    } 

}
