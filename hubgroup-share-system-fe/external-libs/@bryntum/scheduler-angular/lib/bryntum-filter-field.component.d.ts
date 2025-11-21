/**
 * Angular wrapper for Bryntum FilterField
 */
import { ElementRef, EventEmitter, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Base, Mask, MaskConfig, Rectangle, Scroller, ScrollerConfig, Store, Widget } from '@bryntum/scheduler/scheduler.lite.umd.js';
import { FilterField } from '@bryntum/scheduler/scheduler.lite.umd.js';
import * as ɵngcc0 from '@angular/core';
export declare class BryntumFilterFieldComponent implements OnInit, OnDestroy {
    static instanceClass: typeof FilterField;
    private static bryntumFeatureNames;
    private static bryntumConfigs;
    private static bryntumConfigsOnly;
    private static bryntumProps;
    private elementRef;
    instance: FilterField;
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
    clearable: boolean | object;
    cls: string | object;
    config: object;
    constrainTo: HTMLElement | Widget | Rectangle;
    contentElementCls: string | object;
    defaultBindProperty: string;
    dock: string;
    draggable: boolean | object;
    editable: boolean;
    field: string;
    filterFunction: Function;
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
    placeholder: string;
    positioned: boolean;
    preventTooltipOnTouch: boolean;
    required: boolean;
    revertOnEscape: boolean;
    ripple: boolean | object;
    rootElement: ShadowRoot;
    scrollAction: string;
    showAnimation: boolean | object;
    store: Store;
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
    tooltip: object | string;
    triggers: object;
    value: string | any;
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
    static ɵfac: ɵngcc0.ɵɵFactoryDef<BryntumFilterFieldComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<BryntumFilterFieldComponent, "bryntum-filter-field", never, { "adopt": "adopt"; "align": "align"; "anchor": "anchor"; "appendTo": "appendTo"; "autoComplete": "autoComplete"; "autoSelect": "autoSelect"; "bubbleEvents": "bubbleEvents"; "centered": "centered"; "clearable": "clearable"; "cls": "cls"; "config": "config"; "constrainTo": "constrainTo"; "contentElementCls": "contentElementCls"; "defaultBindProperty": "defaultBindProperty"; "dock": "dock"; "draggable": "draggable"; "editable": "editable"; "field": "field"; "filterFunction": "filterFunction"; "floating": "floating"; "hideAnimation": "hideAnimation"; "highlightExternalChange": "highlightExternalChange"; "hint": "hint"; "hintHtml": "hintHtml"; "htmlCls": "htmlCls"; "inputAlign": "inputAlign"; "inputAttributes": "inputAttributes"; "inputWidth": "inputWidth"; "insertBefore": "insertBefore"; "insertFirst": "insertFirst"; "keyStrokeChangeDelay": "keyStrokeChangeDelay"; "labelCls": "labelCls"; "labelPosition": "labelPosition"; "labels": "labels"; "labelWidth": "labelWidth"; "listeners": "listeners"; "localeClass": "localeClass"; "localizableProperties": "localizableProperties"; "maskDefaults": "maskDefaults"; "masked": "masked"; "maxLength": "maxLength"; "minLength": "minLength"; "monitorResize": "monitorResize"; "name": "name"; "owner": "owner"; "placeholder": "placeholder"; "positioned": "positioned"; "preventTooltipOnTouch": "preventTooltipOnTouch"; "required": "required"; "revertOnEscape": "revertOnEscape"; "ripple": "ripple"; "rootElement": "rootElement"; "scrollAction": "scrollAction"; "showAnimation": "showAnimation"; "store": "store"; "tab": "tab"; "tabIndex": "tabIndex"; "tag": "tag"; "textAlign": "textAlign"; "title": "title"; "weight": "weight"; "alignSelf": "alignSelf"; "badge": "badge"; "content": "content"; "dataset": "dataset"; "disabled": "disabled"; "extraData": "extraData"; "flex": "flex"; "height": "height"; "hidden": "hidden"; "html": "html"; "id": "id"; "label": "label"; "margin": "margin"; "maxHeight": "maxHeight"; "maxWidth": "maxWidth"; "minHeight": "minHeight"; "minWidth": "minWidth"; "readOnly": "readOnly"; "scrollable": "scrollable"; "tooltip": "tooltip"; "triggers": "triggers"; "value": "value"; "width": "width"; "x": "x"; "y": "y"; "anchorSize": "anchorSize"; }, { "onAction": "onAction"; "onBeforeDestroy": "onBeforeDestroy"; "onBeforeHide": "onBeforeHide"; "onBeforeShow": "onBeforeShow"; "onCatchAll": "onCatchAll"; "onChange": "onChange"; "onClear": "onClear"; "onDestroy": "onDestroy"; "onFocusIn": "onFocusIn"; "onFocusOut": "onFocusOut"; "onHide": "onHide"; "onInput": "onInput"; "onPaint": "onPaint"; "onReadOnly": "onReadOnly"; "onResize": "onResize"; "onShow": "onShow"; "onTrigger": "onTrigger"; }, never, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJ5bnR1bS1maWx0ZXItZmllbGQuY29tcG9uZW50LmQudHMiLCJzb3VyY2VzIjpbImJyeW50dW0tZmlsdGVyLWZpZWxkLmNvbXBvbmVudC5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEFuZ3VsYXIgd3JhcHBlciBmb3IgQnJ5bnR1bSBGaWx0ZXJGaWVsZFxuICovXG5pbXBvcnQgeyBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIE9uRGVzdHJveSwgT25Jbml0LCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCYXNlLCBNYXNrLCBNYXNrQ29uZmlnLCBSZWN0YW5nbGUsIFNjcm9sbGVyLCBTY3JvbGxlckNvbmZpZywgU3RvcmUsIFdpZGdldCB9IGZyb20gJ0BicnludHVtL3NjaGVkdWxlci9zY2hlZHVsZXIubGl0ZS51bWQuanMnO1xuaW1wb3J0IHsgRmlsdGVyRmllbGQgfSBmcm9tICdAYnJ5bnR1bS9zY2hlZHVsZXIvc2NoZWR1bGVyLmxpdGUudW1kLmpzJztcbmV4cG9ydCBkZWNsYXJlIGNsYXNzIEJyeW50dW1GaWx0ZXJGaWVsZENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgICBzdGF0aWMgaW5zdGFuY2VDbGFzczogdHlwZW9mIEZpbHRlckZpZWxkO1xuICAgIHByaXZhdGUgc3RhdGljIGJyeW50dW1GZWF0dXJlTmFtZXM7XG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bUNvbmZpZ3M7XG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bUNvbmZpZ3NPbmx5O1xuICAgIHByaXZhdGUgc3RhdGljIGJyeW50dW1Qcm9wcztcbiAgICBwcml2YXRlIGVsZW1lbnRSZWY7XG4gICAgaW5zdGFuY2U6IEZpbHRlckZpZWxkO1xuICAgIHByaXZhdGUgYnJ5bnR1bUNvbmZpZztcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50OiBFbGVtZW50UmVmKTtcbiAgICBhZG9wdDogSFRNTEVsZW1lbnQgfCBzdHJpbmc7XG4gICAgYWxpZ246IG9iamVjdCB8IHN0cmluZztcbiAgICBhbmNob3I6IGJvb2xlYW47XG4gICAgYXBwZW5kVG86IEhUTUxFbGVtZW50IHwgc3RyaW5nO1xuICAgIGF1dG9Db21wbGV0ZTogc3RyaW5nO1xuICAgIGF1dG9TZWxlY3Q6IGJvb2xlYW47XG4gICAgYnViYmxlRXZlbnRzOiBvYmplY3Q7XG4gICAgY2VudGVyZWQ6IGJvb2xlYW47XG4gICAgY2xlYXJhYmxlOiBib29sZWFuIHwgb2JqZWN0O1xuICAgIGNsczogc3RyaW5nIHwgb2JqZWN0O1xuICAgIGNvbmZpZzogb2JqZWN0O1xuICAgIGNvbnN0cmFpblRvOiBIVE1MRWxlbWVudCB8IFdpZGdldCB8IFJlY3RhbmdsZTtcbiAgICBjb250ZW50RWxlbWVudENsczogc3RyaW5nIHwgb2JqZWN0O1xuICAgIGRlZmF1bHRCaW5kUHJvcGVydHk6IHN0cmluZztcbiAgICBkb2NrOiBzdHJpbmc7XG4gICAgZHJhZ2dhYmxlOiBib29sZWFuIHwgb2JqZWN0O1xuICAgIGVkaXRhYmxlOiBib29sZWFuO1xuICAgIGZpZWxkOiBzdHJpbmc7XG4gICAgZmlsdGVyRnVuY3Rpb246IEZ1bmN0aW9uO1xuICAgIGZsb2F0aW5nOiBib29sZWFuO1xuICAgIGhpZGVBbmltYXRpb246IGJvb2xlYW4gfCBvYmplY3Q7XG4gICAgaGlnaGxpZ2h0RXh0ZXJuYWxDaGFuZ2U6IGJvb2xlYW47XG4gICAgaGludDogc3RyaW5nIHwgRnVuY3Rpb247XG4gICAgaGludEh0bWw6IHN0cmluZyB8IEZ1bmN0aW9uO1xuICAgIGh0bWxDbHM6IHN0cmluZyB8IG9iamVjdDtcbiAgICBpbnB1dEFsaWduOiBzdHJpbmc7XG4gICAgaW5wdXRBdHRyaWJ1dGVzOiBvYmplY3Q7XG4gICAgaW5wdXRXaWR0aDogc3RyaW5nIHwgbnVtYmVyO1xuICAgIGluc2VydEJlZm9yZTogSFRNTEVsZW1lbnQgfCBzdHJpbmc7XG4gICAgaW5zZXJ0Rmlyc3Q6IEhUTUxFbGVtZW50IHwgc3RyaW5nO1xuICAgIGtleVN0cm9rZUNoYW5nZURlbGF5OiBudW1iZXI7XG4gICAgbGFiZWxDbHM6IHN0cmluZyB8IG9iamVjdDtcbiAgICBsYWJlbFBvc2l0aW9uOiBzdHJpbmc7XG4gICAgbGFiZWxzOiBvYmplY3Q7XG4gICAgbGFiZWxXaWR0aDogc3RyaW5nIHwgbnVtYmVyO1xuICAgIGxpc3RlbmVyczogb2JqZWN0O1xuICAgIGxvY2FsZUNsYXNzOiBCYXNlO1xuICAgIGxvY2FsaXphYmxlUHJvcGVydGllczogc3RyaW5nW107XG4gICAgbWFza0RlZmF1bHRzOiBvYmplY3QgfCBNYXNrIHwgUGFydGlhbDxNYXNrQ29uZmlnPjtcbiAgICBtYXNrZWQ6IGJvb2xlYW4gfCBzdHJpbmcgfCBvYmplY3QgfCBNYXNrIHwgUGFydGlhbDxNYXNrQ29uZmlnPjtcbiAgICBtYXhMZW5ndGg6IG51bWJlcjtcbiAgICBtaW5MZW5ndGg6IG51bWJlcjtcbiAgICBtb25pdG9yUmVzaXplOiBib29sZWFuO1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBvd25lcjogV2lkZ2V0O1xuICAgIHBsYWNlaG9sZGVyOiBzdHJpbmc7XG4gICAgcG9zaXRpb25lZDogYm9vbGVhbjtcbiAgICBwcmV2ZW50VG9vbHRpcE9uVG91Y2g6IGJvb2xlYW47XG4gICAgcmVxdWlyZWQ6IGJvb2xlYW47XG4gICAgcmV2ZXJ0T25Fc2NhcGU6IGJvb2xlYW47XG4gICAgcmlwcGxlOiBib29sZWFuIHwgb2JqZWN0O1xuICAgIHJvb3RFbGVtZW50OiBTaGFkb3dSb290O1xuICAgIHNjcm9sbEFjdGlvbjogc3RyaW5nO1xuICAgIHNob3dBbmltYXRpb246IGJvb2xlYW4gfCBvYmplY3Q7XG4gICAgc3RvcmU6IFN0b3JlO1xuICAgIHRhYjogYm9vbGVhbiB8IG9iamVjdDtcbiAgICB0YWJJbmRleDogbnVtYmVyO1xuICAgIHRhZzogc3RyaW5nO1xuICAgIHRleHRBbGlnbjogc3RyaW5nO1xuICAgIHRpdGxlOiBzdHJpbmc7XG4gICAgd2VpZ2h0OiBudW1iZXI7XG4gICAgYWxpZ25TZWxmOiBzdHJpbmc7XG4gICAgYmFkZ2U6IHN0cmluZztcbiAgICBjb250ZW50OiBzdHJpbmc7XG4gICAgZGF0YXNldDogb2JqZWN0O1xuICAgIGRpc2FibGVkOiBib29sZWFuO1xuICAgIGV4dHJhRGF0YTogYm9vbGVhbiB8IG51bWJlciB8IG9iamVjdCB8IHN0cmluZztcbiAgICBmbGV4OiBudW1iZXIgfCBzdHJpbmc7XG4gICAgaGVpZ2h0OiBudW1iZXIgfCBzdHJpbmc7XG4gICAgaGlkZGVuOiBib29sZWFuO1xuICAgIGh0bWw6IHN0cmluZztcbiAgICBpZDogc3RyaW5nO1xuICAgIGxhYmVsOiBzdHJpbmc7XG4gICAgbWFyZ2luOiBudW1iZXIgfCBzdHJpbmc7XG4gICAgbWF4SGVpZ2h0OiBudW1iZXIgfCBzdHJpbmc7XG4gICAgbWF4V2lkdGg6IG51bWJlciB8IHN0cmluZztcbiAgICBtaW5IZWlnaHQ6IG51bWJlciB8IHN0cmluZztcbiAgICBtaW5XaWR0aDogbnVtYmVyIHwgc3RyaW5nO1xuICAgIHJlYWRPbmx5OiBib29sZWFuO1xuICAgIHNjcm9sbGFibGU6IGJvb2xlYW4gfCBTY3JvbGxlciB8IG9iamVjdCB8IFBhcnRpYWw8U2Nyb2xsZXJDb25maWc+O1xuICAgIHRvb2x0aXA6IG9iamVjdCB8IHN0cmluZztcbiAgICB0cmlnZ2Vyczogb2JqZWN0O1xuICAgIHZhbHVlOiBzdHJpbmcgfCBhbnk7XG4gICAgd2lkdGg6IG51bWJlciB8IHN0cmluZztcbiAgICB4OiBudW1iZXI7XG4gICAgeTogbnVtYmVyO1xuICAgIGFuY2hvclNpemU6IG51bWJlcltdO1xuICAgIG9uQWN0aW9uOiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbkJlZm9yZURlc3Ryb3k6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uQmVmb3JlSGlkZTogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25CZWZvcmVTaG93OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbkNhdGNoQWxsOiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbkNoYW5nZTogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25DbGVhcjogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25EZXN0cm95OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbkZvY3VzSW46IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uRm9jdXNPdXQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uSGlkZTogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25JbnB1dDogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25QYWludDogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25SZWFkT25seTogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25SZXNpemU6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uU2hvdzogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25UcmlnZ2VyOiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYW5kIGFwcGVuZCB0aGUgdW5kZXJseWluZyB3aWRnZXRcbiAgICAgKi9cbiAgICBuZ09uSW5pdCgpOiB2b2lkO1xuICAgIC8qKlxuICAgICAqIFdhdGNoIGZvciBjaGFuZ2VzXG4gICAgICogQHBhcmFtIGNoYW5nZXNcbiAgICAgKi9cbiAgICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZDtcbiAgICAvKipcbiAgICAgKiBEZXN0cm95IHRoZSBjb21wb25lbnRcbiAgICAgKi9cbiAgICBuZ09uRGVzdHJveSgpOiB2b2lkO1xufVxuIl19