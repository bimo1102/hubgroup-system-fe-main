/**
 * Angular wrapper for Bryntum DatePicker
 */
import * as tslib_1 from "tslib";
import { Component, ElementRef, EventEmitter, Output, Input } from '@angular/core';
import WrapperHelper from './wrapper.helper';
// Bryntum 'scheduler.lite.umd' bundle comes without polyfills to support Angular's zone.js
import { Base, Model, Widget } from '@bryntum/scheduler/scheduler.lite.umd.js';
import { DatePicker, WidgetHelper } from '@bryntum/scheduler/scheduler.lite.umd.js';
var BryntumDatePickerComponent = /** @class */ (function () {
    function BryntumDatePickerComponent(element) {
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
    BryntumDatePickerComponent.prototype.ngOnInit = function () {
        var _this = this;
        var me = this, elementRef = me.elementRef, bryntumConfig = me.bryntumConfig, instanceClass = BryntumDatePickerComponent.instanceClass, bryntumConfigs = BryntumDatePickerComponent.bryntumConfigs;
        Object.assign(bryntumConfig, {
            listeners: {
                beforeDestroy: function (event) { me.onBeforeDestroy.emit(event); },
                beforeHide: function (event) { me.onBeforeHide.emit(event); },
                beforeSetRecord: function (event) { me.onBeforeSetRecord.emit(event); },
                beforeShow: function (event) { me.onBeforeShow.emit(event); },
                catchAll: function (event) { me.onCatchAll.emit(event); },
                dateChange: function (event) { me.onDateChange.emit(event); },
                destroy: function (event) { me.onDestroy.emit(event); },
                focusIn: function (event) { me.onFocusIn.emit(event); },
                focusOut: function (event) { me.onFocusOut.emit(event); },
                hide: function (event) { me.onHide.emit(event); },
                paint: function (event) { me.onPaint.emit(event); },
                readOnly: function (event) { me.onReadOnly.emit(event); },
                refresh: function (event) { me.onRefresh.emit(event); },
                resize: function (event) { me.onResize.emit(event); },
                selectionChange: function (event) { me.onSelectionChange.emit(event); },
                show: function (event) { me.onShow.emit(event); },
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
    };
    /**
     * Watch for changes
     * @param changes
     */
    BryntumDatePickerComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        var instance = this.instance, instanceClass = BryntumDatePickerComponent.instanceClass;
        if (!instance) {
            return;
        }
        // Iterate over all changes
        Object.entries(changes).forEach(function (_a) {
            var _b = tslib_1.__read(_a, 2), prop = _b[0], change = _b[1];
            var newValue = change.currentValue, instance = _this.instance, bryntumConfigsOnly = BryntumDatePickerComponent.bryntumConfigsOnly, bryntumProps = BryntumDatePickerComponent.bryntumProps;
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
    BryntumDatePickerComponent.prototype.ngOnDestroy = function () {
        if (this.instance) {
            this.instance.destroy();
        }
    };
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
    BryntumDatePickerComponent.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
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
    return BryntumDatePickerComponent;
}());
export { BryntumDatePickerComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJ5bnR1bS1kYXRlLXBpY2tlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYnJ5bnR1bS9zY2hlZHVsZXItYW5ndWxhci8iLCJzb3VyY2VzIjpbImxpYi9icnludHVtLWRhdGUtcGlja2VyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7R0FFRzs7QUFFSCxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQXFCLE1BQU0sRUFBRSxLQUFLLEVBQStCLE1BQU0sZUFBZSxDQUFDO0FBQ25JLE9BQU8sYUFBYSxNQUFNLGtCQUFrQixDQUFDO0FBRTdDLDJGQUEyRjtBQUMzRixPQUFPLEVBQUUsSUFBSSxFQUE0QixLQUFLLEVBQXdFLE1BQU0sRUFBZ0IsTUFBTSwwQ0FBMEMsQ0FBQztBQUM3TCxPQUFPLEVBQUUsVUFBVSxFQUFnQixZQUFZLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQUVsRztJQXNPSSxvQ0FBWSxPQUFtQjtRQVB2QixrQkFBYSxHQUFHO1lBQ3BCLGdCQUFnQixFQUFHLElBQUk7WUFDdkIsS0FBSyxFQUFjLFNBQVM7WUFDNUIsU0FBUyxFQUFVLEVBQUU7WUFDckIsUUFBUSxFQUFXLEVBQUU7U0FDeEIsQ0FBQztRQWtIRCxTQUFTO1FBQ0Esb0JBQWUsR0FBSyxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQy9DLGlCQUFZLEdBQVEsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUMvQyxzQkFBaUIsR0FBRyxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQy9DLGlCQUFZLEdBQVEsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUMvQyxlQUFVLEdBQVUsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUMvQyxpQkFBWSxHQUFRLElBQUksWUFBWSxFQUFVLENBQUM7UUFDL0MsY0FBUyxHQUFXLElBQUksWUFBWSxFQUFVLENBQUM7UUFDL0MsY0FBUyxHQUFXLElBQUksWUFBWSxFQUFVLENBQUM7UUFDL0MsZUFBVSxHQUFVLElBQUks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QW5ndWxhciB3cmFwcGVyIGZvciBCcnludHVtIERhdGVQaWNrZXJcbiAqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgT25EZXN0cm95LCBPbkluaXQsIE91dHB1dCwgSW5wdXQsIFNpbXBsZUNoYW5nZSwgU2ltcGxlQ2hhbmdlcyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IFdyYXBwZXJIZWxwZXIgZnJvbSAnLi93cmFwcGVyLmhlbHBlcic7XG5cbi8vIEJyeW50dW0gJ3NjaGVkdWxlci5saXRlLnVtZCcgYnVuZGxlIGNvbWVzIHdpdGhvdXQgcG9seWZpbGxzIHRvIHN1cHBvcnQgQW5ndWxhcidzIHpvbmUuanNcbmltcG9ydCB7IEJhc2UsIExheW91dCwgTWFzaywgTWFza0NvbmZpZywgTW9kZWwsIE1vbnRoLCBNb250aENvbmZpZywgUGFuZWxIZWFkZXIsIFJlY3RhbmdsZSwgU2Nyb2xsZXIsIFNjcm9sbGVyQ29uZmlnLCBXaWRnZXQsIFdpZGdldENvbmZpZyB9IGZyb20gJ0BicnludHVtL3NjaGVkdWxlci9zY2hlZHVsZXIubGl0ZS51bWQuanMnO1xuaW1wb3J0IHsgRGF0ZVBpY2tlciwgU3RyaW5nSGVscGVyLCBXaWRnZXRIZWxwZXIgfSBmcm9tICdAYnJ5bnR1bS9zY2hlZHVsZXIvc2NoZWR1bGVyLmxpdGUudW1kLmpzJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3IgOiAnYnJ5bnR1bS1kYXRlLXBpY2tlcicsXG4gICAgdGVtcGxhdGUgOiAnJ1xufSlcbmV4cG9ydCBjbGFzcyBCcnludHVtRGF0ZVBpY2tlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcblxuICAgIHB1YmxpYyBzdGF0aWMgaW5zdGFuY2VDbGFzcyA9IERhdGVQaWNrZXI7XG5cbiAgICBwcml2YXRlIHN0YXRpYyBicnludHVtRmVhdHVyZU5hbWVzOiBzdHJpbmdbXSA9IFtcblxuICAgIF07XG5cbiAgICBwcml2YXRlIHN0YXRpYyBicnludHVtQ29uZmlnczogc3RyaW5nW10gPSBCcnludHVtRGF0ZVBpY2tlckNvbXBvbmVudC5icnludHVtRmVhdHVyZU5hbWVzLmNvbmNhdChbXG4gICAgICAgICdhY3RpdmVEYXRlJyxcbiAgICAgICAgJ2Fkb3B0JyxcbiAgICAgICAgJ2FsaWduJyxcbiAgICAgICAgJ2FsaWduU2VsZicsXG4gICAgICAgICdhbmNob3InLFxuICAgICAgICAnYXBwZW5kVG8nLFxuICAgICAgICAnYmJhcicsXG4gICAgICAgICdib2R5Q2xzJyxcbiAgICAgICAgJ2J1YmJsZUV2ZW50cycsXG4gICAgICAgICdjZWxsUmVuZGVyZXInLFxuICAgICAgICAnY2VudGVyZWQnLFxuICAgICAgICAnY2xzJyxcbiAgICAgICAgJ2NvbmZpZycsXG4gICAgICAgICdjb25zdHJhaW5UbycsXG4gICAgICAgICdjb250ZW50JyxcbiAgICAgICAgJ2NvbnRlbnRFbGVtZW50Q2xzJyxcbiAgICAgICAgJ2RhdGFzZXQnLFxuICAgICAgICAnZGF0ZScsXG4gICAgICAgICdkYXlOYW1lRm9ybWF0JyxcbiAgICAgICAgJ2RlZmF1bHRCaW5kUHJvcGVydHknLFxuICAgICAgICAnZGVmYXVsdHMnLFxuICAgICAgICAnZGlzYWJsZWQnLFxuICAgICAgICAnZGlzYWJsZWREYXRlcycsXG4gICAgICAgICdkaXNhYmxlV2Vla2VuZHMnLFxuICAgICAgICAnZG9jaycsXG4gICAgICAgICdkcmFnZ2FibGUnLFxuICAgICAgICAnZWRpdE1vbnRoJyxcbiAgICAgICAgJ2VkaXRPbkhvdmVyJyxcbiAgICAgICAgJ2V4dHJhRGF0YScsXG4gICAgICAgICdmbGV4JyxcbiAgICAgICAgJ2Zsb2F0aW5nJyxcbiAgICAgICAgJ2ZvY3VzRGlzYWJsZWREYXRlcycsXG4gICAgICAgICdmb290ZXInLFxuICAgICAgICAnaGVhZGVyJyxcbiAgICAgICAgJ2hlYWRlclJlbmRlcmVyJyxcbiAgICAgICAgJ2hlaWdodCcsXG4gICAgICAgICdoaWRkZW4nLFxuICAgICAgICAnaGlkZUFuaW1hdGlvbicsXG4gICAgICAgICdoaWRlV2hlbkVtcHR5JyxcbiAgICAgICAgJ2h0bWwnLFxuICAgICAgICAnaHRtbENscycsXG4gICAgICAgICdpZCcsXG4gICAgICAgICdpbnNlcnRCZWZvcmUnLFxuICAgICAgICAnaW5zZXJ0Rmlyc3QnLFxuICAgICAgICAnaXRlbUNscycsXG4gICAgICAgICdpdGVtcycsXG4gICAgICAgICdsYXlvdXQnLFxuICAgICAgICAnbGF5b3V0U3R5bGUnLFxuICAgICAgICAnbGF6eUl0ZW1zJyxcbiAgICAgICAgJ2xpc3RlbmVycycsXG4gICAgICAgICdsb2NhbGVDbGFzcycsXG4gICAgICAgICdsb2NhbGl6YWJsZVByb3BlcnRpZXMnLFxuICAgICAgICAnbWFyZ2luJyxcbiAgICAgICAgJ21hc2tEZWZhdWx0cycsXG4gICAgICAgICdtYXNrZWQnLFxuICAgICAgICAnbWF4RGF0ZScsXG4gICAgICAgICdtYXhIZWlnaHQnLFxuICAgICAgICAnbWF4V2lkdGgnLFxuICAgICAgICAnbWluQ29sdW1uV2lkdGgnLFxuICAgICAgICAnbWluRGF0ZScsXG4gICAgICAgICdtaW5IZWlnaHQnLFxuICAgICAgICAnbWluUm93SGVpZ2h0JyxcbiAgICAgICAgJ21pbldpZHRoJyxcbiAgICAgICAgJ21vbml0b3JSZXNpemUnLFxuICAgICAgICAnbW9udGgnLFxuICAgICAgICAnbXVsdGlTZWxlY3QnLFxuICAgICAgICAnbmFtZWRJdGVtcycsXG4gICAgICAgICdub25Xb3JraW5nRGF5cycsXG4gICAgICAgICdvd25lcicsXG4gICAgICAgICdwb3NpdGlvbmVkJyxcbiAgICAgICAgJ3ByZXZlbnRUb29sdGlwT25Ub3VjaCcsXG4gICAgICAgICdyZWFkT25seScsXG4gICAgICAgICdyaXBwbGUnLFxuICAgICAgICAncm9vdEVsZW1lbnQnLFxuICAgICAgICAnc2Nyb2xsYWJsZScsXG4gICAgICAgICdzY3JvbGxBY3Rpb24nLFxuICAgICAgICAnc2hvd0FuaW1hdGlvbicsXG4gICAgICAgICdzaG93V2Vla0NvbHVtbicsXG4gICAgICAgICdzaG93V2Vla051bWJlcicsXG4gICAgICAgICdzaXhXZWVrcycsXG4gICAgICAgICdzdHJpcHMnLFxuICAgICAgICAndGFiJyxcbiAgICAgICAgJ3RhZycsXG4gICAgICAgICd0YmFyJyxcbiAgICAgICAgJ3RleHRBbGlnbicsXG4gICAgICAgICd0ZXh0Q29udGVudCcsXG4gICAgICAgICd0aXAnLFxuICAgICAgICAndGl0bGUnLFxuICAgICAgICAndG9vbHMnLFxuICAgICAgICAndG9vbHRpcCcsXG4gICAgICAgICd0cmFwRm9jdXMnLFxuICAgICAgICAnd2Vla1JlbmRlcmVyJyxcbiAgICAgICAgJ3dlZWtTdGFydERheScsXG4gICAgICAgICd3ZWlnaHQnLFxuICAgICAgICAnd2lkdGgnLFxuICAgICAgICAneCcsXG4gICAgICAgICd5J1xuICAgIF0pO1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bUNvbmZpZ3NPbmx5OiBzdHJpbmdbXSA9IFtcbiAgICAgICAgJ2FjdGl2ZURhdGUnLFxuICAgICAgICAnYWRvcHQnLFxuICAgICAgICAnYWxpZ24nLFxuICAgICAgICAnYW5jaG9yJyxcbiAgICAgICAgJ2FwcGVuZFRvJyxcbiAgICAgICAgJ2JiYXInLFxuICAgICAgICAnYm9keUNscycsXG4gICAgICAgICdidWJibGVFdmVudHMnLFxuICAgICAgICAnY2VsbFJlbmRlcmVyJyxcbiAgICAgICAgJ2NlbnRlcmVkJyxcbiAgICAgICAgJ2NscycsXG4gICAgICAgICdjb25maWcnLFxuICAgICAgICAnY29uc3RyYWluVG8nLFxuICAgICAgICAnY29udGVudEVsZW1lbnRDbHMnLFxuICAgICAgICAnZGF5TmFtZUZvcm1hdCcsXG4gICAgICAgICdkZWZhdWx0QmluZFByb3BlcnR5JyxcbiAgICAgICAgJ2RlZmF1bHRzJyxcbiAgICAgICAgJ2Rpc2FibGVkRGF0ZXMnLFxuICAgICAgICAnZGlzYWJsZVdlZWtlbmRzJyxcbiAgICAgICAgJ2RvY2snLFxuICAgICAgICAnZHJhZ2dhYmxlJyxcbiAgICAgICAgJ2VkaXRNb250aCcsXG4gICAgICAgICdlZGl0T25Ib3ZlcicsXG4gICAgICAgICdmbG9hdGluZycsXG4gICAgICAgICdmb2N1c0Rpc2FibGVkRGF0ZXMnLFxuICAgICAgICAnZm9vdGVyJyxcbiAgICAgICAgJ2hlYWRlcicsXG4gICAgICAgICdoZWFkZXJSZW5kZXJlcicsXG4gICAgICAgICdoaWRlQW5pbWF0aW9uJyxcbiAgICAgICAgJ2hpZGVXaGVuRW1wdHknLFxuICAgICAgICAnaHRtbENscycsXG4gICAgICAgICdpbnNlcnRCZWZvcmUnLFxuICAgICAgICAnaW5zZXJ0Rmlyc3QnLFxuICAgICAgICAnaXRlbUNscycsXG4gICAgICAgICdsYXp5SXRlbXMnLFxuICAgICAgICAnbGlzdGVuZXJzJyxcbiAgICAgICAgJ2xvY2FsZUNsYXNzJyxcbiAgICAgICAgJ2xvY2FsaXphYmxlUHJvcGVydGllcycsXG4gICAgICAgICdtYXNrRGVmYXVsdHMnLFxuICAgICAgICAnbWFza2VkJyxcbiAgICAgICAgJ21heERhdGUnLFxuICAgICAgICAnbWluQ29sdW1uV2lkdGgnLFxuICAgICAgICAnbWluRGF0ZScsXG4gICAgICAgICdtaW5Sb3dIZWlnaHQnLFxuICAgICAgICAnbW9uaXRvclJlc2l6ZScsXG4gICAgICAgICdtb250aCcsXG4gICAgICAgICdtdWx0aVNlbGVjdCcsXG4gICAgICAgICduYW1lZEl0ZW1zJyxcbiAgICAgICAgJ25vbldvcmtpbmdEYXlzJyxcbiAgICAgICAgJ293bmVyJyxcbiAgICAgICAgJ3Bvc2l0aW9uZWQnLFxuICAgICAgICAncHJldmVudFRvb2x0aXBPblRvdWNoJyxcbiAgICAgICAgJ3JpcHBsZScsXG4gICAgICAgICdyb290RWxlbWVudCcsXG4gICAgICAgICdzY3JvbGxBY3Rpb24nLFxuICAgICAgICAnc2hvd0FuaW1hdGlvbicsXG4gICAgICAgICdzaG93V2Vla0NvbHVtbicsXG4gICAgICAgICdzaG93V2Vla051bWJlcicsXG4gICAgICAgICdzaXhXZWVrcycsXG4gICAgICAgICdzdHJpcHMnLFxuICAgICAgICAndGFiJyxcbiAgICAgICAgJ3RhZycsXG4gICAgICAgICd0YmFyJyxcbiAgICAgICAgJ3RleHRBbGlnbicsXG4gICAgICAgICd0ZXh0Q29udGVudCcsXG4gICAgICAgICd0aXAnLFxuICAgICAgICAndGl0bGUnLFxuICAgICAgICAndHJhcEZvY3VzJyxcbiAgICAgICAgJ3dlZWtSZW5kZXJlcicsXG4gICAgICAgICd3ZWVrU3RhcnREYXknLFxuICAgICAgICAnd2VpZ2h0J1xuICAgIF07XG5cbiAgICBwcml2YXRlIHN0YXRpYyBicnludHVtUHJvcHM6IHN0cmluZ1tdID0gQnJ5bnR1bURhdGVQaWNrZXJDb21wb25lbnQuYnJ5bnR1bUZlYXR1cmVOYW1lcy5jb25jYXQoW1xuICAgICAgICAnYWxpZ25TZWxmJyxcbiAgICAgICAgJ2FuY2hvclNpemUnLFxuICAgICAgICAnY29udGVudCcsXG4gICAgICAgICdkYXRhc2V0JyxcbiAgICAgICAgJ2RhdGUnLFxuICAgICAgICAnZGlzYWJsZWQnLFxuICAgICAgICAnZXh0cmFEYXRhJyxcbiAgICAgICAgJ2ZsZXgnLFxuICAgICAgICAnaGVpZ2h0JyxcbiAgICAgICAgJ2hpZGRlbicsXG4gICAgICAgICdodG1sJyxcbiAgICAgICAgJ2lkJyxcbiAgICAgICAgJ2lzU2V0dGluZ1ZhbHVlcycsXG4gICAgICAgICdpc1ZhbGlkJyxcbiAgICAgICAgJ2l0ZW1zJyxcbiAgICAgICAgJ2xheW91dCcsXG4gICAgICAgICdsYXlvdXRTdHlsZScsXG4gICAgICAgICdtYXJnaW4nLFxuICAgICAgICAnbWF4SGVpZ2h0JyxcbiAgICAgICAgJ21heFdpZHRoJyxcbiAgICAgICAgJ21pbkhlaWdodCcsXG4gICAgICAgICdtaW5XaWR0aCcsXG4gICAgICAgICdyZWFkT25seScsXG4gICAgICAgICdyZWNvcmQnLFxuICAgICAgICAnc2Nyb2xsYWJsZScsXG4gICAgICAgICd0b29scycsXG4gICAgICAgICd0b29sdGlwJyxcbiAgICAgICAgJ3ZhbHVlcycsXG4gICAgICAgICd3aWR0aCcsXG4gICAgICAgICd4JyxcbiAgICAgICAgJ3knXG4gICAgXSk7XG5cbiAgICBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY7XG4gICAgcHVibGljIGluc3RhbmNlOiBEYXRlUGlja2VyO1xuXG4gICAgcHJpdmF0ZSBicnludHVtQ29uZmlnID0ge1xuICAgICAgICBhbmd1bGFyQ29tcG9uZW50IDogdGhpcyxcbiAgICAgICAgYWRvcHQgICAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgbGlzdGVuZXJzICAgICAgICA6IHt9LFxuICAgICAgICBmZWF0dXJlcyAgICAgICAgIDoge31cbiAgICB9O1xuXG4gICAgY29uc3RydWN0b3IoZWxlbWVudDogRWxlbWVudFJlZikge1xuICAgICAgICB0aGlzLmVsZW1lbnRSZWYgPSBlbGVtZW50O1xuICAgIH1cblxuICAgICAvLyBDb25maWdzIG9ubHlcbiAgICBASW5wdXQoKSBhY3RpdmVEYXRlICAgICAgICAgICAgOiBEYXRlO1xuICAgIEBJbnB1dCgpIGFkb3B0ICAgICAgICAgICAgICAgICA6IEhUTUxFbGVtZW50fHN0cmluZztcbiAgICBASW5wdXQoKSBhbGlnbiAgICAgICAgICAgICAgICAgOiBvYmplY3R8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGFuY2hvciAgICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgYXBwZW5kVG8gICAgICAgICAgICAgIDogSFRNTEVsZW1lbnR8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGJiYXIgICAgICAgICAgICAgICAgICA6IG9iamVjdFtdfG9iamVjdDtcbiAgICBASW5wdXQoKSBib2R5Q2xzICAgICAgICAgICAgICAgOiBzdHJpbmd8b2JqZWN0O1xuICAgIEBJbnB1dCgpIGJ1YmJsZUV2ZW50cyAgICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBjZWxsUmVuZGVyZXIgICAgICAgICAgOiBGdW5jdGlvbnxzdHJpbmc7XG4gICAgQElucHV0KCkgY2VudGVyZWQgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBjbHMgICAgICAgICAgICAgICAgICAgOiBzdHJpbmd8b2JqZWN0O1xuICAgIEBJbnB1dCgpIGNvbmZpZyAgICAgICAgICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBjb25zdHJhaW5UbyAgICAgICAgICAgOiBIVE1MRWxlbWVudHxXaWRnZXR8UmVjdGFuZ2xlO1xuICAgIEBJbnB1dCgpIGNvbnRlbnRFbGVtZW50Q2xzICAgICA6IHN0cmluZ3xvYmplY3Q7XG4gICAgQElucHV0KCkgZGF5TmFtZUZvcm1hdCAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGRlZmF1bHRCaW5kUHJvcGVydHkgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBkZWZhdWx0cyAgICAgICAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgZGlzYWJsZWREYXRlcyAgICAgICAgIDogRnVuY3Rpb258RGF0ZVtdfHN0cmluZztcbiAgICBASW5wdXQoKSBkaXNhYmxlV2Vla2VuZHMgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGRvY2sgICAgICAgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBkcmFnZ2FibGUgICAgICAgICAgICAgOiBib29sZWFufG9iamVjdDtcbiAgICBASW5wdXQoKSBlZGl0TW9udGggICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGVkaXRPbkhvdmVyICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgZmxvYXRpbmcgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBmb2N1c0Rpc2FibGVkRGF0ZXMgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGZvb3RlciAgICAgICAgICAgICAgICA6IG9iamVjdHxzdHJpbmc7XG4gICAgQElucHV0KCkgaGVhZGVyICAgICAgICAgICAgICAgIDogc3RyaW5nfFBhbmVsSGVhZGVyO1xuICAgIEBJbnB1dCgpIGhlYWRlclJlbmRlcmVyICAgICAgICA6IEZ1bmN0aW9ufHN0cmluZztcbiAgICBASW5wdXQoKSBoaWRlQW5pbWF0aW9uICAgICAgICAgOiBib29sZWFufG9iamVjdDtcbiAgICBASW5wdXQoKSBoaWRlV2hlbkVtcHR5ICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGh0bWxDbHMgICAgICAgICAgICAgICA6IHN0cmluZ3xvYmplY3Q7XG4gICAgQElucHV0KCkgaW5zZXJ0QmVmb3JlICAgICAgICAgIDogSFRNTEVsZW1lbnR8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGluc2VydEZpcnN0ICAgICAgICAgICA6IEhUTUxFbGVtZW50fHN0cmluZztcbiAgICBASW5wdXQoKSBpdGVtQ2xzICAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgbGF6eUl0ZW1zICAgICAgICAgICAgIDogb2JqZWN0fG9iamVjdFtdfFdpZGdldFtdfFBhcnRpYWw8V2lkZ2V0Q29uZmlnPnxQYXJ0aWFsPFdpZGdldENvbmZpZz5bXTtcbiAgICBASW5wdXQoKSBsaXN0ZW5lcnMgICAgICAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgbG9jYWxlQ2xhc3MgICAgICAgICAgIDogQmFzZTtcbiAgICBASW5wdXQoKSBsb2NhbGl6YWJsZVByb3BlcnRpZXMgOiBzdHJpbmdbXTtcbiAgICBASW5wdXQoKSBtYXNrRGVmYXVsdHMgICAgICAgICAgOiBvYmplY3R8TWFza3xQYXJ0aWFsPE1hc2tDb25maWc+O1xuICAgIEBJbnB1dCgpIG1hc2tlZCAgICAgICAgICAgICAgICA6IGJvb2xlYW58c3RyaW5nfG9iamVjdHxNYXNrfFBhcnRpYWw8TWFza0NvbmZpZz47XG4gICAgQElucHV0KCkgbWF4RGF0ZSAgICAgICAgICAgICAgIDogRGF0ZTtcbiAgICBASW5wdXQoKSBtaW5Db2x1bW5XaWR0aCAgICAgICAgOiBudW1iZXI7XG4gICAgQElucHV0KCkgbWluRGF0ZSAgICAgICAgICAgICAgIDogRGF0ZTtcbiAgICBASW5wdXQoKSBtaW5Sb3dIZWlnaHQgICAgICAgICAgOiBudW1iZXI7XG4gICAgQElucHV0KCkgbW9uaXRvclJlc2l6ZSAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBtb250aCAgICAgICAgICAgICAgICAgOiBNb250aHxvYmplY3R8UGFydGlhbDxNb250aENvbmZpZz47XG4gICAgQElucHV0KCkgbXVsdGlTZWxlY3QgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBuYW1lZEl0ZW1zICAgICAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgbm9uV29ya2luZ0RheXMgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIG93bmVyICAgICAgICAgICAgICAgICA6IFdpZGdldDtcbiAgICBASW5wdXQoKSBwb3NpdGlvbmVkICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHByZXZlbnRUb29sdGlwT25Ub3VjaCA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgcmlwcGxlICAgICAgICAgICAgICAgIDogYm9vbGVhbnxvYmplY3Q7XG4gICAgQElucHV0KCkgcm9vdEVsZW1lbnQgICAgICAgICAgIDogU2hhZG93Um9vdDtcbiAgICBASW5wdXQoKSBzY3JvbGxBY3Rpb24gICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgc2hvd0FuaW1hdGlvbiAgICAgICAgIDogYm9vbGVhbnxvYmplY3Q7XG4gICAgQElucHV0KCkgc2hvd1dlZWtDb2x1bW4gICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBzaG93V2Vla051bWJlciAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHNpeFdlZWtzICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgc3RyaXBzICAgICAgICAgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIHRhYiAgICAgICAgICAgICAgICAgICA6IGJvb2xlYW58b2JqZWN0O1xuICAgIEBJbnB1dCgpIHRhZyAgICAgICAgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSB0YmFyICAgICAgICAgICAgICAgICAgOiBvYmplY3RbXXxvYmplY3Q7XG4gICAgQElucHV0KCkgdGV4dEFsaWduICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIHRleHRDb250ZW50ICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgdGlwICAgICAgICAgICAgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIHRpdGxlICAgICAgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSB0cmFwRm9jdXMgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHdlZWtSZW5kZXJlciAgICAgICAgICA6IEZ1bmN0aW9ufHN0cmluZztcbiAgICBASW5wdXQoKSB3ZWVrU3RhcnREYXkgICAgICAgICAgOiBudW1iZXI7XG4gICAgQElucHV0KCkgd2VpZ2h0ICAgICAgICAgICAgICAgIDogbnVtYmVyO1xuXG4gICAgIC8vIENvbmZpZ3MgYW5kIHByb3BlcnRpZXNcbiAgICBASW5wdXQoKSBhbGlnblNlbGYgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBjb250ZW50ICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBkYXRhc2V0ICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBkYXRlICAgICAgICA6IERhdGU7XG4gICAgQElucHV0KCkgZGlzYWJsZWQgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGV4dHJhRGF0YSAgIDogYm9vbGVhbnxudW1iZXJ8b2JqZWN0fHN0cmluZztcbiAgICBASW5wdXQoKSBmbGV4ICAgICAgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgaGVpZ2h0ICAgICAgOiBudW1iZXJ8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGhpZGRlbiAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBodG1sICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBpZCAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBpdGVtcyAgICAgICA6IFdpZGdldFtdfG9iamVjdHxvYmplY3RbXXxQYXJ0aWFsPFdpZGdldENvbmZpZz58UGFydGlhbDxXaWRnZXRDb25maWc+W107XG4gICAgQElucHV0KCkgbGF5b3V0ICAgICAgOiBMYXlvdXR8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGxheW91dFN0eWxlIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIG1hcmdpbiAgICAgIDogbnVtYmVyfHN0cmluZztcbiAgICBASW5wdXQoKSBtYXhIZWlnaHQgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgbWF4V2lkdGggICAgOiBudW1iZXJ8c3RyaW5nO1xuICAgIEBJbnB1dCgpIG1pbkhlaWdodCAgIDogbnVtYmVyfHN0cmluZztcbiAgICBASW5wdXQoKSBtaW5XaWR0aCAgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgcmVhZE9ubHkgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHNjcm9sbGFibGUgIDogYm9vbGVhbnxTY3JvbGxlcnxvYmplY3R8UGFydGlhbDxTY3JvbGxlckNvbmZpZz47XG4gICAgQElucHV0KCkgdG9vbHMgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgdG9vbHRpcCAgICAgOiBvYmplY3R8c3RyaW5nO1xuICAgIEBJbnB1dCgpIHdpZHRoICAgICAgIDogbnVtYmVyfHN0cmluZztcbiAgICBASW5wdXQoKSB4ICAgICAgICAgICA6IG51bWJlcjtcbiAgICBASW5wdXQoKSB5ICAgICAgICAgICA6IG51bWJlcjtcblxuICAgICAvLyBQcm9wZXJ0aWVzIG9ubHlcbiAgICBASW5wdXQoKSBhbmNob3JTaXplICAgICAgOiBudW1iZXJbXTtcbiAgICBASW5wdXQoKSBpc1NldHRpbmdWYWx1ZXMgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGlzVmFsaWQgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgcmVjb3JkICAgICAgICAgIDogTW9kZWw7XG4gICAgQElucHV0KCkgdmFsdWVzICAgICAgICAgIDogb2JqZWN0O1xuXG4gICAgIC8vIEV2ZW50c1xuICAgIEBPdXRwdXQoKSBvbkJlZm9yZURlc3Ryb3kgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkJlZm9yZUhpZGUgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkJlZm9yZVNldFJlY29yZCA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkJlZm9yZVNob3cgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkNhdGNoQWxsICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkRhdGVDaGFuZ2UgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkRlc3Ryb3kgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkZvY3VzSW4gICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkZvY3VzT3V0ICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkhpZGUgICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvblBhaW50ICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvblJlYWRPbmx5ICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvblJlZnJlc2ggICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvblJlc2l6ZSAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvblNlbGVjdGlvbkNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvblNob3cgICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvblRvb2xDbGljayAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGFuZCBhcHBlbmQgdGhlIHVuZGVybHlpbmcgd2lkZ2V0XG4gICAgICovXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0XG4gICAgICAgICAgICBtZSA9IHRoaXMsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZWxlbWVudFJlZixcbiAgICAgICAgICAgICAgICBicnludHVtQ29uZmlnXG4gICAgICAgICAgICB9ID0gbWUsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaW5zdGFuY2VDbGFzcyxcbiAgICAgICAgICAgICAgICBicnludHVtQ29uZmlnc1xuICAgICAgICAgICAgfSA9IEJyeW50dW1EYXRlUGlja2VyQ29tcG9uZW50O1xuXG4gICAgICAgIE9iamVjdC5hc3NpZ24oYnJ5bnR1bUNvbmZpZywge1xuICAgICAgICAgICAgbGlzdGVuZXJzIDoge1xuICAgICAgICAgICAgICAgIGJlZm9yZURlc3Ryb3koZXZlbnQgOiBhbnkpIHsgbWUub25CZWZvcmVEZXN0cm95LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGJlZm9yZUhpZGUoZXZlbnQgOiBhbnkpIHsgbWUub25CZWZvcmVIaWRlLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGJlZm9yZVNldFJlY29yZChldmVudCA6IGFueSkgeyBtZS5vbkJlZm9yZVNldFJlY29yZC5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBiZWZvcmVTaG93KGV2ZW50IDogYW55KSB7IG1lLm9uQmVmb3JlU2hvdy5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBjYXRjaEFsbChldmVudCA6IGFueSkgeyBtZS5vbkNhdGNoQWxsLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGRhdGVDaGFuZ2UoZXZlbnQgOiBhbnkpIHsgbWUub25EYXRlQ2hhbmdlLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGRlc3Ryb3koZXZlbnQgOiBhbnkpIHsgbWUub25EZXN0cm95LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGZvY3VzSW4oZXZlbnQgOiBhbnkpIHsgbWUub25Gb2N1c0luLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGZvY3VzT3V0KGV2ZW50IDogYW55KSB7IG1lLm9uRm9jdXNPdXQuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgaGlkZShldmVudCA6IGFueSkgeyBtZS5vbkhpZGUuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgcGFpbnQoZXZlbnQgOiBhbnkpIHsgbWUub25QYWludC5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICByZWFkT25seShldmVudCA6IGFueSkgeyBtZS5vblJlYWRPbmx5LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIHJlZnJlc2goZXZlbnQgOiBhbnkpIHsgbWUub25SZWZyZXNoLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIHJlc2l6ZShldmVudCA6IGFueSkgeyBtZS5vblJlc2l6ZS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBzZWxlY3Rpb25DaGFuZ2UoZXZlbnQgOiBhbnkpIHsgbWUub25TZWxlY3Rpb25DaGFuZ2UuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgc2hvdyhldmVudCA6IGFueSkgeyBtZS5vblNob3cuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgdG9vbENsaWNrKGV2ZW50IDogYW55KSB7IG1lLm9uVG9vbENsaWNrLmVtaXQoZXZlbnQpOyB9LFxuXG4gICAgICAgICAgICAgICAgdGhpc09iaiA6IG1lXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIElmIGNvbXBvbmVudCBoYXMgbm8gY29udGFpbmVyIHNwZWNpZmllZCBpbiBjb25maWcgdGhlbiB1c2UgYWRvcHQgdG8gV3JhcHBlcidzIGVsZW1lbnRcbiAgICAgICAgY29uc3RcbiAgICAgICAgICAgIGNvbnRhaW5lclBhcmFtID0gW1xuICAgICAgICAgICAgICAgICdhZG9wdCcsXG4gICAgICAgICAgICAgICAgJ2FwcGVuZFRvJyxcbiAgICAgICAgICAgICAgICAnaW5zZXJ0QWZ0ZXInLFxuICAgICAgICAgICAgICAgICdpbnNlcnRCZWZvcmUnXG4gICAgICAgICAgICBdLmZpbmQocHJvcCA9PiBicnludHVtQ29uZmlnW3Byb3BdKTtcbiAgICAgICAgaWYgKCFjb250YWluZXJQYXJhbSkge1xuICAgICAgICAgICAgYnJ5bnR1bUNvbmZpZy5hZG9wdCA9IGVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIFdyYXBwZXJIZWxwZXIuZGV2V2FybmluZ0NvbnRhaW5lcihpbnN0YW5jZUNsYXNzLiRuYW1lLCBjb250YWluZXJQYXJhbSk7XG4gICAgICAgIH1cblxuICAgICAgICBicnludHVtQ29uZmlncy5maWx0ZXIocHJvcCA9PiBwcm9wIGluIHRoaXMpLmZvckVhY2gocHJvcCA9PiB7XG4gICAgICAgICAgICBXcmFwcGVySGVscGVyLmFwcGx5UHJvcFZhbHVlKGJyeW50dW1Db25maWcsIHByb3AsIHRoaXNbcHJvcF0pO1xuICAgICAgICAgICAgaWYgKFsnZmVhdHVyZXMnLCAnY29uZmlnJ10uaW5jbHVkZXMocHJvcCkpIHtcbiAgICAgICAgICAgICAgICBXcmFwcGVySGVscGVyLmRldldhcm5pbmdDb25maWdQcm9wKGluc3RhbmNlQ2xhc3MuJG5hbWUsIHByb3ApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIG1lLmluc3RhbmNlID0gaW5zdGFuY2VDbGFzcy4kbmFtZSA9PT0gJ1dpZGdldCcgPyBXaWRnZXRIZWxwZXIuY3JlYXRlV2lkZ2V0KGJyeW50dW1Db25maWcpIDogbmV3IGluc3RhbmNlQ2xhc3MoYnJ5bnR1bUNvbmZpZyk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBXYXRjaCBmb3IgY2hhbmdlc1xuICAgICAqIEBwYXJhbSBjaGFuZ2VzXG4gICAgICovXG4gICAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgICAgICBjb25zdFxuICAgICAgICAgICAgeyBpbnN0YW5jZSB9ID0gdGhpcyxcbiAgICAgICAgICAgIHsgaW5zdGFuY2VDbGFzcyB9ID0gQnJ5bnR1bURhdGVQaWNrZXJDb21wb25lbnQ7XG5cbiAgICAgICAgaWYgKCFpbnN0YW5jZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSXRlcmF0ZSBvdmVyIGFsbCBjaGFuZ2VzXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKGNoYW5nZXMpLmZvckVhY2goKFtwcm9wLCBjaGFuZ2VdKSA9PiB7XG4gICAgICAgICAgICBjb25zdFxuICAgICAgICAgICAgICAgIG5ld1ZhbHVlID0gKGNoYW5nZSBhcyBTaW1wbGVDaGFuZ2UpLmN1cnJlbnRWYWx1ZSxcbiAgICAgICAgICAgICAgICB7IGluc3RhbmNlIH0gPSB0aGlzLFxuICAgICAgICAgICAgICAgIHsgYnJ5bnR1bUNvbmZpZ3NPbmx5LCBicnludHVtUHJvcHMgfSA9IEJyeW50dW1EYXRlUGlja2VyQ29tcG9uZW50O1xuICAgICAgICAgICAgaWYgKGJyeW50dW1Qcm9wcy5pbmNsdWRlcyhwcm9wKSkge1xuICAgICAgICAgICAgICAgIFdyYXBwZXJIZWxwZXIuYXBwbHlQcm9wVmFsdWUoaW5zdGFuY2UsIHByb3AsIG5ld1ZhbHVlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgaWYgKGJyeW50dW1Db25maWdzT25seS5pbmNsdWRlcyhwcm9wKSkge1xuICAgICAgICAgICAgICAgICAgICBXcmFwcGVySGVscGVyLmRldldhcm5pbmdVcGRhdGVQcm9wKGluc3RhbmNlQ2xhc3MuJG5hbWUsIHByb3ApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGVzdHJveSB0aGUgY29tcG9uZW50XG4gICAgICovXG4gICAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmluc3RhbmNlKSB7XG4gICAgICAgICAgICB0aGlzLmluc3RhbmNlLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==