/**
 * Angular wrapper for Bryntum Grid
 */
import { Component, ElementRef, EventEmitter, Output, Input } from '@angular/core';
import WrapperHelper from './wrapper.helper';
// Bryntum 'scheduler.lite.umd' bundle comes without polyfills to support Angular's zone.js
import { Base, Model, Scroller, Widget } from '@bryntum/scheduler/scheduler.lite.umd.js';
import { Grid, StringHelper, WidgetHelper } from '@bryntum/scheduler/scheduler.lite.umd.js';
export class BryntumGridComponent {
    constructor(element) {
        this.bryntumConfig = {
            angularComponent: this,
            adopt: undefined,
            listeners: {},
            features: {}
        };
        // Events
        this.onBeforeCellEditStart = new EventEmitter();
        this.onBeforeDestroy = new EventEmitter();
        this.onBeforeExport = new EventEmitter();
        this.onBeforeFinishCellEdit = new EventEmitter();
        this.onBeforeHide = new EventEmitter();
        this.onBeforeRenderRows = new EventEmitter();
        this.onBeforeSetRecord = new EventEmitter();
        this.onBeforeShow = new EventEmitter();
        this.onBeforeToggleNode = new EventEmitter();
        this.onCancelCellEdit = new EventEmitter();
        this.onCatchAll = new EventEmitter();
        this.onCellClick = new EventEmitter();
        this.onCellContextMenu = new EventEmitter();
        this.onCellDblClick = new EventEmitter();
        this.onCellMouseOut = new EventEmitter();
        this.onCellMouseOver = new EventEmitter();
        this.onCollapseNode = new EventEmitter();
        this.onDestroy = new EventEmitter();
        this.onExpandNode = new EventEmitter();
        this.onExport = new EventEmitter();
        this.onFinishCellEdit = new EventEmitter();
        this.onFocusIn = new EventEmitter();
        this.onFocusOut = new EventEmitter();
        this.onHide = new EventEmitter();
        this.onMouseOut = new EventEmitter();
        this.onMouseOver = new EventEmitter();
        this.onPaint = new EventEmitter();
        this.onReadOnly = new EventEmitter();
        this.onRenderRows = new EventEmitter();
        this.onResize = new EventEmitter();
        this.onResponsive = new EventEmitter();
        this.onScroll = new EventEmitter();
        this.onSelectionChange = new EventEmitter();
        this.onShow = new EventEmitter();
        this.onStartCellEdit = new EventEmitter();
        this.onToggleNode = new EventEmitter();
        this.onToolClick = new EventEmitter();
        this.elementRef = element;
    }
    /**
     * Create and append the underlying widget
     */
    ngOnInit() {
        const me = this, { elementRef, bryntumConfig } = me, { instanceClass, bryntumConfigs } = BryntumGridComponent;
        Object.assign(bryntumConfig, {
            listeners: {
                beforeCellEditStart(event) { me.onBeforeCellEditStart.emit(event); },
                beforeDestroy(event) { me.onBeforeDestroy.emit(event); },
                beforeExport(event) { me.onBeforeExport.emit(event); },
                beforeFinishCellEdit(event) { me.onBeforeFinishCellEdit.emit(event); },
                beforeHide(event) { me.onBeforeHide.emit(event); },
                beforeRenderRows(event) { me.onBeforeRenderRows.emit(event); },
                beforeSetRecord(event) { me.onBeforeSetRecord.emit(event); },
                beforeShow(event) { me.onBeforeShow.emit(event); },
                beforeToggleNode(event) { me.onBeforeToggleNode.emit(event); },
                cancelCellEdit(event) { me.onCancelCellEdit.emit(event); },
                catchAll(event) { me.onCatchAll.emit(event); },
                cellClick(event) { me.onCellClick.emit(event); },
                cellContextMenu(event) { me.onCellContextMenu.emit(event); },
                cellDblClick(event) { me.onCellDblClick.emit(event); },
                cellMouseOut(event) { me.onCellMouseOut.emit(event); },
                cellMouseOver(event) { me.onCellMouseOver.emit(event); },
                collapseNode(event) { me.onCollapseNode.emit(event); },
                destroy(event) { me.onDestroy.emit(event); },
                expandNode(event) { me.onExpandNode.emit(event); },
                export(event) { me.onExport.emit(event); },
                finishCellEdit(event) { me.onFinishCellEdit.emit(event); },
                focusIn(event) { me.onFocusIn.emit(event); },
                focusOut(event) { me.onFocusOut.emit(event); },
                hide(event) { me.onHide.emit(event); },
                mouseOut(event) { me.onMouseOut.emit(event); },
                mouseOver(event) { me.onMouseOver.emit(event); },
                paint(event) { me.onPaint.emit(event); },
                readOnly(event) { me.onReadOnly.emit(event); },
                renderRows(event) { me.onRenderRows.emit(event); },
                resize(event) { me.onResize.emit(event); },
                responsive(event) { me.onResponsive.emit(event); },
                scroll(event) { me.onScroll.emit(event); },
                selectionChange(event) { me.onSelectionChange.emit(event); },
                show(event) { me.onShow.emit(event); },
                startCellEdit(event) { me.onStartCellEdit.emit(event); },
                toggleNode(event) { me.onToggleNode.emit(event); },
                toolClick(event) { me.onToolClick.emit(event); },
                thisObj: me
            }
        });
        // If component has no container specified in config then use adopt to Wrapper's element
        const containerParam = [
            'adopt',
            'appendTo',
            'insertAfter',
            'insertBefore'
        ].find(prop => bryntumConfig[prop]);
        if (!containerParam) {
            bryntumConfig.adopt = elementRef.nativeElement;
        }
        else {
            WrapperHelper.devWarningContainer(instanceClass.$name, containerParam);
        }
        bryntumConfigs.filter(prop => prop in this).forEach(prop => {
            WrapperHelper.applyPropValue(bryntumConfig, prop, this[prop]);
            if (['features', 'config'].includes(prop)) {
                WrapperHelper.devWarningConfigProp(instanceClass.$name, prop);
            }
        });
        // @ts-ignore
        me.instance = instanceClass.$name === 'Widget' ? WidgetHelper.createWidget(bryntumConfig) : new instanceClass(bryntumConfig);
        // Backwards compatibility for gridInstance, schedulerInstance etc.
        me[StringHelper.uncapitalize(instanceClass.$name) + 'Instance'] = me.instance;
        // 
    }
    /**
     * Watch for changes
     * @param changes
     */
    ngOnChanges(changes) {
        const { instance } = this, { instanceClass } = BryntumGridComponent;
        if (!instance) {
            return;
        }
        // Iterate over all changes
        Object.entries(changes).forEach(([prop, change]) => {
            const newValue = change.currentValue, { instance } = this, { bryntumConfigsOnly, bryntumProps } = BryntumGridComponent;
            if (bryntumProps.includes(prop)) {
                WrapperHelper.applyPropValue(instance, prop, newValue, false);
                if (bryntumConfigsOnly.includes(prop)) {
                    WrapperHelper.devWarningUpdateProp(instanceClass.$name, prop);
                }
            }
        });
    }
    /**
     * Destroy the component
     */
    ngOnDestroy() {
        if (this.instance) {
            this.instance.destroy();
        }
    }
}
BryntumGridComponent.instanceClass = Grid;
BryntumGridComponent.bryntumFeatureNames = [
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
BryntumGridComponent.bryntumConfigs = BryntumGridComponent.bryntumFeatureNames.concat([
    'adopt',
    'align',
    'alignSelf',
    'anchor',
    'animateRemovingRows',
    'appendTo',
    'autoHeight',
    'bbar',
    'bodyCls',
    'bubbleEvents',
    'centered',
    'cls',
    'columnLines',
    'columns',
    'config',
    'constrainTo',
    'content',
    'contentElementCls',
    'contextMenuTriggerEvent',
    'data',
    'dataset',
    'defaultBindProperty',
    'defaultRegion',
    'defaults',
    'destroyStore',
    'disabled',
    'disableGridRowModelWarning',
    'dock',
    'draggable',
    'emptyText',
    'enableSticky',
    'enableTextSelection',
    'enableUndoRedoKeys',
    'extraData',
    'features',
    'fillLastColumn',
    'fixedRowHeight',
    'flex',
    'floating',
    'footer',
    'fullRowRefresh',
    'getRowHeight',
    'header',
    'height',
    'hidden',
    'hideAnimation',
    'hideHeaders',
    'hideWhenEmpty',
    'html',
    'htmlCls',
    'id',
    'insertBefore',
    'insertFirst',
    'itemCls',
    'items',
    'layout',
    'layoutStyle',
    'lazyItems',
    'listeners',
    'loadMask',
    'loadMaskDefaults',
    'loadMaskError',
    'localeClass',
    'localizableProperties',
    'longPressTime',
    'margin',
    'maskDefaults',
    'masked',
    'maxHeight',
    'maxWidth',
    'minHeight',
    'minWidth',
    'monitorResize',
    'namedItems',
    'owner',
    'plugins',
    'positioned',
    'preserveFocusOnDatasetChange',
    'preserveScrollOnDatasetChange',
    'preventTooltipOnTouch',
    'readOnly',
    'resizeToFitIncludesHeader',
    'responsiveLevels',
    'ripple',
    'rootElement',
    'rowHeight',
    'scrollable',
    'scrollAction',
    'scrollerClass',
    'scrollManager',
    'selectionMode',
    'showAnimation',
    'showDirty',
    'showRemoveRowInContextMenu',
    'store',
    'strips',
    'subGridConfigs',
    'syncMask',
    'tab',
    'tag',
    'tbar',
    'textAlign',
    'textContent',
    'title',
    'tools',
    'tooltip',
    'transitionDuration',
    'trapFocus',
    'weight',
    'width',
    'x',
    'y'
]);
BryntumGridComponent.bryntumConfigsOnly = [
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
BryntumGridComponent.bryntumProps = BryntumGridComponent.bryntumFeatureNames.concat([
    'alignSelf',
    'anchorSize',
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
    'isSettingValues',
    'isValid',
    'items',
    'layout',
    'layoutStyle',
    'margin',
    'maxHeight',
    'maxWidth',
    'minHeight',
    'minWidth',
    'readOnly',
    'record',
    'rowHeight',
    'scrollable',
    'selectedCell',
    'selectedRecord',
    'selectedRecords',
    'state',
    'store',
    'tools',
    'tooltip',
    'transitionDuration',
    'values',
    'width',
    'x',
    'y'
]);
BryntumGridComponent.decorators = [
    { type: Component, args: [{
                selector: 'bryntum-grid',
                template: ''
            }] }
];
/** @nocollapse */
BryntumGridComponent.ctorParameters = () => [
    { type: ElementRef }
];
BryntumGridComponent.propDecorators = {
    adopt: [{ type: Input }],
    align: [{ type: Input }],
    anchor: [{ type: Input }],
    animateRemovingRows: [{ type: Input }],
    appendTo: [{ type: Input }],
    autoHeight: [{ type: Input }],
    bbar: [{ type: Input }],
    bodyCls: [{ type: Input }],
    bubbleEvents: [{ type: Input }],
    centered: [{ type: Input }],
    cls: [{ type: Input }],
    columns: [{ type: Input }],
    config: [{ type: Input }],
    constrainTo: [{ type: Input }],
    contentElementCls: [{ type: Input }],
    contextMenuTriggerEvent: [{ type: Input }],
    defaultBindProperty: [{ type: Input }],
    defaultRegion: [{ type: Input }],
    defaults: [{ type: Input }],
    destroyStore: [{ type: Input }],
    disableGridRowModelWarning: [{ type: Input }],
    dock: [{ type: Input }],
    draggable: [{ type: Input }],
    emptyText: [{ type: Input }],
    enableSticky: [{ type: Input }],
    enableTextSelection: [{ type: Input }],
    enableUndoRedoKeys: [{ type: Input }],
    features: [{ type: Input }],
    fillLastColumn: [{ type: Input }],
    fixedRowHeight: [{ type: Input }],
    floating: [{ type: Input }],
    footer: [{ type: Input }],
    fullRowRefresh: [{ type: Input }],
    getRowHeight: [{ type: Input }],
    header: [{ type: Input }],
    hideAnimation: [{ type: Input }],
    hideHeaders: [{ type: Input }],
    hideWhenEmpty: [{ type: Input }],
    htmlCls: [{ type: Input }],
    insertBefore: [{ type: Input }],
    insertFirst: [{ type: Input }],
    itemCls: [{ type: Input }],
    lazyItems: [{ type: Input }],
    listeners: [{ type: Input }],
    loadMask: [{ type: Input }],
    loadMaskDefaults: [{ type: Input }],
    loadMaskError: [{ type: Input }],
    localeClass: [{ type: Input }],
    localizableProperties: [{ type: Input }],
    longPressTime: [{ type: Input }],
    maskDefaults: [{ type: Input }],
    masked: [{ type: Input }],
    monitorResize: [{ type: Input }],
    namedItems: [{ type: Input }],
    owner: [{ type: Input }],
    plugins: [{ type: Input }],
    positioned: [{ type: Input }],
    preserveFocusOnDatasetChange: [{ type: Input }],
    preserveScrollOnDatasetChange: [{ type: Input }],
    preventTooltipOnTouch: [{ type: Input }],
    resizeToFitIncludesHeader: [{ type: Input }],
    responsiveLevels: [{ type: Input }],
    ripple: [{ type: Input }],
    rootElement: [{ type: Input }],
    scrollAction: [{ type: Input }],
    scrollerClass: [{ type: Input }],
    scrollManager: [{ type: Input }],
    selectionMode: [{ type: Input }],
    showAnimation: [{ type: Input }],
    showDirty: [{ type: Input }],
    showRemoveRowInContextMenu: [{ type: Input }],
    strips: [{ type: Input }],
    subGridConfigs: [{ type: Input }],
    syncMask: [{ type: Input }],
    tab: [{ type: Input }],
    tag: [{ type: Input }],
    tbar: [{ type: Input }],
    textAlign: [{ type: Input }],
    textContent: [{ type: Input }],
    title: [{ type: Input }],
    trapFocus: [{ type: Input }],
    weight: [{ type: Input }],
    alignSelf: [{ type: Input }],
    columnLines: [{ type: Input }],
    content: [{ type: Input }],
    data: [{ type: Input }],
    dataset: [{ type: Input }],
    disabled: [{ type: Input }],
    extraData: [{ type: Input }],
    flex: [{ type: Input }],
    height: [{ type: Input }],
    hidden: [{ type: Input }],
    html: [{ type: Input }],
    id: [{ type: Input }],
    items: [{ type: Input }],
    layout: [{ type: Input }],
    layoutStyle: [{ type: Input }],
    margin: [{ type: Input }],
    maxHeight: [{ type: Input }],
    maxWidth: [{ type: Input }],
    minHeight: [{ type: Input }],
    minWidth: [{ type: Input }],
    readOnly: [{ type: Input }],
    rowHeight: [{ type: Input }],
    scrollable: [{ type: Input }],
    store: [{ type: Input }],
    tools: [{ type: Input }],
    tooltip: [{ type: Input }],
    transitionDuration: [{ type: Input }],
    width: [{ type: Input }],
    x: [{ type: Input }],
    y: [{ type: Input }],
    anchorSize: [{ type: Input }],
    isSettingValues: [{ type: Input }],
    isValid: [{ type: Input }],
    record: [{ type: Input }],
    selectedCell: [{ type: Input }],
    selectedRecord: [{ type: Input }],
    selectedRecords: [{ type: Input }],
    state: [{ type: Input }],
    values: [{ type: Input }],
    onBeforeCellEditStart: [{ type: Output }],
    onBeforeDestroy: [{ type: Output }],
    onBeforeExport: [{ type: Output }],
    onBeforeFinishCellEdit: [{ type: Output }],
    onBeforeHide: [{ type: Output }],
    onBeforeRenderRows: [{ type: Output }],
    onBeforeSetRecord: [{ type: Output }],
    onBeforeShow: [{ type: Output }],
    onBeforeToggleNode: [{ type: Output }],
    onCancelCellEdit: [{ type: Output }],
    onCatchAll: [{ type: Output }],
    onCellClick: [{ type: Output }],
    onCellContextMenu: [{ type: Output }],
    onCellDblClick: [{ type: Output }],
    onCellMouseOut: [{ type: Output }],
    onCellMouseOver: [{ type: Output }],
    onCollapseNode: [{ type: Output }],
    onDestroy: [{ type: Output }],
    onExpandNode: [{ type: Output }],
    onExport: [{ type: Output }],
    onFinishCellEdit: [{ type: Output }],
    onFocusIn: [{ type: Output }],
    onFocusOut: [{ type: Output }],
    onHide: [{ type: Output }],
    onMouseOut: [{ type: Output }],
    onMouseOver: [{ type: Output }],
    onPaint: [{ type: Output }],
    onReadOnly: [{ type: Output }],
    onRenderRows: [{ type: Output }],
    onResize: [{ type: Output }],
    onResponsive: [{ type: Output }],
    onScroll: [{ type: Output }],
    onSelectionChange: [{ type: Output }],
    onShow: [{ type: Output }],
    onStartCellEdit: [{ type: Output }],
    onToggleNode: [{ type: Output }],
    onToolClick: [{ type: Output }],
    cellEditFeature: [{ type: Input }],
    cellMenuFeature: [{ type: Input }],
    cellTooltipFeature: [{ type: Input }],
    columnAutoWidthFeature: [{ type: Input }],
    columnDragToolbarFeature: [{ type: Input }],
    columnPickerFeature: [{ type: Input }],
    columnReorderFeature: [{ type: Input }],
    columnResizeFeature: [{ type: Input }],
    contextMenuFeature: [{ type: Input }],
    excelExporterFeature: [{ type: Input }],
    filterFeature: [{ type: Input }],
    filterBarFeature: [{ type: Input }],
    groupFeature: [{ type: Input }],
    groupSummaryFeature: [{ type: Input }],
    headerMenuFeature: [{ type: Input }],
    pdfExportFeature: [{ type: Input }],
    quickFindFeature: [{ type: Input }],
    regionResizeFeature: [{ type: Input }],
    rowCopyPasteFeature: [{ type: Input }],
    rowReorderFeature: [{ type: Input }],
    searchFeature: [{ type: Input }],
    sortFeature: [{ type: Input }],
    stickyCellsFeature: [{ type: Input }],
    stripeFeature: [{ type: Input }],
    summaryFeature: [{ type: Input }],
    treeFeature: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJ5bnR1bS1ncmlkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BicnludHVtL3NjaGVkdWxlci1hbmd1bGFyLyIsInNvdXJjZXMiOlsibGliL2JyeW50dW0tZ3JpZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0dBRUc7QUFFSCxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQXFCLE1BQU0sRUFBRSxLQUFLLEVBQStCLE1BQU0sZUFBZSxDQUFDO0FBQ25JLE9BQU8sYUFBYSxNQUFNLGtCQUFrQixDQUFDO0FBRTdDLDJGQUEyRjtBQUMzRixPQUFPLEVBQUUsSUFBSSxFQUFrbUIsS0FBSyxFQUE0TCxRQUFRLEVBQXNKLE1BQU0sRUFBZ0IsTUFBTSwwQ0FBMEMsQ0FBQztBQUNyaEMsT0FBTyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLE1BQU0sMENBQTBDLENBQUM7QUFNNUYsTUFBTSxPQUFPLG9CQUFvQjtJQTZSN0IsWUFBWSxPQUFtQjtRQVB2QixrQkFBYSxHQUFHO1lBQ3BCLGdCQUFnQixFQUFHLElBQUk7WUFDdkIsS0FBSyxFQUFjLFNBQVM7WUFDNUIsU0FBUyxFQUFVLEVBQUU7WUFDckIsUUFBUSxFQUFXLEVBQUU7U0FDeEIsQ0FBQztRQXFJRCxTQUFTO1FBQ0EsMEJBQXFCLEdBQUksSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUNwRCxvQkFBZSxHQUFVLElBQUksWUFBWSxFQUFVLENBQUM7UUFDcEQsbUJBQWMsR0FBVyxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQ3BELDJCQUFzQixHQUFHLElBQUksWUFBWSxFQUFVLENBQUM7UUFDcEQsaUJBQVksR0FBYSxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQ3BELHVCQUFrQixHQUFPLElBQUksWUFBWSxFQUFVLENBQUM7UUFDcEQsc0JBQWlCLEdBQVEsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUNwRCxpQkFBWSxHQUFhLElBQUksWUFBWSxF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QU07dUJBQ04sTUFBTTsyQkFDTixNQUFNO3VCQUNOLE1BQU07Z0NBQ04sTUFBTTtxQkFDTixNQUFNOzhCQUNOLE1BQU07MkJBQ04sTUFBTTswQkFDTixNQUFNOzhCQUdOLEtBQUs7OEJBQ0wsS0FBSztpQ0FDTCxLQUFLO3FDQUNMLEtBQUs7dUNBQ0wsS0FBSztrQ0FDTCxLQUFLO21DQUNMLEtBQUs7a0NBQ0wsS0FBSztpQ0FDTCxLQUFLO21DQUNMLEtBQUs7NEJBQ0wsS0FBSzsrQkFDTCxLQUFLOzJCQUNMLEtBQUs7a0NBQ0wsS0FBSztnQ0FDTCxLQUFLOytCQUNMLEtBQUs7K0JBQ0wsS0FBSztrQ0FDTCxLQUFLO2tDQUNMLEtBQUs7Z0NBQ0wsS0FBSzs0QkFDTCxLQUFLOzBCQUNMLEtBQUs7aUNBQ0wsS0FBSzs0QkFDTCxLQUFLOzZCQUNMLEtBQUs7MEJBQ0wsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQW5ndWxhciB3cmFwcGVyIGZvciBCcnludHVtIEdyaWRcbiAqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgT25EZXN0cm95LCBPbkluaXQsIE91dHB1dCwgSW5wdXQsIFNpbXBsZUNoYW5nZSwgU2ltcGxlQ2hhbmdlcyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IFdyYXBwZXJIZWxwZXIgZnJvbSAnLi93cmFwcGVyLmhlbHBlcic7XG5cbi8vIEJyeW50dW0gJ3NjaGVkdWxlci5saXRlLnVtZCcgYnVuZGxlIGNvbWVzIHdpdGhvdXQgcG9seWZpbGxzIHRvIHN1cHBvcnQgQW5ndWxhcidzIHpvbmUuanNcbmltcG9ydCB7IEJhc2UsIENlbGxFZGl0LCBDZWxsRWRpdENvbmZpZywgQ2VsbE1lbnUsIENlbGxNZW51Q29uZmlnLCBDZWxsVG9vbHRpcCwgQ2VsbFRvb2x0aXBDb25maWcsIENvbHVtbkF1dG9XaWR0aCwgQ29sdW1uQXV0b1dpZHRoQ29uZmlnLCBDb2x1bW5EcmFnVG9vbGJhciwgQ29sdW1uRHJhZ1Rvb2xiYXJDb25maWcsIENvbHVtblBpY2tlciwgQ29sdW1uUGlja2VyQ29uZmlnLCBDb2x1bW5SZW9yZGVyLCBDb2x1bW5SZW9yZGVyQ29uZmlnLCBDb2x1bW5SZXNpemUsIENvbHVtblJlc2l6ZUNvbmZpZywgQ29udGV4dE1lbnUsIENvbnRleHRNZW51Q29uZmlnLCBGaWx0ZXIsIEZpbHRlckJhciwgRmlsdGVyQmFyQ29uZmlnLCBGaWx0ZXJDb25maWcsIEdyaWRFeGNlbEV4cG9ydGVyLCBHcmlkRXhjZWxFeHBvcnRlckNvbmZpZywgR3JpZEZlYXR1cmVzQ29uZmlnVHlwZSwgR3JpZEdyb3VwU3VtbWFyeSwgR3JpZEdyb3VwU3VtbWFyeUNvbmZpZywgR3JpZFBkZkV4cG9ydCwgR3JpZFBkZkV4cG9ydENvbmZpZywgR3JpZFN1bW1hcnksIEdyaWRTdW1tYXJ5Q29uZmlnLCBHcm91cCwgR3JvdXBDb25maWcsIEhlYWRlck1lbnUsIEhlYWRlck1lbnVDb25maWcsIExheW91dCwgTWFzaywgTWFza0NvbmZpZywgTW9kZWwsIFBhbmVsSGVhZGVyLCBRdWlja0ZpbmQsIFF1aWNrRmluZENvbmZpZywgUmVjdGFuZ2xlLCBSZWdpb25SZXNpemUsIFJlZ2lvblJlc2l6ZUNvbmZpZywgUm93Q29weVBhc3RlLCBSb3dDb3B5UGFzdGVDb25maWcsIFJvd1Jlb3JkZXIsIFJvd1Jlb3JkZXJDb25maWcsIFNjcm9sbE1hbmFnZXIsIFNjcm9sbE1hbmFnZXJDb25maWcsIFNjcm9sbGVyLCBTY3JvbGxlckNvbmZpZywgU2VhcmNoLCBTZWFyY2hDb25maWcsIFNvcnQsIFNvcnRDb25maWcsIFN0aWNreUNlbGxzLCBTdGlja3lDZWxsc0NvbmZpZywgU3RvcmUsIFN0b3JlQ29uZmlnLCBTdHJpcGUsIFN0cmlwZUNvbmZpZywgVHJlZSwgVHJlZUNvbmZpZywgV2lkZ2V0LCBXaWRnZXRDb25maWcgfSBmcm9tICdAYnJ5bnR1bS9zY2hlZHVsZXIvc2NoZWR1bGVyLmxpdGUudW1kLmpzJztcbmltcG9ydCB7IEdyaWQsIFN0cmluZ0hlbHBlciwgV2lkZ2V0SGVscGVyIH0gZnJvbSAnQGJyeW50dW0vc2NoZWR1bGVyL3NjaGVkdWxlci5saXRlLnVtZC5qcyc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yIDogJ2JyeW50dW0tZ3JpZCcsXG4gICAgdGVtcGxhdGUgOiAnJ1xufSlcbmV4cG9ydCBjbGFzcyBCcnludHVtR3JpZENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcblxuICAgIHB1YmxpYyBzdGF0aWMgaW5zdGFuY2VDbGFzcyA9IEdyaWQ7XG5cbiAgICBwcml2YXRlIHN0YXRpYyBicnludHVtRmVhdHVyZU5hbWVzOiBzdHJpbmdbXSA9IFtcbiAgICAgICAgJ2NlbGxFZGl0RmVhdHVyZScsXG4gICAgICAgICdjZWxsTWVudUZlYXR1cmUnLFxuICAgICAgICAnY2VsbFRvb2x0aXBGZWF0dXJlJyxcbiAgICAgICAgJ2NvbHVtbkF1dG9XaWR0aEZlYXR1cmUnLFxuICAgICAgICAnY29sdW1uRHJhZ1Rvb2xiYXJGZWF0dXJlJyxcbiAgICAgICAgJ2NvbHVtblBpY2tlckZlYXR1cmUnLFxuICAgICAgICAnY29sdW1uUmVvcmRlckZlYXR1cmUnLFxuICAgICAgICAnY29sdW1uUmVzaXplRmVhdHVyZScsXG4gICAgICAgICdjb250ZXh0TWVudUZlYXR1cmUnLFxuICAgICAgICAnZXhjZWxFeHBvcnRlckZlYXR1cmUnLFxuICAgICAgICAnZmlsdGVyRmVhdHVyZScsXG4gICAgICAgICdmaWx0ZXJCYXJGZWF0dXJlJyxcbiAgICAgICAgJ2dyb3VwRmVhdHVyZScsXG4gICAgICAgICdncm91cFN1bW1hcnlGZWF0dXJlJyxcbiAgICAgICAgJ2hlYWRlck1lbnVGZWF0dXJlJyxcbiAgICAgICAgJ3BkZkV4cG9ydEZlYXR1cmUnLFxuICAgICAgICAncXVpY2tGaW5kRmVhdHVyZScsXG4gICAgICAgICdyZWdpb25SZXNpemVGZWF0dXJlJyxcbiAgICAgICAgJ3Jvd0NvcHlQYXN0ZUZlYXR1cmUnLFxuICAgICAgICAncm93UmVvcmRlckZlYXR1cmUnLFxuICAgICAgICAnc2VhcmNoRmVhdHVyZScsXG4gICAgICAgICdzb3J0RmVhdHVyZScsXG4gICAgICAgICdzdGlja3lDZWxsc0ZlYXR1cmUnLFxuICAgICAgICAnc3RyaXBlRmVhdHVyZScsXG4gICAgICAgICdzdW1tYXJ5RmVhdHVyZScsXG4gICAgICAgICd0cmVlRmVhdHVyZSdcbiAgICBdO1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bUNvbmZpZ3M6IHN0cmluZ1tdID0gQnJ5bnR1bUdyaWRDb21wb25lbnQuYnJ5bnR1bUZlYXR1cmVOYW1lcy5jb25jYXQoW1xuICAgICAgICAnYWRvcHQnLFxuICAgICAgICAnYWxpZ24nLFxuICAgICAgICAnYWxpZ25TZWxmJyxcbiAgICAgICAgJ2FuY2hvcicsXG4gICAgICAgICdhbmltYXRlUmVtb3ZpbmdSb3dzJyxcbiAgICAgICAgJ2FwcGVuZFRvJyxcbiAgICAgICAgJ2F1dG9IZWlnaHQnLFxuICAgICAgICAnYmJhcicsXG4gICAgICAgICdib2R5Q2xzJyxcbiAgICAgICAgJ2J1YmJsZUV2ZW50cycsXG4gICAgICAgICdjZW50ZXJlZCcsXG4gICAgICAgICdjbHMnLFxuICAgICAgICAnY29sdW1uTGluZXMnLFxuICAgICAgICAnY29sdW1ucycsXG4gICAgICAgICdjb25maWcnLFxuICAgICAgICAnY29uc3RyYWluVG8nLFxuICAgICAgICAnY29udGVudCcsXG4gICAgICAgICdjb250ZW50RWxlbWVudENscycsXG4gICAgICAgICdjb250ZXh0TWVudVRyaWdnZXJFdmVudCcsXG4gICAgICAgICdkYXRhJyxcbiAgICAgICAgJ2RhdGFzZXQnLFxuICAgICAgICAnZGVmYXVsdEJpbmRQcm9wZXJ0eScsXG4gICAgICAgICdkZWZhdWx0UmVnaW9uJyxcbiAgICAgICAgJ2RlZmF1bHRzJyxcbiAgICAgICAgJ2Rlc3Ryb3lTdG9yZScsXG4gICAgICAgICdkaXNhYmxlZCcsXG4gICAgICAgICdkaXNhYmxlR3JpZFJvd01vZGVsV2FybmluZycsXG4gICAgICAgICdkb2NrJyxcbiAgICAgICAgJ2RyYWdnYWJsZScsXG4gICAgICAgICdlbXB0eVRleHQnLFxuICAgICAgICAnZW5hYmxlU3RpY2t5JyxcbiAgICAgICAgJ2VuYWJsZVRleHRTZWxlY3Rpb24nLFxuICAgICAgICAnZW5hYmxlVW5kb1JlZG9LZXlzJyxcbiAgICAgICAgJ2V4dHJhRGF0YScsXG4gICAgICAgICdmZWF0dXJlcycsXG4gICAgICAgICdmaWxsTGFzdENvbHVtbicsXG4gICAgICAgICdmaXhlZFJvd0hlaWdodCcsXG4gICAgICAgICdmbGV4JyxcbiAgICAgICAgJ2Zsb2F0aW5nJyxcbiAgICAgICAgJ2Zvb3RlcicsXG4gICAgICAgICdmdWxsUm93UmVmcmVzaCcsXG4gICAgICAgICdnZXRSb3dIZWlnaHQnLFxuICAgICAgICAnaGVhZGVyJyxcbiAgICAgICAgJ2hlaWdodCcsXG4gICAgICAgICdoaWRkZW4nLFxuICAgICAgICAnaGlkZUFuaW1hdGlvbicsXG4gICAgICAgICdoaWRlSGVhZGVycycsXG4gICAgICAgICdoaWRlV2hlbkVtcHR5JyxcbiAgICAgICAgJ2h0bWwnLFxuICAgICAgICAnaHRtbENscycsXG4gICAgICAgICdpZCcsXG4gICAgICAgICdpbnNlcnRCZWZvcmUnLFxuICAgICAgICAnaW5zZXJ0Rmlyc3QnLFxuICAgICAgICAnaXRlbUNscycsXG4gICAgICAgICdpdGVtcycsXG4gICAgICAgICdsYXlvdXQnLFxuICAgICAgICAnbGF5b3V0U3R5bGUnLFxuICAgICAgICAnbGF6eUl0ZW1zJyxcbiAgICAgICAgJ2xpc3RlbmVycycsXG4gICAgICAgICdsb2FkTWFzaycsXG4gICAgICAgICdsb2FkTWFza0RlZmF1bHRzJyxcbiAgICAgICAgJ2xvYWRNYXNrRXJyb3InLFxuICAgICAgICAnbG9jYWxlQ2xhc3MnLFxuICAgICAgICAnbG9jYWxpemFibGVQcm9wZXJ0aWVzJyxcbiAgICAgICAgJ2xvbmdQcmVzc1RpbWUnLFxuICAgICAgICAnbWFyZ2luJyxcbiAgICAgICAgJ21hc2tEZWZhdWx0cycsXG4gICAgICAgICdtYXNrZWQnLFxuICAgICAgICAnbWF4SGVpZ2h0JyxcbiAgICAgICAgJ21heFdpZHRoJyxcbiAgICAgICAgJ21pbkhlaWdodCcsXG4gICAgICAgICdtaW5XaWR0aCcsXG4gICAgICAgICdtb25pdG9yUmVzaXplJyxcbiAgICAgICAgJ25hbWVkSXRlbXMnLFxuICAgICAgICAnb3duZXInLFxuICAgICAgICAncGx1Z2lucycsXG4gICAgICAgICdwb3NpdGlvbmVkJyxcbiAgICAgICAgJ3ByZXNlcnZlRm9jdXNPbkRhdGFzZXRDaGFuZ2UnLFxuICAgICAgICAncHJlc2VydmVTY3JvbGxPbkRhdGFzZXRDaGFuZ2UnLFxuICAgICAgICAncHJldmVudFRvb2x0aXBPblRvdWNoJyxcbiAgICAgICAgJ3JlYWRPbmx5JyxcbiAgICAgICAgJ3Jlc2l6ZVRvRml0SW5jbHVkZXNIZWFkZXInLFxuICAgICAgICAncmVzcG9uc2l2ZUxldmVscycsXG4gICAgICAgICdyaXBwbGUnLFxuICAgICAgICAncm9vdEVsZW1lbnQnLFxuICAgICAgICAncm93SGVpZ2h0JyxcbiAgICAgICAgJ3Njcm9sbGFibGUnLFxuICAgICAgICAnc2Nyb2xsQWN0aW9uJyxcbiAgICAgICAgJ3Njcm9sbGVyQ2xhc3MnLFxuICAgICAgICAnc2Nyb2xsTWFuYWdlcicsXG4gICAgICAgICdzZWxlY3Rpb25Nb2RlJyxcbiAgICAgICAgJ3Nob3dBbmltYXRpb24nLFxuICAgICAgICAnc2hvd0RpcnR5JyxcbiAgICAgICAgJ3Nob3dSZW1vdmVSb3dJbkNvbnRleHRNZW51JyxcbiAgICAgICAgJ3N0b3JlJyxcbiAgICAgICAgJ3N0cmlwcycsXG4gICAgICAgICdzdWJHcmlkQ29uZmlncycsXG4gICAgICAgICdzeW5jTWFzaycsXG4gICAgICAgICd0YWInLFxuICAgICAgICAndGFnJyxcbiAgICAgICAgJ3RiYXInLFxuICAgICAgICAndGV4dEFsaWduJyxcbiAgICAgICAgJ3RleHRDb250ZW50JyxcbiAgICAgICAgJ3RpdGxlJyxcbiAgICAgICAgJ3Rvb2xzJyxcbiAgICAgICAgJ3Rvb2x0aXAnLFxuICAgICAgICAndHJhbnNpdGlvbkR1cmF0aW9uJyxcbiAgICAgICAgJ3RyYXBGb2N1cycsXG4gICAgICAgICd3ZWlnaHQnLFxuICAgICAgICAnd2lkdGgnLFxuICAgICAgICAneCcsXG4gICAgICAgICd5J1xuICAgIF0pO1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bUNvbmZpZ3NPbmx5OiBzdHJpbmdbXSA9IFtcbiAgICAgICAgJ2Fkb3B0JyxcbiAgICAgICAgJ2FsaWduJyxcbiAgICAgICAgJ2FuY2hvcicsXG4gICAgICAgICdhbmltYXRlUmVtb3ZpbmdSb3dzJyxcbiAgICAgICAgJ2FwcGVuZFRvJyxcbiAgICAgICAgJ2F1dG9IZWlnaHQnLFxuICAgICAgICAnYmJhcicsXG4gICAgICAgICdib2R5Q2xzJyxcbiAgICAgICAgJ2J1YmJsZUV2ZW50cycsXG4gICAgICAgICdjZW50ZXJlZCcsXG4gICAgICAgICdjbHMnLFxuICAgICAgICAnY29sdW1ucycsXG4gICAgICAgICdjb25maWcnLFxuICAgICAgICAnY29uc3RyYWluVG8nLFxuICAgICAgICAnY29udGVudEVsZW1lbnRDbHMnLFxuICAgICAgICAnY29udGV4dE1lbnVUcmlnZ2VyRXZlbnQnLFxuICAgICAgICAnZGVmYXVsdEJpbmRQcm9wZXJ0eScsXG4gICAgICAgICdkZWZhdWx0UmVnaW9uJyxcbiAgICAgICAgJ2RlZmF1bHRzJyxcbiAgICAgICAgJ2Rlc3Ryb3lTdG9yZScsXG4gICAgICAgICdkaXNhYmxlR3JpZFJvd01vZGVsV2FybmluZycsXG4gICAgICAgICdkb2NrJyxcbiAgICAgICAgJ2RyYWdnYWJsZScsXG4gICAgICAgICdlbXB0eVRleHQnLFxuICAgICAgICAnZW5hYmxlU3RpY2t5JyxcbiAgICAgICAgJ2VuYWJsZVRleHRTZWxlY3Rpb24nLFxuICAgICAgICAnZW5hYmxlVW5kb1JlZG9LZXlzJyxcbiAgICAgICAgJ2ZlYXR1cmVzJyxcbiAgICAgICAgJ2ZpbGxMYXN0Q29sdW1uJyxcbiAgICAgICAgJ2ZpeGVkUm93SGVpZ2h0JyxcbiAgICAgICAgJ2Zsb2F0aW5nJyxcbiAgICAgICAgJ2Zvb3RlcicsXG4gICAgICAgICdmdWxsUm93UmVmcmVzaCcsXG4gICAgICAgICdnZXRSb3dIZWlnaHQnLFxuICAgICAgICAnaGVhZGVyJyxcbiAgICAgICAgJ2hpZGVBbmltYXRpb24nLFxuICAgICAgICAnaGlkZUhlYWRlcnMnLFxuICAgICAgICAnaGlkZVdoZW5FbXB0eScsXG4gICAgICAgICdodG1sQ2xzJyxcbiAgICAgICAgJ2luc2VydEJlZm9yZScsXG4gICAgICAgICdpbnNlcnRGaXJzdCcsXG4gICAgICAgICdpdGVtQ2xzJyxcbiAgICAgICAgJ2xhenlJdGVtcycsXG4gICAgICAgICdsaXN0ZW5lcnMnLFxuICAgICAgICAnbG9hZE1hc2snLFxuICAgICAgICAnbG9hZE1hc2tEZWZhdWx0cycsXG4gICAgICAgICdsb2FkTWFza0Vycm9yJyxcbiAgICAgICAgJ2xvY2FsZUNsYXNzJyxcbiAgICAgICAgJ2xvY2FsaXphYmxlUHJvcGVydGllcycsXG4gICAgICAgICdsb25nUHJlc3NUaW1lJyxcbiAgICAgICAgJ21hc2tEZWZhdWx0cycsXG4gICAgICAgICdtYXNrZWQnLFxuICAgICAgICAnbW9uaXRvclJlc2l6ZScsXG4gICAgICAgICduYW1lZEl0ZW1zJyxcbiAgICAgICAgJ293bmVyJyxcbiAgICAgICAgJ3BsdWdpbnMnLFxuICAgICAgICAncG9zaXRpb25lZCcsXG4gICAgICAgICdwcmVzZXJ2ZUZvY3VzT25EYXRhc2V0Q2hhbmdlJyxcbiAgICAgICAgJ3ByZXNlcnZlU2Nyb2xsT25EYXRhc2V0Q2hhbmdlJyxcbiAgICAgICAgJ3ByZXZlbnRUb29sdGlwT25Ub3VjaCcsXG4gICAgICAgICdyZXNpemVUb0ZpdEluY2x1ZGVzSGVhZGVyJyxcbiAgICAgICAgJ3Jlc3BvbnNpdmVMZXZlbHMnLFxuICAgICAgICAncmlwcGxlJyxcbiAgICAgICAgJ3Jvb3RFbGVtZW50JyxcbiAgICAgICAgJ3Njcm9sbEFjdGlvbicsXG4gICAgICAgICdzY3JvbGxlckNsYXNzJyxcbiAgICAgICAgJ3Njcm9sbE1hbmFnZXInLFxuICAgICAgICAnc2VsZWN0aW9uTW9kZScsXG4gICAgICAgICdzaG93QW5pbWF0aW9uJyxcbiAgICAgICAgJ3Nob3dEaXJ0eScsXG4gICAgICAgICdzaG93UmVtb3ZlUm93SW5Db250ZXh0TWVudScsXG4gICAgICAgICdzdHJpcHMnLFxuICAgICAgICAnc3ViR3JpZENvbmZpZ3MnLFxuICAgICAgICAnc3luY01hc2snLFxuICAgICAgICAndGFiJyxcbiAgICAgICAgJ3RhZycsXG4gICAgICAgICd0YmFyJyxcbiAgICAgICAgJ3RleHRBbGlnbicsXG4gICAgICAgICd0ZXh0Q29udGVudCcsXG4gICAgICAgICd0aXRsZScsXG4gICAgICAgICd0cmFwRm9jdXMnLFxuICAgICAgICAnd2VpZ2h0J1xuICAgIF07XG5cbiAgICBwcml2YXRlIHN0YXRpYyBicnludHVtUHJvcHM6IHN0cmluZ1tdID0gQnJ5bnR1bUdyaWRDb21wb25lbnQuYnJ5bnR1bUZlYXR1cmVOYW1lcy5jb25jYXQoW1xuICAgICAgICAnYWxpZ25TZWxmJyxcbiAgICAgICAgJ2FuY2hvclNpemUnLFxuICAgICAgICAnY29sdW1uTGluZXMnLFxuICAgICAgICAnY29udGVudCcsXG4gICAgICAgICdkYXRhJyxcbiAgICAgICAgJ2RhdGFzZXQnLFxuICAgICAgICAnZGlzYWJsZWQnLFxuICAgICAgICAnZXh0cmFEYXRhJyxcbiAgICAgICAgJ2ZsZXgnLFxuICAgICAgICAnaGVpZ2h0JyxcbiAgICAgICAgJ2hpZGRlbicsXG4gICAgICAgICdodG1sJyxcbiAgICAgICAgJ2lkJyxcbiAgICAgICAgJ2lzU2V0dGluZ1ZhbHVlcycsXG4gICAgICAgICdpc1ZhbGlkJyxcbiAgICAgICAgJ2l0ZW1zJyxcbiAgICAgICAgJ2xheW91dCcsXG4gICAgICAgICdsYXlvdXRTdHlsZScsXG4gICAgICAgICdtYXJnaW4nLFxuICAgICAgICAnbWF4SGVpZ2h0JyxcbiAgICAgICAgJ21heFdpZHRoJyxcbiAgICAgICAgJ21pbkhlaWdodCcsXG4gICAgICAgICdtaW5XaWR0aCcsXG4gICAgICAgICdyZWFkT25seScsXG4gICAgICAgICdyZWNvcmQnLFxuICAgICAgICAncm93SGVpZ2h0JyxcbiAgICAgICAgJ3Njcm9sbGFibGUnLFxuICAgICAgICAnc2VsZWN0ZWRDZWxsJyxcbiAgICAgICAgJ3NlbGVjdGVkUmVjb3JkJyxcbiAgICAgICAgJ3NlbGVjdGVkUmVjb3JkcycsXG4gICAgICAgICdzdGF0ZScsXG4gICAgICAgICdzdG9yZScsXG4gICAgICAgICd0b29scycsXG4gICAgICAgICd0b29sdGlwJyxcbiAgICAgICAgJ3RyYW5zaXRpb25EdXJhdGlvbicsXG4gICAgICAgICd2YWx1ZXMnLFxuICAgICAgICAnd2lkdGgnLFxuICAgICAgICAneCcsXG4gICAgICAgICd5J1xuICAgIF0pO1xuXG4gICAgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmO1xuICAgIHB1YmxpYyBpbnN0YW5jZTogR3JpZDtcblxuICAgIHByaXZhdGUgYnJ5bnR1bUNvbmZpZyA9IHtcbiAgICAgICAgYW5ndWxhckNvbXBvbmVudCA6IHRoaXMsXG4gICAgICAgIGFkb3B0ICAgICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgIGxpc3RlbmVycyAgICAgICAgOiB7fSxcbiAgICAgICAgZmVhdHVyZXMgICAgICAgICA6IHt9XG4gICAgfTtcblxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQ6IEVsZW1lbnRSZWYpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50UmVmID0gZWxlbWVudDtcbiAgICB9XG5cbiAgICAgLy8gQ29uZmlncyBvbmx5XG4gICAgQElucHV0KCkgYWRvcHQgICAgICAgICAgICAgICAgICAgICAgICAgOiBIVE1MRWxlbWVudHxzdHJpbmc7XG4gICAgQElucHV0KCkgYWxpZ24gICAgICAgICAgICAgICAgICAgICAgICAgOiBvYmplY3R8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGFuY2hvciAgICAgICAgICAgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBhbmltYXRlUmVtb3ZpbmdSb3dzICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgYXBwZW5kVG8gICAgICAgICAgICAgICAgICAgICAgOiBIVE1MRWxlbWVudHxzdHJpbmc7XG4gICAgQElucHV0KCkgYXV0b0hlaWdodCAgICAgICAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGJiYXIgICAgICAgICAgICAgICAgICAgICAgICAgIDogb2JqZWN0W118b2JqZWN0O1xuICAgIEBJbnB1dCgpIGJvZHlDbHMgICAgICAgICAgICAgICAgICAgICAgIDogc3RyaW5nfG9iamVjdDtcbiAgICBASW5wdXQoKSBidWJibGVFdmVudHMgICAgICAgICAgICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBjZW50ZXJlZCAgICAgICAgICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgY2xzICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBzdHJpbmd8b2JqZWN0O1xuICAgIEBJbnB1dCgpIGNvbHVtbnMgICAgICAgICAgICAgICAgICAgICAgIDogb2JqZWN0W118b2JqZWN0O1xuICAgIEBJbnB1dCgpIGNvbmZpZyAgICAgICAgICAgICAgICAgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIGNvbnN0cmFpblRvICAgICAgICAgICAgICAgICAgIDogSFRNTEVsZW1lbnR8V2lkZ2V0fFJlY3RhbmdsZTtcbiAgICBASW5wdXQoKSBjb250ZW50RWxlbWVudENscyAgICAgICAgICAgICA6IHN0cmluZ3xvYmplY3Q7XG4gICAgQElucHV0KCkgY29udGV4dE1lbnVUcmlnZ2VyRXZlbnQgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgZGVmYXVsdEJpbmRQcm9wZXJ0eSAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgZGVmYXVsdFJlZ2lvbiAgICAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgZGVmYXVsdHMgICAgICAgICAgICAgICAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgZGVzdHJveVN0b3JlICAgICAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGRpc2FibGVHcmlkUm93TW9kZWxXYXJuaW5nICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBkb2NrICAgICAgICAgICAgICAgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBkcmFnZ2FibGUgICAgICAgICAgICAgICAgICAgICA6IGJvb2xlYW58b2JqZWN0O1xuICAgIEBJbnB1dCgpIGVtcHR5VGV4dCAgICAgICAgICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGVuYWJsZVN0aWNreSAgICAgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBlbmFibGVUZXh0U2VsZWN0aW9uICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgZW5hYmxlVW5kb1JlZG9LZXlzICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGZlYXR1cmVzICAgICAgICAgICAgICAgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIGZpbGxMYXN0Q29sdW1uICAgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBmaXhlZFJvd0hlaWdodCAgICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgZmxvYXRpbmcgICAgICAgICAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGZvb3RlciAgICAgICAgICAgICAgICAgICAgICAgIDogb2JqZWN0fHN0cmluZztcbiAgICBASW5wdXQoKSBmdWxsUm93UmVmcmVzaCAgICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgZ2V0Um93SGVpZ2h0ICAgICAgICAgICAgICAgICAgOiBGdW5jdGlvbjtcbiAgICBASW5wdXQoKSBoZWFkZXIgICAgICAgICAgICAgICAgICAgICAgICA6IHN0cmluZ3xQYW5lbEhlYWRlcjtcbiAgICBASW5wdXQoKSBoaWRlQW5pbWF0aW9uICAgICAgICAgICAgICAgICA6IGJvb2xlYW58b2JqZWN0O1xuICAgIEBJbnB1dCgpIGhpZGVIZWFkZXJzICAgICAgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBoaWRlV2hlbkVtcHR5ICAgICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgaHRtbENscyAgICAgICAgICAgICAgICAgICAgICAgOiBzdHJpbmd8b2JqZWN0O1xuICAgIEBJbnB1dCgpIGluc2VydEJlZm9yZSAgICAgICAgICAgICAgICAgIDogSFRNTEVsZW1lbnR8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGluc2VydEZpcnN0ICAgICAgICAgICAgICAgICAgIDogSFRNTEVsZW1lbnR8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGl0ZW1DbHMgICAgICAgICAgICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGxhenlJdGVtcyAgICAgICAgICAgICAgICAgICAgIDogb2JqZWN0fG9iamVjdFtdfFdpZGdldFtdfFBhcnRpYWw8V2lkZ2V0Q29uZmlnPnxQYXJ0aWFsPFdpZGdldENvbmZpZz5bXTtcbiAgICBASW5wdXQoKSBsaXN0ZW5lcnMgICAgICAgICAgICAgICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBsb2FkTWFzayAgICAgICAgICAgICAgICAgICAgICA6IHN0cmluZ3xvYmplY3R8bnVsbDtcbiAgICBASW5wdXQoKSBsb2FkTWFza0RlZmF1bHRzICAgICAgICAgICAgICA6IG9iamVjdHxNYXNrfFBhcnRpYWw8TWFza0NvbmZpZz47XG4gICAgQElucHV0KCkgbG9hZE1hc2tFcnJvciAgICAgICAgICAgICAgICAgOiBvYmplY3R8TWFza3xQYXJ0aWFsPE1hc2tDb25maWc+O1xuICAgIEBJbnB1dCgpIGxvY2FsZUNsYXNzICAgICAgICAgICAgICAgICAgIDogQmFzZTtcbiAgICBASW5wdXQoKSBsb2NhbGl6YWJsZVByb3BlcnRpZXMgICAgICAgICA6IHN0cmluZ1tdO1xuICAgIEBJbnB1dCgpIGxvbmdQcmVzc1RpbWUgICAgICAgICAgICAgICAgIDogbnVtYmVyO1xuICAgIEBJbnB1dCgpIG1hc2tEZWZhdWx0cyAgICAgICAgICAgICAgICAgIDogb2JqZWN0fE1hc2t8UGFydGlhbDxNYXNrQ29uZmlnPjtcbiAgICBASW5wdXQoKSBtYXNrZWQgICAgICAgICAgICAgICAgICAgICAgICA6IGJvb2xlYW58c3RyaW5nfG9iamVjdHxNYXNrfFBhcnRpYWw8TWFza0NvbmZpZz47XG4gICAgQElucHV0KCkgbW9uaXRvclJlc2l6ZSAgICAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIG5hbWVkSXRlbXMgICAgICAgICAgICAgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIG93bmVyICAgICAgICAgICAgICAgICAgICAgICAgIDogV2lkZ2V0O1xuICAgIEBJbnB1dCgpIHBsdWdpbnMgICAgICAgICAgICAgICAgICAgICAgIDogRnVuY3Rpb25bXTtcbiAgICBASW5wdXQoKSBwb3NpdGlvbmVkICAgICAgICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgcHJlc2VydmVGb2N1c09uRGF0YXNldENoYW5nZSAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHByZXNlcnZlU2Nyb2xsT25EYXRhc2V0Q2hhbmdlIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBwcmV2ZW50VG9vbHRpcE9uVG91Y2ggICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgcmVzaXplVG9GaXRJbmNsdWRlc0hlYWRlciAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHJlc3BvbnNpdmVMZXZlbHMgICAgICAgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIHJpcHBsZSAgICAgICAgICAgICAgICAgICAgICAgIDogYm9vbGVhbnxvYmplY3Q7XG4gICAgQElucHV0KCkgcm9vdEVsZW1lbnQgICAgICAgICAgICAgICAgICAgOiBTaGFkb3dSb290O1xuICAgIEBJbnB1dCgpIHNjcm9sbEFjdGlvbiAgICAgICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIHNjcm9sbGVyQ2xhc3MgICAgICAgICAgICAgICAgIDogU2Nyb2xsZXI7XG4gICAgQElucHV0KCkgc2Nyb2xsTWFuYWdlciAgICAgICAgICAgICAgICAgOiBvYmplY3R8U2Nyb2xsTWFuYWdlcnxQYXJ0aWFsPFNjcm9sbE1hbmFnZXJDb25maWc+O1xuICAgIEBJbnB1dCgpIHNlbGVjdGlvbk1vZGUgICAgICAgICAgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIHNob3dBbmltYXRpb24gICAgICAgICAgICAgICAgIDogYm9vbGVhbnxvYmplY3Q7XG4gICAgQElucHV0KCkgc2hvd0RpcnR5ICAgICAgICAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHNob3dSZW1vdmVSb3dJbkNvbnRleHRNZW51ICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBzdHJpcHMgICAgICAgICAgICAgICAgICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBzdWJHcmlkQ29uZmlncyAgICAgICAgICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBzeW5jTWFzayAgICAgICAgICAgICAgICAgICAgICA6IHN0cmluZ3xvYmplY3R8bnVsbDtcbiAgICBASW5wdXQoKSB0YWIgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGJvb2xlYW58b2JqZWN0O1xuICAgIEBJbnB1dCgpIHRhZyAgICAgICAgICAgICAgICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIHRiYXIgICAgICAgICAgICAgICAgICAgICAgICAgIDogb2JqZWN0W118b2JqZWN0O1xuICAgIEBJbnB1dCgpIHRleHRBbGlnbiAgICAgICAgICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIHRleHRDb250ZW50ICAgICAgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSB0aXRsZSAgICAgICAgICAgICAgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSB0cmFwRm9jdXMgICAgICAgICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgd2VpZ2h0ICAgICAgICAgICAgICAgICAgICAgICAgOiBudW1iZXI7XG5cbiAgICAgLy8gQ29uZmlncyBhbmQgcHJvcGVydGllc1xuICAgIEBJbnB1dCgpIGFsaWduU2VsZiAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBjb2x1bW5MaW5lcyAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGNvbnRlbnQgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBkYXRhICAgICAgICAgICAgICAgOiBvYmplY3RbXTtcbiAgICBASW5wdXQoKSBkYXRhc2V0ICAgICAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgZGlzYWJsZWQgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBleHRyYURhdGEgICAgICAgICAgOiBib29sZWFufG51bWJlcnxvYmplY3R8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGZsZXggICAgICAgICAgICAgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgaGVpZ2h0ICAgICAgICAgICAgIDogbnVtYmVyfHN0cmluZztcbiAgICBASW5wdXQoKSBoaWRkZW4gICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGh0bWwgICAgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBpZCAgICAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgaXRlbXMgICAgICAgICAgICAgIDogV2lkZ2V0W118b2JqZWN0fG9iamVjdFtdfFBhcnRpYWw8V2lkZ2V0Q29uZmlnPnxQYXJ0aWFsPFdpZGdldENvbmZpZz5bXTtcbiAgICBASW5wdXQoKSBsYXlvdXQgICAgICAgICAgICAgOiBMYXlvdXR8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGxheW91dFN0eWxlICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBtYXJnaW4gICAgICAgICAgICAgOiBudW1iZXJ8c3RyaW5nO1xuICAgIEBJbnB1dCgpIG1heEhlaWdodCAgICAgICAgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgbWF4V2lkdGggICAgICAgICAgIDogbnVtYmVyfHN0cmluZztcbiAgICBASW5wdXQoKSBtaW5IZWlnaHQgICAgICAgICAgOiBudW1iZXJ8c3RyaW5nO1xuICAgIEBJbnB1dCgpIG1pbldpZHRoICAgICAgICAgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgcmVhZE9ubHkgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSByb3dIZWlnaHQgICAgICAgICAgOiBudW1iZXI7XG4gICAgQElucHV0KCkgc2Nyb2xsYWJsZSAgICAgICAgIDogYm9vbGVhbnxTY3JvbGxlcnxvYmplY3R8UGFydGlhbDxTY3JvbGxlckNvbmZpZz47XG4gICAgQElucHV0KCkgc3RvcmUgICAgICAgICAgICAgIDogU3RvcmV8b2JqZWN0fFBhcnRpYWw8U3RvcmVDb25maWc+O1xuICAgIEBJbnB1dCgpIHRvb2xzICAgICAgICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSB0b29sdGlwICAgICAgICAgICAgOiBvYmplY3R8c3RyaW5nO1xuICAgIEBJbnB1dCgpIHRyYW5zaXRpb25EdXJhdGlvbiA6IG51bWJlcjtcbiAgICBASW5wdXQoKSB3aWR0aCAgICAgICAgICAgICAgOiBudW1iZXJ8c3RyaW5nO1xuICAgIEBJbnB1dCgpIHggICAgICAgICAgICAgICAgICA6IG51bWJlcjtcbiAgICBASW5wdXQoKSB5ICAgICAgICAgICAgICAgICAgOiBudW1iZXI7XG5cbiAgICAgLy8gUHJvcGVydGllcyBvbmx5XG4gICAgQElucHV0KCkgYW5jaG9yU2l6ZSAgICAgIDogbnVtYmVyW107XG4gICAgQElucHV0KCkgaXNTZXR0aW5nVmFsdWVzIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBpc1ZhbGlkICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHJlY29yZCAgICAgICAgICA6IE1vZGVsO1xuICAgIEBJbnB1dCgpIHNlbGVjdGVkQ2VsbCAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBzZWxlY3RlZFJlY29yZCAgOiBNb2RlbDtcbiAgICBASW5wdXQoKSBzZWxlY3RlZFJlY29yZHMgOiBNb2RlbFtdfG51bWJlcltdO1xuICAgIEBJbnB1dCgpIHN0YXRlICAgICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSB2YWx1ZXMgICAgICAgICAgOiBvYmplY3Q7XG5cbiAgICAgLy8gRXZlbnRzXG4gICAgQE91dHB1dCgpIG9uQmVmb3JlQ2VsbEVkaXRTdGFydCAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25CZWZvcmVEZXN0cm95ICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkJlZm9yZUV4cG9ydCAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uQmVmb3JlRmluaXNoQ2VsbEVkaXQgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25CZWZvcmVIaWRlICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkJlZm9yZVJlbmRlclJvd3MgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uQmVmb3JlU2V0UmVjb3JkICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25CZWZvcmVTaG93ICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkJlZm9yZVRvZ2dsZU5vZGUgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uQ2FuY2VsQ2VsbEVkaXQgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25DYXRjaEFsbCAgICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkNlbGxDbGljayAgICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uQ2VsbENvbnRleHRNZW51ICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25DZWxsRGJsQ2xpY2sgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkNlbGxNb3VzZU91dCAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uQ2VsbE1vdXNlT3ZlciAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25Db2xsYXBzZU5vZGUgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkRlc3Ryb3kgICAgICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uRXhwYW5kTm9kZSAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25FeHBvcnQgICAgICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkZpbmlzaENlbGxFZGl0ICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uRm9jdXNJbiAgICAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25Gb2N1c091dCAgICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkhpZGUgICAgICAgICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uTW91c2VPdXQgICAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25Nb3VzZU92ZXIgICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvblBhaW50ICAgICAgICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uUmVhZE9ubHkgICAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25SZW5kZXJSb3dzICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvblJlc2l6ZSAgICAgICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uUmVzcG9uc2l2ZSAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25TY3JvbGwgICAgICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvblNlbGVjdGlvbkNoYW5nZSAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uU2hvdyAgICAgICAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25TdGFydENlbGxFZGl0ICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvblRvZ2dsZU5vZGUgICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uVG9vbENsaWNrICAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICAgICAvLyBGZWF0dXJlc1xuICAgIEBJbnB1dCgpIGNlbGxFZGl0RmVhdHVyZSAgIDogb2JqZWN0fGJvb2xlYW58c3RyaW5nfENlbGxFZGl0fFBhcnRpYWw8Q2VsbEVkaXRDb25maWc+O1xuICAgIEBJbnB1dCgpIGNlbGxNZW51RmVhdHVyZSAgIDogb2JqZWN0fGJvb2xlYW58c3RyaW5nfENlbGxNZW51fFBhcnRpYWw8Q2VsbE1lbnVDb25maWc+O1xuICAgIEBJbnB1dCgpIGNlbGxUb29sdGlwRmVhdHVyZSA6IG9iamVjdHxib29sZWFufHN0cmluZ3xDZWxsVG9vbHRpcHxQYXJ0aWFsPENlbGxUb29sdGlwQ29uZmlnPjtcbiAgICBASW5wdXQoKSBjb2x1bW5BdXRvV2lkdGhGZWF0dXJlIDogb2JqZWN0fGJvb2xlYW58c3RyaW5nfENvbHVtbkF1dG9XaWR0aHxQYXJ0aWFsPENvbHVtbkF1dG9XaWR0aENvbmZpZz47XG4gICAgQElucHV0KCkgY29sdW1uRHJhZ1Rvb2xiYXJGZWF0dXJlIDogb2JqZWN0fGJvb2xlYW58c3RyaW5nfENvbHVtbkRyYWdUb29sYmFyfFBhcnRpYWw8Q29sdW1uRHJhZ1Rvb2xiYXJDb25maWc+O1xuICAgIEBJbnB1dCgpIGNvbHVtblBpY2tlckZlYXR1cmUgOiBvYmplY3R8Ym9vbGVhbnxzdHJpbmd8Q29sdW1uUGlja2VyfFBhcnRpYWw8Q29sdW1uUGlja2VyQ29uZmlnPjtcbiAgICBASW5wdXQoKSBjb2x1bW5SZW9yZGVyRmVhdHVyZSA6IG9iamVjdHxib29sZWFufHN0cmluZ3xDb2x1bW5SZW9yZGVyfFBhcnRpYWw8Q29sdW1uUmVvcmRlckNvbmZpZz47XG4gICAgQElucHV0KCkgY29sdW1uUmVzaXplRmVhdHVyZSA6IG9iamVjdHxib29sZWFufHN0cmluZ3xDb2x1bW5SZXNpemV8UGFydGlhbDxDb2x1bW5SZXNpemVDb25maWc+O1xuICAgIEBJbnB1dCgpIGNvbnRleHRNZW51RmVhdHVyZSA6IG9iamVjdHxib29sZWFufHN0cmluZ3xDb250ZXh0TWVudXxQYXJ0aWFsPENvbnRleHRNZW51Q29uZmlnPjtcbiAgICBASW5wdXQoKSBleGNlbEV4cG9ydGVyRmVhdHVyZSA6IG9iamVjdHxib29sZWFufHN0cmluZ3xHcmlkRXhjZWxFeHBvcnRlcnxQYXJ0aWFsPEdyaWRFeGNlbEV4cG9ydGVyQ29uZmlnPjtcbiAgICBASW5wdXQoKSBmaWx0ZXJGZWF0dXJlICAgICA6IG9iamVjdHxib29sZWFufHN0cmluZ3xGaWx0ZXJ8UGFydGlhbDxGaWx0ZXJDb25maWc+O1xuICAgIEBJbnB1dCgpIGZpbHRlckJhckZlYXR1cmUgIDogb2JqZWN0fGJvb2xlYW58c3RyaW5nfEZpbHRlckJhcnxQYXJ0aWFsPEZpbHRlckJhckNvbmZpZz47XG4gICAgQElucHV0KCkgZ3JvdXBGZWF0dXJlICAgICAgOiBvYmplY3R8Ym9vbGVhbnxzdHJpbmd8R3JvdXB8UGFydGlhbDxHcm91cENvbmZpZz47XG4gICAgQElucHV0KCkgZ3JvdXBTdW1tYXJ5RmVhdHVyZSA6IG9iamVjdHxib29sZWFufHN0cmluZ3xHcmlkR3JvdXBTdW1tYXJ5fFBhcnRpYWw8R3JpZEdyb3VwU3VtbWFyeUNvbmZpZz47XG4gICAgQElucHV0KCkgaGVhZGVyTWVudUZlYXR1cmUgOiBvYmplY3R8Ym9vbGVhbnxzdHJpbmd8SGVhZGVyTWVudXxQYXJ0aWFsPEhlYWRlck1lbnVDb25maWc+O1xuICAgIEBJbnB1dCgpIHBkZkV4cG9ydEZlYXR1cmUgIDogb2JqZWN0fGJvb2xlYW58c3RyaW5nfEdyaWRQZGZFeHBvcnR8UGFydGlhbDxHcmlkUGRmRXhwb3J0Q29uZmlnPjtcbiAgICBASW5wdXQoKSBxdWlja0ZpbmRGZWF0dXJlICA6IG9iamVjdHxib29sZWFufHN0cmluZ3xRdWlja0ZpbmR8UGFydGlhbDxRdWlja0ZpbmRDb25maWc+O1xuICAgIEBJbnB1dCgpIHJlZ2lvblJlc2l6ZUZlYXR1cmUgOiBvYmplY3R8Ym9vbGVhbnxzdHJpbmd8UmVnaW9uUmVzaXplfFBhcnRpYWw8UmVnaW9uUmVzaXplQ29uZmlnPjtcbiAgICBASW5wdXQoKSByb3dDb3B5UGFzdGVGZWF0dXJlIDogb2JqZWN0fGJvb2xlYW58c3RyaW5nfFJvd0NvcHlQYXN0ZXxQYXJ0aWFsPFJvd0NvcHlQYXN0ZUNvbmZpZz47XG4gICAgQElucHV0KCkgcm93UmVvcmRlckZlYXR1cmUgOiBvYmplY3R8Ym9vbGVhbnxzdHJpbmd8Um93UmVvcmRlcnxQYXJ0aWFsPFJvd1Jlb3JkZXJDb25maWc+O1xuICAgIEBJbnB1dCgpIHNlYXJjaEZlYXR1cmUgICAgIDogb2JqZWN0fGJvb2xlYW58c3RyaW5nfFNlYXJjaHxQYXJ0aWFsPFNlYXJjaENvbmZpZz47XG4gICAgQElucHV0KCkgc29ydEZlYXR1cmUgICAgICAgOiBvYmplY3R8Ym9vbGVhbnxzdHJpbmd8U29ydHxQYXJ0aWFsPFNvcnRDb25maWc+O1xuICAgIEBJbnB1dCgpIHN0aWNreUNlbGxzRmVhdHVyZSA6IG9iamVjdHxib29sZWFufHN0cmluZ3xTdGlja3lDZWxsc3xQYXJ0aWFsPFN0aWNreUNlbGxzQ29uZmlnPjtcbiAgICBASW5wdXQoKSBzdHJpcGVGZWF0dXJlICAgICA6IG9iamVjdHxib29sZWFufHN0cmluZ3xTdHJpcGV8UGFydGlhbDxTdHJpcGVDb25maWc+O1xuICAgIEBJbnB1dCgpIHN1bW1hcnlGZWF0dXJlICAgIDogb2JqZWN0fGJvb2xlYW58c3RyaW5nfEdyaWRTdW1tYXJ5fFBhcnRpYWw8R3JpZFN1bW1hcnlDb25maWc+O1xuICAgIEBJbnB1dCgpIHRyZWVGZWF0dXJlICAgICAgIDogb2JqZWN0fGJvb2xlYW58c3RyaW5nfFRyZWV8UGFydGlhbDxUcmVlQ29uZmlnPjtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhbmQgYXBwZW5kIHRoZSB1bmRlcmx5aW5nIHdpZGdldFxuICAgICAqL1xuICAgIG5nT25Jbml0KCk6IHZvaWQge1xuICAgICAgICBjb25zdFxuICAgICAgICAgICAgbWUgPSB0aGlzLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGVsZW1lbnRSZWYsXG4gICAgICAgICAgICAgICAgYnJ5bnR1bUNvbmZpZ1xuICAgICAgICAgICAgfSA9IG1lLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGluc3RhbmNlQ2xhc3MsXG4gICAgICAgICAgICAgICAgYnJ5bnR1bUNvbmZpZ3NcbiAgICAgICAgICAgIH0gPSBCcnludHVtR3JpZENvbXBvbmVudDtcblxuICAgICAgICBPYmplY3QuYXNzaWduKGJyeW50dW1Db25maWcsIHtcbiAgICAgICAgICAgIGxpc3RlbmVycyA6IHtcbiAgICAgICAgICAgICAgICBiZWZvcmVDZWxsRWRpdFN0YXJ0KGV2ZW50IDogYW55KSB7IG1lLm9uQmVmb3JlQ2VsbEVkaXRTdGFydC5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBiZWZvcmVEZXN0cm95KGV2ZW50IDogYW55KSB7IG1lLm9uQmVmb3JlRGVzdHJveS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBiZWZvcmVFeHBvcnQoZXZlbnQgOiBhbnkpIHsgbWUub25CZWZvcmVFeHBvcnQuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgYmVmb3JlRmluaXNoQ2VsbEVkaXQoZXZlbnQgOiBhbnkpIHsgbWUub25CZWZvcmVGaW5pc2hDZWxsRWRpdC5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBiZWZvcmVIaWRlKGV2ZW50IDogYW55KSB7IG1lLm9uQmVmb3JlSGlkZS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBiZWZvcmVSZW5kZXJSb3dzKGV2ZW50IDogYW55KSB7IG1lLm9uQmVmb3JlUmVuZGVyUm93cy5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBiZWZvcmVTZXRSZWNvcmQoZXZlbnQgOiBhbnkpIHsgbWUub25CZWZvcmVTZXRSZWNvcmQuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgYmVmb3JlU2hvdyhldmVudCA6IGFueSkgeyBtZS5vbkJlZm9yZVNob3cuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgYmVmb3JlVG9nZ2xlTm9kZShldmVudCA6IGFueSkgeyBtZS5vbkJlZm9yZVRvZ2dsZU5vZGUuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgY2FuY2VsQ2VsbEVkaXQoZXZlbnQgOiBhbnkpIHsgbWUub25DYW5jZWxDZWxsRWRpdC5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBjYXRjaEFsbChldmVudCA6IGFueSkgeyBtZS5vbkNhdGNoQWxsLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGNlbGxDbGljayhldmVudCA6IGFueSkgeyBtZS5vbkNlbGxDbGljay5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBjZWxsQ29udGV4dE1lbnUoZXZlbnQgOiBhbnkpIHsgbWUub25DZWxsQ29udGV4dE1lbnUuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgY2VsbERibENsaWNrKGV2ZW50IDogYW55KSB7IG1lLm9uQ2VsbERibENsaWNrLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGNlbGxNb3VzZU91dChldmVudCA6IGFueSkgeyBtZS5vbkNlbGxNb3VzZU91dC5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBjZWxsTW91c2VPdmVyKGV2ZW50IDogYW55KSB7IG1lLm9uQ2VsbE1vdXNlT3Zlci5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBjb2xsYXBzZU5vZGUoZXZlbnQgOiBhbnkpIHsgbWUub25Db2xsYXBzZU5vZGUuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgZGVzdHJveShldmVudCA6IGFueSkgeyBtZS5vbkRlc3Ryb3kuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgZXhwYW5kTm9kZShldmVudCA6IGFueSkgeyBtZS5vbkV4cGFuZE5vZGUuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgZXhwb3J0KGV2ZW50IDogYW55KSB7IG1lLm9uRXhwb3J0LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGZpbmlzaENlbGxFZGl0KGV2ZW50IDogYW55KSB7IG1lLm9uRmluaXNoQ2VsbEVkaXQuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgZm9jdXNJbihldmVudCA6IGFueSkgeyBtZS5vbkZvY3VzSW4uZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgZm9jdXNPdXQoZXZlbnQgOiBhbnkpIHsgbWUub25Gb2N1c091dC5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBoaWRlKGV2ZW50IDogYW55KSB7IG1lLm9uSGlkZS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBtb3VzZU91dChldmVudCA6IGFueSkgeyBtZS5vbk1vdXNlT3V0LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIG1vdXNlT3ZlcihldmVudCA6IGFueSkgeyBtZS5vbk1vdXNlT3Zlci5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBwYWludChldmVudCA6IGFueSkgeyBtZS5vblBhaW50LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIHJlYWRPbmx5KGV2ZW50IDogYW55KSB7IG1lLm9uUmVhZE9ubHkuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgcmVuZGVyUm93cyhldmVudCA6IGFueSkgeyBtZS5vblJlbmRlclJvd3MuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgcmVzaXplKGV2ZW50IDogYW55KSB7IG1lLm9uUmVzaXplLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIHJlc3BvbnNpdmUoZXZlbnQgOiBhbnkpIHsgbWUub25SZXNwb25zaXZlLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIHNjcm9sbChldmVudCA6IGFueSkgeyBtZS5vblNjcm9sbC5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBzZWxlY3Rpb25DaGFuZ2UoZXZlbnQgOiBhbnkpIHsgbWUub25TZWxlY3Rpb25DaGFuZ2UuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgc2hvdyhldmVudCA6IGFueSkgeyBtZS5vblNob3cuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgc3RhcnRDZWxsRWRpdChldmVudCA6IGFueSkgeyBtZS5vblN0YXJ0Q2VsbEVkaXQuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgdG9nZ2xlTm9kZShldmVudCA6IGFueSkgeyBtZS5vblRvZ2dsZU5vZGUuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgdG9vbENsaWNrKGV2ZW50IDogYW55KSB7IG1lLm9uVG9vbENsaWNrLmVtaXQoZXZlbnQpOyB9LFxuXG4gICAgICAgICAgICAgICAgdGhpc09iaiA6IG1lXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIElmIGNvbXBvbmVudCBoYXMgbm8gY29udGFpbmVyIHNwZWNpZmllZCBpbiBjb25maWcgdGhlbiB1c2UgYWRvcHQgdG8gV3JhcHBlcidzIGVsZW1lbnRcbiAgICAgICAgY29uc3RcbiAgICAgICAgICAgIGNvbnRhaW5lclBhcmFtID0gW1xuICAgICAgICAgICAgICAgICdhZG9wdCcsXG4gICAgICAgICAgICAgICAgJ2FwcGVuZFRvJyxcbiAgICAgICAgICAgICAgICAnaW5zZXJ0QWZ0ZXInLFxuICAgICAgICAgICAgICAgICdpbnNlcnRCZWZvcmUnXG4gICAgICAgICAgICBdLmZpbmQocHJvcCA9PiBicnludHVtQ29uZmlnW3Byb3BdKTtcbiAgICAgICAgaWYgKCFjb250YWluZXJQYXJhbSkge1xuICAgICAgICAgICAgYnJ5bnR1bUNvbmZpZy5hZG9wdCA9IGVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIFdyYXBwZXJIZWxwZXIuZGV2V2FybmluZ0NvbnRhaW5lcihpbnN0YW5jZUNsYXNzLiRuYW1lLCBjb250YWluZXJQYXJhbSk7XG4gICAgICAgIH1cblxuICAgICAgICBicnludHVtQ29uZmlncy5maWx0ZXIocHJvcCA9PiBwcm9wIGluIHRoaXMpLmZvckVhY2gocHJvcCA9PiB7XG4gICAgICAgICAgICBXcmFwcGVySGVscGVyLmFwcGx5UHJvcFZhbHVlKGJyeW50dW1Db25maWcsIHByb3AsIHRoaXNbcHJvcF0pO1xuICAgICAgICAgICAgaWYgKFsnZmVhdHVyZXMnLCAnY29uZmlnJ10uaW5jbHVkZXMocHJvcCkpIHtcbiAgICAgICAgICAgICAgICBXcmFwcGVySGVscGVyLmRldldhcm5pbmdDb25maWdQcm9wKGluc3RhbmNlQ2xhc3MuJG5hbWUsIHByb3ApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIG1lLmluc3RhbmNlID0gaW5zdGFuY2VDbGFzcy4kbmFtZSA9PT0gJ1dpZGdldCcgPyBXaWRnZXRIZWxwZXIuY3JlYXRlV2lkZ2V0KGJyeW50dW1Db25maWcpIDogbmV3IGluc3RhbmNlQ2xhc3MoYnJ5bnR1bUNvbmZpZyk7XG5cbiAgICAgICAgLy8gQmFja3dhcmRzIGNvbXBhdGliaWxpdHkgZm9yIGdyaWRJbnN0YW5jZSwgc2NoZWR1bGVySW5zdGFuY2UgZXRjLlxuICAgICAgICBtZVtTdHJpbmdIZWxwZXIudW5jYXBpdGFsaXplKGluc3RhbmNlQ2xhc3MuJG5hbWUpICsgJ0luc3RhbmNlJ10gPSBtZS5pbnN0YW5jZTtcbiAgICAgICAgLy8gXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogV2F0Y2ggZm9yIGNoYW5nZXNcbiAgICAgKiBAcGFyYW0gY2hhbmdlc1xuICAgICAqL1xuICAgIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICAgICAgY29uc3RcbiAgICAgICAgICAgIHsgaW5zdGFuY2UgfSA9IHRoaXMsXG4gICAgICAgICAgICB7IGluc3RhbmNlQ2xhc3MgfSA9IEJyeW50dW1HcmlkQ29tcG9uZW50O1xuXG4gICAgICAgIGlmICghaW5zdGFuY2UpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEl0ZXJhdGUgb3ZlciBhbGwgY2hhbmdlc1xuICAgICAgICBPYmplY3QuZW50cmllcyhjaGFuZ2VzKS5mb3JFYWNoKChbcHJvcCwgY2hhbmdlXSkgPT4ge1xuICAgICAgICAgICAgY29uc3RcbiAgICAgICAgICAgICAgICBuZXdWYWx1ZSA9IChjaGFuZ2UgYXMgU2ltcGxlQ2hhbmdlKS5jdXJyZW50VmFsdWUsXG4gICAgICAgICAgICAgICAgeyBpbnN0YW5jZSB9ID0gdGhpcyxcbiAgICAgICAgICAgICAgICB7IGJyeW50dW1Db25maWdzT25seSwgYnJ5bnR1bVByb3BzIH0gPSBCcnludHVtR3JpZENvbXBvbmVudDtcbiAgICAgICAgICAgIGlmIChicnludHVtUHJvcHMuaW5jbHVkZXMocHJvcCkpIHtcbiAgICAgICAgICAgICAgICBXcmFwcGVySGVscGVyLmFwcGx5UHJvcFZhbHVlKGluc3RhbmNlLCBwcm9wLCBuZXdWYWx1ZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIGlmIChicnludHVtQ29uZmlnc09ubHkuaW5jbHVkZXMocHJvcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgV3JhcHBlckhlbHBlci5kZXZXYXJuaW5nVXBkYXRlUHJvcChpbnN0YW5jZUNsYXNzLiRuYW1lLCBwcm9wKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERlc3Ryb3kgdGhlIGNvbXBvbmVudFxuICAgICAqL1xuICAgIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5pbnN0YW5jZSkge1xuICAgICAgICAgICAgdGhpcy5pbnN0YW5jZS5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=