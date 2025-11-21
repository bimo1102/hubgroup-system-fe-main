import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../../shared/common.service';
import { NZ_MODAL_DATA, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AngularSharedService } from 'nexussoft-angular-shared';
import { ModuleBaseComponent } from '../../../shared/base-components/module-base-component';
import { BaseResponse, KeyValueTypeIntModel } from '@hubgroup-share-system-fe/types/common.type';
import { NgForm } from '@angular/forms';
import { IconConfigService } from '../../../shared/services/icon-config.service';
import {
    IconConfigGetRequest,
    IconConfigModel,
    IconConfigUpdateRequest,
} from '@hubgroup-share-system-fe/types/icon-config.type';
import {
    IconConfigAvatarPositionEnum,
    IconConfigTypeEnum,
} from '@hubgroup-share-system-fe/enums/icon-config.enum';
import { StatusEnum } from '@hubgroup-share-system-fe/enums/common.enum';
import { FileSystemTypeEnum } from '@hubgroup-share-system-fe/enums/file-manager.enum';

@Component({
    selector: 'app-icon-config-add-or-change',
    templateUrl: './icon-config-add-or-change.component.html',
})
export class IconConfigAddOrChangeComponent
    extends ModuleBaseComponent
    implements OnInit, OnDestroy
{
    constructor(
        protected cdr: ChangeDetectorRef,
        protected translate: TranslateService,
        protected commonService: CommonService,
        protected modalService: NzModalService,
        protected messageService: NzMessageService,
        protected angularSharedService: AngularSharedService,
        private iconConfigService: IconConfigService,
        private nzModalRef: NzModalRef
    ) {
        super(cdr, translate, commonService, modalService, messageService, angularSharedService);
    }

    private readonly nzModalData = inject<{
        id: string;
        iconTypeSources: Array<KeyValueTypeIntModel<IconConfigTypeEnum>>;
        avatarPositionSources: Array<KeyValueTypeIntModel<IconConfigAvatarPositionEnum>>;
    }>(NZ_MODAL_DATA);

    target: HTMLElement;
    isChange: boolean = false;

    request: IconConfigGetRequest = {
        id: '',
    };
    statusSources: Array<KeyValueTypeIntModel<StatusEnum>> = [];
    iconTypeSources: Array<KeyValueTypeIntModel<IconConfigTypeEnum>> = [];
    avatarPositionSources: Array<KeyValueTypeIntModel<IconConfigAvatarPositionEnum>> = [];

    iconSettingModel: Partial<IconConfigModel> = {};

    async ngOnInit() {
        const subscription = this.nzModalRef.afterOpen.subscribe(() => {
            this.target = this.nzModalRef.getElement();
        });
        this.unsubscribe.push(subscription);

        this.request.id = this.nzModalData?.id || '';
        this.isChange = !!this.nzModalData?.id;

        this.iconTypeSources = this.nzModalData.iconTypeSources || [];
        this.avatarPositionSources = this.nzModalData.avatarPositionSources || [];

        await this.getById();
    }

    async getById() {
        const response: BaseResponse<{
            model: IconConfigModel;
            statuses: Array<KeyValueTypeIntModel<StatusEnum>>;
        }> = await this.onAction(
            true,
            this.iconConfigService.get.bind(this.iconConfigService),
            this.request,
            {
                callback: this.getById.bind(this),
            }
        );
        this.handleMessageErrorByStatus(response);
        if (response.status) {
            this.iconSettingModel = response.data?.model || {
                status: StatusEnum.Active,
                type: IconConfigTypeEnum.Title,
                avatarPosition: IconConfigAvatarPositionEnum.Default,
            };

            this.statusSources = response.data?.statuses || [];

            if (this.iconSettingModel.setting) {
                this.iconSettingModel.setting = {
                    defaultNewsDisplayTypes: [],
                };
            }
        }
    }

    onOpenFileManagerModal() {
        this.showFileManagerDialog(
            {
                fileType: FileSystemTypeEnum.AllImage,
            },
            (images) => {
                if (images!?.length > 0) this.iconSettingModel.url = images![0].fullUrl;
            }
        );
    }

    async onSave(form: NgForm) {
        const formValid = this.formValidate(form);
        if (formValid) {
            const request = {
                ...this.iconSettingModel,
                id: this.request.id,
            } as IconConfigUpdateRequest;

            let action;
            let key;
            if (this.isChange) {
                action = this.iconConfigService.update;
                key = 'change.success';
            } else {
                action = this.iconConfigService.insert;
                key = 'add.success';
            }

            const response: BaseResponse<null> = await this.onAction(
                true,
                action.bind(this.iconConfigService),
                request
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
