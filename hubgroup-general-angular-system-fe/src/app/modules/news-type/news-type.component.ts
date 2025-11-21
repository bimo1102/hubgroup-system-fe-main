import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NewsTypeAddOrChangeComponent } from './news-type-add-or-change/news-type-add-or-change.component';
import { ModuleBaseComponent } from '../../shared/base-components/module-base-component';
import { CommonService } from '../../shared/common.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AngularSharedService } from 'nexussoft-angular-shared';
import { BaseResponse, KeyValueTypeIntModel } from '@hubgroup-share-system-fe/types/common.type';
import { NewsTypeService } from '../../shared/services/news-type.service';
import {
    NewsTypeChangeStatusRequest,
    NewsTypeModel,
    NewsTypeSearchRequest,
} from '@hubgroup-share-system-fe/types/news-type.type';
import { StatusEnum } from '@hubgroup-share-system-fe/enums/common.enum';
import { NewsDisplayTypeEnum } from '@hubgroup-share-system-fe/enums/news.enum';

@Component({
    selector: 'app-news-type',
    templateUrl: './news-type.component.html',
})
export class NewsTypeComponent extends ModuleBaseComponent implements OnInit, OnDestroy {
    constructor(
        protected cdr: ChangeDetectorRef,
        protected translate: TranslateService,
        protected commonService: CommonService,
        protected modalService: NzModalService,
        protected messageService: NzMessageService,
        protected angularSharedService: AngularSharedService,
        private newsTypeService: NewsTypeService
    ) {
        super(cdr, translate, commonService, modalService, messageService, angularSharedService);
    }

    protected readonly StatusEnum = StatusEnum;
    newsTypeModels: Array<NewsTypeModel> = [];
    requestSearch: NewsTypeSearchRequest = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        key: '',
        parentId: '',
    };
    isChangeRequestSearch: boolean = false;

    async ngOnInit() {
        await this.onSearch();
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }

    async onSearch(resetPageIndex = false) {
        if (resetPageIndex && this.isChangeRequestSearch) {
            this.requestSearch.pageIndex = 0;
        }
        const response: BaseResponse<{
            models: Array<NewsTypeModel>;
            statuses: Array<KeyValueTypeIntModel<StatusEnum>>;
            types: Array<KeyValueTypeIntModel<NewsDisplayTypeEnum>>;
            totalRow: number;
        }> = await this.onAction(
            true,
            this.newsTypeService.gets.bind(this.newsTypeService),
            this.requestSearch,
            {
                callback: () => this.onSearch.call(this, resetPageIndex),
            }
        );
        this.handleMessageErrorByStatus(response);
        if (response.status) {
            this.isChangeRequestSearch = false;

            this.newsTypeModels = response.data?.models ?? [];
            this.totalRow = response.data?.totalRow;
        }
    }

    onRequestModelChange() {
        this.isChangeRequestSearch = true;
    }

    async onPageSizeChange(pageSize: number) {
        this.requestSearch.pageSize = pageSize;
        await this.onSearch(true);
    }

    onOpenInsertOrUpdateModal(item?: NewsTypeModel) {
        this.onShowDialogModalSmall(
            '',
            NewsTypeAddOrChangeComponent,
            {},
            {
                id: item?.id,
            },
            async () => {
                await this.onSearch();
            }
        );
    }

    async onDelete(item: NewsTypeModel) {
        const request: NewsTypeChangeStatusRequest = {
            id: item.id,
            status: StatusEnum.Deleted,
        };
        const response: BaseResponse<null> = await this.onAction(
            true,
            this.newsTypeService.changeStatus.bind(this.newsTypeService),
            request
        );
        this.handleMessageErrorByStatus(response);
        if (response.status) {
            this.showMessageSuccess(this.translate.instant('delete.success'));
            await this.onSearch();
        }
    }

    async onPageIndexChange(pageIndex: number) {
        this.requestSearch.pageIndex = pageIndex - 1;
        await this.onSearch();
    }
}
