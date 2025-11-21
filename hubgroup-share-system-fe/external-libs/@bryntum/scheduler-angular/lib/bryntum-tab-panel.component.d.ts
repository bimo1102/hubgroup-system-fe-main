/**
 * Angular wrapper for Bryntum TabPanel
 */
import { ElementRef, EventEmitter, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Base, Layout, Mask, MaskConfig, Model, Rectangle, Scroller, ScrollerConfig, Widget, WidgetConfig } from '@bryntum/scheduler/scheduler.lite.umd.js';
import { TabPanel } from '@bryntum/scheduler/scheduler.lite.umd.js';
import * as ɵngcc0 from '@angular/core';
export declare class BryntumTabPanelComponent implements OnInit, OnDestroy {
    static instanceClass: typeof TabPanel;
    private static bryntumFeatureNames;
    private static bryntumConfigs;
    private static bryntumConfigsOnly;
    private static bryntumProps;
    private elementRef;
    instance: TabPanel;
    private bryntumConfig;
    constructor(element: ElementRef);
    adopt: HTMLElement | string;
    align: object | string;
    anchor: boolean;
    animateTabChange: boolean;
    appendTo: HTMLElement | string;
    autoHeight: boolean;
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
    tabMaxWidth: number;
    tabMinWidth: number;
    tag: string;
    textAlign: string;
    textContent: boolean;
    title: string;
    weight: number;
    activeTab: number;
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
    onBeforeTabChange: EventEmitter<object>;
    onCatchAll: EventEmitter<object>;
    onDestroy: EventEmitter<object>;
    onFocusIn: EventEmitter<object>;
    onFocusOut: EventEmitter<object>;
    onHide: EventEmitter<object>;
    onPaint: EventEmitter<object>;
    onReadOnly: EventEmitter<object>;
    onResize: EventEmitter<object>;
    onShow: EventEmitter<object>;
    onTabChange: EventEmitter<object>;
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
    static ɵfac: ɵngcc0.ɵɵFactoryDef<BryntumTabPanelComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<BryntumTabPanelComponent, "bryntum-tab-panel", never, { "adopt": "adopt"; "align": "align"; "anchor": "anchor"; "animateTabChange": "animateTabChange"; "appendTo": "appendTo"; "autoHeight": "autoHeight"; "bubbleEvents": "bubbleEvents"; "centered": "centered"; "cls": "cls"; "config": "config"; "constrainTo": "constrainTo"; "contentElementCls": "contentElementCls"; "defaultBindProperty": "defaultBindProperty"; "defaults": "defaults"; "dock": "dock"; "draggable": "draggable"; "floating": "floating"; "hideAnimation": "hideAnimation"; "hideWhenEmpty": "hideWhenEmpty"; "htmlCls": "htmlCls"; "insertBefore": "insertBefore"; "insertFirst": "insertFirst"; "itemCls": "itemCls"; "lazyItems": "lazyItems"; "listeners": "listeners"; "localeClass": "localeClass"; "localizableProperties": "localizableProperties"; "maskDefaults": "maskDefaults"; "masked": "masked"; "monitorResize": "monitorResize"; "namedItems": "namedItems"; "owner": "owner"; "positioned": "positioned"; "preventTooltipOnTouch": "preventTooltipOnTouch"; "ripple": "ripple"; "rootElement": "rootElement"; "scrollAction": "scrollAction"; "showAnimation": "showAnimation"; "tab": "tab"; "tabMaxWidth": "tabMaxWidth"; "tabMinWidth": "tabMinWidth"; "tag": "tag"; "textAlign": "textAlign"; "textContent": "textContent"; "title": "title"; "weight": "weight"; "activeTab": "activeTab"; "alignSelf": "alignSelf"; "content": "content"; "dataset": "dataset"; "disabled": "disabled"; "extraData": "extraData"; "flex": "flex"; "height": "height"; "hidden": "hidden"; "html": "html"; "id": "id"; "items": "items"; "layout": "layout"; "layoutStyle": "layoutStyle"; "margin": "margin"; "maxHeight": "maxHeight"; "maxWidth": "maxWidth"; "minHeight": "minHeight"; "minWidth": "minWidth"; "readOnly": "readOnly"; "scrollable": "scrollable"; "tooltip": "tooltip"; "width": "width"; "x": "x"; "y": "y"; "anchorSize": "anchorSize"; "isSettingValues": "isSettingValues"; "isValid": "isValid"; "record": "record"; "values": "values"; }, { "onBeforeDestroy": "onBeforeDestroy"; "onBeforeHide": "onBeforeHide"; "onBeforeSetRecord": "onBeforeSetRecord"; "onBeforeShow": "onBeforeShow"; "onBeforeTabChange": "onBeforeTabChange"; "onCatchAll": "onCatchAll"; "onDestroy": "onDestroy"; "onFocusIn": "onFocusIn"; "onFocusOut": "onFocusOut"; "onHide": "onHide"; "onPaint": "onPaint"; "onReadOnly": "onReadOnly"; "onResize": "onResize"; "onShow": "onShow"; "onTabChange": "onTabChange"; }, never, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJ5bnR1bS10YWItcGFuZWwuY29tcG9uZW50LmQudHMiLCJzb3VyY2VzIjpbImJyeW50dW0tdGFiLXBhbmVsLmNvbXBvbmVudC5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBBbmd1bGFyIHdyYXBwZXIgZm9yIEJyeW50dW0gVGFiUGFuZWxcbiAqL1xuaW1wb3J0IHsgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBPbkRlc3Ryb3ksIE9uSW5pdCwgU2ltcGxlQ2hhbmdlcyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQmFzZSwgTGF5b3V0LCBNYXNrLCBNYXNrQ29uZmlnLCBNb2RlbCwgUmVjdGFuZ2xlLCBTY3JvbGxlciwgU2Nyb2xsZXJDb25maWcsIFdpZGdldCwgV2lkZ2V0Q29uZmlnIH0gZnJvbSAnQGJyeW50dW0vc2NoZWR1bGVyL3NjaGVkdWxlci5saXRlLnVtZC5qcyc7XG5pbXBvcnQgeyBUYWJQYW5lbCB9IGZyb20gJ0BicnludHVtL3NjaGVkdWxlci9zY2hlZHVsZXIubGl0ZS51bWQuanMnO1xuZXhwb3J0IGRlY2xhcmUgY2xhc3MgQnJ5bnR1bVRhYlBhbmVsQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICAgIHN0YXRpYyBpbnN0YW5jZUNsYXNzOiB0eXBlb2YgVGFiUGFuZWw7XG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bUZlYXR1cmVOYW1lcztcbiAgICBwcml2YXRlIHN0YXRpYyBicnludHVtQ29uZmlncztcbiAgICBwcml2YXRlIHN0YXRpYyBicnludHVtQ29uZmlnc09ubHk7XG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bVByb3BzO1xuICAgIHByaXZhdGUgZWxlbWVudFJlZjtcbiAgICBpbnN0YW5jZTogVGFiUGFuZWw7XG4gICAgcHJpdmF0ZSBicnludHVtQ29uZmlnO1xuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQ6IEVsZW1lbnRSZWYpO1xuICAgIGFkb3B0OiBIVE1MRWxlbWVudCB8IHN0cmluZztcbiAgICBhbGlnbjogb2JqZWN0IHwgc3RyaW5nO1xuICAgIGFuY2hvcjogYm9vbGVhbjtcbiAgICBhbmltYXRlVGFiQ2hhbmdlOiBib29sZWFuO1xuICAgIGFwcGVuZFRvOiBIVE1MRWxlbWVudCB8IHN0cmluZztcbiAgICBhdXRvSGVpZ2h0OiBib29sZWFuO1xuICAgIGJ1YmJsZUV2ZW50czogb2JqZWN0O1xuICAgIGNlbnRlcmVkOiBib29sZWFuO1xuICAgIGNsczogc3RyaW5nIHwgb2JqZWN0O1xuICAgIGNvbmZpZzogb2JqZWN0O1xuICAgIGNvbnN0cmFpblRvOiBIVE1MRWxlbWVudCB8IFdpZGdldCB8IFJlY3RhbmdsZTtcbiAgICBjb250ZW50RWxlbWVudENsczogc3RyaW5nIHwgb2JqZWN0O1xuICAgIGRlZmF1bHRCaW5kUHJvcGVydHk6IHN0cmluZztcbiAgICBkZWZhdWx0czogb2JqZWN0O1xuICAgIGRvY2s6IHN0cmluZztcbiAgICBkcmFnZ2FibGU6IGJvb2xlYW4gfCBvYmplY3Q7XG4gICAgZmxvYXRpbmc6IGJvb2xlYW47XG4gICAgaGlkZUFuaW1hdGlvbjogYm9vbGVhbiB8IG9iamVjdDtcbiAgICBoaWRlV2hlbkVtcHR5OiBib29sZWFuO1xuICAgIGh0bWxDbHM6IHN0cmluZyB8IG9iamVjdDtcbiAgICBpbnNlcnRCZWZvcmU6IEhUTUxFbGVtZW50IHwgc3RyaW5nO1xuICAgIGluc2VydEZpcnN0OiBIVE1MRWxlbWVudCB8IHN0cmluZztcbiAgICBpdGVtQ2xzOiBzdHJpbmc7XG4gICAgbGF6eUl0ZW1zOiBvYmplY3QgfCBvYmplY3RbXSB8IFdpZGdldFtdIHwgUGFydGlhbDxXaWRnZXRDb25maWc+IHwgUGFydGlhbDxXaWRnZXRDb25maWc+W107XG4gICAgbGlzdGVuZXJzOiBvYmplY3Q7XG4gICAgbG9jYWxlQ2xhc3M6IEJhc2U7XG4gICAgbG9jYWxpemFibGVQcm9wZXJ0aWVzOiBzdHJpbmdbXTtcbiAgICBtYXNrRGVmYXVsdHM6IG9iamVjdCB8IE1hc2sgfCBQYXJ0aWFsPE1hc2tDb25maWc+O1xuICAgIG1hc2tlZDogYm9vbGVhbiB8IHN0cmluZyB8IG9iamVjdCB8IE1hc2sgfCBQYXJ0aWFsPE1hc2tDb25maWc+O1xuICAgIG1vbml0b3JSZXNpemU6IGJvb2xlYW47XG4gICAgbmFtZWRJdGVtczogb2JqZWN0O1xuICAgIG93bmVyOiBXaWRnZXQ7XG4gICAgcG9zaXRpb25lZDogYm9vbGVhbjtcbiAgICBwcmV2ZW50VG9vbHRpcE9uVG91Y2g6IGJvb2xlYW47XG4gICAgcmlwcGxlOiBib29sZWFuIHwgb2JqZWN0O1xuICAgIHJvb3RFbGVtZW50OiBTaGFkb3dSb290O1xuICAgIHNjcm9sbEFjdGlvbjogc3RyaW5nO1xuICAgIHNob3dBbmltYXRpb246IGJvb2xlYW4gfCBvYmplY3Q7XG4gICAgdGFiOiBib29sZWFuIHwgb2JqZWN0O1xuICAgIHRhYk1heFdpZHRoOiBudW1iZXI7XG4gICAgdGFiTWluV2lkdGg6IG51bWJlcjtcbiAgICB0YWc6IHN0cmluZztcbiAgICB0ZXh0QWxpZ246IHN0cmluZztcbiAgICB0ZXh0Q29udGVudDogYm9vbGVhbjtcbiAgICB0aXRsZTogc3RyaW5nO1xuICAgIHdlaWdodDogbnVtYmVyO1xuICAgIGFjdGl2ZVRhYjogbnVtYmVyO1xuICAgIGFsaWduU2VsZjogc3RyaW5nO1xuICAgIGNvbnRlbnQ6IHN0cmluZztcbiAgICBkYXRhc2V0OiBvYmplY3Q7XG4gICAgZGlzYWJsZWQ6IGJvb2xlYW47XG4gICAgZXh0cmFEYXRhOiBib29sZWFuIHwgbnVtYmVyIHwgb2JqZWN0IHwgc3RyaW5nO1xuICAgIGZsZXg6IG51bWJlciB8IHN0cmluZztcbiAgICBoZWlnaHQ6IG51bWJlciB8IHN0cmluZztcbiAgICBoaWRkZW46IGJvb2xlYW47XG4gICAgaHRtbDogc3RyaW5nO1xuICAgIGlkOiBzdHJpbmc7XG4gICAgaXRlbXM6IFdpZGdldFtdIHwgb2JqZWN0IHwgb2JqZWN0W10gfCBQYXJ0aWFsPFdpZGdldENvbmZpZz4gfCBQYXJ0aWFsPFdpZGdldENvbmZpZz5bXTtcbiAgICBsYXlvdXQ6IExheW91dCB8IHN0cmluZztcbiAgICBsYXlvdXRTdHlsZTogb2JqZWN0O1xuICAgIG1hcmdpbjogbnVtYmVyIHwgc3RyaW5nO1xuICAgIG1heEhlaWdodDogbnVtYmVyIHwgc3RyaW5nO1xuICAgIG1heFdpZHRoOiBudW1iZXIgfCBzdHJpbmc7XG4gICAgbWluSGVpZ2h0OiBudW1iZXIgfCBzdHJpbmc7XG4gICAgbWluV2lkdGg6IG51bWJlciB8IHN0cmluZztcbiAgICByZWFkT25seTogYm9vbGVhbjtcbiAgICBzY3JvbGxhYmxlOiBib29sZWFuIHwgU2Nyb2xsZXIgfCBvYmplY3QgfCBQYXJ0aWFsPFNjcm9sbGVyQ29uZmlnPjtcbiAgICB0b29sdGlwOiBvYmplY3QgfCBzdHJpbmc7XG4gICAgd2lkdGg6IG51bWJlciB8IHN0cmluZztcbiAgICB4OiBudW1iZXI7XG4gICAgeTogbnVtYmVyO1xuICAgIGFuY2hvclNpemU6IG51bWJlcltdO1xuICAgIGlzU2V0dGluZ1ZhbHVlczogYm9vbGVhbjtcbiAgICBpc1ZhbGlkOiBib29sZWFuO1xuICAgIHJlY29yZDogTW9kZWw7XG4gICAgdmFsdWVzOiBvYmplY3Q7XG4gICAgb25CZWZvcmVEZXN0cm95OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbkJlZm9yZUhpZGU6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uQmVmb3JlU2V0UmVjb3JkOiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbkJlZm9yZVNob3c6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uQmVmb3JlVGFiQ2hhbmdlOiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbkNhdGNoQWxsOiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbkRlc3Ryb3k6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uRm9jdXNJbjogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25Gb2N1c091dDogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25IaWRlOiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvblBhaW50OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvblJlYWRPbmx5OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvblJlc2l6ZTogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25TaG93OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvblRhYkNoYW5nZTogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGFuZCBhcHBlbmQgdGhlIHVuZGVybHlpbmcgd2lkZ2V0XG4gICAgICovXG4gICAgbmdPbkluaXQoKTogdm9pZDtcbiAgICAvKipcbiAgICAgKiBXYXRjaCBmb3IgY2hhbmdlc1xuICAgICAqIEBwYXJhbSBjaGFuZ2VzXG4gICAgICovXG4gICAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQ7XG4gICAgLyoqXG4gICAgICogRGVzdHJveSB0aGUgY29tcG9uZW50XG4gICAgICovXG4gICAgbmdPbkRlc3Ryb3koKTogdm9pZDtcbn1cbiJdfQ==