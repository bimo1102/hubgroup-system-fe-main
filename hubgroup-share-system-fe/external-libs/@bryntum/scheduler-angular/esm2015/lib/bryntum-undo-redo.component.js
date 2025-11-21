/**
 * Angular wrapper for Bryntum UndoRedo
 */
import { Component, ElementRef, EventEmitter, Output, Input } from '@angular/core';
import WrapperHelper from './wrapper.helper';
// Bryntum 'scheduler.lite.umd' bundle comes without polyfills to support Angular's zone.js
import { Base, Model, ProjectModel, Widget } from '@bryntum/scheduler/scheduler.lite.umd.js';
import { UndoRedo, WidgetHelper } from '@bryntum/scheduler/scheduler.lite.umd.js';
export class BryntumUndoRedoComponent {
    constructor(element) {
        this.bryntumConfig = {
            angularComponent: this,
            adopt: undefined,
            listeners: {},
            features: {}
        };
        // Events
        this.onBeforeDestroy = new EventEmitter();
        this.onBeforeHide = new EventEmitter();
        this.onBeforeSetRecord = new EventEmitter();
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
    ngOnInit() {
        const me = this, { elementRef, bryntumConfig } = me, { instanceClass, bryntumConfigs } = BryntumUndoRedoComponent;
        Object.assign(bryntumConfig, {
            listeners: {
                beforeDestroy(event) { me.onBeforeDestroy.emit(event); },
                beforeHide(event) { me.onBeforeHide.emit(event); },
                beforeSetRecord(event) { me.onBeforeSetRecord.emit(event); },
                beforeShow(event) { me.onBeforeShow.emit(event); },
                catchAll(event) { me.onCatchAll.emit(event); },
                destroy(event) { me.onDestroy.emit(event); },
                focusIn(event) { me.onFocusIn.emit(event); },
                focusOut(event) { me.onFocusOut.emit(event); },
                hide(event) { me.onHide.emit(event); },
                paint(event) { me.onPaint.emit(event); },
                readOnly(event) { me.onReadOnly.emit(event); },
                resize(event) { me.onResize.emit(event); },
                show(event) { me.onShow.emit(event); },
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
        const { instance } = this, { instanceClass } = BryntumUndoRedoComponent;
        if (!instance) {
            return;
        }
        // Iterate over all changes
        Object.entries(changes).forEach(([prop, change]) => {
            const newValue = change.currentValue, { instance } = this, { bryntumConfigsOnly, bryntumProps } = BryntumUndoRedoComponent;
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
BryntumUndoRedoComponent.instanceClass = UndoRedo;
BryntumUndoRedoComponent.bryntumFeatureNames = [];
BryntumUndoRedoComponent.bryntumConfigs = BryntumUndoRedoComponent.bryntumFeatureNames.concat([
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
    'project',
    'readOnly',
    'ripple',
    'rootElement',
    'scheduler',
    'scrollable',
    'scrollAction',
    'showAnimation',
    'showZeroActionBadge',
    'tab',
    'tag',
    'text',
    'textAlign',
    'textContent',
    'title',
    'tooltip',
    'weight',
    'width',
    'x',
    'y'
]);
BryntumUndoRedoComponent.bryntumConfigsOnly = [
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
    'project',
    'ripple',
    'rootElement',
    'scheduler',
    'scrollAction',
    'showAnimation',
    'showZeroActionBadge',
    'tab',
    'tag',
    'text',
    'textAlign',
    'textContent',
    'title',
    'weight'
];
BryntumUndoRedoComponent.bryntumProps = BryntumUndoRedoComponent.bryntumFeatureNames.concat([
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
BryntumUndoRedoComponent.decorators = [
    { type: Component, args: [{
                selector: 'bryntum-undo-redo',
                template: ''
            }] }
];
/** @nocollapse */
BryntumUndoRedoComponent.ctorParameters = () => [
    { type: ElementRef }
];
BryntumUndoRedoComponent.propDecorators = {
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
    project: [{ type: Input }],
    ripple: [{ type: Input }],
    rootElement: [{ type: Input }],
    scheduler: [{ type: Input }],
    scrollAction: [{ type: Input }],
    showAnimation: [{ type: Input }],
    showZeroActionBadge: [{ type: Input }],
    tab: [{ type: Input }],
    tag: [{ type: Input }],
    text: [{ type: Input }],
    textAlign: [{ type: Input }],
    textContent: [{ type: Input }],
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
    onBeforeDestroy: [{ type: Output }],
    onBeforeHide: [{ type: Output }],
    onBeforeSetRecord: [{ type: Output }],
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJ5bnR1bS11bmRvLXJlZG8uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGJyeW50dW0vc2NoZWR1bGVyLWFuZ3VsYXIvIiwic291cmNlcyI6WyJsaWIvYnJ5bnR1bS11bmRvLXJlZG8uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztHQUVHO0FBRUgsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFxQixNQUFNLEVBQUUsS0FBSyxFQUErQixNQUFNLGVBQWUsQ0FBQztBQUNuSSxPQUFPLGFBQWEsTUFBTSxrQkFBa0IsQ0FBQztBQUU3QywyRkFBMkY7QUFDM0YsT0FBTyxFQUFFLElBQUksRUFBNEIsS0FBSyxFQUFFLFlBQVksRUFBdUMsTUFBTSxFQUFnQixNQUFNLDBDQUEwQyxDQUFDO0FBQzFLLE9BQU8sRUFBRSxRQUFRLEVBQWdCLFlBQVksRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBTWhHLE1BQU0sT0FBTyx3QkFBd0I7SUE4S2pDLFlBQVksT0FBbUI7UUFQdkIsa0JBQWEsR0FBRztZQUNwQixnQkFBZ0IsRUFBRyxJQUFJO1lBQ3ZCLEtBQUssRUFBYyxTQUFTO1lBQzVCLFNBQVMsRUFBVSxFQUFFO1lBQ3JCLFFBQVEsRUFBVyxFQUFFO1NBQ3hCLENBQUM7UUF3RkQsU0FBUztRQUNBLG9CQUFlLEdBQUssSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUMvQyxpQkFBWSxHQUFRLElBQUksWUFBWSxFQUFVLENBQUM7UUFDL0Msc0JBQWlCLEdBQUcsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUMvQyxpQkFBWSxHQUFRLElBQUksWUFBWSxFQUFVLENBQUM7UUFDL0MsZUFBVSxHQUFVLElBQUksWUFBWSxFQUFVLENBQUM7UUFDL0MsY0FBUyxHQUFXLElBQUksWUFBWSxFQUFVLENBQUM7UUFDL0MsY0FBUyxHQUFXLElBQUksWUFBWSxFQUFVLENBQUM7UUFDL0MsZUFBVSxHQUFVLElBQUksWUFBWSxFQUFVLENBQUM7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SztzQkFDTCxLQUFLO3VCQUNMLEtBQUs7d0JBQ0wsS0FBSzttQkFDTCxLQUFLO3FCQUNMLEtBQUs7cUJBQ0wsS0FBSzttQkFDTCxLQUFLO2lCQUNMLEtBQUs7b0JBQ0wsS0FBSztxQkFDTCxLQUFLOzBCQUNMLEtBQUs7cUJBQ0wsS0FBSzt3QkFDTCxLQUFLO3VCQUNMLEtBQUs7d0JBQ0wsS0FBSzt1QkFDTCxLQUFLO3VCQUNMLEtBQUs7eUJBQ0wsS0FBSztzQkFDTCxLQUFLO29CQUNMLEtBQUs7Z0JBQ0wsS0FBSztnQkFDTCxLQUFLO3lCQUdMLEtBQUs7OEJBQ0wsS0FBSztzQkFDTCxLQUFLO3FCQUNMLEtBQUs7cUJBQ0wsS0FBSzs4QkFHTCxNQUFNOzJCQUNOLE1BQU07Z0NBQ04sTUFBTTsyQkFDTixNQUFNO3lCQUNOLE1BQU07d0JBQ04sTUFBTTt3QkFDTixNQUFNO3lCQUNOLE1BQU07cUJBQ04sTUFBTTtzQkFDTixNQUFNO3lCQUNOLE1BQU07dUJBQ04sTUFBTTtxQkFDTixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBBbmd1bGFyIHdyYXBwZXIgZm9yIEJyeW50dW0gVW5kb1JlZG9cbiAqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgT25EZXN0cm95LCBPbkluaXQsIE91dHB1dCwgSW5wdXQsIFNpbXBsZUNoYW5nZSwgU2ltcGxlQ2hhbmdlcyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IFdyYXBwZXJIZWxwZXIgZnJvbSAnLi93cmFwcGVyLmhlbHBlcic7XG5cbi8vIEJyeW50dW0gJ3NjaGVkdWxlci5saXRlLnVtZCcgYnVuZGxlIGNvbWVzIHdpdGhvdXQgcG9seWZpbGxzIHRvIHN1cHBvcnQgQW5ndWxhcidzIHpvbmUuanNcbmltcG9ydCB7IEJhc2UsIExheW91dCwgTWFzaywgTWFza0NvbmZpZywgTW9kZWwsIFByb2plY3RNb2RlbCwgUmVjdGFuZ2xlLCBTY3JvbGxlciwgU2Nyb2xsZXJDb25maWcsIFdpZGdldCwgV2lkZ2V0Q29uZmlnIH0gZnJvbSAnQGJyeW50dW0vc2NoZWR1bGVyL3NjaGVkdWxlci5saXRlLnVtZC5qcyc7XG5pbXBvcnQgeyBVbmRvUmVkbywgU3RyaW5nSGVscGVyLCBXaWRnZXRIZWxwZXIgfSBmcm9tICdAYnJ5bnR1bS9zY2hlZHVsZXIvc2NoZWR1bGVyLmxpdGUudW1kLmpzJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3IgOiAnYnJ5bnR1bS11bmRvLXJlZG8nLFxuICAgIHRlbXBsYXRlIDogJydcbn0pXG5leHBvcnQgY2xhc3MgQnJ5bnR1bVVuZG9SZWRvQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuXG4gICAgcHVibGljIHN0YXRpYyBpbnN0YW5jZUNsYXNzID0gVW5kb1JlZG87XG5cbiAgICBwcml2YXRlIHN0YXRpYyBicnludHVtRmVhdHVyZU5hbWVzOiBzdHJpbmdbXSA9IFtcblxuICAgIF07XG5cbiAgICBwcml2YXRlIHN0YXRpYyBicnludHVtQ29uZmlnczogc3RyaW5nW10gPSBCcnludHVtVW5kb1JlZG9Db21wb25lbnQuYnJ5bnR1bUZlYXR1cmVOYW1lcy5jb25jYXQoW1xuICAgICAgICAnYWRvcHQnLFxuICAgICAgICAnYWxpZ24nLFxuICAgICAgICAnYWxpZ25TZWxmJyxcbiAgICAgICAgJ2FuY2hvcicsXG4gICAgICAgICdhcHBlbmRUbycsXG4gICAgICAgICdidWJibGVFdmVudHMnLFxuICAgICAgICAnY2VudGVyZWQnLFxuICAgICAgICAnY2xzJyxcbiAgICAgICAgJ2NvbG9yJyxcbiAgICAgICAgJ2NvbmZpZycsXG4gICAgICAgICdjb25zdHJhaW5UbycsXG4gICAgICAgICdjb250ZW50JyxcbiAgICAgICAgJ2NvbnRlbnRFbGVtZW50Q2xzJyxcbiAgICAgICAgJ2RhdGFzZXQnLFxuICAgICAgICAnZGVmYXVsdEJpbmRQcm9wZXJ0eScsXG4gICAgICAgICdkZWZhdWx0cycsXG4gICAgICAgICdkaXNhYmxlZCcsXG4gICAgICAgICdkb2NrJyxcbiAgICAgICAgJ2RyYWdnYWJsZScsXG4gICAgICAgICdleHRyYURhdGEnLFxuICAgICAgICAnZmxleCcsXG4gICAgICAgICdmbG9hdGluZycsXG4gICAgICAgICdoZWlnaHQnLFxuICAgICAgICAnaGlkZGVuJyxcbiAgICAgICAgJ2hpZGVBbmltYXRpb24nLFxuICAgICAgICAnaGlkZVdoZW5FbXB0eScsXG4gICAgICAgICdodG1sJyxcbiAgICAgICAgJ2h0bWxDbHMnLFxuICAgICAgICAnaWQnLFxuICAgICAgICAnaW5zZXJ0QmVmb3JlJyxcbiAgICAgICAgJ2luc2VydEZpcnN0JyxcbiAgICAgICAgJ2l0ZW1DbHMnLFxuICAgICAgICAnaXRlbXMnLFxuICAgICAgICAnbGF5b3V0JyxcbiAgICAgICAgJ2xheW91dFN0eWxlJyxcbiAgICAgICAgJ2xhenlJdGVtcycsXG4gICAgICAgICdsaXN0ZW5lcnMnLFxuICAgICAgICAnbG9jYWxlQ2xhc3MnLFxuICAgICAgICAnbG9jYWxpemFibGVQcm9wZXJ0aWVzJyxcbiAgICAgICAgJ21hcmdpbicsXG4gICAgICAgICdtYXNrRGVmYXVsdHMnLFxuICAgICAgICAnbWFza2VkJyxcbiAgICAgICAgJ21heEhlaWdodCcsXG4gICAgICAgICdtYXhXaWR0aCcsXG4gICAgICAgICdtaW5IZWlnaHQnLFxuICAgICAgICAnbWluV2lkdGgnLFxuICAgICAgICAnbW9uaXRvclJlc2l6ZScsXG4gICAgICAgICduYW1lZEl0ZW1zJyxcbiAgICAgICAgJ293bmVyJyxcbiAgICAgICAgJ3Bvc2l0aW9uZWQnLFxuICAgICAgICAncHJldmVudFRvb2x0aXBPblRvdWNoJyxcbiAgICAgICAgJ3Byb2plY3QnLFxuICAgICAgICAncmVhZE9ubHknLFxuICAgICAgICAncmlwcGxlJyxcbiAgICAgICAgJ3Jvb3RFbGVtZW50JyxcbiAgICAgICAgJ3NjaGVkdWxlcicsXG4gICAgICAgICdzY3JvbGxhYmxlJyxcbiAgICAgICAgJ3Njcm9sbEFjdGlvbicsXG4gICAgICAgICdzaG93QW5pbWF0aW9uJyxcbiAgICAgICAgJ3Nob3daZXJvQWN0aW9uQmFkZ2UnLFxuICAgICAgICAndGFiJyxcbiAgICAgICAgJ3RhZycsXG4gICAgICAgICd0ZXh0JyxcbiAgICAgICAgJ3RleHRBbGlnbicsXG4gICAgICAgICd0ZXh0Q29udGVudCcsXG4gICAgICAgICd0aXRsZScsXG4gICAgICAgICd0b29sdGlwJyxcbiAgICAgICAgJ3dlaWdodCcsXG4gICAgICAgICd3aWR0aCcsXG4gICAgICAgICd4JyxcbiAgICAgICAgJ3knXG4gICAgXSk7XG5cbiAgICBwcml2YXRlIHN0YXRpYyBicnludHVtQ29uZmlnc09ubHk6IHN0cmluZ1tdID0gW1xuICAgICAgICAnYWRvcHQnLFxuICAgICAgICAnYWxpZ24nLFxuICAgICAgICAnYW5jaG9yJyxcbiAgICAgICAgJ2FwcGVuZFRvJyxcbiAgICAgICAgJ2J1YmJsZUV2ZW50cycsXG4gICAgICAgICdjZW50ZXJlZCcsXG4gICAgICAgICdjbHMnLFxuICAgICAgICAnY29sb3InLFxuICAgICAgICAnY29uZmlnJyxcbiAgICAgICAgJ2NvbnN0cmFpblRvJyxcbiAgICAgICAgJ2NvbnRlbnRFbGVtZW50Q2xzJyxcbiAgICAgICAgJ2RlZmF1bHRCaW5kUHJvcGVydHknLFxuICAgICAgICAnZGVmYXVsdHMnLFxuICAgICAgICAnZG9jaycsXG4gICAgICAgICdkcmFnZ2FibGUnLFxuICAgICAgICAnZmxvYXRpbmcnLFxuICAgICAgICAnaGlkZUFuaW1hdGlvbicsXG4gICAgICAgICdoaWRlV2hlbkVtcHR5JyxcbiAgICAgICAgJ2h0bWxDbHMnLFxuICAgICAgICAnaW5zZXJ0QmVmb3JlJyxcbiAgICAgICAgJ2luc2VydEZpcnN0JyxcbiAgICAgICAgJ2l0ZW1DbHMnLFxuICAgICAgICAnbGF6eUl0ZW1zJyxcbiAgICAgICAgJ2xpc3RlbmVycycsXG4gICAgICAgICdsb2NhbGVDbGFzcycsXG4gICAgICAgICdsb2NhbGl6YWJsZVByb3BlcnRpZXMnLFxuICAgICAgICAnbWFza0RlZmF1bHRzJyxcbiAgICAgICAgJ21hc2tlZCcsXG4gICAgICAgICdtb25pdG9yUmVzaXplJyxcbiAgICAgICAgJ25hbWVkSXRlbXMnLFxuICAgICAgICAnb3duZXInLFxuICAgICAgICAncG9zaXRpb25lZCcsXG4gICAgICAgICdwcmV2ZW50VG9vbHRpcE9uVG91Y2gnLFxuICAgICAgICAncHJvamVjdCcsXG4gICAgICAgICdyaXBwbGUnLFxuICAgICAgICAncm9vdEVsZW1lbnQnLFxuICAgICAgICAnc2NoZWR1bGVyJyxcbiAgICAgICAgJ3Njcm9sbEFjdGlvbicsXG4gICAgICAgICdzaG93QW5pbWF0aW9uJyxcbiAgICAgICAgJ3Nob3daZXJvQWN0aW9uQmFkZ2UnLFxuICAgICAgICAndGFiJyxcbiAgICAgICAgJ3RhZycsXG4gICAgICAgICd0ZXh0JyxcbiAgICAgICAgJ3RleHRBbGlnbicsXG4gICAgICAgICd0ZXh0Q29udGVudCcsXG4gICAgICAgICd0aXRsZScsXG4gICAgICAgICd3ZWlnaHQnXG4gICAgXTtcblxuICAgIHByaXZhdGUgc3RhdGljIGJyeW50dW1Qcm9wczogc3RyaW5nW10gPSBCcnludHVtVW5kb1JlZG9Db21wb25lbnQuYnJ5bnR1bUZlYXR1cmVOYW1lcy5jb25jYXQoW1xuICAgICAgICAnYWxpZ25TZWxmJyxcbiAgICAgICAgJ2FuY2hvclNpemUnLFxuICAgICAgICAnY29udGVudCcsXG4gICAgICAgICdkYXRhc2V0JyxcbiAgICAgICAgJ2Rpc2FibGVkJyxcbiAgICAgICAgJ2V4dHJhRGF0YScsXG4gICAgICAgICdmbGV4JyxcbiAgICAgICAgJ2hlaWdodCcsXG4gICAgICAgICdoaWRkZW4nLFxuICAgICAgICAnaHRtbCcsXG4gICAgICAgICdpZCcsXG4gICAgICAgICdpc1NldHRpbmdWYWx1ZXMnLFxuICAgICAgICAnaXNWYWxpZCcsXG4gICAgICAgICdpdGVtcycsXG4gICAgICAgICdsYXlvdXQnLFxuICAgICAgICAnbGF5b3V0U3R5bGUnLFxuICAgICAgICAnbWFyZ2luJyxcbiAgICAgICAgJ21heEhlaWdodCcsXG4gICAgICAgICdtYXhXaWR0aCcsXG4gICAgICAgICdtaW5IZWlnaHQnLFxuICAgICAgICAnbWluV2lkdGgnLFxuICAgICAgICAncmVhZE9ubHknLFxuICAgICAgICAncmVjb3JkJyxcbiAgICAgICAgJ3Njcm9sbGFibGUnLFxuICAgICAgICAndG9vbHRpcCcsXG4gICAgICAgICd2YWx1ZXMnLFxuICAgICAgICAnd2lkdGgnLFxuICAgICAgICAneCcsXG4gICAgICAgICd5J1xuICAgIF0pO1xuXG4gICAgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmO1xuICAgIHB1YmxpYyBpbnN0YW5jZTogVW5kb1JlZG87XG5cbiAgICBwcml2YXRlIGJyeW50dW1Db25maWcgPSB7XG4gICAgICAgIGFuZ3VsYXJDb21wb25lbnQgOiB0aGlzLFxuICAgICAgICBhZG9wdCAgICAgICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgICBsaXN0ZW5lcnMgICAgICAgIDoge30sXG4gICAgICAgIGZlYXR1cmVzICAgICAgICAgOiB7fVxuICAgIH07XG5cbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50OiBFbGVtZW50UmVmKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudFJlZiA9IGVsZW1lbnQ7XG4gICAgfVxuXG4gICAgIC8vIENvbmZpZ3Mgb25seVxuICAgIEBJbnB1dCgpIGFkb3B0ICAgICAgICAgICAgICAgICA6IEhUTUxFbGVtZW50fHN0cmluZztcbiAgICBASW5wdXQoKSBhbGlnbiAgICAgICAgICAgICAgICAgOiBvYmplY3R8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGFuY2hvciAgICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgYXBwZW5kVG8gICAgICAgICAgICAgIDogSFRNTEVsZW1lbnR8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGJ1YmJsZUV2ZW50cyAgICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBjZW50ZXJlZCAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGNscyAgICAgICAgICAgICAgICAgICA6IHN0cmluZ3xvYmplY3Q7XG4gICAgQElucHV0KCkgY29sb3IgICAgICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGNvbmZpZyAgICAgICAgICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBjb25zdHJhaW5UbyAgICAgICAgICAgOiBIVE1MRWxlbWVudHxXaWRnZXR8UmVjdGFuZ2xlO1xuICAgIEBJbnB1dCgpIGNvbnRlbnRFbGVtZW50Q2xzICAgICA6IHN0cmluZ3xvYmplY3Q7XG4gICAgQElucHV0KCkgZGVmYXVsdEJpbmRQcm9wZXJ0eSAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGRlZmF1bHRzICAgICAgICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBkb2NrICAgICAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgZHJhZ2dhYmxlICAgICAgICAgICAgIDogYm9vbGVhbnxvYmplY3Q7XG4gICAgQElucHV0KCkgZmxvYXRpbmcgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBoaWRlQW5pbWF0aW9uICAgICAgICAgOiBib29sZWFufG9iamVjdDtcbiAgICBASW5wdXQoKSBoaWRlV2hlbkVtcHR5ICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGh0bWxDbHMgICAgICAgICAgICAgICA6IHN0cmluZ3xvYmplY3Q7XG4gICAgQElucHV0KCkgaW5zZXJ0QmVmb3JlICAgICAgICAgIDogSFRNTEVsZW1lbnR8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGluc2VydEZpcnN0ICAgICAgICAgICA6IEhUTUxFbGVtZW50fHN0cmluZztcbiAgICBASW5wdXQoKSBpdGVtQ2xzICAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgbGF6eUl0ZW1zICAgICAgICAgICAgIDogb2JqZWN0fG9iamVjdFtdfFdpZGdldFtdfFBhcnRpYWw8V2lkZ2V0Q29uZmlnPnxQYXJ0aWFsPFdpZGdldENvbmZpZz5bXTtcbiAgICBASW5wdXQoKSBsaXN0ZW5lcnMgICAgICAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgbG9jYWxlQ2xhc3MgICAgICAgICAgIDogQmFzZTtcbiAgICBASW5wdXQoKSBsb2NhbGl6YWJsZVByb3BlcnRpZXMgOiBzdHJpbmdbXTtcbiAgICBASW5wdXQoKSBtYXNrRGVmYXVsdHMgICAgICAgICAgOiBvYmplY3R8TWFza3xQYXJ0aWFsPE1hc2tDb25maWc+O1xuICAgIEBJbnB1dCgpIG1hc2tlZCAgICAgICAgICAgICAgICA6IGJvb2xlYW58c3RyaW5nfG9iamVjdHxNYXNrfFBhcnRpYWw8TWFza0NvbmZpZz47XG4gICAgQElucHV0KCkgbW9uaXRvclJlc2l6ZSAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBuYW1lZEl0ZW1zICAgICAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgb3duZXIgICAgICAgICAgICAgICAgIDogV2lkZ2V0O1xuICAgIEBJbnB1dCgpIHBvc2l0aW9uZWQgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgcHJldmVudFRvb2x0aXBPblRvdWNoIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBwcm9qZWN0ICAgICAgICAgICAgICAgOiBQcm9qZWN0TW9kZWw7XG4gICAgQElucHV0KCkgcmlwcGxlICAgICAgICAgICAgICAgIDogYm9vbGVhbnxvYmplY3Q7XG4gICAgQElucHV0KCkgcm9vdEVsZW1lbnQgICAgICAgICAgIDogU2hhZG93Um9vdDtcbiAgICBASW5wdXQoKSBzY2hlZHVsZXIgICAgICAgICAgICAgOiBXaWRnZXR8c3RyaW5nO1xuICAgIEBJbnB1dCgpIHNjcm9sbEFjdGlvbiAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBzaG93QW5pbWF0aW9uICAgICAgICAgOiBib29sZWFufG9iamVjdDtcbiAgICBASW5wdXQoKSBzaG93WmVyb0FjdGlvbkJhZGdlICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHRhYiAgICAgICAgICAgICAgICAgICA6IGJvb2xlYW58b2JqZWN0O1xuICAgIEBJbnB1dCgpIHRhZyAgICAgICAgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSB0ZXh0ICAgICAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHRleHRBbGlnbiAgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSB0ZXh0Q29udGVudCAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHRpdGxlICAgICAgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSB3ZWlnaHQgICAgICAgICAgICAgICAgOiBudW1iZXI7XG5cbiAgICAgLy8gQ29uZmlncyBhbmQgcHJvcGVydGllc1xuICAgIEBJbnB1dCgpIGFsaWduU2VsZiAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGNvbnRlbnQgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGRhdGFzZXQgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIGRpc2FibGVkICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBleHRyYURhdGEgICA6IGJvb2xlYW58bnVtYmVyfG9iamVjdHxzdHJpbmc7XG4gICAgQElucHV0KCkgZmxleCAgICAgICAgOiBudW1iZXJ8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGhlaWdodCAgICAgIDogbnVtYmVyfHN0cmluZztcbiAgICBASW5wdXQoKSBoaWRkZW4gICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgaHRtbCAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgaWQgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgaXRlbXMgICAgICAgOiBXaWRnZXRbXXxvYmplY3R8b2JqZWN0W118UGFydGlhbDxXaWRnZXRDb25maWc+fFBhcnRpYWw8V2lkZ2V0Q29uZmlnPltdO1xuICAgIEBJbnB1dCgpIGxheW91dCAgICAgIDogTGF5b3V0fHN0cmluZztcbiAgICBASW5wdXQoKSBsYXlvdXRTdHlsZSA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBtYXJnaW4gICAgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgbWF4SGVpZ2h0ICAgOiBudW1iZXJ8c3RyaW5nO1xuICAgIEBJbnB1dCgpIG1heFdpZHRoICAgIDogbnVtYmVyfHN0cmluZztcbiAgICBASW5wdXQoKSBtaW5IZWlnaHQgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgbWluV2lkdGggICAgOiBudW1iZXJ8c3RyaW5nO1xuICAgIEBJbnB1dCgpIHJlYWRPbmx5ICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBzY3JvbGxhYmxlICA6IGJvb2xlYW58U2Nyb2xsZXJ8b2JqZWN0fFBhcnRpYWw8U2Nyb2xsZXJDb25maWc+O1xuICAgIEBJbnB1dCgpIHRvb2x0aXAgICAgIDogb2JqZWN0fHN0cmluZztcbiAgICBASW5wdXQoKSB3aWR0aCAgICAgICA6IG51bWJlcnxzdHJpbmc7XG4gICAgQElucHV0KCkgeCAgICAgICAgICAgOiBudW1iZXI7XG4gICAgQElucHV0KCkgeSAgICAgICAgICAgOiBudW1iZXI7XG5cbiAgICAgLy8gUHJvcGVydGllcyBvbmx5XG4gICAgQElucHV0KCkgYW5jaG9yU2l6ZSAgICAgIDogbnVtYmVyW107XG4gICAgQElucHV0KCkgaXNTZXR0aW5nVmFsdWVzIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBpc1ZhbGlkICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHJlY29yZCAgICAgICAgICA6IE1vZGVsO1xuICAgIEBJbnB1dCgpIHZhbHVlcyAgICAgICAgICA6IG9iamVjdDtcblxuICAgICAvLyBFdmVudHNcbiAgICBAT3V0cHV0KCkgb25CZWZvcmVEZXN0cm95ICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25CZWZvcmVIaWRlICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25CZWZvcmVTZXRSZWNvcmQgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25CZWZvcmVTaG93ICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25DYXRjaEFsbCAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25EZXN0cm95ICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25Gb2N1c0luICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25Gb2N1c091dCAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25IaWRlICAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25QYWludCAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25SZWFkT25seSAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25SZXNpemUgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25TaG93ICAgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhbmQgYXBwZW5kIHRoZSB1bmRlcmx5aW5nIHdpZGdldFxuICAgICAqL1xuICAgIG5nT25Jbml0KCk6IHZvaWQge1xuICAgICAgICBjb25zdFxuICAgICAgICAgICAgbWUgPSB0aGlzLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGVsZW1lbnRSZWYsXG4gICAgICAgICAgICAgICAgYnJ5bnR1bUNvbmZpZ1xuICAgICAgICAgICAgfSA9IG1lLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGluc3RhbmNlQ2xhc3MsXG4gICAgICAgICAgICAgICAgYnJ5bnR1bUNvbmZpZ3NcbiAgICAgICAgICAgIH0gPSBCcnludHVtVW5kb1JlZG9Db21wb25lbnQ7XG5cbiAgICAgICAgT2JqZWN0LmFzc2lnbihicnludHVtQ29uZmlnLCB7XG4gICAgICAgICAgICBsaXN0ZW5lcnMgOiB7XG4gICAgICAgICAgICAgICAgYmVmb3JlRGVzdHJveShldmVudCA6IGFueSkgeyBtZS5vbkJlZm9yZURlc3Ryb3kuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgYmVmb3JlSGlkZShldmVudCA6IGFueSkgeyBtZS5vbkJlZm9yZUhpZGUuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgYmVmb3JlU2V0UmVjb3JkKGV2ZW50IDogYW55KSB7IG1lLm9uQmVmb3JlU2V0UmVjb3JkLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGJlZm9yZVNob3coZXZlbnQgOiBhbnkpIHsgbWUub25CZWZvcmVTaG93LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGNhdGNoQWxsKGV2ZW50IDogYW55KSB7IG1lLm9uQ2F0Y2hBbGwuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgZGVzdHJveShldmVudCA6IGFueSkgeyBtZS5vbkRlc3Ryb3kuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgZm9jdXNJbihldmVudCA6IGFueSkgeyBtZS5vbkZvY3VzSW4uZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgZm9jdXNPdXQoZXZlbnQgOiBhbnkpIHsgbWUub25Gb2N1c091dC5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBoaWRlKGV2ZW50IDogYW55KSB7IG1lLm9uSGlkZS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBwYWludChldmVudCA6IGFueSkgeyBtZS5vblBhaW50LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIHJlYWRPbmx5KGV2ZW50IDogYW55KSB7IG1lLm9uUmVhZE9ubHkuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgcmVzaXplKGV2ZW50IDogYW55KSB7IG1lLm9uUmVzaXplLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIHNob3coZXZlbnQgOiBhbnkpIHsgbWUub25TaG93LmVtaXQoZXZlbnQpOyB9LFxuXG4gICAgICAgICAgICAgICAgdGhpc09iaiA6IG1lXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIElmIGNvbXBvbmVudCBoYXMgbm8gY29udGFpbmVyIHNwZWNpZmllZCBpbiBjb25maWcgdGhlbiB1c2UgYWRvcHQgdG8gV3JhcHBlcidzIGVsZW1lbnRcbiAgICAgICAgY29uc3RcbiAgICAgICAgICAgIGNvbnRhaW5lclBhcmFtID0gW1xuICAgICAgICAgICAgICAgICdhZG9wdCcsXG4gICAgICAgICAgICAgICAgJ2FwcGVuZFRvJyxcbiAgICAgICAgICAgICAgICAnaW5zZXJ0QWZ0ZXInLFxuICAgICAgICAgICAgICAgICdpbnNlcnRCZWZvcmUnXG4gICAgICAgICAgICBdLmZpbmQocHJvcCA9PiBicnludHVtQ29uZmlnW3Byb3BdKTtcbiAgICAgICAgaWYgKCFjb250YWluZXJQYXJhbSkge1xuICAgICAgICAgICAgYnJ5bnR1bUNvbmZpZy5hZG9wdCA9IGVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIFdyYXBwZXJIZWxwZXIuZGV2V2FybmluZ0NvbnRhaW5lcihpbnN0YW5jZUNsYXNzLiRuYW1lLCBjb250YWluZXJQYXJhbSk7XG4gICAgICAgIH1cblxuICAgICAgICBicnludHVtQ29uZmlncy5maWx0ZXIocHJvcCA9PiBwcm9wIGluIHRoaXMpLmZvckVhY2gocHJvcCA9PiB7XG4gICAgICAgICAgICBXcmFwcGVySGVscGVyLmFwcGx5UHJvcFZhbHVlKGJyeW50dW1Db25maWcsIHByb3AsIHRoaXNbcHJvcF0pO1xuICAgICAgICAgICAgaWYgKFsnZmVhdHVyZXMnLCAnY29uZmlnJ10uaW5jbHVkZXMocHJvcCkpIHtcbiAgICAgICAgICAgICAgICBXcmFwcGVySGVscGVyLmRldldhcm5pbmdDb25maWdQcm9wKGluc3RhbmNlQ2xhc3MuJG5hbWUsIHByb3ApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIG1lLmluc3RhbmNlID0gaW5zdGFuY2VDbGFzcy4kbmFtZSA9PT0gJ1dpZGdldCcgPyBXaWRnZXRIZWxwZXIuY3JlYXRlV2lkZ2V0KGJyeW50dW1Db25maWcpIDogbmV3IGluc3RhbmNlQ2xhc3MoYnJ5bnR1bUNvbmZpZyk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBXYXRjaCBmb3IgY2hhbmdlc1xuICAgICAqIEBwYXJhbSBjaGFuZ2VzXG4gICAgICovXG4gICAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgICAgICBjb25zdFxuICAgICAgICAgICAgeyBpbnN0YW5jZSB9ID0gdGhpcyxcbiAgICAgICAgICAgIHsgaW5zdGFuY2VDbGFzcyB9ID0gQnJ5bnR1bVVuZG9SZWRvQ29tcG9uZW50O1xuXG4gICAgICAgIGlmICghaW5zdGFuY2UpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEl0ZXJhdGUgb3ZlciBhbGwgY2hhbmdlc1xuICAgICAgICBPYmplY3QuZW50cmllcyhjaGFuZ2VzKS5mb3JFYWNoKChbcHJvcCwgY2hhbmdlXSkgPT4ge1xuICAgICAgICAgICAgY29uc3RcbiAgICAgICAgICAgICAgICBuZXdWYWx1ZSA9IChjaGFuZ2UgYXMgU2ltcGxlQ2hhbmdlKS5jdXJyZW50VmFsdWUsXG4gICAgICAgICAgICAgICAgeyBpbnN0YW5jZSB9ID0gdGhpcyxcbiAgICAgICAgICAgICAgICB7IGJyeW50dW1Db25maWdzT25seSwgYnJ5bnR1bVByb3BzIH0gPSBCcnludHVtVW5kb1JlZG9Db21wb25lbnQ7XG4gICAgICAgICAgICBpZiAoYnJ5bnR1bVByb3BzLmluY2x1ZGVzKHByb3ApKSB7XG4gICAgICAgICAgICAgICAgV3JhcHBlckhlbHBlci5hcHBseVByb3BWYWx1ZShpbnN0YW5jZSwgcHJvcCwgbmV3VmFsdWUsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICBpZiAoYnJ5bnR1bUNvbmZpZ3NPbmx5LmluY2x1ZGVzKHByb3ApKSB7XG4gICAgICAgICAgICAgICAgICAgIFdyYXBwZXJIZWxwZXIuZGV2V2FybmluZ1VwZGF0ZVByb3AoaW5zdGFuY2VDbGFzcy4kbmFtZSwgcHJvcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZXN0cm95IHRoZSBjb21wb25lbnRcbiAgICAgKi9cbiAgICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaW5zdGFuY2UpIHtcbiAgICAgICAgICAgIHRoaXMuaW5zdGFuY2UuZGVzdHJveSgpO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19