import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NZ_MODAL_DATA, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { CommonService } from 'src/app/shared/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AngularSharedService } from 'nexussoft-angular-shared';
import { ModuleBaseComponent } from '../../../shared/base-components/module-base-component';
import { StatusEnum } from '@hubgroup-share-system-fe/enums/common.enum';
import { NewsSimpleModel } from '@hubgroup-share-system-fe/types/news.type';
import { NewsOnlineService } from '../../../shared/services/news-online.service';
import {
    BaseResponse,
    KeyValueTypeIntModel,
    KeyValueTypeStringModel,
} from '@hubgroup-share-system-fe/types/common.type';
import {
    NewsAddRelatedTypeEnum,
    NewsDisplayTypeEnum,
} from '@hubgroup-share-system-fe/enums/news.enum';
import { Subject } from 'rxjs';
import { NewsCategoryAutocompleteRequest } from '@hubgroup-share-system-fe/types/news-category.type';
import { NewsCategoryService } from '../../../shared/services/news-category.service';
import { NewsAddRelatedModalComponent } from '../../../shared/components/news-related-modal/news-add-related-modal.component';
import { SeriesService } from '../../../shared/services/series.service';
import {
    SeriesArticleGetsRequest,
    SeriesModel,
    SeriesRemoveFromNewsRequest,
} from '@hubgroup-share-system-fe/types/series.type';

@Component({
    selector: 'app-news-series-mapping',
    templateUrl: 'series-news-mapping.component.html',
})
export class SeriesNewsMappingComponent extends ModuleBaseComponent implements OnDestroy, OnInit {
    constructor(
        protected cdr: ChangeDetectorRef,
        protected translate: TranslateService,
        protected commonService: CommonService,
        protected modalService: NzModalService,
        protected messageService: NzMessageService,
        protected angularSharedService: AngularSharedService,
        private seriesService: SeriesService,
        private newsOnlineService: NewsOnlineService,
        private nzModalRef: NzModalRef,
        private newsCategoryService: NewsCategoryService
    ) {
        super(cdr, translate, commonService, modalService, messageService, angularSharedService);
    }

    private readonly nzModalData = inject<{
        seriesModel: SeriesModel;
    }>(NZ_MODAL_DATA);

    seriesModel?: SeriesModel;

    target: HTMLElement;
    checkedAll = false;
    indeterminate = false;
    setOfCheckedId = new Set<string>();

    protected readonly StatusEnum = StatusEnum;

    protected readonly requestCategoryAutocomplete$ = new Subject<
        Partial<NewsCategoryAutocompleteRequest>
    >();
    categorySources: Array<KeyValueTypeStringModel> = [];
    requestSearch: Partial<SeriesArticleGetsRequest> = {
        pageIndex: this.pageIndex,
    };
    isChangeRequestSearch: boolean = false;

    newsSimpleModels: NewsSimpleModel[] = [];

    timeoutGets: ReturnType<typeof setTimeout> | null = null;

    async ngOnInit() {
        const subscription = this.nzModalRef.afterOpen.subscribe(() => {
            this.target = this.nzModalRef.getElement();
        });
        this.unsubscribe.push(subscription);

        this.setupAutocomplete<NewsCategoryAutocompleteRequest>(
            this.requestCategoryAutocomplete$,
            {
                service: this.newsCategoryService.autocompleteAllTree.bind(
                    this.newsCategoryService
                ),
            },
            (sources) => {
                this.categorySources = sources;
            }
        );

        if (this.nzModalData.seriesModel) {
            this.seriesModel = this.nzModalData.seriesModel;
            this.requestSearch.seriesIds = [this.seriesModel.id!];
            await this.onPostGets();
        }
    }

    async onPostGets(isResetPageIndex: boolean = false, isMultipleProcess: boolean = false) {
        if (isResetPageIndex && this.isChangeRequestSearch) {
            this.requestSearch.pageIndex = 0;
        }

        const response: BaseResponse<{
            news: Array<NewsSimpleModel>;
            sources: Array<KeyValueTypeStringModel>;
            displayTypes: Array<KeyValueTypeIntModel<NewsDisplayTypeEnum>>;
            totalRow: number;
        }> = await this.onAction(
            true,
            this.seriesService.articleGets.bind(this.newsOnlineService),
            this.requestSearch,
            {
                callback: () => this.onPostGets.call(this, isResetPageIndex),
                multipleProcess: isMultipleProcess,
            }
        );
        this.handleMessageErrorByStatus(response);
        if (response.status) {
            this.isChangeRequestSearch = false;

            this.newsSimpleModels = response.data?.news || [];
            this.totalRow = response.data?.totalRow || 0;

            this.onClearAllChecked();
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
            this.newsSimpleModels.length > 0 &&
            this.newsSimpleModels.every(({ id }) => this.setOfCheckedId.has(id));
        this.indeterminate =
            !this.checkedAll && this.newsSimpleModels.some(({ id }) => this.setOfCheckedId.has(id));
    }

    onAllChecked(checked: boolean): void {
        this.newsSimpleModels.forEach(({ id }) => {
            this.updateCheckedSet(id, checked);
        });
        this.refreshCheckedStatus();
    }

    onItemChecked(id: string, checked: boolean): void {
        this.updateCheckedSet(id, checked);
        this.refreshCheckedStatus();
    }

    onClearAllChecked() {
        this.setOfCheckedId.clear();
        this.refreshCheckedStatus();
    }

    async onPageIndexChange(pageIndex: number) {
        this.requestSearch.pageIndex = pageIndex - 1;
        await this.onPostGets();
    }

    async onRemoveSeriesFromNewsConfirm() {
        if (this.setOfCheckedId.size === 0) {
            this.showMessageError(this.translate.instant("you.haven't.selected.any.article.yet"));
            return;
        }

        const request: SeriesRemoveFromNewsRequest = {
            id: this.seriesModel!.id,
            newsIds: Array.from(this.setOfCheckedId),
        };

        const response: BaseResponse<null> = await this.onAction(
            true,
            this.seriesService.seriesRemoveFromNews.bind(this.seriesService),
            request
        );
        this.handleMessageErrorByStatus(response);
        if (response.status) {
            this.showMessageSuccess(this.translate.instant('update.success'));
            this.clearAllTimeout();
            this.timeoutGets = setTimeout(() => {
                this.onPostGets(false, true);
            }, 2000);
        }
    }

    onOpenNewsModal() {
        this.onShowDialogModalMedium(
            '',
            NewsAddRelatedModalComponent,
            {},
            {
                id: this.seriesModel!.id,
                type: NewsAddRelatedTypeEnum.Series,
            },
            () => {
                this.clearAllTimeout();
                this.timeoutGets = setTimeout(async () => {
                    await this.onPostGets(false, true);
                }, 2000);
            }
        );
    }

    clearAllTimeout() {
        if (this.timeoutGets) {
            clearTimeout(this.timeoutGets);
            this.timeoutGets = null;
        }
    }

    onClose() {
        this.nzModalRef.close();
    }
}
