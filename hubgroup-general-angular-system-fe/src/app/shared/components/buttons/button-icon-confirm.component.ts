import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ButtonClassType } from '@hubgroup-share-system-fe/types/button.type';
import { AngularAuthService, AngularSharedService } from 'nexussoft-angular-shared';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-news-button-icon-confirm',
    templateUrl: './button-icon-confirm.component.html',
})
export class ButtonIconConfirmComponent implements OnInit, OnDestroy {
    @Input() isLoading = false;
    @Input() permissionKey = '';
    @Input() checkPermission = true;

    @Input() text = '';

    @Input() confirmTitle = 'are.you.sure.process';
    @Input() okText = 'Ok';
    @Input() cancelText = 'Cancel';

    @Output() confirmFunc = new EventEmitter<any>();
    @Output() cancelFunc = new EventEmitter<any>();

    @Input() keenIcon = 'send';
    @Input() keenIconClass = 'fs-2';
    @Input() keenIconType = 'outline';

    @Input() bootstrapIcon = 'bi-check-lg';
    @Input() bootstrapIconClass = 'fs-2';

    @Input() buttonClassType: ButtonClassType = 'btn-primary';
    @Input() buttonClassBase = 'btn btn-shadow btn-sm';
    @Input() buttonClass = '';
    @Input() buttonType: 'submit' | 'button' = 'button';
    @Input() buttonIcon: boolean = true;
    @Input() disabled = false;

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

    confirm(data: any) {
        this.confirmFunc.emit(data);
    }

    cancel(data: any) {
        this.cancelFunc.emit(data);
    }
}
