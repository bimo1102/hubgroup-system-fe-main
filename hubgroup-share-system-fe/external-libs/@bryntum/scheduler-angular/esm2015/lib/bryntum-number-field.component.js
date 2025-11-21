/**
 * Angular wrapper for Bryntum NumberField
 */
import { Component, ElementRef, EventEmitter, Output, Input } from '@angular/core';
import WrapperHelper from './wrapper.helper';
// Bryntum 'scheduler.lite.umd' bundle comes without polyfills to support Angular's zone.js
import { Base, Widget } from '@bryntum/scheduler/scheduler.lite.umd.js';
import { NumberField, WidgetHelper } from '@bryntum/scheduler/scheduler.lite.umd.js';
export class BryntumNumberFieldComponent {
    constructor(element) {
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
    ngOnInit() {
        const me = this, { elementRef, bryntumConfig } = me, { instanceClass, bryntumConfigs } = BryntumNumberFieldComponent;
        Object.assign(bryntumConfig, {
            listeners: {
                action(event) { me.onAction.emit(event); },
                beforeDestroy(event) { me.onBeforeDestroy.emit(event); },
                beforeHide(event) { me.onBeforeHide.emit(event); },
                beforeShow(event) { me.onBeforeShow.emit(event); },
                catchAll(event) { me.onCatchAll.emit(event); },
                change(event) { me.onChange.emit(event); },
                clear(event) { me.onClear.emit(event); },
                destroy(event) { me.onDestroy.emit(event); },
                focusIn(event) { me.onFocusIn.emit(event); },
                focusOut(event) { me.onFocusOut.emit(event); },
                hide(event) { me.onHide.emit(event); },
                input(event) { me.onInput.emit(event); },
                paint(event) { me.onPaint.emit(event); },
                readOnly(event) { me.onReadOnly.emit(event); },
                resize(event) { me.onResize.emit(event); },
                show(event) { me.onShow.emit(event); },
                trigger(event) { me.onTrigger.emit(event); },
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
        const { instance } = this, { instanceClass } = BryntumNumberFieldComponent;
        if (!instance) {
            return;
        }
        // Iterate over all changes
        Object.entries(changes).forEach(([prop, change]) => {
            const newValue = change.currentValue, { instance } = this, { bryntumConfigsOnly, bryntumProps } = BryntumNumberFieldComponent;
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
BryntumNumberFieldComponent.instanceClass = NumberField;
BryntumNumberFieldComponent.bryntumFeatureNames = [];
BryntumNumberFieldComponent.bryntumConfigs = BryntumNumberFieldComponent.bryntumFeatureNames.concat([
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
    'changeOnSpin',
    'clearable',
    'cls',
    'config',
    'constrainTo',
    'content',
    'contentElementCls',
    'dataset',
    'decimalPrecision',
    'defaultBindProperty',
    'disabled',
    'dock',
    'draggable',
    'editable',
    'extraData',
    'flex',
    'floating',
    'format',
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
    'inputType',
    'inputWidth',
    'insertBefore',
    'insertFirst',
    'keyStrokeChangeDelay',
    'label',
    'labelCls',
    'labelPosition',
    'labels',
    'labelWidth',
    'largeStep',
    'leadingZeroes',
    'listeners',
    'localeClass',
    'localizableProperties',
    'margin',
    'maskDefaults',
    'masked',
    'max',
    'maxHeight',
    'maxWidth',
    'min',
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
    'revertOnEscape',
    'ripple',
    'rootElement',
    'scrollable',
    'scrollAction',
    'showAnimation',
    'step',
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
BryntumNumberFieldComponent.bryntumConfigsOnly = [
    'adopt',
    'align',
    'anchor',
    'appendTo',
    'autoComplete',
    'autoSelect',
    'bubbleEvents',
    'centered',
    'changeOnSpin',
    'clearable',
    'cls',
    'config',
    'constrainTo',
    'contentElementCls',
    'decimalPrecision',
    'defaultBindProperty',
    'dock',
    'draggable',
    'editable',
    'floating',
    'format',
    'hideAnimation',
    'highlightExternalChange',
    'hint',
    'hintHtml',
    'htmlCls',
    'inputAlign',
    'inputAttributes',
    'inputType',
    'inputWidth',
    'insertBefore',
    'insertFirst',
    'keyStrokeChangeDelay',
    'labelCls',
    'labelPosition',
    'labels',
    'labelWidth',
    'largeStep',
    'leadingZeroes',
    'listeners',
    'localeClass',
    'localizableProperties',
    'maskDefaults',
    'masked',
    'max',
    'min',
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
    'tab',
    'tag',
    'textAlign',
    'title',
    'weight'
];
BryntumNumberFieldComponent.bryntumProps = BryntumNumberFieldComponent.bryntumFeatureNames.concat([
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
    'step',
    'tooltip',
    'triggers',
    'value',
    'width',
    'x',
    'y'
]);
BryntumNumberFieldComponent.decorators = [
    { type: Component, args: [{
                selector: 'bryntum-number-field',
                template: ''
            }] }
];
/** @nocollapse */
BryntumNumberFieldComponent.ctorParameters = () => [
    { type: ElementRef }
];
BryntumNumberFieldComponent.propDecorators = {
    adopt: [{ type: Input }],
    align: [{ type: Input }],
    anchor: [{ type: Input }],
    appendTo: [{ type: Input }],
    autoComplete: [{ type: Input }],
    autoSelect: [{ type: Input }],
    bubbleEvents: [{ type: Input }],
    centered: [{ type: Input }],
    changeOnSpin: [{ type: Input }],
    clearable: [{ type: Input }],
    cls: [{ type: Input }],
    config: [{ type: Input }],
    constrainTo: [{ type: Input }],
    contentElementCls: [{ type: Input }],
    decimalPrecision: [{ type: Input }],
    defaultBindProperty: [{ type: Input }],
    dock: [{ type: Input }],
    draggable: [{ type: Input }],
    editable: [{ type: Input }],
    floating: [{ type: Input }],
    format: [{ type: Input }],
    hideAnimation: [{ type: Input }],
    highlightExternalChange: [{ type: Input }],
    hint: [{ type: Input }],
    hintHtml: [{ type: Input }],
    htmlCls: [{ type: Input }],
    inputAlign: [{ type: Input }],
    inputAttributes: [{ type: Input }],
    inputType: [{ type: Input }],
    inputWidth: [{ type: Input }],
    insertBefore: [{ type: Input }],
    insertFirst: [{ type: Input }],
    keyStrokeChangeDelay: [{ type: Input }],
    labelCls: [{ type: Input }],
    labelPosition: [{ type: Input }],
    labels: [{ type: Input }],
    labelWidth: [{ type: Input }],
    largeStep: [{ type: Input }],
    leadingZeroes: [{ type: Input }],
    listeners: [{ type: Input }],
    localeClass: [{ type: Input }],
    localizableProperties: [{ type: Input }],
    maskDefaults: [{ type: Input }],
    masked: [{ type: Input }],
    max: [{ type: Input }],
    min: [{ type: Input }],
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
    step: [{ type: Input }],
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJ5bnR1bS1udW1iZXItZmllbGQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGJyeW50dW0vc2NoZWR1bGVyLWFuZ3VsYXIvIiwic291cmNlcyI6WyJsaWIvYnJ5bnR1bS1udW1iZXItZmllbGQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztHQUVHO0FBRUgsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFxQixNQUFNLEVBQUUsS0FBSyxFQUErQixNQUFNLGVBQWUsQ0FBQztBQUNuSSxPQUFPLGFBQWEsTUFBTSxrQkFBa0IsQ0FBQztBQUU3QywyRkFBMkY7QUFDM0YsT0FBTyxFQUFFLElBQUksRUFBMkYsTUFBTSxFQUFFLE1BQU0sMENBQTBDLENBQUM7QUFDakssT0FBTyxFQUFFLFdBQVcsRUFBZ0IsWUFBWSxFQUFFLE1BQU0sMENBQTBDLENBQUM7QUFNbkcsTUFBTSxPQUFPLDJCQUEyQjtJQThNcEMsWUFBWSxPQUFtQjtRQVB2QixrQkFBYSxHQUFHO1lBQ3BCLGdCQUFnQixFQUFHLElBQUk7WUFDdkIsS0FBSyxFQUFjLFNBQVM7WUFDNUIsU0FBUyxFQUFVLEVBQUU7WUFDckIsUUFBUSxFQUFXLEVBQUU7U0FDeEIsQ0FBQztRQXNHRCxTQUFTO1FBQ0EsYUFBUSxHQUFVLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0Msb0JBQWUsR0FBRyxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQzdDLGlCQUFZLEdBQU0sSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUM3QyxpQkFBWSxHQUFNLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsZUFBVSxHQUFRLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsYUFBUSxHQUFVLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsWUFBTyxHQUFXLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsY0FBUyxHQUFTLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsY0FBUyxHQUFTLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsZUFBVSxHQUFRLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsV0FBTSxHQUFZLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsWUFBTyxHQUFXLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsWUFBTyxHQUFXLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsZUFBVSxHQUFRLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsYUFBUSxHQUFVLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsV0FBTSxHQUFZLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsY0FBUyxHQUFTLElBQUksWUFBWSxFQUFVLENBQUM7UUFwSG5ELElBQUksQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDO0lBQzlCLENBQUM7SUFxSEQ7O09BRUc7SUFDSCxRQUFRO1FBQ0osTUFDSSxFQUFFLEdBQUcsSUFBSSxFQUNULEVBQ0ksVUFBVSxFQUNWLGFBQWEsRUFDaEIsR0FBRyxFQUFFLEVBQ04sRUFDSSxhQUFhLEVBQ2IsY0FBYyxFQUNqQixHQUFHLDJCQUEyQixDQUFDO1FBRXBDLE1BQU0sQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFO1lBQ3pCLFNBQVMsRUFBRztnQkFDUixNQUFNLENBQUMsS0FBVyxJQUFJLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEQsYUFBYSxDQUFDLEtBQVcsSUFBSSxFQUFFLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlELFVBQVUsQ0FBQyxLQUFXLElBQUksRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN4RCxVQUFVLENBQUMsS0FBVyxJQUFJLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEQsUUFBUSxDQUFDLEtBQVcsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BELE1BQU0sQ0FBQyxLQUFXLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoRCxLQUFLLENBQUMsS0FBVyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDOUMsT0FBTyxDQUFDLEtBQVcsSUFBSSxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xELE9BQU8sQ0FBQyxLQUFXLElBQUksRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsRCxRQUFRLENBQUMsS0FBVyxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEQsSUFBSSxDQUFDLEtBQVcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVDLEtBQUssQ0FBQyxLQUFXLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM5QyxLQUFLLENBQUMsS0FBVyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDOUMsUUFBUSxDQUFDLEtBQVcsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BELE1BQU0sQ0FBQyxLQUFXLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoRCxJQUFJLENBQUMsS0FBVyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDNUMsT0FBTyxDQUFDLEtBQVcsSUFBSSxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRWxELE9BQU8sRUFBRyxFQUFFO2FBQ2Y7U0FDSixDQUFDLENBQUM7UUFFSCx3RkFBd0Y7UUFDeEYsTUFDSSxjQUFjLEdBQUc7WUFDYixPQUFPO1lBQ1AsVUFBVTtZQUNWLGFBQWE7WUFDYixjQUFjO1NBQ2pCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDeEMsSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUNqQixhQUFhLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxhQUFhLENBQUM7U0FDbEQ7YUFDSTtZQUNELGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1NBQzFFO1FBRUQsY0FBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDdkQsYUFBYSxDQUFDLGNBQWMsQ0FBQyxhQUFhLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQzlELElBQUksQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUN2QyxhQUFhLENBQUMsb0JBQW9CLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQzthQUNqRTtRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsYUFBYTtRQUNiLEVBQUUsQ0FBQyxRQUFRLEdBQUcsYUFBYSxDQUFDLEtBQUssS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBRWpJLENBQUM7SUFFRDs7O09BR0c7SUFDSCxXQUFXLENBQUMsT0FBc0I7UUFDOUIsTUFDSSxFQUFFLFFBQVEsRUFBRSxHQUFHLElBQUksRUFDbkIsRUFBRSxhQUFhLEVBQUUsR0FBRywyQkFBMkIsQ0FBQztRQUVwRCxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ1gsT0FBTztTQUNWO1FBRUQsMkJBQTJCO1FBQzNCLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLEVBQUUsRUFBRTtZQUMvQyxNQUNJLFFBQVEsR0FBSSxNQUF1QixDQUFDLFlBQVksRUFDaEQsRUFBRSxRQUFRLEVBQUUsR0FBRyxJQUFJLEVBQ25CLEVBQUUsa0JBQWtCLEVBQUUsWUFBWSxFQUFFLEdBQUcsMkJBQTJCLENBQUM7WUFDdkUsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUM3QixhQUFhLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUM5RCxJQUFJLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRTtvQkFDbkMsYUFBYSxDQUFDLG9CQUFvQixDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7aUJBQ2pFO2FBQ0o7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRDs7T0FFRztJQUNILFdBQVc7UUFDUCxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDZixJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQzNCO0lBQ0wsQ0FBQzs7QUF4YWEseUNBQWEsR0FBRyxXQUFXLENBQUM7QUFFM0IsK0NBQW1CLEdBQWEsRUFFOUMsQ0FBQztBQUVhLDBDQUFjLEdBQWEsMkJBQTJCLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDO0lBQzdGLE9BQU87SUFDUCxPQUFPO0lBQ1AsV0FBVztJQUNYLFFBQVE7SUFDUixVQUFVO0lBQ1YsY0FBYztJQUNkLFlBQVk7SUFDWixPQUFPO0lBQ1AsY0FBYztJQUNkLFVBQVU7SUFDVixjQUFjO0lBQ2QsV0FBVztJQUNYLEtBQUs7SUFDTCxRQUFRO0lBQ1IsYUFBYTtJQUNiLFNBQVM7SUFDVCxtQkFBbUI7SUFDbkIsU0FBUztJQUNULGtCQUFrQjtJQUNsQixxQkFBcUI7SUFDckIsVUFBVTtJQUNWLE1BQU07SUFDTixXQUFXO0lBQ1gsVUFBVTtJQUNWLFdBQVc7SUFDWCxNQUFNO0lBQ04sVUFBVTtJQUNWLFFBQVE7SUFDUixRQUFRO0lBQ1IsUUFBUTtJQUNSLGVBQWU7SUFDZix5QkFBeUI7SUFDekIsTUFBTTtJQUNOLFVBQVU7SUFDVixNQUFNO0lBQ04sU0FBUztJQUNULElBQUk7SUFDSixZQUFZO0lBQ1osaUJBQWlCO0lBQ2pCLFdBQVc7SUFDWCxZQUFZO0lBQ1osY0FBYztJQUNkLGFBQWE7SUFDYixzQkFBc0I7SUFDdEIsT0FBTztJQUNQLFVBQVU7SUFDVixlQUFlO0lBQ2YsUUFBUTtJQUNSLFlBQVk7SUFDWixXQUFXO0lBQ1gsZUFBZTtJQUNmLFdBQVc7SUFDWCxhQUFhO0lBQ2IsdUJBQXVCO0lBQ3ZCLFFBQVE7SUFDUixjQUFjO0lBQ2QsUUFBUTtJQUNSLEtBQUs7SUFDTCxXQUFXO0lBQ1gsVUFBVTtJQUNWLEtBQUs7SUFDTCxXQUFXO0lBQ1gsVUFBVTtJQUNWLGVBQWU7SUFDZixNQUFNO0lBQ04sT0FBTztJQUNQLGFBQWE7SUFDYixZQUFZO0lBQ1osdUJBQXVCO0lBQ3ZCLFVBQVU7SUFDVixVQUFVO0lBQ1YsZ0JBQWdCO0lBQ2hCLFFBQVE7SUFDUixhQUFhO0lBQ2IsWUFBWTtJQUNaLGNBQWM7SUFDZCxlQUFlO0lBQ2YsTUFBTTtJQUNOLEtBQUs7SUFDTCxLQUFLO0lBQ0wsV0FBVztJQUNYLE9BQU87SUFDUCxTQUFTO0lBQ1QsVUFBVTtJQUNWLE9BQU87SUFDUCxRQUFRO0lBQ1IsT0FBTztJQUNQLEdBQUc7SUFDSCxHQUFHO0NBQ04sQ0FBQyxDQUFDO0FBRVksOENBQWtCLEdBQWE7SUFDMUMsT0FBTztJQUNQLE9BQU87SUFDUCxRQUFRO0lBQ1IsVUFBVTtJQUNWLGNBQWM7SUFDZCxZQUFZO0lBQ1osY0FBYztJQUNkLFVBQVU7SUFDVixjQUFjO0lBQ2QsV0FBVztJQUNYLEtBQUs7SUFDTCxRQUFRO0lBQ1IsYUFBYTtJQUNiLG1CQUFtQjtJQUNuQixrQkFBa0I7SUFDbEIscUJBQXFCO0lBQ3JCLE1BQU07SUFDTixXQUFXO0lBQ1gsVUFBVTtJQUNWLFVBQVU7SUFDVixRQUFRO0lBQ1IsZUFBZTtJQUNmLHlCQUF5QjtJQUN6QixNQUFNO0lBQ04sVUFBVTtJQUNWLFNBQVM7SUFDVCxZQUFZO0lBQ1osaUJBQWlCO0lBQ2pCLFdBQVc7SUFDWCxZQUFZO0lBQ1osY0FBYztJQUNkLGFBQWE7SUFDYixzQkFBc0I7SUFDdEIsVUFBVTtJQUNWLGVBQWU7SUFDZixRQUFRO0lBQ1IsWUFBWTtJQUNaLFdBQVc7SUFDWCxlQUFlO0lBQ2YsV0FBVztJQUNYLGFBQWE7SUFDYix1QkFBdUI7SUFDdkIsY0FBYztJQUNkLFFBQVE7SUFDUixLQUFLO0lBQ0wsS0FBSztJQUNMLGVBQWU7SUFDZixNQUFNO0lBQ04sT0FBTztJQUNQLGFBQWE7SUFDYixZQUFZO0lBQ1osdUJBQXVCO0lBQ3ZCLFVBQVU7SUFDVixnQkFBZ0I7SUFDaEIsUUFBUTtJQUNSLGFBQWE7SUFDYixjQUFjO0lBQ2QsZUFBZTtJQUNmLEtBQUs7SUFDTCxLQUFLO0lBQ0wsV0FBVztJQUNYLE9BQU87SUFDUCxRQUFRO0NBQ1gsQ0FBQztBQUVhLHdDQUFZLEdBQWEsMkJBQTJCLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDO0lBQzNGLFdBQVc7SUFDWCxZQUFZO0lBQ1osT0FBTztJQUNQLFNBQVM7SUFDVCxTQUFTO0lBQ1QsVUFBVTtJQUNWLFdBQVc7SUFDWCxNQUFNO0lBQ04sUUFBUTtJQUNSLFFBQVE7SUFDUixNQUFNO0lBQ04sSUFBSTtJQUNKLE9BQU87SUFDUCxRQUFRO0lBQ1IsV0FBVztJQUNYLFVBQVU7SUFDVixXQUFXO0lBQ1gsVUFBVTtJQUNWLFVBQVU7SUFDVixZQUFZO0lBQ1osTUFBTTtJQUNOLFNBQVM7SUFDVCxVQUFVO0lBQ1YsT0FBTztJQUNQLE9BQU87SUFDUCxHQUFHO0lBQ0gsR0FBRztDQUNOLENBQUMsQ0FBQzs7WUF0TU4sU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRyxzQkFBc0I7Z0JBQ2pDLFFBQVEsRUFBRyxFQUFFO2FBQ2hCOzs7O1lBVm1CLFVBQVU7OztvQkE4TnpCLEtBQUs7b0JBQ0wsS0FBSztxQkFDTCxLQUFLO3VCQUNMLEtBQUs7MkJBQ0wsS0FBSzt5QkFDTCxLQUFLOzJCQUNMLEtBQUs7dUJBQ0wsS0FBSzsyQkFDTCxLQUFLO3dCQUNMLEtBQUs7a0JBQ0wsS0FBSztxQkFDTCxLQUFLOzBCQUNMLEtBQUs7Z0NBQ0wsS0FBSzsrQkFDTCxLQUFLO2tDQUNMLEtBQUs7bUJBQ0wsS0FBSzt3QkFDTCxLQUFLO3VCQUNMLEtBQUs7dUJBQ0wsS0FBSztxQkFDTCxLQUFLOzRCQUNMLEtBQUs7c0NBQ0wsS0FBSzttQkFDTCxLQUFLO3VCQUNMLEtBQUs7c0JBQ0wsS0FBSzt5QkFDTCxLQUFLOzhCQUNMLEtBQUs7d0JBQ0wsS0FBSzt5QkFDTCxLQUFLOzJCQUNMLEtBQUs7MEJBQ0wsS0FBSzttQ0FDTCxLQUFLO3VCQUNMLEtBQUs7NEJBQ0wsS0FBSztxQkFDTCxLQUFLO3lCQUNMLEtBQUs7d0JBQ0wsS0FBSzs0QkFDTCxLQUFLO3dCQUNMLEtBQUs7MEJBQ0wsS0FBSztvQ0FDTCxLQUFLOzJCQUNMLEtBQUs7cUJBQ0wsS0FBSztrQkFDTCxLQUFLO2tCQUNMLEtBQUs7NEJBQ0wsS0FBSzttQkFDTCxLQUFLO29CQUNMLEtBQUs7MEJBQ0wsS0FBSzt5QkFDTCxLQUFLO29DQUNMLEtBQUs7dUJBQ0wsS0FBSzs2QkFDTCxLQUFLO3FCQUNMLEtBQUs7MEJBQ0wsS0FBSzsyQkFDTCxLQUFLOzRCQUNMLEtBQUs7a0JBQ0wsS0FBSztrQkFDTCxLQUFLO3dCQUNMLEtBQUs7b0JBQ0wsS0FBSztxQkFDTCxLQUFLO3dCQUdMLEtBQUs7b0JBQ0wsS0FBSztzQkFDTCxLQUFLO3NCQUNMLEtBQUs7dUJBQ0wsS0FBSzt3QkFDTCxLQUFLO21CQUNMLEtBQUs7cUJBQ0wsS0FBSztxQkFDTCxLQUFLO21CQUNMLEtBQUs7aUJBQ0wsS0FBSztvQkFDTCxLQUFLO3FCQUNMLEtBQUs7d0JBQ0wsS0FBSzt1QkFDTCxLQUFLO3dCQUNMLEtBQUs7dUJBQ0wsS0FBSzt1QkFDTCxLQUFLO3lCQUNMLEtBQUs7bUJBQ0wsS0FBSztzQkFDTCxLQUFLO3VCQUNMLEtBQUs7b0JBQ0wsS0FBSztvQkFDTCxLQUFLO2dCQUNMLEtBQUs7Z0JBQ0wsS0FBSzt5QkFHTCxLQUFLO3VCQUdMLE1BQU07OEJBQ04sTUFBTTsyQkFDTixNQUFNOzJCQUNOLE1BQU07eUJBQ04sTUFBTTt1QkFDTixNQUFNO3NCQUNOLE1BQU07d0JBQ04sTUFBTTt3QkFDTixNQUFNO3lCQUNOLE1BQU07cUJBQ04sTUFBTTtzQkFDTixNQUFNO3NCQUNOLE1BQU07eUJBQ04sTUFBTTt1QkFDTixNQUFNO3FCQUNOLE1BQU07d0JBQ04sTUFBTSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQW5ndWxhciB3cmFwcGVyIGZvciBCcnludHVtIE51bWJlckZpZWxkXG4gKi9cblxuaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIE9uRGVzdHJveSwgT25Jbml0LCBPdXRwdXQsIElucHV0LCBTaW1wbGVDaGFuZ2UsIFNpbXBsZUNoYW5nZXMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCBXcmFwcGVySGVscGVyIGZyb20gJy4vd3JhcHBlci5oZWxwZXInO1xuXG4vLyBCcnludHVtICdzY2hlZHVsZXIubGl0ZS51bWQnIGJ1bmRsZSBjb21lcyB3aXRob3V0IHBvbHlmaWxscyB0byBzdXBwb3J0IEFuZ3VsYXIncyB6b25lLmpzXG5pbXBvcnQgeyBCYXNlLCBNYXNrLCBNYXNrQ29uZmlnLCBOdW1iZXJGb3JtYXQsIE51bWJlckZvcm1hdENvbmZpZywgUmVjdGFuZ2xlLCBTY3JvbGxlciwgU2Nyb2xsZXJDb25maWcsIFdpZGdldCB9IGZyb20gJ0BicnludHVtL3NjaGVkdWxlci9zY2hlZHVsZXIubGl0ZS51bWQuanMnO1xuaW1wb3J0IHsgTnVtYmVyRmllbGQsIFN0cmluZ0hlbHBlciwgV2lkZ2V0SGVscGVyIH0gZnJvbSAnQGJyeW50dW0vc2NoZWR1bGVyL3NjaGVkdWxlci5saXRlLnVtZC5qcyc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yIDogJ2JyeW50dW0tbnVtYmVyLWZpZWxkJyxcbiAgICB0ZW1wbGF0ZSA6ICcnXG59KVxuZXhwb3J0IGNsYXNzIEJyeW50dW1OdW1iZXJGaWVsZENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcblxuICAgIHB1YmxpYyBzdGF0aWMgaW5zdGFuY2VDbGFzcyA9IE51bWJlckZpZWxkO1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bUZlYXR1cmVOYW1lczogc3RyaW5nW10gPSBbXG5cbiAgICBdO1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bUNvbmZpZ3M6IHN0cmluZ1tdID0gQnJ5bnR1bU51bWJlckZpZWxkQ29tcG9uZW50LmJyeW50dW1GZWF0dXJlTmFtZXMuY29uY2F0KFtcbiAgICAgICAgJ2Fkb3B0JyxcbiAgICAgICAgJ2FsaWduJyxcbiAgICAgICAgJ2FsaWduU2VsZicsXG4gICAgICAgICdhbmNob3InLFxuICAgICAgICAnYXBwZW5kVG8nLFxuICAgICAgICAnYXV0b0NvbXBsZXRlJyxcbiAgICAgICAgJ2F1dG9TZWxlY3QnLFxuICAgICAgICAnYmFkZ2UnLFxuICAgICAgICAnYnViYmxlRXZlbnRzJyxcbiAgICAgICAgJ2NlbnRlcmVkJyxcbiAgICAgICAgJ2NoYW5nZU9uU3BpbicsXG4gICAgICAgICdjbGVhcmFibGUnLFxuICAgICAgICAnY2xzJyxcbiAgICAgICAgJ2NvbmZpZycsXG4gICAgICAgICdjb25zdHJhaW5UbycsXG4gICAgICAgICdjb250ZW50JyxcbiAgICAgICAgJ2NvbnRlbnRFbGVtZW50Q2xzJyxcbiAgICAgICAgJ2RhdGFzZXQnLFxuICAgICAgICAnZGVjaW1hbFByZWNpc2lvbicsXG4gICAgICAgICdkZWZhdWx0QmluZFByb3BlcnR5JyxcbiAgICAgICAgJ2Rpc2FibGVkJyxcbiAgICAgICAgJ2RvY2snLFxuICAgICAgICAnZHJhZ2dhYmxlJyxcbiAgICAgICAgJ2VkaXRhYmxlJyxcbiAgICAgICAgJ2V4dHJhRGF0YScsXG4gICAgICAgICdmbGV4JyxcbiAgICAgICAgJ2Zsb2F0aW5nJyxcbiAgICAgICAgJ2Zvcm1hdCcsXG4gICAgICAgICdoZWlnaHQnLFxuICAgICAgICAnaGlkZGVuJyxcbiAgICAgICAgJ2hpZGVBbmltYXRpb24nLFxuICAgICAgICAnaGlnaGxpZ2h0RXh0ZXJuYWxDaGFuZ2UnLFxuICAgICAgICAnaGludCcsXG4gICAgICAgICdoaW50SHRtbCcsXG4gICAgICAgICdodG1sJyxcbiAgICAgICAgJ2h0bWxDbHMnLFxuICAgICAgICAnaWQnLFxuICAgICAgICAnaW5wdXRBbGlnbicsXG4gICAgICAgICdpbnB1dEF0dHJpYnV0ZXMnLFxuICAgICAgICAnaW5wdXRUeXBlJyxcbiAgICAgICAgJ2lucHV0V2lkdGgnLFxuICAgICAgICAnaW5zZXJ0QmVmb3JlJyxcbiAgICAgICAgJ2luc2VydEZpcnN0JyxcbiAgICAgICAgJ2tleVN0cm9rZUNoYW5nZURlbGF5JyxcbiAgICAgICAgJ2xhYmVsJyxcbiAgICAgICAgJ2xhYmVsQ2xzJyxcbiAgICAgICAgJ2xhYmVsUG9zaXRpb24nLFxuICAgICAgICAnbGFiZWxzJyxcbiAgICAgICAgJ2xhYmVsV2lkdGgnLFxuICAgICAgICAnbGFyZ2VTdGVwJyxcbiAgICAgICAgJ2xlYWRpbmdaZXJvZXMnLFxuICAgICAgICAnbGlzdGVuZXJzJyxcbiAgICAgICAgJ2xvY2FsZUNsYXNzJyxcbiAgICAgICAgJ2xvY2FsaXphYmxlUHJvcGVydGllcycsXG4gICAgICAgICdtYXJnaW4nLFxuICAgICAgICAnbWFza0RlZmF1bHRzJyxcbiAgICAgICAgJ21hc2tlZCcsXG4gICAgICAgICdtYXgnLFxuICAgICAgICAnbWF4SGVpZ2h0JyxcbiAgICAgICAgJ21heFdpZHRoJyxcbiAgICAgICAgJ21pbicsXG4gICAgICAgICdtaW5IZWlnaHQnLFxuICAgICAgICAnbWluV2lkdGgnLFxuICAgICAgICAnbW9uaXRvclJlc2l6ZScsXG4gICAgICAgICduYW1lJyxcbiAgICAgICAgJ293bmVyJyxcbiAgICAgICAgJ3BsYWNlaG9sZGVyJyxcbiAgICAgICAgJ3Bvc2l0aW9uZWQnLFxuICAgICAgICAncHJldmVudFRvb2x0aXBPblRvdWNoJyxcbiAgICAgICAgJ3JlYWRPbmx5JyxcbiAgICAgICAgJ3JlcXVpcmVkJyxcbiAgICAgICAgJ3JldmVydE9uRXNjYXBlJyxcbiAgICAgICAgJ3JpcHBsZScsXG4gICAgICAgICdyb290RWxlbWVudCcsXG4gICAgICAgICdzY3JvbGxhYmxlJyxcbiAgICAgICAgJ3Njcm9sbEFjdGlvbicsXG4gICAgICAgICdzaG93QW5pbWF0aW9uJyxcbiAgICAgICAgJ3N0ZXAnLFxuICAgICAgICAndGFiJyxcbiAgICAgICAgJ3RhZycsXG4gICAgICAgICd0ZXh0QWxpZ24nLFxuICAgICAgICAndGl0bGUnLFxuICAgICAgICAndG9vbHRpcCcsXG4gICAgICAgICd0cmlnZ2VycycsXG4gICAgICAgICd2YWx1ZScsXG4gICAgICAgICd3ZWlnaHQnLFxuICAgICAgICAnd2lkdGgnLFxuICAgICAgICAneCcsXG4gICAgICAgICd5J1xuICAgIF0pO1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bUNvbmZpZ3NPbmx5OiBzdHJpbmdbXSA9IFtcbiAgICAgICAgJ2Fkb3B0JyxcbiAgICAgICAgJ2FsaWduJyxcbiAgICAgICAgJ2FuY2hvcicsXG4gICAgICAgICdhcHBlbmRUbycsXG4gICAgICAgICdhdXRvQ29tcGxldGUnLFxuICAgICAgICAnYXV0b1NlbGVjdCcsXG4gICAgICAgICdidWJibGVFdmVudHMnLFxuICAgICAgICAnY2VudGVyZWQnLFxuICAgICAgICAnY2hhbmdlT25TcGluJyxcbiAgICAgICAgJ2NsZWFyYWJsZScsXG4gICAgICAgICdjbHMnLFxuICAgICAgICAnY29uZmlnJyxcbiAgICAgICAgJ2NvbnN0cmFpblRvJyxcbiAgICAgICAgJ2NvbnRlbnRFbGVtZW50Q2xzJyxcbiAgICAgICAgJ2RlY2ltYWxQcmVjaXNpb24nLFxuICAgICAgICAnZGVmYXVsdEJpbmRQcm9wZXJ0eScsXG4gICAgICAgICdkb2NrJyxcbiAgICAgICAgJ2RyYWdnYWJsZScsXG4gICAgICAgICdlZGl0YWJsZScsXG4gICAgICAgICdmbG9hdGluZycsXG4gICAgICAgICdmb3JtYXQnLFxuICAgICAgICAnaGlkZUFuaW1hdGlvbicsXG4gICAgICAgICdoaWdobGlnaHRFeHRlcm5hbENoYW5nZScsXG4gICAgICAgICdoaW50JyxcbiAgICAgICAgJ2hpbnRIdG1sJyxcbiAgICAgICAgJ2h0bWxDbHMnLFxuICAgICAgICAnaW5wdXRBbGlnbicsXG4gICAgICAgICdpbnB1dEF0dHJpYnV0ZXMnLFxuICAgICAgICAnaW5wdXRUeXBlJyxcbiAgICAgICAgJ2lucHV0V2lkdGgnLFxuICAgICAgICAnaW5zZXJ0QmVmb3JlJyxcbiAgICAgICAgJ2luc2VydEZpcnN0JyxcbiAgICAgICAgJ2tleVN0cm9rZUNoYW5nZURlbGF5JyxcbiAgICAgICAgJ2xhYmVsQ2xzJyxcbiAgICAgICAgJ2xhYmVsUG9zaXRpb24nLFxuICAgICAgICAnbGFiZWxzJyxcbiAgICAgICAgJ2xhYmVsV2lkdGgnLFxuICAgICAgICAnbGFyZ2VTdGVwJyxcbiAgICAgICAgJ2xlYWRpbmdaZXJvZXMnLFxuICAgICAgICAnbGlzdGVuZXJzJyxcbiAgICAgICAgJ2xvY2FsZUNsYXNzJyxcbiAgICAgICAgJ2xvY2FsaXphYmxlUHJvcGVydGllcycsXG4gICAgICAgICdtYXNrRGVmYXVsdHMnLFxuICAgICAgICAnbWFza2VkJyxcbiAgICAgICAgJ21heCcsXG4gICAgICAgICdtaW4nLFxuICAgICAgICAnbW9uaXRvclJlc2l6ZScsXG4gICAgICAgICduYW1lJyxcbiAgICAgICAgJ293bmVyJyxcbiAgICAgICAgJ3BsYWNlaG9sZGVyJyxcbiAgICAgICAgJ3Bvc2l0aW9uZWQnLFxuICAgICAgICAncHJldmVudFRvb2x0aXBPblRvdWNoJyxcbiAgICAgICAgJ3JlcXVpcmVkJyxcbiAgICAgICAgJ3JldmVydE9uRXNjYXBlJyxcbiAgICAgICAgJ3JpcHBsZScsXG4gICAgICAgICdyb290RWxlbWVudCcsXG4gICAgICAgICdzY3JvbGxBY3Rpb24nLFxuICAgICAgICAnc2hvd0FuaW1hdGlvbicsXG4gICAgICAgICd0YWInLFxuICAgICAgICAndGFnJyxcbiAgICAgICAgJ3RleHRBbGlnbicsXG4gICAgICAgICd0aXRsZScsXG4gICAgICAgICd3ZWlnaHQnXG4gICAgXTtcblxuICAgIHByaXZhdGUgc3RhdGljIGJyeW50dW1Qcm9wczogc3RyaW5nW10gPSBCcnludHVtTnVtYmVyRmllbGRDb21wb25lbnQuYnJ5bnR1bUZlYXR1cmVOYW1lcy5jb25jYXQoW1xuICAgICAgICAnYWxpZ25TZWxmJyxcbiAgICAgICAgJ2FuY2hvclNpemUnLFxuICAgICAgICAnYmFkZ2UnLFxuICAgICAgICAnY29udGVudCcsXG4gICAgICAgICdkYXRhc2V0JyxcbiAgICAgICAgJ2Rpc2FibGVkJyxcbiAgICAgICAgJ2V4dHJhRGF0YScsXG4gICAgICAgICdmbGV4JyxcbiAgICAgICAgJ2hlaWdodCcsXG4gICAgICAgICdoaWRkZW4nLFxuICAgICAgICAnaHRtbCcsXG4gICAgICAgICdpZCcsXG4gICAgICAgICdsYWJlbCcsXG4gICAgICAgICdtYXJnaW4nLFxuICAgICAgICAnbWF4SGVpZ2h0JyxcbiAgICAgICAgJ21heFdpZHRoJyxcbiAgICAgICAgJ21pbkhlaWdodCcsXG4gICAgICAgICdtaW5XaWR0aCcsXG4gICAgICAgICdyZWFkT25seScsXG4gICAgICAgICdzY3JvbGxhYmxlJyxcbiAgICAgICAgJ3N0ZXAnLFxuICAgICAgICAndG9vbHRpcCcsXG4gICAgICAgICd0cmlnZ2VycycsXG4gICAgICAgICd2YWx1ZScsXG4gICAgICAgICd3aWR0aCcsXG4gICAgICAgICd4JyxcbiAgICAgICAgJ3knXG4gICAgXSk7XG5cbiAgICBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY7XG4gICAgcHVibGljIGluc3RhbmNlOiBOdW1iZXJGaWVsZDtcblxuICAgIHByaXZhdGUgYnJ5bnR1bUNvbmZpZyA9IHtcbiAgICAgICAgYW5ndWxhckNvbXBvbmVudCA6IHRoaXMsXG4gICAgICAgIGFkb3B0ICAgICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgIGxpc3RlbmVycyAgICAgICAgOiB7fSxcbiAgICAgICAgZmVhdHVyZXMgICAgICAgICA6IHt9XG4gICAgfTtcblxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQ6IEVsZW1lbnRSZWYpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50UmVmID0gZWxlbWVudDtcbiAgICB9XG5cbiAgICAgLy8gQ29uZmlncyBvbmx5XG4gICAgQElucHV0KCkgYWRvcHQgICAgICAgICAgICAgICAgICAgOiBIVE1MRWxlbWVudHxzdHJpbmc7XG4gICAgQElucHV0KCkgYWxpZ24gICAgICAgICAgICAgICAgICAgOiBvYmplY3R8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGFuY2hvciAgICAgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBhcHBlbmRUbyAgICAgICAgICAgICAgICA6IEhUTUxFbGVtZW50fHN0cmluZztcbiAgICBASW5wdXQoKSBhdXRvQ29tcGxldGUgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBhdXRvU2VsZWN0ICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgYnViYmxlRXZlbnRzICAgICAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgY2VudGVyZWQgICAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGNoYW5nZU9uU3BpbiAgICAgICAgICAgIDogYm9vbGVhbnxudW1iZXI7XG4gICAgQElucHV0KCkgY2xlYXJhYmxlICAgICAgICAgICAgICAgOiBib29sZWFufG9iamVjdDtcbiAgICBASW5wdXQoKSBjbHMgICAgICAgICAgICAgICAgICAgICA6IHN0cmluZ3xvYmplY3Q7XG4gICAgQElucHV0KCkgY29uZmlnICAgICAgICAgICAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgY29uc3RyYWluVG8gICAgICAgICAgICAgOiBIVE1MRWxlbWVudHxXaWRnZXR8UmVjdGFuZ2xlO1xuICAgIEBJbnB1dCgpIGNvbnRlbnRFbGVtZW50Q2xzICAgICAgIDogc3RyaW5nfG9iamVjdDtcbiAgICBASW5wdXQoKSBkZWNpbWFsUHJlY2lzaW9uICAgICAgICA6IG51bWJlcjtcbiAgICBASW5wdXQoKSBkZWZhdWx0QmluZFByb3BlcnR5ICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBkb2NrICAgICAgICAgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBkcmFnZ2FibGUgICAgICAgICAgICAgICA6IGJvb2xlYW58b2JqZWN0O1xuICAgIEBJbnB1dCgpIGVkaXRhYmxlICAgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBmbG9hdGluZyAgICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgZm9ybWF0ICAgICAgICAgICAgICAgICAgOiBzdHJpbmd8b2JqZWN0fE51bWJlckZvcm1hdHxQYXJ0aWFsPE51bWJlckZvcm1hdENvbmZpZz47XG4gICAgQElucHV0KCkgaGlkZUFuaW1hdGlvbiAgICAgICAgICAgOiBib29sZWFufG9iamVjdDtcbiAgICBASW5wdXQoKSBoaWdobGlnaHRFeHRlcm5hbENoYW5nZSA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgaGludCAgICAgICAgICAgICAgICAgICAgOiBzdHJpbmd8RnVuY3Rpb247XG4gICAgQElucHV0KCkgaGludEh0bWwgICAgICAgICAgICAgICAgOiBzdHJpbmd8RnVuY3Rpb247XG4gICAgQElucHV0KCkgaHRtbENscyAgICAgICAgICAgICAgICAgOiBzdHJpbmd8b2JqZWN0O1xuICAgIEBJbnB1dCgpIGlucHV0QWxpZ24gICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGlucHV0QXR0cmlidXRlcyAgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIGlucHV0VHlwZSAgICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGlucHV0V2lkdGggICAgICAgICAgICAgIDogc3RyaW5nfG51bWJlcjtcbiAgICBASW5wdXQoKSBpbnNlcnRCZWZvcmUgICAgICAgICAgICA6IEhUTUxFbGVtZW50fHN0cmluZztcbiAgICBASW5wdXQoKSBpbnNlcnRGaXJzdCAgICAgICAgICAgICA6IEhUTUxFbGVtZW50fHN0cmluZztcbiAgICBASW5wdXQoKSBrZXlTdHJva2VDaGFuZ2VEZWxheSAgICA6IG51bWJlcjtcbiAgICBASW5wdXQoKSBsYWJlbENscyAgICAgICAgICAgICAgICA6IHN0cmluZ3xvYmplY3Q7XG4gICAgQElucHV0KCkgbGFiZWxQb3NpdGlvbiAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgbGFiZWxzICAgICAgICAgICAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgbGFiZWxXaWR0aCAgICAgICAgICAgICAgOiBzdHJpbmd8bnVtYmVyO1xuICAgIEBJbnB1dCgpIGxhcmdlU3RlcCAgICAgICAgICAgICAgIDogbnVtYmVyO1xuICAgIEBJbnB1dCgpIGxlYWRpbmdaZXJvZXMgICAgICAgICAgIDogbnVtYmVyO1xuICAgIEBJbnB1dCgpIGxpc3RlbmVycyAgICAgICAgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIGxvY2FsZUNsYXNzICAgICAgICAgICAgIDogQmFzZTtcbiAgICBASW5wdXQoKSBsb2NhbGl6YWJsZVByb3BlcnRpZXMgICA6IHN0cmluZ1tdO1xuICAgIEBJbnB1dCgpIG1hc2tEZWZhdWx0cyAgICAgICAgICAgIDogb2JqZWN0fE1hc2t8UGFydGlhbDxNYXNrQ29uZmlnPjtcbiAgICBASW5wdXQoKSBtYXNrZWQgICAgICAgICAgICAgICAgICA6IGJvb2xlYW58c3RyaW5nfG9iamVjdHxNYXNrfFBhcnRpYWw8TWFza0NvbmZpZz47XG4gICAgQElucHV0KCkgbWF4ICAgICAgICAgICAgICAgICAgICAgOiBudW1iZXI7XG4gICAgQElucHV0KCkgbWluICAgICAgICAgICAgICAgICAgICAgOiBudW1iZXI7XG4gICAgQElucHV0KCkgbW9uaXRvclJlc2l6ZSAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIG5hbWUgICAgICAgICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIG93bmVyICAgICAgICAgICAgICAgICAgIDogV2lkZ2V0O1xuICAgIEBJbnB1dCgpIHBsYWNlaG9sZGVyICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIHBvc2l0aW9uZWQgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBwcmV2ZW50VG9vbHRpcE9uVG91Y2ggICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgcmVxdWlyZWQgICAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHJldmVydE9uRXNjYXBlICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSByaXBwbGUgICAgICAgICAgICAgICAgICA6IGJvb2xlYW58b2JqZWN0O1xuICAgIEBJbnB1dCgpIHJvb3RFbGVtZW50ICAgICAgICAgICAgIDogU2hhZG93Um9vdDtcbiAgICBASW5wdXQoKSBzY3JvbGxBY3Rpb24gICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBzaG93QW5pbWF0aW9uICAgICAgICAgICA6IGJvb2xlYW58b2JqZWN0O1xuICAgIEBJbnB1dCgpIHRhYiAgICAgICAgICAgICAgICAgICAgIDogYm9vbGVhbnxvYmplY3Q7XG4gICAgQElucHV0KCkgdGFnICAgICAgICAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgdGV4dEFsaWduICAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgdGl0bGUgICAgICAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgd2VpZ2h0ICAgICAgICAgICAgICAgICAgOiBudW1iZXI7XG5cbiAgICAgLy8gQ29uZmlncyBhbmQgcHJvcGVydGllc1xuICAgIEBJbnB1dCgpIGFsaWduU2VsZiAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgYmFkZ2UgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBjb250ZW50ICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGRhdGFzZXQgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgZGlzYWJsZWQgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgZXh0cmFEYXRhICA6IGJvb2xlYW58bnVtYmVyfG9iamVjdHxzdHJpbmc7XG4gICAgQElucHV0KCkgZmxleCAgICAgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgaGVpZ2h0ICAgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgaGlkZGVuICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgaHRtbCAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBpZCAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGxhYmVsICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgbWFyZ2luICAgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgbWF4SGVpZ2h0ICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgbWF4V2lkdGggICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgbWluSGVpZ2h0ICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgbWluV2lkdGggICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgcmVhZE9ubHkgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgc2Nyb2xsYWJsZSA6IGJvb2xlYW58U2Nyb2xsZXJ8b2JqZWN0fFBhcnRpYWw8U2Nyb2xsZXJDb25maWc+O1xuICAgIEBJbnB1dCgpIHN0ZXAgICAgICAgOiBudW1iZXI7XG4gICAgQElucHV0KCkgdG9vbHRpcCAgICA6IG9iamVjdHxzdHJpbmc7XG4gICAgQElucHV0KCkgdHJpZ2dlcnMgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSB2YWx1ZSAgICAgIDogbnVtYmVyfGFueTtcbiAgICBASW5wdXQoKSB3aWR0aCAgICAgIDogbnVtYmVyfHN0cmluZztcbiAgICBASW5wdXQoKSB4ICAgICAgICAgIDogbnVtYmVyO1xuICAgIEBJbnB1dCgpIHkgICAgICAgICAgOiBudW1iZXI7XG5cbiAgICAgLy8gUHJvcGVydGllcyBvbmx5XG4gICAgQElucHV0KCkgYW5jaG9yU2l6ZSA6IG51bWJlcltdO1xuXG4gICAgIC8vIEV2ZW50c1xuICAgIEBPdXRwdXQoKSBvbkFjdGlvbiAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25CZWZvcmVEZXN0cm95ID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uQmVmb3JlSGlkZSAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkJlZm9yZVNob3cgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25DYXRjaEFsbCAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uQ2hhbmdlICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkNsZWFyICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25EZXN0cm95ICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uRm9jdXNJbiAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkZvY3VzT3V0ICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25IaWRlICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uSW5wdXQgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvblBhaW50ICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25SZWFkT25seSAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uUmVzaXplICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvblNob3cgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25UcmlnZ2VyICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYW5kIGFwcGVuZCB0aGUgdW5kZXJseWluZyB3aWRnZXRcbiAgICAgKi9cbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICAgY29uc3RcbiAgICAgICAgICAgIG1lID0gdGhpcyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50UmVmLFxuICAgICAgICAgICAgICAgIGJyeW50dW1Db25maWdcbiAgICAgICAgICAgIH0gPSBtZSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpbnN0YW5jZUNsYXNzLFxuICAgICAgICAgICAgICAgIGJyeW50dW1Db25maWdzXG4gICAgICAgICAgICB9ID0gQnJ5bnR1bU51bWJlckZpZWxkQ29tcG9uZW50O1xuXG4gICAgICAgIE9iamVjdC5hc3NpZ24oYnJ5bnR1bUNvbmZpZywge1xuICAgICAgICAgICAgbGlzdGVuZXJzIDoge1xuICAgICAgICAgICAgICAgIGFjdGlvbihldmVudCA6IGFueSkgeyBtZS5vbkFjdGlvbi5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBiZWZvcmVEZXN0cm95KGV2ZW50IDogYW55KSB7IG1lLm9uQmVmb3JlRGVzdHJveS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBiZWZvcmVIaWRlKGV2ZW50IDogYW55KSB7IG1lLm9uQmVmb3JlSGlkZS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBiZWZvcmVTaG93KGV2ZW50IDogYW55KSB7IG1lLm9uQmVmb3JlU2hvdy5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBjYXRjaEFsbChldmVudCA6IGFueSkgeyBtZS5vbkNhdGNoQWxsLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGNoYW5nZShldmVudCA6IGFueSkgeyBtZS5vbkNoYW5nZS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBjbGVhcihldmVudCA6IGFueSkgeyBtZS5vbkNsZWFyLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGRlc3Ryb3koZXZlbnQgOiBhbnkpIHsgbWUub25EZXN0cm95LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGZvY3VzSW4oZXZlbnQgOiBhbnkpIHsgbWUub25Gb2N1c0luLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGZvY3VzT3V0KGV2ZW50IDogYW55KSB7IG1lLm9uRm9jdXNPdXQuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgaGlkZShldmVudCA6IGFueSkgeyBtZS5vbkhpZGUuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgaW5wdXQoZXZlbnQgOiBhbnkpIHsgbWUub25JbnB1dC5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBwYWludChldmVudCA6IGFueSkgeyBtZS5vblBhaW50LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIHJlYWRPbmx5KGV2ZW50IDogYW55KSB7IG1lLm9uUmVhZE9ubHkuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgcmVzaXplKGV2ZW50IDogYW55KSB7IG1lLm9uUmVzaXplLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIHNob3coZXZlbnQgOiBhbnkpIHsgbWUub25TaG93LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIHRyaWdnZXIoZXZlbnQgOiBhbnkpIHsgbWUub25UcmlnZ2VyLmVtaXQoZXZlbnQpOyB9LFxuXG4gICAgICAgICAgICAgICAgdGhpc09iaiA6IG1lXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIElmIGNvbXBvbmVudCBoYXMgbm8gY29udGFpbmVyIHNwZWNpZmllZCBpbiBjb25maWcgdGhlbiB1c2UgYWRvcHQgdG8gV3JhcHBlcidzIGVsZW1lbnRcbiAgICAgICAgY29uc3RcbiAgICAgICAgICAgIGNvbnRhaW5lclBhcmFtID0gW1xuICAgICAgICAgICAgICAgICdhZG9wdCcsXG4gICAgICAgICAgICAgICAgJ2FwcGVuZFRvJyxcbiAgICAgICAgICAgICAgICAnaW5zZXJ0QWZ0ZXInLFxuICAgICAgICAgICAgICAgICdpbnNlcnRCZWZvcmUnXG4gICAgICAgICAgICBdLmZpbmQocHJvcCA9PiBicnludHVtQ29uZmlnW3Byb3BdKTtcbiAgICAgICAgaWYgKCFjb250YWluZXJQYXJhbSkge1xuICAgICAgICAgICAgYnJ5bnR1bUNvbmZpZy5hZG9wdCA9IGVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIFdyYXBwZXJIZWxwZXIuZGV2V2FybmluZ0NvbnRhaW5lcihpbnN0YW5jZUNsYXNzLiRuYW1lLCBjb250YWluZXJQYXJhbSk7XG4gICAgICAgIH1cblxuICAgICAgICBicnludHVtQ29uZmlncy5maWx0ZXIocHJvcCA9PiBwcm9wIGluIHRoaXMpLmZvckVhY2gocHJvcCA9PiB7XG4gICAgICAgICAgICBXcmFwcGVySGVscGVyLmFwcGx5UHJvcFZhbHVlKGJyeW50dW1Db25maWcsIHByb3AsIHRoaXNbcHJvcF0pO1xuICAgICAgICAgICAgaWYgKFsnZmVhdHVyZXMnLCAnY29uZmlnJ10uaW5jbHVkZXMocHJvcCkpIHtcbiAgICAgICAgICAgICAgICBXcmFwcGVySGVscGVyLmRldldhcm5pbmdDb25maWdQcm9wKGluc3RhbmNlQ2xhc3MuJG5hbWUsIHByb3ApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIG1lLmluc3RhbmNlID0gaW5zdGFuY2VDbGFzcy4kbmFtZSA9PT0gJ1dpZGdldCcgPyBXaWRnZXRIZWxwZXIuY3JlYXRlV2lkZ2V0KGJyeW50dW1Db25maWcpIDogbmV3IGluc3RhbmNlQ2xhc3MoYnJ5bnR1bUNvbmZpZyk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBXYXRjaCBmb3IgY2hhbmdlc1xuICAgICAqIEBwYXJhbSBjaGFuZ2VzXG4gICAgICovXG4gICAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgICAgICBjb25zdFxuICAgICAgICAgICAgeyBpbnN0YW5jZSB9ID0gdGhpcyxcbiAgICAgICAgICAgIHsgaW5zdGFuY2VDbGFzcyB9ID0gQnJ5bnR1bU51bWJlckZpZWxkQ29tcG9uZW50O1xuXG4gICAgICAgIGlmICghaW5zdGFuY2UpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEl0ZXJhdGUgb3ZlciBhbGwgY2hhbmdlc1xuICAgICAgICBPYmplY3QuZW50cmllcyhjaGFuZ2VzKS5mb3JFYWNoKChbcHJvcCwgY2hhbmdlXSkgPT4ge1xuICAgICAgICAgICAgY29uc3RcbiAgICAgICAgICAgICAgICBuZXdWYWx1ZSA9IChjaGFuZ2UgYXMgU2ltcGxlQ2hhbmdlKS5jdXJyZW50VmFsdWUsXG4gICAgICAgICAgICAgICAgeyBpbnN0YW5jZSB9ID0gdGhpcyxcbiAgICAgICAgICAgICAgICB7IGJyeW50dW1Db25maWdzT25seSwgYnJ5bnR1bVByb3BzIH0gPSBCcnludHVtTnVtYmVyRmllbGRDb21wb25lbnQ7XG4gICAgICAgICAgICBpZiAoYnJ5bnR1bVByb3BzLmluY2x1ZGVzKHByb3ApKSB7XG4gICAgICAgICAgICAgICAgV3JhcHBlckhlbHBlci5hcHBseVByb3BWYWx1ZShpbnN0YW5jZSwgcHJvcCwgbmV3VmFsdWUsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICBpZiAoYnJ5bnR1bUNvbmZpZ3NPbmx5LmluY2x1ZGVzKHByb3ApKSB7XG4gICAgICAgICAgICAgICAgICAgIFdyYXBwZXJIZWxwZXIuZGV2V2FybmluZ1VwZGF0ZVByb3AoaW5zdGFuY2VDbGFzcy4kbmFtZSwgcHJvcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZXN0cm95IHRoZSBjb21wb25lbnRcbiAgICAgKi9cbiAgICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaW5zdGFuY2UpIHtcbiAgICAgICAgICAgIHRoaXMuaW5zdGFuY2UuZGVzdHJveSgpO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19