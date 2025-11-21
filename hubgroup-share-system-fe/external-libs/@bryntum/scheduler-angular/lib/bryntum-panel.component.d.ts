/**
 * Angular wrapper for Bryntum Panel
 */
import { ElementRef, EventEmitter, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Base, Layout, Mask, MaskConfig, Model, PanelHeader, Rectangle, Scroller, ScrollerConfig, Widget, WidgetConfig } from '@bryntum/scheduler/scheduler.lite.umd.js';
import { Panel } from '@bryntum/scheduler/scheduler.lite.umd.js';
import * as ɵngcc0 from '@angular/core';
export declare class BryntumPanelComponent implements OnInit, OnDestroy {
    static instanceClass: typeof Panel;
    private static bryntumFeatureNames;
    private static bryntumConfigs;
    private static bryntumConfigsOnly;
    private static bryntumProps;
    private elementRef;
    instance: Panel;
    private bryntumConfig;
    constructor(element: ElementRef);
    adopt: HTMLElement | string;
    align: object | string;
    anchor: boolean;
    appendTo: HTMLElement | string;
    bbar: object[] | object;
    bodyCls: string | object;
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
    footer: object | string;
    header: string | PanelHeader;
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
    strips: object;
    tab: boolean | object;
    tag: string;
    tbar: object[] | object;
    textAlign: string;
    textContent: boolean;
    title: string;
    trapFocus: boolean;
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
    tools: object;
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
    onToolClick: EventEmitter<object>;
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
    static ɵfac: ɵngcc0.ɵɵFactoryDef<BryntumPanelComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<BryntumPanelComponent, "bryntum-panel", never, { "adopt": "adopt"; "align": "align"; "anchor": "anchor"; "appendTo": "appendTo"; "bbar": "bbar"; "bodyCls": "bodyCls"; "bubbleEvents": "bubbleEvents"; "centered": "centered"; "cls": "cls"; "config": "config"; "constrainTo": "constrainTo"; "contentElementCls": "contentElementCls"; "defaultBindProperty": "defaultBindProperty"; "defaults": "defaults"; "dock": "dock"; "draggable": "draggable"; "floating": "floating"; "footer": "footer"; "header": "header"; "hideAnimation": "hideAnimation"; "hideWhenEmpty": "hideWhenEmpty"; "htmlCls": "htmlCls"; "insertBefore": "insertBefore"; "insertFirst": "insertFirst"; "itemCls": "itemCls"; "lazyItems": "lazyItems"; "listeners": "listeners"; "localeClass": "localeClass"; "localizableProperties": "localizableProperties"; "maskDefaults": "maskDefaults"; "masked": "masked"; "monitorResize": "monitorResize"; "namedItems": "namedItems"; "owner": "owner"; "positioned": "positioned"; "preventTooltipOnTouch": "preventTooltipOnTouch"; "ripple": "ripple"; "rootElement": "rootElement"; "scrollAction": "scrollAction"; "showAnimation": "showAnimation"; "strips": "strips"; "tab": "tab"; "tag": "tag"; "tbar": "tbar"; "textAlign": "textAlign"; "textContent": "textContent"; "title": "title"; "trapFocus": "trapFocus"; "weight": "weight"; "alignSelf": "alignSelf"; "content": "content"; "dataset": "dataset"; "disabled": "disabled"; "extraData": "extraData"; "flex": "flex"; "height": "height"; "hidden": "hidden"; "html": "html"; "id": "id"; "items": "items"; "layout": "layout"; "layoutStyle": "layoutStyle"; "margin": "margin"; "maxHeight": "maxHeight"; "maxWidth": "maxWidth"; "minHeight": "minHeight"; "minWidth": "minWidth"; "readOnly": "readOnly"; "scrollable": "scrollable"; "tools": "tools"; "tooltip": "tooltip"; "width": "width"; "x": "x"; "y": "y"; "anchorSize": "anchorSize"; "isSettingValues": "isSettingValues"; "isValid": "isValid"; "record": "record"; "values": "values"; }, { "onBeforeDestroy": "onBeforeDestroy"; "onBeforeHide": "onBeforeHide"; "onBeforeSetRecord": "onBeforeSetRecord"; "onBeforeShow": "onBeforeShow"; "onCatchAll": "onCatchAll"; "onDestroy": "onDestroy"; "onFocusIn": "onFocusIn"; "onFocusOut": "onFocusOut"; "onHide": "onHide"; "onPaint": "onPaint"; "onReadOnly": "onReadOnly"; "onResize": "onResize"; "onShow": "onShow"; "onToolClick": "onToolClick"; }, never, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJ5bnR1bS1wYW5lbC5jb21wb25lbnQuZC50cyIsInNvdXJjZXMiOlsiYnJ5bnR1bS1wYW5lbC5jb21wb25lbnQuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEFuZ3VsYXIgd3JhcHBlciBmb3IgQnJ5bnR1bSBQYW5lbFxuICovXG5pbXBvcnQgeyBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIE9uRGVzdHJveSwgT25Jbml0LCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCYXNlLCBMYXlvdXQsIE1hc2ssIE1hc2tDb25maWcsIE1vZGVsLCBQYW5lbEhlYWRlciwgUmVjdGFuZ2xlLCBTY3JvbGxlciwgU2Nyb2xsZXJDb25maWcsIFdpZGdldCwgV2lkZ2V0Q29uZmlnIH0gZnJvbSAnQGJyeW50dW0vc2NoZWR1bGVyL3NjaGVkdWxlci5saXRlLnVtZC5qcyc7XG5pbXBvcnQgeyBQYW5lbCB9IGZyb20gJ0BicnludHVtL3NjaGVkdWxlci9zY2hlZHVsZXIubGl0ZS51bWQuanMnO1xuZXhwb3J0IGRlY2xhcmUgY2xhc3MgQnJ5bnR1bVBhbmVsQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICAgIHN0YXRpYyBpbnN0YW5jZUNsYXNzOiB0eXBlb2YgUGFuZWw7XG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bUZlYXR1cmVOYW1lcztcbiAgICBwcml2YXRlIHN0YXRpYyBicnludHVtQ29uZmlncztcbiAgICBwcml2YXRlIHN0YXRpYyBicnludHVtQ29uZmlnc09ubHk7XG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bVByb3BzO1xuICAgIHByaXZhdGUgZWxlbWVudFJlZjtcbiAgICBpbnN0YW5jZTogUGFuZWw7XG4gICAgcHJpdmF0ZSBicnludHVtQ29uZmlnO1xuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQ6IEVsZW1lbnRSZWYpO1xuICAgIGFkb3B0OiBIVE1MRWxlbWVudCB8IHN0cmluZztcbiAgICBhbGlnbjogb2JqZWN0IHwgc3RyaW5nO1xuICAgIGFuY2hvcjogYm9vbGVhbjtcbiAgICBhcHBlbmRUbzogSFRNTEVsZW1lbnQgfCBzdHJpbmc7XG4gICAgYmJhcjogb2JqZWN0W10gfCBvYmplY3Q7XG4gICAgYm9keUNsczogc3RyaW5nIHwgb2JqZWN0O1xuICAgIGJ1YmJsZUV2ZW50czogb2JqZWN0O1xuICAgIGNlbnRlcmVkOiBib29sZWFuO1xuICAgIGNsczogc3RyaW5nIHwgb2JqZWN0O1xuICAgIGNvbmZpZzogb2JqZWN0O1xuICAgIGNvbnN0cmFpblRvOiBIVE1MRWxlbWVudCB8IFdpZGdldCB8IFJlY3RhbmdsZTtcbiAgICBjb250ZW50RWxlbWVudENsczogc3RyaW5nIHwgb2JqZWN0O1xuICAgIGRlZmF1bHRCaW5kUHJvcGVydHk6IHN0cmluZztcbiAgICBkZWZhdWx0czogb2JqZWN0O1xuICAgIGRvY2s6IHN0cmluZztcbiAgICBkcmFnZ2FibGU6IGJvb2xlYW4gfCBvYmplY3Q7XG4gICAgZmxvYXRpbmc6IGJvb2xlYW47XG4gICAgZm9vdGVyOiBvYmplY3QgfCBzdHJpbmc7XG4gICAgaGVhZGVyOiBzdHJpbmcgfCBQYW5lbEhlYWRlcjtcbiAgICBoaWRlQW5pbWF0aW9uOiBib29sZWFuIHwgb2JqZWN0O1xuICAgIGhpZGVXaGVuRW1wdHk6IGJvb2xlYW47XG4gICAgaHRtbENsczogc3RyaW5nIHwgb2JqZWN0O1xuICAgIGluc2VydEJlZm9yZTogSFRNTEVsZW1lbnQgfCBzdHJpbmc7XG4gICAgaW5zZXJ0Rmlyc3Q6IEhUTUxFbGVtZW50IHwgc3RyaW5nO1xuICAgIGl0ZW1DbHM6IHN0cmluZztcbiAgICBsYXp5SXRlbXM6IG9iamVjdCB8IG9iamVjdFtdIHwgV2lkZ2V0W10gfCBQYXJ0aWFsPFdpZGdldENvbmZpZz4gfCBQYXJ0aWFsPFdpZGdldENvbmZpZz5bXTtcbiAgICBsaXN0ZW5lcnM6IG9iamVjdDtcbiAgICBsb2NhbGVDbGFzczogQmFzZTtcbiAgICBsb2NhbGl6YWJsZVByb3BlcnRpZXM6IHN0cmluZ1tdO1xuICAgIG1hc2tEZWZhdWx0czogb2JqZWN0IHwgTWFzayB8IFBhcnRpYWw8TWFza0NvbmZpZz47XG4gICAgbWFza2VkOiBib29sZWFuIHwgc3RyaW5nIHwgb2JqZWN0IHwgTWFzayB8IFBhcnRpYWw8TWFza0NvbmZpZz47XG4gICAgbW9uaXRvclJlc2l6ZTogYm9vbGVhbjtcbiAgICBuYW1lZEl0ZW1zOiBvYmplY3Q7XG4gICAgb3duZXI6IFdpZGdldDtcbiAgICBwb3NpdGlvbmVkOiBib29sZWFuO1xuICAgIHByZXZlbnRUb29sdGlwT25Ub3VjaDogYm9vbGVhbjtcbiAgICByaXBwbGU6IGJvb2xlYW4gfCBvYmplY3Q7XG4gICAgcm9vdEVsZW1lbnQ6IFNoYWRvd1Jvb3Q7XG4gICAgc2Nyb2xsQWN0aW9uOiBzdHJpbmc7XG4gICAgc2hvd0FuaW1hdGlvbjogYm9vbGVhbiB8IG9iamVjdDtcbiAgICBzdHJpcHM6IG9iamVjdDtcbiAgICB0YWI6IGJvb2xlYW4gfCBvYmplY3Q7XG4gICAgdGFnOiBzdHJpbmc7XG4gICAgdGJhcjogb2JqZWN0W10gfCBvYmplY3Q7XG4gICAgdGV4dEFsaWduOiBzdHJpbmc7XG4gICAgdGV4dENvbnRlbnQ6IGJvb2xlYW47XG4gICAgdGl0bGU6IHN0cmluZztcbiAgICB0cmFwRm9jdXM6IGJvb2xlYW47XG4gICAgd2VpZ2h0OiBudW1iZXI7XG4gICAgYWxpZ25TZWxmOiBzdHJpbmc7XG4gICAgY29udGVudDogc3RyaW5nO1xuICAgIGRhdGFzZXQ6IG9iamVjdDtcbiAgICBkaXNhYmxlZDogYm9vbGVhbjtcbiAgICBleHRyYURhdGE6IGJvb2xlYW4gfCBudW1iZXIgfCBvYmplY3QgfCBzdHJpbmc7XG4gICAgZmxleDogbnVtYmVyIHwgc3RyaW5nO1xuICAgIGhlaWdodDogbnVtYmVyIHwgc3RyaW5nO1xuICAgIGhpZGRlbjogYm9vbGVhbjtcbiAgICBodG1sOiBzdHJpbmc7XG4gICAgaWQ6IHN0cmluZztcbiAgICBpdGVtczogV2lkZ2V0W10gfCBvYmplY3QgfCBvYmplY3RbXSB8IFBhcnRpYWw8V2lkZ2V0Q29uZmlnPiB8IFBhcnRpYWw8V2lkZ2V0Q29uZmlnPltdO1xuICAgIGxheW91dDogTGF5b3V0IHwgc3RyaW5nO1xuICAgIGxheW91dFN0eWxlOiBvYmplY3Q7XG4gICAgbWFyZ2luOiBudW1iZXIgfCBzdHJpbmc7XG4gICAgbWF4SGVpZ2h0OiBudW1iZXIgfCBzdHJpbmc7XG4gICAgbWF4V2lkdGg6IG51bWJlciB8IHN0cmluZztcbiAgICBtaW5IZWlnaHQ6IG51bWJlciB8IHN0cmluZztcbiAgICBtaW5XaWR0aDogbnVtYmVyIHwgc3RyaW5nO1xuICAgIHJlYWRPbmx5OiBib29sZWFuO1xuICAgIHNjcm9sbGFibGU6IGJvb2xlYW4gfCBTY3JvbGxlciB8IG9iamVjdCB8IFBhcnRpYWw8U2Nyb2xsZXJDb25maWc+O1xuICAgIHRvb2xzOiBvYmplY3Q7XG4gICAgdG9vbHRpcDogb2JqZWN0IHwgc3RyaW5nO1xuICAgIHdpZHRoOiBudW1iZXIgfCBzdHJpbmc7XG4gICAgeDogbnVtYmVyO1xuICAgIHk6IG51bWJlcjtcbiAgICBhbmNob3JTaXplOiBudW1iZXJbXTtcbiAgICBpc1NldHRpbmdWYWx1ZXM6IGJvb2xlYW47XG4gICAgaXNWYWxpZDogYm9vbGVhbjtcbiAgICByZWNvcmQ6IE1vZGVsO1xuICAgIHZhbHVlczogb2JqZWN0O1xuICAgIG9uQmVmb3JlRGVzdHJveTogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25CZWZvcmVIaWRlOiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbkJlZm9yZVNldFJlY29yZDogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25CZWZvcmVTaG93OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbkNhdGNoQWxsOiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbkRlc3Ryb3k6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uRm9jdXNJbjogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25Gb2N1c091dDogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25IaWRlOiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvblBhaW50OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvblJlYWRPbmx5OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvblJlc2l6ZTogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25TaG93OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvblRvb2xDbGljazogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGFuZCBhcHBlbmQgdGhlIHVuZGVybHlpbmcgd2lkZ2V0XG4gICAgICovXG4gICAgbmdPbkluaXQoKTogdm9pZDtcbiAgICAvKipcbiAgICAgKiBXYXRjaCBmb3IgY2hhbmdlc1xuICAgICAqIEBwYXJhbSBjaGFuZ2VzXG4gICAgICovXG4gICAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQ7XG4gICAgLyoqXG4gICAgICogRGVzdHJveSB0aGUgY29tcG9uZW50XG4gICAgICovXG4gICAgbmdPbkRlc3Ryb3koKTogdm9pZDtcbn1cbiJdfQ==