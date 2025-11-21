/**
 * Angular wrapper for Bryntum Combo
 */
import * as tslib_1 from "tslib";
import { Component, ElementRef, EventEmitter, Output, Input } from '@angular/core';
import WrapperHelper from './wrapper.helper';
// Bryntum 'scheduler.lite.umd' bundle comes without polyfills to support Angular's zone.js
import { Base, Widget } from '@bryntum/scheduler/scheduler.lite.umd.js';
import { Combo, WidgetHelper } from '@bryntum/scheduler/scheduler.lite.umd.js';
var BryntumComboComponent = /** @class */ (function () {
    function BryntumComboComponent(element) {
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
    BryntumComboComponent.prototype.ngOnInit = function () {
        var _this = this;
        var me = this, elementRef = me.elementRef, bryntumConfig = me.bryntumConfig, instanceClass = BryntumComboComponent.instanceClass, bryntumConfigs = BryntumComboComponent.bryntumConfigs;
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
                select: function (event) { me.onSelect.emit(event); },
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
    BryntumComboComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        var instance = this.instance, instanceClass = BryntumComboComponent.instanceClass;
        if (!instance) {
            return;
        }
        // Iterate over all changes
        Object.entries(changes).forEach(function (_a) {
            var _b = tslib_1.__read(_a, 2), prop = _b[0], change = _b[1];
            var newValue = change.currentValue, instance = _this.instance, bryntumConfigsOnly = BryntumComboComponent.bryntumConfigsOnly, bryntumProps = BryntumComboComponent.bryntumProps;
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
    BryntumComboComponent.prototype.ngOnDestroy = function () {
        if (this.instance) {
            this.instance.destroy();
        }
    };
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
    BryntumComboComponent.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
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
    return BryntumComboComponent;
}());
export { BryntumComboComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJ5bnR1bS1jb21iby5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYnJ5bnR1bS9zY2hlZHVsZXItYW5ndWxhci8iLCJzb3VyY2VzIjpbImxpYi9icnludHVtLWNvbWJvLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7R0FFRzs7QUFFSCxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQXFCLE1BQU0sRUFBRSxLQUFLLEVBQStCLE1BQU0sZUFBZSxDQUFDO0FBQ25JLE9BQU8sYUFBYSxNQUFNLGtCQUFrQixDQUFDO0FBRTdDLDJGQUEyRjtBQUMzRixPQUFPLEVBQUUsSUFBSSxFQUE2RSxNQUFNLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQUNuSixPQUFPLEVBQUUsS0FBSyxFQUFnQixZQUFZLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQUU3RjtJQWtRSSwrQkFBWSxPQUFtQjtRQVB2QixrQkFBYSxHQUFHO1lBQ3BCLGdCQUFnQixFQUFHLElBQUk7WUFDdkIsS0FBSyxFQUFjLFNBQVM7WUFDNUIsU0FBUyxFQUFVLEVBQUU7WUFDckIsUUFBUSxFQUFXLEVBQUU7U0FDeEIsQ0FBQztRQThIRCxTQUFTO1FBQ0EsYUFBUSxHQUFVLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0Msb0JBQWUsR0FBRyxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQzdDLGlCQUFZLEdBQU0sSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUM3QyxpQkFBWSxHQUFNLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsZUFBVSxHQUFRLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsYUFBUSxHQUFVLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsWUFBTyxHQUFXLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsY0FBUyxHQUFTLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsY0FBUyxHQUFTLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsZUFBVSxHQUFRLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsV0FBTSxHQUFZLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsWUFBTyxHQUFXLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsWUFBTyxHQUFXLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsZUFBVSxHQUFRLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsYUFBUSxHQUFVLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsYUFBUSxHQUFVLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsV0FBTSxHQUFZLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsY0FBUyxHQUFTLElBQUksWUFBWSxFQUFVLENBQUM7UUE3SW5ELElBQUksQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDO0lBQzlCLENBQUM7SUE4SUQ7O09BRUc7SUFDSCx3Q0FBUSxHQUFSO1FBQUEsaUJBOERDO1FBNURPLElBQUEsRUFBRSxHQUFHLElBQUksRUFFTCwwQkFBVSxFQUNWLGdDQUFhLEVBR2IsbURBQWEsRUFDYixxREFBYyxDQUNRO1FBRTlCLE1BQU0sQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFO1lBQ3pCLFNBQVMsRUFBRztnQkFDUixNQUFNLFlBQUMsS0FBVyxJQUFJLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEQsYUFBYSxZQUFDLEtBQVcsSUFBSSxFQUFFLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlELFVBQVUsWUFBQyxLQUFXLElBQUksRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN4RCxVQUFVLFlBQUMsS0FBVyxJQUFJLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEQsUUFBUSxZQUFDLEtBQVcsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BELE1BQU0sWUFBQyxLQUFXLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoRCxLQUFLLFlBQUMsS0FBVyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDOUMsT0FBTyxZQUFDLEtBQVcsSUFBSSxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xELE9BQU8sWUFBQyxLQUFXLElBQUksRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsRCxRQUFRLFlBQUMsS0FBVyxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEQsSUFBSSxZQUFDLEtBQVcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVDLEtBQUssWUFBQyxLQUFXLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM5QyxLQUFLLFlBQUMsS0FBVyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDOUMsUUFBUSxZQUFDLEtBQVcsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BELE1BQU0sWUFBQyxLQUFXLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoRCxNQUFNLFlBQUMsS0FBVyxJQUFJLEVBQUUsQ0FBQyxRQUFRLENB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MEJBQ0wsS0FBSzsyQkFDTCxLQUFLOzRCQUNMLEtBQUs7aUNBQ0wsS0FBSzt1QkFDTCxLQUFLO3lCQUNMLEtBQUs7eUJBQ0wsS0FBSzt1QkFDTCxLQUFLO3FCQUNMLEtBQUs7d0JBQ0wsS0FBSzt5QkFDTCxLQUFLOzRCQUNMLEtBQUs7MkJBQ0wsS0FBSzs0QkFDTCxLQUFLOzJCQUNMLEtBQUs7MkJBQ0wsS0FBSzs2QkFDTCxLQUFLO3dCQUNMLEtBQUs7MEJBQ0wsS0FBSzsyQkFDTCxLQUFLO3dCQUNMLEtBQUs7d0JBQ0wsS0FBSztvQkFDTCxLQUFLO29CQUNMLEtBQUs7NkJBR0wsS0FBSzsyQkFHTCxNQUFNO2tDQUNOLE1BQU07K0JBQ04sTUFBTTsrQkFDTixNQUFNOzZCQUNOLE1BQU07MkJBQ04sTUFBTTswQkFDTixNQUFNOzRCQUNOLE1BQU07NEJBQ04sTUFBTTs2QkFDTixNQUFNO3lCQUNOLE1BQU07MEJBQ04sTUFBTTswQkFDTixNQUFNOzZCQUNOLE1BQU07MkJBQ04sTUFBTTsyQkFDTixNQUFNO3lCQUNOLE1BQU07NEJBQ04sTUFBTTs7SUF5R1gsNEJBQUM7Q0FBQSxBQXpmRCxJQXlmQztTQXJmWSxxQkFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEFuZ3VsYXIgd3JhcHBlciBmb3IgQnJ5bnR1bSBDb21ib1xuICovXG5cbmltcG9ydCB7IENvbXBvbmVudCwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBPbkRlc3Ryb3ksIE9uSW5pdCwgT3V0cHV0LCBJbnB1dCwgU2ltcGxlQ2hhbmdlLCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgV3JhcHBlckhlbHBlciBmcm9tICcuL3dyYXBwZXIuaGVscGVyJztcblxuLy8gQnJ5bnR1bSAnc2NoZWR1bGVyLmxpdGUudW1kJyBidW5kbGUgY29tZXMgd2l0aG91dCBwb2x5ZmlsbHMgdG8gc3VwcG9ydCBBbmd1bGFyJ3Mgem9uZS5qc1xuaW1wb3J0IHsgQmFzZSwgTWFzaywgTWFza0NvbmZpZywgUmVjdGFuZ2xlLCBTY3JvbGxlciwgU2Nyb2xsZXJDb25maWcsIFN0b3JlLCBTdG9yZUNvbmZpZywgV2lkZ2V0IH0gZnJvbSAnQGJyeW50dW0vc2NoZWR1bGVyL3NjaGVkdWxlci5saXRlLnVtZC5qcyc7XG5pbXBvcnQgeyBDb21ibywgU3RyaW5nSGVscGVyLCBXaWRnZXRIZWxwZXIgfSBmcm9tICdAYnJ5bnR1bS9zY2hlZHVsZXIvc2NoZWR1bGVyLmxpdGUudW1kLmpzJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3IgOiAnYnJ5bnR1bS1jb21ibycsXG4gICAgdGVtcGxhdGUgOiAnJ1xufSlcbmV4cG9ydCBjbGFzcyBCcnludHVtQ29tYm9Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG5cbiAgICBwdWJsaWMgc3RhdGljIGluc3RhbmNlQ2xhc3MgPSBDb21ibztcblxuICAgIHByaXZhdGUgc3RhdGljIGJyeW50dW1GZWF0dXJlTmFtZXM6IHN0cmluZ1tdID0gW1xuXG4gICAgXTtcblxuICAgIHByaXZhdGUgc3RhdGljIGJyeW50dW1Db25maWdzOiBzdHJpbmdbXSA9IEJyeW50dW1Db21ib0NvbXBvbmVudC5icnludHVtRmVhdHVyZU5hbWVzLmNvbmNhdChbXG4gICAgICAgICdhZG9wdCcsXG4gICAgICAgICdhbGlnbicsXG4gICAgICAgICdhbGlnblNlbGYnLFxuICAgICAgICAnYW5jaG9yJyxcbiAgICAgICAgJ2FwcGVuZFRvJyxcbiAgICAgICAgJ2F1dG9DbG9zZScsXG4gICAgICAgICdhdXRvQ29tcGxldGUnLFxuICAgICAgICAnYXV0b0V4cGFuZCcsXG4gICAgICAgICdhdXRvU2VsZWN0JyxcbiAgICAgICAgJ2JhZGdlJyxcbiAgICAgICAgJ2J1YmJsZUV2ZW50cycsXG4gICAgICAgICdjYXNlU2Vuc2l0aXZlJyxcbiAgICAgICAgJ2NlbnRlcmVkJyxcbiAgICAgICAgJ2NoaXBWaWV3JyxcbiAgICAgICAgJ2NsZWFyYWJsZScsXG4gICAgICAgICdjbGVhclRleHRPblBpY2tlckhpZGUnLFxuICAgICAgICAnY2xzJyxcbiAgICAgICAgJ2NvbmZpZycsXG4gICAgICAgICdjb25zdHJhaW5UbycsXG4gICAgICAgICdjb250ZW50JyxcbiAgICAgICAgJ2NvbnRlbnRFbGVtZW50Q2xzJyxcbiAgICAgICAgJ2RhdGFzZXQnLFxuICAgICAgICAnZGVmYXVsdEJpbmRQcm9wZXJ0eScsXG4gICAgICAgICdkaXNhYmxlZCcsXG4gICAgICAgICdkaXNwbGF5RmllbGQnLFxuICAgICAgICAnZGlzcGxheVZhbHVlUmVuZGVyZXInLFxuICAgICAgICAnZG9jaycsXG4gICAgICAgICdkcmFnZ2FibGUnLFxuICAgICAgICAnZWRpdGFibGUnLFxuICAgICAgICAnZW1wdHlUZXh0JyxcbiAgICAgICAgJ2VuY29kZUZpbHRlclBhcmFtcycsXG4gICAgICAgICdleHRyYURhdGEnLFxuICAgICAgICAnZmlsdGVyT25FbnRlcicsXG4gICAgICAgICdmaWx0ZXJPcGVyYXRvcicsXG4gICAgICAgICdmaWx0ZXJQYXJhbU5hbWUnLFxuICAgICAgICAnZmlsdGVyU2VsZWN0ZWQnLFxuICAgICAgICAnZmxleCcsXG4gICAgICAgICdmbG9hdGluZycsXG4gICAgICAgICdoZWlnaHQnLFxuICAgICAgICAnaGlkZGVuJyxcbiAgICAgICAgJ2hpZGVBbmltYXRpb24nLFxuICAgICAgICAnaGlkZVBpY2tlck9uU2VsZWN0JyxcbiAgICAgICAgJ2hpZGVUcmlnZ2VyJyxcbiAgICAgICAgJ2hpZ2hsaWdodEV4dGVybmFsQ2hhbmdlJyxcbiAgICAgICAgJ2hpbnQnLFxuICAgICAgICAnaGludEh0bWwnLFxuICAgICAgICAnaHRtbCcsXG4gICAgICAgICdodG1sQ2xzJyxcbiAgICAgICAgJ2lkJyxcbiAgICAgICAgJ2lucHV0QWxpZ24nLFxuICAgICAgICAnaW5wdXRBdHRyaWJ1dGVzJyxcbiAgICAgICAgJ2lucHV0V2lkdGgnLFxuICAgICAgICAnaW5zZXJ0QmVmb3JlJyxcbiAgICAgICAgJ2luc2VydEZpcnN0JyxcbiAgICAgICAgJ2l0ZW1zJyxcbiAgICAgICAgJ2tleVN0cm9rZUNoYW5nZURlbGF5JyxcbiAgICAgICAgJ2tleVN0cm9rZUZpbHRlckRlbGF5JyxcbiAgICAgICAgJ2xhYmVsJyxcbiAgICAgICAgJ2xhYmVsQ2xzJyxcbiAgICAgICAgJ2xhYmVsUG9zaXRpb24nLFxuICAgICAgICAnbGFiZWxzJyxcbiAgICAgICAgJ2xhYmVsV2lkdGgnLFxuICAgICAgICAnbGlzdENscycsXG4gICAgICAgICdsaXN0ZW5lcnMnLFxuICAgICAgICAnbGlzdEl0ZW1UcGwnLFxuICAgICAgICAnbG9jYWxlQ2xhc3MnLFxuICAgICAgICAnbG9jYWxpemFibGVQcm9wZXJ0aWVzJyxcbiAgICAgICAgJ21hcmdpbicsXG4gICAgICAgICdtYXNrRGVmYXVsdHMnLFxuICAgICAgICAnbWFza2VkJyxcbiAgICAgICAgJ21heEhlaWdodCcsXG4gICAgICAgICdtYXhMZW5ndGgnLFxuICAgICAgICAnbWF4V2lkdGgnLFxuICAgICAgICAnbWluQ2hhcnMnLFxuICAgICAgICAnbWluSGVpZ2h0JyxcbiAgICAgICAgJ21pbkxlbmd0aCcsXG4gICAgICAgICdtaW5XaWR0aCcsXG4gICAgICAgICdtb25pdG9yUmVzaXplJyxcbiAgICAgICAgJ211bHRpU2VsZWN0JyxcbiAgICAgICAgJ25hbWUnLFxuICAgICAgICAnb3ZlcmxheUFuY2hvcicsXG4gICAgICAgICdvd25lcicsXG4gICAgICAgICdwaWNrZXInLFxuICAgICAgICAncGlja2VyQWxpZ25FbGVtZW50JyxcbiAgICAgICAgJ3BpY2tlcldpZHRoJyxcbiAgICAgICAgJ3BsYWNlaG9sZGVyJyxcbiAgICAgICAgJ3Bvc2l0aW9uZWQnLFxuICAgICAgICAncHJldmVudFRvb2x0aXBPblRvdWNoJyxcbiAgICAgICAgJ3ByaW1hcnlGaWx0ZXInLFxuICAgICAgICAncmVhZE9ubHknLFxuICAgICAgICAncmVxdWlyZWQnLFxuICAgICAgICAncmV2ZXJ0T25Fc2NhcGUnLFxuICAgICAgICAncmlwcGxlJyxcbiAgICAgICAgJ3Jvb3RFbGVtZW50JyxcbiAgICAgICAgJ3Njcm9sbGFibGUnLFxuICAgICAgICAnc2Nyb2xsQWN0aW9uJyxcbiAgICAgICAgJ3Nob3dBbmltYXRpb24nLFxuICAgICAgICAnc3RvcmUnLFxuICAgICAgICAndGFiJyxcbiAgICAgICAgJ3RhYkluZGV4JyxcbiAgICAgICAgJ3RhZycsXG4gICAgICAgICd0ZXh0QWxpZ24nLFxuICAgICAgICAndGl0bGUnLFxuICAgICAgICAndG9vbHRpcCcsXG4gICAgICAgICd0cmlnZ2VyQWN0aW9uJyxcbiAgICAgICAgJ3RyaWdnZXJzJyxcbiAgICAgICAgJ3ZhbGlkYXRlRmlsdGVyJyxcbiAgICAgICAgJ3ZhbHVlJyxcbiAgICAgICAgJ3ZhbHVlRmllbGQnLFxuICAgICAgICAnd2VpZ2h0JyxcbiAgICAgICAgJ3dpZHRoJyxcbiAgICAgICAgJ3gnLFxuICAgICAgICAneSdcbiAgICBdKTtcblxuICAgIHByaXZhdGUgc3RhdGljIGJyeW50dW1Db25maWdzT25seTogc3RyaW5nW10gPSBbXG4gICAgICAgICdhZG9wdCcsXG4gICAgICAgICdhbGlnbicsXG4gICAgICAgICdhbmNob3InLFxuICAgICAgICAnYXBwZW5kVG8nLFxuICAgICAgICAnYXV0b0Nsb3NlJyxcbiAgICAgICAgJ2F1dG9Db21wbGV0ZScsXG4gICAgICAgICdhdXRvRXhwYW5kJyxcbiAgICAgICAgJ2F1dG9TZWxlY3QnLFxuICAgICAgICAnYnViYmxlRXZlbnRzJyxcbiAgICAgICAgJ2Nhc2VTZW5zaXRpdmUnLFxuICAgICAgICAnY2VudGVyZWQnLFxuICAgICAgICAnY2hpcFZpZXcnLFxuICAgICAgICAnY2xlYXJhYmxlJyxcbiAgICAgICAgJ2NsZWFyVGV4dE9uUGlja2VySGlkZScsXG4gICAgICAgICdjbHMnLFxuICAgICAgICAnY29uZmlnJyxcbiAgICAgICAgJ2NvbnN0cmFpblRvJyxcbiAgICAgICAgJ2NvbnRlbnRFbGVtZW50Q2xzJyxcbiAgICAgICAgJ2RlZmF1bHRCaW5kUHJvcGVydHknLFxuICAgICAgICAnZGlzcGxheUZpZWxkJyxcbiAgICAgICAgJ2Rpc3BsYXlWYWx1ZVJlbmRlcmVyJyxcbiAgICAgICAgJ2RvY2snLFxuICAgICAgICAnZHJhZ2dhYmxlJyxcbiAgICAgICAgJ2VkaXRhYmxlJyxcbiAgICAgICAgJ2VtcHR5VGV4dCcsXG4gICAgICAgICdlbmNvZGVGaWx0ZXJQYXJhbXMnLFxuICAgICAgICAnZmlsdGVyT25FbnRlcicsXG4gICAgICAgICdmaWx0ZXJQYXJhbU5hbWUnLFxuICAgICAgICAnZmlsdGVyU2VsZWN0ZWQnLFxuICAgICAgICAnZmxvYXRpbmcnLFxuICAgICAgICAnaGlkZUFuaW1hdGlvbicsXG4gICAgICAgICdoaWRlUGlja2VyT25TZWxlY3QnLFxuICAgICAgICAnaGlkZVRyaWdnZXInLFxuICAgICAgICAnaGlnaGxpZ2h0RXh0ZXJuYWxDaGFuZ2UnLFxuICAgICAgICAnaGludCcsXG4gICAgICAgICdoaW50SHRtbCcsXG4gICAgICAgICdodG1sQ2xzJyxcbiAgICAgICAgJ2lucHV0QWxpZ24nLFxuICAgICAgICAnaW5wdXRBdHRyaWJ1dGVzJyxcbiAgICAgICAgJ2lucHV0V2lkdGgnLFxuICAgICAgICAnaW5zZXJ0QmVmb3JlJyxcbiAgICAgICAgJ2luc2VydEZpcnN0JyxcbiAgICAgICAgJ2l0ZW1zJyxcbiAgICAgICAgJ2tleVN0cm9rZUNoYW5nZURlbGF5JyxcbiAgICAgICAgJ2tleVN0cm9rZUZpbHRlckRlbGF5JyxcbiAgICAgICAgJ2xhYmVsQ2xzJyxcbiAgICAgICAgJ2xhYmVsUG9zaXRpb24nLFxuICAgICAgICAnbGFiZWxzJyxcbiAgICAgICAgJ2xhYmVsV2lkdGgnLFxuICAgICAgICAnbGlzdENscycsXG4gICAgICAgICdsaXN0ZW5lcnMnLFxuICAgICAgICAnbGlzdEl0ZW1UcGwnLFxuICAgICAgICAnbG9jYWxlQ2xhc3MnLFxuICAgICAgICAnbG9jYWxpemFibGVQcm9wZXJ0aWVzJyxcbiAgICAgICAgJ21hc2tEZWZhdWx0cycsXG4gICAgICAgICdtYXNrZWQnLFxuICAgICAgICAnbWF4TGVuZ3RoJyxcbiAgICAgICAgJ21pbkNoYXJzJyxcbiAgICAgICAgJ21pbkxlbmd0aCcsXG4gICAgICAgICdtb25pdG9yUmVzaXplJyxcbiAgICAgICAgJ211bHRpU2VsZWN0JyxcbiAgICAgICAgJ25hbWUnLFxuICAgICAgICAnb3ZlcmxheUFuY2hvcicsXG4gICAgICAgICdvd25lcicsXG4gICAgICAgICdwaWNrZXInLFxuICAgICAgICAncGlja2VyQWxpZ25FbGVtZW50JyxcbiAgICAgICAgJ3BpY2tlcldpZHRoJyxcbiAgICAgICAgJ3BsYWNlaG9sZGVyJyxcbiAgICAgICAgJ3Bvc2l0aW9uZWQnLFxuICAgICAgICAncHJldmVudFRvb2x0aXBPblRvdWNoJyxcbiAgICAgICAgJ3ByaW1hcnlGaWx0ZXInLFxuICAgICAgICAncmVxdWlyZWQnLFxuICAgICAgICAncmV2ZXJ0T25Fc2NhcGUnLFxuICAgICAgICAncmlwcGxlJyxcbiAgICAgICAgJ3Jvb3RFbGVtZW50JyxcbiAgICAgICAgJ3Njcm9sbEFjdGlvbicsXG4gICAgICAgICdzaG93QW5pbWF0aW9uJyxcbiAgICAgICAgJ3RhYicsXG4gICAgICAgICd0YWJJbmRleCcsXG4gICAgICAgICd0YWcnLFxuICAgICAgICAndGV4dEFsaWduJyxcbiAgICAgICAgJ3RpdGxlJyxcbiAgICAgICAgJ3RyaWdnZXJBY3Rpb24nLFxuICAgICAgICAndmFsaWRhdGVGaWx0ZXInLFxuICAgICAgICAndmFsdWVGaWVsZCcsXG4gICAgICAgICd3ZWlnaHQnXG4gICAgXTtcblxuICAgIHByaXZhdGUgc3RhdGljIGJyeW50dW1Qcm9wczogc3RyaW5nW10gPSBCcnludHVtQ29tYm9Db21wb25lbnQuYnJ5bnR1bUZlYXR1cmVOYW1lcy5jb25jYXQoW1xuICAgICAgICAnYWxpZ25TZWxmJyxcbiAgICAgICAgJ2FuY2hvclNpemUnLFxuICAgICAgICAnYmFkZ2UnLFxuICAgICAgICAnY29udGVudCcsXG4gICAgICAgICdkYXRhc2V0JyxcbiAgICAgICAgJ2Rpc2FibGVkJyxcbiAgICAgICAgJ2V4dHJhRGF0YScsXG4gICAgICAgICdmaWx0ZXJPcGVyYXRvcicsXG4gICAgICAgICdmbGV4JyxcbiAgICAgICAgJ2hlaWdodCcsXG4gICAgICAgICdoaWRkZW4nLFxuICAgICAgICAnaHRtbCcsXG4gICAgICAgICdpZCcsXG4gICAgICAgICdsYWJlbCcsXG4gICAgICAgICdtYXJnaW4nLFxuICAgICAgICAnbWF4SGVpZ2h0JyxcbiAgICAgICAgJ21heFdpZHRoJyxcbiAgICAgICAgJ21pbkhlaWdodCcsXG4gICAgICAgICdtaW5XaWR0aCcsXG4gICAgICAgICdyZWFkT25seScsXG4gICAgICAgICdzY3JvbGxhYmxlJyxcbiAgICAgICAgJ3N0b3JlJyxcbiAgICAgICAgJ3Rvb2x0aXAnLFxuICAgICAgICAndHJpZ2dlcnMnLFxuICAgICAgICAndmFsdWUnLFxuICAgICAgICAnd2lkdGgnLFxuICAgICAgICAneCcsXG4gICAgICAgICd5J1xuICAgIF0pO1xuXG4gICAgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmO1xuICAgIHB1YmxpYyBpbnN0YW5jZTogQ29tYm87XG5cbiAgICBwcml2YXRlIGJyeW50dW1Db25maWcgPSB7XG4gICAgICAgIGFuZ3VsYXJDb21wb25lbnQgOiB0aGlzLFxuICAgICAgICBhZG9wdCAgICAgICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgICBsaXN0ZW5lcnMgICAgICAgIDoge30sXG4gICAgICAgIGZlYXR1cmVzICAgICAgICAgOiB7fVxuICAgIH07XG5cbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50OiBFbGVtZW50UmVmKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudFJlZiA9IGVsZW1lbnQ7XG4gICAgfVxuXG4gICAgIC8vIENvbmZpZ3Mgb25seVxuICAgIEBJbnB1dCgpIGFkb3B0ICAgICAgICAgICAgICAgICAgIDogSFRNTEVsZW1lbnR8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGFsaWduICAgICAgICAgICAgICAgICAgIDogb2JqZWN0fHN0cmluZztcbiAgICBASW5wdXQoKSBhbmNob3IgICAgICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgYXBwZW5kVG8gICAgICAgICAgICAgICAgOiBIVE1MRWxlbWVudHxzdHJpbmc7XG4gICAgQElucHV0KCkgYXV0b0Nsb3NlICAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGF1dG9Db21wbGV0ZSAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGF1dG9FeHBhbmQgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBhdXRvU2VsZWN0ICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgYnViYmxlRXZlbnRzICAgICAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgY2FzZVNlbnNpdGl2ZSAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGNlbnRlcmVkICAgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBjaGlwVmlldyAgICAgICAgICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBjbGVhcmFibGUgICAgICAgICAgICAgICA6IGJvb2xlYW58b2JqZWN0O1xuICAgIEBJbnB1dCgpIGNsZWFyVGV4dE9uUGlja2VySGlkZSAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBjbHMgICAgICAgICAgICAgICAgICAgICA6IHN0cmluZ3xvYmplY3Q7XG4gICAgQElucHV0KCkgY29uZmlnICAgICAgICAgICAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgY29uc3RyYWluVG8gICAgICAgICAgICAgOiBIVE1MRWxlbWVudHxXaWRnZXR8UmVjdGFuZ2xlO1xuICAgIEBJbnB1dCgpIGNvbnRlbnRFbGVtZW50Q2xzICAgICAgIDogc3RyaW5nfG9iamVjdDtcbiAgICBASW5wdXQoKSBkZWZhdWx0QmluZFByb3BlcnR5ICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBkaXNwbGF5RmllbGQgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBkaXNwbGF5VmFsdWVSZW5kZXJlciAgICA6IEZ1bmN0aW9uO1xuICAgIEBJbnB1dCgpIGRvY2sgICAgICAgICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGRyYWdnYWJsZSAgICAgICAgICAgICAgIDogYm9vbGVhbnxvYmplY3Q7XG4gICAgQElucHV0KCkgZWRpdGFibGUgICAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGVtcHR5VGV4dCAgICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGVuY29kZUZpbHRlclBhcmFtcyAgICAgIDogRnVuY3Rpb247XG4gICAgQElucHV0KCkgZmlsdGVyT25FbnRlciAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGZpbHRlclBhcmFtTmFtZSAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGZpbHRlclNlbGVjdGVkICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBmbG9hdGluZyAgICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgaGlkZUFuaW1hdGlvbiAgICAgICAgICAgOiBib29sZWFufG9iamVjdDtcbiAgICBASW5wdXQoKSBoaWRlUGlja2VyT25TZWxlY3QgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgaGlkZVRyaWdnZXIgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGhpZ2hsaWdodEV4dGVybmFsQ2hhbmdlIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBoaW50ICAgICAgICAgICAgICAgICAgICA6IHN0cmluZ3xGdW5jdGlvbjtcbiAgICBASW5wdXQoKSBoaW50SHRtbCAgICAgICAgICAgICAgICA6IHN0cmluZ3xGdW5jdGlvbjtcbiAgICBASW5wdXQoKSBodG1sQ2xzICAgICAgICAgICAgICAgICA6IHN0cmluZ3xvYmplY3Q7XG4gICAgQElucHV0KCkgaW5wdXRBbGlnbiAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgaW5wdXRBdHRyaWJ1dGVzICAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgaW5wdXRXaWR0aCAgICAgICAgICAgICAgOiBzdHJpbmd8bnVtYmVyO1xuICAgIEBJbnB1dCgpIGluc2VydEJlZm9yZSAgICAgICAgICAgIDogSFRNTEVsZW1lbnR8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGluc2VydEZpcnN0ICAgICAgICAgICAgIDogSFRNTEVsZW1lbnR8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGl0ZW1zICAgICAgICAgICAgICAgICAgIDogb2JqZWN0W118c3RyaW5nW118b2JqZWN0O1xuICAgIEBJbnB1dCgpIGtleVN0cm9rZUNoYW5nZURlbGF5ICAgIDogbnVtYmVyO1xuICAgIEBJbnB1dCgpIGtleVN0cm9rZUZpbHRlckRlbGF5ICAgIDogbnVtYmVyO1xuICAgIEBJbnB1dCgpIGxhYmVsQ2xzICAgICAgICAgICAgICAgIDogc3RyaW5nfG9iamVjdDtcbiAgICBASW5wdXQoKSBsYWJlbFBvc2l0aW9uICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBsYWJlbHMgICAgICAgICAgICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBsYWJlbFdpZHRoICAgICAgICAgICAgICA6IHN0cmluZ3xudW1iZXI7XG4gICAgQElucHV0KCkgbGlzdENscyAgICAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgbGlzdGVuZXJzICAgICAgICAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgbGlzdEl0ZW1UcGwgICAgICAgICAgICAgOiBGdW5jdGlvbjtcbiAgICBASW5wdXQoKSBsb2NhbGVDbGFzcyAgICAgICAgICAgICA6IEJhc2U7XG4gICAgQElucHV0KCkgbG9jYWxpemFibGVQcm9wZXJ0aWVzICAgOiBzdHJpbmdbXTtcbiAgICBASW5wdXQoKSBtYXNrRGVmYXVsdHMgICAgICAgICAgICA6IG9iamVjdHxNYXNrfFBhcnRpYWw8TWFza0NvbmZpZz47XG4gICAgQElucHV0KCkgbWFza2VkICAgICAgICAgICAgICAgICAgOiBib29sZWFufHN0cmluZ3xvYmplY3R8TWFza3xQYXJ0aWFsPE1hc2tDb25maWc+O1xuICAgIEBJbnB1dCgpIG1heExlbmd0aCAgICAgICAgICAgICAgIDogbnVtYmVyO1xuICAgIEBJbnB1dCgpIG1pbkNoYXJzICAgICAgICAgICAgICAgIDogbnVtYmVyO1xuICAgIEBJbnB1dCgpIG1pbkxlbmd0aCAgICAgICAgICAgICAgIDogbnVtYmVyO1xuICAgIEBJbnB1dCgpIG1vbml0b3JSZXNpemUgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBtdWx0aVNlbGVjdCAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgbmFtZSAgICAgICAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgb3ZlcmxheUFuY2hvciAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIG93bmVyICAgICAgICAgICAgICAgICAgIDogV2lkZ2V0O1xuICAgIEBJbnB1dCgpIHBpY2tlciAgICAgICAgICAgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIHBpY2tlckFsaWduRWxlbWVudCAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIHBpY2tlcldpZHRoICAgICAgICAgICAgIDogbnVtYmVyO1xuICAgIEBJbnB1dCgpIHBsYWNlaG9sZGVyICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIHBvc2l0aW9uZWQgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBwcmV2ZW50VG9vbHRpcE9uVG91Y2ggICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgcHJpbWFyeUZpbHRlciAgICAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgcmVxdWlyZWQgICAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHJldmVydE9uRXNjYXBlICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSByaXBwbGUgICAgICAgICAgICAgICAgICA6IGJvb2xlYW58b2JqZWN0O1xuICAgIEBJbnB1dCgpIHJvb3RFbGVtZW50ICAgICAgICAgICAgIDogU2hhZG93Um9vdDtcbiAgICBASW5wdXQoKSBzY3JvbGxBY3Rpb24gICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBzaG93QW5pbWF0aW9uICAgICAgICAgICA6IGJvb2xlYW58b2JqZWN0O1xuICAgIEBJbnB1dCgpIHRhYiAgICAgICAgICAgICAgICAgICAgIDogYm9vbGVhbnxvYmplY3Q7XG4gICAgQElucHV0KCkgdGFiSW5kZXggICAgICAgICAgICAgICAgOiBudW1iZXI7XG4gICAgQElucHV0KCkgdGFnICAgICAgICAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgdGV4dEFsaWduICAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgdGl0bGUgICAgICAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgdHJpZ2dlckFjdGlvbiAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgdmFsaWRhdGVGaWx0ZXIgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHZhbHVlRmllbGQgICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIHdlaWdodCAgICAgICAgICAgICAgICAgIDogbnVtYmVyO1xuXG4gICAgIC8vIENvbmZpZ3MgYW5kIHByb3BlcnRpZXNcbiAgICBASW5wdXQoKSBhbGlnblNlbGYgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBiYWRnZSAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBjb250ZW50ICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBkYXRhc2V0ICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBkaXNhYmxlZCAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgZXh0cmFEYXRhICAgICAgOiBib29sZWFufG51bWJlcnxvYmplY3R8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGZpbHRlck9wZXJhdG9yIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGZsZXggICAgICAgICAgIDogbnVtYmVyfHN0cmluZztcbiAgICBASW5wdXQoKSBoZWlnaHQgICAgICAgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgaGlkZGVuICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGh0bWwgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGlkICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGxhYmVsICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIG1hcmdpbiAgICAgICAgIDogbnVtYmVyfHN0cmluZztcbiAgICBASW5wdXQoKSBtYXhIZWlnaHQgICAgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgbWF4V2lkdGggICAgICAgOiBudW1iZXJ8c3RyaW5nO1xuICAgIEBJbnB1dCgpIG1pbkhlaWdodCAgICAgIDogbnVtYmVyfHN0cmluZztcbiAgICBASW5wdXQoKSBtaW5XaWR0aCAgICAgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgcmVhZE9ubHkgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHNjcm9sbGFibGUgICAgIDogYm9vbGVhbnxTY3JvbGxlcnxvYmplY3R8UGFydGlhbDxTY3JvbGxlckNvbmZpZz47XG4gICAgQElucHV0KCkgc3RvcmUgICAgICAgICAgOiBTdG9yZXxvYmplY3R8UGFydGlhbDxTdG9yZUNvbmZpZz47XG4gICAgQElucHV0KCkgdG9vbHRpcCAgICAgICAgOiBvYmplY3R8c3RyaW5nO1xuICAgIEBJbnB1dCgpIHRyaWdnZXJzICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIHZhbHVlICAgICAgICAgIDogbnVtYmVyW118b2JqZWN0fHN0cmluZ3xzdHJpbmdbXTtcbiAgICBASW5wdXQoKSB3aWR0aCAgICAgICAgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgeCAgICAgICAgICAgICAgOiBudW1iZXI7XG4gICAgQElucHV0KCkgeSAgICAgICAgICAgICAgOiBudW1iZXI7XG5cbiAgICAgLy8gUHJvcGVydGllcyBvbmx5XG4gICAgQElucHV0KCkgYW5jaG9yU2l6ZSA6IG51bWJlcltdO1xuXG4gICAgIC8vIEV2ZW50c1xuICAgIEBPdXRwdXQoKSBvbkFjdGlvbiAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25CZWZvcmVEZXN0cm95ID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uQmVmb3JlSGlkZSAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkJlZm9yZVNob3cgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25DYXRjaEFsbCAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uQ2hhbmdlICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkNsZWFyICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25EZXN0cm95ICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uRm9jdXNJbiAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkZvY3VzT3V0ICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25IaWRlICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uSW5wdXQgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvblBhaW50ICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25SZWFkT25seSAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uUmVzaXplICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvblNlbGVjdCAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25TaG93ICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uVHJpZ2dlciAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGFuZCBhcHBlbmQgdGhlIHVuZGVybHlpbmcgd2lkZ2V0XG4gICAgICovXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0XG4gICAgICAgICAgICBtZSA9IHRoaXMsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZWxlbWVudFJlZixcbiAgICAgICAgICAgICAgICBicnludHVtQ29uZmlnXG4gICAgICAgICAgICB9ID0gbWUsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaW5zdGFuY2VDbGFzcyxcbiAgICAgICAgICAgICAgICBicnludHVtQ29uZmlnc1xuICAgICAgICAgICAgfSA9IEJyeW50dW1Db21ib0NvbXBvbmVudDtcblxuICAgICAgICBPYmplY3QuYXNzaWduKGJyeW50dW1Db25maWcsIHtcbiAgICAgICAgICAgIGxpc3RlbmVycyA6IHtcbiAgICAgICAgICAgICAgICBhY3Rpb24oZXZlbnQgOiBhbnkpIHsgbWUub25BY3Rpb24uZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgYmVmb3JlRGVzdHJveShldmVudCA6IGFueSkgeyBtZS5vbkJlZm9yZURlc3Ryb3kuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgYmVmb3JlSGlkZShldmVudCA6IGFueSkgeyBtZS5vbkJlZm9yZUhpZGUuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgYmVmb3JlU2hvdyhldmVudCA6IGFueSkgeyBtZS5vbkJlZm9yZVNob3cuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgY2F0Y2hBbGwoZXZlbnQgOiBhbnkpIHsgbWUub25DYXRjaEFsbC5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBjaGFuZ2UoZXZlbnQgOiBhbnkpIHsgbWUub25DaGFuZ2UuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgY2xlYXIoZXZlbnQgOiBhbnkpIHsgbWUub25DbGVhci5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBkZXN0cm95KGV2ZW50IDogYW55KSB7IG1lLm9uRGVzdHJveS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBmb2N1c0luKGV2ZW50IDogYW55KSB7IG1lLm9uRm9jdXNJbi5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBmb2N1c091dChldmVudCA6IGFueSkgeyBtZS5vbkZvY3VzT3V0LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGhpZGUoZXZlbnQgOiBhbnkpIHsgbWUub25IaWRlLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGlucHV0KGV2ZW50IDogYW55KSB7IG1lLm9uSW5wdXQuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgcGFpbnQoZXZlbnQgOiBhbnkpIHsgbWUub25QYWludC5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICByZWFkT25seShldmVudCA6IGFueSkgeyBtZS5vblJlYWRPbmx5LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIHJlc2l6ZShldmVudCA6IGFueSkgeyBtZS5vblJlc2l6ZS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBzZWxlY3QoZXZlbnQgOiBhbnkpIHsgbWUub25TZWxlY3QuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgc2hvdyhldmVudCA6IGFueSkgeyBtZS5vblNob3cuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgdHJpZ2dlcihldmVudCA6IGFueSkgeyBtZS5vblRyaWdnZXIuZW1pdChldmVudCk7IH0sXG5cbiAgICAgICAgICAgICAgICB0aGlzT2JqIDogbWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gSWYgY29tcG9uZW50IGhhcyBubyBjb250YWluZXIgc3BlY2lmaWVkIGluIGNvbmZpZyB0aGVuIHVzZSBhZG9wdCB0byBXcmFwcGVyJ3MgZWxlbWVudFxuICAgICAgICBjb25zdFxuICAgICAgICAgICAgY29udGFpbmVyUGFyYW0gPSBbXG4gICAgICAgICAgICAgICAgJ2Fkb3B0JyxcbiAgICAgICAgICAgICAgICAnYXBwZW5kVG8nLFxuICAgICAgICAgICAgICAgICdpbnNlcnRBZnRlcicsXG4gICAgICAgICAgICAgICAgJ2luc2VydEJlZm9yZSdcbiAgICAgICAgICAgIF0uZmluZChwcm9wID0+IGJyeW50dW1Db25maWdbcHJvcF0pO1xuICAgICAgICBpZiAoIWNvbnRhaW5lclBhcmFtKSB7XG4gICAgICAgICAgICBicnludHVtQ29uZmlnLmFkb3B0ID0gZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgV3JhcHBlckhlbHBlci5kZXZXYXJuaW5nQ29udGFpbmVyKGluc3RhbmNlQ2xhc3MuJG5hbWUsIGNvbnRhaW5lclBhcmFtKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJyeW50dW1Db25maWdzLmZpbHRlcihwcm9wID0+IHByb3AgaW4gdGhpcykuZm9yRWFjaChwcm9wID0+IHtcbiAgICAgICAgICAgIFdyYXBwZXJIZWxwZXIuYXBwbHlQcm9wVmFsdWUoYnJ5bnR1bUNvbmZpZywgcHJvcCwgdGhpc1twcm9wXSk7XG4gICAgICAgICAgICBpZiAoWydmZWF0dXJlcycsICdjb25maWcnXS5pbmNsdWRlcyhwcm9wKSkge1xuICAgICAgICAgICAgICAgIFdyYXBwZXJIZWxwZXIuZGV2V2FybmluZ0NvbmZpZ1Byb3AoaW5zdGFuY2VDbGFzcy4kbmFtZSwgcHJvcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgbWUuaW5zdGFuY2UgPSBpbnN0YW5jZUNsYXNzLiRuYW1lID09PSAnV2lkZ2V0JyA/IFdpZGdldEhlbHBlci5jcmVhdGVXaWRnZXQoYnJ5bnR1bUNvbmZpZykgOiBuZXcgaW5zdGFuY2VDbGFzcyhicnludHVtQ29uZmlnKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFdhdGNoIGZvciBjaGFuZ2VzXG4gICAgICogQHBhcmFtIGNoYW5nZXNcbiAgICAgKi9cbiAgICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgICAgIGNvbnN0XG4gICAgICAgICAgICB7IGluc3RhbmNlIH0gPSB0aGlzLFxuICAgICAgICAgICAgeyBpbnN0YW5jZUNsYXNzIH0gPSBCcnludHVtQ29tYm9Db21wb25lbnQ7XG5cbiAgICAgICAgaWYgKCFpbnN0YW5jZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSXRlcmF0ZSBvdmVyIGFsbCBjaGFuZ2VzXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKGNoYW5nZXMpLmZvckVhY2goKFtwcm9wLCBjaGFuZ2VdKSA9PiB7XG4gICAgICAgICAgICBjb25zdFxuICAgICAgICAgICAgICAgIG5ld1ZhbHVlID0gKGNoYW5nZSBhcyBTaW1wbGVDaGFuZ2UpLmN1cnJlbnRWYWx1ZSxcbiAgICAgICAgICAgICAgICB7IGluc3RhbmNlIH0gPSB0aGlzLFxuICAgICAgICAgICAgICAgIHsgYnJ5bnR1bUNvbmZpZ3NPbmx5LCBicnludHVtUHJvcHMgfSA9IEJyeW50dW1Db21ib0NvbXBvbmVudDtcbiAgICAgICAgICAgIGlmIChicnludHVtUHJvcHMuaW5jbHVkZXMocHJvcCkpIHtcbiAgICAgICAgICAgICAgICBXcmFwcGVySGVscGVyLmFwcGx5UHJvcFZhbHVlKGluc3RhbmNlLCBwcm9wLCBuZXdWYWx1ZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIGlmIChicnludHVtQ29uZmlnc09ubHkuaW5jbHVkZXMocHJvcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgV3JhcHBlckhlbHBlci5kZXZXYXJuaW5nVXBkYXRlUHJvcChpbnN0YW5jZUNsYXNzLiRuYW1lLCBwcm9wKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERlc3Ryb3kgdGhlIGNvbXBvbmVudFxuICAgICAqL1xuICAgIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5pbnN0YW5jZSkge1xuICAgICAgICAgICAgdGhpcy5pbnN0YW5jZS5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=