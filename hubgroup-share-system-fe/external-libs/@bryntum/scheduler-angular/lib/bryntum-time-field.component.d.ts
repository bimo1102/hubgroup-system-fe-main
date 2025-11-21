/**
 * Angular wrapper for Bryntum TimeField
 */
import { ElementRef, EventEmitter, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Base, Mask, MaskConfig, Rectangle, Scroller, ScrollerConfig, Widget } from '@bryntum/scheduler/scheduler.lite.umd.js';
import { TimeField } from '@bryntum/scheduler/scheduler.lite.umd.js';
import * as ɵngcc0 from '@angular/core';
export declare class BryntumTimeFieldComponent implements OnInit, OnDestroy {
    static instanceClass: typeof TimeField;
    private static bryntumFeatureNames;
    private static bryntumConfigs;
    private static bryntumConfigsOnly;
    private static bryntumProps;
    private elementRef;
    instance: TimeField;
    private bryntumConfig;
    constructor(element: ElementRef);
    adopt: HTMLElement | string;
    align: object | string;
    anchor: boolean;
    appendTo: HTMLElement | string;
    autoClose: boolean;
    autoComplete: string;
    autoExpand: boolean;
    autoSelect: boolean;
    bubbleEvents: object;
    centered: boolean;
    clearable: boolean | object;
    cls: string | object;
    config: object;
    constrainTo: HTMLElement | Widget | Rectangle;
    contentElementCls: string | object;
    defaultBindProperty: string;
    dock: string;
    draggable: boolean | object;
    editable: boolean;
    floating: boolean;
    hideAnimation: boolean | object;
    highlightExternalChange: boolean;
    hint: string | Function;
    hintHtml: string | Function;
    htmlCls: string | object;
    inputAlign: string;
    inputAttributes: object;
    inputWidth: string | number;
    insertBefore: HTMLElement | string;
    insertFirst: HTMLElement | string;
    keyStrokeChangeDelay: number;
    labelCls: string | object;
    labelPosition: string;
    labels: object;
    labelWidth: string | number;
    listeners: object;
    localeClass: Base;
    localizableProperties: string[];
    maskDefaults: object | Mask | Partial<MaskConfig>;
    masked: boolean | string | object | Mask | Partial<MaskConfig>;
    maxLength: number;
    minLength: number;
    monitorResize: boolean;
    name: string;
    owner: Widget;
    picker: object;
    pickerAlignElement: string;
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
    tabIndex: number;
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
    format: string;
    height: number | string;
    hidden: boolean;
    html: string;
    id: string;
    label: string;
    margin: number | string;
    max: Date | string;
    maxHeight: number | string;
    maxWidth: number | string;
    min: Date | string;
    minHeight: number | string;
    minWidth: number | string;
    readOnly: boolean;
    scrollable: boolean | Scroller | object | Partial<ScrollerConfig>;
    step: number | object | string;
    tooltip: object | string;
    triggers: object;
    value: Date | string | any;
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
    static ɵfac: ɵngcc0.ɵɵFactoryDef<BryntumTimeFieldComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<BryntumTimeFieldComponent, "bryntum-time-field", never, { "adopt": "adopt"; "align": "align"; "anchor": "anchor"; "appendTo": "appendTo"; "autoClose": "autoClose"; "autoComplete": "autoComplete"; "autoExpand": "autoExpand"; "autoSelect": "autoSelect"; "bubbleEvents": "bubbleEvents"; "centered": "centered"; "clearable": "clearable"; "cls": "cls"; "config": "config"; "constrainTo": "constrainTo"; "contentElementCls": "contentElementCls"; "defaultBindProperty": "defaultBindProperty"; "dock": "dock"; "draggable": "draggable"; "editable": "editable"; "floating": "floating"; "hideAnimation": "hideAnimation"; "highlightExternalChange": "highlightExternalChange"; "hint": "hint"; "hintHtml": "hintHtml"; "htmlCls": "htmlCls"; "inputAlign": "inputAlign"; "inputAttributes": "inputAttributes"; "inputWidth": "inputWidth"; "insertBefore": "insertBefore"; "insertFirst": "insertFirst"; "keyStrokeChangeDelay": "keyStrokeChangeDelay"; "labelCls": "labelCls"; "labelPosition": "labelPosition"; "labels": "labels"; "labelWidth": "labelWidth"; "listeners": "listeners"; "localeClass": "localeClass"; "localizableProperties": "localizableProperties"; "maskDefaults": "maskDefaults"; "masked": "masked"; "maxLength": "maxLength"; "minLength": "minLength"; "monitorResize": "monitorResize"; "name": "name"; "owner": "owner"; "picker": "picker"; "pickerAlignElement": "pickerAlignElement"; "placeholder": "placeholder"; "positioned": "positioned"; "preventTooltipOnTouch": "preventTooltipOnTouch"; "required": "required"; "revertOnEscape": "revertOnEscape"; "ripple": "ripple"; "rootElement": "rootElement"; "scrollAction": "scrollAction"; "showAnimation": "showAnimation"; "tab": "tab"; "tabIndex": "tabIndex"; "tag": "tag"; "textAlign": "textAlign"; "title": "title"; "weight": "weight"; "alignSelf": "alignSelf"; "badge": "badge"; "content": "content"; "dataset": "dataset"; "disabled": "disabled"; "extraData": "extraData"; "flex": "flex"; "format": "format"; "height": "height"; "hidden": "hidden"; "html": "html"; "id": "id"; "label": "label"; "margin": "margin"; "max": "max"; "maxHeight": "maxHeight"; "maxWidth": "maxWidth"; "min": "min"; "minHeight": "minHeight"; "minWidth": "minWidth"; "readOnly": "readOnly"; "scrollable": "scrollable"; "step": "step"; "tooltip": "tooltip"; "triggers": "triggers"; "value": "value"; "width": "width"; "x": "x"; "y": "y"; "anchorSize": "anchorSize"; }, { "onAction": "onAction"; "onBeforeDestroy": "onBeforeDestroy"; "onBeforeHide": "onBeforeHide"; "onBeforeShow": "onBeforeShow"; "onCatchAll": "onCatchAll"; "onChange": "onChange"; "onClear": "onClear"; "onDestroy": "onDestroy"; "onFocusIn": "onFocusIn"; "onFocusOut": "onFocusOut"; "onHide": "onHide"; "onInput": "onInput"; "onPaint": "onPaint"; "onReadOnly": "onReadOnly"; "onResize": "onResize"; "onShow": "onShow"; "onTrigger": "onTrigger"; }, never, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJ5bnR1bS10aW1lLWZpZWxkLmNvbXBvbmVudC5kLnRzIiwic291cmNlcyI6WyJicnludHVtLXRpbWUtZmllbGQuY29tcG9uZW50LmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEFuZ3VsYXIgd3JhcHBlciBmb3IgQnJ5bnR1bSBUaW1lRmllbGRcbiAqL1xuaW1wb3J0IHsgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBPbkRlc3Ryb3ksIE9uSW5pdCwgU2ltcGxlQ2hhbmdlcyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQmFzZSwgTWFzaywgTWFza0NvbmZpZywgUmVjdGFuZ2xlLCBTY3JvbGxlciwgU2Nyb2xsZXJDb25maWcsIFdpZGdldCB9IGZyb20gJ0BicnludHVtL3NjaGVkdWxlci9zY2hlZHVsZXIubGl0ZS51bWQuanMnO1xuaW1wb3J0IHsgVGltZUZpZWxkIH0gZnJvbSAnQGJyeW50dW0vc2NoZWR1bGVyL3NjaGVkdWxlci5saXRlLnVtZC5qcyc7XG5leHBvcnQgZGVjbGFyZSBjbGFzcyBCcnludHVtVGltZUZpZWxkQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICAgIHN0YXRpYyBpbnN0YW5jZUNsYXNzOiB0eXBlb2YgVGltZUZpZWxkO1xuICAgIHByaXZhdGUgc3RhdGljIGJyeW50dW1GZWF0dXJlTmFtZXM7XG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bUNvbmZpZ3M7XG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bUNvbmZpZ3NPbmx5O1xuICAgIHByaXZhdGUgc3RhdGljIGJyeW50dW1Qcm9wcztcbiAgICBwcml2YXRlIGVsZW1lbnRSZWY7XG4gICAgaW5zdGFuY2U6IFRpbWVGaWVsZDtcbiAgICBwcml2YXRlIGJyeW50dW1Db25maWc7XG4gICAgY29uc3RydWN0b3IoZWxlbWVudDogRWxlbWVudFJlZik7XG4gICAgYWRvcHQ6IEhUTUxFbGVtZW50IHwgc3RyaW5nO1xuICAgIGFsaWduOiBvYmplY3QgfCBzdHJpbmc7XG4gICAgYW5jaG9yOiBib29sZWFuO1xuICAgIGFwcGVuZFRvOiBIVE1MRWxlbWVudCB8IHN0cmluZztcbiAgICBhdXRvQ2xvc2U6IGJvb2xlYW47XG4gICAgYXV0b0NvbXBsZXRlOiBzdHJpbmc7XG4gICAgYXV0b0V4cGFuZDogYm9vbGVhbjtcbiAgICBhdXRvU2VsZWN0OiBib29sZWFuO1xuICAgIGJ1YmJsZUV2ZW50czogb2JqZWN0O1xuICAgIGNlbnRlcmVkOiBib29sZWFuO1xuICAgIGNsZWFyYWJsZTogYm9vbGVhbiB8IG9iamVjdDtcbiAgICBjbHM6IHN0cmluZyB8IG9iamVjdDtcbiAgICBjb25maWc6IG9iamVjdDtcbiAgICBjb25zdHJhaW5UbzogSFRNTEVsZW1lbnQgfCBXaWRnZXQgfCBSZWN0YW5nbGU7XG4gICAgY29udGVudEVsZW1lbnRDbHM6IHN0cmluZyB8IG9iamVjdDtcbiAgICBkZWZhdWx0QmluZFByb3BlcnR5OiBzdHJpbmc7XG4gICAgZG9jazogc3RyaW5nO1xuICAgIGRyYWdnYWJsZTogYm9vbGVhbiB8IG9iamVjdDtcbiAgICBlZGl0YWJsZTogYm9vbGVhbjtcbiAgICBmbG9hdGluZzogYm9vbGVhbjtcbiAgICBoaWRlQW5pbWF0aW9uOiBib29sZWFuIHwgb2JqZWN0O1xuICAgIGhpZ2hsaWdodEV4dGVybmFsQ2hhbmdlOiBib29sZWFuO1xuICAgIGhpbnQ6IHN0cmluZyB8IEZ1bmN0aW9uO1xuICAgIGhpbnRIdG1sOiBzdHJpbmcgfCBGdW5jdGlvbjtcbiAgICBodG1sQ2xzOiBzdHJpbmcgfCBvYmplY3Q7XG4gICAgaW5wdXRBbGlnbjogc3RyaW5nO1xuICAgIGlucHV0QXR0cmlidXRlczogb2JqZWN0O1xuICAgIGlucHV0V2lkdGg6IHN0cmluZyB8IG51bWJlcjtcbiAgICBpbnNlcnRCZWZvcmU6IEhUTUxFbGVtZW50IHwgc3RyaW5nO1xuICAgIGluc2VydEZpcnN0OiBIVE1MRWxlbWVudCB8IHN0cmluZztcbiAgICBrZXlTdHJva2VDaGFuZ2VEZWxheTogbnVtYmVyO1xuICAgIGxhYmVsQ2xzOiBzdHJpbmcgfCBvYmplY3Q7XG4gICAgbGFiZWxQb3NpdGlvbjogc3RyaW5nO1xuICAgIGxhYmVsczogb2JqZWN0O1xuICAgIGxhYmVsV2lkdGg6IHN0cmluZyB8IG51bWJlcjtcbiAgICBsaXN0ZW5lcnM6IG9iamVjdDtcbiAgICBsb2NhbGVDbGFzczogQmFzZTtcbiAgICBsb2NhbGl6YWJsZVByb3BlcnRpZXM6IHN0cmluZ1tdO1xuICAgIG1hc2tEZWZhdWx0czogb2JqZWN0IHwgTWFzayB8IFBhcnRpYWw8TWFza0NvbmZpZz47XG4gICAgbWFza2VkOiBib29sZWFuIHwgc3RyaW5nIHwgb2JqZWN0IHwgTWFzayB8IFBhcnRpYWw8TWFza0NvbmZpZz47XG4gICAgbWF4TGVuZ3RoOiBudW1iZXI7XG4gICAgbWluTGVuZ3RoOiBudW1iZXI7XG4gICAgbW9uaXRvclJlc2l6ZTogYm9vbGVhbjtcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgb3duZXI6IFdpZGdldDtcbiAgICBwaWNrZXI6IG9iamVjdDtcbiAgICBwaWNrZXJBbGlnbkVsZW1lbnQ6IHN0cmluZztcbiAgICBwbGFjZWhvbGRlcjogc3RyaW5nO1xuICAgIHBvc2l0aW9uZWQ6IGJvb2xlYW47XG4gICAgcHJldmVudFRvb2x0aXBPblRvdWNoOiBib29sZWFuO1xuICAgIHJlcXVpcmVkOiBib29sZWFuO1xuICAgIHJldmVydE9uRXNjYXBlOiBib29sZWFuO1xuICAgIHJpcHBsZTogYm9vbGVhbiB8IG9iamVjdDtcbiAgICByb290RWxlbWVudDogU2hhZG93Um9vdDtcbiAgICBzY3JvbGxBY3Rpb246IHN0cmluZztcbiAgICBzaG93QW5pbWF0aW9uOiBib29sZWFuIHwgb2JqZWN0O1xuICAgIHRhYjogYm9vbGVhbiB8IG9iamVjdDtcbiAgICB0YWJJbmRleDogbnVtYmVyO1xuICAgIHRhZzogc3RyaW5nO1xuICAgIHRleHRBbGlnbjogc3RyaW5nO1xuICAgIHRpdGxlOiBzdHJpbmc7XG4gICAgd2VpZ2h0OiBudW1iZXI7XG4gICAgYWxpZ25TZWxmOiBzdHJpbmc7XG4gICAgYmFkZ2U6IHN0cmluZztcbiAgICBjb250ZW50OiBzdHJpbmc7XG4gICAgZGF0YXNldDogb2JqZWN0O1xuICAgIGRpc2FibGVkOiBib29sZWFuO1xuICAgIGV4dHJhRGF0YTogYm9vbGVhbiB8IG51bWJlciB8IG9iamVjdCB8IHN0cmluZztcbiAgICBmbGV4OiBudW1iZXIgfCBzdHJpbmc7XG4gICAgZm9ybWF0OiBzdHJpbmc7XG4gICAgaGVpZ2h0OiBudW1iZXIgfCBzdHJpbmc7XG4gICAgaGlkZGVuOiBib29sZWFuO1xuICAgIGh0bWw6IHN0cmluZztcbiAgICBpZDogc3RyaW5nO1xuICAgIGxhYmVsOiBzdHJpbmc7XG4gICAgbWFyZ2luOiBudW1iZXIgfCBzdHJpbmc7XG4gICAgbWF4OiBEYXRlIHwgc3RyaW5nO1xuICAgIG1heEhlaWdodDogbnVtYmVyIHwgc3RyaW5nO1xuICAgIG1heFdpZHRoOiBudW1iZXIgfCBzdHJpbmc7XG4gICAgbWluOiBEYXRlIHwgc3RyaW5nO1xuICAgIG1pbkhlaWdodDogbnVtYmVyIHwgc3RyaW5nO1xuICAgIG1pbldpZHRoOiBudW1iZXIgfCBzdHJpbmc7XG4gICAgcmVhZE9ubHk6IGJvb2xlYW47XG4gICAgc2Nyb2xsYWJsZTogYm9vbGVhbiB8IFNjcm9sbGVyIHwgb2JqZWN0IHwgUGFydGlhbDxTY3JvbGxlckNvbmZpZz47XG4gICAgc3RlcDogbnVtYmVyIHwgb2JqZWN0IHwgc3RyaW5nO1xuICAgIHRvb2x0aXA6IG9iamVjdCB8IHN0cmluZztcbiAgICB0cmlnZ2Vyczogb2JqZWN0O1xuICAgIHZhbHVlOiBEYXRlIHwgc3RyaW5nIHwgYW55O1xuICAgIHdpZHRoOiBudW1iZXIgfCBzdHJpbmc7XG4gICAgeDogbnVtYmVyO1xuICAgIHk6IG51bWJlcjtcbiAgICBhbmNob3JTaXplOiBudW1iZXJbXTtcbiAgICBvbkFjdGlvbjogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25CZWZvcmVEZXN0cm95OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbkJlZm9yZUhpZGU6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uQmVmb3JlU2hvdzogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25DYXRjaEFsbDogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25DaGFuZ2U6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uQ2xlYXI6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uRGVzdHJveTogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25Gb2N1c0luOiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbkZvY3VzT3V0OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbkhpZGU6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uSW5wdXQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uUGFpbnQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uUmVhZE9ubHk6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uUmVzaXplOiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvblNob3c6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uVHJpZ2dlcjogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGFuZCBhcHBlbmQgdGhlIHVuZGVybHlpbmcgd2lkZ2V0XG4gICAgICovXG4gICAgbmdPbkluaXQoKTogdm9pZDtcbiAgICAvKipcbiAgICAgKiBXYXRjaCBmb3IgY2hhbmdlc1xuICAgICAqIEBwYXJhbSBjaGFuZ2VzXG4gICAgICovXG4gICAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQ7XG4gICAgLyoqXG4gICAgICogRGVzdHJveSB0aGUgY29tcG9uZW50XG4gICAgICovXG4gICAgbmdPbkRlc3Ryb3koKTogdm9pZDtcbn1cbiJdfQ==