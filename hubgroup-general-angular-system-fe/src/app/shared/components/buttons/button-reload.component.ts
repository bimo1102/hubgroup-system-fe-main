import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AngularAuthService, AngularSharedService } from 'nexussoft-angular-shared';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-news-button-reload',
    templateUrl: './button-reload.component.html',
})
export class ButtonReloadComponent implements OnInit, OnDestroy {
    @Input() isLoading = false;
    @Input() permissionKey = '';
    @Input() checkPermission = true;

    @Input() btnConfirm = true;
    @Input() confirmTitle = 'are.you.sure.reload';
    @Input() okText = 'Ok';
    @Input() cancelText = 'Cancel';

    @Input() buttonIcon = false;
    @Input() text = '';
    @Input() disabled = false;

    @Input() keenIcon = 'arrow-circle-left';
    @Input() keenIconClass = 'fs-3 text-light';
    @Input() keenIconType = 'outline';

    @Output() clickFunc = new EventEmitter<any>();
    @Output() cancelFunc = new EventEmitter<any>();
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

    onCancel(event: any) {
        this.cancelFunc.emit(event);
    }
}

