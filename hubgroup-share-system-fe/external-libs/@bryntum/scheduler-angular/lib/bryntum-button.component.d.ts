/**
 * Angular wrapper for Bryntum Button
 */
import { ElementRef, EventEmitter, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Base, Mask, MaskConfig, Rectangle, Scroller, ScrollerConfig, Widget, WidgetConfig } from '@bryntum/scheduler/scheduler.lite.umd.js';
import { Button } from '@bryntum/scheduler/scheduler.lite.umd.js';
import * as ɵngcc0 from '@angular/core';
export declare class BryntumButtonComponent implements OnInit, OnDestroy {
    static instanceClass: typeof Button;
    private static bryntumFeatureNames;
    private static bryntumConfigs;
    private static bryntumConfigsOnly;
    private static bryntumProps;
    private elementRef;
    instance: Button;
    private bryntumConfig;
    constructor(element: ElementRef);
    adopt: HTMLElement | string;
    align: object | string;
    anchor: boolean;
    appendTo: HTMLElement | string;
    bubbleEvents: object;
    centered: boolean;
    cls: string | object;
    color: string;
    config: object;
    constrainTo: HTMLElement | Widget | Rectangle;
    contentElementCls: string | object;
    defaultBindProperty: string;
    dock: string;
    draggable: boolean | object;
    floating: boolean;
    hideAnimation: boolean | object;
    href: string;
    htmlCls: string | object;
    insertBefore: HTMLElement | string;
    insertFirst: HTMLElement | string;
    listeners: object;
    localeClass: Base;
    localizableProperties: string[];
    maskDefaults: object | Mask | Partial<MaskConfig>;
    masked: boolean | string | object | Mask | Partial<MaskConfig>;
    monitorResize: boolean;
    owner: Widget;
    positioned: boolean;
    preventTooltipOnTouch: boolean;
    ripple: boolean | object;
    rootElement: ShadowRoot;
    scrollAction: string;
    showAnimation: boolean | object;
    tab: boolean | object;
    tag: string;
    target: string;
    textAlign: string;
    title: string;
    toggleable: boolean;
    toggleGroup: string;
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
    icon: string;
    iconAlign: string;
    id: string;
    margin: number | string;
    maxHeight: number | string;
    maxWidth: number | string;
    menu: Widget | object | object[] | Partial<WidgetConfig> | Partial<WidgetConfig>[];
    minHeight: number | string;
    minWidth: number | string;
    pressed: boolean;
    pressedIcon: string;
    readOnly: boolean;
    scrollable: boolean | Scroller | object | Partial<ScrollerConfig>;
    text: string;
    tooltip: object | string;
    width: number | string;
    x: number;
    y: number;
    anchorSize: number[];
    onAction: EventEmitter<object>;
    onBeforeDestroy: EventEmitter<object>;
    onBeforeHide: EventEmitter<object>;
    onBeforeShow: EventEmitter<object>;
    onCatchAll: EventEmitter<object>;
    onClick: EventEmitter<object>;
    onDestroy: EventEmitter<object>;
    onFocusIn: EventEmitter<object>;
    onFocusOut: EventEmitter<object>;
    onHide: EventEmitter<object>;
    onPaint: EventEmitter<object>;
    onReadOnly: EventEmitter<object>;
    onResize: EventEmitter<object>;
    onShow: EventEmitter<object>;
    onToggle: EventEmitter<object>;
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
    static ɵfac: ɵngcc0.ɵɵFactoryDef<BryntumButtonComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<BryntumButtonComponent, "bryntum-button", never, { "adopt": "adopt"; "align": "align"; "anchor": "anchor"; "appendTo": "appendTo"; "bubbleEvents": "bubbleEvents"; "centered": "centered"; "cls": "cls"; "color": "color"; "config": "config"; "constrainTo": "constrainTo"; "contentElementCls": "contentElementCls"; "defaultBindProperty": "defaultBindProperty"; "dock": "dock"; "draggable": "draggable"; "floating": "floating"; "hideAnimation": "hideAnimation"; "href": "href"; "htmlCls": "htmlCls"; "insertBefore": "insertBefore"; "insertFirst": "insertFirst"; "listeners": "listeners"; "localeClass": "localeClass"; "localizableProperties": "localizableProperties"; "maskDefaults": "maskDefaults"; "masked": "masked"; "monitorResize": "monitorResize"; "owner": "owner"; "positioned": "positioned"; "preventTooltipOnTouch": "preventTooltipOnTouch"; "ripple": "ripple"; "rootElement": "rootElement"; "scrollAction": "scrollAction"; "showAnimation": "showAnimation"; "tab": "tab"; "tag": "tag"; "target": "target"; "textAlign": "textAlign"; "title": "title"; "toggleable": "toggleable"; "toggleGroup": "toggleGroup"; "weight": "weight"; "alignSelf": "alignSelf"; "badge": "badge"; "content": "content"; "dataset": "dataset"; "disabled": "disabled"; "extraData": "extraData"; "flex": "flex"; "height": "height"; "hidden": "hidden"; "html": "html"; "icon": "icon"; "iconAlign": "iconAlign"; "id": "id"; "margin": "margin"; "maxHeight": "maxHeight"; "maxWidth": "maxWidth"; "menu": "menu"; "minHeight": "minHeight"; "minWidth": "minWidth"; "pressed": "pressed"; "pressedIcon": "pressedIcon"; "readOnly": "readOnly"; "scrollable": "scrollable"; "text": "text"; "tooltip": "tooltip"; "width": "width"; "x": "x"; "y": "y"; "anchorSize": "anchorSize"; }, { "onAction": "onAction"; "onBeforeDestroy": "onBeforeDestroy"; "onBeforeHide": "onBeforeHide"; "onBeforeShow": "onBeforeShow"; "onCatchAll": "onCatchAll"; "onClick": "onClick"; "onDestroy": "onDestroy"; "onFocusIn": "onFocusIn"; "onFocusOut": "onFocusOut"; "onHide": "onHide"; "onPaint": "onPaint"; "onReadOnly": "onReadOnly"; "onResize": "onResize"; "onShow": "onShow"; "onToggle": "onToggle"; }, never, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJ5bnR1bS1idXR0b24uY29tcG9uZW50LmQudHMiLCJzb3VyY2VzIjpbImJyeW50dW0tYnV0dG9uLmNvbXBvbmVudC5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBBbmd1bGFyIHdyYXBwZXIgZm9yIEJyeW50dW0gQnV0dG9uXG4gKi9cbmltcG9ydCB7IEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgT25EZXN0cm95LCBPbkluaXQsIFNpbXBsZUNoYW5nZXMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJhc2UsIE1hc2ssIE1hc2tDb25maWcsIFJlY3RhbmdsZSwgU2Nyb2xsZXIsIFNjcm9sbGVyQ29uZmlnLCBXaWRnZXQsIFdpZGdldENvbmZpZyB9IGZyb20gJ0BicnludHVtL3NjaGVkdWxlci9zY2hlZHVsZXIubGl0ZS51bWQuanMnO1xuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnQGJyeW50dW0vc2NoZWR1bGVyL3NjaGVkdWxlci5saXRlLnVtZC5qcyc7XG5leHBvcnQgZGVjbGFyZSBjbGFzcyBCcnludHVtQnV0dG9uQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICAgIHN0YXRpYyBpbnN0YW5jZUNsYXNzOiB0eXBlb2YgQnV0dG9uO1xuICAgIHByaXZhdGUgc3RhdGljIGJyeW50dW1GZWF0dXJlTmFtZXM7XG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bUNvbmZpZ3M7XG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJ5bnR1bUNvbmZpZ3NPbmx5O1xuICAgIHByaXZhdGUgc3RhdGljIGJyeW50dW1Qcm9wcztcbiAgICBwcml2YXRlIGVsZW1lbnRSZWY7XG4gICAgaW5zdGFuY2U6IEJ1dHRvbjtcbiAgICBwcml2YXRlIGJyeW50dW1Db25maWc7XG4gICAgY29uc3RydWN0b3IoZWxlbWVudDogRWxlbWVudFJlZik7XG4gICAgYWRvcHQ6IEhUTUxFbGVtZW50IHwgc3RyaW5nO1xuICAgIGFsaWduOiBvYmplY3QgfCBzdHJpbmc7XG4gICAgYW5jaG9yOiBib29sZWFuO1xuICAgIGFwcGVuZFRvOiBIVE1MRWxlbWVudCB8IHN0cmluZztcbiAgICBidWJibGVFdmVudHM6IG9iamVjdDtcbiAgICBjZW50ZXJlZDogYm9vbGVhbjtcbiAgICBjbHM6IHN0cmluZyB8IG9iamVjdDtcbiAgICBjb2xvcjogc3RyaW5nO1xuICAgIGNvbmZpZzogb2JqZWN0O1xuICAgIGNvbnN0cmFpblRvOiBIVE1MRWxlbWVudCB8IFdpZGdldCB8IFJlY3RhbmdsZTtcbiAgICBjb250ZW50RWxlbWVudENsczogc3RyaW5nIHwgb2JqZWN0O1xuICAgIGRlZmF1bHRCaW5kUHJvcGVydHk6IHN0cmluZztcbiAgICBkb2NrOiBzdHJpbmc7XG4gICAgZHJhZ2dhYmxlOiBib29sZWFuIHwgb2JqZWN0O1xuICAgIGZsb2F0aW5nOiBib29sZWFuO1xuICAgIGhpZGVBbmltYXRpb246IGJvb2xlYW4gfCBvYmplY3Q7XG4gICAgaHJlZjogc3RyaW5nO1xuICAgIGh0bWxDbHM6IHN0cmluZyB8IG9iamVjdDtcbiAgICBpbnNlcnRCZWZvcmU6IEhUTUxFbGVtZW50IHwgc3RyaW5nO1xuICAgIGluc2VydEZpcnN0OiBIVE1MRWxlbWVudCB8IHN0cmluZztcbiAgICBsaXN0ZW5lcnM6IG9iamVjdDtcbiAgICBsb2NhbGVDbGFzczogQmFzZTtcbiAgICBsb2NhbGl6YWJsZVByb3BlcnRpZXM6IHN0cmluZ1tdO1xuICAgIG1hc2tEZWZhdWx0czogb2JqZWN0IHwgTWFzayB8IFBhcnRpYWw8TWFza0NvbmZpZz47XG4gICAgbWFza2VkOiBib29sZWFuIHwgc3RyaW5nIHwgb2JqZWN0IHwgTWFzayB8IFBhcnRpYWw8TWFza0NvbmZpZz47XG4gICAgbW9uaXRvclJlc2l6ZTogYm9vbGVhbjtcbiAgICBvd25lcjogV2lkZ2V0O1xuICAgIHBvc2l0aW9uZWQ6IGJvb2xlYW47XG4gICAgcHJldmVudFRvb2x0aXBPblRvdWNoOiBib29sZWFuO1xuICAgIHJpcHBsZTogYm9vbGVhbiB8IG9iamVjdDtcbiAgICByb290RWxlbWVudDogU2hhZG93Um9vdDtcbiAgICBzY3JvbGxBY3Rpb246IHN0cmluZztcbiAgICBzaG93QW5pbWF0aW9uOiBib29sZWFuIHwgb2JqZWN0O1xuICAgIHRhYjogYm9vbGVhbiB8IG9iamVjdDtcbiAgICB0YWc6IHN0cmluZztcbiAgICB0YXJnZXQ6IHN0cmluZztcbiAgICB0ZXh0QWxpZ246IHN0cmluZztcbiAgICB0aXRsZTogc3RyaW5nO1xuICAgIHRvZ2dsZWFibGU6IGJvb2xlYW47XG4gICAgdG9nZ2xlR3JvdXA6IHN0cmluZztcbiAgICB3ZWlnaHQ6IG51bWJlcjtcbiAgICBhbGlnblNlbGY6IHN0cmluZztcbiAgICBiYWRnZTogc3RyaW5nO1xuICAgIGNvbnRlbnQ6IHN0cmluZztcbiAgICBkYXRhc2V0OiBvYmplY3Q7XG4gICAgZGlzYWJsZWQ6IGJvb2xlYW47XG4gICAgZXh0cmFEYXRhOiBib29sZWFuIHwgbnVtYmVyIHwgb2JqZWN0IHwgc3RyaW5nO1xuICAgIGZsZXg6IG51bWJlciB8IHN0cmluZztcbiAgICBoZWlnaHQ6IG51bWJlciB8IHN0cmluZztcbiAgICBoaWRkZW46IGJvb2xlYW47XG4gICAgaHRtbDogc3RyaW5nO1xuICAgIGljb246IHN0cmluZztcbiAgICBpY29uQWxpZ246IHN0cmluZztcbiAgICBpZDogc3RyaW5nO1xuICAgIG1hcmdpbjogbnVtYmVyIHwgc3RyaW5nO1xuICAgIG1heEhlaWdodDogbnVtYmVyIHwgc3RyaW5nO1xuICAgIG1heFdpZHRoOiBudW1iZXIgfCBzdHJpbmc7XG4gICAgbWVudTogV2lkZ2V0IHwgb2JqZWN0IHwgb2JqZWN0W10gfCBQYXJ0aWFsPFdpZGdldENvbmZpZz4gfCBQYXJ0aWFsPFdpZGdldENvbmZpZz5bXTtcbiAgICBtaW5IZWlnaHQ6IG51bWJlciB8IHN0cmluZztcbiAgICBtaW5XaWR0aDogbnVtYmVyIHwgc3RyaW5nO1xuICAgIHByZXNzZWQ6IGJvb2xlYW47XG4gICAgcHJlc3NlZEljb246IHN0cmluZztcbiAgICByZWFkT25seTogYm9vbGVhbjtcbiAgICBzY3JvbGxhYmxlOiBib29sZWFuIHwgU2Nyb2xsZXIgfCBvYmplY3QgfCBQYXJ0aWFsPFNjcm9sbGVyQ29uZmlnPjtcbiAgICB0ZXh0OiBzdHJpbmc7XG4gICAgdG9vbHRpcDogb2JqZWN0IHwgc3RyaW5nO1xuICAgIHdpZHRoOiBudW1iZXIgfCBzdHJpbmc7XG4gICAgeDogbnVtYmVyO1xuICAgIHk6IG51bWJlcjtcbiAgICBhbmNob3JTaXplOiBudW1iZXJbXTtcbiAgICBvbkFjdGlvbjogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25CZWZvcmVEZXN0cm95OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbkJlZm9yZUhpZGU6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uQmVmb3JlU2hvdzogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25DYXRjaEFsbDogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25DbGljazogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25EZXN0cm95OiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgICBvbkZvY3VzSW46IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uRm9jdXNPdXQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uSGlkZTogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25QYWludDogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25SZWFkT25seTogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25SZXNpemU6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIG9uU2hvdzogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gICAgb25Ub2dnbGU6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhbmQgYXBwZW5kIHRoZSB1bmRlcmx5aW5nIHdpZGdldFxuICAgICAqL1xuICAgIG5nT25Jbml0KCk6IHZvaWQ7XG4gICAgLyoqXG4gICAgICogV2F0Y2ggZm9yIGNoYW5nZXNcbiAgICAgKiBAcGFyYW0gY2hhbmdlc1xuICAgICAqL1xuICAgIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkO1xuICAgIC8qKlxuICAgICAqIERlc3Ryb3kgdGhlIGNvbXBvbmVudFxuICAgICAqL1xuICAgIG5nT25EZXN0cm95KCk6IHZvaWQ7XG59XG4iXX0=