/**
 * Angular wrapper for Bryntum PagingToolbar
 */
import * as tslib_1 from "tslib";
import { Component, ElementRef, EventEmitter, Output, Input } from '@angular/core';
import WrapperHelper from './wrapper.helper';
// Bryntum 'scheduler.lite.umd' bundle comes without polyfills to support Angular's zone.js
import { AjaxStore, Base, Model, Widget } from '@bryntum/scheduler/scheduler.lite.umd.js';
import { PagingToolbar, WidgetHelper } from '@bryntum/scheduler/scheduler.lite.umd.js';
var BryntumPagingToolbarComponent = /** @class */ (function () {
    function BryntumPagingToolbarComponent(element) {
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
        this.onDestroy = new EventEmitter();
        this.onFocusIn = new EventEmitter();
        this.onFocusOut = new EventEmitter();
        this.onHide = new EventEmitter();
        this.onPaint = new EventEmitter();
        this.onReadOnly = new EventEmitter();
        this.onResize = new EventEmitter();
        this.onShow = new EventEmitter();
        this.elementRef = element;
    }
    /**
     * Create and append the underlying widget
     */
    BryntumPagingToolbarComponent.prototype.ngOnInit = function () {
        var _this = this;
        var me = this, elementRef = me.elementRef, bryntumConfig = me.bryntumConfig, instanceClass = BryntumPagingToolbarComponent.instanceClass, bryntumConfigs = BryntumPagingToolbarComponent.bryntumConfigs;
        Object.assign(bryntumConfig, {
            listeners: {
                beforeDestroy: function (event) { me.onBeforeDestroy.emit(event); },
                beforeHide: function (event) { me.onBeforeHide.emit(event); },
                beforeSetRecord: function (event) { me.onBeforeSetRecord.emit(event); },
                beforeShow: function (event) { me.onBeforeShow.emit(event); },
                catchAll: function (event) { me.onCatchAll.emit(event); },
                destroy: function (event) { me.onDestroy.emit(event); },
                focusIn: function (event) { me.onFocusIn.emit(event); },
                focusOut: function (event) { me.onFocusOut.emit(event); },
                hide: function (event) { me.onHide.emit(event); },
                paint: function (event) { me.onPaint.emit(event); },
                readOnly: function (event) { me.onReadOnly.emit(event); },
                resize: function (event) { me.onResize.emit(event); },
                show: function (event) { me.onShow.emit(event); },
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
    BryntumPagingToolbarComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        var instance = this.instance, instanceClass = BryntumPagingToolbarComponent.instanceClass;
        if (!instance) {
            return;
        }
        // Iterate over all changes
        Object.entries(changes).forEach(function (_a) {
            var _b = tslib_1.__read(_a, 2), prop = _b[0], change = _b[1];
            var newValue = change.currentValue, instance = _this.instance, bryntumConfigsOnly = BryntumPagingToolbarComponent.bryntumConfigsOnly, bryntumProps = BryntumPagingToolbarComponent.bryntumProps;
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
    BryntumPagingToolbarComponent.prototype.ngOnDestroy = function () {
        if (this.instance) {
            this.instance.destroy();
        }
    };
    BryntumPagingToolbarComponent.instanceClass = PagingToolbar;
    BryntumPagingToolbarComponent.bryntumFeatureNames = [];
    BryntumPagingToolbarComponent.bryntumConfigs = BryntumPagingToolbarComponent.bryntumFeatureNames.concat([
        'adopt',
        'align',
        'alignSelf',
        'anchor',
        'appendTo',
        'bubbleEvents',
        'centered',
        'cls',
        'config',
        'constrainTo',
        'content',
        'contentElementCls',
        'dataset',
        'defaultBindProperty',
        'defaults',
        'disabled',
        'dock',
        'draggable',
        'extraData',
        'flex',
        'floating',
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
        'maxHeight',
        'maxWidth',
        'minHeight',
        'minWidth',
        'monitorResize',
        'namedItems',
        'overflow',
        'owner',
        'positioned',
        'preventTooltipOnTouch',
        'readOnly',
        'ripple',
        'rootElement',
        'scrollable',
        'scrollAction',
        'showAnimation',
        'store',
        'tab',
        'tag',
        'textAlign',
        'textContent',
        'title',
        'tools',
        'tooltip',
        'weight',
        'widgetCls',
        'width',
        'x',
        'y'
    ]);
    BryntumPagingToolbarComponent.bryntumConfigsOnly = [
        'adopt',
        'align',
        'anchor',
        'appendTo',
        'bubbleEvents',
        'centered',
        'cls',
        'config',
        'constrainTo',
        'contentElementCls',
        'defaultBindProperty',
        'defaults',
        'dock',
        'draggable',
        'floating',
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
        'monitorResize',
        'namedItems',
        'overflow',
        'owner',
        'positioned',
        'preventTooltipOnTouch',
        'ripple',
        'rootElement',
        'scrollAction',
        'showAnimation',
        'store',
        'tab',
        'tag',
        'textAlign',
        'textContent',
        'title',
        'tools',
        'weight',
        'widgetCls'
    ];
    BryntumPagingToolbarComponent.bryntumProps = BryntumPagingToolbarComponent.bryntumFeatureNames.concat([
        'alignSelf',
        'anchorSize',
        'content',
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
        'scrollable',
        'tooltip',
        'values',
        'width',
        'x',
        'y'
    ]);
    BryntumPagingToolbarComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bryntum-paging-toolbar',
                    template: ''
                }] }
    ];
    /** @nocollapse */
    BryntumPagingToolbarComponent.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    BryntumPagingToolbarComponent.propDecorators = {
        adopt: [{ type: Input }],
        align: [{ type: Input }],
        anchor: [{ type: Input }],
        appendTo: [{ type: Input }],
        bubbleEvents: [{ type: Input }],
        centered: [{ type: Input }],
        cls: [{ type: Input }],
        config: [{ type: Input }],
        constrainTo: [{ type: Input }],
        contentElementCls: [{ type: Input }],
        defaultBindProperty: [{ type: Input }],
        defaults: [{ type: Input }],
        dock: [{ type: Input }],
        draggable: [{ type: Input }],
        floating: [{ type: Input }],
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
        monitorResize: [{ type: Input }],
        namedItems: [{ type: Input }],
        overflow: [{ type: Input }],
        owner: [{ type: Input }],
        positioned: [{ type: Input }],
        preventTooltipOnTouch: [{ type: Input }],
        ripple: [{ type: Input }],
        rootElement: [{ type: Input }],
        scrollAction: [{ type: Input }],
        showAnimation: [{ type: Input }],
        store: [{ type: Input }],
        tab: [{ type: Input }],
        tag: [{ type: Input }],
        textAlign: [{ type: Input }],
        textContent: [{ type: Input }],
        title: [{ type: Input }],
        tools: [{ type: Input }],
        weight: [{ type: Input }],
        widgetCls: [{ type: Input }],
        alignSelf: [{ type: Input }],
        content: [{ type: Input }],
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
        scrollable: [{ type: Input }],
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
        onDestroy: [{ type: Output }],
        onFocusIn: [{ type: Output }],
        onFocusOut: [{ type: Output }],
        onHide: [{ type: Output }],
        onPaint: [{ type: Output }],
        onReadOnly: [{ type: Output }],
        onResize: [{ type: Output }],
        onShow: [{ type: Output }]
    };
    return BryntumPagingToolbarComponent;
}());
export { BryntumPagingToolbarComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJ5bnR1bS1wYWdpbmctdG9vbGJhci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYnJ5bnR1bS9zY2hlZHVsZXItYW5ndWxhci8iLCJzb3VyY2VzIjpbImxpYi9icnludHVtLXBhZ2luZy10b29sYmFyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7R0FFRzs7QUFFSCxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQXFCLE1BQU0sRUFBRSxLQUFLLEVBQStCLE1BQU0sZUFBZSxDQUFDO0FBQ25JLE9BQU8sYUFBYSxNQUFNLGtCQUFrQixDQUFDO0FBRTdDLDJGQUEyRjtBQUMzRixPQUFPLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBNEIsS0FBSyxFQUF1QyxNQUFNLEVBQWdCLE1BQU0sMENBQTBDLENBQUM7QUFDdkssT0FBTyxFQUFFLGFBQWEsRUFBZ0IsWUFBWSxFQUFFLE1BQU0sMENBQTBDLENBQUM7QUFFckc7SUFnTEksdUNBQVksT0FBbUI7UUFQdkIsa0JBQWEsR0FBRztZQUNwQixnQkFBZ0IsRUFBRyxJQUFJO1lBQ3ZCLEtBQUssRUFBYyxTQUFTO1lBQzVCLFNBQVMsRUFBVSxFQUFFO1lBQ3JCLFFBQVEsRUFBVyxFQUFFO1NBQ3hCLENBQUM7UUF1RkQsU0FBUztRQUNBLG9CQUFlLEdBQUssSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUMvQyxpQkFBWSxHQUFRLElBQUksWUFBWSxFQUFVLENBQUM7UUFDL0Msc0JBQWlCLEdBQUcsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUMvQyxpQkFBWSxHQUFRLElBQUksWUFBWSxFQUFVLENBQUM7UUFDL0MsZUFBVSxHQUFVLElBQUksWUFBWSxFQUFVLENBQUM7UUFDL0MsY0FBUyxHQUFXLElBQUksWUFBWSxFQUFVLENBQUM7UUFDL0MsY0FBUyxHQUFXLElBQUksWUFBWSxFQUFVLENBQUM7UUFDL0MsZUFBVSxHQUFVLElBQUksWUFBWSxFQUFVLENBQUM7UUFDL0Ms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QUFLO3lCQUNMLEtBQUs7OEJBQ0wsS0FBSzt5QkFDTCxLQUFLOzRCQUNMLEtBQUs7MkJBQ0wsS0FBSzs0QkFDTCxLQUFLOzJCQUNMLEtBQUs7MkJBQ0wsS0FBSzs2QkFDTCxLQUFLOzBCQUNMLEtBQUs7d0JBQ0wsS0FBSztvQkFDTCxLQUFLO29CQUNMLEtBQUs7NkJBR0wsS0FBSztrQ0FDTCxLQUFLOzBCQUNMLEtBQUs7eUJBQ0wsS0FBSzt5QkFDTCxLQUFLO2tDQUdMLE1BQU07K0JBQ04sTUFBTTtvQ0FDTixNQUFNOytCQUNOLE1BQU07NkJBQ04sTUFBTTs0QkFDTixNQUFNOzRCQUNOLE1BQU07NkJBQ04sTUFBTTt5QkFDTixNQUFNOzBCQUNOLE1BQU07NkJBQ04sTUFBTTsyQkFDTixNQUFNO3lCQUNOLE1BQU07O0lBb0dYLG9DQUFDO0NBQUEsQUF0WEQsSUFzWEM7U0FsWFksNkJBQTZCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBBbmd1bGFyIHdyYXBwZXIgZm9yIEJyeW50dW0gUGFnaW5nVG9vbGJhclxuICovXG5cbmltcG9ydCB7IENvbXBvbmVudCwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBPbkRlc3Ryb3ksIE9uSW5pdCwgT3V0cHV0LCBJbnB1dCwgU2ltcGxlQ2hhbmdlLCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgV3JhcHBlckhlbHBlciBmcm9tICcuL3dyYXBwZXIuaGVscGVyJztcblxuLy8gQnJ5bnR1bSAnc2NoZWR1bGVyLmxpdGUudW1kJyBidW5kbGUgY29tZXMgd2l0aG91dCBwb2x5ZmlsbHMgdG8gc3VwcG9ydCBBbmd1bGFyJ3Mgem9uZS5qc1xuaW1wb3J0IHsgQWpheFN0b3JlLCBCYXNlLCBMYXlvdXQsIE1hc2ssIE1hc2tDb25maWcsIE1vZGVsLCBSZWN0YW5nbGUsIFNjcm9sbGVyLCBTY3JvbGxlckNvbmZpZywgV2lkZ2V0LCBXaWRnZXRDb25maWcgfSBmcm9tICdAYnJ5bnR1bS9zY2hlZHVsZXIvc2NoZWR1bGVyLmxpdGUudW1kLmpzJztcbmltcG9ydCB7IFBhZ2luZ1Rvb2xiYXIsIFN0cmluZ0hlbHBlciwgV2lkZ2V0SGVscGVyIH0gZnJvbSAnQGJyeW50dW0vc2NoZWR1bGVyL3NjaGVkdWxlci5saXRlLnVtZC5qcyc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yIDogJ2JyeW50dW0tcGFnaW5nLXRvb2xiYXInLFxuICAgIHRlbXBsYXRlIDogJydcbn0pXG5leHBvcnQgY2xhc3MgQnJ5bnR1bVBhZ2luZ1Rvb2xiYXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG5cbiAgICBwdWJsaWMgc3RhdGljIGluc3RhbmNlQ2xhc3MgPSBQYWdpbmdUb29sYmFyO1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bUZlYXR1cmVOYW1lczogc3RyaW5nW10gPSBbXG5cbiAgICBdO1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bUNvbmZpZ3M6IHN0cmluZ1tdID0gQnJ5bnR1bVBhZ2luZ1Rvb2xiYXJDb21wb25lbnQuYnJ5bnR1bUZlYXR1cmVOYW1lcy5jb25jYXQoW1xuICAgICAgICAnYWRvcHQnLFxuICAgICAgICAnYWxpZ24nLFxuICAgICAgICAnYWxpZ25TZWxmJyxcbiAgICAgICAgJ2FuY2hvcicsXG4gICAgICAgICdhcHBlbmRUbycsXG4gICAgICAgICdidWJibGVFdmVudHMnLFxuICAgICAgICAnY2VudGVyZWQnLFxuICAgICAgICAnY2xzJyxcbiAgICAgICAgJ2NvbmZpZycsXG4gICAgICAgICdjb25zdHJhaW5UbycsXG4gICAgICAgICdjb250ZW50JyxcbiAgICAgICAgJ2NvbnRlbnRFbGVtZW50Q2xzJyxcbiAgICAgICAgJ2RhdGFzZXQnLFxuICAgICAgICAnZGVmYXVsdEJpbmRQcm9wZXJ0eScsXG4gICAgICAgICdkZWZhdWx0cycsXG4gICAgICAgICdkaXNhYmxlZCcsXG4gICAgICAgICdkb2NrJyxcbiAgICAgICAgJ2RyYWdnYWJsZScsXG4gICAgICAgICdleHRyYURhdGEnLFxuICAgICAgICAnZmxleCcsXG4gICAgICAgICdmbG9hdGluZycsXG4gICAgICAgICdoZWlnaHQnLFxuICAgICAgICAnaGlkZGVuJyxcbiAgICAgICAgJ2hpZGVBbmltYXRpb24nLFxuICAgICAgICAnaGlkZVdoZW5FbXB0eScsXG4gICAgICAgICdodG1sJyxcbiAgICAgICAgJ2h0bWxDbHMnLFxuICAgICAgICAnaWQnLFxuICAgICAgICAnaW5zZXJ0QmVmb3JlJyxcbiAgICAgICAgJ2luc2VydEZpcnN0JyxcbiAgICAgICAgJ2l0ZW1DbHMnLFxuICAgICAgICAnaXRlbXMnLFxuICAgICAgICAnbGF5b3V0JyxcbiAgICAgICAgJ2xheW91dFN0eWxlJyxcbiAgICAgICAgJ2xhenlJdGVtcycsXG4gICAgICAgICdsaXN0ZW5lcnMnLFxuICAgICAgICAnbG9jYWxlQ2xhc3MnLFxuICAgICAgICAnbG9jYWxpemFibGVQcm9wZXJ0aWVzJyxcbiAgICAgICAgJ21hcmdpbicsXG4gICAgICAgICdtYXNrRGVmYXVsdHMnLFxuICAgICAgICAnbWFza2VkJyxcbiAgICAgICAgJ21heEhlaWdodCcsXG4gICAgICAgICdtYXhXaWR0aCcsXG4gICAgICAgICdtaW5IZWlnaHQnLFxuICAgICAgICAnbWluV2lkdGgnLFxuICAgICAgICAnbW9uaXRvclJlc2l6ZScsXG4gICAgICAgICduYW1lZEl0ZW1zJyxcbiAgICAgICAgJ292ZXJmbG93JyxcbiAgICAgICAgJ293bmVyJyxcbiAgICAgICAgJ3Bvc2l0aW9uZWQnLFxuICAgICAgICAncHJldmVudFRvb2x0aXBPblRvdWNoJyxcbiAgICAgICAgJ3JlYWRPbmx5JyxcbiAgICAgICAgJ3JpcHBsZScsXG4gICAgICAgICdyb290RWxlbWVudCcsXG4gICAgICAgICdzY3JvbGxhYmxlJyxcbiAgICAgICAgJ3Njcm9sbEFjdGlvbicsXG4gICAgICAgICdzaG93QW5pbWF0aW9uJyxcbiAgICAgICAgJ3N0b3JlJyxcbiAgICAgICAgJ3RhYicsXG4gICAgICAgICd0YWcnLFxuICAgICAgICAndGV4dEFsaWduJyxcbiAgICAgICAgJ3RleHRDb250ZW50JyxcbiAgICAgICAgJ3RpdGxlJyxcbiAgICAgICAgJ3Rvb2xzJyxcbiAgICAgICAgJ3Rvb2x0aXAnLFxuICAgICAgICAnd2VpZ2h0JyxcbiAgICAgICAgJ3dpZGdldENscycsXG4gICAgICAgICd3aWR0aCcsXG4gICAgICAgICd4JyxcbiAgICAgICAgJ3knXG4gICAgXSk7XG5cbiAgICBwcml2YXRlIHN0YXRpYyBicnludHVtQ29uZmlnc09ubHk6IHN0cmluZ1tdID0gW1xuICAgICAgICAnYWRvcHQnLFxuICAgICAgICAnYWxpZ24nLFxuICAgICAgICAnYW5jaG9yJyxcbiAgICAgICAgJ2FwcGVuZFRvJyxcbiAgICAgICAgJ2J1YmJsZUV2ZW50cycsXG4gICAgICAgICdjZW50ZXJlZCcsXG4gICAgICAgICdjbHMnLFxuICAgICAgICAnY29uZmlnJyxcbiAgICAgICAgJ2NvbnN0cmFpblRvJyxcbiAgICAgICAgJ2NvbnRlbnRFbGVtZW50Q2xzJyxcbiAgICAgICAgJ2RlZmF1bHRCaW5kUHJvcGVydHknLFxuICAgICAgICAnZGVmYXVsdHMnLFxuICAgICAgICAnZG9jaycsXG4gICAgICAgICdkcmFnZ2FibGUnLFxuICAgICAgICAnZmxvYXRpbmcnLFxuICAgICAgICAnaGlkZUFuaW1hdGlvbicsXG4gICAgICAgICdoaWRlV2hlbkVtcHR5JyxcbiAgICAgICAgJ2h0bWxDbHMnLFxuICAgICAgICAnaW5zZXJ0QmVmb3JlJyxcbiAgICAgICAgJ2luc2VydEZpcnN0JyxcbiAgICAgICAgJ2l0ZW1DbHMnLFxuICAgICAgICAnbGF6eUl0ZW1zJyxcbiAgICAgICAgJ2xpc3RlbmVycycsXG4gICAgICAgICdsb2NhbGVDbGFzcycsXG4gICAgICAgICdsb2NhbGl6YWJsZVByb3BlcnRpZXMnLFxuICAgICAgICAnbWFza0RlZmF1bHRzJyxcbiAgICAgICAgJ21hc2tlZCcsXG4gICAgICAgICdtb25pdG9yUmVzaXplJyxcbiAgICAgICAgJ25hbWVkSXRlbXMnLFxuICAgICAgICAnb3ZlcmZsb3cnLFxuICAgICAgICAnb3duZXInLFxuICAgICAgICAncG9zaXRpb25lZCcsXG4gICAgICAgICdwcmV2ZW50VG9vbHRpcE9uVG91Y2gnLFxuICAgICAgICAncmlwcGxlJyxcbiAgICAgICAgJ3Jvb3RFbGVtZW50JyxcbiAgICAgICAgJ3Njcm9sbEFjdGlvbicsXG4gICAgICAgICdzaG93QW5pbWF0aW9uJyxcbiAgICAgICAgJ3N0b3JlJyxcbiAgICAgICAgJ3RhYicsXG4gICAgICAgICd0YWcnLFxuICAgICAgICAndGV4dEFsaWduJyxcbiAgICAgICAgJ3RleHRDb250ZW50JyxcbiAgICAgICAgJ3RpdGxlJyxcbiAgICAgICAgJ3Rvb2xzJyxcbiAgICAgICAgJ3dlaWdodCcsXG4gICAgICAgICd3aWRnZXRDbHMnXG4gICAgXTtcblxuICAgIHByaXZhdGUgc3RhdGljIGJyeW50dW1Qcm9wczogc3RyaW5nW10gPSBCcnludHVtUGFnaW5nVG9vbGJhckNvbXBvbmVudC5icnludHVtRmVhdHVyZU5hbWVzLmNvbmNhdChbXG4gICAgICAgICdhbGlnblNlbGYnLFxuICAgICAgICAnYW5jaG9yU2l6ZScsXG4gICAgICAgICdjb250ZW50JyxcbiAgICAgICAgJ2RhdGFzZXQnLFxuICAgICAgICAnZGlzYWJsZWQnLFxuICAgICAgICAnZXh0cmFEYXRhJyxcbiAgICAgICAgJ2ZsZXgnLFxuICAgICAgICAnaGVpZ2h0JyxcbiAgICAgICAgJ2hpZGRlbicsXG4gICAgICAgICdodG1sJyxcbiAgICAgICAgJ2lkJyxcbiAgICAgICAgJ2lzU2V0dGluZ1ZhbHVlcycsXG4gICAgICAgICdpc1ZhbGlkJyxcbiAgICAgICAgJ2l0ZW1zJyxcbiAgICAgICAgJ2xheW91dCcsXG4gICAgICAgICdsYXlvdXRTdHlsZScsXG4gICAgICAgICdtYXJnaW4nLFxuICAgICAgICAnbWF4SGVpZ2h0JyxcbiAgICAgICAgJ21heFdpZHRoJyxcbiAgICAgICAgJ21pbkhlaWdodCcsXG4gICAgICAgICdtaW5XaWR0aCcsXG4gICAgICAgICdyZWFkT25seScsXG4gICAgICAgICdyZWNvcmQnLFxuICAgICAgICAnc2Nyb2xsYWJsZScsXG4gICAgICAgICd0b29sdGlwJyxcbiAgICAgICAgJ3ZhbHVlcycsXG4gICAgICAgICd3aWR0aCcsXG4gICAgICAgICd4JyxcbiAgICAgICAgJ3knXG4gICAgXSk7XG5cbiAgICBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY7XG4gICAgcHVibGljIGluc3RhbmNlOiBQYWdpbmdUb29sYmFyO1xuXG4gICAgcHJpdmF0ZSBicnludHVtQ29uZmlnID0ge1xuICAgICAgICBhbmd1bGFyQ29tcG9uZW50IDogdGhpcyxcbiAgICAgICAgYWRvcHQgICAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgbGlzdGVuZXJzICAgICAgICA6IHt9LFxuICAgICAgICBmZWF0dXJlcyAgICAgICAgIDoge31cbiAgICB9O1xuXG4gICAgY29uc3RydWN0b3IoZWxlbWVudDogRWxlbWVudFJlZikge1xuICAgICAgICB0aGlzLmVsZW1lbnRSZWYgPSBlbGVtZW50O1xuICAgIH1cblxuICAgICAvLyBDb25maWdzIG9ubHlcbiAgICBASW5wdXQoKSBhZG9wdCAgICAgICAgICAgICAgICAgOiBIVE1MRWxlbWVudHxzdHJpbmc7XG4gICAgQElucHV0KCkgYWxpZ24gICAgICAgICAgICAgICAgIDogb2JqZWN0fHN0cmluZztcbiAgICBASW5wdXQoKSBhbmNob3IgICAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGFwcGVuZFRvICAgICAgICAgICAgICA6IEhUTUxFbGVtZW50fHN0cmluZztcbiAgICBASW5wdXQoKSBidWJibGVFdmVudHMgICAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgY2VudGVyZWQgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBjbHMgICAgICAgICAgICAgICAgICAgOiBzdHJpbmd8b2JqZWN0O1xuICAgIEBJbnB1dCgpIGNvbmZpZyAgICAgICAgICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBjb25zdHJhaW5UbyAgICAgICAgICAgOiBIVE1MRWxlbWVudHxXaWRnZXR8UmVjdGFuZ2xlO1xuICAgIEBJbnB1dCgpIGNvbnRlbnRFbGVtZW50Q2xzICAgICA6IHN0cmluZ3xvYmplY3Q7XG4gICAgQElucHV0KCkgZGVmYXVsdEJpbmRQcm9wZXJ0eSAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGRlZmF1bHRzICAgICAgICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBkb2NrICAgICAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgZHJhZ2dhYmxlICAgICAgICAgICAgIDogYm9vbGVhbnxvYmplY3Q7XG4gICAgQElucHV0KCkgZmxvYXRpbmcgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBoaWRlQW5pbWF0aW9uICAgICAgICAgOiBib29sZWFufG9iamVjdDtcbiAgICBASW5wdXQoKSBoaWRlV2hlbkVtcHR5ICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGh0bWxDbHMgICAgICAgICAgICAgICA6IHN0cmluZ3xvYmplY3Q7XG4gICAgQElucHV0KCkgaW5zZXJ0QmVmb3JlICAgICAgICAgIDogSFRNTEVsZW1lbnR8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGluc2VydEZpcnN0ICAgICAgICAgICA6IEhUTUxFbGVtZW50fHN0cmluZztcbiAgICBASW5wdXQoKSBpdGVtQ2xzICAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgbGF6eUl0ZW1zICAgICAgICAgICAgIDogb2JqZWN0fG9iamVjdFtdfFdpZGdldFtdfFBhcnRpYWw8V2lkZ2V0Q29uZmlnPnxQYXJ0aWFsPFdpZGdldENvbmZpZz5bXTtcbiAgICBASW5wdXQoKSBsaXN0ZW5lcnMgICAgICAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgbG9jYWxlQ2xhc3MgICAgICAgICAgIDogQmFzZTtcbiAgICBASW5wdXQoKSBsb2NhbGl6YWJsZVByb3BlcnRpZXMgOiBzdHJpbmdbXTtcbiAgICBASW5wdXQoKSBtYXNrRGVmYXVsdHMgICAgICAgICAgOiBvYmplY3R8TWFza3xQYXJ0aWFsPE1hc2tDb25maWc+O1xuICAgIEBJbnB1dCgpIG1hc2tlZCAgICAgICAgICAgICAgICA6IGJvb2xlYW58c3RyaW5nfG9iamVjdHxNYXNrfFBhcnRpYWw8TWFza0NvbmZpZz47XG4gICAgQElucHV0KCkgbW9uaXRvclJlc2l6ZSAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBuYW1lZEl0ZW1zICAgICAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgb3ZlcmZsb3cgICAgICAgICAgICAgIDogc3RyaW5nfG9iamVjdHxudWxsO1xuICAgIEBJbnB1dCgpIG93bmVyICAgICAgICAgICAgICAgICA6IFdpZGdldDtcbiAgICBASW5wdXQoKSBwb3NpdGlvbmVkICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHByZXZlbnRUb29sdGlwT25Ub3VjaCA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgcmlwcGxlICAgICAgICAgICAgICAgIDogYm9vbGVhbnxvYmplY3Q7XG4gICAgQElucHV0KCkgcm9vdEVsZW1lbnQgICAgICAgICAgIDogU2hhZG93Um9vdDtcbiAgICBASW5wdXQoKSBzY3JvbGxBY3Rpb24gICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgc2hvd0FuaW1hdGlvbiAgICAgICAgIDogYm9vbGVhbnxvYmplY3Q7XG4gICAgQElucHV0KCkgc3RvcmUgICAgICAgICAgICAgICAgIDogQWpheFN0b3JlO1xuICAgIEBJbnB1dCgpIHRhYiAgICAgICAgICAgICAgICAgICA6IGJvb2xlYW58b2JqZWN0O1xuICAgIEBJbnB1dCgpIHRhZyAgICAgICAgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSB0ZXh0QWxpZ24gICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgdGV4dENvbnRlbnQgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSB0aXRsZSAgICAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgdG9vbHMgICAgICAgICAgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIHdlaWdodCAgICAgICAgICAgICAgICA6IG51bWJlcjtcbiAgICBASW5wdXQoKSB3aWRnZXRDbHMgICAgICAgICAgICAgOiBzdHJpbmc7XG5cbiAgICAgLy8gQ29uZmlncyBhbmQgcHJvcGVydGllc1xuICAgIEBJbnB1dCgpIGFsaWduU2VsZiAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGNvbnRlbnQgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGRhdGFzZXQgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIGRpc2FibGVkICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBleHRyYURhdGEgICA6IGJvb2xlYW58bnVtYmVyfG9iamVjdHxzdHJpbmc7XG4gICAgQElucHV0KCkgZmxleCAgICAgICAgOiBudW1iZXJ8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGhlaWdodCAgICAgIDogbnVtYmVyfHN0cmluZztcbiAgICBASW5wdXQoKSBoaWRkZW4gICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgaHRtbCAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgaWQgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgaXRlbXMgICAgICAgOiBXaWRnZXRbXXxvYmplY3R8b2JqZWN0W118UGFydGlhbDxXaWRnZXRDb25maWc+fFBhcnRpYWw8V2lkZ2V0Q29uZmlnPltdO1xuICAgIEBJbnB1dCgpIGxheW91dCAgICAgIDogTGF5b3V0fHN0cmluZztcbiAgICBASW5wdXQoKSBsYXlvdXRTdHlsZSA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBtYXJnaW4gICAgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgbWF4SGVpZ2h0ICAgOiBudW1iZXJ8c3RyaW5nO1xuICAgIEBJbnB1dCgpIG1heFdpZHRoICAgIDogbnVtYmVyfHN0cmluZztcbiAgICBASW5wdXQoKSBtaW5IZWlnaHQgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgbWluV2lkdGggICAgOiBudW1iZXJ8c3RyaW5nO1xuICAgIEBJbnB1dCgpIHJlYWRPbmx5ICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBzY3JvbGxhYmxlICA6IGJvb2xlYW58U2Nyb2xsZXJ8b2JqZWN0fFBhcnRpYWw8U2Nyb2xsZXJDb25maWc+O1xuICAgIEBJbnB1dCgpIHRvb2x0aXAgICAgIDogb2JqZWN0fHN0cmluZztcbiAgICBASW5wdXQoKSB3aWR0aCAgICAgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgeCAgICAgICAgICAgOiBudW1iZXI7XG4gICAgQElucHV0KCkgeSAgICAgICAgICAgOiBudW1iZXI7XG5cbiAgICAgLy8gUHJvcGVydGllcyBvbmx5XG4gICAgQElucHV0KCkgYW5jaG9yU2l6ZSAgICAgIDogbnVtYmVyW107XG4gICAgQElucHV0KCkgaXNTZXR0aW5nVmFsdWVzIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBpc1ZhbGlkICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHJlY29yZCAgICAgICAgICA6IE1vZGVsO1xuICAgIEBJbnB1dCgpIHZhbHVlcyAgICAgICAgICA6IG9iamVjdDtcblxuICAgICAvLyBFdmVudHNcbiAgICBAT3V0cHV0KCkgb25CZWZvcmVEZXN0cm95ICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25CZWZvcmVIaWRlICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25CZWZvcmVTZXRSZWNvcmQgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25CZWZvcmVTaG93ICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25DYXRjaEFsbCAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25EZXN0cm95ICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25Gb2N1c0luICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25Gb2N1c091dCAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25IaWRlICAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25QYWludCAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25SZWFkT25seSAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25SZXNpemUgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25TaG93ICAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhbmQgYXBwZW5kIHRoZSB1bmRlcmx5aW5nIHdpZGdldFxuICAgICAqL1xuICAgIG5nT25Jbml0KCk6IHZvaWQge1xuICAgICAgICBjb25zdFxuICAgICAgICAgICAgbWUgPSB0aGlzLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGVsZW1lbnRSZWYsXG4gICAgICAgICAgICAgICAgYnJ5bnR1bUNvbmZpZ1xuICAgICAgICAgICAgfSA9IG1lLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGluc3RhbmNlQ2xhc3MsXG4gICAgICAgICAgICAgICAgYnJ5bnR1bUNvbmZpZ3NcbiAgICAgICAgICAgIH0gPSBCcnludHVtUGFnaW5nVG9vbGJhckNvbXBvbmVudDtcblxuICAgICAgICBPYmplY3QuYXNzaWduKGJyeW50dW1Db25maWcsIHtcbiAgICAgICAgICAgIGxpc3RlbmVycyA6IHtcbiAgICAgICAgICAgICAgICBiZWZvcmVEZXN0cm95KGV2ZW50IDogYW55KSB7IG1lLm9uQmVmb3JlRGVzdHJveS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBiZWZvcmVIaWRlKGV2ZW50IDogYW55KSB7IG1lLm9uQmVmb3JlSGlkZS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBiZWZvcmVTZXRSZWNvcmQoZXZlbnQgOiBhbnkpIHsgbWUub25CZWZvcmVTZXRSZWNvcmQuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgYmVmb3JlU2hvdyhldmVudCA6IGFueSkgeyBtZS5vbkJlZm9yZVNob3cuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgY2F0Y2hBbGwoZXZlbnQgOiBhbnkpIHsgbWUub25DYXRjaEFsbC5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBkZXN0cm95KGV2ZW50IDogYW55KSB7IG1lLm9uRGVzdHJveS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBmb2N1c0luKGV2ZW50IDogYW55KSB7IG1lLm9uRm9jdXNJbi5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBmb2N1c091dChldmVudCA6IGFueSkgeyBtZS5vbkZvY3VzT3V0LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGhpZGUoZXZlbnQgOiBhbnkpIHsgbWUub25IaWRlLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIHBhaW50KGV2ZW50IDogYW55KSB7IG1lLm9uUGFpbnQuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgcmVhZE9ubHkoZXZlbnQgOiBhbnkpIHsgbWUub25SZWFkT25seS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICByZXNpemUoZXZlbnQgOiBhbnkpIHsgbWUub25SZXNpemUuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgc2hvdyhldmVudCA6IGFueSkgeyBtZS5vblNob3cuZW1pdChldmVudCk7IH0sXG5cbiAgICAgICAgICAgICAgICB0aGlzT2JqIDogbWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gSWYgY29tcG9uZW50IGhhcyBubyBjb250YWluZXIgc3BlY2lmaWVkIGluIGNvbmZpZyB0aGVuIHVzZSBhZG9wdCB0byBXcmFwcGVyJ3MgZWxlbWVudFxuICAgICAgICBjb25zdFxuICAgICAgICAgICAgY29udGFpbmVyUGFyYW0gPSBbXG4gICAgICAgICAgICAgICAgJ2Fkb3B0JyxcbiAgICAgICAgICAgICAgICAnYXBwZW5kVG8nLFxuICAgICAgICAgICAgICAgICdpbnNlcnRBZnRlcicsXG4gICAgICAgICAgICAgICAgJ2luc2VydEJlZm9yZSdcbiAgICAgICAgICAgIF0uZmluZChwcm9wID0+IGJyeW50dW1Db25maWdbcHJvcF0pO1xuICAgICAgICBpZiAoIWNvbnRhaW5lclBhcmFtKSB7XG4gICAgICAgICAgICBicnludHVtQ29uZmlnLmFkb3B0ID0gZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgV3JhcHBlckhlbHBlci5kZXZXYXJuaW5nQ29udGFpbmVyKGluc3RhbmNlQ2xhc3MuJG5hbWUsIGNvbnRhaW5lclBhcmFtKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJyeW50dW1Db25maWdzLmZpbHRlcihwcm9wID0+IHByb3AgaW4gdGhpcykuZm9yRWFjaChwcm9wID0+IHtcbiAgICAgICAgICAgIFdyYXBwZXJIZWxwZXIuYXBwbHlQcm9wVmFsdWUoYnJ5bnR1bUNvbmZpZywgcHJvcCwgdGhpc1twcm9wXSk7XG4gICAgICAgICAgICBpZiAoWydmZWF0dXJlcycsICdjb25maWcnXS5pbmNsdWRlcyhwcm9wKSkge1xuICAgICAgICAgICAgICAgIFdyYXBwZXJIZWxwZXIuZGV2V2FybmluZ0NvbmZpZ1Byb3AoaW5zdGFuY2VDbGFzcy4kbmFtZSwgcHJvcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgbWUuaW5zdGFuY2UgPSBpbnN0YW5jZUNsYXNzLiRuYW1lID09PSAnV2lkZ2V0JyA/IFdpZGdldEhlbHBlci5jcmVhdGVXaWRnZXQoYnJ5bnR1bUNvbmZpZykgOiBuZXcgaW5zdGFuY2VDbGFzcyhicnludHVtQ29uZmlnKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFdhdGNoIGZvciBjaGFuZ2VzXG4gICAgICogQHBhcmFtIGNoYW5nZXNcbiAgICAgKi9cbiAgICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgICAgIGNvbnN0XG4gICAgICAgICAgICB7IGluc3RhbmNlIH0gPSB0aGlzLFxuICAgICAgICAgICAgeyBpbnN0YW5jZUNsYXNzIH0gPSBCcnludHVtUGFnaW5nVG9vbGJhckNvbXBvbmVudDtcblxuICAgICAgICBpZiAoIWluc3RhbmNlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJdGVyYXRlIG92ZXIgYWxsIGNoYW5nZXNcbiAgICAgICAgT2JqZWN0LmVudHJpZXMoY2hhbmdlcykuZm9yRWFjaCgoW3Byb3AsIGNoYW5nZV0pID0+IHtcbiAgICAgICAgICAgIGNvbnN0XG4gICAgICAgICAgICAgICAgbmV3VmFsdWUgPSAoY2hhbmdlIGFzIFNpbXBsZUNoYW5nZSkuY3VycmVudFZhbHVlLFxuICAgICAgICAgICAgICAgIHsgaW5zdGFuY2UgfSA9IHRoaXMsXG4gICAgICAgICAgICAgICAgeyBicnludHVtQ29uZmlnc09ubHksIGJyeW50dW1Qcm9wcyB9ID0gQnJ5bnR1bVBhZ2luZ1Rvb2xiYXJDb21wb25lbnQ7XG4gICAgICAgICAgICBpZiAoYnJ5bnR1bVByb3BzLmluY2x1ZGVzKHByb3ApKSB7XG4gICAgICAgICAgICAgICAgV3JhcHBlckhlbHBlci5hcHBseVByb3BWYWx1ZShpbnN0YW5jZSwgcHJvcCwgbmV3VmFsdWUsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICBpZiAoYnJ5bnR1bUNvbmZpZ3NPbmx5LmluY2x1ZGVzKHByb3ApKSB7XG4gICAgICAgICAgICAgICAgICAgIFdyYXBwZXJIZWxwZXIuZGV2V2FybmluZ1VwZGF0ZVByb3AoaW5zdGFuY2VDbGFzcy4kbmFtZSwgcHJvcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZXN0cm95IHRoZSBjb21wb25lbnRcbiAgICAgKi9cbiAgICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaW5zdGFuY2UpIHtcbiAgICAgICAgICAgIHRoaXMuaW5zdGFuY2UuZGVzdHJveSgpO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19