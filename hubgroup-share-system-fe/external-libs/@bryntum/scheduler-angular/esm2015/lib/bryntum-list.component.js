/**
 * Angular wrapper for Bryntum List
 */
import { Component, ElementRef, EventEmitter, Output, Input } from '@angular/core';
import WrapperHelper from './wrapper.helper';
// Bryntum 'scheduler.lite.umd' bundle comes without polyfills to support Angular's zone.js
import { Base, Widget } from '@bryntum/scheduler/scheduler.lite.umd.js';
import { List, WidgetHelper } from '@bryntum/scheduler/scheduler.lite.umd.js';
export class BryntumListComponent {
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
        const me = this, { elementRef, bryntumConfig } = me, { instanceClass, bryntumConfigs } = BryntumListComponent;
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
        const { instance } = this, { instanceClass } = BryntumListComponent;
        if (!instance) {
            return;
        }
        // Iterate over all changes
        Object.entries(changes).forEach(([prop, change]) => {
            const newValue = change.currentValue, { instance } = this, { bryntumConfigsOnly, bryntumProps } = BryntumListComponent;
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
BryntumListComponent.instanceClass = List;
BryntumListComponent.bryntumFeatureNames = [];
BryntumListComponent.bryntumConfigs = BryntumListComponent.bryntumFeatureNames.concat([
    'activateOnMouseover',
    'adopt',
    'align',
    'alignSelf',
    'allowGroupSelect',
    'anchor',
    'appendTo',
    'bubbleEvents',
    'centered',
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
BryntumListComponent.bryntumConfigsOnly = [
    'activateOnMouseover',
    'adopt',
    'align',
    'allowGroupSelect',
    'anchor',
    'appendTo',
    'bubbleEvents',
    'centered',
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
BryntumListComponent.bryntumProps = BryntumListComponent.bryntumFeatureNames.concat([
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
BryntumListComponent.decorators = [
    { type: Component, args: [{
                selector: 'bryntum-list',
                template: ''
            }] }
];
/** @nocollapse */
BryntumListComponent.ctorParameters = () => [
    { type: ElementRef }
];
BryntumListComponent.propDecorators = {
    activateOnMouseover: [{ type: Input }],
    adopt: [{ type: Input }],
    align: [{ type: Input }],
    allowGroupSelect: [{ type: Input }],
    anchor: [{ type: Input }],
    appendTo: [{ type: Input }],
    bubbleEvents: [{ type: Input }],
    centered: [{ type: Input }],
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJ5bnR1bS1saXN0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BicnludHVtL3NjaGVkdWxlci1hbmd1bGFyLyIsInNvdXJjZXMiOlsibGliL2JyeW50dW0tbGlzdC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0dBRUc7QUFFSCxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQXFCLE1BQU0sRUFBRSxLQUFLLEVBQStCLE1BQU0sZUFBZSxDQUFDO0FBQ25JLE9BQU8sYUFBYSxNQUFNLGtCQUFrQixDQUFDO0FBRTdDLDJGQUEyRjtBQUMzRixPQUFPLEVBQUUsSUFBSSxFQUEyRyxNQUFNLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQUNqTCxPQUFPLEVBQUUsSUFBSSxFQUFnQixZQUFZLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQU01RixNQUFNLE9BQU8sb0JBQW9CO0lBa0s3QixZQUFZLE9BQW1CO1FBUHZCLGtCQUFhLEdBQUc7WUFDcEIsZ0JBQWdCLEVBQUcsSUFBSTtZQUN2QixLQUFLLEVBQWMsU0FBUztZQUM1QixTQUFTLEVBQVUsRUFBRTtZQUNyQixRQUFRLEVBQVcsRUFBRTtTQUN4QixDQUFDO1FBZ0ZELFNBQVM7UUFDQSxvQkFBZSxHQUFHLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsaUJBQVksR0FBTSxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQzdDLGlCQUFZLEdBQU0sSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUM3QyxlQUFVLEdBQVEsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUM3QyxjQUFTLEdBQVMsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUM3QyxjQUFTLEdBQVMsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUM3QyxlQUFVLEdBQVEsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUM3QyxXQUFNLEdBQVksSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUM3QyxXQUFNLEdBQVksSUFBSSxZQUFZLEVBQVUsQ0FB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Szt5QkFDTCxLQUFLO3NCQUNMLEtBQUs7b0JBQ0wsS0FBSztnQkFDTCxLQUFLO2dCQUNMLEtBQUs7eUJBR0wsS0FBSzs4QkFHTCxNQUFNOzJCQUNOLE1BQU07MkJBQ04sTUFBTTt5QkFDTixNQUFNO3dCQUNOLE1BQU07d0JBQ04sTUFBTTt5QkFDTixNQUFNO3FCQUNOLE1BQU07cUJBQ04sTUFBTTtzQkFDTixNQUFNO3lCQUNOLE1BQU07dUJBQ04sTUFBTTtxQkFDTixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBBbmd1bGFyIHdyYXBwZXIgZm9yIEJyeW50dW0gTGlzdFxuICovXG5cbmltcG9ydCB7IENvbXBvbmVudCwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBPbkRlc3Ryb3ksIE9uSW5pdCwgT3V0cHV0LCBJbnB1dCwgU2ltcGxlQ2hhbmdlLCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgV3JhcHBlckhlbHBlciBmcm9tICcuL3dyYXBwZXIuaGVscGVyJztcblxuLy8gQnJ5bnR1bSAnc2NoZWR1bGVyLmxpdGUudW1kJyBidW5kbGUgY29tZXMgd2l0aG91dCBwb2x5ZmlsbHMgdG8gc3VwcG9ydCBBbmd1bGFyJ3Mgem9uZS5qc1xuaW1wb3J0IHsgQmFzZSwgQ29sbGVjdGlvbiwgQ29sbGVjdGlvbkNvbmZpZywgTWFzaywgTWFza0NvbmZpZywgUmVjdGFuZ2xlLCBTY3JvbGxlciwgU2Nyb2xsZXJDb25maWcsIFN0b3JlLCBTdG9yZUNvbmZpZywgV2lkZ2V0IH0gZnJvbSAnQGJyeW50dW0vc2NoZWR1bGVyL3NjaGVkdWxlci5saXRlLnVtZC5qcyc7XG5pbXBvcnQgeyBMaXN0LCBTdHJpbmdIZWxwZXIsIFdpZGdldEhlbHBlciB9IGZyb20gJ0BicnludHVtL3NjaGVkdWxlci9zY2hlZHVsZXIubGl0ZS51bWQuanMnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvciA6ICdicnludHVtLWxpc3QnLFxuICAgIHRlbXBsYXRlIDogJydcbn0pXG5leHBvcnQgY2xhc3MgQnJ5bnR1bUxpc3RDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG5cbiAgICBwdWJsaWMgc3RhdGljIGluc3RhbmNlQ2xhc3MgPSBMaXN0O1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bUZlYXR1cmVOYW1lczogc3RyaW5nW10gPSBbXG5cbiAgICBdO1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bUNvbmZpZ3M6IHN0cmluZ1tdID0gQnJ5bnR1bUxpc3RDb21wb25lbnQuYnJ5bnR1bUZlYXR1cmVOYW1lcy5jb25jYXQoW1xuICAgICAgICAnYWN0aXZhdGVPbk1vdXNlb3ZlcicsXG4gICAgICAgICdhZG9wdCcsXG4gICAgICAgICdhbGlnbicsXG4gICAgICAgICdhbGlnblNlbGYnLFxuICAgICAgICAnYWxsb3dHcm91cFNlbGVjdCcsXG4gICAgICAgICdhbmNob3InLFxuICAgICAgICAnYXBwZW5kVG8nLFxuICAgICAgICAnYnViYmxlRXZlbnRzJyxcbiAgICAgICAgJ2NlbnRlcmVkJyxcbiAgICAgICAgJ2NscycsXG4gICAgICAgICdjb25maWcnLFxuICAgICAgICAnY29uc3RyYWluVG8nLFxuICAgICAgICAnY29udGVudCcsXG4gICAgICAgICdjb250ZW50RWxlbWVudENscycsXG4gICAgICAgICdkYXRhc2V0JyxcbiAgICAgICAgJ2RlZmF1bHRCaW5kUHJvcGVydHknLFxuICAgICAgICAnZGlzYWJsZWQnLFxuICAgICAgICAnZG9jaycsXG4gICAgICAgICdkcmFnZ2FibGUnLFxuICAgICAgICAnZXh0cmFEYXRhJyxcbiAgICAgICAgJ2ZsZXgnLFxuICAgICAgICAnZmxvYXRpbmcnLFxuICAgICAgICAnZ3JvdXBIZWFkZXJUcGwnLFxuICAgICAgICAnaGVpZ2h0JyxcbiAgICAgICAgJ2hpZGRlbicsXG4gICAgICAgICdoaWRlQW5pbWF0aW9uJyxcbiAgICAgICAgJ2h0bWwnLFxuICAgICAgICAnaHRtbENscycsXG4gICAgICAgICdpZCcsXG4gICAgICAgICdpbnNlcnRCZWZvcmUnLFxuICAgICAgICAnaW5zZXJ0Rmlyc3QnLFxuICAgICAgICAnaXRlbXMnLFxuICAgICAgICAnaXRlbVRwbCcsXG4gICAgICAgICdsaXN0ZW5lcnMnLFxuICAgICAgICAnbG9jYWxlQ2xhc3MnLFxuICAgICAgICAnbG9jYWxpemFibGVQcm9wZXJ0aWVzJyxcbiAgICAgICAgJ21hcmdpbicsXG4gICAgICAgICdtYXNrRGVmYXVsdHMnLFxuICAgICAgICAnbWFza2VkJyxcbiAgICAgICAgJ21heEhlaWdodCcsXG4gICAgICAgICdtYXhXaWR0aCcsXG4gICAgICAgICdtaW5IZWlnaHQnLFxuICAgICAgICAnbWluV2lkdGgnLFxuICAgICAgICAnbW9uaXRvclJlc2l6ZScsXG4gICAgICAgICdtdWx0aVNlbGVjdCcsXG4gICAgICAgICdvd25lcicsXG4gICAgICAgICdwb3NpdGlvbmVkJyxcbiAgICAgICAgJ3ByZXZlbnRUb29sdGlwT25Ub3VjaCcsXG4gICAgICAgICdyZWFkT25seScsXG4gICAgICAgICdyaXBwbGUnLFxuICAgICAgICAncm9vdEVsZW1lbnQnLFxuICAgICAgICAnc2Nyb2xsYWJsZScsXG4gICAgICAgICdzY3JvbGxBY3Rpb24nLFxuICAgICAgICAnc2VsZWN0QWxsSXRlbScsXG4gICAgICAgICdzZWxlY3RlZCcsXG4gICAgICAgICdzaG93QW5pbWF0aW9uJyxcbiAgICAgICAgJ3N0b3JlJyxcbiAgICAgICAgJ3RhYicsXG4gICAgICAgICd0YWcnLFxuICAgICAgICAndGV4dEFsaWduJyxcbiAgICAgICAgJ3RpdGxlJyxcbiAgICAgICAgJ3RvZ2dsZUFsbElmQ3RybFByZXNzZWQnLFxuICAgICAgICAndG9vbHRpcCcsXG4gICAgICAgICd3ZWlnaHQnLFxuICAgICAgICAnd2lkdGgnLFxuICAgICAgICAneCcsXG4gICAgICAgICd5J1xuICAgIF0pO1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bUNvbmZpZ3NPbmx5OiBzdHJpbmdbXSA9IFtcbiAgICAgICAgJ2FjdGl2YXRlT25Nb3VzZW92ZXInLFxuICAgICAgICAnYWRvcHQnLFxuICAgICAgICAnYWxpZ24nLFxuICAgICAgICAnYWxsb3dHcm91cFNlbGVjdCcsXG4gICAgICAgICdhbmNob3InLFxuICAgICAgICAnYXBwZW5kVG8nLFxuICAgICAgICAnYnViYmxlRXZlbnRzJyxcbiAgICAgICAgJ2NlbnRlcmVkJyxcbiAgICAgICAgJ2NscycsXG4gICAgICAgICdjb25maWcnLFxuICAgICAgICAnY29uc3RyYWluVG8nLFxuICAgICAgICAnY29udGVudEVsZW1lbnRDbHMnLFxuICAgICAgICAnZGVmYXVsdEJpbmRQcm9wZXJ0eScsXG4gICAgICAgICdkb2NrJyxcbiAgICAgICAgJ2RyYWdnYWJsZScsXG4gICAgICAgICdmbG9hdGluZycsXG4gICAgICAgICdncm91cEhlYWRlclRwbCcsXG4gICAgICAgICdoaWRlQW5pbWF0aW9uJyxcbiAgICAgICAgJ2h0bWxDbHMnLFxuICAgICAgICAnaW5zZXJ0QmVmb3JlJyxcbiAgICAgICAgJ2luc2VydEZpcnN0JyxcbiAgICAgICAgJ2l0ZW1UcGwnLFxuICAgICAgICAnbGlzdGVuZXJzJyxcbiAgICAgICAgJ2xvY2FsZUNsYXNzJyxcbiAgICAgICAgJ2xvY2FsaXphYmxlUHJvcGVydGllcycsXG4gICAgICAgICdtYXNrRGVmYXVsdHMnLFxuICAgICAgICAnbWFza2VkJyxcbiAgICAgICAgJ21vbml0b3JSZXNpemUnLFxuICAgICAgICAnbXVsdGlTZWxlY3QnLFxuICAgICAgICAnb3duZXInLFxuICAgICAgICAncG9zaXRpb25lZCcsXG4gICAgICAgICdwcmV2ZW50VG9vbHRpcE9uVG91Y2gnLFxuICAgICAgICAncmlwcGxlJyxcbiAgICAgICAgJ3Jvb3RFbGVtZW50JyxcbiAgICAgICAgJ3Njcm9sbEFjdGlvbicsXG4gICAgICAgICdzZWxlY3RBbGxJdGVtJyxcbiAgICAgICAgJ3NlbGVjdGVkJyxcbiAgICAgICAgJ3Nob3dBbmltYXRpb24nLFxuICAgICAgICAnc3RvcmUnLFxuICAgICAgICAndGFiJyxcbiAgICAgICAgJ3RhZycsXG4gICAgICAgICd0ZXh0QWxpZ24nLFxuICAgICAgICAndGl0bGUnLFxuICAgICAgICAndG9nZ2xlQWxsSWZDdHJsUHJlc3NlZCcsXG4gICAgICAgICd3ZWlnaHQnXG4gICAgXTtcblxuICAgIHByaXZhdGUgc3RhdGljIGJyeW50dW1Qcm9wczogc3RyaW5nW10gPSBCcnludHVtTGlzdENvbXBvbmVudC5icnludHVtRmVhdHVyZU5hbWVzLmNvbmNhdChbXG4gICAgICAgICdhbGlnblNlbGYnLFxuICAgICAgICAnYW5jaG9yU2l6ZScsXG4gICAgICAgICdjb250ZW50JyxcbiAgICAgICAgJ2RhdGFzZXQnLFxuICAgICAgICAnZGlzYWJsZWQnLFxuICAgICAgICAnZXh0cmFEYXRhJyxcbiAgICAgICAgJ2ZsZXgnLFxuICAgICAgICAnaGVpZ2h0JyxcbiAgICAgICAgJ2hpZGRlbicsXG4gICAgICAgICdodG1sJyxcbiAgICAgICAgJ2lkJyxcbiAgICAgICAgJ2l0ZW1zJyxcbiAgICAgICAgJ21hcmdpbicsXG4gICAgICAgICdtYXhIZWlnaHQnLFxuICAgICAgICAnbWF4V2lkdGgnLFxuICAgICAgICAnbWluSGVpZ2h0JyxcbiAgICAgICAgJ21pbldpZHRoJyxcbiAgICAgICAgJ3JlYWRPbmx5JyxcbiAgICAgICAgJ3Njcm9sbGFibGUnLFxuICAgICAgICAndG9vbHRpcCcsXG4gICAgICAgICd3aWR0aCcsXG4gICAgICAgICd4JyxcbiAgICAgICAgJ3knXG4gICAgXSk7XG5cbiAgICBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY7XG4gICAgcHVibGljIGluc3RhbmNlOiBMaXN0O1xuXG4gICAgcHJpdmF0ZSBicnludHVtQ29uZmlnID0ge1xuICAgICAgICBhbmd1bGFyQ29tcG9uZW50IDogdGhpcyxcbiAgICAgICAgYWRvcHQgICAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgbGlzdGVuZXJzICAgICAgICA6IHt9LFxuICAgICAgICBmZWF0dXJlcyAgICAgICAgIDoge31cbiAgICB9O1xuXG4gICAgY29uc3RydWN0b3IoZWxlbWVudDogRWxlbWVudFJlZikge1xuICAgICAgICB0aGlzLmVsZW1lbnRSZWYgPSBlbGVtZW50O1xuICAgIH1cblxuICAgICAvLyBDb25maWdzIG9ubHlcbiAgICBASW5wdXQoKSBhY3RpdmF0ZU9uTW91c2VvdmVyICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBhZG9wdCAgICAgICAgICAgICAgICAgIDogSFRNTEVsZW1lbnR8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGFsaWduICAgICAgICAgICAgICAgICAgOiBvYmplY3R8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGFsbG93R3JvdXBTZWxlY3QgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGFuY2hvciAgICAgICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGFwcGVuZFRvICAgICAgICAgICAgICAgOiBIVE1MRWxlbWVudHxzdHJpbmc7XG4gICAgQElucHV0KCkgYnViYmxlRXZlbnRzICAgICAgICAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBjZW50ZXJlZCAgICAgICAgICAgICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBjbHMgICAgICAgICAgICAgICAgICAgIDogc3RyaW5nfG9iamVjdDtcbiAgICBASW5wdXQoKSBjb25maWcgICAgICAgICAgICAgICAgIDogb2JqZWN0O1xuICAgIEBJbnB1dCgpIGNvbnN0cmFpblRvICAgICAgICAgICAgOiBIVE1MRWxlbWVudHxXaWRnZXR8UmVjdGFuZ2xlO1xuICAgIEBJbnB1dCgpIGNvbnRlbnRFbGVtZW50Q2xzICAgICAgOiBzdHJpbmd8b2JqZWN0O1xuICAgIEBJbnB1dCgpIGRlZmF1bHRCaW5kUHJvcGVydHkgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgZG9jayAgICAgICAgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSBkcmFnZ2FibGUgICAgICAgICAgICAgIDogYm9vbGVhbnxvYmplY3Q7XG4gICAgQElucHV0KCkgZmxvYXRpbmcgICAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgZ3JvdXBIZWFkZXJUcGwgICAgICAgICA6IEZ1bmN0aW9uO1xuICAgIEBJbnB1dCgpIGhpZGVBbmltYXRpb24gICAgICAgICAgOiBib29sZWFufG9iamVjdDtcbiAgICBASW5wdXQoKSBodG1sQ2xzICAgICAgICAgICAgICAgIDogc3RyaW5nfG9iamVjdDtcbiAgICBASW5wdXQoKSBpbnNlcnRCZWZvcmUgICAgICAgICAgIDogSFRNTEVsZW1lbnR8c3RyaW5nO1xuICAgIEBJbnB1dCgpIGluc2VydEZpcnN0ICAgICAgICAgICAgOiBIVE1MRWxlbWVudHxzdHJpbmc7XG4gICAgQElucHV0KCkgaXRlbVRwbCAgICAgICAgICAgICAgICA6IEZ1bmN0aW9uO1xuICAgIEBJbnB1dCgpIGxpc3RlbmVycyAgICAgICAgICAgICAgOiBvYmplY3Q7XG4gICAgQElucHV0KCkgbG9jYWxlQ2xhc3MgICAgICAgICAgICA6IEJhc2U7XG4gICAgQElucHV0KCkgbG9jYWxpemFibGVQcm9wZXJ0aWVzICA6IHN0cmluZ1tdO1xuICAgIEBJbnB1dCgpIG1hc2tEZWZhdWx0cyAgICAgICAgICAgOiBvYmplY3R8TWFza3xQYXJ0aWFsPE1hc2tDb25maWc+O1xuICAgIEBJbnB1dCgpIG1hc2tlZCAgICAgICAgICAgICAgICAgOiBib29sZWFufHN0cmluZ3xvYmplY3R8TWFza3xQYXJ0aWFsPE1hc2tDb25maWc+O1xuICAgIEBJbnB1dCgpIG1vbml0b3JSZXNpemUgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIG11bHRpU2VsZWN0ICAgICAgICAgICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIG93bmVyICAgICAgICAgICAgICAgICAgOiBXaWRnZXQ7XG4gICAgQElucHV0KCkgcG9zaXRpb25lZCAgICAgICAgICAgICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgcHJldmVudFRvb2x0aXBPblRvdWNoICA6IGJvb2xlYW47XG4gICAgQElucHV0KCkgcmlwcGxlICAgICAgICAgICAgICAgICA6IGJvb2xlYW58b2JqZWN0O1xuICAgIEBJbnB1dCgpIHJvb3RFbGVtZW50ICAgICAgICAgICAgOiBTaGFkb3dSb290O1xuICAgIEBJbnB1dCgpIHNjcm9sbEFjdGlvbiAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgc2VsZWN0QWxsSXRlbSAgICAgICAgICA6IGJvb2xlYW58c3RyaW5nO1xuICAgIEBJbnB1dCgpIHNlbGVjdGVkICAgICAgICAgICAgICAgOiBDb2xsZWN0aW9ufG9iamVjdHxQYXJ0aWFsPENvbGxlY3Rpb25Db25maWc+O1xuICAgIEBJbnB1dCgpIHNob3dBbmltYXRpb24gICAgICAgICAgOiBib29sZWFufG9iamVjdDtcbiAgICBASW5wdXQoKSBzdG9yZSAgICAgICAgICAgICAgICAgIDogb2JqZWN0fFN0b3JlfFBhcnRpYWw8U3RvcmVDb25maWc+O1xuICAgIEBJbnB1dCgpIHRhYiAgICAgICAgICAgICAgICAgICAgOiBib29sZWFufG9iamVjdDtcbiAgICBASW5wdXQoKSB0YWcgICAgICAgICAgICAgICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIHRleHRBbGlnbiAgICAgICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgdGl0bGUgICAgICAgICAgICAgICAgICA6IHN0cmluZztcbiAgICBASW5wdXQoKSB0b2dnbGVBbGxJZkN0cmxQcmVzc2VkIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSB3ZWlnaHQgICAgICAgICAgICAgICAgIDogbnVtYmVyO1xuXG4gICAgIC8vIENvbmZpZ3MgYW5kIHByb3BlcnRpZXNcbiAgICBASW5wdXQoKSBhbGlnblNlbGYgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGNvbnRlbnQgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgZGF0YXNldCAgICA6IG9iamVjdDtcbiAgICBASW5wdXQoKSBkaXNhYmxlZCAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBleHRyYURhdGEgIDogYm9vbGVhbnxudW1iZXJ8b2JqZWN0fHN0cmluZztcbiAgICBASW5wdXQoKSBmbGV4ICAgICAgIDogbnVtYmVyfHN0cmluZztcbiAgICBASW5wdXQoKSBoZWlnaHQgICAgIDogbnVtYmVyfHN0cmluZztcbiAgICBASW5wdXQoKSBoaWRkZW4gICAgIDogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBodG1sICAgICAgIDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGlkICAgICAgICAgOiBzdHJpbmc7XG4gICAgQElucHV0KCkgaXRlbXMgICAgICA6IG9iamVjdFtdO1xuICAgIEBJbnB1dCgpIG1hcmdpbiAgICAgOiBudW1iZXJ8c3RyaW5nO1xuICAgIEBJbnB1dCgpIG1heEhlaWdodCAgOiBudW1iZXJ8c3RyaW5nO1xuICAgIEBJbnB1dCgpIG1heFdpZHRoICAgOiBudW1iZXJ8c3RyaW5nO1xuICAgIEBJbnB1dCgpIG1pbkhlaWdodCAgOiBudW1iZXJ8c3RyaW5nO1xuICAgIEBJbnB1dCgpIG1pbldpZHRoICAgOiBudW1iZXJ8c3RyaW5nO1xuICAgIEBJbnB1dCgpIHJlYWRPbmx5ICAgOiBib29sZWFuO1xuICAgIEBJbnB1dCgpIHNjcm9sbGFibGUgOiBib29sZWFufFNjcm9sbGVyfG9iamVjdHxQYXJ0aWFsPFNjcm9sbGVyQ29uZmlnPjtcbiAgICBASW5wdXQoKSB0b29sdGlwICAgIDogb2JqZWN0fHN0cmluZztcbiAgICBASW5wdXQoKSB3aWR0aCAgICAgIDogbnVtYmVyfHN0cmluZztcbiAgICBASW5wdXQoKSB4ICAgICAgICAgIDogbnVtYmVyO1xuICAgIEBJbnB1dCgpIHkgICAgICAgICAgOiBudW1iZXI7XG5cbiAgICAgLy8gUHJvcGVydGllcyBvbmx5XG4gICAgQElucHV0KCkgYW5jaG9yU2l6ZSA6IG51bWJlcltdO1xuXG4gICAgIC8vIEV2ZW50c1xuICAgIEBPdXRwdXQoKSBvbkJlZm9yZURlc3Ryb3kgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25CZWZvcmVIaWRlICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uQmVmb3JlU2hvdyAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkNhdGNoQWxsICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25EZXN0cm95ICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uRm9jdXNJbiAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvbkZvY3VzT3V0ICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25IaWRlICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uSXRlbSAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvblBhaW50ICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgICBAT3V0cHV0KCkgb25SZWFkT25seSAgICAgID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gICAgQE91dHB1dCgpIG9uUmVzaXplICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICAgIEBPdXRwdXQoKSBvblNob3cgICAgICAgICAgPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhbmQgYXBwZW5kIHRoZSB1bmRlcmx5aW5nIHdpZGdldFxuICAgICAqL1xuICAgIG5nT25Jbml0KCk6IHZvaWQge1xuICAgICAgICBjb25zdFxuICAgICAgICAgICAgbWUgPSB0aGlzLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGVsZW1lbnRSZWYsXG4gICAgICAgICAgICAgICAgYnJ5bnR1bUNvbmZpZ1xuICAgICAgICAgICAgfSA9IG1lLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGluc3RhbmNlQ2xhc3MsXG4gICAgICAgICAgICAgICAgYnJ5bnR1bUNvbmZpZ3NcbiAgICAgICAgICAgIH0gPSBCcnludHVtTGlzdENvbXBvbmVudDtcblxuICAgICAgICBPYmplY3QuYXNzaWduKGJyeW50dW1Db25maWcsIHtcbiAgICAgICAgICAgIGxpc3RlbmVycyA6IHtcbiAgICAgICAgICAgICAgICBiZWZvcmVEZXN0cm95KGV2ZW50IDogYW55KSB7IG1lLm9uQmVmb3JlRGVzdHJveS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBiZWZvcmVIaWRlKGV2ZW50IDogYW55KSB7IG1lLm9uQmVmb3JlSGlkZS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBiZWZvcmVTaG93KGV2ZW50IDogYW55KSB7IG1lLm9uQmVmb3JlU2hvdy5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBjYXRjaEFsbChldmVudCA6IGFueSkgeyBtZS5vbkNhdGNoQWxsLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGRlc3Ryb3koZXZlbnQgOiBhbnkpIHsgbWUub25EZXN0cm95LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGZvY3VzSW4oZXZlbnQgOiBhbnkpIHsgbWUub25Gb2N1c0luLmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIGZvY3VzT3V0KGV2ZW50IDogYW55KSB7IG1lLm9uRm9jdXNPdXQuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgaGlkZShldmVudCA6IGFueSkgeyBtZS5vbkhpZGUuZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgaXRlbShldmVudCA6IGFueSkgeyBtZS5vbkl0ZW0uZW1pdChldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgcGFpbnQoZXZlbnQgOiBhbnkpIHsgbWUub25QYWludC5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICByZWFkT25seShldmVudCA6IGFueSkgeyBtZS5vblJlYWRPbmx5LmVtaXQoZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgIHJlc2l6ZShldmVudCA6IGFueSkgeyBtZS5vblJlc2l6ZS5lbWl0KGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICBzaG93KGV2ZW50IDogYW55KSB7IG1lLm9uU2hvdy5lbWl0KGV2ZW50KTsgfSxcblxuICAgICAgICAgICAgICAgIHRoaXNPYmogOiBtZVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBJZiBjb21wb25lbnQgaGFzIG5vIGNvbnRhaW5lciBzcGVjaWZpZWQgaW4gY29uZmlnIHRoZW4gdXNlIGFkb3B0IHRvIFdyYXBwZXIncyBlbGVtZW50XG4gICAgICAgIGNvbnN0XG4gICAgICAgICAgICBjb250YWluZXJQYXJhbSA9IFtcbiAgICAgICAgICAgICAgICAnYWRvcHQnLFxuICAgICAgICAgICAgICAgICdhcHBlbmRUbycsXG4gICAgICAgICAgICAgICAgJ2luc2VydEFmdGVyJyxcbiAgICAgICAgICAgICAgICAnaW5zZXJ0QmVmb3JlJ1xuICAgICAgICAgICAgXS5maW5kKHByb3AgPT4gYnJ5bnR1bUNvbmZpZ1twcm9wXSk7XG4gICAgICAgIGlmICghY29udGFpbmVyUGFyYW0pIHtcbiAgICAgICAgICAgIGJyeW50dW1Db25maWcuYWRvcHQgPSBlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBXcmFwcGVySGVscGVyLmRldldhcm5pbmdDb250YWluZXIoaW5zdGFuY2VDbGFzcy4kbmFtZSwgY29udGFpbmVyUGFyYW0pO1xuICAgICAgICB9XG5cbiAgICAgICAgYnJ5bnR1bUNvbmZpZ3MuZmlsdGVyKHByb3AgPT4gcHJvcCBpbiB0aGlzKS5mb3JFYWNoKHByb3AgPT4ge1xuICAgICAgICAgICAgV3JhcHBlckhlbHBlci5hcHBseVByb3BWYWx1ZShicnludHVtQ29uZmlnLCBwcm9wLCB0aGlzW3Byb3BdKTtcbiAgICAgICAgICAgIGlmIChbJ2ZlYXR1cmVzJywgJ2NvbmZpZyddLmluY2x1ZGVzKHByb3ApKSB7XG4gICAgICAgICAgICAgICAgV3JhcHBlckhlbHBlci5kZXZXYXJuaW5nQ29uZmlnUHJvcChpbnN0YW5jZUNsYXNzLiRuYW1lLCBwcm9wKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBtZS5pbnN0YW5jZSA9IGluc3RhbmNlQ2xhc3MuJG5hbWUgPT09ICdXaWRnZXQnID8gV2lkZ2V0SGVscGVyLmNyZWF0ZVdpZGdldChicnludHVtQ29uZmlnKSA6IG5ldyBpbnN0YW5jZUNsYXNzKGJyeW50dW1Db25maWcpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogV2F0Y2ggZm9yIGNoYW5nZXNcbiAgICAgKiBAcGFyYW0gY2hhbmdlc1xuICAgICAqL1xuICAgIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICAgICAgY29uc3RcbiAgICAgICAgICAgIHsgaW5zdGFuY2UgfSA9IHRoaXMsXG4gICAgICAgICAgICB7IGluc3RhbmNlQ2xhc3MgfSA9IEJyeW50dW1MaXN0Q29tcG9uZW50O1xuXG4gICAgICAgIGlmICghaW5zdGFuY2UpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEl0ZXJhdGUgb3ZlciBhbGwgY2hhbmdlc1xuICAgICAgICBPYmplY3QuZW50cmllcyhjaGFuZ2VzKS5mb3JFYWNoKChbcHJvcCwgY2hhbmdlXSkgPT4ge1xuICAgICAgICAgICAgY29uc3RcbiAgICAgICAgICAgICAgICBuZXdWYWx1ZSA9IChjaGFuZ2UgYXMgU2ltcGxlQ2hhbmdlKS5jdXJyZW50VmFsdWUsXG4gICAgICAgICAgICAgICAgeyBpbnN0YW5jZSB9ID0gdGhpcyxcbiAgICAgICAgICAgICAgICB7IGJyeW50dW1Db25maWdzT25seSwgYnJ5bnR1bVByb3BzIH0gPSBCcnludHVtTGlzdENvbXBvbmVudDtcbiAgICAgICAgICAgIGlmIChicnludHVtUHJvcHMuaW5jbHVkZXMocHJvcCkpIHtcbiAgICAgICAgICAgICAgICBXcmFwcGVySGVscGVyLmFwcGx5UHJvcFZhbHVlKGluc3RhbmNlLCBwcm9wLCBuZXdWYWx1ZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIGlmIChicnludHVtQ29uZmlnc09ubHkuaW5jbHVkZXMocHJvcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgV3JhcHBlckhlbHBlci5kZXZXYXJuaW5nVXBkYXRlUHJvcChpbnN0YW5jZUNsYXNzLiRuYW1lLCBwcm9wKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERlc3Ryb3kgdGhlIGNvbXBvbmVudFxuICAgICAqL1xuICAgIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5pbnN0YW5jZSkge1xuICAgICAgICAgICAgdGhpcy5pbnN0YW5jZS5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=