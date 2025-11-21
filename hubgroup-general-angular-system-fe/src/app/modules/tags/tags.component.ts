import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TagsAddOrChangeComponent } from './tags-add-or-change/tags-add-or-change.component';
import { TagsNewsMappingComponent } from './tags-news-mapping/tags-news-mapping.component';
import { CommonService } from '../../shared/common.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AngularSharedService } from 'nexussoft-angular-shared';
import { ModuleBaseComponent } from '../../shared/base-components/module-base-component';
import { StatusEnum } from '@hubgroup-share-system-fe/enums/common.enum';
import { NewsDisplayTypeEnum } from '@hubgroup-share-system-fe/enums/news.enum';
import { TagService } from '../../shared/services/tag.service';
import { BaseResponse } from '@hubgroup-share-system-fe/types/common.type';
import {
    TagModel,
    TagsOptionChangeRequest,
    TagsSearchRequest,
    TagsStatusChangeRequest,
} from '@hubgroup-share-system-fe/types/tag.type';
import { TagOptionEnum } from '@hubgroup-share-system-fe/enums/tag.enum';
import { Common } from '../../shared/common';

@Component({
    selector: 'app-news-tags',
    templateUrl: './tags.component.html',
})
export class TagsComponent extends ModuleBaseComponent implements OnInit, OnDestroy {
    constructor(
        protected cdr: ChangeDetectorRef,
        protected translate: TranslateService,
        protected commonService: CommonService,
        protected modalService: NzModalService,
        protected messageService: NzMessageService,
        protected angularSharedService: AngularSharedService,
        private tagService: TagService
    ) {
        super(cdr, translate, commonService, modalService, messageService, angularSharedService);
    }

    protected readonly TagOptionEnum = TagOptionEnum;
    protected StatusEnum = StatusEnum;
    protected readonly NewsDisplayTypeEnum = NewsDisplayTypeEnum;

