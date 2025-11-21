/**
 * Angular wrapper for Bryntum ChipView
 */
import { Component, ElementRef, EventEmitter, Output, Input } from '@angular/core';
import WrapperHelper from './wrapper.helper';
// Bryntum 'scheduler.lite.umd' bundle comes without polyfills to support Angular's zone.js
import { Base, Widget } from '@bryntum/scheduler/scheduler.lite.umd.js';
import { ChipView, WidgetHelper } from '@bryntum/scheduler/scheduler.lite.umd.js';
export class BryntumChipViewComponent {
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
        this.onBeforeShow = new EventEmitter();
        this.onCatchAll = new EventEmitter();
        this.onDestroy = new EventEmitter();
        this.onFocusIn = new EventEmitter();
        this.onFocusOut = new EventEmitter();
        this.onHide = new EventEmitter();
        this.onItem = new EventEmitter();
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
        const me = this, { elementRef, bryntumConfig } = me, { instanceClass, bryntumConfigs } = BryntumChipViewComponent;
        Object.assign(bryntumConfig, {
            listeners: {
                beforeDestroy(event) { me.onBeforeDestroy.emit(event); },
                beforeHide(event) { me.onBeforeHide.emit(event); },
                beforeShow(event) { me.onBeforeShow.emit(event); },
                catchAll(event) { me.onCatchAll.emit(event); },
                destroy(event) { me.onDestroy.emit(event); },
                focusIn(event) { me.onFocusIn.emit(event); },
                focusOut(event) { me.onFocusOut.emit(event); },
                hide(event) { me.onHide.emit(event); },
                item(event) { me.onItem.emit(event); },
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
        const { instance } = this, { instanceClass } = BryntumChipViewComponent;
        if (!instance) {
            return;
        }
        // Iterate over all changes
        Object.entries(changes).forEach(([prop, change]) => {
            const newValue = change.currentValue, { instance } = this, { bryntumConfigsOnly, bryntumProps } = BryntumChipViewComponent;
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
BryntumChipViewComponent.instanceClass = ChipView;
BryntumChipViewComponent.bryntumFeatureNames = [];
BryntumChipViewComponent.bryntumConfigs = BryntumChipViewComponent.bryntumFeatureNames.concat([
    'activateOnMouseover',
    'adopt',
    'align',
    'alignSelf',
    'allowGroupSelect',
    'anchor',
    'appendTo',
    'bubbleEvents',
    'centered',
    'closable',
    'closeHandler',
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
    'extraData',
    'flex',
    'floating',
    'groupHeaderTpl',
    'height',
    'hidden',
    'hideAnimation',
    'html',
    'htmlCls',
    'iconTpl',
    'id',
    'insertBefore',
    'insertFirst',
    'items',
    'itemTpl',
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
    'multiSelect',
    'owner',
    'positioned',
    'preventTooltipOnTouch',
    'readOnly',
    'ripple',
    'rootElement',
    'scrollable',
    'scrollAction',
    'selectAllItem',
    'selected',
    'showAnimation',
    'store',
    'tab',
    'tag',
    'textAlign',
    'title',
    'toggleAllIfCtrlPressed',
    'tooltip',
    'weight',
    'width',
    'x',
    'y'
]);
BryntumChipViewComponent.bryntumConfigsOnly = [
    'activateOnMouseover',
    'adopt',
    'align',
    'allowGroupSelect',
    'anchor',
    'appendTo',
    'bubbleEvents',
    'centered',
    'closable',
    'closeHandler',
    'cls',
    'config',
    'constrainTo',
    'contentElementCls',
    'defaultBindProperty',
    'dock',
    'draggable',
    'floating',
    'groupHeaderTpl',
    'hideAnimation',
    'htmlCls',
    'iconTpl',
    'insertBefore',
    'insertFirst',
    'itemTpl',
    'listeners',
    'localeClass',
    'localizableProperties',
    'maskDefaults',
    'masked',
    'monitorResize',
    'multiSelect',
    'owner',
    'positioned',
    'preventTooltipOnTouch',
    'ripple',
    'rootElement',
    'scrollAction',
    'selectAllItem',
    'selected',
    'showAnimation',
    'store',
    'tab',
    'tag',
    'textAlign',
    'title',
    'toggleAllIfCtrlPressed',
    'weight'
];
BryntumChipViewComponent.bryntumProps = BryntumChipViewComponent.bryntumFeatureNames.concat([
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
    'items',
    'margin',
    'maxHeight',
    'maxWidth',
    'minHeight',
    'minWidth',
    'readOnly',
    'scrollable',
    'tooltip',
    'width',
    'x',
    'y'
]);
BryntumChipViewComponent.decorators = [
    { type: Component, args: [{
                selector: 'bryntum-chip-view',
                template: ''
            }] }
];
/** @nocollapse */
BryntumChipViewComponent.ctorParameters = () => [
    { type: ElementRef }
];
BryntumChipViewComponent.propDecorators = {
    activateOnMouseover: [{ type: Input }],
    adopt: [{ type: Input }],
    align: [{ type: Input }],
    allowGroupSelect: [{ type: Input }],
    anchor: [{ type: Input }],
    appendTo: [{ type: Input }],
    bubbleEvents: [{ type: Input }],
    centered: [{ type: Input }],
    closable: [{ type: Input }],
    closeHandler: [{ type: Input }],
    cls: [{ type: Input }],
    config: [{ type: Input }],
    constrainTo: [{ type: Input }],
    contentElementCls: [{ type: Input }],
    defaultBindProperty: [{ type: Input }],
    dock: [{ type: Input }],
    draggable: [{ type: Input }],
    floating: [{ type: Input }],
    groupHeaderTpl: [{ type: Input }],
    hideAnimation: [{ type: Input }],
    htmlCls: [{ type: Input }],
    iconTpl: [{ type: Input }],
    insertBefore: [{ type: Input }],
    insertFirst: [{ type: Input }],
    itemTpl: [{ type: Input }],
    listeners: [{ type: Input }],
    localeClass: [{ type: Input }],
    localizableProperties: [{ type: Input }],
    maskDefaults: [{ type: Input }],
    masked: [{ type: Input }],
    monitorResize: [{ type: Input }],
    multiSelect: [{ type: Input }],
    owner: [{ type: Input }],
    positioned: [{ type: Input }],
    preventTooltipOnTouch: [{ type: Input }],
    ripple: [{ type: Input }],
    rootElement: [{ type: Input }],
    scrollAction: [{ type: Input }],
    selectAllItem: [{ type: Input }],
    selected: [{ type: Input }],
    showAnimation: [{ type: Input }],
    store: [{ type: Input }],
    tab: [{ type: Input }],
    tag: [{ type: Input }],
    textAlign: [{ type: Input }],
    title: [{ type: Input }],
    toggleAllIfCtrlPressed: [{ type: Input }],
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
    onBeforeDestroy: [{ type: Output }],
    onBeforeHide: [{ type: Output }],
    onBeforeShow: [{ type: Output }],
    onCatchAll: [{ type: Output }],
    onDestroy: [{ type: Output }],
    onFocusIn: [{ type: Output }],
    onFocusOut: [{ type: Output }],
    onHide: [{ type: Output }],
    onItem: [{ type: Output }],
    onPaint: [{ type: Output }],
    onReadOnly: [{ type: Output }],
    onResize: [{ type: Output }],
    onShow: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJ5bnR1bS1jaGlwLXZpZXcuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGJyeW50dW0vc2NoZWR1bGVyLWFuZ3VsYXIvIiwic291cmNlcyI6WyJsaWIvYnJ5bnR1bS1jaGlwLXZpZXcuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztHQUVHO0FBRUgsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFxQixNQUFNLEVBQUUsS0FBSyxFQUErQixNQUFNLGVBQWUsQ0FBQztBQUNuSSxPQUFPLGFBQWEsTUFBTSxrQkFBa0IsQ0FBQztBQUU3QywyRkFBMkY7QUFDM0YsT0FBTyxFQUFFLElBQUksRUFBMkcsTUFBTSxFQUFFLE1BQU0sMENBQTBDLENBQUM7QUFDakwsT0FBTyxFQUFFLFFBQVEsRUFBZ0IsWUFBWSxFQUFFLE1BQU0sMENBQTBDLENBQUM7QUFNaEcsTUFBTSxPQUFPLHdCQUF3QjtJQXdLakMsWUFBWSxPQUFtQjtRQVB2QixrQkFBYSxHQUFHO1lBQ3BCLGdCQUFnQixFQUFHLElBQUk7WUFDdkIsS0FBSyxFQUFjLFNBQVM7WUFDNUIsU0FBUyxFQUFVLEVBQUU7WUFDckIsUUFBUSxFQUFXLEVBQUU7U0FDeEIsQ0FBQztRQW1GRCxTQUFTO1FBQ0Esb0JBQWUsR0FBRyxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQzdDLGlCQUFZLEdBQU0sSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUM3QyxpQkFBWSxHQUFNLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsZUFBVSxHQUFRLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsY0FBUyxHQUFTLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsY0FBUyxHQUFTLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsZUFBVSxHQUFRLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsV0FBTSxHQUFZLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsV0FBTSxHQUFZLElBQUksWUFB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Q0wsS0FBSzttQkFDTCxLQUFLO2lCQUNMLEtBQUs7b0JBQ0wsS0FBSztxQkFDTCxLQUFLO3dCQUNMLEtBQUs7dUJBQ0wsS0FBSzt3QkFDTCxLQUFLO3VCQUNMLEtBQUs7dUJBQ0wsS0FBSzt5QkFDTCxLQUFLO3NCQUNMLEtBQUs7b0JBQ0wsS0FBSztnQkFDTCxLQUFLO2dCQUNMLEtBQUs7eUJBR0wsS0FBSzs4QkFHTCxNQUFNOzJCQUNOLE1BQU07MkJBQ04sTUFBTTt5QkFDTixNQUFNO3dCQUNOLE1BQU07d0JBQ04sTUFBTTt5QkFDTixNQUFNO3FCQUNOLE1BQU07cUJBQ04sTUFBTTtzQkFDTixNQUFNO3lCQUNOLE1BQU07dUJBQ04sTUFBTTtxQkFDTixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBBbmd1bGFyIHdyYXBwZXIgZm9yIEJyeW50dW0gQ2hpcFZpZXdcbiAqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgT25EZXN0cm95LCBPbkluaXQsIE91dHB1dCwgSW5wdXQsIFNpbXBsZUNoYW5nZSwgU2ltcGxlQ2hhbmdlcyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IFdyYXBwZXJIZWxwZXIgZnJvbSAnLi93cmFwcGVyLmhlbHBlcic7XG5cbi8vIEJyeW50dW0gJ3NjaGVkdWxlci5saXRlLnVtZCcgYnVuZGxlIGNvbWVzIHdpdGhvdXQgcG9seWZpbGxzIHRvIHN1cHBvcnQgQW5ndWxhcidzIHpvbmUuanNcbmltcG9ydCB7IEJhc2UsIENvbGxlY3Rpb24sIENvbGxlY3Rpb25Db25maWcsIE1hc2ssIE1hc2tDb25maWcsIFJlY3RhbmdsZSwgU2Nyb2xsZXIsIFNjcm9sbGVyQ29uZmlnLCBTdG9yZSwgU3RvcmVDb25maWcsIFdpZGdldCB9IGZyb20gJ0BicnludHVtL3NjaGVkdWxlci9zY2hlZHVsZXIubGl0ZS51bWQuanMnO1xuaW1wb3J0IHsgQ2hpcFZpZXcsIFN0cmluZ0hlbHBlciwgV2lkZ2V0SGVscGVyIH0gZnJvbSAnQGJyeW50dW0vc2NoZWR1bGVyL3NjaGVkdWxlci5saXRlLnVtZC5qcyc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yIDogJ2JyeW50dW0tY2hpcC12aWV3JyxcbiAgICB0ZW1wbGF0ZSA6ICcnXG59KVxuZXhwb3J0IGNsYXNzIEJyeW50dW1DaGlwVmlld0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcblxuICAgIHB1YmxpYyBzdGF0aWMgaW5zdGFuY2VDbGFzcyA9IENoaXBWaWV3O1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bUZlYXR1cmVOYW1lczogc3RyaW5nW10gPSBbXG5cbiAgICBdO1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bUNvbmZpZ3M6IHN0cmluZ1tdID0gQnJ5bnR1bUNoaXBWaWV3Q29tcG9uZW50LmJyeW50dW1GZWF0dXJlTmFtZXMuY29uY2F0KFtcbiAgICAgICAgJ2FjdGl2YXRlT25Nb3VzZW92ZXInLFxuICAgICAgICAnYWRvcHQnLFxuICAgICAgICAnYWxpZ24nLFxuICAgICAgICAnYWxpZ25TZWxmJyxcbiAgICAgICAgJ2FsbG93R3JvdXBTZWxlY3QnLFxuICAgICAgICAnYW5jaG9yJyxcbiAgICAgICAgJ2FwcGVuZFRvJyxcbiAgICAgICAgJ2J1YmJsZUV2ZW50cycsXG4gICAgICAgICdjZW50ZXJlZCcsXG4gICAgICAgICdjbG9zYWJsZScsXG4gICAgICAgICdjbG9zZUhhbmRsZXInLFxuICAgICAgICAnY2xzJyxcbiAgICAgICAgJ2NvbmZpZycsXG4gICAgICAgICdjb25zdHJhaW5UbycsXG4gICAgICAgICdjb250ZW50JyxcbiAgICAgICAgJ2NvbnRlbnRFbGVtZW50Q2xzJyxcbiAgICAgICAgJ2RhdGFzZXQnLFxuICAgICAgICAnZGVmYXVsdEJpbmRQcm9wZXJ0eScsXG4gICAgICAgICdkaXNhYmxlZCcsXG4gICAgICAgICdkb2NrJyxcbiAgICAgICAgJ2RyYWdnYWJsZScsXG4gICAgICAgICdleHRyYURhdGEnLFxuICAgICAgICAnZmxleCcsXG4gICAgICAgICdmbG9hdGluZycsXG4gICAgICAgICdncm91cEhlYWRlclRwbCcsXG4gICAgICAgICdoZWlnaHQnLFxuICAgICAgICAnaGlkZGVuJyxcbiAgICAgICAgJ2hpZGVBbmltYXRpb24nLFxuICAgICAgICAnaHRtbCcsXG4gICAgICAgICdodG1sQ2xzJyxcbiAgICAgICAgJ2ljb25UcGwnLFxuICAgICAgICAnaWQnLFxuICAgICAgICAnaW5zZXJ0QmVmb3JlJyxcbiAgICAgICAgJ2luc2VydEZpcnN0JyxcbiAgICAgICAgJ2l0ZW1zJyxcbiAgICAgICAgJ2l0ZW1UcGwnLFxuICAgICAgICAnbGlzdGVuZXJzJyxcbiAgICAgICAgJ2xvY2FsZUNsYXNzJyxcbiAgICAgICAgJ2xvY2FsaXphYmxlUHJvcGVydGllcycsXG4gICAgICAgICdtYXJnaW4nLFxuICAgICAgICAnbWFza0RlZmF1bHRzJyxcbiAgICAgICAgJ21hc2tlZCcsXG4gICAgICAgICdtYXhIZWlnaHQnLFxuICAgICAgICAnbWF4V2lkdGgnLFxuICAgICAgICAnbWluSGVpZ2h0JyxcbiAgICAgICAgJ21pbldpZHRoJyxcbiAgICAgICAgJ21vbml0b3JSZXNpemUnLFxuICAgICAgICAnbXVsdGlTZWxlY3QnLFxuICAgICAgICAnb3duZXInLFxuICAgICAgICAncG9zaXRpb25lZCcsXG4gICAgICAgICdwcmV2ZW50VG9vbHRpcE9uVG91Y2gnLFxuICAgICAgICAncmVhZE9ubHknLFxuICAgICAgICAncmlwcGxlJyxcbiAgICAgICAgJ3Jvb3RFbGVtZW50JyxcbiAgICAgICAgJ3Njcm9sbGFibGUnLFxuICAgICAgICAnc2Nyb2xsQWN0aW9uJyxcbiAgICAgICAgJ3NlbGVjdEFsbEl0ZW0nLFxuICAgICAgICAnc2VsZWN0ZWQnLFxuICAgICAgICAnc2hvd0FuaW1hdGlvbicsXG4gICAgICAgICdzdG9yZScsXG4gICAgICAgICd0YWInLFxuICAgICAgICAndGFnJyxcbiAgICAgICAgJ3RleHRBbGlnbicsXG4gICAgICAgICd0aXRsZScsXG4gICAgICAgICd0b2dnbGVBbGxJZkN0cmxQcmVzc2VkJyxcbiAgICAgICAgJ3Rvb2x0aXAnLFxuICAgICAgICAnd2VpZ2h0JyxcbiAgICAgICAgJ3dpZHRoJyxcbiAgICAgICAgJ3gnLFxuICAgICAgICAneSdcbiAgICBdKTtcblxuICAgIHByaXZhdGUgc3RhdGljIGJyeW50dW1Db25maWdzT25seTogc3RyaW5nW10gPSBbXG4gICAgICAgICdhY3RpdmF0ZU9uTW91c2VvdmVyJyxcbiAgICAgICAgJ2Fkb3B0JyxcbiAgICAgICAgJ2FsaWduJyxcbiAgICAgICAgJ2FsbG93R3JvdXBTZWxlY3QnLFxuICAgICAgICAnYW5jaG9yJyxcbiAgICAgICAgJ2FwcGVuZFRvJyxcbiAgICAgICAgJ2J1YmJsZUV2ZW50cycsXG4gICAgICAgICdjZW50ZXJlZCcsXG4gICAgICAgICdjbG9zYWJsZScsXG4gICAgICAgICdjbG9zZUhhbmRsZXInLFxuICAgICAgICAnY2xzJyxcbiAgICAgICAgJ2NvbmZpZycsXG4gICAgICAgICdjb25zdHJhaW5UbycsXG4gICAgICAgICdjb250ZW50RWxlbWVudENscycsXG4gICAgICAgICdkZWZhdWx0QmluZFByb3BlcnR5JyxcbiAgICAgICAgJ2RvY2snLFxuICAgICAgICAnZHJhZ2dhYmxlJyxcbiAgICAgICAgJ2Zsb2F0aW5nJyxcbiAgICAgICAgJ2dyb3VwSGVhZGVyVHBsJyxcbiAgICAgICAgJ2hpZGVBbmltYXRpb24nLFxuICAgICAgICAnaHRtbENscycsXG4gICAgICAgICdpY29uVHBsJyxcbiAgICAgICAgJ2luc2VydEJlZm9yZScsXG4gICAgICAgICdpbnNlcnRGaXJzdCcsXG4gICAgICAgICdpdGVtVHBsJyxcbiAgICAgICAgJ2xpc3RlbmVycycsXG4gICAgICAgICdsb2NhbGVDbGFzcycsXG4gICAgICAgICdsb2NhbGl6YWJsZVByb3BlcnRpZXMnLFxuICAgICAgICAnbWFza0RlZmF1bHRzJyxcbiAgICAgICAgJ21hc2tlZCcsXG4gICAgICAgICdtb25pdG9yUmVzaXplJyxcbiAgICAgICAgJ211bHRpU2VsZWN0JyxcbiAgICAgICAgJ293bmVyJyxcbiAgICAgICAgJ3Bvc2l0aW9uZWQnLFxuICAgICAgICAncHJldmVudFRvb2x0aXBPblRvdWNoJyxcbiAgICAgICAgJ3JpcHBsZScsXG4gICAgICAgICdyb290RWxlbWVudCcsXG4gICAgICAgICdzY3JvbGxBY3Rpb24nLFxuICAgICAgICAnc2VsZWN0QWxsSXRlbScsXG4gICAgICAgICdzZWxlY3RlZCcsXG4gICAgICAgICdzaG93QW5pbWF0aW9uJyxcbiAgICAgICAgJ3N0b3JlJyxcbiAgICAgICAgJ3RhYicsXG4gICAgICAgICd0YWcnLFxuICAgICAgICAndGV4dEFsaWduJyxcbiAgICAgICAgJ3RpdGxlJyxcbiAgICAgICAgJ3RvZ2dsZUFsbElmQ3RybFByZXNzZWQnLFxuICAgICAgICAnd2VpZ2h0J1xuICAgIF07XG5cbiAgICBwcml2YXRlIHN0YXRpYyBicnludHVtUHJvcHM6IHN0cmluZ1tdID0gQnJ5bnR1bUNoaXBWaWV3Q29tcG9uZW50LmJyeW50dW1GZWF0dXJlTmFtZXMuY29uY2F0KFtcbiAgICAgICAgJ2FsaWduU2VsZicsXG4gICAgICAgICdhbmNob3JTaXplJyxcbiAgICAgICAgJ2NvbnRlbnQnLFxuICAgICAgICAnZGF0YXNldCcsXG4gICAgICAgICdkaXNhYmxlZCcsXG4gICAgICAgICdleHRyYURhdGEnLFxuICAgICAgICAnZmxleCcsXG4gICAgICAgICdoZWlnaHQnLFxuICAgICAgICAnaGlkZGVuJyxcbiAgICAgICAgJ2h0bWwnLFxuICAgICAgICAnaWQnLFxuICAgICAgICAnaXRlbXMnLFxuICAgICAgICAnbWFyZ2luJyxcbiAgICAgICAgJ21heEhlaWdodCcsXG4gICAgICAgICdtYXhXaWR0aCcsXG4gICAgICAgICdtaW5IZWlnaHQnLFxuICAgICAgICAnbWluV2lkdGgnLFxuICAgICAgICAncmVhZE9ubHknLFxuICAgICAgICAnc2Nyb2xsYWJsZScsXG4gICAgICAgICd0b29sdGlwJyxcbiAgICAgICAgJ3dpZHRoJyxcbiAgICAgICAgJ3gnLFxuICAgICAgICAneSdcbiAgICBdKTtcblxuICAgIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZjtcbiAgICBwdWJsaWMgaW5zdGFuY2U6IENoaXBWaWV3O1xuXG4gICAgcHJpdmF0ZSBicnludHVtQ29uZmlnID0ge1xuICAgICAgICBhbmd1bGFyQ29tcG9uZW50IDogdGhpcyxcbiAgICAgICAgYWRvcHQgICAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgbGlzdGVuZXJzICAgICAgICA6IHt9LFxuICAgICAgICBmZWF0dXJlcyAgICAgICAgIDoge31cbiAgICB9O1xuXG4gICAgY29uc3RydWN0b3IoZWxlbWVudDogRWxlbWVudFJlZikge1xuICAgICAgICB0aGlzLmVsZW1lbnRSZWYgPSBlbGVtZW50O1xuICAgIH1cblxuICAgICAvLyBDb25maWdzIG9ubHlcbiAgICBASW5wdXQoKSBhY3RpdmF0ZU9uTW91c2VvdmVyICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBhZG9wdCAgICAgICAgICAgICAgICAgIDogSFRNTEVsZW1lbnR8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGFsaWduICAgICAgICAgICAgICAgICAgOiBvYmplY3R8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGFsbG93R3JvdXBTZWxlY3QgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGFuY2hvciAgICAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGFwcGVuZFRvICAgICAgICAgICAgICAgOiBIVE1MRWxlbWVudHxzdHJpbmc7XG4gICAgQElucHV0KCkgYnViYmxlRXZlbnRzICAgICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBjZW50ZXJlZCAgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBjbG9zYWJsZSAgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBjbG9zZUhhbmRsZXIgICAgICAgICAgIDogc3RyaW5nfEZ1bmN0aW9uO1xuICAgIEBJbnB1dCgpIGNscyAgICAgICAgICAgICAgICAgICAgOiBzdHJpbmd8b2JqZWN0O1xuICAgIEBJbnB1dCgpIGNvbmZpZyAgICAgICAgICAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgY29uc3RyYWluVG8gICAgICAgICAgICA6IEhUTUxFbGVtZW50fFdpZGdldHxSZWN0YW5nbGU7XG4gICAgQElucHV0KCkgY29udGVudEVsZW1lbnRDbHMgICAgICA6IHN0cmluZ3xvYmplY3Q7XG4gICAgQElucHV0KCkgZGVmYXVsdEJpbmRQcm9wZXJ0eSAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBkb2NrICAgICAgICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGRyYWdnYWJsZSAgICAgICAgICAgICAgOiBib29sZWFufG9iamVjdDtcbiAgICBASW5wdXQoKSBmbG9hdGluZyAgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBncm91cEhlYWRlclRwbCAgICAgICAgIDogRnVuY3Rpb247XG4gICAgQElucHV0KCkgaGlkZUFuaW1hdGlvbiAgICAgICAgICA6IGJvb2xlYW58b2JqZWN0O1xuICAgIEBJbnB1dCgpIGh0bWxDbHMgICAgICAgICAgICAgICAgOiBzdHJpbmd8b2JqZWN0O1xuICAgIEBJbnB1dCgpIGljb25UcGwgICAgICAgICAgICAgICAgOiBGdW5jdGlvbjtcbiAgICBASW5wdXQoKSBpbnNlcnRCZWZvcmUgICAgICAgICAgIDogSFRNTEVsZW1lbnR8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGluc2VydEZpcnN0ICAgICAgICAgICAgOiBIVE1MRWxlbWVudHxzdHJpbmc7XG4gICAgQElucHV0KCkgaXRlbVRwbCAgICAgICAgICAgICAgICA6IEZ1bmN0aW9uO1xuICAgIEBJbnB1dCgpIGxpc3RlbmVycyAgICAgICAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgbG9jYWxlQ2xhc3MgICAgICAgICAgICA6IEJhc2U7XG4gICAgQElucHV0KCkgbG9jYWxpemFibGVQcm9wZXJ0aWVzICA6IHN0cmluZ1tdO1xuICAgIEBJbnB1dCgpIG1hc2tEZWZhdWx0cyAgICAgICAgICAgOiBvYmplY3R8TWFza3xQYXJ0aWFsPE1hc2tDb25maWc+O1xuICAgIEBJbnB1dCgpIG1hc2tlZCAgICAgICAgICAgICAgICAgOiBib29sZWFufHN0cmluZ3xvYmplY3R8TWFza3xQYXJ0aWFsPE1hc2tDb25maWc+O1xuICAgIEBJbnB1dCgpIG1vbml0b3JSZXNpemUgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIG11bHRpU2VsZWN0ICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIG93bmVyICAgICAgICAgICAgICAgICAgOiBXaWRnZXQ7XG4gICAgQElucHV0KCkgcG9zaXRpb25lZCAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgcHJldmVudFRvb2x0aXBPblRvdWNoICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgcmlwcGxlICAgICAgICAgICAgICAgICA6IGJvb2xlYW58b2JqZWN0O1xuICAgIEBJbnB1dCgpIHJvb3RFbGVtZW50ICAgICAgICAgICAgOiBTaGFkb3dSb290O1xuICAgIEBJbnB1dCgpIHNjcm9sbEFjdGlvbiAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgc2VsZWN0QWxsSXRlbSAgICAgICAgICA6IGJvb2xlYW58c3RyaW5nO1xuICAgIEBJbnB1dCgpIHNlbGVjdGVkICAgICAgICAgICAgICAgOiBDb2xsZWN0aW9ufG9iamVjdHxQYXJ0aWFsPENvbGxlY3Rpb25Db25maWc+O1xuICAgIEBJbnB1dCgpIHNob3dBbmltYXRpb24gICAgICAgICAgOiBib29sZWFufG9iamVjdDtcbiAgICBASW5wdXQoKSBzdG9yZSAgICAgICAgICAgICAgICAgIDogb2JqZWN0fFN0b3JlfFBhcnRpYWw8U3RvcmVDb25maWc+O1xuICAgIEBJbnB1dCgpIHRhYiAgICAgICAgICAgICAgICAgICAgOiBib29sZWFufG9iamVjdDtcbiAgICBASW5wdXQoKSB0YWcgICAgICAgICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIHRleHRBbGlnbiAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgdGl0bGUgICAgICAgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSB0b2dnbGVBbGxJZkN0cmxQcmVzc2VkIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSB3ZWlnaHQgICAgICAgICAgICAgICAgIDogbnVtYmVyO1xuXG4gICAgIC8vIENvbmZpZ3MgYW5kIHByb3BlcnRpZXNcbiAgICBASW5wdXQoKSBhbGlnblNlbGYgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGNvbnRlbnQgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgZGF0YXNldCAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBkaXNhYmxlZCAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBleHRyYURhdGEgIDogYm9vbGVhbnxudW1iZXJ8b2JqZWN0fHN0cmluZztcbiAgICBASW5wdXQoKSBmbGV4ICAgICAgIDogbnVtYmVyfHN0cmluZztcbiAgICBASW5wdXQoKSBoZWlnaHQgICAgIDogbnVtYmVyfHN0cmluZztcbiAgICBASW5wdXQoKSBoaWRkZW4gICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBodG1sICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGlkICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgaXRlbXMgICAgICA6IG9iamVjdFtdO1xuICAgIEBJbnB1dCgpIG1hcmdpbiAgICAgOiBudW1iZXJ8c3RyaW5nO1xuICAgIEBJbnB1dCgpIG1heEhlaWdodCAgOiBudW1iZXJ8c3RyaW5nO1xuICAgIEBJbnB1dCgpIG1heFdpZHRoICAgOiBudW1iZXJ8c3RyaW5nO1xuICAgIEBJbnB1dCgpIG1pbkhlaWdodCAgOiBudW1iZXJ8c3RyaW5nO1xuICAgIEBJbnB1dCgpIG1pbldpZHRoICAgOiBudW1iZXJ8c3RyaW5nO1xuICAgIEBJbnB1dCgpIHJlYWRPbmx5ICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHNjcm9sbGFibGUgOiBib29sZWFufFNjcm9sbGVyfG9iamVjdHxQYXJ0aWFsPFNjcm9sbGVyQ29uZmlnPjtcbiAgICBASW5wdXQoKSB0b29sdGlwICAgIDogb2JqZWN0fHN0cmluZztcbiAgICBASW5wdXQoKSB3aWR0aCAgICAgIDogbnVtYmVyfHN0cmluZztcbiAgICBASW5wdXQoKSB4ICAgICAgICAgIDogbnVtYmVyO1xuICAgIEBJbnB1dCgpIHkgICAgICAgICAgOiBudW1iZXI7XG5cbiAgICAgLy8gUHJvcGVydGllcyBvbmx5XG4gICAgQElucHV0KCkgYW5jaG9yU2l6ZSA6IG51bWJlcltdO1xuXG4gICAgIC8vIEV2ZW50c1xuICAgIEBPdXRwdXQoKSBvbkJlZm9yZURlc3Ryb3kgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25CZWZvcmVIaWRlICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uQmVmb3JlU2hvdyAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkNhdGNoQWxsICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25EZXN0cm95ICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uRm9jdXNJbiAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkZvY3VzT3V0ICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25IaWRlICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uSXRlbSAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvblBhaW50ICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25SZWFkT25seSAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uUmVzaXplICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvblNob3cgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhbmQgYXBwZW5kIHRoZSB1bmRlcmx5aW5nIHdpZGdldFxuICAgICAqL1xuICAgIG5nT25Jbml0KCk6IHZvaWQge1xuICAgICAgICBjb25zdFxuICAgICAgICAgICAgbWUgPSB0aGlzLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGVsZW1lbnRSZWYsXG4gICAgICAgICAgICAgICAgYnJ5bnR1bUNvbmZpZ1xuICAgICAgICAgICAgfSA9IG1lLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGluc3RhbmNlQ2xhc3MsXG4gICAgICAgICAgICAgICAgYnJ5bnR1bUNvbmZpZ3NcbiAgICAgICAgICAgIH0gPSBCcnludHVtQ2hpcFZpZXdDb21wb25lbnQ7XG5cbiAgICAgICAgT2JqZWN0LmFzc2lnbihicnludHVtQ29uZmlnLCB7XG4gICAgICAgICAgICBsaXN0ZW5lcnMgOiB7XG4gICAgICAgICAgICAgICAgYmVmb3JlRGVzdHJveShldmVudCA6IGFueSkgeyBtZS5vbkJlZm9yZURlc3Ryb3kuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgYmVmb3JlSGlkZShldmVudCA6IGFueSkgeyBtZS5vbkJlZm9yZUhpZGUuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgYmVmb3JlU2hvdyhldmVudCA6IGFueSkgeyBtZS5vbkJlZm9yZVNob3cuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgY2F0Y2hBbGwoZXZlbnQgOiBhbnkpIHsgbWUub25DYXRjaEFsbC5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBkZXN0cm95KGV2ZW50IDogYW55KSB7IG1lLm9uRGVzdHJveS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBmb2N1c0luKGV2ZW50IDogYW55KSB7IG1lLm9uRm9jdXNJbi5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBmb2N1c091dChldmVudCA6IGFueSkgeyBtZS5vbkZvY3VzT3V0LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGhpZGUoZXZlbnQgOiBhbnkpIHsgbWUub25IaWRlLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGl0ZW0oZXZlbnQgOiBhbnkpIHsgbWUub25JdGVtLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIHBhaW50KGV2ZW50IDogYW55KSB7IG1lLm9uUGFpbnQuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgcmVhZE9ubHkoZXZlbnQgOiBhbnkpIHsgbWUub25SZWFkT25seS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICByZXNpemUoZXZlbnQgOiBhbnkpIHsgbWUub25SZXNpemUuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgc2hvdyhldmVudCA6IGFueSkgeyBtZS5vblNob3cuZW1pdChldmVudCk7IH0sXG5cbiAgICAgICAgICAgICAgICB0aGlzT2JqIDogbWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gSWYgY29tcG9uZW50IGhhcyBubyBjb250YWluZXIgc3BlY2lmaWVkIGluIGNvbmZpZyB0aGVuIHVzZSBhZG9wdCB0byBXcmFwcGVyJ3MgZWxlbWVudFxuICAgICAgICBjb25zdFxuICAgICAgICAgICAgY29udGFpbmVyUGFyYW0gPSBbXG4gICAgICAgICAgICAgICAgJ2Fkb3B0JyxcbiAgICAgICAgICAgICAgICAnYXBwZW5kVG8nLFxuICAgICAgICAgICAgICAgICdpbnNlcnRBZnRlcicsXG4gICAgICAgICAgICAgICAgJ2luc2VydEJlZm9yZSdcbiAgICAgICAgICAgIF0uZmluZChwcm9wID0+IGJyeW50dW1Db25maWdbcHJvcF0pO1xuICAgICAgICBpZiAoIWNvbnRhaW5lclBhcmFtKSB7XG4gICAgICAgICAgICBicnludHVtQ29uZmlnLmFkb3B0ID0gZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgV3JhcHBlckhlbHBlci5kZXZXYXJuaW5nQ29udGFpbmVyKGluc3RhbmNlQ2xhc3MuJG5hbWUsIGNvbnRhaW5lclBhcmFtKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJyeW50dW1Db25maWdzLmZpbHRlcihwcm9wID0+IHByb3AgaW4gdGhpcykuZm9yRWFjaChwcm9wID0+IHtcbiAgICAgICAgICAgIFdyYXBwZXJIZWxwZXIuYXBwbHlQcm9wVmFsdWUoYnJ5bnR1bUNvbmZpZywgcHJvcCwgdGhpc1twcm9wXSk7XG4gICAgICAgICAgICBpZiAoWydmZWF0dXJlcycsICdjb25maWcnXS5pbmNsdWRlcyhwcm9wKSkge1xuICAgICAgICAgICAgICAgIFdyYXBwZXJIZWxwZXIuZGV2V2FybmluZ0NvbmZpZ1Byb3AoaW5zdGFuY2VDbGFzcy4kbmFtZSwgcHJvcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgbWUuaW5zdGFuY2UgPSBpbnN0YW5jZUNsYXNzLiRuYW1lID09PSAnV2lkZ2V0JyA/IFdpZGdldEhlbHBlci5jcmVhdGVXaWRnZXQoYnJ5bnR1bUNvbmZpZykgOiBuZXcgaW5zdGFuY2VDbGFzcyhicnludHVtQ29uZmlnKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFdhdGNoIGZvciBjaGFuZ2VzXG4gICAgICogQHBhcmFtIGNoYW5nZXNcbiAgICAgKi9cbiAgICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgICAgIGNvbnN0XG4gICAgICAgICAgICB7IGluc3RhbmNlIH0gPSB0aGlzLFxuICAgICAgICAgICAgeyBpbnN0YW5jZUNsYXNzIH0gPSBCcnludHVtQ2hpcFZpZXdDb21wb25lbnQ7XG5cbiAgICAgICAgaWYgKCFpbnN0YW5jZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSXRlcmF0ZSBvdmVyIGFsbCBjaGFuZ2VzXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKGNoYW5nZXMpLmZvckVhY2goKFtwcm9wLCBjaGFuZ2VdKSA9PiB7XG4gICAgICAgICAgICBjb25zdFxuICAgICAgICAgICAgICAgIG5ld1ZhbHVlID0gKGNoYW5nZSBhcyBTaW1wbGVDaGFuZ2UpLmN1cnJlbnRWYWx1ZSxcbiAgICAgICAgICAgICAgICB7IGluc3RhbmNlIH0gPSB0aGlzLFxuICAgICAgICAgICAgICAgIHsgYnJ5bnR1bUNvbmZpZ3NPbmx5LCBicnludHVtUHJvcHMgfSA9IEJyeW50dW1DaGlwVmlld0NvbXBvbmVudDtcbiAgICAgICAgICAgIGlmIChicnludHVtUHJvcHMuaW5jbHVkZXMocHJvcCkpIHtcbiAgICAgICAgICAgICAgICBXcmFwcGVySGVscGVyLmFwcGx5UHJvcFZhbHVlKGluc3RhbmNlLCBwcm9wLCBuZXdWYWx1ZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIGlmIChicnludHVtQ29uZmlnc09ubHkuaW5jbHVkZXMocHJvcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgV3JhcHBlckhlbHBlci5kZXZXYXJuaW5nVXBkYXRlUHJvcChpbnN0YW5jZUNsYXNzLiRuYW1lLCBwcm9wKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERlc3Ryb3kgdGhlIGNvbXBvbmVudFxuICAgICAqL1xuICAgIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5pbnN0YW5jZSkge1xuICAgICAgICAgICAgdGhpcy5pbnN0YW5jZS5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=