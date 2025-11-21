/**
 * Angular wrapper for Bryntum Splitter
 */
import * as tslib_1 from "tslib";
import { Component, ElementRef, EventEmitter, Output, Input } from '@angular/core';
import WrapperHelper from './wrapper.helper';
// Bryntum 'scheduler.lite.umd' bundle comes without polyfills to support Angular's zone.js
import { Base, Widget } from '@bryntum/scheduler/scheduler.lite.umd.js';
import { Splitter, WidgetHelper } from '@bryntum/scheduler/scheduler.lite.umd.js';
var BryntumSplitterComponent = /** @class */ (function () {
    function BryntumSplitterComponent(element) {
        this.bryntumConfig = {
            angularComponent: this,
            adopt: undefined,
            listeners: {},
            features: {}
        };
        // Events
        this.onBeforeDestroy = new EventEmitter();
        this.onBeforeHide = new EventEmitter();
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
    BryntumSplitterComponent.prototype.ngOnInit = function () {
        var _this = this;
        var me = this, elementRef = me.elementRef, bryntumConfig = me.bryntumConfig, instanceClass = BryntumSplitterComponent.instanceClass, bryntumConfigs = BryntumSplitterComponent.bryntumConfigs;
        Object.assign(bryntumConfig, {
            listeners: {
                beforeDestroy: function (event) { me.onBeforeDestroy.emit(event); },
                beforeHide: function (event) { me.onBeforeHide.emit(event); },
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
    BryntumSplitterComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        var instance = this.instance, instanceClass = BryntumSplitterComponent.instanceClass;
        if (!instance) {
            return;
        }
        // Iterate over all changes
        Object.entries(changes).forEach(function (_a) {
            var _b = tslib_1.__read(_a, 2), prop = _b[0], change = _b[1];
            var newValue = change.currentValue, instance = _this.instance, bryntumConfigsOnly = BryntumSplitterComponent.bryntumConfigsOnly, bryntumProps = BryntumSplitterComponent.bryntumProps;
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
    BryntumSplitterComponent.prototype.ngOnDestroy = function () {
        if (this.instance) {
            this.instance.destroy();
        }
    };
    BryntumSplitterComponent.instanceClass = Splitter;
    BryntumSplitterComponent.bryntumFeatureNames = [];
    BryntumSplitterComponent.bryntumConfigs = BryntumSplitterComponent.bryntumFeatureNames.concat([
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
        'disabled',
        'dock',
        'draggable',
        'extraData',
        'flex',
        'floating',
        'height',
        'hidden',
        'hideAnimation',
        'html',
        'htmlCls',
        'id',
        'insertBefore',
        'insertFirst',
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
        'orientation',
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
        'title',
        'tooltip',
        'weight',
        'width',
        'x',
        'y'
    ]);
    BryntumSplitterComponent.bryntumConfigsOnly = [
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
        'dock',
        'draggable',
        'floating',
        'hideAnimation',
        'htmlCls',
        'insertBefore',
        'insertFirst',
        'listeners',
        'localeClass',
        'localizableProperties',
        'maskDefaults',
        'masked',
        'monitorResize',
        'orientation',
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
        'title',
        'weight'
    ];
    BryntumSplitterComponent.bryntumProps = BryntumSplitterComponent.bryntumFeatureNames.concat([
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
        'margin',
        'maxHeight',
        'maxWidth',
        'minHeight',
        'minWidth',
        'readOnly',
        'scrollable',
        'tooltip',
        'width',
        'x',
        'y'
    ]);
    BryntumSplitterComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bryntum-splitter',
                    template: ''
                }] }
    ];
    /** @nocollapse */
    BryntumSplitterComponent.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    BryntumSplitterComponent.propDecorators = {
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
        dock: [{ type: Input }],
        draggable: [{ type: Input }],
        floating: [{ type: Input }],
        hideAnimation: [{ type: Input }],
        htmlCls: [{ type: Input }],
        insertBefore: [{ type: Input }],
        insertFirst: [{ type: Input }],
        listeners: [{ type: Input }],
        localeClass: [{ type: Input }],
        localizableProperties: [{ type: Input }],
        maskDefaults: [{ type: Input }],
        masked: [{ type: Input }],
        monitorResize: [{ type: Input }],
        orientation: [{ type: Input }],
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
        onBeforeDestroy: [{ type: Output }],
        onBeforeHide: [{ type: Output }],
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
    return BryntumSplitterComponent;
}());
export { BryntumSplitterComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJ5bnR1bS1zcGxpdHRlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYnJ5bnR1bS9zY2hlZHVsZXItYW5ndWxhci8iLCJzb3VyY2VzIjpbImxpYi9icnludHVtLXNwbGl0dGVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7R0FFRzs7QUFFSCxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQXFCLE1BQU0sRUFBRSxLQUFLLEVBQStCLE1BQU0sZUFBZSxDQUFDO0FBQ25JLE9BQU8sYUFBYSxNQUFNLGtCQUFrQixDQUFDO0FBRTdDLDJGQUEyRjtBQUMzRixPQUFPLEVBQUUsSUFBSSxFQUF5RCxNQUFNLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQUMvSCxPQUFPLEVBQUUsUUFBUSxFQUFnQixZQUFZLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQUVoRztJQW9KSSxrQ0FBWSxPQUFtQjtRQVB2QixrQkFBYSxHQUFHO1lBQ3BCLGdCQUFnQixFQUFHLElBQUk7WUFDdkIsS0FBSyxFQUFjLFNBQVM7WUFDNUIsU0FBUyxFQUFVLEVBQUU7WUFDckIsUUFBUSxFQUFXLEVBQUU7U0FDeEIsQ0FBQztRQXVFRCxTQUFTO1FBQ0Esb0JBQWUsR0FBRyxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQzdDLGlCQUFZLEdBQU0sSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUM3QyxpQkFBWSxHQUFNLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsZUFBVSxHQUFRLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsY0FBUyxHQUFTLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsY0FBUyxHQUFTLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsZUFBVSxHQUFRLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsV0FBTSxHQUFZLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsWUFBTyxHQUFXLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0Ms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SzswQkFDTCxLQUFLOytCQUNMLEtBQUs7OEJBQ0wsS0FBSzs0QkFDTCxLQUFLOzhCQUNMLEtBQUs7d0NBQ0wsS0FBSzsrQkFDTCxLQUFLO3lCQUNMLEtBQUs7Z0NBQ0wsS0FBSzs4QkFDTCxLQUFLO3dCQUNMLEtBQUs7NkJBQ0wsS0FBSzt3Q0FDTCxLQUFLO3lCQUNMLEtBQUs7OEJBQ0wsS0FBSzsrQkFDTCxLQUFLO2dDQUNMLEtBQUs7c0JBQ0wsS0FBSztzQkFDTCxLQUFLOzRCQUNMLEtBQUs7d0JBQ0wsS0FBSzt5QkFDTCxLQUFLOzRCQUdMLEtBQUs7MEJBQ0wsS0FBSzswQkFDTCxLQUFLOzJCQUNMLEtBQUs7NEJBQ0wsS0FBSzt1QkFDTCxLQUFLO3lCQUNMLEtBQUs7eUJBQ0wsS0FBSzt1QkFDTCxLQUFLO3FCQUNMLEtBQUs7eUJBQ0wsS0FBSzs0QkFDTCxLQUFLOzJCQUNMLEtBQUs7NEJBQ0wsS0FBSzsyQkFDTCxLQUFLOzJCQUNMLEtBQUs7NkJBQ0wsS0FBSzswQkFDTCxLQUFLO3dCQUNMLEtBQUs7b0JBQ0wsS0FBSztvQkFDTCxLQUFLOzZCQUdMLEtBQUs7a0NBR0wsTUFBTTsrQkFDTixNQUFNOytCQUNOLE1BQU07NkJBQ04sTUFBTTs0QkFDTixNQUFNOzRCQUNOLE1BQU07NkJBQ04sTUFBTTt5QkFDTixNQUFNOzBCQUNOLE1BQU07NkJBQ04sTUFBTTsyQkFDTixNQUFNO3lCQUNOLE1BQU07O0lBbUdYLCtCQUFDO0NBQUEsQUF4VUQsSUF3VUM7U0FwVVksd0JBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBBbmd1bGFyIHdyYXBwZXIgZm9yIEJyeW50dW0gU3BsaXR0ZXJcbiAqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgT25EZXN0cm95LCBPbkluaXQsIE91dHB1dCwgSW5wdXQsIFNpbXBsZUNoYW5nZSwgU2ltcGxlQ2hhbmdlcyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IFdyYXBwZXJIZWxwZXIgZnJvbSAnLi93cmFwcGVyLmhlbHBlcic7XG5cbi8vIEJyeW50dW0gJ3NjaGVkdWxlci5saXRlLnVtZCcgYnVuZGxlIGNvbWVzIHdpdGhvdXQgcG9seWZpbGxzIHRvIHN1cHBvcnQgQW5ndWxhcidzIHpvbmUuanNcbmltcG9ydCB7IEJhc2UsIE1hc2ssIE1hc2tDb25maWcsIFJlY3RhbmdsZSwgU2Nyb2xsZXIsIFNjcm9sbGVyQ29uZmlnLCBXaWRnZXQgfSBmcm9tICdAYnJ5bnR1bS9zY2hlZHVsZXIvc2NoZWR1bGVyLmxpdGUudW1kLmpzJztcbmltcG9ydCB7IFNwbGl0dGVyLCBTdHJpbmdIZWxwZXIsIFdpZGdldEhlbHBlciB9IGZyb20gJ0BicnludHVtL3NjaGVkdWxlci9zY2hlZHVsZXIubGl0ZS51bWQuanMnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvciA6ICdicnludHVtLXNwbGl0dGVyJyxcbiAgICB0ZW1wbGF0ZSA6ICcnXG59KVxuZXhwb3J0IGNsYXNzIEJyeW50dW1TcGxpdHRlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcblxuICAgIHB1YmxpYyBzdGF0aWMgaW5zdGFuY2VDbGFzcyA9IFNwbGl0dGVyO1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bUZlYXR1cmVOYW1lczogc3RyaW5nW10gPSBbXG5cbiAgICBdO1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bUNvbmZpZ3M6IHN0cmluZ1tdID0gQnJ5bnR1bVNwbGl0dGVyQ29tcG9uZW50LmJyeW50dW1GZWF0dXJlTmFtZXMuY29uY2F0KFtcbiAgICAgICAgJ2Fkb3B0JyxcbiAgICAgICAgJ2FsaWduJyxcbiAgICAgICAgJ2FsaWduU2VsZicsXG4gICAgICAgICdhbmNob3InLFxuICAgICAgICAnYXBwZW5kVG8nLFxuICAgICAgICAnYnViYmxlRXZlbnRzJyxcbiAgICAgICAgJ2NlbnRlcmVkJyxcbiAgICAgICAgJ2NscycsXG4gICAgICAgICdjb25maWcnLFxuICAgICAgICAnY29uc3RyYWluVG8nLFxuICAgICAgICAnY29udGVudCcsXG4gICAgICAgICdjb250ZW50RWxlbWVudENscycsXG4gICAgICAgICdkYXRhc2V0JyxcbiAgICAgICAgJ2RlZmF1bHRCaW5kUHJvcGVydHknLFxuICAgICAgICAnZGlzYWJsZWQnLFxuICAgICAgICAnZG9jaycsXG4gICAgICAgICdkcmFnZ2FibGUnLFxuICAgICAgICAnZXh0cmFEYXRhJyxcbiAgICAgICAgJ2ZsZXgnLFxuICAgICAgICAnZmxvYXRpbmcnLFxuICAgICAgICAnaGVpZ2h0JyxcbiAgICAgICAgJ2hpZGRlbicsXG4gICAgICAgICdoaWRlQW5pbWF0aW9uJyxcbiAgICAgICAgJ2h0bWwnLFxuICAgICAgICAnaHRtbENscycsXG4gICAgICAgICdpZCcsXG4gICAgICAgICdpbnNlcnRCZWZvcmUnLFxuICAgICAgICAnaW5zZXJ0Rmlyc3QnLFxuICAgICAgICAnbGlzdGVuZXJzJyxcbiAgICAgICAgJ2xvY2FsZUNsYXNzJyxcbiAgICAgICAgJ2xvY2FsaXphYmxlUHJvcGVydGllcycsXG4gICAgICAgICdtYXJnaW4nLFxuICAgICAgICAnbWFza0RlZmF1bHRzJyxcbiAgICAgICAgJ21hc2tlZCcsXG4gICAgICAgICdtYXhIZWlnaHQnLFxuICAgICAgICAnbWF4V2lkdGgnLFxuICAgICAgICAnbWluSGVpZ2h0JyxcbiAgICAgICAgJ21pbldpZHRoJyxcbiAgICAgICAgJ21vbml0b3JSZXNpemUnLFxuICAgICAgICAnb3JpZW50YXRpb24nLFxuICAgICAgICAnb3duZXInLFxuICAgICAgICAncG9zaXRpb25lZCcsXG4gICAgICAgICdwcmV2ZW50VG9vbHRpcE9uVG91Y2gnLFxuICAgICAgICAncmVhZE9ubHknLFxuICAgICAgICAncmlwcGxlJyxcbiAgICAgICAgJ3Jvb3RFbGVtZW50JyxcbiAgICAgICAgJ3Njcm9sbGFibGUnLFxuICAgICAgICAnc2Nyb2xsQWN0aW9uJyxcbiAgICAgICAgJ3Nob3dBbmltYXRpb24nLFxuICAgICAgICAndGFiJyxcbiAgICAgICAgJ3RhZycsXG4gICAgICAgICd0ZXh0QWxpZ24nLFxuICAgICAgICAndGl0bGUnLFxuICAgICAgICAndG9vbHRpcCcsXG4gICAgICAgICd3ZWlnaHQnLFxuICAgICAgICAnd2lkdGgnLFxuICAgICAgICAneCcsXG4gICAgICAgICd5J1xuICAgIF0pO1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bUNvbmZpZ3NPbmx5OiBzdHJpbmdbXSA9IFtcbiAgICAgICAgJ2Fkb3B0JyxcbiAgICAgICAgJ2FsaWduJyxcbiAgICAgICAgJ2FuY2hvcicsXG4gICAgICAgICdhcHBlbmRUbycsXG4gICAgICAgICdidWJibGVFdmVudHMnLFxuICAgICAgICAnY2VudGVyZWQnLFxuICAgICAgICAnY2xzJyxcbiAgICAgICAgJ2NvbmZpZycsXG4gICAgICAgICdjb25zdHJhaW5UbycsXG4gICAgICAgICdjb250ZW50RWxlbWVudENscycsXG4gICAgICAgICdkZWZhdWx0QmluZFByb3BlcnR5JyxcbiAgICAgICAgJ2RvY2snLFxuICAgICAgICAnZHJhZ2dhYmxlJyxcbiAgICAgICAgJ2Zsb2F0aW5nJyxcbiAgICAgICAgJ2hpZGVBbmltYXRpb24nLFxuICAgICAgICAnaHRtbENscycsXG4gICAgICAgICdpbnNlcnRCZWZvcmUnLFxuICAgICAgICAnaW5zZXJ0Rmlyc3QnLFxuICAgICAgICAnbGlzdGVuZXJzJyxcbiAgICAgICAgJ2xvY2FsZUNsYXNzJyxcbiAgICAgICAgJ2xvY2FsaXphYmxlUHJvcGVydGllcycsXG4gICAgICAgICdtYXNrRGVmYXVsdHMnLFxuICAgICAgICAnbWFza2VkJyxcbiAgICAgICAgJ21vbml0b3JSZXNpemUnLFxuICAgICAgICAnb3JpZW50YXRpb24nLFxuICAgICAgICAnb3duZXInLFxuICAgICAgICAncG9zaXRpb25lZCcsXG4gICAgICAgICdwcmV2ZW50VG9vbHRpcE9uVG91Y2gnLFxuICAgICAgICAncmlwcGxlJyxcbiAgICAgICAgJ3Jvb3RFbGVtZW50JyxcbiAgICAgICAgJ3Njcm9sbEFjdGlvbicsXG4gICAgICAgICdzaG93QW5pbWF0aW9uJyxcbiAgICAgICAgJ3RhYicsXG4gICAgICAgICd0YWcnLFxuICAgICAgICAndGV4dEFsaWduJyxcbiAgICAgICAgJ3RpdGxlJyxcbiAgICAgICAgJ3dlaWdodCdcbiAgICBdO1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bVByb3BzOiBzdHJpbmdbXSA9IEJyeW50dW1TcGxpdHRlckNvbXBvbmVudC5icnludHVtRmVhdHVyZU5hbWVzLmNvbmNhdChbXG4gICAgICAgICdhbGlnblNlbGYnLFxuICAgICAgICAnYW5jaG9yU2l6ZScsXG4gICAgICAgICdjb250ZW50JyxcbiAgICAgICAgJ2RhdGFzZXQnLFxuICAgICAgICAnZGlzYWJsZWQnLFxuICAgICAgICAnZXh0cmFEYXRhJyxcbiAgICAgICAgJ2ZsZXgnLFxuICAgICAgICAnaGVpZ2h0JyxcbiAgICAgICAgJ2hpZGRlbicsXG4gICAgICAgICdodG1sJyxcbiAgICAgICAgJ2lkJyxcbiAgICAgICAgJ21hcmdpbicsXG4gICAgICAgICdtYXhIZWlnaHQnLFxuICAgICAgICAnbWF4V2lkdGgnLFxuICAgICAgICAnbWluSGVpZ2h0JyxcbiAgICAgICAgJ21pbldpZHRoJyxcbiAgICAgICAgJ3JlYWRPbmx5JyxcbiAgICAgICAgJ3Njcm9sbGFibGUnLFxuICAgICAgICAndG9vbHRpcCcsXG4gICAgICAgICd3aWR0aCcsXG4gICAgICAgICd4JyxcbiAgICAgICAgJ3knXG4gICAgXSk7XG5cbiAgICBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY7XG4gICAgcHVibGljIGluc3RhbmNlOiBTcGxpdHRlcjtcblxuICAgIHByaXZhdGUgYnJ5bnR1bUNvbmZpZyA9IHtcbiAgICAgICAgYW5ndWxhckNvbXBvbmVudCA6IHRoaXMsXG4gICAgICAgIGFkb3B0ICAgICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgIGxpc3RlbmVycyAgICAgICAgOiB7fSxcbiAgICAgICAgZmVhdHVyZXMgICAgICAgICA6IHt9XG4gICAgfTtcblxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQ6IEVsZW1lbnRSZWYpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50UmVmID0gZWxlbWVudDtcbiAgICB9XG5cbiAgICAgLy8gQ29uZmlncyBvbmx5XG4gICAgQElucHV0KCkgYWRvcHQgICAgICAgICAgICAgICAgIDogSFRNTEVsZW1lbnR8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGFsaWduICAgICAgICAgICAgICAgICA6IG9iamVjdHxzdHJpbmc7XG4gICAgQElucHV0KCkgYW5jaG9yICAgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBhcHBlbmRUbyAgICAgICAgICAgICAgOiBIVE1MRWxlbWVudHxzdHJpbmc7XG4gICAgQElucHV0KCkgYnViYmxlRXZlbnRzICAgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIGNlbnRlcmVkICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgY2xzICAgICAgICAgICAgICAgICAgIDogc3RyaW5nfG9iamVjdDtcbiAgICBASW5wdXQoKSBjb25maWcgICAgICAgICAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgY29uc3RyYWluVG8gICAgICAgICAgIDogSFRNTEVsZW1lbnR8V2lkZ2V0fFJlY3RhbmdsZTtcbiAgICBASW5wdXQoKSBjb250ZW50RWxlbWVudENscyAgICAgOiBzdHJpbmd8b2JqZWN0O1xuICAgIEBJbnB1dCgpIGRlZmF1bHRCaW5kUHJvcGVydHkgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBkb2NrICAgICAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgZHJhZ2dhYmxlICAgICAgICAgICAgIDogYm9vbGVhbnxvYmplY3Q7XG4gICAgQElucHV0KCkgZmxvYXRpbmcgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBoaWRlQW5pbWF0aW9uICAgICAgICAgOiBib29sZWFufG9iamVjdDtcbiAgICBASW5wdXQoKSBodG1sQ2xzICAgICAgICAgICAgICAgOiBzdHJpbmd8b2JqZWN0O1xuICAgIEBJbnB1dCgpIGluc2VydEJlZm9yZSAgICAgICAgICA6IEhUTUxFbGVtZW50fHN0cmluZztcbiAgICBASW5wdXQoKSBpbnNlcnRGaXJzdCAgICAgICAgICAgOiBIVE1MRWxlbWVudHxzdHJpbmc7XG4gICAgQElucHV0KCkgbGlzdGVuZXJzICAgICAgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIGxvY2FsZUNsYXNzICAgICAgICAgICA6IEJhc2U7XG4gICAgQElucHV0KCkgbG9jYWxpemFibGVQcm9wZXJ0aWVzIDogc3RyaW5nW107XG4gICAgQElucHV0KCkgbWFza0RlZmF1bHRzICAgICAgICAgIDogb2JqZWN0fE1hc2t8UGFydGlhbDxNYXNrQ29uZmlnPjtcbiAgICBASW5wdXQoKSBtYXNrZWQgICAgICAgICAgICAgICAgOiBib29sZWFufHN0cmluZ3xvYmplY3R8TWFza3xQYXJ0aWFsPE1hc2tDb25maWc+O1xuICAgIEBJbnB1dCgpIG1vbml0b3JSZXNpemUgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgb3JpZW50YXRpb24gICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIG93bmVyICAgICAgICAgICAgICAgICA6IFdpZGdldDtcbiAgICBASW5wdXQoKSBwb3NpdGlvbmVkICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHByZXZlbnRUb29sdGlwT25Ub3VjaCA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgcmlwcGxlICAgICAgICAgICAgICAgIDogYm9vbGVhbnxvYmplY3Q7XG4gICAgQElucHV0KCkgcm9vdEVsZW1lbnQgICAgICAgICAgIDogU2hhZG93Um9vdDtcbiAgICBASW5wdXQoKSBzY3JvbGxBY3Rpb24gICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgc2hvd0FuaW1hdGlvbiAgICAgICAgIDogYm9vbGVhbnxvYmplY3Q7XG4gICAgQElucHV0KCkgdGFiICAgICAgICAgICAgICAgICAgIDogYm9vbGVhbnxvYmplY3Q7XG4gICAgQElucHV0KCkgdGFnICAgICAgICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIHRleHRBbGlnbiAgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSB0aXRsZSAgICAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgd2VpZ2h0ICAgICAgICAgICAgICAgIDogbnVtYmVyO1xuXG4gICAgIC8vIENvbmZpZ3MgYW5kIHByb3BlcnRpZXNcbiAgICBASW5wdXQoKSBhbGlnblNlbGYgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGNvbnRlbnQgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgZGF0YXNldCAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBkaXNhYmxlZCAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBleHRyYURhdGEgIDogYm9vbGVhbnxudW1iZXJ8b2JqZWN0fHN0cmluZztcbiAgICBASW5wdXQoKSBmbGV4ICAgICAgIDogbnVtYmVyfHN0cmluZztcbiAgICBASW5wdXQoKSBoZWlnaHQgICAgIDogbnVtYmVyfHN0cmluZztcbiAgICBASW5wdXQoKSBoaWRkZW4gICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBodG1sICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGlkICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgbWFyZ2luICAgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgbWF4SGVpZ2h0ICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgbWF4V2lkdGggICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgbWluSGVpZ2h0ICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgbWluV2lkdGggICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgcmVhZE9ubHkgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgc2Nyb2xsYWJsZSA6IGJvb2xlYW58U2Nyb2xsZXJ8b2JqZWN0fFBhcnRpYWw8U2Nyb2xsZXJDb25maWc+O1xuICAgIEBJbnB1dCgpIHRvb2x0aXAgICAgOiBvYmplY3R8c3RyaW5nO1xuICAgIEBJbnB1dCgpIHdpZHRoICAgICAgOiBudW1iZXJ8c3RyaW5nO1xuICAgIEBJbnB1dCgpIHggICAgICAgICAgOiBudW1iZXI7XG4gICAgQElucHV0KCkgeSAgICAgICAgICA6IG51bWJlcjtcblxuICAgICAvLyBQcm9wZXJ0aWVzIG9ubHlcbiAgICBASW5wdXQoKSBhbmNob3JTaXplIDogbnVtYmVyW107XG5cbiAgICAgLy8gRXZlbnRzXG4gICAgQE91dHB1dCgpIG9uQmVmb3JlRGVzdHJveSA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkJlZm9yZUhpZGUgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25CZWZvcmVTaG93ICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uQ2F0Y2hBbGwgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkRlc3Ryb3kgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25Gb2N1c0luICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uRm9jdXNPdXQgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkhpZGUgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25QYWludCAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uUmVhZE9ubHkgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvblJlc2l6ZSAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25TaG93ICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYW5kIGFwcGVuZCB0aGUgdW5kZXJseWluZyB3aWRnZXRcbiAgICAgKi9cbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICAgY29uc3RcbiAgICAgICAgICAgIG1lID0gdGhpcyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50UmVmLFxuICAgICAgICAgICAgICAgIGJyeW50dW1Db25maWdcbiAgICAgICAgICAgIH0gPSBtZSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpbnN0YW5jZUNsYXNzLFxuICAgICAgICAgICAgICAgIGJyeW50dW1Db25maWdzXG4gICAgICAgICAgICB9ID0gQnJ5bnR1bVNwbGl0dGVyQ29tcG9uZW50O1xuXG4gICAgICAgIE9iamVjdC5hc3NpZ24oYnJ5bnR1bUNvbmZpZywge1xuICAgICAgICAgICAgbGlzdGVuZXJzIDoge1xuICAgICAgICAgICAgICAgIGJlZm9yZURlc3Ryb3koZXZlbnQgOiBhbnkpIHsgbWUub25CZWZvcmVEZXN0cm95LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGJlZm9yZUhpZGUoZXZlbnQgOiBhbnkpIHsgbWUub25CZWZvcmVIaWRlLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGJlZm9yZVNob3coZXZlbnQgOiBhbnkpIHsgbWUub25CZWZvcmVTaG93LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGNhdGNoQWxsKGV2ZW50IDogYW55KSB7IG1lLm9uQ2F0Y2hBbGwuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgZGVzdHJveShldmVudCA6IGFueSkgeyBtZS5vbkRlc3Ryb3kuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgZm9jdXNJbihldmVudCA6IGFueSkgeyBtZS5vbkZvY3VzSW4uZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgZm9jdXNPdXQoZXZlbnQgOiBhbnkpIHsgbWUub25Gb2N1c091dC5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBoaWRlKGV2ZW50IDogYW55KSB7IG1lLm9uSGlkZS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBwYWludChldmVudCA6IGFueSkgeyBtZS5vblBhaW50LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIHJlYWRPbmx5KGV2ZW50IDogYW55KSB7IG1lLm9uUmVhZE9ubHkuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgcmVzaXplKGV2ZW50IDogYW55KSB7IG1lLm9uUmVzaXplLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIHNob3coZXZlbnQgOiBhbnkpIHsgbWUub25TaG93LmVtaXQoZXZlbnQpOyB9LFxuXG4gICAgICAgICAgICAgICAgdGhpc09iaiA6IG1lXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIElmIGNvbXBvbmVudCBoYXMgbm8gY29udGFpbmVyIHNwZWNpZmllZCBpbiBjb25maWcgdGhlbiB1c2UgYWRvcHQgdG8gV3JhcHBlcidzIGVsZW1lbnRcbiAgICAgICAgY29uc3RcbiAgICAgICAgICAgIGNvbnRhaW5lclBhcmFtID0gW1xuICAgICAgICAgICAgICAgICdhZG9wdCcsXG4gICAgICAgICAgICAgICAgJ2FwcGVuZFRvJyxcbiAgICAgICAgICAgICAgICAnaW5zZXJ0QWZ0ZXInLFxuICAgICAgICAgICAgICAgICdpbnNlcnRCZWZvcmUnXG4gICAgICAgICAgICBdLmZpbmQocHJvcCA9PiBicnludHVtQ29uZmlnW3Byb3BdKTtcbiAgICAgICAgaWYgKCFjb250YWluZXJQYXJhbSkge1xuICAgICAgICAgICAgYnJ5bnR1bUNvbmZpZy5hZG9wdCA9IGVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIFdyYXBwZXJIZWxwZXIuZGV2V2FybmluZ0NvbnRhaW5lcihpbnN0YW5jZUNsYXNzLiRuYW1lLCBjb250YWluZXJQYXJhbSk7XG4gICAgICAgIH1cblxuICAgICAgICBicnludHVtQ29uZmlncy5maWx0ZXIocHJvcCA9PiBwcm9wIGluIHRoaXMpLmZvckVhY2gocHJvcCA9PiB7XG4gICAgICAgICAgICBXcmFwcGVySGVscGVyLmFwcGx5UHJvcFZhbHVlKGJyeW50dW1Db25maWcsIHByb3AsIHRoaXNbcHJvcF0pO1xuICAgICAgICAgICAgaWYgKFsnZmVhdHVyZXMnLCAnY29uZmlnJ10uaW5jbHVkZXMocHJvcCkpIHtcbiAgICAgICAgICAgICAgICBXcmFwcGVySGVscGVyLmRldldhcm5pbmdDb25maWdQcm9wKGluc3RhbmNlQ2xhc3MuJG5hbWUsIHByb3ApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIG1lLmluc3RhbmNlID0gaW5zdGFuY2VDbGFzcy4kbmFtZSA9PT0gJ1dpZGdldCcgPyBXaWRnZXRIZWxwZXIuY3JlYXRlV2lkZ2V0KGJyeW50dW1Db25maWcpIDogbmV3IGluc3RhbmNlQ2xhc3MoYnJ5bnR1bUNvbmZpZyk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBXYXRjaCBmb3IgY2hhbmdlc1xuICAgICAqIEBwYXJhbSBjaGFuZ2VzXG4gICAgICovXG4gICAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgICAgICBjb25zdFxuICAgICAgICAgICAgeyBpbnN0YW5jZSB9ID0gdGhpcyxcbiAgICAgICAgICAgIHsgaW5zdGFuY2VDbGFzcyB9ID0gQnJ5bnR1bVNwbGl0dGVyQ29tcG9uZW50O1xuXG4gICAgICAgIGlmICghaW5zdGFuY2UpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEl0ZXJhdGUgb3ZlciBhbGwgY2hhbmdlc1xuICAgICAgICBPYmplY3QuZW50cmllcyhjaGFuZ2VzKS5mb3JFYWNoKChbcHJvcCwgY2hhbmdlXSkgPT4ge1xuICAgICAgICAgICAgY29uc3RcbiAgICAgICAgICAgICAgICBuZXdWYWx1ZSA9IChjaGFuZ2UgYXMgU2ltcGxlQ2hhbmdlKS5jdXJyZW50VmFsdWUsXG4gICAgICAgICAgICAgICAgeyBpbnN0YW5jZSB9ID0gdGhpcyxcbiAgICAgICAgICAgICAgICB7IGJyeW50dW1Db25maWdzT25seSwgYnJ5bnR1bVByb3BzIH0gPSBCcnludHVtU3BsaXR0ZXJDb21wb25lbnQ7XG4gICAgICAgICAgICBpZiAoYnJ5bnR1bVByb3BzLmluY2x1ZGVzKHByb3ApKSB7XG4gICAgICAgICAgICAgICAgV3JhcHBlckhlbHBlci5hcHBseVByb3BWYWx1ZShpbnN0YW5jZSwgcHJvcCwgbmV3VmFsdWUsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICBpZiAoYnJ5bnR1bUNvbmZpZ3NPbmx5LmluY2x1ZGVzKHByb3ApKSB7XG4gICAgICAgICAgICAgICAgICAgIFdyYXBwZXJIZWxwZXIuZGV2V2FybmluZ1VwZGF0ZVByb3AoaW5zdGFuY2VDbGFzcy4kbmFtZSwgcHJvcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZXN0cm95IHRoZSBjb21wb25lbnRcbiAgICAgKi9cbiAgICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaW5zdGFuY2UpIHtcbiAgICAgICAgICAgIHRoaXMuaW5zdGFuY2UuZGVzdHJveSgpO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19