/**
 * Angular wrapper for Bryntum SlideToggle
 */
import { Component, ElementRef, EventEmitter, Output, Input } from '@angular/core';
import WrapperHelper from './wrapper.helper';
// Bryntum 'scheduler.lite.umd' bundle comes without polyfills to support Angular's zone.js
import { Base, Widget } from '@bryntum/scheduler/scheduler.lite.umd.js';
import { SlideToggle, WidgetHelper } from '@bryntum/scheduler/scheduler.lite.umd.js';
export class BryntumSlideToggleComponent {
    constructor(element) {
        this.bryntumConfig = {
            angularComponent: this,
            adopt: undefined,
            listeners: {},
            features: {}
        };
        // Events
        this.onAction = new EventEmitter();
        this.onBeforeChange = new EventEmitter();
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
        const me = this, { elementRef, bryntumConfig } = me, { instanceClass, bryntumConfigs } = BryntumSlideToggleComponent;
        Object.assign(bryntumConfig, {
            listeners: {
                action(event) { me.onAction.emit(event); },
                beforeChange(event) { me.onBeforeChange.emit(event); },
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
        const { instance } = this, { instanceClass } = BryntumSlideToggleComponent;
        if (!instance) {
            return;
        }
        // Iterate over all changes
        Object.entries(changes).forEach(([prop, change]) => {
            const newValue = change.currentValue, { instance } = this, { bryntumConfigsOnly, bryntumProps } = BryntumSlideToggleComponent;
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
BryntumSlideToggleComponent.instanceClass = SlideToggle;
BryntumSlideToggleComponent.bryntumFeatureNames = [];
BryntumSlideToggleComponent.bryntumConfigs = BryntumSlideToggleComponent.bryntumFeatureNames.concat([
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
    'checked',
    'clearable',
    'cls',
    'color',
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
    'revertOnEscape',
    'ripple',
    'rootElement',
    'scrollable',
    'scrollAction',
    'showAnimation',
    'tab',
    'tag',
    'text',
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
BryntumSlideToggleComponent.bryntumConfigsOnly = [
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
    'color',
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
    'monitorResize',
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
    'text',
    'textAlign',
    'title',
    'weight'
];
BryntumSlideToggleComponent.bryntumProps = BryntumSlideToggleComponent.bryntumFeatureNames.concat([
    'alignSelf',
    'anchorSize',
    'badge',
    'checked',
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
    'name',
    'readOnly',
    'scrollable',
    'tooltip',
    'triggers',
    'value',
    'width',
    'x',
    'y'
]);
BryntumSlideToggleComponent.decorators = [
    { type: Component, args: [{
                selector: 'bryntum-slide-toggle',
                template: ''
            }] }
];
/** @nocollapse */
BryntumSlideToggleComponent.ctorParameters = () => [
    { type: ElementRef }
];
BryntumSlideToggleComponent.propDecorators = {
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
    color: [{ type: Input }],
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
    monitorResize: [{ type: Input }],
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
    text: [{ type: Input }],
    textAlign: [{ type: Input }],
    title: [{ type: Input }],
    weight: [{ type: Input }],
    alignSelf: [{ type: Input }],
    badge: [{ type: Input }],
    checked: [{ type: Input }],
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
    name: [{ type: Input }],
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
    onBeforeChange: [{ type: Output }],
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJ5bnR1bS1zbGlkZS10b2dnbGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGJyeW50dW0vc2NoZWR1bGVyLWFuZ3VsYXIvIiwic291cmNlcyI6WyJsaWIvYnJ5bnR1bS1zbGlkZS10b2dnbGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztHQUVHO0FBRUgsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFxQixNQUFNLEVBQUUsS0FBSyxFQUErQixNQUFNLGVBQWUsQ0FBQztBQUNuSSxPQUFPLGFBQWEsTUFBTSxrQkFBa0IsQ0FBQztBQUU3QywyRkFBMkY7QUFDM0YsT0FBTyxFQUFFLElBQUksRUFBeUQsTUFBTSxFQUFFLE1BQU0sMENBQTBDLENBQUM7QUFDL0gsT0FBTyxFQUFFLFdBQVcsRUFBZ0IsWUFBWSxFQUFFLE1BQU0sMENBQTBDLENBQUM7QUFNbkcsTUFBTSxPQUFPLDJCQUEyQjtJQWtNcEMsWUFBWSxPQUFtQjtRQVB2QixrQkFBYSxHQUFHO1lBQ3BCLGdCQUFnQixFQUFHLElBQUk7WUFDdkIsS0FBSyxFQUFjLFNBQVM7WUFDNUIsU0FBUyxFQUFVLEVBQUU7WUFDckIsUUFBUSxFQUFXLEVBQUU7U0FDeEIsQ0FBQztRQWdHRCxTQUFTO1FBQ0EsYUFBUSxHQUFVLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsbUJBQWMsR0FBSSxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQzdDLG9CQUFlLEdBQUcsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUM3QyxpQkFBWSxHQUFNLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsaUJBQVksR0FBTSxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQzdDLGVBQVUsR0FBUSxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQzdDLGFBQVEsR0FBVSxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQzdDLFlBQU8sR0FBVyxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQzdDLGNBQVMsR0FBUyxJ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QUNMLEtBQUs7c0JBQ0wsS0FBSzt1QkFDTCxLQUFLO3dCQUNMLEtBQUs7bUJBQ0wsS0FBSztxQkFDTCxLQUFLO3FCQUNMLEtBQUs7bUJBQ0wsS0FBSztpQkFDTCxLQUFLO29CQUNMLEtBQUs7cUJBQ0wsS0FBSzt3QkFDTCxLQUFLO3VCQUNMLEtBQUs7d0JBQ0wsS0FBSzt1QkFDTCxLQUFLO21CQUNMLEtBQUs7dUJBQ0wsS0FBSzt5QkFDTCxLQUFLO3NCQUNMLEtBQUs7dUJBQ0wsS0FBSztvQkFDTCxLQUFLO29CQUNMLEtBQUs7Z0JBQ0wsS0FBSztnQkFDTCxLQUFLO3lCQUdMLEtBQUs7dUJBR0wsTUFBTTs2QkFDTixNQUFNOzhCQUNOLE1BQU07MkJBQ04sTUFBTTsyQkFDTixNQUFNO3lCQUNOLE1BQU07dUJBQ04sTUFBTTtzQkFDTixNQUFNO3dCQUNOLE1BQU07d0JBQ04sTUFBTTt5QkFDTixNQUFNO3FCQUNOLE1BQU07c0JBQ04sTUFBTTtzQkFDTixNQUFNO3lCQUNOLE1BQU07dUJBQ04sTUFBTTtxQkFDTixNQUFNO3dCQUNOLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEFuZ3VsYXIgd3JhcHBlciBmb3IgQnJ5bnR1bSBTbGlkZVRvZ2dsZVxuICovXG5cbmltcG9ydCB7IENvbXBvbmVudCwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBPbkRlc3Ryb3ksIE9uSW5pdCwgT3V0cHV0LCBJbnB1dCwgU2ltcGxlQ2hhbmdlLCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgV3JhcHBlckhlbHBlciBmcm9tICcuL3dyYXBwZXIuaGVscGVyJztcblxuLy8gQnJ5bnR1bSAnc2NoZWR1bGVyLmxpdGUudW1kJyBidW5kbGUgY29tZXMgd2l0aG91dCBwb2x5ZmlsbHMgdG8gc3VwcG9ydCBBbmd1bGFyJ3Mgem9uZS5qc1xuaW1wb3J0IHsgQmFzZSwgTWFzaywgTWFza0NvbmZpZywgUmVjdGFuZ2xlLCBTY3JvbGxlciwgU2Nyb2xsZXJDb25maWcsIFdpZGdldCB9IGZyb20gJ0BicnludHVtL3NjaGVkdWxlci9zY2hlZHVsZXIubGl0ZS51bWQuanMnO1xuaW1wb3J0IHsgU2xpZGVUb2dnbGUsIFN0cmluZ0hlbHBlciwgV2lkZ2V0SGVscGVyIH0gZnJvbSAnQGJyeW50dW0vc2NoZWR1bGVyL3NjaGVkdWxlci5saXRlLnVtZC5qcyc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yIDogJ2JyeW50dW0tc2xpZGUtdG9nZ2xlJyxcbiAgICB0ZW1wbGF0ZSA6ICcnXG59KVxuZXhwb3J0IGNsYXNzIEJyeW50dW1TbGlkZVRvZ2dsZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcblxuICAgIHB1YmxpYyBzdGF0aWMgaW5zdGFuY2VDbGFzcyA9IFNsaWRlVG9nZ2xlO1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bUZlYXR1cmVOYW1lczogc3RyaW5nW10gPSBbXG5cbiAgICBdO1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bUNvbmZpZ3M6IHN0cmluZ1tdID0gQnJ5bnR1bVNsaWRlVG9nZ2xlQ29tcG9uZW50LmJyeW50dW1GZWF0dXJlTmFtZXMuY29uY2F0KFtcbiAgICAgICAgJ2Fkb3B0JyxcbiAgICAgICAgJ2FsaWduJyxcbiAgICAgICAgJ2FsaWduU2VsZicsXG4gICAgICAgICdhbmNob3InLFxuICAgICAgICAnYXBwZW5kVG8nLFxuICAgICAgICAnYXV0b0NvbXBsZXRlJyxcbiAgICAgICAgJ2F1dG9TZWxlY3QnLFxuICAgICAgICAnYmFkZ2UnLFxuICAgICAgICAnYnViYmxlRXZlbnRzJyxcbiAgICAgICAgJ2NlbnRlcmVkJyxcbiAgICAgICAgJ2NoZWNrZWQnLFxuICAgICAgICAnY2xlYXJhYmxlJyxcbiAgICAgICAgJ2NscycsXG4gICAgICAgICdjb2xvcicsXG4gICAgICAgICdjb25maWcnLFxuICAgICAgICAnY29uc3RyYWluVG8nLFxuICAgICAgICAnY29udGVudCcsXG4gICAgICAgICdjb250ZW50RWxlbWVudENscycsXG4gICAgICAgICdkYXRhc2V0JyxcbiAgICAgICAgJ2RlZmF1bHRCaW5kUHJvcGVydHknLFxuICAgICAgICAnZGlzYWJsZWQnLFxuICAgICAgICAnZG9jaycsXG4gICAgICAgICdkcmFnZ2FibGUnLFxuICAgICAgICAnZWRpdGFibGUnLFxuICAgICAgICAnZXh0cmFEYXRhJyxcbiAgICAgICAgJ2ZsZXgnLFxuICAgICAgICAnZmxvYXRpbmcnLFxuICAgICAgICAnaGVpZ2h0JyxcbiAgICAgICAgJ2hpZGRlbicsXG4gICAgICAgICdoaWRlQW5pbWF0aW9uJyxcbiAgICAgICAgJ2hpZ2hsaWdodEV4dGVybmFsQ2hhbmdlJyxcbiAgICAgICAgJ2hpbnQnLFxuICAgICAgICAnaGludEh0bWwnLFxuICAgICAgICAnaHRtbCcsXG4gICAgICAgICdodG1sQ2xzJyxcbiAgICAgICAgJ2lkJyxcbiAgICAgICAgJ2lucHV0QWxpZ24nLFxuICAgICAgICAnaW5wdXRBdHRyaWJ1dGVzJyxcbiAgICAgICAgJ2lucHV0V2lkdGgnLFxuICAgICAgICAnaW5zZXJ0QmVmb3JlJyxcbiAgICAgICAgJ2luc2VydEZpcnN0JyxcbiAgICAgICAgJ2tleVN0cm9rZUNoYW5nZURlbGF5JyxcbiAgICAgICAgJ2xhYmVsJyxcbiAgICAgICAgJ2xhYmVsQ2xzJyxcbiAgICAgICAgJ2xhYmVsUG9zaXRpb24nLFxuICAgICAgICAnbGFiZWxzJyxcbiAgICAgICAgJ2xhYmVsV2lkdGgnLFxuICAgICAgICAnbGlzdGVuZXJzJyxcbiAgICAgICAgJ2xvY2FsZUNsYXNzJyxcbiAgICAgICAgJ2xvY2FsaXphYmxlUHJvcGVydGllcycsXG4gICAgICAgICdtYXJnaW4nLFxuICAgICAgICAnbWFza0RlZmF1bHRzJyxcbiAgICAgICAgJ21hc2tlZCcsXG4gICAgICAgICdtYXhIZWlnaHQnLFxuICAgICAgICAnbWF4V2lkdGgnLFxuICAgICAgICAnbWluSGVpZ2h0JyxcbiAgICAgICAgJ21pbldpZHRoJyxcbiAgICAgICAgJ21vbml0b3JSZXNpemUnLFxuICAgICAgICAnbmFtZScsXG4gICAgICAgICdvd25lcicsXG4gICAgICAgICdwbGFjZWhvbGRlcicsXG4gICAgICAgICdwb3NpdGlvbmVkJyxcbiAgICAgICAgJ3ByZXZlbnRUb29sdGlwT25Ub3VjaCcsXG4gICAgICAgICdyZWFkT25seScsXG4gICAgICAgICdyZXF1aXJlZCcsXG4gICAgICAgICdyZXZlcnRPbkVzY2FwZScsXG4gICAgICAgICdyaXBwbGUnLFxuICAgICAgICAncm9vdEVsZW1lbnQnLFxuICAgICAgICAnc2Nyb2xsYWJsZScsXG4gICAgICAgICdzY3JvbGxBY3Rpb24nLFxuICAgICAgICAnc2hvd0FuaW1hdGlvbicsXG4gICAgICAgICd0YWInLFxuICAgICAgICAndGFnJyxcbiAgICAgICAgJ3RleHQnLFxuICAgICAgICAndGV4dEFsaWduJyxcbiAgICAgICAgJ3RpdGxlJyxcbiAgICAgICAgJ3Rvb2x0aXAnLFxuICAgICAgICAndHJpZ2dlcnMnLFxuICAgICAgICAndmFsdWUnLFxuICAgICAgICAnd2VpZ2h0JyxcbiAgICAgICAgJ3dpZHRoJyxcbiAgICAgICAgJ3gnLFxuICAgICAgICAneSdcbiAgICBdKTtcblxuICAgIHByaXZhdGUgc3RhdGljIGJyeW50dW1Db25maWdzT25seTogc3RyaW5nW10gPSBbXG4gICAgICAgICdhZG9wdCcsXG4gICAgICAgICdhbGlnbicsXG4gICAgICAgICdhbmNob3InLFxuICAgICAgICAnYXBwZW5kVG8nLFxuICAgICAgICAnYXV0b0NvbXBsZXRlJyxcbiAgICAgICAgJ2F1dG9TZWxlY3QnLFxuICAgICAgICAnYnViYmxlRXZlbnRzJyxcbiAgICAgICAgJ2NlbnRlcmVkJyxcbiAgICAgICAgJ2NsZWFyYWJsZScsXG4gICAgICAgICdjbHMnLFxuICAgICAgICAnY29sb3InLFxuICAgICAgICAnY29uZmlnJyxcbiAgICAgICAgJ2NvbnN0cmFpblRvJyxcbiAgICAgICAgJ2NvbnRlbnRFbGVtZW50Q2xzJyxcbiAgICAgICAgJ2RlZmF1bHRCaW5kUHJvcGVydHknLFxuICAgICAgICAnZG9jaycsXG4gICAgICAgICdkcmFnZ2FibGUnLFxuICAgICAgICAnZWRpdGFibGUnLFxuICAgICAgICAnZmxvYXRpbmcnLFxuICAgICAgICAnaGlkZUFuaW1hdGlvbicsXG4gICAgICAgICdoaWdobGlnaHRFeHRlcm5hbENoYW5nZScsXG4gICAgICAgICdoaW50JyxcbiAgICAgICAgJ2hpbnRIdG1sJyxcbiAgICAgICAgJ2h0bWxDbHMnLFxuICAgICAgICAnaW5wdXRBbGlnbicsXG4gICAgICAgICdpbnB1dEF0dHJpYnV0ZXMnLFxuICAgICAgICAnaW5wdXRXaWR0aCcsXG4gICAgICAgICdpbnNlcnRCZWZvcmUnLFxuICAgICAgICAnaW5zZXJ0Rmlyc3QnLFxuICAgICAgICAna2V5U3Ryb2tlQ2hhbmdlRGVsYXknLFxuICAgICAgICAnbGFiZWxDbHMnLFxuICAgICAgICAnbGFiZWxQb3NpdGlvbicsXG4gICAgICAgICdsYWJlbHMnLFxuICAgICAgICAnbGFiZWxXaWR0aCcsXG4gICAgICAgICdsaXN0ZW5lcnMnLFxuICAgICAgICAnbG9jYWxlQ2xhc3MnLFxuICAgICAgICAnbG9jYWxpemFibGVQcm9wZXJ0aWVzJyxcbiAgICAgICAgJ21hc2tEZWZhdWx0cycsXG4gICAgICAgICdtYXNrZWQnLFxuICAgICAgICAnbW9uaXRvclJlc2l6ZScsXG4gICAgICAgICdvd25lcicsXG4gICAgICAgICdwbGFjZWhvbGRlcicsXG4gICAgICAgICdwb3NpdGlvbmVkJyxcbiAgICAgICAgJ3ByZXZlbnRUb29sdGlwT25Ub3VjaCcsXG4gICAgICAgICdyZXF1aXJlZCcsXG4gICAgICAgICdyZXZlcnRPbkVzY2FwZScsXG4gICAgICAgICdyaXBwbGUnLFxuICAgICAgICAncm9vdEVsZW1lbnQnLFxuICAgICAgICAnc2Nyb2xsQWN0aW9uJyxcbiAgICAgICAgJ3Nob3dBbmltYXRpb24nLFxuICAgICAgICAndGFiJyxcbiAgICAgICAgJ3RhZycsXG4gICAgICAgICd0ZXh0JyxcbiAgICAgICAgJ3RleHRBbGlnbicsXG4gICAgICAgICd0aXRsZScsXG4gICAgICAgICd3ZWlnaHQnXG4gICAgXTtcblxuICAgIHByaXZhdGUgc3RhdGljIGJyeW50dW1Qcm9wczogc3RyaW5nW10gPSBCcnludHVtU2xpZGVUb2dnbGVDb21wb25lbnQuYnJ5bnR1bUZlYXR1cmVOYW1lcy5jb25jYXQoW1xuICAgICAgICAnYWxpZ25TZWxmJyxcbiAgICAgICAgJ2FuY2hvclNpemUnLFxuICAgICAgICAnYmFkZ2UnLFxuICAgICAgICAnY2hlY2tlZCcsXG4gICAgICAgICdjb250ZW50JyxcbiAgICAgICAgJ2RhdGFzZXQnLFxuICAgICAgICAnZGlzYWJsZWQnLFxuICAgICAgICAnZXh0cmFEYXRhJyxcbiAgICAgICAgJ2ZsZXgnLFxuICAgICAgICAnaGVpZ2h0JyxcbiAgICAgICAgJ2hpZGRlbicsXG4gICAgICAgICdodG1sJyxcbiAgICAgICAgJ2lkJyxcbiAgICAgICAgJ2xhYmVsJyxcbiAgICAgICAgJ21hcmdpbicsXG4gICAgICAgICdtYXhIZWlnaHQnLFxuICAgICAgICAnbWF4V2lkdGgnLFxuICAgICAgICAnbWluSGVpZ2h0JyxcbiAgICAgICAgJ21pbldpZHRoJyxcbiAgICAgICAgJ25hbWUnLFxuICAgICAgICAncmVhZE9ubHknLFxuICAgICAgICAnc2Nyb2xsYWJsZScsXG4gICAgICAgICd0b29sdGlwJyxcbiAgICAgICAgJ3RyaWdnZXJzJyxcbiAgICAgICAgJ3ZhbHVlJyxcbiAgICAgICAgJ3dpZHRoJyxcbiAgICAgICAgJ3gnLFxuICAgICAgICAneSdcbiAgICBdKTtcblxuICAgIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZjtcbiAgICBwdWJsaWMgaW5zdGFuY2U6IFNsaWRlVG9nZ2xlO1xuXG4gICAgcHJpdmF0ZSBicnludHVtQ29uZmlnID0ge1xuICAgICAgICBhbmd1bGFyQ29tcG9uZW50IDogdGhpcyxcbiAgICAgICAgYWRvcHQgICAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgbGlzdGVuZXJzICAgICAgICA6IHt9LFxuICAgICAgICBmZWF0dXJlcyAgICAgICAgIDoge31cbiAgICB9O1xuXG4gICAgY29uc3RydWN0b3IoZWxlbWVudDogRWxlbWVudFJlZikge1xuICAgICAgICB0aGlzLmVsZW1lbnRSZWYgPSBlbGVtZW50O1xuICAgIH1cblxuICAgICAvLyBDb25maWdzIG9ubHlcbiAgICBASW5wdXQoKSBhZG9wdCAgICAgICAgICAgICAgICAgICA6IEhUTUxFbGVtZW50fHN0cmluZztcbiAgICBASW5wdXQoKSBhbGlnbiAgICAgICAgICAgICAgICAgICA6IG9iamVjdHxzdHJpbmc7XG4gICAgQElucHV0KCkgYW5jaG9yICAgICAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGFwcGVuZFRvICAgICAgICAgICAgICAgIDogSFRNTEVsZW1lbnR8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGF1dG9Db21wbGV0ZSAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGF1dG9TZWxlY3QgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBidWJibGVFdmVudHMgICAgICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBjZW50ZXJlZCAgICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgY2xlYXJhYmxlICAgICAgICAgICAgICAgOiBib29sZWFufG9iamVjdDtcbiAgICBASW5wdXQoKSBjbHMgICAgICAgICAgICAgICAgICAgICA6IHN0cmluZ3xvYmplY3Q7XG4gICAgQElucHV0KCkgY29sb3IgICAgICAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgY29uZmlnICAgICAgICAgICAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgY29uc3RyYWluVG8gICAgICAgICAgICAgOiBIVE1MRWxlbWVudHxXaWRnZXR8UmVjdGFuZ2xlO1xuICAgIEBJbnB1dCgpIGNvbnRlbnRFbGVtZW50Q2xzICAgICAgIDogc3RyaW5nfG9iamVjdDtcbiAgICBASW5wdXQoKSBkZWZhdWx0QmluZFByb3BlcnR5ICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBkb2NrICAgICAgICAgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBkcmFnZ2FibGUgICAgICAgICAgICAgICA6IGJvb2xlYW58b2JqZWN0O1xuICAgIEBJbnB1dCgpIGVkaXRhYmxlICAgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBmbG9hdGluZyAgICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgaGlkZUFuaW1hdGlvbiAgICAgICAgICAgOiBib29sZWFufG9iamVjdDtcbiAgICBASW5wdXQoKSBoaWdobGlnaHRFeHRlcm5hbENoYW5nZSA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgaGludCAgICAgICAgICAgICAgICAgICAgOiBzdHJpbmd8RnVuY3Rpb247XG4gICAgQElucHV0KCkgaGludEh0bWwgICAgICAgICAgICAgICAgOiBzdHJpbmd8RnVuY3Rpb247XG4gICAgQElucHV0KCkgaHRtbENscyAgICAgICAgICAgICAgICAgOiBzdHJpbmd8b2JqZWN0O1xuICAgIEBJbnB1dCgpIGlucHV0QWxpZ24gICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGlucHV0QXR0cmlidXRlcyAgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIGlucHV0V2lkdGggICAgICAgICAgICAgIDogc3RyaW5nfG51bWJlcjtcbiAgICBASW5wdXQoKSBpbnNlcnRCZWZvcmUgICAgICAgICAgICA6IEhUTUxFbGVtZW50fHN0cmluZztcbiAgICBASW5wdXQoKSBpbnNlcnRGaXJzdCAgICAgICAgICAgICA6IEhUTUxFbGVtZW50fHN0cmluZztcbiAgICBASW5wdXQoKSBrZXlTdHJva2VDaGFuZ2VEZWxheSAgICA6IG51bWJlcjtcbiAgICBASW5wdXQoKSBsYWJlbENscyAgICAgICAgICAgICAgICA6IHN0cmluZ3xvYmplY3Q7XG4gICAgQElucHV0KCkgbGFiZWxQb3NpdGlvbiAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgbGFiZWxzICAgICAgICAgICAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgbGFiZWxXaWR0aCAgICAgICAgICAgICAgOiBzdHJpbmd8bnVtYmVyO1xuICAgIEBJbnB1dCgpIGxpc3RlbmVycyAgICAgICAgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIGxvY2FsZUNsYXNzICAgICAgICAgICAgIDogQmFzZTtcbiAgICBASW5wdXQoKSBsb2NhbGl6YWJsZVByb3BlcnRpZXMgICA6IHN0cmluZ1tdO1xuICAgIEBJbnB1dCgpIG1hc2tEZWZhdWx0cyAgICAgICAgICAgIDogb2JqZWN0fE1hc2t8UGFydGlhbDxNYXNrQ29uZmlnPjtcbiAgICBASW5wdXQoKSBtYXNrZWQgICAgICAgICAgICAgICAgICA6IGJvb2xlYW58c3RyaW5nfG9iamVjdHxNYXNrfFBhcnRpYWw8TWFza0NvbmZpZz47XG4gICAgQElucHV0KCkgbW9uaXRvclJlc2l6ZSAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIG93bmVyICAgICAgICAgICAgICAgICAgIDogV2lkZ2V0O1xuICAgIEBJbnB1dCgpIHBsYWNlaG9sZGVyICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIHBvc2l0aW9uZWQgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBwcmV2ZW50VG9vbHRpcE9uVG91Y2ggICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgcmVxdWlyZWQgICAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHJldmVydE9uRXNjYXBlICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSByaXBwbGUgICAgICAgICAgICAgICAgICA6IGJvb2xlYW58b2JqZWN0O1xuICAgIEBJbnB1dCgpIHJvb3RFbGVtZW50ICAgICAgICAgICAgIDogU2hhZG93Um9vdDtcbiAgICBASW5wdXQoKSBzY3JvbGxBY3Rpb24gICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBzaG93QW5pbWF0aW9uICAgICAgICAgICA6IGJvb2xlYW58b2JqZWN0O1xuICAgIEBJbnB1dCgpIHRhYiAgICAgICAgICAgICAgICAgICAgIDogYm9vbGVhbnxvYmplY3Q7XG4gICAgQElucHV0KCkgdGFnICAgICAgICAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgdGV4dCAgICAgICAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgdGV4dEFsaWduICAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgdGl0bGUgICAgICAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgd2VpZ2h0ICAgICAgICAgICAgICAgICAgOiBudW1iZXI7XG5cbiAgICAgLy8gQ29uZmlncyBhbmQgcHJvcGVydGllc1xuICAgIEBJbnB1dCgpIGFsaWduU2VsZiAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgYmFkZ2UgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBjaGVja2VkICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBjb250ZW50ICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGRhdGFzZXQgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgZGlzYWJsZWQgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgZXh0cmFEYXRhICA6IGJvb2xlYW58bnVtYmVyfG9iamVjdHxzdHJpbmc7XG4gICAgQElucHV0KCkgZmxleCAgICAgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgaGVpZ2h0ICAgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgaGlkZGVuICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgaHRtbCAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBpZCAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGxhYmVsICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgbWFyZ2luICAgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgbWF4SGVpZ2h0ICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgbWF4V2lkdGggICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgbWluSGVpZ2h0ICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgbWluV2lkdGggICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgbmFtZSAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSByZWFkT25seSAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBzY3JvbGxhYmxlIDogYm9vbGVhbnxTY3JvbGxlcnxvYmplY3R8UGFydGlhbDxTY3JvbGxlckNvbmZpZz47XG4gICAgQElucHV0KCkgdG9vbHRpcCAgICA6IG9iamVjdHxzdHJpbmc7XG4gICAgQElucHV0KCkgdHJpZ2dlcnMgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSB2YWx1ZSAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIHdpZHRoICAgICAgOiBudW1iZXJ8c3RyaW5nO1xuICAgIEBJbnB1dCgpIHggICAgICAgICAgOiBudW1iZXI7XG4gICAgQElucHV0KCkgeSAgICAgICAgICA6IG51bWJlcjtcblxuICAgICAvLyBQcm9wZXJ0aWVzIG9ubHlcbiAgICBASW5wdXQoKSBhbmNob3JTaXplIDogbnVtYmVyW107XG5cbiAgICAgLy8gRXZlbnRzXG4gICAgQE91dHB1dCgpIG9uQWN0aW9uICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkJlZm9yZUNoYW5nZSAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25CZWZvcmVEZXN0cm95ID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uQmVmb3JlSGlkZSAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkJlZm9yZVNob3cgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25DYXRjaEFsbCAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uQ2hhbmdlICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkNsZWFyICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25EZXN0cm95ICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uRm9jdXNJbiAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkZvY3VzT3V0ICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25IaWRlICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uSW5wdXQgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvblBhaW50ICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25SZWFkT25seSAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uUmVzaXplICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvblNob3cgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25UcmlnZ2VyICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYW5kIGFwcGVuZCB0aGUgdW5kZXJseWluZyB3aWRnZXRcbiAgICAgKi9cbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICAgY29uc3RcbiAgICAgICAgICAgIG1lID0gdGhpcyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50UmVmLFxuICAgICAgICAgICAgICAgIGJyeW50dW1Db25maWdcbiAgICAgICAgICAgIH0gPSBtZSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpbnN0YW5jZUNsYXNzLFxuICAgICAgICAgICAgICAgIGJyeW50dW1Db25maWdzXG4gICAgICAgICAgICB9ID0gQnJ5bnR1bVNsaWRlVG9nZ2xlQ29tcG9uZW50O1xuXG4gICAgICAgIE9iamVjdC5hc3NpZ24oYnJ5bnR1bUNvbmZpZywge1xuICAgICAgICAgICAgbGlzdGVuZXJzIDoge1xuICAgICAgICAgICAgICAgIGFjdGlvbihldmVudCA6IGFueSkgeyBtZS5vbkFjdGlvbi5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBiZWZvcmVDaGFuZ2UoZXZlbnQgOiBhbnkpIHsgbWUub25CZWZvcmVDaGFuZ2UuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgYmVmb3JlRGVzdHJveShldmVudCA6IGFueSkgeyBtZS5vbkJlZm9yZURlc3Ryb3kuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgYmVmb3JlSGlkZShldmVudCA6IGFueSkgeyBtZS5vbkJlZm9yZUhpZGUuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgYmVmb3JlU2hvdyhldmVudCA6IGFueSkgeyBtZS5vbkJlZm9yZVNob3cuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgY2F0Y2hBbGwoZXZlbnQgOiBhbnkpIHsgbWUub25DYXRjaEFsbC5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBjaGFuZ2UoZXZlbnQgOiBhbnkpIHsgbWUub25DaGFuZ2UuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgY2xlYXIoZXZlbnQgOiBhbnkpIHsgbWUub25DbGVhci5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBkZXN0cm95KGV2ZW50IDogYW55KSB7IG1lLm9uRGVzdHJveS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBmb2N1c0luKGV2ZW50IDogYW55KSB7IG1lLm9uRm9jdXNJbi5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBmb2N1c091dChldmVudCA6IGFueSkgeyBtZS5vbkZvY3VzT3V0LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGhpZGUoZXZlbnQgOiBhbnkpIHsgbWUub25IaWRlLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGlucHV0KGV2ZW50IDogYW55KSB7IG1lLm9uSW5wdXQuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgcGFpbnQoZXZlbnQgOiBhbnkpIHsgbWUub25QYWludC5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICByZWFkT25seShldmVudCA6IGFueSkgeyBtZS5vblJlYWRPbmx5LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIHJlc2l6ZShldmVudCA6IGFueSkgeyBtZS5vblJlc2l6ZS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBzaG93KGV2ZW50IDogYW55KSB7IG1lLm9uU2hvdy5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICB0cmlnZ2VyKGV2ZW50IDogYW55KSB7IG1lLm9uVHJpZ2dlci5lbWl0KGV2ZW50KTsgfSxcblxuICAgICAgICAgICAgICAgIHRoaXNPYmogOiBtZVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBJZiBjb21wb25lbnQgaGFzIG5vIGNvbnRhaW5lciBzcGVjaWZpZWQgaW4gY29uZmlnIHRoZW4gdXNlIGFkb3B0IHRvIFdyYXBwZXIncyBlbGVtZW50XG4gICAgICAgIGNvbnN0XG4gICAgICAgICAgICBjb250YWluZXJQYXJhbSA9IFtcbiAgICAgICAgICAgICAgICAnYWRvcHQnLFxuICAgICAgICAgICAgICAgICdhcHBlbmRUbycsXG4gICAgICAgICAgICAgICAgJ2luc2VydEFmdGVyJyxcbiAgICAgICAgICAgICAgICAnaW5zZXJ0QmVmb3JlJ1xuICAgICAgICAgICAgXS5maW5kKHByb3AgPT4gYnJ5bnR1bUNvbmZpZ1twcm9wXSk7XG4gICAgICAgIGlmICghY29udGFpbmVyUGFyYW0pIHtcbiAgICAgICAgICAgIGJyeW50dW1Db25maWcuYWRvcHQgPSBlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBXcmFwcGVySGVscGVyLmRldldhcm5pbmdDb250YWluZXIoaW5zdGFuY2VDbGFzcy4kbmFtZSwgY29udGFpbmVyUGFyYW0pO1xuICAgICAgICB9XG5cbiAgICAgICAgYnJ5bnR1bUNvbmZpZ3MuZmlsdGVyKHByb3AgPT4gcHJvcCBpbiB0aGlzKS5mb3JFYWNoKHByb3AgPT4ge1xuICAgICAgICAgICAgV3JhcHBlckhlbHBlci5hcHBseVByb3BWYWx1ZShicnludHVtQ29uZmlnLCBwcm9wLCB0aGlzW3Byb3BdKTtcbiAgICAgICAgICAgIGlmIChbJ2ZlYXR1cmVzJywgJ2NvbmZpZyddLmluY2x1ZGVzKHByb3ApKSB7XG4gICAgICAgICAgICAgICAgV3JhcHBlckhlbHBlci5kZXZXYXJuaW5nQ29uZmlnUHJvcChpbnN0YW5jZUNsYXNzLiRuYW1lLCBwcm9wKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBtZS5pbnN0YW5jZSA9IGluc3RhbmNlQ2xhc3MuJG5hbWUgPT09ICdXaWRnZXQnID8gV2lkZ2V0SGVscGVyLmNyZWF0ZVdpZGdldChicnludHVtQ29uZmlnKSA6IG5ldyBpbnN0YW5jZUNsYXNzKGJyeW50dW1Db25maWcpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogV2F0Y2ggZm9yIGNoYW5nZXNcbiAgICAgKiBAcGFyYW0gY2hhbmdlc1xuICAgICAqL1xuICAgIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICAgICAgY29uc3RcbiAgICAgICAgICAgIHsgaW5zdGFuY2UgfSA9IHRoaXMsXG4gICAgICAgICAgICB7IGluc3RhbmNlQ2xhc3MgfSA9IEJyeW50dW1TbGlkZVRvZ2dsZUNvbXBvbmVudDtcblxuICAgICAgICBpZiAoIWluc3RhbmNlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJdGVyYXRlIG92ZXIgYWxsIGNoYW5nZXNcbiAgICAgICAgT2JqZWN0LmVudHJpZXMoY2hhbmdlcykuZm9yRWFjaCgoW3Byb3AsIGNoYW5nZV0pID0+IHtcbiAgICAgICAgICAgIGNvbnN0XG4gICAgICAgICAgICAgICAgbmV3VmFsdWUgPSAoY2hhbmdlIGFzIFNpbXBsZUNoYW5nZSkuY3VycmVudFZhbHVlLFxuICAgICAgICAgICAgICAgIHsgaW5zdGFuY2UgfSA9IHRoaXMsXG4gICAgICAgICAgICAgICAgeyBicnludHVtQ29uZmlnc09ubHksIGJyeW50dW1Qcm9wcyB9ID0gQnJ5bnR1bVNsaWRlVG9nZ2xlQ29tcG9uZW50O1xuICAgICAgICAgICAgaWYgKGJyeW50dW1Qcm9wcy5pbmNsdWRlcyhwcm9wKSkge1xuICAgICAgICAgICAgICAgIFdyYXBwZXJIZWxwZXIuYXBwbHlQcm9wVmFsdWUoaW5zdGFuY2UsIHByb3AsIG5ld1ZhbHVlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgaWYgKGJyeW50dW1Db25maWdzT25seS5pbmNsdWRlcyhwcm9wKSkge1xuICAgICAgICAgICAgICAgICAgICBXcmFwcGVySGVscGVyLmRldldhcm5pbmdVcGRhdGVQcm9wKGluc3RhbmNlQ2xhc3MuJG5hbWUsIHByb3ApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGVzdHJveSB0aGUgY29tcG9uZW50XG4gICAgICovXG4gICAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmluc3RhbmNlKSB7XG4gICAgICAgICAgICB0aGlzLmluc3RhbmNlLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==