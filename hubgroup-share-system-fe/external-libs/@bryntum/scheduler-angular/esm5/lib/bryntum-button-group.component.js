/**
 * Angular wrapper for Bryntum ButtonGroup
 */
import * as tslib_1 from "tslib";
import { Component, ElementRef, EventEmitter, Output, Input } from '@angular/core';
import WrapperHelper from './wrapper.helper';
// Bryntum 'scheduler.lite.umd' bundle comes without polyfills to support Angular's zone.js
import { Base, Model, Widget } from '@bryntum/scheduler/scheduler.lite.umd.js';
import { ButtonGroup, WidgetHelper } from '@bryntum/scheduler/scheduler.lite.umd.js';
var BryntumButtonGroupComponent = /** @class */ (function () {
    function BryntumButtonGroupComponent(element) {
        this.bryntumConfig = {
            angularComponent: this,
            adopt: undefined,
            listeners: {},
            features: {}
        };
        // Events
        this.onAction = new EventEmitter();
        this.onBeforeDestroy = new EventEmitter();
        this.onBeforeHide = new EventEmitter();
        this.onBeforeSetRecord = new EventEmitter();
        this.onBeforeShow = new EventEmitter();
        this.onCatchAll = new EventEmitter();
        this.onClick = new EventEmitter();
        this.onDestroy = new EventEmitter();
        this.onFocusIn = new EventEmitter();
        this.onFocusOut = new EventEmitter();
        this.onHide = new EventEmitter();
        this.onPaint = new EventEmitter();
        this.onReadOnly = new EventEmitter();
        this.onResize = new EventEmitter();
        this.onShow = new EventEmitter();
        this.onToggle = new EventEmitter();
        this.elementRef = element;
    }
    /**
     * Create and append the underlying widget
     */
    BryntumButtonGroupComponent.prototype.ngOnInit = function () {
        var _this = this;
        var me = this, elementRef = me.elementRef, bryntumConfig = me.bryntumConfig, instanceClass = BryntumButtonGroupComponent.instanceClass, bryntumConfigs = BryntumButtonGroupComponent.bryntumConfigs;
        Object.assign(bryntumConfig, {
            listeners: {
                action: function (event) { me.onAction.emit(event); },
                beforeDestroy: function (event) { me.onBeforeDestroy.emit(event); },
                beforeHide: function (event) { me.onBeforeHide.emit(event); },
                beforeSetRecord: function (event) { me.onBeforeSetRecord.emit(event); },
                beforeShow: function (event) { me.onBeforeShow.emit(event); },
                catchAll: function (event) { me.onCatchAll.emit(event); },
                click: function (event) { me.onClick.emit(event); },
                destroy: function (event) { me.onDestroy.emit(event); },
                focusIn: function (event) { me.onFocusIn.emit(event); },
                focusOut: function (event) { me.onFocusOut.emit(event); },
                hide: function (event) { me.onHide.emit(event); },
                paint: function (event) { me.onPaint.emit(event); },
                readOnly: function (event) { me.onReadOnly.emit(event); },
                resize: function (event) { me.onResize.emit(event); },
                show: function (event) { me.onShow.emit(event); },
                toggle: function (event) { me.onToggle.emit(event); },
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
    BryntumButtonGroupComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        var instance = this.instance, instanceClass = BryntumButtonGroupComponent.instanceClass;
        if (!instance) {
            return;
        }
        // Iterate over all changes
        Object.entries(changes).forEach(function (_a) {
            var _b = tslib_1.__read(_a, 2), prop = _b[0], change = _b[1];
            var newValue = change.currentValue, instance = _this.instance, bryntumConfigsOnly = BryntumButtonGroupComponent.bryntumConfigsOnly, bryntumProps = BryntumButtonGroupComponent.bryntumProps;
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
    BryntumButtonGroupComponent.prototype.ngOnDestroy = function () {
        if (this.instance) {
            this.instance.destroy();
        }
    };
    BryntumButtonGroupComponent.instanceClass = ButtonGroup;
    BryntumButtonGroupComponent.bryntumFeatureNames = [];
    BryntumButtonGroupComponent.bryntumConfigs = BryntumButtonGroupComponent.bryntumFeatureNames.concat([
        'adopt',
        'align',
        'alignSelf',
        'anchor',
        'appendTo',
        'bubbleEvents',
        'centered',
        'cls',
        'color',
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
        'toggleGroup',
        'tooltip',
        'weight',
        'width',
        'x',
        'y'
    ]);
    BryntumButtonGroupComponent.bryntumConfigsOnly = [
        'adopt',
        'align',
        'anchor',
        'appendTo',
        'bubbleEvents',
        'centered',
        'cls',
        'color',
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
        'toggleGroup',
        'weight'
    ];
    BryntumButtonGroupComponent.bryntumProps = BryntumButtonGroupComponent.bryntumFeatureNames.concat([
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
    BryntumButtonGroupComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bryntum-button-group',
                    template: ''
                }] }
    ];
    /** @nocollapse */
    BryntumButtonGroupComponent.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    BryntumButtonGroupComponent.propDecorators = {
        adopt: [{ type: Input }],
        align: [{ type: Input }],
        anchor: [{ type: Input }],
        appendTo: [{ type: Input }],
        bubbleEvents: [{ type: Input }],
        centered: [{ type: Input }],
        cls: [{ type: Input }],
        color: [{ type: Input }],
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
        toggleGroup: [{ type: Input }],
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
        onAction: [{ type: Output }],
        onBeforeDestroy: [{ type: Output }],
        onBeforeHide: [{ type: Output }],
        onBeforeSetRecord: [{ type: Output }],
        onBeforeShow: [{ type: Output }],
        onCatchAll: [{ type: Output }],
        onClick: [{ type: Output }],
        onDestroy: [{ type: Output }],
        onFocusIn: [{ type: Output }],
        onFocusOut: [{ type: Output }],
        onHide: [{ type: Output }],
        onPaint: [{ type: Output }],
        onReadOnly: [{ type: Output }],
        onResize: [{ type: Output }],
        onShow: [{ type: Output }],
        onToggle: [{ type: Output }]
    };
    return BryntumButtonGroupComponent;
}());
export { BryntumButtonGroupComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJ5bnR1bS1idXR0b24tZ3JvdXAuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGJyeW50dW0vc2NoZWR1bGVyLWFuZ3VsYXIvIiwic291cmNlcyI6WyJsaWIvYnJ5bnR1bS1idXR0b24tZ3JvdXAuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztHQUVHOztBQUVILE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBcUIsTUFBTSxFQUFFLEtBQUssRUFBK0IsTUFBTSxlQUFlLENBQUM7QUFDbkksT0FBTyxhQUFhLE1BQU0sa0JBQWtCLENBQUM7QUFFN0MsMkZBQTJGO0FBQzNGLE9BQU8sRUFBRSxJQUFJLEVBQWtELEtBQUssRUFBdUMsTUFBTSxFQUFnQixNQUFNLDBDQUEwQyxDQUFDO0FBQ2xMLE9BQU8sRUFBRSxXQUFXLEVBQWdCLFlBQVksRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBRW5HO0lBNEtJLHFDQUFZLE9BQW1CO1FBUHZCLGtCQUFhLEdBQUc7WUFDcEIsZ0JBQWdCLEVBQUcsSUFBSTtZQUN2QixLQUFLLEVBQWMsU0FBUztZQUM1QixTQUFTLEVBQVUsRUFBRTtZQUNyQixRQUFRLEVBQVcsRUFBRTtTQUN4QixDQUFDO1FBcUZELFNBQVM7UUFDQSxhQUFRLEdBQVksSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUMvQyxvQkFBZSxHQUFLLElBQUksWUFBWSxFQUFVLENBQUM7UUFDL0MsaUJBQVksR0FBUSxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQy9DLHNCQUFpQixHQUFHLElBQUksWUFBWSxFQUFVLENBQUM7UUFDL0MsaUJBQVksR0FBUSxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQy9DLGVBQVUsR0FBVSxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQy9DLFlBQU8sR0FBYSxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQy9DLGNBQVMsR0FBVyxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQy9DLGNBQVMsR0FBVyxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQy9DLGVBQVUsR0FBVSxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQy9DLFdBQU0sR0FBYyxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQy9DLFlBQU8sR0FBYSxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQy9DLGVBQVUsR0FBVSxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQy9DLGFBQVEsR0FBWSxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQy9DLFdBQU0sR0FBYyxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQy9DLGFBQVEsR0FBWSxJQUFJLFlBQVksRUFBVSxDQUFDO1FBbEdyRCxJQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQztJQUM5QixDQUFDO0lBbUdEOztPQUVHO0lBQ0gsOENBQVEsR0FBUjtRQUFBLGlCQTREQztRQTFETyxJQUFBLEVBQUUsR0FBRyxJQUFJLEVBRUwsMEJBQVUsRUFDVixnQ0FBYSxFQUdiLHlEQUFhLEVBQ2IsMkRBQWMsQ0FDYztRQUVwQyxNQUFNLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRTtZQUN6QixTQUFTLEVBQUc7Z0JBQ1IsTUFBTSxZQUFDLEtBQVcsSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hELGFBQWEsWUFBQyxLQUFXLElBQUksRUFBRSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM5RCxVQUFVLFlBQUMsS0FBVyxJQUFJLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEQsZUFBZSxZQUFDLEtBQVcsSUFBSSxFQUFFLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEUsVUFBVSxZQUFDLEtBQVcsSUFBSSxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hELFFBQVEsWUFBQyxLQUFXLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNwRCxLQUFLLFlBQUMsS0FBVyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDOUMsT0FBTyxZQUFDLEtBQVcsSUFBSSxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xELE9BQU8sWUFBQyxLQUFXLElBQUksRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsRCxRQUFRLFlBQUMsS0FBVyxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEQsSUFBSSxZQUFDLEtBQVcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVDLEtBQUssWUFBQyxLQUFXLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM5QyxRQUFRLFlBQUMsS0FBVyxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEQsTUFBTSxZQUFDLEtBQVcsSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hELElBQUksWUFBQyxLQUFXLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM1QyxNQUFNLFlBQUMsS0FBVyxJQUFJLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFF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LEtBQUs7d0JBQ0wsS0FBSzs2QkFDTCxLQUFLO3dDQUNMLEtBQUs7eUJBQ0wsS0FBSzs4QkFDTCxLQUFLOytCQUNMLEtBQUs7Z0NBQ0wsS0FBSztzQkFDTCxLQUFLO3NCQUNMLEtBQUs7NEJBQ0wsS0FBSzs4QkFDTCxLQUFLO3dCQUNMLEtBQUs7OEJBQ0wsS0FBSzt5QkFDTCxLQUFLOzRCQUdMLEtBQUs7MEJBQ0wsS0FBSzswQkFDTCxLQUFLOzJCQUNMLEtBQUs7NEJBQ0wsS0FBSzt1QkFDTCxLQUFLO3lCQUNMLEtBQUs7eUJBQ0wsS0FBSzt1QkFDTCxLQUFLO3FCQUNMLEtBQUs7d0JBQ0wsS0FBSzt5QkFDTCxLQUFLOzhCQUNMLEtBQUs7eUJBQ0wsS0FBSzs0QkFDTCxLQUFLOzJCQUNMLEtBQUs7NEJBQ0wsS0FBSzsyQkFDTCxLQUFLOzJCQUNMLEtBQUs7NkJBQ0wsS0FBSzswQkFDTCxLQUFLO3dCQUNMLEtBQUs7b0JBQ0wsS0FBSztvQkFDTCxLQUFLOzZCQUdMLEtBQUs7a0NBQ0wsS0FBSzswQkFDTCxLQUFLO3lCQUNMLEtBQUs7eUJBQ0wsS0FBSzsyQkFHTCxNQUFNO2tDQUNOLE1BQU07K0JBQ04sTUFBTTtvQ0FDTixNQUFNOytCQUNOLE1BQU07NkJBQ04sTUFBTTswQkFDTixNQUFNOzRCQUNOLE1BQU07NEJBQ04sTUFBTTs2QkFDTixNQUFNO3lCQUNOLE1BQU07MEJBQ04sTUFBTTs2QkFDTixNQUFNOzJCQUNOLE1BQU07eUJBQ04sTUFBTTsyQkFDTixNQUFNOztJQXVHWCxrQ0FBQztDQUFBLEFBdFhELElBc1hDO1NBbFhZLDJCQUEyQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQW5ndWxhciB3cmFwcGVyIGZvciBCcnludHVtIEJ1dHRvbkdyb3VwXG4gKi9cblxuaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIE9uRGVzdHJveSwgT25Jbml0LCBPdXRwdXQsIElucHV0LCBTaW1wbGVDaGFuZ2UsIFNpbXBsZUNoYW5nZXMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCBXcmFwcGVySGVscGVyIGZyb20gJy4vd3JhcHBlci5oZWxwZXInO1xuXG4vLyBCcnludHVtICdzY2hlZHVsZXIubGl0ZS51bWQnIGJ1bmRsZSBjb21lcyB3aXRob3V0IHBvbHlmaWxscyB0byBzdXBwb3J0IEFuZ3VsYXIncyB6b25lLmpzXG5pbXBvcnQgeyBCYXNlLCBCdXR0b24sIEJ1dHRvbkNvbmZpZywgTGF5b3V0LCBNYXNrLCBNYXNrQ29uZmlnLCBNb2RlbCwgUmVjdGFuZ2xlLCBTY3JvbGxlciwgU2Nyb2xsZXJDb25maWcsIFdpZGdldCwgV2lkZ2V0Q29uZmlnIH0gZnJvbSAnQGJyeW50dW0vc2NoZWR1bGVyL3NjaGVkdWxlci5saXRlLnVtZC5qcyc7XG5pbXBvcnQgeyBCdXR0b25Hcm91cCwgU3RyaW5nSGVscGVyLCBXaWRnZXRIZWxwZXIgfSBmcm9tICdAYnJ5bnR1bS9zY2hlZHVsZXIvc2NoZWR1bGVyLmxpdGUudW1kLmpzJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3IgOiAnYnJ5bnR1bS1idXR0b24tZ3JvdXAnLFxuICAgIHRlbXBsYXRlIDogJydcbn0pXG5leHBvcnQgY2xhc3MgQnJ5bnR1bUJ1dHRvbkdyb3VwQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuXG4gICAgcHVibGljIHN0YXRpYyBpbnN0YW5jZUNsYXNzID0gQnV0dG9uR3JvdXA7XG5cbiAgICBwcml2YXRlIHN0YXRpYyBicnludHVtRmVhdHVyZU5hbWVzOiBzdHJpbmdbXSA9IFtcblxuICAgIF07XG5cbiAgICBwcml2YXRlIHN0YXRpYyBicnludHVtQ29uZmlnczogc3RyaW5nW10gPSBCcnludHVtQnV0dG9uR3JvdXBDb21wb25lbnQuYnJ5bnR1bUZlYXR1cmVOYW1lcy5jb25jYXQoW1xuICAgICAgICAnYWRvcHQnLFxuICAgICAgICAnYWxpZ24nLFxuICAgICAgICAnYWxpZ25TZWxmJyxcbiAgICAgICAgJ2FuY2hvcicsXG4gICAgICAgICdhcHBlbmRUbycsXG4gICAgICAgICdidWJibGVFdmVudHMnLFxuICAgICAgICAnY2VudGVyZWQnLFxuICAgICAgICAnY2xzJyxcbiAgICAgICAgJ2NvbG9yJyxcbiAgICAgICAgJ2NvbmZpZycsXG4gICAgICAgICdjb25zdHJhaW5UbycsXG4gICAgICAgICdjb250ZW50JyxcbiAgICAgICAgJ2NvbnRlbnRFbGVtZW50Q2xzJyxcbiAgICAgICAgJ2RhdGFzZXQnLFxuICAgICAgICAnZGVmYXVsdEJpbmRQcm9wZXJ0eScsXG4gICAgICAgICdkZWZhdWx0cycsXG4gICAgICAgICdkaXNhYmxlZCcsXG4gICAgICAgICdkb2NrJyxcbiAgICAgICAgJ2RyYWdnYWJsZScsXG4gICAgICAgICdleHRyYURhdGEnLFxuICAgICAgICAnZmxleCcsXG4gICAgICAgICdmbG9hdGluZycsXG4gICAgICAgICdoZWlnaHQnLFxuICAgICAgICAnaGlkZGVuJyxcbiAgICAgICAgJ2hpZGVBbmltYXRpb24nLFxuICAgICAgICAnaGlkZVdoZW5FbXB0eScsXG4gICAgICAgICdodG1sJyxcbiAgICAgICAgJ2h0bWxDbHMnLFxuICAgICAgICAnaWQnLFxuICAgICAgICAnaW5zZXJ0QmVmb3JlJyxcbiAgICAgICAgJ2luc2VydEZpcnN0JyxcbiAgICAgICAgJ2l0ZW1DbHMnLFxuICAgICAgICAnaXRlbXMnLFxuICAgICAgICAnbGF5b3V0JyxcbiAgICAgICAgJ2xheW91dFN0eWxlJyxcbiAgICAgICAgJ2xhenlJdGVtcycsXG4gICAgICAgICdsaXN0ZW5lcnMnLFxuICAgICAgICAnbG9jYWxlQ2xhc3MnLFxuICAgICAgICAnbG9jYWxpemFibGVQcm9wZXJ0aWVzJyxcbiAgICAgICAgJ21hcmdpbicsXG4gICAgICAgICdtYXNrRGVmYXVsdHMnLFxuICAgICAgICAnbWFza2VkJyxcbiAgICAgICAgJ21heEhlaWdodCcsXG4gICAgICAgICdtYXhXaWR0aCcsXG4gICAgICAgICdtaW5IZWlnaHQnLFxuICAgICAgICAnbWluV2lkdGgnLFxuICAgICAgICAnbW9uaXRvclJlc2l6ZScsXG4gICAgICAgICduYW1lZEl0ZW1zJyxcbiAgICAgICAgJ293bmVyJyxcbiAgICAgICAgJ3Bvc2l0aW9uZWQnLFxuICAgICAgICAncHJldmVudFRvb2x0aXBPblRvdWNoJyxcbiAgICAgICAgJ3JlYWRPbmx5JyxcbiAgICAgICAgJ3JpcHBsZScsXG4gICAgICAgICdyb290RWxlbWVudCcsXG4gICAgICAgICdzY3JvbGxhYmxlJyxcbiAgICAgICAgJ3Njcm9sbEFjdGlvbicsXG4gICAgICAgICdzaG93QW5pbWF0aW9uJyxcbiAgICAgICAgJ3RhYicsXG4gICAgICAgICd0YWcnLFxuICAgICAgICAndGV4dEFsaWduJyxcbiAgICAgICAgJ3RleHRDb250ZW50JyxcbiAgICAgICAgJ3RpdGxlJyxcbiAgICAgICAgJ3RvZ2dsZUdyb3VwJyxcbiAgICAgICAgJ3Rvb2x0aXAnLFxuICAgICAgICAnd2VpZ2h0JyxcbiAgICAgICAgJ3dpZHRoJyxcbiAgICAgICAgJ3gnLFxuICAgICAgICAneSdcbiAgICBdKTtcblxuICAgIHByaXZhdGUgc3RhdGljIGJyeW50dW1Db25maWdzT25seTogc3RyaW5nW10gPSBbXG4gICAgICAgICdhZG9wdCcsXG4gICAgICAgICdhbGlnbicsXG4gICAgICAgICdhbmNob3InLFxuICAgICAgICAnYXBwZW5kVG8nLFxuICAgICAgICAnYnViYmxlRXZlbnRzJyxcbiAgICAgICAgJ2NlbnRlcmVkJyxcbiAgICAgICAgJ2NscycsXG4gICAgICAgICdjb2xvcicsXG4gICAgICAgICdjb25maWcnLFxuICAgICAgICAnY29uc3RyYWluVG8nLFxuICAgICAgICAnY29udGVudEVsZW1lbnRDbHMnLFxuICAgICAgICAnZGVmYXVsdEJpbmRQcm9wZXJ0eScsXG4gICAgICAgICdkZWZhdWx0cycsXG4gICAgICAgICdkb2NrJyxcbiAgICAgICAgJ2RyYWdnYWJsZScsXG4gICAgICAgICdmbG9hdGluZycsXG4gICAgICAgICdoaWRlQW5pbWF0aW9uJyxcbiAgICAgICAgJ2hpZGVXaGVuRW1wdHknLFxuICAgICAgICAnaHRtbENscycsXG4gICAgICAgICdpbnNlcnRCZWZvcmUnLFxuICAgICAgICAnaW5zZXJ0Rmlyc3QnLFxuICAgICAgICAnaXRlbUNscycsXG4gICAgICAgICdsYXp5SXRlbXMnLFxuICAgICAgICAnbGlzdGVuZXJzJyxcbiAgICAgICAgJ2xvY2FsZUNsYXNzJyxcbiAgICAgICAgJ2xvY2FsaXphYmxlUHJvcGVydGllcycsXG4gICAgICAgICdtYXNrRGVmYXVsdHMnLFxuICAgICAgICAnbWFza2VkJyxcbiAgICAgICAgJ21vbml0b3JSZXNpemUnLFxuICAgICAgICAnbmFtZWRJdGVtcycsXG4gICAgICAgICdvd25lcicsXG4gICAgICAgICdwb3NpdGlvbmVkJyxcbiAgICAgICAgJ3ByZXZlbnRUb29sdGlwT25Ub3VjaCcsXG4gICAgICAgICdyaXBwbGUnLFxuICAgICAgICAncm9vdEVsZW1lbnQnLFxuICAgICAgICAnc2Nyb2xsQWN0aW9uJyxcbiAgICAgICAgJ3Nob3dBbmltYXRpb24nLFxuICAgICAgICAndGFiJyxcbiAgICAgICAgJ3RhZycsXG4gICAgICAgICd0ZXh0QWxpZ24nLFxuICAgICAgICAndGV4dENvbnRlbnQnLFxuICAgICAgICAndGl0bGUnLFxuICAgICAgICAndG9nZ2xlR3JvdXAnLFxuICAgICAgICAnd2VpZ2h0J1xuICAgIF07XG5cbiAgICBwcml2YXRlIHN0YXRpYyBicnludHVtUHJvcHM6IHN0cmluZ1tdID0gQnJ5bnR1bUJ1dHRvbkdyb3VwQ29tcG9uZW50LmJyeW50dW1GZWF0dXJlTmFtZXMuY29uY2F0KFtcbiAgICAgICAgJ2FsaWduU2VsZicsXG4gICAgICAgICdhbmNob3JTaXplJyxcbiAgICAgICAgJ2NvbnRlbnQnLFxuICAgICAgICAnZGF0YXNldCcsXG4gICAgICAgICdkaXNhYmxlZCcsXG4gICAgICAgICdleHRyYURhdGEnLFxuICAgICAgICAnZmxleCcsXG4gICAgICAgICdoZWlnaHQnLFxuICAgICAgICAnaGlkZGVuJyxcbiAgICAgICAgJ2h0bWwnLFxuICAgICAgICAnaWQnLFxuICAgICAgICAnaXNTZXR0aW5nVmFsdWVzJyxcbiAgICAgICAgJ2lzVmFsaWQnLFxuICAgICAgICAnaXRlbXMnLFxuICAgICAgICAnbGF5b3V0JyxcbiAgICAgICAgJ2xheW91dFN0eWxlJyxcbiAgICAgICAgJ21hcmdpbicsXG4gICAgICAgICdtYXhIZWlnaHQnLFxuICAgICAgICAnbWF4V2lkdGgnLFxuICAgICAgICAnbWluSGVpZ2h0JyxcbiAgICAgICAgJ21pbldpZHRoJyxcbiAgICAgICAgJ3JlYWRPbmx5JyxcbiAgICAgICAgJ3JlY29yZCcsXG4gICAgICAgICdzY3JvbGxhYmxlJyxcbiAgICAgICAgJ3Rvb2x0aXAnLFxuICAgICAgICAndmFsdWVzJyxcbiAgICAgICAgJ3dpZHRoJyxcbiAgICAgICAgJ3gnLFxuICAgICAgICAneSdcbiAgICBdKTtcblxuICAgIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZjtcbiAgICBwdWJsaWMgaW5zdGFuY2U6IEJ1dHRvbkdyb3VwO1xuXG4gICAgcHJpdmF0ZSBicnludHVtQ29uZmlnID0ge1xuICAgICAgICBhbmd1bGFyQ29tcG9uZW50IDogdGhpcyxcbiAgICAgICAgYWRvcHQgICAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgbGlzdGVuZXJzICAgICAgICA6IHt9LFxuICAgICAgICBmZWF0dXJlcyAgICAgICAgIDoge31cbiAgICB9O1xuXG4gICAgY29uc3RydWN0b3IoZWxlbWVudDogRWxlbWVudFJlZikge1xuICAgICAgICB0aGlzLmVsZW1lbnRSZWYgPSBlbGVtZW50O1xuICAgIH1cblxuICAgICAvLyBDb25maWdzIG9ubHlcbiAgICBASW5wdXQoKSBhZG9wdCAgICAgICAgICAgICAgICAgOiBIVE1MRWxlbWVudHxzdHJpbmc7XG4gICAgQElucHV0KCkgYWxpZ24gICAgICAgICAgICAgICAgIDogb2JqZWN0fHN0cmluZztcbiAgICBASW5wdXQoKSBhbmNob3IgICAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGFwcGVuZFRvICAgICAgICAgICAgICA6IEhUTUxFbGVtZW50fHN0cmluZztcbiAgICBASW5wdXQoKSBidWJibGVFdmVudHMgICAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgY2VudGVyZWQgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBjbHMgICAgICAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgY29sb3IgICAgICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGNvbmZpZyAgICAgICAgICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBjb25zdHJhaW5UbyAgICAgICAgICAgOiBIVE1MRWxlbWVudHxXaWRnZXR8UmVjdGFuZ2xlO1xuICAgIEBJbnB1dCgpIGNvbnRlbnRFbGVtZW50Q2xzICAgICA6IHN0cmluZ3xvYmplY3Q7XG4gICAgQElucHV0KCkgZGVmYXVsdEJpbmRQcm9wZXJ0eSAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGRlZmF1bHRzICAgICAgICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBkb2NrICAgICAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgZHJhZ2dhYmxlICAgICAgICAgICAgIDogYm9vbGVhbnxvYmplY3Q7XG4gICAgQElucHV0KCkgZmxvYXRpbmcgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBoaWRlQW5pbWF0aW9uICAgICAgICAgOiBib29sZWFufG9iamVjdDtcbiAgICBASW5wdXQoKSBoaWRlV2hlbkVtcHR5ICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGh0bWxDbHMgICAgICAgICAgICAgICA6IHN0cmluZ3xvYmplY3Q7XG4gICAgQElucHV0KCkgaW5zZXJ0QmVmb3JlICAgICAgICAgIDogSFRNTEVsZW1lbnR8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGluc2VydEZpcnN0ICAgICAgICAgICA6IEhUTUxFbGVtZW50fHN0cmluZztcbiAgICBASW5wdXQoKSBpdGVtQ2xzICAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgbGF6eUl0ZW1zICAgICAgICAgICAgIDogb2JqZWN0fG9iamVjdFtdfFdpZGdldFtdfFBhcnRpYWw8V2lkZ2V0Q29uZmlnPnxQYXJ0aWFsPFdpZGdldENvbmZpZz5bXTtcbiAgICBASW5wdXQoKSBsaXN0ZW5lcnMgICAgICAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgbG9jYWxlQ2xhc3MgICAgICAgICAgIDogQmFzZTtcbiAgICBASW5wdXQoKSBsb2NhbGl6YWJsZVByb3BlcnRpZXMgOiBzdHJpbmdbXTtcbiAgICBASW5wdXQoKSBtYXNrRGVmYXVsdHMgICAgICAgICAgOiBvYmplY3R8TWFza3xQYXJ0aWFsPE1hc2tDb25maWc+O1xuICAgIEBJbnB1dCgpIG1hc2tlZCAgICAgICAgICAgICAgICA6IGJvb2xlYW58c3RyaW5nfG9iamVjdHxNYXNrfFBhcnRpYWw8TWFza0NvbmZpZz47XG4gICAgQElucHV0KCkgbW9uaXRvclJlc2l6ZSAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBuYW1lZEl0ZW1zICAgICAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgb3duZXIgICAgICAgICAgICAgICAgIDogV2lkZ2V0O1xuICAgIEBJbnB1dCgpIHBvc2l0aW9uZWQgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgcHJldmVudFRvb2x0aXBPblRvdWNoIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSByaXBwbGUgICAgICAgICAgICAgICAgOiBib29sZWFufG9iamVjdDtcbiAgICBASW5wdXQoKSByb290RWxlbWVudCAgICAgICAgICAgOiBTaGFkb3dSb290O1xuICAgIEBJbnB1dCgpIHNjcm9sbEFjdGlvbiAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBzaG93QW5pbWF0aW9uICAgICAgICAgOiBib29sZWFufG9iamVjdDtcbiAgICBASW5wdXQoKSB0YWIgICAgICAgICAgICAgICAgICAgOiBib29sZWFufG9iamVjdDtcbiAgICBASW5wdXQoKSB0YWcgICAgICAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgdGV4dEFsaWduICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIHRleHRDb250ZW50ICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgdGl0bGUgICAgICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIHRvZ2dsZUdyb3VwICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgd2VpZ2h0ICAgICAgICAgICAgICAgIDogbnVtYmVyO1xuXG4gICAgIC8vIENvbmZpZ3MgYW5kIHByb3BlcnRpZXNcbiAgICBASW5wdXQoKSBhbGlnblNlbGYgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBjb250ZW50ICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBkYXRhc2V0ICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBkaXNhYmxlZCAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgZXh0cmFEYXRhICAgOiBib29sZWFufG51bWJlcnxvYmplY3R8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGZsZXggICAgICAgIDogbnVtYmVyfHN0cmluZztcbiAgICBASW5wdXQoKSBoZWlnaHQgICAgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgaGlkZGVuICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGh0bWwgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGlkICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGl0ZW1zICAgICAgIDogQnV0dG9uW118V2lkZ2V0W118b2JqZWN0fG9iamVjdFtdfFBhcnRpYWw8QnV0dG9uQ29uZmlnPnxQYXJ0aWFsPFdpZGdldENvbmZpZz58UGFydGlhbDxCdXR0b25Db25maWc+W118UGFydGlhbDxXaWRnZXRDb25maWc+W107XG4gICAgQElucHV0KCkgbGF5b3V0ICAgICAgOiBMYXlvdXR8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGxheW91dFN0eWxlIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIG1hcmdpbiAgICAgIDogbnVtYmVyfHN0cmluZztcbiAgICBASW5wdXQoKSBtYXhIZWlnaHQgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgbWF4V2lkdGggICAgOiBudW1iZXJ8c3RyaW5nO1xuICAgIEBJbnB1dCgpIG1pbkhlaWdodCAgIDogbnVtYmVyfHN0cmluZztcbiAgICBASW5wdXQoKSBtaW5XaWR0aCAgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgcmVhZE9ubHkgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHNjcm9sbGFibGUgIDogYm9vbGVhbnxTY3JvbGxlcnxvYmplY3R8UGFydGlhbDxTY3JvbGxlckNvbmZpZz47XG4gICAgQElucHV0KCkgdG9vbHRpcCAgICAgOiBvYmplY3R8c3RyaW5nO1xuICAgIEBJbnB1dCgpIHdpZHRoICAgICAgIDogbnVtYmVyfHN0cmluZztcbiAgICBASW5wdXQoKSB4ICAgICAgICAgICA6IG51bWJlcjtcbiAgICBASW5wdXQoKSB5ICAgICAgICAgICA6IG51bWJlcjtcblxuICAgICAvLyBQcm9wZXJ0aWVzIG9ubHlcbiAgICBASW5wdXQoKSBhbmNob3JTaXplICAgICAgOiBudW1iZXJbXTtcbiAgICBASW5wdXQoKSBpc1NldHRpbmdWYWx1ZXMgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGlzVmFsaWQgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgcmVjb3JkICAgICAgICAgIDogTW9kZWw7XG4gICAgQElucHV0KCkgdmFsdWVzICAgICAgICAgIDogb2JqZWN0O1xuXG4gICAgIC8vIEV2ZW50c1xuICAgIEBPdXRwdXQoKSBvbkFjdGlvbiAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkJlZm9yZURlc3Ryb3kgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkJlZm9yZUhpZGUgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkJlZm9yZVNldFJlY29yZCA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkJlZm9yZVNob3cgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkNhdGNoQWxsICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkNsaWNrICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkRlc3Ryb3kgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkZvY3VzSW4gICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkZvY3VzT3V0ICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkhpZGUgICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvblBhaW50ICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvblJlYWRPbmx5ICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvblJlc2l6ZSAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvblNob3cgICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvblRvZ2dsZSAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGFuZCBhcHBlbmQgdGhlIHVuZGVybHlpbmcgd2lkZ2V0XG4gICAgICovXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0XG4gICAgICAgICAgICBtZSA9IHRoaXMsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZWxlbWVudFJlZixcbiAgICAgICAgICAgICAgICBicnludHVtQ29uZmlnXG4gICAgICAgICAgICB9ID0gbWUsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaW5zdGFuY2VDbGFzcyxcbiAgICAgICAgICAgICAgICBicnludHVtQ29uZmlnc1xuICAgICAgICAgICAgfSA9IEJyeW50dW1CdXR0b25Hcm91cENvbXBvbmVudDtcblxuICAgICAgICBPYmplY3QuYXNzaWduKGJyeW50dW1Db25maWcsIHtcbiAgICAgICAgICAgIGxpc3RlbmVycyA6IHtcbiAgICAgICAgICAgICAgICBhY3Rpb24oZXZlbnQgOiBhbnkpIHsgbWUub25BY3Rpb24uZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgYmVmb3JlRGVzdHJveShldmVudCA6IGFueSkgeyBtZS5vbkJlZm9yZURlc3Ryb3kuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgYmVmb3JlSGlkZShldmVudCA6IGFueSkgeyBtZS5vbkJlZm9yZUhpZGUuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgYmVmb3JlU2V0UmVjb3JkKGV2ZW50IDogYW55KSB7IG1lLm9uQmVmb3JlU2V0UmVjb3JkLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGJlZm9yZVNob3coZXZlbnQgOiBhbnkpIHsgbWUub25CZWZvcmVTaG93LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGNhdGNoQWxsKGV2ZW50IDogYW55KSB7IG1lLm9uQ2F0Y2hBbGwuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgY2xpY2soZXZlbnQgOiBhbnkpIHsgbWUub25DbGljay5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBkZXN0cm95KGV2ZW50IDogYW55KSB7IG1lLm9uRGVzdHJveS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBmb2N1c0luKGV2ZW50IDogYW55KSB7IG1lLm9uRm9jdXNJbi5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBmb2N1c091dChldmVudCA6IGFueSkgeyBtZS5vbkZvY3VzT3V0LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGhpZGUoZXZlbnQgOiBhbnkpIHsgbWUub25IaWRlLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIHBhaW50KGV2ZW50IDogYW55KSB7IG1lLm9uUGFpbnQuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgcmVhZE9ubHkoZXZlbnQgOiBhbnkpIHsgbWUub25SZWFkT25seS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICByZXNpemUoZXZlbnQgOiBhbnkpIHsgbWUub25SZXNpemUuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgc2hvdyhldmVudCA6IGFueSkgeyBtZS5vblNob3cuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgdG9nZ2xlKGV2ZW50IDogYW55KSB7IG1lLm9uVG9nZ2xlLmVtaXQoZXZlbnQpOyB9LFxuXG4gICAgICAgICAgICAgICAgdGhpc09iaiA6IG1lXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIElmIGNvbXBvbmVudCBoYXMgbm8gY29udGFpbmVyIHNwZWNpZmllZCBpbiBjb25maWcgdGhlbiB1c2UgYWRvcHQgdG8gV3JhcHBlcidzIGVsZW1lbnRcbiAgICAgICAgY29uc3RcbiAgICAgICAgICAgIGNvbnRhaW5lclBhcmFtID0gW1xuICAgICAgICAgICAgICAgICdhZG9wdCcsXG4gICAgICAgICAgICAgICAgJ2FwcGVuZFRvJyxcbiAgICAgICAgICAgICAgICAnaW5zZXJ0QWZ0ZXInLFxuICAgICAgICAgICAgICAgICdpbnNlcnRCZWZvcmUnXG4gICAgICAgICAgICBdLmZpbmQocHJvcCA9PiBicnludHVtQ29uZmlnW3Byb3BdKTtcbiAgICAgICAgaWYgKCFjb250YWluZXJQYXJhbSkge1xuICAgICAgICAgICAgYnJ5bnR1bUNvbmZpZy5hZG9wdCA9IGVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIFdyYXBwZXJIZWxwZXIuZGV2V2FybmluZ0NvbnRhaW5lcihpbnN0YW5jZUNsYXNzLiRuYW1lLCBjb250YWluZXJQYXJhbSk7XG4gICAgICAgIH1cblxuICAgICAgICBicnludHVtQ29uZmlncy5maWx0ZXIocHJvcCA9PiBwcm9wIGluIHRoaXMpLmZvckVhY2gocHJvcCA9PiB7XG4gICAgICAgICAgICBXcmFwcGVySGVscGVyLmFwcGx5UHJvcFZhbHVlKGJyeW50dW1Db25maWcsIHByb3AsIHRoaXNbcHJvcF0pO1xuICAgICAgICAgICAgaWYgKFsnZmVhdHVyZXMnLCAnY29uZmlnJ10uaW5jbHVkZXMocHJvcCkpIHtcbiAgICAgICAgICAgICAgICBXcmFwcGVySGVscGVyLmRldldhcm5pbmdDb25maWdQcm9wKGluc3RhbmNlQ2xhc3MuJG5hbWUsIHByb3ApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIG1lLmluc3RhbmNlID0gaW5zdGFuY2VDbGFzcy4kbmFtZSA9PT0gJ1dpZGdldCcgPyBXaWRnZXRIZWxwZXIuY3JlYXRlV2lkZ2V0KGJyeW50dW1Db25maWcpIDogbmV3IGluc3RhbmNlQ2xhc3MoYnJ5bnR1bUNvbmZpZyk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBXYXRjaCBmb3IgY2hhbmdlc1xuICAgICAqIEBwYXJhbSBjaGFuZ2VzXG4gICAgICovXG4gICAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgICAgICBjb25zdFxuICAgICAgICAgICAgeyBpbnN0YW5jZSB9ID0gdGhpcyxcbiAgICAgICAgICAgIHsgaW5zdGFuY2VDbGFzcyB9ID0gQnJ5bnR1bUJ1dHRvbkdyb3VwQ29tcG9uZW50O1xuXG4gICAgICAgIGlmICghaW5zdGFuY2UpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEl0ZXJhdGUgb3ZlciBhbGwgY2hhbmdlc1xuICAgICAgICBPYmplY3QuZW50cmllcyhjaGFuZ2VzKS5mb3JFYWNoKChbcHJvcCwgY2hhbmdlXSkgPT4ge1xuICAgICAgICAgICAgY29uc3RcbiAgICAgICAgICAgICAgICBuZXdWYWx1ZSA9IChjaGFuZ2UgYXMgU2ltcGxlQ2hhbmdlKS5jdXJyZW50VmFsdWUsXG4gICAgICAgICAgICAgICAgeyBpbnN0YW5jZSB9ID0gdGhpcyxcbiAgICAgICAgICAgICAgICB7IGJyeW50dW1Db25maWdzT25seSwgYnJ5bnR1bVByb3BzIH0gPSBCcnludHVtQnV0dG9uR3JvdXBDb21wb25lbnQ7XG4gICAgICAgICAgICBpZiAoYnJ5bnR1bVByb3BzLmluY2x1ZGVzKHByb3ApKSB7XG4gICAgICAgICAgICAgICAgV3JhcHBlckhlbHBlci5hcHBseVByb3BWYWx1ZShpbnN0YW5jZSwgcHJvcCwgbmV3VmFsdWUsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICBpZiAoYnJ5bnR1bUNvbmZpZ3NPbmx5LmluY2x1ZGVzKHByb3ApKSB7XG4gICAgICAgICAgICAgICAgICAgIFdyYXBwZXJIZWxwZXIuZGV2V2FybmluZ1VwZGF0ZVByb3AoaW5zdGFuY2VDbGFzcy4kbmFtZSwgcHJvcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZXN0cm95IHRoZSBjb21wb25lbnRcbiAgICAgKi9cbiAgICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaW5zdGFuY2UpIHtcbiAgICAgICAgICAgIHRoaXMuaW5zdGFuY2UuZGVzdHJveSgpO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19