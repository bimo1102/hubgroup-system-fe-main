import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SeriesAddOrChangeComponent } from './series-add-or-change/series-add-or-change.component';
import { SeriesNewsMappingComponent } from './series-news-mapping/series-news-mapping.component';
import { CommonService } from '../../shared/common.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AngularSharedService } from 'nexussoft-angular-shared';
import { ModuleBaseComponent } from '../../shared/base-components/module-base-component';
import { StatusEnum } from '@hubgroup-share-system-fe/enums/common.enum';
import { NewsDisplayTypeEnum } from '@hubgroup-share-system-fe/enums/news.enum';
import {
    BaseResponse,
    KeyValueTypeIntModel,
    KeyValueTypeStringModel,
} from '@hubgroup-share-system-fe/types/common.type';
import { Subject } from 'rxjs';
import { NewsCategoryAutocompleteRequest } from '@hubgroup-share-system-fe/types/news-category.type';
import { NewsCategoryService } from '../../shared/services/news-category.service';
import { join } from 'lodash';
import { SeriesService } from '../../shared/services/series.service';
import {
    SeriesModel,
    SeriesSearchRequest,
    SeriesStatusChangeRequest,
    SeriesSyncRequest,
} from '@hubgroup-share-system-fe/types/series.type';

@Component({
    selector: 'app-news-series',
    templateUrl: './series.component.html',
})
export class SeriesComponent extends ModuleBaseComponent implements OnInit, OnDestroy {
    constructor(
        protected cdr: ChangeDetectorRef,
        protected translate: TranslateService,
        protected commonService: CommonService,
        protected modalService: NzModalService,
        protected messageService: NzMessageService,
        protected angularSharedService: AngularSharedService,
        private seriesService: SeriesService,
        private newsCategoryService: NewsCategoryService
    ) {
        super(cdr, translate, commonService, modalService, messageService, angularSharedService);
    }

    protected StatusEnum = StatusEnum;
    protected readonly NewsDisplayTypeEnum = NewsDisplayTypeEnum;
    protected readonly join = join;

    requestSearch: Partial<SeriesSearchRequest> = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
    };
    isChangeRequestSearch: boolean = false;
    date: any[] = [];
    protected readonly requestCategoryMainAutocomplete$ = new Subject<
        Partial<NewsCategoryAutocompleteRequest>
    >();
    categoryMainSources: Array<KeyValueTypeStringModel> = [];

    seriesModels: SeriesModel[] = [];

    loadingSwitchStatusObj: Record<string, boolean | undefined> = {};

    checkedAll = false;
    indeterminate = false;
    setOfCheckedId = new Set<string>();

    timeoutGets: ReturnType<typeof setTimeout> | null = null;

    async ngOnInit() {
        this.setupAutocomplete<NewsCategoryAutocompleteRequest>(
            this.requestCategoryMainAutocomplete$,
            {
                service: this.newsCategoryService.autocompleteAllTree.bind(
                    this.newsCategoryService
                ),
            },
            (sources) => {
                this.categoryMainSources = sources;
            }
        );

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

        if (this.date.length > 0) {
            this.requestSearch.fromDate = this.date[0];
            this.requestSearch.toDate = this.date[1];
        }

        const response: BaseResponse<{
            totalRow: number;
            series: Array<SeriesModel>;
            statuses: Array<KeyValueTypeIntModel<StatusEnum>>;
        }> = await this.onAction(
            true,
            this.seriesService.gets.bind(this.seriesService),
            this.requestSearch,
            {
                callback: () => this.onSearch.call(this, resetPageIndex, isMultipleProcess),
                multipleProcess: isMultipleProcess,
            }
        );
        this.handleMessageErrorByStatus(response);
        if (response) {
            this.isChangeRequestSearch = false;

            this.seriesModels = response.data?.series || [];
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
            this.seriesModels.length > 0 &&
            this.seriesModels.every(({ id }) => this.setOfCheckedId.has(id!));
        this.indeterminate =
            !this.checkedAll && this.seriesModels.some(({ id }) => this.setOfCheckedId.has(id!));
    }

    onAllChecked(checked: boolean): void {
        this.seriesModels.forEach(({ id, totalPost }) => {
            if (totalPost <= 3) {
                this.updateCheckedSet(id!, checked);
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
            SeriesAddOrChangeComponent,
            {},
            { id: item?.id || '' },
            () => {
                this.clearAllTimeout();
                this.timeoutGets = setTimeout(async () => {
                    await this.onSearch(false, true);
                });
            }
        );
    }

    async onSyncAll() {
        const request: SeriesSyncRequest = {
            ids: Array.from(this.setOfCheckedId),
        };
        const response: BaseResponse<null> = await this.onAction(
            true,
            this.seriesService.sync.bind(this.seriesService),
            request
        );
        this.handleMessageErrorByStatus(response);
        if (response.status) {
            this.showMessageSuccess('sync.success');
        }
    }

    onViewMappingModal(item: any) {
        this.onShowDialogModalMedium(
            '',
            SeriesNewsMappingComponent,
            {},
            {
                seriesModel: item,
            },
            () => {
                this.clearAllTimeout();
                this.timeoutGets = setTimeout(async () => {
                    await this.onSearch(false, true);
                }, 1000);
            }
        );
    }

    async onStatusChange(id: string, status: StatusEnum, isLoading: boolean = false) {
        if (!isLoading) {
            this.loadingSwitchStatusObj[id] = true;
        }
        const request: SeriesStatusChangeRequest = {
            id,
            status,
            removeSeriesFromNews: false,
        };
        const response: BaseResponse<null> = await this.onAction(
            isLoading,
            this.seriesService.changeStatus.bind(this.seriesService),
            request
        );
        this.handleMessageErrorByStatus(response);
        if (response.status) {
            this.clearAllTimeout();
            this.timeoutGets = setTimeout(async () => {
                await this.onSearch(false, true);
            }, 1000);
        }
        if (!isLoading) {
            this.loadingSwitchStatusObj[id] = false;
        }
    }

    clearAllTimeout() {
        if (this.timeoutGets) {
            clearTimeout(this.timeoutGets);
            this.timeoutGets = null;
        }
    }
}
