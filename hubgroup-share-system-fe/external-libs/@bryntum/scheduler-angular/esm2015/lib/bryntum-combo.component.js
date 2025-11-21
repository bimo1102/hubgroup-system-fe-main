/**
 * Angular wrapper for Bryntum Combo
 */
import { Component, ElementRef, EventEmitter, Output, Input } from '@angular/core';
import WrapperHelper from './wrapper.helper';
// Bryntum 'scheduler.lite.umd' bundle comes without polyfills to support Angular's zone.js
import { Base, Widget } from '@bryntum/scheduler/scheduler.lite.umd.js';
import { Combo, WidgetHelper } from '@bryntum/scheduler/scheduler.lite.umd.js';
export class BryntumComboComponent {
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
        this.onSelect = new EventEmitter();
        this.onShow = new EventEmitter();
        this.onTrigger = new EventEmitter();
        this.elementRef = element;
    }
    /**
     * Create and append the underlying widget
     */
    ngOnInit() {
        const me = this, { elementRef, bryntumConfig } = me, { instanceClass, bryntumConfigs } = BryntumComboComponent;
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
                select(event) { me.onSelect.emit(event); },
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
        const { instance } = this, { instanceClass } = BryntumComboComponent;
        if (!instance) {
            return;
        }
        // Iterate over all changes
        Object.entries(changes).forEach(([prop, change]) => {
            const newValue = change.currentValue, { instance } = this, { bryntumConfigsOnly, bryntumProps } = BryntumComboComponent;
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
BryntumComboComponent.instanceClass = Combo;
BryntumComboComponent.bryntumFeatureNames = [];
BryntumComboComponent.bryntumConfigs = BryntumComboComponent.bryntumFeatureNames.concat([
    'adopt',
    'align',
    'alignSelf',
    'anchor',
    'appendTo',
    'autoClose',
    'autoComplete',
    'autoExpand',
    'autoSelect',
    'badge',
    'bubbleEvents',
    'caseSensitive',
    'centered',
    'chipView',
    'clearable',
    'clearTextOnPickerHide',
    'cls',
    'config',
    'constrainTo',
    'content',
    'contentElementCls',
    'dataset',
    'defaultBindProperty',
    'disabled',
    'displayField',
    'displayValueRenderer',
    'dock',
    'draggable',
    'editable',
    'emptyText',
    'encodeFilterParams',
    'extraData',
    'filterOnEnter',
    'filterOperator',
    'filterParamName',
    'filterSelected',
    'flex',
    'floating',
    'height',
    'hidden',
    'hideAnimation',
    'hidePickerOnSelect',
    'hideTrigger',
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
    'items',
    'keyStrokeChangeDelay',
    'keyStrokeFilterDelay',
    'label',
    'labelCls',
    'labelPosition',
    'labels',
    'labelWidth',
    'listCls',
    'listeners',
    'listItemTpl',
    'localeClass',
    'localizableProperties',
    'margin',
    'maskDefaults',
    'masked',
    'maxHeight',
    'maxLength',
    'maxWidth',
    'minChars',
    'minHeight',
    'minLength',
    'minWidth',
    'monitorResize',
    'multiSelect',
    'name',
    'overlayAnchor',
    'owner',
    'picker',
    'pickerAlignElement',
    'pickerWidth',
    'placeholder',
    'positioned',
    'preventTooltipOnTouch',
    'primaryFilter',
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
    'triggerAction',
    'triggers',
    'validateFilter',
    'value',
    'valueField',
    'weight',
    'width',
    'x',
    'y'
]);
BryntumComboComponent.bryntumConfigsOnly = [
    'adopt',
    'align',
    'anchor',
    'appendTo',
    'autoClose',
    'autoComplete',
    'autoExpand',
    'autoSelect',
    'bubbleEvents',
    'caseSensitive',
    'centered',
    'chipView',
    'clearable',
    'clearTextOnPickerHide',
    'cls',
    'config',
    'constrainTo',
    'contentElementCls',
    'defaultBindProperty',
    'displayField',
    'displayValueRenderer',
    'dock',
    'draggable',
    'editable',
    'emptyText',
    'encodeFilterParams',
    'filterOnEnter',
    'filterParamName',
    'filterSelected',
    'floating',
    'hideAnimation',
    'hidePickerOnSelect',
    'hideTrigger',
    'highlightExternalChange',
    'hint',
    'hintHtml',
    'htmlCls',
    'inputAlign',
    'inputAttributes',
    'inputWidth',
    'insertBefore',
    'insertFirst',
    'items',
    'keyStrokeChangeDelay',
    'keyStrokeFilterDelay',
    'labelCls',
    'labelPosition',
    'labels',
    'labelWidth',
    'listCls',
    'listeners',
    'listItemTpl',
    'localeClass',
    'localizableProperties',
    'maskDefaults',
    'masked',
    'maxLength',
    'minChars',
    'minLength',
    'monitorResize',
    'multiSelect',
    'name',
    'overlayAnchor',
    'owner',
    'picker',
    'pickerAlignElement',
    'pickerWidth',
    'placeholder',
    'positioned',
    'preventTooltipOnTouch',
    'primaryFilter',
    'required',
    'revertOnEscape',
    'ripple',
    'rootElement',
    'scrollAction',
    'showAnimation',
    'tab',
    'tabIndex',
    'tag',
    'textAlign',
    'title',
    'triggerAction',
    'validateFilter',
    'valueField',
    'weight'
];
BryntumComboComponent.bryntumProps = BryntumComboComponent.bryntumFeatureNames.concat([
    'alignSelf',
    'anchorSize',
    'badge',
    'content',
    'dataset',
    'disabled',
    'extraData',
    'filterOperator',
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
    'store',
    'tooltip',
    'triggers',
    'value',
    'width',
    'x',
    'y'
]);
BryntumComboComponent.decorators = [
    { type: Component, args: [{
                selector: 'bryntum-combo',
                template: ''
            }] }
];
/** @nocollapse */
BryntumComboComponent.ctorParameters = () => [
    { type: ElementRef }
];
BryntumComboComponent.propDecorators = {
    adopt: [{ type: Input }],
    align: [{ type: Input }],
    anchor: [{ type: Input }],
    appendTo: [{ type: Input }],
    autoClose: [{ type: Input }],
    autoComplete: [{ type: Input }],
    autoExpand: [{ type: Input }],
    autoSelect: [{ type: Input }],
    bubbleEvents: [{ type: Input }],
    caseSensitive: [{ type: Input }],
    centered: [{ type: Input }],
    chipView: [{ type: Input }],
    clearable: [{ type: Input }],
    clearTextOnPickerHide: [{ type: Input }],
    cls: [{ type: Input }],
    config: [{ type: Input }],
    constrainTo: [{ type: Input }],
    contentElementCls: [{ type: Input }],
    defaultBindProperty: [{ type: Input }],
    displayField: [{ type: Input }],
    displayValueRenderer: [{ type: Input }],
    dock: [{ type: Input }],
    draggable: [{ type: Input }],
    editable: [{ type: Input }],
    emptyText: [{ type: Input }],
    encodeFilterParams: [{ type: Input }],
    filterOnEnter: [{ type: Input }],
    filterParamName: [{ type: Input }],
    filterSelected: [{ type: Input }],
    floating: [{ type: Input }],
    hideAnimation: [{ type: Input }],
    hidePickerOnSelect: [{ type: Input }],
    hideTrigger: [{ type: Input }],
    highlightExternalChange: [{ type: Input }],
    hint: [{ type: Input }],
    hintHtml: [{ type: Input }],
    htmlCls: [{ type: Input }],
    inputAlign: [{ type: Input }],
    inputAttributes: [{ type: Input }],
    inputWidth: [{ type: Input }],
    insertBefore: [{ type: Input }],
    insertFirst: [{ type: Input }],
    items: [{ type: Input }],
    keyStrokeChangeDelay: [{ type: Input }],
    keyStrokeFilterDelay: [{ type: Input }],
    labelCls: [{ type: Input }],
    labelPosition: [{ type: Input }],
    labels: [{ type: Input }],
    labelWidth: [{ type: Input }],
    listCls: [{ type: Input }],
    listeners: [{ type: Input }],
    listItemTpl: [{ type: Input }],
    localeClass: [{ type: Input }],
    localizableProperties: [{ type: Input }],
    maskDefaults: [{ type: Input }],
    masked: [{ type: Input }],
    maxLength: [{ type: Input }],
    minChars: [{ type: Input }],
    minLength: [{ type: Input }],
    monitorResize: [{ type: Input }],
    multiSelect: [{ type: Input }],
    name: [{ type: Input }],
    overlayAnchor: [{ type: Input }],
    owner: [{ type: Input }],
    picker: [{ type: Input }],
    pickerAlignElement: [{ type: Input }],
    pickerWidth: [{ type: Input }],
    placeholder: [{ type: Input }],
    positioned: [{ type: Input }],
    preventTooltipOnTouch: [{ type: Input }],
    primaryFilter: [{ type: Input }],
    required: [{ type: Input }],
    revertOnEscape: [{ type: Input }],
    ripple: [{ type: Input }],
    rootElement: [{ type: Input }],
    scrollAction: [{ type: Input }],
    showAnimation: [{ type: Input }],
    tab: [{ type: Input }],
    tabIndex: [{ type: Input }],
    tag: [{ type: Input }],
    textAlign: [{ type: Input }],
    title: [{ type: Input }],
    triggerAction: [{ type: Input }],
    validateFilter: [{ type: Input }],
    valueField: [{ type: Input }],
    weight: [{ type: Input }],
    alignSelf: [{ type: Input }],
    badge: [{ type: Input }],
    content: [{ type: Input }],
    dataset: [{ type: Input }],
    disabled: [{ type: Input }],
    extraData: [{ type: Input }],
    filterOperator: [{ type: Input }],
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
    store: [{ type: Input }],
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
    onSelect: [{ type: Output }],
    onShow: [{ type: Output }],
    onTrigger: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJ5bnR1bS1jb21iby5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYnJ5bnR1bS9zY2hlZHVsZXItYW5ndWxhci8iLCJzb3VyY2VzIjpbImxpYi9icnludHVtLWNvbWJvLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7R0FFRztBQUVILE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBcUIsTUFBTSxFQUFFLEtBQUssRUFBK0IsTUFBTSxlQUFlLENBQUM7QUFDbkksT0FBTyxhQUFhLE1BQU0sa0JBQWtCLENBQUM7QUFFN0MsMkZBQTJGO0FBQzNGLE9BQU8sRUFBRSxJQUFJLEVBQTZFLE1BQU0sRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBQ25KLE9BQU8sRUFBRSxLQUFLLEVBQWdCLFlBQVksRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBTTdGLE1BQU0sT0FBTyxxQkFBcUI7SUE4UDlCLFlBQVksT0FBbUI7UUFQdkIsa0JBQWEsR0FBRztZQUNwQixnQkFBZ0IsRUFBRyxJQUFJO1lBQ3ZCLEtBQUssRUFBYyxTQUFTO1lBQzVCLFNBQVMsRUFBVSxFQUFFO1lBQ3JCLFFBQVEsRUFBVyxFQUFFO1NBQ3hCLENBQUM7UUE4SEQsU0FBUztRQUNBLGFBQVEsR0FBVSxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQzdDLG9CQUFlLEdBQUcsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUM3QyxpQkFBWSxHQUFNLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsaUJBQVksR0FBTSxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQzdDLGVBQVUsR0FBUSxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQzdDLGFBQVEsR0FBVSxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQzdDLFlBQU8sR0FBVyxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQzdDLGNBQVMsR0FBUyxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQzdDLGNBQVMsR0FBUyxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQzdDLGVBQVUsR0FBUSxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQzdDLFdBQU0sR0FBWSxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQzdDLFlBQU8sR0FBVyxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQzdDLFlBQU8sR0FBVyxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQzdDLGVBQVUsR0FBUSxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQzdDLGFBQVEsR0FBVSxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQzdDLGFBQVEsR0FBVSxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQzdDLFdBQU0sR0FBWSxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQzdDLGNBQVMsR0FBUyxJQUFJLFlBQVksRUFBVSxDQUFDO1FBN0luRCxJQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQztJQUM5QixDQUFDO0lBOElEOztPQUVHO0lBQ0gsUUFBUTtRQUNKLE1BQ0ksRUFBRSxHQUFHLElBQUksRUFDVCxFQUNJLFVBQVUsRUFDVixhQUFhLEVBQ2hCLEdBQUcsRUFBRSxFQUNOLEVBQ0ksYUFBYSxFQUNiLGNBQWMsRUFDakIsR0FBRyxxQkFBcUIsQ0FBQztRQUU5QixNQUFNLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRTtZQUN6QixTQUFTLEVBQUc7Z0JBQ1IsTUFBTSxDQUFDLEtBQVcsSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hELGFBQWEsQ0FBQyxLQUFXLElBQUksRUFBRSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM5RCxVQUFVLENBQUMsS0FBVyxJQUFJLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEQsVUFBVSxDQUFDLEtBQVcsSUFBSSxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hELFFBQVEsQ0FBQyxLQUFXLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNwRCxNQUFNLENBQUMsS0FBVyxJQUFJLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEQsS0FBSyxDQUFDLEtBQVcsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlDLE9BQU8sQ0FBQyxLQUFXLElBQUksRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsRCxPQUFPLENBQUMsS0FBVyxJQUFJLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEQsUUFBUSxDQUFDLEtBQVcsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BELElBQUksQ0FBQyxLQUFXLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM1QyxLQUFLLENBQUMsS0FBVyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDOUMsS0FBSyxDQUFDLEtBQVcsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlDLFFBQVEsQ0FBQyxLQUFXLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNwRCxNQUFNLENBQUMsS0FBVyxJQUFJLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEQs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S0FBSzs2QkFDTCxLQUFLO3lCQUNMLEtBQUs7cUJBQ0wsS0FBSzt3QkFHTCxLQUFLO29CQUNMLEtBQUs7c0JBQ0wsS0FBSztzQkFDTCxLQUFLO3VCQUNMLEtBQUs7d0JBQ0wsS0FBSzs2QkFDTCxLQUFLO21CQUNMLEtBQUs7cUJBQ0wsS0FBSztxQkFDTCxLQUFLO21CQUNMLEtBQUs7aUJBQ0wsS0FBSztvQkFDTCxLQUFLO3FCQUNMLEtBQUs7d0JBQ0wsS0FBSzt1QkFDTCxLQUFLO3dCQUNMLEtBQUs7dUJBQ0wsS0FBSzt1QkFDTCxLQUFLO3lCQUNMLEtBQUs7b0JBQ0wsS0FBSztzQkFDTCxLQUFLO3VCQUNMLEtBQUs7b0JBQ0wsS0FBSztvQkFDTCxLQUFLO2dCQUNMLEtBQUs7Z0JBQ0wsS0FBSzt5QkFHTCxLQUFLO3VCQUdMLE1BQU07OEJBQ04sTUFBTTsyQkFDTixNQUFNOzJCQUNOLE1BQU07eUJBQ04sTUFBTTt1QkFDTixNQUFNO3NCQUNOLE1BQU07d0JBQ04sTUFBTTt3QkFDTixNQUFNO3lCQUNOLE1BQU07cUJBQ04sTUFBTTtzQkFDTixNQUFNO3NCQUNOLE1BQU07eUJBQ04sTUFBTTt1QkFDTixNQUFNO3VCQUNOLE1BQU07cUJBQ04sTUFBTTt3QkFDTixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBBbmd1bGFyIHdyYXBwZXIgZm9yIEJyeW50dW0gQ29tYm9cbiAqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgT25EZXN0cm95LCBPbkluaXQsIE91dHB1dCwgSW5wdXQsIFNpbXBsZUNoYW5nZSwgU2ltcGxlQ2hhbmdlcyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IFdyYXBwZXJIZWxwZXIgZnJvbSAnLi93cmFwcGVyLmhlbHBlcic7XG5cbi8vIEJyeW50dW0gJ3NjaGVkdWxlci5saXRlLnVtZCcgYnVuZGxlIGNvbWVzIHdpdGhvdXQgcG9seWZpbGxzIHRvIHN1cHBvcnQgQW5ndWxhcidzIHpvbmUuanNcbmltcG9ydCB7IEJhc2UsIE1hc2ssIE1hc2tDb25maWcsIFJlY3RhbmdsZSwgU2Nyb2xsZXIsIFNjcm9sbGVyQ29uZmlnLCBTdG9yZSwgU3RvcmVDb25maWcsIFdpZGdldCB9IGZyb20gJ0BicnludHVtL3NjaGVkdWxlci9zY2hlZHVsZXIubGl0ZS51bWQuanMnO1xuaW1wb3J0IHsgQ29tYm8sIFN0cmluZ0hlbHBlciwgV2lkZ2V0SGVscGVyIH0gZnJvbSAnQGJyeW50dW0vc2NoZWR1bGVyL3NjaGVkdWxlci5saXRlLnVtZC5qcyc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yIDogJ2JyeW50dW0tY29tYm8nLFxuICAgIHRlbXBsYXRlIDogJydcbn0pXG5leHBvcnQgY2xhc3MgQnJ5bnR1bUNvbWJvQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuXG4gICAgcHVibGljIHN0YXRpYyBpbnN0YW5jZUNsYXNzID0gQ29tYm87XG5cbiAgICBwcml2YXRlIHN0YXRpYyBicnludHVtRmVhdHVyZU5hbWVzOiBzdHJpbmdbXSA9IFtcblxuICAgIF07XG5cbiAgICBwcml2YXRlIHN0YXRpYyBicnludHVtQ29uZmlnczogc3RyaW5nW10gPSBCcnludHVtQ29tYm9Db21wb25lbnQuYnJ5bnR1bUZlYXR1cmVOYW1lcy5jb25jYXQoW1xuICAgICAgICAnYWRvcHQnLFxuICAgICAgICAnYWxpZ24nLFxuICAgICAgICAnYWxpZ25TZWxmJyxcbiAgICAgICAgJ2FuY2hvcicsXG4gICAgICAgICdhcHBlbmRUbycsXG4gICAgICAgICdhdXRvQ2xvc2UnLFxuICAgICAgICAnYXV0b0NvbXBsZXRlJyxcbiAgICAgICAgJ2F1dG9FeHBhbmQnLFxuICAgICAgICAnYXV0b1NlbGVjdCcsXG4gICAgICAgICdiYWRnZScsXG4gICAgICAgICdidWJibGVFdmVudHMnLFxuICAgICAgICAnY2FzZVNlbnNpdGl2ZScsXG4gICAgICAgICdjZW50ZXJlZCcsXG4gICAgICAgICdjaGlwVmlldycsXG4gICAgICAgICdjbGVhcmFibGUnLFxuICAgICAgICAnY2xlYXJUZXh0T25QaWNrZXJIaWRlJyxcbiAgICAgICAgJ2NscycsXG4gICAgICAgICdjb25maWcnLFxuICAgICAgICAnY29uc3RyYWluVG8nLFxuICAgICAgICAnY29udGVudCcsXG4gICAgICAgICdjb250ZW50RWxlbWVudENscycsXG4gICAgICAgICdkYXRhc2V0JyxcbiAgICAgICAgJ2RlZmF1bHRCaW5kUHJvcGVydHknLFxuICAgICAgICAnZGlzYWJsZWQnLFxuICAgICAgICAnZGlzcGxheUZpZWxkJyxcbiAgICAgICAgJ2Rpc3BsYXlWYWx1ZVJlbmRlcmVyJyxcbiAgICAgICAgJ2RvY2snLFxuICAgICAgICAnZHJhZ2dhYmxlJyxcbiAgICAgICAgJ2VkaXRhYmxlJyxcbiAgICAgICAgJ2VtcHR5VGV4dCcsXG4gICAgICAgICdlbmNvZGVGaWx0ZXJQYXJhbXMnLFxuICAgICAgICAnZXh0cmFEYXRhJyxcbiAgICAgICAgJ2ZpbHRlck9uRW50ZXInLFxuICAgICAgICAnZmlsdGVyT3BlcmF0b3InLFxuICAgICAgICAnZmlsdGVyUGFyYW1OYW1lJyxcbiAgICAgICAgJ2ZpbHRlclNlbGVjdGVkJyxcbiAgICAgICAgJ2ZsZXgnLFxuICAgICAgICAnZmxvYXRpbmcnLFxuICAgICAgICAnaGVpZ2h0JyxcbiAgICAgICAgJ2hpZGRlbicsXG4gICAgICAgICdoaWRlQW5pbWF0aW9uJyxcbiAgICAgICAgJ2hpZGVQaWNrZXJPblNlbGVjdCcsXG4gICAgICAgICdoaWRlVHJpZ2dlcicsXG4gICAgICAgICdoaWdobGlnaHRFeHRlcm5hbENoYW5nZScsXG4gICAgICAgICdoaW50JyxcbiAgICAgICAgJ2hpbnRIdG1sJyxcbiAgICAgICAgJ2h0bWwnLFxuICAgICAgICAnaHRtbENscycsXG4gICAgICAgICdpZCcsXG4gICAgICAgICdpbnB1dEFsaWduJyxcbiAgICAgICAgJ2lucHV0QXR0cmlidXRlcycsXG4gICAgICAgICdpbnB1dFdpZHRoJyxcbiAgICAgICAgJ2luc2VydEJlZm9yZScsXG4gICAgICAgICdpbnNlcnRGaXJzdCcsXG4gICAgICAgICdpdGVtcycsXG4gICAgICAgICdrZXlTdHJva2VDaGFuZ2VEZWxheScsXG4gICAgICAgICdrZXlTdHJva2VGaWx0ZXJEZWxheScsXG4gICAgICAgICdsYWJlbCcsXG4gICAgICAgICdsYWJlbENscycsXG4gICAgICAgICdsYWJlbFBvc2l0aW9uJyxcbiAgICAgICAgJ2xhYmVscycsXG4gICAgICAgICdsYWJlbFdpZHRoJyxcbiAgICAgICAgJ2xpc3RDbHMnLFxuICAgICAgICAnbGlzdGVuZXJzJyxcbiAgICAgICAgJ2xpc3RJdGVtVHBsJyxcbiAgICAgICAgJ2xvY2FsZUNsYXNzJyxcbiAgICAgICAgJ2xvY2FsaXphYmxlUHJvcGVydGllcycsXG4gICAgICAgICdtYXJnaW4nLFxuICAgICAgICAnbWFza0RlZmF1bHRzJyxcbiAgICAgICAgJ21hc2tlZCcsXG4gICAgICAgICdtYXhIZWlnaHQnLFxuICAgICAgICAnbWF4TGVuZ3RoJyxcbiAgICAgICAgJ21heFdpZHRoJyxcbiAgICAgICAgJ21pbkNoYXJzJyxcbiAgICAgICAgJ21pbkhlaWdodCcsXG4gICAgICAgICdtaW5MZW5ndGgnLFxuICAgICAgICAnbWluV2lkdGgnLFxuICAgICAgICAnbW9uaXRvclJlc2l6ZScsXG4gICAgICAgICdtdWx0aVNlbGVjdCcsXG4gICAgICAgICduYW1lJyxcbiAgICAgICAgJ292ZXJsYXlBbmNob3InLFxuICAgICAgICAnb3duZXInLFxuICAgICAgICAncGlja2VyJyxcbiAgICAgICAgJ3BpY2tlckFsaWduRWxlbWVudCcsXG4gICAgICAgICdwaWNrZXJXaWR0aCcsXG4gICAgICAgICdwbGFjZWhvbGRlcicsXG4gICAgICAgICdwb3NpdGlvbmVkJyxcbiAgICAgICAgJ3ByZXZlbnRUb29sdGlwT25Ub3VjaCcsXG4gICAgICAgICdwcmltYXJ5RmlsdGVyJyxcbiAgICAgICAgJ3JlYWRPbmx5JyxcbiAgICAgICAgJ3JlcXVpcmVkJyxcbiAgICAgICAgJ3JldmVydE9uRXNjYXBlJyxcbiAgICAgICAgJ3JpcHBsZScsXG4gICAgICAgICdyb290RWxlbWVudCcsXG4gICAgICAgICdzY3JvbGxhYmxlJyxcbiAgICAgICAgJ3Njcm9sbEFjdGlvbicsXG4gICAgICAgICdzaG93QW5pbWF0aW9uJyxcbiAgICAgICAgJ3N0b3JlJyxcbiAgICAgICAgJ3RhYicsXG4gICAgICAgICd0YWJJbmRleCcsXG4gICAgICAgICd0YWcnLFxuICAgICAgICAndGV4dEFsaWduJyxcbiAgICAgICAgJ3RpdGxlJyxcbiAgICAgICAgJ3Rvb2x0aXAnLFxuICAgICAgICAndHJpZ2dlckFjdGlvbicsXG4gICAgICAgICd0cmlnZ2VycycsXG4gICAgICAgICd2YWxpZGF0ZUZpbHRlcicsXG4gICAgICAgICd2YWx1ZScsXG4gICAgICAgICd2YWx1ZUZpZWxkJyxcbiAgICAgICAgJ3dlaWdodCcsXG4gICAgICAgICd3aWR0aCcsXG4gICAgICAgICd4JyxcbiAgICAgICAgJ3knXG4gICAgXSk7XG5cbiAgICBwcml2YXRlIHN0YXRpYyBicnludHVtQ29uZmlnc09ubHk6IHN0cmluZ1tdID0gW1xuICAgICAgICAnYWRvcHQnLFxuICAgICAgICAnYWxpZ24nLFxuICAgICAgICAnYW5jaG9yJyxcbiAgICAgICAgJ2FwcGVuZFRvJyxcbiAgICAgICAgJ2F1dG9DbG9zZScsXG4gICAgICAgICdhdXRvQ29tcGxldGUnLFxuICAgICAgICAnYXV0b0V4cGFuZCcsXG4gICAgICAgICdhdXRvU2VsZWN0JyxcbiAgICAgICAgJ2J1YmJsZUV2ZW50cycsXG4gICAgICAgICdjYXNlU2Vuc2l0aXZlJyxcbiAgICAgICAgJ2NlbnRlcmVkJyxcbiAgICAgICAgJ2NoaXBWaWV3JyxcbiAgICAgICAgJ2NsZWFyYWJsZScsXG4gICAgICAgICdjbGVhclRleHRPblBpY2tlckhpZGUnLFxuICAgICAgICAnY2xzJyxcbiAgICAgICAgJ2NvbmZpZycsXG4gICAgICAgICdjb25zdHJhaW5UbycsXG4gICAgICAgICdjb250ZW50RWxlbWVudENscycsXG4gICAgICAgICdkZWZhdWx0QmluZFByb3BlcnR5JyxcbiAgICAgICAgJ2Rpc3BsYXlGaWVsZCcsXG4gICAgICAgICdkaXNwbGF5VmFsdWVSZW5kZXJlcicsXG4gICAgICAgICdkb2NrJyxcbiAgICAgICAgJ2RyYWdnYWJsZScsXG4gICAgICAgICdlZGl0YWJsZScsXG4gICAgICAgICdlbXB0eVRleHQnLFxuICAgICAgICAnZW5jb2RlRmlsdGVyUGFyYW1zJyxcbiAgICAgICAgJ2ZpbHRlck9uRW50ZXInLFxuICAgICAgICAnZmlsdGVyUGFyYW1OYW1lJyxcbiAgICAgICAgJ2ZpbHRlclNlbGVjdGVkJyxcbiAgICAgICAgJ2Zsb2F0aW5nJyxcbiAgICAgICAgJ2hpZGVBbmltYXRpb24nLFxuICAgICAgICAnaGlkZVBpY2tlck9uU2VsZWN0JyxcbiAgICAgICAgJ2hpZGVUcmlnZ2VyJyxcbiAgICAgICAgJ2hpZ2hsaWdodEV4dGVybmFsQ2hhbmdlJyxcbiAgICAgICAgJ2hpbnQnLFxuICAgICAgICAnaGludEh0bWwnLFxuICAgICAgICAnaHRtbENscycsXG4gICAgICAgICdpbnB1dEFsaWduJyxcbiAgICAgICAgJ2lucHV0QXR0cmlidXRlcycsXG4gICAgICAgICdpbnB1dFdpZHRoJyxcbiAgICAgICAgJ2luc2VydEJlZm9yZScsXG4gICAgICAgICdpbnNlcnRGaXJzdCcsXG4gICAgICAgICdpdGVtcycsXG4gICAgICAgICdrZXlTdHJva2VDaGFuZ2VEZWxheScsXG4gICAgICAgICdrZXlTdHJva2VGaWx0ZXJEZWxheScsXG4gICAgICAgICdsYWJlbENscycsXG4gICAgICAgICdsYWJlbFBvc2l0aW9uJyxcbiAgICAgICAgJ2xhYmVscycsXG4gICAgICAgICdsYWJlbFdpZHRoJyxcbiAgICAgICAgJ2xpc3RDbHMnLFxuICAgICAgICAnbGlzdGVuZXJzJyxcbiAgICAgICAgJ2xpc3RJdGVtVHBsJyxcbiAgICAgICAgJ2xvY2FsZUNsYXNzJyxcbiAgICAgICAgJ2xvY2FsaXphYmxlUHJvcGVydGllcycsXG4gICAgICAgICdtYXNrRGVmYXVsdHMnLFxuICAgICAgICAnbWFza2VkJyxcbiAgICAgICAgJ21heExlbmd0aCcsXG4gICAgICAgICdtaW5DaGFycycsXG4gICAgICAgICdtaW5MZW5ndGgnLFxuICAgICAgICAnbW9uaXRvclJlc2l6ZScsXG4gICAgICAgICdtdWx0aVNlbGVjdCcsXG4gICAgICAgICduYW1lJyxcbiAgICAgICAgJ292ZXJsYXlBbmNob3InLFxuICAgICAgICAnb3duZXInLFxuICAgICAgICAncGlja2VyJyxcbiAgICAgICAgJ3BpY2tlckFsaWduRWxlbWVudCcsXG4gICAgICAgICdwaWNrZXJXaWR0aCcsXG4gICAgICAgICdwbGFjZWhvbGRlcicsXG4gICAgICAgICdwb3NpdGlvbmVkJyxcbiAgICAgICAgJ3ByZXZlbnRUb29sdGlwT25Ub3VjaCcsXG4gICAgICAgICdwcmltYXJ5RmlsdGVyJyxcbiAgICAgICAgJ3JlcXVpcmVkJyxcbiAgICAgICAgJ3JldmVydE9uRXNjYXBlJyxcbiAgICAgICAgJ3JpcHBsZScsXG4gICAgICAgICdyb290RWxlbWVudCcsXG4gICAgICAgICdzY3JvbGxBY3Rpb24nLFxuICAgICAgICAnc2hvd0FuaW1hdGlvbicsXG4gICAgICAgICd0YWInLFxuICAgICAgICAndGFiSW5kZXgnLFxuICAgICAgICAndGFnJyxcbiAgICAgICAgJ3RleHRBbGlnbicsXG4gICAgICAgICd0aXRsZScsXG4gICAgICAgICd0cmlnZ2VyQWN0aW9uJyxcbiAgICAgICAgJ3ZhbGlkYXRlRmlsdGVyJyxcbiAgICAgICAgJ3ZhbHVlRmllbGQnLFxuICAgICAgICAnd2VpZ2h0J1xuICAgIF07XG5cbiAgICBwcml2YXRlIHN0YXRpYyBicnludHVtUHJvcHM6IHN0cmluZ1tdID0gQnJ5bnR1bUNvbWJvQ29tcG9uZW50LmJyeW50dW1GZWF0dXJlTmFtZXMuY29uY2F0KFtcbiAgICAgICAgJ2FsaWduU2VsZicsXG4gICAgICAgICdhbmNob3JTaXplJyxcbiAgICAgICAgJ2JhZGdlJyxcbiAgICAgICAgJ2NvbnRlbnQnLFxuICAgICAgICAnZGF0YXNldCcsXG4gICAgICAgICdkaXNhYmxlZCcsXG4gICAgICAgICdleHRyYURhdGEnLFxuICAgICAgICAnZmlsdGVyT3BlcmF0b3InLFxuICAgICAgICAnZmxleCcsXG4gICAgICAgICdoZWlnaHQnLFxuICAgICAgICAnaGlkZGVuJyxcbiAgICAgICAgJ2h0bWwnLFxuICAgICAgICAnaWQnLFxuICAgICAgICAnbGFiZWwnLFxuICAgICAgICAnbWFyZ2luJyxcbiAgICAgICAgJ21heEhlaWdodCcsXG4gICAgICAgICdtYXhXaWR0aCcsXG4gICAgICAgICdtaW5IZWlnaHQnLFxuICAgICAgICAnbWluV2lkdGgnLFxuICAgICAgICAncmVhZE9ubHknLFxuICAgICAgICAnc2Nyb2xsYWJsZScsXG4gICAgICAgICdzdG9yZScsXG4gICAgICAgICd0b29sdGlwJyxcbiAgICAgICAgJ3RyaWdnZXJzJyxcbiAgICAgICAgJ3ZhbHVlJyxcbiAgICAgICAgJ3dpZHRoJyxcbiAgICAgICAgJ3gnLFxuICAgICAgICAneSdcbiAgICBdKTtcblxuICAgIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZjtcbiAgICBwdWJsaWMgaW5zdGFuY2U6IENvbWJvO1xuXG4gICAgcHJpdmF0ZSBicnludHVtQ29uZmlnID0ge1xuICAgICAgICBhbmd1bGFyQ29tcG9uZW50IDogdGhpcyxcbiAgICAgICAgYWRvcHQgICAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgbGlzdGVuZXJzICAgICAgICA6IHt9LFxuICAgICAgICBmZWF0dXJlcyAgICAgICAgIDoge31cbiAgICB9O1xuXG4gICAgY29uc3RydWN0b3IoZWxlbWVudDogRWxlbWVudFJlZikge1xuICAgICAgICB0aGlzLmVsZW1lbnRSZWYgPSBlbGVtZW50O1xuICAgIH1cblxuICAgICAvLyBDb25maWdzIG9ubHlcbiAgICBASW5wdXQoKSBhZG9wdCAgICAgICAgICAgICAgICAgICA6IEhUTUxFbGVtZW50fHN0cmluZztcbiAgICBASW5wdXQoKSBhbGlnbiAgICAgICAgICAgICAgICAgICA6IG9iamVjdHxzdHJpbmc7XG4gICAgQElucHV0KCkgYW5jaG9yICAgICAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGFwcGVuZFRvICAgICAgICAgICAgICAgIDogSFRNTEVsZW1lbnR8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGF1dG9DbG9zZSAgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBhdXRvQ29tcGxldGUgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBhdXRvRXhwYW5kICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgYXV0b1NlbGVjdCAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGJ1YmJsZUV2ZW50cyAgICAgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIGNhc2VTZW5zaXRpdmUgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBjZW50ZXJlZCAgICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgY2hpcFZpZXcgICAgICAgICAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgY2xlYXJhYmxlICAgICAgICAgICAgICAgOiBib29sZWFufG9iamVjdDtcbiAgICBASW5wdXQoKSBjbGVhclRleHRPblBpY2tlckhpZGUgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgY2xzICAgICAgICAgICAgICAgICAgICAgOiBzdHJpbmd8b2JqZWN0O1xuICAgIEBJbnB1dCgpIGNvbmZpZyAgICAgICAgICAgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIGNvbnN0cmFpblRvICAgICAgICAgICAgIDogSFRNTEVsZW1lbnR8V2lkZ2V0fFJlY3RhbmdsZTtcbiAgICBASW5wdXQoKSBjb250ZW50RWxlbWVudENscyAgICAgICA6IHN0cmluZ3xvYmplY3Q7XG4gICAgQElucHV0KCkgZGVmYXVsdEJpbmRQcm9wZXJ0eSAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgZGlzcGxheUZpZWxkICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgZGlzcGxheVZhbHVlUmVuZGVyZXIgICAgOiBGdW5jdGlvbjtcbiAgICBASW5wdXQoKSBkb2NrICAgICAgICAgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBkcmFnZ2FibGUgICAgICAgICAgICAgICA6IGJvb2xlYW58b2JqZWN0O1xuICAgIEBJbnB1dCgpIGVkaXRhYmxlICAgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBlbXB0eVRleHQgICAgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBlbmNvZGVGaWx0ZXJQYXJhbXMgICAgICA6IEZ1bmN0aW9uO1xuICAgIEBJbnB1dCgpIGZpbHRlck9uRW50ZXIgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBmaWx0ZXJQYXJhbU5hbWUgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBmaWx0ZXJTZWxlY3RlZCAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgZmxvYXRpbmcgICAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGhpZGVBbmltYXRpb24gICAgICAgICAgIDogYm9vbGVhbnxvYmplY3Q7XG4gICAgQElucHV0KCkgaGlkZVBpY2tlck9uU2VsZWN0ICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGhpZGVUcmlnZ2VyICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBoaWdobGlnaHRFeHRlcm5hbENoYW5nZSA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgaGludCAgICAgICAgICAgICAgICAgICAgOiBzdHJpbmd8RnVuY3Rpb247XG4gICAgQElucHV0KCkgaGludEh0bWwgICAgICAgICAgICAgICAgOiBzdHJpbmd8RnVuY3Rpb247XG4gICAgQElucHV0KCkgaHRtbENscyAgICAgICAgICAgICAgICAgOiBzdHJpbmd8b2JqZWN0O1xuICAgIEBJbnB1dCgpIGlucHV0QWxpZ24gICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGlucHV0QXR0cmlidXRlcyAgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIGlucHV0V2lkdGggICAgICAgICAgICAgIDogc3RyaW5nfG51bWJlcjtcbiAgICBASW5wdXQoKSBpbnNlcnRCZWZvcmUgICAgICAgICAgICA6IEhUTUxFbGVtZW50fHN0cmluZztcbiAgICBASW5wdXQoKSBpbnNlcnRGaXJzdCAgICAgICAgICAgICA6IEhUTUxFbGVtZW50fHN0cmluZztcbiAgICBASW5wdXQoKSBpdGVtcyAgICAgICAgICAgICAgICAgICA6IG9iamVjdFtdfHN0cmluZ1tdfG9iamVjdDtcbiAgICBASW5wdXQoKSBrZXlTdHJva2VDaGFuZ2VEZWxheSAgICA6IG51bWJlcjtcbiAgICBASW5wdXQoKSBrZXlTdHJva2VGaWx0ZXJEZWxheSAgICA6IG51bWJlcjtcbiAgICBASW5wdXQoKSBsYWJlbENscyAgICAgICAgICAgICAgICA6IHN0cmluZ3xvYmplY3Q7XG4gICAgQElucHV0KCkgbGFiZWxQb3NpdGlvbiAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgbGFiZWxzICAgICAgICAgICAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgbGFiZWxXaWR0aCAgICAgICAgICAgICAgOiBzdHJpbmd8bnVtYmVyO1xuICAgIEBJbnB1dCgpIGxpc3RDbHMgICAgICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGxpc3RlbmVycyAgICAgICAgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIGxpc3RJdGVtVHBsICAgICAgICAgICAgIDogRnVuY3Rpb247XG4gICAgQElucHV0KCkgbG9jYWxlQ2xhc3MgICAgICAgICAgICAgOiBCYXNlO1xuICAgIEBJbnB1dCgpIGxvY2FsaXphYmxlUHJvcGVydGllcyAgIDogc3RyaW5nW107XG4gICAgQElucHV0KCkgbWFza0RlZmF1bHRzICAgICAgICAgICAgOiBvYmplY3R8TWFza3xQYXJ0aWFsPE1hc2tDb25maWc+O1xuICAgIEBJbnB1dCgpIG1hc2tlZCAgICAgICAgICAgICAgICAgIDogYm9vbGVhbnxzdHJpbmd8b2JqZWN0fE1hc2t8UGFydGlhbDxNYXNrQ29uZmlnPjtcbiAgICBASW5wdXQoKSBtYXhMZW5ndGggICAgICAgICAgICAgICA6IG51bWJlcjtcbiAgICBASW5wdXQoKSBtaW5DaGFycyAgICAgICAgICAgICAgICA6IG51bWJlcjtcbiAgICBASW5wdXQoKSBtaW5MZW5ndGggICAgICAgICAgICAgICA6IG51bWJlcjtcbiAgICBASW5wdXQoKSBtb25pdG9yUmVzaXplICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgbXVsdGlTZWxlY3QgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIG5hbWUgICAgICAgICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIG92ZXJsYXlBbmNob3IgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBvd25lciAgICAgICAgICAgICAgICAgICA6IFdpZGdldDtcbiAgICBASW5wdXQoKSBwaWNrZXIgICAgICAgICAgICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBwaWNrZXJBbGlnbkVsZW1lbnQgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBwaWNrZXJXaWR0aCAgICAgICAgICAgICA6IG51bWJlcjtcbiAgICBASW5wdXQoKSBwbGFjZWhvbGRlciAgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBwb3NpdGlvbmVkICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgcHJldmVudFRvb2x0aXBPblRvdWNoICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHByaW1hcnlGaWx0ZXIgICAgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIHJlcXVpcmVkICAgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSByZXZlcnRPbkVzY2FwZSAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgcmlwcGxlICAgICAgICAgICAgICAgICAgOiBib29sZWFufG9iamVjdDtcbiAgICBASW5wdXQoKSByb290RWxlbWVudCAgICAgICAgICAgICA6IFNoYWRvd1Jvb3Q7XG4gICAgQElucHV0KCkgc2Nyb2xsQWN0aW9uICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgc2hvd0FuaW1hdGlvbiAgICAgICAgICAgOiBib29sZWFufG9iamVjdDtcbiAgICBASW5wdXQoKSB0YWIgICAgICAgICAgICAgICAgICAgICA6IGJvb2xlYW58b2JqZWN0O1xuICAgIEBJbnB1dCgpIHRhYkluZGV4ICAgICAgICAgICAgICAgIDogbnVtYmVyO1xuICAgIEBJbnB1dCgpIHRhZyAgICAgICAgICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIHRleHRBbGlnbiAgICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIHRpdGxlICAgICAgICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIHRyaWdnZXJBY3Rpb24gICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIHZhbGlkYXRlRmlsdGVyICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSB2YWx1ZUZpZWxkICAgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSB3ZWlnaHQgICAgICAgICAgICAgICAgICA6IG51bWJlcjtcblxuICAgICAvLyBDb25maWdzIGFuZCBwcm9wZXJ0aWVzXG4gICAgQElucHV0KCkgYWxpZ25TZWxmICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgYmFkZ2UgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgY29udGVudCAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgZGF0YXNldCAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgZGlzYWJsZWQgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGV4dHJhRGF0YSAgICAgIDogYm9vbGVhbnxudW1iZXJ8b2JqZWN0fHN0cmluZztcbiAgICBASW5wdXQoKSBmaWx0ZXJPcGVyYXRvciA6IHN0cmluZztcbiAgICBASW5wdXQoKSBmbGV4ICAgICAgICAgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgaGVpZ2h0ICAgICAgICAgOiBudW1iZXJ8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGhpZGRlbiAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBodG1sICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBpZCAgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBsYWJlbCAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBtYXJnaW4gICAgICAgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgbWF4SGVpZ2h0ICAgICAgOiBudW1iZXJ8c3RyaW5nO1xuICAgIEBJbnB1dCgpIG1heFdpZHRoICAgICAgIDogbnVtYmVyfHN0cmluZztcbiAgICBASW5wdXQoKSBtaW5IZWlnaHQgICAgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgbWluV2lkdGggICAgICAgOiBudW1iZXJ8c3RyaW5nO1xuICAgIEBJbnB1dCgpIHJlYWRPbmx5ICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBzY3JvbGxhYmxlICAgICA6IGJvb2xlYW58U2Nyb2xsZXJ8b2JqZWN0fFBhcnRpYWw8U2Nyb2xsZXJDb25maWc+O1xuICAgIEBJbnB1dCgpIHN0b3JlICAgICAgICAgIDogU3RvcmV8b2JqZWN0fFBhcnRpYWw8U3RvcmVDb25maWc+O1xuICAgIEBJbnB1dCgpIHRvb2x0aXAgICAgICAgIDogb2JqZWN0fHN0cmluZztcbiAgICBASW5wdXQoKSB0cmlnZ2VycyAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSB2YWx1ZSAgICAgICAgICA6IG51bWJlcltdfG9iamVjdHxzdHJpbmd8c3RyaW5nW107XG4gICAgQElucHV0KCkgd2lkdGggICAgICAgICAgOiBudW1iZXJ8c3RyaW5nO1xuICAgIEBJbnB1dCgpIHggICAgICAgICAgICAgIDogbnVtYmVyO1xuICAgIEBJbnB1dCgpIHkgICAgICAgICAgICAgIDogbnVtYmVyO1xuXG4gICAgIC8vIFByb3BlcnRpZXMgb25seVxuICAgIEBJbnB1dCgpIGFuY2hvclNpemUgOiBudW1iZXJbXTtcblxuICAgICAvLyBFdmVudHNcbiAgICBAT3V0cHV0KCkgb25BY3Rpb24gICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uQmVmb3JlRGVzdHJveSA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkJlZm9yZUhpZGUgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25CZWZvcmVTaG93ICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uQ2F0Y2hBbGwgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkNoYW5nZSAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25DbGVhciAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uRGVzdHJveSAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkZvY3VzSW4gICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25Gb2N1c091dCAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uSGlkZSAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbklucHV0ICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25QYWludCAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uUmVhZE9ubHkgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvblJlc2l6ZSAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25TZWxlY3QgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uU2hvdyAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvblRyaWdnZXIgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhbmQgYXBwZW5kIHRoZSB1bmRlcmx5aW5nIHdpZGdldFxuICAgICAqL1xuICAgIG5nT25Jbml0KCk6IHZvaWQge1xuICAgICAgICBjb25zdFxuICAgICAgICAgICAgbWUgPSB0aGlzLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGVsZW1lbnRSZWYsXG4gICAgICAgICAgICAgICAgYnJ5bnR1bUNvbmZpZ1xuICAgICAgICAgICAgfSA9IG1lLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGluc3RhbmNlQ2xhc3MsXG4gICAgICAgICAgICAgICAgYnJ5bnR1bUNvbmZpZ3NcbiAgICAgICAgICAgIH0gPSBCcnludHVtQ29tYm9Db21wb25lbnQ7XG5cbiAgICAgICAgT2JqZWN0LmFzc2lnbihicnludHVtQ29uZmlnLCB7XG4gICAgICAgICAgICBsaXN0ZW5lcnMgOiB7XG4gICAgICAgICAgICAgICAgYWN0aW9uKGV2ZW50IDogYW55KSB7IG1lLm9uQWN0aW9uLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGJlZm9yZURlc3Ryb3koZXZlbnQgOiBhbnkpIHsgbWUub25CZWZvcmVEZXN0cm95LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGJlZm9yZUhpZGUoZXZlbnQgOiBhbnkpIHsgbWUub25CZWZvcmVIaWRlLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGJlZm9yZVNob3coZXZlbnQgOiBhbnkpIHsgbWUub25CZWZvcmVTaG93LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGNhdGNoQWxsKGV2ZW50IDogYW55KSB7IG1lLm9uQ2F0Y2hBbGwuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgY2hhbmdlKGV2ZW50IDogYW55KSB7IG1lLm9uQ2hhbmdlLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGNsZWFyKGV2ZW50IDogYW55KSB7IG1lLm9uQ2xlYXIuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgZGVzdHJveShldmVudCA6IGFueSkgeyBtZS5vbkRlc3Ryb3kuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgZm9jdXNJbihldmVudCA6IGFueSkgeyBtZS5vbkZvY3VzSW4uZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgZm9jdXNPdXQoZXZlbnQgOiBhbnkpIHsgbWUub25Gb2N1c091dC5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBoaWRlKGV2ZW50IDogYW55KSB7IG1lLm9uSGlkZS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBpbnB1dChldmVudCA6IGFueSkgeyBtZS5vbklucHV0LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIHBhaW50KGV2ZW50IDogYW55KSB7IG1lLm9uUGFpbnQuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgcmVhZE9ubHkoZXZlbnQgOiBhbnkpIHsgbWUub25SZWFkT25seS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICByZXNpemUoZXZlbnQgOiBhbnkpIHsgbWUub25SZXNpemUuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgc2VsZWN0KGV2ZW50IDogYW55KSB7IG1lLm9uU2VsZWN0LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIHNob3coZXZlbnQgOiBhbnkpIHsgbWUub25TaG93LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIHRyaWdnZXIoZXZlbnQgOiBhbnkpIHsgbWUub25UcmlnZ2VyLmVtaXQoZXZlbnQpOyB9LFxuXG4gICAgICAgICAgICAgICAgdGhpc09iaiA6IG1lXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIElmIGNvbXBvbmVudCBoYXMgbm8gY29udGFpbmVyIHNwZWNpZmllZCBpbiBjb25maWcgdGhlbiB1c2UgYWRvcHQgdG8gV3JhcHBlcidzIGVsZW1lbnRcbiAgICAgICAgY29uc3RcbiAgICAgICAgICAgIGNvbnRhaW5lclBhcmFtID0gW1xuICAgICAgICAgICAgICAgICdhZG9wdCcsXG4gICAgICAgICAgICAgICAgJ2FwcGVuZFRvJyxcbiAgICAgICAgICAgICAgICAnaW5zZXJ0QWZ0ZXInLFxuICAgICAgICAgICAgICAgICdpbnNlcnRCZWZvcmUnXG4gICAgICAgICAgICBdLmZpbmQocHJvcCA9PiBicnludHVtQ29uZmlnW3Byb3BdKTtcbiAgICAgICAgaWYgKCFjb250YWluZXJQYXJhbSkge1xuICAgICAgICAgICAgYnJ5bnR1bUNvbmZpZy5hZG9wdCA9IGVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIFdyYXBwZXJIZWxwZXIuZGV2V2FybmluZ0NvbnRhaW5lcihpbnN0YW5jZUNsYXNzLiRuYW1lLCBjb250YWluZXJQYXJhbSk7XG4gICAgICAgIH1cblxuICAgICAgICBicnludHVtQ29uZmlncy5maWx0ZXIocHJvcCA9PiBwcm9wIGluIHRoaXMpLmZvckVhY2gocHJvcCA9PiB7XG4gICAgICAgICAgICBXcmFwcGVySGVscGVyLmFwcGx5UHJvcFZhbHVlKGJyeW50dW1Db25maWcsIHByb3AsIHRoaXNbcHJvcF0pO1xuICAgICAgICAgICAgaWYgKFsnZmVhdHVyZXMnLCAnY29uZmlnJ10uaW5jbHVkZXMocHJvcCkpIHtcbiAgICAgICAgICAgICAgICBXcmFwcGVySGVscGVyLmRldldhcm5pbmdDb25maWdQcm9wKGluc3RhbmNlQ2xhc3MuJG5hbWUsIHByb3ApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIG1lLmluc3RhbmNlID0gaW5zdGFuY2VDbGFzcy4kbmFtZSA9PT0gJ1dpZGdldCcgPyBXaWRnZXRIZWxwZXIuY3JlYXRlV2lkZ2V0KGJyeW50dW1Db25maWcpIDogbmV3IGluc3RhbmNlQ2xhc3MoYnJ5bnR1bUNvbmZpZyk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBXYXRjaCBmb3IgY2hhbmdlc1xuICAgICAqIEBwYXJhbSBjaGFuZ2VzXG4gICAgICovXG4gICAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgICAgICBjb25zdFxuICAgICAgICAgICAgeyBpbnN0YW5jZSB9ID0gdGhpcyxcbiAgICAgICAgICAgIHsgaW5zdGFuY2VDbGFzcyB9ID0gQnJ5bnR1bUNvbWJvQ29tcG9uZW50O1xuXG4gICAgICAgIGlmICghaW5zdGFuY2UpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEl0ZXJhdGUgb3ZlciBhbGwgY2hhbmdlc1xuICAgICAgICBPYmplY3QuZW50cmllcyhjaGFuZ2VzKS5mb3JFYWNoKChbcHJvcCwgY2hhbmdlXSkgPT4ge1xuICAgICAgICAgICAgY29uc3RcbiAgICAgICAgICAgICAgICBuZXdWYWx1ZSA9IChjaGFuZ2UgYXMgU2ltcGxlQ2hhbmdlKS5jdXJyZW50VmFsdWUsXG4gICAgICAgICAgICAgICAgeyBpbnN0YW5jZSB9ID0gdGhpcyxcbiAgICAgICAgICAgICAgICB7IGJyeW50dW1Db25maWdzT25seSwgYnJ5bnR1bVByb3BzIH0gPSBCcnludHVtQ29tYm9Db21wb25lbnQ7XG4gICAgICAgICAgICBpZiAoYnJ5bnR1bVByb3BzLmluY2x1ZGVzKHByb3ApKSB7XG4gICAgICAgICAgICAgICAgV3JhcHBlckhlbHBlci5hcHBseVByb3BWYWx1ZShpbnN0YW5jZSwgcHJvcCwgbmV3VmFsdWUsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICBpZiAoYnJ5bnR1bUNvbmZpZ3NPbmx5LmluY2x1ZGVzKHByb3ApKSB7XG4gICAgICAgICAgICAgICAgICAgIFdyYXBwZXJIZWxwZXIuZGV2V2FybmluZ1VwZGF0ZVByb3AoaW5zdGFuY2VDbGFzcy4kbmFtZSwgcHJvcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZXN0cm95IHRoZSBjb21wb25lbnRcbiAgICAgKi9cbiAgICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaW5zdGFuY2UpIHtcbiAgICAgICAgICAgIHRoaXMuaW5zdGFuY2UuZGVzdHJveSgpO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19