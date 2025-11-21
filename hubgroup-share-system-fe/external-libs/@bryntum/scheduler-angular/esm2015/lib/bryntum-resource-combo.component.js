/**
 * Angular wrapper for Bryntum ResourceCombo
 */
import { Component, ElementRef, EventEmitter, Output, Input } from '@angular/core';
import WrapperHelper from './wrapper.helper';
// Bryntum 'scheduler.lite.umd' bundle comes without polyfills to support Angular's zone.js
import { Base, Widget } from '@bryntum/scheduler/scheduler.lite.umd.js';
import { ResourceCombo, WidgetHelper } from '@bryntum/scheduler/scheduler.lite.umd.js';
export class BryntumResourceComboComponent {
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
        const me = this, { elementRef, bryntumConfig } = me, { instanceClass, bryntumConfigs } = BryntumResourceComboComponent;
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
        const { instance } = this, { instanceClass } = BryntumResourceComboComponent;
        if (!instance) {
            return;
        }
        // Iterate over all changes
        Object.entries(changes).forEach(([prop, change]) => {
            const newValue = change.currentValue, { instance } = this, { bryntumConfigsOnly, bryntumProps } = BryntumResourceComboComponent;
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
BryntumResourceComboComponent.instanceClass = ResourceCombo;
BryntumResourceComboComponent.bryntumFeatureNames = [];
BryntumResourceComboComponent.bryntumConfigs = BryntumResourceComboComponent.bryntumFeatureNames.concat([
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
BryntumResourceComboComponent.bryntumConfigsOnly = [
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
BryntumResourceComboComponent.bryntumProps = BryntumResourceComboComponent.bryntumFeatureNames.concat([
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
BryntumResourceComboComponent.decorators = [
    { type: Component, args: [{
                selector: 'bryntum-resource-combo',
                template: ''
            }] }
];
/** @nocollapse */
BryntumResourceComboComponent.ctorParameters = () => [
    { type: ElementRef }
];
BryntumResourceComboComponent.propDecorators = {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJ5bnR1bS1yZXNvdXJjZS1jb21iby5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYnJ5bnR1bS9zY2hlZHVsZXItYW5ndWxhci8iLCJzb3VyY2VzIjpbImxpYi9icnludHVtLXJlc291cmNlLWNvbWJvLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7R0FFRztBQUVILE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBcUIsTUFBTSxFQUFFLEtBQUssRUFBK0IsTUFBTSxlQUFlLENBQUM7QUFDbkksT0FBTyxhQUFhLE1BQU0sa0JBQWtCLENBQUM7QUFFN0MsMkZBQTJGO0FBQzNGLE9BQU8sRUFBRSxJQUFJLEVBQTZFLE1BQU0sRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBQ25KLE9BQU8sRUFBRSxhQUFhLEVBQWdCLFlBQVksRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBTXJHLE1BQU0sT0FBTyw2QkFBNkI7SUE4UHRDLFlBQVksT0FBbUI7UUFQdkIsa0JBQWEsR0FBRztZQUNwQixnQkFBZ0IsRUFBRyxJQUFJO1lBQ3ZCLEtBQUssRUFBYyxTQUFTO1lBQzVCLFNBQVMsRUFBVSxFQUFFO1lBQ3JCLFFBQVEsRUFBVyxFQUFFO1NBQ3hCLENBQUM7UUE4SEQsU0FBUztRQUNBLGFBQVEsR0FBVSxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQzdDLG9CQUFlLEdBQUcsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUM3QyxpQkFBWSxHQUFNLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsaUJBQVksR0FBTSxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQzdDLGVBQVUsR0FBUSxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQzdDLGFBQVEsR0FBVSxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQzdDLFlBQU8sR0FBVyxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQzdDLGNBQVMsR0FBUyxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQzdDLGNBQVMsR0FB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QUs7b0JBQ0wsS0FBSzs0QkFDTCxLQUFLOzZCQUNMLEtBQUs7eUJBQ0wsS0FBSztxQkFDTCxLQUFLO3dCQUdMLEtBQUs7b0JBQ0wsS0FBSztzQkFDTCxLQUFLO3NCQUNMLEtBQUs7dUJBQ0wsS0FBSzt3QkFDTCxLQUFLOzZCQUNMLEtBQUs7bUJBQ0wsS0FBSztxQkFDTCxLQUFLO3FCQUNMLEtBQUs7bUJBQ0wsS0FBSztpQkFDTCxLQUFLO29CQUNMLEtBQUs7cUJBQ0wsS0FBSzt3QkFDTCxLQUFLO3VCQUNMLEtBQUs7d0JBQ0wsS0FBSzt1QkFDTCxLQUFLO3VCQUNMLEtBQUs7eUJBQ0wsS0FBSztvQkFDTCxLQUFLO3NCQUNMLEtBQUs7dUJBQ0wsS0FBSztvQkFDTCxLQUFLO29CQUNMLEtBQUs7Z0JBQ0wsS0FBSztnQkFDTCxLQUFLO3lCQUdMLEtBQUs7dUJBR0wsTUFBTTs4QkFDTixNQUFNOzJCQUNOLE1BQU07MkJBQ04sTUFBTTt5QkFDTixNQUFNO3VCQUNOLE1BQU07c0JBQ04sTUFBTTt3QkFDTixNQUFNO3dCQUNOLE1BQU07eUJBQ04sTUFBTTtxQkFDTixNQUFNO3NCQUNOLE1BQU07c0JBQ04sTUFBTTt5QkFDTixNQUFNO3VCQUNOLE1BQU07dUJBQ04sTUFBTTtxQkFDTixNQUFNO3dCQUNOLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEFuZ3VsYXIgd3JhcHBlciBmb3IgQnJ5bnR1bSBSZXNvdXJjZUNvbWJvXG4gKi9cblxuaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIE9uRGVzdHJveSwgT25Jbml0LCBPdXRwdXQsIElucHV0LCBTaW1wbGVDaGFuZ2UsIFNpbXBsZUNoYW5nZXMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCBXcmFwcGVySGVscGVyIGZyb20gJy4vd3JhcHBlci5oZWxwZXInO1xuXG4vLyBCcnludHVtICdzY2hlZHVsZXIubGl0ZS51bWQnIGJ1bmRsZSBjb21lcyB3aXRob3V0IHBvbHlmaWxscyB0byBzdXBwb3J0IEFuZ3VsYXIncyB6b25lLmpzXG5pbXBvcnQgeyBCYXNlLCBNYXNrLCBNYXNrQ29uZmlnLCBSZWN0YW5nbGUsIFNjcm9sbGVyLCBTY3JvbGxlckNvbmZpZywgU3RvcmUsIFN0b3JlQ29uZmlnLCBXaWRnZXQgfSBmcm9tICdAYnJ5bnR1bS9zY2hlZHVsZXIvc2NoZWR1bGVyLmxpdGUudW1kLmpzJztcbmltcG9ydCB7IFJlc291cmNlQ29tYm8sIFN0cmluZ0hlbHBlciwgV2lkZ2V0SGVscGVyIH0gZnJvbSAnQGJyeW50dW0vc2NoZWR1bGVyL3NjaGVkdWxlci5saXRlLnVtZC5qcyc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yIDogJ2JyeW50dW0tcmVzb3VyY2UtY29tYm8nLFxuICAgIHRlbXBsYXRlIDogJydcbn0pXG5leHBvcnQgY2xhc3MgQnJ5bnR1bVJlc291cmNlQ29tYm9Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG5cbiAgICBwdWJsaWMgc3RhdGljIGluc3RhbmNlQ2xhc3MgPSBSZXNvdXJjZUNvbWJvO1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bUZlYXR1cmVOYW1lczogc3RyaW5nW10gPSBbXG5cbiAgICBdO1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bUNvbmZpZ3M6IHN0cmluZ1tdID0gQnJ5bnR1bVJlc291cmNlQ29tYm9Db21wb25lbnQuYnJ5bnR1bUZlYXR1cmVOYW1lcy5jb25jYXQoW1xuICAgICAgICAnYWRvcHQnLFxuICAgICAgICAnYWxpZ24nLFxuICAgICAgICAnYWxpZ25TZWxmJyxcbiAgICAgICAgJ2FuY2hvcicsXG4gICAgICAgICdhcHBlbmRUbycsXG4gICAgICAgICdhdXRvQ2xvc2UnLFxuICAgICAgICAnYXV0b0NvbXBsZXRlJyxcbiAgICAgICAgJ2F1dG9FeHBhbmQnLFxuICAgICAgICAnYXV0b1NlbGVjdCcsXG4gICAgICAgICdiYWRnZScsXG4gICAgICAgICdidWJibGVFdmVudHMnLFxuICAgICAgICAnY2FzZVNlbnNpdGl2ZScsXG4gICAgICAgICdjZW50ZXJlZCcsXG4gICAgICAgICdjaGlwVmlldycsXG4gICAgICAgICdjbGVhcmFibGUnLFxuICAgICAgICAnY2xlYXJUZXh0T25QaWNrZXJIaWRlJyxcbiAgICAgICAgJ2NscycsXG4gICAgICAgICdjb25maWcnLFxuICAgICAgICAnY29uc3RyYWluVG8nLFxuICAgICAgICAnY29udGVudCcsXG4gICAgICAgICdjb250ZW50RWxlbWVudENscycsXG4gICAgICAgICdkYXRhc2V0JyxcbiAgICAgICAgJ2RlZmF1bHRCaW5kUHJvcGVydHknLFxuICAgICAgICAnZGlzYWJsZWQnLFxuICAgICAgICAnZGlzcGxheUZpZWxkJyxcbiAgICAgICAgJ2Rpc3BsYXlWYWx1ZVJlbmRlcmVyJyxcbiAgICAgICAgJ2RvY2snLFxuICAgICAgICAnZHJhZ2dhYmxlJyxcbiAgICAgICAgJ2VkaXRhYmxlJyxcbiAgICAgICAgJ2VtcHR5VGV4dCcsXG4gICAgICAgICdlbmNvZGVGaWx0ZXJQYXJhbXMnLFxuICAgICAgICAnZXh0cmFEYXRhJyxcbiAgICAgICAgJ2ZpbHRlck9uRW50ZXInLFxuICAgICAgICAnZmlsdGVyT3BlcmF0b3InLFxuICAgICAgICAnZmlsdGVyUGFyYW1OYW1lJyxcbiAgICAgICAgJ2ZpbHRlclNlbGVjdGVkJyxcbiAgICAgICAgJ2ZsZXgnLFxuICAgICAgICAnZmxvYXRpbmcnLFxuICAgICAgICAnaGVpZ2h0JyxcbiAgICAgICAgJ2hpZGRlbicsXG4gICAgICAgICdoaWRlQW5pbWF0aW9uJyxcbiAgICAgICAgJ2hpZGVQaWNrZXJPblNlbGVjdCcsXG4gICAgICAgICdoaWRlVHJpZ2dlcicsXG4gICAgICAgICdoaWdobGlnaHRFeHRlcm5hbENoYW5nZScsXG4gICAgICAgICdoaW50JyxcbiAgICAgICAgJ2hpbnRIdG1sJyxcbiAgICAgICAgJ2h0bWwnLFxuICAgICAgICAnaHRtbENscycsXG4gICAgICAgICdpZCcsXG4gICAgICAgICdpbnB1dEFsaWduJyxcbiAgICAgICAgJ2lucHV0QXR0cmlidXRlcycsXG4gICAgICAgICdpbnB1dFdpZHRoJyxcbiAgICAgICAgJ2luc2VydEJlZm9yZScsXG4gICAgICAgICdpbnNlcnRGaXJzdCcsXG4gICAgICAgICdpdGVtcycsXG4gICAgICAgICdrZXlTdHJva2VDaGFuZ2VEZWxheScsXG4gICAgICAgICdrZXlTdHJva2VGaWx0ZXJEZWxheScsXG4gICAgICAgICdsYWJlbCcsXG4gICAgICAgICdsYWJlbENscycsXG4gICAgICAgICdsYWJlbFBvc2l0aW9uJyxcbiAgICAgICAgJ2xhYmVscycsXG4gICAgICAgICdsYWJlbFdpZHRoJyxcbiAgICAgICAgJ2xpc3RDbHMnLFxuICAgICAgICAnbGlzdGVuZXJzJyxcbiAgICAgICAgJ2xpc3RJdGVtVHBsJyxcbiAgICAgICAgJ2xvY2FsZUNsYXNzJyxcbiAgICAgICAgJ2xvY2FsaXphYmxlUHJvcGVydGllcycsXG4gICAgICAgICdtYXJnaW4nLFxuICAgICAgICAnbWFza0RlZmF1bHRzJyxcbiAgICAgICAgJ21hc2tlZCcsXG4gICAgICAgICdtYXhIZWlnaHQnLFxuICAgICAgICAnbWF4TGVuZ3RoJyxcbiAgICAgICAgJ21heFdpZHRoJyxcbiAgICAgICAgJ21pbkNoYXJzJyxcbiAgICAgICAgJ21pbkhlaWdodCcsXG4gICAgICAgICdtaW5MZW5ndGgnLFxuICAgICAgICAnbWluV2lkdGgnLFxuICAgICAgICAnbW9uaXRvclJlc2l6ZScsXG4gICAgICAgICdtdWx0aVNlbGVjdCcsXG4gICAgICAgICduYW1lJyxcbiAgICAgICAgJ292ZXJsYXlBbmNob3InLFxuICAgICAgICAnb3duZXInLFxuICAgICAgICAncGlja2VyJyxcbiAgICAgICAgJ3BpY2tlckFsaWduRWxlbWVudCcsXG4gICAgICAgICdwaWNrZXJXaWR0aCcsXG4gICAgICAgICdwbGFjZWhvbGRlcicsXG4gICAgICAgICdwb3NpdGlvbmVkJyxcbiAgICAgICAgJ3ByZXZlbnRUb29sdGlwT25Ub3VjaCcsXG4gICAgICAgICdwcmltYXJ5RmlsdGVyJyxcbiAgICAgICAgJ3JlYWRPbmx5JyxcbiAgICAgICAgJ3JlcXVpcmVkJyxcbiAgICAgICAgJ3JldmVydE9uRXNjYXBlJyxcbiAgICAgICAgJ3JpcHBsZScsXG4gICAgICAgICdyb290RWxlbWVudCcsXG4gICAgICAgICdzY3JvbGxhYmxlJyxcbiAgICAgICAgJ3Njcm9sbEFjdGlvbicsXG4gICAgICAgICdzaG93QW5pbWF0aW9uJyxcbiAgICAgICAgJ3N0b3JlJyxcbiAgICAgICAgJ3RhYicsXG4gICAgICAgICd0YWJJbmRleCcsXG4gICAgICAgICd0YWcnLFxuICAgICAgICAndGV4dEFsaWduJyxcbiAgICAgICAgJ3RpdGxlJyxcbiAgICAgICAgJ3Rvb2x0aXAnLFxuICAgICAgICAndHJpZ2dlckFjdGlvbicsXG4gICAgICAgICd0cmlnZ2VycycsXG4gICAgICAgICd2YWxpZGF0ZUZpbHRlcicsXG4gICAgICAgICd2YWx1ZScsXG4gICAgICAgICd2YWx1ZUZpZWxkJyxcbiAgICAgICAgJ3dlaWdodCcsXG4gICAgICAgICd3aWR0aCcsXG4gICAgICAgICd4JyxcbiAgICAgICAgJ3knXG4gICAgXSk7XG5cbiAgICBwcml2YXRlIHN0YXRpYyBicnludHVtQ29uZmlnc09ubHk6IHN0cmluZ1tdID0gW1xuICAgICAgICAnYWRvcHQnLFxuICAgICAgICAnYWxpZ24nLFxuICAgICAgICAnYW5jaG9yJyxcbiAgICAgICAgJ2FwcGVuZFRvJyxcbiAgICAgICAgJ2F1dG9DbG9zZScsXG4gICAgICAgICdhdXRvQ29tcGxldGUnLFxuICAgICAgICAnYXV0b0V4cGFuZCcsXG4gICAgICAgICdhdXRvU2VsZWN0JyxcbiAgICAgICAgJ2J1YmJsZUV2ZW50cycsXG4gICAgICAgICdjYXNlU2Vuc2l0aXZlJyxcbiAgICAgICAgJ2NlbnRlcmVkJyxcbiAgICAgICAgJ2NoaXBWaWV3JyxcbiAgICAgICAgJ2NsZWFyYWJsZScsXG4gICAgICAgICdjbGVhclRleHRPblBpY2tlckhpZGUnLFxuICAgICAgICAnY2xzJyxcbiAgICAgICAgJ2NvbmZpZycsXG4gICAgICAgICdjb25zdHJhaW5UbycsXG4gICAgICAgICdjb250ZW50RWxlbWVudENscycsXG4gICAgICAgICdkZWZhdWx0QmluZFByb3BlcnR5JyxcbiAgICAgICAgJ2Rpc3BsYXlGaWVsZCcsXG4gICAgICAgICdkaXNwbGF5VmFsdWVSZW5kZXJlcicsXG4gICAgICAgICdkb2NrJyxcbiAgICAgICAgJ2RyYWdnYWJsZScsXG4gICAgICAgICdlZGl0YWJsZScsXG4gICAgICAgICdlbXB0eVRleHQnLFxuICAgICAgICAnZW5jb2RlRmlsdGVyUGFyYW1zJyxcbiAgICAgICAgJ2ZpbHRlck9uRW50ZXInLFxuICAgICAgICAnZmlsdGVyUGFyYW1OYW1lJyxcbiAgICAgICAgJ2ZpbHRlclNlbGVjdGVkJyxcbiAgICAgICAgJ2Zsb2F0aW5nJyxcbiAgICAgICAgJ2hpZGVBbmltYXRpb24nLFxuICAgICAgICAnaGlkZVBpY2tlck9uU2VsZWN0JyxcbiAgICAgICAgJ2hpZGVUcmlnZ2VyJyxcbiAgICAgICAgJ2hpZ2hsaWdodEV4dGVybmFsQ2hhbmdlJyxcbiAgICAgICAgJ2hpbnQnLFxuICAgICAgICAnaGludEh0bWwnLFxuICAgICAgICAnaHRtbENscycsXG4gICAgICAgICdpbnB1dEFsaWduJyxcbiAgICAgICAgJ2lucHV0QXR0cmlidXRlcycsXG4gICAgICAgICdpbnB1dFdpZHRoJyxcbiAgICAgICAgJ2luc2VydEJlZm9yZScsXG4gICAgICAgICdpbnNlcnRGaXJzdCcsXG4gICAgICAgICdpdGVtcycsXG4gICAgICAgICdrZXlTdHJva2VDaGFuZ2VEZWxheScsXG4gICAgICAgICdrZXlTdHJva2VGaWx0ZXJEZWxheScsXG4gICAgICAgICdsYWJlbENscycsXG4gICAgICAgICdsYWJlbFBvc2l0aW9uJyxcbiAgICAgICAgJ2xhYmVscycsXG4gICAgICAgICdsYWJlbFdpZHRoJyxcbiAgICAgICAgJ2xpc3RDbHMnLFxuICAgICAgICAnbGlzdGVuZXJzJyxcbiAgICAgICAgJ2xpc3RJdGVtVHBsJyxcbiAgICAgICAgJ2xvY2FsZUNsYXNzJyxcbiAgICAgICAgJ2xvY2FsaXphYmxlUHJvcGVydGllcycsXG4gICAgICAgICdtYXNrRGVmYXVsdHMnLFxuICAgICAgICAnbWFza2VkJyxcbiAgICAgICAgJ21heExlbmd0aCcsXG4gICAgICAgICdtaW5DaGFycycsXG4gICAgICAgICdtaW5MZW5ndGgnLFxuICAgICAgICAnbW9uaXRvclJlc2l6ZScsXG4gICAgICAgICdtdWx0aVNlbGVjdCcsXG4gICAgICAgICduYW1lJyxcbiAgICAgICAgJ292ZXJsYXlBbmNob3InLFxuICAgICAgICAnb3duZXInLFxuICAgICAgICAncGlja2VyJyxcbiAgICAgICAgJ3BpY2tlckFsaWduRWxlbWVudCcsXG4gICAgICAgICdwaWNrZXJXaWR0aCcsXG4gICAgICAgICdwbGFjZWhvbGRlcicsXG4gICAgICAgICdwb3NpdGlvbmVkJyxcbiAgICAgICAgJ3ByZXZlbnRUb29sdGlwT25Ub3VjaCcsXG4gICAgICAgICdwcmltYXJ5RmlsdGVyJyxcbiAgICAgICAgJ3JlcXVpcmVkJyxcbiAgICAgICAgJ3JldmVydE9uRXNjYXBlJyxcbiAgICAgICAgJ3JpcHBsZScsXG4gICAgICAgICdyb290RWxlbWVudCcsXG4gICAgICAgICdzY3JvbGxBY3Rpb24nLFxuICAgICAgICAnc2hvd0FuaW1hdGlvbicsXG4gICAgICAgICd0YWInLFxuICAgICAgICAndGFiSW5kZXgnLFxuICAgICAgICAndGFnJyxcbiAgICAgICAgJ3RleHRBbGlnbicsXG4gICAgICAgICd0aXRsZScsXG4gICAgICAgICd0cmlnZ2VyQWN0aW9uJyxcbiAgICAgICAgJ3ZhbGlkYXRlRmlsdGVyJyxcbiAgICAgICAgJ3ZhbHVlRmllbGQnLFxuICAgICAgICAnd2VpZ2h0J1xuICAgIF07XG5cbiAgICBwcml2YXRlIHN0YXRpYyBicnludHVtUHJvcHM6IHN0cmluZ1tdID0gQnJ5bnR1bVJlc291cmNlQ29tYm9Db21wb25lbnQuYnJ5bnR1bUZlYXR1cmVOYW1lcy5jb25jYXQoW1xuICAgICAgICAnYWxpZ25TZWxmJyxcbiAgICAgICAgJ2FuY2hvclNpemUnLFxuICAgICAgICAnYmFkZ2UnLFxuICAgICAgICAnY29udGVudCcsXG4gICAgICAgICdkYXRhc2V0JyxcbiAgICAgICAgJ2Rpc2FibGVkJyxcbiAgICAgICAgJ2V4dHJhRGF0YScsXG4gICAgICAgICdmaWx0ZXJPcGVyYXRvcicsXG4gICAgICAgICdmbGV4JyxcbiAgICAgICAgJ2hlaWdodCcsXG4gICAgICAgICdoaWRkZW4nLFxuICAgICAgICAnaHRtbCcsXG4gICAgICAgICdpZCcsXG4gICAgICAgICdsYWJlbCcsXG4gICAgICAgICdtYXJnaW4nLFxuICAgICAgICAnbWF4SGVpZ2h0JyxcbiAgICAgICAgJ21heFdpZHRoJyxcbiAgICAgICAgJ21pbkhlaWdodCcsXG4gICAgICAgICdtaW5XaWR0aCcsXG4gICAgICAgICdyZWFkT25seScsXG4gICAgICAgICdzY3JvbGxhYmxlJyxcbiAgICAgICAgJ3N0b3JlJyxcbiAgICAgICAgJ3Rvb2x0aXAnLFxuICAgICAgICAndHJpZ2dlcnMnLFxuICAgICAgICAndmFsdWUnLFxuICAgICAgICAnd2lkdGgnLFxuICAgICAgICAneCcsXG4gICAgICAgICd5J1xuICAgIF0pO1xuXG4gICAgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmO1xuICAgIHB1YmxpYyBpbnN0YW5jZTogUmVzb3VyY2VDb21ibztcblxuICAgIHByaXZhdGUgYnJ5bnR1bUNvbmZpZyA9IHtcbiAgICAgICAgYW5ndWxhckNvbXBvbmVudCA6IHRoaXMsXG4gICAgICAgIGFkb3B0ICAgICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgIGxpc3RlbmVycyAgICAgICAgOiB7fSxcbiAgICAgICAgZmVhdHVyZXMgICAgICAgICA6IHt9XG4gICAgfTtcblxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQ6IEVsZW1lbnRSZWYpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50UmVmID0gZWxlbWVudDtcbiAgICB9XG5cbiAgICAgLy8gQ29uZmlncyBvbmx5XG4gICAgQElucHV0KCkgYWRvcHQgICAgICAgICAgICAgICAgICAgOiBIVE1MRWxlbWVudHxzdHJpbmc7XG4gICAgQElucHV0KCkgYWxpZ24gICAgICAgICAgICAgICAgICAgOiBvYmplY3R8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGFuY2hvciAgICAgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBhcHBlbmRUbyAgICAgICAgICAgICAgICA6IEhUTUxFbGVtZW50fHN0cmluZztcbiAgICBASW5wdXQoKSBhdXRvQ2xvc2UgICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgYXV0b0NvbXBsZXRlICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgYXV0b0V4cGFuZCAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGF1dG9TZWxlY3QgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBidWJibGVFdmVudHMgICAgICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBjYXNlU2Vuc2l0aXZlICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgY2VudGVyZWQgICAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGNoaXBWaWV3ICAgICAgICAgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIGNsZWFyYWJsZSAgICAgICAgICAgICAgIDogYm9vbGVhbnxvYmplY3Q7XG4gICAgQElucHV0KCkgY2xlYXJUZXh0T25QaWNrZXJIaWRlICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGNscyAgICAgICAgICAgICAgICAgICAgIDogc3RyaW5nfG9iamVjdDtcbiAgICBASW5wdXQoKSBjb25maWcgICAgICAgICAgICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBjb25zdHJhaW5UbyAgICAgICAgICAgICA6IEhUTUxFbGVtZW50fFdpZGdldHxSZWN0YW5nbGU7XG4gICAgQElucHV0KCkgY29udGVudEVsZW1lbnRDbHMgICAgICAgOiBzdHJpbmd8b2JqZWN0O1xuICAgIEBJbnB1dCgpIGRlZmF1bHRCaW5kUHJvcGVydHkgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGRpc3BsYXlGaWVsZCAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGRpc3BsYXlWYWx1ZVJlbmRlcmVyICAgIDogRnVuY3Rpb247XG4gICAgQElucHV0KCkgZG9jayAgICAgICAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgZHJhZ2dhYmxlICAgICAgICAgICAgICAgOiBib29sZWFufG9iamVjdDtcbiAgICBASW5wdXQoKSBlZGl0YWJsZSAgICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgZW1wdHlUZXh0ICAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgZW5jb2RlRmlsdGVyUGFyYW1zICAgICAgOiBGdW5jdGlvbjtcbiAgICBASW5wdXQoKSBmaWx0ZXJPbkVudGVyICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgZmlsdGVyUGFyYW1OYW1lICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgZmlsdGVyU2VsZWN0ZWQgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGZsb2F0aW5nICAgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBoaWRlQW5pbWF0aW9uICAgICAgICAgICA6IGJvb2xlYW58b2JqZWN0O1xuICAgIEBJbnB1dCgpIGhpZGVQaWNrZXJPblNlbGVjdCAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBoaWRlVHJpZ2dlciAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgaGlnaGxpZ2h0RXh0ZXJuYWxDaGFuZ2UgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGhpbnQgICAgICAgICAgICAgICAgICAgIDogc3RyaW5nfEZ1bmN0aW9uO1xuICAgIEBJbnB1dCgpIGhpbnRIdG1sICAgICAgICAgICAgICAgIDogc3RyaW5nfEZ1bmN0aW9uO1xuICAgIEBJbnB1dCgpIGh0bWxDbHMgICAgICAgICAgICAgICAgIDogc3RyaW5nfG9iamVjdDtcbiAgICBASW5wdXQoKSBpbnB1dEFsaWduICAgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBpbnB1dEF0dHJpYnV0ZXMgICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBpbnB1dFdpZHRoICAgICAgICAgICAgICA6IHN0cmluZ3xudW1iZXI7XG4gICAgQElucHV0KCkgaW5zZXJ0QmVmb3JlICAgICAgICAgICAgOiBIVE1MRWxlbWVudHxzdHJpbmc7XG4gICAgQElucHV0KCkgaW5zZXJ0Rmlyc3QgICAgICAgICAgICAgOiBIVE1MRWxlbWVudHxzdHJpbmc7XG4gICAgQElucHV0KCkgaXRlbXMgICAgICAgICAgICAgICAgICAgOiBvYmplY3RbXXxzdHJpbmdbXXxvYmplY3Q7XG4gICAgQElucHV0KCkga2V5U3Ryb2tlQ2hhbmdlRGVsYXkgICAgOiBudW1iZXI7XG4gICAgQElucHV0KCkga2V5U3Ryb2tlRmlsdGVyRGVsYXkgICAgOiBudW1iZXI7XG4gICAgQElucHV0KCkgbGFiZWxDbHMgICAgICAgICAgICAgICAgOiBzdHJpbmd8b2JqZWN0O1xuICAgIEBJbnB1dCgpIGxhYmVsUG9zaXRpb24gICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGxhYmVscyAgICAgICAgICAgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIGxhYmVsV2lkdGggICAgICAgICAgICAgIDogc3RyaW5nfG51bWJlcjtcbiAgICBASW5wdXQoKSBsaXN0Q2xzICAgICAgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBsaXN0ZW5lcnMgICAgICAgICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBsaXN0SXRlbVRwbCAgICAgICAgICAgICA6IEZ1bmN0aW9uO1xuICAgIEBJbnB1dCgpIGxvY2FsZUNsYXNzICAgICAgICAgICAgIDogQmFzZTtcbiAgICBASW5wdXQoKSBsb2NhbGl6YWJsZVByb3BlcnRpZXMgICA6IHN0cmluZ1tdO1xuICAgIEBJbnB1dCgpIG1hc2tEZWZhdWx0cyAgICAgICAgICAgIDogb2JqZWN0fE1hc2t8UGFydGlhbDxNYXNrQ29uZmlnPjtcbiAgICBASW5wdXQoKSBtYXNrZWQgICAgICAgICAgICAgICAgICA6IGJvb2xlYW58c3RyaW5nfG9iamVjdHxNYXNrfFBhcnRpYWw8TWFza0NvbmZpZz47XG4gICAgQElucHV0KCkgbWF4TGVuZ3RoICAgICAgICAgICAgICAgOiBudW1iZXI7XG4gICAgQElucHV0KCkgbWluQ2hhcnMgICAgICAgICAgICAgICAgOiBudW1iZXI7XG4gICAgQElucHV0KCkgbWluTGVuZ3RoICAgICAgICAgICAgICAgOiBudW1iZXI7XG4gICAgQElucHV0KCkgbW9uaXRvclJlc2l6ZSAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIG11bHRpU2VsZWN0ICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBuYW1lICAgICAgICAgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBvdmVybGF5QW5jaG9yICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgb3duZXIgICAgICAgICAgICAgICAgICAgOiBXaWRnZXQ7XG4gICAgQElucHV0KCkgcGlja2VyICAgICAgICAgICAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgcGlja2VyQWxpZ25FbGVtZW50ICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgcGlja2VyV2lkdGggICAgICAgICAgICAgOiBudW1iZXI7XG4gICAgQElucHV0KCkgcGxhY2Vob2xkZXIgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgcG9zaXRpb25lZCAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHByZXZlbnRUb29sdGlwT25Ub3VjaCAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBwcmltYXJ5RmlsdGVyICAgICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSByZXF1aXJlZCAgICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgcmV2ZXJ0T25Fc2NhcGUgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHJpcHBsZSAgICAgICAgICAgICAgICAgIDogYm9vbGVhbnxvYmplY3Q7XG4gICAgQElucHV0KCkgcm9vdEVsZW1lbnQgICAgICAgICAgICAgOiBTaGFkb3dSb290O1xuICAgIEBJbnB1dCgpIHNjcm9sbEFjdGlvbiAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIHNob3dBbmltYXRpb24gICAgICAgICAgIDogYm9vbGVhbnxvYmplY3Q7XG4gICAgQElucHV0KCkgdGFiICAgICAgICAgICAgICAgICAgICAgOiBib29sZWFufG9iamVjdDtcbiAgICBASW5wdXQoKSB0YWJJbmRleCAgICAgICAgICAgICAgICA6IG51bWJlcjtcbiAgICBASW5wdXQoKSB0YWcgICAgICAgICAgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSB0ZXh0QWxpZ24gICAgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSB0aXRsZSAgICAgICAgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSB0cmlnZ2VyQWN0aW9uICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSB2YWxpZGF0ZUZpbHRlciAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgdmFsdWVGaWVsZCAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgd2VpZ2h0ICAgICAgICAgICAgICAgICAgOiBudW1iZXI7XG5cbiAgICAgLy8gQ29uZmlncyBhbmQgcHJvcGVydGllc1xuICAgIEBJbnB1dCgpIGFsaWduU2VsZiAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGJhZGdlICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGNvbnRlbnQgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGRhdGFzZXQgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIGRpc2FibGVkICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBleHRyYURhdGEgICAgICA6IGJvb2xlYW58bnVtYmVyfG9iamVjdHxzdHJpbmc7XG4gICAgQElucHV0KCkgZmlsdGVyT3BlcmF0b3IgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgZmxleCAgICAgICAgICAgOiBudW1iZXJ8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGhlaWdodCAgICAgICAgIDogbnVtYmVyfHN0cmluZztcbiAgICBASW5wdXQoKSBoaWRkZW4gICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgaHRtbCAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgaWQgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgbGFiZWwgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgbWFyZ2luICAgICAgICAgOiBudW1iZXJ8c3RyaW5nO1xuICAgIEBJbnB1dCgpIG1heEhlaWdodCAgICAgIDogbnVtYmVyfHN0cmluZztcbiAgICBASW5wdXQoKSBtYXhXaWR0aCAgICAgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgbWluSGVpZ2h0ICAgICAgOiBudW1iZXJ8c3RyaW5nO1xuICAgIEBJbnB1dCgpIG1pbldpZHRoICAgICAgIDogbnVtYmVyfHN0cmluZztcbiAgICBASW5wdXQoKSByZWFkT25seSAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgc2Nyb2xsYWJsZSAgICAgOiBib29sZWFufFNjcm9sbGVyfG9iamVjdHxQYXJ0aWFsPFNjcm9sbGVyQ29uZmlnPjtcbiAgICBASW5wdXQoKSBzdG9yZSAgICAgICAgICA6IFN0b3JlfG9iamVjdHxQYXJ0aWFsPFN0b3JlQ29uZmlnPjtcbiAgICBASW5wdXQoKSB0b29sdGlwICAgICAgICA6IG9iamVjdHxzdHJpbmc7XG4gICAgQElucHV0KCkgdHJpZ2dlcnMgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgdmFsdWUgICAgICAgICAgOiBudW1iZXJbXXxvYmplY3R8c3RyaW5nfHN0cmluZ1tdO1xuICAgIEBJbnB1dCgpIHdpZHRoICAgICAgICAgIDogbnVtYmVyfHN0cmluZztcbiAgICBASW5wdXQoKSB4ICAgICAgICAgICAgICA6IG51bWJlcjtcbiAgICBASW5wdXQoKSB5ICAgICAgICAgICAgICA6IG51bWJlcjtcblxuICAgICAvLyBQcm9wZXJ0aWVzIG9ubHlcbiAgICBASW5wdXQoKSBhbmNob3JTaXplIDogbnVtYmVyW107XG5cbiAgICAgLy8gRXZlbnRzXG4gICAgQE91dHB1dCgpIG9uQWN0aW9uICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkJlZm9yZURlc3Ryb3kgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25CZWZvcmVIaWRlICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uQmVmb3JlU2hvdyAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkNhdGNoQWxsICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25DaGFuZ2UgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uQ2xlYXIgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkRlc3Ryb3kgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25Gb2N1c0luICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uRm9jdXNPdXQgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkhpZGUgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25JbnB1dCAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uUGFpbnQgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvblJlYWRPbmx5ICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25SZXNpemUgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uU2VsZWN0ICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvblNob3cgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25UcmlnZ2VyICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYW5kIGFwcGVuZCB0aGUgdW5kZXJseWluZyB3aWRnZXRcbiAgICAgKi9cbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICAgY29uc3RcbiAgICAgICAgICAgIG1lID0gdGhpcyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50UmVmLFxuICAgICAgICAgICAgICAgIGJyeW50dW1Db25maWdcbiAgICAgICAgICAgIH0gPSBtZSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpbnN0YW5jZUNsYXNzLFxuICAgICAgICAgICAgICAgIGJyeW50dW1Db25maWdzXG4gICAgICAgICAgICB9ID0gQnJ5bnR1bVJlc291cmNlQ29tYm9Db21wb25lbnQ7XG5cbiAgICAgICAgT2JqZWN0LmFzc2lnbihicnludHVtQ29uZmlnLCB7XG4gICAgICAgICAgICBsaXN0ZW5lcnMgOiB7XG4gICAgICAgICAgICAgICAgYWN0aW9uKGV2ZW50IDogYW55KSB7IG1lLm9uQWN0aW9uLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGJlZm9yZURlc3Ryb3koZXZlbnQgOiBhbnkpIHsgbWUub25CZWZvcmVEZXN0cm95LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGJlZm9yZUhpZGUoZXZlbnQgOiBhbnkpIHsgbWUub25CZWZvcmVIaWRlLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGJlZm9yZVNob3coZXZlbnQgOiBhbnkpIHsgbWUub25CZWZvcmVTaG93LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGNhdGNoQWxsKGV2ZW50IDogYW55KSB7IG1lLm9uQ2F0Y2hBbGwuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgY2hhbmdlKGV2ZW50IDogYW55KSB7IG1lLm9uQ2hhbmdlLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGNsZWFyKGV2ZW50IDogYW55KSB7IG1lLm9uQ2xlYXIuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgZGVzdHJveShldmVudCA6IGFueSkgeyBtZS5vbkRlc3Ryb3kuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgZm9jdXNJbihldmVudCA6IGFueSkgeyBtZS5vbkZvY3VzSW4uZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgZm9jdXNPdXQoZXZlbnQgOiBhbnkpIHsgbWUub25Gb2N1c091dC5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBoaWRlKGV2ZW50IDogYW55KSB7IG1lLm9uSGlkZS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBpbnB1dChldmVudCA6IGFueSkgeyBtZS5vbklucHV0LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIHBhaW50KGV2ZW50IDogYW55KSB7IG1lLm9uUGFpbnQuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgcmVhZE9ubHkoZXZlbnQgOiBhbnkpIHsgbWUub25SZWFkT25seS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICByZXNpemUoZXZlbnQgOiBhbnkpIHsgbWUub25SZXNpemUuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgc2VsZWN0KGV2ZW50IDogYW55KSB7IG1lLm9uU2VsZWN0LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIHNob3coZXZlbnQgOiBhbnkpIHsgbWUub25TaG93LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIHRyaWdnZXIoZXZlbnQgOiBhbnkpIHsgbWUub25UcmlnZ2VyLmVtaXQoZXZlbnQpOyB9LFxuXG4gICAgICAgICAgICAgICAgdGhpc09iaiA6IG1lXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIElmIGNvbXBvbmVudCBoYXMgbm8gY29udGFpbmVyIHNwZWNpZmllZCBpbiBjb25maWcgdGhlbiB1c2UgYWRvcHQgdG8gV3JhcHBlcidzIGVsZW1lbnRcbiAgICAgICAgY29uc3RcbiAgICAgICAgICAgIGNvbnRhaW5lclBhcmFtID0gW1xuICAgICAgICAgICAgICAgICdhZG9wdCcsXG4gICAgICAgICAgICAgICAgJ2FwcGVuZFRvJyxcbiAgICAgICAgICAgICAgICAnaW5zZXJ0QWZ0ZXInLFxuICAgICAgICAgICAgICAgICdpbnNlcnRCZWZvcmUnXG4gICAgICAgICAgICBdLmZpbmQocHJvcCA9PiBicnludHVtQ29uZmlnW3Byb3BdKTtcbiAgICAgICAgaWYgKCFjb250YWluZXJQYXJhbSkge1xuICAgICAgICAgICAgYnJ5bnR1bUNvbmZpZy5hZG9wdCA9IGVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIFdyYXBwZXJIZWxwZXIuZGV2V2FybmluZ0NvbnRhaW5lcihpbnN0YW5jZUNsYXNzLiRuYW1lLCBjb250YWluZXJQYXJhbSk7XG4gICAgICAgIH1cblxuICAgICAgICBicnludHVtQ29uZmlncy5maWx0ZXIocHJvcCA9PiBwcm9wIGluIHRoaXMpLmZvckVhY2gocHJvcCA9PiB7XG4gICAgICAgICAgICBXcmFwcGVySGVscGVyLmFwcGx5UHJvcFZhbHVlKGJyeW50dW1Db25maWcsIHByb3AsIHRoaXNbcHJvcF0pO1xuICAgICAgICAgICAgaWYgKFsnZmVhdHVyZXMnLCAnY29uZmlnJ10uaW5jbHVkZXMocHJvcCkpIHtcbiAgICAgICAgICAgICAgICBXcmFwcGVySGVscGVyLmRldldhcm5pbmdDb25maWdQcm9wKGluc3RhbmNlQ2xhc3MuJG5hbWUsIHByb3ApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIG1lLmluc3RhbmNlID0gaW5zdGFuY2VDbGFzcy4kbmFtZSA9PT0gJ1dpZGdldCcgPyBXaWRnZXRIZWxwZXIuY3JlYXRlV2lkZ2V0KGJyeW50dW1Db25maWcpIDogbmV3IGluc3RhbmNlQ2xhc3MoYnJ5bnR1bUNvbmZpZyk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBXYXRjaCBmb3IgY2hhbmdlc1xuICAgICAqIEBwYXJhbSBjaGFuZ2VzXG4gICAgICovXG4gICAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgICAgICBjb25zdFxuICAgICAgICAgICAgeyBpbnN0YW5jZSB9ID0gdGhpcyxcbiAgICAgICAgICAgIHsgaW5zdGFuY2VDbGFzcyB9ID0gQnJ5bnR1bVJlc291cmNlQ29tYm9Db21wb25lbnQ7XG5cbiAgICAgICAgaWYgKCFpbnN0YW5jZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSXRlcmF0ZSBvdmVyIGFsbCBjaGFuZ2VzXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKGNoYW5nZXMpLmZvckVhY2goKFtwcm9wLCBjaGFuZ2VdKSA9PiB7XG4gICAgICAgICAgICBjb25zdFxuICAgICAgICAgICAgICAgIG5ld1ZhbHVlID0gKGNoYW5nZSBhcyBTaW1wbGVDaGFuZ2UpLmN1cnJlbnRWYWx1ZSxcbiAgICAgICAgICAgICAgICB7IGluc3RhbmNlIH0gPSB0aGlzLFxuICAgICAgICAgICAgICAgIHsgYnJ5bnR1bUNvbmZpZ3NPbmx5LCBicnludHVtUHJvcHMgfSA9IEJyeW50dW1SZXNvdXJjZUNvbWJvQ29tcG9uZW50O1xuICAgICAgICAgICAgaWYgKGJyeW50dW1Qcm9wcy5pbmNsdWRlcyhwcm9wKSkge1xuICAgICAgICAgICAgICAgIFdyYXBwZXJIZWxwZXIuYXBwbHlQcm9wVmFsdWUoaW5zdGFuY2UsIHByb3AsIG5ld1ZhbHVlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgaWYgKGJyeW50dW1Db25maWdzT25seS5pbmNsdWRlcyhwcm9wKSkge1xuICAgICAgICAgICAgICAgICAgICBXcmFwcGVySGVscGVyLmRldldhcm5pbmdVcGRhdGVQcm9wKGluc3RhbmNlQ2xhc3MuJG5hbWUsIHByb3ApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGVzdHJveSB0aGUgY29tcG9uZW50XG4gICAgICovXG4gICAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmluc3RhbmNlKSB7XG4gICAgICAgICAgICB0aGlzLmluc3RhbmNlLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==