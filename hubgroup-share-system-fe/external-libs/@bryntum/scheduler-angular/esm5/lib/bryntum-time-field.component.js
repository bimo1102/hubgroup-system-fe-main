/**
 * Angular wrapper for Bryntum TimeField
 */
import * as tslib_1 from "tslib";
import { Component, ElementRef, EventEmitter, Output, Input } from '@angular/core';
import WrapperHelper from './wrapper.helper';
// Bryntum 'scheduler.lite.umd' bundle comes without polyfills to support Angular's zone.js
import { Base, Widget } from '@bryntum/scheduler/scheduler.lite.umd.js';
import { TimeField, WidgetHelper } from '@bryntum/scheduler/scheduler.lite.umd.js';
var BryntumTimeFieldComponent = /** @class */ (function () {
    function BryntumTimeFieldComponent(element) {
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
    BryntumTimeFieldComponent.prototype.ngOnInit = function () {
        var _this = this;
        var me = this, elementRef = me.elementRef, bryntumConfig = me.bryntumConfig, instanceClass = BryntumTimeFieldComponent.instanceClass, bryntumConfigs = BryntumTimeFieldComponent.bryntumConfigs;
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
    BryntumTimeFieldComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        var instance = this.instance, instanceClass = BryntumTimeFieldComponent.instanceClass;
        if (!instance) {
            return;
        }
        // Iterate over all changes
        Object.entries(changes).forEach(function (_a) {
            var _b = tslib_1.__read(_a, 2), prop = _b[0], change = _b[1];
            var newValue = change.currentValue, instance = _this.instance, bryntumConfigsOnly = BryntumTimeFieldComponent.bryntumConfigsOnly, bryntumProps = BryntumTimeFieldComponent.bryntumProps;
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
    BryntumTimeFieldComponent.prototype.ngOnDestroy = function () {
        if (this.instance) {
            this.instance.destroy();
        }
    };
    BryntumTimeFieldComponent.instanceClass = TimeField;
    BryntumTimeFieldComponent.bryntumFeatureNames = [];
    BryntumTimeFieldComponent.bryntumConfigs = BryntumTimeFieldComponent.bryntumFeatureNames.concat([
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
        'max',
        'maxHeight',
        'maxLength',
        'maxWidth',
        'min',
        'minHeight',
        'minLength',
        'minWidth',
        'monitorResize',
        'name',
        'owner',
        'picker',
        'pickerAlignElement',
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
    BryntumTimeFieldComponent.bryntumConfigsOnly = [
        'adopt',
        'align',
        'anchor',
        'appendTo',
        'autoClose',
        'autoComplete',
        'autoExpand',
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
        'picker',
        'pickerAlignElement',
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
        'tabIndex',
        'tag',
        'textAlign',
        'title',
        'weight'
    ];
    BryntumTimeFieldComponent.bryntumProps = BryntumTimeFieldComponent.bryntumFeatureNames.concat([
        'alignSelf',
        'anchorSize',
        'badge',
        'content',
        'dataset',
        'disabled',
        'extraData',
        'flex',
        'format',
        'height',
        'hidden',
        'html',
        'id',
        'label',
        'margin',
        'max',
        'maxHeight',
        'maxWidth',
        'min',
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
    BryntumTimeFieldComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bryntum-time-field',
                    template: ''
                }] }
    ];
    /** @nocollapse */
    BryntumTimeFieldComponent.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    BryntumTimeFieldComponent.propDecorators = {
        adopt: [{ type: Input }],
        align: [{ type: Input }],
        anchor: [{ type: Input }],
        appendTo: [{ type: Input }],
        autoClose: [{ type: Input }],
        autoComplete: [{ type: Input }],
        autoExpand: [{ type: Input }],
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
        picker: [{ type: Input }],
        pickerAlignElement: [{ type: Input }],
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
        format: [{ type: Input }],
        height: [{ type: Input }],
        hidden: [{ type: Input }],
        html: [{ type: Input }],
        id: [{ type: Input }],
        label: [{ type: Input }],
        margin: [{ type: Input }],
        max: [{ type: Input }],
        maxHeight: [{ type: Input }],
        maxWidth: [{ type: Input }],
        min: [{ type: Input }],
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
    return BryntumTimeFieldComponent;
}());
export { BryntumTimeFieldComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJ5bnR1bS10aW1lLWZpZWxkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BicnludHVtL3NjaGVkdWxlci1hbmd1bGFyLyIsInNvdXJjZXMiOlsibGliL2JyeW50dW0tdGltZS1maWVsZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0dBRUc7O0FBRUgsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFxQixNQUFNLEVBQUUsS0FBSyxFQUErQixNQUFNLGVBQWUsQ0FBQztBQUNuSSxPQUFPLGFBQWEsTUFBTSxrQkFBa0IsQ0FBQztBQUU3QywyRkFBMkY7QUFDM0YsT0FBTyxFQUFFLElBQUksRUFBeUQsTUFBTSxFQUFFLE1BQU0sMENBQTBDLENBQUM7QUFDL0gsT0FBTyxFQUFFLFNBQVMsRUFBZ0IsWUFBWSxFQUFFLE1BQU0sMENBQTBDLENBQUM7QUFFakc7SUFzTkksbUNBQVksT0FBbUI7UUFQdkIsa0JBQWEsR0FBRztZQUNwQixnQkFBZ0IsRUFBRyxJQUFJO1lBQ3ZCLEtBQUssRUFBYyxTQUFTO1lBQzVCLFNBQVMsRUFBVSxFQUFFO1lBQ3JCLFFBQVEsRUFBVyxFQUFFO1NBQ3hCLENBQUM7UUF3R0QsU0FBUztRQUNBLGFBQVEsR0FBVSxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQzdDLG9CQUFlLEdBQUcsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUM3QyxpQkFBWSxHQUFNLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsaUJBQVksR0FBTSxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQzdDLGVBQVUsR0FBUSxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQzdDLGFBQVEsR0FBVSxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQzdDLFlBQU8sR0FBVyxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQzdDLGNBQVMsR0FBUyxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQzdDLGNBQVMsR0FBUyxJQUFJLFlBQVksRUFBVSxDQUFDO1FB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QUs7NEJBR0wsS0FBSzt3QkFDTCxLQUFLOzBCQUNMLEtBQUs7MEJBQ0wsS0FBSzsyQkFDTCxLQUFLOzRCQUNMLEtBQUs7dUJBQ0wsS0FBSzt5QkFDTCxLQUFLO3lCQUNMLEtBQUs7eUJBQ0wsS0FBSzt1QkFDTCxLQUFLO3FCQUNMLEtBQUs7d0JBQ0wsS0FBSzt5QkFDTCxLQUFLO3NCQUNMLEtBQUs7NEJBQ0wsS0FBSzsyQkFDTCxLQUFLO3NCQUNMLEtBQUs7NEJBQ0wsS0FBSzsyQkFDTCxLQUFLOzJCQUNMLEtBQUs7NkJBQ0wsS0FBSzt1QkFDTCxLQUFLOzBCQUNMLEtBQUs7MkJBQ0wsS0FBSzt3QkFDTCxLQUFLO3dCQUNMLEtBQUs7b0JBQ0wsS0FBSztvQkFDTCxLQUFLOzZCQUdMLEtBQUs7MkJBR0wsTUFBTTtrQ0FDTixNQUFNOytCQUNOLE1BQU07K0JBQ04sTUFBTTs2QkFDTixNQUFNOzJCQUNOLE1BQU07MEJBQ04sTUFBTTs0QkFDTixNQUFNOzRCQUNOLE1BQU07NkJBQ04sTUFBTTt5QkFDTixNQUFNOzBCQUNOLE1BQU07MEJBQ04sTUFBTTs2QkFDTixNQUFNOzJCQUNOLE1BQU07eUJBQ04sTUFBTTs0QkFDTixNQUFNOztJQXdHWCxnQ0FBQztDQUFBLEFBcmJELElBcWJDO1NBamJZLHlCQUF5QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQW5ndWxhciB3cmFwcGVyIGZvciBCcnludHVtIFRpbWVGaWVsZFxuICovXG5cbmltcG9ydCB7IENvbXBvbmVudCwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBPbkRlc3Ryb3ksIE9uSW5pdCwgT3V0cHV0LCBJbnB1dCwgU2ltcGxlQ2hhbmdlLCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgV3JhcHBlckhlbHBlciBmcm9tICcuL3dyYXBwZXIuaGVscGVyJztcblxuLy8gQnJ5bnR1bSAnc2NoZWR1bGVyLmxpdGUudW1kJyBidW5kbGUgY29tZXMgd2l0aG91dCBwb2x5ZmlsbHMgdG8gc3VwcG9ydCBBbmd1bGFyJ3Mgem9uZS5qc1xuaW1wb3J0IHsgQmFzZSwgTWFzaywgTWFza0NvbmZpZywgUmVjdGFuZ2xlLCBTY3JvbGxlciwgU2Nyb2xsZXJDb25maWcsIFdpZGdldCB9IGZyb20gJ0BicnludHVtL3NjaGVkdWxlci9zY2hlZHVsZXIubGl0ZS51bWQuanMnO1xuaW1wb3J0IHsgVGltZUZpZWxkLCBTdHJpbmdIZWxwZXIsIFdpZGdldEhlbHBlciB9IGZyb20gJ0BicnludHVtL3NjaGVkdWxlci9zY2hlZHVsZXIubGl0ZS51bWQuanMnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvciA6ICdicnludHVtLXRpbWUtZmllbGQnLFxuICAgIHRlbXBsYXRlIDogJydcbn0pXG5leHBvcnQgY2xhc3MgQnJ5bnR1bVRpbWVGaWVsZENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcblxuICAgIHB1YmxpYyBzdGF0aWMgaW5zdGFuY2VDbGFzcyA9IFRpbWVGaWVsZDtcblxuICAgIHByaXZhdGUgc3RhdGljIGJyeW50dW1GZWF0dXJlTmFtZXM6IHN0cmluZ1tdID0gW1xuXG4gICAgXTtcblxuICAgIHByaXZhdGUgc3RhdGljIGJyeW50dW1Db25maWdzOiBzdHJpbmdbXSA9IEJyeW50dW1UaW1lRmllbGRDb21wb25lbnQuYnJ5bnR1bUZlYXR1cmVOYW1lcy5jb25jYXQoW1xuICAgICAgICAnYWRvcHQnLFxuICAgICAgICAnYWxpZ24nLFxuICAgICAgICAnYWxpZ25TZWxmJyxcbiAgICAgICAgJ2FuY2hvcicsXG4gICAgICAgICdhcHBlbmRUbycsXG4gICAgICAgICdhdXRvQ2xvc2UnLFxuICAgICAgICAnYXV0b0NvbXBsZXRlJyxcbiAgICAgICAgJ2F1dG9FeHBhbmQnLFxuICAgICAgICAnYXV0b1NlbGVjdCcsXG4gICAgICAgICdiYWRnZScsXG4gICAgICAgICdidWJibGVFdmVudHMnLFxuICAgICAgICAnY2VudGVyZWQnLFxuICAgICAgICAnY2xlYXJhYmxlJyxcbiAgICAgICAgJ2NscycsXG4gICAgICAgICdjb25maWcnLFxuICAgICAgICAnY29uc3RyYWluVG8nLFxuICAgICAgICAnY29udGVudCcsXG4gICAgICAgICdjb250ZW50RWxlbWVudENscycsXG4gICAgICAgICdkYXRhc2V0JyxcbiAgICAgICAgJ2RlZmF1bHRCaW5kUHJvcGVydHknLFxuICAgICAgICAnZGlzYWJsZWQnLFxuICAgICAgICAnZG9jaycsXG4gICAgICAgICdkcmFnZ2FibGUnLFxuICAgICAgICAnZWRpdGFibGUnLFxuICAgICAgICAnZXh0cmFEYXRhJyxcbiAgICAgICAgJ2ZsZXgnLFxuICAgICAgICAnZmxvYXRpbmcnLFxuICAgICAgICAnZm9ybWF0JyxcbiAgICAgICAgJ2hlaWdodCcsXG4gICAgICAgICdoaWRkZW4nLFxuICAgICAgICAnaGlkZUFuaW1hdGlvbicsXG4gICAgICAgICdoaWdobGlnaHRFeHRlcm5hbENoYW5nZScsXG4gICAgICAgICdoaW50JyxcbiAgICAgICAgJ2hpbnRIdG1sJyxcbiAgICAgICAgJ2h0bWwnLFxuICAgICAgICAnaHRtbENscycsXG4gICAgICAgICdpZCcsXG4gICAgICAgICdpbnB1dEFsaWduJyxcbiAgICAgICAgJ2lucHV0QXR0cmlidXRlcycsXG4gICAgICAgICdpbnB1dFdpZHRoJyxcbiAgICAgICAgJ2luc2VydEJlZm9yZScsXG4gICAgICAgICdpbnNlcnRGaXJzdCcsXG4gICAgICAgICdrZXlTdHJva2VDaGFuZ2VEZWxheScsXG4gICAgICAgICdsYWJlbCcsXG4gICAgICAgICdsYWJlbENscycsXG4gICAgICAgICdsYWJlbFBvc2l0aW9uJyxcbiAgICAgICAgJ2xhYmVscycsXG4gICAgICAgICdsYWJlbFdpZHRoJyxcbiAgICAgICAgJ2xpc3RlbmVycycsXG4gICAgICAgICdsb2NhbGVDbGFzcycsXG4gICAgICAgICdsb2NhbGl6YWJsZVByb3BlcnRpZXMnLFxuICAgICAgICAnbWFyZ2luJyxcbiAgICAgICAgJ21hc2tEZWZhdWx0cycsXG4gICAgICAgICdtYXNrZWQnLFxuICAgICAgICAnbWF4JyxcbiAgICAgICAgJ21heEhlaWdodCcsXG4gICAgICAgICdtYXhMZW5ndGgnLFxuICAgICAgICAnbWF4V2lkdGgnLFxuICAgICAgICAnbWluJyxcbiAgICAgICAgJ21pbkhlaWdodCcsXG4gICAgICAgICdtaW5MZW5ndGgnLFxuICAgICAgICAnbWluV2lkdGgnLFxuICAgICAgICAnbW9uaXRvclJlc2l6ZScsXG4gICAgICAgICduYW1lJyxcbiAgICAgICAgJ293bmVyJyxcbiAgICAgICAgJ3BpY2tlcicsXG4gICAgICAgICdwaWNrZXJBbGlnbkVsZW1lbnQnLFxuICAgICAgICAncGxhY2Vob2xkZXInLFxuICAgICAgICAncG9zaXRpb25lZCcsXG4gICAgICAgICdwcmV2ZW50VG9vbHRpcE9uVG91Y2gnLFxuICAgICAgICAncmVhZE9ubHknLFxuICAgICAgICAncmVxdWlyZWQnLFxuICAgICAgICAncmV2ZXJ0T25Fc2NhcGUnLFxuICAgICAgICAncmlwcGxlJyxcbiAgICAgICAgJ3Jvb3RFbGVtZW50JyxcbiAgICAgICAgJ3Njcm9sbGFibGUnLFxuICAgICAgICAnc2Nyb2xsQWN0aW9uJyxcbiAgICAgICAgJ3Nob3dBbmltYXRpb24nLFxuICAgICAgICAnc3RlcCcsXG4gICAgICAgICd0YWInLFxuICAgICAgICAndGFiSW5kZXgnLFxuICAgICAgICAndGFnJyxcbiAgICAgICAgJ3RleHRBbGlnbicsXG4gICAgICAgICd0aXRsZScsXG4gICAgICAgICd0b29sdGlwJyxcbiAgICAgICAgJ3RyaWdnZXJzJyxcbiAgICAgICAgJ3ZhbHVlJyxcbiAgICAgICAgJ3dlaWdodCcsXG4gICAgICAgICd3aWR0aCcsXG4gICAgICAgICd4JyxcbiAgICAgICAgJ3knXG4gICAgXSk7XG5cbiAgICBwcml2YXRlIHN0YXRpYyBicnludHVtQ29uZmlnc09ubHk6IHN0cmluZ1tdID0gW1xuICAgICAgICAnYWRvcHQnLFxuICAgICAgICAnYWxpZ24nLFxuICAgICAgICAnYW5jaG9yJyxcbiAgICAgICAgJ2FwcGVuZFRvJyxcbiAgICAgICAgJ2F1dG9DbG9zZScsXG4gICAgICAgICdhdXRvQ29tcGxldGUnLFxuICAgICAgICAnYXV0b0V4cGFuZCcsXG4gICAgICAgICdhdXRvU2VsZWN0JyxcbiAgICAgICAgJ2J1YmJsZUV2ZW50cycsXG4gICAgICAgICdjZW50ZXJlZCcsXG4gICAgICAgICdjbGVhcmFibGUnLFxuICAgICAgICAnY2xzJyxcbiAgICAgICAgJ2NvbmZpZycsXG4gICAgICAgICdjb25zdHJhaW5UbycsXG4gICAgICAgICdjb250ZW50RWxlbWVudENscycsXG4gICAgICAgICdkZWZhdWx0QmluZFByb3BlcnR5JyxcbiAgICAgICAgJ2RvY2snLFxuICAgICAgICAnZHJhZ2dhYmxlJyxcbiAgICAgICAgJ2VkaXRhYmxlJyxcbiAgICAgICAgJ2Zsb2F0aW5nJyxcbiAgICAgICAgJ2hpZGVBbmltYXRpb24nLFxuICAgICAgICAnaGlnaGxpZ2h0RXh0ZXJuYWxDaGFuZ2UnLFxuICAgICAgICAnaGludCcsXG4gICAgICAgICdoaW50SHRtbCcsXG4gICAgICAgICdodG1sQ2xzJyxcbiAgICAgICAgJ2lucHV0QWxpZ24nLFxuICAgICAgICAnaW5wdXRBdHRyaWJ1dGVzJyxcbiAgICAgICAgJ2lucHV0V2lkdGgnLFxuICAgICAgICAnaW5zZXJ0QmVmb3JlJyxcbiAgICAgICAgJ2luc2VydEZpcnN0JyxcbiAgICAgICAgJ2tleVN0cm9rZUNoYW5nZURlbGF5JyxcbiAgICAgICAgJ2xhYmVsQ2xzJyxcbiAgICAgICAgJ2xhYmVsUG9zaXRpb24nLFxuICAgICAgICAnbGFiZWxzJyxcbiAgICAgICAgJ2xhYmVsV2lkdGgnLFxuICAgICAgICAnbGlzdGVuZXJzJyxcbiAgICAgICAgJ2xvY2FsZUNsYXNzJyxcbiAgICAgICAgJ2xvY2FsaXphYmxlUHJvcGVydGllcycsXG4gICAgICAgICdtYXNrRGVmYXVsdHMnLFxuICAgICAgICAnbWFza2VkJyxcbiAgICAgICAgJ21heExlbmd0aCcsXG4gICAgICAgICdtaW5MZW5ndGgnLFxuICAgICAgICAnbW9uaXRvclJlc2l6ZScsXG4gICAgICAgICduYW1lJyxcbiAgICAgICAgJ293bmVyJyxcbiAgICAgICAgJ3BpY2tlcicsXG4gICAgICAgICdwaWNrZXJBbGlnbkVsZW1lbnQnLFxuICAgICAgICAncGxhY2Vob2xkZXInLFxuICAgICAgICAncG9zaXRpb25lZCcsXG4gICAgICAgICdwcmV2ZW50VG9vbHRpcE9uVG91Y2gnLFxuICAgICAgICAncmVxdWlyZWQnLFxuICAgICAgICAncmV2ZXJ0T25Fc2NhcGUnLFxuICAgICAgICAncmlwcGxlJyxcbiAgICAgICAgJ3Jvb3RFbGVtZW50JyxcbiAgICAgICAgJ3Njcm9sbEFjdGlvbicsXG4gICAgICAgICdzaG93QW5pbWF0aW9uJyxcbiAgICAgICAgJ3RhYicsXG4gICAgICAgICd0YWJJbmRleCcsXG4gICAgICAgICd0YWcnLFxuICAgICAgICAndGV4dEFsaWduJyxcbiAgICAgICAgJ3RpdGxlJyxcbiAgICAgICAgJ3dlaWdodCdcbiAgICBdO1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bVByb3BzOiBzdHJpbmdbXSA9IEJyeW50dW1UaW1lRmllbGRDb21wb25lbnQuYnJ5bnR1bUZlYXR1cmVOYW1lcy5jb25jYXQoW1xuICAgICAgICAnYWxpZ25TZWxmJyxcbiAgICAgICAgJ2FuY2hvclNpemUnLFxuICAgICAgICAnYmFkZ2UnLFxuICAgICAgICAnY29udGVudCcsXG4gICAgICAgICdkYXRhc2V0JyxcbiAgICAgICAgJ2Rpc2FibGVkJyxcbiAgICAgICAgJ2V4dHJhRGF0YScsXG4gICAgICAgICdmbGV4JyxcbiAgICAgICAgJ2Zvcm1hdCcsXG4gICAgICAgICdoZWlnaHQnLFxuICAgICAgICAnaGlkZGVuJyxcbiAgICAgICAgJ2h0bWwnLFxuICAgICAgICAnaWQnLFxuICAgICAgICAnbGFiZWwnLFxuICAgICAgICAnbWFyZ2luJyxcbiAgICAgICAgJ21heCcsXG4gICAgICAgICdtYXhIZWlnaHQnLFxuICAgICAgICAnbWF4V2lkdGgnLFxuICAgICAgICAnbWluJyxcbiAgICAgICAgJ21pbkhlaWdodCcsXG4gICAgICAgICdtaW5XaWR0aCcsXG4gICAgICAgICdyZWFkT25seScsXG4gICAgICAgICdzY3JvbGxhYmxlJyxcbiAgICAgICAgJ3N0ZXAnLFxuICAgICAgICAndG9vbHRpcCcsXG4gICAgICAgICd0cmlnZ2VycycsXG4gICAgICAgICd2YWx1ZScsXG4gICAgICAgICd3aWR0aCcsXG4gICAgICAgICd4JyxcbiAgICAgICAgJ3knXG4gICAgXSk7XG5cbiAgICBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY7XG4gICAgcHVibGljIGluc3RhbmNlOiBUaW1lRmllbGQ7XG5cbiAgICBwcml2YXRlIGJyeW50dW1Db25maWcgPSB7XG4gICAgICAgIGFuZ3VsYXJDb21wb25lbnQgOiB0aGlzLFxuICAgICAgICBhZG9wdCAgICAgICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgICBsaXN0ZW5lcnMgICAgICAgIDoge30sXG4gICAgICAgIGZlYXR1cmVzICAgICAgICAgOiB7fVxuICAgIH07XG5cbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50OiBFbGVtZW50UmVmKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudFJlZiA9IGVsZW1lbnQ7XG4gICAgfVxuXG4gICAgIC8vIENvbmZpZ3Mgb25seVxuICAgIEBJbnB1dCgpIGFkb3B0ICAgICAgICAgICAgICAgICAgIDogSFRNTEVsZW1lbnR8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGFsaWduICAgICAgICAgICAgICAgICAgIDogb2JqZWN0fHN0cmluZztcbiAgICBASW5wdXQoKSBhbmNob3IgICAgICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgYXBwZW5kVG8gICAgICAgICAgICAgICAgOiBIVE1MRWxlbWVudHxzdHJpbmc7XG4gICAgQElucHV0KCkgYXV0b0Nsb3NlICAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGF1dG9Db21wbGV0ZSAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGF1dG9FeHBhbmQgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBhdXRvU2VsZWN0ICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgYnViYmxlRXZlbnRzICAgICAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgY2VudGVyZWQgICAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGNsZWFyYWJsZSAgICAgICAgICAgICAgIDogYm9vbGVhbnxvYmplY3Q7XG4gICAgQElucHV0KCkgY2xzICAgICAgICAgICAgICAgICAgICAgOiBzdHJpbmd8b2JqZWN0O1xuICAgIEBJbnB1dCgpIGNvbmZpZyAgICAgICAgICAgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIGNvbnN0cmFpblRvICAgICAgICAgICAgIDogSFRNTEVsZW1lbnR8V2lkZ2V0fFJlY3RhbmdsZTtcbiAgICBASW5wdXQoKSBjb250ZW50RWxlbWVudENscyAgICAgICA6IHN0cmluZ3xvYmplY3Q7XG4gICAgQElucHV0KCkgZGVmYXVsdEJpbmRQcm9wZXJ0eSAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgZG9jayAgICAgICAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgZHJhZ2dhYmxlICAgICAgICAgICAgICAgOiBib29sZWFufG9iamVjdDtcbiAgICBASW5wdXQoKSBlZGl0YWJsZSAgICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgZmxvYXRpbmcgICAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGhpZGVBbmltYXRpb24gICAgICAgICAgIDogYm9vbGVhbnxvYmplY3Q7XG4gICAgQElucHV0KCkgaGlnaGxpZ2h0RXh0ZXJuYWxDaGFuZ2UgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGhpbnQgICAgICAgICAgICAgICAgICAgIDogc3RyaW5nfEZ1bmN0aW9uO1xuICAgIEBJbnB1dCgpIGhpbnRIdG1sICAgICAgICAgICAgICAgIDogc3RyaW5nfEZ1bmN0aW9uO1xuICAgIEBJbnB1dCgpIGh0bWxDbHMgICAgICAgICAgICAgICAgIDogc3RyaW5nfG9iamVjdDtcbiAgICBASW5wdXQoKSBpbnB1dEFsaWduICAgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBpbnB1dEF0dHJpYnV0ZXMgICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBpbnB1dFdpZHRoICAgICAgICAgICAgICA6IHN0cmluZ3xudW1iZXI7XG4gICAgQElucHV0KCkgaW5zZXJ0QmVmb3JlICAgICAgICAgICAgOiBIVE1MRWxlbWVudHxzdHJpbmc7XG4gICAgQElucHV0KCkgaW5zZXJ0Rmlyc3QgICAgICAgICAgICAgOiBIVE1MRWxlbWVudHxzdHJpbmc7XG4gICAgQElucHV0KCkga2V5U3Ryb2tlQ2hhbmdlRGVsYXkgICAgOiBudW1iZXI7XG4gICAgQElucHV0KCkgbGFiZWxDbHMgICAgICAgICAgICAgICAgOiBzdHJpbmd8b2JqZWN0O1xuICAgIEBJbnB1dCgpIGxhYmVsUG9zaXRpb24gICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGxhYmVscyAgICAgICAgICAgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIGxhYmVsV2lkdGggICAgICAgICAgICAgIDogc3RyaW5nfG51bWJlcjtcbiAgICBASW5wdXQoKSBsaXN0ZW5lcnMgICAgICAgICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBsb2NhbGVDbGFzcyAgICAgICAgICAgICA6IEJhc2U7XG4gICAgQElucHV0KCkgbG9jYWxpemFibGVQcm9wZXJ0aWVzICAgOiBzdHJpbmdbXTtcbiAgICBASW5wdXQoKSBtYXNrRGVmYXVsdHMgICAgICAgICAgICA6IG9iamVjdHxNYXNrfFBhcnRpYWw8TWFza0NvbmZpZz47XG4gICAgQElucHV0KCkgbWFza2VkICAgICAgICAgICAgICAgICAgOiBib29sZWFufHN0cmluZ3xvYmplY3R8TWFza3xQYXJ0aWFsPE1hc2tDb25maWc+O1xuICAgIEBJbnB1dCgpIG1heExlbmd0aCAgICAgICAgICAgICAgIDogbnVtYmVyO1xuICAgIEBJbnB1dCgpIG1pbkxlbmd0aCAgICAgICAgICAgICAgIDogbnVtYmVyO1xuICAgIEBJbnB1dCgpIG1vbml0b3JSZXNpemUgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBuYW1lICAgICAgICAgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBvd25lciAgICAgICAgICAgICAgICAgICA6IFdpZGdldDtcbiAgICBASW5wdXQoKSBwaWNrZXIgICAgICAgICAgICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBwaWNrZXJBbGlnbkVsZW1lbnQgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBwbGFjZWhvbGRlciAgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBwb3NpdGlvbmVkICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgcHJldmVudFRvb2x0aXBPblRvdWNoICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHJlcXVpcmVkICAgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSByZXZlcnRPbkVzY2FwZSAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgcmlwcGxlICAgICAgICAgICAgICAgICAgOiBib29sZWFufG9iamVjdDtcbiAgICBASW5wdXQoKSByb290RWxlbWVudCAgICAgICAgICAgICA6IFNoYWRvd1Jvb3Q7XG4gICAgQElucHV0KCkgc2Nyb2xsQWN0aW9uICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgc2hvd0FuaW1hdGlvbiAgICAgICAgICAgOiBib29sZWFufG9iamVjdDtcbiAgICBASW5wdXQoKSB0YWIgICAgICAgICAgICAgICAgICAgICA6IGJvb2xlYW58b2JqZWN0O1xuICAgIEBJbnB1dCgpIHRhYkluZGV4ICAgICAgICAgICAgICAgIDogbnVtYmVyO1xuICAgIEBJbnB1dCgpIHRhZyAgICAgICAgICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIHRleHRBbGlnbiAgICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIHRpdGxlICAgICAgICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIHdlaWdodCAgICAgICAgICAgICAgICAgIDogbnVtYmVyO1xuXG4gICAgIC8vIENvbmZpZ3MgYW5kIHByb3BlcnRpZXNcbiAgICBASW5wdXQoKSBhbGlnblNlbGYgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGJhZGdlICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgY29udGVudCAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBkYXRhc2V0ICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIGRpc2FibGVkICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGV4dHJhRGF0YSAgOiBib29sZWFufG51bWJlcnxvYmplY3R8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGZsZXggICAgICAgOiBudW1iZXJ8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGZvcm1hdCAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgaGVpZ2h0ICAgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgaGlkZGVuICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgaHRtbCAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBpZCAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGxhYmVsICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgbWFyZ2luICAgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgbWF4ICAgICAgICA6IERhdGV8c3RyaW5nO1xuICAgIEBJbnB1dCgpIG1heEhlaWdodCAgOiBudW1iZXJ8c3RyaW5nO1xuICAgIEBJbnB1dCgpIG1heFdpZHRoICAgOiBudW1iZXJ8c3RyaW5nO1xuICAgIEBJbnB1dCgpIG1pbiAgICAgICAgOiBEYXRlfHN0cmluZztcbiAgICBASW5wdXQoKSBtaW5IZWlnaHQgIDogbnVtYmVyfHN0cmluZztcbiAgICBASW5wdXQoKSBtaW5XaWR0aCAgIDogbnVtYmVyfHN0cmluZztcbiAgICBASW5wdXQoKSByZWFkT25seSAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBzY3JvbGxhYmxlIDogYm9vbGVhbnxTY3JvbGxlcnxvYmplY3R8UGFydGlhbDxTY3JvbGxlckNvbmZpZz47XG4gICAgQElucHV0KCkgc3RlcCAgICAgICA6IG51bWJlcnxvYmplY3R8c3RyaW5nO1xuICAgIEBJbnB1dCgpIHRvb2x0aXAgICAgOiBvYmplY3R8c3RyaW5nO1xuICAgIEBJbnB1dCgpIHRyaWdnZXJzICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgdmFsdWUgICAgICA6IERhdGV8c3RyaW5nfGFueTtcbiAgICBASW5wdXQoKSB3aWR0aCAgICAgIDogbnVtYmVyfHN0cmluZztcbiAgICBASW5wdXQoKSB4ICAgICAgICAgIDogbnVtYmVyO1xuICAgIEBJbnB1dCgpIHkgICAgICAgICAgOiBudW1iZXI7XG5cbiAgICAgLy8gUHJvcGVydGllcyBvbmx5XG4gICAgQElucHV0KCkgYW5jaG9yU2l6ZSA6IG51bWJlcltdO1xuXG4gICAgIC8vIEV2ZW50c1xuICAgIEBPdXRwdXQoKSBvbkFjdGlvbiAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25CZWZvcmVEZXN0cm95ID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uQmVmb3JlSGlkZSAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkJlZm9yZVNob3cgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25DYXRjaEFsbCAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uQ2hhbmdlICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkNsZWFyICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25EZXN0cm95ICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uRm9jdXNJbiAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkZvY3VzT3V0ICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25IaWRlICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uSW5wdXQgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvblBhaW50ICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25SZWFkT25seSAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uUmVzaXplICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvblNob3cgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25UcmlnZ2VyICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYW5kIGFwcGVuZCB0aGUgdW5kZXJseWluZyB3aWRnZXRcbiAgICAgKi9cbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICAgY29uc3RcbiAgICAgICAgICAgIG1lID0gdGhpcyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50UmVmLFxuICAgICAgICAgICAgICAgIGJyeW50dW1Db25maWdcbiAgICAgICAgICAgIH0gPSBtZSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpbnN0YW5jZUNsYXNzLFxuICAgICAgICAgICAgICAgIGJyeW50dW1Db25maWdzXG4gICAgICAgICAgICB9ID0gQnJ5bnR1bVRpbWVGaWVsZENvbXBvbmVudDtcblxuICAgICAgICBPYmplY3QuYXNzaWduKGJyeW50dW1Db25maWcsIHtcbiAgICAgICAgICAgIGxpc3RlbmVycyA6IHtcbiAgICAgICAgICAgICAgICBhY3Rpb24oZXZlbnQgOiBhbnkpIHsgbWUub25BY3Rpb24uZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgYmVmb3JlRGVzdHJveShldmVudCA6IGFueSkgeyBtZS5vbkJlZm9yZURlc3Ryb3kuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgYmVmb3JlSGlkZShldmVudCA6IGFueSkgeyBtZS5vbkJlZm9yZUhpZGUuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgYmVmb3JlU2hvdyhldmVudCA6IGFueSkgeyBtZS5vbkJlZm9yZVNob3cuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgY2F0Y2hBbGwoZXZlbnQgOiBhbnkpIHsgbWUub25DYXRjaEFsbC5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBjaGFuZ2UoZXZlbnQgOiBhbnkpIHsgbWUub25DaGFuZ2UuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgY2xlYXIoZXZlbnQgOiBhbnkpIHsgbWUub25DbGVhci5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBkZXN0cm95KGV2ZW50IDogYW55KSB7IG1lLm9uRGVzdHJveS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBmb2N1c0luKGV2ZW50IDogYW55KSB7IG1lLm9uRm9jdXNJbi5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBmb2N1c091dChldmVudCA6IGFueSkgeyBtZS5vbkZvY3VzT3V0LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGhpZGUoZXZlbnQgOiBhbnkpIHsgbWUub25IaWRlLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGlucHV0KGV2ZW50IDogYW55KSB7IG1lLm9uSW5wdXQuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgcGFpbnQoZXZlbnQgOiBhbnkpIHsgbWUub25QYWludC5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICByZWFkT25seShldmVudCA6IGFueSkgeyBtZS5vblJlYWRPbmx5LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIHJlc2l6ZShldmVudCA6IGFueSkgeyBtZS5vblJlc2l6ZS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBzaG93KGV2ZW50IDogYW55KSB7IG1lLm9uU2hvdy5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICB0cmlnZ2VyKGV2ZW50IDogYW55KSB7IG1lLm9uVHJpZ2dlci5lbWl0KGV2ZW50KTsgfSxcblxuICAgICAgICAgICAgICAgIHRoaXNPYmogOiBtZVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBJZiBjb21wb25lbnQgaGFzIG5vIGNvbnRhaW5lciBzcGVjaWZpZWQgaW4gY29uZmlnIHRoZW4gdXNlIGFkb3B0IHRvIFdyYXBwZXIncyBlbGVtZW50XG4gICAgICAgIGNvbnN0XG4gICAgICAgICAgICBjb250YWluZXJQYXJhbSA9IFtcbiAgICAgICAgICAgICAgICAnYWRvcHQnLFxuICAgICAgICAgICAgICAgICdhcHBlbmRUbycsXG4gICAgICAgICAgICAgICAgJ2luc2VydEFmdGVyJyxcbiAgICAgICAgICAgICAgICAnaW5zZXJ0QmVmb3JlJ1xuICAgICAgICAgICAgXS5maW5kKHByb3AgPT4gYnJ5bnR1bUNvbmZpZ1twcm9wXSk7XG4gICAgICAgIGlmICghY29udGFpbmVyUGFyYW0pIHtcbiAgICAgICAgICAgIGJyeW50dW1Db25maWcuYWRvcHQgPSBlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBXcmFwcGVySGVscGVyLmRldldhcm5pbmdDb250YWluZXIoaW5zdGFuY2VDbGFzcy4kbmFtZSwgY29udGFpbmVyUGFyYW0pO1xuICAgICAgICB9XG5cbiAgICAgICAgYnJ5bnR1bUNvbmZpZ3MuZmlsdGVyKHByb3AgPT4gcHJvcCBpbiB0aGlzKS5mb3JFYWNoKHByb3AgPT4ge1xuICAgICAgICAgICAgV3JhcHBlckhlbHBlci5hcHBseVByb3BWYWx1ZShicnludHVtQ29uZmlnLCBwcm9wLCB0aGlzW3Byb3BdKTtcbiAgICAgICAgICAgIGlmIChbJ2ZlYXR1cmVzJywgJ2NvbmZpZyddLmluY2x1ZGVzKHByb3ApKSB7XG4gICAgICAgICAgICAgICAgV3JhcHBlckhlbHBlci5kZXZXYXJuaW5nQ29uZmlnUHJvcChpbnN0YW5jZUNsYXNzLiRuYW1lLCBwcm9wKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBtZS5pbnN0YW5jZSA9IGluc3RhbmNlQ2xhc3MuJG5hbWUgPT09ICdXaWRnZXQnID8gV2lkZ2V0SGVscGVyLmNyZWF0ZVdpZGdldChicnludHVtQ29uZmlnKSA6IG5ldyBpbnN0YW5jZUNsYXNzKGJyeW50dW1Db25maWcpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogV2F0Y2ggZm9yIGNoYW5nZXNcbiAgICAgKiBAcGFyYW0gY2hhbmdlc1xuICAgICAqL1xuICAgIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICAgICAgY29uc3RcbiAgICAgICAgICAgIHsgaW5zdGFuY2UgfSA9IHRoaXMsXG4gICAgICAgICAgICB7IGluc3RhbmNlQ2xhc3MgfSA9IEJyeW50dW1UaW1lRmllbGRDb21wb25lbnQ7XG5cbiAgICAgICAgaWYgKCFpbnN0YW5jZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSXRlcmF0ZSBvdmVyIGFsbCBjaGFuZ2VzXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKGNoYW5nZXMpLmZvckVhY2goKFtwcm9wLCBjaGFuZ2VdKSA9PiB7XG4gICAgICAgICAgICBjb25zdFxuICAgICAgICAgICAgICAgIG5ld1ZhbHVlID0gKGNoYW5nZSBhcyBTaW1wbGVDaGFuZ2UpLmN1cnJlbnRWYWx1ZSxcbiAgICAgICAgICAgICAgICB7IGluc3RhbmNlIH0gPSB0aGlzLFxuICAgICAgICAgICAgICAgIHsgYnJ5bnR1bUNvbmZpZ3NPbmx5LCBicnludHVtUHJvcHMgfSA9IEJyeW50dW1UaW1lRmllbGRDb21wb25lbnQ7XG4gICAgICAgICAgICBpZiAoYnJ5bnR1bVByb3BzLmluY2x1ZGVzKHByb3ApKSB7XG4gICAgICAgICAgICAgICAgV3JhcHBlckhlbHBlci5hcHBseVByb3BWYWx1ZShpbnN0YW5jZSwgcHJvcCwgbmV3VmFsdWUsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICBpZiAoYnJ5bnR1bUNvbmZpZ3NPbmx5LmluY2x1ZGVzKHByb3ApKSB7XG4gICAgICAgICAgICAgICAgICAgIFdyYXBwZXJIZWxwZXIuZGV2V2FybmluZ1VwZGF0ZVByb3AoaW5zdGFuY2VDbGFzcy4kbmFtZSwgcHJvcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZXN0cm95IHRoZSBjb21wb25lbnRcbiAgICAgKi9cbiAgICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaW5zdGFuY2UpIHtcbiAgICAgICAgICAgIHRoaXMuaW5zdGFuY2UuZGVzdHJveSgpO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19