/**
 * Angular wrapper for Bryntum List
 */
import { ElementRef, EventEmitter, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Base, Collection, CollectionConfig, Mask, MaskConfig, Rectangle, Scroller, ScrollerConfig, Store, StoreConfig, Widget } from '@bryntum/scheduler/scheduler.lite.umd.js';
import { List } from '@bryntum/scheduler/scheduler.lite.umd.js';
import * as ɵngcc0 from '@angular/core';
export declare class BryntumListComponent implements OnInit, OnDestroy {
    static instanceClass: typeof List;
    private static bryntumFeatureNames;
    private static bryntumConfigs;
    private static bryntumConfigsOnly;
    private static bryntumProps;
    private elementRef;
    instance: List;
    private bryntumConfig;
    constructor(element: ElementRef);
    activateOnMouseover: boolean;
    adopt: HTMLElement | string;
    align: object | string;
    allowGroupSelect: boolean;
    anchor: boolean;
    appendTo: HTMLElement | string;
    bubbleEvents: object;
    centered: boolean;
    cls: string | object;
    config: object;
    constrainTo: HTMLElement | Widget | Rectangle;
    contentElementCls: string | object;
    defaultBindProperty: string;
    dock: string;
    draggable: boolean | object;
    floating: boolean;
    groupHeaderTpl: Function;
    hideAnimation: boolean | object;
    htmlCls: string | object;
    insertBefore: HTMLElement | string;
    insertFirst: HTMLElement | string;
    itemTpl: Function;
    listeners: object;
    localeClass: Base;
    localizableProperties: string[];
    maskDefaults: object | Mask | Partial<MaskConfig>;
    masked: boolean | string | object | Mask | Partial<MaskConfig>;
    monitorResize: boolean;
    multiSelect: boolean;
    owner: Widget;
    positioned: boolean;
    preventTooltipOnTouch: boolean;
    ripple: boolean | object;
    rootElement: ShadowRoot;
    scrollAction: string;
    selectAllItem: boolean | string;
    selected: Collection | object | Partial<CollectionConfig>;
    showAnimation: boolean | object;
    store: object | Store | Partial<StoreConfig>;
    tab: boolean | object;
    tag: string;
    textAlign: string;
    title: string;
    toggleAllIfCtrlPressed: boolean;
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
    items: object[];
    margin: number | string;
    maxHeight: number | string;
    maxWidth: number | string;
    minHeight: number | string;
    minWidth: number | string;
    readOnly: boolean;
    scrollable: boolean | Scroller | object | Partial<ScrollerConfig>;
    tooltip: object | string;
    width: number | string;
    x: number;
    y: number;
    anchorSize: number[];
    onBeforeDestroy: EventEmitter<object>;
    onBeforeHide: EventEmitter<object>;
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
    static ɵfac: ɵngcc0.ɵɵFactoryDef<BryntumListComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<BryntumListComponent, "bryntum-list", never, { "activateOnMouseover": "activateOnMouseover"; "adopt": "adopt"; "align": "align"; "allowGroupSelect": "allowGroupSelect"; "anchor": "anchor"; "appendTo": "appendTo"; "bubbleEvents": "bubbleEvents"; "centered": "centered"; "cls": "cls"; "config": "config"; "constrainTo": "constrainTo"; "contentElementCls": "contentElementCls"; "defaultBindProperty": "defaultBindProperty"; "dock": "dock"; "draggable": "draggable"; "floating": "floating"; "groupHeaderTpl": "groupHeaderTpl"; "hideAnimation": "hideAnimation"; "htmlCls": "htmlCls"; "insertBefore": "insertBefore"; "insertFirst": "insertFirst"; "itemTpl": "itemTpl"; "listeners": "listeners"; "localeClass": "localeClass"; "localizableProperties": "localizableProperties"; "maskDefaults": "maskDefaults"; "masked": "masked"; "monitorResize": "monitorResize"; "multiSelect": "multiSelect"; "owner": "owner"; "positioned": "positioned"; "preventTooltipOnTouch": "preventTooltipOnTouch"; "ripple": "ripple"; "rootElement": "rootElement"; "scrollAction": "scrollAction"; "selectAllItem": "selectAllItem"; "selected": "selected"; "showAnimation": "showAnimation"; "store": "store"; "tab": "tab"; "tag": "tag"; "textAlign": "textAlign"; "title": "title"; "toggleAllIfCtrlPressed": "toggleAllIfCtrlPressed"; "weight": "weight"; "alignSelf": "alignSelf"; "content": "content"; "dataset": "dataset"; "disabled": "disabled"; "extraData": "extraData"; "flex": "flex"; "height": "height"; "hidden": "hidden"; "html": "html"; "id": "id"; "items": "items"; "margin": "margin"; "maxHeight": "maxHeight"; "maxWidth": "maxWidth"; "minHeight": "minHeight"; "minWidth": "minWidth"; "readOnly": "readOnly"; "scrollable": "scrollable"; "tooltip": "tooltip"; "width": "width"; "x": "x"; "y": "y"; "anchorSize": "anchorSize"; }, { "onBeforeDestroy": "onBeforeDestroy"; "onBeforeHide": "onBeforeHide"; "onBeforeShow": "onBeforeShow"; "onCatchAll": "onCatchAll"; "onDestroy": "onDestroy"; "onFocusIn": "onFocusIn"; "onFocusOut": "onFocusOut"; "onHide": "onHide"; "onItem": "onItem"; "onPaint": "onPaint"; "onReadOnly": "onReadOnly"; "onResize": "onResize"; "onShow": "onShow"; }, never, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJ5bnR1bS1saXN0LmNvbXBvbmVudC5kLnRzIiwic291cmNlcyI6WyJicnludHVtLWxpc3QuY29tcG9uZW50LmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBBbmd1bGFyIHdyYXBwZXIgZm9yIEJyeW50dW0gTGlzdFxuICovXG5pbXBvcnQgeyBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIE9uRGVzdHJveSwgT25Jbml0LCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCYXNlLCBDb2xsZWN0aW9uLCBDb2xsZWN0aW9uQ29uZmlnLCBNYXNrLCBNYXNrQ29uZmlnLCBSZWN0YW5nbGUsIFNjcm9sbGVyLCBTY3JvbGxlckNvbmZpZywgU3RvcmUsIFN0b3JlQ29uZmlnLCBXaWRnZXQgfSBmcm9tICdAYnJ5bnR1bS9zY2hlZHVsZXIvc2NoZWR1bGVyLmxpdGUudW1kLmpzJztcbmltcG9ydCB7IExpc3QgfSBmcm9tICdAYnJ5bnR1bS9zY2hlZHVsZXIvc2NoZWR1bGVyLmxpdGUudW1kLmpzJztcbmV4cG9ydCBkZWNsYXJlIGNsYXNzIEJyeW50dW1MaXN0Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICAgIHN0YXRpYyBpbnN0YW5jZUNsYXNzOiB0eXBlb2YgTGlzdDtcbiAgICBwcml2YXRlIHN0YXRpYyBicnludHVtRmVhdHVyZU5hbWVzO1xuICAgIHByaXZhdGUgc3RhdGljIGJyeW50dW1Db25maWdzO1xuICAgIHByaXZhdGUgc3RhdGljIGJyeW50dW1Db25maWdzT25seTtcbiAgICBwcml2YXRlIHN0YXRpYyBicnludHVtUHJvcHM7XG4gICAgcHJpdmF0ZSBlbGVtZW50UmVmO1xuICAgIGluc3RhbmNlOiBMaXN0O1xuICAgIHByaXZhdGUgYnJ5bnR1bUNvbmZpZztcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50OiBFbGVtZW50UmVmKTtcbiAgICBhY3RpdmF0ZU9uTW91c2VvdmVyOiBib29sZWFuO1xuICAgIGFkb3B0OiBIVE1MRWxlbWVudCB8IHN0cmluZztcbiAgICBhbGlnbjogb2JqZWN0IHwgc3RyaW5nO1xuICAgIGFsbG93R3JvdXBTZWxlY3Q6IGJvb2xlYW47XG4gICAgYW5jaG9yOiBib29sZWFuO1xuICAgIGFwcGVuZFRvOiBIVE1MRWxlbWVudCB8IHN0cmluZztcbiAgICBidWJibGVFdmVudHM6IG9iamVjdDtcbiAgICBjZW50ZXJlZDogYm9vbGVhbjtcbiAgICBjbHM6IHN0cmluZyB8IG9iamVjdDtcbiAgICBjb25maWc6IG9iamVjdDtcbiAgICBjb25zdHJhaW5UbzogSFRNTEVsZW1lbnQgfCBXaWRnZXQgfCBSZWN0YW5nbGU7XG4gICAgY29udGVudEVsZW1lbnRDbHM6IHN0cmluZyB8IG9iamVjdDtcbiAgICBkZWZhdWx0QmluZFByb3BlcnR5OiBzdHJpbmc7XG4gICAgZG9jazogc3RyaW5nO1xuICAgIGRyYWdnYWJsZTogYm9vbGVhbiB8IG9iamVjdDtcbiAgICBmbG9hdGluZzogYm9vbGVhbjtcbiAgICBncm91cEhlYWRlclRwbDogRnVuY3Rpb247XG4gICAgaGlkZUFuaW1hdGlvbjogYm9vbGVhbiB8IG9iamVjdDtcbiAgICBodG1sQ2xzOiBzdHJpbmcgfCBvYmplY3Q7XG4gICAgaW5zZXJ0QmVmb3JlOiBIVE1MRWxlbWVudCB8IHN0cmluZztcbiAgICBpbnNlcnRGaXJzdDogSFRNTEVsZW1lbnQgfCBzdHJpbmc7XG4gICAgaXRlbVRwbDogRnVuY3Rpb247XG4gICAgbGlzdGVuZXJzOiBvYmplY3Q7XG4gICAgbG9jYWxlQ2xhc3M6IEJhc2U7XG4gICAgbG9jYWxpemFibGVQcm9wZXJ0aWVzOiBzdHJpbmdbXTtcbiAgICBtYXNrRGVmYXVsdHM6IG9iamVjdCB8IE1hc2sgfCBQYXJ0aWFsPE1hc2tDb25maWc+O1xuICAgIG1hc2tlZDogYm9vbGVhbiB8IHN0cmluZyB8IG9iamVjdCB8IE1hc2sgfCBQYXJ0aWFsPE1hc2tDb25maWc+O1xuICAgIG1vbml0b3JSZXNpemU6IGJvb2xlYW47XG4gICAgbXVsdGlTZWxlY3Q6IGJvb2xlYW47XG4gICAgb3duZXI6IFdpZGdldDtcbiAgICBwb3NpdGlvbmVkOiBib29sZWFuO1xuICAgIHByZXZlbnRUb29sdGlwT25Ub3VjaDogYm9vbGVhbjtcbiAgICByaXBwbGU6IGJvb2xlYW4gfCBvYmplY3Q7XG4gICAgcm9vdEVsZW1lbnQ6IFNoYWRvd1Jvb3Q7XG4gICAgc2Nyb2xsQWN0aW9uOiBzdHJpbmc7XG4gICAgc2VsZWN0QWxsSXRlbTogYm9vbGVhbiB8IHN0cmluZztcbiAgICBzZWxlY3RlZDogQ29sbGVjdGlvbiB8IG9iamVjdCB8IFBhcnRpYWw8Q29sbGVjdGlvbkNvbmZpZz47XG4gICAgc2hvd0FuaW1hdGlvbjogYm9vbGVhbiB8IG9iamVjdDtcbiAgICBzdG9yZTogb2JqZWN0IHwgU3RvcmUgfCBQYXJ0aWFsPFN0b3JlQ29uZmlnPjtcbiAgICB0YWI6IGJvb2xlYW4gfCBvYmplY3Q7XG4gICAgdGFnOiBzdHJpbmc7XG4gICAgdGV4dEFsaWduOiBzdHJpbmc7XG4gICAgdGl0bGU6IHN0cmluZztcbiAgICB0b2dnbGVBbGxJZkN0cmxQcmVzc2VkOiBib29sZWFuO1xuICAgIHdlaWdodDogbnVtYmVyO1xuICAgIGFsaWduU2VsZjogc3RyaW5nO1xuICAgIGNvbnRlbnQ6IHN0cmluZztcbiAgICBkYXRhc2V0OiBvYmplY3Q7XG4gICAgZGlzYWJsZWQ6IGJvb2xlYW47XG4gICAgZXh0cmFEYXRhOiBib29sZWFuIHwgbnVtYmVyIHwgb2JqZWN0IHwgc3RyaW5nO1xuICAgIGZsZXg6IG51bWJlciB8IHN0cmluZztcbiAgICBoZWlnaHQ6IG51bWJlciB8IHN0cmluZztcbiAgICBoaWRkZW46IGJvb2xlYW47XG4gICAgaHRtbDogc3RyaW5nO1xuICAgIGlkOiBzdHJpbmc7XG4gICAgaXRlbXM6IG9iamVjdFtdO1xuICAgIG1hcmdpbjogbnVtYmVyIHwgc3RyaW5nO1xuICAgIG1heEhlaWdodDogbnVtYmVyIHwgc3RyaW5nO1xuICAgIG1heFdpZHRoOiBudW1iZXIgfCBzdHJpbmc7XG4gICAgbWluSGVpZ2h0OiBudW1iZXIgfCBzdHJpbmc7XG4gICAgbWluV2lkdGg6IG51bWJlciB8IHN0cmluZztcbiAgICByZWFkT25seTogYm9vbGVhbjtcbiAgICBzY3JvbGxhYmxlOiBib29sZWFuIHwgU2Nyb2xsZXIgfCBvYmplY3QgfCBQYXJ0aWFsPFNjcm9sbGVyQ29uZmlnPjtcbiAgICB0b29sdGlwOiBvYmplY3QgfCBzdHJpbmc7XG4gICAgd2lkdGg6IG51bWJlciB8IHN0cmluZztcbiAgICB4OiBudW1iZXI7XG4gICAgeTogbnVtYmVyO1xuICAgIGFuY2hvclNpemU6IG51bWJlcltdO1xuICAgIG9uQmVmb3JlRGVzdHJveTogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25CZWZvcmVIaWRlOiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbkJlZm9yZVNob3c6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uQ2F0Y2hBbGw6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uRGVzdHJveTogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25Gb2N1c0luOiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbkZvY3VzT3V0OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbkhpZGU6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uSXRlbTogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25QYWludDogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25SZWFkT25seTogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25SZXNpemU6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uU2hvdzogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGFuZCBhcHBlbmQgdGhlIHVuZGVybHlpbmcgd2lkZ2V0XG4gICAgICovXG4gICAgbmdPbkluaXQoKTogdm9pZDtcbiAgICAvKipcbiAgICAgKiBXYXRjaCBmb3IgY2hhbmdlc1xuICAgICAqIEBwYXJhbSBjaGFuZ2VzXG4gICAgICovXG4gICAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQ7XG4gICAgLyoqXG4gICAgICogRGVzdHJveSB0aGUgY29tcG9uZW50XG4gICAgICovXG4gICAgbmdPbkRlc3Ryb3koKTogdm9pZDtcbn1cbiJdfQ==