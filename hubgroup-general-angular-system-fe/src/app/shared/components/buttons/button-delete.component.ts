import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ButtonClassType } from '@hubgroup-share-system-fe/types/button.type';
import { AngularAuthService } from 'nexussoft-angular-shared';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-news-button-delete',
    templateUrl: './button-delete.component.html',
})
export class ButtonDeleteComponent implements OnInit, OnDestroy {
    @Input() isLoading = false;
    @Input() permissionKey = '';
    @Input() checkPermission = true;

    @Input() buttonIcon = false;
    @Input() buttonClass: string = '';
    @Input() buttonClassType: ButtonClassType = 'btn-danger';

    @Input() keenIcon = 'cross';
    @Input() keenIconClass = 'fs-2 text-light';
    @Input() keenIconType: 'outline' | 'duotone' = 'outline';

    @Input() text = 'Delete';
    @Input() disabled = false;

    @Input() btnConfirm = true;
    @Input() confirmTitle = 'are.you.sure';
    @Input() okText = 'ok';
    @Input() cancelText = 'cancel';

    @Output() clickFunc = new EventEmitter<any>();
    @Output() clickCancelFunc = new EventEmitter<any>();
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

    onCancel($event: any) {
        this.clickCancelFunc.emit($event);
    }
}
