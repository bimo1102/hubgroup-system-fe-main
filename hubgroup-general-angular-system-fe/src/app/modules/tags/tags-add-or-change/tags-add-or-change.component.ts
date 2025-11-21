import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../../shared/common.service';
import { NZ_MODAL_DATA, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AngularSharedService } from 'nexussoft-angular-shared';
import { TagService } from '../../../shared/services/tag.service';
import { ModuleBaseComponent } from '../../../shared/base-components/module-base-component';
import { StatusEnum } from '@hubgroup-share-system-fe/enums/common.enum';
import {
    TagModel,
    TagsChangeRequest,
    TagsGetByIdRequest,
} from '@hubgroup-share-system-fe/types/tag.type';
import { BaseResponse } from '@hubgroup-share-system-fe/types/common.type';
import { NgForm } from '@angular/forms';
import { isArray } from 'lodash';

@Component({
    selector: 'app-news-tags-change',
    templateUrl: 'tags-add-or-change.component.html',
})
export class TagsAddOrChangeComponent extends ModuleBaseComponent implements OnInit, OnDestroy {
    constructor(
        protected cdr: ChangeDetectorRef,
        protected translate: TranslateService,
        protected commonService: CommonService,
        protected modalService: NzModalService,
        protected messageService: NzMessageService,
        protected angularSharedService: AngularSharedService,
        private tagService: TagService,
        private nzModalRef: NzModalRef
    ) {
        super(cdr, translate, commonService, modalService, messageService, angularSharedService);
    }

    protected readonly StatusEnum = StatusEnum;

    target: HTMLElement;

    tagModel: Partial<TagsChangeRequest & TagModel> = {};
    isChange: boolean = false;

    private readonly nzModalData = inject<{
        id: string;
    }>(NZ_MODAL_DATA);

    async ngOnInit() {
        const subscription = this.nzModalRef.afterOpen.subscribe(() => {
            this.target = this.nzModalRef.getElement();
        });
        this.unsubscribe.push(subscription);

        this.isChange = !!this.nzModalData?.id;
        await this.onGetById();
    }

    async onGetById() {
        const request: TagsGetByIdRequest = {
            id: this.nzModalData.id || '',
            group: '',
        };
        const response: BaseResponse<{
            model: TagModel;
        }> = await this.onAction(true, this.tagService.getById.bind(this.tagService), request, {
            callback: this.onGetById.bind(this),
        });
        this.handleMessageErrorByStatus(response);
        if (response.status) {
            this.tagModel = response.data?.model || {
                status: StatusEnum.New,
                configOptionObjects: [],
            };

            if (!this.tagModel.categoryIds || !isArray(this.tagModel.categoryIds)) {
                this.tagModel.categoryIds = [];
            }

            if (!this.tagModel.positionIds || !isArray(this.tagModel.positionIds)) {
                this.tagModel.positionIds = [];
            }

            this.tagModel.configOptionObjects = this.tagModel.configOptions || [];
        }
    }

    async onSave(form: NgForm) {
        const formValid = this.formValidate(form);
        if (formValid) {
            let action;
            let key;
            if (this.isChange) {
                key = 'change.success';
                action = this.tagService.change;
            } else {
                key = 'add.success';
                action = this.tagService.add;
            }
            const response: BaseResponse<null> = await this.onAction(
                true,
                action.bind(this.tagService),
                this.tagModel
            );
            this.handleMessageErrorByStatus(response);
            if (response.status) {
                this.showMessageSuccess(this.translate.instant(key));
                this.nzModalRef.close();
            }
        } else {
            this.showMessageWarning(this.translate.instant('please.fill.data'));
        }
    }

    onClose() {
        this.nzModalRef.close();
    }
}
