/**
 * Angular wrapper for Bryntum Demo Header
 */
import { Component, ElementRef, Input } from '@angular/core';
var BryntumDemoHeaderComponent = /** @class */ (function () {
    function BryntumDemoHeaderComponent(element) {
        this.elementRef = element;
    }
    /**
     * Initializes component
     */
    BryntumDemoHeaderComponent.prototype.ngOnInit = function () {
    };
    /**
     * Destroys component
     */
    BryntumDemoHeaderComponent.prototype.ngOnDestroy = function () {
    };
    BryntumDemoHeaderComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bryntum-demo-header',
                    template: "\n        <header class=\"demo-header\">\n          <div id=\"title-container\">\n            <a id=\"title\" href=\"{{ link }}\">{{ title }}</a>\n          </div>\n          <ng-content></ng-content>\n          <bryntum-fullscreen-button></bryntum-fullscreen-button>\n        </header>\n"
                }] }
    ];
    /** @nocollapse */
    BryntumDemoHeaderComponent.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    BryntumDemoHeaderComponent.propDecorators = {
        title: [{ type: Input }],
        link: [{ type: Input }]
    };
    return BryntumDemoHeaderComponent;
}());
export { BryntumDemoHeaderComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJ5bnR1bS1kZW1vLWhlYWRlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYnJ5bnR1bS9zY2hlZHVsZXItYW5ndWxhci8iLCJzb3VyY2VzIjpbImxpYi9icnludHVtLWRlbW8taGVhZGVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7R0FFRztBQUNILE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFxQixLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFaEY7SUFtQkksb0NBQVksT0FBbUI7UUFDM0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUM7SUFDOUIsQ0FBQztJQUVEOztPQUVHO0lBQ0gsNkNBQVEsR0FBUjtJQUNBLENBQUM7SUFFRDs7T0FFRztJQUNILGdEQUFXLEdBQVg7SUFDQSxDQUFDOztnQkFqQ0osU0FBUyxTQUFDO29CQUNQLFFBQVEsRUFBRyxxQkFBcUI7b0JBQ2hDLFFBQVEsRUFBRyxrU0FRZDtpQkFDQTs7OztnQkFibUIsVUFBVTs7O3dCQWtCekIsS0FBSzt1QkFDTCxLQUFLOztJQWlCVixpQ0FBQztDQUFBLEFBbENELElBa0NDO1NBdEJZLDBCQUEwQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQW5ndWxhciB3cmFwcGVyIGZvciBCcnludHVtIERlbW8gSGVhZGVyXG4gKi9cbmltcG9ydCB7IENvbXBvbmVudCwgRWxlbWVudFJlZiwgT25EZXN0cm95LCBPbkluaXQsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yIDogJ2JyeW50dW0tZGVtby1oZWFkZXInLFxuICAgIHRlbXBsYXRlIDogYFxuICAgICAgICA8aGVhZGVyIGNsYXNzPVwiZGVtby1oZWFkZXJcIj5cbiAgICAgICAgICA8ZGl2IGlkPVwidGl0bGUtY29udGFpbmVyXCI+XG4gICAgICAgICAgICA8YSBpZD1cInRpdGxlXCIgaHJlZj1cInt7IGxpbmsgfX1cIj57eyB0aXRsZSB9fTwvYT5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgICAgICAgPGJyeW50dW0tZnVsbHNjcmVlbi1idXR0b24+PC9icnludHVtLWZ1bGxzY3JlZW4tYnV0dG9uPlxuICAgICAgICA8L2hlYWRlcj5cbmBcbn0pXG5leHBvcnQgY2xhc3MgQnJ5bnR1bURlbW9IZWFkZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG5cbiAgICBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY7XG5cbiAgICBASW5wdXQoKSB0aXRsZTogU3RyaW5nO1xuICAgIEBJbnB1dCgpIGxpbms6IFN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQ6IEVsZW1lbnRSZWYpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50UmVmID0gZWxlbWVudDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplcyBjb21wb25lbnRcbiAgICAgKi9cbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZXN0cm95cyBjb21wb25lbnRcbiAgICAgKi9cbiAgICBuZ09uRGVzdHJveSgpIDogdm9pZCB7XG4gICAgfVxufVxuIl19