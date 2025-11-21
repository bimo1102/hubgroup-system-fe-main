/**
 * Angular wrapper for Bryntum Menu
 */
import { ElementRef, EventEmitter, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Base, Layout, Mask, MaskConfig, Model, PanelHeader, Rectangle, Scroller, ScrollerConfig, Widget, WidgetConfig } from '@bryntum/scheduler/scheduler.lite.umd.js';
import { Menu } from '@bryntum/scheduler/scheduler.lite.umd.js';
import * as ɵngcc0 from '@angular/core';
export declare class BryntumMenuComponent implements OnInit, OnDestroy {
    static instanceClass: typeof Menu;
    private static bryntumFeatureNames;
    private static bryntumConfigs;
    private static bryntumConfigsOnly;
    private static bryntumProps;
    private elementRef;
    instance: Menu;
    private bryntumConfig;
    constructor(element: ElementRef);
    adopt: HTMLElement | string;
    align: object | string;
    anchor: boolean;
    appendTo: HTMLElement | string;
    autoClose: boolean;
    autoShow: boolean;
    bbar: object[] | object;
    bodyCls: string | object;
    bubbleEvents: object;
    centered: boolean;
    closable: boolean;
    closeAction: string;
    cls: string | object;
    config: object;
    constrainTo: HTMLElement | Widget | Rectangle;
    contentElementCls: string | object;
    defaultBindProperty: string;
    defaults: object;
    dock: string;
    draggable: boolean | object;
    floating: boolean;
    focusOnHover: boolean;
    focusOnToFront: boolean;
    footer: object | string;
    forElement: HTMLElement;
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
    maximizable: boolean;
    modal: boolean;
    monitorResize: boolean;
    namedItems: object;
    owner: Widget;
    positioned: boolean;
    preventTooltipOnTouch: boolean;
    ripple: boolean | object;
    rootElement: ShadowRoot;
    scrollAction: string;
    showAnimation: boolean | object;
    showOnClick: boolean;
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
    maximized: boolean;
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
    parentMenu: Menu;
    record: Model;
    selectedElement: HTMLElement;
    values: object;
    onBeforeClose: EventEmitter<object>;
    onBeforeDestroy: EventEmitter<object>;
    onBeforeHide: EventEmitter<object>;
    onBeforeSetRecord: EventEmitter<object>;
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
    onToggle: EventEmitter<object>;
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
    static ɵfac: ɵngcc0.ɵɵFactoryDef<BryntumMenuComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<BryntumMenuComponent, "bryntum-menu", never, { "adopt": "adopt"; "align": "align"; "anchor": "anchor"; "appendTo": "appendTo"; "autoClose": "autoClose"; "autoShow": "autoShow"; "bbar": "bbar"; "bodyCls": "bodyCls"; "bubbleEvents": "bubbleEvents"; "centered": "centered"; "closable": "closable"; "closeAction": "closeAction"; "cls": "cls"; "config": "config"; "constrainTo": "constrainTo"; "contentElementCls": "contentElementCls"; "defaultBindProperty": "defaultBindProperty"; "defaults": "defaults"; "dock": "dock"; "draggable": "draggable"; "floating": "floating"; "focusOnHover": "focusOnHover"; "focusOnToFront": "focusOnToFront"; "footer": "footer"; "forElement": "forElement"; "header": "header"; "hideAnimation": "hideAnimation"; "hideWhenEmpty": "hideWhenEmpty"; "htmlCls": "htmlCls"; "insertBefore": "insertBefore"; "insertFirst": "insertFirst"; "itemCls": "itemCls"; "lazyItems": "lazyItems"; "listeners": "listeners"; "localeClass": "localeClass"; "localizableProperties": "localizableProperties"; "maskDefaults": "maskDefaults"; "masked": "masked"; "maximizable": "maximizable"; "modal": "modal"; "monitorResize": "monitorResize"; "namedItems": "namedItems"; "owner": "owner"; "positioned": "positioned"; "preventTooltipOnTouch": "preventTooltipOnTouch"; "ripple": "ripple"; "rootElement": "rootElement"; "scrollAction": "scrollAction"; "showAnimation": "showAnimation"; "showOnClick": "showOnClick"; "strips": "strips"; "tab": "tab"; "tag": "tag"; "tbar": "tbar"; "textAlign": "textAlign"; "textContent": "textContent"; "title": "title"; "trapFocus": "trapFocus"; "weight": "weight"; "alignSelf": "alignSelf"; "content": "content"; "dataset": "dataset"; "disabled": "disabled"; "extraData": "extraData"; "flex": "flex"; "height": "height"; "hidden": "hidden"; "html": "html"; "id": "id"; "items": "items"; "layout": "layout"; "layoutStyle": "layoutStyle"; "margin": "margin"; "maxHeight": "maxHeight"; "maximized": "maximized"; "maxWidth": "maxWidth"; "minHeight": "minHeight"; "minWidth": "minWidth"; "readOnly": "readOnly"; "scrollable": "scrollable"; "tools": "tools"; "tooltip": "tooltip"; "width": "width"; "x": "x"; "y": "y"; "anchorSize": "anchorSize"; "isSettingValues": "isSettingValues"; "isValid": "isValid"; "parentMenu": "parentMenu"; "record": "record"; "selectedElement": "selectedElement"; "values": "values"; }, { "onBeforeClose": "onBeforeClose"; "onBeforeDestroy": "onBeforeDestroy"; "onBeforeHide": "onBeforeHide"; "onBeforeSetRecord": "onBeforeSetRecord"; "onBeforeShow": "onBeforeShow"; "onCatchAll": "onCatchAll"; "onDestroy": "onDestroy"; "onFocusIn": "onFocusIn"; "onFocusOut": "onFocusOut"; "onHide": "onHide"; "onItem": "onItem"; "onPaint": "onPaint"; "onReadOnly": "onReadOnly"; "onResize": "onResize"; "onShow": "onShow"; "onToggle": "onToggle"; "onToolClick": "onToolClick"; }, never, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJ5bnR1bS1tZW51LmNvbXBvbmVudC5kLnRzIiwic291cmNlcyI6WyJicnludHVtLW1lbnUuY29tcG9uZW50LmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEFuZ3VsYXIgd3JhcHBlciBmb3IgQnJ5bnR1bSBNZW51XG4gKi9cbmltcG9ydCB7IEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgT25EZXN0cm95LCBPbkluaXQsIFNpbXBsZUNoYW5nZXMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJhc2UsIExheW91dCwgTWFzaywgTWFza0NvbmZpZywgTW9kZWwsIFBhbmVsSGVhZGVyLCBSZWN0YW5nbGUsIFNjcm9sbGVyLCBTY3JvbGxlckNvbmZpZywgV2lkZ2V0LCBXaWRnZXRDb25maWcgfSBmcm9tICdAYnJ5bnR1bS9zY2hlZHVsZXIvc2NoZWR1bGVyLmxpdGUudW1kLmpzJztcbmltcG9ydCB7IE1lbnUgfSBmcm9tICdAYnJ5bnR1bS9zY2hlZHVsZXIvc2NoZWR1bGVyLmxpdGUudW1kLmpzJztcbmV4cG9ydCBkZWNsYXJlIGNsYXNzIEJyeW50dW1NZW51Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICAgIHN0YXRpYyBpbnN0YW5jZUNsYXNzOiB0eXBlb2YgTWVudTtcbiAgICBwcml2YXRlIHN0YXRpYyBicnludHVtRmVhdHVyZU5hbWVzO1xuICAgIHByaXZhdGUgc3RhdGljIGJyeW50dW1Db25maWdzO1xuICAgIHByaXZhdGUgc3RhdGljIGJyeW50dW1Db25maWdzT25seTtcbiAgICBwcml2YXRlIHN0YXRpYyBicnludHVtUHJvcHM7XG4gICAgcHJpdmF0ZSBlbGVtZW50UmVmO1xuICAgIGluc3RhbmNlOiBNZW51O1xuICAgIHByaXZhdGUgYnJ5bnR1bUNvbmZpZztcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50OiBFbGVtZW50UmVmKTtcbiAgICBhZG9wdDogSFRNTEVsZW1lbnQgfCBzdHJpbmc7XG4gICAgYWxpZ246IG9iamVjdCB8IHN0cmluZztcbiAgICBhbmNob3I6IGJvb2xlYW47XG4gICAgYXBwZW5kVG86IEhUTUxFbGVtZW50IHwgc3RyaW5nO1xuICAgIGF1dG9DbG9zZTogYm9vbGVhbjtcbiAgICBhdXRvU2hvdzogYm9vbGVhbjtcbiAgICBiYmFyOiBvYmplY3RbXSB8IG9iamVjdDtcbiAgICBib2R5Q2xzOiBzdHJpbmcgfCBvYmplY3Q7XG4gICAgYnViYmxlRXZlbnRzOiBvYmplY3Q7XG4gICAgY2VudGVyZWQ6IGJvb2xlYW47XG4gICAgY2xvc2FibGU6IGJvb2xlYW47XG4gICAgY2xvc2VBY3Rpb246IHN0cmluZztcbiAgICBjbHM6IHN0cmluZyB8IG9iamVjdDtcbiAgICBjb25maWc6IG9iamVjdDtcbiAgICBjb25zdHJhaW5UbzogSFRNTEVsZW1lbnQgfCBXaWRnZXQgfCBSZWN0YW5nbGU7XG4gICAgY29udGVudEVsZW1lbnRDbHM6IHN0cmluZyB8IG9iamVjdDtcbiAgICBkZWZhdWx0QmluZFByb3BlcnR5OiBzdHJpbmc7XG4gICAgZGVmYXVsdHM6IG9iamVjdDtcbiAgICBkb2NrOiBzdHJpbmc7XG4gICAgZHJhZ2dhYmxlOiBib29sZWFuIHwgb2JqZWN0O1xuICAgIGZsb2F0aW5nOiBib29sZWFuO1xuICAgIGZvY3VzT25Ib3ZlcjogYm9vbGVhbjtcbiAgICBmb2N1c09uVG9Gcm9udDogYm9vbGVhbjtcbiAgICBmb290ZXI6IG9iamVjdCB8IHN0cmluZztcbiAgICBmb3JFbGVtZW50OiBIVE1MRWxlbWVudDtcbiAgICBoZWFkZXI6IHN0cmluZyB8IFBhbmVsSGVhZGVyO1xuICAgIGhpZGVBbmltYXRpb246IGJvb2xlYW4gfCBvYmplY3Q7XG4gICAgaGlkZVdoZW5FbXB0eTogYm9vbGVhbjtcbiAgICBodG1sQ2xzOiBzdHJpbmcgfCBvYmplY3Q7XG4gICAgaW5zZXJ0QmVmb3JlOiBIVE1MRWxlbWVudCB8IHN0cmluZztcbiAgICBpbnNlcnRGaXJzdDogSFRNTEVsZW1lbnQgfCBzdHJpbmc7XG4gICAgaXRlbUNsczogc3RyaW5nO1xuICAgIGxhenlJdGVtczogb2JqZWN0IHwgb2JqZWN0W10gfCBXaWRnZXRbXSB8IFBhcnRpYWw8V2lkZ2V0Q29uZmlnPiB8IFBhcnRpYWw8V2lkZ2V0Q29uZmlnPltdO1xuICAgIGxpc3RlbmVyczogb2JqZWN0O1xuICAgIGxvY2FsZUNsYXNzOiBCYXNlO1xuICAgIGxvY2FsaXphYmxlUHJvcGVydGllczogc3RyaW5nW107XG4gICAgbWFza0RlZmF1bHRzOiBvYmplY3QgfCBNYXNrIHwgUGFydGlhbDxNYXNrQ29uZmlnPjtcbiAgICBtYXNrZWQ6IGJvb2xlYW4gfCBzdHJpbmcgfCBvYmplY3QgfCBNYXNrIHwgUGFydGlhbDxNYXNrQ29uZmlnPjtcbiAgICBtYXhpbWl6YWJsZTogYm9vbGVhbjtcbiAgICBtb2RhbDogYm9vbGVhbjtcbiAgICBtb25pdG9yUmVzaXplOiBib29sZWFuO1xuICAgIG5hbWVkSXRlbXM6IG9iamVjdDtcbiAgICBvd25lcjogV2lkZ2V0O1xuICAgIHBvc2l0aW9uZWQ6IGJvb2xlYW47XG4gICAgcHJldmVudFRvb2x0aXBPblRvdWNoOiBib29sZWFuO1xuICAgIHJpcHBsZTogYm9vbGVhbiB8IG9iamVjdDtcbiAgICByb290RWxlbWVudDogU2hhZG93Um9vdDtcbiAgICBzY3JvbGxBY3Rpb246IHN0cmluZztcbiAgICBzaG93QW5pbWF0aW9uOiBib29sZWFuIHwgb2JqZWN0O1xuICAgIHNob3dPbkNsaWNrOiBib29sZWFuO1xuICAgIHN0cmlwczogb2JqZWN0O1xuICAgIHRhYjogYm9vbGVhbiB8IG9iamVjdDtcbiAgICB0YWc6IHN0cmluZztcbiAgICB0YmFyOiBvYmplY3RbXSB8IG9iamVjdDtcbiAgICB0ZXh0QWxpZ246IHN0cmluZztcbiAgICB0ZXh0Q29udGVudDogYm9vbGVhbjtcbiAgICB0aXRsZTogc3RyaW5nO1xuICAgIHRyYXBGb2N1czogYm9vbGVhbjtcbiAgICB3ZWlnaHQ6IG51bWJlcjtcbiAgICBhbGlnblNlbGY6IHN0cmluZztcbiAgICBjb250ZW50OiBzdHJpbmc7XG4gICAgZGF0YXNldDogb2JqZWN0O1xuICAgIGRpc2FibGVkOiBib29sZWFuO1xuICAgIGV4dHJhRGF0YTogYm9vbGVhbiB8IG51bWJlciB8IG9iamVjdCB8IHN0cmluZztcbiAgICBmbGV4OiBudW1iZXIgfCBzdHJpbmc7XG4gICAgaGVpZ2h0OiBudW1iZXIgfCBzdHJpbmc7XG4gICAgaGlkZGVuOiBib29sZWFuO1xuICAgIGh0bWw6IHN0cmluZztcbiAgICBpZDogc3RyaW5nO1xuICAgIGl0ZW1zOiBXaWRnZXRbXSB8IG9iamVjdCB8IG9iamVjdFtdIHwgUGFydGlhbDxXaWRnZXRDb25maWc+IHwgUGFydGlhbDxXaWRnZXRDb25maWc+W107XG4gICAgbGF5b3V0OiBMYXlvdXQgfCBzdHJpbmc7XG4gICAgbGF5b3V0U3R5bGU6IG9iamVjdDtcbiAgICBtYXJnaW46IG51bWJlciB8IHN0cmluZztcbiAgICBtYXhIZWlnaHQ6IG51bWJlciB8IHN0cmluZztcbiAgICBtYXhpbWl6ZWQ6IGJvb2xlYW47XG4gICAgbWF4V2lkdGg6IG51bWJlciB8IHN0cmluZztcbiAgICBtaW5IZWlnaHQ6IG51bWJlciB8IHN0cmluZztcbiAgICBtaW5XaWR0aDogbnVtYmVyIHwgc3RyaW5nO1xuICAgIHJlYWRPbmx5OiBib29sZWFuO1xuICAgIHNjcm9sbGFibGU6IGJvb2xlYW4gfCBTY3JvbGxlciB8IG9iamVjdCB8IFBhcnRpYWw8U2Nyb2xsZXJDb25maWc+O1xuICAgIHRvb2xzOiBvYmplY3Q7XG4gICAgdG9vbHRpcDogb2JqZWN0IHwgc3RyaW5nO1xuICAgIHdpZHRoOiBudW1iZXIgfCBzdHJpbmc7XG4gICAgeDogbnVtYmVyO1xuICAgIHk6IG51bWJlcjtcbiAgICBhbmNob3JTaXplOiBudW1iZXJbXTtcbiAgICBpc1NldHRpbmdWYWx1ZXM6IGJvb2xlYW47XG4gICAgaXNWYWxpZDogYm9vbGVhbjtcbiAgICBwYXJlbnRNZW51OiBNZW51O1xuICAgIHJlY29yZDogTW9kZWw7XG4gICAgc2VsZWN0ZWRFbGVtZW50OiBIVE1MRWxlbWVudDtcbiAgICB2YWx1ZXM6IG9iamVjdDtcbiAgICBvbkJlZm9yZUNsb3NlOiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbkJlZm9yZURlc3Ryb3k6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uQmVmb3JlSGlkZTogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25CZWZvcmVTZXRSZWNvcmQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uQmVmb3JlU2hvdzogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25DYXRjaEFsbDogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25EZXN0cm95OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbkZvY3VzSW46IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uRm9jdXNPdXQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uSGlkZTogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25JdGVtOiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvblBhaW50OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvblJlYWRPbmx5OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvblJlc2l6ZTogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25TaG93OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvblRvZ2dsZTogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25Ub29sQ2xpY2s6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhbmQgYXBwZW5kIHRoZSB1bmRlcmx5aW5nIHdpZGdldFxuICAgICAqL1xuICAgIG5nT25Jbml0KCk6IHZvaWQ7XG4gICAgLyoqXG4gICAgICogV2F0Y2ggZm9yIGNoYW5nZXNcbiAgICAgKiBAcGFyYW0gY2hhbmdlc1xuICAgICAqL1xuICAgIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkO1xuICAgIC8qKlxuICAgICAqIERlc3Ryb3kgdGhlIGNvbXBvbmVudFxuICAgICAqL1xuICAgIG5nT25EZXN0cm95KCk6IHZvaWQ7XG59XG4iXX0=