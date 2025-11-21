import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ButtonClassType } from '@hubgroup-share-system-fe/types/button.type';
import { AngularAuthService, AngularSharedService } from 'nexussoft-angular-shared';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-news-button-change',
    templateUrl: './button-change.component.html',
})
export class ButtonChangeComponent implements OnInit, OnDestroy {
    @Input() isLoading = false;
    @Input() permissionKey = '';
    @Input() checkPermission = true;

    @Input() buttonClassType: ButtonClassType = 'btn-primary';
    @Input() buttonClassBase = 'btn';
    @Input() buttonClass = '';
    @Input() buttonIcon = true;
    @Input() disabled = false;

    @Input() keenIcon = 'pencil';
    @Input() keenIconClass = 'fs-3';
    @Input() keenIconType: 'duotone' | 'outline' = 'outline';
    @Input() placementIcon: 'right' | 'left' = 'left';

    @Input() text = 'Edit';
    @Input() title = '';

    @Output() clickFunc = new EventEmitter<any>();
    isShow = false;
    readonly subscription: Array<Subscription> = [];

    constructor(private angularAuthService: AngularAuthService) {}

    ngOnInit() {
        const subscribe = this.angularAuthService.currentUser$.subscribe((_event: any) => {
            this.checkIsShow();
        });
        this.subscription.push(subscribe);
    }

    ngOnDestroy() {
        this.subscription.forEach((subscription) => subscription.unsubscribe());
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
