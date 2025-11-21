import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ButtonClassType } from '@hubgroup-share-system-fe/types/button.type';
import { AngularAuthService } from 'nexussoft-angular-shared';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-news-button-add',
    templateUrl: './button-add.component.html',
})
export class ButtonAddComponent implements OnInit, OnDestroy {
    @Input() isLoading = false;
    @Input() permissionKey = '';
    @Input() checkPermission = true;
    @Input() text = 'Add';

    @Input() buttonIcon: boolean = false;
    @Input() buttonClass: string = '';
    @Input() buttonClassType: ButtonClassType = 'btn-primary';

    @Input() keenIcon = 'plus';
    @Input() keenIconClass = 'fs-4';

    @Output() clickFunc = new EventEmitter<any>();
    isShow = false;
    @Input() disabled = false;
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

    onClick() {
        this.clickFunc.emit();
    }
}
