import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ButtonClassType } from '@hubgroup-share-system-fe/types/button.type';
import { AngularAuthService } from 'nexussoft-angular-shared';
import { Subscription } from 'rxjs';
import { StatusEnum } from '@hubgroup-share-system-fe/enums/common.enum';

@Component({
    selector: 'app-news-switch',
    templateUrl: './switch.component.html',
})
export class SwitchComponent implements OnInit, OnDestroy {
    @Input() permissionKey = '';
    @Input() checkPermission = true;
    @Input() text = 'Add';

    @Input() isLoading = false;
    @Input() isControl: boolean = false;

    @Input() buttonIcon: boolean = false;
    @Input() buttonClass: string = '';
    @Input() buttonClassType: ButtonClassType = 'btn-primary';

    @Input() keenIcon = 'plus';
    @Input() keenIconClass = 'fs-4';

    @Input() value: boolean = false;
    @Output() valueChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Output() clickFunc = new EventEmitter<any>();
    isShow = false;
    @Input() disabled = false;
    readonly subscription: Array<Subscription> = [];

    constructor(private angularAuthService: AngularAuthService) {}

    ngOnInit() {
        this.checkIsShow();
        this.angularAuthService.currentUser$.subscribe((_event: any) => {
            this.checkIsShow();
        });
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
