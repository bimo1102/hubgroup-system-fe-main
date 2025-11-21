/**
 * Angular wrapper for Bryntum DatePicker
 */
import { Component, ElementRef, EventEmitter, Output, Input } from '@angular/core';
import WrapperHelper from './wrapper.helper';
// Bryntum 'scheduler.lite.umd' bundle comes without polyfills to support Angular's zone.js
import { Base, Model, Widget } from '@bryntum/scheduler/scheduler.lite.umd.js';
import { DatePicker, WidgetHelper } from '@bryntum/scheduler/scheduler.lite.umd.js';
export class BryntumDatePickerComponent {
    constructor(element) {
        this.bryntumConfig = {
            angularComponent: this,
            adopt: undefined,
            listeners: {},
            features: {}
        };
        // Events
        this.onBeforeDestroy = new EventEmitter();
        this.onBeforeHide = new EventEmitter();
        this.onBeforeSetRecord = new EventEmitter();
        this.onBeforeShow = new EventEmitter();
        this.onCatchAll = new EventEmitter();
        this.onDateChange = new EventEmitter();
        this.onDestroy = new EventEmitter();
        this.onFocusIn = new EventEmitter();
        this.onFocusOut = new EventEmitter();
        this.onHide = new EventEmitter();
        this.onPaint = new EventEmitter();
        this.onReadOnly = new EventEmitter();
        this.onRefresh = new EventEmitter();
        this.onResize = new EventEmitter();
        this.onSelectionChange = new EventEmitter();
        this.onShow = new EventEmitter();
        this.onToolClick = new EventEmitter();
        this.elementRef = element;
    }
    /**
     * Create and append the underlying widget
     */
    ngOnInit() {
        const me = this, { elementRef, bryntumConfig } = me, { instanceClass, bryntumConfigs } = BryntumDatePickerComponent;
        Object.assign(bryntumConfig, {
            listeners: {
                beforeDestroy(event) { me.onBeforeDestroy.emit(event); },
                beforeHide(event) { me.onBeforeHide.emit(event); },
                beforeSetRecord(event) { me.onBeforeSetRecord.emit(event); },
                beforeShow(event) { me.onBeforeShow.emit(event); },
                catchAll(event) { me.onCatchAll.emit(event); },
                dateChange(event) { me.onDateChange.emit(event); },
                destroy(event) { me.onDestroy.emit(event); },
                focusIn(event) { me.onFocusIn.emit(event); },
                focusOut(event) { me.onFocusOut.emit(event); },
                hide(event) { me.onHide.emit(event); },
                paint(event) { me.onPaint.emit(event); },
                readOnly(event) { me.onReadOnly.emit(event); },
                refresh(event) { me.onRefresh.emit(event); },
                resize(event) { me.onResize.emit(event); },
                selectionChange(event) { me.onSelectionChange.emit(event); },
                show(event) { me.onShow.emit(event); },
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
    }
    /**
     * Watch for changes
     * @param changes
     */
    ngOnChanges(changes) {
        const { instance } = this, { instanceClass } = BryntumDatePickerComponent;
        if (!instance) {
            return;
        }
        // Iterate over all changes
        Object.entries(changes).forEach(([prop, change]) => {
            const newValue = change.currentValue, { instance } = this, { bryntumConfigsOnly, bryntumProps } = BryntumDatePickerComponent;
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
BryntumDatePickerComponent.instanceClass = DatePicker;
BryntumDatePickerComponent.bryntumFeatureNames = [];
BryntumDatePickerComponent.bryntumConfigs = BryntumDatePickerComponent.bryntumFeatureNames.concat([
    'activeDate',
    'adopt',
    'align',
    'alignSelf',
    'anchor',
    'appendTo',
    'bbar',
    'bodyCls',
    'bubbleEvents',
    'cellRenderer',
    'centered',
    'cls',
    'config',
    'constrainTo',
    'content',
    'contentElementCls',
    'dataset',
    'date',
    'dayNameFormat',
    'defaultBindProperty',
    'defaults',
    'disabled',
    'disabledDates',
    'disableWeekends',
    'dock',
    'draggable',
    'editMonth',
    'editOnHover',
    'extraData',
    'flex',
    'floating',
    'focusDisabledDates',
    'footer',
    'header',
    'headerRenderer',
    'height',
    'hidden',
    'hideAnimation',
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
    'localeClass',
    'localizableProperties',
    'margin',
    'maskDefaults',
    'masked',
    'maxDate',
    'maxHeight',
    'maxWidth',
    'minColumnWidth',
    'minDate',
    'minHeight',
    'minRowHeight',
    'minWidth',
    'monitorResize',
    'month',
    'multiSelect',
    'namedItems',
    'nonWorkingDays',
    'owner',
    'positioned',
    'preventTooltipOnTouch',
    'readOnly',
    'ripple',
    'rootElement',
    'scrollable',
    'scrollAction',
    'showAnimation',
    'showWeekColumn',
    'showWeekNumber',
    'sixWeeks',
    'strips',
    'tab',
    'tag',
    'tbar',
    'textAlign',
    'textContent',
    'tip',
    'title',
    'tools',
    'tooltip',
    'trapFocus',
    'weekRenderer',
    'weekStartDay',
    'weight',
    'width',
    'x',
    'y'
]);
BryntumDatePickerComponent.bryntumConfigsOnly = [
    'activeDate',
    'adopt',
    'align',
    'anchor',
    'appendTo',
    'bbar',
    'bodyCls',
    'bubbleEvents',
    'cellRenderer',
    'centered',
    'cls',
    'config',
    'constrainTo',
    'contentElementCls',
    'dayNameFormat',
    'defaultBindProperty',
    'defaults',
    'disabledDates',
    'disableWeekends',
    'dock',
    'draggable',
    'editMonth',
    'editOnHover',
    'floating',
    'focusDisabledDates',
    'footer',
    'header',
    'headerRenderer',
    'hideAnimation',
    'hideWhenEmpty',
    'htmlCls',
    'insertBefore',
    'insertFirst',
    'itemCls',
    'lazyItems',
    'listeners',
    'localeClass',
    'localizableProperties',
    'maskDefaults',
    'masked',
    'maxDate',
    'minColumnWidth',
    'minDate',
    'minRowHeight',
    'monitorResize',
    'month',
    'multiSelect',
    'namedItems',
    'nonWorkingDays',
    'owner',
    'positioned',
    'preventTooltipOnTouch',
    'ripple',
    'rootElement',
    'scrollAction',
    'showAnimation',
    'showWeekColumn',
    'showWeekNumber',
    'sixWeeks',
    'strips',
    'tab',
    'tag',
    'tbar',
    'textAlign',
    'textContent',
    'tip',
    'title',
    'trapFocus',
    'weekRenderer',
    'weekStartDay',
    'weight'
];
BryntumDatePickerComponent.bryntumProps = BryntumDatePickerComponent.bryntumFeatureNames.concat([
    'alignSelf',
    'anchorSize',
    'content',
    'dataset',
    'date',
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
    'scrollable',
    'tools',
    'tooltip',
    'values',
    'width',
    'x',
    'y'
]);
BryntumDatePickerComponent.decorators = [
    { type: Component, args: [{
                selector: 'bryntum-date-picker',
                template: ''
            }] }
];
/** @nocollapse */
BryntumDatePickerComponent.ctorParameters = () => [
    { type: ElementRef }
];
BryntumDatePickerComponent.propDecorators = {
    activeDate: [{ type: Input }],
    adopt: [{ type: Input }],
    align: [{ type: Input }],
    anchor: [{ type: Input }],
    appendTo: [{ type: Input }],
    bbar: [{ type: Input }],
    bodyCls: [{ type: Input }],
    bubbleEvents: [{ type: Input }],
    cellRenderer: [{ type: Input }],
    centered: [{ type: Input }],
    cls: [{ type: Input }],
    config: [{ type: Input }],
    constrainTo: [{ type: Input }],
    contentElementCls: [{ type: Input }],
    dayNameFormat: [{ type: Input }],
    defaultBindProperty: [{ type: Input }],
    defaults: [{ type: Input }],
    disabledDates: [{ type: Input }],
    disableWeekends: [{ type: Input }],
    dock: [{ type: Input }],
    draggable: [{ type: Input }],
    editMonth: [{ type: Input }],
    editOnHover: [{ type: Input }],
    floating: [{ type: Input }],
    focusDisabledDates: [{ type: Input }],
    footer: [{ type: Input }],
    header: [{ type: Input }],
    headerRenderer: [{ type: Input }],
    hideAnimation: [{ type: Input }],
    hideWhenEmpty: [{ type: Input }],
    htmlCls: [{ type: Input }],
    insertBefore: [{ type: Input }],
    insertFirst: [{ type: Input }],
    itemCls: [{ type: Input }],
    lazyItems: [{ type: Input }],
    listeners: [{ type: Input }],
    localeClass: [{ type: Input }],
    localizableProperties: [{ type: Input }],
    maskDefaults: [{ type: Input }],
    masked: [{ type: Input }],
    maxDate: [{ type: Input }],
    minColumnWidth: [{ type: Input }],
    minDate: [{ type: Input }],
    minRowHeight: [{ type: Input }],
    monitorResize: [{ type: Input }],
    month: [{ type: Input }],
    multiSelect: [{ type: Input }],
    namedItems: [{ type: Input }],
    nonWorkingDays: [{ type: Input }],
    owner: [{ type: Input }],
    positioned: [{ type: Input }],
    preventTooltipOnTouch: [{ type: Input }],
    ripple: [{ type: Input }],
    rootElement: [{ type: Input }],
    scrollAction: [{ type: Input }],
    showAnimation: [{ type: Input }],
    showWeekColumn: [{ type: Input }],
    showWeekNumber: [{ type: Input }],
    sixWeeks: [{ type: Input }],
    strips: [{ type: Input }],
    tab: [{ type: Input }],
    tag: [{ type: Input }],
    tbar: [{ type: Input }],
    textAlign: [{ type: Input }],
    textContent: [{ type: Input }],
    tip: [{ type: Input }],
    title: [{ type: Input }],
    trapFocus: [{ type: Input }],
    weekRenderer: [{ type: Input }],
    weekStartDay: [{ type: Input }],
    weight: [{ type: Input }],
    alignSelf: [{ type: Input }],
    content: [{ type: Input }],
    dataset: [{ type: Input }],
    date: [{ type: Input }],
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
    scrollable: [{ type: Input }],
    tools: [{ type: Input }],
    tooltip: [{ type: Input }],
    width: [{ type: Input }],
    x: [{ type: Input }],
    y: [{ type: Input }],
    anchorSize: [{ type: Input }],
    isSettingValues: [{ type: Input }],
    isValid: [{ type: Input }],
    record: [{ type: Input }],
    values: [{ type: Input }],
    onBeforeDestroy: [{ type: Output }],
    onBeforeHide: [{ type: Output }],
    onBeforeSetRecord: [{ type: Output }],
    onBeforeShow: [{ type: Output }],
    onCatchAll: [{ type: Output }],
    onDateChange: [{ type: Output }],
    onDestroy: [{ type: Output }],
    onFocusIn: [{ type: Output }],
    onFocusOut: [{ type: Output }],
    onHide: [{ type: Output }],
    onPaint: [{ type: Output }],
    onReadOnly: [{ type: Output }],
    onRefresh: [{ type: Output }],
    onResize: [{ type: Output }],
    onSelectionChange: [{ type: Output }],
    onShow: [{ type: Output }],
    onToolClick: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJ5bnR1bS1kYXRlLXBpY2tlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYnJ5bnR1bS9zY2hlZHVsZXItYW5ndWxhci8iLCJzb3VyY2VzIjpbImxpYi9icnludHVtLWRhdGUtcGlja2VyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7R0FFRztBQUVILE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBcUIsTUFBTSxFQUFFLEtBQUssRUFBK0IsTUFBTSxlQUFlLENBQUM7QUFDbkksT0FBTyxhQUFhLE1BQU0sa0JBQWtCLENBQUM7QUFFN0MsMkZBQTJGO0FBQzNGLE9BQU8sRUFBRSxJQUFJLEVBQTRCLEtBQUssRUFBd0UsTUFBTSxFQUFnQixNQUFNLDBDQUEwQyxDQUFDO0FBQzdMLE9BQU8sRUFBRSxVQUFVLEVBQWdCLFlBQVksRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBTWxHLE1BQU0sT0FBTywwQkFBMEI7SUFrT25DLFlBQVksT0FBbUI7UUFQdkIsa0JBQWEsR0FBRztZQUNwQixnQkFBZ0IsRUFBRyxJQUFJO1lBQ3ZCLEtBQUssRUFBYyxTQUFTO1lBQzVCLFNBQVMsRUFBVSxFQUFFO1lBQ3JCLFFBQVEsRUFBVyxFQUFFO1NBQ3hCLENBQUM7UUFrSEQsU0FBUztRQUNBLG9CQUFlLEdBQUssSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUMvQyxpQkFBWSxHQUFRLElBQUksWUFBWSxFQUFVLENBQUM7UUFDL0Msc0JBQWlCLEdBQUcsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUMvQyxpQkFBWSxHQUFRLElBQUksWUFBWSxFQUFVLENBQUM7UUFDL0MsZUFBVSxHQUFVLElBQUksWUFBWSxFQUFVLENBQUM7UUFDL0MsaUJBQVksR0FBUSxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQy9DLGNBQVMsR0FBVyxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQy9DLGNBQVMsR0FBVyxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQy9D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LCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEFuZ3VsYXIgd3JhcHBlciBmb3IgQnJ5bnR1bSBEYXRlUGlja2VyXG4gKi9cblxuaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIE9uRGVzdHJveSwgT25Jbml0LCBPdXRwdXQsIElucHV0LCBTaW1wbGVDaGFuZ2UsIFNpbXBsZUNoYW5nZXMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCBXcmFwcGVySGVscGVyIGZyb20gJy4vd3JhcHBlci5oZWxwZXInO1xuXG4vLyBCcnludHVtICdzY2hlZHVsZXIubGl0ZS51bWQnIGJ1bmRsZSBjb21lcyB3aXRob3V0IHBvbHlmaWxscyB0byBzdXBwb3J0IEFuZ3VsYXIncyB6b25lLmpzXG5pbXBvcnQgeyBCYXNlLCBMYXlvdXQsIE1hc2ssIE1hc2tDb25maWcsIE1vZGVsLCBNb250aCwgTW9udGhDb25maWcsIFBhbmVsSGVhZGVyLCBSZWN0YW5nbGUsIFNjcm9sbGVyLCBTY3JvbGxlckNvbmZpZywgV2lkZ2V0LCBXaWRnZXRDb25maWcgfSBmcm9tICdAYnJ5bnR1bS9zY2hlZHVsZXIvc2NoZWR1bGVyLmxpdGUudW1kLmpzJztcbmltcG9ydCB7IERhdGVQaWNrZXIsIFN0cmluZ0hlbHBlciwgV2lkZ2V0SGVscGVyIH0gZnJvbSAnQGJyeW50dW0vc2NoZWR1bGVyL3NjaGVkdWxlci5saXRlLnVtZC5qcyc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yIDogJ2JyeW50dW0tZGF0ZS1waWNrZXInLFxuICAgIHRlbXBsYXRlIDogJydcbn0pXG5leHBvcnQgY2xhc3MgQnJ5bnR1bURhdGVQaWNrZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG5cbiAgICBwdWJsaWMgc3RhdGljIGluc3RhbmNlQ2xhc3MgPSBEYXRlUGlja2VyO1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bUZlYXR1cmVOYW1lczogc3RyaW5nW10gPSBbXG5cbiAgICBdO1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bUNvbmZpZ3M6IHN0cmluZ1tdID0gQnJ5bnR1bURhdGVQaWNrZXJDb21wb25lbnQuYnJ5bnR1bUZlYXR1cmVOYW1lcy5jb25jYXQoW1xuICAgICAgICAnYWN0aXZlRGF0ZScsXG4gICAgICAgICdhZG9wdCcsXG4gICAgICAgICdhbGlnbicsXG4gICAgICAgICdhbGlnblNlbGYnLFxuICAgICAgICAnYW5jaG9yJyxcbiAgICAgICAgJ2FwcGVuZFRvJyxcbiAgICAgICAgJ2JiYXInLFxuICAgICAgICAnYm9keUNscycsXG4gICAgICAgICdidWJibGVFdmVudHMnLFxuICAgICAgICAnY2VsbFJlbmRlcmVyJyxcbiAgICAgICAgJ2NlbnRlcmVkJyxcbiAgICAgICAgJ2NscycsXG4gICAgICAgICdjb25maWcnLFxuICAgICAgICAnY29uc3RyYWluVG8nLFxuICAgICAgICAnY29udGVudCcsXG4gICAgICAgICdjb250ZW50RWxlbWVudENscycsXG4gICAgICAgICdkYXRhc2V0JyxcbiAgICAgICAgJ2RhdGUnLFxuICAgICAgICAnZGF5TmFtZUZvcm1hdCcsXG4gICAgICAgICdkZWZhdWx0QmluZFByb3BlcnR5JyxcbiAgICAgICAgJ2RlZmF1bHRzJyxcbiAgICAgICAgJ2Rpc2FibGVkJyxcbiAgICAgICAgJ2Rpc2FibGVkRGF0ZXMnLFxuICAgICAgICAnZGlzYWJsZVdlZWtlbmRzJyxcbiAgICAgICAgJ2RvY2snLFxuICAgICAgICAnZHJhZ2dhYmxlJyxcbiAgICAgICAgJ2VkaXRNb250aCcsXG4gICAgICAgICdlZGl0T25Ib3ZlcicsXG4gICAgICAgICdleHRyYURhdGEnLFxuICAgICAgICAnZmxleCcsXG4gICAgICAgICdmbG9hdGluZycsXG4gICAgICAgICdmb2N1c0Rpc2FibGVkRGF0ZXMnLFxuICAgICAgICAnZm9vdGVyJyxcbiAgICAgICAgJ2hlYWRlcicsXG4gICAgICAgICdoZWFkZXJSZW5kZXJlcicsXG4gICAgICAgICdoZWlnaHQnLFxuICAgICAgICAnaGlkZGVuJyxcbiAgICAgICAgJ2hpZGVBbmltYXRpb24nLFxuICAgICAgICAnaGlkZVdoZW5FbXB0eScsXG4gICAgICAgICdodG1sJyxcbiAgICAgICAgJ2h0bWxDbHMnLFxuICAgICAgICAnaWQnLFxuICAgICAgICAnaW5zZXJ0QmVmb3JlJyxcbiAgICAgICAgJ2luc2VydEZpcnN0JyxcbiAgICAgICAgJ2l0ZW1DbHMnLFxuICAgICAgICAnaXRlbXMnLFxuICAgICAgICAnbGF5b3V0JyxcbiAgICAgICAgJ2xheW91dFN0eWxlJyxcbiAgICAgICAgJ2xhenlJdGVtcycsXG4gICAgICAgICdsaXN0ZW5lcnMnLFxuICAgICAgICAnbG9jYWxlQ2xhc3MnLFxuICAgICAgICAnbG9jYWxpemFibGVQcm9wZXJ0aWVzJyxcbiAgICAgICAgJ21hcmdpbicsXG4gICAgICAgICdtYXNrRGVmYXVsdHMnLFxuICAgICAgICAnbWFza2VkJyxcbiAgICAgICAgJ21heERhdGUnLFxuICAgICAgICAnbWF4SGVpZ2h0JyxcbiAgICAgICAgJ21heFdpZHRoJyxcbiAgICAgICAgJ21pbkNvbHVtbldpZHRoJyxcbiAgICAgICAgJ21pbkRhdGUnLFxuICAgICAgICAnbWluSGVpZ2h0JyxcbiAgICAgICAgJ21pblJvd0hlaWdodCcsXG4gICAgICAgICdtaW5XaWR0aCcsXG4gICAgICAgICdtb25pdG9yUmVzaXplJyxcbiAgICAgICAgJ21vbnRoJyxcbiAgICAgICAgJ211bHRpU2VsZWN0JyxcbiAgICAgICAgJ25hbWVkSXRlbXMnLFxuICAgICAgICAnbm9uV29ya2luZ0RheXMnLFxuICAgICAgICAnb3duZXInLFxuICAgICAgICAncG9zaXRpb25lZCcsXG4gICAgICAgICdwcmV2ZW50VG9vbHRpcE9uVG91Y2gnLFxuICAgICAgICAncmVhZE9ubHknLFxuICAgICAgICAncmlwcGxlJyxcbiAgICAgICAgJ3Jvb3RFbGVtZW50JyxcbiAgICAgICAgJ3Njcm9sbGFibGUnLFxuICAgICAgICAnc2Nyb2xsQWN0aW9uJyxcbiAgICAgICAgJ3Nob3dBbmltYXRpb24nLFxuICAgICAgICAnc2hvd1dlZWtDb2x1bW4nLFxuICAgICAgICAnc2hvd1dlZWtOdW1iZXInLFxuICAgICAgICAnc2l4V2Vla3MnLFxuICAgICAgICAnc3RyaXBzJyxcbiAgICAgICAgJ3RhYicsXG4gICAgICAgICd0YWcnLFxuICAgICAgICAndGJhcicsXG4gICAgICAgICd0ZXh0QWxpZ24nLFxuICAgICAgICAndGV4dENvbnRlbnQnLFxuICAgICAgICAndGlwJyxcbiAgICAgICAgJ3RpdGxlJyxcbiAgICAgICAgJ3Rvb2xzJyxcbiAgICAgICAgJ3Rvb2x0aXAnLFxuICAgICAgICAndHJhcEZvY3VzJyxcbiAgICAgICAgJ3dlZWtSZW5kZXJlcicsXG4gICAgICAgICd3ZWVrU3RhcnREYXknLFxuICAgICAgICAnd2VpZ2h0JyxcbiAgICAgICAgJ3dpZHRoJyxcbiAgICAgICAgJ3gnLFxuICAgICAgICAneSdcbiAgICBdKTtcblxuICAgIHByaXZhdGUgc3RhdGljIGJyeW50dW1Db25maWdzT25seTogc3RyaW5nW10gPSBbXG4gICAgICAgICdhY3RpdmVEYXRlJyxcbiAgICAgICAgJ2Fkb3B0JyxcbiAgICAgICAgJ2FsaWduJyxcbiAgICAgICAgJ2FuY2hvcicsXG4gICAgICAgICdhcHBlbmRUbycsXG4gICAgICAgICdiYmFyJyxcbiAgICAgICAgJ2JvZHlDbHMnLFxuICAgICAgICAnYnViYmxlRXZlbnRzJyxcbiAgICAgICAgJ2NlbGxSZW5kZXJlcicsXG4gICAgICAgICdjZW50ZXJlZCcsXG4gICAgICAgICdjbHMnLFxuICAgICAgICAnY29uZmlnJyxcbiAgICAgICAgJ2NvbnN0cmFpblRvJyxcbiAgICAgICAgJ2NvbnRlbnRFbGVtZW50Q2xzJyxcbiAgICAgICAgJ2RheU5hbWVGb3JtYXQnLFxuICAgICAgICAnZGVmYXVsdEJpbmRQcm9wZXJ0eScsXG4gICAgICAgICdkZWZhdWx0cycsXG4gICAgICAgICdkaXNhYmxlZERhdGVzJyxcbiAgICAgICAgJ2Rpc2FibGVXZWVrZW5kcycsXG4gICAgICAgICdkb2NrJyxcbiAgICAgICAgJ2RyYWdnYWJsZScsXG4gICAgICAgICdlZGl0TW9udGgnLFxuICAgICAgICAnZWRpdE9uSG92ZXInLFxuICAgICAgICAnZmxvYXRpbmcnLFxuICAgICAgICAnZm9jdXNEaXNhYmxlZERhdGVzJyxcbiAgICAgICAgJ2Zvb3RlcicsXG4gICAgICAgICdoZWFkZXInLFxuICAgICAgICAnaGVhZGVyUmVuZGVyZXInLFxuICAgICAgICAnaGlkZUFuaW1hdGlvbicsXG4gICAgICAgICdoaWRlV2hlbkVtcHR5JyxcbiAgICAgICAgJ2h0bWxDbHMnLFxuICAgICAgICAnaW5zZXJ0QmVmb3JlJyxcbiAgICAgICAgJ2luc2VydEZpcnN0JyxcbiAgICAgICAgJ2l0ZW1DbHMnLFxuICAgICAgICAnbGF6eUl0ZW1zJyxcbiAgICAgICAgJ2xpc3RlbmVycycsXG4gICAgICAgICdsb2NhbGVDbGFzcycsXG4gICAgICAgICdsb2NhbGl6YWJsZVByb3BlcnRpZXMnLFxuICAgICAgICAnbWFza0RlZmF1bHRzJyxcbiAgICAgICAgJ21hc2tlZCcsXG4gICAgICAgICdtYXhEYXRlJyxcbiAgICAgICAgJ21pbkNvbHVtbldpZHRoJyxcbiAgICAgICAgJ21pbkRhdGUnLFxuICAgICAgICAnbWluUm93SGVpZ2h0JyxcbiAgICAgICAgJ21vbml0b3JSZXNpemUnLFxuICAgICAgICAnbW9udGgnLFxuICAgICAgICAnbXVsdGlTZWxlY3QnLFxuICAgICAgICAnbmFtZWRJdGVtcycsXG4gICAgICAgICdub25Xb3JraW5nRGF5cycsXG4gICAgICAgICdvd25lcicsXG4gICAgICAgICdwb3NpdGlvbmVkJyxcbiAgICAgICAgJ3ByZXZlbnRUb29sdGlwT25Ub3VjaCcsXG4gICAgICAgICdyaXBwbGUnLFxuICAgICAgICAncm9vdEVsZW1lbnQnLFxuICAgICAgICAnc2Nyb2xsQWN0aW9uJyxcbiAgICAgICAgJ3Nob3dBbmltYXRpb24nLFxuICAgICAgICAnc2hvd1dlZWtDb2x1bW4nLFxuICAgICAgICAnc2hvd1dlZWtOdW1iZXInLFxuICAgICAgICAnc2l4V2Vla3MnLFxuICAgICAgICAnc3RyaXBzJyxcbiAgICAgICAgJ3RhYicsXG4gICAgICAgICd0YWcnLFxuICAgICAgICAndGJhcicsXG4gICAgICAgICd0ZXh0QWxpZ24nLFxuICAgICAgICAndGV4dENvbnRlbnQnLFxuICAgICAgICAndGlwJyxcbiAgICAgICAgJ3RpdGxlJyxcbiAgICAgICAgJ3RyYXBGb2N1cycsXG4gICAgICAgICd3ZWVrUmVuZGVyZXInLFxuICAgICAgICAnd2Vla1N0YXJ0RGF5JyxcbiAgICAgICAgJ3dlaWdodCdcbiAgICBdO1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bVByb3BzOiBzdHJpbmdbXSA9IEJyeW50dW1EYXRlUGlja2VyQ29tcG9uZW50LmJyeW50dW1GZWF0dXJlTmFtZXMuY29uY2F0KFtcbiAgICAgICAgJ2FsaWduU2VsZicsXG4gICAgICAgICdhbmNob3JTaXplJyxcbiAgICAgICAgJ2NvbnRlbnQnLFxuICAgICAgICAnZGF0YXNldCcsXG4gICAgICAgICdkYXRlJyxcbiAgICAgICAgJ2Rpc2FibGVkJyxcbiAgICAgICAgJ2V4dHJhRGF0YScsXG4gICAgICAgICdmbGV4JyxcbiAgICAgICAgJ2hlaWdodCcsXG4gICAgICAgICdoaWRkZW4nLFxuICAgICAgICAnaHRtbCcsXG4gICAgICAgICdpZCcsXG4gICAgICAgICdpc1NldHRpbmdWYWx1ZXMnLFxuICAgICAgICAnaXNWYWxpZCcsXG4gICAgICAgICdpdGVtcycsXG4gICAgICAgICdsYXlvdXQnLFxuICAgICAgICAnbGF5b3V0U3R5bGUnLFxuICAgICAgICAnbWFyZ2luJyxcbiAgICAgICAgJ21heEhlaWdodCcsXG4gICAgICAgICdtYXhXaWR0aCcsXG4gICAgICAgICdtaW5IZWlnaHQnLFxuICAgICAgICAnbWluV2lkdGgnLFxuICAgICAgICAncmVhZE9ubHknLFxuICAgICAgICAncmVjb3JkJyxcbiAgICAgICAgJ3Njcm9sbGFibGUnLFxuICAgICAgICAndG9vbHMnLFxuICAgICAgICAndG9vbHRpcCcsXG4gICAgICAgICd2YWx1ZXMnLFxuICAgICAgICAnd2lkdGgnLFxuICAgICAgICAneCcsXG4gICAgICAgICd5J1xuICAgIF0pO1xuXG4gICAgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmO1xuICAgIHB1YmxpYyBpbnN0YW5jZTogRGF0ZVBpY2tlcjtcblxuICAgIHByaXZhdGUgYnJ5bnR1bUNvbmZpZyA9IHtcbiAgICAgICAgYW5ndWxhckNvbXBvbmVudCA6IHRoaXMsXG4gICAgICAgIGFkb3B0ICAgICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgIGxpc3RlbmVycyAgICAgICAgOiB7fSxcbiAgICAgICAgZmVhdHVyZXMgICAgICAgICA6IHt9XG4gICAgfTtcblxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQ6IEVsZW1lbnRSZWYpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50UmVmID0gZWxlbWVudDtcbiAgICB9XG5cbiAgICAgLy8gQ29uZmlncyBvbmx5XG4gICAgQElucHV0KCkgYWN0aXZlRGF0ZSAgICAgICAgICAgIDogRGF0ZTtcbiAgICBASW5wdXQoKSBhZG9wdCAgICAgICAgICAgICAgICAgOiBIVE1MRWxlbWVudHxzdHJpbmc7XG4gICAgQElucHV0KCkgYWxpZ24gICAgICAgICAgICAgICAgIDogb2JqZWN0fHN0cmluZztcbiAgICBASW5wdXQoKSBhbmNob3IgICAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGFwcGVuZFRvICAgICAgICAgICAgICA6IEhUTUxFbGVtZW50fHN0cmluZztcbiAgICBASW5wdXQoKSBiYmFyICAgICAgICAgICAgICAgICAgOiBvYmplY3RbXXxvYmplY3Q7XG4gICAgQElucHV0KCkgYm9keUNscyAgICAgICAgICAgICAgIDogc3RyaW5nfG9iamVjdDtcbiAgICBASW5wdXQoKSBidWJibGVFdmVudHMgICAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgY2VsbFJlbmRlcmVyICAgICAgICAgIDogRnVuY3Rpb258c3RyaW5nO1xuICAgIEBJbnB1dCgpIGNlbnRlcmVkICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgY2xzICAgICAgICAgICAgICAgICAgIDogc3RyaW5nfG9iamVjdDtcbiAgICBASW5wdXQoKSBjb25maWcgICAgICAgICAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgY29uc3RyYWluVG8gICAgICAgICAgIDogSFRNTEVsZW1lbnR8V2lkZ2V0fFJlY3RhbmdsZTtcbiAgICBASW5wdXQoKSBjb250ZW50RWxlbWVudENscyAgICAgOiBzdHJpbmd8b2JqZWN0O1xuICAgIEBJbnB1dCgpIGRheU5hbWVGb3JtYXQgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBkZWZhdWx0QmluZFByb3BlcnR5ICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgZGVmYXVsdHMgICAgICAgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIGRpc2FibGVkRGF0ZXMgICAgICAgICA6IEZ1bmN0aW9ufERhdGVbXXxzdHJpbmc7XG4gICAgQElucHV0KCkgZGlzYWJsZVdlZWtlbmRzICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBkb2NrICAgICAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgZHJhZ2dhYmxlICAgICAgICAgICAgIDogYm9vbGVhbnxvYmplY3Q7XG4gICAgQElucHV0KCkgZWRpdE1vbnRoICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBlZGl0T25Ib3ZlciAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGZsb2F0aW5nICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgZm9jdXNEaXNhYmxlZERhdGVzICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBmb290ZXIgICAgICAgICAgICAgICAgOiBvYmplY3R8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGhlYWRlciAgICAgICAgICAgICAgICA6IHN0cmluZ3xQYW5lbEhlYWRlcjtcbiAgICBASW5wdXQoKSBoZWFkZXJSZW5kZXJlciAgICAgICAgOiBGdW5jdGlvbnxzdHJpbmc7XG4gICAgQElucHV0KCkgaGlkZUFuaW1hdGlvbiAgICAgICAgIDogYm9vbGVhbnxvYmplY3Q7XG4gICAgQElucHV0KCkgaGlkZVdoZW5FbXB0eSAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBodG1sQ2xzICAgICAgICAgICAgICAgOiBzdHJpbmd8b2JqZWN0O1xuICAgIEBJbnB1dCgpIGluc2VydEJlZm9yZSAgICAgICAgICA6IEhUTUxFbGVtZW50fHN0cmluZztcbiAgICBASW5wdXQoKSBpbnNlcnRGaXJzdCAgICAgICAgICAgOiBIVE1MRWxlbWVudHxzdHJpbmc7XG4gICAgQElucHV0KCkgaXRlbUNscyAgICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGxhenlJdGVtcyAgICAgICAgICAgICA6IG9iamVjdHxvYmplY3RbXXxXaWRnZXRbXXxQYXJ0aWFsPFdpZGdldENvbmZpZz58UGFydGlhbDxXaWRnZXRDb25maWc+W107XG4gICAgQElucHV0KCkgbGlzdGVuZXJzICAgICAgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIGxvY2FsZUNsYXNzICAgICAgICAgICA6IEJhc2U7XG4gICAgQElucHV0KCkgbG9jYWxpemFibGVQcm9wZXJ0aWVzIDogc3RyaW5nW107XG4gICAgQElucHV0KCkgbWFza0RlZmF1bHRzICAgICAgICAgIDogb2JqZWN0fE1hc2t8UGFydGlhbDxNYXNrQ29uZmlnPjtcbiAgICBASW5wdXQoKSBtYXNrZWQgICAgICAgICAgICAgICAgOiBib29sZWFufHN0cmluZ3xvYmplY3R8TWFza3xQYXJ0aWFsPE1hc2tDb25maWc+O1xuICAgIEBJbnB1dCgpIG1heERhdGUgICAgICAgICAgICAgICA6IERhdGU7XG4gICAgQElucHV0KCkgbWluQ29sdW1uV2lkdGggICAgICAgIDogbnVtYmVyO1xuICAgIEBJbnB1dCgpIG1pbkRhdGUgICAgICAgICAgICAgICA6IERhdGU7XG4gICAgQElucHV0KCkgbWluUm93SGVpZ2h0ICAgICAgICAgIDogbnVtYmVyO1xuICAgIEBJbnB1dCgpIG1vbml0b3JSZXNpemUgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgbW9udGggICAgICAgICAgICAgICAgIDogTW9udGh8b2JqZWN0fFBhcnRpYWw8TW9udGhDb25maWc+O1xuICAgIEBJbnB1dCgpIG11bHRpU2VsZWN0ICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgbmFtZWRJdGVtcyAgICAgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIG5vbldvcmtpbmdEYXlzICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBvd25lciAgICAgICAgICAgICAgICAgOiBXaWRnZXQ7XG4gICAgQElucHV0KCkgcG9zaXRpb25lZCAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBwcmV2ZW50VG9vbHRpcE9uVG91Y2ggOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHJpcHBsZSAgICAgICAgICAgICAgICA6IGJvb2xlYW58b2JqZWN0O1xuICAgIEBJbnB1dCgpIHJvb3RFbGVtZW50ICAgICAgICAgICA6IFNoYWRvd1Jvb3Q7XG4gICAgQElucHV0KCkgc2Nyb2xsQWN0aW9uICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIHNob3dBbmltYXRpb24gICAgICAgICA6IGJvb2xlYW58b2JqZWN0O1xuICAgIEBJbnB1dCgpIHNob3dXZWVrQ29sdW1uICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgc2hvd1dlZWtOdW1iZXIgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBzaXhXZWVrcyAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHN0cmlwcyAgICAgICAgICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSB0YWIgICAgICAgICAgICAgICAgICAgOiBib29sZWFufG9iamVjdDtcbiAgICBASW5wdXQoKSB0YWcgICAgICAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgdGJhciAgICAgICAgICAgICAgICAgIDogb2JqZWN0W118b2JqZWN0O1xuICAgIEBJbnB1dCgpIHRleHRBbGlnbiAgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSB0ZXh0Q29udGVudCAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHRpcCAgICAgICAgICAgICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSB0aXRsZSAgICAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgdHJhcEZvY3VzICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSB3ZWVrUmVuZGVyZXIgICAgICAgICAgOiBGdW5jdGlvbnxzdHJpbmc7XG4gICAgQElucHV0KCkgd2Vla1N0YXJ0RGF5ICAgICAgICAgIDogbnVtYmVyO1xuICAgIEBJbnB1dCgpIHdlaWdodCAgICAgICAgICAgICAgICA6IG51bWJlcjtcblxuICAgICAvLyBDb25maWdzIGFuZCBwcm9wZXJ0aWVzXG4gICAgQElucHV0KCkgYWxpZ25TZWxmICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgY29udGVudCAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgZGF0YXNldCAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgZGF0ZSAgICAgICAgOiBEYXRlO1xuICAgIEBJbnB1dCgpIGRpc2FibGVkICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBleHRyYURhdGEgICA6IGJvb2xlYW58bnVtYmVyfG9iamVjdHxzdHJpbmc7XG4gICAgQElucHV0KCkgZmxleCAgICAgICAgOiBudW1iZXJ8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGhlaWdodCAgICAgIDogbnVtYmVyfHN0cmluZztcbiAgICBASW5wdXQoKSBoaWRkZW4gICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgaHRtbCAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgaWQgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgaXRlbXMgICAgICAgOiBXaWRnZXRbXXxvYmplY3R8b2JqZWN0W118UGFydGlhbDxXaWRnZXRDb25maWc+fFBhcnRpYWw8V2lkZ2V0Q29uZmlnPltdO1xuICAgIEBJbnB1dCgpIGxheW91dCAgICAgIDogTGF5b3V0fHN0cmluZztcbiAgICBASW5wdXQoKSBsYXlvdXRTdHlsZSA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBtYXJnaW4gICAgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgbWF4SGVpZ2h0ICAgOiBudW1iZXJ8c3RyaW5nO1xuICAgIEBJbnB1dCgpIG1heFdpZHRoICAgIDogbnVtYmVyfHN0cmluZztcbiAgICBASW5wdXQoKSBtaW5IZWlnaHQgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgbWluV2lkdGggICAgOiBudW1iZXJ8c3RyaW5nO1xuICAgIEBJbnB1dCgpIHJlYWRPbmx5ICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBzY3JvbGxhYmxlICA6IGJvb2xlYW58U2Nyb2xsZXJ8b2JqZWN0fFBhcnRpYWw8U2Nyb2xsZXJDb25maWc+O1xuICAgIEBJbnB1dCgpIHRvb2xzICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIHRvb2x0aXAgICAgIDogb2JqZWN0fHN0cmluZztcbiAgICBASW5wdXQoKSB3aWR0aCAgICAgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgeCAgICAgICAgICAgOiBudW1iZXI7XG4gICAgQElucHV0KCkgeSAgICAgICAgICAgOiBudW1iZXI7XG5cbiAgICAgLy8gUHJvcGVydGllcyBvbmx5XG4gICAgQElucHV0KCkgYW5jaG9yU2l6ZSAgICAgIDogbnVtYmVyW107XG4gICAgQElucHV0KCkgaXNTZXR0aW5nVmFsdWVzIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBpc1ZhbGlkICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHJlY29yZCAgICAgICAgICA6IE1vZGVsO1xuICAgIEBJbnB1dCgpIHZhbHVlcyAgICAgICAgICA6IG9iamVjdDtcblxuICAgICAvLyBFdmVudHNcbiAgICBAT3V0cHV0KCkgb25CZWZvcmVEZXN0cm95ICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25CZWZvcmVIaWRlICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25CZWZvcmVTZXRSZWNvcmQgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25CZWZvcmVTaG93ICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25DYXRjaEFsbCAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25EYXRlQ2hhbmdlICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25EZXN0cm95ICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25Gb2N1c0luICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25Gb2N1c091dCAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25IaWRlICAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25QYWludCAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25SZWFkT25seSAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25SZWZyZXNoICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25SZXNpemUgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25TZWxlY3Rpb25DaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25TaG93ICAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25Ub29sQ2xpY2sgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhbmQgYXBwZW5kIHRoZSB1bmRlcmx5aW5nIHdpZGdldFxuICAgICAqL1xuICAgIG5nT25Jbml0KCk6IHZvaWQge1xuICAgICAgICBjb25zdFxuICAgICAgICAgICAgbWUgPSB0aGlzLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGVsZW1lbnRSZWYsXG4gICAgICAgICAgICAgICAgYnJ5bnR1bUNvbmZpZ1xuICAgICAgICAgICAgfSA9IG1lLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGluc3RhbmNlQ2xhc3MsXG4gICAgICAgICAgICAgICAgYnJ5bnR1bUNvbmZpZ3NcbiAgICAgICAgICAgIH0gPSBCcnludHVtRGF0ZVBpY2tlckNvbXBvbmVudDtcblxuICAgICAgICBPYmplY3QuYXNzaWduKGJyeW50dW1Db25maWcsIHtcbiAgICAgICAgICAgIGxpc3RlbmVycyA6IHtcbiAgICAgICAgICAgICAgICBiZWZvcmVEZXN0cm95KGV2ZW50IDogYW55KSB7IG1lLm9uQmVmb3JlRGVzdHJveS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBiZWZvcmVIaWRlKGV2ZW50IDogYW55KSB7IG1lLm9uQmVmb3JlSGlkZS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBiZWZvcmVTZXRSZWNvcmQoZXZlbnQgOiBhbnkpIHsgbWUub25CZWZvcmVTZXRSZWNvcmQuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgYmVmb3JlU2hvdyhldmVudCA6IGFueSkgeyBtZS5vbkJlZm9yZVNob3cuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgY2F0Y2hBbGwoZXZlbnQgOiBhbnkpIHsgbWUub25DYXRjaEFsbC5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBkYXRlQ2hhbmdlKGV2ZW50IDogYW55KSB7IG1lLm9uRGF0ZUNoYW5nZS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBkZXN0cm95KGV2ZW50IDogYW55KSB7IG1lLm9uRGVzdHJveS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBmb2N1c0luKGV2ZW50IDogYW55KSB7IG1lLm9uRm9jdXNJbi5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBmb2N1c091dChldmVudCA6IGFueSkgeyBtZS5vbkZvY3VzT3V0LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGhpZGUoZXZlbnQgOiBhbnkpIHsgbWUub25IaWRlLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIHBhaW50KGV2ZW50IDogYW55KSB7IG1lLm9uUGFpbnQuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgcmVhZE9ubHkoZXZlbnQgOiBhbnkpIHsgbWUub25SZWFkT25seS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICByZWZyZXNoKGV2ZW50IDogYW55KSB7IG1lLm9uUmVmcmVzaC5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICByZXNpemUoZXZlbnQgOiBhbnkpIHsgbWUub25SZXNpemUuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgc2VsZWN0aW9uQ2hhbmdlKGV2ZW50IDogYW55KSB7IG1lLm9uU2VsZWN0aW9uQ2hhbmdlLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIHNob3coZXZlbnQgOiBhbnkpIHsgbWUub25TaG93LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIHRvb2xDbGljayhldmVudCA6IGFueSkgeyBtZS5vblRvb2xDbGljay5lbWl0KGV2ZW50KTsgfSxcblxuICAgICAgICAgICAgICAgIHRoaXNPYmogOiBtZVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBJZiBjb21wb25lbnQgaGFzIG5vIGNvbnRhaW5lciBzcGVjaWZpZWQgaW4gY29uZmlnIHRoZW4gdXNlIGFkb3B0IHRvIFdyYXBwZXIncyBlbGVtZW50XG4gICAgICAgIGNvbnN0XG4gICAgICAgICAgICBjb250YWluZXJQYXJhbSA9IFtcbiAgICAgICAgICAgICAgICAnYWRvcHQnLFxuICAgICAgICAgICAgICAgICdhcHBlbmRUbycsXG4gICAgICAgICAgICAgICAgJ2luc2VydEFmdGVyJyxcbiAgICAgICAgICAgICAgICAnaW5zZXJ0QmVmb3JlJ1xuICAgICAgICAgICAgXS5maW5kKHByb3AgPT4gYnJ5bnR1bUNvbmZpZ1twcm9wXSk7XG4gICAgICAgIGlmICghY29udGFpbmVyUGFyYW0pIHtcbiAgICAgICAgICAgIGJyeW50dW1Db25maWcuYWRvcHQgPSBlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBXcmFwcGVySGVscGVyLmRldldhcm5pbmdDb250YWluZXIoaW5zdGFuY2VDbGFzcy4kbmFtZSwgY29udGFpbmVyUGFyYW0pO1xuICAgICAgICB9XG5cbiAgICAgICAgYnJ5bnR1bUNvbmZpZ3MuZmlsdGVyKHByb3AgPT4gcHJvcCBpbiB0aGlzKS5mb3JFYWNoKHByb3AgPT4ge1xuICAgICAgICAgICAgV3JhcHBlckhlbHBlci5hcHBseVByb3BWYWx1ZShicnludHVtQ29uZmlnLCBwcm9wLCB0aGlzW3Byb3BdKTtcbiAgICAgICAgICAgIGlmIChbJ2ZlYXR1cmVzJywgJ2NvbmZpZyddLmluY2x1ZGVzKHByb3ApKSB7XG4gICAgICAgICAgICAgICAgV3JhcHBlckhlbHBlci5kZXZXYXJuaW5nQ29uZmlnUHJvcChpbnN0YW5jZUNsYXNzLiRuYW1lLCBwcm9wKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBtZS5pbnN0YW5jZSA9IGluc3RhbmNlQ2xhc3MuJG5hbWUgPT09ICdXaWRnZXQnID8gV2lkZ2V0SGVscGVyLmNyZWF0ZVdpZGdldChicnludHVtQ29uZmlnKSA6IG5ldyBpbnN0YW5jZUNsYXNzKGJyeW50dW1Db25maWcpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogV2F0Y2ggZm9yIGNoYW5nZXNcbiAgICAgKiBAcGFyYW0gY2hhbmdlc1xuICAgICAqL1xuICAgIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICAgICAgY29uc3RcbiAgICAgICAgICAgIHsgaW5zdGFuY2UgfSA9IHRoaXMsXG4gICAgICAgICAgICB7IGluc3RhbmNlQ2xhc3MgfSA9IEJyeW50dW1EYXRlUGlja2VyQ29tcG9uZW50O1xuXG4gICAgICAgIGlmICghaW5zdGFuY2UpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEl0ZXJhdGUgb3ZlciBhbGwgY2hhbmdlc1xuICAgICAgICBPYmplY3QuZW50cmllcyhjaGFuZ2VzKS5mb3JFYWNoKChbcHJvcCwgY2hhbmdlXSkgPT4ge1xuICAgICAgICAgICAgY29uc3RcbiAgICAgICAgICAgICAgICBuZXdWYWx1ZSA9IChjaGFuZ2UgYXMgU2ltcGxlQ2hhbmdlKS5jdXJyZW50VmFsdWUsXG4gICAgICAgICAgICAgICAgeyBpbnN0YW5jZSB9ID0gdGhpcyxcbiAgICAgICAgICAgICAgICB7IGJyeW50dW1Db25maWdzT25seSwgYnJ5bnR1bVByb3BzIH0gPSBCcnludHVtRGF0ZVBpY2tlckNvbXBvbmVudDtcbiAgICAgICAgICAgIGlmIChicnludHVtUHJvcHMuaW5jbHVkZXMocHJvcCkpIHtcbiAgICAgICAgICAgICAgICBXcmFwcGVySGVscGVyLmFwcGx5UHJvcFZhbHVlKGluc3RhbmNlLCBwcm9wLCBuZXdWYWx1ZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIGlmIChicnludHVtQ29uZmlnc09ubHkuaW5jbHVkZXMocHJvcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgV3JhcHBlckhlbHBlci5kZXZXYXJuaW5nVXBkYXRlUHJvcChpbnN0YW5jZUNsYXNzLiRuYW1lLCBwcm9wKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERlc3Ryb3kgdGhlIGNvbXBvbmVudFxuICAgICAqL1xuICAgIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5pbnN0YW5jZSkge1xuICAgICAgICAgICAgdGhpcy5pbnN0YW5jZS5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=