/**
 * Angular wrapper for Bryntum Fullscreen button
 */
import { Component, ElementRef } from '@angular/core';
// Bryntum 'scheduler.lite.umd' bundle comes without polyfills to support Angular's zone.js
import { Fullscreen, WidgetHelper } from '@bryntum/scheduler/scheduler.lite.umd.js';
export class BryntumFullscreenButtonComponent {
    constructor(element) {
        this.elementRef = element;
    }
    /**
     * Initializes component
     */
    ngOnInit() {
        if (!Fullscreen.enabled) {
            return;
        }
        this.button = WidgetHelper.createWidget({
            type: 'button',
            appendTo: this.elementRef.nativeElement,
            icon: 'b-icon b-icon-fullscreen',
            tooltip: 'Fullscreen',
            toggleable: true,
            onToggle: ({ pressed }) => {
                if (pressed) {
                    Fullscreen.request(document.documentElement);
                }
                else {
                    Fullscreen.exit();
                }
            }
        });
        Fullscreen.onFullscreenChange(() => {
            this.button['pressed'] = Fullscreen.isFullscreen;
        });
    }
    /**
     * Destroys component
     */
    ngOnDestroy() {
        if (this.button) {
            this.button.destroy();
        }
    }
}
BryntumFullscreenButtonComponent.decorators = [
    { type: Component, args: [{
                selector: 'bryntum-fullscreen-button',
                template: ''
            }] }
];
/** @nocollapse */
BryntumFullscreenButtonComponent.ctorParameters = () => [
    { type: ElementRef }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJ5bnR1bS1mdWxsc2NyZWVuLWJ1dHRvbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYnJ5bnR1bS9zY2hlZHVsZXItYW5ndWxhci8iLCJzb3VyY2VzIjpbImxpYi9icnludHVtLWZ1bGxzY3JlZW4tYnV0dG9uLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7R0FFRztBQUNILE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFxQixNQUFNLGVBQWUsQ0FBQztBQUN6RSwyRkFBMkY7QUFDM0YsT0FBTyxFQUFVLFVBQVUsRUFBRSxZQUFZLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQU01RixNQUFNLE9BQU8sZ0NBQWdDO0lBS3pDLFlBQVksT0FBbUI7UUFDM0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUM7SUFDOUIsQ0FBQztJQUVEOztPQUVHO0lBQ0gsUUFBUTtRQUNKLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFO1lBQ3JCLE9BQU87U0FDVjtRQUNELElBQUksQ0FBQyxNQUFNLEdBQUcsWUFBWSxDQUFDLFlBQVksQ0FBQztZQUNwQyxJQUFJLEVBQVMsUUFBUTtZQUNyQixRQUFRLEVBQUssSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhO1lBQzFDLElBQUksRUFBUywwQkFBMEI7WUFDdkMsT0FBTyxFQUFNLFlBQVk7WUFDekIsVUFBVSxFQUFHLElBQUk7WUFDakIsUUFBUSxFQUFLLENBQUMsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFO2dCQUN6QixJQUFJLE9BQU8sRUFBRTtvQkFDVCxVQUFVLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQztpQkFDaEQ7cUJBQ0k7b0JBQ0QsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDO2lCQUNyQjtZQUNMLENBQUM7U0FDSixDQUFXLENBQUM7UUFFYixVQUFVLENBQUMsa0JBQWtCLENBQUMsR0FBRyxFQUFFO1lBQy9CLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsVUFBVSxDQUFDLFlBQVksQ0FBQztRQUNyRCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRDs7T0FFRztJQUNILFdBQVc7UUFDUCxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDYixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQ3pCO0lBQ0wsQ0FBQzs7O1lBaERKLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUcsMkJBQTJCO2dCQUN0QyxRQUFRLEVBQUcsRUFBRTthQUNoQjs7OztZQVBtQixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBBbmd1bGFyIHdyYXBwZXIgZm9yIEJyeW50dW0gRnVsbHNjcmVlbiBidXR0b25cbiAqL1xuaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBPbkRlc3Ryb3ksIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuLy8gQnJ5bnR1bSAnc2NoZWR1bGVyLmxpdGUudW1kJyBidW5kbGUgY29tZXMgd2l0aG91dCBwb2x5ZmlsbHMgdG8gc3VwcG9ydCBBbmd1bGFyJ3Mgem9uZS5qc1xuaW1wb3J0IHsgQnV0dG9uLCBGdWxsc2NyZWVuLCBXaWRnZXRIZWxwZXIgfSBmcm9tICdAYnJ5bnR1bS9zY2hlZHVsZXIvc2NoZWR1bGVyLmxpdGUudW1kLmpzJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3IgOiAnYnJ5bnR1bS1mdWxsc2NyZWVuLWJ1dHRvbicsXG4gICAgdGVtcGxhdGUgOiAnJ1xufSlcbmV4cG9ydCBjbGFzcyBCcnludHVtRnVsbHNjcmVlbkJ1dHRvbkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgICAvLyBjbGFzcyB2YXJpYWJsZXNcbiAgICBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY7XG4gICAgcHJpdmF0ZSBidXR0b246IEJ1dHRvbjtcblxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQ6IEVsZW1lbnRSZWYpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50UmVmID0gZWxlbWVudDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplcyBjb21wb25lbnRcbiAgICAgKi9cbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKCFGdWxsc2NyZWVuLmVuYWJsZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJ1dHRvbiA9IFdpZGdldEhlbHBlci5jcmVhdGVXaWRnZXQoe1xuICAgICAgICAgICAgdHlwZSAgICAgICA6ICdidXR0b24nLFxuICAgICAgICAgICAgYXBwZW5kVG8gICA6IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LFxuICAgICAgICAgICAgaWNvbiAgICAgICA6ICdiLWljb24gYi1pY29uLWZ1bGxzY3JlZW4nLFxuICAgICAgICAgICAgdG9vbHRpcCAgICA6ICdGdWxsc2NyZWVuJyxcbiAgICAgICAgICAgIHRvZ2dsZWFibGUgOiB0cnVlLFxuICAgICAgICAgICAgb25Ub2dnbGUgICA6ICh7IHByZXNzZWQgfSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChwcmVzc2VkKSB7XG4gICAgICAgICAgICAgICAgICAgIEZ1bGxzY3JlZW4ucmVxdWVzdChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgRnVsbHNjcmVlbi5leGl0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KSBhcyBCdXR0b247XG5cbiAgICAgICAgRnVsbHNjcmVlbi5vbkZ1bGxzY3JlZW5DaGFuZ2UoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5idXR0b25bJ3ByZXNzZWQnXSA9IEZ1bGxzY3JlZW4uaXNGdWxsc2NyZWVuO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZXN0cm95cyBjb21wb25lbnRcbiAgICAgKi9cbiAgICBuZ09uRGVzdHJveSgpIDogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmJ1dHRvbikge1xuICAgICAgICAgICAgdGhpcy5idXR0b24uZGVzdHJveSgpO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19