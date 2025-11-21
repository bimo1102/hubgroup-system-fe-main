/**
 * Angular wrapper for Bryntum Demo Header
 */
import { Component, ElementRef, Input } from '@angular/core';
export class BryntumDemoHeaderComponent {
    constructor(element) {
        this.elementRef = element;
    }
    /**
     * Initializes component
     */
    ngOnInit() {
    }
    /**
     * Destroys component
     */
    ngOnDestroy() {
    }
}
BryntumDemoHeaderComponent.decorators = [
    { type: Component, args: [{
                selector: 'bryntum-demo-header',
                template: `
        <header class="demo-header">
          <div id="title-container">
            <a id="title" href="{{ link }}">{{ title }}</a>
          </div>
          <ng-content></ng-content>
          <bryntum-fullscreen-button></bryntum-fullscreen-button>
        </header>
`
            }] }
];
/** @nocollapse */
BryntumDemoHeaderComponent.ctorParameters = () => [
    { type: ElementRef }
];
BryntumDemoHeaderComponent.propDecorators = {
    title: [{ type: Input }],
    link: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJ5bnR1bS1kZW1vLWhlYWRlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYnJ5bnR1bS9zY2hlZHVsZXItYW5ndWxhci8iLCJzb3VyY2VzIjpbImxpYi9icnludHVtLWRlbW8taGVhZGVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7R0FFRztBQUNILE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFxQixLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFjaEYsTUFBTSxPQUFPLDBCQUEwQjtJQU9uQyxZQUFZLE9BQW1CO1FBQzNCLElBQUksQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDO0lBQzlCLENBQUM7SUFFRDs7T0FFRztJQUNILFFBQVE7SUFDUixDQUFDO0lBRUQ7O09BRUc7SUFDSCxXQUFXO0lBQ1gsQ0FBQzs7O1lBakNKLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUcscUJBQXFCO2dCQUNoQyxRQUFRLEVBQUc7Ozs7Ozs7O0NBUWQ7YUFDQTs7OztZQWJtQixVQUFVOzs7b0JBa0J6QixLQUFLO21CQUNMLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEFuZ3VsYXIgd3JhcHBlciBmb3IgQnJ5bnR1bSBEZW1vIEhlYWRlclxuICovXG5pbXBvcnQgeyBDb21wb25lbnQsIEVsZW1lbnRSZWYsIE9uRGVzdHJveSwgT25Jbml0LCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvciA6ICdicnludHVtLWRlbW8taGVhZGVyJyxcbiAgICB0ZW1wbGF0ZSA6IGBcbiAgICAgICAgPGhlYWRlciBjbGFzcz1cImRlbW8taGVhZGVyXCI+XG4gICAgICAgICAgPGRpdiBpZD1cInRpdGxlLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgPGEgaWQ9XCJ0aXRsZVwiIGhyZWY9XCJ7eyBsaW5rIH19XCI+e3sgdGl0bGUgfX08L2E+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgICAgICAgIDxicnludHVtLWZ1bGxzY3JlZW4tYnV0dG9uPjwvYnJ5bnR1bS1mdWxsc2NyZWVuLWJ1dHRvbj5cbiAgICAgICAgPC9oZWFkZXI+XG5gXG59KVxuZXhwb3J0IGNsYXNzIEJyeW50dW1EZW1vSGVhZGVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuXG4gICAgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmO1xuXG4gICAgQElucHV0KCkgdGl0bGU6IFN0cmluZztcbiAgICBASW5wdXQoKSBsaW5rOiBTdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50OiBFbGVtZW50UmVmKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudFJlZiA9IGVsZW1lbnQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZXMgY29tcG9uZW50XG4gICAgICovXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGVzdHJveXMgY29tcG9uZW50XG4gICAgICovXG4gICAgbmdPbkRlc3Ryb3koKSA6IHZvaWQge1xuICAgIH1cbn1cbiJdfQ==