/**
 * Angular wrapper for Bryntum DatePicker
 */
import { ElementRef, EventEmitter, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Base, Layout, Mask, MaskConfig, Model, Month, MonthConfig, PanelHeader, Rectangle, Scroller, ScrollerConfig, Widget, WidgetConfig } from '@bryntum/scheduler/scheduler.lite.umd.js';
import { DatePicker } from '@bryntum/scheduler/scheduler.lite.umd.js';
import * as ɵngcc0 from '@angular/core';
export declare class BryntumDatePickerComponent implements OnInit, OnDestroy {
    static instanceClass: typeof DatePicker;
    private static bryntumFeatureNames;
    private static bryntumConfigs;
    private static bryntumConfigsOnly;
    private static bryntumProps;
    private elementRef;
    instance: DatePicker;
    private bryntumConfig;
    constructor(element: ElementRef);
    activeDate: Date;
    adopt: HTMLElement | string;
    align: object | string;
    anchor: boolean;
    appendTo: HTMLElement | string;
    bbar: object[] | object;
    bodyCls: string | object;
    bubbleEvents: object;
    cellRenderer: Function | string;
    centered: boolean;
    cls: string | object;
    config: object;
    constrainTo: HTMLElement | Widget | Rectangle;
    contentElementCls: string | object;
    dayNameFormat: string;
    defaultBindProperty: string;
    defaults: object;
    disabledDates: Function | Date[] | string;
    disableWeekends: boolean;
    dock: string;
    draggable: boolean | object;
    editMonth: boolean;
    editOnHover: boolean;
    floating: boolean;
    focusDisabledDates: boolean;
    footer: object | string;
    header: string | PanelHeader;
    headerRenderer: Function | string;
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
    maxDate: Date;
    minColumnWidth: number;
    minDate: Date;
    minRowHeight: number;
    monitorResize: boolean;
    month: Month | object | Partial<MonthConfig>;
    multiSelect: boolean;
    namedItems: object;
    nonWorkingDays: object;
    owner: Widget;
    positioned: boolean;
    preventTooltipOnTouch: boolean;
    ripple: boolean | object;
    rootElement: ShadowRoot;
    scrollAction: string;
    showAnimation: boolean | object;
    showWeekColumn: boolean;
    showWeekNumber: boolean;
    sixWeeks: boolean;
    strips: object;
    tab: boolean | object;
    tag: string;
    tbar: object[] | object;
    textAlign: string;
    textContent: boolean;
    tip: object;
    title: string;
    trapFocus: boolean;
    weekRenderer: Function | string;
    weekStartDay: number;
    weight: number;
    alignSelf: string;
    content: string;
    dataset: object;
    date: Date;
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
    onDateChange: EventEmitter<object>;
    onDestroy: EventEmitter<object>;
    onFocusIn: EventEmitter<object>;
    onFocusOut: EventEmitter<object>;
    onHide: EventEmitter<object>;
    onPaint: EventEmitter<object>;
    onReadOnly: EventEmitter<object>;
    onRefresh: EventEmitter<object>;
    onResize: EventEmitter<object>;
    onSelectionChange: EventEmitter<object>;
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
    static ɵfac: ɵngcc0.ɵɵFactoryDef<BryntumDatePickerComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<BryntumDatePickerComponent, "bryntum-date-picker", never, { "activeDate": "activeDate"; "adopt": "adopt"; "align": "align"; "anchor": "anchor"; "appendTo": "appendTo"; "bbar": "bbar"; "bodyCls": "bodyCls"; "bubbleEvents": "bubbleEvents"; "cellRenderer": "cellRenderer"; "centered": "centered"; "cls": "cls"; "config": "config"; "constrainTo": "constrainTo"; "contentElementCls": "contentElementCls"; "dayNameFormat": "dayNameFormat"; "defaultBindProperty": "defaultBindProperty"; "defaults": "defaults"; "disabledDates": "disabledDates"; "disableWeekends": "disableWeekends"; "dock": "dock"; "draggable": "draggable"; "editMonth": "editMonth"; "editOnHover": "editOnHover"; "floating": "floating"; "focusDisabledDates": "focusDisabledDates"; "footer": "footer"; "header": "header"; "headerRenderer": "headerRenderer"; "hideAnimation": "hideAnimation"; "hideWhenEmpty": "hideWhenEmpty"; "htmlCls": "htmlCls"; "insertBefore": "insertBefore"; "insertFirst": "insertFirst"; "itemCls": "itemCls"; "lazyItems": "lazyItems"; "listeners": "listeners"; "localeClass": "localeClass"; "localizableProperties": "localizableProperties"; "maskDefaults": "maskDefaults"; "masked": "masked"; "maxDate": "maxDate"; "minColumnWidth": "minColumnWidth"; "minDate": "minDate"; "minRowHeight": "minRowHeight"; "monitorResize": "monitorResize"; "month": "month"; "multiSelect": "multiSelect"; "namedItems": "namedItems"; "nonWorkingDays": "nonWorkingDays"; "owner": "owner"; "positioned": "positioned"; "preventTooltipOnTouch": "preventTooltipOnTouch"; "ripple": "ripple"; "rootElement": "rootElement"; "scrollAction": "scrollAction"; "showAnimation": "showAnimation"; "showWeekColumn": "showWeekColumn"; "showWeekNumber": "showWeekNumber"; "sixWeeks": "sixWeeks"; "strips": "strips"; "tab": "tab"; "tag": "tag"; "tbar": "tbar"; "textAlign": "textAlign"; "textContent": "textContent"; "tip": "tip"; "title": "title"; "trapFocus": "trapFocus"; "weekRenderer": "weekRenderer"; "weekStartDay": "weekStartDay"; "weight": "weight"; "alignSelf": "alignSelf"; "content": "content"; "dataset": "dataset"; "date": "date"; "disabled": "disabled"; "extraData": "extraData"; "flex": "flex"; "height": "height"; "hidden": "hidden"; "html": "html"; "id": "id"; "items": "items"; "layout": "layout"; "layoutStyle": "layoutStyle"; "margin": "margin"; "maxHeight": "maxHeight"; "maxWidth": "maxWidth"; "minHeight": "minHeight"; "minWidth": "minWidth"; "readOnly": "readOnly"; "scrollable": "scrollable"; "tools": "tools"; "tooltip": "tooltip"; "width": "width"; "x": "x"; "y": "y"; "anchorSize": "anchorSize"; "isSettingValues": "isSettingValues"; "isValid": "isValid"; "record": "record"; "values": "values"; }, { "onBeforeDestroy": "onBeforeDestroy"; "onBeforeHide": "onBeforeHide"; "onBeforeSetRecord": "onBeforeSetRecord"; "onBeforeShow": "onBeforeShow"; "onCatchAll": "onCatchAll"; "onDateChange": "onDateChange"; "onDestroy": "onDestroy"; "onFocusIn": "onFocusIn"; "onFocusOut": "onFocusOut"; "onHide": "onHide"; "onPaint": "onPaint"; "onReadOnly": "onReadOnly"; "onRefresh": "onRefresh"; "onResize": "onResize"; "onSelectionChange": "onSelectionChange"; "onShow": "onShow"; "onToolClick": "onToolClick"; }, never, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJ5bnR1bS1kYXRlLXBpY2tlci5jb21wb25lbnQuZC50cyIsInNvdXJjZXMiOlsiYnJ5bnR1bS1kYXRlLXBpY2tlci5jb21wb25lbnQuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBBbmd1bGFyIHdyYXBwZXIgZm9yIEJyeW50dW0gRGF0ZVBpY2tlclxuICovXG5pbXBvcnQgeyBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIE9uRGVzdHJveSwgT25Jbml0LCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCYXNlLCBMYXlvdXQsIE1hc2ssIE1hc2tDb25maWcsIE1vZGVsLCBNb250aCwgTW9udGhDb25maWcsIFBhbmVsSGVhZGVyLCBSZWN0YW5nbGUsIFNjcm9sbGVyLCBTY3JvbGxlckNvbmZpZywgV2lkZ2V0LCBXaWRnZXRDb25maWcgfSBmcm9tICdAYnJ5bnR1bS9zY2hlZHVsZXIvc2NoZWR1bGVyLmxpdGUudW1kLmpzJztcbmltcG9ydCB7IERhdGVQaWNrZXIgfSBmcm9tICdAYnJ5bnR1bS9zY2hlZHVsZXIvc2NoZWR1bGVyLmxpdGUudW1kLmpzJztcbmV4cG9ydCBkZWNsYXJlIGNsYXNzIEJyeW50dW1EYXRlUGlja2VyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICAgIHN0YXRpYyBpbnN0YW5jZUNsYXNzOiB0eXBlb2YgRGF0ZVBpY2tlcjtcbiAgICBwcml2YXRlIHN0YXRpYyBicnludHVtRmVhdHVyZU5hbWVzO1xuICAgIHByaXZhdGUgc3RhdGljIGJyeW50dW1Db25maWdzO1xuICAgIHByaXZhdGUgc3RhdGljIGJyeW50dW1Db25maWdzT25seTtcbiAgICBwcml2YXRlIHN0YXRpYyBicnludHVtUHJvcHM7XG4gICAgcHJpdmF0ZSBlbGVtZW50UmVmO1xuICAgIGluc3RhbmNlOiBEYXRlUGlja2VyO1xuICAgIHByaXZhdGUgYnJ5bnR1bUNvbmZpZztcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50OiBFbGVtZW50UmVmKTtcbiAgICBhY3RpdmVEYXRlOiBEYXRlO1xuICAgIGFkb3B0OiBIVE1MRWxlbWVudCB8IHN0cmluZztcbiAgICBhbGlnbjogb2JqZWN0IHwgc3RyaW5nO1xuICAgIGFuY2hvcjogYm9vbGVhbjtcbiAgICBhcHBlbmRUbzogSFRNTEVsZW1lbnQgfCBzdHJpbmc7XG4gICAgYmJhcjogb2JqZWN0W10gfCBvYmplY3Q7XG4gICAgYm9keUNsczogc3RyaW5nIHwgb2JqZWN0O1xuICAgIGJ1YmJsZUV2ZW50czogb2JqZWN0O1xuICAgIGNlbGxSZW5kZXJlcjogRnVuY3Rpb24gfCBzdHJpbmc7XG4gICAgY2VudGVyZWQ6IGJvb2xlYW47XG4gICAgY2xzOiBzdHJpbmcgfCBvYmplY3Q7XG4gICAgY29uZmlnOiBvYmplY3Q7XG4gICAgY29uc3RyYWluVG86IEhUTUxFbGVtZW50IHwgV2lkZ2V0IHwgUmVjdGFuZ2xlO1xuICAgIGNvbnRlbnRFbGVtZW50Q2xzOiBzdHJpbmcgfCBvYmplY3Q7XG4gICAgZGF5TmFtZUZvcm1hdDogc3RyaW5nO1xuICAgIGRlZmF1bHRCaW5kUHJvcGVydHk6IHN0cmluZztcbiAgICBkZWZhdWx0czogb2JqZWN0O1xuICAgIGRpc2FibGVkRGF0ZXM6IEZ1bmN0aW9uIHwgRGF0ZVtdIHwgc3RyaW5nO1xuICAgIGRpc2FibGVXZWVrZW5kczogYm9vbGVhbjtcbiAgICBkb2NrOiBzdHJpbmc7XG4gICAgZHJhZ2dhYmxlOiBib29sZWFuIHwgb2JqZWN0O1xuICAgIGVkaXRNb250aDogYm9vbGVhbjtcbiAgICBlZGl0T25Ib3ZlcjogYm9vbGVhbjtcbiAgICBmbG9hdGluZzogYm9vbGVhbjtcbiAgICBmb2N1c0Rpc2FibGVkRGF0ZXM6IGJvb2xlYW47XG4gICAgZm9vdGVyOiBvYmplY3QgfCBzdHJpbmc7XG4gICAgaGVhZGVyOiBzdHJpbmcgfCBQYW5lbEhlYWRlcjtcbiAgICBoZWFkZXJSZW5kZXJlcjogRnVuY3Rpb24gfCBzdHJpbmc7XG4gICAgaGlkZUFuaW1hdGlvbjogYm9vbGVhbiB8IG9iamVjdDtcbiAgICBoaWRlV2hlbkVtcHR5OiBib29sZWFuO1xuICAgIGh0bWxDbHM6IHN0cmluZyB8IG9iamVjdDtcbiAgICBpbnNlcnRCZWZvcmU6IEhUTUxFbGVtZW50IHwgc3RyaW5nO1xuICAgIGluc2VydEZpcnN0OiBIVE1MRWxlbWVudCB8IHN0cmluZztcbiAgICBpdGVtQ2xzOiBzdHJpbmc7XG4gICAgbGF6eUl0ZW1zOiBvYmplY3QgfCBvYmplY3RbXSB8IFdpZGdldFtdIHwgUGFydGlhbDxXaWRnZXRDb25maWc+IHwgUGFydGlhbDxXaWRnZXRDb25maWc+W107XG4gICAgbGlzdGVuZXJzOiBvYmplY3Q7XG4gICAgbG9jYWxlQ2xhc3M6IEJhc2U7XG4gICAgbG9jYWxpemFibGVQcm9wZXJ0aWVzOiBzdHJpbmdbXTtcbiAgICBtYXNrRGVmYXVsdHM6IG9iamVjdCB8IE1hc2sgfCBQYXJ0aWFsPE1hc2tDb25maWc+O1xuICAgIG1hc2tlZDogYm9vbGVhbiB8IHN0cmluZyB8IG9iamVjdCB8IE1hc2sgfCBQYXJ0aWFsPE1hc2tDb25maWc+O1xuICAgIG1heERhdGU6IERhdGU7XG4gICAgbWluQ29sdW1uV2lkdGg6IG51bWJlcjtcbiAgICBtaW5EYXRlOiBEYXRlO1xuICAgIG1pblJvd0hlaWdodDogbnVtYmVyO1xuICAgIG1vbml0b3JSZXNpemU6IGJvb2xlYW47XG4gICAgbW9udGg6IE1vbnRoIHwgb2JqZWN0IHwgUGFydGlhbDxNb250aENvbmZpZz47XG4gICAgbXVsdGlTZWxlY3Q6IGJvb2xlYW47XG4gICAgbmFtZWRJdGVtczogb2JqZWN0O1xuICAgIG5vbldvcmtpbmdEYXlzOiBvYmplY3Q7XG4gICAgb3duZXI6IFdpZGdldDtcbiAgICBwb3NpdGlvbmVkOiBib29sZWFuO1xuICAgIHByZXZlbnRUb29sdGlwT25Ub3VjaDogYm9vbGVhbjtcbiAgICByaXBwbGU6IGJvb2xlYW4gfCBvYmplY3Q7XG4gICAgcm9vdEVsZW1lbnQ6IFNoYWRvd1Jvb3Q7XG4gICAgc2Nyb2xsQWN0aW9uOiBzdHJpbmc7XG4gICAgc2hvd0FuaW1hdGlvbjogYm9vbGVhbiB8IG9iamVjdDtcbiAgICBzaG93V2Vla0NvbHVtbjogYm9vbGVhbjtcbiAgICBzaG93V2Vla051bWJlcjogYm9vbGVhbjtcbiAgICBzaXhXZWVrczogYm9vbGVhbjtcbiAgICBzdHJpcHM6IG9iamVjdDtcbiAgICB0YWI6IGJvb2xlYW4gfCBvYmplY3Q7XG4gICAgdGFnOiBzdHJpbmc7XG4gICAgdGJhcjogb2JqZWN0W10gfCBvYmplY3Q7XG4gICAgdGV4dEFsaWduOiBzdHJpbmc7XG4gICAgdGV4dENvbnRlbnQ6IGJvb2xlYW47XG4gICAgdGlwOiBvYmplY3Q7XG4gICAgdGl0bGU6IHN0cmluZztcbiAgICB0cmFwRm9jdXM6IGJvb2xlYW47XG4gICAgd2Vla1JlbmRlcmVyOiBGdW5jdGlvbiB8IHN0cmluZztcbiAgICB3ZWVrU3RhcnREYXk6IG51bWJlcjtcbiAgICB3ZWlnaHQ6IG51bWJlcjtcbiAgICBhbGlnblNlbGY6IHN0cmluZztcbiAgICBjb250ZW50OiBzdHJpbmc7XG4gICAgZGF0YXNldDogb2JqZWN0O1xuICAgIGRhdGU6IERhdGU7XG4gICAgZGlzYWJsZWQ6IGJvb2xlYW47XG4gICAgZXh0cmFEYXRhOiBib29sZWFuIHwgbnVtYmVyIHwgb2JqZWN0IHwgc3RyaW5nO1xuICAgIGZsZXg6IG51bWJlciB8IHN0cmluZztcbiAgICBoZWlnaHQ6IG51bWJlciB8IHN0cmluZztcbiAgICBoaWRkZW46IGJvb2xlYW47XG4gICAgaHRtbDogc3RyaW5nO1xuICAgIGlkOiBzdHJpbmc7XG4gICAgaXRlbXM6IFdpZGdldFtdIHwgb2JqZWN0IHwgb2JqZWN0W10gfCBQYXJ0aWFsPFdpZGdldENvbmZpZz4gfCBQYXJ0aWFsPFdpZGdldENvbmZpZz5bXTtcbiAgICBsYXlvdXQ6IExheW91dCB8IHN0cmluZztcbiAgICBsYXlvdXRTdHlsZTogb2JqZWN0O1xuICAgIG1hcmdpbjogbnVtYmVyIHwgc3RyaW5nO1xuICAgIG1heEhlaWdodDogbnVtYmVyIHwgc3RyaW5nO1xuICAgIG1heFdpZHRoOiBudW1iZXIgfCBzdHJpbmc7XG4gICAgbWluSGVpZ2h0OiBudW1iZXIgfCBzdHJpbmc7XG4gICAgbWluV2lkdGg6IG51bWJlciB8IHN0cmluZztcbiAgICByZWFkT25seTogYm9vbGVhbjtcbiAgICBzY3JvbGxhYmxlOiBib29sZWFuIHwgU2Nyb2xsZXIgfCBvYmplY3QgfCBQYXJ0aWFsPFNjcm9sbGVyQ29uZmlnPjtcbiAgICB0b29sczogb2JqZWN0O1xuICAgIHRvb2x0aXA6IG9iamVjdCB8IHN0cmluZztcbiAgICB3aWR0aDogbnVtYmVyIHwgc3RyaW5nO1xuICAgIHg6IG51bWJlcjtcbiAgICB5OiBudW1iZXI7XG4gICAgYW5jaG9yU2l6ZTogbnVtYmVyW107XG4gICAgaXNTZXR0aW5nVmFsdWVzOiBib29sZWFuO1xuICAgIGlzVmFsaWQ6IGJvb2xlYW47XG4gICAgcmVjb3JkOiBNb2RlbDtcbiAgICB2YWx1ZXM6IG9iamVjdDtcbiAgICBvbkJlZm9yZURlc3Ryb3k6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uQmVmb3JlSGlkZTogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25CZWZvcmVTZXRSZWNvcmQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uQmVmb3JlU2hvdzogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25DYXRjaEFsbDogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25EYXRlQ2hhbmdlOiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbkRlc3Ryb3k6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uRm9jdXNJbjogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25Gb2N1c091dDogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25IaWRlOiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvblBhaW50OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvblJlYWRPbmx5OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvblJlZnJlc2g6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uUmVzaXplOiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvblNlbGVjdGlvbkNoYW5nZTogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25TaG93OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvblRvb2xDbGljazogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGFuZCBhcHBlbmQgdGhlIHVuZGVybHlpbmcgd2lkZ2V0XG4gICAgICovXG4gICAgbmdPbkluaXQoKTogdm9pZDtcbiAgICAvKipcbiAgICAgKiBXYXRjaCBmb3IgY2hhbmdlc1xuICAgICAqIEBwYXJhbSBjaGFuZ2VzXG4gICAgICovXG4gICAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQ7XG4gICAgLyoqXG4gICAgICogRGVzdHJveSB0aGUgY29tcG9uZW50XG4gICAgICovXG4gICAgbmdPbkRlc3Ryb3koKTogdm9pZDtcbn1cbiJdfQ==