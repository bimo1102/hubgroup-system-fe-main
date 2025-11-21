/**
 * Angular wrapper for Bryntum GridBase
 */
import * as tslib_1 from "tslib";
import { Component, ElementRef, EventEmitter, Output, Input } from '@angular/core';
import WrapperHelper from './wrapper.helper';
// Bryntum 'scheduler.lite.umd' bundle comes without polyfills to support Angular's zone.js
import { Base, Model, Scroller, Widget } from '@bryntum/scheduler/scheduler.lite.umd.js';
import { GridBase, StringHelper, WidgetHelper } from '@bryntum/scheduler/scheduler.lite.umd.js';
var BryntumGridBaseComponent = /** @class */ (function () {
    function BryntumGridBaseComponent(element) {
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
    BryntumGridBaseComponent.prototype.ngOnInit = function () {
        var _this = this;
        var me = this, elementRef = me.elementRef, bryntumConfig = me.bryntumConfig, instanceClass = BryntumGridBaseComponent.instanceClass, bryntumConfigs = BryntumGridBaseComponent.bryntumConfigs;
        Object.assign(bryntumConfig, {
            listeners: {
                beforeCellEditStart: function (event) { me.onBeforeCellEditStart.emit(event); },
                beforeDestroy: function (event) { me.onBeforeDestroy.emit(event); },
                beforeExport: function (event) { me.onBeforeExport.emit(event); },
                beforeFinishCellEdit: function (event) { me.onBeforeFinishCellEdit.emit(event); },
                beforeHide: function (event) { me.onBeforeHide.emit(event); },
                beforeRenderRows: function (event) { me.onBeforeRenderRows.emit(event); },
                beforeSetRecord: function (event) { me.onBeforeSetRecord.emit(event); },
                beforeShow: function (event) { me.onBeforeShow.emit(event); },
                beforeToggleNode: function (event) { me.onBeforeToggleNode.emit(event); },
                cancelCellEdit: function (event) { me.onCancelCellEdit.emit(event); },
                catchAll: function (event) { me.onCatchAll.emit(event); },
                cellClick: function (event) { me.onCellClick.emit(event); },
                cellContextMenu: function (event) { me.onCellContextMenu.emit(event); },
                cellDblClick: function (event) { me.onCellDblClick.emit(event); },
                cellMouseOut: function (event) { me.onCellMouseOut.emit(event); },
                cellMouseOver: function (event) { me.onCellMouseOver.emit(event); },
                collapseNode: function (event) { me.onCollapseNode.emit(event); },
                destroy: function (event) { me.onDestroy.emit(event); },
                expandNode: function (event) { me.onExpandNode.emit(event); },
                export: function (event) { me.onExport.emit(event); },
                finishCellEdit: function (event) { me.onFinishCellEdit.emit(event); },
                focusIn: function (event) { me.onFocusIn.emit(event); },
                focusOut: function (event) { me.onFocusOut.emit(event); },
                hide: function (event) { me.onHide.emit(event); },
                mouseOut: function (event) { me.onMouseOut.emit(event); },
                mouseOver: function (event) { me.onMouseOver.emit(event); },
                paint: function (event) { me.onPaint.emit(event); },
                readOnly: function (event) { me.onReadOnly.emit(event); },
                renderRows: function (event) { me.onRenderRows.emit(event); },
                resize: function (event) { me.onResize.emit(event); },
                responsive: function (event) { me.onResponsive.emit(event); },
                scroll: function (event) { me.onScroll.emit(event); },
                selectionChange: function (event) { me.onSelectionChange.emit(event); },
                show: function (event) { me.onShow.emit(event); },
                startCellEdit: function (event) { me.onStartCellEdit.emit(event); },
                toggleNode: function (event) { me.onToggleNode.emit(event); },
                toolClick: function (event) { me.onToolClick.emit(event); },
                thisObj: me
            }
        });
        // If component has no container specified in config then use adopt to Wrapper's element
        var containerParam = [
            'adopt',
            'appendTo',
            'insertAfter',
            'insertBefore'
        ].find(function (prop) { return bryntumConfig[prop]; });
        if (!containerParam) {
            bryntumConfig.adopt = elementRef.nativeElement;
        }
        else {
            WrapperHelper.devWarningContainer(instanceClass.$name, containerParam);
        }
        bryntumConfigs.filter(function (prop) { return prop in _this; }).forEach(function (prop) {
            WrapperHelper.applyPropValue(bryntumConfig, prop, _this[prop]);
            if (['features', 'config'].includes(prop)) {
                WrapperHelper.devWarningConfigProp(instanceClass.$name, prop);
            }
        });
        // @ts-ignore
        me.instance = instanceClass.$name === 'Widget' ? WidgetHelper.createWidget(bryntumConfig) : new instanceClass(bryntumConfig);
        // Backwards compatibility for gridInstance, schedulerInstance etc.
        me[StringHelper.uncapitalize(instanceClass.$name) + 'Instance'] = me.instance;
        // 
    };
    /**
     * Watch for changes
     * @param changes
     */
    BryntumGridBaseComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        var instance = this.instance, instanceClass = BryntumGridBaseComponent.instanceClass;
        if (!instance) {
            return;
        }
        // Iterate over all changes
        Object.entries(changes).forEach(function (_a) {
            var _b = tslib_1.__read(_a, 2), prop = _b[0], change = _b[1];
            var newValue = change.currentValue, instance = _this.instance, bryntumConfigsOnly = BryntumGridBaseComponent.bryntumConfigsOnly, bryntumProps = BryntumGridBaseComponent.bryntumProps;
            if (bryntumProps.includes(prop)) {
                WrapperHelper.applyPropValue(instance, prop, newValue, false);
                if (bryntumConfigsOnly.includes(prop)) {
                    WrapperHelper.devWarningUpdateProp(instanceClass.$name, prop);
                }
            }
        });
    };
    /**
     * Destroy the component
     */
    BryntumGridBaseComponent.prototype.ngOnDestroy = function () {
        if (this.instance) {
            this.instance.destroy();
        }
    };
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
    BryntumGridBaseComponent.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
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
    return BryntumGridBaseComponent;
}());
export { BryntumGridBaseComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJ5bnR1bS1ncmlkLWJhc2UuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGJyeW50dW0vc2NoZWR1bGVyLWFuZ3VsYXIvIiwic291cmNlcyI6WyJsaWIvYnJ5bnR1bS1ncmlkLWJhc2UuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztHQUVHOztBQUVILE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBcUIsTUFBTSxFQUFFLEtBQUssRUFBK0IsTUFBTSxlQUFlLENBQUM7QUFDbkksT0FBTyxhQUFhLE1BQU0sa0JBQWtCLENBQUM7QUFFN0MsMkZBQTJGO0FBQzNGLE9BQU8sRUFBRSxJQUFJLEVBQXNtQixLQUFLLEVBQTRMLFFBQVEsRUFBc0osTUFBTSxFQUFnQixNQUFNLDBDQUEwQyxDQUFDO0FBQ3poQyxPQUFPLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQUVoRztJQWlTSSxrQ0FBWSxPQUFtQjtRQVB2QixrQkFBYSxHQUFHO1lBQ3BCLGdCQUFnQixFQUFHLElBQUk7WUFDdkIsS0FBSyxFQUFjLFNBQVM7WUFDNUIsU0FBUyxFQUFVLEVBQUU7WUFDckIsUUFBUSxFQUFXLEVBQUU7U0FDeEIsQ0FBQztRQXFJRCxTQUFTO1FBQ0EsMEJBQXFCLEdBQUksSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUNwRCxvQkFBZSxHQUFVLElBQUksWUFBWSxFQUFVLENBQUM7UUFDcEQsbUJBQWMsR0FBVyxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQ3BELDJCQUFzQixHQUFHLElBQUksWUFBWSxFQUFVLENBQUM7UUFDcEQsaUJBQVksR0FBYSxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQ3BELHVCQUFrQixHQUFPLElBQUksWUFBWSxFQUFVLENBQUM7UUFDcEQsc0JBQWlCLEdBQVEsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUNwRCxpQkFBWSxHQUFhLElBQUksWUFBWSxFQUFVLENB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Q0FDTixNQUFNOytCQUNOLE1BQU07OEJBQ04sTUFBTTtrQ0FHTixLQUFLO2tDQUNMLEtBQUs7cUNBQ0wsS0FBSzt5Q0FDTCxLQUFLOzJDQUNMLEtBQUs7c0NBQ0wsS0FBSzt1Q0FDTCxLQUFLO3NDQUNMLEtBQUs7cUNBQ0wsS0FBSzt1Q0FDTCxLQUFLO2dDQUNMLEtBQUs7bUNBQ0wsS0FBSzsrQkFDTCxLQUFLO3NDQUNMLEtBQUs7b0NBQ0wsS0FBSzttQ0FDTCxLQUFLO21DQUNMLEtBQUs7c0NBQ0wsS0FBSztzQ0FDTCxLQUFLO29DQUNMLEtBQUs7Z0NBQ0wsS0FBSzs4QkFDTCxLQUFLO3FDQUNMLEtBQUs7Z0NBQ0wsS0FBSztpQ0FDTCxLQUFLOzhCQUNMLEtBQUs7O0lBK0hWLCtCQUFDO0NBQUEsQUFwbUJELElBb21CQztTQWhtQlksd0JBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBBbmd1bGFyIHdyYXBwZXIgZm9yIEJyeW50dW0gR3JpZEJhc2VcbiAqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgT25EZXN0cm95LCBPbkluaXQsIE91dHB1dCwgSW5wdXQsIFNpbXBsZUNoYW5nZSwgU2ltcGxlQ2hhbmdlcyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IFdyYXBwZXJIZWxwZXIgZnJvbSAnLi93cmFwcGVyLmhlbHBlcic7XG5cbi8vIEJyeW50dW0gJ3NjaGVkdWxlci5saXRlLnVtZCcgYnVuZGxlIGNvbWVzIHdpdGhvdXQgcG9seWZpbGxzIHRvIHN1cHBvcnQgQW5ndWxhcidzIHpvbmUuanNcbmltcG9ydCB7IEJhc2UsIENlbGxFZGl0LCBDZWxsRWRpdENvbmZpZywgQ2VsbE1lbnUsIENlbGxNZW51Q29uZmlnLCBDZWxsVG9vbHRpcCwgQ2VsbFRvb2x0aXBDb25maWcsIENvbHVtbkF1dG9XaWR0aCwgQ29sdW1uQXV0b1dpZHRoQ29uZmlnLCBDb2x1bW5EcmFnVG9vbGJhciwgQ29sdW1uRHJhZ1Rvb2xiYXJDb25maWcsIENvbHVtblBpY2tlciwgQ29sdW1uUGlja2VyQ29uZmlnLCBDb2x1bW5SZW9yZGVyLCBDb2x1bW5SZW9yZGVyQ29uZmlnLCBDb2x1bW5SZXNpemUsIENvbHVtblJlc2l6ZUNvbmZpZywgQ29udGV4dE1lbnUsIENvbnRleHRNZW51Q29uZmlnLCBGaWx0ZXIsIEZpbHRlckJhciwgRmlsdGVyQmFyQ29uZmlnLCBGaWx0ZXJDb25maWcsIEdyaWRCYXNlRmVhdHVyZXNDb25maWdUeXBlLCBHcmlkRXhjZWxFeHBvcnRlciwgR3JpZEV4Y2VsRXhwb3J0ZXJDb25maWcsIEdyaWRHcm91cFN1bW1hcnksIEdyaWRHcm91cFN1bW1hcnlDb25maWcsIEdyaWRQZGZFeHBvcnQsIEdyaWRQZGZFeHBvcnRDb25maWcsIEdyaWRTdW1tYXJ5LCBHcmlkU3VtbWFyeUNvbmZpZywgR3JvdXAsIEdyb3VwQ29uZmlnLCBIZWFkZXJNZW51LCBIZWFkZXJNZW51Q29uZmlnLCBMYXlvdXQsIE1hc2ssIE1hc2tDb25maWcsIE1vZGVsLCBQYW5lbEhlYWRlciwgUXVpY2tGaW5kLCBRdWlja0ZpbmRDb25maWcsIFJlY3RhbmdsZSwgUmVnaW9uUmVzaXplLCBSZWdpb25SZXNpemVDb25maWcsIFJvd0NvcHlQYXN0ZSwgUm93Q29weVBhc3RlQ29uZmlnLCBSb3dSZW9yZGVyLCBSb3dSZW9yZGVyQ29uZmlnLCBTY3JvbGxNYW5hZ2VyLCBTY3JvbGxNYW5hZ2VyQ29uZmlnLCBTY3JvbGxlciwgU2Nyb2xsZXJDb25maWcsIFNlYXJjaCwgU2VhcmNoQ29uZmlnLCBTb3J0LCBTb3J0Q29uZmlnLCBTdGlja3lDZWxscywgU3RpY2t5Q2VsbHNDb25maWcsIFN0b3JlLCBTdG9yZUNvbmZpZywgU3RyaXBlLCBTdHJpcGVDb25maWcsIFRyZWUsIFRyZWVDb25maWcsIFdpZGdldCwgV2lkZ2V0Q29uZmlnIH0gZnJvbSAnQGJyeW50dW0vc2NoZWR1bGVyL3NjaGVkdWxlci5saXRlLnVtZC5qcyc7XG5pbXBvcnQgeyBHcmlkQmFzZSwgU3RyaW5nSGVscGVyLCBXaWRnZXRIZWxwZXIgfSBmcm9tICdAYnJ5bnR1bS9zY2hlZHVsZXIvc2NoZWR1bGVyLmxpdGUudW1kLmpzJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3IgOiAnYnJ5bnR1bS1ncmlkLWJhc2UnLFxuICAgIHRlbXBsYXRlIDogJydcbn0pXG5leHBvcnQgY2xhc3MgQnJ5bnR1bUdyaWRCYXNlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuXG4gICAgcHVibGljIHN0YXRpYyBpbnN0YW5jZUNsYXNzID0gR3JpZEJhc2U7XG5cbiAgICBwcml2YXRlIHN0YXRpYyBicnludHVtRmVhdHVyZU5hbWVzOiBzdHJpbmdbXSA9IFtcbiAgICAgICAgJ2NlbGxFZGl0RmVhdHVyZScsXG4gICAgICAgICdjZWxsTWVudUZlYXR1cmUnLFxuICAgICAgICAnY2VsbFRvb2x0aXBGZWF0dXJlJyxcbiAgICAgICAgJ2NvbHVtbkF1dG9XaWR0aEZlYXR1cmUnLFxuICAgICAgICAnY29sdW1uRHJhZ1Rvb2xiYXJGZWF0dXJlJyxcbiAgICAgICAgJ2NvbHVtblBpY2tlckZlYXR1cmUnLFxuICAgICAgICAnY29sdW1uUmVvcmRlckZlYXR1cmUnLFxuICAgICAgICAnY29sdW1uUmVzaXplRmVhdHVyZScsXG4gICAgICAgICdjb250ZXh0TWVudUZlYXR1cmUnLFxuICAgICAgICAnZXhjZWxFeHBvcnRlckZlYXR1cmUnLFxuICAgICAgICAnZmlsdGVyRmVhdHVyZScsXG4gICAgICAgICdmaWx0ZXJCYXJGZWF0dXJlJyxcbiAgICAgICAgJ2dyb3VwRmVhdHVyZScsXG4gICAgICAgICdncm91cFN1bW1hcnlGZWF0dXJlJyxcbiAgICAgICAgJ2hlYWRlck1lbnVGZWF0dXJlJyxcbiAgICAgICAgJ3BkZkV4cG9ydEZlYXR1cmUnLFxuICAgICAgICAncXVpY2tGaW5kRmVhdHVyZScsXG4gICAgICAgICdyZWdpb25SZXNpemVGZWF0dXJlJyxcbiAgICAgICAgJ3Jvd0NvcHlQYXN0ZUZlYXR1cmUnLFxuICAgICAgICAncm93UmVvcmRlckZlYXR1cmUnLFxuICAgICAgICAnc2VhcmNoRmVhdHVyZScsXG4gICAgICAgICdzb3J0RmVhdHVyZScsXG4gICAgICAgICdzdGlja3lDZWxsc0ZlYXR1cmUnLFxuICAgICAgICAnc3RyaXBlRmVhdHVyZScsXG4gICAgICAgICdzdW1tYXJ5RmVhdHVyZScsXG4gICAgICAgICd0cmVlRmVhdHVyZSdcbiAgICBdO1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bUNvbmZpZ3M6IHN0cmluZ1tdID0gQnJ5bnR1bUdyaWRCYXNlQ29tcG9uZW50LmJyeW50dW1GZWF0dXJlTmFtZXMuY29uY2F0KFtcbiAgICAgICAgJ2Fkb3B0JyxcbiAgICAgICAgJ2FsaWduJyxcbiAgICAgICAgJ2FsaWduU2VsZicsXG4gICAgICAgICdhbmNob3InLFxuICAgICAgICAnYW5pbWF0ZVJlbW92aW5nUm93cycsXG4gICAgICAgICdhcHBlbmRUbycsXG4gICAgICAgICdhdXRvSGVpZ2h0JyxcbiAgICAgICAgJ2JiYXInLFxuICAgICAgICAnYm9keUNscycsXG4gICAgICAgICdidWJibGVFdmVudHMnLFxuICAgICAgICAnY2VudGVyZWQnLFxuICAgICAgICAnY2xzJyxcbiAgICAgICAgJ2NvbHVtbkxpbmVzJyxcbiAgICAgICAgJ2NvbHVtbnMnLFxuICAgICAgICAnY29uZmlnJyxcbiAgICAgICAgJ2NvbnN0cmFpblRvJyxcbiAgICAgICAgJ2NvbnRlbnQnLFxuICAgICAgICAnY29udGVudEVsZW1lbnRDbHMnLFxuICAgICAgICAnY29udGV4dE1lbnVUcmlnZ2VyRXZlbnQnLFxuICAgICAgICAnZGF0YScsXG4gICAgICAgICdkYXRhc2V0JyxcbiAgICAgICAgJ2RlZmF1bHRCaW5kUHJvcGVydHknLFxuICAgICAgICAnZGVmYXVsdFJlZ2lvbicsXG4gICAgICAgICdkZWZhdWx0cycsXG4gICAgICAgICdkZXN0cm95U3RvcmUnLFxuICAgICAgICAnZGlzYWJsZWQnLFxuICAgICAgICAnZGlzYWJsZUdyaWRSb3dNb2RlbFdhcm5pbmcnLFxuICAgICAgICAnZG9jaycsXG4gICAgICAgICdkcmFnZ2FibGUnLFxuICAgICAgICAnZW1wdHlUZXh0JyxcbiAgICAgICAgJ2VuYWJsZVN0aWNreScsXG4gICAgICAgICdlbmFibGVUZXh0U2VsZWN0aW9uJyxcbiAgICAgICAgJ2VuYWJsZVVuZG9SZWRvS2V5cycsXG4gICAgICAgICdleHRyYURhdGEnLFxuICAgICAgICAnZmVhdHVyZXMnLFxuICAgICAgICAnZmlsbExhc3RDb2x1bW4nLFxuICAgICAgICAnZml4ZWRSb3dIZWlnaHQnLFxuICAgICAgICAnZmxleCcsXG4gICAgICAgICdmbG9hdGluZycsXG4gICAgICAgICdmb290ZXInLFxuICAgICAgICAnZnVsbFJvd1JlZnJlc2gnLFxuICAgICAgICAnZ2V0Um93SGVpZ2h0JyxcbiAgICAgICAgJ2hlYWRlcicsXG4gICAgICAgICdoZWlnaHQnLFxuICAgICAgICAnaGlkZGVuJyxcbiAgICAgICAgJ2hpZGVBbmltYXRpb24nLFxuICAgICAgICAnaGlkZUhlYWRlcnMnLFxuICAgICAgICAnaGlkZVdoZW5FbXB0eScsXG4gICAgICAgICdodG1sJyxcbiAgICAgICAgJ2h0bWxDbHMnLFxuICAgICAgICAnaWQnLFxuICAgICAgICAnaW5zZXJ0QmVmb3JlJyxcbiAgICAgICAgJ2luc2VydEZpcnN0JyxcbiAgICAgICAgJ2l0ZW1DbHMnLFxuICAgICAgICAnaXRlbXMnLFxuICAgICAgICAnbGF5b3V0JyxcbiAgICAgICAgJ2xheW91dFN0eWxlJyxcbiAgICAgICAgJ2xhenlJdGVtcycsXG4gICAgICAgICdsaXN0ZW5lcnMnLFxuICAgICAgICAnbG9hZE1hc2snLFxuICAgICAgICAnbG9hZE1hc2tEZWZhdWx0cycsXG4gICAgICAgICdsb2FkTWFza0Vycm9yJyxcbiAgICAgICAgJ2xvY2FsZUNsYXNzJyxcbiAgICAgICAgJ2xvY2FsaXphYmxlUHJvcGVydGllcycsXG4gICAgICAgICdsb25nUHJlc3NUaW1lJyxcbiAgICAgICAgJ21hcmdpbicsXG4gICAgICAgICdtYXNrRGVmYXVsdHMnLFxuICAgICAgICAnbWFza2VkJyxcbiAgICAgICAgJ21heEhlaWdodCcsXG4gICAgICAgICdtYXhXaWR0aCcsXG4gICAgICAgICdtaW5IZWlnaHQnLFxuICAgICAgICAnbWluV2lkdGgnLFxuICAgICAgICAnbW9uaXRvclJlc2l6ZScsXG4gICAgICAgICduYW1lZEl0ZW1zJyxcbiAgICAgICAgJ293bmVyJyxcbiAgICAgICAgJ3BsdWdpbnMnLFxuICAgICAgICAncG9zaXRpb25lZCcsXG4gICAgICAgICdwcmVzZXJ2ZUZvY3VzT25EYXRhc2V0Q2hhbmdlJyxcbiAgICAgICAgJ3ByZXNlcnZlU2Nyb2xsT25EYXRhc2V0Q2hhbmdlJyxcbiAgICAgICAgJ3ByZXZlbnRUb29sdGlwT25Ub3VjaCcsXG4gICAgICAgICdyZWFkT25seScsXG4gICAgICAgICdyZXNpemVUb0ZpdEluY2x1ZGVzSGVhZGVyJyxcbiAgICAgICAgJ3Jlc3BvbnNpdmVMZXZlbHMnLFxuICAgICAgICAncmlwcGxlJyxcbiAgICAgICAgJ3Jvb3RFbGVtZW50JyxcbiAgICAgICAgJ3Jvd0hlaWdodCcsXG4gICAgICAgICdzY3JvbGxhYmxlJyxcbiAgICAgICAgJ3Njcm9sbEFjdGlvbicsXG4gICAgICAgICdzY3JvbGxlckNsYXNzJyxcbiAgICAgICAgJ3Njcm9sbE1hbmFnZXInLFxuICAgICAgICAnc2VsZWN0aW9uTW9kZScsXG4gICAgICAgICdzaG93QW5pbWF0aW9uJyxcbiAgICAgICAgJ3Nob3dEaXJ0eScsXG4gICAgICAgICdzaG93UmVtb3ZlUm93SW5Db250ZXh0TWVudScsXG4gICAgICAgICdzdG9yZScsXG4gICAgICAgICdzdHJpcHMnLFxuICAgICAgICAnc3ViR3JpZENvbmZpZ3MnLFxuICAgICAgICAnc3luY01hc2snLFxuICAgICAgICAndGFiJyxcbiAgICAgICAgJ3RhZycsXG4gICAgICAgICd0YmFyJyxcbiAgICAgICAgJ3RleHRBbGlnbicsXG4gICAgICAgICd0ZXh0Q29udGVudCcsXG4gICAgICAgICd0aXRsZScsXG4gICAgICAgICd0b29scycsXG4gICAgICAgICd0b29sdGlwJyxcbiAgICAgICAgJ3RyYW5zaXRpb25EdXJhdGlvbicsXG4gICAgICAgICd0cmFwRm9jdXMnLFxuICAgICAgICAnd2VpZ2h0JyxcbiAgICAgICAgJ3dpZHRoJyxcbiAgICAgICAgJ3gnLFxuICAgICAgICAneSdcbiAgICBdKTtcblxuICAgIHByaXZhdGUgc3RhdGljIGJyeW50dW1Db25maWdzT25seTogc3RyaW5nW10gPSBbXG4gICAgICAgICdhZG9wdCcsXG4gICAgICAgICdhbGlnbicsXG4gICAgICAgICdhbmNob3InLFxuICAgICAgICAnYW5pbWF0ZVJlbW92aW5nUm93cycsXG4gICAgICAgICdhcHBlbmRUbycsXG4gICAgICAgICdhdXRvSGVpZ2h0JyxcbiAgICAgICAgJ2JiYXInLFxuICAgICAgICAnYm9keUNscycsXG4gICAgICAgICdidWJibGVFdmVudHMnLFxuICAgICAgICAnY2VudGVyZWQnLFxuICAgICAgICAnY2xzJyxcbiAgICAgICAgJ2NvbHVtbnMnLFxuICAgICAgICAnY29uZmlnJyxcbiAgICAgICAgJ2NvbnN0cmFpblRvJyxcbiAgICAgICAgJ2NvbnRlbnRFbGVtZW50Q2xzJyxcbiAgICAgICAgJ2NvbnRleHRNZW51VHJpZ2dlckV2ZW50JyxcbiAgICAgICAgJ2RlZmF1bHRCaW5kUHJvcGVydHknLFxuICAgICAgICAnZGVmYXVsdFJlZ2lvbicsXG4gICAgICAgICdkZWZhdWx0cycsXG4gICAgICAgICdkZXN0cm95U3RvcmUnLFxuICAgICAgICAnZGlzYWJsZUdyaWRSb3dNb2RlbFdhcm5pbmcnLFxuICAgICAgICAnZG9jaycsXG4gICAgICAgICdkcmFnZ2FibGUnLFxuICAgICAgICAnZW1wdHlUZXh0JyxcbiAgICAgICAgJ2VuYWJsZVN0aWNreScsXG4gICAgICAgICdlbmFibGVUZXh0U2VsZWN0aW9uJyxcbiAgICAgICAgJ2VuYWJsZVVuZG9SZWRvS2V5cycsXG4gICAgICAgICdmZWF0dXJlcycsXG4gICAgICAgICdmaWxsTGFzdENvbHVtbicsXG4gICAgICAgICdmaXhlZFJvd0hlaWdodCcsXG4gICAgICAgICdmbG9hdGluZycsXG4gICAgICAgICdmb290ZXInLFxuICAgICAgICAnZnVsbFJvd1JlZnJlc2gnLFxuICAgICAgICAnZ2V0Um93SGVpZ2h0JyxcbiAgICAgICAgJ2hlYWRlcicsXG4gICAgICAgICdoaWRlQW5pbWF0aW9uJyxcbiAgICAgICAgJ2hpZGVIZWFkZXJzJyxcbiAgICAgICAgJ2hpZGVXaGVuRW1wdHknLFxuICAgICAgICAnaHRtbENscycsXG4gICAgICAgICdpbnNlcnRCZWZvcmUnLFxuICAgICAgICAnaW5zZXJ0Rmlyc3QnLFxuICAgICAgICAnaXRlbUNscycsXG4gICAgICAgICdsYXp5SXRlbXMnLFxuICAgICAgICAnbGlzdGVuZXJzJyxcbiAgICAgICAgJ2xvYWRNYXNrJyxcbiAgICAgICAgJ2xvYWRNYXNrRGVmYXVsdHMnLFxuICAgICAgICAnbG9hZE1hc2tFcnJvcicsXG4gICAgICAgICdsb2NhbGVDbGFzcycsXG4gICAgICAgICdsb2NhbGl6YWJsZVByb3BlcnRpZXMnLFxuICAgICAgICAnbG9uZ1ByZXNzVGltZScsXG4gICAgICAgICdtYXNrRGVmYXVsdHMnLFxuICAgICAgICAnbWFza2VkJyxcbiAgICAgICAgJ21vbml0b3JSZXNpemUnLFxuICAgICAgICAnbmFtZWRJdGVtcycsXG4gICAgICAgICdvd25lcicsXG4gICAgICAgICdwbHVnaW5zJyxcbiAgICAgICAgJ3Bvc2l0aW9uZWQnLFxuICAgICAgICAncHJlc2VydmVGb2N1c09uRGF0YXNldENoYW5nZScsXG4gICAgICAgICdwcmVzZXJ2ZVNjcm9sbE9uRGF0YXNldENoYW5nZScsXG4gICAgICAgICdwcmV2ZW50VG9vbHRpcE9uVG91Y2gnLFxuICAgICAgICAncmVzaXplVG9GaXRJbmNsdWRlc0hlYWRlcicsXG4gICAgICAgICdyZXNwb25zaXZlTGV2ZWxzJyxcbiAgICAgICAgJ3JpcHBsZScsXG4gICAgICAgICdyb290RWxlbWVudCcsXG4gICAgICAgICdzY3JvbGxBY3Rpb24nLFxuICAgICAgICAnc2Nyb2xsZXJDbGFzcycsXG4gICAgICAgICdzY3JvbGxNYW5hZ2VyJyxcbiAgICAgICAgJ3NlbGVjdGlvbk1vZGUnLFxuICAgICAgICAnc2hvd0FuaW1hdGlvbicsXG4gICAgICAgICdzaG93RGlydHknLFxuICAgICAgICAnc2hvd1JlbW92ZVJvd0luQ29udGV4dE1lbnUnLFxuICAgICAgICAnc3RyaXBzJyxcbiAgICAgICAgJ3N1YkdyaWRDb25maWdzJyxcbiAgICAgICAgJ3N5bmNNYXNrJyxcbiAgICAgICAgJ3RhYicsXG4gICAgICAgICd0YWcnLFxuICAgICAgICAndGJhcicsXG4gICAgICAgICd0ZXh0QWxpZ24nLFxuICAgICAgICAndGV4dENvbnRlbnQnLFxuICAgICAgICAndGl0bGUnLFxuICAgICAgICAndHJhcEZvY3VzJyxcbiAgICAgICAgJ3dlaWdodCdcbiAgICBdO1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bVByb3BzOiBzdHJpbmdbXSA9IEJyeW50dW1HcmlkQmFzZUNvbXBvbmVudC5icnludHVtRmVhdHVyZU5hbWVzLmNvbmNhdChbXG4gICAgICAgICdhbGlnblNlbGYnLFxuICAgICAgICAnYW5jaG9yU2l6ZScsXG4gICAgICAgICdjb2x1bW5MaW5lcycsXG4gICAgICAgICdjb250ZW50JyxcbiAgICAgICAgJ2RhdGEnLFxuICAgICAgICAnZGF0YXNldCcsXG4gICAgICAgICdkaXNhYmxlZCcsXG4gICAgICAgICdleHRyYURhdGEnLFxuICAgICAgICAnZmxleCcsXG4gICAgICAgICdoZWlnaHQnLFxuICAgICAgICAnaGlkZGVuJyxcbiAgICAgICAgJ2h0bWwnLFxuICAgICAgICAnaWQnLFxuICAgICAgICAnaXNTZXR0aW5nVmFsdWVzJyxcbiAgICAgICAgJ2lzVmFsaWQnLFxuICAgICAgICAnaXRlbXMnLFxuICAgICAgICAnbGF5b3V0JyxcbiAgICAgICAgJ2xheW91dFN0eWxlJyxcbiAgICAgICAgJ21hcmdpbicsXG4gICAgICAgICdtYXhIZWlnaHQnLFxuICAgICAgICAnbWF4V2lkdGgnLFxuICAgICAgICAnbWluSGVpZ2h0JyxcbiAgICAgICAgJ21pbldpZHRoJyxcbiAgICAgICAgJ3JlYWRPbmx5JyxcbiAgICAgICAgJ3JlY29yZCcsXG4gICAgICAgICdyb3dIZWlnaHQnLFxuICAgICAgICAnc2Nyb2xsYWJsZScsXG4gICAgICAgICdzZWxlY3RlZENlbGwnLFxuICAgICAgICAnc2VsZWN0ZWRSZWNvcmQnLFxuICAgICAgICAnc2VsZWN0ZWRSZWNvcmRzJyxcbiAgICAgICAgJ3N0YXRlJyxcbiAgICAgICAgJ3N0b3JlJyxcbiAgICAgICAgJ3Rvb2xzJyxcbiAgICAgICAgJ3Rvb2x0aXAnLFxuICAgICAgICAndHJhbnNpdGlvbkR1cmF0aW9uJyxcbiAgICAgICAgJ3ZhbHVlcycsXG4gICAgICAgICd3aWR0aCcsXG4gICAgICAgICd4JyxcbiAgICAgICAgJ3knXG4gICAgXSk7XG5cbiAgICBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY7XG4gICAgcHVibGljIGluc3RhbmNlOiBHcmlkQmFzZTtcblxuICAgIHByaXZhdGUgYnJ5bnR1bUNvbmZpZyA9IHtcbiAgICAgICAgYW5ndWxhckNvbXBvbmVudCA6IHRoaXMsXG4gICAgICAgIGFkb3B0ICAgICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgIGxpc3RlbmVycyAgICAgICAgOiB7fSxcbiAgICAgICAgZmVhdHVyZXMgICAgICAgICA6IHt9XG4gICAgfTtcblxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQ6IEVsZW1lbnRSZWYpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50UmVmID0gZWxlbWVudDtcbiAgICB9XG5cbiAgICAgLy8gQ29uZmlncyBvbmx5XG4gICAgQElucHV0KCkgYWRvcHQgICAgICAgICAgICAgICAgICAgICAgICAgOiBIVE1MRWxlbWVudHxzdHJpbmc7XG4gICAgQElucHV0KCkgYWxpZ24gICAgICAgICAgICAgICAgICAgICAgICAgOiBvYmplY3R8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGFuY2hvciAgICAgICAgICAgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBhbmltYXRlUmVtb3ZpbmdSb3dzICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgYXBwZW5kVG8gICAgICAgICAgICAgICAgICAgICAgOiBIVE1MRWxlbWVudHxzdHJpbmc7XG4gICAgQElucHV0KCkgYXV0b0hlaWdodCAgICAgICAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGJiYXIgICAgICAgICAgICAgICAgICAgICAgICAgIDogb2JqZWN0W118b2JqZWN0O1xuICAgIEBJbnB1dCgpIGJvZHlDbHMgICAgICAgICAgICAgICAgICAgICAgIDogc3RyaW5nfG9iamVjdDtcbiAgICBASW5wdXQoKSBidWJibGVFdmVudHMgICAgICAgICAgICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBjZW50ZXJlZCAgICAgICAgICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgY2xzICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBzdHJpbmd8b2JqZWN0O1xuICAgIEBJbnB1dCgpIGNvbHVtbnMgICAgICAgICAgICAgICAgICAgICAgIDogb2JqZWN0W118b2JqZWN0O1xuICAgIEBJbnB1dCgpIGNvbmZpZyAgICAgICAgICAgICAgICAgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIGNvbnN0cmFpblRvICAgICAgICAgICAgICAgICAgIDogSFRNTEVsZW1lbnR8V2lkZ2V0fFJlY3RhbmdsZTtcbiAgICBASW5wdXQoKSBjb250ZW50RWxlbWVudENscyAgICAgICAgICAgICA6IHN0cmluZ3xvYmplY3Q7XG4gICAgQElucHV0KCkgY29udGV4dE1lbnVUcmlnZ2VyRXZlbnQgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgZGVmYXVsdEJpbmRQcm9wZXJ0eSAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgZGVmYXVsdFJlZ2lvbiAgICAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgZGVmYXVsdHMgICAgICAgICAgICAgICAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgZGVzdHJveVN0b3JlICAgICAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGRpc2FibGVHcmlkUm93TW9kZWxXYXJuaW5nICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBkb2NrICAgICAgICAgICAgICAgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBkcmFnZ2FibGUgICAgICAgICAgICAgICAgICAgICA6IGJvb2xlYW58b2JqZWN0O1xuICAgIEBJbnB1dCgpIGVtcHR5VGV4dCAgICAgICAgICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGVuYWJsZVN0aWNreSAgICAgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBlbmFibGVUZXh0U2VsZWN0aW9uICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgZW5hYmxlVW5kb1JlZG9LZXlzICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGZlYXR1cmVzICAgICAgICAgICAgICAgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIGZpbGxMYXN0Q29sdW1uICAgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBmaXhlZFJvd0hlaWdodCAgICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgZmxvYXRpbmcgICAgICAgICAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGZvb3RlciAgICAgICAgICAgICAgICAgICAgICAgIDogb2JqZWN0fHN0cmluZztcbiAgICBASW5wdXQoKSBmdWxsUm93UmVmcmVzaCAgICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgZ2V0Um93SGVpZ2h0ICAgICAgICAgICAgICAgICAgOiBGdW5jdGlvbjtcbiAgICBASW5wdXQoKSBoZWFkZXIgICAgICAgICAgICAgICAgICAgICAgICA6IHN0cmluZ3xQYW5lbEhlYWRlcjtcbiAgICBASW5wdXQoKSBoaWRlQW5pbWF0aW9uICAgICAgICAgICAgICAgICA6IGJvb2xlYW58b2JqZWN0O1xuICAgIEBJbnB1dCgpIGhpZGVIZWFkZXJzICAgICAgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBoaWRlV2hlbkVtcHR5ICAgICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgaHRtbENscyAgICAgICAgICAgICAgICAgICAgICAgOiBzdHJpbmd8b2JqZWN0O1xuICAgIEBJbnB1dCgpIGluc2VydEJlZm9yZSAgICAgICAgICAgICAgICAgIDogSFRNTEVsZW1lbnR8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGluc2VydEZpcnN0ICAgICAgICAgICAgICAgICAgIDogSFRNTEVsZW1lbnR8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGl0ZW1DbHMgICAgICAgICAgICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGxhenlJdGVtcyAgICAgICAgICAgICAgICAgICAgIDogb2JqZWN0fG9iamVjdFtdfFdpZGdldFtdfFBhcnRpYWw8V2lkZ2V0Q29uZmlnPnxQYXJ0aWFsPFdpZGdldENvbmZpZz5bXTtcbiAgICBASW5wdXQoKSBsaXN0ZW5lcnMgICAgICAgICAgICAgICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBsb2FkTWFzayAgICAgICAgICAgICAgICAgICAgICA6IHN0cmluZ3xvYmplY3R8bnVsbDtcbiAgICBASW5wdXQoKSBsb2FkTWFza0RlZmF1bHRzICAgICAgICAgICAgICA6IG9iamVjdHxNYXNrfFBhcnRpYWw8TWFza0NvbmZpZz47XG4gICAgQElucHV0KCkgbG9hZE1hc2tFcnJvciAgICAgICAgICAgICAgICAgOiBvYmplY3R8TWFza3xQYXJ0aWFsPE1hc2tDb25maWc+O1xuICAgIEBJbnB1dCgpIGxvY2FsZUNsYXNzICAgICAgICAgICAgICAgICAgIDogQmFzZTtcbiAgICBASW5wdXQoKSBsb2NhbGl6YWJsZVByb3BlcnRpZXMgICAgICAgICA6IHN0cmluZ1tdO1xuICAgIEBJbnB1dCgpIGxvbmdQcmVzc1RpbWUgICAgICAgICAgICAgICAgIDogbnVtYmVyO1xuICAgIEBJbnB1dCgpIG1hc2tEZWZhdWx0cyAgICAgICAgICAgICAgICAgIDogb2JqZWN0fE1hc2t8UGFydGlhbDxNYXNrQ29uZmlnPjtcbiAgICBASW5wdXQoKSBtYXNrZWQgICAgICAgICAgICAgICAgICAgICAgICA6IGJvb2xlYW58c3RyaW5nfG9iamVjdHxNYXNrfFBhcnRpYWw8TWFza0NvbmZpZz47XG4gICAgQElucHV0KCkgbW9uaXRvclJlc2l6ZSAgICAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIG5hbWVkSXRlbXMgICAgICAgICAgICAgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIG93bmVyICAgICAgICAgICAgICAgICAgICAgICAgIDogV2lkZ2V0O1xuICAgIEBJbnB1dCgpIHBsdWdpbnMgICAgICAgICAgICAgICAgICAgICAgIDogRnVuY3Rpb25bXTtcbiAgICBASW5wdXQoKSBwb3NpdGlvbmVkICAgICAgICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgcHJlc2VydmVGb2N1c09uRGF0YXNldENoYW5nZSAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHByZXNlcnZlU2Nyb2xsT25EYXRhc2V0Q2hhbmdlIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBwcmV2ZW50VG9vbHRpcE9uVG91Y2ggICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgcmVzaXplVG9GaXRJbmNsdWRlc0hlYWRlciAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHJlc3BvbnNpdmVMZXZlbHMgICAgICAgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIHJpcHBsZSAgICAgICAgICAgICAgICAgICAgICAgIDogYm9vbGVhbnxvYmplY3Q7XG4gICAgQElucHV0KCkgcm9vdEVsZW1lbnQgICAgICAgICAgICAgICAgICAgOiBTaGFkb3dSb290O1xuICAgIEBJbnB1dCgpIHNjcm9sbEFjdGlvbiAgICAgICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIHNjcm9sbGVyQ2xhc3MgICAgICAgICAgICAgICAgIDogU2Nyb2xsZXI7XG4gICAgQElucHV0KCkgc2Nyb2xsTWFuYWdlciAgICAgICAgICAgICAgICAgOiBvYmplY3R8U2Nyb2xsTWFuYWdlcnxQYXJ0aWFsPFNjcm9sbE1hbmFnZXJDb25maWc+O1xuICAgIEBJbnB1dCgpIHNlbGVjdGlvbk1vZGUgICAgICAgICAgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIHNob3dBbmltYXRpb24gICAgICAgICAgICAgICAgIDogYm9vbGVhbnxvYmplY3Q7XG4gICAgQElucHV0KCkgc2hvd0RpcnR5ICAgICAgICAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHNob3dSZW1vdmVSb3dJbkNvbnRleHRNZW51ICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBzdHJpcHMgICAgICAgICAgICAgICAgICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBzdWJHcmlkQ29uZmlncyAgICAgICAgICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBzeW5jTWFzayAgICAgICAgICAgICAgICAgICAgICA6IHN0cmluZ3xvYmplY3R8bnVsbDtcbiAgICBASW5wdXQoKSB0YWIgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGJvb2xlYW58b2JqZWN0O1xuICAgIEBJbnB1dCgpIHRhZyAgICAgICAgICAgICAgICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIHRiYXIgICAgICAgICAgICAgICAgICAgICAgICAgIDogb2JqZWN0W118b2JqZWN0O1xuICAgIEBJbnB1dCgpIHRleHRBbGlnbiAgICAgICAgICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIHRleHRDb250ZW50ICAgICAgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSB0aXRsZSAgICAgICAgICAgICAgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSB0cmFwRm9jdXMgICAgICAgICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgd2VpZ2h0ICAgICAgICAgICAgICAgICAgICAgICAgOiBudW1iZXI7XG5cbiAgICAgLy8gQ29uZmlncyBhbmQgcHJvcGVydGllc1xuICAgIEBJbnB1dCgpIGFsaWduU2VsZiAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBjb2x1bW5MaW5lcyAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGNvbnRlbnQgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBkYXRhICAgICAgICAgICAgICAgOiBvYmplY3RbXTtcbiAgICBASW5wdXQoKSBkYXRhc2V0ICAgICAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgZGlzYWJsZWQgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBleHRyYURhdGEgICAgICAgICAgOiBib29sZWFufG51bWJlcnxvYmplY3R8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGZsZXggICAgICAgICAgICAgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgaGVpZ2h0ICAgICAgICAgICAgIDogbnVtYmVyfHN0cmluZztcbiAgICBASW5wdXQoKSBoaWRkZW4gICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGh0bWwgICAgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBpZCAgICAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgaXRlbXMgICAgICAgICAgICAgIDogV2lkZ2V0W118b2JqZWN0fG9iamVjdFtdfFBhcnRpYWw8V2lkZ2V0Q29uZmlnPnxQYXJ0aWFsPFdpZGdldENvbmZpZz5bXTtcbiAgICBASW5wdXQoKSBsYXlvdXQgICAgICAgICAgICAgOiBMYXlvdXR8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGxheW91dFN0eWxlICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBtYXJnaW4gICAgICAgICAgICAgOiBudW1iZXJ8c3RyaW5nO1xuICAgIEBJbnB1dCgpIG1heEhlaWdodCAgICAgICAgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgbWF4V2lkdGggICAgICAgICAgIDogbnVtYmVyfHN0cmluZztcbiAgICBASW5wdXQoKSBtaW5IZWlnaHQgICAgICAgICAgOiBudW1iZXJ8c3RyaW5nO1xuICAgIEBJbnB1dCgpIG1pbldpZHRoICAgICAgICAgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgcmVhZE9ubHkgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSByb3dIZWlnaHQgICAgICAgICAgOiBudW1iZXI7XG4gICAgQElucHV0KCkgc2Nyb2xsYWJsZSAgICAgICAgIDogYm9vbGVhbnxTY3JvbGxlcnxvYmplY3R8UGFydGlhbDxTY3JvbGxlckNvbmZpZz47XG4gICAgQElucHV0KCkgc3RvcmUgICAgICAgICAgICAgIDogU3RvcmV8b2JqZWN0fFBhcnRpYWw8U3RvcmVDb25maWc+O1xuICAgIEBJbnB1dCgpIHRvb2xzICAgICAgICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSB0b29sdGlwICAgICAgICAgICAgOiBvYmplY3R8c3RyaW5nO1xuICAgIEBJbnB1dCgpIHRyYW5zaXRpb25EdXJhdGlvbiA6IG51bWJlcjtcbiAgICBASW5wdXQoKSB3aWR0aCAgICAgICAgICAgICAgOiBudW1iZXJ8c3RyaW5nO1xuICAgIEBJbnB1dCgpIHggICAgICAgICAgICAgICAgICA6IG51bWJlcjtcbiAgICBASW5wdXQoKSB5ICAgICAgICAgICAgICAgICAgOiBudW1iZXI7XG5cbiAgICAgLy8gUHJvcGVydGllcyBvbmx5XG4gICAgQElucHV0KCkgYW5jaG9yU2l6ZSAgICAgIDogbnVtYmVyW107XG4gICAgQElucHV0KCkgaXNTZXR0aW5nVmFsdWVzIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBpc1ZhbGlkICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHJlY29yZCAgICAgICAgICA6IE1vZGVsO1xuICAgIEBJbnB1dCgpIHNlbGVjdGVkQ2VsbCAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBzZWxlY3RlZFJlY29yZCAgOiBNb2RlbDtcbiAgICBASW5wdXQoKSBzZWxlY3RlZFJlY29yZHMgOiBNb2RlbFtdfG51bWJlcltdO1xuICAgIEBJbnB1dCgpIHN0YXRlICAgICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSB2YWx1ZXMgICAgICAgICAgOiBvYmplY3Q7XG5cbiAgICAgLy8gRXZlbnRzXG4gICAgQE91dHB1dCgpIG9uQmVmb3JlQ2VsbEVkaXRTdGFydCAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25CZWZvcmVEZXN0cm95ICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkJlZm9yZUV4cG9ydCAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uQmVmb3JlRmluaXNoQ2VsbEVkaXQgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25CZWZvcmVIaWRlICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkJlZm9yZVJlbmRlclJvd3MgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uQmVmb3JlU2V0UmVjb3JkICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25CZWZvcmVTaG93ICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkJlZm9yZVRvZ2dsZU5vZGUgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uQ2FuY2VsQ2VsbEVkaXQgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25DYXRjaEFsbCAgICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkNlbGxDbGljayAgICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uQ2VsbENvbnRleHRNZW51ICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25DZWxsRGJsQ2xpY2sgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkNlbGxNb3VzZU91dCAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uQ2VsbE1vdXNlT3ZlciAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25Db2xsYXBzZU5vZGUgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkRlc3Ryb3kgICAgICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uRXhwYW5kTm9kZSAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25FeHBvcnQgICAgICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkZpbmlzaENlbGxFZGl0ICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uRm9jdXNJbiAgICAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25Gb2N1c091dCAgICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkhpZGUgICAgICAgICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uTW91c2VPdXQgICAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25Nb3VzZU92ZXIgICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvblBhaW50ICAgICAgICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uUmVhZE9ubHkgICAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25SZW5kZXJSb3dzICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvblJlc2l6ZSAgICAgICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uUmVzcG9uc2l2ZSAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25TY3JvbGwgICAgICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvblNlbGVjdGlvbkNoYW5nZSAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uU2hvdyAgICAgICAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25TdGFydENlbGxFZGl0ICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvblRvZ2dsZU5vZGUgICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uVG9vbENsaWNrICAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICAgICAvLyBGZWF0dXJlc1xuICAgIEBJbnB1dCgpIGNlbGxFZGl0RmVhdHVyZSAgIDogb2JqZWN0fGJvb2xlYW58c3RyaW5nfENlbGxFZGl0fFBhcnRpYWw8Q2VsbEVkaXRDb25maWc+O1xuICAgIEBJbnB1dCgpIGNlbGxNZW51RmVhdHVyZSAgIDogb2JqZWN0fGJvb2xlYW58c3RyaW5nfENlbGxNZW51fFBhcnRpYWw8Q2VsbE1lbnVDb25maWc+O1xuICAgIEBJbnB1dCgpIGNlbGxUb29sdGlwRmVhdHVyZSA6IG9iamVjdHxib29sZWFufHN0cmluZ3xDZWxsVG9vbHRpcHxQYXJ0aWFsPENlbGxUb29sdGlwQ29uZmlnPjtcbiAgICBASW5wdXQoKSBjb2x1bW5BdXRvV2lkdGhGZWF0dXJlIDogb2JqZWN0fGJvb2xlYW58c3RyaW5nfENvbHVtbkF1dG9XaWR0aHxQYXJ0aWFsPENvbHVtbkF1dG9XaWR0aENvbmZpZz47XG4gICAgQElucHV0KCkgY29sdW1uRHJhZ1Rvb2xiYXJGZWF0dXJlIDogb2JqZWN0fGJvb2xlYW58c3RyaW5nfENvbHVtbkRyYWdUb29sYmFyfFBhcnRpYWw8Q29sdW1uRHJhZ1Rvb2xiYXJDb25maWc+O1xuICAgIEBJbnB1dCgpIGNvbHVtblBpY2tlckZlYXR1cmUgOiBvYmplY3R8Ym9vbGVhbnxzdHJpbmd8Q29sdW1uUGlja2VyfFBhcnRpYWw8Q29sdW1uUGlja2VyQ29uZmlnPjtcbiAgICBASW5wdXQoKSBjb2x1bW5SZW9yZGVyRmVhdHVyZSA6IG9iamVjdHxib29sZWFufHN0cmluZ3xDb2x1bW5SZW9yZGVyfFBhcnRpYWw8Q29sdW1uUmVvcmRlckNvbmZpZz47XG4gICAgQElucHV0KCkgY29sdW1uUmVzaXplRmVhdHVyZSA6IG9iamVjdHxib29sZWFufHN0cmluZ3xDb2x1bW5SZXNpemV8UGFydGlhbDxDb2x1bW5SZXNpemVDb25maWc+O1xuICAgIEBJbnB1dCgpIGNvbnRleHRNZW51RmVhdHVyZSA6IG9iamVjdHxib29sZWFufHN0cmluZ3xDb250ZXh0TWVudXxQYXJ0aWFsPENvbnRleHRNZW51Q29uZmlnPjtcbiAgICBASW5wdXQoKSBleGNlbEV4cG9ydGVyRmVhdHVyZSA6IG9iamVjdHxib29sZWFufHN0cmluZ3xHcmlkRXhjZWxFeHBvcnRlcnxQYXJ0aWFsPEdyaWRFeGNlbEV4cG9ydGVyQ29uZmlnPjtcbiAgICBASW5wdXQoKSBmaWx0ZXJGZWF0dXJlICAgICA6IG9iamVjdHxib29sZWFufHN0cmluZ3xGaWx0ZXJ8UGFydGlhbDxGaWx0ZXJDb25maWc+O1xuICAgIEBJbnB1dCgpIGZpbHRlckJhckZlYXR1cmUgIDogb2JqZWN0fGJvb2xlYW58c3RyaW5nfEZpbHRlckJhcnxQYXJ0aWFsPEZpbHRlckJhckNvbmZpZz47XG4gICAgQElucHV0KCkgZ3JvdXBGZWF0dXJlICAgICAgOiBvYmplY3R8Ym9vbGVhbnxzdHJpbmd8R3JvdXB8UGFydGlhbDxHcm91cENvbmZpZz47XG4gICAgQElucHV0KCkgZ3JvdXBTdW1tYXJ5RmVhdHVyZSA6IG9iamVjdHxib29sZWFufHN0cmluZ3xHcmlkR3JvdXBTdW1tYXJ5fFBhcnRpYWw8R3JpZEdyb3VwU3VtbWFyeUNvbmZpZz47XG4gICAgQElucHV0KCkgaGVhZGVyTWVudUZlYXR1cmUgOiBvYmplY3R8Ym9vbGVhbnxzdHJpbmd8SGVhZGVyTWVudXxQYXJ0aWFsPEhlYWRlck1lbnVDb25maWc+O1xuICAgIEBJbnB1dCgpIHBkZkV4cG9ydEZlYXR1cmUgIDogb2JqZWN0fGJvb2xlYW58c3RyaW5nfEdyaWRQZGZFeHBvcnR8UGFydGlhbDxHcmlkUGRmRXhwb3J0Q29uZmlnPjtcbiAgICBASW5wdXQoKSBxdWlja0ZpbmRGZWF0dXJlICA6IG9iamVjdHxib29sZWFufHN0cmluZ3xRdWlja0ZpbmR8UGFydGlhbDxRdWlja0ZpbmRDb25maWc+O1xuICAgIEBJbnB1dCgpIHJlZ2lvblJlc2l6ZUZlYXR1cmUgOiBvYmplY3R8Ym9vbGVhbnxzdHJpbmd8UmVnaW9uUmVzaXplfFBhcnRpYWw8UmVnaW9uUmVzaXplQ29uZmlnPjtcbiAgICBASW5wdXQoKSByb3dDb3B5UGFzdGVGZWF0dXJlIDogb2JqZWN0fGJvb2xlYW58c3RyaW5nfFJvd0NvcHlQYXN0ZXxQYXJ0aWFsPFJvd0NvcHlQYXN0ZUNvbmZpZz47XG4gICAgQElucHV0KCkgcm93UmVvcmRlckZlYXR1cmUgOiBvYmplY3R8Ym9vbGVhbnxzdHJpbmd8Um93UmVvcmRlcnxQYXJ0aWFsPFJvd1Jlb3JkZXJDb25maWc+O1xuICAgIEBJbnB1dCgpIHNlYXJjaEZlYXR1cmUgICAgIDogb2JqZWN0fGJvb2xlYW58c3RyaW5nfFNlYXJjaHxQYXJ0aWFsPFNlYXJjaENvbmZpZz47XG4gICAgQElucHV0KCkgc29ydEZlYXR1cmUgICAgICAgOiBvYmplY3R8Ym9vbGVhbnxzdHJpbmd8U29ydHxQYXJ0aWFsPFNvcnRDb25maWc+O1xuICAgIEBJbnB1dCgpIHN0aWNreUNlbGxzRmVhdHVyZSA6IG9iamVjdHxib29sZWFufHN0cmluZ3xTdGlja3lDZWxsc3xQYXJ0aWFsPFN0aWNreUNlbGxzQ29uZmlnPjtcbiAgICBASW5wdXQoKSBzdHJpcGVGZWF0dXJlICAgICA6IG9iamVjdHxib29sZWFufHN0cmluZ3xTdHJpcGV8UGFydGlhbDxTdHJpcGVDb25maWc+O1xuICAgIEBJbnB1dCgpIHN1bW1hcnlGZWF0dXJlICAgIDogb2JqZWN0fGJvb2xlYW58c3RyaW5nfEdyaWRTdW1tYXJ5fFBhcnRpYWw8R3JpZFN1bW1hcnlDb25maWc+O1xuICAgIEBJbnB1dCgpIHRyZWVGZWF0dXJlICAgICAgIDogb2JqZWN0fGJvb2xlYW58c3RyaW5nfFRyZWV8UGFydGlhbDxUcmVlQ29uZmlnPjtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhbmQgYXBwZW5kIHRoZSB1bmRlcmx5aW5nIHdpZGdldFxuICAgICAqL1xuICAgIG5nT25Jbml0KCk6IHZvaWQge1xuICAgICAgICBjb25zdFxuICAgICAgICAgICAgbWUgPSB0aGlzLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGVsZW1lbnRSZWYsXG4gICAgICAgICAgICAgICAgYnJ5bnR1bUNvbmZpZ1xuICAgICAgICAgICAgfSA9IG1lLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGluc3RhbmNlQ2xhc3MsXG4gICAgICAgICAgICAgICAgYnJ5bnR1bUNvbmZpZ3NcbiAgICAgICAgICAgIH0gPSBCcnludHVtR3JpZEJhc2VDb21wb25lbnQ7XG5cbiAgICAgICAgT2JqZWN0LmFzc2lnbihicnludHVtQ29uZmlnLCB7XG4gICAgICAgICAgICBsaXN0ZW5lcnMgOiB7XG4gICAgICAgICAgICAgICAgYmVmb3JlQ2VsbEVkaXRTdGFydChldmVudCA6IGFueSkgeyBtZS5vbkJlZm9yZUNlbGxFZGl0U3RhcnQuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgYmVmb3JlRGVzdHJveShldmVudCA6IGFueSkgeyBtZS5vbkJlZm9yZURlc3Ryb3kuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgYmVmb3JlRXhwb3J0KGV2ZW50IDogYW55KSB7IG1lLm9uQmVmb3JlRXhwb3J0LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGJlZm9yZUZpbmlzaENlbGxFZGl0KGV2ZW50IDogYW55KSB7IG1lLm9uQmVmb3JlRmluaXNoQ2VsbEVkaXQuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgYmVmb3JlSGlkZShldmVudCA6IGFueSkgeyBtZS5vbkJlZm9yZUhpZGUuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgYmVmb3JlUmVuZGVyUm93cyhldmVudCA6IGFueSkgeyBtZS5vbkJlZm9yZVJlbmRlclJvd3MuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgYmVmb3JlU2V0UmVjb3JkKGV2ZW50IDogYW55KSB7IG1lLm9uQmVmb3JlU2V0UmVjb3JkLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGJlZm9yZVNob3coZXZlbnQgOiBhbnkpIHsgbWUub25CZWZvcmVTaG93LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGJlZm9yZVRvZ2dsZU5vZGUoZXZlbnQgOiBhbnkpIHsgbWUub25CZWZvcmVUb2dnbGVOb2RlLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGNhbmNlbENlbGxFZGl0KGV2ZW50IDogYW55KSB7IG1lLm9uQ2FuY2VsQ2VsbEVkaXQuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgY2F0Y2hBbGwoZXZlbnQgOiBhbnkpIHsgbWUub25DYXRjaEFsbC5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBjZWxsQ2xpY2soZXZlbnQgOiBhbnkpIHsgbWUub25DZWxsQ2xpY2suZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgY2VsbENvbnRleHRNZW51KGV2ZW50IDogYW55KSB7IG1lLm9uQ2VsbENvbnRleHRNZW51LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGNlbGxEYmxDbGljayhldmVudCA6IGFueSkgeyBtZS5vbkNlbGxEYmxDbGljay5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBjZWxsTW91c2VPdXQoZXZlbnQgOiBhbnkpIHsgbWUub25DZWxsTW91c2VPdXQuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgY2VsbE1vdXNlT3ZlcihldmVudCA6IGFueSkgeyBtZS5vbkNlbGxNb3VzZU92ZXIuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgY29sbGFwc2VOb2RlKGV2ZW50IDogYW55KSB7IG1lLm9uQ29sbGFwc2VOb2RlLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGRlc3Ryb3koZXZlbnQgOiBhbnkpIHsgbWUub25EZXN0cm95LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGV4cGFuZE5vZGUoZXZlbnQgOiBhbnkpIHsgbWUub25FeHBhbmROb2RlLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGV4cG9ydChldmVudCA6IGFueSkgeyBtZS5vbkV4cG9ydC5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBmaW5pc2hDZWxsRWRpdChldmVudCA6IGFueSkgeyBtZS5vbkZpbmlzaENlbGxFZGl0LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGZvY3VzSW4oZXZlbnQgOiBhbnkpIHsgbWUub25Gb2N1c0luLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGZvY3VzT3V0KGV2ZW50IDogYW55KSB7IG1lLm9uRm9jdXNPdXQuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgaGlkZShldmVudCA6IGFueSkgeyBtZS5vbkhpZGUuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgbW91c2VPdXQoZXZlbnQgOiBhbnkpIHsgbWUub25Nb3VzZU91dC5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBtb3VzZU92ZXIoZXZlbnQgOiBhbnkpIHsgbWUub25Nb3VzZU92ZXIuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgcGFpbnQoZXZlbnQgOiBhbnkpIHsgbWUub25QYWludC5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICByZWFkT25seShldmVudCA6IGFueSkgeyBtZS5vblJlYWRPbmx5LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIHJlbmRlclJvd3MoZXZlbnQgOiBhbnkpIHsgbWUub25SZW5kZXJSb3dzLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIHJlc2l6ZShldmVudCA6IGFueSkgeyBtZS5vblJlc2l6ZS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICByZXNwb25zaXZlKGV2ZW50IDogYW55KSB7IG1lLm9uUmVzcG9uc2l2ZS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBzY3JvbGwoZXZlbnQgOiBhbnkpIHsgbWUub25TY3JvbGwuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgc2VsZWN0aW9uQ2hhbmdlKGV2ZW50IDogYW55KSB7IG1lLm9uU2VsZWN0aW9uQ2hhbmdlLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIHNob3coZXZlbnQgOiBhbnkpIHsgbWUub25TaG93LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIHN0YXJ0Q2VsbEVkaXQoZXZlbnQgOiBhbnkpIHsgbWUub25TdGFydENlbGxFZGl0LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIHRvZ2dsZU5vZGUoZXZlbnQgOiBhbnkpIHsgbWUub25Ub2dnbGVOb2RlLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIHRvb2xDbGljayhldmVudCA6IGFueSkgeyBtZS5vblRvb2xDbGljay5lbWl0KGV2ZW50KTsgfSxcblxuICAgICAgICAgICAgICAgIHRoaXNPYmogOiBtZVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBJZiBjb21wb25lbnQgaGFzIG5vIGNvbnRhaW5lciBzcGVjaWZpZWQgaW4gY29uZmlnIHRoZW4gdXNlIGFkb3B0IHRvIFdyYXBwZXIncyBlbGVtZW50XG4gICAgICAgIGNvbnN0XG4gICAgICAgICAgICBjb250YWluZXJQYXJhbSA9IFtcbiAgICAgICAgICAgICAgICAnYWRvcHQnLFxuICAgICAgICAgICAgICAgICdhcHBlbmRUbycsXG4gICAgICAgICAgICAgICAgJ2luc2VydEFmdGVyJyxcbiAgICAgICAgICAgICAgICAnaW5zZXJ0QmVmb3JlJ1xuICAgICAgICAgICAgXS5maW5kKHByb3AgPT4gYnJ5bnR1bUNvbmZpZ1twcm9wXSk7XG4gICAgICAgIGlmICghY29udGFpbmVyUGFyYW0pIHtcbiAgICAgICAgICAgIGJyeW50dW1Db25maWcuYWRvcHQgPSBlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBXcmFwcGVySGVscGVyLmRldldhcm5pbmdDb250YWluZXIoaW5zdGFuY2VDbGFzcy4kbmFtZSwgY29udGFpbmVyUGFyYW0pO1xuICAgICAgICB9XG5cbiAgICAgICAgYnJ5bnR1bUNvbmZpZ3MuZmlsdGVyKHByb3AgPT4gcHJvcCBpbiB0aGlzKS5mb3JFYWNoKHByb3AgPT4ge1xuICAgICAgICAgICAgV3JhcHBlckhlbHBlci5hcHBseVByb3BWYWx1ZShicnludHVtQ29uZmlnLCBwcm9wLCB0aGlzW3Byb3BdKTtcbiAgICAgICAgICAgIGlmIChbJ2ZlYXR1cmVzJywgJ2NvbmZpZyddLmluY2x1ZGVzKHByb3ApKSB7XG4gICAgICAgICAgICAgICAgV3JhcHBlckhlbHBlci5kZXZXYXJuaW5nQ29uZmlnUHJvcChpbnN0YW5jZUNsYXNzLiRuYW1lLCBwcm9wKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBtZS5pbnN0YW5jZSA9IGluc3RhbmNlQ2xhc3MuJG5hbWUgPT09ICdXaWRnZXQnID8gV2lkZ2V0SGVscGVyLmNyZWF0ZVdpZGdldChicnludHVtQ29uZmlnKSA6IG5ldyBpbnN0YW5jZUNsYXNzKGJyeW50dW1Db25maWcpO1xuXG4gICAgICAgIC8vIEJhY2t3YXJkcyBjb21wYXRpYmlsaXR5IGZvciBncmlkSW5zdGFuY2UsIHNjaGVkdWxlckluc3RhbmNlIGV0Yy5cbiAgICAgICAgbWVbU3RyaW5nSGVscGVyLnVuY2FwaXRhbGl6ZShpbnN0YW5jZUNsYXNzLiRuYW1lKSArICdJbnN0YW5jZSddID0gbWUuaW5zdGFuY2U7XG4gICAgICAgIC8vIFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFdhdGNoIGZvciBjaGFuZ2VzXG4gICAgICogQHBhcmFtIGNoYW5nZXNcbiAgICAgKi9cbiAgICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgICAgIGNvbnN0XG4gICAgICAgICAgICB7IGluc3RhbmNlIH0gPSB0aGlzLFxuICAgICAgICAgICAgeyBpbnN0YW5jZUNsYXNzIH0gPSBCcnludHVtR3JpZEJhc2VDb21wb25lbnQ7XG5cbiAgICAgICAgaWYgKCFpbnN0YW5jZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSXRlcmF0ZSBvdmVyIGFsbCBjaGFuZ2VzXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKGNoYW5nZXMpLmZvckVhY2goKFtwcm9wLCBjaGFuZ2VdKSA9PiB7XG4gICAgICAgICAgICBjb25zdFxuICAgICAgICAgICAgICAgIG5ld1ZhbHVlID0gKGNoYW5nZSBhcyBTaW1wbGVDaGFuZ2UpLmN1cnJlbnRWYWx1ZSxcbiAgICAgICAgICAgICAgICB7IGluc3RhbmNlIH0gPSB0aGlzLFxuICAgICAgICAgICAgICAgIHsgYnJ5bnR1bUNvbmZpZ3NPbmx5LCBicnludHVtUHJvcHMgfSA9IEJyeW50dW1HcmlkQmFzZUNvbXBvbmVudDtcbiAgICAgICAgICAgIGlmIChicnludHVtUHJvcHMuaW5jbHVkZXMocHJvcCkpIHtcbiAgICAgICAgICAgICAgICBXcmFwcGVySGVscGVyLmFwcGx5UHJvcFZhbHVlKGluc3RhbmNlLCBwcm9wLCBuZXdWYWx1ZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIGlmIChicnludHVtQ29uZmlnc09ubHkuaW5jbHVkZXMocHJvcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgV3JhcHBlckhlbHBlci5kZXZXYXJuaW5nVXBkYXRlUHJvcChpbnN0YW5jZUNsYXNzLiRuYW1lLCBwcm9wKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERlc3Ryb3kgdGhlIGNvbXBvbmVudFxuICAgICAqL1xuICAgIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5pbnN0YW5jZSkge1xuICAgICAgICAgICAgdGhpcy5pbnN0YW5jZS5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=