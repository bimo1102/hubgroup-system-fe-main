/**
 * Angular wrapper for Bryntum SlideToggle
 */
import { ElementRef, EventEmitter, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Base, Mask, MaskConfig, Rectangle, Scroller, ScrollerConfig, Widget } from '@bryntum/scheduler/scheduler.lite.umd.js';
import { SlideToggle } from '@bryntum/scheduler/scheduler.lite.umd.js';
import * as ɵngcc0 from '@angular/core';
export declare class BryntumSlideToggleComponent implements OnInit, OnDestroy {
    static instanceClass: typeof SlideToggle;
    private static bryntumFeatureNames;
    private static bryntumConfigs;
    private static bryntumConfigsOnly;
    private static bryntumProps;
    private elementRef;
    instance: SlideToggle;
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
    static ɵfac: ɵngcc0.ɵɵFactoryDef<BryntumSlideToggleComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<BryntumSlideToggleComponent, "bryntum-slide-toggle", never, { "adopt": "adopt"; "align": "align"; "anchor": "anchor"; "appendTo": "appendTo"; "autoComplete": "autoComplete"; "autoSelect": "autoSelect"; "bubbleEvents": "bubbleEvents"; "centered": "centered"; "clearable": "clearable"; "cls": "cls"; "color": "color"; "config": "config"; "constrainTo": "constrainTo"; "contentElementCls": "contentElementCls"; "defaultBindProperty": "defaultBindProperty"; "dock": "dock"; "draggable": "draggable"; "editable": "editable"; "floating": "floating"; "hideAnimation": "hideAnimation"; "highlightExternalChange": "highlightExternalChange"; "hint": "hint"; "hintHtml": "hintHtml"; "htmlCls": "htmlCls"; "inputAlign": "inputAlign"; "inputAttributes": "inputAttributes"; "inputWidth": "inputWidth"; "insertBefore": "insertBefore"; "insertFirst": "insertFirst"; "keyStrokeChangeDelay": "keyStrokeChangeDelay"; "labelCls": "labelCls"; "labelPosition": "labelPosition"; "labels": "labels"; "labelWidth": "labelWidth"; "listeners": "listeners"; "localeClass": "localeClass"; "localizableProperties": "localizableProperties"; "maskDefaults": "maskDefaults"; "masked": "masked"; "monitorResize": "monitorResize"; "owner": "owner"; "placeholder": "placeholder"; "positioned": "positioned"; "preventTooltipOnTouch": "preventTooltipOnTouch"; "required": "required"; "revertOnEscape": "revertOnEscape"; "ripple": "ripple"; "rootElement": "rootElement"; "scrollAction": "scrollAction"; "showAnimation": "showAnimation"; "tab": "tab"; "tag": "tag"; "text": "text"; "textAlign": "textAlign"; "title": "title"; "weight": "weight"; "alignSelf": "alignSelf"; "badge": "badge"; "checked": "checked"; "content": "content"; "dataset": "dataset"; "disabled": "disabled"; "extraData": "extraData"; "flex": "flex"; "height": "height"; "hidden": "hidden"; "html": "html"; "id": "id"; "label": "label"; "margin": "margin"; "maxHeight": "maxHeight"; "maxWidth": "maxWidth"; "minHeight": "minHeight"; "minWidth": "minWidth"; "name": "name"; "readOnly": "readOnly"; "scrollable": "scrollable"; "tooltip": "tooltip"; "triggers": "triggers"; "value": "value"; "width": "width"; "x": "x"; "y": "y"; "anchorSize": "anchorSize"; }, { "onAction": "onAction"; "onBeforeChange": "onBeforeChange"; "onBeforeDestroy": "onBeforeDestroy"; "onBeforeHide": "onBeforeHide"; "onBeforeShow": "onBeforeShow"; "onCatchAll": "onCatchAll"; "onChange": "onChange"; "onClear": "onClear"; "onDestroy": "onDestroy"; "onFocusIn": "onFocusIn"; "onFocusOut": "onFocusOut"; "onHide": "onHide"; "onInput": "onInput"; "onPaint": "onPaint"; "onReadOnly": "onReadOnly"; "onResize": "onResize"; "onShow": "onShow"; "onTrigger": "onTrigger"; }, never, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJ5bnR1bS1zbGlkZS10b2dnbGUuY29tcG9uZW50LmQudHMiLCJzb3VyY2VzIjpbImJyeW50dW0tc2xpZGUtdG9nZ2xlLmNvbXBvbmVudC5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQW5ndWxhciB3cmFwcGVyIGZvciBCcnludHVtIFNsaWRlVG9nZ2xlXG4gKi9cbmltcG9ydCB7IEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgT25EZXN0cm95LCBPbkluaXQsIFNpbXBsZUNoYW5nZXMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJhc2UsIE1hc2ssIE1hc2tDb25maWcsIFJlY3RhbmdsZSwgU2Nyb2xsZXIsIFNjcm9sbGVyQ29uZmlnLCBXaWRnZXQgfSBmcm9tICdAYnJ5bnR1bS9zY2hlZHVsZXIvc2NoZWR1bGVyLmxpdGUudW1kLmpzJztcbmltcG9ydCB7IFNsaWRlVG9nZ2xlIH0gZnJvbSAnQGJyeW50dW0vc2NoZWR1bGVyL3NjaGVkdWxlci5saXRlLnVtZC5qcyc7XG5leHBvcnQgZGVjbGFyZSBjbGFzcyBCcnludHVtU2xpZGVUb2dnbGVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gICAgc3RhdGljIGluc3RhbmNlQ2xhc3M6IHR5cGVvZiBTbGlkZVRvZ2dsZTtcbiAgICBwcml2YXRlIHN0YXRpYyBicnludHVtRmVhdHVyZU5hbWVzO1xuICAgIHByaXZhdGUgc3RhdGljIGJyeW50dW1Db25maWdzO1xuICAgIHByaXZhdGUgc3RhdGljIGJyeW50dW1Db25maWdzT25seTtcbiAgICBwcml2YXRlIHN0YXRpYyBicnludHVtUHJvcHM7XG4gICAgcHJpdmF0ZSBlbGVtZW50UmVmO1xuICAgIGluc3RhbmNlOiBTbGlkZVRvZ2dsZTtcbiAgICBwcml2YXRlIGJyeW50dW1Db25maWc7XG4gICAgY29uc3RydWN0b3IoZWxlbWVudDogRWxlbWVudFJlZik7XG4gICAgYWRvcHQ6IEhUTUxFbGVtZW50IHwgc3RyaW5nO1xuICAgIGFsaWduOiBvYmplY3QgfCBzdHJpbmc7XG4gICAgYW5jaG9yOiBib29sZWFuO1xuICAgIGFwcGVuZFRvOiBIVE1MRWxlbWVudCB8IHN0cmluZztcbiAgICBhdXRvQ29tcGxldGU6IHN0cmluZztcbiAgICBhdXRvU2VsZWN0OiBib29sZWFuO1xuICAgIGJ1YmJsZUV2ZW50czogb2JqZWN0O1xuICAgIGNlbnRlcmVkOiBib29sZWFuO1xuICAgIGNsZWFyYWJsZTogYm9vbGVhbiB8IG9iamVjdDtcbiAgICBjbHM6IHN0cmluZyB8IG9iamVjdDtcbiAgICBjb2xvcjogc3RyaW5nO1xuICAgIGNvbmZpZzogb2JqZWN0O1xuICAgIGNvbnN0cmFpblRvOiBIVE1MRWxlbWVudCB8IFdpZGdldCB8IFJlY3RhbmdsZTtcbiAgICBjb250ZW50RWxlbWVudENsczogc3RyaW5nIHwgb2JqZWN0O1xuICAgIGRlZmF1bHRCaW5kUHJvcGVydHk6IHN0cmluZztcbiAgICBkb2NrOiBzdHJpbmc7XG4gICAgZHJhZ2dhYmxlOiBib29sZWFuIHwgb2JqZWN0O1xuICAgIGVkaXRhYmxlOiBib29sZWFuO1xuICAgIGZsb2F0aW5nOiBib29sZWFuO1xuICAgIGhpZGVBbmltYXRpb246IGJvb2xlYW4gfCBvYmplY3Q7XG4gICAgaGlnaGxpZ2h0RXh0ZXJuYWxDaGFuZ2U6IGJvb2xlYW47XG4gICAgaGludDogc3RyaW5nIHwgRnVuY3Rpb247XG4gICAgaGludEh0bWw6IHN0cmluZyB8IEZ1bmN0aW9uO1xuICAgIGh0bWxDbHM6IHN0cmluZyB8IG9iamVjdDtcbiAgICBpbnB1dEFsaWduOiBzdHJpbmc7XG4gICAgaW5wdXRBdHRyaWJ1dGVzOiBvYmplY3Q7XG4gICAgaW5wdXRXaWR0aDogc3RyaW5nIHwgbnVtYmVyO1xuICAgIGluc2VydEJlZm9yZTogSFRNTEVsZW1lbnQgfCBzdHJpbmc7XG4gICAgaW5zZXJ0Rmlyc3Q6IEhUTUxFbGVtZW50IHwgc3RyaW5nO1xuICAgIGtleVN0cm9rZUNoYW5nZURlbGF5OiBudW1iZXI7XG4gICAgbGFiZWxDbHM6IHN0cmluZyB8IG9iamVjdDtcbiAgICBsYWJlbFBvc2l0aW9uOiBzdHJpbmc7XG4gICAgbGFiZWxzOiBvYmplY3Q7XG4gICAgbGFiZWxXaWR0aDogc3RyaW5nIHwgbnVtYmVyO1xuICAgIGxpc3RlbmVyczogb2JqZWN0O1xuICAgIGxvY2FsZUNsYXNzOiBCYXNlO1xuICAgIGxvY2FsaXphYmxlUHJvcGVydGllczogc3RyaW5nW107XG4gICAgbWFza0RlZmF1bHRzOiBvYmplY3QgfCBNYXNrIHwgUGFydGlhbDxNYXNrQ29uZmlnPjtcbiAgICBtYXNrZWQ6IGJvb2xlYW4gfCBzdHJpbmcgfCBvYmplY3QgfCBNYXNrIHwgUGFydGlhbDxNYXNrQ29uZmlnPjtcbiAgICBtb25pdG9yUmVzaXplOiBib29sZWFuO1xuICAgIG93bmVyOiBXaWRnZXQ7XG4gICAgcGxhY2Vob2xkZXI6IHN0cmluZztcbiAgICBwb3NpdGlvbmVkOiBib29sZWFuO1xuICAgIHByZXZlbnRUb29sdGlwT25Ub3VjaDogYm9vbGVhbjtcbiAgICByZXF1aXJlZDogYm9vbGVhbjtcbiAgICByZXZlcnRPbkVzY2FwZTogYm9vbGVhbjtcbiAgICByaXBwbGU6IGJvb2xlYW4gfCBvYmplY3Q7XG4gICAgcm9vdEVsZW1lbnQ6IFNoYWRvd1Jvb3Q7XG4gICAgc2Nyb2xsQWN0aW9uOiBzdHJpbmc7XG4gICAgc2hvd0FuaW1hdGlvbjogYm9vbGVhbiB8IG9iamVjdDtcbiAgICB0YWI6IGJvb2xlYW4gfCBvYmplY3Q7XG4gICAgdGFnOiBzdHJpbmc7XG4gICAgdGV4dDogc3RyaW5nO1xuICAgIHRleHRBbGlnbjogc3RyaW5nO1xuICAgIHRpdGxlOiBzdHJpbmc7XG4gICAgd2VpZ2h0OiBudW1iZXI7XG4gICAgYWxpZ25TZWxmOiBzdHJpbmc7XG4gICAgYmFkZ2U6IHN0cmluZztcbiAgICBjaGVja2VkOiBib29sZWFuO1xuICAgIGNvbnRlbnQ6IHN0cmluZztcbiAgICBkYXRhc2V0OiBvYmplY3Q7XG4gICAgZGlzYWJsZWQ6IGJvb2xlYW47XG4gICAgZXh0cmFEYXRhOiBib29sZWFuIHwgbnVtYmVyIHwgb2JqZWN0IHwgc3RyaW5nO1xuICAgIGZsZXg6IG51bWJlciB8IHN0cmluZztcbiAgICBoZWlnaHQ6IG51bWJlciB8IHN0cmluZztcbiAgICBoaWRkZW46IGJvb2xlYW47XG4gICAgaHRtbDogc3RyaW5nO1xuICAgIGlkOiBzdHJpbmc7XG4gICAgbGFiZWw6IHN0cmluZztcbiAgICBtYXJnaW46IG51bWJlciB8IHN0cmluZztcbiAgICBtYXhIZWlnaHQ6IG51bWJlciB8IHN0cmluZztcbiAgICBtYXhXaWR0aDogbnVtYmVyIHwgc3RyaW5nO1xuICAgIG1pbkhlaWdodDogbnVtYmVyIHwgc3RyaW5nO1xuICAgIG1pbldpZHRoOiBudW1iZXIgfCBzdHJpbmc7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIHJlYWRPbmx5OiBib29sZWFuO1xuICAgIHNjcm9sbGFibGU6IGJvb2xlYW4gfCBTY3JvbGxlciB8IG9iamVjdCB8IFBhcnRpYWw8U2Nyb2xsZXJDb25maWc+O1xuICAgIHRvb2x0aXA6IG9iamVjdCB8IHN0cmluZztcbiAgICB0cmlnZ2Vyczogb2JqZWN0O1xuICAgIHZhbHVlOiBzdHJpbmc7XG4gICAgd2lkdGg6IG51bWJlciB8IHN0cmluZztcbiAgICB4OiBudW1iZXI7XG4gICAgeTogbnVtYmVyO1xuICAgIGFuY2hvclNpemU6IG51bWJlcltdO1xuICAgIG9uQWN0aW9uOiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbkJlZm9yZUNoYW5nZTogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25CZWZvcmVEZXN0cm95OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbkJlZm9yZUhpZGU6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uQmVmb3JlU2hvdzogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25DYXRjaEFsbDogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25DaGFuZ2U6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uQ2xlYXI6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uRGVzdHJveTogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25Gb2N1c0luOiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbkZvY3VzT3V0OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbkhpZGU6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uSW5wdXQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uUGFpbnQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uUmVhZE9ubHk6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uUmVzaXplOiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvblNob3c6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uVHJpZ2dlcjogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGFuZCBhcHBlbmQgdGhlIHVuZGVybHlpbmcgd2lkZ2V0XG4gICAgICovXG4gICAgbmdPbkluaXQoKTogdm9pZDtcbiAgICAvKipcbiAgICAgKiBXYXRjaCBmb3IgY2hhbmdlc1xuICAgICAqIEBwYXJhbSBjaGFuZ2VzXG4gICAgICovXG4gICAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQ7XG4gICAgLyoqXG4gICAgICogRGVzdHJveSB0aGUgY29tcG9uZW50XG4gICAgICovXG4gICAgbmdPbkRlc3Ryb3koKTogdm9pZDtcbn1cbiJdfQ==