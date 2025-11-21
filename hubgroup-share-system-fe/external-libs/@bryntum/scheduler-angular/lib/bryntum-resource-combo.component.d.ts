/**
 * Angular wrapper for Bryntum ResourceCombo
 */
import { ElementRef, EventEmitter, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Base, Mask, MaskConfig, Rectangle, Scroller, ScrollerConfig, Store, StoreConfig, Widget } from '@bryntum/scheduler/scheduler.lite.umd.js';
import { ResourceCombo } from '@bryntum/scheduler/scheduler.lite.umd.js';
import * as ɵngcc0 from '@angular/core';
export declare class BryntumResourceComboComponent implements OnInit, OnDestroy {
    static instanceClass: typeof ResourceCombo;
    private static bryntumFeatureNames;
    private static bryntumConfigs;
    private static bryntumConfigsOnly;
    private static bryntumProps;
    private elementRef;
    instance: ResourceCombo;
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
    static ɵfac: ɵngcc0.ɵɵFactoryDef<BryntumResourceComboComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<BryntumResourceComboComponent, "bryntum-resource-combo", never, { "adopt": "adopt"; "align": "align"; "anchor": "anchor"; "appendTo": "appendTo"; "autoClose": "autoClose"; "autoComplete": "autoComplete"; "autoExpand": "autoExpand"; "autoSelect": "autoSelect"; "bubbleEvents": "bubbleEvents"; "caseSensitive": "caseSensitive"; "centered": "centered"; "chipView": "chipView"; "clearable": "clearable"; "clearTextOnPickerHide": "clearTextOnPickerHide"; "cls": "cls"; "config": "config"; "constrainTo": "constrainTo"; "contentElementCls": "contentElementCls"; "defaultBindProperty": "defaultBindProperty"; "displayField": "displayField"; "displayValueRenderer": "displayValueRenderer"; "dock": "dock"; "draggable": "draggable"; "editable": "editable"; "emptyText": "emptyText"; "encodeFilterParams": "encodeFilterParams"; "filterOnEnter": "filterOnEnter"; "filterParamName": "filterParamName"; "filterSelected": "filterSelected"; "floating": "floating"; "hideAnimation": "hideAnimation"; "hidePickerOnSelect": "hidePickerOnSelect"; "hideTrigger": "hideTrigger"; "highlightExternalChange": "highlightExternalChange"; "hint": "hint"; "hintHtml": "hintHtml"; "htmlCls": "htmlCls"; "inputAlign": "inputAlign"; "inputAttributes": "inputAttributes"; "inputWidth": "inputWidth"; "insertBefore": "insertBefore"; "insertFirst": "insertFirst"; "items": "items"; "keyStrokeChangeDelay": "keyStrokeChangeDelay"; "keyStrokeFilterDelay": "keyStrokeFilterDelay"; "labelCls": "labelCls"; "labelPosition": "labelPosition"; "labels": "labels"; "labelWidth": "labelWidth"; "listCls": "listCls"; "listeners": "listeners"; "listItemTpl": "listItemTpl"; "localeClass": "localeClass"; "localizableProperties": "localizableProperties"; "maskDefaults": "maskDefaults"; "masked": "masked"; "maxLength": "maxLength"; "minChars": "minChars"; "minLength": "minLength"; "monitorResize": "monitorResize"; "multiSelect": "multiSelect"; "name": "name"; "overlayAnchor": "overlayAnchor"; "owner": "owner"; "picker": "picker"; "pickerAlignElement": "pickerAlignElement"; "pickerWidth": "pickerWidth"; "placeholder": "placeholder"; "positioned": "positioned"; "preventTooltipOnTouch": "preventTooltipOnTouch"; "primaryFilter": "primaryFilter"; "required": "required"; "revertOnEscape": "revertOnEscape"; "ripple": "ripple"; "rootElement": "rootElement"; "scrollAction": "scrollAction"; "showAnimation": "showAnimation"; "tab": "tab"; "tabIndex": "tabIndex"; "tag": "tag"; "textAlign": "textAlign"; "title": "title"; "triggerAction": "triggerAction"; "validateFilter": "validateFilter"; "valueField": "valueField"; "weight": "weight"; "alignSelf": "alignSelf"; "badge": "badge"; "content": "content"; "dataset": "dataset"; "disabled": "disabled"; "extraData": "extraData"; "filterOperator": "filterOperator"; "flex": "flex"; "height": "height"; "hidden": "hidden"; "html": "html"; "id": "id"; "label": "label"; "margin": "margin"; "maxHeight": "maxHeight"; "maxWidth": "maxWidth"; "minHeight": "minHeight"; "minWidth": "minWidth"; "readOnly": "readOnly"; "scrollable": "scrollable"; "store": "store"; "tooltip": "tooltip"; "triggers": "triggers"; "value": "value"; "width": "width"; "x": "x"; "y": "y"; "anchorSize": "anchorSize"; }, { "onAction": "onAction"; "onBeforeDestroy": "onBeforeDestroy"; "onBeforeHide": "onBeforeHide"; "onBeforeShow": "onBeforeShow"; "onCatchAll": "onCatchAll"; "onChange": "onChange"; "onClear": "onClear"; "onDestroy": "onDestroy"; "onFocusIn": "onFocusIn"; "onFocusOut": "onFocusOut"; "onHide": "onHide"; "onInput": "onInput"; "onPaint": "onPaint"; "onReadOnly": "onReadOnly"; "onResize": "onResize"; "onSelect": "onSelect"; "onShow": "onShow"; "onTrigger": "onTrigger"; }, never, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJ5bnR1bS1yZXNvdXJjZS1jb21iby5jb21wb25lbnQuZC50cyIsInNvdXJjZXMiOlsiYnJ5bnR1bS1yZXNvdXJjZS1jb21iby5jb21wb25lbnQuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEFuZ3VsYXIgd3JhcHBlciBmb3IgQnJ5bnR1bSBSZXNvdXJjZUNvbWJvXG4gKi9cbmltcG9ydCB7IEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgT25EZXN0cm95LCBPbkluaXQsIFNpbXBsZUNoYW5nZXMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJhc2UsIE1hc2ssIE1hc2tDb25maWcsIFJlY3RhbmdsZSwgU2Nyb2xsZXIsIFNjcm9sbGVyQ29uZmlnLCBTdG9yZSwgU3RvcmVDb25maWcsIFdpZGdldCB9IGZyb20gJ0BicnludHVtL3NjaGVkdWxlci9zY2hlZHVsZXIubGl0ZS51bWQuanMnO1xuaW1wb3J0IHsgUmVzb3VyY2VDb21ibyB9IGZyb20gJ0BicnludHVtL3NjaGVkdWxlci9zY2hlZHVsZXIubGl0ZS51bWQuanMnO1xuZXhwb3J0IGRlY2xhcmUgY2xhc3MgQnJ5bnR1bVJlc291cmNlQ29tYm9Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gICAgc3RhdGljIGluc3RhbmNlQ2xhc3M6IHR5cGVvZiBSZXNvdXJjZUNvbWJvO1xuICAgIHByaXZhdGUgc3RhdGljIGJyeW50dW1GZWF0dXJlTmFtZXM7XG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bUNvbmZpZ3M7XG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bUNvbmZpZ3NPbmx5O1xuICAgIHByaXZhdGUgc3RhdGljIGJyeW50dW1Qcm9wcztcbiAgICBwcml2YXRlIGVsZW1lbnRSZWY7XG4gICAgaW5zdGFuY2U6IFJlc291cmNlQ29tYm87XG4gICAgcHJpdmF0ZSBicnludHVtQ29uZmlnO1xuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQ6IEVsZW1lbnRSZWYpO1xuICAgIGFkb3B0OiBIVE1MRWxlbWVudCB8IHN0cmluZztcbiAgICBhbGlnbjogb2JqZWN0IHwgc3RyaW5nO1xuICAgIGFuY2hvcjogYm9vbGVhbjtcbiAgICBhcHBlbmRUbzogSFRNTEVsZW1lbnQgfCBzdHJpbmc7XG4gICAgYXV0b0Nsb3NlOiBib29sZWFuO1xuICAgIGF1dG9Db21wbGV0ZTogc3RyaW5nO1xuICAgIGF1dG9FeHBhbmQ6IGJvb2xlYW47XG4gICAgYXV0b1NlbGVjdDogYm9vbGVhbjtcbiAgICBidWJibGVFdmVudHM6IG9iamVjdDtcbiAgICBjYXNlU2Vuc2l0aXZlOiBib29sZWFuO1xuICAgIGNlbnRlcmVkOiBib29sZWFuO1xuICAgIGNoaXBWaWV3OiBvYmplY3Q7XG4gICAgY2xlYXJhYmxlOiBib29sZWFuIHwgb2JqZWN0O1xuICAgIGNsZWFyVGV4dE9uUGlja2VySGlkZTogYm9vbGVhbjtcbiAgICBjbHM6IHN0cmluZyB8IG9iamVjdDtcbiAgICBjb25maWc6IG9iamVjdDtcbiAgICBjb25zdHJhaW5UbzogSFRNTEVsZW1lbnQgfCBXaWRnZXQgfCBSZWN0YW5nbGU7XG4gICAgY29udGVudEVsZW1lbnRDbHM6IHN0cmluZyB8IG9iamVjdDtcbiAgICBkZWZhdWx0QmluZFByb3BlcnR5OiBzdHJpbmc7XG4gICAgZGlzcGxheUZpZWxkOiBzdHJpbmc7XG4gICAgZGlzcGxheVZhbHVlUmVuZGVyZXI6IEZ1bmN0aW9uO1xuICAgIGRvY2s6IHN0cmluZztcbiAgICBkcmFnZ2FibGU6IGJvb2xlYW4gfCBvYmplY3Q7XG4gICAgZWRpdGFibGU6IGJvb2xlYW47XG4gICAgZW1wdHlUZXh0OiBzdHJpbmc7XG4gICAgZW5jb2RlRmlsdGVyUGFyYW1zOiBGdW5jdGlvbjtcbiAgICBmaWx0ZXJPbkVudGVyOiBib29sZWFuO1xuICAgIGZpbHRlclBhcmFtTmFtZTogc3RyaW5nO1xuICAgIGZpbHRlclNlbGVjdGVkOiBib29sZWFuO1xuICAgIGZsb2F0aW5nOiBib29sZWFuO1xuICAgIGhpZGVBbmltYXRpb246IGJvb2xlYW4gfCBvYmplY3Q7XG4gICAgaGlkZVBpY2tlck9uU2VsZWN0OiBib29sZWFuO1xuICAgIGhpZGVUcmlnZ2VyOiBib29sZWFuO1xuICAgIGhpZ2hsaWdodEV4dGVybmFsQ2hhbmdlOiBib29sZWFuO1xuICAgIGhpbnQ6IHN0cmluZyB8IEZ1bmN0aW9uO1xuICAgIGhpbnRIdG1sOiBzdHJpbmcgfCBGdW5jdGlvbjtcbiAgICBodG1sQ2xzOiBzdHJpbmcgfCBvYmplY3Q7XG4gICAgaW5wdXRBbGlnbjogc3RyaW5nO1xuICAgIGlucHV0QXR0cmlidXRlczogb2JqZWN0O1xuICAgIGlucHV0V2lkdGg6IHN0cmluZyB8IG51bWJlcjtcbiAgICBpbnNlcnRCZWZvcmU6IEhUTUxFbGVtZW50IHwgc3RyaW5nO1xuICAgIGluc2VydEZpcnN0OiBIVE1MRWxlbWVudCB8IHN0cmluZztcbiAgICBpdGVtczogb2JqZWN0W10gfCBzdHJpbmdbXSB8IG9iamVjdDtcbiAgICBrZXlTdHJva2VDaGFuZ2VEZWxheTogbnVtYmVyO1xuICAgIGtleVN0cm9rZUZpbHRlckRlbGF5OiBudW1iZXI7XG4gICAgbGFiZWxDbHM6IHN0cmluZyB8IG9iamVjdDtcbiAgICBsYWJlbFBvc2l0aW9uOiBzdHJpbmc7XG4gICAgbGFiZWxzOiBvYmplY3Q7XG4gICAgbGFiZWxXaWR0aDogc3RyaW5nIHwgbnVtYmVyO1xuICAgIGxpc3RDbHM6IHN0cmluZztcbiAgICBsaXN0ZW5lcnM6IG9iamVjdDtcbiAgICBsaXN0SXRlbVRwbDogRnVuY3Rpb247XG4gICAgbG9jYWxlQ2xhc3M6IEJhc2U7XG4gICAgbG9jYWxpemFibGVQcm9wZXJ0aWVzOiBzdHJpbmdbXTtcbiAgICBtYXNrRGVmYXVsdHM6IG9iamVjdCB8IE1hc2sgfCBQYXJ0aWFsPE1hc2tDb25maWc+O1xuICAgIG1hc2tlZDogYm9vbGVhbiB8IHN0cmluZyB8IG9iamVjdCB8IE1hc2sgfCBQYXJ0aWFsPE1hc2tDb25maWc+O1xuICAgIG1heExlbmd0aDogbnVtYmVyO1xuICAgIG1pbkNoYXJzOiBudW1iZXI7XG4gICAgbWluTGVuZ3RoOiBudW1iZXI7XG4gICAgbW9uaXRvclJlc2l6ZTogYm9vbGVhbjtcbiAgICBtdWx0aVNlbGVjdDogYm9vbGVhbjtcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgb3ZlcmxheUFuY2hvcjogYm9vbGVhbjtcbiAgICBvd25lcjogV2lkZ2V0O1xuICAgIHBpY2tlcjogb2JqZWN0O1xuICAgIHBpY2tlckFsaWduRWxlbWVudDogc3RyaW5nO1xuICAgIHBpY2tlcldpZHRoOiBudW1iZXI7XG4gICAgcGxhY2Vob2xkZXI6IHN0cmluZztcbiAgICBwb3NpdGlvbmVkOiBib29sZWFuO1xuICAgIHByZXZlbnRUb29sdGlwT25Ub3VjaDogYm9vbGVhbjtcbiAgICBwcmltYXJ5RmlsdGVyOiBvYmplY3Q7XG4gICAgcmVxdWlyZWQ6IGJvb2xlYW47XG4gICAgcmV2ZXJ0T25Fc2NhcGU6IGJvb2xlYW47XG4gICAgcmlwcGxlOiBib29sZWFuIHwgb2JqZWN0O1xuICAgIHJvb3RFbGVtZW50OiBTaGFkb3dSb290O1xuICAgIHNjcm9sbEFjdGlvbjogc3RyaW5nO1xuICAgIHNob3dBbmltYXRpb246IGJvb2xlYW4gfCBvYmplY3Q7XG4gICAgdGFiOiBib29sZWFuIHwgb2JqZWN0O1xuICAgIHRhYkluZGV4OiBudW1iZXI7XG4gICAgdGFnOiBzdHJpbmc7XG4gICAgdGV4dEFsaWduOiBzdHJpbmc7XG4gICAgdGl0bGU6IHN0cmluZztcbiAgICB0cmlnZ2VyQWN0aW9uOiBzdHJpbmc7XG4gICAgdmFsaWRhdGVGaWx0ZXI6IGJvb2xlYW47XG4gICAgdmFsdWVGaWVsZDogc3RyaW5nO1xuICAgIHdlaWdodDogbnVtYmVyO1xuICAgIGFsaWduU2VsZjogc3RyaW5nO1xuICAgIGJhZGdlOiBzdHJpbmc7XG4gICAgY29udGVudDogc3RyaW5nO1xuICAgIGRhdGFzZXQ6IG9iamVjdDtcbiAgICBkaXNhYmxlZDogYm9vbGVhbjtcbiAgICBleHRyYURhdGE6IGJvb2xlYW4gfCBudW1iZXIgfCBvYmplY3QgfCBzdHJpbmc7XG4gICAgZmlsdGVyT3BlcmF0b3I6IHN0cmluZztcbiAgICBmbGV4OiBudW1iZXIgfCBzdHJpbmc7XG4gICAgaGVpZ2h0OiBudW1iZXIgfCBzdHJpbmc7XG4gICAgaGlkZGVuOiBib29sZWFuO1xuICAgIGh0bWw6IHN0cmluZztcbiAgICBpZDogc3RyaW5nO1xuICAgIGxhYmVsOiBzdHJpbmc7XG4gICAgbWFyZ2luOiBudW1iZXIgfCBzdHJpbmc7XG4gICAgbWF4SGVpZ2h0OiBudW1iZXIgfCBzdHJpbmc7XG4gICAgbWF4V2lkdGg6IG51bWJlciB8IHN0cmluZztcbiAgICBtaW5IZWlnaHQ6IG51bWJlciB8IHN0cmluZztcbiAgICBtaW5XaWR0aDogbnVtYmVyIHwgc3RyaW5nO1xuICAgIHJlYWRPbmx5OiBib29sZWFuO1xuICAgIHNjcm9sbGFibGU6IGJvb2xlYW4gfCBTY3JvbGxlciB8IG9iamVjdCB8IFBhcnRpYWw8U2Nyb2xsZXJDb25maWc+O1xuICAgIHN0b3JlOiBTdG9yZSB8IG9iamVjdCB8IFBhcnRpYWw8U3RvcmVDb25maWc+O1xuICAgIHRvb2x0aXA6IG9iamVjdCB8IHN0cmluZztcbiAgICB0cmlnZ2Vyczogb2JqZWN0O1xuICAgIHZhbHVlOiBudW1iZXJbXSB8IG9iamVjdCB8IHN0cmluZyB8IHN0cmluZ1tdO1xuICAgIHdpZHRoOiBudW1iZXIgfCBzdHJpbmc7XG4gICAgeDogbnVtYmVyO1xuICAgIHk6IG51bWJlcjtcbiAgICBhbmNob3JTaXplOiBudW1iZXJbXTtcbiAgICBvbkFjdGlvbjogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25CZWZvcmVEZXN0cm95OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbkJlZm9yZUhpZGU6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uQmVmb3JlU2hvdzogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25DYXRjaEFsbDogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25DaGFuZ2U6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uQ2xlYXI6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uRGVzdHJveTogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25Gb2N1c0luOiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbkZvY3VzT3V0OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbkhpZGU6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uSW5wdXQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uUGFpbnQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uUmVhZE9ubHk6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uUmVzaXplOiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvblNlbGVjdDogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25TaG93OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvblRyaWdnZXI6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhbmQgYXBwZW5kIHRoZSB1bmRlcmx5aW5nIHdpZGdldFxuICAgICAqL1xuICAgIG5nT25Jbml0KCk6IHZvaWQ7XG4gICAgLyoqXG4gICAgICogV2F0Y2ggZm9yIGNoYW5nZXNcbiAgICAgKiBAcGFyYW0gY2hhbmdlc1xuICAgICAqL1xuICAgIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkO1xuICAgIC8qKlxuICAgICAqIERlc3Ryb3kgdGhlIGNvbXBvbmVudFxuICAgICAqL1xuICAgIG5nT25EZXN0cm95KCk6IHZvaWQ7XG59XG4iXX0=