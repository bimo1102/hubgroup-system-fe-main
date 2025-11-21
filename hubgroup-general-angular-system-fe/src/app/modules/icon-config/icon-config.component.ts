import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IconConfigAddOrChangeComponent } from './icon-config-add-or-change/icon-config-add-or-change.component';
import { ModuleBaseComponent } from '../../shared/base-components/module-base-component';
import { CommonService } from '../../shared/common.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AngularSharedService } from 'nexussoft-angular-shared';
import { BaseResponse, KeyValueTypeIntModel } from '@hubgroup-share-system-fe/types/common.type';
import { IconConfigService } from '../../shared/services/icon-config.service';
import {
    IconConfigGetsRequest,
    IconConfigModel,
} from '@hubgroup-share-system-fe/types/icon-config.type';
import {
    IconConfigAvatarPositionEnum,
    IconConfigTypeEnum,
} from '@hubgroup-share-system-fe/enums/icon-config.enum';
import { NewsDisplayTypeEnum } from '@hubgroup-share-system-fe/enums/news.enum';

@Component({
    selector: 'app-icon-config',
    templateUrl: './icon-config.component.html',
})
export class IconConfigComponent extends ModuleBaseComponent implements OnInit, OnDestroy {
    constructor(
        protected cdr: ChangeDetectorRef,
        protected translate: TranslateService,
        protected commonService: CommonService,
        protected modalService: NzModalService,
        protected messageService: NzMessageService,
        protected angularSharedService: AngularSharedService,
        private iconConfigService: IconConfigService
    ) {
        super(cdr, translate, commonService, modalService, messageService, angularSharedService);
    }

    configSettingModels: Array<IconConfigModel> = [];
    requestSearch: IconConfigGetsRequest = {
        title: '',
        type: IconConfigTypeEnum.Title,
    };
    iconTypeSources: Array<KeyValueTypeIntModel<IconConfigTypeEnum>> = [];
    avatarPositionSources: Array<KeyValueTypeIntModel<IconConfigAvatarPositionEnum>> = [];

    async ngOnInit() {
        await this.onSearch();
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }

    async onSearch() {
        const response: BaseResponse<{
            models: Array<IconConfigModel>;
            iconTypes: Array<KeyValueTypeIntModel<IconConfigTypeEnum>>;
            displayTypes: Array<KeyValueTypeIntModel<NewsDisplayTypeEnum>>;
            avatarPositions: Array<KeyValueTypeIntModel<IconConfigAvatarPositionEnum>>;
            totalRow: number;
        }> = await this.onAction(
            true,
            this.iconConfigService.gets.bind(this.iconConfigService),
            this.requestSearch,
            {
                callback: this.onSearch.bind(this),
            }
        );
        this.handleMessageErrorByStatus(response);
        if (response.status) {
            this.iconTypeSources = response.data?.iconTypes || [];
            this.avatarPositionSources = response.data?.avatarPositions || [];

            this.configSettingModels = response.data?.models || [];
            this.totalRow = response.data?.totalRow;
        }
    }

    onOpenInsertOrUpdateModal(item?: IconConfigModel) {
        this.onShowDialogModalSmall(
            '',
            IconConfigAddOrChangeComponent,
            {},
            {
                id: item?.id,
                iconTypeSources: this.iconTypeSources,
                avatarPositionSources: this.avatarPositionSources,
            },
            async () => {
                await this.onSearch();
            }
        );
    }
}
