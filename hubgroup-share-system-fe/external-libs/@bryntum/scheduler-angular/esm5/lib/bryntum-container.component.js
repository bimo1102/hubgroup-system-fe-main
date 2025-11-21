/**
 * Angular wrapper for Bryntum Container
 */
import * as tslib_1 from "tslib";
import { Component, ElementRef, EventEmitter, Output, Input } from '@angular/core';
import WrapperHelper from './wrapper.helper';
// Bryntum 'scheduler.lite.umd' bundle comes without polyfills to support Angular's zone.js
import { Base, Model, Widget } from '@bryntum/scheduler/scheduler.lite.umd.js';
import { Container, WidgetHelper } from '@bryntum/scheduler/scheduler.lite.umd.js';
var BryntumContainerComponent = /** @class */ (function () {
    function BryntumContainerComponent(element) {
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
    BryntumContainerComponent.prototype.ngOnInit = function () {
        var _this = this;
        var me = this, elementRef = me.elementRef, bryntumConfig = me.bryntumConfig, instanceClass = BryntumContainerComponent.instanceClass, bryntumConfigs = BryntumContainerComponent.bryntumConfigs;
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
    BryntumContainerComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        var instance = this.instance, instanceClass = BryntumContainerComponent.instanceClass;
        if (!instance) {
            return;
        }
        // Iterate over all changes
        Object.entries(changes).forEach(function (_a) {
            var _b = tslib_1.__read(_a, 2), prop = _b[0], change = _b[1];
            var newValue = change.currentValue, instance = _this.instance, bryntumConfigsOnly = BryntumContainerComponent.bryntumConfigsOnly, bryntumProps = BryntumContainerComponent.bryntumProps;
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
    BryntumContainerComponent.prototype.ngOnDestroy = function () {
        if (this.instance) {
            this.instance.destroy();
        }
    };
    BryntumContainerComponent.instanceClass = Container;
    BryntumContainerComponent.bryntumFeatureNames = [];
    BryntumContainerComponent.bryntumConfigs = BryntumContainerComponent.bryntumFeatureNames.concat([
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
        'owner',
        'positioned',
        'preventTooltipOnTouch',
        'readOnly',
        'ripple',
        'rootElement',
        'scrollable',
        'scrollAction',
        'showAnimation',
        'tab',
        'tag',
        'textAlign',
        'textContent',
        'title',
        'tooltip',
        'weight',
        'width',
        'x',
        'y'
    ]);
    BryntumContainerComponent.bryntumConfigsOnly = [
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
        'owner',
        'positioned',
        'preventTooltipOnTouch',
        'ripple',
        'rootElement',
        'scrollAction',
        'showAnimation',
        'tab',
        'tag',
        'textAlign',
        'textContent',
        'title',
        'weight'
    ];
    BryntumContainerComponent.bryntumProps = BryntumContainerComponent.bryntumFeatureNames.concat([
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
    BryntumContainerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bryntum-container',
                    template: ''
                }] }
    ];
    /** @nocollapse */
    BryntumContainerComponent.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    BryntumContainerComponent.propDecorators = {
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
        owner: [{ type: Input }],
        positioned: [{ type: Input }],
        preventTooltipOnTouch: [{ type: Input }],
        ripple: [{ type: Input }],
        rootElement: [{ type: Input }],
        scrollAction: [{ type: Input }],
        showAnimation: [{ type: Input }],
        tab: [{ type: Input }],
        tag: [{ type: Input }],
        textAlign: [{ type: Input }],
        textContent: [{ type: Input }],
        title: [{ type: Input }],
        weight: [{ type: Input }],
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
    return BryntumContainerComponent;
}());
export { BryntumContainerComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJ5bnR1bS1jb250YWluZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGJyeW50dW0vc2NoZWR1bGVyLWFuZ3VsYXIvIiwic291cmNlcyI6WyJsaWIvYnJ5bnR1bS1jb250YWluZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztHQUVHOztBQUVILE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBcUIsTUFBTSxFQUFFLEtBQUssRUFBK0IsTUFBTSxlQUFlLENBQUM7QUFDbkksT0FBTyxhQUFhLE1BQU0sa0JBQWtCLENBQUM7QUFFN0MsMkZBQTJGO0FBQzNGLE9BQU8sRUFBRSxJQUFJLEVBQTRCLEtBQUssRUFBdUMsTUFBTSxFQUFnQixNQUFNLDBDQUEwQyxDQUFDO0FBQzVKLE9BQU8sRUFBRSxTQUFTLEVBQWdCLFlBQVksRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBRWpHO0lBd0tJLG1DQUFZLE9BQW1CO1FBUHZCLGtCQUFhLEdBQUc7WUFDcEIsZ0JBQWdCLEVBQUcsSUFBSTtZQUN2QixLQUFLLEVBQWMsU0FBUztZQUM1QixTQUFTLEVBQVUsRUFBRTtZQUNyQixRQUFRLEVBQVcsRUFBRTtTQUN4QixDQUFDO1FBbUZELFNBQVM7UUFDQSxvQkFBZSxHQUFLLElBQUksWUFBWSxFQUFVLENBQUM7UUFDL0MsaUJBQVksR0FBUSxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQy9DLHNCQUFpQixHQUFHLElBQUksWUFBWSxFQUFVLENBQUM7UUFDL0MsaUJBQVksR0FBUSxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQy9DLGVBQVUsR0FBVSxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQy9DLGNBQVMsR0FBVyxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQy9DLGNBQVMsR0FBVyxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQy9DLGVBQVUsR0FBVSxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQy9DLFdBQU0sR0FBYyxJQUFJLFlBQVks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Szs2QkFHTCxLQUFLO2tDQUNMLEtBQUs7MEJBQ0wsS0FBSzt5QkFDTCxLQUFLO3lCQUNMLEtBQUs7a0NBR0wsTUFBTTsrQkFDTixNQUFNO29DQUNOLE1BQU07K0JBQ04sTUFBTTs2QkFDTixNQUFNOzRCQUNOLE1BQU07NEJBQ04sTUFBTTs2QkFDTixNQUFNO3lCQUNOLE1BQU07MEJBQ04sTUFBTTs2QkFDTixNQUFNOzJCQUNOLE1BQU07eUJBQ04sTUFBTTs7SUFvR1gsZ0NBQUM7Q0FBQSxBQTFXRCxJQTBXQztTQXRXWSx5QkFBeUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEFuZ3VsYXIgd3JhcHBlciBmb3IgQnJ5bnR1bSBDb250YWluZXJcbiAqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgT25EZXN0cm95LCBPbkluaXQsIE91dHB1dCwgSW5wdXQsIFNpbXBsZUNoYW5nZSwgU2ltcGxlQ2hhbmdlcyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IFdyYXBwZXJIZWxwZXIgZnJvbSAnLi93cmFwcGVyLmhlbHBlcic7XG5cbi8vIEJyeW50dW0gJ3NjaGVkdWxlci5saXRlLnVtZCcgYnVuZGxlIGNvbWVzIHdpdGhvdXQgcG9seWZpbGxzIHRvIHN1cHBvcnQgQW5ndWxhcidzIHpvbmUuanNcbmltcG9ydCB7IEJhc2UsIExheW91dCwgTWFzaywgTWFza0NvbmZpZywgTW9kZWwsIFJlY3RhbmdsZSwgU2Nyb2xsZXIsIFNjcm9sbGVyQ29uZmlnLCBXaWRnZXQsIFdpZGdldENvbmZpZyB9IGZyb20gJ0BicnludHVtL3NjaGVkdWxlci9zY2hlZHVsZXIubGl0ZS51bWQuanMnO1xuaW1wb3J0IHsgQ29udGFpbmVyLCBTdHJpbmdIZWxwZXIsIFdpZGdldEhlbHBlciB9IGZyb20gJ0BicnludHVtL3NjaGVkdWxlci9zY2hlZHVsZXIubGl0ZS51bWQuanMnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvciA6ICdicnludHVtLWNvbnRhaW5lcicsXG4gICAgdGVtcGxhdGUgOiAnJ1xufSlcbmV4cG9ydCBjbGFzcyBCcnludHVtQ29udGFpbmVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuXG4gICAgcHVibGljIHN0YXRpYyBpbnN0YW5jZUNsYXNzID0gQ29udGFpbmVyO1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bUZlYXR1cmVOYW1lczogc3RyaW5nW10gPSBbXG5cbiAgICBdO1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bUNvbmZpZ3M6IHN0cmluZ1tdID0gQnJ5bnR1bUNvbnRhaW5lckNvbXBvbmVudC5icnludHVtRmVhdHVyZU5hbWVzLmNvbmNhdChbXG4gICAgICAgICdhZG9wdCcsXG4gICAgICAgICdhbGlnbicsXG4gICAgICAgICdhbGlnblNlbGYnLFxuICAgICAgICAnYW5jaG9yJyxcbiAgICAgICAgJ2FwcGVuZFRvJyxcbiAgICAgICAgJ2J1YmJsZUV2ZW50cycsXG4gICAgICAgICdjZW50ZXJlZCcsXG4gICAgICAgICdjbHMnLFxuICAgICAgICAnY29uZmlnJyxcbiAgICAgICAgJ2NvbnN0cmFpblRvJyxcbiAgICAgICAgJ2NvbnRlbnQnLFxuICAgICAgICAnY29udGVudEVsZW1lbnRDbHMnLFxuICAgICAgICAnZGF0YXNldCcsXG4gICAgICAgICdkZWZhdWx0QmluZFByb3BlcnR5JyxcbiAgICAgICAgJ2RlZmF1bHRzJyxcbiAgICAgICAgJ2Rpc2FibGVkJyxcbiAgICAgICAgJ2RvY2snLFxuICAgICAgICAnZHJhZ2dhYmxlJyxcbiAgICAgICAgJ2V4dHJhRGF0YScsXG4gICAgICAgICdmbGV4JyxcbiAgICAgICAgJ2Zsb2F0aW5nJyxcbiAgICAgICAgJ2hlaWdodCcsXG4gICAgICAgICdoaWRkZW4nLFxuICAgICAgICAnaGlkZUFuaW1hdGlvbicsXG4gICAgICAgICdoaWRlV2hlbkVtcHR5JyxcbiAgICAgICAgJ2h0bWwnLFxuICAgICAgICAnaHRtbENscycsXG4gICAgICAgICdpZCcsXG4gICAgICAgICdpbnNlcnRCZWZvcmUnLFxuICAgICAgICAnaW5zZXJ0Rmlyc3QnLFxuICAgICAgICAnaXRlbUNscycsXG4gICAgICAgICdpdGVtcycsXG4gICAgICAgICdsYXlvdXQnLFxuICAgICAgICAnbGF5b3V0U3R5bGUnLFxuICAgICAgICAnbGF6eUl0ZW1zJyxcbiAgICAgICAgJ2xpc3RlbmVycycsXG4gICAgICAgICdsb2NhbGVDbGFzcycsXG4gICAgICAgICdsb2NhbGl6YWJsZVByb3BlcnRpZXMnLFxuICAgICAgICAnbWFyZ2luJyxcbiAgICAgICAgJ21hc2tEZWZhdWx0cycsXG4gICAgICAgICdtYXNrZWQnLFxuICAgICAgICAnbWF4SGVpZ2h0JyxcbiAgICAgICAgJ21heFdpZHRoJyxcbiAgICAgICAgJ21pbkhlaWdodCcsXG4gICAgICAgICdtaW5XaWR0aCcsXG4gICAgICAgICdtb25pdG9yUmVzaXplJyxcbiAgICAgICAgJ25hbWVkSXRlbXMnLFxuICAgICAgICAnb3duZXInLFxuICAgICAgICAncG9zaXRpb25lZCcsXG4gICAgICAgICdwcmV2ZW50VG9vbHRpcE9uVG91Y2gnLFxuICAgICAgICAncmVhZE9ubHknLFxuICAgICAgICAncmlwcGxlJyxcbiAgICAgICAgJ3Jvb3RFbGVtZW50JyxcbiAgICAgICAgJ3Njcm9sbGFibGUnLFxuICAgICAgICAnc2Nyb2xsQWN0aW9uJyxcbiAgICAgICAgJ3Nob3dBbmltYXRpb24nLFxuICAgICAgICAndGFiJyxcbiAgICAgICAgJ3RhZycsXG4gICAgICAgICd0ZXh0QWxpZ24nLFxuICAgICAgICAndGV4dENvbnRlbnQnLFxuICAgICAgICAndGl0bGUnLFxuICAgICAgICAndG9vbHRpcCcsXG4gICAgICAgICd3ZWlnaHQnLFxuICAgICAgICAnd2lkdGgnLFxuICAgICAgICAneCcsXG4gICAgICAgICd5J1xuICAgIF0pO1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bUNvbmZpZ3NPbmx5OiBzdHJpbmdbXSA9IFtcbiAgICAgICAgJ2Fkb3B0JyxcbiAgICAgICAgJ2FsaWduJyxcbiAgICAgICAgJ2FuY2hvcicsXG4gICAgICAgICdhcHBlbmRUbycsXG4gICAgICAgICdidWJibGVFdmVudHMnLFxuICAgICAgICAnY2VudGVyZWQnLFxuICAgICAgICAnY2xzJyxcbiAgICAgICAgJ2NvbmZpZycsXG4gICAgICAgICdjb25zdHJhaW5UbycsXG4gICAgICAgICdjb250ZW50RWxlbWVudENscycsXG4gICAgICAgICdkZWZhdWx0QmluZFByb3BlcnR5JyxcbiAgICAgICAgJ2RlZmF1bHRzJyxcbiAgICAgICAgJ2RvY2snLFxuICAgICAgICAnZHJhZ2dhYmxlJyxcbiAgICAgICAgJ2Zsb2F0aW5nJyxcbiAgICAgICAgJ2hpZGVBbmltYXRpb24nLFxuICAgICAgICAnaGlkZVdoZW5FbXB0eScsXG4gICAgICAgICdodG1sQ2xzJyxcbiAgICAgICAgJ2luc2VydEJlZm9yZScsXG4gICAgICAgICdpbnNlcnRGaXJzdCcsXG4gICAgICAgICdpdGVtQ2xzJyxcbiAgICAgICAgJ2xhenlJdGVtcycsXG4gICAgICAgICdsaXN0ZW5lcnMnLFxuICAgICAgICAnbG9jYWxlQ2xhc3MnLFxuICAgICAgICAnbG9jYWxpemFibGVQcm9wZXJ0aWVzJyxcbiAgICAgICAgJ21hc2tEZWZhdWx0cycsXG4gICAgICAgICdtYXNrZWQnLFxuICAgICAgICAnbW9uaXRvclJlc2l6ZScsXG4gICAgICAgICduYW1lZEl0ZW1zJyxcbiAgICAgICAgJ293bmVyJyxcbiAgICAgICAgJ3Bvc2l0aW9uZWQnLFxuICAgICAgICAncHJldmVudFRvb2x0aXBPblRvdWNoJyxcbiAgICAgICAgJ3JpcHBsZScsXG4gICAgICAgICdyb290RWxlbWVudCcsXG4gICAgICAgICdzY3JvbGxBY3Rpb24nLFxuICAgICAgICAnc2hvd0FuaW1hdGlvbicsXG4gICAgICAgICd0YWInLFxuICAgICAgICAndGFnJyxcbiAgICAgICAgJ3RleHRBbGlnbicsXG4gICAgICAgICd0ZXh0Q29udGVudCcsXG4gICAgICAgICd0aXRsZScsXG4gICAgICAgICd3ZWlnaHQnXG4gICAgXTtcblxuICAgIHByaXZhdGUgc3RhdGljIGJyeW50dW1Qcm9wczogc3RyaW5nW10gPSBCcnludHVtQ29udGFpbmVyQ29tcG9uZW50LmJyeW50dW1GZWF0dXJlTmFtZXMuY29uY2F0KFtcbiAgICAgICAgJ2FsaWduU2VsZicsXG4gICAgICAgICdhbmNob3JTaXplJyxcbiAgICAgICAgJ2NvbnRlbnQnLFxuICAgICAgICAnZGF0YXNldCcsXG4gICAgICAgICdkaXNhYmxlZCcsXG4gICAgICAgICdleHRyYURhdGEnLFxuICAgICAgICAnZmxleCcsXG4gICAgICAgICdoZWlnaHQnLFxuICAgICAgICAnaGlkZGVuJyxcbiAgICAgICAgJ2h0bWwnLFxuICAgICAgICAnaWQnLFxuICAgICAgICAnaXNTZXR0aW5nVmFsdWVzJyxcbiAgICAgICAgJ2lzVmFsaWQnLFxuICAgICAgICAnaXRlbXMnLFxuICAgICAgICAnbGF5b3V0JyxcbiAgICAgICAgJ2xheW91dFN0eWxlJyxcbiAgICAgICAgJ21hcmdpbicsXG4gICAgICAgICdtYXhIZWlnaHQnLFxuICAgICAgICAnbWF4V2lkdGgnLFxuICAgICAgICAnbWluSGVpZ2h0JyxcbiAgICAgICAgJ21pbldpZHRoJyxcbiAgICAgICAgJ3JlYWRPbmx5JyxcbiAgICAgICAgJ3JlY29yZCcsXG4gICAgICAgICdzY3JvbGxhYmxlJyxcbiAgICAgICAgJ3Rvb2x0aXAnLFxuICAgICAgICAndmFsdWVzJyxcbiAgICAgICAgJ3dpZHRoJyxcbiAgICAgICAgJ3gnLFxuICAgICAgICAneSdcbiAgICBdKTtcblxuICAgIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZjtcbiAgICBwdWJsaWMgaW5zdGFuY2U6IENvbnRhaW5lcjtcblxuICAgIHByaXZhdGUgYnJ5bnR1bUNvbmZpZyA9IHtcbiAgICAgICAgYW5ndWxhckNvbXBvbmVudCA6IHRoaXMsXG4gICAgICAgIGFkb3B0ICAgICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgIGxpc3RlbmVycyAgICAgICAgOiB7fSxcbiAgICAgICAgZmVhdHVyZXMgICAgICAgICA6IHt9XG4gICAgfTtcblxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQ6IEVsZW1lbnRSZWYpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50UmVmID0gZWxlbWVudDtcbiAgICB9XG5cbiAgICAgLy8gQ29uZmlncyBvbmx5XG4gICAgQElucHV0KCkgYWRvcHQgICAgICAgICAgICAgICAgIDogSFRNTEVsZW1lbnR8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGFsaWduICAgICAgICAgICAgICAgICA6IG9iamVjdHxzdHJpbmc7XG4gICAgQElucHV0KCkgYW5jaG9yICAgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBhcHBlbmRUbyAgICAgICAgICAgICAgOiBIVE1MRWxlbWVudHxzdHJpbmc7XG4gICAgQElucHV0KCkgYnViYmxlRXZlbnRzICAgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIGNlbnRlcmVkICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgY2xzICAgICAgICAgICAgICAgICAgIDogc3RyaW5nfG9iamVjdDtcbiAgICBASW5wdXQoKSBjb25maWcgICAgICAgICAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgY29uc3RyYWluVG8gICAgICAgICAgIDogSFRNTEVsZW1lbnR8V2lkZ2V0fFJlY3RhbmdsZTtcbiAgICBASW5wdXQoKSBjb250ZW50RWxlbWVudENscyAgICAgOiBzdHJpbmd8b2JqZWN0O1xuICAgIEBJbnB1dCgpIGRlZmF1bHRCaW5kUHJvcGVydHkgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBkZWZhdWx0cyAgICAgICAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgZG9jayAgICAgICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGRyYWdnYWJsZSAgICAgICAgICAgICA6IGJvb2xlYW58b2JqZWN0O1xuICAgIEBJbnB1dCgpIGZsb2F0aW5nICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgaGlkZUFuaW1hdGlvbiAgICAgICAgIDogYm9vbGVhbnxvYmplY3Q7XG4gICAgQElucHV0KCkgaGlkZVdoZW5FbXB0eSAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBodG1sQ2xzICAgICAgICAgICAgICAgOiBzdHJpbmd8b2JqZWN0O1xuICAgIEBJbnB1dCgpIGluc2VydEJlZm9yZSAgICAgICAgICA6IEhUTUxFbGVtZW50fHN0cmluZztcbiAgICBASW5wdXQoKSBpbnNlcnRGaXJzdCAgICAgICAgICAgOiBIVE1MRWxlbWVudHxzdHJpbmc7XG4gICAgQElucHV0KCkgaXRlbUNscyAgICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGxhenlJdGVtcyAgICAgICAgICAgICA6IG9iamVjdHxvYmplY3RbXXxXaWRnZXRbXXxQYXJ0aWFsPFdpZGdldENvbmZpZz58UGFydGlhbDxXaWRnZXRDb25maWc+W107XG4gICAgQElucHV0KCkgbGlzdGVuZXJzICAgICAgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIGxvY2FsZUNsYXNzICAgICAgICAgICA6IEJhc2U7XG4gICAgQElucHV0KCkgbG9jYWxpemFibGVQcm9wZXJ0aWVzIDogc3RyaW5nW107XG4gICAgQElucHV0KCkgbWFza0RlZmF1bHRzICAgICAgICAgIDogb2JqZWN0fE1hc2t8UGFydGlhbDxNYXNrQ29uZmlnPjtcbiAgICBASW5wdXQoKSBtYXNrZWQgICAgICAgICAgICAgICAgOiBib29sZWFufHN0cmluZ3xvYmplY3R8TWFza3xQYXJ0aWFsPE1hc2tDb25maWc+O1xuICAgIEBJbnB1dCgpIG1vbml0b3JSZXNpemUgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgbmFtZWRJdGVtcyAgICAgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIG93bmVyICAgICAgICAgICAgICAgICA6IFdpZGdldDtcbiAgICBASW5wdXQoKSBwb3NpdGlvbmVkICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHByZXZlbnRUb29sdGlwT25Ub3VjaCA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgcmlwcGxlICAgICAgICAgICAgICAgIDogYm9vbGVhbnxvYmplY3Q7XG4gICAgQElucHV0KCkgcm9vdEVsZW1lbnQgICAgICAgICAgIDogU2hhZG93Um9vdDtcbiAgICBASW5wdXQoKSBzY3JvbGxBY3Rpb24gICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgc2hvd0FuaW1hdGlvbiAgICAgICAgIDogYm9vbGVhbnxvYmplY3Q7XG4gICAgQElucHV0KCkgdGFiICAgICAgICAgICAgICAgICAgIDogYm9vbGVhbnxvYmplY3Q7XG4gICAgQElucHV0KCkgdGFnICAgICAgICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIHRleHRBbGlnbiAgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSB0ZXh0Q29udGVudCAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHRpdGxlICAgICAgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSB3ZWlnaHQgICAgICAgICAgICAgICAgOiBudW1iZXI7XG5cbiAgICAgLy8gQ29uZmlncyBhbmQgcHJvcGVydGllc1xuICAgIEBJbnB1dCgpIGFsaWduU2VsZiAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGNvbnRlbnQgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGRhdGFzZXQgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIGRpc2FibGVkICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBleHRyYURhdGEgICA6IGJvb2xlYW58bnVtYmVyfG9iamVjdHxzdHJpbmc7XG4gICAgQElucHV0KCkgZmxleCAgICAgICAgOiBudW1iZXJ8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGhlaWdodCAgICAgIDogbnVtYmVyfHN0cmluZztcbiAgICBASW5wdXQoKSBoaWRkZW4gICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgaHRtbCAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgaWQgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgaXRlbXMgICAgICAgOiBXaWRnZXRbXXxvYmplY3R8b2JqZWN0W118UGFydGlhbDxXaWRnZXRDb25maWc+fFBhcnRpYWw8V2lkZ2V0Q29uZmlnPltdO1xuICAgIEBJbnB1dCgpIGxheW91dCAgICAgIDogTGF5b3V0fHN0cmluZztcbiAgICBASW5wdXQoKSBsYXlvdXRTdHlsZSA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBtYXJnaW4gICAgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgbWF4SGVpZ2h0ICAgOiBudW1iZXJ8c3RyaW5nO1xuICAgIEBJbnB1dCgpIG1heFdpZHRoICAgIDogbnVtYmVyfHN0cmluZztcbiAgICBASW5wdXQoKSBtaW5IZWlnaHQgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgbWluV2lkdGggICAgOiBudW1iZXJ8c3RyaW5nO1xuICAgIEBJbnB1dCgpIHJlYWRPbmx5ICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBzY3JvbGxhYmxlICA6IGJvb2xlYW58U2Nyb2xsZXJ8b2JqZWN0fFBhcnRpYWw8U2Nyb2xsZXJDb25maWc+O1xuICAgIEBJbnB1dCgpIHRvb2x0aXAgICAgIDogb2JqZWN0fHN0cmluZztcbiAgICBASW5wdXQoKSB3aWR0aCAgICAgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgeCAgICAgICAgICAgOiBudW1iZXI7XG4gICAgQElucHV0KCkgeSAgICAgICAgICAgOiBudW1iZXI7XG5cbiAgICAgLy8gUHJvcGVydGllcyBvbmx5XG4gICAgQElucHV0KCkgYW5jaG9yU2l6ZSAgICAgIDogbnVtYmVyW107XG4gICAgQElucHV0KCkgaXNTZXR0aW5nVmFsdWVzIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBpc1ZhbGlkICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHJlY29yZCAgICAgICAgICA6IE1vZGVsO1xuICAgIEBJbnB1dCgpIHZhbHVlcyAgICAgICAgICA6IG9iamVjdDtcblxuICAgICAvLyBFdmVudHNcbiAgICBAT3V0cHV0KCkgb25CZWZvcmVEZXN0cm95ICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25CZWZvcmVIaWRlICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25CZWZvcmVTZXRSZWNvcmQgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25CZWZvcmVTaG93ICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25DYXRjaEFsbCAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25EZXN0cm95ICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25Gb2N1c0luICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25Gb2N1c091dCAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25IaWRlICAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25QYWludCAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25SZWFkT25seSAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25SZXNpemUgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25TaG93ICAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhbmQgYXBwZW5kIHRoZSB1bmRlcmx5aW5nIHdpZGdldFxuICAgICAqL1xuICAgIG5nT25Jbml0KCk6IHZvaWQge1xuICAgICAgICBjb25zdFxuICAgICAgICAgICAgbWUgPSB0aGlzLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGVsZW1lbnRSZWYsXG4gICAgICAgICAgICAgICAgYnJ5bnR1bUNvbmZpZ1xuICAgICAgICAgICAgfSA9IG1lLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGluc3RhbmNlQ2xhc3MsXG4gICAgICAgICAgICAgICAgYnJ5bnR1bUNvbmZpZ3NcbiAgICAgICAgICAgIH0gPSBCcnludHVtQ29udGFpbmVyQ29tcG9uZW50O1xuXG4gICAgICAgIE9iamVjdC5hc3NpZ24oYnJ5bnR1bUNvbmZpZywge1xuICAgICAgICAgICAgbGlzdGVuZXJzIDoge1xuICAgICAgICAgICAgICAgIGJlZm9yZURlc3Ryb3koZXZlbnQgOiBhbnkpIHsgbWUub25CZWZvcmVEZXN0cm95LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGJlZm9yZUhpZGUoZXZlbnQgOiBhbnkpIHsgbWUub25CZWZvcmVIaWRlLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGJlZm9yZVNldFJlY29yZChldmVudCA6IGFueSkgeyBtZS5vbkJlZm9yZVNldFJlY29yZC5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBiZWZvcmVTaG93KGV2ZW50IDogYW55KSB7IG1lLm9uQmVmb3JlU2hvdy5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBjYXRjaEFsbChldmVudCA6IGFueSkgeyBtZS5vbkNhdGNoQWxsLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGRlc3Ryb3koZXZlbnQgOiBhbnkpIHsgbWUub25EZXN0cm95LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGZvY3VzSW4oZXZlbnQgOiBhbnkpIHsgbWUub25Gb2N1c0luLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGZvY3VzT3V0KGV2ZW50IDogYW55KSB7IG1lLm9uRm9jdXNPdXQuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgaGlkZShldmVudCA6IGFueSkgeyBtZS5vbkhpZGUuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgcGFpbnQoZXZlbnQgOiBhbnkpIHsgbWUub25QYWludC5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICByZWFkT25seShldmVudCA6IGFueSkgeyBtZS5vblJlYWRPbmx5LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIHJlc2l6ZShldmVudCA6IGFueSkgeyBtZS5vblJlc2l6ZS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBzaG93KGV2ZW50IDogYW55KSB7IG1lLm9uU2hvdy5lbWl0KGV2ZW50KTsgfSxcblxuICAgICAgICAgICAgICAgIHRoaXNPYmogOiBtZVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBJZiBjb21wb25lbnQgaGFzIG5vIGNvbnRhaW5lciBzcGVjaWZpZWQgaW4gY29uZmlnIHRoZW4gdXNlIGFkb3B0IHRvIFdyYXBwZXIncyBlbGVtZW50XG4gICAgICAgIGNvbnN0XG4gICAgICAgICAgICBjb250YWluZXJQYXJhbSA9IFtcbiAgICAgICAgICAgICAgICAnYWRvcHQnLFxuICAgICAgICAgICAgICAgICdhcHBlbmRUbycsXG4gICAgICAgICAgICAgICAgJ2luc2VydEFmdGVyJyxcbiAgICAgICAgICAgICAgICAnaW5zZXJ0QmVmb3JlJ1xuICAgICAgICAgICAgXS5maW5kKHByb3AgPT4gYnJ5bnR1bUNvbmZpZ1twcm9wXSk7XG4gICAgICAgIGlmICghY29udGFpbmVyUGFyYW0pIHtcbiAgICAgICAgICAgIGJyeW50dW1Db25maWcuYWRvcHQgPSBlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBXcmFwcGVySGVscGVyLmRldldhcm5pbmdDb250YWluZXIoaW5zdGFuY2VDbGFzcy4kbmFtZSwgY29udGFpbmVyUGFyYW0pO1xuICAgICAgICB9XG5cbiAgICAgICAgYnJ5bnR1bUNvbmZpZ3MuZmlsdGVyKHByb3AgPT4gcHJvcCBpbiB0aGlzKS5mb3JFYWNoKHByb3AgPT4ge1xuICAgICAgICAgICAgV3JhcHBlckhlbHBlci5hcHBseVByb3BWYWx1ZShicnludHVtQ29uZmlnLCBwcm9wLCB0aGlzW3Byb3BdKTtcbiAgICAgICAgICAgIGlmIChbJ2ZlYXR1cmVzJywgJ2NvbmZpZyddLmluY2x1ZGVzKHByb3ApKSB7XG4gICAgICAgICAgICAgICAgV3JhcHBlckhlbHBlci5kZXZXYXJuaW5nQ29uZmlnUHJvcChpbnN0YW5jZUNsYXNzLiRuYW1lLCBwcm9wKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBtZS5pbnN0YW5jZSA9IGluc3RhbmNlQ2xhc3MuJG5hbWUgPT09ICdXaWRnZXQnID8gV2lkZ2V0SGVscGVyLmNyZWF0ZVdpZGdldChicnludHVtQ29uZmlnKSA6IG5ldyBpbnN0YW5jZUNsYXNzKGJyeW50dW1Db25maWcpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogV2F0Y2ggZm9yIGNoYW5nZXNcbiAgICAgKiBAcGFyYW0gY2hhbmdlc1xuICAgICAqL1xuICAgIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICAgICAgY29uc3RcbiAgICAgICAgICAgIHsgaW5zdGFuY2UgfSA9IHRoaXMsXG4gICAgICAgICAgICB7IGluc3RhbmNlQ2xhc3MgfSA9IEJyeW50dW1Db250YWluZXJDb21wb25lbnQ7XG5cbiAgICAgICAgaWYgKCFpbnN0YW5jZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSXRlcmF0ZSBvdmVyIGFsbCBjaGFuZ2VzXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKGNoYW5nZXMpLmZvckVhY2goKFtwcm9wLCBjaGFuZ2VdKSA9PiB7XG4gICAgICAgICAgICBjb25zdFxuICAgICAgICAgICAgICAgIG5ld1ZhbHVlID0gKGNoYW5nZSBhcyBTaW1wbGVDaGFuZ2UpLmN1cnJlbnRWYWx1ZSxcbiAgICAgICAgICAgICAgICB7IGluc3RhbmNlIH0gPSB0aGlzLFxuICAgICAgICAgICAgICAgIHsgYnJ5bnR1bUNvbmZpZ3NPbmx5LCBicnludHVtUHJvcHMgfSA9IEJyeW50dW1Db250YWluZXJDb21wb25lbnQ7XG4gICAgICAgICAgICBpZiAoYnJ5bnR1bVByb3BzLmluY2x1ZGVzKHByb3ApKSB7XG4gICAgICAgICAgICAgICAgV3JhcHBlckhlbHBlci5hcHBseVByb3BWYWx1ZShpbnN0YW5jZSwgcHJvcCwgbmV3VmFsdWUsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICBpZiAoYnJ5bnR1bUNvbmZpZ3NPbmx5LmluY2x1ZGVzKHByb3ApKSB7XG4gICAgICAgICAgICAgICAgICAgIFdyYXBwZXJIZWxwZXIuZGV2V2FybmluZ1VwZGF0ZVByb3AoaW5zdGFuY2VDbGFzcy4kbmFtZSwgcHJvcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZXN0cm95IHRoZSBjb21wb25lbnRcbiAgICAgKi9cbiAgICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaW5zdGFuY2UpIHtcbiAgICAgICAgICAgIHRoaXMuaW5zdGFuY2UuZGVzdHJveSgpO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19