import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AngularAuthService, AngularSharedService } from 'nexussoft-angular-shared';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-news-button-close',
    templateUrl: './button-close.component.html',
})
export class ButtonCloseComponent implements OnInit, OnDestroy {
    @Input() isLoading = false;
    @Input() permissionKey = '';
    @Input() checkPermission = false;
    @Input() buttonIcon = false;
    @Input() text = '';

    @Input() keenIcon = 'cross';
    @Input() keenIconClass = 'fs-2';
    @Input() keenIconType = 'outline';

    @Input() disabled = false;

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
        this.subscription.forEach(subscription => subscription.unsubscribe());
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

