import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../common.service';
import { NZ_MODAL_DATA, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NewsBaseComponent } from '../../base-components/news-base.component';
import { Common } from '../../common';
import {
    NewsAddRelatedTypeEnum,
    NewsDisplayTypeEnum,
    NewsOptionEnum,
    NewsStatusEnum,
} from '@hubgroup-share-system-fe/enums/news.enum';
import { NewsOnlineGetsRequest } from '@hubgroup-share-system-fe/types/news-online.type';
import { NewsSearchRequest, NewsSimpleModel } from '@hubgroup-share-system-fe/types/news.type';
import {
    NewsAdminSortFieldEnum,
    NewsAdminSortTypeEnum,
} from '@hubgroup-share-system-fe/enums/common.enum';
import {
    BaseResponse,
    KeyValueTypeIntModel,
    KeyValueTypeStringModel,
} from '@hubgroup-share-system-fe/types/common.type';
import { AngularSharedService } from 'nexussoft-angular-shared';
import { NewsOnlineService } from '../../services/news-online.service';
import { EventService } from '../../services/event.service';
import { SeriesService } from '../../services/series.service';
import { TagService } from '../../services/tag.service';

@Component({
    selector: 'app-news-add-related-modal',
    templateUrl: './news-add-related-modal.component.html',
})
export class NewsAddRelatedModalComponent extends NewsBaseComponent implements OnInit, OnDestroy {
    constructor(
        cdr: ChangeDetectorRef,
        translate: TranslateService,
        commonService: CommonService,
        modalService: NzModalService,
        messageService: NzMessageService,
        angularSharedService: AngularSharedService,
        private newsOnlineService: NewsOnlineService,
        private nzModalRef: NzModalRef,
        private tagService: TagService,
        private eventService: EventService,
        private seriesService: SeriesService
    ) {
        super(cdr, translate, commonService, modalService, messageService, angularSharedService);
    }

    protected readonly NewsStatusEnum = NewsStatusEnum;
    protected readonly NewsDisplayTypeEnum = NewsDisplayTypeEnum;
    protected readonly NewsOptionEnum = NewsOptionEnum;
    protected readonly NewsAddRelatedTypeEnum = NewsAddRelatedTypeEnum;

    private readonly nzModalData = inject<{
        type: NewsAddRelatedTypeEnum;
        id: string;
    }>(NZ_MODAL_DATA);

    requestSearch: Partial<NewsOnlineGetsRequest> = {
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        statuses: [NewsStatusEnum.Publish],
        notInOptionTypes: [],
        sortType: NewsAdminSortTypeEnum.Desc,
        sortField: NewsAdminSortFieldEnum.PublishDate,
        isSearchInCategoryMainTree: true,
        isSearchInCategorySubTree: true,
    };
    newsArticleModels: Array<NewsSimpleModel> = [];

    date: Date[] = [];

    isCollapsed = true;
    checkedAll = false;
    indeterminate = false;
    setOfCheckedId = new Set<string>();

    async ngOnInit() {
        switch (this.nzModalData.type) {
            case NewsAddRelatedTypeEnum.Event:
                this.requestSearch.excludeEventIds = [this.nzModalData.id];
                break;
            case NewsAddRelatedTypeEnum.Series:
                this.requestSearch.excludeSeriesIds = [this.nzModalData.id];
                break;
            case NewsAddRelatedTypeEnum.Tag:
                this.requestSearch.excludeTagIds = [this.nzModalData.id];
                break;
        }
        await this.onSearch();
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }

