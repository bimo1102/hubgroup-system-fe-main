import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../common.service';
import { NZ_MODAL_DATA, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NewsService } from '../../services/news.service';
import { NewsBaseComponent } from '../../base-components/news-base.component';
import { cloneDeep } from 'lodash';
import { Common } from '../../common';
import {
    NewsDisplayTypeEnum,
    NewsOptionEnum,
    NewsStatusEnum,
} from '@hubgroup-share-system-fe/enums/news.enum';
import {
    NewsOnlineGetsRequest,
    RelatedNewsModel,
} from '@hubgroup-share-system-fe/types/news-online.type';
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

@Component({
    selector: 'app-news-related-modal',
    templateUrl: './news-related-modal.component.html',
})
export class NewsRelatedModalComponent extends NewsBaseComponent implements OnInit, OnDestroy {
    constructor(
        cdr: ChangeDetectorRef,
        translate: TranslateService,
        commonService: CommonService,
        modalService: NzModalService,
        messageService: NzMessageService,
        angularSharedService: AngularSharedService,
        private newsOnlineService: NewsOnlineService,
        private nzModalRef: NzModalRef
    ) {
        super(cdr, translate, commonService, modalService, messageService, angularSharedService);
    }

    protected readonly NewsStatusEnum = NewsStatusEnum;
    protected readonly NewsDisplayTypeEnum = NewsDisplayTypeEnum;
    protected readonly NewsOptionEnum = NewsOptionEnum;

    private readonly nzModalData = inject<{
        relatedArticles: Array<RelatedNewsModel>;
        maxSelected: number;
        displayTypes: Array<NewsDisplayTypeEnum>;
        isMultipleWebsite: boolean;
        websiteId: string;
        onChangeRelated: (item: NewsSimpleModel, checked: boolean) => void;
    }>(NZ_MODAL_DATA);

    websiteId: string = '';
    isMultipleWebsite: boolean = false;

    relatedArticles: RelatedNewsModel[] = [];
    maxSelected: number = 3;

    requestSearch: Partial<NewsOnlineGetsRequest> = {
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        statuses: [NewsStatusEnum.Publish],
        notInOptionTypes: [],
        sortType: NewsAdminSortTypeEnum.Desc,
        sortField: NewsAdminSortFieldEnum.PublishDate,
    };
    newsArticleModels: Array<NewsSimpleModel> = [];

    date: Date[] = [];

    isCollapsed = true;
    checkedAll = false;
    indeterminate = false;
    setOfCheckedId = new Set<string>();

    async ngOnInit() {
        if (this.nzModalData.displayTypes?.length > 0) {
            this.requestSearch.displayTypes = this.nzModalData.displayTypes;
        }
        if (this.nzModalData.maxSelected) {
            this.maxSelected = this.nzModalData.maxSelected;
        }
        this.relatedArticles = cloneDeep(this.nzModalData.relatedArticles || []);
        const selectedNewsIds = this.relatedArticles.map((item) => {
            this.setOfCheckedId.add(item.id);
            return item.id;
        });
        // this.requestSearch.selectedNewsIds

        // multiple website
        this.websiteId = this.nzModalData.websiteId || '';
        // this.requestSearch.websiteId = this.websiteId;
        this.isMultipleWebsite = this.nzModalData.isMultipleWebsite || false;

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

    updateCheckedSet(item: NewsSimpleModel, checked: boolean): void {
        if (checked) {
            this.setOfCheckedId.add(item.id);
            this.relatedArticles.push({ ...item, priority: 0 });
        } else {
            this.relatedArticles = this.relatedArticles.filter(
                (itemFilter) => itemFilter.id !== item.id
            );
            this.setOfCheckedId.delete(item.id);
        }
    }

    refreshCheckedStatus(): void {
        this.checkedAll =
            this.newsArticleModels.length > 0 &&
            this.newsArticleModels.every(({ id }) => this.setOfCheckedId.has(id));
        this.indeterminate =
            !this.checkedAll &&
            this.newsArticleModels.some(({ id }) => this.setOfCheckedId.has(id));
    }

    onItemChecked(item: NewsSimpleModel): void {
        const checked = this.setOfCheckedId.has(item.id);
        if (this.setOfCheckedId.size === this.maxSelected && !checked) {
            this.showMessageWarning(
                this.translate.instant('only.choose' + this.maxSelected + 'article.news')
            );
            return;
        }
        this.nzModalData.onChangeRelated(item, !checked);
        this.updateCheckedSet(item, !checked);
        this.refreshCheckedStatus();
    }

    async onPageIndexChange(pageIndex: number) {
        this.requestSearch.pageIndex = pageIndex - 1;
        await this.onSearch();
    }

    onSearchNewsCategoryAutocomplete(keyword: string) {
        if (this.isMultipleWebsite) {
            this.requestCategoryMultipleWebsiteAutocomplete$.next({
                keyword,
                websiteId: this.websiteId,
            });
        } else {
            this.requestCategoryMainAutocomplete$.next({ keyword });
        }
    }

    onClose() {
        this.nzModalRef.close({
            isButtonClose: true,
            relatedArticles: this.relatedArticles,
        });
    }
}
