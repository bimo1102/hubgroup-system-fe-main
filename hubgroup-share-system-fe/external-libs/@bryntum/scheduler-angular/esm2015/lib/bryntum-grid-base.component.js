/**
 * Angular wrapper for Bryntum GridBase
 */
import { Component, ElementRef, EventEmitter, Output, Input } from '@angular/core';
import WrapperHelper from './wrapper.helper';
// Bryntum 'scheduler.lite.umd' bundle comes without polyfills to support Angular's zone.js
import { Base, Model, Scroller, Widget } from '@bryntum/scheduler/scheduler.lite.umd.js';
import { GridBase, StringHelper, WidgetHelper } from '@bryntum/scheduler/scheduler.lite.umd.js';
export class BryntumGridBaseComponent {
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
        const me = this, { elementRef, bryntumConfig } = me, { instanceClass, bryntumConfigs } = BryntumGridBaseComponent;
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
        const { instance } = this, { instanceClass } = BryntumGridBaseComponent;
        if (!instance) {
            return;
        }
        // Iterate over all changes
        Object.entries(changes).forEach(([prop, change]) => {
            const newValue = change.currentValue, { instance } = this, { bryntumConfigsOnly, bryntumProps } = BryntumGridBaseComponent;
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
BryntumGridBaseComponent.instanceClass = GridBase;
BryntumGridBaseComponent.bryntumFeatureNames = [
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
BryntumGridBaseComponent.bryntumConfigs = BryntumGridBaseComponent.bryntumFeatureNames.concat([
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
BryntumGridBaseComponent.bryntumConfigsOnly = [
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
BryntumGridBaseComponent.bryntumProps = BryntumGridBaseComponent.bryntumFeatureNames.concat([
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
BryntumGridBaseComponent.decorators = [
    { type: Component, args: [{
                selector: 'bryntum-grid-base',
                template: ''
            }] }
];
/** @nocollapse */
BryntumGridBaseComponent.ctorParameters = () => [
    { type: ElementRef }
];
BryntumGridBaseComponent.propDecorators = {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJ5bnR1bS1ncmlkLWJhc2UuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGJyeW50dW0vc2NoZWR1bGVyLWFuZ3VsYXIvIiwic291cmNlcyI6WyJsaWIvYnJ5bnR1bS1ncmlkLWJhc2UuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztHQUVHO0FBRUgsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFxQixNQUFNLEVBQUUsS0FBSyxFQUErQixNQUFNLGVBQWUsQ0FBQztBQUNuSSxPQUFPLGFBQWEsTUFBTSxrQkFBa0IsQ0FBQztBQUU3QywyRkFBMkY7QUFDM0YsT0FBTyxFQUFFLElBQUksRUFBc21CLEtBQUssRUFBNEwsUUFBUSxFQUFzSixNQUFNLEVBQWdCLE1BQU0sMENBQTBDLENBQUM7QUFDemhDLE9BQU8sRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBTWhHLE1BQU0sT0FBTyx3QkFBd0I7SUE2UmpDLFlBQVksT0FBbUI7UUFQdkIsa0JBQWEsR0FBRztZQUNwQixnQkFBZ0IsRUFBRyxJQUFJO1lBQ3ZCLEtBQUssRUFBYyxTQUFTO1lBQzVCLFNBQVMsRUFBVSxFQUFFO1lBQ3JCLFFBQVEsRUFBVyxFQUFFO1NBQ3hCLENBQUM7UUFxSUQsU0FBUztRQUNBLDBCQUFxQixHQUFJLElBQUksWUFBWSxFQUFVLENBQUM7UUFDcEQsb0JBQWUsR0FBVSxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQ3BELG1CQUFjLEdBQVcsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUNwRCwyQkFBc0IsR0FBRyxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQ3BELGlCQUFZLEdBQWEsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUNwRCx1QkFBa0IsR0FBTyxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQ3BELHNCQUFpQixHQUFRLElBQUksWUFBWSxFQUFVLENBQUM7UUFDcEQsaUJBQVksR0FBYSxJ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QUFjLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDNUQsT0FBTyxDQUFDLEtBQVcsSUFBSSxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xELFVBQVUsQ0FBQyxLQUFXLElBQUksRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN4RCxNQUFNLENBQUMsS0FBVyxJQUFJLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEQsY0FBYyxDQUFDLEtBQVcsSUFBSSxFQUFFLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEUsT0FBTyxDQUFDLEtBQVcsSUFBSSxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xELFFBQVEsQ0FBQyxLQUFXLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNwRCxJQUFJLENBQUMsS0FBVyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDNUMsUUFBUSxDQUFDLEtBQVcsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BELFNBQVMsQ0FBQyxLQUFXLElBQUksRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0RCxLQUFLLENBQUMsS0FBVyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDOUMsUUFBUSxDQUFDLEtBQVcsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BELFVBQVUsQ0FBQyxLQUFXLElBQUksRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN4RCxNQUFNLENBQUMsS0FBVyxJQUFJLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEQsVUFBVSxDQUFDLEtBQVcsSUFBSSxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hELE1BQU0sQ0FBQyxLQUFXLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoRCxlQUFlLENBQUMsS0FBVyxJQUFJLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsRSxJQUFJLENBQUMsS0FBVyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDNUMsYUFBYSxDQUFDLEtBQVcsSUFBSSxFQUFFLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlELFVBQVUsQ0FBQyxLQUFXLElBQUksRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN4RCxTQUFTLENBQUMsS0FBVyxJQUFJLEVBQUUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFdEQsT0FBTyxFQUFHLEVBQUU7YUFDZjtTQUNKLENBQUMsQ0FBQztRQUVILHdGQUF3RjtRQUN4RixNQUNJLGNBQWMsR0FBRztZQUNiLE9BQU87WUFDUCxVQUFVO1lBQ1YsYUFBYTtZQUNiLGNBQWM7U0FDakIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUN4QyxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ2pCLGFBQWEsQ0FBQyxLQUFLLEdBQUcsVUFBVSxDQUFDLGFBQWEsQ0FBQztTQUNsRDthQUNJO1lBQ0QsYUFBYSxDQUFDLG1CQUFtQixDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsY0FBYyxDQUFDLENBQUM7U0FDMUU7UUFFRCxjQUFjLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN2RCxhQUFhLENBQUMsY0FBYyxDQUFDLGFBQWEsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDOUQsSUFBSSxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3ZDLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO2FBQ2pFO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxhQUFhO1FBQ2IsRUFBRSxDQUFDLFFBQVEsR0FBRyxhQUFhLENBQUMsS0FBSyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFN0gsbUVBQW1FO1FBQ25FLEVBQUUsQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsR0FBRyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDO1FBQzlFLEdBQUc7SUFDUCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsV0FBVyxDQUFDLE9BQXNCO1FBQzlCLE1BQ0ksRUFBRSxRQUFRLEVBQUUsR0FBRyxJQUFJLEVBQ25CLEVBQUUsYUFBYSxFQUFFLEdBQUcsd0JBQXdCLENBQUM7UUFFakQsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNYLE9BQU87U0FDVjtRQUVELDJCQUEyQjtRQUMzQixNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxFQUFFLEVBQUU7WUFDL0MsTUFDSSxRQUFRLEdBQUksTUFBdUIsQ0FBQyxZQUFZLEVBQ2hELEVBQUUsUUFBUSxFQUFFLEdBQUcsSUFBSSxFQUNuQixFQUFFLGtCQUFrQixFQUFFLFlBQVksRUFBRSxHQUFHLHdCQUF3QixDQUFDO1lBQ3BFLElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDN0IsYUFBYSxDQUFDLGNBQWMsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDOUQsSUFBSSxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQ25DLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO2lCQUNqRTthQUNKO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxXQUFXO1FBQ1AsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUMzQjtJQUNMLENBQUM7O0FBN2xCYSxzQ0FBYSxHQUFHLFFBQVEsQ0FBQztBQUV4Qiw0Q0FBbUIsR0FBYTtJQUMzQyxpQkFBaUI7SUFDakIsaUJBQWlCO0lBQ2pCLG9CQUFvQjtJQUNwQix3QkFBd0I7SUFDeEIsMEJBQTBCO0lBQzFCLHFCQUFxQjtJQUNyQixzQkFBc0I7SUFDdEIscUJBQXFCO0lBQ3JCLG9CQUFvQjtJQUNwQixzQkFBc0I7SUFDdEIsZUFBZTtJQUNmLGtCQUFrQjtJQUNsQixjQUFjO0lBQ2QscUJBQXFCO0lBQ3JCLG1CQUFtQjtJQUNuQixrQkFBa0I7SUFDbEIsa0JBQWtCO0lBQ2xCLHFCQUFxQjtJQUNyQixxQkFBcUI7SUFDckIsbUJBQW1CO0lBQ25CLGVBQWU7SUFDZixhQUFhO0lBQ2Isb0JBQW9CO0lBQ3BCLGVBQWU7SUFDZixnQkFBZ0I7SUFDaEIsYUFBYTtDQUNoQixDQUFDO0FBRWEsdUNBQWMsR0FBYSx3QkFBd0IsQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUM7SUFDMUYsT0FBTztJQUNQLE9BQU87SUFDUCxXQUFXO0lBQ1gsUUFBUTtJQUNSLHFCQUFxQjtJQUNyQixVQUFVO0lBQ1YsWUFBWTtJQUNaLE1BQU07SUFDTixTQUFTO0lBQ1QsY0FBYztJQUNkLFVBQVU7SUFDVixLQUFLO0lBQ0wsYUFBYTtJQUNiLFNBQVM7SUFDVCxRQUFRO0lBQ1IsYUFBYTtJQUNiLFNBQVM7SUFDVCxtQkFBbUI7SUFDbkIseUJBQXlCO0lBQ3pCLE1BQU07SUFDTixTQUFTO0lBQ1QscUJBQXFCO0lBQ3JCLGVBQWU7SUFDZixVQUFVO0lBQ1YsY0FBYztJQUNkLFVBQVU7SUFDViw0QkFBNEI7SUFDNUIsTUFBTTtJQUNOLFdBQVc7SUFDWCxXQUFXO0lBQ1gsY0FBYztJQUNkLHFCQUFxQjtJQUNyQixvQkFBb0I7SUFDcEIsV0FBVztJQUNYLFVBQVU7SUFDVixnQkFBZ0I7SUFDaEIsZ0JBQWdCO0lBQ2hCLE1BQU07SUFDTixVQUFVO0lBQ1YsUUFBUTtJQUNSLGdCQUFnQjtJQUNoQixjQUFjO0lBQ2QsUUFBUTtJQUNSLFFBQVE7SUFDUixRQUFRO0lBQ1IsZUFBZTtJQUNmLGFBQWE7SUFDYixlQUFlO0lBQ2YsTUFBTTtJQUNOLFNBQVM7SUFDVCxJQUFJO0lBQ0osY0FBYztJQUNkLGFBQWE7SUFDYixTQUFTO0lBQ1QsT0FBTztJQUNQLFFBQVE7SUFDUixhQUFhO0lBQ2IsV0FBVztJQUNYLFdBQVc7SUFDWCxVQUFVO0lBQ1Ysa0JBQWtCO0lBQ2xCLGVBQWU7SUFDZixhQUFhO0lBQ2IsdUJBQXVCO0lBQ3ZCLGVBQWU7SUFDZixRQUFRO0lBQ1IsY0FBYztJQUNkLFFBQVE7SUFDUixXQUFXO0lBQ1gsVUFBVTtJQUNWLFdBQVc7SUFDWCxVQUFVO0lBQ1YsZUFBZTtJQUNmLFlBQVk7SUFDWixPQUFPO0lBQ1AsU0FBUztJQUNULFlBQVk7SUFDWiw4QkFBOEI7SUFDOUIsK0JBQStCO0lBQy9CLHVCQUF1QjtJQUN2QixVQUFVO0lBQ1YsMkJBQTJCO0lBQzNCLGtCQUFrQjtJQUNsQixRQUFRO0lBQ1IsYUFBYTtJQUNiLFdBQVc7SUFDWCxZQUFZO0lBQ1osY0FBYztJQUNkLGVBQWU7SUFDZixlQUFlO0lBQ2YsZUFBZTtJQUNmLGVBQWU7SUFDZixXQUFXO0lBQ1gsNEJBQTRCO0lBQzVCLE9BQU87SUFDUCxRQUFRO0lBQ1IsZ0JBQWdCO0lBQ2hCLFVBQVU7SUFDVixLQUFLO0lBQ0wsS0FBSztJQUNMLE1BQU07SUFDTixXQUFXO0lBQ1gsYUFBYTtJQUNiLE9BQU87SUFDUCxPQUFPO0lBQ1AsU0FBUztJQUNULG9CQUFvQjtJQUNwQixXQUFXO0lBQ1gsUUFBUTtJQUNSLE9BQU87SUFDUCxHQUFHO0lBQ0gsR0FBRztDQUNOLENBQUMsQ0FBQztBQUVZLDJDQUFrQixHQUFhO0lBQzFDLE9BQU87SUFDUCxPQUFPO0lBQ1AsUUFBUTtJQUNSLHFCQUFxQjtJQUNyQixVQUFVO0lBQ1YsWUFBWTtJQUNaLE1BQU07SUFDTixTQUFTO0lBQ1QsY0FBYztJQUNkLFVBQVU7SUFDVixLQUFLO0lBQ0wsU0FBUztJQUNULFFBQVE7SUFDUixhQUFhO0lBQ2IsbUJBQW1CO0lBQ25CLHlCQUF5QjtJQUN6QixxQkFBcUI7SUFDckIsZUFBZTtJQUNmLFVBQVU7SUFDVixjQUFjO0lBQ2QsNEJBQTRCO0lBQzVCLE1BQU07SUFDTixXQUFXO0lBQ1gsV0FBVztJQUNYLGNBQWM7SUFDZCxxQkFBcUI7SUFDckIsb0JBQW9CO0lBQ3BCLFVBQVU7SUFDVixnQkFBZ0I7SUFDaEIsZ0JBQWdCO0lBQ2hCLFVBQVU7SUFDVixRQUFRO0lBQ1IsZ0JBQWdCO0lBQ2hCLGNBQWM7SUFDZCxRQUFRO0lBQ1IsZUFBZTtJQUNmLGFBQWE7SUFDYixlQUFlO0lBQ2YsU0FBUztJQUNULGNBQWM7SUFDZCxhQUFhO0lBQ2IsU0FBUztJQUNULFdBQVc7SUFDWCxXQUFXO0lBQ1gsVUFBVTtJQUNWLGtCQUFrQjtJQUNsQixlQUFlO0lBQ2YsYUFBYTtJQUNiLHVCQUF1QjtJQUN2QixlQUFlO0lBQ2YsY0FBYztJQUNkLFFBQVE7SUFDUixlQUFlO0lBQ2YsWUFBWTtJQUNaLE9BQU87SUFDUCxTQUFTO0lBQ1QsWUFBWTtJQUNaLDhCQUE4QjtJQUM5QiwrQkFBK0I7SUFDL0IsdUJBQXVCO0lBQ3ZCLDJCQUEyQjtJQUMzQixrQkFBa0I7SUFDbEIsUUFBUTtJQUNSLGFBQWE7SUFDYixjQUFjO0lBQ2QsZUFBZTtJQUNmLGVBQWU7SUFDZixlQUFlO0lBQ2YsZUFBZTtJQUNmLFdBQVc7SUFDWCw0QkFBNEI7SUFDNUIsUUFBUTtJQUNSLGdCQUFnQjtJQUNoQixVQUFVO0lBQ1YsS0FBSztJQUNMLEtBQUs7SUFDTCxNQUFNO0lBQ04sV0FBVztJQUNYLGFBQWE7SUFDYixPQUFPO0lBQ1AsV0FBVztJQUNYLFFBQVE7Q0FDWCxDQUFDO0FBRWEscUNBQVksR0FBYSx3QkFBd0IsQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUM7SUFDeEYsV0FBVztJQUNYLFlBQVk7SUFDWixhQUFhO0lBQ2IsU0FBUztJQUNULE1BQU07SUFDTixTQUFTO0lBQ1QsVUFBVTtJQUNWLFdBQVc7SUFDWCxNQUFNO0lBQ04sUUFBUTtJQUNSLFFBQVE7SUFDUixNQUFNO0lBQ04sSUFBSTtJQUNKLGlCQUFpQjtJQUNqQixTQUFTO0lBQ1QsT0FBTztJQUNQLFFBQVE7SUFDUixhQUFhO0lBQ2IsUUFBUTtJQUNSLFdBQVc7SUFDWCxVQUFVO0lBQ1YsV0FBVztJQUNYLFVBQVU7SUFDVixVQUFVO0lBQ1YsUUFBUTtJQUNSLFdBQVc7SUFDWCxZQUFZO0lBQ1osY0FBYztJQUNkLGdCQUFnQjtJQUNoQixpQkFBaUI7SUFDakIsT0FBTztJQUNQLE9BQU87SUFDUCxPQUFPO0lBQ1AsU0FBUztJQUNULG9CQUFvQjtJQUNwQixRQUFRO0lBQ1IsT0FBTztJQUNQLEdBQUc7SUFDSCxHQUFHO0NBQ04sQ0FBQyxDQUFDOztZQXJSTixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFHLG1CQUFtQjtnQkFDOUIsUUFBUSxFQUFHLEVBQUU7YUFDaEI7Ozs7WUFWbUIsVUFBVTs7O29CQTZTekIsS0FBSztvQkFDTCxLQUFLO3FCQUNMLEtBQUs7a0NBQ0wsS0FBSzt1QkFDTCxLQUFLO3lCQUNMLEtBQUs7bUJBQ0wsS0FBSztzQkFDTCxLQUFLOzJCQUNMLEtBQUs7dUJBQ0wsS0FBSztrQkFDTCxLQUFLO3NCQUNMLEtBQUs7cUJBQ0wsS0FBSzswQkFDTCxLQUFLO2dDQUNMLEtBQUs7c0NBQ0wsS0FBSztrQ0FDTCxLQUFLOzRCQUNMLEtBQUs7dUJBQ0wsS0FBSzsyQkFDTCxLQUFLO3lDQUNMLEtBQUs7bUJBQ0wsS0FBSzt3QkFDTCxLQUFLO3dCQUNMLEtBQUs7MkJBQ0wsS0FBSztrQ0FDTCxLQUFLO2lDQUNMLEtBQUs7dUJBQ0wsS0FBSzs2QkFDTCxLQUFLOzZCQUNMLEtBQUs7dUJBQ0wsS0FBSztxQkFDTCxLQUFLOzZCQUNMLEtBQUs7MkJBQ0wsS0FBSztxQkFDTCxLQUFLOzRCQUNMLEtBQUs7MEJBQ0wsS0FBSzs0QkFDTCxLQUFLO3NCQUNMLEtBQUs7MkJBQ0wsS0FBSzswQkFDTCxLQUFLO3NCQUNMLEtBQUs7d0JBQ0wsS0FBSzt3QkFDTCxLQUFLO3VCQUNMLEtBQUs7K0JBQ0wsS0FBSzs0QkFDTCxLQUFLOzBCQUNMLEtBQUs7b0NBQ0wsS0FBSzs0QkFDTCxLQUFLOzJCQUNMLEtBQUs7cUJBQ0wsS0FBSzs0QkFDTCxLQUFLO3lCQUNMLEtBQUs7b0JBQ0wsS0FBSztzQkFDTCxLQUFLO3lCQUNMLEtBQUs7MkNBQ0wsS0FBSzs0Q0FDTCxLQUFLO29DQUNMLEtBQUs7d0NBQ0wsS0FBSzsrQkFDTCxLQUFLO3FCQUNMLEtBQUs7MEJBQ0wsS0FBSzsyQkFDTCxLQUFLOzRCQUNMLEtBQUs7NEJBQ0wsS0FBSzs0QkFDTCxLQUFLOzRCQUNMLEtBQUs7d0JBQ0wsS0FBSzt5Q0FDTCxLQUFLO3FCQUNMLEtBQUs7NkJBQ0wsS0FBSzt1QkFDTCxLQUFLO2tCQUNMLEtBQUs7a0JBQ0wsS0FBSzttQkFDTCxLQUFLO3dCQUNMLEtBQUs7MEJBQ0wsS0FBSztvQkFDTCxLQUFLO3dCQUNMLEtBQUs7cUJBQ0wsS0FBSzt3QkFHTCxLQUFLOzBCQUNMLEtBQUs7c0JBQ0wsS0FBSzttQkFDTCxLQUFLO3NCQUNMLEtBQUs7dUJBQ0wsS0FBSzt3QkFDTCxLQUFLO21CQUNMLEtBQUs7cUJBQ0wsS0FBSztxQkFDTCxLQUFLO21CQUNMLEtBQUs7aUJBQ0wsS0FBSztvQkFDTCxLQUFLO3FCQUNMLEtBQUs7MEJBQ0wsS0FBSztxQkFDTCxLQUFLO3dCQUNMLEtBQUs7dUJBQ0wsS0FBSzt3QkFDTCxLQUFLO3VCQUNMLEtBQUs7dUJBQ0wsS0FBSzt3QkFDTCxLQUFLO3lCQUNMLEtBQUs7b0JBQ0wsS0FBSztvQkFDTCxLQUFLO3NCQUNMLEtBQUs7aUNBQ0wsS0FBSztvQkFDTCxLQUFLO2dCQUNMLEtBQUs7Z0JBQ0wsS0FBSzt5QkFHTCxLQUFLOzhCQUNMLEtBQUs7c0JBQ0wsS0FBSztxQkFDTCxLQUFLOzJCQUNMLEtBQUs7NkJBQ0wsS0FBSzs4QkFDTCxLQUFLO29CQUNMLEtBQUs7cUJBQ0wsS0FBSztvQ0FHTCxNQUFNOzhCQUNOLE1BQU07NkJBQ04sTUFBTTtxQ0FDTixNQUFNOzJCQUNOLE1BQU07aUNBQ04sTUFBTTtnQ0FDTixNQUFNOzJCQUNOLE1BQU07aUNBQ04sTUFBTTsrQkFDTixNQUFNO3lCQUNOLE1BQU07MEJBQ04sTUFBTTtnQ0FDTixNQUFNOzZCQUNOLE1BQU07NkJBQ04sTUFBTTs4QkFDTixNQUFNOzZCQUNOLE1BQU07d0JBQ04sTUFBTTsyQkFDTixNQUFNO3VCQUNOLE1BQU07K0JBQ04sTUFBTTt3QkFDTixNQUFNO3lCQUNOLE1BQU07cUJBQ04sTUFBTTt5QkFDTixNQUFNOzBCQUNOLE1BQU07c0JBQ04sTUFBTTt5QkFDTixNQUFNOzJCQUNOLE1BQU07dUJBQ04sTUFBTTsyQkFDTixNQUFNO3VCQUNOLE1BQU07Z0NBQ04sTUFBTTtxQkFDTixNQUFNOzhCQUNOLE1BQU07MkJBQ04sTUFBTTswQkFDTixNQUFNOzhCQUdOLEtBQUs7OEJBQ0wsS0FBSztpQ0FDTCxLQUFLO3FDQUNMLEtBQUs7dUNBQ0wsS0FBSztrQ0FDTCxLQUFLO21DQUNMLEtBQUs7a0NBQ0wsS0FBSztpQ0FDTCxLQUFLO21DQUNMLEtBQUs7NEJBQ0wsS0FBSzsrQkFDTCxLQUFLOzJCQUNMLEtBQUs7a0NBQ0wsS0FBSztnQ0FDTCxLQUFLOytCQUNMLEtBQUs7K0JBQ0wsS0FBSztrQ0FDTCxLQUFLO2tDQUNMLEtBQUs7Z0NBQ0wsS0FBSzs0QkFDTCxLQUFLOzBCQUNMLEtBQUs7aUNBQ0wsS0FBSzs0QkFDTCxLQUFLOzZCQUNMLEtBQUs7MEJBQ0wsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQW5ndWxhciB3cmFwcGVyIGZvciBCcnludHVtIEdyaWRCYXNlXG4gKi9cblxuaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIE9uRGVzdHJveSwgT25Jbml0LCBPdXRwdXQsIElucHV0LCBTaW1wbGVDaGFuZ2UsIFNpbXBsZUNoYW5nZXMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCBXcmFwcGVySGVscGVyIGZyb20gJy4vd3JhcHBlci5oZWxwZXInO1xuXG4vLyBCcnludHVtICdzY2hlZHVsZXIubGl0ZS51bWQnIGJ1bmRsZSBjb21lcyB3aXRob3V0IHBvbHlmaWxscyB0byBzdXBwb3J0IEFuZ3VsYXIncyB6b25lLmpzXG5pbXBvcnQgeyBCYXNlLCBDZWxsRWRpdCwgQ2VsbEVkaXRDb25maWcsIENlbGxNZW51LCBDZWxsTWVudUNvbmZpZywgQ2VsbFRvb2x0aXAsIENlbGxUb29sdGlwQ29uZmlnLCBDb2x1bW5BdXRvV2lkdGgsIENvbHVtbkF1dG9XaWR0aENvbmZpZywgQ29sdW1uRHJhZ1Rvb2xiYXIsIENvbHVtbkRyYWdUb29sYmFyQ29uZmlnLCBDb2x1bW5QaWNrZXIsIENvbHVtblBpY2tlckNvbmZpZywgQ29sdW1uUmVvcmRlciwgQ29sdW1uUmVvcmRlckNvbmZpZywgQ29sdW1uUmVzaXplLCBDb2x1bW5SZXNpemVDb25maWcsIENvbnRleHRNZW51LCBDb250ZXh0TWVudUNvbmZpZywgRmlsdGVyLCBGaWx0ZXJCYXIsIEZpbHRlckJhckNvbmZpZywgRmlsdGVyQ29uZmlnLCBHcmlkQmFzZUZlYXR1cmVzQ29uZmlnVHlwZSwgR3JpZEV4Y2VsRXhwb3J0ZXIsIEdyaWRFeGNlbEV4cG9ydGVyQ29uZmlnLCBHcmlkR3JvdXBTdW1tYXJ5LCBHcmlkR3JvdXBTdW1tYXJ5Q29uZmlnLCBHcmlkUGRmRXhwb3J0LCBHcmlkUGRmRXhwb3J0Q29uZmlnLCBHcmlkU3VtbWFyeSwgR3JpZFN1bW1hcnlDb25maWcsIEdyb3VwLCBHcm91cENvbmZpZywgSGVhZGVyTWVudSwgSGVhZGVyTWVudUNvbmZpZywgTGF5b3V0LCBNYXNrLCBNYXNrQ29uZmlnLCBNb2RlbCwgUGFuZWxIZWFkZXIsIFF1aWNrRmluZCwgUXVpY2tGaW5kQ29uZmlnLCBSZWN0YW5nbGUsIFJlZ2lvblJlc2l6ZSwgUmVnaW9uUmVzaXplQ29uZmlnLCBSb3dDb3B5UGFzdGUsIFJvd0NvcHlQYXN0ZUNvbmZpZywgUm93UmVvcmRlciwgUm93UmVvcmRlckNvbmZpZywgU2Nyb2xsTWFuYWdlciwgU2Nyb2xsTWFuYWdlckNvbmZpZywgU2Nyb2xsZXIsIFNjcm9sbGVyQ29uZmlnLCBTZWFyY2gsIFNlYXJjaENvbmZpZywgU29ydCwgU29ydENvbmZpZywgU3RpY2t5Q2VsbHMsIFN0aWNreUNlbGxzQ29uZmlnLCBTdG9yZSwgU3RvcmVDb25maWcsIFN0cmlwZSwgU3RyaXBlQ29uZmlnLCBUcmVlLCBUcmVlQ29uZmlnLCBXaWRnZXQsIFdpZGdldENvbmZpZyB9IGZyb20gJ0BicnludHVtL3NjaGVkdWxlci9zY2hlZHVsZXIubGl0ZS51bWQuanMnO1xuaW1wb3J0IHsgR3JpZEJhc2UsIFN0cmluZ0hlbHBlciwgV2lkZ2V0SGVscGVyIH0gZnJvbSAnQGJyeW50dW0vc2NoZWR1bGVyL3NjaGVkdWxlci5saXRlLnVtZC5qcyc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yIDogJ2JyeW50dW0tZ3JpZC1iYXNlJyxcbiAgICB0ZW1wbGF0ZSA6ICcnXG59KVxuZXhwb3J0IGNsYXNzIEJyeW50dW1HcmlkQmFzZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcblxuICAgIHB1YmxpYyBzdGF0aWMgaW5zdGFuY2VDbGFzcyA9IEdyaWRCYXNlO1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bUZlYXR1cmVOYW1lczogc3RyaW5nW10gPSBbXG4gICAgICAgICdjZWxsRWRpdEZlYXR1cmUnLFxuICAgICAgICAnY2VsbE1lbnVGZWF0dXJlJyxcbiAgICAgICAgJ2NlbGxUb29sdGlwRmVhdHVyZScsXG4gICAgICAgICdjb2x1bW5BdXRvV2lkdGhGZWF0dXJlJyxcbiAgICAgICAgJ2NvbHVtbkRyYWdUb29sYmFyRmVhdHVyZScsXG4gICAgICAgICdjb2x1bW5QaWNrZXJGZWF0dXJlJyxcbiAgICAgICAgJ2NvbHVtblJlb3JkZXJGZWF0dXJlJyxcbiAgICAgICAgJ2NvbHVtblJlc2l6ZUZlYXR1cmUnLFxuICAgICAgICAnY29udGV4dE1lbnVGZWF0dXJlJyxcbiAgICAgICAgJ2V4Y2VsRXhwb3J0ZXJGZWF0dXJlJyxcbiAgICAgICAgJ2ZpbHRlckZlYXR1cmUnLFxuICAgICAgICAnZmlsdGVyQmFyRmVhdHVyZScsXG4gICAgICAgICdncm91cEZlYXR1cmUnLFxuICAgICAgICAnZ3JvdXBTdW1tYXJ5RmVhdHVyZScsXG4gICAgICAgICdoZWFkZXJNZW51RmVhdHVyZScsXG4gICAgICAgICdwZGZFeHBvcnRGZWF0dXJlJyxcbiAgICAgICAgJ3F1aWNrRmluZEZlYXR1cmUnLFxuICAgICAgICAncmVnaW9uUmVzaXplRmVhdHVyZScsXG4gICAgICAgICdyb3dDb3B5UGFzdGVGZWF0dXJlJyxcbiAgICAgICAgJ3Jvd1Jlb3JkZXJGZWF0dXJlJyxcbiAgICAgICAgJ3NlYXJjaEZlYXR1cmUnLFxuICAgICAgICAnc29ydEZlYXR1cmUnLFxuICAgICAgICAnc3RpY2t5Q2VsbHNGZWF0dXJlJyxcbiAgICAgICAgJ3N0cmlwZUZlYXR1cmUnLFxuICAgICAgICAnc3VtbWFyeUZlYXR1cmUnLFxuICAgICAgICAndHJlZUZlYXR1cmUnXG4gICAgXTtcblxuICAgIHByaXZhdGUgc3RhdGljIGJyeW50dW1Db25maWdzOiBzdHJpbmdbXSA9IEJyeW50dW1HcmlkQmFzZUNvbXBvbmVudC5icnludHVtRmVhdHVyZU5hbWVzLmNvbmNhdChbXG4gICAgICAgICdhZG9wdCcsXG4gICAgICAgICdhbGlnbicsXG4gICAgICAgICdhbGlnblNlbGYnLFxuICAgICAgICAnYW5jaG9yJyxcbiAgICAgICAgJ2FuaW1hdGVSZW1vdmluZ1Jvd3MnLFxuICAgICAgICAnYXBwZW5kVG8nLFxuICAgICAgICAnYXV0b0hlaWdodCcsXG4gICAgICAgICdiYmFyJyxcbiAgICAgICAgJ2JvZHlDbHMnLFxuICAgICAgICAnYnViYmxlRXZlbnRzJyxcbiAgICAgICAgJ2NlbnRlcmVkJyxcbiAgICAgICAgJ2NscycsXG4gICAgICAgICdjb2x1bW5MaW5lcycsXG4gICAgICAgICdjb2x1bW5zJyxcbiAgICAgICAgJ2NvbmZpZycsXG4gICAgICAgICdjb25zdHJhaW5UbycsXG4gICAgICAgICdjb250ZW50JyxcbiAgICAgICAgJ2NvbnRlbnRFbGVtZW50Q2xzJyxcbiAgICAgICAgJ2NvbnRleHRNZW51VHJpZ2dlckV2ZW50JyxcbiAgICAgICAgJ2RhdGEnLFxuICAgICAgICAnZGF0YXNldCcsXG4gICAgICAgICdkZWZhdWx0QmluZFByb3BlcnR5JyxcbiAgICAgICAgJ2RlZmF1bHRSZWdpb24nLFxuICAgICAgICAnZGVmYXVsdHMnLFxuICAgICAgICAnZGVzdHJveVN0b3JlJyxcbiAgICAgICAgJ2Rpc2FibGVkJyxcbiAgICAgICAgJ2Rpc2FibGVHcmlkUm93TW9kZWxXYXJuaW5nJyxcbiAgICAgICAgJ2RvY2snLFxuICAgICAgICAnZHJhZ2dhYmxlJyxcbiAgICAgICAgJ2VtcHR5VGV4dCcsXG4gICAgICAgICdlbmFibGVTdGlja3knLFxuICAgICAgICAnZW5hYmxlVGV4dFNlbGVjdGlvbicsXG4gICAgICAgICdlbmFibGVVbmRvUmVkb0tleXMnLFxuICAgICAgICAnZXh0cmFEYXRhJyxcbiAgICAgICAgJ2ZlYXR1cmVzJyxcbiAgICAgICAgJ2ZpbGxMYXN0Q29sdW1uJyxcbiAgICAgICAgJ2ZpeGVkUm93SGVpZ2h0JyxcbiAgICAgICAgJ2ZsZXgnLFxuICAgICAgICAnZmxvYXRpbmcnLFxuICAgICAgICAnZm9vdGVyJyxcbiAgICAgICAgJ2Z1bGxSb3dSZWZyZXNoJyxcbiAgICAgICAgJ2dldFJvd0hlaWdodCcsXG4gICAgICAgICdoZWFkZXInLFxuICAgICAgICAnaGVpZ2h0JyxcbiAgICAgICAgJ2hpZGRlbicsXG4gICAgICAgICdoaWRlQW5pbWF0aW9uJyxcbiAgICAgICAgJ2hpZGVIZWFkZXJzJyxcbiAgICAgICAgJ2hpZGVXaGVuRW1wdHknLFxuICAgICAgICAnaHRtbCcsXG4gICAgICAgICdodG1sQ2xzJyxcbiAgICAgICAgJ2lkJyxcbiAgICAgICAgJ2luc2VydEJlZm9yZScsXG4gICAgICAgICdpbnNlcnRGaXJzdCcsXG4gICAgICAgICdpdGVtQ2xzJyxcbiAgICAgICAgJ2l0ZW1zJyxcbiAgICAgICAgJ2xheW91dCcsXG4gICAgICAgICdsYXlvdXRTdHlsZScsXG4gICAgICAgICdsYXp5SXRlbXMnLFxuICAgICAgICAnbGlzdGVuZXJzJyxcbiAgICAgICAgJ2xvYWRNYXNrJyxcbiAgICAgICAgJ2xvYWRNYXNrRGVmYXVsdHMnLFxuICAgICAgICAnbG9hZE1hc2tFcnJvcicsXG4gICAgICAgICdsb2NhbGVDbGFzcycsXG4gICAgICAgICdsb2NhbGl6YWJsZVByb3BlcnRpZXMnLFxuICAgICAgICAnbG9uZ1ByZXNzVGltZScsXG4gICAgICAgICdtYXJnaW4nLFxuICAgICAgICAnbWFza0RlZmF1bHRzJyxcbiAgICAgICAgJ21hc2tlZCcsXG4gICAgICAgICdtYXhIZWlnaHQnLFxuICAgICAgICAnbWF4V2lkdGgnLFxuICAgICAgICAnbWluSGVpZ2h0JyxcbiAgICAgICAgJ21pbldpZHRoJyxcbiAgICAgICAgJ21vbml0b3JSZXNpemUnLFxuICAgICAgICAnbmFtZWRJdGVtcycsXG4gICAgICAgICdvd25lcicsXG4gICAgICAgICdwbHVnaW5zJyxcbiAgICAgICAgJ3Bvc2l0aW9uZWQnLFxuICAgICAgICAncHJlc2VydmVGb2N1c09uRGF0YXNldENoYW5nZScsXG4gICAgICAgICdwcmVzZXJ2ZVNjcm9sbE9uRGF0YXNldENoYW5nZScsXG4gICAgICAgICdwcmV2ZW50VG9vbHRpcE9uVG91Y2gnLFxuICAgICAgICAncmVhZE9ubHknLFxuICAgICAgICAncmVzaXplVG9GaXRJbmNsdWRlc0hlYWRlcicsXG4gICAgICAgICdyZXNwb25zaXZlTGV2ZWxzJyxcbiAgICAgICAgJ3JpcHBsZScsXG4gICAgICAgICdyb290RWxlbWVudCcsXG4gICAgICAgICdyb3dIZWlnaHQnLFxuICAgICAgICAnc2Nyb2xsYWJsZScsXG4gICAgICAgICdzY3JvbGxBY3Rpb24nLFxuICAgICAgICAnc2Nyb2xsZXJDbGFzcycsXG4gICAgICAgICdzY3JvbGxNYW5hZ2VyJyxcbiAgICAgICAgJ3NlbGVjdGlvbk1vZGUnLFxuICAgICAgICAnc2hvd0FuaW1hdGlvbicsXG4gICAgICAgICdzaG93RGlydHknLFxuICAgICAgICAnc2hvd1JlbW92ZVJvd0luQ29udGV4dE1lbnUnLFxuICAgICAgICAnc3RvcmUnLFxuICAgICAgICAnc3RyaXBzJyxcbiAgICAgICAgJ3N1YkdyaWRDb25maWdzJyxcbiAgICAgICAgJ3N5bmNNYXNrJyxcbiAgICAgICAgJ3RhYicsXG4gICAgICAgICd0YWcnLFxuICAgICAgICAndGJhcicsXG4gICAgICAgICd0ZXh0QWxpZ24nLFxuICAgICAgICAndGV4dENvbnRlbnQnLFxuICAgICAgICAndGl0bGUnLFxuICAgICAgICAndG9vbHMnLFxuICAgICAgICAndG9vbHRpcCcsXG4gICAgICAgICd0cmFuc2l0aW9uRHVyYXRpb24nLFxuICAgICAgICAndHJhcEZvY3VzJyxcbiAgICAgICAgJ3dlaWdodCcsXG4gICAgICAgICd3aWR0aCcsXG4gICAgICAgICd4JyxcbiAgICAgICAgJ3knXG4gICAgXSk7XG5cbiAgICBwcml2YXRlIHN0YXRpYyBicnludHVtQ29uZmlnc09ubHk6IHN0cmluZ1tdID0gW1xuICAgICAgICAnYWRvcHQnLFxuICAgICAgICAnYWxpZ24nLFxuICAgICAgICAnYW5jaG9yJyxcbiAgICAgICAgJ2FuaW1hdGVSZW1vdmluZ1Jvd3MnLFxuICAgICAgICAnYXBwZW5kVG8nLFxuICAgICAgICAnYXV0b0hlaWdodCcsXG4gICAgICAgICdiYmFyJyxcbiAgICAgICAgJ2JvZHlDbHMnLFxuICAgICAgICAnYnViYmxlRXZlbnRzJyxcbiAgICAgICAgJ2NlbnRlcmVkJyxcbiAgICAgICAgJ2NscycsXG4gICAgICAgICdjb2x1bW5zJyxcbiAgICAgICAgJ2NvbmZpZycsXG4gICAgICAgICdjb25zdHJhaW5UbycsXG4gICAgICAgICdjb250ZW50RWxlbWVudENscycsXG4gICAgICAgICdjb250ZXh0TWVudVRyaWdnZXJFdmVudCcsXG4gICAgICAgICdkZWZhdWx0QmluZFByb3BlcnR5JyxcbiAgICAgICAgJ2RlZmF1bHRSZWdpb24nLFxuICAgICAgICAnZGVmYXVsdHMnLFxuICAgICAgICAnZGVzdHJveVN0b3JlJyxcbiAgICAgICAgJ2Rpc2FibGVHcmlkUm93TW9kZWxXYXJuaW5nJyxcbiAgICAgICAgJ2RvY2snLFxuICAgICAgICAnZHJhZ2dhYmxlJyxcbiAgICAgICAgJ2VtcHR5VGV4dCcsXG4gICAgICAgICdlbmFibGVTdGlja3knLFxuICAgICAgICAnZW5hYmxlVGV4dFNlbGVjdGlvbicsXG4gICAgICAgICdlbmFibGVVbmRvUmVkb0tleXMnLFxuICAgICAgICAnZmVhdHVyZXMnLFxuICAgICAgICAnZmlsbExhc3RDb2x1bW4nLFxuICAgICAgICAnZml4ZWRSb3dIZWlnaHQnLFxuICAgICAgICAnZmxvYXRpbmcnLFxuICAgICAgICAnZm9vdGVyJyxcbiAgICAgICAgJ2Z1bGxSb3dSZWZyZXNoJyxcbiAgICAgICAgJ2dldFJvd0hlaWdodCcsXG4gICAgICAgICdoZWFkZXInLFxuICAgICAgICAnaGlkZUFuaW1hdGlvbicsXG4gICAgICAgICdoaWRlSGVhZGVycycsXG4gICAgICAgICdoaWRlV2hlbkVtcHR5JyxcbiAgICAgICAgJ2h0bWxDbHMnLFxuICAgICAgICAnaW5zZXJ0QmVmb3JlJyxcbiAgICAgICAgJ2luc2VydEZpcnN0JyxcbiAgICAgICAgJ2l0ZW1DbHMnLFxuICAgICAgICAnbGF6eUl0ZW1zJyxcbiAgICAgICAgJ2xpc3RlbmVycycsXG4gICAgICAgICdsb2FkTWFzaycsXG4gICAgICAgICdsb2FkTWFza0RlZmF1bHRzJyxcbiAgICAgICAgJ2xvYWRNYXNrRXJyb3InLFxuICAgICAgICAnbG9jYWxlQ2xhc3MnLFxuICAgICAgICAnbG9jYWxpemFibGVQcm9wZXJ0aWVzJyxcbiAgICAgICAgJ2xvbmdQcmVzc1RpbWUnLFxuICAgICAgICAnbWFza0RlZmF1bHRzJyxcbiAgICAgICAgJ21hc2tlZCcsXG4gICAgICAgICdtb25pdG9yUmVzaXplJyxcbiAgICAgICAgJ25hbWVkSXRlbXMnLFxuICAgICAgICAnb3duZXInLFxuICAgICAgICAncGx1Z2lucycsXG4gICAgICAgICdwb3NpdGlvbmVkJyxcbiAgICAgICAgJ3ByZXNlcnZlRm9jdXNPbkRhdGFzZXRDaGFuZ2UnLFxuICAgICAgICAncHJlc2VydmVTY3JvbGxPbkRhdGFzZXRDaGFuZ2UnLFxuICAgICAgICAncHJldmVudFRvb2x0aXBPblRvdWNoJyxcbiAgICAgICAgJ3Jlc2l6ZVRvRml0SW5jbHVkZXNIZWFkZXInLFxuICAgICAgICAncmVzcG9uc2l2ZUxldmVscycsXG4gICAgICAgICdyaXBwbGUnLFxuICAgICAgICAncm9vdEVsZW1lbnQnLFxuICAgICAgICAnc2Nyb2xsQWN0aW9uJyxcbiAgICAgICAgJ3Njcm9sbGVyQ2xhc3MnLFxuICAgICAgICAnc2Nyb2xsTWFuYWdlcicsXG4gICAgICAgICdzZWxlY3Rpb25Nb2RlJyxcbiAgICAgICAgJ3Nob3dBbmltYXRpb24nLFxuICAgICAgICAnc2hvd0RpcnR5JyxcbiAgICAgICAgJ3Nob3dSZW1vdmVSb3dJbkNvbnRleHRNZW51JyxcbiAgICAgICAgJ3N0cmlwcycsXG4gICAgICAgICdzdWJHcmlkQ29uZmlncycsXG4gICAgICAgICdzeW5jTWFzaycsXG4gICAgICAgICd0YWInLFxuICAgICAgICAndGFnJyxcbiAgICAgICAgJ3RiYXInLFxuICAgICAgICAndGV4dEFsaWduJyxcbiAgICAgICAgJ3RleHRDb250ZW50JyxcbiAgICAgICAgJ3RpdGxlJyxcbiAgICAgICAgJ3RyYXBGb2N1cycsXG4gICAgICAgICd3ZWlnaHQnXG4gICAgXTtcblxuICAgIHByaXZhdGUgc3RhdGljIGJyeW50dW1Qcm9wczogc3RyaW5nW10gPSBCcnludHVtR3JpZEJhc2VDb21wb25lbnQuYnJ5bnR1bUZlYXR1cmVOYW1lcy5jb25jYXQoW1xuICAgICAgICAnYWxpZ25TZWxmJyxcbiAgICAgICAgJ2FuY2hvclNpemUnLFxuICAgICAgICAnY29sdW1uTGluZXMnLFxuICAgICAgICAnY29udGVudCcsXG4gICAgICAgICdkYXRhJyxcbiAgICAgICAgJ2RhdGFzZXQnLFxuICAgICAgICAnZGlzYWJsZWQnLFxuICAgICAgICAnZXh0cmFEYXRhJyxcbiAgICAgICAgJ2ZsZXgnLFxuICAgICAgICAnaGVpZ2h0JyxcbiAgICAgICAgJ2hpZGRlbicsXG4gICAgICAgICdodG1sJyxcbiAgICAgICAgJ2lkJyxcbiAgICAgICAgJ2lzU2V0dGluZ1ZhbHVlcycsXG4gICAgICAgICdpc1ZhbGlkJyxcbiAgICAgICAgJ2l0ZW1zJyxcbiAgICAgICAgJ2xheW91dCcsXG4gICAgICAgICdsYXlvdXRTdHlsZScsXG4gICAgICAgICdtYXJnaW4nLFxuICAgICAgICAnbWF4SGVpZ2h0JyxcbiAgICAgICAgJ21heFdpZHRoJyxcbiAgICAgICAgJ21pbkhlaWdodCcsXG4gICAgICAgICdtaW5XaWR0aCcsXG4gICAgICAgICdyZWFkT25seScsXG4gICAgICAgICdyZWNvcmQnLFxuICAgICAgICAncm93SGVpZ2h0JyxcbiAgICAgICAgJ3Njcm9sbGFibGUnLFxuICAgICAgICAnc2VsZWN0ZWRDZWxsJyxcbiAgICAgICAgJ3NlbGVjdGVkUmVjb3JkJyxcbiAgICAgICAgJ3NlbGVjdGVkUmVjb3JkcycsXG4gICAgICAgICdzdGF0ZScsXG4gICAgICAgICdzdG9yZScsXG4gICAgICAgICd0b29scycsXG4gICAgICAgICd0b29sdGlwJyxcbiAgICAgICAgJ3RyYW5zaXRpb25EdXJhdGlvbicsXG4gICAgICAgICd2YWx1ZXMnLFxuICAgICAgICAnd2lkdGgnLFxuICAgICAgICAneCcsXG4gICAgICAgICd5J1xuICAgIF0pO1xuXG4gICAgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmO1xuICAgIHB1YmxpYyBpbnN0YW5jZTogR3JpZEJhc2U7XG5cbiAgICBwcml2YXRlIGJyeW50dW1Db25maWcgPSB7XG4gICAgICAgIGFuZ3VsYXJDb21wb25lbnQgOiB0aGlzLFxuICAgICAgICBhZG9wdCAgICAgICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgICBsaXN0ZW5lcnMgICAgICAgIDoge30sXG4gICAgICAgIGZlYXR1cmVzICAgICAgICAgOiB7fVxuICAgIH07XG5cbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50OiBFbGVtZW50UmVmKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudFJlZiA9IGVsZW1lbnQ7XG4gICAgfVxuXG4gICAgIC8vIENvbmZpZ3Mgb25seVxuICAgIEBJbnB1dCgpIGFkb3B0ICAgICAgICAgICAgICAgICAgICAgICAgIDogSFRNTEVsZW1lbnR8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGFsaWduICAgICAgICAgICAgICAgICAgICAgICAgIDogb2JqZWN0fHN0cmluZztcbiAgICBASW5wdXQoKSBhbmNob3IgICAgICAgICAgICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgYW5pbWF0ZVJlbW92aW5nUm93cyAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGFwcGVuZFRvICAgICAgICAgICAgICAgICAgICAgIDogSFRNTEVsZW1lbnR8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGF1dG9IZWlnaHQgICAgICAgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBiYmFyICAgICAgICAgICAgICAgICAgICAgICAgICA6IG9iamVjdFtdfG9iamVjdDtcbiAgICBASW5wdXQoKSBib2R5Q2xzICAgICAgICAgICAgICAgICAgICAgICA6IHN0cmluZ3xvYmplY3Q7XG4gICAgQElucHV0KCkgYnViYmxlRXZlbnRzICAgICAgICAgICAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgY2VudGVyZWQgICAgICAgICAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGNscyAgICAgICAgICAgICAgICAgICAgICAgICAgIDogc3RyaW5nfG9iamVjdDtcbiAgICBASW5wdXQoKSBjb2x1bW5zICAgICAgICAgICAgICAgICAgICAgICA6IG9iamVjdFtdfG9iamVjdDtcbiAgICBASW5wdXQoKSBjb25maWcgICAgICAgICAgICAgICAgICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBjb25zdHJhaW5UbyAgICAgICAgICAgICAgICAgICA6IEhUTUxFbGVtZW50fFdpZGdldHxSZWN0YW5nbGU7XG4gICAgQElucHV0KCkgY29udGVudEVsZW1lbnRDbHMgICAgICAgICAgICAgOiBzdHJpbmd8b2JqZWN0O1xuICAgIEBJbnB1dCgpIGNvbnRleHRNZW51VHJpZ2dlckV2ZW50ICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGRlZmF1bHRCaW5kUHJvcGVydHkgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGRlZmF1bHRSZWdpb24gICAgICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGRlZmF1bHRzICAgICAgICAgICAgICAgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIGRlc3Ryb3lTdG9yZSAgICAgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBkaXNhYmxlR3JpZFJvd01vZGVsV2FybmluZyAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgZG9jayAgICAgICAgICAgICAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgZHJhZ2dhYmxlICAgICAgICAgICAgICAgICAgICAgOiBib29sZWFufG9iamVjdDtcbiAgICBASW5wdXQoKSBlbXB0eVRleHQgICAgICAgICAgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBlbmFibGVTdGlja3kgICAgICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgZW5hYmxlVGV4dFNlbGVjdGlvbiAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGVuYWJsZVVuZG9SZWRvS2V5cyAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBmZWF0dXJlcyAgICAgICAgICAgICAgICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBmaWxsTGFzdENvbHVtbiAgICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgZml4ZWRSb3dIZWlnaHQgICAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGZsb2F0aW5nICAgICAgICAgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBmb290ZXIgICAgICAgICAgICAgICAgICAgICAgICA6IG9iamVjdHxzdHJpbmc7XG4gICAgQElucHV0KCkgZnVsbFJvd1JlZnJlc2ggICAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGdldFJvd0hlaWdodCAgICAgICAgICAgICAgICAgIDogRnVuY3Rpb247XG4gICAgQElucHV0KCkgaGVhZGVyICAgICAgICAgICAgICAgICAgICAgICAgOiBzdHJpbmd8UGFuZWxIZWFkZXI7XG4gICAgQElucHV0KCkgaGlkZUFuaW1hdGlvbiAgICAgICAgICAgICAgICAgOiBib29sZWFufG9iamVjdDtcbiAgICBASW5wdXQoKSBoaWRlSGVhZGVycyAgICAgICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgaGlkZVdoZW5FbXB0eSAgICAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGh0bWxDbHMgICAgICAgICAgICAgICAgICAgICAgIDogc3RyaW5nfG9iamVjdDtcbiAgICBASW5wdXQoKSBpbnNlcnRCZWZvcmUgICAgICAgICAgICAgICAgICA6IEhUTUxFbGVtZW50fHN0cmluZztcbiAgICBASW5wdXQoKSBpbnNlcnRGaXJzdCAgICAgICAgICAgICAgICAgICA6IEhUTUxFbGVtZW50fHN0cmluZztcbiAgICBASW5wdXQoKSBpdGVtQ2xzICAgICAgICAgICAgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBsYXp5SXRlbXMgICAgICAgICAgICAgICAgICAgICA6IG9iamVjdHxvYmplY3RbXXxXaWRnZXRbXXxQYXJ0aWFsPFdpZGdldENvbmZpZz58UGFydGlhbDxXaWRnZXRDb25maWc+W107XG4gICAgQElucHV0KCkgbGlzdGVuZXJzICAgICAgICAgICAgICAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgbG9hZE1hc2sgICAgICAgICAgICAgICAgICAgICAgOiBzdHJpbmd8b2JqZWN0fG51bGw7XG4gICAgQElucHV0KCkgbG9hZE1hc2tEZWZhdWx0cyAgICAgICAgICAgICAgOiBvYmplY3R8TWFza3xQYXJ0aWFsPE1hc2tDb25maWc+O1xuICAgIEBJbnB1dCgpIGxvYWRNYXNrRXJyb3IgICAgICAgICAgICAgICAgIDogb2JqZWN0fE1hc2t8UGFydGlhbDxNYXNrQ29uZmlnPjtcbiAgICBASW5wdXQoKSBsb2NhbGVDbGFzcyAgICAgICAgICAgICAgICAgICA6IEJhc2U7XG4gICAgQElucHV0KCkgbG9jYWxpemFibGVQcm9wZXJ0aWVzICAgICAgICAgOiBzdHJpbmdbXTtcbiAgICBASW5wdXQoKSBsb25nUHJlc3NUaW1lICAgICAgICAgICAgICAgICA6IG51bWJlcjtcbiAgICBASW5wdXQoKSBtYXNrRGVmYXVsdHMgICAgICAgICAgICAgICAgICA6IG9iamVjdHxNYXNrfFBhcnRpYWw8TWFza0NvbmZpZz47XG4gICAgQElucHV0KCkgbWFza2VkICAgICAgICAgICAgICAgICAgICAgICAgOiBib29sZWFufHN0cmluZ3xvYmplY3R8TWFza3xQYXJ0aWFsPE1hc2tDb25maWc+O1xuICAgIEBJbnB1dCgpIG1vbml0b3JSZXNpemUgICAgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBuYW1lZEl0ZW1zICAgICAgICAgICAgICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBvd25lciAgICAgICAgICAgICAgICAgICAgICAgICA6IFdpZGdldDtcbiAgICBASW5wdXQoKSBwbHVnaW5zICAgICAgICAgICAgICAgICAgICAgICA6IEZ1bmN0aW9uW107XG4gICAgQElucHV0KCkgcG9zaXRpb25lZCAgICAgICAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHByZXNlcnZlRm9jdXNPbkRhdGFzZXRDaGFuZ2UgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBwcmVzZXJ2ZVNjcm9sbE9uRGF0YXNldENoYW5nZSA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgcHJldmVudFRvb2x0aXBPblRvdWNoICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHJlc2l6ZVRvRml0SW5jbHVkZXNIZWFkZXIgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSByZXNwb25zaXZlTGV2ZWxzICAgICAgICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSByaXBwbGUgICAgICAgICAgICAgICAgICAgICAgICA6IGJvb2xlYW58b2JqZWN0O1xuICAgIEBJbnB1dCgpIHJvb3RFbGVtZW50ICAgICAgICAgICAgICAgICAgIDogU2hhZG93Um9vdDtcbiAgICBASW5wdXQoKSBzY3JvbGxBY3Rpb24gICAgICAgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBzY3JvbGxlckNsYXNzICAgICAgICAgICAgICAgICA6IFNjcm9sbGVyO1xuICAgIEBJbnB1dCgpIHNjcm9sbE1hbmFnZXIgICAgICAgICAgICAgICAgIDogb2JqZWN0fFNjcm9sbE1hbmFnZXJ8UGFydGlhbDxTY3JvbGxNYW5hZ2VyQ29uZmlnPjtcbiAgICBASW5wdXQoKSBzZWxlY3Rpb25Nb2RlICAgICAgICAgICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBzaG93QW5pbWF0aW9uICAgICAgICAgICAgICAgICA6IGJvb2xlYW58b2JqZWN0O1xuICAgIEBJbnB1dCgpIHNob3dEaXJ0eSAgICAgICAgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBzaG93UmVtb3ZlUm93SW5Db250ZXh0TWVudSAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgc3RyaXBzICAgICAgICAgICAgICAgICAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgc3ViR3JpZENvbmZpZ3MgICAgICAgICAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgc3luY01hc2sgICAgICAgICAgICAgICAgICAgICAgOiBzdHJpbmd8b2JqZWN0fG51bGw7XG4gICAgQElucHV0KCkgdGFiICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBib29sZWFufG9iamVjdDtcbiAgICBASW5wdXQoKSB0YWcgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSB0YmFyICAgICAgICAgICAgICAgICAgICAgICAgICA6IG9iamVjdFtdfG9iamVjdDtcbiAgICBASW5wdXQoKSB0ZXh0QWxpZ24gICAgICAgICAgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSB0ZXh0Q29udGVudCAgICAgICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgdGl0bGUgICAgICAgICAgICAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgdHJhcEZvY3VzICAgICAgICAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHdlaWdodCAgICAgICAgICAgICAgICAgICAgICAgIDogbnVtYmVyO1xuXG4gICAgIC8vIENvbmZpZ3MgYW5kIHByb3BlcnRpZXNcbiAgICBASW5wdXQoKSBhbGlnblNlbGYgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgY29sdW1uTGluZXMgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBjb250ZW50ICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgZGF0YSAgICAgICAgICAgICAgIDogb2JqZWN0W107XG4gICAgQElucHV0KCkgZGF0YXNldCAgICAgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIGRpc2FibGVkICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgZXh0cmFEYXRhICAgICAgICAgIDogYm9vbGVhbnxudW1iZXJ8b2JqZWN0fHN0cmluZztcbiAgICBASW5wdXQoKSBmbGV4ICAgICAgICAgICAgICAgOiBudW1iZXJ8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGhlaWdodCAgICAgICAgICAgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgaGlkZGVuICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBodG1sICAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgaWQgICAgICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGl0ZW1zICAgICAgICAgICAgICA6IFdpZGdldFtdfG9iamVjdHxvYmplY3RbXXxQYXJ0aWFsPFdpZGdldENvbmZpZz58UGFydGlhbDxXaWRnZXRDb25maWc+W107XG4gICAgQElucHV0KCkgbGF5b3V0ICAgICAgICAgICAgIDogTGF5b3V0fHN0cmluZztcbiAgICBASW5wdXQoKSBsYXlvdXRTdHlsZSAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgbWFyZ2luICAgICAgICAgICAgIDogbnVtYmVyfHN0cmluZztcbiAgICBASW5wdXQoKSBtYXhIZWlnaHQgICAgICAgICAgOiBudW1iZXJ8c3RyaW5nO1xuICAgIEBJbnB1dCgpIG1heFdpZHRoICAgICAgICAgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgbWluSGVpZ2h0ICAgICAgICAgIDogbnVtYmVyfHN0cmluZztcbiAgICBASW5wdXQoKSBtaW5XaWR0aCAgICAgICAgICAgOiBudW1iZXJ8c3RyaW5nO1xuICAgIEBJbnB1dCgpIHJlYWRPbmx5ICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgcm93SGVpZ2h0ICAgICAgICAgIDogbnVtYmVyO1xuICAgIEBJbnB1dCgpIHNjcm9sbGFibGUgICAgICAgICA6IGJvb2xlYW58U2Nyb2xsZXJ8b2JqZWN0fFBhcnRpYWw8U2Nyb2xsZXJDb25maWc+O1xuICAgIEBJbnB1dCgpIHN0b3JlICAgICAgICAgICAgICA6IFN0b3JlfG9iamVjdHxQYXJ0aWFsPFN0b3JlQ29uZmlnPjtcbiAgICBASW5wdXQoKSB0b29scyAgICAgICAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgdG9vbHRpcCAgICAgICAgICAgIDogb2JqZWN0fHN0cmluZztcbiAgICBASW5wdXQoKSB0cmFuc2l0aW9uRHVyYXRpb24gOiBudW1iZXI7XG4gICAgQElucHV0KCkgd2lkdGggICAgICAgICAgICAgIDogbnVtYmVyfHN0cmluZztcbiAgICBASW5wdXQoKSB4ICAgICAgICAgICAgICAgICAgOiBudW1iZXI7XG4gICAgQElucHV0KCkgeSAgICAgICAgICAgICAgICAgIDogbnVtYmVyO1xuXG4gICAgIC8vIFByb3BlcnRpZXMgb25seVxuICAgIEBJbnB1dCgpIGFuY2hvclNpemUgICAgICA6IG51bWJlcltdO1xuICAgIEBJbnB1dCgpIGlzU2V0dGluZ1ZhbHVlcyA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgaXNWYWxpZCAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSByZWNvcmQgICAgICAgICAgOiBNb2RlbDtcbiAgICBASW5wdXQoKSBzZWxlY3RlZENlbGwgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgc2VsZWN0ZWRSZWNvcmQgIDogTW9kZWw7XG4gICAgQElucHV0KCkgc2VsZWN0ZWRSZWNvcmRzIDogTW9kZWxbXXxudW1iZXJbXTtcbiAgICBASW5wdXQoKSBzdGF0ZSAgICAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgdmFsdWVzICAgICAgICAgIDogb2JqZWN0O1xuXG4gICAgIC8vIEV2ZW50c1xuICAgIEBPdXRwdXQoKSBvbkJlZm9yZUNlbGxFZGl0U3RhcnQgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uQmVmb3JlRGVzdHJveSAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25CZWZvcmVFeHBvcnQgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkJlZm9yZUZpbmlzaENlbGxFZGl0ID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uQmVmb3JlSGlkZSAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25CZWZvcmVSZW5kZXJSb3dzICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkJlZm9yZVNldFJlY29yZCAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uQmVmb3JlU2hvdyAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25CZWZvcmVUb2dnbGVOb2RlICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkNhbmNlbENlbGxFZGl0ICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uQ2F0Y2hBbGwgICAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25DZWxsQ2xpY2sgICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkNlbGxDb250ZXh0TWVudSAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uQ2VsbERibENsaWNrICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25DZWxsTW91c2VPdXQgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkNlbGxNb3VzZU92ZXIgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uQ29sbGFwc2VOb2RlICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25EZXN0cm95ICAgICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkV4cGFuZE5vZGUgICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uRXhwb3J0ICAgICAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25GaW5pc2hDZWxsRWRpdCAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkZvY3VzSW4gICAgICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uRm9jdXNPdXQgICAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25IaWRlICAgICAgICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbk1vdXNlT3V0ICAgICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uTW91c2VPdmVyICAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25QYWludCAgICAgICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvblJlYWRPbmx5ICAgICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uUmVuZGVyUm93cyAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25SZXNpemUgICAgICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvblJlc3BvbnNpdmUgICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uU2Nyb2xsICAgICAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25TZWxlY3Rpb25DaGFuZ2UgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvblNob3cgICAgICAgICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uU3RhcnRDZWxsRWRpdCAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25Ub2dnbGVOb2RlICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvblRvb2xDbGljayAgICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG5cbiAgICAgLy8gRmVhdHVyZXNcbiAgICBASW5wdXQoKSBjZWxsRWRpdEZlYXR1cmUgICA6IG9iamVjdHxib29sZWFufHN0cmluZ3xDZWxsRWRpdHxQYXJ0aWFsPENlbGxFZGl0Q29uZmlnPjtcbiAgICBASW5wdXQoKSBjZWxsTWVudUZlYXR1cmUgICA6IG9iamVjdHxib29sZWFufHN0cmluZ3xDZWxsTWVudXxQYXJ0aWFsPENlbGxNZW51Q29uZmlnPjtcbiAgICBASW5wdXQoKSBjZWxsVG9vbHRpcEZlYXR1cmUgOiBvYmplY3R8Ym9vbGVhbnxzdHJpbmd8Q2VsbFRvb2x0aXB8UGFydGlhbDxDZWxsVG9vbHRpcENvbmZpZz47XG4gICAgQElucHV0KCkgY29sdW1uQXV0b1dpZHRoRmVhdHVyZSA6IG9iamVjdHxib29sZWFufHN0cmluZ3xDb2x1bW5BdXRvV2lkdGh8UGFydGlhbDxDb2x1bW5BdXRvV2lkdGhDb25maWc+O1xuICAgIEBJbnB1dCgpIGNvbHVtbkRyYWdUb29sYmFyRmVhdHVyZSA6IG9iamVjdHxib29sZWFufHN0cmluZ3xDb2x1bW5EcmFnVG9vbGJhcnxQYXJ0aWFsPENvbHVtbkRyYWdUb29sYmFyQ29uZmlnPjtcbiAgICBASW5wdXQoKSBjb2x1bW5QaWNrZXJGZWF0dXJlIDogb2JqZWN0fGJvb2xlYW58c3RyaW5nfENvbHVtblBpY2tlcnxQYXJ0aWFsPENvbHVtblBpY2tlckNvbmZpZz47XG4gICAgQElucHV0KCkgY29sdW1uUmVvcmRlckZlYXR1cmUgOiBvYmplY3R8Ym9vbGVhbnxzdHJpbmd8Q29sdW1uUmVvcmRlcnxQYXJ0aWFsPENvbHVtblJlb3JkZXJDb25maWc+O1xuICAgIEBJbnB1dCgpIGNvbHVtblJlc2l6ZUZlYXR1cmUgOiBvYmplY3R8Ym9vbGVhbnxzdHJpbmd8Q29sdW1uUmVzaXplfFBhcnRpYWw8Q29sdW1uUmVzaXplQ29uZmlnPjtcbiAgICBASW5wdXQoKSBjb250ZXh0TWVudUZlYXR1cmUgOiBvYmplY3R8Ym9vbGVhbnxzdHJpbmd8Q29udGV4dE1lbnV8UGFydGlhbDxDb250ZXh0TWVudUNvbmZpZz47XG4gICAgQElucHV0KCkgZXhjZWxFeHBvcnRlckZlYXR1cmUgOiBvYmplY3R8Ym9vbGVhbnxzdHJpbmd8R3JpZEV4Y2VsRXhwb3J0ZXJ8UGFydGlhbDxHcmlkRXhjZWxFeHBvcnRlckNvbmZpZz47XG4gICAgQElucHV0KCkgZmlsdGVyRmVhdHVyZSAgICAgOiBvYmplY3R8Ym9vbGVhbnxzdHJpbmd8RmlsdGVyfFBhcnRpYWw8RmlsdGVyQ29uZmlnPjtcbiAgICBASW5wdXQoKSBmaWx0ZXJCYXJGZWF0dXJlICA6IG9iamVjdHxib29sZWFufHN0cmluZ3xGaWx0ZXJCYXJ8UGFydGlhbDxGaWx0ZXJCYXJDb25maWc+O1xuICAgIEBJbnB1dCgpIGdyb3VwRmVhdHVyZSAgICAgIDogb2JqZWN0fGJvb2xlYW58c3RyaW5nfEdyb3VwfFBhcnRpYWw8R3JvdXBDb25maWc+O1xuICAgIEBJbnB1dCgpIGdyb3VwU3VtbWFyeUZlYXR1cmUgOiBvYmplY3R8Ym9vbGVhbnxzdHJpbmd8R3JpZEdyb3VwU3VtbWFyeXxQYXJ0aWFsPEdyaWRHcm91cFN1bW1hcnlDb25maWc+O1xuICAgIEBJbnB1dCgpIGhlYWRlck1lbnVGZWF0dXJlIDogb2JqZWN0fGJvb2xlYW58c3RyaW5nfEhlYWRlck1lbnV8UGFydGlhbDxIZWFkZXJNZW51Q29uZmlnPjtcbiAgICBASW5wdXQoKSBwZGZFeHBvcnRGZWF0dXJlICA6IG9iamVjdHxib29sZWFufHN0cmluZ3xHcmlkUGRmRXhwb3J0fFBhcnRpYWw8R3JpZFBkZkV4cG9ydENvbmZpZz47XG4gICAgQElucHV0KCkgcXVpY2tGaW5kRmVhdHVyZSAgOiBvYmplY3R8Ym9vbGVhbnxzdHJpbmd8UXVpY2tGaW5kfFBhcnRpYWw8UXVpY2tGaW5kQ29uZmlnPjtcbiAgICBASW5wdXQoKSByZWdpb25SZXNpemVGZWF0dXJlIDogb2JqZWN0fGJvb2xlYW58c3RyaW5nfFJlZ2lvblJlc2l6ZXxQYXJ0aWFsPFJlZ2lvblJlc2l6ZUNvbmZpZz47XG4gICAgQElucHV0KCkgcm93Q29weVBhc3RlRmVhdHVyZSA6IG9iamVjdHxib29sZWFufHN0cmluZ3xSb3dDb3B5UGFzdGV8UGFydGlhbDxSb3dDb3B5UGFzdGVDb25maWc+O1xuICAgIEBJbnB1dCgpIHJvd1Jlb3JkZXJGZWF0dXJlIDogb2JqZWN0fGJvb2xlYW58c3RyaW5nfFJvd1Jlb3JkZXJ8UGFydGlhbDxSb3dSZW9yZGVyQ29uZmlnPjtcbiAgICBASW5wdXQoKSBzZWFyY2hGZWF0dXJlICAgICA6IG9iamVjdHxib29sZWFufHN0cmluZ3xTZWFyY2h8UGFydGlhbDxTZWFyY2hDb25maWc+O1xuICAgIEBJbnB1dCgpIHNvcnRGZWF0dXJlICAgICAgIDogb2JqZWN0fGJvb2xlYW58c3RyaW5nfFNvcnR8UGFydGlhbDxTb3J0Q29uZmlnPjtcbiAgICBASW5wdXQoKSBzdGlja3lDZWxsc0ZlYXR1cmUgOiBvYmplY3R8Ym9vbGVhbnxzdHJpbmd8U3RpY2t5Q2VsbHN8UGFydGlhbDxTdGlja3lDZWxsc0NvbmZpZz47XG4gICAgQElucHV0KCkgc3RyaXBlRmVhdHVyZSAgICAgOiBvYmplY3R8Ym9vbGVhbnxzdHJpbmd8U3RyaXBlfFBhcnRpYWw8U3RyaXBlQ29uZmlnPjtcbiAgICBASW5wdXQoKSBzdW1tYXJ5RmVhdHVyZSAgICA6IG9iamVjdHxib29sZWFufHN0cmluZ3xHcmlkU3VtbWFyeXxQYXJ0aWFsPEdyaWRTdW1tYXJ5Q29uZmlnPjtcbiAgICBASW5wdXQoKSB0cmVlRmVhdHVyZSAgICAgICA6IG9iamVjdHxib29sZWFufHN0cmluZ3xUcmVlfFBhcnRpYWw8VHJlZUNvbmZpZz47XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYW5kIGFwcGVuZCB0aGUgdW5kZXJseWluZyB3aWRnZXRcbiAgICAgKi9cbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICAgY29uc3RcbiAgICAgICAgICAgIG1lID0gdGhpcyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50UmVmLFxuICAgICAgICAgICAgICAgIGJyeW50dW1Db25maWdcbiAgICAgICAgICAgIH0gPSBtZSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpbnN0YW5jZUNsYXNzLFxuICAgICAgICAgICAgICAgIGJyeW50dW1Db25maWdzXG4gICAgICAgICAgICB9ID0gQnJ5bnR1bUdyaWRCYXNlQ29tcG9uZW50O1xuXG4gICAgICAgIE9iamVjdC5hc3NpZ24oYnJ5bnR1bUNvbmZpZywge1xuICAgICAgICAgICAgbGlzdGVuZXJzIDoge1xuICAgICAgICAgICAgICAgIGJlZm9yZUNlbGxFZGl0U3RhcnQoZXZlbnQgOiBhbnkpIHsgbWUub25CZWZvcmVDZWxsRWRpdFN0YXJ0LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGJlZm9yZURlc3Ryb3koZXZlbnQgOiBhbnkpIHsgbWUub25CZWZvcmVEZXN0cm95LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGJlZm9yZUV4cG9ydChldmVudCA6IGFueSkgeyBtZS5vbkJlZm9yZUV4cG9ydC5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBiZWZvcmVGaW5pc2hDZWxsRWRpdChldmVudCA6IGFueSkgeyBtZS5vbkJlZm9yZUZpbmlzaENlbGxFZGl0LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGJlZm9yZUhpZGUoZXZlbnQgOiBhbnkpIHsgbWUub25CZWZvcmVIaWRlLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGJlZm9yZVJlbmRlclJvd3MoZXZlbnQgOiBhbnkpIHsgbWUub25CZWZvcmVSZW5kZXJSb3dzLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGJlZm9yZVNldFJlY29yZChldmVudCA6IGFueSkgeyBtZS5vbkJlZm9yZVNldFJlY29yZC5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBiZWZvcmVTaG93KGV2ZW50IDogYW55KSB7IG1lLm9uQmVmb3JlU2hvdy5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBiZWZvcmVUb2dnbGVOb2RlKGV2ZW50IDogYW55KSB7IG1lLm9uQmVmb3JlVG9nZ2xlTm9kZS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBjYW5jZWxDZWxsRWRpdChldmVudCA6IGFueSkgeyBtZS5vbkNhbmNlbENlbGxFZGl0LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGNhdGNoQWxsKGV2ZW50IDogYW55KSB7IG1lLm9uQ2F0Y2hBbGwuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgY2VsbENsaWNrKGV2ZW50IDogYW55KSB7IG1lLm9uQ2VsbENsaWNrLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGNlbGxDb250ZXh0TWVudShldmVudCA6IGFueSkgeyBtZS5vbkNlbGxDb250ZXh0TWVudS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBjZWxsRGJsQ2xpY2soZXZlbnQgOiBhbnkpIHsgbWUub25DZWxsRGJsQ2xpY2suZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgY2VsbE1vdXNlT3V0KGV2ZW50IDogYW55KSB7IG1lLm9uQ2VsbE1vdXNlT3V0LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGNlbGxNb3VzZU92ZXIoZXZlbnQgOiBhbnkpIHsgbWUub25DZWxsTW91c2VPdmVyLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGNvbGxhcHNlTm9kZShldmVudCA6IGFueSkgeyBtZS5vbkNvbGxhcHNlTm9kZS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBkZXN0cm95KGV2ZW50IDogYW55KSB7IG1lLm9uRGVzdHJveS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBleHBhbmROb2RlKGV2ZW50IDogYW55KSB7IG1lLm9uRXhwYW5kTm9kZS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBleHBvcnQoZXZlbnQgOiBhbnkpIHsgbWUub25FeHBvcnQuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgZmluaXNoQ2VsbEVkaXQoZXZlbnQgOiBhbnkpIHsgbWUub25GaW5pc2hDZWxsRWRpdC5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBmb2N1c0luKGV2ZW50IDogYW55KSB7IG1lLm9uRm9jdXNJbi5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBmb2N1c091dChldmVudCA6IGFueSkgeyBtZS5vbkZvY3VzT3V0LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGhpZGUoZXZlbnQgOiBhbnkpIHsgbWUub25IaWRlLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIG1vdXNlT3V0KGV2ZW50IDogYW55KSB7IG1lLm9uTW91c2VPdXQuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgbW91c2VPdmVyKGV2ZW50IDogYW55KSB7IG1lLm9uTW91c2VPdmVyLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIHBhaW50KGV2ZW50IDogYW55KSB7IG1lLm9uUGFpbnQuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgcmVhZE9ubHkoZXZlbnQgOiBhbnkpIHsgbWUub25SZWFkT25seS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICByZW5kZXJSb3dzKGV2ZW50IDogYW55KSB7IG1lLm9uUmVuZGVyUm93cy5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICByZXNpemUoZXZlbnQgOiBhbnkpIHsgbWUub25SZXNpemUuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgcmVzcG9uc2l2ZShldmVudCA6IGFueSkgeyBtZS5vblJlc3BvbnNpdmUuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgc2Nyb2xsKGV2ZW50IDogYW55KSB7IG1lLm9uU2Nyb2xsLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIHNlbGVjdGlvbkNoYW5nZShldmVudCA6IGFueSkgeyBtZS5vblNlbGVjdGlvbkNoYW5nZS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBzaG93KGV2ZW50IDogYW55KSB7IG1lLm9uU2hvdy5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBzdGFydENlbGxFZGl0KGV2ZW50IDogYW55KSB7IG1lLm9uU3RhcnRDZWxsRWRpdC5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICB0b2dnbGVOb2RlKGV2ZW50IDogYW55KSB7IG1lLm9uVG9nZ2xlTm9kZS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICB0b29sQ2xpY2soZXZlbnQgOiBhbnkpIHsgbWUub25Ub29sQ2xpY2suZW1pdChldmVudCk7IH0sXG5cbiAgICAgICAgICAgICAgICB0aGlzT2JqIDogbWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gSWYgY29tcG9uZW50IGhhcyBubyBjb250YWluZXIgc3BlY2lmaWVkIGluIGNvbmZpZyB0aGVuIHVzZSBhZG9wdCB0byBXcmFwcGVyJ3MgZWxlbWVudFxuICAgICAgICBjb25zdFxuICAgICAgICAgICAgY29udGFpbmVyUGFyYW0gPSBbXG4gICAgICAgICAgICAgICAgJ2Fkb3B0JyxcbiAgICAgICAgICAgICAgICAnYXBwZW5kVG8nLFxuICAgICAgICAgICAgICAgICdpbnNlcnRBZnRlcicsXG4gICAgICAgICAgICAgICAgJ2luc2VydEJlZm9yZSdcbiAgICAgICAgICAgIF0uZmluZChwcm9wID0+IGJyeW50dW1Db25maWdbcHJvcF0pO1xuICAgICAgICBpZiAoIWNvbnRhaW5lclBhcmFtKSB7XG4gICAgICAgICAgICBicnludHVtQ29uZmlnLmFkb3B0ID0gZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgV3JhcHBlckhlbHBlci5kZXZXYXJuaW5nQ29udGFpbmVyKGluc3RhbmNlQ2xhc3MuJG5hbWUsIGNvbnRhaW5lclBhcmFtKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJyeW50dW1Db25maWdzLmZpbHRlcihwcm9wID0+IHByb3AgaW4gdGhpcykuZm9yRWFjaChwcm9wID0+IHtcbiAgICAgICAgICAgIFdyYXBwZXJIZWxwZXIuYXBwbHlQcm9wVmFsdWUoYnJ5bnR1bUNvbmZpZywgcHJvcCwgdGhpc1twcm9wXSk7XG4gICAgICAgICAgICBpZiAoWydmZWF0dXJlcycsICdjb25maWcnXS5pbmNsdWRlcyhwcm9wKSkge1xuICAgICAgICAgICAgICAgIFdyYXBwZXJIZWxwZXIuZGV2V2FybmluZ0NvbmZpZ1Byb3AoaW5zdGFuY2VDbGFzcy4kbmFtZSwgcHJvcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgbWUuaW5zdGFuY2UgPSBpbnN0YW5jZUNsYXNzLiRuYW1lID09PSAnV2lkZ2V0JyA/IFdpZGdldEhlbHBlci5jcmVhdGVXaWRnZXQoYnJ5bnR1bUNvbmZpZykgOiBuZXcgaW5zdGFuY2VDbGFzcyhicnludHVtQ29uZmlnKTtcblxuICAgICAgICAvLyBCYWNrd2FyZHMgY29tcGF0aWJpbGl0eSBmb3IgZ3JpZEluc3RhbmNlLCBzY2hlZHVsZXJJbnN0YW5jZSBldGMuXG4gICAgICAgIG1lW1N0cmluZ0hlbHBlci51bmNhcGl0YWxpemUoaW5zdGFuY2VDbGFzcy4kbmFtZSkgKyAnSW5zdGFuY2UnXSA9IG1lLmluc3RhbmNlO1xuICAgICAgICAvLyBcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBXYXRjaCBmb3IgY2hhbmdlc1xuICAgICAqIEBwYXJhbSBjaGFuZ2VzXG4gICAgICovXG4gICAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgICAgICBjb25zdFxuICAgICAgICAgICAgeyBpbnN0YW5jZSB9ID0gdGhpcyxcbiAgICAgICAgICAgIHsgaW5zdGFuY2VDbGFzcyB9ID0gQnJ5bnR1bUdyaWRCYXNlQ29tcG9uZW50O1xuXG4gICAgICAgIGlmICghaW5zdGFuY2UpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEl0ZXJhdGUgb3ZlciBhbGwgY2hhbmdlc1xuICAgICAgICBPYmplY3QuZW50cmllcyhjaGFuZ2VzKS5mb3JFYWNoKChbcHJvcCwgY2hhbmdlXSkgPT4ge1xuICAgICAgICAgICAgY29uc3RcbiAgICAgICAgICAgICAgICBuZXdWYWx1ZSA9IChjaGFuZ2UgYXMgU2ltcGxlQ2hhbmdlKS5jdXJyZW50VmFsdWUsXG4gICAgICAgICAgICAgICAgeyBpbnN0YW5jZSB9ID0gdGhpcyxcbiAgICAgICAgICAgICAgICB7IGJyeW50dW1Db25maWdzT25seSwgYnJ5bnR1bVByb3BzIH0gPSBCcnludHVtR3JpZEJhc2VDb21wb25lbnQ7XG4gICAgICAgICAgICBpZiAoYnJ5bnR1bVByb3BzLmluY2x1ZGVzKHByb3ApKSB7XG4gICAgICAgICAgICAgICAgV3JhcHBlckhlbHBlci5hcHBseVByb3BWYWx1ZShpbnN0YW5jZSwgcHJvcCwgbmV3VmFsdWUsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICBpZiAoYnJ5bnR1bUNvbmZpZ3NPbmx5LmluY2x1ZGVzKHByb3ApKSB7XG4gICAgICAgICAgICAgICAgICAgIFdyYXBwZXJIZWxwZXIuZGV2V2FybmluZ1VwZGF0ZVByb3AoaW5zdGFuY2VDbGFzcy4kbmFtZSwgcHJvcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZXN0cm95IHRoZSBjb21wb25lbnRcbiAgICAgKi9cbiAgICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaW5zdGFuY2UpIHtcbiAgICAgICAgICAgIHRoaXMuaW5zdGFuY2UuZGVzdHJveSgpO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19