    async onSearch(resetPageIndex = false) {
        if (resetPageIndex) {
            this.requestSearch.pageIndex = 0;
        }
        this.requestSearch = { ...this.requestSearch, ...this.getObjectDate() };

        const response: BaseResponse<{
            news: Array<NewsSimpleModel>;
            icons: Array<KeyValueTypeStringModel>;
            sources: Array<KeyValueTypeStringModel>;
            displayTypes: Array<KeyValueTypeIntModel<NewsDisplayTypeEnum>>;
            statuses: Array<KeyValueTypeIntModel<NewsStatusEnum>>;
            totalRow: number;
        }> = await this.onAction(
            true,
            this.newsOnlineService.gets.bind(this.newsOnlineService),
            this.requestSearch
        );
        this.handleMessageErrorByStatus(response);
        if (response.status) {
            const { news, totalRow, sources, icons, displayTypes, statuses } = response.data || {};

            this.newsArticleModels = news || [];
            this.totalRow = totalRow || 0;

            this.sources.newsIconSources = icons || [];
            this.sources.newsDisplayTypeSources = displayTypes || [];
            this.sources.newsStatusSources = statuses || [];
            this.sources.sourceNewsSources = sources || [];

            this.onClearItemChecked();
        }
        this.cdr.detectChanges();
    }

    async onPageSizeChange(pageSize: number) {
        this.requestSearch.pageSize = pageSize;
        await this.onSearch(true);
    }

    getObjectDate() {
        let dateFormat1 = Common.formatDateToBackend(this.date[0]);
        let dateFormat2 = Common.formatDateToBackend(this.date[1]);
        const date: Partial<Pick<NewsSearchRequest, 'fromCreatedDate' | 'toCreatedDate'>> = {
            fromCreatedDate: dateFormat1,
            toCreatedDate: dateFormat2,
        };
        return date;
    }

    updateCheckedSet(item: NewsSimpleModel, checked: boolean) {
        if (checked) {
            this.setOfCheckedId.add(item.id);
        } else {
            this.setOfCheckedId.delete(item.id);
        }
    }

    refreshCheckedStatus() {
        this.checkedAll =
            this.newsArticleModels.length > 0 &&
            this.newsArticleModels.every(({ id }) => this.setOfCheckedId.has(id));
        this.indeterminate =
            !this.checkedAll &&
            this.newsArticleModels.some(({ id }) => this.setOfCheckedId.has(id));
    }

    onItemChecked(item: NewsSimpleModel) {
        const checked = this.setOfCheckedId.has(item.id);
        this.updateCheckedSet(item, !checked);
        this.refreshCheckedStatus();
    }

    onAllChecked(checked: boolean): void {
        this.newsArticleModels.forEach((item) => this.updateCheckedSet(item, checked));
        this.refreshCheckedStatus();
    }

    onClearItemChecked() {
        this.setOfCheckedId.clear();
        this.refreshCheckedStatus();
    }

    async onPageIndexChange(pageIndex: number) {
        this.requestSearch.pageIndex = pageIndex - 1;
        await this.onSearch();
    }

    onSearchNewsCategoryAutocomplete(keyword: string) {
        this.requestCategoryMainAutocomplete$.next({ keyword });
    }

    async onAddArticleToList() {
        if (this.setOfCheckedId.size === 0) {
            this.showMessageWarning(this.translate.instant('article.selected.is.empty'));
            return;
        }
        const request = {
            id: this.nzModalData.id,
            newsIds: Array.from(this.setOfCheckedId),
        };
        let action = this.tagService.addNewsToTag.bind(this.tagService);
        switch (this.nzModalData.type) {
            case NewsAddRelatedTypeEnum.Event:
                action = this.eventService.eventAddToNews.bind(this.eventService);
                break;
            case NewsAddRelatedTypeEnum.Series:
                action = this.seriesService.seriesAddToNews.bind(this.seriesService);
                break;
        }

        const response: BaseResponse<null> = await this.onAction(true, action, request);
        this.handleMessageErrorByStatus(response);
        if (response.status) {
            this.showMessageSuccess(this.translate.instant('add.news.success'));
            this.nzModalRef.close();
        }
    }

    onClose() {
        this.nzModalRef.close({
            isButtonClose: true,
        });
    }
}
