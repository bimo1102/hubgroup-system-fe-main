import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AngularAuthService, AngularSharedService } from 'nexussoft-angular-shared';

@Component({
    selector: 'app-news-button-search',
    templateUrl: './button-search.component.html',
})
export class ButtonSearchComponent implements OnInit, OnDestroy {
    @Input() isLoading = false;
    @Input() permissionKey = '';
    @Input() checkPermission = true;

    @Input() buttonIcon = false;
    @Input() buttonClass: string = '';
    @Input() text = '';
    @Input() disabled = false;
    @Input() buttonType: 'button' | 'submit' = 'button';

    @Input() keenIcon = 'magnifier';
    @Input() keenIconClass = 'fs-3 text-light';
    @Input() keenIconType = 'outline';

    @Output() clickFunc = new EventEmitter<any>();
    isShow = false;

    readonly subscription: Array<Subscription> = [];

    constructor(private angularAuthService: AngularAuthService) {
    }

    ngOnInit() {
        const subscribe = this.angularAuthService.currentUser$.subscribe((_event: any) => {
            this.checkIsShow();
        });
        this.subscription.push(subscribe);
    }

    ngOnDestroy() {
        this.subscription.forEach(script => script.unsubscribe());
    }

    checkIsShow() {
        if (this.checkPermission) {
            this.isShow = this.angularAuthService.checkPermission(this.permissionKey);
        } else {
            this.isShow = true;
        }
    }

    onClick($event: any) {
        this.clickFunc.emit($event);
    }
}

