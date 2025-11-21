import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../../shared/common.service';
import { NZ_MODAL_DATA, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AngularSharedService } from 'nexussoft-angular-shared';
import { ModuleBaseComponent } from '../../../shared/base-components/module-base-component';
import { SourcesService } from '../../../shared/services/news-source.service';
import {
    BaseResponse,
    KeyValueTypeIntModel,
    SourceSettingEnum,
} from '@hubgroup-share-system-fe/types/common.type';
import { StatusEnum } from '@hubgroup-share-system-fe/enums/common.enum';
import { NgForm } from '@angular/forms';
import {
    SourceGetRequest,
    SourcesModel,
    SourcesUpdateRequest,
} from '@hubgroup-share-system-fe/types/sources.type';

@Component({
    selector: 'app-news-source-add-or-change',
    templateUrl: './news-source-add-or-change.component.html',
})
export class NewsSourceAddOrChangeComponent
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
        private sourcesService: SourcesService,
        private nzModalRef: NzModalRef
    ) {
        super(cdr, translate, commonService, modalService, messageService, angularSharedService);
    }

    private readonly nzModalData = inject<{
        id: string;
    }>(NZ_MODAL_DATA);

    statusSources: Array<KeyValueTypeIntModel<StatusEnum>> = [];

    target: HTMLElement;
    isChange: boolean = false;

    request: SourceGetRequest = {
        id: '',
    };
    sourceModel: Partial<SourcesModel & SourcesUpdateRequest> = {};
    settingTypes: Array<KeyValueTypeIntModel<SourceSettingEnum>> = [];

    async ngOnInit() {
        const subscription = this.nzModalRef.afterOpen.subscribe(() => {
            this.target = this.nzModalRef.getElement();
        });
        this.unsubscribe.push(subscription);

        this.request.id = this.nzModalData?.id || '';
        this.isChange = !!this.nzModalData?.id;

        await this.getSourceById();
    }

    async getSourceById() {
        const response: BaseResponse<{
            model: SourcesModel;
            settingTypes: Array<KeyValueTypeIntModel<SourceSettingEnum>>;
            statuses: Array<KeyValueTypeIntModel<StatusEnum>>;
        }> = await this.onAction(
            true,
            this.sourcesService.getById.bind(this.sourcesService),
            this.request,
            {
                callback: this.getSourceById.bind(this),
            }
        );
        this.handleMessageErrorByStatus(response);
        if (response.status) {
            this.sourceModel = response.data?.model || {
                status: StatusEnum.Active,
                options: {
                    isAuthorDisplayAsPseudonym: false,
                    selfProduced: false,
                    isDefaultSelectedMultipleWebsite: false,
                },
            };

            this.statusSources = response.data?.statuses || [];

            this.settingTypes = response.data?.settingTypes
                ? response.data.settingTypes.map((item) => {
                      const isChecked =
                          this.sourceModel.settings!?.length > 0 &&
                          this.sourceModel.settings!.some(
                              (itemSome) => itemSome.type === item.id && itemSome.value
                          );
                      return {
                          ...item,
                          checked: isChecked,
                      };
                  })
                : [];
        }
    }

    async onSave(form: NgForm) {
        const formValid = this.formValidate(form);
        if (formValid) {
            const request = {
                ...this.sourceModel,
                id: this.request.id,
                priority: this.sourceModel.priority || undefined,
                settings: this.settingTypes.map((item) => {
                    return {
                        value: item.checked,
                        type: item.id,
                    };
                }),
            } as SourcesUpdateRequest;

            let action;
            let key;
            if (this.isChange) {
                action = this.sourcesService.update;
                key = 'change.success';
            } else {
                action = this.sourcesService.insert;
                key = 'add.success';
            }

            const response: BaseResponse<null> = await this.onAction(
                true,
                action.bind(this.sourcesService),
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
