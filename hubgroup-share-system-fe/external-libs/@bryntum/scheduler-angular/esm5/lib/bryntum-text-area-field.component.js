/**
 * Angular wrapper for Bryntum TextAreaField
 */
import * as tslib_1 from "tslib";
import { Component, ElementRef, EventEmitter, Output, Input } from '@angular/core';
import WrapperHelper from './wrapper.helper';
// Bryntum 'scheduler.lite.umd' bundle comes without polyfills to support Angular's zone.js
import { Base, Widget } from '@bryntum/scheduler/scheduler.lite.umd.js';
import { TextAreaField, WidgetHelper } from '@bryntum/scheduler/scheduler.lite.umd.js';
var BryntumTextAreaFieldComponent = /** @class */ (function () {
    function BryntumTextAreaFieldComponent(element) {
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
    BryntumTextAreaFieldComponent.prototype.ngOnInit = function () {
        var _this = this;
        var me = this, elementRef = me.elementRef, bryntumConfig = me.bryntumConfig, instanceClass = BryntumTextAreaFieldComponent.instanceClass, bryntumConfigs = BryntumTextAreaFieldComponent.bryntumConfigs;
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
    BryntumTextAreaFieldComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        var instance = this.instance, instanceClass = BryntumTextAreaFieldComponent.instanceClass;
        if (!instance) {
            return;
        }
        // Iterate over all changes
        Object.entries(changes).forEach(function (_a) {
            var _b = tslib_1.__read(_a, 2), prop = _b[0], change = _b[1];
            var newValue = change.currentValue, instance = _this.instance, bryntumConfigsOnly = BryntumTextAreaFieldComponent.bryntumConfigsOnly, bryntumProps = BryntumTextAreaFieldComponent.bryntumProps;
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
    BryntumTextAreaFieldComponent.prototype.ngOnDestroy = function () {
        if (this.instance) {
            this.instance.destroy();
        }
    };
    BryntumTextAreaFieldComponent.instanceClass = TextAreaField;
    BryntumTextAreaFieldComponent.bryntumFeatureNames = [];
    BryntumTextAreaFieldComponent.bryntumConfigs = BryntumTextAreaFieldComponent.bryntumFeatureNames.concat([
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
        'inline',
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
        'maxWidth',
        'minHeight',
        'minWidth',
        'monitorResize',
        'name',
        'owner',
        'placeholder',
        'positioned',
        'preventTooltipOnTouch',
        'readOnly',
        'required',
        'resize',
        'revertOnEscape',
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
        'triggers',
        'value',
        'weight',
        'width',
        'x',
        'y'
    ]);
    BryntumTextAreaFieldComponent.bryntumConfigsOnly = [
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
        'floating',
        'hideAnimation',
        'highlightExternalChange',
        'hint',
        'hintHtml',
        'htmlCls',
        'inline',
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
        'monitorResize',
        'name',
        'owner',
        'placeholder',
        'positioned',
        'preventTooltipOnTouch',
        'required',
        'resize',
        'revertOnEscape',
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
    BryntumTextAreaFieldComponent.bryntumProps = BryntumTextAreaFieldComponent.bryntumFeatureNames.concat([
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
    BryntumTextAreaFieldComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bryntum-text-area-field',
                    template: ''
                }] }
    ];
    /** @nocollapse */
    BryntumTextAreaFieldComponent.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    BryntumTextAreaFieldComponent.propDecorators = {
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
        floating: [{ type: Input }],
        hideAnimation: [{ type: Input }],
        highlightExternalChange: [{ type: Input }],
        hint: [{ type: Input }],
        hintHtml: [{ type: Input }],
        htmlCls: [{ type: Input }],
        inline: [{ type: Input }],
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
        monitorResize: [{ type: Input }],
        name: [{ type: Input }],
        owner: [{ type: Input }],
        placeholder: [{ type: Input }],
        positioned: [{ type: Input }],
        preventTooltipOnTouch: [{ type: Input }],
        required: [{ type: Input }],
        resize: [{ type: Input }],
        revertOnEscape: [{ type: Input }],
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
    return BryntumTextAreaFieldComponent;
}());
export { BryntumTextAreaFieldComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJ5bnR1bS10ZXh0LWFyZWEtZmllbGQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGJyeW50dW0vc2NoZWR1bGVyLWFuZ3VsYXIvIiwic291cmNlcyI6WyJsaWIvYnJ5bnR1bS10ZXh0LWFyZWEtZmllbGQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztHQUVHOztBQUVILE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBcUIsTUFBTSxFQUFFLEtBQUssRUFBK0IsTUFBTSxlQUFlLENBQUM7QUFDbkksT0FBTyxhQUFhLE1BQU0sa0JBQWtCLENBQUM7QUFFN0MsMkZBQTJGO0FBQzNGLE9BQU8sRUFBRSxJQUFJLEVBQXlELE1BQU0sRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBQy9ILE9BQU8sRUFBRSxhQUFhLEVBQWdCLFlBQVksRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBRXJHO0lBb01JLHVDQUFZLE9BQW1CO1FBUHZCLGtCQUFhLEdBQUc7WUFDcEIsZ0JBQWdCLEVBQUcsSUFBSTtZQUN2QixLQUFLLEVBQWMsU0FBUztZQUM1QixTQUFTLEVBQVUsRUFBRTtZQUNyQixRQUFRLEVBQVcsRUFBRTtTQUN4QixDQUFDO1FBK0ZELFNBQVM7UUFDQSxhQUFRLEdBQVUsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUM3QyxvQkFBZSxHQUFHLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsaUJBQVksR0FBTSxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQzdDLGlCQUFZLEdBQU0sSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUM3QyxlQUFVLEdBQVEsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUM3QyxhQUFRLEdBQVUsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUM3QyxZQUFPLEdBQVcsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUM3QyxjQUFTLEdBQVMsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUM3QyxjQUFTLEdBQVMsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUM3QyxlQUFVLEdBQVEsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUM3QyxXQUFNLEdBQVksSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUM3QyxZQUFPLEdBQVcsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUM3QyxZQUFPLEdBQVcsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUM3QyxlQUFVLEdBQVEsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUM3QyxhQUFRLEdBQVUsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUM3QyxXQUFNLEdBQVksSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUM3QyxjQUFTLEdBQVMsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQTdHbkQsSUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUM7SUFDOUIsQ0FBQztJQThHRDs7T0FFRztJQUNILGdEQUFRLEdBQVI7UUFBQSxpQkE2REM7UUEzRE8sSUFBQSxFQUFFLEdBQUcsSUFBSSxFQUVMLDBCQUFVLEVBQ1YsZ0NBQWEsRUFHYiwyREFBYSxFQUNiLDZEQUFjLENBQ2dCO1FBRXRDLE1BQU0sQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFO1lBQ3pCLFNBQVMsRUFBRztnQkFDUixNQUFNLFlBQUMsS0FBVyxJQUFJLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEQsYUFBYSxZQUFDLEtBQVcsSUFBSSxFQUFFLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlELFVBQVUsWUFBQyxLQUFXLElBQUksRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN4RCxVQUFVLFlBQUMsS0FBVyxJQUFJLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEQsUUFBUSxZQUFDLEtBQVcsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BELE1BQU0sWUFBQyxLQUFXLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoRCxLQUFLLFlBQUMsS0FBVyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDOUMsT0FBTyxZQUFDLEtBQVcsSUFBSSxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xELE9BQU8sWUFBQyxLQUFXLElBQUksRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsRCxRQUFRLFlBQUMsS0FBVyxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEQsSUFBSSxZQUFDLEtBQVcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVDLEtBQUssWUFBQyxLQUFXLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM5QyxLQUFLLFlBQUMsS0FBVyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDOUMsUUFBUSxZQUFDLEtBQVcsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BELE1BQU0sWUFBQyxLQUFXLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoRCxJQUFJLFlBQUMsS0FBVyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtB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QUFLO3dCQUNMLEtBQUs7d0JBQ0wsS0FBSztvQkFDTCxLQUFLO29CQUNMLEtBQUs7NkJBR0wsS0FBSzsyQkFHTCxNQUFNO2tDQUNOLE1BQU07K0JBQ04sTUFBTTsrQkFDTixNQUFNOzZCQUNOLE1BQU07MkJBQ04sTUFBTTswQkFDTixNQUFNOzRCQUNOLE1BQU07NEJBQ04sTUFBTTs2QkFDTixNQUFNO3lCQUNOLE1BQU07MEJBQ04sTUFBTTswQkFDTixNQUFNOzZCQUNOLE1BQU07MkJBQ04sTUFBTTt5QkFDTixNQUFNOzRCQUNOLE1BQU07O0lBd0dYLG9DQUFDO0NBQUEsQUExWkQsSUEwWkM7U0F0WlksNkJBQTZCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBBbmd1bGFyIHdyYXBwZXIgZm9yIEJyeW50dW0gVGV4dEFyZWFGaWVsZFxuICovXG5cbmltcG9ydCB7IENvbXBvbmVudCwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBPbkRlc3Ryb3ksIE9uSW5pdCwgT3V0cHV0LCBJbnB1dCwgU2ltcGxlQ2hhbmdlLCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgV3JhcHBlckhlbHBlciBmcm9tICcuL3dyYXBwZXIuaGVscGVyJztcblxuLy8gQnJ5bnR1bSAnc2NoZWR1bGVyLmxpdGUudW1kJyBidW5kbGUgY29tZXMgd2l0aG91dCBwb2x5ZmlsbHMgdG8gc3VwcG9ydCBBbmd1bGFyJ3Mgem9uZS5qc1xuaW1wb3J0IHsgQmFzZSwgTWFzaywgTWFza0NvbmZpZywgUmVjdGFuZ2xlLCBTY3JvbGxlciwgU2Nyb2xsZXJDb25maWcsIFdpZGdldCB9IGZyb20gJ0BicnludHVtL3NjaGVkdWxlci9zY2hlZHVsZXIubGl0ZS51bWQuanMnO1xuaW1wb3J0IHsgVGV4dEFyZWFGaWVsZCwgU3RyaW5nSGVscGVyLCBXaWRnZXRIZWxwZXIgfSBmcm9tICdAYnJ5bnR1bS9zY2hlZHVsZXIvc2NoZWR1bGVyLmxpdGUudW1kLmpzJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3IgOiAnYnJ5bnR1bS10ZXh0LWFyZWEtZmllbGQnLFxuICAgIHRlbXBsYXRlIDogJydcbn0pXG5leHBvcnQgY2xhc3MgQnJ5bnR1bVRleHRBcmVhRmllbGRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG5cbiAgICBwdWJsaWMgc3RhdGljIGluc3RhbmNlQ2xhc3MgPSBUZXh0QXJlYUZpZWxkO1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bUZlYXR1cmVOYW1lczogc3RyaW5nW10gPSBbXG5cbiAgICBdO1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bUNvbmZpZ3M6IHN0cmluZ1tdID0gQnJ5bnR1bVRleHRBcmVhRmllbGRDb21wb25lbnQuYnJ5bnR1bUZlYXR1cmVOYW1lcy5jb25jYXQoW1xuICAgICAgICAnYWRvcHQnLFxuICAgICAgICAnYWxpZ24nLFxuICAgICAgICAnYWxpZ25TZWxmJyxcbiAgICAgICAgJ2FuY2hvcicsXG4gICAgICAgICdhcHBlbmRUbycsXG4gICAgICAgICdhdXRvQ29tcGxldGUnLFxuICAgICAgICAnYXV0b1NlbGVjdCcsXG4gICAgICAgICdiYWRnZScsXG4gICAgICAgICdidWJibGVFdmVudHMnLFxuICAgICAgICAnY2VudGVyZWQnLFxuICAgICAgICAnY2xlYXJhYmxlJyxcbiAgICAgICAgJ2NscycsXG4gICAgICAgICdjb25maWcnLFxuICAgICAgICAnY29uc3RyYWluVG8nLFxuICAgICAgICAnY29udGVudCcsXG4gICAgICAgICdjb250ZW50RWxlbWVudENscycsXG4gICAgICAgICdkYXRhc2V0JyxcbiAgICAgICAgJ2RlZmF1bHRCaW5kUHJvcGVydHknLFxuICAgICAgICAnZGlzYWJsZWQnLFxuICAgICAgICAnZG9jaycsXG4gICAgICAgICdkcmFnZ2FibGUnLFxuICAgICAgICAnZWRpdGFibGUnLFxuICAgICAgICAnZXh0cmFEYXRhJyxcbiAgICAgICAgJ2ZsZXgnLFxuICAgICAgICAnZmxvYXRpbmcnLFxuICAgICAgICAnaGVpZ2h0JyxcbiAgICAgICAgJ2hpZGRlbicsXG4gICAgICAgICdoaWRlQW5pbWF0aW9uJyxcbiAgICAgICAgJ2hpZ2hsaWdodEV4dGVybmFsQ2hhbmdlJyxcbiAgICAgICAgJ2hpbnQnLFxuICAgICAgICAnaGludEh0bWwnLFxuICAgICAgICAnaHRtbCcsXG4gICAgICAgICdodG1sQ2xzJyxcbiAgICAgICAgJ2lkJyxcbiAgICAgICAgJ2lubGluZScsXG4gICAgICAgICdpbnB1dEFsaWduJyxcbiAgICAgICAgJ2lucHV0QXR0cmlidXRlcycsXG4gICAgICAgICdpbnB1dFdpZHRoJyxcbiAgICAgICAgJ2luc2VydEJlZm9yZScsXG4gICAgICAgICdpbnNlcnRGaXJzdCcsXG4gICAgICAgICdrZXlTdHJva2VDaGFuZ2VEZWxheScsXG4gICAgICAgICdsYWJlbCcsXG4gICAgICAgICdsYWJlbENscycsXG4gICAgICAgICdsYWJlbFBvc2l0aW9uJyxcbiAgICAgICAgJ2xhYmVscycsXG4gICAgICAgICdsYWJlbFdpZHRoJyxcbiAgICAgICAgJ2xpc3RlbmVycycsXG4gICAgICAgICdsb2NhbGVDbGFzcycsXG4gICAgICAgICdsb2NhbGl6YWJsZVByb3BlcnRpZXMnLFxuICAgICAgICAnbWFyZ2luJyxcbiAgICAgICAgJ21hc2tEZWZhdWx0cycsXG4gICAgICAgICdtYXNrZWQnLFxuICAgICAgICAnbWF4SGVpZ2h0JyxcbiAgICAgICAgJ21heFdpZHRoJyxcbiAgICAgICAgJ21pbkhlaWdodCcsXG4gICAgICAgICdtaW5XaWR0aCcsXG4gICAgICAgICdtb25pdG9yUmVzaXplJyxcbiAgICAgICAgJ25hbWUnLFxuICAgICAgICAnb3duZXInLFxuICAgICAgICAncGxhY2Vob2xkZXInLFxuICAgICAgICAncG9zaXRpb25lZCcsXG4gICAgICAgICdwcmV2ZW50VG9vbHRpcE9uVG91Y2gnLFxuICAgICAgICAncmVhZE9ubHknLFxuICAgICAgICAncmVxdWlyZWQnLFxuICAgICAgICAncmVzaXplJyxcbiAgICAgICAgJ3JldmVydE9uRXNjYXBlJyxcbiAgICAgICAgJ3JpcHBsZScsXG4gICAgICAgICdyb290RWxlbWVudCcsXG4gICAgICAgICdzY3JvbGxhYmxlJyxcbiAgICAgICAgJ3Njcm9sbEFjdGlvbicsXG4gICAgICAgICdzaG93QW5pbWF0aW9uJyxcbiAgICAgICAgJ3RhYicsXG4gICAgICAgICd0YWcnLFxuICAgICAgICAndGV4dEFsaWduJyxcbiAgICAgICAgJ3RpdGxlJyxcbiAgICAgICAgJ3Rvb2x0aXAnLFxuICAgICAgICAndHJpZ2dlcnMnLFxuICAgICAgICAndmFsdWUnLFxuICAgICAgICAnd2VpZ2h0JyxcbiAgICAgICAgJ3dpZHRoJyxcbiAgICAgICAgJ3gnLFxuICAgICAgICAneSdcbiAgICBdKTtcblxuICAgIHByaXZhdGUgc3RhdGljIGJyeW50dW1Db25maWdzT25seTogc3RyaW5nW10gPSBbXG4gICAgICAgICdhZG9wdCcsXG4gICAgICAgICdhbGlnbicsXG4gICAgICAgICdhbmNob3InLFxuICAgICAgICAnYXBwZW5kVG8nLFxuICAgICAgICAnYXV0b0NvbXBsZXRlJyxcbiAgICAgICAgJ2F1dG9TZWxlY3QnLFxuICAgICAgICAnYnViYmxlRXZlbnRzJyxcbiAgICAgICAgJ2NlbnRlcmVkJyxcbiAgICAgICAgJ2NsZWFyYWJsZScsXG4gICAgICAgICdjbHMnLFxuICAgICAgICAnY29uZmlnJyxcbiAgICAgICAgJ2NvbnN0cmFpblRvJyxcbiAgICAgICAgJ2NvbnRlbnRFbGVtZW50Q2xzJyxcbiAgICAgICAgJ2RlZmF1bHRCaW5kUHJvcGVydHknLFxuICAgICAgICAnZG9jaycsXG4gICAgICAgICdkcmFnZ2FibGUnLFxuICAgICAgICAnZWRpdGFibGUnLFxuICAgICAgICAnZmxvYXRpbmcnLFxuICAgICAgICAnaGlkZUFuaW1hdGlvbicsXG4gICAgICAgICdoaWdobGlnaHRFeHRlcm5hbENoYW5nZScsXG4gICAgICAgICdoaW50JyxcbiAgICAgICAgJ2hpbnRIdG1sJyxcbiAgICAgICAgJ2h0bWxDbHMnLFxuICAgICAgICAnaW5saW5lJyxcbiAgICAgICAgJ2lucHV0QWxpZ24nLFxuICAgICAgICAnaW5wdXRBdHRyaWJ1dGVzJyxcbiAgICAgICAgJ2lucHV0V2lkdGgnLFxuICAgICAgICAnaW5zZXJ0QmVmb3JlJyxcbiAgICAgICAgJ2luc2VydEZpcnN0JyxcbiAgICAgICAgJ2tleVN0cm9rZUNoYW5nZURlbGF5JyxcbiAgICAgICAgJ2xhYmVsQ2xzJyxcbiAgICAgICAgJ2xhYmVsUG9zaXRpb24nLFxuICAgICAgICAnbGFiZWxzJyxcbiAgICAgICAgJ2xhYmVsV2lkdGgnLFxuICAgICAgICAnbGlzdGVuZXJzJyxcbiAgICAgICAgJ2xvY2FsZUNsYXNzJyxcbiAgICAgICAgJ2xvY2FsaXphYmxlUHJvcGVydGllcycsXG4gICAgICAgICdtYXNrRGVmYXVsdHMnLFxuICAgICAgICAnbWFza2VkJyxcbiAgICAgICAgJ21vbml0b3JSZXNpemUnLFxuICAgICAgICAnbmFtZScsXG4gICAgICAgICdvd25lcicsXG4gICAgICAgICdwbGFjZWhvbGRlcicsXG4gICAgICAgICdwb3NpdGlvbmVkJyxcbiAgICAgICAgJ3ByZXZlbnRUb29sdGlwT25Ub3VjaCcsXG4gICAgICAgICdyZXF1aXJlZCcsXG4gICAgICAgICdyZXNpemUnLFxuICAgICAgICAncmV2ZXJ0T25Fc2NhcGUnLFxuICAgICAgICAncmlwcGxlJyxcbiAgICAgICAgJ3Jvb3RFbGVtZW50JyxcbiAgICAgICAgJ3Njcm9sbEFjdGlvbicsXG4gICAgICAgICdzaG93QW5pbWF0aW9uJyxcbiAgICAgICAgJ3RhYicsXG4gICAgICAgICd0YWcnLFxuICAgICAgICAndGV4dEFsaWduJyxcbiAgICAgICAgJ3RpdGxlJyxcbiAgICAgICAgJ3dlaWdodCdcbiAgICBdO1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bVByb3BzOiBzdHJpbmdbXSA9IEJyeW50dW1UZXh0QXJlYUZpZWxkQ29tcG9uZW50LmJyeW50dW1GZWF0dXJlTmFtZXMuY29uY2F0KFtcbiAgICAgICAgJ2FsaWduU2VsZicsXG4gICAgICAgICdhbmNob3JTaXplJyxcbiAgICAgICAgJ2JhZGdlJyxcbiAgICAgICAgJ2NvbnRlbnQnLFxuICAgICAgICAnZGF0YXNldCcsXG4gICAgICAgICdkaXNhYmxlZCcsXG4gICAgICAgICdleHRyYURhdGEnLFxuICAgICAgICAnZmxleCcsXG4gICAgICAgICdoZWlnaHQnLFxuICAgICAgICAnaGlkZGVuJyxcbiAgICAgICAgJ2h0bWwnLFxuICAgICAgICAnaWQnLFxuICAgICAgICAnbGFiZWwnLFxuICAgICAgICAnbWFyZ2luJyxcbiAgICAgICAgJ21heEhlaWdodCcsXG4gICAgICAgICdtYXhXaWR0aCcsXG4gICAgICAgICdtaW5IZWlnaHQnLFxuICAgICAgICAnbWluV2lkdGgnLFxuICAgICAgICAncmVhZE9ubHknLFxuICAgICAgICAnc2Nyb2xsYWJsZScsXG4gICAgICAgICd0b29sdGlwJyxcbiAgICAgICAgJ3RyaWdnZXJzJyxcbiAgICAgICAgJ3ZhbHVlJyxcbiAgICAgICAgJ3dpZHRoJyxcbiAgICAgICAgJ3gnLFxuICAgICAgICAneSdcbiAgICBdKTtcblxuICAgIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZjtcbiAgICBwdWJsaWMgaW5zdGFuY2U6IFRleHRBcmVhRmllbGQ7XG5cbiAgICBwcml2YXRlIGJyeW50dW1Db25maWcgPSB7XG4gICAgICAgIGFuZ3VsYXJDb21wb25lbnQgOiB0aGlzLFxuICAgICAgICBhZG9wdCAgICAgICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgICBsaXN0ZW5lcnMgICAgICAgIDoge30sXG4gICAgICAgIGZlYXR1cmVzICAgICAgICAgOiB7fVxuICAgIH07XG5cbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50OiBFbGVtZW50UmVmKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudFJlZiA9IGVsZW1lbnQ7XG4gICAgfVxuXG4gICAgIC8vIENvbmZpZ3Mgb25seVxuICAgIEBJbnB1dCgpIGFkb3B0ICAgICAgICAgICAgICAgICAgIDogSFRNTEVsZW1lbnR8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGFsaWduICAgICAgICAgICAgICAgICAgIDogb2JqZWN0fHN0cmluZztcbiAgICBASW5wdXQoKSBhbmNob3IgICAgICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgYXBwZW5kVG8gICAgICAgICAgICAgICAgOiBIVE1MRWxlbWVudHxzdHJpbmc7XG4gICAgQElucHV0KCkgYXV0b0NvbXBsZXRlICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgYXV0b1NlbGVjdCAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGJ1YmJsZUV2ZW50cyAgICAgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIGNlbnRlcmVkICAgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBjbGVhcmFibGUgICAgICAgICAgICAgICA6IGJvb2xlYW58b2JqZWN0O1xuICAgIEBJbnB1dCgpIGNscyAgICAgICAgICAgICAgICAgICAgIDogc3RyaW5nfG9iamVjdDtcbiAgICBASW5wdXQoKSBjb25maWcgICAgICAgICAgICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBjb25zdHJhaW5UbyAgICAgICAgICAgICA6IEhUTUxFbGVtZW50fFdpZGdldHxSZWN0YW5nbGU7XG4gICAgQElucHV0KCkgY29udGVudEVsZW1lbnRDbHMgICAgICAgOiBzdHJpbmd8b2JqZWN0O1xuICAgIEBJbnB1dCgpIGRlZmF1bHRCaW5kUHJvcGVydHkgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGRvY2sgICAgICAgICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGRyYWdnYWJsZSAgICAgICAgICAgICAgIDogYm9vbGVhbnxvYmplY3Q7XG4gICAgQElucHV0KCkgZWRpdGFibGUgICAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGZsb2F0aW5nICAgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBoaWRlQW5pbWF0aW9uICAgICAgICAgICA6IGJvb2xlYW58b2JqZWN0O1xuICAgIEBJbnB1dCgpIGhpZ2hsaWdodEV4dGVybmFsQ2hhbmdlIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBoaW50ICAgICAgICAgICAgICAgICAgICA6IHN0cmluZ3xGdW5jdGlvbjtcbiAgICBASW5wdXQoKSBoaW50SHRtbCAgICAgICAgICAgICAgICA6IHN0cmluZ3xGdW5jdGlvbjtcbiAgICBASW5wdXQoKSBodG1sQ2xzICAgICAgICAgICAgICAgICA6IHN0cmluZ3xvYmplY3Q7XG4gICAgQElucHV0KCkgaW5saW5lICAgICAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGlucHV0QWxpZ24gICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGlucHV0QXR0cmlidXRlcyAgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIGlucHV0V2lkdGggICAgICAgICAgICAgIDogc3RyaW5nfG51bWJlcjtcbiAgICBASW5wdXQoKSBpbnNlcnRCZWZvcmUgICAgICAgICAgICA6IEhUTUxFbGVtZW50fHN0cmluZztcbiAgICBASW5wdXQoKSBpbnNlcnRGaXJzdCAgICAgICAgICAgICA6IEhUTUxFbGVtZW50fHN0cmluZztcbiAgICBASW5wdXQoKSBrZXlTdHJva2VDaGFuZ2VEZWxheSAgICA6IG51bWJlcjtcbiAgICBASW5wdXQoKSBsYWJlbENscyAgICAgICAgICAgICAgICA6IHN0cmluZ3xvYmplY3Q7XG4gICAgQElucHV0KCkgbGFiZWxQb3NpdGlvbiAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgbGFiZWxzICAgICAgICAgICAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgbGFiZWxXaWR0aCAgICAgICAgICAgICAgOiBzdHJpbmd8bnVtYmVyO1xuICAgIEBJbnB1dCgpIGxpc3RlbmVycyAgICAgICAgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIGxvY2FsZUNsYXNzICAgICAgICAgICAgIDogQmFzZTtcbiAgICBASW5wdXQoKSBsb2NhbGl6YWJsZVByb3BlcnRpZXMgICA6IHN0cmluZ1tdO1xuICAgIEBJbnB1dCgpIG1hc2tEZWZhdWx0cyAgICAgICAgICAgIDogb2JqZWN0fE1hc2t8UGFydGlhbDxNYXNrQ29uZmlnPjtcbiAgICBASW5wdXQoKSBtYXNrZWQgICAgICAgICAgICAgICAgICA6IGJvb2xlYW58c3RyaW5nfG9iamVjdHxNYXNrfFBhcnRpYWw8TWFza0NvbmZpZz47XG4gICAgQElucHV0KCkgbW9uaXRvclJlc2l6ZSAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIG5hbWUgICAgICAgICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIG93bmVyICAgICAgICAgICAgICAgICAgIDogV2lkZ2V0O1xuICAgIEBJbnB1dCgpIHBsYWNlaG9sZGVyICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIHBvc2l0aW9uZWQgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBwcmV2ZW50VG9vbHRpcE9uVG91Y2ggICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgcmVxdWlyZWQgICAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHJlc2l6ZSAgICAgICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIHJldmVydE9uRXNjYXBlICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSByaXBwbGUgICAgICAgICAgICAgICAgICA6IGJvb2xlYW58b2JqZWN0O1xuICAgIEBJbnB1dCgpIHJvb3RFbGVtZW50ICAgICAgICAgICAgIDogU2hhZG93Um9vdDtcbiAgICBASW5wdXQoKSBzY3JvbGxBY3Rpb24gICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBzaG93QW5pbWF0aW9uICAgICAgICAgICA6IGJvb2xlYW58b2JqZWN0O1xuICAgIEBJbnB1dCgpIHRhYiAgICAgICAgICAgICAgICAgICAgIDogYm9vbGVhbnxvYmplY3Q7XG4gICAgQElucHV0KCkgdGFnICAgICAgICAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgdGV4dEFsaWduICAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgdGl0bGUgICAgICAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgd2VpZ2h0ICAgICAgICAgICAgICAgICAgOiBudW1iZXI7XG5cbiAgICAgLy8gQ29uZmlncyBhbmQgcHJvcGVydGllc1xuICAgIEBJbnB1dCgpIGFsaWduU2VsZiAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgYmFkZ2UgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBjb250ZW50ICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGRhdGFzZXQgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgZGlzYWJsZWQgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgZXh0cmFEYXRhICA6IGJvb2xlYW58bnVtYmVyfG9iamVjdHxzdHJpbmc7XG4gICAgQElucHV0KCkgZmxleCAgICAgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgaGVpZ2h0ICAgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgaGlkZGVuICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgaHRtbCAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBpZCAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGxhYmVsICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgbWFyZ2luICAgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgbWF4SGVpZ2h0ICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgbWF4V2lkdGggICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgbWluSGVpZ2h0ICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgbWluV2lkdGggICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgcmVhZE9ubHkgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgc2Nyb2xsYWJsZSA6IGJvb2xlYW58U2Nyb2xsZXJ8b2JqZWN0fFBhcnRpYWw8U2Nyb2xsZXJDb25maWc+O1xuICAgIEBJbnB1dCgpIHRvb2x0aXAgICAgOiBvYmplY3R8c3RyaW5nO1xuICAgIEBJbnB1dCgpIHRyaWdnZXJzICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgdmFsdWUgICAgICA6IHN0cmluZ3xhbnk7XG4gICAgQElucHV0KCkgd2lkdGggICAgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgeCAgICAgICAgICA6IG51bWJlcjtcbiAgICBASW5wdXQoKSB5ICAgICAgICAgIDogbnVtYmVyO1xuXG4gICAgIC8vIFByb3BlcnRpZXMgb25seVxuICAgIEBJbnB1dCgpIGFuY2hvclNpemUgOiBudW1iZXJbXTtcblxuICAgICAvLyBFdmVudHNcbiAgICBAT3V0cHV0KCkgb25BY3Rpb24gICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uQmVmb3JlRGVzdHJveSA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkJlZm9yZUhpZGUgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25CZWZvcmVTaG93ICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uQ2F0Y2hBbGwgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkNoYW5nZSAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25DbGVhciAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uRGVzdHJveSAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkZvY3VzSW4gICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25Gb2N1c091dCAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uSGlkZSAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbklucHV0ICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25QYWludCAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uUmVhZE9ubHkgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvblJlc2l6ZSAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25TaG93ICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uVHJpZ2dlciAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGFuZCBhcHBlbmQgdGhlIHVuZGVybHlpbmcgd2lkZ2V0XG4gICAgICovXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0XG4gICAgICAgICAgICBtZSA9IHRoaXMsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZWxlbWVudFJlZixcbiAgICAgICAgICAgICAgICBicnludHVtQ29uZmlnXG4gICAgICAgICAgICB9ID0gbWUsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaW5zdGFuY2VDbGFzcyxcbiAgICAgICAgICAgICAgICBicnludHVtQ29uZmlnc1xuICAgICAgICAgICAgfSA9IEJyeW50dW1UZXh0QXJlYUZpZWxkQ29tcG9uZW50O1xuXG4gICAgICAgIE9iamVjdC5hc3NpZ24oYnJ5bnR1bUNvbmZpZywge1xuICAgICAgICAgICAgbGlzdGVuZXJzIDoge1xuICAgICAgICAgICAgICAgIGFjdGlvbihldmVudCA6IGFueSkgeyBtZS5vbkFjdGlvbi5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBiZWZvcmVEZXN0cm95KGV2ZW50IDogYW55KSB7IG1lLm9uQmVmb3JlRGVzdHJveS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBiZWZvcmVIaWRlKGV2ZW50IDogYW55KSB7IG1lLm9uQmVmb3JlSGlkZS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBiZWZvcmVTaG93KGV2ZW50IDogYW55KSB7IG1lLm9uQmVmb3JlU2hvdy5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBjYXRjaEFsbChldmVudCA6IGFueSkgeyBtZS5vbkNhdGNoQWxsLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGNoYW5nZShldmVudCA6IGFueSkgeyBtZS5vbkNoYW5nZS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBjbGVhcihldmVudCA6IGFueSkgeyBtZS5vbkNsZWFyLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGRlc3Ryb3koZXZlbnQgOiBhbnkpIHsgbWUub25EZXN0cm95LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGZvY3VzSW4oZXZlbnQgOiBhbnkpIHsgbWUub25Gb2N1c0luLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGZvY3VzT3V0KGV2ZW50IDogYW55KSB7IG1lLm9uRm9jdXNPdXQuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgaGlkZShldmVudCA6IGFueSkgeyBtZS5vbkhpZGUuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgaW5wdXQoZXZlbnQgOiBhbnkpIHsgbWUub25JbnB1dC5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBwYWludChldmVudCA6IGFueSkgeyBtZS5vblBhaW50LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIHJlYWRPbmx5KGV2ZW50IDogYW55KSB7IG1lLm9uUmVhZE9ubHkuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgcmVzaXplKGV2ZW50IDogYW55KSB7IG1lLm9uUmVzaXplLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIHNob3coZXZlbnQgOiBhbnkpIHsgbWUub25TaG93LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIHRyaWdnZXIoZXZlbnQgOiBhbnkpIHsgbWUub25UcmlnZ2VyLmVtaXQoZXZlbnQpOyB9LFxuXG4gICAgICAgICAgICAgICAgdGhpc09iaiA6IG1lXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIElmIGNvbXBvbmVudCBoYXMgbm8gY29udGFpbmVyIHNwZWNpZmllZCBpbiBjb25maWcgdGhlbiB1c2UgYWRvcHQgdG8gV3JhcHBlcidzIGVsZW1lbnRcbiAgICAgICAgY29uc3RcbiAgICAgICAgICAgIGNvbnRhaW5lclBhcmFtID0gW1xuICAgICAgICAgICAgICAgICdhZG9wdCcsXG4gICAgICAgICAgICAgICAgJ2FwcGVuZFRvJyxcbiAgICAgICAgICAgICAgICAnaW5zZXJ0QWZ0ZXInLFxuICAgICAgICAgICAgICAgICdpbnNlcnRCZWZvcmUnXG4gICAgICAgICAgICBdLmZpbmQocHJvcCA9PiBicnludHVtQ29uZmlnW3Byb3BdKTtcbiAgICAgICAgaWYgKCFjb250YWluZXJQYXJhbSkge1xuICAgICAgICAgICAgYnJ5bnR1bUNvbmZpZy5hZG9wdCA9IGVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIFdyYXBwZXJIZWxwZXIuZGV2V2FybmluZ0NvbnRhaW5lcihpbnN0YW5jZUNsYXNzLiRuYW1lLCBjb250YWluZXJQYXJhbSk7XG4gICAgICAgIH1cblxuICAgICAgICBicnludHVtQ29uZmlncy5maWx0ZXIocHJvcCA9PiBwcm9wIGluIHRoaXMpLmZvckVhY2gocHJvcCA9PiB7XG4gICAgICAgICAgICBXcmFwcGVySGVscGVyLmFwcGx5UHJvcFZhbHVlKGJyeW50dW1Db25maWcsIHByb3AsIHRoaXNbcHJvcF0pO1xuICAgICAgICAgICAgaWYgKFsnZmVhdHVyZXMnLCAnY29uZmlnJ10uaW5jbHVkZXMocHJvcCkpIHtcbiAgICAgICAgICAgICAgICBXcmFwcGVySGVscGVyLmRldldhcm5pbmdDb25maWdQcm9wKGluc3RhbmNlQ2xhc3MuJG5hbWUsIHByb3ApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIG1lLmluc3RhbmNlID0gaW5zdGFuY2VDbGFzcy4kbmFtZSA9PT0gJ1dpZGdldCcgPyBXaWRnZXRIZWxwZXIuY3JlYXRlV2lkZ2V0KGJyeW50dW1Db25maWcpIDogbmV3IGluc3RhbmNlQ2xhc3MoYnJ5bnR1bUNvbmZpZyk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBXYXRjaCBmb3IgY2hhbmdlc1xuICAgICAqIEBwYXJhbSBjaGFuZ2VzXG4gICAgICovXG4gICAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgICAgICBjb25zdFxuICAgICAgICAgICAgeyBpbnN0YW5jZSB9ID0gdGhpcyxcbiAgICAgICAgICAgIHsgaW5zdGFuY2VDbGFzcyB9ID0gQnJ5bnR1bVRleHRBcmVhRmllbGRDb21wb25lbnQ7XG5cbiAgICAgICAgaWYgKCFpbnN0YW5jZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSXRlcmF0ZSBvdmVyIGFsbCBjaGFuZ2VzXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKGNoYW5nZXMpLmZvckVhY2goKFtwcm9wLCBjaGFuZ2VdKSA9PiB7XG4gICAgICAgICAgICBjb25zdFxuICAgICAgICAgICAgICAgIG5ld1ZhbHVlID0gKGNoYW5nZSBhcyBTaW1wbGVDaGFuZ2UpLmN1cnJlbnRWYWx1ZSxcbiAgICAgICAgICAgICAgICB7IGluc3RhbmNlIH0gPSB0aGlzLFxuICAgICAgICAgICAgICAgIHsgYnJ5bnR1bUNvbmZpZ3NPbmx5LCBicnludHVtUHJvcHMgfSA9IEJyeW50dW1UZXh0QXJlYUZpZWxkQ29tcG9uZW50O1xuICAgICAgICAgICAgaWYgKGJyeW50dW1Qcm9wcy5pbmNsdWRlcyhwcm9wKSkge1xuICAgICAgICAgICAgICAgIFdyYXBwZXJIZWxwZXIuYXBwbHlQcm9wVmFsdWUoaW5zdGFuY2UsIHByb3AsIG5ld1ZhbHVlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgaWYgKGJyeW50dW1Db25maWdzT25seS5pbmNsdWRlcyhwcm9wKSkge1xuICAgICAgICAgICAgICAgICAgICBXcmFwcGVySGVscGVyLmRldldhcm5pbmdVcGRhdGVQcm9wKGluc3RhbmNlQ2xhc3MuJG5hbWUsIHByb3ApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGVzdHJveSB0aGUgY29tcG9uZW50XG4gICAgICovXG4gICAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmluc3RhbmNlKSB7XG4gICAgICAgICAgICB0aGlzLmluc3RhbmNlLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==