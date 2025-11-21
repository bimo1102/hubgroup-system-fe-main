/**
 * Angular wrapper for Bryntum FilterField
 */
import * as tslib_1 from "tslib";
import { Component, ElementRef, EventEmitter, Output, Input } from '@angular/core';
import WrapperHelper from './wrapper.helper';
// Bryntum 'scheduler.lite.umd' bundle comes without polyfills to support Angular's zone.js
import { Base, Store, Widget } from '@bryntum/scheduler/scheduler.lite.umd.js';
import { FilterField, WidgetHelper } from '@bryntum/scheduler/scheduler.lite.umd.js';
var BryntumFilterFieldComponent = /** @class */ (function () {
    function BryntumFilterFieldComponent(element) {
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
        this.onBeforeShow = new EventEmitter();
        this.onCatchAll = new EventEmitter();
        this.onChange = new EventEmitter();
        this.onClear = new EventEmitter();
        this.onDestroy = new EventEmitter();
        this.onFocusIn = new EventEmitter();
        this.onFocusOut = new EventEmitter();
        this.onHide = new EventEmitter();
        this.onInput = new EventEmitter();
        this.onPaint = new EventEmitter();
        this.onReadOnly = new EventEmitter();
        this.onResize = new EventEmitter();
        this.onShow = new EventEmitter();
        this.onTrigger = new EventEmitter();
        this.elementRef = element;
    }
    /**
     * Create and append the underlying widget
     */
    BryntumFilterFieldComponent.prototype.ngOnInit = function () {
        var _this = this;
        var me = this, elementRef = me.elementRef, bryntumConfig = me.bryntumConfig, instanceClass = BryntumFilterFieldComponent.instanceClass, bryntumConfigs = BryntumFilterFieldComponent.bryntumConfigs;
        Object.assign(bryntumConfig, {
            listeners: {
                action: function (event) { me.onAction.emit(event); },
                beforeDestroy: function (event) { me.onBeforeDestroy.emit(event); },
                beforeHide: function (event) { me.onBeforeHide.emit(event); },
                beforeShow: function (event) { me.onBeforeShow.emit(event); },
                catchAll: function (event) { me.onCatchAll.emit(event); },
                change: function (event) { me.onChange.emit(event); },
                clear: function (event) { me.onClear.emit(event); },
                destroy: function (event) { me.onDestroy.emit(event); },
                focusIn: function (event) { me.onFocusIn.emit(event); },
                focusOut: function (event) { me.onFocusOut.emit(event); },
                hide: function (event) { me.onHide.emit(event); },
                input: function (event) { me.onInput.emit(event); },
                paint: function (event) { me.onPaint.emit(event); },
                readOnly: function (event) { me.onReadOnly.emit(event); },
                resize: function (event) { me.onResize.emit(event); },
                show: function (event) { me.onShow.emit(event); },
                trigger: function (event) { me.onTrigger.emit(event); },
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
    BryntumFilterFieldComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        var instance = this.instance, instanceClass = BryntumFilterFieldComponent.instanceClass;
        if (!instance) {
            return;
        }
        // Iterate over all changes
        Object.entries(changes).forEach(function (_a) {
            var _b = tslib_1.__read(_a, 2), prop = _b[0], change = _b[1];
            var newValue = change.currentValue, instance = _this.instance, bryntumConfigsOnly = BryntumFilterFieldComponent.bryntumConfigsOnly, bryntumProps = BryntumFilterFieldComponent.bryntumProps;
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
    BryntumFilterFieldComponent.prototype.ngOnDestroy = function () {
        if (this.instance) {
            this.instance.destroy();
        }
    };
    BryntumFilterFieldComponent.instanceClass = FilterField;
    BryntumFilterFieldComponent.bryntumFeatureNames = [];
    BryntumFilterFieldComponent.bryntumConfigs = BryntumFilterFieldComponent.bryntumFeatureNames.concat([
        'adopt',
        'align',
        'alignSelf',
        'anchor',
        'appendTo',
        'autoComplete',
        'autoSelect',
        'badge',
        'bubbleEvents',
        'centered',
        'clearable',
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
        'editable',
        'extraData',
        'field',
        'filterFunction',
        'flex',
        'floating',
        'height',
        'hidden',
        'hideAnimation',
        'highlightExternalChange',
        'hint',
        'hintHtml',
        'html',
        'htmlCls',
        'id',
        'inputAlign',
        'inputAttributes',
        'inputWidth',
        'insertBefore',
        'insertFirst',
        'keyStrokeChangeDelay',
        'label',
        'labelCls',
        'labelPosition',
        'labels',
        'labelWidth',
        'listeners',
        'localeClass',
        'localizableProperties',
        'margin',
        'maskDefaults',
        'masked',
        'maxHeight',
        'maxLength',
        'maxWidth',
        'minHeight',
        'minLength',
        'minWidth',
        'monitorResize',
        'name',
        'owner',
        'placeholder',
        'positioned',
        'preventTooltipOnTouch',
        'readOnly',
        'required',
        'revertOnEscape',
        'ripple',
        'rootElement',
        'scrollable',
        'scrollAction',
        'showAnimation',
        'store',
        'tab',
        'tabIndex',
        'tag',
        'textAlign',
        'title',
        'tooltip',
        'triggers',
        'value',
        'weight',
        'width',
        'x',
        'y'
    ]);
    BryntumFilterFieldComponent.bryntumConfigsOnly = [
        'adopt',
        'align',
        'anchor',
        'appendTo',
        'autoComplete',
        'autoSelect',
        'bubbleEvents',
        'centered',
        'clearable',
        'cls',
        'config',
        'constrainTo',
        'contentElementCls',
        'defaultBindProperty',
        'dock',
        'draggable',
        'editable',
        'field',
        'filterFunction',
        'floating',
        'hideAnimation',
        'highlightExternalChange',
        'hint',
        'hintHtml',
        'htmlCls',
        'inputAlign',
        'inputAttributes',
        'inputWidth',
        'insertBefore',
        'insertFirst',
        'keyStrokeChangeDelay',
        'labelCls',
        'labelPosition',
        'labels',
        'labelWidth',
        'listeners',
        'localeClass',
        'localizableProperties',
        'maskDefaults',
        'masked',
        'maxLength',
        'minLength',
        'monitorResize',
        'name',
        'owner',
        'placeholder',
        'positioned',
        'preventTooltipOnTouch',
        'required',
        'revertOnEscape',
        'ripple',
        'rootElement',
        'scrollAction',
        'showAnimation',
        'store',
        'tab',
        'tabIndex',
        'tag',
        'textAlign',
        'title',
        'weight'
    ];
    BryntumFilterFieldComponent.bryntumProps = BryntumFilterFieldComponent.bryntumFeatureNames.concat([
        'alignSelf',
        'anchorSize',
        'badge',
        'content',
        'dataset',
        'disabled',
        'extraData',
        'flex',
        'height',
        'hidden',
        'html',
        'id',
        'label',
        'margin',
        'maxHeight',
        'maxWidth',
        'minHeight',
        'minWidth',
        'readOnly',
        'scrollable',
        'tooltip',
        'triggers',
        'value',
        'width',
        'x',
        'y'
    ]);
    BryntumFilterFieldComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bryntum-filter-field',
                    template: ''
                }] }
    ];
    /** @nocollapse */
    BryntumFilterFieldComponent.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    BryntumFilterFieldComponent.propDecorators = {
        adopt: [{ type: Input }],
        align: [{ type: Input }],
        anchor: [{ type: Input }],
        appendTo: [{ type: Input }],
        autoComplete: [{ type: Input }],
        autoSelect: [{ type: Input }],
        bubbleEvents: [{ type: Input }],
        centered: [{ type: Input }],
        clearable: [{ type: Input }],
        cls: [{ type: Input }],
        config: [{ type: Input }],
        constrainTo: [{ type: Input }],
        contentElementCls: [{ type: Input }],
        defaultBindProperty: [{ type: Input }],
        dock: [{ type: Input }],
        draggable: [{ type: Input }],
        editable: [{ type: Input }],
        field: [{ type: Input }],
        filterFunction: [{ type: Input }],
        floating: [{ type: Input }],
        hideAnimation: [{ type: Input }],
        highlightExternalChange: [{ type: Input }],
        hint: [{ type: Input }],
        hintHtml: [{ type: Input }],
        htmlCls: [{ type: Input }],
        inputAlign: [{ type: Input }],
        inputAttributes: [{ type: Input }],
        inputWidth: [{ type: Input }],
        insertBefore: [{ type: Input }],
        insertFirst: [{ type: Input }],
        keyStrokeChangeDelay: [{ type: Input }],
        labelCls: [{ type: Input }],
        labelPosition: [{ type: Input }],
        labels: [{ type: Input }],
        labelWidth: [{ type: Input }],
        listeners: [{ type: Input }],
        localeClass: [{ type: Input }],
        localizableProperties: [{ type: Input }],
        maskDefaults: [{ type: Input }],
        masked: [{ type: Input }],
        maxLength: [{ type: Input }],
        minLength: [{ type: Input }],
        monitorResize: [{ type: Input }],
        name: [{ type: Input }],
        owner: [{ type: Input }],
        placeholder: [{ type: Input }],
        positioned: [{ type: Input }],
        preventTooltipOnTouch: [{ type: Input }],
        required: [{ type: Input }],
        revertOnEscape: [{ type: Input }],
        ripple: [{ type: Input }],
        rootElement: [{ type: Input }],
        scrollAction: [{ type: Input }],
        showAnimation: [{ type: Input }],
        store: [{ type: Input }],
        tab: [{ type: Input }],
        tabIndex: [{ type: Input }],
        tag: [{ type: Input }],
        textAlign: [{ type: Input }],
        title: [{ type: Input }],
        weight: [{ type: Input }],
        alignSelf: [{ type: Input }],
        badge: [{ type: Input }],
        content: [{ type: Input }],
        dataset: [{ type: Input }],
        disabled: [{ type: Input }],
        extraData: [{ type: Input }],
        flex: [{ type: Input }],
        height: [{ type: Input }],
        hidden: [{ type: Input }],
        html: [{ type: Input }],
        id: [{ type: Input }],
        label: [{ type: Input }],
        margin: [{ type: Input }],
        maxHeight: [{ type: Input }],
        maxWidth: [{ type: Input }],
        minHeight: [{ type: Input }],
        minWidth: [{ type: Input }],
        readOnly: [{ type: Input }],
        scrollable: [{ type: Input }],
        tooltip: [{ type: Input }],
        triggers: [{ type: Input }],
        value: [{ type: Input }],
        width: [{ type: Input }],
        x: [{ type: Input }],
        y: [{ type: Input }],
        anchorSize: [{ type: Input }],
        onAction: [{ type: Output }],
        onBeforeDestroy: [{ type: Output }],
        onBeforeHide: [{ type: Output }],
        onBeforeShow: [{ type: Output }],
        onCatchAll: [{ type: Output }],
        onChange: [{ type: Output }],
        onClear: [{ type: Output }],
        onDestroy: [{ type: Output }],
        onFocusIn: [{ type: Output }],
        onFocusOut: [{ type: Output }],
        onHide: [{ type: Output }],
        onInput: [{ type: Output }],
        onPaint: [{ type: Output }],
        onReadOnly: [{ type: Output }],
        onResize: [{ type: Output }],
        onShow: [{ type: Output }],
        onTrigger: [{ type: Output }]
    };
    return BryntumFilterFieldComponent;
}());
export { BryntumFilterFieldComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJ5bnR1bS1maWx0ZXItZmllbGQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGJyeW50dW0vc2NoZWR1bGVyLWFuZ3VsYXIvIiwic291cmNlcyI6WyJsaWIvYnJ5bnR1bS1maWx0ZXItZmllbGQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztHQUVHOztBQUVILE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBcUIsTUFBTSxFQUFFLEtBQUssRUFBK0IsTUFBTSxlQUFlLENBQUM7QUFDbkksT0FBTyxhQUFhLE1BQU0sa0JBQWtCLENBQUM7QUFFN0MsMkZBQTJGO0FBQzNGLE9BQU8sRUFBRSxJQUFJLEVBQXlELEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQUN0SSxPQUFPLEVBQUUsV0FBVyxFQUFnQixZQUFZLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQUVuRztJQTRNSSxxQ0FBWSxPQUFtQjtRQVB2QixrQkFBYSxHQUFHO1lBQ3BCLGdCQUFnQixFQUFHLElBQUk7WUFDdkIsS0FBSyxFQUFjLFNBQVM7WUFDNUIsU0FBUyxFQUFVLEVBQUU7WUFDckIsUUFBUSxFQUFXLEVBQUU7U0FDeEIsQ0FBQztRQW1HRCxTQUFTO1FBQ0EsYUFBUSxHQUFVLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0Msb0JBQWUsR0FBRyxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQzdDLGlCQUFZLEdBQU0sSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUM3QyxpQkFBWSxHQUFNLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsZUFBVSxHQUFRLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsYUFBUSxHQUFVLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsWUFBTyxHQUFXLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsY0FBUyxHQUFTLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsY0FBUyxHQUFTLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsZUFBVSxHQUFRLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsV0FBTSxHQUFZLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsWUFBTyxHQUFXLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsWUFBTyxHQUFXLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsZUFBVSxHQUFRLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsYUFBUSxHQUFVLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsV0FBTSxHQUFZLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsY0FBUyxHQUFTLElBQUksWUFBWSxFQUFVLENBQUM7UUFqSG5ELElBQUksQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDO0lBQzlCLENBQUM7SUFrSEQ7O09BRUc7SUFDSCw4Q0FBUSxHQUFSO1FBQUEsaUJBNkRDO1FBM0RPLElBQUEsRUFBRSxHQUFHLElBQUksRUFFTCwwQkFBVSxFQUNWLGdDQUFhLEVBR2IseURBQWEsRUFDYiwyREFBYyxDQUNjO1FBRXBDLE1BQU0sQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFO1lBQ3pCLFNBQVMsRUFBRztnQkFDUixNQUFNLFlBQUMsS0FBVyxJQUFJLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEQsYUFBYSxZQUFDLEtBQVcsSUFBSSxFQUFFLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlELFVBQVUsWUFBQyxLQUFXLElBQUksRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN4RCxVQUFVLFlBQUMsS0FBVyxJQUFJLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEQsUUFBUSxZQUFDLEtBQVcsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BELE1BQU0sWUFBQyxLQUFXLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoRCxLQUFLLFlBQUMsS0FBVyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDOUMsT0FBTyxZQUFDLEtBQVcsSUFBSSxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xELE9BQU8sWUFBQyxLQUFXLElBQUksRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsRCxRQUFRLFlBQUMsS0FBVyxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEQsSUFBSSxZQUFDLEtBQVcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVDLEtBQUssWUFBQyxLQUFXLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM5QyxLQUFLLFlBQUMsS0FBVyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDOUMsUUFBUSxZQUFDLEtBQVcsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BELE1BQU0sWUFBQyxLQUFXLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoRCxJQUFJLFlBQUMsS0FBVyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFD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S0FBSzt1QkFDTCxLQUFLO3FCQUNMLEtBQUs7d0JBQ0wsS0FBSzt5QkFDTCxLQUFLOzRCQUNMLEtBQUs7MkJBQ0wsS0FBSzs0QkFDTCxLQUFLOzJCQUNMLEtBQUs7MkJBQ0wsS0FBSzs2QkFDTCxLQUFLOzBCQUNMLEtBQUs7MkJBQ0wsS0FBSzt3QkFDTCxLQUFLO3dCQUNMLEtBQUs7b0JBQ0wsS0FBSztvQkFDTCxLQUFLOzZCQUdMLEtBQUs7MkJBR0wsTUFBTTtrQ0FDTixNQUFNOytCQUNOLE1BQU07K0JBQ04sTUFBTTs2QkFDTixNQUFNOzJCQUNOLE1BQU07MEJBQ04sTUFBTTs0QkFDTixNQUFNOzRCQUNOLE1BQU07NkJBQ04sTUFBTTt5QkFDTixNQUFNOzBCQUNOLE1BQU07MEJBQ04sTUFBTTs2QkFDTixNQUFNOzJCQUNOLE1BQU07eUJBQ04sTUFBTTs0QkFDTixNQUFNOztJQXdHWCxrQ0FBQztDQUFBLEFBdGFELElBc2FDO1NBbGFZLDJCQUEyQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQW5ndWxhciB3cmFwcGVyIGZvciBCcnludHVtIEZpbHRlckZpZWxkXG4gKi9cblxuaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIE9uRGVzdHJveSwgT25Jbml0LCBPdXRwdXQsIElucHV0LCBTaW1wbGVDaGFuZ2UsIFNpbXBsZUNoYW5nZXMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCBXcmFwcGVySGVscGVyIGZyb20gJy4vd3JhcHBlci5oZWxwZXInO1xuXG4vLyBCcnludHVtICdzY2hlZHVsZXIubGl0ZS51bWQnIGJ1bmRsZSBjb21lcyB3aXRob3V0IHBvbHlmaWxscyB0byBzdXBwb3J0IEFuZ3VsYXIncyB6b25lLmpzXG5pbXBvcnQgeyBCYXNlLCBNYXNrLCBNYXNrQ29uZmlnLCBSZWN0YW5nbGUsIFNjcm9sbGVyLCBTY3JvbGxlckNvbmZpZywgU3RvcmUsIFdpZGdldCB9IGZyb20gJ0BicnludHVtL3NjaGVkdWxlci9zY2hlZHVsZXIubGl0ZS51bWQuanMnO1xuaW1wb3J0IHsgRmlsdGVyRmllbGQsIFN0cmluZ0hlbHBlciwgV2lkZ2V0SGVscGVyIH0gZnJvbSAnQGJyeW50dW0vc2NoZWR1bGVyL3NjaGVkdWxlci5saXRlLnVtZC5qcyc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yIDogJ2JyeW50dW0tZmlsdGVyLWZpZWxkJyxcbiAgICB0ZW1wbGF0ZSA6ICcnXG59KVxuZXhwb3J0IGNsYXNzIEJyeW50dW1GaWx0ZXJGaWVsZENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcblxuICAgIHB1YmxpYyBzdGF0aWMgaW5zdGFuY2VDbGFzcyA9IEZpbHRlckZpZWxkO1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bUZlYXR1cmVOYW1lczogc3RyaW5nW10gPSBbXG5cbiAgICBdO1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bUNvbmZpZ3M6IHN0cmluZ1tdID0gQnJ5bnR1bUZpbHRlckZpZWxkQ29tcG9uZW50LmJyeW50dW1GZWF0dXJlTmFtZXMuY29uY2F0KFtcbiAgICAgICAgJ2Fkb3B0JyxcbiAgICAgICAgJ2FsaWduJyxcbiAgICAgICAgJ2FsaWduU2VsZicsXG4gICAgICAgICdhbmNob3InLFxuICAgICAgICAnYXBwZW5kVG8nLFxuICAgICAgICAnYXV0b0NvbXBsZXRlJyxcbiAgICAgICAgJ2F1dG9TZWxlY3QnLFxuICAgICAgICAnYmFkZ2UnLFxuICAgICAgICAnYnViYmxlRXZlbnRzJyxcbiAgICAgICAgJ2NlbnRlcmVkJyxcbiAgICAgICAgJ2NsZWFyYWJsZScsXG4gICAgICAgICdjbHMnLFxuICAgICAgICAnY29uZmlnJyxcbiAgICAgICAgJ2NvbnN0cmFpblRvJyxcbiAgICAgICAgJ2NvbnRlbnQnLFxuICAgICAgICAnY29udGVudEVsZW1lbnRDbHMnLFxuICAgICAgICAnZGF0YXNldCcsXG4gICAgICAgICdkZWZhdWx0QmluZFByb3BlcnR5JyxcbiAgICAgICAgJ2Rpc2FibGVkJyxcbiAgICAgICAgJ2RvY2snLFxuICAgICAgICAnZHJhZ2dhYmxlJyxcbiAgICAgICAgJ2VkaXRhYmxlJyxcbiAgICAgICAgJ2V4dHJhRGF0YScsXG4gICAgICAgICdmaWVsZCcsXG4gICAgICAgICdmaWx0ZXJGdW5jdGlvbicsXG4gICAgICAgICdmbGV4JyxcbiAgICAgICAgJ2Zsb2F0aW5nJyxcbiAgICAgICAgJ2hlaWdodCcsXG4gICAgICAgICdoaWRkZW4nLFxuICAgICAgICAnaGlkZUFuaW1hdGlvbicsXG4gICAgICAgICdoaWdobGlnaHRFeHRlcm5hbENoYW5nZScsXG4gICAgICAgICdoaW50JyxcbiAgICAgICAgJ2hpbnRIdG1sJyxcbiAgICAgICAgJ2h0bWwnLFxuICAgICAgICAnaHRtbENscycsXG4gICAgICAgICdpZCcsXG4gICAgICAgICdpbnB1dEFsaWduJyxcbiAgICAgICAgJ2lucHV0QXR0cmlidXRlcycsXG4gICAgICAgICdpbnB1dFdpZHRoJyxcbiAgICAgICAgJ2luc2VydEJlZm9yZScsXG4gICAgICAgICdpbnNlcnRGaXJzdCcsXG4gICAgICAgICdrZXlTdHJva2VDaGFuZ2VEZWxheScsXG4gICAgICAgICdsYWJlbCcsXG4gICAgICAgICdsYWJlbENscycsXG4gICAgICAgICdsYWJlbFBvc2l0aW9uJyxcbiAgICAgICAgJ2xhYmVscycsXG4gICAgICAgICdsYWJlbFdpZHRoJyxcbiAgICAgICAgJ2xpc3RlbmVycycsXG4gICAgICAgICdsb2NhbGVDbGFzcycsXG4gICAgICAgICdsb2NhbGl6YWJsZVByb3BlcnRpZXMnLFxuICAgICAgICAnbWFyZ2luJyxcbiAgICAgICAgJ21hc2tEZWZhdWx0cycsXG4gICAgICAgICdtYXNrZWQnLFxuICAgICAgICAnbWF4SGVpZ2h0JyxcbiAgICAgICAgJ21heExlbmd0aCcsXG4gICAgICAgICdtYXhXaWR0aCcsXG4gICAgICAgICdtaW5IZWlnaHQnLFxuICAgICAgICAnbWluTGVuZ3RoJyxcbiAgICAgICAgJ21pbldpZHRoJyxcbiAgICAgICAgJ21vbml0b3JSZXNpemUnLFxuICAgICAgICAnbmFtZScsXG4gICAgICAgICdvd25lcicsXG4gICAgICAgICdwbGFjZWhvbGRlcicsXG4gICAgICAgICdwb3NpdGlvbmVkJyxcbiAgICAgICAgJ3ByZXZlbnRUb29sdGlwT25Ub3VjaCcsXG4gICAgICAgICdyZWFkT25seScsXG4gICAgICAgICdyZXF1aXJlZCcsXG4gICAgICAgICdyZXZlcnRPbkVzY2FwZScsXG4gICAgICAgICdyaXBwbGUnLFxuICAgICAgICAncm9vdEVsZW1lbnQnLFxuICAgICAgICAnc2Nyb2xsYWJsZScsXG4gICAgICAgICdzY3JvbGxBY3Rpb24nLFxuICAgICAgICAnc2hvd0FuaW1hdGlvbicsXG4gICAgICAgICdzdG9yZScsXG4gICAgICAgICd0YWInLFxuICAgICAgICAndGFiSW5kZXgnLFxuICAgICAgICAndGFnJyxcbiAgICAgICAgJ3RleHRBbGlnbicsXG4gICAgICAgICd0aXRsZScsXG4gICAgICAgICd0b29sdGlwJyxcbiAgICAgICAgJ3RyaWdnZXJzJyxcbiAgICAgICAgJ3ZhbHVlJyxcbiAgICAgICAgJ3dlaWdodCcsXG4gICAgICAgICd3aWR0aCcsXG4gICAgICAgICd4JyxcbiAgICAgICAgJ3knXG4gICAgXSk7XG5cbiAgICBwcml2YXRlIHN0YXRpYyBicnludHVtQ29uZmlnc09ubHk6IHN0cmluZ1tdID0gW1xuICAgICAgICAnYWRvcHQnLFxuICAgICAgICAnYWxpZ24nLFxuICAgICAgICAnYW5jaG9yJyxcbiAgICAgICAgJ2FwcGVuZFRvJyxcbiAgICAgICAgJ2F1dG9Db21wbGV0ZScsXG4gICAgICAgICdhdXRvU2VsZWN0JyxcbiAgICAgICAgJ2J1YmJsZUV2ZW50cycsXG4gICAgICAgICdjZW50ZXJlZCcsXG4gICAgICAgICdjbGVhcmFibGUnLFxuICAgICAgICAnY2xzJyxcbiAgICAgICAgJ2NvbmZpZycsXG4gICAgICAgICdjb25zdHJhaW5UbycsXG4gICAgICAgICdjb250ZW50RWxlbWVudENscycsXG4gICAgICAgICdkZWZhdWx0QmluZFByb3BlcnR5JyxcbiAgICAgICAgJ2RvY2snLFxuICAgICAgICAnZHJhZ2dhYmxlJyxcbiAgICAgICAgJ2VkaXRhYmxlJyxcbiAgICAgICAgJ2ZpZWxkJyxcbiAgICAgICAgJ2ZpbHRlckZ1bmN0aW9uJyxcbiAgICAgICAgJ2Zsb2F0aW5nJyxcbiAgICAgICAgJ2hpZGVBbmltYXRpb24nLFxuICAgICAgICAnaGlnaGxpZ2h0RXh0ZXJuYWxDaGFuZ2UnLFxuICAgICAgICAnaGludCcsXG4gICAgICAgICdoaW50SHRtbCcsXG4gICAgICAgICdodG1sQ2xzJyxcbiAgICAgICAgJ2lucHV0QWxpZ24nLFxuICAgICAgICAnaW5wdXRBdHRyaWJ1dGVzJyxcbiAgICAgICAgJ2lucHV0V2lkdGgnLFxuICAgICAgICAnaW5zZXJ0QmVmb3JlJyxcbiAgICAgICAgJ2luc2VydEZpcnN0JyxcbiAgICAgICAgJ2tleVN0cm9rZUNoYW5nZURlbGF5JyxcbiAgICAgICAgJ2xhYmVsQ2xzJyxcbiAgICAgICAgJ2xhYmVsUG9zaXRpb24nLFxuICAgICAgICAnbGFiZWxzJyxcbiAgICAgICAgJ2xhYmVsV2lkdGgnLFxuICAgICAgICAnbGlzdGVuZXJzJyxcbiAgICAgICAgJ2xvY2FsZUNsYXNzJyxcbiAgICAgICAgJ2xvY2FsaXphYmxlUHJvcGVydGllcycsXG4gICAgICAgICdtYXNrRGVmYXVsdHMnLFxuICAgICAgICAnbWFza2VkJyxcbiAgICAgICAgJ21heExlbmd0aCcsXG4gICAgICAgICdtaW5MZW5ndGgnLFxuICAgICAgICAnbW9uaXRvclJlc2l6ZScsXG4gICAgICAgICduYW1lJyxcbiAgICAgICAgJ293bmVyJyxcbiAgICAgICAgJ3BsYWNlaG9sZGVyJyxcbiAgICAgICAgJ3Bvc2l0aW9uZWQnLFxuICAgICAgICAncHJldmVudFRvb2x0aXBPblRvdWNoJyxcbiAgICAgICAgJ3JlcXVpcmVkJyxcbiAgICAgICAgJ3JldmVydE9uRXNjYXBlJyxcbiAgICAgICAgJ3JpcHBsZScsXG4gICAgICAgICdyb290RWxlbWVudCcsXG4gICAgICAgICdzY3JvbGxBY3Rpb24nLFxuICAgICAgICAnc2hvd0FuaW1hdGlvbicsXG4gICAgICAgICdzdG9yZScsXG4gICAgICAgICd0YWInLFxuICAgICAgICAndGFiSW5kZXgnLFxuICAgICAgICAndGFnJyxcbiAgICAgICAgJ3RleHRBbGlnbicsXG4gICAgICAgICd0aXRsZScsXG4gICAgICAgICd3ZWlnaHQnXG4gICAgXTtcblxuICAgIHByaXZhdGUgc3RhdGljIGJyeW50dW1Qcm9wczogc3RyaW5nW10gPSBCcnludHVtRmlsdGVyRmllbGRDb21wb25lbnQuYnJ5bnR1bUZlYXR1cmVOYW1lcy5jb25jYXQoW1xuICAgICAgICAnYWxpZ25TZWxmJyxcbiAgICAgICAgJ2FuY2hvclNpemUnLFxuICAgICAgICAnYmFkZ2UnLFxuICAgICAgICAnY29udGVudCcsXG4gICAgICAgICdkYXRhc2V0JyxcbiAgICAgICAgJ2Rpc2FibGVkJyxcbiAgICAgICAgJ2V4dHJhRGF0YScsXG4gICAgICAgICdmbGV4JyxcbiAgICAgICAgJ2hlaWdodCcsXG4gICAgICAgICdoaWRkZW4nLFxuICAgICAgICAnaHRtbCcsXG4gICAgICAgICdpZCcsXG4gICAgICAgICdsYWJlbCcsXG4gICAgICAgICdtYXJnaW4nLFxuICAgICAgICAnbWF4SGVpZ2h0JyxcbiAgICAgICAgJ21heFdpZHRoJyxcbiAgICAgICAgJ21pbkhlaWdodCcsXG4gICAgICAgICdtaW5XaWR0aCcsXG4gICAgICAgICdyZWFkT25seScsXG4gICAgICAgICdzY3JvbGxhYmxlJyxcbiAgICAgICAgJ3Rvb2x0aXAnLFxuICAgICAgICAndHJpZ2dlcnMnLFxuICAgICAgICAndmFsdWUnLFxuICAgICAgICAnd2lkdGgnLFxuICAgICAgICAneCcsXG4gICAgICAgICd5J1xuICAgIF0pO1xuXG4gICAgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmO1xuICAgIHB1YmxpYyBpbnN0YW5jZTogRmlsdGVyRmllbGQ7XG5cbiAgICBwcml2YXRlIGJyeW50dW1Db25maWcgPSB7XG4gICAgICAgIGFuZ3VsYXJDb21wb25lbnQgOiB0aGlzLFxuICAgICAgICBhZG9wdCAgICAgICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgICBsaXN0ZW5lcnMgICAgICAgIDoge30sXG4gICAgICAgIGZlYXR1cmVzICAgICAgICAgOiB7fVxuICAgIH07XG5cbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50OiBFbGVtZW50UmVmKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudFJlZiA9IGVsZW1lbnQ7XG4gICAgfVxuXG4gICAgIC8vIENvbmZpZ3Mgb25seVxuICAgIEBJbnB1dCgpIGFkb3B0ICAgICAgICAgICAgICAgICAgIDogSFRNTEVsZW1lbnR8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGFsaWduICAgICAgICAgICAgICAgICAgIDogb2JqZWN0fHN0cmluZztcbiAgICBASW5wdXQoKSBhbmNob3IgICAgICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgYXBwZW5kVG8gICAgICAgICAgICAgICAgOiBIVE1MRWxlbWVudHxzdHJpbmc7XG4gICAgQElucHV0KCkgYXV0b0NvbXBsZXRlICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgYXV0b1NlbGVjdCAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGJ1YmJsZUV2ZW50cyAgICAgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIGNlbnRlcmVkICAgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBjbGVhcmFibGUgICAgICAgICAgICAgICA6IGJvb2xlYW58b2JqZWN0O1xuICAgIEBJbnB1dCgpIGNscyAgICAgICAgICAgICAgICAgICAgIDogc3RyaW5nfG9iamVjdDtcbiAgICBASW5wdXQoKSBjb25maWcgICAgICAgICAgICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBjb25zdHJhaW5UbyAgICAgICAgICAgICA6IEhUTUxFbGVtZW50fFdpZGdldHxSZWN0YW5nbGU7XG4gICAgQElucHV0KCkgY29udGVudEVsZW1lbnRDbHMgICAgICAgOiBzdHJpbmd8b2JqZWN0O1xuICAgIEBJbnB1dCgpIGRlZmF1bHRCaW5kUHJvcGVydHkgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGRvY2sgICAgICAgICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGRyYWdnYWJsZSAgICAgICAgICAgICAgIDogYm9vbGVhbnxvYmplY3Q7XG4gICAgQElucHV0KCkgZWRpdGFibGUgICAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGZpZWxkICAgICAgICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGZpbHRlckZ1bmN0aW9uICAgICAgICAgIDogRnVuY3Rpb247XG4gICAgQElucHV0KCkgZmxvYXRpbmcgICAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGhpZGVBbmltYXRpb24gICAgICAgICAgIDogYm9vbGVhbnxvYmplY3Q7XG4gICAgQElucHV0KCkgaGlnaGxpZ2h0RXh0ZXJuYWxDaGFuZ2UgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGhpbnQgICAgICAgICAgICAgICAgICAgIDogc3RyaW5nfEZ1bmN0aW9uO1xuICAgIEBJbnB1dCgpIGhpbnRIdG1sICAgICAgICAgICAgICAgIDogc3RyaW5nfEZ1bmN0aW9uO1xuICAgIEBJbnB1dCgpIGh0bWxDbHMgICAgICAgICAgICAgICAgIDogc3RyaW5nfG9iamVjdDtcbiAgICBASW5wdXQoKSBpbnB1dEFsaWduICAgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBpbnB1dEF0dHJpYnV0ZXMgICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBpbnB1dFdpZHRoICAgICAgICAgICAgICA6IHN0cmluZ3xudW1iZXI7XG4gICAgQElucHV0KCkgaW5zZXJ0QmVmb3JlICAgICAgICAgICAgOiBIVE1MRWxlbWVudHxzdHJpbmc7XG4gICAgQElucHV0KCkgaW5zZXJ0Rmlyc3QgICAgICAgICAgICAgOiBIVE1MRWxlbWVudHxzdHJpbmc7XG4gICAgQElucHV0KCkga2V5U3Ryb2tlQ2hhbmdlRGVsYXkgICAgOiBudW1iZXI7XG4gICAgQElucHV0KCkgbGFiZWxDbHMgICAgICAgICAgICAgICAgOiBzdHJpbmd8b2JqZWN0O1xuICAgIEBJbnB1dCgpIGxhYmVsUG9zaXRpb24gICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGxhYmVscyAgICAgICAgICAgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIGxhYmVsV2lkdGggICAgICAgICAgICAgIDogc3RyaW5nfG51bWJlcjtcbiAgICBASW5wdXQoKSBsaXN0ZW5lcnMgICAgICAgICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBsb2NhbGVDbGFzcyAgICAgICAgICAgICA6IEJhc2U7XG4gICAgQElucHV0KCkgbG9jYWxpemFibGVQcm9wZXJ0aWVzICAgOiBzdHJpbmdbXTtcbiAgICBASW5wdXQoKSBtYXNrRGVmYXVsdHMgICAgICAgICAgICA6IG9iamVjdHxNYXNrfFBhcnRpYWw8TWFza0NvbmZpZz47XG4gICAgQElucHV0KCkgbWFza2VkICAgICAgICAgICAgICAgICAgOiBib29sZWFufHN0cmluZ3xvYmplY3R8TWFza3xQYXJ0aWFsPE1hc2tDb25maWc+O1xuICAgIEBJbnB1dCgpIG1heExlbmd0aCAgICAgICAgICAgICAgIDogbnVtYmVyO1xuICAgIEBJbnB1dCgpIG1pbkxlbmd0aCAgICAgICAgICAgICAgIDogbnVtYmVyO1xuICAgIEBJbnB1dCgpIG1vbml0b3JSZXNpemUgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBuYW1lICAgICAgICAgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBvd25lciAgICAgICAgICAgICAgICAgICA6IFdpZGdldDtcbiAgICBASW5wdXQoKSBwbGFjZWhvbGRlciAgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBwb3NpdGlvbmVkICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgcHJldmVudFRvb2x0aXBPblRvdWNoICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHJlcXVpcmVkICAgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSByZXZlcnRPbkVzY2FwZSAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgcmlwcGxlICAgICAgICAgICAgICAgICAgOiBib29sZWFufG9iamVjdDtcbiAgICBASW5wdXQoKSByb290RWxlbWVudCAgICAgICAgICAgICA6IFNoYWRvd1Jvb3Q7XG4gICAgQElucHV0KCkgc2Nyb2xsQWN0aW9uICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgc2hvd0FuaW1hdGlvbiAgICAgICAgICAgOiBib29sZWFufG9iamVjdDtcbiAgICBASW5wdXQoKSBzdG9yZSAgICAgICAgICAgICAgICAgICA6IFN0b3JlO1xuICAgIEBJbnB1dCgpIHRhYiAgICAgICAgICAgICAgICAgICAgIDogYm9vbGVhbnxvYmplY3Q7XG4gICAgQElucHV0KCkgdGFiSW5kZXggICAgICAgICAgICAgICAgOiBudW1iZXI7XG4gICAgQElucHV0KCkgdGFnICAgICAgICAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgdGV4dEFsaWduICAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgdGl0bGUgICAgICAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgd2VpZ2h0ICAgICAgICAgICAgICAgICAgOiBudW1iZXI7XG5cbiAgICAgLy8gQ29uZmlncyBhbmQgcHJvcGVydGllc1xuICAgIEBJbnB1dCgpIGFsaWduU2VsZiAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgYmFkZ2UgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBjb250ZW50ICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGRhdGFzZXQgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgZGlzYWJsZWQgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgZXh0cmFEYXRhICA6IGJvb2xlYW58bnVtYmVyfG9iamVjdHxzdHJpbmc7XG4gICAgQElucHV0KCkgZmxleCAgICAgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgaGVpZ2h0ICAgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgaGlkZGVuICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgaHRtbCAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBpZCAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGxhYmVsICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgbWFyZ2luICAgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgbWF4SGVpZ2h0ICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgbWF4V2lkdGggICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgbWluSGVpZ2h0ICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgbWluV2lkdGggICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgcmVhZE9ubHkgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgc2Nyb2xsYWJsZSA6IGJvb2xlYW58U2Nyb2xsZXJ8b2JqZWN0fFBhcnRpYWw8U2Nyb2xsZXJDb25maWc+O1xuICAgIEBJbnB1dCgpIHRvb2x0aXAgICAgOiBvYmplY3R8c3RyaW5nO1xuICAgIEBJbnB1dCgpIHRyaWdnZXJzICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgdmFsdWUgICAgICA6IHN0cmluZ3xhbnk7XG4gICAgQElucHV0KCkgd2lkdGggICAgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgeCAgICAgICAgICA6IG51bWJlcjtcbiAgICBASW5wdXQoKSB5ICAgICAgICAgIDogbnVtYmVyO1xuXG4gICAgIC8vIFByb3BlcnRpZXMgb25seVxuICAgIEBJbnB1dCgpIGFuY2hvclNpemUgOiBudW1iZXJbXTtcblxuICAgICAvLyBFdmVudHNcbiAgICBAT3V0cHV0KCkgb25BY3Rpb24gICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uQmVmb3JlRGVzdHJveSA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkJlZm9yZUhpZGUgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25CZWZvcmVTaG93ICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uQ2F0Y2hBbGwgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkNoYW5nZSAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25DbGVhciAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uRGVzdHJveSAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkZvY3VzSW4gICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25Gb2N1c091dCAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uSGlkZSAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbklucHV0ICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25QYWludCAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uUmVhZE9ubHkgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvblJlc2l6ZSAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25TaG93ICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uVHJpZ2dlciAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGFuZCBhcHBlbmQgdGhlIHVuZGVybHlpbmcgd2lkZ2V0XG4gICAgICovXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0XG4gICAgICAgICAgICBtZSA9IHRoaXMsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZWxlbWVudFJlZixcbiAgICAgICAgICAgICAgICBicnludHVtQ29uZmlnXG4gICAgICAgICAgICB9ID0gbWUsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaW5zdGFuY2VDbGFzcyxcbiAgICAgICAgICAgICAgICBicnludHVtQ29uZmlnc1xuICAgICAgICAgICAgfSA9IEJyeW50dW1GaWx0ZXJGaWVsZENvbXBvbmVudDtcblxuICAgICAgICBPYmplY3QuYXNzaWduKGJyeW50dW1Db25maWcsIHtcbiAgICAgICAgICAgIGxpc3RlbmVycyA6IHtcbiAgICAgICAgICAgICAgICBhY3Rpb24oZXZlbnQgOiBhbnkpIHsgbWUub25BY3Rpb24uZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgYmVmb3JlRGVzdHJveShldmVudCA6IGFueSkgeyBtZS5vbkJlZm9yZURlc3Ryb3kuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgYmVmb3JlSGlkZShldmVudCA6IGFueSkgeyBtZS5vbkJlZm9yZUhpZGUuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgYmVmb3JlU2hvdyhldmVudCA6IGFueSkgeyBtZS5vbkJlZm9yZVNob3cuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgY2F0Y2hBbGwoZXZlbnQgOiBhbnkpIHsgbWUub25DYXRjaEFsbC5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBjaGFuZ2UoZXZlbnQgOiBhbnkpIHsgbWUub25DaGFuZ2UuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgY2xlYXIoZXZlbnQgOiBhbnkpIHsgbWUub25DbGVhci5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBkZXN0cm95KGV2ZW50IDogYW55KSB7IG1lLm9uRGVzdHJveS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBmb2N1c0luKGV2ZW50IDogYW55KSB7IG1lLm9uRm9jdXNJbi5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBmb2N1c091dChldmVudCA6IGFueSkgeyBtZS5vbkZvY3VzT3V0LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGhpZGUoZXZlbnQgOiBhbnkpIHsgbWUub25IaWRlLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGlucHV0KGV2ZW50IDogYW55KSB7IG1lLm9uSW5wdXQuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgcGFpbnQoZXZlbnQgOiBhbnkpIHsgbWUub25QYWludC5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICByZWFkT25seShldmVudCA6IGFueSkgeyBtZS5vblJlYWRPbmx5LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIHJlc2l6ZShldmVudCA6IGFueSkgeyBtZS5vblJlc2l6ZS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBzaG93KGV2ZW50IDogYW55KSB7IG1lLm9uU2hvdy5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICB0cmlnZ2VyKGV2ZW50IDogYW55KSB7IG1lLm9uVHJpZ2dlci5lbWl0KGV2ZW50KTsgfSxcblxuICAgICAgICAgICAgICAgIHRoaXNPYmogOiBtZVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBJZiBjb21wb25lbnQgaGFzIG5vIGNvbnRhaW5lciBzcGVjaWZpZWQgaW4gY29uZmlnIHRoZW4gdXNlIGFkb3B0IHRvIFdyYXBwZXIncyBlbGVtZW50XG4gICAgICAgIGNvbnN0XG4gICAgICAgICAgICBjb250YWluZXJQYXJhbSA9IFtcbiAgICAgICAgICAgICAgICAnYWRvcHQnLFxuICAgICAgICAgICAgICAgICdhcHBlbmRUbycsXG4gICAgICAgICAgICAgICAgJ2luc2VydEFmdGVyJyxcbiAgICAgICAgICAgICAgICAnaW5zZXJ0QmVmb3JlJ1xuICAgICAgICAgICAgXS5maW5kKHByb3AgPT4gYnJ5bnR1bUNvbmZpZ1twcm9wXSk7XG4gICAgICAgIGlmICghY29udGFpbmVyUGFyYW0pIHtcbiAgICAgICAgICAgIGJyeW50dW1Db25maWcuYWRvcHQgPSBlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBXcmFwcGVySGVscGVyLmRldldhcm5pbmdDb250YWluZXIoaW5zdGFuY2VDbGFzcy4kbmFtZSwgY29udGFpbmVyUGFyYW0pO1xuICAgICAgICB9XG5cbiAgICAgICAgYnJ5bnR1bUNvbmZpZ3MuZmlsdGVyKHByb3AgPT4gcHJvcCBpbiB0aGlzKS5mb3JFYWNoKHByb3AgPT4ge1xuICAgICAgICAgICAgV3JhcHBlckhlbHBlci5hcHBseVByb3BWYWx1ZShicnludHVtQ29uZmlnLCBwcm9wLCB0aGlzW3Byb3BdKTtcbiAgICAgICAgICAgIGlmIChbJ2ZlYXR1cmVzJywgJ2NvbmZpZyddLmluY2x1ZGVzKHByb3ApKSB7XG4gICAgICAgICAgICAgICAgV3JhcHBlckhlbHBlci5kZXZXYXJuaW5nQ29uZmlnUHJvcChpbnN0YW5jZUNsYXNzLiRuYW1lLCBwcm9wKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBtZS5pbnN0YW5jZSA9IGluc3RhbmNlQ2xhc3MuJG5hbWUgPT09ICdXaWRnZXQnID8gV2lkZ2V0SGVscGVyLmNyZWF0ZVdpZGdldChicnludHVtQ29uZmlnKSA6IG5ldyBpbnN0YW5jZUNsYXNzKGJyeW50dW1Db25maWcpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogV2F0Y2ggZm9yIGNoYW5nZXNcbiAgICAgKiBAcGFyYW0gY2hhbmdlc1xuICAgICAqL1xuICAgIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICAgICAgY29uc3RcbiAgICAgICAgICAgIHsgaW5zdGFuY2UgfSA9IHRoaXMsXG4gICAgICAgICAgICB7IGluc3RhbmNlQ2xhc3MgfSA9IEJyeW50dW1GaWx0ZXJGaWVsZENvbXBvbmVudDtcblxuICAgICAgICBpZiAoIWluc3RhbmNlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJdGVyYXRlIG92ZXIgYWxsIGNoYW5nZXNcbiAgICAgICAgT2JqZWN0LmVudHJpZXMoY2hhbmdlcykuZm9yRWFjaCgoW3Byb3AsIGNoYW5nZV0pID0+IHtcbiAgICAgICAgICAgIGNvbnN0XG4gICAgICAgICAgICAgICAgbmV3VmFsdWUgPSAoY2hhbmdlIGFzIFNpbXBsZUNoYW5nZSkuY3VycmVudFZhbHVlLFxuICAgICAgICAgICAgICAgIHsgaW5zdGFuY2UgfSA9IHRoaXMsXG4gICAgICAgICAgICAgICAgeyBicnludHVtQ29uZmlnc09ubHksIGJyeW50dW1Qcm9wcyB9ID0gQnJ5bnR1bUZpbHRlckZpZWxkQ29tcG9uZW50O1xuICAgICAgICAgICAgaWYgKGJyeW50dW1Qcm9wcy5pbmNsdWRlcyhwcm9wKSkge1xuICAgICAgICAgICAgICAgIFdyYXBwZXJIZWxwZXIuYXBwbHlQcm9wVmFsdWUoaW5zdGFuY2UsIHByb3AsIG5ld1ZhbHVlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgaWYgKGJyeW50dW1Db25maWdzT25seS5pbmNsdWRlcyhwcm9wKSkge1xuICAgICAgICAgICAgICAgICAgICBXcmFwcGVySGVscGVyLmRldldhcm5pbmdVcGRhdGVQcm9wKGluc3RhbmNlQ2xhc3MuJG5hbWUsIHByb3ApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGVzdHJveSB0aGUgY29tcG9uZW50XG4gICAgICovXG4gICAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmluc3RhbmNlKSB7XG4gICAgICAgICAgICB0aGlzLmluc3RhbmNlLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==