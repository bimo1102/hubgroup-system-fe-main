import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NZ_MODAL_DATA, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ModuleBaseComponent } from '../../base-components/module-base-component';
import { CommonService } from '../../common.service';
import { AngularSharedService } from 'nexussoft-angular-shared';
import { ButtonClassType } from '@hubgroup-share-system-fe/types/button.type';

@Component({
    selector: 'app-news-confirm-modal',
    templateUrl: './confirm-modal.component.html',
})
export class ConfirmModalComponent extends ModuleBaseComponent implements OnInit {
    constructor(
        cdr: ChangeDetectorRef,
        translate: TranslateService,
        commonService: CommonService,
        modalService: NzModalService,
        messageService: NzMessageService,
        angularSharedService: AngularSharedService,
        private modal: NzModalRef
    ) {
        super(cdr, translate, commonService, modalService, messageService, angularSharedService);
    }

    readonly nzModalData: any = inject(NZ_MODAL_DATA);
    data = {
        title: '',
        description: '',

        textNoButton: 'Cancel',

        isShowBtnYes1: true,
        textYesButton: 'Ok',

        isShowBtnYes2: false,
        textYesButton2: '',

        linkOpenPreview: '',
        isShowAcceptConfirm: false,

        isShowPodcastOption: false,
    };
    isAccept = false;
    cssClassBtn1: ButtonClassType = 'btn-danger';
    cssClassBtn2: ButtonClassType = 'btn-danger';

    ngOnInit(): void {
        if (this.nzModalData) {
            this.data = {
                ...this.data,
                ...this.nzModalData,
            };
        }

        if (this.data.isShowBtnYes2) {
            this.cssClassBtn1 = 'btn-warning';
        }
    }

    clickConfirmFunc(yes1: boolean, yes2: boolean) {
        this.modal.close({
            yes1: yes1,
            yes2: yes2,
            isAccept: this.isAccept,
        });
    }
}
