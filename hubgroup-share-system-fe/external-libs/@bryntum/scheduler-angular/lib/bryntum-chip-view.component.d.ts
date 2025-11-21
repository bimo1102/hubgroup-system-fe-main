/**
 * Angular wrapper for Bryntum ChipView
 */
import { ElementRef, EventEmitter, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Base, Collection, CollectionConfig, Mask, MaskConfig, Rectangle, Scroller, ScrollerConfig, Store, StoreConfig, Widget } from '@bryntum/scheduler/scheduler.lite.umd.js';
import { ChipView } from '@bryntum/scheduler/scheduler.lite.umd.js';
import * as ɵngcc0 from '@angular/core';
export declare class BryntumChipViewComponent implements OnInit, OnDestroy {
    static instanceClass: typeof ChipView;
    private static bryntumFeatureNames;
    private static bryntumConfigs;
    private static bryntumConfigsOnly;
    private static bryntumProps;
    private elementRef;
    instance: ChipView;
    private bryntumConfig;
    constructor(element: ElementRef);
    activateOnMouseover: boolean;
    adopt: HTMLElement | string;
    align: object | string;
    allowGroupSelect: boolean;
    anchor: boolean;
    appendTo: HTMLElement | string;
    bubbleEvents: object;
    centered: boolean;
    closable: boolean;
    closeHandler: string | Function;
    cls: string | object;
    config: object;
    constrainTo: HTMLElement | Widget | Rectangle;
    contentElementCls: string | object;
    defaultBindProperty: string;
    dock: string;
    draggable: boolean | object;
    floating: boolean;
    groupHeaderTpl: Function;
    hideAnimation: boolean | object;
    htmlCls: string | object;
    iconTpl: Function;
    insertBefore: HTMLElement | string;
    insertFirst: HTMLElement | string;
    itemTpl: Function;
    listeners: object;
    localeClass: Base;
    localizableProperties: string[];
    maskDefaults: object | Mask | Partial<MaskConfig>;
    masked: boolean | string | object | Mask | Partial<MaskConfig>;
    monitorResize: boolean;
    multiSelect: boolean;
    owner: Widget;
    positioned: boolean;
    preventTooltipOnTouch: boolean;
    ripple: boolean | object;
    rootElement: ShadowRoot;
    scrollAction: string;
    selectAllItem: boolean | string;
    selected: Collection | object | Partial<CollectionConfig>;
    showAnimation: boolean | object;
    store: object | Store | Partial<StoreConfig>;
    tab: boolean | object;
    tag: string;
    textAlign: string;
    title: string;
    toggleAllIfCtrlPressed: boolean;
    weight: number;
    alignSelf: string;
    content: string;
    dataset: object;
    disabled: boolean;
    extraData: boolean | number | object | string;
    flex: number | string;
    height: number | string;
    hidden: boolean;
    html: string;
    id: string;
    items: object[];
    margin: number | string;
    maxHeight: number | string;
    maxWidth: number | string;
    minHeight: number | string;
    minWidth: number | string;
    readOnly: boolean;
    scrollable: boolean | Scroller | object | Partial<ScrollerConfig>;
    tooltip: object | string;
    width: number | string;
    x: number;
    y: number;
    anchorSize: number[];
    onBeforeDestroy: EventEmitter<object>;
    onBeforeHide: EventEmitter<object>;
    onBeforeShow: EventEmitter<object>;
    onCatchAll: EventEmitter<object>;
    onDestroy: EventEmitter<object>;
    onFocusIn: EventEmitter<object>;
    onFocusOut: EventEmitter<object>;
    onHide: EventEmitter<object>;
    onItem: EventEmitter<object>;
    onPaint: EventEmitter<object>;
    onReadOnly: EventEmitter<object>;
    onResize: EventEmitter<object>;
    onShow: EventEmitter<object>;
    /**
     * Create and append the underlying widget
     */
    ngOnInit(): void;
    /**
     * Watch for changes
     * @param changes
     */
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * Destroy the component
     */
    ngOnDestroy(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<BryntumChipViewComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<BryntumChipViewComponent, "bryntum-chip-view", never, { "activateOnMouseover": "activateOnMouseover"; "adopt": "adopt"; "align": "align"; "allowGroupSelect": "allowGroupSelect"; "anchor": "anchor"; "appendTo": "appendTo"; "bubbleEvents": "bubbleEvents"; "centered": "centered"; "closable": "closable"; "closeHandler": "closeHandler"; "cls": "cls"; "config": "config"; "constrainTo": "constrainTo"; "contentElementCls": "contentElementCls"; "defaultBindProperty": "defaultBindProperty"; "dock": "dock"; "draggable": "draggable"; "floating": "floating"; "groupHeaderTpl": "groupHeaderTpl"; "hideAnimation": "hideAnimation"; "htmlCls": "htmlCls"; "iconTpl": "iconTpl"; "insertBefore": "insertBefore"; "insertFirst": "insertFirst"; "itemTpl": "itemTpl"; "listeners": "listeners"; "localeClass": "localeClass"; "localizableProperties": "localizableProperties"; "maskDefaults": "maskDefaults"; "masked": "masked"; "monitorResize": "monitorResize"; "multiSelect": "multiSelect"; "owner": "owner"; "positioned": "positioned"; "preventTooltipOnTouch": "preventTooltipOnTouch"; "ripple": "ripple"; "rootElement": "rootElement"; "scrollAction": "scrollAction"; "selectAllItem": "selectAllItem"; "selected": "selected"; "showAnimation": "showAnimation"; "store": "store"; "tab": "tab"; "tag": "tag"; "textAlign": "textAlign"; "title": "title"; "toggleAllIfCtrlPressed": "toggleAllIfCtrlPressed"; "weight": "weight"; "alignSelf": "alignSelf"; "content": "content"; "dataset": "dataset"; "disabled": "disabled"; "extraData": "extraData"; "flex": "flex"; "height": "height"; "hidden": "hidden"; "html": "html"; "id": "id"; "items": "items"; "margin": "margin"; "maxHeight": "maxHeight"; "maxWidth": "maxWidth"; "minHeight": "minHeight"; "minWidth": "minWidth"; "readOnly": "readOnly"; "scrollable": "scrollable"; "tooltip": "tooltip"; "width": "width"; "x": "x"; "y": "y"; "anchorSize": "anchorSize"; }, { "onBeforeDestroy": "onBeforeDestroy"; "onBeforeHide": "onBeforeHide"; "onBeforeShow": "onBeforeShow"; "onCatchAll": "onCatchAll"; "onDestroy": "onDestroy"; "onFocusIn": "onFocusIn"; "onFocusOut": "onFocusOut"; "onHide": "onHide"; "onItem": "onItem"; "onPaint": "onPaint"; "onReadOnly": "onReadOnly"; "onResize": "onResize"; "onShow": "onShow"; }, never, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJ5bnR1bS1jaGlwLXZpZXcuY29tcG9uZW50LmQudHMiLCJzb3VyY2VzIjpbImJyeW50dW0tY2hpcC12aWV3LmNvbXBvbmVudC5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQW5ndWxhciB3cmFwcGVyIGZvciBCcnludHVtIENoaXBWaWV3XG4gKi9cbmltcG9ydCB7IEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgT25EZXN0cm95LCBPbkluaXQsIFNpbXBsZUNoYW5nZXMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJhc2UsIENvbGxlY3Rpb24sIENvbGxlY3Rpb25Db25maWcsIE1hc2ssIE1hc2tDb25maWcsIFJlY3RhbmdsZSwgU2Nyb2xsZXIsIFNjcm9sbGVyQ29uZmlnLCBTdG9yZSwgU3RvcmVDb25maWcsIFdpZGdldCB9IGZyb20gJ0BicnludHVtL3NjaGVkdWxlci9zY2hlZHVsZXIubGl0ZS51bWQuanMnO1xuaW1wb3J0IHsgQ2hpcFZpZXcgfSBmcm9tICdAYnJ5bnR1bS9zY2hlZHVsZXIvc2NoZWR1bGVyLmxpdGUudW1kLmpzJztcbmV4cG9ydCBkZWNsYXJlIGNsYXNzIEJyeW50dW1DaGlwVmlld0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgICBzdGF0aWMgaW5zdGFuY2VDbGFzczogdHlwZW9mIENoaXBWaWV3O1xuICAgIHByaXZhdGUgc3RhdGljIGJyeW50dW1GZWF0dXJlTmFtZXM7XG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bUNvbmZpZ3M7XG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bUNvbmZpZ3NPbmx5O1xuICAgIHByaXZhdGUgc3RhdGljIGJyeW50dW1Qcm9wcztcbiAgICBwcml2YXRlIGVsZW1lbnRSZWY7XG4gICAgaW5zdGFuY2U6IENoaXBWaWV3O1xuICAgIHByaXZhdGUgYnJ5bnR1bUNvbmZpZztcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50OiBFbGVtZW50UmVmKTtcbiAgICBhY3RpdmF0ZU9uTW91c2VvdmVyOiBib29sZWFuO1xuICAgIGFkb3B0OiBIVE1MRWxlbWVudCB8IHN0cmluZztcbiAgICBhbGlnbjogb2JqZWN0IHwgc3RyaW5nO1xuICAgIGFsbG93R3JvdXBTZWxlY3Q6IGJvb2xlYW47XG4gICAgYW5jaG9yOiBib29sZWFuO1xuICAgIGFwcGVuZFRvOiBIVE1MRWxlbWVudCB8IHN0cmluZztcbiAgICBidWJibGVFdmVudHM6IG9iamVjdDtcbiAgICBjZW50ZXJlZDogYm9vbGVhbjtcbiAgICBjbG9zYWJsZTogYm9vbGVhbjtcbiAgICBjbG9zZUhhbmRsZXI6IHN0cmluZyB8IEZ1bmN0aW9uO1xuICAgIGNsczogc3RyaW5nIHwgb2JqZWN0O1xuICAgIGNvbmZpZzogb2JqZWN0O1xuICAgIGNvbnN0cmFpblRvOiBIVE1MRWxlbWVudCB8IFdpZGdldCB8IFJlY3RhbmdsZTtcbiAgICBjb250ZW50RWxlbWVudENsczogc3RyaW5nIHwgb2JqZWN0O1xuICAgIGRlZmF1bHRCaW5kUHJvcGVydHk6IHN0cmluZztcbiAgICBkb2NrOiBzdHJpbmc7XG4gICAgZHJhZ2dhYmxlOiBib29sZWFuIHwgb2JqZWN0O1xuICAgIGZsb2F0aW5nOiBib29sZWFuO1xuICAgIGdyb3VwSGVhZGVyVHBsOiBGdW5jdGlvbjtcbiAgICBoaWRlQW5pbWF0aW9uOiBib29sZWFuIHwgb2JqZWN0O1xuICAgIGh0bWxDbHM6IHN0cmluZyB8IG9iamVjdDtcbiAgICBpY29uVHBsOiBGdW5jdGlvbjtcbiAgICBpbnNlcnRCZWZvcmU6IEhUTUxFbGVtZW50IHwgc3RyaW5nO1xuICAgIGluc2VydEZpcnN0OiBIVE1MRWxlbWVudCB8IHN0cmluZztcbiAgICBpdGVtVHBsOiBGdW5jdGlvbjtcbiAgICBsaXN0ZW5lcnM6IG9iamVjdDtcbiAgICBsb2NhbGVDbGFzczogQmFzZTtcbiAgICBsb2NhbGl6YWJsZVByb3BlcnRpZXM6IHN0cmluZ1tdO1xuICAgIG1hc2tEZWZhdWx0czogb2JqZWN0IHwgTWFzayB8IFBhcnRpYWw8TWFza0NvbmZpZz47XG4gICAgbWFza2VkOiBib29sZWFuIHwgc3RyaW5nIHwgb2JqZWN0IHwgTWFzayB8IFBhcnRpYWw8TWFza0NvbmZpZz47XG4gICAgbW9uaXRvclJlc2l6ZTogYm9vbGVhbjtcbiAgICBtdWx0aVNlbGVjdDogYm9vbGVhbjtcbiAgICBvd25lcjogV2lkZ2V0O1xuICAgIHBvc2l0aW9uZWQ6IGJvb2xlYW47XG4gICAgcHJldmVudFRvb2x0aXBPblRvdWNoOiBib29sZWFuO1xuICAgIHJpcHBsZTogYm9vbGVhbiB8IG9iamVjdDtcbiAgICByb290RWxlbWVudDogU2hhZG93Um9vdDtcbiAgICBzY3JvbGxBY3Rpb246IHN0cmluZztcbiAgICBzZWxlY3RBbGxJdGVtOiBib29sZWFuIHwgc3RyaW5nO1xuICAgIHNlbGVjdGVkOiBDb2xsZWN0aW9uIHwgb2JqZWN0IHwgUGFydGlhbDxDb2xsZWN0aW9uQ29uZmlnPjtcbiAgICBzaG93QW5pbWF0aW9uOiBib29sZWFuIHwgb2JqZWN0O1xuICAgIHN0b3JlOiBvYmplY3QgfCBTdG9yZSB8IFBhcnRpYWw8U3RvcmVDb25maWc+O1xuICAgIHRhYjogYm9vbGVhbiB8IG9iamVjdDtcbiAgICB0YWc6IHN0cmluZztcbiAgICB0ZXh0QWxpZ246IHN0cmluZztcbiAgICB0aXRsZTogc3RyaW5nO1xuICAgIHRvZ2dsZUFsbElmQ3RybFByZXNzZWQ6IGJvb2xlYW47XG4gICAgd2VpZ2h0OiBudW1iZXI7XG4gICAgYWxpZ25TZWxmOiBzdHJpbmc7XG4gICAgY29udGVudDogc3RyaW5nO1xuICAgIGRhdGFzZXQ6IG9iamVjdDtcbiAgICBkaXNhYmxlZDogYm9vbGVhbjtcbiAgICBleHRyYURhdGE6IGJvb2xlYW4gfCBudW1iZXIgfCBvYmplY3QgfCBzdHJpbmc7XG4gICAgZmxleDogbnVtYmVyIHwgc3RyaW5nO1xuICAgIGhlaWdodDogbnVtYmVyIHwgc3RyaW5nO1xuICAgIGhpZGRlbjogYm9vbGVhbjtcbiAgICBodG1sOiBzdHJpbmc7XG4gICAgaWQ6IHN0cmluZztcbiAgICBpdGVtczogb2JqZWN0W107XG4gICAgbWFyZ2luOiBudW1iZXIgfCBzdHJpbmc7XG4gICAgbWF4SGVpZ2h0OiBudW1iZXIgfCBzdHJpbmc7XG4gICAgbWF4V2lkdGg6IG51bWJlciB8IHN0cmluZztcbiAgICBtaW5IZWlnaHQ6IG51bWJlciB8IHN0cmluZztcbiAgICBtaW5XaWR0aDogbnVtYmVyIHwgc3RyaW5nO1xuICAgIHJlYWRPbmx5OiBib29sZWFuO1xuICAgIHNjcm9sbGFibGU6IGJvb2xlYW4gfCBTY3JvbGxlciB8IG9iamVjdCB8IFBhcnRpYWw8U2Nyb2xsZXJDb25maWc+O1xuICAgIHRvb2x0aXA6IG9iamVjdCB8IHN0cmluZztcbiAgICB3aWR0aDogbnVtYmVyIHwgc3RyaW5nO1xuICAgIHg6IG51bWJlcjtcbiAgICB5OiBudW1iZXI7XG4gICAgYW5jaG9yU2l6ZTogbnVtYmVyW107XG4gICAgb25CZWZvcmVEZXN0cm95OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbkJlZm9yZUhpZGU6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uQmVmb3JlU2hvdzogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25DYXRjaEFsbDogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25EZXN0cm95OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbkZvY3VzSW46IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uRm9jdXNPdXQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uSGlkZTogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25JdGVtOiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvblBhaW50OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvblJlYWRPbmx5OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvblJlc2l6ZTogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25TaG93OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYW5kIGFwcGVuZCB0aGUgdW5kZXJseWluZyB3aWRnZXRcbiAgICAgKi9cbiAgICBuZ09uSW5pdCgpOiB2b2lkO1xuICAgIC8qKlxuICAgICAqIFdhdGNoIGZvciBjaGFuZ2VzXG4gICAgICogQHBhcmFtIGNoYW5nZXNcbiAgICAgKi9cbiAgICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZDtcbiAgICAvKipcbiAgICAgKiBEZXN0cm95IHRoZSBjb21wb25lbnRcbiAgICAgKi9cbiAgICBuZ09uRGVzdHJveSgpOiB2b2lkO1xufVxuIl19