    requestSearch: Partial<TagsSearchRequest> = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
    };
    isChangeRequestSearch: boolean = false;
    date: any[] = [];

    tagModels: TagModel[] = [];

    loadingSwitchStatusObj: Record<string, boolean | undefined> = {};
    loadingSwitchLockObj: Record<string, boolean | undefined> = {};

    checkedAll = false;
    indeterminate = false;
    setOfCheckedId = new Set<string>();

    timeoutGets: ReturnType<typeof setTimeout> | null = null;

    async ngOnInit() {
        await this.onSearch();
    }

    ngOnDestroy() {
        this.clearAllTimeout();
        super.ngOnDestroy();
    }

    async onSearch(resetPageIndex = false, isMultipleProcess: boolean = false) {
        if (resetPageIndex && this.isChangeRequestSearch) {
            this.requestSearch.pageIndex = 0;
        }
        this.requestSearch.publishDateFromValue = Common.formatDateToBackend(
            this.date[0],
            Common.DateFormat
        );
        this.requestSearch.publishDateToValue = Common.formatDateToBackend(
            this.date[1],
            Common.DateFormat
        );
        this.requestSearch.numberArticle = this.requestSearch.numberArticle || undefined;

        const response: BaseResponse<{
            totalRow: number;
            models: Array<TagModel>;
        }> = await this.onAction(
            true,
            this.tagService.gets.bind(this.tagService),
            this.requestSearch,
            {
                callback: () => this.onSearch.call(this, resetPageIndex),
                multipleProcess: isMultipleProcess,
            }
        );
        this.handleMessageErrorByStatus(response);
        if (response) {
            this.isChangeRequestSearch = false;

            this.tagModels = response.data?.models || [];
            this.totalRow = response.data?.totalRow || 0;
            this.setOfCheckedId.clear();
            this.refreshCheckedStatus();
        }
    }

    onRequestModelChange() {
        this.isChangeRequestSearch = true;
    }

    updateCheckedSet(id: string, checked: boolean): void {
        if (checked) {
            this.setOfCheckedId.add(id);
        } else {
            this.setOfCheckedId.delete(id);
        }
    }

    refreshCheckedStatus(): void {
        this.checkedAll =
            this.tagModels.length > 0 &&
            this.tagModels.every(({ id }) => this.setOfCheckedId.has(id));
        this.indeterminate =
            !this.checkedAll && this.tagModels.some(({ id }) => this.setOfCheckedId.has(id));
    }

    onAllChecked(checked: boolean): void {
        this.tagModels.forEach(({ id, totalPost }) => {
            if (totalPost <= 3) {
                this.updateCheckedSet(id, checked);
            }
        });
        this.refreshCheckedStatus();
    }

    onItemChecked(id: string, checked: boolean): void {
        this.updateCheckedSet(id, checked);
        this.refreshCheckedStatus();
    }

    async onPageIndexChange(pageIndex: number) {
        this.requestSearch.pageIndex = pageIndex - 1;
        await this.onSearch();
    }

    async onPageSizeChange(pageSize: number) {
        this.requestSearch.pageSize = pageSize;
        await this.onSearch(true);
    }

    onOpenAddOrChangeModal(item?: any) {
        this.onShowDialogModalSmall(
            '',
            TagsAddOrChangeComponent,
            {},
            { id: item?.id || '' },
            () => {
                this.clearAllTimeout();
                this.timeoutGets = setTimeout(async () => {
                    await this.onSearch(false, true);
                }, 1000);
            }
        );
    }

    async onSyncAll() {
        const response: BaseResponse<null> = await this.onAction(
            true,
            this.tagService.syncAll.bind(this.tagService),
            {}
        );
        this.handleMessageErrorByStatus(response);
        if (response.status) {
            this.showMessageSuccess('sync.success');
        }
    }

    onViewMappingModal(item: any) {
        this.onShowDialogModalMedium(
            '',
            TagsNewsMappingComponent,
            {},
            {
                tagModel: item,
            },
            () => {
                this.clearAllTimeout();
                this.timeoutGets = setTimeout(async () => {
                    await this.onSearch(false, true);
                }, 1000);
            }
        );
    }

    async onStatusChange(id: string, status: StatusEnum) {
        this.loadingSwitchStatusObj[id] = true;
        const request: TagsStatusChangeRequest = {
            id,
            status,
        };
        const response: BaseResponse<null> = await this.onAction(
            false,
            this.tagService.statusChange.bind(this.tagService),
            request
        );
        this.handleMessageErrorByStatus(response);
        if (response.status) {
            this.clearAllTimeout();
            this.timeoutGets = setTimeout(async () => {
                await this.onSearch(false, true);
            }, 1000);
        }
        this.loadingSwitchStatusObj[id] = false;
    }

    async onOptionsChange(id: string, isLock: number) {
        this.loadingSwitchLockObj[id] = true;
        const request: TagsOptionChangeRequest = {
            id,
            isLock,
        };
        const response: BaseResponse<null> = await this.onAction(
            false,
            this.tagService.optionsChange.bind(this.tagService),
            request
        );
        this.handleMessageErrorByStatus(response);
        if (response.status) {
            this.timeoutGets = setTimeout(async () => {
                await this.onSearch(false, true);
            }, 1000);
        }
        this.loadingSwitchLockObj[id] = false;
    }

    async onDelete(ids?: Array<string>) {
        const request = {
            ids: ids || Array.from(this.setOfCheckedId),
        };

        const response = await this.onAction(
            true,
            this.tagService.delete.bind(this.tagService),
            request
        );
        this.handleMessageErrorByStatus(response);
        if (response.status) {
            this.showMessageSuccess('delete.success');
            this.clearAllTimeout();
            this.timeoutGets = setTimeout(async () => {
                await this.onSearch(false, true);
            }, 1000);
        }
    }

    clearAllTimeout() {
        if (this.timeoutGets) {
            clearTimeout(this.timeoutGets);
            this.timeoutGets = null;
        }
    }
}
