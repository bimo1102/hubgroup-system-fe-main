/**
 * Angular wrapper for Bryntum Combo
 */
import { ElementRef, EventEmitter, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Base, Mask, MaskConfig, Rectangle, Scroller, ScrollerConfig, Store, StoreConfig, Widget } from '@bryntum/scheduler/scheduler.lite.umd.js';
import { Combo } from '@bryntum/scheduler/scheduler.lite.umd.js';
import * as ɵngcc0 from '@angular/core';
export declare class BryntumComboComponent implements OnInit, OnDestroy {
    static instanceClass: typeof Combo;
    private static bryntumFeatureNames;
    private static bryntumConfigs;
    private static bryntumConfigsOnly;
    private static bryntumProps;
    private elementRef;
    instance: Combo;
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
    caseSensitive: boolean;
    centered: boolean;
    chipView: object;
    clearable: boolean | object;
    clearTextOnPickerHide: boolean;
    cls: string | object;
    config: object;
    constrainTo: HTMLElement | Widget | Rectangle;
    contentElementCls: string | object;
    defaultBindProperty: string;
    displayField: string;
    displayValueRenderer: Function;
    dock: string;
    draggable: boolean | object;
    editable: boolean;
    emptyText: string;
    encodeFilterParams: Function;
    filterOnEnter: boolean;
    filterParamName: string;
    filterSelected: boolean;
    floating: boolean;
    hideAnimation: boolean | object;
    hidePickerOnSelect: boolean;
    hideTrigger: boolean;
    highlightExternalChange: boolean;
    hint: string | Function;
    hintHtml: string | Function;
    htmlCls: string | object;
    inputAlign: string;
    inputAttributes: object;
    inputWidth: string | number;
    insertBefore: HTMLElement | string;
    insertFirst: HTMLElement | string;
    items: object[] | string[] | object;
    keyStrokeChangeDelay: number;
    keyStrokeFilterDelay: number;
    labelCls: string | object;
    labelPosition: string;
    labels: object;
    labelWidth: string | number;
    listCls: string;
    listeners: object;
    listItemTpl: Function;
    localeClass: Base;
    localizableProperties: string[];
    maskDefaults: object | Mask | Partial<MaskConfig>;
    masked: boolean | string | object | Mask | Partial<MaskConfig>;
    maxLength: number;
    minChars: number;
    minLength: number;
    monitorResize: boolean;
    multiSelect: boolean;
    name: string;
    overlayAnchor: boolean;
    owner: Widget;
    picker: object;
    pickerAlignElement: string;
    pickerWidth: number;
    placeholder: string;
    positioned: boolean;
    preventTooltipOnTouch: boolean;
    primaryFilter: object;
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
    triggerAction: string;
    validateFilter: boolean;
    valueField: string;
    weight: number;
    alignSelf: string;
    badge: string;
    content: string;
    dataset: object;
    disabled: boolean;
    extraData: boolean | number | object | string;
    filterOperator: string;
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
    store: Store | object | Partial<StoreConfig>;
    tooltip: object | string;
    triggers: object;
    value: number[] | object | string | string[];
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
    onSelect: EventEmitter<object>;
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
    static ɵfac: ɵngcc0.ɵɵFactoryDef<BryntumComboComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<BryntumComboComponent, "bryntum-combo", never, { "adopt": "adopt"; "align": "align"; "anchor": "anchor"; "appendTo": "appendTo"; "autoClose": "autoClose"; "autoComplete": "autoComplete"; "autoExpand": "autoExpand"; "autoSelect": "autoSelect"; "bubbleEvents": "bubbleEvents"; "caseSensitive": "caseSensitive"; "centered": "centered"; "chipView": "chipView"; "clearable": "clearable"; "clearTextOnPickerHide": "clearTextOnPickerHide"; "cls": "cls"; "config": "config"; "constrainTo": "constrainTo"; "contentElementCls": "contentElementCls"; "defaultBindProperty": "defaultBindProperty"; "displayField": "displayField"; "displayValueRenderer": "displayValueRenderer"; "dock": "dock"; "draggable": "draggable"; "editable": "editable"; "emptyText": "emptyText"; "encodeFilterParams": "encodeFilterParams"; "filterOnEnter": "filterOnEnter"; "filterParamName": "filterParamName"; "filterSelected": "filterSelected"; "floating": "floating"; "hideAnimation": "hideAnimation"; "hidePickerOnSelect": "hidePickerOnSelect"; "hideTrigger": "hideTrigger"; "highlightExternalChange": "highlightExternalChange"; "hint": "hint"; "hintHtml": "hintHtml"; "htmlCls": "htmlCls"; "inputAlign": "inputAlign"; "inputAttributes": "inputAttributes"; "inputWidth": "inputWidth"; "insertBefore": "insertBefore"; "insertFirst": "insertFirst"; "items": "items"; "keyStrokeChangeDelay": "keyStrokeChangeDelay"; "keyStrokeFilterDelay": "keyStrokeFilterDelay"; "labelCls": "labelCls"; "labelPosition": "labelPosition"; "labels": "labels"; "labelWidth": "labelWidth"; "listCls": "listCls"; "listeners": "listeners"; "listItemTpl": "listItemTpl"; "localeClass": "localeClass"; "localizableProperties": "localizableProperties"; "maskDefaults": "maskDefaults"; "masked": "masked"; "maxLength": "maxLength"; "minChars": "minChars"; "minLength": "minLength"; "monitorResize": "monitorResize"; "multiSelect": "multiSelect"; "name": "name"; "overlayAnchor": "overlayAnchor"; "owner": "owner"; "picker": "picker"; "pickerAlignElement": "pickerAlignElement"; "pickerWidth": "pickerWidth"; "placeholder": "placeholder"; "positioned": "positioned"; "preventTooltipOnTouch": "preventTooltipOnTouch"; "primaryFilter": "primaryFilter"; "required": "required"; "revertOnEscape": "revertOnEscape"; "ripple": "ripple"; "rootElement": "rootElement"; "scrollAction": "scrollAction"; "showAnimation": "showAnimation"; "tab": "tab"; "tabIndex": "tabIndex"; "tag": "tag"; "textAlign": "textAlign"; "title": "title"; "triggerAction": "triggerAction"; "validateFilter": "validateFilter"; "valueField": "valueField"; "weight": "weight"; "alignSelf": "alignSelf"; "badge": "badge"; "content": "content"; "dataset": "dataset"; "disabled": "disabled"; "extraData": "extraData"; "filterOperator": "filterOperator"; "flex": "flex"; "height": "height"; "hidden": "hidden"; "html": "html"; "id": "id"; "label": "label"; "margin": "margin"; "maxHeight": "maxHeight"; "maxWidth": "maxWidth"; "minHeight": "minHeight"; "minWidth": "minWidth"; "readOnly": "readOnly"; "scrollable": "scrollable"; "store": "store"; "tooltip": "tooltip"; "triggers": "triggers"; "value": "value"; "width": "width"; "x": "x"; "y": "y"; "anchorSize": "anchorSize"; }, { "onAction": "onAction"; "onBeforeDestroy": "onBeforeDestroy"; "onBeforeHide": "onBeforeHide"; "onBeforeShow": "onBeforeShow"; "onCatchAll": "onCatchAll"; "onChange": "onChange"; "onClear": "onClear"; "onDestroy": "onDestroy"; "onFocusIn": "onFocusIn"; "onFocusOut": "onFocusOut"; "onHide": "onHide"; "onInput": "onInput"; "onPaint": "onPaint"; "onReadOnly": "onReadOnly"; "onResize": "onResize"; "onSelect": "onSelect"; "onShow": "onShow"; "onTrigger": "onTrigger"; }, never, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJ5bnR1bS1jb21iby5jb21wb25lbnQuZC50cyIsInNvdXJjZXMiOlsiYnJ5bnR1bS1jb21iby5jb21wb25lbnQuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEFuZ3VsYXIgd3JhcHBlciBmb3IgQnJ5bnR1bSBDb21ib1xuICovXG5pbXBvcnQgeyBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIE9uRGVzdHJveSwgT25Jbml0LCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCYXNlLCBNYXNrLCBNYXNrQ29uZmlnLCBSZWN0YW5nbGUsIFNjcm9sbGVyLCBTY3JvbGxlckNvbmZpZywgU3RvcmUsIFN0b3JlQ29uZmlnLCBXaWRnZXQgfSBmcm9tICdAYnJ5bnR1bS9zY2hlZHVsZXIvc2NoZWR1bGVyLmxpdGUudW1kLmpzJztcbmltcG9ydCB7IENvbWJvIH0gZnJvbSAnQGJyeW50dW0vc2NoZWR1bGVyL3NjaGVkdWxlci5saXRlLnVtZC5qcyc7XG5leHBvcnQgZGVjbGFyZSBjbGFzcyBCcnludHVtQ29tYm9Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gICAgc3RhdGljIGluc3RhbmNlQ2xhc3M6IHR5cGVvZiBDb21ibztcbiAgICBwcml2YXRlIHN0YXRpYyBicnludHVtRmVhdHVyZU5hbWVzO1xuICAgIHByaXZhdGUgc3RhdGljIGJyeW50dW1Db25maWdzO1xuICAgIHByaXZhdGUgc3RhdGljIGJyeW50dW1Db25maWdzT25seTtcbiAgICBwcml2YXRlIHN0YXRpYyBicnludHVtUHJvcHM7XG4gICAgcHJpdmF0ZSBlbGVtZW50UmVmO1xuICAgIGluc3RhbmNlOiBDb21ibztcbiAgICBwcml2YXRlIGJyeW50dW1Db25maWc7XG4gICAgY29uc3RydWN0b3IoZWxlbWVudDogRWxlbWVudFJlZik7XG4gICAgYWRvcHQ6IEhUTUxFbGVtZW50IHwgc3RyaW5nO1xuICAgIGFsaWduOiBvYmplY3QgfCBzdHJpbmc7XG4gICAgYW5jaG9yOiBib29sZWFuO1xuICAgIGFwcGVuZFRvOiBIVE1MRWxlbWVudCB8IHN0cmluZztcbiAgICBhdXRvQ2xvc2U6IGJvb2xlYW47XG4gICAgYXV0b0NvbXBsZXRlOiBzdHJpbmc7XG4gICAgYXV0b0V4cGFuZDogYm9vbGVhbjtcbiAgICBhdXRvU2VsZWN0OiBib29sZWFuO1xuICAgIGJ1YmJsZUV2ZW50czogb2JqZWN0O1xuICAgIGNhc2VTZW5zaXRpdmU6IGJvb2xlYW47XG4gICAgY2VudGVyZWQ6IGJvb2xlYW47XG4gICAgY2hpcFZpZXc6IG9iamVjdDtcbiAgICBjbGVhcmFibGU6IGJvb2xlYW4gfCBvYmplY3Q7XG4gICAgY2xlYXJUZXh0T25QaWNrZXJIaWRlOiBib29sZWFuO1xuICAgIGNsczogc3RyaW5nIHwgb2JqZWN0O1xuICAgIGNvbmZpZzogb2JqZWN0O1xuICAgIGNvbnN0cmFpblRvOiBIVE1MRWxlbWVudCB8IFdpZGdldCB8IFJlY3RhbmdsZTtcbiAgICBjb250ZW50RWxlbWVudENsczogc3RyaW5nIHwgb2JqZWN0O1xuICAgIGRlZmF1bHRCaW5kUHJvcGVydHk6IHN0cmluZztcbiAgICBkaXNwbGF5RmllbGQ6IHN0cmluZztcbiAgICBkaXNwbGF5VmFsdWVSZW5kZXJlcjogRnVuY3Rpb247XG4gICAgZG9jazogc3RyaW5nO1xuICAgIGRyYWdnYWJsZTogYm9vbGVhbiB8IG9iamVjdDtcbiAgICBlZGl0YWJsZTogYm9vbGVhbjtcbiAgICBlbXB0eVRleHQ6IHN0cmluZztcbiAgICBlbmNvZGVGaWx0ZXJQYXJhbXM6IEZ1bmN0aW9uO1xuICAgIGZpbHRlck9uRW50ZXI6IGJvb2xlYW47XG4gICAgZmlsdGVyUGFyYW1OYW1lOiBzdHJpbmc7XG4gICAgZmlsdGVyU2VsZWN0ZWQ6IGJvb2xlYW47XG4gICAgZmxvYXRpbmc6IGJvb2xlYW47XG4gICAgaGlkZUFuaW1hdGlvbjogYm9vbGVhbiB8IG9iamVjdDtcbiAgICBoaWRlUGlja2VyT25TZWxlY3Q6IGJvb2xlYW47XG4gICAgaGlkZVRyaWdnZXI6IGJvb2xlYW47XG4gICAgaGlnaGxpZ2h0RXh0ZXJuYWxDaGFuZ2U6IGJvb2xlYW47XG4gICAgaGludDogc3RyaW5nIHwgRnVuY3Rpb247XG4gICAgaGludEh0bWw6IHN0cmluZyB8IEZ1bmN0aW9uO1xuICAgIGh0bWxDbHM6IHN0cmluZyB8IG9iamVjdDtcbiAgICBpbnB1dEFsaWduOiBzdHJpbmc7XG4gICAgaW5wdXRBdHRyaWJ1dGVzOiBvYmplY3Q7XG4gICAgaW5wdXRXaWR0aDogc3RyaW5nIHwgbnVtYmVyO1xuICAgIGluc2VydEJlZm9yZTogSFRNTEVsZW1lbnQgfCBzdHJpbmc7XG4gICAgaW5zZXJ0Rmlyc3Q6IEhUTUxFbGVtZW50IHwgc3RyaW5nO1xuICAgIGl0ZW1zOiBvYmplY3RbXSB8IHN0cmluZ1tdIHwgb2JqZWN0O1xuICAgIGtleVN0cm9rZUNoYW5nZURlbGF5OiBudW1iZXI7XG4gICAga2V5U3Ryb2tlRmlsdGVyRGVsYXk6IG51bWJlcjtcbiAgICBsYWJlbENsczogc3RyaW5nIHwgb2JqZWN0O1xuICAgIGxhYmVsUG9zaXRpb246IHN0cmluZztcbiAgICBsYWJlbHM6IG9iamVjdDtcbiAgICBsYWJlbFdpZHRoOiBzdHJpbmcgfCBudW1iZXI7XG4gICAgbGlzdENsczogc3RyaW5nO1xuICAgIGxpc3RlbmVyczogb2JqZWN0O1xuICAgIGxpc3RJdGVtVHBsOiBGdW5jdGlvbjtcbiAgICBsb2NhbGVDbGFzczogQmFzZTtcbiAgICBsb2NhbGl6YWJsZVByb3BlcnRpZXM6IHN0cmluZ1tdO1xuICAgIG1hc2tEZWZhdWx0czogb2JqZWN0IHwgTWFzayB8IFBhcnRpYWw8TWFza0NvbmZpZz47XG4gICAgbWFza2VkOiBib29sZWFuIHwgc3RyaW5nIHwgb2JqZWN0IHwgTWFzayB8IFBhcnRpYWw8TWFza0NvbmZpZz47XG4gICAgbWF4TGVuZ3RoOiBudW1iZXI7XG4gICAgbWluQ2hhcnM6IG51bWJlcjtcbiAgICBtaW5MZW5ndGg6IG51bWJlcjtcbiAgICBtb25pdG9yUmVzaXplOiBib29sZWFuO1xuICAgIG11bHRpU2VsZWN0OiBib29sZWFuO1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBvdmVybGF5QW5jaG9yOiBib29sZWFuO1xuICAgIG93bmVyOiBXaWRnZXQ7XG4gICAgcGlja2VyOiBvYmplY3Q7XG4gICAgcGlja2VyQWxpZ25FbGVtZW50OiBzdHJpbmc7XG4gICAgcGlja2VyV2lkdGg6IG51bWJlcjtcbiAgICBwbGFjZWhvbGRlcjogc3RyaW5nO1xuICAgIHBvc2l0aW9uZWQ6IGJvb2xlYW47XG4gICAgcHJldmVudFRvb2x0aXBPblRvdWNoOiBib29sZWFuO1xuICAgIHByaW1hcnlGaWx0ZXI6IG9iamVjdDtcbiAgICByZXF1aXJlZDogYm9vbGVhbjtcbiAgICByZXZlcnRPbkVzY2FwZTogYm9vbGVhbjtcbiAgICByaXBwbGU6IGJvb2xlYW4gfCBvYmplY3Q7XG4gICAgcm9vdEVsZW1lbnQ6IFNoYWRvd1Jvb3Q7XG4gICAgc2Nyb2xsQWN0aW9uOiBzdHJpbmc7XG4gICAgc2hvd0FuaW1hdGlvbjogYm9vbGVhbiB8IG9iamVjdDtcbiAgICB0YWI6IGJvb2xlYW4gfCBvYmplY3Q7XG4gICAgdGFiSW5kZXg6IG51bWJlcjtcbiAgICB0YWc6IHN0cmluZztcbiAgICB0ZXh0QWxpZ246IHN0cmluZztcbiAgICB0aXRsZTogc3RyaW5nO1xuICAgIHRyaWdnZXJBY3Rpb246IHN0cmluZztcbiAgICB2YWxpZGF0ZUZpbHRlcjogYm9vbGVhbjtcbiAgICB2YWx1ZUZpZWxkOiBzdHJpbmc7XG4gICAgd2VpZ2h0OiBudW1iZXI7XG4gICAgYWxpZ25TZWxmOiBzdHJpbmc7XG4gICAgYmFkZ2U6IHN0cmluZztcbiAgICBjb250ZW50OiBzdHJpbmc7XG4gICAgZGF0YXNldDogb2JqZWN0O1xuICAgIGRpc2FibGVkOiBib29sZWFuO1xuICAgIGV4dHJhRGF0YTogYm9vbGVhbiB8IG51bWJlciB8IG9iamVjdCB8IHN0cmluZztcbiAgICBmaWx0ZXJPcGVyYXRvcjogc3RyaW5nO1xuICAgIGZsZXg6IG51bWJlciB8IHN0cmluZztcbiAgICBoZWlnaHQ6IG51bWJlciB8IHN0cmluZztcbiAgICBoaWRkZW46IGJvb2xlYW47XG4gICAgaHRtbDogc3RyaW5nO1xuICAgIGlkOiBzdHJpbmc7XG4gICAgbGFiZWw6IHN0cmluZztcbiAgICBtYXJnaW46IG51bWJlciB8IHN0cmluZztcbiAgICBtYXhIZWlnaHQ6IG51bWJlciB8IHN0cmluZztcbiAgICBtYXhXaWR0aDogbnVtYmVyIHwgc3RyaW5nO1xuICAgIG1pbkhlaWdodDogbnVtYmVyIHwgc3RyaW5nO1xuICAgIG1pbldpZHRoOiBudW1iZXIgfCBzdHJpbmc7XG4gICAgcmVhZE9ubHk6IGJvb2xlYW47XG4gICAgc2Nyb2xsYWJsZTogYm9vbGVhbiB8IFNjcm9sbGVyIHwgb2JqZWN0IHwgUGFydGlhbDxTY3JvbGxlckNvbmZpZz47XG4gICAgc3RvcmU6IFN0b3JlIHwgb2JqZWN0IHwgUGFydGlhbDxTdG9yZUNvbmZpZz47XG4gICAgdG9vbHRpcDogb2JqZWN0IHwgc3RyaW5nO1xuICAgIHRyaWdnZXJzOiBvYmplY3Q7XG4gICAgdmFsdWU6IG51bWJlcltdIHwgb2JqZWN0IHwgc3RyaW5nIHwgc3RyaW5nW107XG4gICAgd2lkdGg6IG51bWJlciB8IHN0cmluZztcbiAgICB4OiBudW1iZXI7XG4gICAgeTogbnVtYmVyO1xuICAgIGFuY2hvclNpemU6IG51bWJlcltdO1xuICAgIG9uQWN0aW9uOiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbkJlZm9yZURlc3Ryb3k6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uQmVmb3JlSGlkZTogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25CZWZvcmVTaG93OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbkNhdGNoQWxsOiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbkNoYW5nZTogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25DbGVhcjogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25EZXN0cm95OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbkZvY3VzSW46IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uRm9jdXNPdXQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uSGlkZTogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25JbnB1dDogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25QYWludDogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25SZWFkT25seTogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25SZXNpemU6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uU2VsZWN0OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvblNob3c6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uVHJpZ2dlcjogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGFuZCBhcHBlbmQgdGhlIHVuZGVybHlpbmcgd2lkZ2V0XG4gICAgICovXG4gICAgbmdPbkluaXQoKTogdm9pZDtcbiAgICAvKipcbiAgICAgKiBXYXRjaCBmb3IgY2hhbmdlc1xuICAgICAqIEBwYXJhbSBjaGFuZ2VzXG4gICAgICovXG4gICAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQ7XG4gICAgLyoqXG4gICAgICogRGVzdHJveSB0aGUgY29tcG9uZW50XG4gICAgICovXG4gICAgbmdPbkRlc3Ryb3koKTogdm9pZDtcbn1cbiJdfQ==