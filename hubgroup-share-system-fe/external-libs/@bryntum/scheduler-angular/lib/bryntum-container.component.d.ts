/**
 * Angular wrapper for Bryntum Container
 */
import { ElementRef, EventEmitter, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Base, Layout, Mask, MaskConfig, Model, Rectangle, Scroller, ScrollerConfig, Widget, WidgetConfig } from '@bryntum/scheduler/scheduler.lite.umd.js';
import { Container } from '@bryntum/scheduler/scheduler.lite.umd.js';
import * as ɵngcc0 from '@angular/core';
export declare class BryntumContainerComponent implements OnInit, OnDestroy {
    static instanceClass: typeof Container;
    private static bryntumFeatureNames;
    private static bryntumConfigs;
    private static bryntumConfigsOnly;
    private static bryntumProps;
    private elementRef;
    instance: Container;
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
    defaults: object;
    dock: string;
    draggable: boolean | object;
    floating: boolean;
    hideAnimation: boolean | object;
    hideWhenEmpty: boolean;
    htmlCls: string | object;
    insertBefore: HTMLElement | string;
    insertFirst: HTMLElement | string;
    itemCls: string;
    lazyItems: object | object[] | Widget[] | Partial<WidgetConfig> | Partial<WidgetConfig>[];
    listeners: object;
    localeClass: Base;
    localizableProperties: string[];
    maskDefaults: object | Mask | Partial<MaskConfig>;
    masked: boolean | string | object | Mask | Partial<MaskConfig>;
    monitorResize: boolean;
    namedItems: object;
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
    textContent: boolean;
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
    items: Widget[] | object | object[] | Partial<WidgetConfig> | Partial<WidgetConfig>[];
    layout: Layout | string;
    layoutStyle: object;
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
    isSettingValues: boolean;
    isValid: boolean;
    record: Model;
    values: object;
    onBeforeDestroy: EventEmitter<object>;
    onBeforeHide: EventEmitter<object>;
    onBeforeSetRecord: EventEmitter<object>;
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
    static ɵfac: ɵngcc0.ɵɵFactoryDef<BryntumContainerComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<BryntumContainerComponent, "bryntum-container", never, { "adopt": "adopt"; "align": "align"; "anchor": "anchor"; "appendTo": "appendTo"; "bubbleEvents": "bubbleEvents"; "centered": "centered"; "cls": "cls"; "config": "config"; "constrainTo": "constrainTo"; "contentElementCls": "contentElementCls"; "defaultBindProperty": "defaultBindProperty"; "defaults": "defaults"; "dock": "dock"; "draggable": "draggable"; "floating": "floating"; "hideAnimation": "hideAnimation"; "hideWhenEmpty": "hideWhenEmpty"; "htmlCls": "htmlCls"; "insertBefore": "insertBefore"; "insertFirst": "insertFirst"; "itemCls": "itemCls"; "lazyItems": "lazyItems"; "listeners": "listeners"; "localeClass": "localeClass"; "localizableProperties": "localizableProperties"; "maskDefaults": "maskDefaults"; "masked": "masked"; "monitorResize": "monitorResize"; "namedItems": "namedItems"; "owner": "owner"; "positioned": "positioned"; "preventTooltipOnTouch": "preventTooltipOnTouch"; "ripple": "ripple"; "rootElement": "rootElement"; "scrollAction": "scrollAction"; "showAnimation": "showAnimation"; "tab": "tab"; "tag": "tag"; "textAlign": "textAlign"; "textContent": "textContent"; "title": "title"; "weight": "weight"; "alignSelf": "alignSelf"; "content": "content"; "dataset": "dataset"; "disabled": "disabled"; "extraData": "extraData"; "flex": "flex"; "height": "height"; "hidden": "hidden"; "html": "html"; "id": "id"; "items": "items"; "layout": "layout"; "layoutStyle": "layoutStyle"; "margin": "margin"; "maxHeight": "maxHeight"; "maxWidth": "maxWidth"; "minHeight": "minHeight"; "minWidth": "minWidth"; "readOnly": "readOnly"; "scrollable": "scrollable"; "tooltip": "tooltip"; "width": "width"; "x": "x"; "y": "y"; "anchorSize": "anchorSize"; "isSettingValues": "isSettingValues"; "isValid": "isValid"; "record": "record"; "values": "values"; }, { "onBeforeDestroy": "onBeforeDestroy"; "onBeforeHide": "onBeforeHide"; "onBeforeSetRecord": "onBeforeSetRecord"; "onBeforeShow": "onBeforeShow"; "onCatchAll": "onCatchAll"; "onDestroy": "onDestroy"; "onFocusIn": "onFocusIn"; "onFocusOut": "onFocusOut"; "onHide": "onHide"; "onPaint": "onPaint"; "onReadOnly": "onReadOnly"; "onResize": "onResize"; "onShow": "onShow"; }, never, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJ5bnR1bS1jb250YWluZXIuY29tcG9uZW50LmQudHMiLCJzb3VyY2VzIjpbImJyeW50dW0tY29udGFpbmVyLmNvbXBvbmVudC5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQW5ndWxhciB3cmFwcGVyIGZvciBCcnludHVtIENvbnRhaW5lclxuICovXG5pbXBvcnQgeyBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIE9uRGVzdHJveSwgT25Jbml0LCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCYXNlLCBMYXlvdXQsIE1hc2ssIE1hc2tDb25maWcsIE1vZGVsLCBSZWN0YW5nbGUsIFNjcm9sbGVyLCBTY3JvbGxlckNvbmZpZywgV2lkZ2V0LCBXaWRnZXRDb25maWcgfSBmcm9tICdAYnJ5bnR1bS9zY2hlZHVsZXIvc2NoZWR1bGVyLmxpdGUudW1kLmpzJztcbmltcG9ydCB7IENvbnRhaW5lciB9IGZyb20gJ0BicnludHVtL3NjaGVkdWxlci9zY2hlZHVsZXIubGl0ZS51bWQuanMnO1xuZXhwb3J0IGRlY2xhcmUgY2xhc3MgQnJ5bnR1bUNvbnRhaW5lckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgICBzdGF0aWMgaW5zdGFuY2VDbGFzczogdHlwZW9mIENvbnRhaW5lcjtcbiAgICBwcml2YXRlIHN0YXRpYyBicnludHVtRmVhdHVyZU5hbWVzO1xuICAgIHByaXZhdGUgc3RhdGljIGJyeW50dW1Db25maWdzO1xuICAgIHByaXZhdGUgc3RhdGljIGJyeW50dW1Db25maWdzT25seTtcbiAgICBwcml2YXRlIHN0YXRpYyBicnludHVtUHJvcHM7XG4gICAgcHJpdmF0ZSBlbGVtZW50UmVmO1xuICAgIGluc3RhbmNlOiBDb250YWluZXI7XG4gICAgcHJpdmF0ZSBicnludHVtQ29uZmlnO1xuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQ6IEVsZW1lbnRSZWYpO1xuICAgIGFkb3B0OiBIVE1MRWxlbWVudCB8IHN0cmluZztcbiAgICBhbGlnbjogb2JqZWN0IHwgc3RyaW5nO1xuICAgIGFuY2hvcjogYm9vbGVhbjtcbiAgICBhcHBlbmRUbzogSFRNTEVsZW1lbnQgfCBzdHJpbmc7XG4gICAgYnViYmxlRXZlbnRzOiBvYmplY3Q7XG4gICAgY2VudGVyZWQ6IGJvb2xlYW47XG4gICAgY2xzOiBzdHJpbmcgfCBvYmplY3Q7XG4gICAgY29uZmlnOiBvYmplY3Q7XG4gICAgY29uc3RyYWluVG86IEhUTUxFbGVtZW50IHwgV2lkZ2V0IHwgUmVjdGFuZ2xlO1xuICAgIGNvbnRlbnRFbGVtZW50Q2xzOiBzdHJpbmcgfCBvYmplY3Q7XG4gICAgZGVmYXVsdEJpbmRQcm9wZXJ0eTogc3RyaW5nO1xuICAgIGRlZmF1bHRzOiBvYmplY3Q7XG4gICAgZG9jazogc3RyaW5nO1xuICAgIGRyYWdnYWJsZTogYm9vbGVhbiB8IG9iamVjdDtcbiAgICBmbG9hdGluZzogYm9vbGVhbjtcbiAgICBoaWRlQW5pbWF0aW9uOiBib29sZWFuIHwgb2JqZWN0O1xuICAgIGhpZGVXaGVuRW1wdHk6IGJvb2xlYW47XG4gICAgaHRtbENsczogc3RyaW5nIHwgb2JqZWN0O1xuICAgIGluc2VydEJlZm9yZTogSFRNTEVsZW1lbnQgfCBzdHJpbmc7XG4gICAgaW5zZXJ0Rmlyc3Q6IEhUTUxFbGVtZW50IHwgc3RyaW5nO1xuICAgIGl0ZW1DbHM6IHN0cmluZztcbiAgICBsYXp5SXRlbXM6IG9iamVjdCB8IG9iamVjdFtdIHwgV2lkZ2V0W10gfCBQYXJ0aWFsPFdpZGdldENvbmZpZz4gfCBQYXJ0aWFsPFdpZGdldENvbmZpZz5bXTtcbiAgICBsaXN0ZW5lcnM6IG9iamVjdDtcbiAgICBsb2NhbGVDbGFzczogQmFzZTtcbiAgICBsb2NhbGl6YWJsZVByb3BlcnRpZXM6IHN0cmluZ1tdO1xuICAgIG1hc2tEZWZhdWx0czogb2JqZWN0IHwgTWFzayB8IFBhcnRpYWw8TWFza0NvbmZpZz47XG4gICAgbWFza2VkOiBib29sZWFuIHwgc3RyaW5nIHwgb2JqZWN0IHwgTWFzayB8IFBhcnRpYWw8TWFza0NvbmZpZz47XG4gICAgbW9uaXRvclJlc2l6ZTogYm9vbGVhbjtcbiAgICBuYW1lZEl0ZW1zOiBvYmplY3Q7XG4gICAgb3duZXI6IFdpZGdldDtcbiAgICBwb3NpdGlvbmVkOiBib29sZWFuO1xuICAgIHByZXZlbnRUb29sdGlwT25Ub3VjaDogYm9vbGVhbjtcbiAgICByaXBwbGU6IGJvb2xlYW4gfCBvYmplY3Q7XG4gICAgcm9vdEVsZW1lbnQ6IFNoYWRvd1Jvb3Q7XG4gICAgc2Nyb2xsQWN0aW9uOiBzdHJpbmc7XG4gICAgc2hvd0FuaW1hdGlvbjogYm9vbGVhbiB8IG9iamVjdDtcbiAgICB0YWI6IGJvb2xlYW4gfCBvYmplY3Q7XG4gICAgdGFnOiBzdHJpbmc7XG4gICAgdGV4dEFsaWduOiBzdHJpbmc7XG4gICAgdGV4dENvbnRlbnQ6IGJvb2xlYW47XG4gICAgdGl0bGU6IHN0cmluZztcbiAgICB3ZWlnaHQ6IG51bWJlcjtcbiAgICBhbGlnblNlbGY6IHN0cmluZztcbiAgICBjb250ZW50OiBzdHJpbmc7XG4gICAgZGF0YXNldDogb2JqZWN0O1xuICAgIGRpc2FibGVkOiBib29sZWFuO1xuICAgIGV4dHJhRGF0YTogYm9vbGVhbiB8IG51bWJlciB8IG9iamVjdCB8IHN0cmluZztcbiAgICBmbGV4OiBudW1iZXIgfCBzdHJpbmc7XG4gICAgaGVpZ2h0OiBudW1iZXIgfCBzdHJpbmc7XG4gICAgaGlkZGVuOiBib29sZWFuO1xuICAgIGh0bWw6IHN0cmluZztcbiAgICBpZDogc3RyaW5nO1xuICAgIGl0ZW1zOiBXaWRnZXRbXSB8IG9iamVjdCB8IG9iamVjdFtdIHwgUGFydGlhbDxXaWRnZXRDb25maWc+IHwgUGFydGlhbDxXaWRnZXRDb25maWc+W107XG4gICAgbGF5b3V0OiBMYXlvdXQgfCBzdHJpbmc7XG4gICAgbGF5b3V0U3R5bGU6IG9iamVjdDtcbiAgICBtYXJnaW46IG51bWJlciB8IHN0cmluZztcbiAgICBtYXhIZWlnaHQ6IG51bWJlciB8IHN0cmluZztcbiAgICBtYXhXaWR0aDogbnVtYmVyIHwgc3RyaW5nO1xuICAgIG1pbkhlaWdodDogbnVtYmVyIHwgc3RyaW5nO1xuICAgIG1pbldpZHRoOiBudW1iZXIgfCBzdHJpbmc7XG4gICAgcmVhZE9ubHk6IGJvb2xlYW47XG4gICAgc2Nyb2xsYWJsZTogYm9vbGVhbiB8IFNjcm9sbGVyIHwgb2JqZWN0IHwgUGFydGlhbDxTY3JvbGxlckNvbmZpZz47XG4gICAgdG9vbHRpcDogb2JqZWN0IHwgc3RyaW5nO1xuICAgIHdpZHRoOiBudW1iZXIgfCBzdHJpbmc7XG4gICAgeDogbnVtYmVyO1xuICAgIHk6IG51bWJlcjtcbiAgICBhbmNob3JTaXplOiBudW1iZXJbXTtcbiAgICBpc1NldHRpbmdWYWx1ZXM6IGJvb2xlYW47XG4gICAgaXNWYWxpZDogYm9vbGVhbjtcbiAgICByZWNvcmQ6IE1vZGVsO1xuICAgIHZhbHVlczogb2JqZWN0O1xuICAgIG9uQmVmb3JlRGVzdHJveTogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25CZWZvcmVIaWRlOiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbkJlZm9yZVNldFJlY29yZDogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25CZWZvcmVTaG93OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbkNhdGNoQWxsOiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbkRlc3Ryb3k6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uRm9jdXNJbjogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25Gb2N1c091dDogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25IaWRlOiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvblBhaW50OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvblJlYWRPbmx5OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvblJlc2l6ZTogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25TaG93OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYW5kIGFwcGVuZCB0aGUgdW5kZXJseWluZyB3aWRnZXRcbiAgICAgKi9cbiAgICBuZ09uSW5pdCgpOiB2b2lkO1xuICAgIC8qKlxuICAgICAqIFdhdGNoIGZvciBjaGFuZ2VzXG4gICAgICogQHBhcmFtIGNoYW5nZXNcbiAgICAgKi9cbiAgICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZDtcbiAgICAvKipcbiAgICAgKiBEZXN0cm95IHRoZSBjb21wb25lbnRcbiAgICAgKi9cbiAgICBuZ09uRGVzdHJveSgpOiB2b2lkO1xufVxuIl19