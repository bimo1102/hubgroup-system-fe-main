/**
 * Angular wrapper for Bryntum Grid
 */
import * as tslib_1 from "tslib";
import { Component, ElementRef, EventEmitter, Output, Input } from '@angular/core';
import WrapperHelper from './wrapper.helper';
// Bryntum 'scheduler.lite.umd' bundle comes without polyfills to support Angular's zone.js
import { Base, Model, Scroller, Widget } from '@bryntum/scheduler/scheduler.lite.umd.js';
import { Grid, StringHelper, WidgetHelper } from '@bryntum/scheduler/scheduler.lite.umd.js';
var BryntumGridComponent = /** @class */ (function () {
    function BryntumGridComponent(element) {
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
    BryntumGridComponent.prototype.ngOnInit = function () {
        var _this = this;
        var me = this, elementRef = me.elementRef, bryntumConfig = me.bryntumConfig, instanceClass = BryntumGridComponent.instanceClass, bryntumConfigs = BryntumGridComponent.bryntumConfigs;
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
    BryntumGridComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        var instance = this.instance, instanceClass = BryntumGridComponent.instanceClass;
        if (!instance) {
            return;
        }
        // Iterate over all changes
        Object.entries(changes).forEach(function (_a) {
            var _b = tslib_1.__read(_a, 2), prop = _b[0], change = _b[1];
            var newValue = change.currentValue, instance = _this.instance, bryntumConfigsOnly = BryntumGridComponent.bryntumConfigsOnly, bryntumProps = BryntumGridComponent.bryntumProps;
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
    BryntumGridComponent.prototype.ngOnDestroy = function () {
        if (this.instance) {
            this.instance.destroy();
        }
    };
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
    BryntumGridComponent.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
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
    return BryntumGridComponent;
}());
export { BryntumGridComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJ5bnR1bS1ncmlkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BicnludHVtL3NjaGVkdWxlci1hbmd1bGFyLyIsInNvdXJjZXMiOlsibGliL2JyeW50dW0tZ3JpZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0dBRUc7O0FBRUgsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFxQixNQUFNLEVBQUUsS0FBSyxFQUErQixNQUFNLGVBQWUsQ0FBQztBQUNuSSxPQUFPLGFBQWEsTUFBTSxrQkFBa0IsQ0FBQztBQUU3QywyRkFBMkY7QUFDM0YsT0FBTyxFQUFFLElBQUksRUFBa21CLEtBQUssRUFBNEwsUUFBUSxFQUFzSixNQUFNLEVBQWdCLE1BQU0sMENBQTBDLENBQUM7QUFDcmhDLE9BQU8sRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBRTVGO0lBaVNJLDhCQUFZLE9BQW1CO1FBUHZCLGtCQUFhLEdBQUc7WUFDcEIsZ0JBQWdCLEVBQUcsSUFBSTtZQUN2QixLQUFLLEVBQWMsU0FBUztZQUM1QixTQUFTLEVBQVUsRUFBRTtZQUNyQixRQUFRLEVBQVcsRUFBRTtTQUN4QixDQUFDO1FBcUlELFNBQVM7UUFDQSwwQkFBcUIsR0FBSSxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQ3BELG9CQUFlLEdBQVUsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUNwRCxtQkFBYyxHQUFXLElBQUksWUFBWSxFQUFVLENBQUM7UUFDcEQsMkJBQXNCLEdBQUcsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUNwRCxpQkFBWSxHQUFhLElBQUksWUFBWSxFQUFVLENBQUM7UUFDcEQsdUJBQWtCLEdBQU8sSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUNwRCxzQkFBaUIsR0FBUSxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQ3BELGlCQUFZLEdBQWEsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUNwRCx1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QzVELE9BQU8sWUFBQyxLQUFXLElBQUksRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsRCxVQUFVLFlBQUMsS0FBVyxJQUFJLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEQsTUFBTSxZQUFDLEtBQVcsSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hELGNBQWMsWUFBQyxLQUFXLElBQUksRUFBRSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hFLE9BQU8sWUFBQyxLQUFXLElBQUksRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsRCxRQUFRLFlBQUMsS0FBVyxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEQsSUFBSSxZQUFDLEtBQVcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVDLFFBQVEsWUFBQyxLQUFXLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNwRCxTQUFTLFlBQUMsS0FBVyxJQUFJLEVBQUUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdEQsS0FBSyxZQUFDLEtBQVcsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlDLFFBQVEsWUFBQyxLQUFXLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNwRCxVQUFVLFlBQUMsS0FBVyxJQUFJLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEQsTUFBTSxZQUFDLEtBQVcsSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hELFVBQVUsWUFBQyxLQUFXLElBQUksRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN4RCxNQUFNLFlBQUMsS0FBVyxJQUFJLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEQsZUFBZSxZQUFDLEtBQVcsSUFBSSxFQUFFLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEUsSUFBSSxZQUFDLEtBQVcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVDLGFBQWEsWUFBQyxLQUFXLElBQUksRUFBRSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM5RCxVQUFVLFlBQUMsS0FBVyxJQUFJLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEQsU0FBUyxZQUFDLEtBQVcsSUFBSSxFQUFFLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRXRELE9BQU8sRUFBRyxFQUFFO2FBQ2Y7U0FDSixDQUFDLENBQUM7UUFFSCx3RkFBd0Y7UUFDeEYsSUFDSSxjQUFjLEdBQUc7WUFDYixPQUFPO1lBQ1AsVUFBVTtZQUNWLGFBQWE7WUFDYixjQUFjO1NBQ2pCLENBQUMsSUFBSSxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFuQixDQUFtQixDQUFDLENBQUM7UUFDeEMsSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUNqQixhQUFhLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxhQUFhLENBQUM7U0FDbEQ7YUFDSTtZQUNELGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1NBQzFFO1FBRUQsY0FBYyxDQUFDLE1BQU0sQ0FBQyxVQUFBLElBQUksSUFBSSxPQUFBLElBQUksSUFBSSxLQUFJLEVBQVosQ0FBWSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSTtZQUNwRCxhQUFhLENBQUMsY0FBYyxDQUFDLGFBQWEsRUFBRSxJQUFJLEVBQUUsS0FBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDOUQsSUFBSSxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3ZDLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO2FBQ2pFO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxhQUFhO1FBQ2IsRUFBRSxDQUFDLFFBQVEsR0FBRyxhQUFhLENBQUMsS0FBSyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFN0gsbUVBQW1FO1FBQ25FLEVBQUUsQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsR0FBRyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDO1FBQzlFLEdBQUc7SUFDUCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsMENBQVcsR0FBWCxVQUFZLE9BQXNCO1FBQWxDLGlCQXNCQztRQXBCUyxJQUFBLHdCQUFRLEVBQ1Isa0RBQWEsQ0FBMEI7UUFFN0MsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNYLE9BQU87U0FDVjtRQUVELDJCQUEyQjtRQUMzQixNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEVBQWM7Z0JBQWQsMEJBQWMsRUFBYixZQUFJLEVBQUUsY0FBTTtZQUV0QyxJQUFBLFFBQVEsR0FBSSxNQUF1QixDQUFDLFlBQVksRUFDOUMseUJBQVEsRUFDUiw0REFBa0IsRUFBRSxnREFBWSxDQUEwQjtZQUNoRSxJQUFJLFlBQVksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQzdCLGFBQWEsQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQzlELElBQUksa0JBQWtCLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFO29CQUNuQyxhQUFhLENBQUMsb0JBQW9CLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztpQkFDakU7YUFDSjtRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVEOztPQUVHO0lBQ0gsMENBQVcsR0FBWDtRQUNJLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNmLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDM0I7SUFDTCxDQUFDO0lBN2xCYSxrQ0FBYSxHQUFHLElBQUksQ0FBQztJQUVwQix3Q0FBbUIsR0FBYTtRQUMzQyxpQkFBaUI7UUFDakIsaUJBQWlCO1FBQ2pCLG9CQUFvQjtRQUNwQix3QkFBd0I7UUFDeEIsMEJBQTBCO1FBQzFCLHFCQUFxQjtRQUNyQixzQkFBc0I7UUFDdEIscUJBQXFCO1FBQ3JCLG9CQUFvQjtRQUNwQixzQkFBc0I7UUFDdEIsZUFBZTtRQUNmLGtCQUFrQjtRQUNsQixjQUFjO1FBQ2QscUJBQXFCO1FBQ3JCLG1CQUFtQjtRQUNuQixrQkFBa0I7UUFDbEIsa0JBQWtCO1FBQ2xCLHFCQUFxQjtRQUNyQixxQkFBcUI7UUFDckIsbUJBQW1CO1FBQ25CLGVBQWU7UUFDZixhQUFhO1FBQ2Isb0JBQW9CO1FBQ3BCLGVBQWU7UUFDZixnQkFBZ0I7UUFDaEIsYUFBYTtLQUNoQixDQUFDO0lBRWEsbUNBQWMsR0FBYSxvQkFBb0IsQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUM7UUFDdEYsT0FBTztRQUNQLE9BQU87UUFDUCxXQUFXO1FBQ1gsUUFBUTtRQUNSLHFCQUFxQjtRQUNyQixVQUFVO1FBQ1YsWUFBWTtRQUNaLE1BQU07UUFDTixTQUFTO1FBQ1QsY0FBYztRQUNkLFVBQVU7UUFDVixLQUFLO1FBQ0wsYUFBYTtRQUNiLFNBQVM7UUFDVCxRQUFRO1FBQ1IsYUFBYTtRQUNiLFNBQVM7UUFDVCxtQkFBbUI7UUFDbkIseUJBQXlCO1FBQ3pCLE1BQU07UUFDTixTQUFTO1FBQ1QscUJBQXFCO1FBQ3JCLGVBQWU7UUFDZixVQUFVO1FBQ1YsY0FBYztRQUNkLFVBQVU7UUFDViw0QkFBNEI7UUFDNUIsTUFBTTtRQUNOLFdBQVc7UUFDWCxXQUFXO1FBQ1gsY0FBYztRQUNkLHFCQUFxQjtRQUNyQixvQkFBb0I7UUFDcEIsV0FBVztRQUNYLFVBQVU7UUFDVixnQkFBZ0I7UUFDaEIsZ0JBQWdCO1FBQ2hCLE1BQU07UUFDTixVQUFVO1FBQ1YsUUFBUTtRQUNSLGdCQUFnQjtRQUNoQixjQUFjO1FBQ2QsUUFBUTtRQUNSLFFBQVE7UUFDUixRQUFRO1FBQ1IsZUFBZTtRQUNmLGFBQWE7UUFDYixlQUFlO1FBQ2YsTUFBTTtRQUNOLFNBQVM7UUFDVCxJQUFJO1FBQ0osY0FBYztRQUNkLGFBQWE7UUFDYixTQUFTO1FBQ1QsT0FBTztRQUNQLFFBQVE7UUFDUixhQUFhO1FBQ2IsV0FBVztRQUNYLFdBQVc7UUFDWCxVQUFVO1FBQ1Ysa0JBQWtCO1FBQ2xCLGVBQWU7UUFDZixhQUFhO1FBQ2IsdUJBQXVCO1FBQ3ZCLGVBQWU7UUFDZixRQUFRO1FBQ1IsY0FBYztRQUNkLFFBQVE7UUFDUixXQUFXO1FBQ1gsVUFBVTtRQUNWLFdBQVc7UUFDWCxVQUFVO1FBQ1YsZUFBZTtRQUNmLFlBQVk7UUFDWixPQUFPO1FBQ1AsU0FBUztRQUNULFlBQVk7UUFDWiw4QkFBOEI7UUFDOUIsK0JBQStCO1FBQy9CLHVCQUF1QjtRQUN2QixVQUFVO1FBQ1YsMkJBQTJCO1FBQzNCLGtCQUFrQjtRQUNsQixRQUFRO1FBQ1IsYUFBYTtRQUNiLFdBQVc7UUFDWCxZQUFZO1FBQ1osY0FBYztRQUNkLGVBQWU7UUFDZixlQUFlO1FBQ2YsZUFBZTtRQUNmLGVBQWU7UUFDZixXQUFXO1FBQ1gsNEJBQTRCO1FBQzVCLE9BQU87UUFDUCxRQUFRO1FBQ1IsZ0JBQWdCO1FBQ2hCLFVBQVU7UUFDVixLQUFLO1FBQ0wsS0FBSztRQUNMLE1BQU07UUFDTixXQUFXO1FBQ1gsYUFBYTtRQUNiLE9BQU87UUFDUCxPQUFPO1FBQ1AsU0FBUztRQUNULG9CQUFvQjtRQUNwQixXQUFXO1FBQ1gsUUFBUTtRQUNSLE9BQU87UUFDUCxHQUFHO1FBQ0gsR0FBRztLQUNOLENBQUMsQ0FBQztJQUVZLHVDQUFrQixHQUFhO1FBQzFDLE9BQU87UUFDUCxPQUFPO1FBQ1AsUUFBUTtRQUNSLHFCQUFxQjtRQUNyQixVQUFVO1FBQ1YsWUFBWTtRQUNaLE1BQU07UUFDTixTQUFTO1FBQ1QsY0FBYztRQUNkLFVBQVU7UUFDVixLQUFLO1FBQ0wsU0FBUztRQUNULFFBQVE7UUFDUixhQUFhO1FBQ2IsbUJBQW1CO1FBQ25CLHlCQUF5QjtRQUN6QixxQkFBcUI7UUFDckIsZUFBZTtRQUNmLFVBQVU7UUFDVixjQUFjO1FBQ2QsNEJBQTRCO1FBQzVCLE1BQU07UUFDTixXQUFXO1FBQ1gsV0FBVztRQUNYLGNBQWM7UUFDZCxxQkFBcUI7UUFDckIsb0JBQW9CO1FBQ3BCLFVBQVU7UUFDVixnQkFBZ0I7UUFDaEIsZ0JBQWdCO1FBQ2hCLFVBQVU7UUFDVixRQUFRO1FBQ1IsZ0JBQWdCO1FBQ2hCLGNBQWM7UUFDZCxRQUFRO1FBQ1IsZUFBZTtRQUNmLGFBQWE7UUFDYixlQUFlO1FBQ2YsU0FBUztRQUNULGNBQWM7UUFDZCxhQUFhO1FBQ2IsU0FBUztRQUNULFdBQVc7UUFDWCxXQUFXO1FBQ1gsVUFBVTtRQUNWLGtCQUFrQjtRQUNsQixlQUFlO1FBQ2YsYUFBYTtRQUNiLHVCQUF1QjtRQUN2QixlQUFlO1FBQ2YsY0FBYztRQUNkLFFBQVE7UUFDUixlQUFlO1FBQ2YsWUFBWTtRQUNaLE9BQU87UUFDUCxTQUFTO1FBQ1QsWUFBWTtRQUNaLDhCQUE4QjtRQUM5QiwrQkFBK0I7UUFDL0IsdUJBQXVCO1FBQ3ZCLDJCQUEyQjtRQUMzQixrQkFBa0I7UUFDbEIsUUFBUTtRQUNSLGFBQWE7UUFDYixjQUFjO1FBQ2QsZUFBZTtRQUNmLGVBQWU7UUFDZixlQUFlO1FBQ2YsZUFBZTtRQUNmLFdBQVc7UUFDWCw0QkFBNEI7UUFDNUIsUUFBUTtRQUNSLGdCQUFnQjtRQUNoQixVQUFVO1FBQ1YsS0FBSztRQUNMLEtBQUs7UUFDTCxNQUFNO1FBQ04sV0FBVztRQUNYLGFBQWE7UUFDYixPQUFPO1FBQ1AsV0FBVztRQUNYLFFBQVE7S0FDWCxDQUFDO0lBRWEsaUNBQVksR0FBYSxvQkFBb0IsQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUM7UUFDcEYsV0FBVztRQUNYLFlBQVk7UUFDWixhQUFhO1FBQ2IsU0FBUztRQUNULE1BQU07UUFDTixTQUFTO1FBQ1QsVUFBVTtRQUNWLFdBQVc7UUFDWCxNQUFNO1FBQ04sUUFBUTtRQUNSLFFBQVE7UUFDUixNQUFNO1FBQ04sSUFBSTtRQUNKLGlCQUFpQjtRQUNqQixTQUFTO1FBQ1QsT0FBTztRQUNQLFFBQVE7UUFDUixhQUFhO1FBQ2IsUUFBUTtRQUNSLFdBQVc7UUFDWCxVQUFVO1FBQ1YsV0FBVztRQUNYLFVBQVU7UUFDVixVQUFVO1FBQ1YsUUFBUTtRQUNSLFdBQVc7UUFDWCxZQUFZO1FBQ1osY0FBYztRQUNkLGdCQUFnQjtRQUNoQixpQkFBaUI7UUFDakIsT0FBTztRQUNQLE9BQU87UUFDUCxPQUFPO1FBQ1AsU0FBUztRQUNULG9CQUFvQjtRQUNwQixRQUFRO1FBQ1IsT0FBTztRQUNQLEdBQUc7UUFDSCxHQUFHO0tBQ04sQ0FBQyxDQUFDOztnQkFyUk4sU0FBUyxTQUFDO29CQUNQLFFBQVEsRUFBRyxjQUFjO29CQUN6QixRQUFRLEVBQUcsRUFBRTtpQkFDaEI7Ozs7Z0JBVm1CLFVBQVU7Ozt3QkE2U3pCLEtBQUs7d0JBQ0wsS0FBSzt5QkFDTCxLQUFLO3NDQUNMLEtBQUs7MkJBQ0wsS0FBSzs2QkFDTCxLQUFLO3VCQUNMLEtBQUs7MEJBQ0wsS0FBSzsrQkFDTCxLQUFLOzJCQUNMLEtBQUs7c0JBQ0wsS0FBSzswQkFDTCxLQUFLO3lCQUNMLEtBQUs7OEJBQ0wsS0FBSztvQ0FDTCxLQUFLOzBDQUNMLEtBQUs7c0NBQ0wsS0FBSztnQ0FDTCxLQUFLOzJCQUNMLEtBQUs7K0JBQ0wsS0FBSzs2Q0FDTCxLQUFLO3VCQUNMLEtBQUs7NEJBQ0wsS0FBSzs0QkFDTCxLQUFLOytCQUNMLEtBQUs7c0NBQ0wsS0FBSztxQ0FDTCxLQUFLOzJCQUNMLEtBQUs7aUNBQ0wsS0FBSztpQ0FDTCxLQUFLOzJCQUNMLEtBQUs7eUJBQ0wsS0FBSztpQ0FDTCxLQUFLOytCQUNMLEtBQUs7eUJBQ0wsS0FBSztnQ0FDTCxLQUFLOzhCQUNMLEtBQUs7Z0NBQ0wsS0FBSzswQkFDTCxLQUFLOytCQUNMLEtBQUs7OEJBQ0wsS0FBSzswQkFDTCxLQUFLOzRCQUNMLEtBQUs7NEJBQ0wsS0FBSzsyQkFDTCxLQUFLO21DQUNMLEtBQUs7Z0NBQ0wsS0FBSzs4QkFDTCxLQUFLO3dDQUNMLEtBQUs7Z0NBQ0wsS0FBSzsrQkFDTCxLQUFLO3lCQUNMLEtBQUs7Z0NBQ0wsS0FBSzs2QkFDTCxLQUFLO3dCQUNMLEtBQUs7MEJBQ0wsS0FBSzs2QkFDTCxLQUFLOytDQUNMLEtBQUs7Z0RBQ0wsS0FBSzt3Q0FDTCxLQUFLOzRDQUNMLEtBQUs7bUNBQ0wsS0FBSzt5QkFDTCxLQUFLOzhCQUNMLEtBQUs7K0JBQ0wsS0FBSztnQ0FDTCxLQUFLO2dDQUNMLEtBQUs7Z0NBQ0wsS0FBSztnQ0FDTCxLQUFLOzRCQUNMLEtBQUs7NkNBQ0wsS0FBSzt5QkFDTCxLQUFLO2lDQUNMLEtBQUs7MkJBQ0wsS0FBSztzQkFDTCxLQUFLO3NCQUNMLEtBQUs7dUJBQ0wsS0FBSzs0QkFDTCxLQUFLOzhCQUNMLEtBQUs7d0JBQ0wsS0FBSzs0QkFDTCxLQUFLO3lCQUNMLEtBQUs7NEJBR0wsS0FBSzs4QkFDTCxLQUFLOzBCQUNMLEtBQUs7dUJBQ0wsS0FBSzswQkFDTCxLQUFLOzJCQUNMLEtBQUs7NEJBQ0wsS0FBSzt1QkFDTCxLQUFLO3lCQUNMLEtBQUs7eUJBQ0wsS0FBSzt1QkFDTCxLQUFLO3FCQUNMLEtBQUs7d0JBQ0wsS0FBSzt5QkFDTCxLQUFLOzhCQUNMLEtBQUs7eUJBQ0wsS0FBSzs0QkFDTCxLQUFLOzJCQUNMLEtBQUs7NEJBQ0wsS0FBSzsyQkFDTCxLQUFLOzJCQUNMLEtBQUs7NEJBQ0wsS0FBSzs2QkFDTCxLQUFLO3dCQUNMLEtBQUs7d0JBQ0wsS0FBSzswQkFDTCxLQUFLO3FDQUNMLEtBQUs7d0JBQ0wsS0FBSztvQkFDTCxLQUFLO29CQUNMLEtBQUs7NkJBR0wsS0FBSztrQ0FDTCxLQUFLOzBCQUNMLEtBQUs7eUJBQ0wsS0FBSzsrQkFDTCxLQUFLO2lDQUNMLEtBQUs7a0NBQ0wsS0FBSzt3QkFDTCxLQUFLO3lCQUNMLEtBQUs7d0NBR0wsTUFBTTtrQ0FDTixNQUFNO2lDQUNOLE1BQU07eUNBQ04sTUFBTTsrQkFDTixNQUFNO3FDQUNOLE1BQU07b0NBQ04sTUFBTTsrQkFDTixNQUFNO3FDQUNOLE1BQU07bUNBQ04sTUFBTTs2QkFDTixNQUFNOzhCQUNOLE1BQU07b0NBQ04sTUFBTTtpQ0FDTixNQUFNO2lDQUNOLE1BQU07a0NBQ04sTUFBTTtpQ0FDTixNQUFNOzRCQUNOLE1BQU07K0JBQ04sTUFBTTsyQkFDTixNQUFNO21DQUNOLE1BQU07NEJBQ04sTUFBTTs2QkFDTixNQUFNO3lCQUNOLE1BQU07NkJBQ04sTUFBTTs4QkFDTixNQUFNOzBCQUNOLE1BQU07NkJBQ04sTUFBTTsrQkFDTixNQUFNOzJCQUNOLE1BQU07K0JBQ04sTUFBTTsyQkFDTixNQUFNO29DQUNOLE1BQU07eUJBQ04sTUFBTTtrQ0FDTixNQUFNOytCQUNOLE1BQU07OEJBQ04sTUFBTTtrQ0FHTixLQUFLO2tDQUNMLEtBQUs7cUNBQ0wsS0FBSzt5Q0FDTCxLQUFLOzJDQUNMLEtBQUs7c0NBQ0wsS0FBSzt1Q0FDTCxLQUFLO3NDQUNMLEtBQUs7cUNBQ0wsS0FBSzt1Q0FDTCxLQUFLO2dDQUNMLEtBQUs7bUNBQ0wsS0FBSzsrQkFDTCxLQUFLO3NDQUNMLEtBQUs7b0NBQ0wsS0FBSzttQ0FDTCxLQUFLO21DQUNMLEtBQUs7c0NBQ0wsS0FBSztzQ0FDTCxLQUFLO29DQUNMLEtBQUs7Z0NBQ0wsS0FBSzs4QkFDTCxLQUFLO3FDQUNMLEtBQUs7Z0NBQ0wsS0FBSztpQ0FDTCxLQUFLOzhCQUNMLEtBQUs7O0lBK0hWLDJCQUFDO0NBQUEsQUFwbUJELElBb21CQztTQWhtQlksb0JBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBBbmd1bGFyIHdyYXBwZXIgZm9yIEJyeW50dW0gR3JpZFxuICovXG5cbmltcG9ydCB7IENvbXBvbmVudCwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBPbkRlc3Ryb3ksIE9uSW5pdCwgT3V0cHV0LCBJbnB1dCwgU2ltcGxlQ2hhbmdlLCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgV3JhcHBlckhlbHBlciBmcm9tICcuL3dyYXBwZXIuaGVscGVyJztcblxuLy8gQnJ5bnR1bSAnc2NoZWR1bGVyLmxpdGUudW1kJyBidW5kbGUgY29tZXMgd2l0aG91dCBwb2x5ZmlsbHMgdG8gc3VwcG9ydCBBbmd1bGFyJ3Mgem9uZS5qc1xuaW1wb3J0IHsgQmFzZSwgQ2VsbEVkaXQsIENlbGxFZGl0Q29uZmlnLCBDZWxsTWVudSwgQ2VsbE1lbnVDb25maWcsIENlbGxUb29sdGlwLCBDZWxsVG9vbHRpcENvbmZpZywgQ29sdW1uQXV0b1dpZHRoLCBDb2x1bW5BdXRvV2lkdGhDb25maWcsIENvbHVtbkRyYWdUb29sYmFyLCBDb2x1bW5EcmFnVG9vbGJhckNvbmZpZywgQ29sdW1uUGlja2VyLCBDb2x1bW5QaWNrZXJDb25maWcsIENvbHVtblJlb3JkZXIsIENvbHVtblJlb3JkZXJDb25maWcsIENvbHVtblJlc2l6ZSwgQ29sdW1uUmVzaXplQ29uZmlnLCBDb250ZXh0TWVudSwgQ29udGV4dE1lbnVDb25maWcsIEZpbHRlciwgRmlsdGVyQmFyLCBGaWx0ZXJCYXJDb25maWcsIEZpbHRlckNvbmZpZywgR3JpZEV4Y2VsRXhwb3J0ZXIsIEdyaWRFeGNlbEV4cG9ydGVyQ29uZmlnLCBHcmlkRmVhdHVyZXNDb25maWdUeXBlLCBHcmlkR3JvdXBTdW1tYXJ5LCBHcmlkR3JvdXBTdW1tYXJ5Q29uZmlnLCBHcmlkUGRmRXhwb3J0LCBHcmlkUGRmRXhwb3J0Q29uZmlnLCBHcmlkU3VtbWFyeSwgR3JpZFN1bW1hcnlDb25maWcsIEdyb3VwLCBHcm91cENvbmZpZywgSGVhZGVyTWVudSwgSGVhZGVyTWVudUNvbmZpZywgTGF5b3V0LCBNYXNrLCBNYXNrQ29uZmlnLCBNb2RlbCwgUGFuZWxIZWFkZXIsIFF1aWNrRmluZCwgUXVpY2tGaW5kQ29uZmlnLCBSZWN0YW5nbGUsIFJlZ2lvblJlc2l6ZSwgUmVnaW9uUmVzaXplQ29uZmlnLCBSb3dDb3B5UGFzdGUsIFJvd0NvcHlQYXN0ZUNvbmZpZywgUm93UmVvcmRlciwgUm93UmVvcmRlckNvbmZpZywgU2Nyb2xsTWFuYWdlciwgU2Nyb2xsTWFuYWdlckNvbmZpZywgU2Nyb2xsZXIsIFNjcm9sbGVyQ29uZmlnLCBTZWFyY2gsIFNlYXJjaENvbmZpZywgU29ydCwgU29ydENvbmZpZywgU3RpY2t5Q2VsbHMsIFN0aWNreUNlbGxzQ29uZmlnLCBTdG9yZSwgU3RvcmVDb25maWcsIFN0cmlwZSwgU3RyaXBlQ29uZmlnLCBUcmVlLCBUcmVlQ29uZmlnLCBXaWRnZXQsIFdpZGdldENvbmZpZyB9IGZyb20gJ0BicnludHVtL3NjaGVkdWxlci9zY2hlZHVsZXIubGl0ZS51bWQuanMnO1xuaW1wb3J0IHsgR3JpZCwgU3RyaW5nSGVscGVyLCBXaWRnZXRIZWxwZXIgfSBmcm9tICdAYnJ5bnR1bS9zY2hlZHVsZXIvc2NoZWR1bGVyLmxpdGUudW1kLmpzJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3IgOiAnYnJ5bnR1bS1ncmlkJyxcbiAgICB0ZW1wbGF0ZSA6ICcnXG59KVxuZXhwb3J0IGNsYXNzIEJyeW50dW1HcmlkQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuXG4gICAgcHVibGljIHN0YXRpYyBpbnN0YW5jZUNsYXNzID0gR3JpZDtcblxuICAgIHByaXZhdGUgc3RhdGljIGJyeW50dW1GZWF0dXJlTmFtZXM6IHN0cmluZ1tdID0gW1xuICAgICAgICAnY2VsbEVkaXRGZWF0dXJlJyxcbiAgICAgICAgJ2NlbGxNZW51RmVhdHVyZScsXG4gICAgICAgICdjZWxsVG9vbHRpcEZlYXR1cmUnLFxuICAgICAgICAnY29sdW1uQXV0b1dpZHRoRmVhdHVyZScsXG4gICAgICAgICdjb2x1bW5EcmFnVG9vbGJhckZlYXR1cmUnLFxuICAgICAgICAnY29sdW1uUGlja2VyRmVhdHVyZScsXG4gICAgICAgICdjb2x1bW5SZW9yZGVyRmVhdHVyZScsXG4gICAgICAgICdjb2x1bW5SZXNpemVGZWF0dXJlJyxcbiAgICAgICAgJ2NvbnRleHRNZW51RmVhdHVyZScsXG4gICAgICAgICdleGNlbEV4cG9ydGVyRmVhdHVyZScsXG4gICAgICAgICdmaWx0ZXJGZWF0dXJlJyxcbiAgICAgICAgJ2ZpbHRlckJhckZlYXR1cmUnLFxuICAgICAgICAnZ3JvdXBGZWF0dXJlJyxcbiAgICAgICAgJ2dyb3VwU3VtbWFyeUZlYXR1cmUnLFxuICAgICAgICAnaGVhZGVyTWVudUZlYXR1cmUnLFxuICAgICAgICAncGRmRXhwb3J0RmVhdHVyZScsXG4gICAgICAgICdxdWlja0ZpbmRGZWF0dXJlJyxcbiAgICAgICAgJ3JlZ2lvblJlc2l6ZUZlYXR1cmUnLFxuICAgICAgICAncm93Q29weVBhc3RlRmVhdHVyZScsXG4gICAgICAgICdyb3dSZW9yZGVyRmVhdHVyZScsXG4gICAgICAgICdzZWFyY2hGZWF0dXJlJyxcbiAgICAgICAgJ3NvcnRGZWF0dXJlJyxcbiAgICAgICAgJ3N0aWNreUNlbGxzRmVhdHVyZScsXG4gICAgICAgICdzdHJpcGVGZWF0dXJlJyxcbiAgICAgICAgJ3N1bW1hcnlGZWF0dXJlJyxcbiAgICAgICAgJ3RyZWVGZWF0dXJlJ1xuICAgIF07XG5cbiAgICBwcml2YXRlIHN0YXRpYyBicnludHVtQ29uZmlnczogc3RyaW5nW10gPSBCcnludHVtR3JpZENvbXBvbmVudC5icnludHVtRmVhdHVyZU5hbWVzLmNvbmNhdChbXG4gICAgICAgICdhZG9wdCcsXG4gICAgICAgICdhbGlnbicsXG4gICAgICAgICdhbGlnblNlbGYnLFxuICAgICAgICAnYW5jaG9yJyxcbiAgICAgICAgJ2FuaW1hdGVSZW1vdmluZ1Jvd3MnLFxuICAgICAgICAnYXBwZW5kVG8nLFxuICAgICAgICAnYXV0b0hlaWdodCcsXG4gICAgICAgICdiYmFyJyxcbiAgICAgICAgJ2JvZHlDbHMnLFxuICAgICAgICAnYnViYmxlRXZlbnRzJyxcbiAgICAgICAgJ2NlbnRlcmVkJyxcbiAgICAgICAgJ2NscycsXG4gICAgICAgICdjb2x1bW5MaW5lcycsXG4gICAgICAgICdjb2x1bW5zJyxcbiAgICAgICAgJ2NvbmZpZycsXG4gICAgICAgICdjb25zdHJhaW5UbycsXG4gICAgICAgICdjb250ZW50JyxcbiAgICAgICAgJ2NvbnRlbnRFbGVtZW50Q2xzJyxcbiAgICAgICAgJ2NvbnRleHRNZW51VHJpZ2dlckV2ZW50JyxcbiAgICAgICAgJ2RhdGEnLFxuICAgICAgICAnZGF0YXNldCcsXG4gICAgICAgICdkZWZhdWx0QmluZFByb3BlcnR5JyxcbiAgICAgICAgJ2RlZmF1bHRSZWdpb24nLFxuICAgICAgICAnZGVmYXVsdHMnLFxuICAgICAgICAnZGVzdHJveVN0b3JlJyxcbiAgICAgICAgJ2Rpc2FibGVkJyxcbiAgICAgICAgJ2Rpc2FibGVHcmlkUm93TW9kZWxXYXJuaW5nJyxcbiAgICAgICAgJ2RvY2snLFxuICAgICAgICAnZHJhZ2dhYmxlJyxcbiAgICAgICAgJ2VtcHR5VGV4dCcsXG4gICAgICAgICdlbmFibGVTdGlja3knLFxuICAgICAgICAnZW5hYmxlVGV4dFNlbGVjdGlvbicsXG4gICAgICAgICdlbmFibGVVbmRvUmVkb0tleXMnLFxuICAgICAgICAnZXh0cmFEYXRhJyxcbiAgICAgICAgJ2ZlYXR1cmVzJyxcbiAgICAgICAgJ2ZpbGxMYXN0Q29sdW1uJyxcbiAgICAgICAgJ2ZpeGVkUm93SGVpZ2h0JyxcbiAgICAgICAgJ2ZsZXgnLFxuICAgICAgICAnZmxvYXRpbmcnLFxuICAgICAgICAnZm9vdGVyJyxcbiAgICAgICAgJ2Z1bGxSb3dSZWZyZXNoJyxcbiAgICAgICAgJ2dldFJvd0hlaWdodCcsXG4gICAgICAgICdoZWFkZXInLFxuICAgICAgICAnaGVpZ2h0JyxcbiAgICAgICAgJ2hpZGRlbicsXG4gICAgICAgICdoaWRlQW5pbWF0aW9uJyxcbiAgICAgICAgJ2hpZGVIZWFkZXJzJyxcbiAgICAgICAgJ2hpZGVXaGVuRW1wdHknLFxuICAgICAgICAnaHRtbCcsXG4gICAgICAgICdodG1sQ2xzJyxcbiAgICAgICAgJ2lkJyxcbiAgICAgICAgJ2luc2VydEJlZm9yZScsXG4gICAgICAgICdpbnNlcnRGaXJzdCcsXG4gICAgICAgICdpdGVtQ2xzJyxcbiAgICAgICAgJ2l0ZW1zJyxcbiAgICAgICAgJ2xheW91dCcsXG4gICAgICAgICdsYXlvdXRTdHlsZScsXG4gICAgICAgICdsYXp5SXRlbXMnLFxuICAgICAgICAnbGlzdGVuZXJzJyxcbiAgICAgICAgJ2xvYWRNYXNrJyxcbiAgICAgICAgJ2xvYWRNYXNrRGVmYXVsdHMnLFxuICAgICAgICAnbG9hZE1hc2tFcnJvcicsXG4gICAgICAgICdsb2NhbGVDbGFzcycsXG4gICAgICAgICdsb2NhbGl6YWJsZVByb3BlcnRpZXMnLFxuICAgICAgICAnbG9uZ1ByZXNzVGltZScsXG4gICAgICAgICdtYXJnaW4nLFxuICAgICAgICAnbWFza0RlZmF1bHRzJyxcbiAgICAgICAgJ21hc2tlZCcsXG4gICAgICAgICdtYXhIZWlnaHQnLFxuICAgICAgICAnbWF4V2lkdGgnLFxuICAgICAgICAnbWluSGVpZ2h0JyxcbiAgICAgICAgJ21pbldpZHRoJyxcbiAgICAgICAgJ21vbml0b3JSZXNpemUnLFxuICAgICAgICAnbmFtZWRJdGVtcycsXG4gICAgICAgICdvd25lcicsXG4gICAgICAgICdwbHVnaW5zJyxcbiAgICAgICAgJ3Bvc2l0aW9uZWQnLFxuICAgICAgICAncHJlc2VydmVGb2N1c09uRGF0YXNldENoYW5nZScsXG4gICAgICAgICdwcmVzZXJ2ZVNjcm9sbE9uRGF0YXNldENoYW5nZScsXG4gICAgICAgICdwcmV2ZW50VG9vbHRpcE9uVG91Y2gnLFxuICAgICAgICAncmVhZE9ubHknLFxuICAgICAgICAncmVzaXplVG9GaXRJbmNsdWRlc0hlYWRlcicsXG4gICAgICAgICdyZXNwb25zaXZlTGV2ZWxzJyxcbiAgICAgICAgJ3JpcHBsZScsXG4gICAgICAgICdyb290RWxlbWVudCcsXG4gICAgICAgICdyb3dIZWlnaHQnLFxuICAgICAgICAnc2Nyb2xsYWJsZScsXG4gICAgICAgICdzY3JvbGxBY3Rpb24nLFxuICAgICAgICAnc2Nyb2xsZXJDbGFzcycsXG4gICAgICAgICdzY3JvbGxNYW5hZ2VyJyxcbiAgICAgICAgJ3NlbGVjdGlvbk1vZGUnLFxuICAgICAgICAnc2hvd0FuaW1hdGlvbicsXG4gICAgICAgICdzaG93RGlydHknLFxuICAgICAgICAnc2hvd1JlbW92ZVJvd0luQ29udGV4dE1lbnUnLFxuICAgICAgICAnc3RvcmUnLFxuICAgICAgICAnc3RyaXBzJyxcbiAgICAgICAgJ3N1YkdyaWRDb25maWdzJyxcbiAgICAgICAgJ3N5bmNNYXNrJyxcbiAgICAgICAgJ3RhYicsXG4gICAgICAgICd0YWcnLFxuICAgICAgICAndGJhcicsXG4gICAgICAgICd0ZXh0QWxpZ24nLFxuICAgICAgICAndGV4dENvbnRlbnQnLFxuICAgICAgICAndGl0bGUnLFxuICAgICAgICAndG9vbHMnLFxuICAgICAgICAndG9vbHRpcCcsXG4gICAgICAgICd0cmFuc2l0aW9uRHVyYXRpb24nLFxuICAgICAgICAndHJhcEZvY3VzJyxcbiAgICAgICAgJ3dlaWdodCcsXG4gICAgICAgICd3aWR0aCcsXG4gICAgICAgICd4JyxcbiAgICAgICAgJ3knXG4gICAgXSk7XG5cbiAgICBwcml2YXRlIHN0YXRpYyBicnludHVtQ29uZmlnc09ubHk6IHN0cmluZ1tdID0gW1xuICAgICAgICAnYWRvcHQnLFxuICAgICAgICAnYWxpZ24nLFxuICAgICAgICAnYW5jaG9yJyxcbiAgICAgICAgJ2FuaW1hdGVSZW1vdmluZ1Jvd3MnLFxuICAgICAgICAnYXBwZW5kVG8nLFxuICAgICAgICAnYXV0b0hlaWdodCcsXG4gICAgICAgICdiYmFyJyxcbiAgICAgICAgJ2JvZHlDbHMnLFxuICAgICAgICAnYnViYmxlRXZlbnRzJyxcbiAgICAgICAgJ2NlbnRlcmVkJyxcbiAgICAgICAgJ2NscycsXG4gICAgICAgICdjb2x1bW5zJyxcbiAgICAgICAgJ2NvbmZpZycsXG4gICAgICAgICdjb25zdHJhaW5UbycsXG4gICAgICAgICdjb250ZW50RWxlbWVudENscycsXG4gICAgICAgICdjb250ZXh0TWVudVRyaWdnZXJFdmVudCcsXG4gICAgICAgICdkZWZhdWx0QmluZFByb3BlcnR5JyxcbiAgICAgICAgJ2RlZmF1bHRSZWdpb24nLFxuICAgICAgICAnZGVmYXVsdHMnLFxuICAgICAgICAnZGVzdHJveVN0b3JlJyxcbiAgICAgICAgJ2Rpc2FibGVHcmlkUm93TW9kZWxXYXJuaW5nJyxcbiAgICAgICAgJ2RvY2snLFxuICAgICAgICAnZHJhZ2dhYmxlJyxcbiAgICAgICAgJ2VtcHR5VGV4dCcsXG4gICAgICAgICdlbmFibGVTdGlja3knLFxuICAgICAgICAnZW5hYmxlVGV4dFNlbGVjdGlvbicsXG4gICAgICAgICdlbmFibGVVbmRvUmVkb0tleXMnLFxuICAgICAgICAnZmVhdHVyZXMnLFxuICAgICAgICAnZmlsbExhc3RDb2x1bW4nLFxuICAgICAgICAnZml4ZWRSb3dIZWlnaHQnLFxuICAgICAgICAnZmxvYXRpbmcnLFxuICAgICAgICAnZm9vdGVyJyxcbiAgICAgICAgJ2Z1bGxSb3dSZWZyZXNoJyxcbiAgICAgICAgJ2dldFJvd0hlaWdodCcsXG4gICAgICAgICdoZWFkZXInLFxuICAgICAgICAnaGlkZUFuaW1hdGlvbicsXG4gICAgICAgICdoaWRlSGVhZGVycycsXG4gICAgICAgICdoaWRlV2hlbkVtcHR5JyxcbiAgICAgICAgJ2h0bWxDbHMnLFxuICAgICAgICAnaW5zZXJ0QmVmb3JlJyxcbiAgICAgICAgJ2luc2VydEZpcnN0JyxcbiAgICAgICAgJ2l0ZW1DbHMnLFxuICAgICAgICAnbGF6eUl0ZW1zJyxcbiAgICAgICAgJ2xpc3RlbmVycycsXG4gICAgICAgICdsb2FkTWFzaycsXG4gICAgICAgICdsb2FkTWFza0RlZmF1bHRzJyxcbiAgICAgICAgJ2xvYWRNYXNrRXJyb3InLFxuICAgICAgICAnbG9jYWxlQ2xhc3MnLFxuICAgICAgICAnbG9jYWxpemFibGVQcm9wZXJ0aWVzJyxcbiAgICAgICAgJ2xvbmdQcmVzc1RpbWUnLFxuICAgICAgICAnbWFza0RlZmF1bHRzJyxcbiAgICAgICAgJ21hc2tlZCcsXG4gICAgICAgICdtb25pdG9yUmVzaXplJyxcbiAgICAgICAgJ25hbWVkSXRlbXMnLFxuICAgICAgICAnb3duZXInLFxuICAgICAgICAncGx1Z2lucycsXG4gICAgICAgICdwb3NpdGlvbmVkJyxcbiAgICAgICAgJ3ByZXNlcnZlRm9jdXNPbkRhdGFzZXRDaGFuZ2UnLFxuICAgICAgICAncHJlc2VydmVTY3JvbGxPbkRhdGFzZXRDaGFuZ2UnLFxuICAgICAgICAncHJldmVudFRvb2x0aXBPblRvdWNoJyxcbiAgICAgICAgJ3Jlc2l6ZVRvRml0SW5jbHVkZXNIZWFkZXInLFxuICAgICAgICAncmVzcG9uc2l2ZUxldmVscycsXG4gICAgICAgICdyaXBwbGUnLFxuICAgICAgICAncm9vdEVsZW1lbnQnLFxuICAgICAgICAnc2Nyb2xsQWN0aW9uJyxcbiAgICAgICAgJ3Njcm9sbGVyQ2xhc3MnLFxuICAgICAgICAnc2Nyb2xsTWFuYWdlcicsXG4gICAgICAgICdzZWxlY3Rpb25Nb2RlJyxcbiAgICAgICAgJ3Nob3dBbmltYXRpb24nLFxuICAgICAgICAnc2hvd0RpcnR5JyxcbiAgICAgICAgJ3Nob3dSZW1vdmVSb3dJbkNvbnRleHRNZW51JyxcbiAgICAgICAgJ3N0cmlwcycsXG4gICAgICAgICdzdWJHcmlkQ29uZmlncycsXG4gICAgICAgICdzeW5jTWFzaycsXG4gICAgICAgICd0YWInLFxuICAgICAgICAndGFnJyxcbiAgICAgICAgJ3RiYXInLFxuICAgICAgICAndGV4dEFsaWduJyxcbiAgICAgICAgJ3RleHRDb250ZW50JyxcbiAgICAgICAgJ3RpdGxlJyxcbiAgICAgICAgJ3RyYXBGb2N1cycsXG4gICAgICAgICd3ZWlnaHQnXG4gICAgXTtcblxuICAgIHByaXZhdGUgc3RhdGljIGJyeW50dW1Qcm9wczogc3RyaW5nW10gPSBCcnludHVtR3JpZENvbXBvbmVudC5icnludHVtRmVhdHVyZU5hbWVzLmNvbmNhdChbXG4gICAgICAgICdhbGlnblNlbGYnLFxuICAgICAgICAnYW5jaG9yU2l6ZScsXG4gICAgICAgICdjb2x1bW5MaW5lcycsXG4gICAgICAgICdjb250ZW50JyxcbiAgICAgICAgJ2RhdGEnLFxuICAgICAgICAnZGF0YXNldCcsXG4gICAgICAgICdkaXNhYmxlZCcsXG4gICAgICAgICdleHRyYURhdGEnLFxuICAgICAgICAnZmxleCcsXG4gICAgICAgICdoZWlnaHQnLFxuICAgICAgICAnaGlkZGVuJyxcbiAgICAgICAgJ2h0bWwnLFxuICAgICAgICAnaWQnLFxuICAgICAgICAnaXNTZXR0aW5nVmFsdWVzJyxcbiAgICAgICAgJ2lzVmFsaWQnLFxuICAgICAgICAnaXRlbXMnLFxuICAgICAgICAnbGF5b3V0JyxcbiAgICAgICAgJ2xheW91dFN0eWxlJyxcbiAgICAgICAgJ21hcmdpbicsXG4gICAgICAgICdtYXhIZWlnaHQnLFxuICAgICAgICAnbWF4V2lkdGgnLFxuICAgICAgICAnbWluSGVpZ2h0JyxcbiAgICAgICAgJ21pbldpZHRoJyxcbiAgICAgICAgJ3JlYWRPbmx5JyxcbiAgICAgICAgJ3JlY29yZCcsXG4gICAgICAgICdyb3dIZWlnaHQnLFxuICAgICAgICAnc2Nyb2xsYWJsZScsXG4gICAgICAgICdzZWxlY3RlZENlbGwnLFxuICAgICAgICAnc2VsZWN0ZWRSZWNvcmQnLFxuICAgICAgICAnc2VsZWN0ZWRSZWNvcmRzJyxcbiAgICAgICAgJ3N0YXRlJyxcbiAgICAgICAgJ3N0b3JlJyxcbiAgICAgICAgJ3Rvb2xzJyxcbiAgICAgICAgJ3Rvb2x0aXAnLFxuICAgICAgICAndHJhbnNpdGlvbkR1cmF0aW9uJyxcbiAgICAgICAgJ3ZhbHVlcycsXG4gICAgICAgICd3aWR0aCcsXG4gICAgICAgICd4JyxcbiAgICAgICAgJ3knXG4gICAgXSk7XG5cbiAgICBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY7XG4gICAgcHVibGljIGluc3RhbmNlOiBHcmlkO1xuXG4gICAgcHJpdmF0ZSBicnludHVtQ29uZmlnID0ge1xuICAgICAgICBhbmd1bGFyQ29tcG9uZW50IDogdGhpcyxcbiAgICAgICAgYWRvcHQgICAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgbGlzdGVuZXJzICAgICAgICA6IHt9LFxuICAgICAgICBmZWF0dXJlcyAgICAgICAgIDoge31cbiAgICB9O1xuXG4gICAgY29uc3RydWN0b3IoZWxlbWVudDogRWxlbWVudFJlZikge1xuICAgICAgICB0aGlzLmVsZW1lbnRSZWYgPSBlbGVtZW50O1xuICAgIH1cblxuICAgICAvLyBDb25maWdzIG9ubHlcbiAgICBASW5wdXQoKSBhZG9wdCAgICAgICAgICAgICAgICAgICAgICAgICA6IEhUTUxFbGVtZW50fHN0cmluZztcbiAgICBASW5wdXQoKSBhbGlnbiAgICAgICAgICAgICAgICAgICAgICAgICA6IG9iamVjdHxzdHJpbmc7XG4gICAgQElucHV0KCkgYW5jaG9yICAgICAgICAgICAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGFuaW1hdGVSZW1vdmluZ1Jvd3MgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBhcHBlbmRUbyAgICAgICAgICAgICAgICAgICAgICA6IEhUTUxFbGVtZW50fHN0cmluZztcbiAgICBASW5wdXQoKSBhdXRvSGVpZ2h0ICAgICAgICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgYmJhciAgICAgICAgICAgICAgICAgICAgICAgICAgOiBvYmplY3RbXXxvYmplY3Q7XG4gICAgQElucHV0KCkgYm9keUNscyAgICAgICAgICAgICAgICAgICAgICAgOiBzdHJpbmd8b2JqZWN0O1xuICAgIEBJbnB1dCgpIGJ1YmJsZUV2ZW50cyAgICAgICAgICAgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIGNlbnRlcmVkICAgICAgICAgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBjbHMgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHN0cmluZ3xvYmplY3Q7XG4gICAgQElucHV0KCkgY29sdW1ucyAgICAgICAgICAgICAgICAgICAgICAgOiBvYmplY3RbXXxvYmplY3Q7XG4gICAgQElucHV0KCkgY29uZmlnICAgICAgICAgICAgICAgICAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgY29uc3RyYWluVG8gICAgICAgICAgICAgICAgICAgOiBIVE1MRWxlbWVudHxXaWRnZXR8UmVjdGFuZ2xlO1xuICAgIEBJbnB1dCgpIGNvbnRlbnRFbGVtZW50Q2xzICAgICAgICAgICAgIDogc3RyaW5nfG9iamVjdDtcbiAgICBASW5wdXQoKSBjb250ZXh0TWVudVRyaWdnZXJFdmVudCAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBkZWZhdWx0QmluZFByb3BlcnR5ICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBkZWZhdWx0UmVnaW9uICAgICAgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBkZWZhdWx0cyAgICAgICAgICAgICAgICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBkZXN0cm95U3RvcmUgICAgICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgZGlzYWJsZUdyaWRSb3dNb2RlbFdhcm5pbmcgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGRvY2sgICAgICAgICAgICAgICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGRyYWdnYWJsZSAgICAgICAgICAgICAgICAgICAgIDogYm9vbGVhbnxvYmplY3Q7XG4gICAgQElucHV0KCkgZW1wdHlUZXh0ICAgICAgICAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgZW5hYmxlU3RpY2t5ICAgICAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGVuYWJsZVRleHRTZWxlY3Rpb24gICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBlbmFibGVVbmRvUmVkb0tleXMgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgZmVhdHVyZXMgICAgICAgICAgICAgICAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgZmlsbExhc3RDb2x1bW4gICAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGZpeGVkUm93SGVpZ2h0ICAgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBmbG9hdGluZyAgICAgICAgICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgZm9vdGVyICAgICAgICAgICAgICAgICAgICAgICAgOiBvYmplY3R8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGZ1bGxSb3dSZWZyZXNoICAgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBnZXRSb3dIZWlnaHQgICAgICAgICAgICAgICAgICA6IEZ1bmN0aW9uO1xuICAgIEBJbnB1dCgpIGhlYWRlciAgICAgICAgICAgICAgICAgICAgICAgIDogc3RyaW5nfFBhbmVsSGVhZGVyO1xuICAgIEBJbnB1dCgpIGhpZGVBbmltYXRpb24gICAgICAgICAgICAgICAgIDogYm9vbGVhbnxvYmplY3Q7XG4gICAgQElucHV0KCkgaGlkZUhlYWRlcnMgICAgICAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGhpZGVXaGVuRW1wdHkgICAgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBodG1sQ2xzICAgICAgICAgICAgICAgICAgICAgICA6IHN0cmluZ3xvYmplY3Q7XG4gICAgQElucHV0KCkgaW5zZXJ0QmVmb3JlICAgICAgICAgICAgICAgICAgOiBIVE1MRWxlbWVudHxzdHJpbmc7XG4gICAgQElucHV0KCkgaW5zZXJ0Rmlyc3QgICAgICAgICAgICAgICAgICAgOiBIVE1MRWxlbWVudHxzdHJpbmc7XG4gICAgQElucHV0KCkgaXRlbUNscyAgICAgICAgICAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgbGF6eUl0ZW1zICAgICAgICAgICAgICAgICAgICAgOiBvYmplY3R8b2JqZWN0W118V2lkZ2V0W118UGFydGlhbDxXaWRnZXRDb25maWc+fFBhcnRpYWw8V2lkZ2V0Q29uZmlnPltdO1xuICAgIEBJbnB1dCgpIGxpc3RlbmVycyAgICAgICAgICAgICAgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIGxvYWRNYXNrICAgICAgICAgICAgICAgICAgICAgIDogc3RyaW5nfG9iamVjdHxudWxsO1xuICAgIEBJbnB1dCgpIGxvYWRNYXNrRGVmYXVsdHMgICAgICAgICAgICAgIDogb2JqZWN0fE1hc2t8UGFydGlhbDxNYXNrQ29uZmlnPjtcbiAgICBASW5wdXQoKSBsb2FkTWFza0Vycm9yICAgICAgICAgICAgICAgICA6IG9iamVjdHxNYXNrfFBhcnRpYWw8TWFza0NvbmZpZz47XG4gICAgQElucHV0KCkgbG9jYWxlQ2xhc3MgICAgICAgICAgICAgICAgICAgOiBCYXNlO1xuICAgIEBJbnB1dCgpIGxvY2FsaXphYmxlUHJvcGVydGllcyAgICAgICAgIDogc3RyaW5nW107XG4gICAgQElucHV0KCkgbG9uZ1ByZXNzVGltZSAgICAgICAgICAgICAgICAgOiBudW1iZXI7XG4gICAgQElucHV0KCkgbWFza0RlZmF1bHRzICAgICAgICAgICAgICAgICAgOiBvYmplY3R8TWFza3xQYXJ0aWFsPE1hc2tDb25maWc+O1xuICAgIEBJbnB1dCgpIG1hc2tlZCAgICAgICAgICAgICAgICAgICAgICAgIDogYm9vbGVhbnxzdHJpbmd8b2JqZWN0fE1hc2t8UGFydGlhbDxNYXNrQ29uZmlnPjtcbiAgICBASW5wdXQoKSBtb25pdG9yUmVzaXplICAgICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgbmFtZWRJdGVtcyAgICAgICAgICAgICAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgb3duZXIgICAgICAgICAgICAgICAgICAgICAgICAgOiBXaWRnZXQ7XG4gICAgQElucHV0KCkgcGx1Z2lucyAgICAgICAgICAgICAgICAgICAgICAgOiBGdW5jdGlvbltdO1xuICAgIEBJbnB1dCgpIHBvc2l0aW9uZWQgICAgICAgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBwcmVzZXJ2ZUZvY3VzT25EYXRhc2V0Q2hhbmdlICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgcHJlc2VydmVTY3JvbGxPbkRhdGFzZXRDaGFuZ2UgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHByZXZlbnRUb29sdGlwT25Ub3VjaCAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSByZXNpemVUb0ZpdEluY2x1ZGVzSGVhZGVyICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgcmVzcG9uc2l2ZUxldmVscyAgICAgICAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgcmlwcGxlICAgICAgICAgICAgICAgICAgICAgICAgOiBib29sZWFufG9iamVjdDtcbiAgICBASW5wdXQoKSByb290RWxlbWVudCAgICAgICAgICAgICAgICAgICA6IFNoYWRvd1Jvb3Q7XG4gICAgQElucHV0KCkgc2Nyb2xsQWN0aW9uICAgICAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgc2Nyb2xsZXJDbGFzcyAgICAgICAgICAgICAgICAgOiBTY3JvbGxlcjtcbiAgICBASW5wdXQoKSBzY3JvbGxNYW5hZ2VyICAgICAgICAgICAgICAgICA6IG9iamVjdHxTY3JvbGxNYW5hZ2VyfFBhcnRpYWw8U2Nyb2xsTWFuYWdlckNvbmZpZz47XG4gICAgQElucHV0KCkgc2VsZWN0aW9uTW9kZSAgICAgICAgICAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgc2hvd0FuaW1hdGlvbiAgICAgICAgICAgICAgICAgOiBib29sZWFufG9iamVjdDtcbiAgICBASW5wdXQoKSBzaG93RGlydHkgICAgICAgICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgc2hvd1JlbW92ZVJvd0luQ29udGV4dE1lbnUgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHN0cmlwcyAgICAgICAgICAgICAgICAgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIHN1YkdyaWRDb25maWdzICAgICAgICAgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIHN5bmNNYXNrICAgICAgICAgICAgICAgICAgICAgIDogc3RyaW5nfG9iamVjdHxudWxsO1xuICAgIEBJbnB1dCgpIHRhYiAgICAgICAgICAgICAgICAgICAgICAgICAgIDogYm9vbGVhbnxvYmplY3Q7XG4gICAgQElucHV0KCkgdGFnICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgdGJhciAgICAgICAgICAgICAgICAgICAgICAgICAgOiBvYmplY3RbXXxvYmplY3Q7XG4gICAgQElucHV0KCkgdGV4dEFsaWduICAgICAgICAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgdGV4dENvbnRlbnQgICAgICAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHRpdGxlICAgICAgICAgICAgICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIHRyYXBGb2N1cyAgICAgICAgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSB3ZWlnaHQgICAgICAgICAgICAgICAgICAgICAgICA6IG51bWJlcjtcblxuICAgICAvLyBDb25maWdzIGFuZCBwcm9wZXJ0aWVzXG4gICAgQElucHV0KCkgYWxpZ25TZWxmICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGNvbHVtbkxpbmVzICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgY29udGVudCAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGRhdGEgICAgICAgICAgICAgICA6IG9iamVjdFtdO1xuICAgIEBJbnB1dCgpIGRhdGFzZXQgICAgICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBkaXNhYmxlZCAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGV4dHJhRGF0YSAgICAgICAgICA6IGJvb2xlYW58bnVtYmVyfG9iamVjdHxzdHJpbmc7XG4gICAgQElucHV0KCkgZmxleCAgICAgICAgICAgICAgIDogbnVtYmVyfHN0cmluZztcbiAgICBASW5wdXQoKSBoZWlnaHQgICAgICAgICAgICAgOiBudW1iZXJ8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGhpZGRlbiAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgaHRtbCAgICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGlkICAgICAgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBpdGVtcyAgICAgICAgICAgICAgOiBXaWRnZXRbXXxvYmplY3R8b2JqZWN0W118UGFydGlhbDxXaWRnZXRDb25maWc+fFBhcnRpYWw8V2lkZ2V0Q29uZmlnPltdO1xuICAgIEBJbnB1dCgpIGxheW91dCAgICAgICAgICAgICA6IExheW91dHxzdHJpbmc7XG4gICAgQElucHV0KCkgbGF5b3V0U3R5bGUgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIG1hcmdpbiAgICAgICAgICAgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgbWF4SGVpZ2h0ICAgICAgICAgIDogbnVtYmVyfHN0cmluZztcbiAgICBASW5wdXQoKSBtYXhXaWR0aCAgICAgICAgICAgOiBudW1iZXJ8c3RyaW5nO1xuICAgIEBJbnB1dCgpIG1pbkhlaWdodCAgICAgICAgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgbWluV2lkdGggICAgICAgICAgIDogbnVtYmVyfHN0cmluZztcbiAgICBASW5wdXQoKSByZWFkT25seSAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHJvd0hlaWdodCAgICAgICAgICA6IG51bWJlcjtcbiAgICBASW5wdXQoKSBzY3JvbGxhYmxlICAgICAgICAgOiBib29sZWFufFNjcm9sbGVyfG9iamVjdHxQYXJ0aWFsPFNjcm9sbGVyQ29uZmlnPjtcbiAgICBASW5wdXQoKSBzdG9yZSAgICAgICAgICAgICAgOiBTdG9yZXxvYmplY3R8UGFydGlhbDxTdG9yZUNvbmZpZz47XG4gICAgQElucHV0KCkgdG9vbHMgICAgICAgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIHRvb2x0aXAgICAgICAgICAgICA6IG9iamVjdHxzdHJpbmc7XG4gICAgQElucHV0KCkgdHJhbnNpdGlvbkR1cmF0aW9uIDogbnVtYmVyO1xuICAgIEBJbnB1dCgpIHdpZHRoICAgICAgICAgICAgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgeCAgICAgICAgICAgICAgICAgIDogbnVtYmVyO1xuICAgIEBJbnB1dCgpIHkgICAgICAgICAgICAgICAgICA6IG51bWJlcjtcblxuICAgICAvLyBQcm9wZXJ0aWVzIG9ubHlcbiAgICBASW5wdXQoKSBhbmNob3JTaXplICAgICAgOiBudW1iZXJbXTtcbiAgICBASW5wdXQoKSBpc1NldHRpbmdWYWx1ZXMgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGlzVmFsaWQgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgcmVjb3JkICAgICAgICAgIDogTW9kZWw7XG4gICAgQElucHV0KCkgc2VsZWN0ZWRDZWxsICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIHNlbGVjdGVkUmVjb3JkICA6IE1vZGVsO1xuICAgIEBJbnB1dCgpIHNlbGVjdGVkUmVjb3JkcyA6IE1vZGVsW118bnVtYmVyW107XG4gICAgQElucHV0KCkgc3RhdGUgICAgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIHZhbHVlcyAgICAgICAgICA6IG9iamVjdDtcblxuICAgICAvLyBFdmVudHNcbiAgICBAT3V0cHV0KCkgb25CZWZvcmVDZWxsRWRpdFN0YXJ0ICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkJlZm9yZURlc3Ryb3kgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uQmVmb3JlRXhwb3J0ICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25CZWZvcmVGaW5pc2hDZWxsRWRpdCA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkJlZm9yZUhpZGUgICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uQmVmb3JlUmVuZGVyUm93cyAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25CZWZvcmVTZXRSZWNvcmQgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkJlZm9yZVNob3cgICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uQmVmb3JlVG9nZ2xlTm9kZSAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25DYW5jZWxDZWxsRWRpdCAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkNhdGNoQWxsICAgICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uQ2VsbENsaWNrICAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25DZWxsQ29udGV4dE1lbnUgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkNlbGxEYmxDbGljayAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uQ2VsbE1vdXNlT3V0ICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25DZWxsTW91c2VPdmVyICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkNvbGxhcHNlTm9kZSAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uRGVzdHJveSAgICAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25FeHBhbmROb2RlICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkV4cG9ydCAgICAgICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uRmluaXNoQ2VsbEVkaXQgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25Gb2N1c0luICAgICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkZvY3VzT3V0ICAgICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uSGlkZSAgICAgICAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25Nb3VzZU91dCAgICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbk1vdXNlT3ZlciAgICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uUGFpbnQgICAgICAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25SZWFkT25seSAgICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvblJlbmRlclJvd3MgICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uUmVzaXplICAgICAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25SZXNwb25zaXZlICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvblNjcm9sbCAgICAgICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uU2VsZWN0aW9uQ2hhbmdlICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25TaG93ICAgICAgICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvblN0YXJ0Q2VsbEVkaXQgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uVG9nZ2xlTm9kZSAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25Ub29sQ2xpY2sgICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuXG4gICAgIC8vIEZlYXR1cmVzXG4gICAgQElucHV0KCkgY2VsbEVkaXRGZWF0dXJlICAgOiBvYmplY3R8Ym9vbGVhbnxzdHJpbmd8Q2VsbEVkaXR8UGFydGlhbDxDZWxsRWRpdENvbmZpZz47XG4gICAgQElucHV0KCkgY2VsbE1lbnVGZWF0dXJlICAgOiBvYmplY3R8Ym9vbGVhbnxzdHJpbmd8Q2VsbE1lbnV8UGFydGlhbDxDZWxsTWVudUNvbmZpZz47XG4gICAgQElucHV0KCkgY2VsbFRvb2x0aXBGZWF0dXJlIDogb2JqZWN0fGJvb2xlYW58c3RyaW5nfENlbGxUb29sdGlwfFBhcnRpYWw8Q2VsbFRvb2x0aXBDb25maWc+O1xuICAgIEBJbnB1dCgpIGNvbHVtbkF1dG9XaWR0aEZlYXR1cmUgOiBvYmplY3R8Ym9vbGVhbnxzdHJpbmd8Q29sdW1uQXV0b1dpZHRofFBhcnRpYWw8Q29sdW1uQXV0b1dpZHRoQ29uZmlnPjtcbiAgICBASW5wdXQoKSBjb2x1bW5EcmFnVG9vbGJhckZlYXR1cmUgOiBvYmplY3R8Ym9vbGVhbnxzdHJpbmd8Q29sdW1uRHJhZ1Rvb2xiYXJ8UGFydGlhbDxDb2x1bW5EcmFnVG9vbGJhckNvbmZpZz47XG4gICAgQElucHV0KCkgY29sdW1uUGlja2VyRmVhdHVyZSA6IG9iamVjdHxib29sZWFufHN0cmluZ3xDb2x1bW5QaWNrZXJ8UGFydGlhbDxDb2x1bW5QaWNrZXJDb25maWc+O1xuICAgIEBJbnB1dCgpIGNvbHVtblJlb3JkZXJGZWF0dXJlIDogb2JqZWN0fGJvb2xlYW58c3RyaW5nfENvbHVtblJlb3JkZXJ8UGFydGlhbDxDb2x1bW5SZW9yZGVyQ29uZmlnPjtcbiAgICBASW5wdXQoKSBjb2x1bW5SZXNpemVGZWF0dXJlIDogb2JqZWN0fGJvb2xlYW58c3RyaW5nfENvbHVtblJlc2l6ZXxQYXJ0aWFsPENvbHVtblJlc2l6ZUNvbmZpZz47XG4gICAgQElucHV0KCkgY29udGV4dE1lbnVGZWF0dXJlIDogb2JqZWN0fGJvb2xlYW58c3RyaW5nfENvbnRleHRNZW51fFBhcnRpYWw8Q29udGV4dE1lbnVDb25maWc+O1xuICAgIEBJbnB1dCgpIGV4Y2VsRXhwb3J0ZXJGZWF0dXJlIDogb2JqZWN0fGJvb2xlYW58c3RyaW5nfEdyaWRFeGNlbEV4cG9ydGVyfFBhcnRpYWw8R3JpZEV4Y2VsRXhwb3J0ZXJDb25maWc+O1xuICAgIEBJbnB1dCgpIGZpbHRlckZlYXR1cmUgICAgIDogb2JqZWN0fGJvb2xlYW58c3RyaW5nfEZpbHRlcnxQYXJ0aWFsPEZpbHRlckNvbmZpZz47XG4gICAgQElucHV0KCkgZmlsdGVyQmFyRmVhdHVyZSAgOiBvYmplY3R8Ym9vbGVhbnxzdHJpbmd8RmlsdGVyQmFyfFBhcnRpYWw8RmlsdGVyQmFyQ29uZmlnPjtcbiAgICBASW5wdXQoKSBncm91cEZlYXR1cmUgICAgICA6IG9iamVjdHxib29sZWFufHN0cmluZ3xHcm91cHxQYXJ0aWFsPEdyb3VwQ29uZmlnPjtcbiAgICBASW5wdXQoKSBncm91cFN1bW1hcnlGZWF0dXJlIDogb2JqZWN0fGJvb2xlYW58c3RyaW5nfEdyaWRHcm91cFN1bW1hcnl8UGFydGlhbDxHcmlkR3JvdXBTdW1tYXJ5Q29uZmlnPjtcbiAgICBASW5wdXQoKSBoZWFkZXJNZW51RmVhdHVyZSA6IG9iamVjdHxib29sZWFufHN0cmluZ3xIZWFkZXJNZW51fFBhcnRpYWw8SGVhZGVyTWVudUNvbmZpZz47XG4gICAgQElucHV0KCkgcGRmRXhwb3J0RmVhdHVyZSAgOiBvYmplY3R8Ym9vbGVhbnxzdHJpbmd8R3JpZFBkZkV4cG9ydHxQYXJ0aWFsPEdyaWRQZGZFeHBvcnRDb25maWc+O1xuICAgIEBJbnB1dCgpIHF1aWNrRmluZEZlYXR1cmUgIDogb2JqZWN0fGJvb2xlYW58c3RyaW5nfFF1aWNrRmluZHxQYXJ0aWFsPFF1aWNrRmluZENvbmZpZz47XG4gICAgQElucHV0KCkgcmVnaW9uUmVzaXplRmVhdHVyZSA6IG9iamVjdHxib29sZWFufHN0cmluZ3xSZWdpb25SZXNpemV8UGFydGlhbDxSZWdpb25SZXNpemVDb25maWc+O1xuICAgIEBJbnB1dCgpIHJvd0NvcHlQYXN0ZUZlYXR1cmUgOiBvYmplY3R8Ym9vbGVhbnxzdHJpbmd8Um93Q29weVBhc3RlfFBhcnRpYWw8Um93Q29weVBhc3RlQ29uZmlnPjtcbiAgICBASW5wdXQoKSByb3dSZW9yZGVyRmVhdHVyZSA6IG9iamVjdHxib29sZWFufHN0cmluZ3xSb3dSZW9yZGVyfFBhcnRpYWw8Um93UmVvcmRlckNvbmZpZz47XG4gICAgQElucHV0KCkgc2VhcmNoRmVhdHVyZSAgICAgOiBvYmplY3R8Ym9vbGVhbnxzdHJpbmd8U2VhcmNofFBhcnRpYWw8U2VhcmNoQ29uZmlnPjtcbiAgICBASW5wdXQoKSBzb3J0RmVhdHVyZSAgICAgICA6IG9iamVjdHxib29sZWFufHN0cmluZ3xTb3J0fFBhcnRpYWw8U29ydENvbmZpZz47XG4gICAgQElucHV0KCkgc3RpY2t5Q2VsbHNGZWF0dXJlIDogb2JqZWN0fGJvb2xlYW58c3RyaW5nfFN0aWNreUNlbGxzfFBhcnRpYWw8U3RpY2t5Q2VsbHNDb25maWc+O1xuICAgIEBJbnB1dCgpIHN0cmlwZUZlYXR1cmUgICAgIDogb2JqZWN0fGJvb2xlYW58c3RyaW5nfFN0cmlwZXxQYXJ0aWFsPFN0cmlwZUNvbmZpZz47XG4gICAgQElucHV0KCkgc3VtbWFyeUZlYXR1cmUgICAgOiBvYmplY3R8Ym9vbGVhbnxzdHJpbmd8R3JpZFN1bW1hcnl8UGFydGlhbDxHcmlkU3VtbWFyeUNvbmZpZz47XG4gICAgQElucHV0KCkgdHJlZUZlYXR1cmUgICAgICAgOiBvYmplY3R8Ym9vbGVhbnxzdHJpbmd8VHJlZXxQYXJ0aWFsPFRyZWVDb25maWc+O1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGFuZCBhcHBlbmQgdGhlIHVuZGVybHlpbmcgd2lkZ2V0XG4gICAgICovXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0XG4gICAgICAgICAgICBtZSA9IHRoaXMsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZWxlbWVudFJlZixcbiAgICAgICAgICAgICAgICBicnludHVtQ29uZmlnXG4gICAgICAgICAgICB9ID0gbWUsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaW5zdGFuY2VDbGFzcyxcbiAgICAgICAgICAgICAgICBicnludHVtQ29uZmlnc1xuICAgICAgICAgICAgfSA9IEJyeW50dW1HcmlkQ29tcG9uZW50O1xuXG4gICAgICAgIE9iamVjdC5hc3NpZ24oYnJ5bnR1bUNvbmZpZywge1xuICAgICAgICAgICAgbGlzdGVuZXJzIDoge1xuICAgICAgICAgICAgICAgIGJlZm9yZUNlbGxFZGl0U3RhcnQoZXZlbnQgOiBhbnkpIHsgbWUub25CZWZvcmVDZWxsRWRpdFN0YXJ0LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGJlZm9yZURlc3Ryb3koZXZlbnQgOiBhbnkpIHsgbWUub25CZWZvcmVEZXN0cm95LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGJlZm9yZUV4cG9ydChldmVudCA6IGFueSkgeyBtZS5vbkJlZm9yZUV4cG9ydC5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBiZWZvcmVGaW5pc2hDZWxsRWRpdChldmVudCA6IGFueSkgeyBtZS5vbkJlZm9yZUZpbmlzaENlbGxFZGl0LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGJlZm9yZUhpZGUoZXZlbnQgOiBhbnkpIHsgbWUub25CZWZvcmVIaWRlLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGJlZm9yZVJlbmRlclJvd3MoZXZlbnQgOiBhbnkpIHsgbWUub25CZWZvcmVSZW5kZXJSb3dzLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGJlZm9yZVNldFJlY29yZChldmVudCA6IGFueSkgeyBtZS5vbkJlZm9yZVNldFJlY29yZC5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBiZWZvcmVTaG93KGV2ZW50IDogYW55KSB7IG1lLm9uQmVmb3JlU2hvdy5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBiZWZvcmVUb2dnbGVOb2RlKGV2ZW50IDogYW55KSB7IG1lLm9uQmVmb3JlVG9nZ2xlTm9kZS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBjYW5jZWxDZWxsRWRpdChldmVudCA6IGFueSkgeyBtZS5vbkNhbmNlbENlbGxFZGl0LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGNhdGNoQWxsKGV2ZW50IDogYW55KSB7IG1lLm9uQ2F0Y2hBbGwuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgY2VsbENsaWNrKGV2ZW50IDogYW55KSB7IG1lLm9uQ2VsbENsaWNrLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGNlbGxDb250ZXh0TWVudShldmVudCA6IGFueSkgeyBtZS5vbkNlbGxDb250ZXh0TWVudS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBjZWxsRGJsQ2xpY2soZXZlbnQgOiBhbnkpIHsgbWUub25DZWxsRGJsQ2xpY2suZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgY2VsbE1vdXNlT3V0KGV2ZW50IDogYW55KSB7IG1lLm9uQ2VsbE1vdXNlT3V0LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGNlbGxNb3VzZU92ZXIoZXZlbnQgOiBhbnkpIHsgbWUub25DZWxsTW91c2VPdmVyLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGNvbGxhcHNlTm9kZShldmVudCA6IGFueSkgeyBtZS5vbkNvbGxhcHNlTm9kZS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBkZXN0cm95KGV2ZW50IDogYW55KSB7IG1lLm9uRGVzdHJveS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBleHBhbmROb2RlKGV2ZW50IDogYW55KSB7IG1lLm9uRXhwYW5kTm9kZS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBleHBvcnQoZXZlbnQgOiBhbnkpIHsgbWUub25FeHBvcnQuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgZmluaXNoQ2VsbEVkaXQoZXZlbnQgOiBhbnkpIHsgbWUub25GaW5pc2hDZWxsRWRpdC5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBmb2N1c0luKGV2ZW50IDogYW55KSB7IG1lLm9uRm9jdXNJbi5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBmb2N1c091dChldmVudCA6IGFueSkgeyBtZS5vbkZvY3VzT3V0LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGhpZGUoZXZlbnQgOiBhbnkpIHsgbWUub25IaWRlLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIG1vdXNlT3V0KGV2ZW50IDogYW55KSB7IG1lLm9uTW91c2VPdXQuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgbW91c2VPdmVyKGV2ZW50IDogYW55KSB7IG1lLm9uTW91c2VPdmVyLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIHBhaW50KGV2ZW50IDogYW55KSB7IG1lLm9uUGFpbnQuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgcmVhZE9ubHkoZXZlbnQgOiBhbnkpIHsgbWUub25SZWFkT25seS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICByZW5kZXJSb3dzKGV2ZW50IDogYW55KSB7IG1lLm9uUmVuZGVyUm93cy5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICByZXNpemUoZXZlbnQgOiBhbnkpIHsgbWUub25SZXNpemUuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgcmVzcG9uc2l2ZShldmVudCA6IGFueSkgeyBtZS5vblJlc3BvbnNpdmUuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgc2Nyb2xsKGV2ZW50IDogYW55KSB7IG1lLm9uU2Nyb2xsLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIHNlbGVjdGlvbkNoYW5nZShldmVudCA6IGFueSkgeyBtZS5vblNlbGVjdGlvbkNoYW5nZS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBzaG93KGV2ZW50IDogYW55KSB7IG1lLm9uU2hvdy5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBzdGFydENlbGxFZGl0KGV2ZW50IDogYW55KSB7IG1lLm9uU3RhcnRDZWxsRWRpdC5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICB0b2dnbGVOb2RlKGV2ZW50IDogYW55KSB7IG1lLm9uVG9nZ2xlTm9kZS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICB0b29sQ2xpY2soZXZlbnQgOiBhbnkpIHsgbWUub25Ub29sQ2xpY2suZW1pdChldmVudCk7IH0sXG5cbiAgICAgICAgICAgICAgICB0aGlzT2JqIDogbWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gSWYgY29tcG9uZW50IGhhcyBubyBjb250YWluZXIgc3BlY2lmaWVkIGluIGNvbmZpZyB0aGVuIHVzZSBhZG9wdCB0byBXcmFwcGVyJ3MgZWxlbWVudFxuICAgICAgICBjb25zdFxuICAgICAgICAgICAgY29udGFpbmVyUGFyYW0gPSBbXG4gICAgICAgICAgICAgICAgJ2Fkb3B0JyxcbiAgICAgICAgICAgICAgICAnYXBwZW5kVG8nLFxuICAgICAgICAgICAgICAgICdpbnNlcnRBZnRlcicsXG4gICAgICAgICAgICAgICAgJ2luc2VydEJlZm9yZSdcbiAgICAgICAgICAgIF0uZmluZChwcm9wID0+IGJyeW50dW1Db25maWdbcHJvcF0pO1xuICAgICAgICBpZiAoIWNvbnRhaW5lclBhcmFtKSB7XG4gICAgICAgICAgICBicnludHVtQ29uZmlnLmFkb3B0ID0gZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgV3JhcHBlckhlbHBlci5kZXZXYXJuaW5nQ29udGFpbmVyKGluc3RhbmNlQ2xhc3MuJG5hbWUsIGNvbnRhaW5lclBhcmFtKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJyeW50dW1Db25maWdzLmZpbHRlcihwcm9wID0+IHByb3AgaW4gdGhpcykuZm9yRWFjaChwcm9wID0+IHtcbiAgICAgICAgICAgIFdyYXBwZXJIZWxwZXIuYXBwbHlQcm9wVmFsdWUoYnJ5bnR1bUNvbmZpZywgcHJvcCwgdGhpc1twcm9wXSk7XG4gICAgICAgICAgICBpZiAoWydmZWF0dXJlcycsICdjb25maWcnXS5pbmNsdWRlcyhwcm9wKSkge1xuICAgICAgICAgICAgICAgIFdyYXBwZXJIZWxwZXIuZGV2V2FybmluZ0NvbmZpZ1Byb3AoaW5zdGFuY2VDbGFzcy4kbmFtZSwgcHJvcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgbWUuaW5zdGFuY2UgPSBpbnN0YW5jZUNsYXNzLiRuYW1lID09PSAnV2lkZ2V0JyA/IFdpZGdldEhlbHBlci5jcmVhdGVXaWRnZXQoYnJ5bnR1bUNvbmZpZykgOiBuZXcgaW5zdGFuY2VDbGFzcyhicnludHVtQ29uZmlnKTtcblxuICAgICAgICAvLyBCYWNrd2FyZHMgY29tcGF0aWJpbGl0eSBmb3IgZ3JpZEluc3RhbmNlLCBzY2hlZHVsZXJJbnN0YW5jZSBldGMuXG4gICAgICAgIG1lW1N0cmluZ0hlbHBlci51bmNhcGl0YWxpemUoaW5zdGFuY2VDbGFzcy4kbmFtZSkgKyAnSW5zdGFuY2UnXSA9IG1lLmluc3RhbmNlO1xuICAgICAgICAvLyBcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBXYXRjaCBmb3IgY2hhbmdlc1xuICAgICAqIEBwYXJhbSBjaGFuZ2VzXG4gICAgICovXG4gICAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgICAgICBjb25zdFxuICAgICAgICAgICAgeyBpbnN0YW5jZSB9ID0gdGhpcyxcbiAgICAgICAgICAgIHsgaW5zdGFuY2VDbGFzcyB9ID0gQnJ5bnR1bUdyaWRDb21wb25lbnQ7XG5cbiAgICAgICAgaWYgKCFpbnN0YW5jZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSXRlcmF0ZSBvdmVyIGFsbCBjaGFuZ2VzXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKGNoYW5nZXMpLmZvckVhY2goKFtwcm9wLCBjaGFuZ2VdKSA9PiB7XG4gICAgICAgICAgICBjb25zdFxuICAgICAgICAgICAgICAgIG5ld1ZhbHVlID0gKGNoYW5nZSBhcyBTaW1wbGVDaGFuZ2UpLmN1cnJlbnRWYWx1ZSxcbiAgICAgICAgICAgICAgICB7IGluc3RhbmNlIH0gPSB0aGlzLFxuICAgICAgICAgICAgICAgIHsgYnJ5bnR1bUNvbmZpZ3NPbmx5LCBicnludHVtUHJvcHMgfSA9IEJyeW50dW1HcmlkQ29tcG9uZW50O1xuICAgICAgICAgICAgaWYgKGJyeW50dW1Qcm9wcy5pbmNsdWRlcyhwcm9wKSkge1xuICAgICAgICAgICAgICAgIFdyYXBwZXJIZWxwZXIuYXBwbHlQcm9wVmFsdWUoaW5zdGFuY2UsIHByb3AsIG5ld1ZhbHVlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgaWYgKGJyeW50dW1Db25maWdzT25seS5pbmNsdWRlcyhwcm9wKSkge1xuICAgICAgICAgICAgICAgICAgICBXcmFwcGVySGVscGVyLmRldldhcm5pbmdVcGRhdGVQcm9wKGluc3RhbmNlQ2xhc3MuJG5hbWUsIHByb3ApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGVzdHJveSB0aGUgY29tcG9uZW50XG4gICAgICovXG4gICAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmluc3RhbmNlKSB7XG4gICAgICAgICAgICB0aGlzLmluc3RhbmNlLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==