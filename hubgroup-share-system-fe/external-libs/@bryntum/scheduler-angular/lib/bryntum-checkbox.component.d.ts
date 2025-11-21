/**
 * Angular wrapper for Bryntum Checkbox
 */
import { ElementRef, EventEmitter, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Base, Mask, MaskConfig, Rectangle, Scroller, ScrollerConfig, Widget } from '@bryntum/scheduler/scheduler.lite.umd.js';
import { Checkbox } from '@bryntum/scheduler/scheduler.lite.umd.js';
import * as ɵngcc0 from '@angular/core';
export declare class BryntumCheckboxComponent implements OnInit, OnDestroy {
    static instanceClass: typeof Checkbox;
    private static bryntumFeatureNames;
    private static bryntumConfigs;
    private static bryntumConfigsOnly;
    private static bryntumProps;
    private elementRef;
    instance: Checkbox;
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
    color: string;
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
    monitorResize: boolean;
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
    text: string;
    textAlign: string;
    title: string;
    weight: number;
    alignSelf: string;
    badge: string;
    checked: boolean;
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
    name: string;
    readOnly: boolean;
    scrollable: boolean | Scroller | object | Partial<ScrollerConfig>;
    tooltip: object | string;
    triggers: object;
    value: string;
    width: number | string;
    x: number;
    y: number;
    anchorSize: number[];
    onAction: EventEmitter<object>;
    onBeforeChange: EventEmitter<object>;
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
    static ɵfac: ɵngcc0.ɵɵFactoryDef<BryntumCheckboxComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<BryntumCheckboxComponent, "bryntum-checkbox", never, { "adopt": "adopt"; "align": "align"; "anchor": "anchor"; "appendTo": "appendTo"; "autoComplete": "autoComplete"; "autoSelect": "autoSelect"; "bubbleEvents": "bubbleEvents"; "centered": "centered"; "clearable": "clearable"; "cls": "cls"; "color": "color"; "config": "config"; "constrainTo": "constrainTo"; "contentElementCls": "contentElementCls"; "defaultBindProperty": "defaultBindProperty"; "dock": "dock"; "draggable": "draggable"; "editable": "editable"; "floating": "floating"; "hideAnimation": "hideAnimation"; "highlightExternalChange": "highlightExternalChange"; "hint": "hint"; "hintHtml": "hintHtml"; "htmlCls": "htmlCls"; "inputAlign": "inputAlign"; "inputAttributes": "inputAttributes"; "inputWidth": "inputWidth"; "insertBefore": "insertBefore"; "insertFirst": "insertFirst"; "keyStrokeChangeDelay": "keyStrokeChangeDelay"; "labelCls": "labelCls"; "labelPosition": "labelPosition"; "labels": "labels"; "labelWidth": "labelWidth"; "listeners": "listeners"; "localeClass": "localeClass"; "localizableProperties": "localizableProperties"; "maskDefaults": "maskDefaults"; "masked": "masked"; "monitorResize": "monitorResize"; "owner": "owner"; "placeholder": "placeholder"; "positioned": "positioned"; "preventTooltipOnTouch": "preventTooltipOnTouch"; "required": "required"; "revertOnEscape": "revertOnEscape"; "ripple": "ripple"; "rootElement": "rootElement"; "scrollAction": "scrollAction"; "showAnimation": "showAnimation"; "tab": "tab"; "tag": "tag"; "text": "text"; "textAlign": "textAlign"; "title": "title"; "weight": "weight"; "alignSelf": "alignSelf"; "badge": "badge"; "checked": "checked"; "content": "content"; "dataset": "dataset"; "disabled": "disabled"; "extraData": "extraData"; "flex": "flex"; "height": "height"; "hidden": "hidden"; "html": "html"; "id": "id"; "label": "label"; "margin": "margin"; "maxHeight": "maxHeight"; "maxWidth": "maxWidth"; "minHeight": "minHeight"; "minWidth": "minWidth"; "name": "name"; "readOnly": "readOnly"; "scrollable": "scrollable"; "tooltip": "tooltip"; "triggers": "triggers"; "value": "value"; "width": "width"; "x": "x"; "y": "y"; "anchorSize": "anchorSize"; }, { "onAction": "onAction"; "onBeforeChange": "onBeforeChange"; "onBeforeDestroy": "onBeforeDestroy"; "onBeforeHide": "onBeforeHide"; "onBeforeShow": "onBeforeShow"; "onCatchAll": "onCatchAll"; "onChange": "onChange"; "onClear": "onClear"; "onDestroy": "onDestroy"; "onFocusIn": "onFocusIn"; "onFocusOut": "onFocusOut"; "onHide": "onHide"; "onInput": "onInput"; "onPaint": "onPaint"; "onReadOnly": "onReadOnly"; "onResize": "onResize"; "onShow": "onShow"; "onTrigger": "onTrigger"; }, never, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJ5bnR1bS1jaGVja2JveC5jb21wb25lbnQuZC50cyIsInNvdXJjZXMiOlsiYnJ5bnR1bS1jaGVja2JveC5jb21wb25lbnQuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEFuZ3VsYXIgd3JhcHBlciBmb3IgQnJ5bnR1bSBDaGVja2JveFxuICovXG5pbXBvcnQgeyBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIE9uRGVzdHJveSwgT25Jbml0LCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCYXNlLCBNYXNrLCBNYXNrQ29uZmlnLCBSZWN0YW5nbGUsIFNjcm9sbGVyLCBTY3JvbGxlckNvbmZpZywgV2lkZ2V0IH0gZnJvbSAnQGJyeW50dW0vc2NoZWR1bGVyL3NjaGVkdWxlci5saXRlLnVtZC5qcyc7XG5pbXBvcnQgeyBDaGVja2JveCB9IGZyb20gJ0BicnludHVtL3NjaGVkdWxlci9zY2hlZHVsZXIubGl0ZS51bWQuanMnO1xuZXhwb3J0IGRlY2xhcmUgY2xhc3MgQnJ5bnR1bUNoZWNrYm94Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICAgIHN0YXRpYyBpbnN0YW5jZUNsYXNzOiB0eXBlb2YgQ2hlY2tib3g7XG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bUZlYXR1cmVOYW1lcztcbiAgICBwcml2YXRlIHN0YXRpYyBicnludHVtQ29uZmlncztcbiAgICBwcml2YXRlIHN0YXRpYyBicnludHVtQ29uZmlnc09ubHk7XG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bVByb3BzO1xuICAgIHByaXZhdGUgZWxlbWVudFJlZjtcbiAgICBpbnN0YW5jZTogQ2hlY2tib3g7XG4gICAgcHJpdmF0ZSBicnludHVtQ29uZmlnO1xuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQ6IEVsZW1lbnRSZWYpO1xuICAgIGFkb3B0OiBIVE1MRWxlbWVudCB8IHN0cmluZztcbiAgICBhbGlnbjogb2JqZWN0IHwgc3RyaW5nO1xuICAgIGFuY2hvcjogYm9vbGVhbjtcbiAgICBhcHBlbmRUbzogSFRNTEVsZW1lbnQgfCBzdHJpbmc7XG4gICAgYXV0b0NvbXBsZXRlOiBzdHJpbmc7XG4gICAgYXV0b1NlbGVjdDogYm9vbGVhbjtcbiAgICBidWJibGVFdmVudHM6IG9iamVjdDtcbiAgICBjZW50ZXJlZDogYm9vbGVhbjtcbiAgICBjbGVhcmFibGU6IGJvb2xlYW4gfCBvYmplY3Q7XG4gICAgY2xzOiBzdHJpbmcgfCBvYmplY3Q7XG4gICAgY29sb3I6IHN0cmluZztcbiAgICBjb25maWc6IG9iamVjdDtcbiAgICBjb25zdHJhaW5UbzogSFRNTEVsZW1lbnQgfCBXaWRnZXQgfCBSZWN0YW5nbGU7XG4gICAgY29udGVudEVsZW1lbnRDbHM6IHN0cmluZyB8IG9iamVjdDtcbiAgICBkZWZhdWx0QmluZFByb3BlcnR5OiBzdHJpbmc7XG4gICAgZG9jazogc3RyaW5nO1xuICAgIGRyYWdnYWJsZTogYm9vbGVhbiB8IG9iamVjdDtcbiAgICBlZGl0YWJsZTogYm9vbGVhbjtcbiAgICBmbG9hdGluZzogYm9vbGVhbjtcbiAgICBoaWRlQW5pbWF0aW9uOiBib29sZWFuIHwgb2JqZWN0O1xuICAgIGhpZ2hsaWdodEV4dGVybmFsQ2hhbmdlOiBib29sZWFuO1xuICAgIGhpbnQ6IHN0cmluZyB8IEZ1bmN0aW9uO1xuICAgIGhpbnRIdG1sOiBzdHJpbmcgfCBGdW5jdGlvbjtcbiAgICBodG1sQ2xzOiBzdHJpbmcgfCBvYmplY3Q7XG4gICAgaW5wdXRBbGlnbjogc3RyaW5nO1xuICAgIGlucHV0QXR0cmlidXRlczogb2JqZWN0O1xuICAgIGlucHV0V2lkdGg6IHN0cmluZyB8IG51bWJlcjtcbiAgICBpbnNlcnRCZWZvcmU6IEhUTUxFbGVtZW50IHwgc3RyaW5nO1xuICAgIGluc2VydEZpcnN0OiBIVE1MRWxlbWVudCB8IHN0cmluZztcbiAgICBrZXlTdHJva2VDaGFuZ2VEZWxheTogbnVtYmVyO1xuICAgIGxhYmVsQ2xzOiBzdHJpbmcgfCBvYmplY3Q7XG4gICAgbGFiZWxQb3NpdGlvbjogc3RyaW5nO1xuICAgIGxhYmVsczogb2JqZWN0O1xuICAgIGxhYmVsV2lkdGg6IHN0cmluZyB8IG51bWJlcjtcbiAgICBsaXN0ZW5lcnM6IG9iamVjdDtcbiAgICBsb2NhbGVDbGFzczogQmFzZTtcbiAgICBsb2NhbGl6YWJsZVByb3BlcnRpZXM6IHN0cmluZ1tdO1xuICAgIG1hc2tEZWZhdWx0czogb2JqZWN0IHwgTWFzayB8IFBhcnRpYWw8TWFza0NvbmZpZz47XG4gICAgbWFza2VkOiBib29sZWFuIHwgc3RyaW5nIHwgb2JqZWN0IHwgTWFzayB8IFBhcnRpYWw8TWFza0NvbmZpZz47XG4gICAgbW9uaXRvclJlc2l6ZTogYm9vbGVhbjtcbiAgICBvd25lcjogV2lkZ2V0O1xuICAgIHBsYWNlaG9sZGVyOiBzdHJpbmc7XG4gICAgcG9zaXRpb25lZDogYm9vbGVhbjtcbiAgICBwcmV2ZW50VG9vbHRpcE9uVG91Y2g6IGJvb2xlYW47XG4gICAgcmVxdWlyZWQ6IGJvb2xlYW47XG4gICAgcmV2ZXJ0T25Fc2NhcGU6IGJvb2xlYW47XG4gICAgcmlwcGxlOiBib29sZWFuIHwgb2JqZWN0O1xuICAgIHJvb3RFbGVtZW50OiBTaGFkb3dSb290O1xuICAgIHNjcm9sbEFjdGlvbjogc3RyaW5nO1xuICAgIHNob3dBbmltYXRpb246IGJvb2xlYW4gfCBvYmplY3Q7XG4gICAgdGFiOiBib29sZWFuIHwgb2JqZWN0O1xuICAgIHRhZzogc3RyaW5nO1xuICAgIHRleHQ6IHN0cmluZztcbiAgICB0ZXh0QWxpZ246IHN0cmluZztcbiAgICB0aXRsZTogc3RyaW5nO1xuICAgIHdlaWdodDogbnVtYmVyO1xuICAgIGFsaWduU2VsZjogc3RyaW5nO1xuICAgIGJhZGdlOiBzdHJpbmc7XG4gICAgY2hlY2tlZDogYm9vbGVhbjtcbiAgICBjb250ZW50OiBzdHJpbmc7XG4gICAgZGF0YXNldDogb2JqZWN0O1xuICAgIGRpc2FibGVkOiBib29sZWFuO1xuICAgIGV4dHJhRGF0YTogYm9vbGVhbiB8IG51bWJlciB8IG9iamVjdCB8IHN0cmluZztcbiAgICBmbGV4OiBudW1iZXIgfCBzdHJpbmc7XG4gICAgaGVpZ2h0OiBudW1iZXIgfCBzdHJpbmc7XG4gICAgaGlkZGVuOiBib29sZWFuO1xuICAgIGh0bWw6IHN0cmluZztcbiAgICBpZDogc3RyaW5nO1xuICAgIGxhYmVsOiBzdHJpbmc7XG4gICAgbWFyZ2luOiBudW1iZXIgfCBzdHJpbmc7XG4gICAgbWF4SGVpZ2h0OiBudW1iZXIgfCBzdHJpbmc7XG4gICAgbWF4V2lkdGg6IG51bWJlciB8IHN0cmluZztcbiAgICBtaW5IZWlnaHQ6IG51bWJlciB8IHN0cmluZztcbiAgICBtaW5XaWR0aDogbnVtYmVyIHwgc3RyaW5nO1xuICAgIG5hbWU6IHN0cmluZztcbiAgICByZWFkT25seTogYm9vbGVhbjtcbiAgICBzY3JvbGxhYmxlOiBib29sZWFuIHwgU2Nyb2xsZXIgfCBvYmplY3QgfCBQYXJ0aWFsPFNjcm9sbGVyQ29uZmlnPjtcbiAgICB0b29sdGlwOiBvYmplY3QgfCBzdHJpbmc7XG4gICAgdHJpZ2dlcnM6IG9iamVjdDtcbiAgICB2YWx1ZTogc3RyaW5nO1xuICAgIHdpZHRoOiBudW1iZXIgfCBzdHJpbmc7XG4gICAgeDogbnVtYmVyO1xuICAgIHk6IG51bWJlcjtcbiAgICBhbmNob3JTaXplOiBudW1iZXJbXTtcbiAgICBvbkFjdGlvbjogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25CZWZvcmVDaGFuZ2U6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uQmVmb3JlRGVzdHJveTogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25CZWZvcmVIaWRlOiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbkJlZm9yZVNob3c6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uQ2F0Y2hBbGw6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uQ2hhbmdlOiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbkNsZWFyOiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbkRlc3Ryb3k6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uRm9jdXNJbjogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25Gb2N1c091dDogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25IaWRlOiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbklucHV0OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvblBhaW50OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvblJlYWRPbmx5OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvblJlc2l6ZTogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25TaG93OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvblRyaWdnZXI6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhbmQgYXBwZW5kIHRoZSB1bmRlcmx5aW5nIHdpZGdldFxuICAgICAqL1xuICAgIG5nT25Jbml0KCk6IHZvaWQ7XG4gICAgLyoqXG4gICAgICogV2F0Y2ggZm9yIGNoYW5nZXNcbiAgICAgKiBAcGFyYW0gY2hhbmdlc1xuICAgICAqL1xuICAgIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkO1xuICAgIC8qKlxuICAgICAqIERlc3Ryb3kgdGhlIGNvbXBvbmVudFxuICAgICAqL1xuICAgIG5nT25EZXN0cm95KCk6IHZvaWQ7XG59XG4iXX0=