// Angular
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ButtonClassType } from '@hubgroup-share-system-fe/types/button.type';
import { AngularAuthService } from 'nexussoft-angular-shared';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-news-button-preview',
    templateUrl: './button-preview.component.html',
})
export class ButtonPreviewComponent implements OnInit, OnDestroy {
    @Input() isLoading = false;
    @Input() permissionKey = '';
    @Input() checkPermission = true;
    @Output() clickFunc = new EventEmitter<any>();
    isShow = false;

    @Input() buttonClassType: ButtonClassType = 'btn-info';
    @Input() buttonClassBase = '';
    @Input() buttonClass = '';
    @Input() buttonIcon = true;
    @Input() disabled = false;

    @Input() buttonType: 'button' | 'submit' = 'button';

    @Input() keenIcon = 'eye';
    @Input() keenIconClass = 'fs-3';
    @Input() keenIconType: 'duotone' | 'outline' = 'outline';
    @Input() placementIcon: 'right' | 'left' = 'left';

    @Input() text = '';
    @Input() title = '';
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
