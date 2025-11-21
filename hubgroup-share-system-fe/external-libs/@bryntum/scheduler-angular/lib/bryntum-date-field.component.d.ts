/**
 * Angular wrapper for Bryntum DateField
 */
import { ElementRef, EventEmitter, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Base, Mask, MaskConfig, Rectangle, Scroller, ScrollerConfig, Widget } from '@bryntum/scheduler/scheduler.lite.umd.js';
import { DateField } from '@bryntum/scheduler/scheduler.lite.umd.js';
import * as ɵngcc0 from '@angular/core';
export declare class BryntumDateFieldComponent implements OnInit, OnDestroy {
    static instanceClass: typeof DateField;
    private static bryntumFeatureNames;
    private static bryntumConfigs;
    private static bryntumConfigsOnly;
    private static bryntumProps;
    private elementRef;
    instance: DateField;
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
    keepTime: boolean | Date | string;
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
    pickerFormat: string;
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
    weekStartDay: number;
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
    value: Date | string;
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
    static ɵfac: ɵngcc0.ɵɵFactoryDef<BryntumDateFieldComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<BryntumDateFieldComponent, "bryntum-date-field", never, { "adopt": "adopt"; "align": "align"; "anchor": "anchor"; "appendTo": "appendTo"; "autoClose": "autoClose"; "autoComplete": "autoComplete"; "autoExpand": "autoExpand"; "autoSelect": "autoSelect"; "bubbleEvents": "bubbleEvents"; "centered": "centered"; "clearable": "clearable"; "cls": "cls"; "config": "config"; "constrainTo": "constrainTo"; "contentElementCls": "contentElementCls"; "defaultBindProperty": "defaultBindProperty"; "dock": "dock"; "draggable": "draggable"; "editable": "editable"; "floating": "floating"; "hideAnimation": "hideAnimation"; "highlightExternalChange": "highlightExternalChange"; "hint": "hint"; "hintHtml": "hintHtml"; "htmlCls": "htmlCls"; "inputAlign": "inputAlign"; "inputAttributes": "inputAttributes"; "inputWidth": "inputWidth"; "insertBefore": "insertBefore"; "insertFirst": "insertFirst"; "keepTime": "keepTime"; "keyStrokeChangeDelay": "keyStrokeChangeDelay"; "labelCls": "labelCls"; "labelPosition": "labelPosition"; "labels": "labels"; "labelWidth": "labelWidth"; "listeners": "listeners"; "localeClass": "localeClass"; "localizableProperties": "localizableProperties"; "maskDefaults": "maskDefaults"; "masked": "masked"; "maxLength": "maxLength"; "minLength": "minLength"; "monitorResize": "monitorResize"; "name": "name"; "owner": "owner"; "picker": "picker"; "pickerAlignElement": "pickerAlignElement"; "pickerFormat": "pickerFormat"; "placeholder": "placeholder"; "positioned": "positioned"; "preventTooltipOnTouch": "preventTooltipOnTouch"; "required": "required"; "revertOnEscape": "revertOnEscape"; "ripple": "ripple"; "rootElement": "rootElement"; "scrollAction": "scrollAction"; "showAnimation": "showAnimation"; "tab": "tab"; "tabIndex": "tabIndex"; "tag": "tag"; "textAlign": "textAlign"; "title": "title"; "weekStartDay": "weekStartDay"; "weight": "weight"; "alignSelf": "alignSelf"; "badge": "badge"; "content": "content"; "dataset": "dataset"; "disabled": "disabled"; "extraData": "extraData"; "flex": "flex"; "format": "format"; "height": "height"; "hidden": "hidden"; "html": "html"; "id": "id"; "label": "label"; "margin": "margin"; "max": "max"; "maxHeight": "maxHeight"; "maxWidth": "maxWidth"; "min": "min"; "minHeight": "minHeight"; "minWidth": "minWidth"; "readOnly": "readOnly"; "scrollable": "scrollable"; "step": "step"; "tooltip": "tooltip"; "triggers": "triggers"; "value": "value"; "width": "width"; "x": "x"; "y": "y"; "anchorSize": "anchorSize"; }, { "onAction": "onAction"; "onBeforeDestroy": "onBeforeDestroy"; "onBeforeHide": "onBeforeHide"; "onBeforeShow": "onBeforeShow"; "onCatchAll": "onCatchAll"; "onChange": "onChange"; "onClear": "onClear"; "onDestroy": "onDestroy"; "onFocusIn": "onFocusIn"; "onFocusOut": "onFocusOut"; "onHide": "onHide"; "onInput": "onInput"; "onPaint": "onPaint"; "onReadOnly": "onReadOnly"; "onResize": "onResize"; "onShow": "onShow"; "onTrigger": "onTrigger"; }, never, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJ5bnR1bS1kYXRlLWZpZWxkLmNvbXBvbmVudC5kLnRzIiwic291cmNlcyI6WyJicnludHVtLWRhdGUtZmllbGQuY29tcG9uZW50LmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEFuZ3VsYXIgd3JhcHBlciBmb3IgQnJ5bnR1bSBEYXRlRmllbGRcbiAqL1xuaW1wb3J0IHsgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBPbkRlc3Ryb3ksIE9uSW5pdCwgU2ltcGxlQ2hhbmdlcyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQmFzZSwgTWFzaywgTWFza0NvbmZpZywgUmVjdGFuZ2xlLCBTY3JvbGxlciwgU2Nyb2xsZXJDb25maWcsIFdpZGdldCB9IGZyb20gJ0BicnludHVtL3NjaGVkdWxlci9zY2hlZHVsZXIubGl0ZS51bWQuanMnO1xuaW1wb3J0IHsgRGF0ZUZpZWxkIH0gZnJvbSAnQGJyeW50dW0vc2NoZWR1bGVyL3NjaGVkdWxlci5saXRlLnVtZC5qcyc7XG5leHBvcnQgZGVjbGFyZSBjbGFzcyBCcnludHVtRGF0ZUZpZWxkQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICAgIHN0YXRpYyBpbnN0YW5jZUNsYXNzOiB0eXBlb2YgRGF0ZUZpZWxkO1xuICAgIHByaXZhdGUgc3RhdGljIGJyeW50dW1GZWF0dXJlTmFtZXM7XG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bUNvbmZpZ3M7XG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bUNvbmZpZ3NPbmx5O1xuICAgIHByaXZhdGUgc3RhdGljIGJyeW50dW1Qcm9wcztcbiAgICBwcml2YXRlIGVsZW1lbnRSZWY7XG4gICAgaW5zdGFuY2U6IERhdGVGaWVsZDtcbiAgICBwcml2YXRlIGJyeW50dW1Db25maWc7XG4gICAgY29uc3RydWN0b3IoZWxlbWVudDogRWxlbWVudFJlZik7XG4gICAgYWRvcHQ6IEhUTUxFbGVtZW50IHwgc3RyaW5nO1xuICAgIGFsaWduOiBvYmplY3QgfCBzdHJpbmc7XG4gICAgYW5jaG9yOiBib29sZWFuO1xuICAgIGFwcGVuZFRvOiBIVE1MRWxlbWVudCB8IHN0cmluZztcbiAgICBhdXRvQ2xvc2U6IGJvb2xlYW47XG4gICAgYXV0b0NvbXBsZXRlOiBzdHJpbmc7XG4gICAgYXV0b0V4cGFuZDogYm9vbGVhbjtcbiAgICBhdXRvU2VsZWN0OiBib29sZWFuO1xuICAgIGJ1YmJsZUV2ZW50czogb2JqZWN0O1xuICAgIGNlbnRlcmVkOiBib29sZWFuO1xuICAgIGNsZWFyYWJsZTogYm9vbGVhbiB8IG9iamVjdDtcbiAgICBjbHM6IHN0cmluZyB8IG9iamVjdDtcbiAgICBjb25maWc6IG9iamVjdDtcbiAgICBjb25zdHJhaW5UbzogSFRNTEVsZW1lbnQgfCBXaWRnZXQgfCBSZWN0YW5nbGU7XG4gICAgY29udGVudEVsZW1lbnRDbHM6IHN0cmluZyB8IG9iamVjdDtcbiAgICBkZWZhdWx0QmluZFByb3BlcnR5OiBzdHJpbmc7XG4gICAgZG9jazogc3RyaW5nO1xuICAgIGRyYWdnYWJsZTogYm9vbGVhbiB8IG9iamVjdDtcbiAgICBlZGl0YWJsZTogYm9vbGVhbjtcbiAgICBmbG9hdGluZzogYm9vbGVhbjtcbiAgICBoaWRlQW5pbWF0aW9uOiBib29sZWFuIHwgb2JqZWN0O1xuICAgIGhpZ2hsaWdodEV4dGVybmFsQ2hhbmdlOiBib29sZWFuO1xuICAgIGhpbnQ6IHN0cmluZyB8IEZ1bmN0aW9uO1xuICAgIGhpbnRIdG1sOiBzdHJpbmcgfCBGdW5jdGlvbjtcbiAgICBodG1sQ2xzOiBzdHJpbmcgfCBvYmplY3Q7XG4gICAgaW5wdXRBbGlnbjogc3RyaW5nO1xuICAgIGlucHV0QXR0cmlidXRlczogb2JqZWN0O1xuICAgIGlucHV0V2lkdGg6IHN0cmluZyB8IG51bWJlcjtcbiAgICBpbnNlcnRCZWZvcmU6IEhUTUxFbGVtZW50IHwgc3RyaW5nO1xuICAgIGluc2VydEZpcnN0OiBIVE1MRWxlbWVudCB8IHN0cmluZztcbiAgICBrZWVwVGltZTogYm9vbGVhbiB8IERhdGUgfCBzdHJpbmc7XG4gICAga2V5U3Ryb2tlQ2hhbmdlRGVsYXk6IG51bWJlcjtcbiAgICBsYWJlbENsczogc3RyaW5nIHwgb2JqZWN0O1xuICAgIGxhYmVsUG9zaXRpb246IHN0cmluZztcbiAgICBsYWJlbHM6IG9iamVjdDtcbiAgICBsYWJlbFdpZHRoOiBzdHJpbmcgfCBudW1iZXI7XG4gICAgbGlzdGVuZXJzOiBvYmplY3Q7XG4gICAgbG9jYWxlQ2xhc3M6IEJhc2U7XG4gICAgbG9jYWxpemFibGVQcm9wZXJ0aWVzOiBzdHJpbmdbXTtcbiAgICBtYXNrRGVmYXVsdHM6IG9iamVjdCB8IE1hc2sgfCBQYXJ0aWFsPE1hc2tDb25maWc+O1xuICAgIG1hc2tlZDogYm9vbGVhbiB8IHN0cmluZyB8IG9iamVjdCB8IE1hc2sgfCBQYXJ0aWFsPE1hc2tDb25maWc+O1xuICAgIG1heExlbmd0aDogbnVtYmVyO1xuICAgIG1pbkxlbmd0aDogbnVtYmVyO1xuICAgIG1vbml0b3JSZXNpemU6IGJvb2xlYW47XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIG93bmVyOiBXaWRnZXQ7XG4gICAgcGlja2VyOiBvYmplY3Q7XG4gICAgcGlja2VyQWxpZ25FbGVtZW50OiBzdHJpbmc7XG4gICAgcGlja2VyRm9ybWF0OiBzdHJpbmc7XG4gICAgcGxhY2Vob2xkZXI6IHN0cmluZztcbiAgICBwb3NpdGlvbmVkOiBib29sZWFuO1xuICAgIHByZXZlbnRUb29sdGlwT25Ub3VjaDogYm9vbGVhbjtcbiAgICByZXF1aXJlZDogYm9vbGVhbjtcbiAgICByZXZlcnRPbkVzY2FwZTogYm9vbGVhbjtcbiAgICByaXBwbGU6IGJvb2xlYW4gfCBvYmplY3Q7XG4gICAgcm9vdEVsZW1lbnQ6IFNoYWRvd1Jvb3Q7XG4gICAgc2Nyb2xsQWN0aW9uOiBzdHJpbmc7XG4gICAgc2hvd0FuaW1hdGlvbjogYm9vbGVhbiB8IG9iamVjdDtcbiAgICB0YWI6IGJvb2xlYW4gfCBvYmplY3Q7XG4gICAgdGFiSW5kZXg6IG51bWJlcjtcbiAgICB0YWc6IHN0cmluZztcbiAgICB0ZXh0QWxpZ246IHN0cmluZztcbiAgICB0aXRsZTogc3RyaW5nO1xuICAgIHdlZWtTdGFydERheTogbnVtYmVyO1xuICAgIHdlaWdodDogbnVtYmVyO1xuICAgIGFsaWduU2VsZjogc3RyaW5nO1xuICAgIGJhZGdlOiBzdHJpbmc7XG4gICAgY29udGVudDogc3RyaW5nO1xuICAgIGRhdGFzZXQ6IG9iamVjdDtcbiAgICBkaXNhYmxlZDogYm9vbGVhbjtcbiAgICBleHRyYURhdGE6IGJvb2xlYW4gfCBudW1iZXIgfCBvYmplY3QgfCBzdHJpbmc7XG4gICAgZmxleDogbnVtYmVyIHwgc3RyaW5nO1xuICAgIGZvcm1hdDogc3RyaW5nO1xuICAgIGhlaWdodDogbnVtYmVyIHwgc3RyaW5nO1xuICAgIGhpZGRlbjogYm9vbGVhbjtcbiAgICBodG1sOiBzdHJpbmc7XG4gICAgaWQ6IHN0cmluZztcbiAgICBsYWJlbDogc3RyaW5nO1xuICAgIG1hcmdpbjogbnVtYmVyIHwgc3RyaW5nO1xuICAgIG1heDogRGF0ZSB8IHN0cmluZztcbiAgICBtYXhIZWlnaHQ6IG51bWJlciB8IHN0cmluZztcbiAgICBtYXhXaWR0aDogbnVtYmVyIHwgc3RyaW5nO1xuICAgIG1pbjogRGF0ZSB8IHN0cmluZztcbiAgICBtaW5IZWlnaHQ6IG51bWJlciB8IHN0cmluZztcbiAgICBtaW5XaWR0aDogbnVtYmVyIHwgc3RyaW5nO1xuICAgIHJlYWRPbmx5OiBib29sZWFuO1xuICAgIHNjcm9sbGFibGU6IGJvb2xlYW4gfCBTY3JvbGxlciB8IG9iamVjdCB8IFBhcnRpYWw8U2Nyb2xsZXJDb25maWc+O1xuICAgIHN0ZXA6IG51bWJlciB8IG9iamVjdCB8IHN0cmluZztcbiAgICB0b29sdGlwOiBvYmplY3QgfCBzdHJpbmc7XG4gICAgdHJpZ2dlcnM6IG9iamVjdDtcbiAgICB2YWx1ZTogRGF0ZSB8IHN0cmluZztcbiAgICB3aWR0aDogbnVtYmVyIHwgc3RyaW5nO1xuICAgIHg6IG51bWJlcjtcbiAgICB5OiBudW1iZXI7XG4gICAgYW5jaG9yU2l6ZTogbnVtYmVyW107XG4gICAgb25BY3Rpb246IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uQmVmb3JlRGVzdHJveTogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25CZWZvcmVIaWRlOiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbkJlZm9yZVNob3c6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uQ2F0Y2hBbGw6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uQ2hhbmdlOiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbkNsZWFyOiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbkRlc3Ryb3k6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uRm9jdXNJbjogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25Gb2N1c091dDogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25IaWRlOiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbklucHV0OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvblBhaW50OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvblJlYWRPbmx5OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvblJlc2l6ZTogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25TaG93OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvblRyaWdnZXI6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhbmQgYXBwZW5kIHRoZSB1bmRlcmx5aW5nIHdpZGdldFxuICAgICAqL1xuICAgIG5nT25Jbml0KCk6IHZvaWQ7XG4gICAgLyoqXG4gICAgICogV2F0Y2ggZm9yIGNoYW5nZXNcbiAgICAgKiBAcGFyYW0gY2hhbmdlc1xuICAgICAqL1xuICAgIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkO1xuICAgIC8qKlxuICAgICAqIERlc3Ryb3kgdGhlIGNvbXBvbmVudFxuICAgICAqL1xuICAgIG5nT25EZXN0cm95KCk6IHZvaWQ7XG59XG4iXX0=