import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ButtonClassType } from '@hubgroup-share-system-fe/types/button.type';
import { AngularAuthService, AngularSharedService } from 'nexussoft-angular-shared';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-news-button-image',
    templateUrl: './button-image.component.html',
})
export class ButtonImageComponent implements OnInit, OnDestroy {
    @Input() isLoading = false;
    @Input() permissionKey = '';
    @Input() checkPermission = true;

    @Input() buttonClassType: ButtonClassType = 'btn-info';
    @Input() buttonClassBase = 'btn';
    @Input() buttonClass = '';
    @Input() buttonIcon = true;
    @Input() disabled = false;

    @Input() buttonType: 'button' | 'submit' = 'button';

    @Input() keenIcon = 'picture';
    @Input() keenIconClass = 'fs-2';
    @Input() keenIconType: 'duotone' | 'outline' = 'outline';
    @Input() placementIcon: 'right' | 'left' = 'left';

    @Input() text = '';
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
