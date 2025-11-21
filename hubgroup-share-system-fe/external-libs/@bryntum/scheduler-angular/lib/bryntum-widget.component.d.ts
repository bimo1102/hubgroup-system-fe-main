/**
 * Angular wrapper for Bryntum Widget
 */
import { ElementRef, EventEmitter, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Base, Mask, MaskConfig, Rectangle, Scroller, ScrollerConfig } from '@bryntum/scheduler/scheduler.lite.umd.js';
import { Widget } from '@bryntum/scheduler/scheduler.lite.umd.js';
import * as ɵngcc0 from '@angular/core';
export declare class BryntumWidgetComponent implements OnInit, OnDestroy {
    static instanceClass: typeof Widget;
    private static bryntumFeatureNames;
    private static bryntumConfigs;
    private static bryntumConfigsOnly;
    private static bryntumProps;
    private elementRef;
    instance: Widget;
    private bryntumConfig;
    constructor(element: ElementRef);
    adopt: HTMLElement | string;
    align: object | string;
    anchor: boolean;
    appendTo: HTMLElement | string;
    bubbleEvents: object;
    centered: boolean;
    cls: string | object;
    config: object;
    constrainTo: HTMLElement | Widget | Rectangle;
    contentElementCls: string | object;
    defaultBindProperty: string;
    dock: string;
    draggable: boolean | object;
    floating: boolean;
    hideAnimation: boolean | object;
    htmlCls: string | object;
    insertBefore: HTMLElement | string;
    insertFirst: HTMLElement | string;
    listeners: object;
    localeClass: Base;
    localizableProperties: string[];
    maskDefaults: object | Mask | Partial<MaskConfig>;
    masked: boolean | string | object | Mask | Partial<MaskConfig>;
    monitorResize: boolean;
    owner: Widget;
    positioned: boolean;
    preventTooltipOnTouch: boolean;
    ripple: boolean | object;
    rootElement: ShadowRoot;
    scrollAction: string;
    showAnimation: boolean | object;
    tab: boolean | object;
    tag: string;
    textAlign: string;
    title: string;
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
    static ɵfac: ɵngcc0.ɵɵFactoryDef<BryntumWidgetComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<BryntumWidgetComponent, "bryntum-widget", never, { "adopt": "adopt"; "align": "align"; "anchor": "anchor"; "appendTo": "appendTo"; "bubbleEvents": "bubbleEvents"; "centered": "centered"; "cls": "cls"; "config": "config"; "constrainTo": "constrainTo"; "contentElementCls": "contentElementCls"; "defaultBindProperty": "defaultBindProperty"; "dock": "dock"; "draggable": "draggable"; "floating": "floating"; "hideAnimation": "hideAnimation"; "htmlCls": "htmlCls"; "insertBefore": "insertBefore"; "insertFirst": "insertFirst"; "listeners": "listeners"; "localeClass": "localeClass"; "localizableProperties": "localizableProperties"; "maskDefaults": "maskDefaults"; "masked": "masked"; "monitorResize": "monitorResize"; "owner": "owner"; "positioned": "positioned"; "preventTooltipOnTouch": "preventTooltipOnTouch"; "ripple": "ripple"; "rootElement": "rootElement"; "scrollAction": "scrollAction"; "showAnimation": "showAnimation"; "tab": "tab"; "tag": "tag"; "textAlign": "textAlign"; "title": "title"; "weight": "weight"; "alignSelf": "alignSelf"; "content": "content"; "dataset": "dataset"; "disabled": "disabled"; "extraData": "extraData"; "flex": "flex"; "height": "height"; "hidden": "hidden"; "html": "html"; "id": "id"; "margin": "margin"; "maxHeight": "maxHeight"; "maxWidth": "maxWidth"; "minHeight": "minHeight"; "minWidth": "minWidth"; "readOnly": "readOnly"; "scrollable": "scrollable"; "tooltip": "tooltip"; "width": "width"; "x": "x"; "y": "y"; "anchorSize": "anchorSize"; }, { "onBeforeDestroy": "onBeforeDestroy"; "onBeforeHide": "onBeforeHide"; "onBeforeShow": "onBeforeShow"; "onCatchAll": "onCatchAll"; "onDestroy": "onDestroy"; "onFocusIn": "onFocusIn"; "onFocusOut": "onFocusOut"; "onHide": "onHide"; "onPaint": "onPaint"; "onReadOnly": "onReadOnly"; "onResize": "onResize"; "onShow": "onShow"; }, never, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJ5bnR1bS13aWRnZXQuY29tcG9uZW50LmQudHMiLCJzb3VyY2VzIjpbImJyeW50dW0td2lkZ2V0LmNvbXBvbmVudC5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBBbmd1bGFyIHdyYXBwZXIgZm9yIEJyeW50dW0gV2lkZ2V0XG4gKi9cbmltcG9ydCB7IEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgT25EZXN0cm95LCBPbkluaXQsIFNpbXBsZUNoYW5nZXMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJhc2UsIE1hc2ssIE1hc2tDb25maWcsIFJlY3RhbmdsZSwgU2Nyb2xsZXIsIFNjcm9sbGVyQ29uZmlnIH0gZnJvbSAnQGJyeW50dW0vc2NoZWR1bGVyL3NjaGVkdWxlci5saXRlLnVtZC5qcyc7XG5pbXBvcnQgeyBXaWRnZXQgfSBmcm9tICdAYnJ5bnR1bS9zY2hlZHVsZXIvc2NoZWR1bGVyLmxpdGUudW1kLmpzJztcbmV4cG9ydCBkZWNsYXJlIGNsYXNzIEJyeW50dW1XaWRnZXRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gICAgc3RhdGljIGluc3RhbmNlQ2xhc3M6IHR5cGVvZiBXaWRnZXQ7XG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bUZlYXR1cmVOYW1lcztcbiAgICBwcml2YXRlIHN0YXRpYyBicnludHVtQ29uZmlncztcbiAgICBwcml2YXRlIHN0YXRpYyBicnludHVtQ29uZmlnc09ubHk7XG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bVByb3BzO1xuICAgIHByaXZhdGUgZWxlbWVudFJlZjtcbiAgICBpbnN0YW5jZTogV2lkZ2V0O1xuICAgIHByaXZhdGUgYnJ5bnR1bUNvbmZpZztcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50OiBFbGVtZW50UmVmKTtcbiAgICBhZG9wdDogSFRNTEVsZW1lbnQgfCBzdHJpbmc7XG4gICAgYWxpZ246IG9iamVjdCB8IHN0cmluZztcbiAgICBhbmNob3I6IGJvb2xlYW47XG4gICAgYXBwZW5kVG86IEhUTUxFbGVtZW50IHwgc3RyaW5nO1xuICAgIGJ1YmJsZUV2ZW50czogb2JqZWN0O1xuICAgIGNlbnRlcmVkOiBib29sZWFuO1xuICAgIGNsczogc3RyaW5nIHwgb2JqZWN0O1xuICAgIGNvbmZpZzogb2JqZWN0O1xuICAgIGNvbnN0cmFpblRvOiBIVE1MRWxlbWVudCB8IFdpZGdldCB8IFJlY3RhbmdsZTtcbiAgICBjb250ZW50RWxlbWVudENsczogc3RyaW5nIHwgb2JqZWN0O1xuICAgIGRlZmF1bHRCaW5kUHJvcGVydHk6IHN0cmluZztcbiAgICBkb2NrOiBzdHJpbmc7XG4gICAgZHJhZ2dhYmxlOiBib29sZWFuIHwgb2JqZWN0O1xuICAgIGZsb2F0aW5nOiBib29sZWFuO1xuICAgIGhpZGVBbmltYXRpb246IGJvb2xlYW4gfCBvYmplY3Q7XG4gICAgaHRtbENsczogc3RyaW5nIHwgb2JqZWN0O1xuICAgIGluc2VydEJlZm9yZTogSFRNTEVsZW1lbnQgfCBzdHJpbmc7XG4gICAgaW5zZXJ0Rmlyc3Q6IEhUTUxFbGVtZW50IHwgc3RyaW5nO1xuICAgIGxpc3RlbmVyczogb2JqZWN0O1xuICAgIGxvY2FsZUNsYXNzOiBCYXNlO1xuICAgIGxvY2FsaXphYmxlUHJvcGVydGllczogc3RyaW5nW107XG4gICAgbWFza0RlZmF1bHRzOiBvYmplY3QgfCBNYXNrIHwgUGFydGlhbDxNYXNrQ29uZmlnPjtcbiAgICBtYXNrZWQ6IGJvb2xlYW4gfCBzdHJpbmcgfCBvYmplY3QgfCBNYXNrIHwgUGFydGlhbDxNYXNrQ29uZmlnPjtcbiAgICBtb25pdG9yUmVzaXplOiBib29sZWFuO1xuICAgIG93bmVyOiBXaWRnZXQ7XG4gICAgcG9zaXRpb25lZDogYm9vbGVhbjtcbiAgICBwcmV2ZW50VG9vbHRpcE9uVG91Y2g6IGJvb2xlYW47XG4gICAgcmlwcGxlOiBib29sZWFuIHwgb2JqZWN0O1xuICAgIHJvb3RFbGVtZW50OiBTaGFkb3dSb290O1xuICAgIHNjcm9sbEFjdGlvbjogc3RyaW5nO1xuICAgIHNob3dBbmltYXRpb246IGJvb2xlYW4gfCBvYmplY3Q7XG4gICAgdGFiOiBib29sZWFuIHwgb2JqZWN0O1xuICAgIHRhZzogc3RyaW5nO1xuICAgIHRleHRBbGlnbjogc3RyaW5nO1xuICAgIHRpdGxlOiBzdHJpbmc7XG4gICAgd2VpZ2h0OiBudW1iZXI7XG4gICAgYWxpZ25TZWxmOiBzdHJpbmc7XG4gICAgY29udGVudDogc3RyaW5nO1xuICAgIGRhdGFzZXQ6IG9iamVjdDtcbiAgICBkaXNhYmxlZDogYm9vbGVhbjtcbiAgICBleHRyYURhdGE6IGJvb2xlYW4gfCBudW1iZXIgfCBvYmplY3QgfCBzdHJpbmc7XG4gICAgZmxleDogbnVtYmVyIHwgc3RyaW5nO1xuICAgIGhlaWdodDogbnVtYmVyIHwgc3RyaW5nO1xuICAgIGhpZGRlbjogYm9vbGVhbjtcbiAgICBodG1sOiBzdHJpbmc7XG4gICAgaWQ6IHN0cmluZztcbiAgICBtYXJnaW46IG51bWJlciB8IHN0cmluZztcbiAgICBtYXhIZWlnaHQ6IG51bWJlciB8IHN0cmluZztcbiAgICBtYXhXaWR0aDogbnVtYmVyIHwgc3RyaW5nO1xuICAgIG1pbkhlaWdodDogbnVtYmVyIHwgc3RyaW5nO1xuICAgIG1pbldpZHRoOiBudW1iZXIgfCBzdHJpbmc7XG4gICAgcmVhZE9ubHk6IGJvb2xlYW47XG4gICAgc2Nyb2xsYWJsZTogYm9vbGVhbiB8IFNjcm9sbGVyIHwgb2JqZWN0IHwgUGFydGlhbDxTY3JvbGxlckNvbmZpZz47XG4gICAgdG9vbHRpcDogb2JqZWN0IHwgc3RyaW5nO1xuICAgIHdpZHRoOiBudW1iZXIgfCBzdHJpbmc7XG4gICAgeDogbnVtYmVyO1xuICAgIHk6IG51bWJlcjtcbiAgICBhbmNob3JTaXplOiBudW1iZXJbXTtcbiAgICBvbkJlZm9yZURlc3Ryb3k6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uQmVmb3JlSGlkZTogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25CZWZvcmVTaG93OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbkNhdGNoQWxsOiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbkRlc3Ryb3k6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uRm9jdXNJbjogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25Gb2N1c091dDogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25IaWRlOiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvblBhaW50OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvblJlYWRPbmx5OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvblJlc2l6ZTogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25TaG93OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYW5kIGFwcGVuZCB0aGUgdW5kZXJseWluZyB3aWRnZXRcbiAgICAgKi9cbiAgICBuZ09uSW5pdCgpOiB2b2lkO1xuICAgIC8qKlxuICAgICAqIFdhdGNoIGZvciBjaGFuZ2VzXG4gICAgICogQHBhcmFtIGNoYW5nZXNcbiAgICAgKi9cbiAgICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZDtcbiAgICAvKipcbiAgICAgKiBEZXN0cm95IHRoZSBjb21wb25lbnRcbiAgICAgKi9cbiAgICBuZ09uRGVzdHJveSgpOiB2b2lkO1xufVxuIl19