/**
 * Angular wrapper for Bryntum NumberField
 */
import { ElementRef, EventEmitter, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Base, Mask, MaskConfig, NumberFormat, NumberFormatConfig, Rectangle, Scroller, ScrollerConfig, Widget } from '@bryntum/scheduler/scheduler.lite.umd.js';
import { NumberField } from '@bryntum/scheduler/scheduler.lite.umd.js';
import * as ɵngcc0 from '@angular/core';
export declare class BryntumNumberFieldComponent implements OnInit, OnDestroy {
    static instanceClass: typeof NumberField;
    private static bryntumFeatureNames;
    private static bryntumConfigs;
    private static bryntumConfigsOnly;
    private static bryntumProps;
    private elementRef;
    instance: NumberField;
    private bryntumConfig;
    constructor(element: ElementRef);
    adopt: HTMLElement | string;
    align: object | string;
    anchor: boolean;
    appendTo: HTMLElement | string;
    autoComplete: string;
    autoSelect: boolean;
    bubbleEvents: object;
    centered: boolean;
    changeOnSpin: boolean | number;
    clearable: boolean | object;
    cls: string | object;
    config: object;
    constrainTo: HTMLElement | Widget | Rectangle;
    contentElementCls: string | object;
    decimalPrecision: number;
    defaultBindProperty: string;
    dock: string;
    draggable: boolean | object;
    editable: boolean;
    floating: boolean;
    format: string | object | NumberFormat | Partial<NumberFormatConfig>;
    hideAnimation: boolean | object;
    highlightExternalChange: boolean;
    hint: string | Function;
    hintHtml: string | Function;
    htmlCls: string | object;
    inputAlign: string;
    inputAttributes: object;
    inputType: string;
    inputWidth: string | number;
    insertBefore: HTMLElement | string;
    insertFirst: HTMLElement | string;
    keyStrokeChangeDelay: number;
    labelCls: string | object;
    labelPosition: string;
    labels: object;
    labelWidth: string | number;
    largeStep: number;
    leadingZeroes: number;
    listeners: object;
    localeClass: Base;
    localizableProperties: string[];
    maskDefaults: object | Mask | Partial<MaskConfig>;
    masked: boolean | string | object | Mask | Partial<MaskConfig>;
    max: number;
    min: number;
    monitorResize: boolean;
    name: string;
    owner: Widget;
    placeholder: string;
    positioned: boolean;
    preventTooltipOnTouch: boolean;
    required: boolean;
    revertOnEscape: boolean;
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
    badge: string;
    content: string;
    dataset: object;
    disabled: boolean;
    extraData: boolean | number | object | string;
    flex: number | string;
    height: number | string;
    hidden: boolean;
    html: string;
    id: string;
    label: string;
    margin: number | string;
    maxHeight: number | string;
    maxWidth: number | string;
    minHeight: number | string;
    minWidth: number | string;
    readOnly: boolean;
    scrollable: boolean | Scroller | object | Partial<ScrollerConfig>;
    step: number;
    tooltip: object | string;
    triggers: object;
    value: number | any;
    width: number | string;
    x: number;
    y: number;
    anchorSize: number[];
    onAction: EventEmitter<object>;
    onBeforeDestroy: EventEmitter<object>;
    onBeforeHide: EventEmitter<object>;
    onBeforeShow: EventEmitter<object>;
    onCatchAll: EventEmitter<object>;
    onChange: EventEmitter<object>;
    onClear: EventEmitter<object>;
    onDestroy: EventEmitter<object>;
    onFocusIn: EventEmitter<object>;
    onFocusOut: EventEmitter<object>;
    onHide: EventEmitter<object>;
    onInput: EventEmitter<object>;
    onPaint: EventEmitter<object>;
    onReadOnly: EventEmitter<object>;
    onResize: EventEmitter<object>;
    onShow: EventEmitter<object>;
    onTrigger: EventEmitter<object>;
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
    static ɵfac: ɵngcc0.ɵɵFactoryDef<BryntumNumberFieldComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<BryntumNumberFieldComponent, "bryntum-number-field", never, { "adopt": "adopt"; "align": "align"; "anchor": "anchor"; "appendTo": "appendTo"; "autoComplete": "autoComplete"; "autoSelect": "autoSelect"; "bubbleEvents": "bubbleEvents"; "centered": "centered"; "changeOnSpin": "changeOnSpin"; "clearable": "clearable"; "cls": "cls"; "config": "config"; "constrainTo": "constrainTo"; "contentElementCls": "contentElementCls"; "decimalPrecision": "decimalPrecision"; "defaultBindProperty": "defaultBindProperty"; "dock": "dock"; "draggable": "draggable"; "editable": "editable"; "floating": "floating"; "format": "format"; "hideAnimation": "hideAnimation"; "highlightExternalChange": "highlightExternalChange"; "hint": "hint"; "hintHtml": "hintHtml"; "htmlCls": "htmlCls"; "inputAlign": "inputAlign"; "inputAttributes": "inputAttributes"; "inputType": "inputType"; "inputWidth": "inputWidth"; "insertBefore": "insertBefore"; "insertFirst": "insertFirst"; "keyStrokeChangeDelay": "keyStrokeChangeDelay"; "labelCls": "labelCls"; "labelPosition": "labelPosition"; "labels": "labels"; "labelWidth": "labelWidth"; "largeStep": "largeStep"; "leadingZeroes": "leadingZeroes"; "listeners": "listeners"; "localeClass": "localeClass"; "localizableProperties": "localizableProperties"; "maskDefaults": "maskDefaults"; "masked": "masked"; "max": "max"; "min": "min"; "monitorResize": "monitorResize"; "name": "name"; "owner": "owner"; "placeholder": "placeholder"; "positioned": "positioned"; "preventTooltipOnTouch": "preventTooltipOnTouch"; "required": "required"; "revertOnEscape": "revertOnEscape"; "ripple": "ripple"; "rootElement": "rootElement"; "scrollAction": "scrollAction"; "showAnimation": "showAnimation"; "tab": "tab"; "tag": "tag"; "textAlign": "textAlign"; "title": "title"; "weight": "weight"; "alignSelf": "alignSelf"; "badge": "badge"; "content": "content"; "dataset": "dataset"; "disabled": "disabled"; "extraData": "extraData"; "flex": "flex"; "height": "height"; "hidden": "hidden"; "html": "html"; "id": "id"; "label": "label"; "margin": "margin"; "maxHeight": "maxHeight"; "maxWidth": "maxWidth"; "minHeight": "minHeight"; "minWidth": "minWidth"; "readOnly": "readOnly"; "scrollable": "scrollable"; "step": "step"; "tooltip": "tooltip"; "triggers": "triggers"; "value": "value"; "width": "width"; "x": "x"; "y": "y"; "anchorSize": "anchorSize"; }, { "onAction": "onAction"; "onBeforeDestroy": "onBeforeDestroy"; "onBeforeHide": "onBeforeHide"; "onBeforeShow": "onBeforeShow"; "onCatchAll": "onCatchAll"; "onChange": "onChange"; "onClear": "onClear"; "onDestroy": "onDestroy"; "onFocusIn": "onFocusIn"; "onFocusOut": "onFocusOut"; "onHide": "onHide"; "onInput": "onInput"; "onPaint": "onPaint"; "onReadOnly": "onReadOnly"; "onResize": "onResize"; "onShow": "onShow"; "onTrigger": "onTrigger"; }, never, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJ5bnR1bS1udW1iZXItZmllbGQuY29tcG9uZW50LmQudHMiLCJzb3VyY2VzIjpbImJyeW50dW0tbnVtYmVyLWZpZWxkLmNvbXBvbmVudC5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEFuZ3VsYXIgd3JhcHBlciBmb3IgQnJ5bnR1bSBOdW1iZXJGaWVsZFxuICovXG5pbXBvcnQgeyBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIE9uRGVzdHJveSwgT25Jbml0LCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCYXNlLCBNYXNrLCBNYXNrQ29uZmlnLCBOdW1iZXJGb3JtYXQsIE51bWJlckZvcm1hdENvbmZpZywgUmVjdGFuZ2xlLCBTY3JvbGxlciwgU2Nyb2xsZXJDb25maWcsIFdpZGdldCB9IGZyb20gJ0BicnludHVtL3NjaGVkdWxlci9zY2hlZHVsZXIubGl0ZS51bWQuanMnO1xuaW1wb3J0IHsgTnVtYmVyRmllbGQgfSBmcm9tICdAYnJ5bnR1bS9zY2hlZHVsZXIvc2NoZWR1bGVyLmxpdGUudW1kLmpzJztcbmV4cG9ydCBkZWNsYXJlIGNsYXNzIEJyeW50dW1OdW1iZXJGaWVsZENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgICBzdGF0aWMgaW5zdGFuY2VDbGFzczogdHlwZW9mIE51bWJlckZpZWxkO1xuICAgIHByaXZhdGUgc3RhdGljIGJyeW50dW1GZWF0dXJlTmFtZXM7XG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bUNvbmZpZ3M7XG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bUNvbmZpZ3NPbmx5O1xuICAgIHByaXZhdGUgc3RhdGljIGJyeW50dW1Qcm9wcztcbiAgICBwcml2YXRlIGVsZW1lbnRSZWY7XG4gICAgaW5zdGFuY2U6IE51bWJlckZpZWxkO1xuICAgIHByaXZhdGUgYnJ5bnR1bUNvbmZpZztcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50OiBFbGVtZW50UmVmKTtcbiAgICBhZG9wdDogSFRNTEVsZW1lbnQgfCBzdHJpbmc7XG4gICAgYWxpZ246IG9iamVjdCB8IHN0cmluZztcbiAgICBhbmNob3I6IGJvb2xlYW47XG4gICAgYXBwZW5kVG86IEhUTUxFbGVtZW50IHwgc3RyaW5nO1xuICAgIGF1dG9Db21wbGV0ZTogc3RyaW5nO1xuICAgIGF1dG9TZWxlY3Q6IGJvb2xlYW47XG4gICAgYnViYmxlRXZlbnRzOiBvYmplY3Q7XG4gICAgY2VudGVyZWQ6IGJvb2xlYW47XG4gICAgY2hhbmdlT25TcGluOiBib29sZWFuIHwgbnVtYmVyO1xuICAgIGNsZWFyYWJsZTogYm9vbGVhbiB8IG9iamVjdDtcbiAgICBjbHM6IHN0cmluZyB8IG9iamVjdDtcbiAgICBjb25maWc6IG9iamVjdDtcbiAgICBjb25zdHJhaW5UbzogSFRNTEVsZW1lbnQgfCBXaWRnZXQgfCBSZWN0YW5nbGU7XG4gICAgY29udGVudEVsZW1lbnRDbHM6IHN0cmluZyB8IG9iamVjdDtcbiAgICBkZWNpbWFsUHJlY2lzaW9uOiBudW1iZXI7XG4gICAgZGVmYXVsdEJpbmRQcm9wZXJ0eTogc3RyaW5nO1xuICAgIGRvY2s6IHN0cmluZztcbiAgICBkcmFnZ2FibGU6IGJvb2xlYW4gfCBvYmplY3Q7XG4gICAgZWRpdGFibGU6IGJvb2xlYW47XG4gICAgZmxvYXRpbmc6IGJvb2xlYW47XG4gICAgZm9ybWF0OiBzdHJpbmcgfCBvYmplY3QgfCBOdW1iZXJGb3JtYXQgfCBQYXJ0aWFsPE51bWJlckZvcm1hdENvbmZpZz47XG4gICAgaGlkZUFuaW1hdGlvbjogYm9vbGVhbiB8IG9iamVjdDtcbiAgICBoaWdobGlnaHRFeHRlcm5hbENoYW5nZTogYm9vbGVhbjtcbiAgICBoaW50OiBzdHJpbmcgfCBGdW5jdGlvbjtcbiAgICBoaW50SHRtbDogc3RyaW5nIHwgRnVuY3Rpb247XG4gICAgaHRtbENsczogc3RyaW5nIHwgb2JqZWN0O1xuICAgIGlucHV0QWxpZ246IHN0cmluZztcbiAgICBpbnB1dEF0dHJpYnV0ZXM6IG9iamVjdDtcbiAgICBpbnB1dFR5cGU6IHN0cmluZztcbiAgICBpbnB1dFdpZHRoOiBzdHJpbmcgfCBudW1iZXI7XG4gICAgaW5zZXJ0QmVmb3JlOiBIVE1MRWxlbWVudCB8IHN0cmluZztcbiAgICBpbnNlcnRGaXJzdDogSFRNTEVsZW1lbnQgfCBzdHJpbmc7XG4gICAga2V5U3Ryb2tlQ2hhbmdlRGVsYXk6IG51bWJlcjtcbiAgICBsYWJlbENsczogc3RyaW5nIHwgb2JqZWN0O1xuICAgIGxhYmVsUG9zaXRpb246IHN0cmluZztcbiAgICBsYWJlbHM6IG9iamVjdDtcbiAgICBsYWJlbFdpZHRoOiBzdHJpbmcgfCBudW1iZXI7XG4gICAgbGFyZ2VTdGVwOiBudW1iZXI7XG4gICAgbGVhZGluZ1plcm9lczogbnVtYmVyO1xuICAgIGxpc3RlbmVyczogb2JqZWN0O1xuICAgIGxvY2FsZUNsYXNzOiBCYXNlO1xuICAgIGxvY2FsaXphYmxlUHJvcGVydGllczogc3RyaW5nW107XG4gICAgbWFza0RlZmF1bHRzOiBvYmplY3QgfCBNYXNrIHwgUGFydGlhbDxNYXNrQ29uZmlnPjtcbiAgICBtYXNrZWQ6IGJvb2xlYW4gfCBzdHJpbmcgfCBvYmplY3QgfCBNYXNrIHwgUGFydGlhbDxNYXNrQ29uZmlnPjtcbiAgICBtYXg6IG51bWJlcjtcbiAgICBtaW46IG51bWJlcjtcbiAgICBtb25pdG9yUmVzaXplOiBib29sZWFuO1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBvd25lcjogV2lkZ2V0O1xuICAgIHBsYWNlaG9sZGVyOiBzdHJpbmc7XG4gICAgcG9zaXRpb25lZDogYm9vbGVhbjtcbiAgICBwcmV2ZW50VG9vbHRpcE9uVG91Y2g6IGJvb2xlYW47XG4gICAgcmVxdWlyZWQ6IGJvb2xlYW47XG4gICAgcmV2ZXJ0T25Fc2NhcGU6IGJvb2xlYW47XG4gICAgcmlwcGxlOiBib29sZWFuIHwgb2JqZWN0O1xuICAgIHJvb3RFbGVtZW50OiBTaGFkb3dSb290O1xuICAgIHNjcm9sbEFjdGlvbjogc3RyaW5nO1xuICAgIHNob3dBbmltYXRpb246IGJvb2xlYW4gfCBvYmplY3Q7XG4gICAgdGFiOiBib29sZWFuIHwgb2JqZWN0O1xuICAgIHRhZzogc3RyaW5nO1xuICAgIHRleHRBbGlnbjogc3RyaW5nO1xuICAgIHRpdGxlOiBzdHJpbmc7XG4gICAgd2VpZ2h0OiBudW1iZXI7XG4gICAgYWxpZ25TZWxmOiBzdHJpbmc7XG4gICAgYmFkZ2U6IHN0cmluZztcbiAgICBjb250ZW50OiBzdHJpbmc7XG4gICAgZGF0YXNldDogb2JqZWN0O1xuICAgIGRpc2FibGVkOiBib29sZWFuO1xuICAgIGV4dHJhRGF0YTogYm9vbGVhbiB8IG51bWJlciB8IG9iamVjdCB8IHN0cmluZztcbiAgICBmbGV4OiBudW1iZXIgfCBzdHJpbmc7XG4gICAgaGVpZ2h0OiBudW1iZXIgfCBzdHJpbmc7XG4gICAgaGlkZGVuOiBib29sZWFuO1xuICAgIGh0bWw6IHN0cmluZztcbiAgICBpZDogc3RyaW5nO1xuICAgIGxhYmVsOiBzdHJpbmc7XG4gICAgbWFyZ2luOiBudW1iZXIgfCBzdHJpbmc7XG4gICAgbWF4SGVpZ2h0OiBudW1iZXIgfCBzdHJpbmc7XG4gICAgbWF4V2lkdGg6IG51bWJlciB8IHN0cmluZztcbiAgICBtaW5IZWlnaHQ6IG51bWJlciB8IHN0cmluZztcbiAgICBtaW5XaWR0aDogbnVtYmVyIHwgc3RyaW5nO1xuICAgIHJlYWRPbmx5OiBib29sZWFuO1xuICAgIHNjcm9sbGFibGU6IGJvb2xlYW4gfCBTY3JvbGxlciB8IG9iamVjdCB8IFBhcnRpYWw8U2Nyb2xsZXJDb25maWc+O1xuICAgIHN0ZXA6IG51bWJlcjtcbiAgICB0b29sdGlwOiBvYmplY3QgfCBzdHJpbmc7XG4gICAgdHJpZ2dlcnM6IG9iamVjdDtcbiAgICB2YWx1ZTogbnVtYmVyIHwgYW55O1xuICAgIHdpZHRoOiBudW1iZXIgfCBzdHJpbmc7XG4gICAgeDogbnVtYmVyO1xuICAgIHk6IG51bWJlcjtcbiAgICBhbmNob3JTaXplOiBudW1iZXJbXTtcbiAgICBvbkFjdGlvbjogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25CZWZvcmVEZXN0cm95OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbkJlZm9yZUhpZGU6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uQmVmb3JlU2hvdzogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25DYXRjaEFsbDogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25DaGFuZ2U6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uQ2xlYXI6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uRGVzdHJveTogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25Gb2N1c0luOiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbkZvY3VzT3V0OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbkhpZGU6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uSW5wdXQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uUGFpbnQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uUmVhZE9ubHk6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uUmVzaXplOiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvblNob3c6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uVHJpZ2dlcjogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGFuZCBhcHBlbmQgdGhlIHVuZGVybHlpbmcgd2lkZ2V0XG4gICAgICovXG4gICAgbmdPbkluaXQoKTogdm9pZDtcbiAgICAvKipcbiAgICAgKiBXYXRjaCBmb3IgY2hhbmdlc1xuICAgICAqIEBwYXJhbSBjaGFuZ2VzXG4gICAgICovXG4gICAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQ7XG4gICAgLyoqXG4gICAgICogRGVzdHJveSB0aGUgY29tcG9uZW50XG4gICAgICovXG4gICAgbmdPbkRlc3Ryb3koKTogdm9pZDtcbn1cbiJdfQ==