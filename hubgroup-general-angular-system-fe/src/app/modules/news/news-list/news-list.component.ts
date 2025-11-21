import {
    AfterViewChecked,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../../shared/common.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
    BaseResponse,
    KeyValueTypeIntModel,
    KeyValueTypeLongModel,
    KeyValueTypeStringModel,
} from '@hubgroup-share-system-fe/types/common.type';
import { ActivatedRoute, Router } from '@angular/router';
import { NewsBaseComponent } from '../../../shared/base-components/news-base.component';
import { Common } from '../../../shared/common';
import {
    FormTypeEnum,
    NewsActionTypeEnum,
    NewsDisplayColumnEnum,
    NewsDisplayPropertyEnum,
    NewsDisplayTypeEnum,
    NewsOptionEnum,
    NewsStatusEnum,
} from '@hubgroup-share-system-fe/enums/news.enum';
import {
    AuthorModel,
    NewsGroupConditionModel,
    NewsOnlineGetsRequest,
    NewsOnlineSimpleModel,
    NewsOnlineStatusChangeRequest,
} from '@hubgroup-share-system-fe/types/news-online.type';
import { NewsOnlineService } from '../../../shared/services/news-online.service';
import { cloneDeep, isEmpty, omitBy, pick } from 'lodash';
import { format, isDate } from 'date-fns';
import { NewsSyncToESRequest } from '@hubgroup-share-system-fe/types/news.type';
import { AccountSettingFormDisplayConfigModel } from '@hubgroup-share-system-fe/types/account.type';
import { MESSAGE_ERROR_VERSION_CHANGED } from '../../../shared/constant/news.constant';
import { Clipboard } from '@angular/cdk/clipboard';
import {
    NewsAdminSortFieldEnum,
    NewsAdminSortTypeEnum,
} from '@hubgroup-share-system-fe/enums/common.enum';
import { ActionTypePermissionAttributeEnum } from '@hubgroup-share-system-fe/enums/newspaper.enum';
import { AngularAuthService, AngularSharedService } from 'nexussoft-angular-shared';

@Component({
    selector: 'app-news-list',
    templateUrl: './news-list.component.html',
})
export class NewsListComponent
    extends NewsBaseComponent
    implements OnInit, AfterViewChecked, OnDestroy
{
    constructor(
        cdr: ChangeDetectorRef,
        translate: TranslateService,
        commonService: CommonService,
        modalService: NzModalService,
        messageService: NzMessageService,
        angularSharedService: AngularSharedService,
        private newsOnlineService: NewsOnlineService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private clipboard: Clipboard,
        private angularAuthService: AngularAuthService
    ) {
        super(cdr, translate, commonService, modalService, messageService, angularSharedService);
    }

    protected readonly ActionTypePermissionAttributeEnum = ActionTypePermissionAttributeEnum;
    protected readonly NewsDisplayColumnEnum = NewsDisplayColumnEnum;
    protected readonly NewsStatusEnum = NewsStatusEnum;
    protected readonly NewsActionTypeEnum = NewsActionTypeEnum;
    protected readonly NewsDisplayTypeEnum = NewsDisplayTypeEnum;
    protected readonly NewsDisplayPropertyEnum = NewsDisplayPropertyEnum;

    labelDateByRequest = 'search.updated.date';
    requestSearch: Partial<NewsOnlineGetsRequest> = {
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        notInOptionTypes: [],
        isSearchInCategoryMainTree: true,
        isSearchInCategorySubTree: true,
    };
    isChangeRequestSearch: boolean = false;
    cloneRequestSearch: Partial<NewsOnlineGetsRequest> = {};
    isNotSearchInCategoryMainTree: boolean = false;
    isNotSearchInCategorySubTree: boolean = false;

    newsArticleModels: Array<NewsOnlineSimpleModel> = [];
    tabSources: Array<NewsGroupConditionModel> = [];
    tableSelected: NewsGroupConditionModel;
    fieldSums: Array<{ group: string; total: number }> = [];

    date: Date[] = [];
    formDisplayConfig: AccountSettingFormDisplayConfigModel;

    isCollapsed = true;
    checkedAll = false;
    indeterminate = false;
    setOfCheckedId = new Set<string>();

    keyValid: Array<keyof NewsOnlineGetsRequest> = [
        'tabActive',
        'pageIndex',
        'pageSize',
        'keyword',
        'searchInContent',
        'fromPublishDate',
        'toPublishDate',
        'createdDateFrom',
        'createdDateTo',
        'fromUpdatedDate',
        'toUpdatedDate',
        'categoryMainIds',
        'displayTypes',
        'sourceIds',
        'tagIds',
        'eventIds',
        'seriesIds',
        'categorySubIds',
        'authorIds',
        'createdUserIds',
        'options',
        'iconIds',
        'systemViewFrom',
        'systemViewTo',
        'gaViewFrom',
        'gaViewTo',
        'wordCountFrom',
        'wordCountTo',
        'seoPointMin',
        'seoPointMax',
        'notInOptionTypes',
        'isSearchInCategoryMainTree',
        'isSearchInCategorySubTree',
        'isGetByCurrentUser',
    ];
    keyConvertToNumber: Array<keyof NewsOnlineGetsRequest> = [
        'pageIndex',
        'pageSize',
        'systemViewFrom',
        'systemViewTo',
        'gaViewFrom',
        'gaViewTo',
        'wordCountFrom',
        'wordCountTo',
        'seoPointMin',
        'seoPointMax',
    ];

    currentWebsiteDomain: string = '';

    isTabScrollToActive = false;
    @ViewChild('tabElement') private tabElement: ElementRef;

    isFAQ: boolean = false;

    async ngOnInit() {
        if (this.angularAuthService.currentUserValue) {
            this.currentWebsiteDomain =
                this.angularAuthService.currentUserValue?.website?.ext || '';
        }
        if (!this.angularAuthService.currentUserValue) {
            this.angularAuthService.currentUser$.subscribe((user) => {
                this.currentWebsiteDomain = user?.website?.ext;
            });
        }

        const subscription = this.angularAuthService.currentUser$.subscribe((user) => {
            if (user?.formDisplayConfigs) {
                const formDisplayConfigFound = (
                    user.formDisplayConfigs as Array<AccountSettingFormDisplayConfigModel>
                ).find((config) => config.formId === FormTypeEnum[FormTypeEnum.NewsList]);
                if (formDisplayConfigFound) this.formDisplayConfig = formDisplayConfigFound;
            }
        });
        this.unsubscribe.push(subscription);

        const { queryParams, params, data } = this.activatedRoute.snapshot;

        const query: Partial<NewsOnlineGetsRequest> = this.setUpParams(
            queryParams as Partial<NewsOnlineGetsRequest>
        );
        const dataValid = pick(data, this.keyValid);
        const paramsValid = this.setUpParams(params);

        this.isFAQ = !!data.isFAQ;
        this.cloneRequestSearch = cloneDeep({
            ...this.requestSearch,
            ...paramsValid,
            ...dataValid,
        });

        this.setDateFromUrl(query);

        if (isEmpty(query)) {
            // this.date = [subDays(this.dateNowUtc, 15), addDays(this.dateNowUtc, 15)];
        }

        this.requestSearch = {
            ...this.requestSearch,
            ...query,
            ...paramsValid,
            ...dataValid,
        };
        await this.onSearch(true, false);
    }

    ngAfterViewChecked() {
        if (!this.isTabScrollToActive) {
            this.onTabScrollToActive();
        }
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }

    setUpParams(params: Partial<NewsOnlineGetsRequest>) {
        return Common.setUpParams<Partial<NewsOnlineGetsRequest>>(params, this.keyValid, {
            convertToNumber: this.keyConvertToNumber,
            convertToArray: [
                'categoryMainIds',
                'sourceIds',
                'tagIds',
                'eventIds',
                'seriesIds',
                'categorySubIds',
                'authorIds',
                'createdUserIds',
                'iconIds',
            ],
            convertToArrayNumber: ['displayTypes', 'options', 'notInOptionTypes'],
            convertToBoolean: [
                'searchInContent',
                'isSearchInCategoryMainTree',
                'isSearchInCategorySubTree',
            ],
        });
    }

    async onSearch(resetPageIndex = false, isPushQueryParams: boolean = true) {
        if (resetPageIndex && this.isChangeRequestSearch) {
            this.requestSearch.pageIndex = 0;
        }
        this.requestSearch = {
            ...this.requestSearch,
            ...this.getRequestByTabActive(),
        };

        const request: Partial<NewsOnlineGetsRequest> = {
            ...omitBy(this.requestSearch, (item) => {
                return item === '';
            }),
        };

        if (this.isFAQ) {
            if (!request.options) {
                request.options = [];
            }
            if (!request.options.includes(NewsOptionEnum.FAQ)) {
                request.options.push(NewsOptionEnum.FAQ);
            }
        } else {
            if (!request.notInOptionTypes) {
                request.notInOptionTypes = [];
            }
            if (!request.notInOptionTypes.includes(NewsOptionEnum.FAQ)) {
                request.notInOptionTypes.push(NewsOptionEnum.FAQ);
            }
        }

        const response: BaseResponse<{
            news: Array<NewsOnlineSimpleModel>;
            statuses: Array<KeyValueTypeIntModel<NewsStatusEnum>>;
            displayTypes: Array<KeyValueTypeIntModel<NewsDisplayTypeEnum>>;
            totalRow: number;
            keyword: string;
            pageSize: Number;
            tabs: Array<NewsGroupConditionModel>;

            fieldSums: Array<{ group: string; total: number }>;
            icons: Array<KeyValueTypeStringModel>;
            sources: Array<KeyValueTypeStringModel>;
            options: Array<KeyValueTypeLongModel<NewsOptionEnum>>;

            tagsFilter: Array<KeyValueTypeStringModel>;
            authorsFilter: Array<KeyValueTypeStringModel>;
            seriesFilter: Array<KeyValueTypeStringModel>;
            eventsFilter: Array<KeyValueTypeStringModel>;
            categoryMainsFilter: Array<KeyValueTypeStringModel>;
            categorySubsFilter: Array<KeyValueTypeStringModel>;
            createdUsersFilter: Array<KeyValueTypeStringModel>;
        }> = await this.onAction(
            true,
            this.newsOnlineService.gets.bind(this.newsOnlineService),
            request,
            {
                callback: () =>
                    this.onSearch.call(this, (resetPageIndex = false), isPushQueryParams),
            }
        );
        this.handleMessageErrorByStatus(response);
        if (response.status) {
            this.isChangeRequestSearch = false;

            const {
                news,
                totalRow,
                sources,
                icons,
                options,
                displayTypes,
                tabs,
                tagsFilter,
                authorsFilter,
                seriesFilter,
                eventsFilter,
                categoryMainsFilter,
                categorySubsFilter,
                createdUsersFilter,
                fieldSums,
            } = response.data || {};

            this.newsArticleModels = news || [];
            this.totalRow = totalRow || 0;

            this.tabSources = tabs || [];
            const isItemSelectedExist = this.tabSources.some((item) => {
                if (item.selected) this.tableSelected = item;
                return item.selected;
            });
            if (this.tabSources.length > 0 && !isItemSelectedExist) {
                this.tabSources[0].selected = true;
                this.tableSelected = this.tabSources[0];
            }

            this.sources.newsIconSources = icons || [];
            this.sources.newsOptionSources = options || [];
            this.sources.newsDisplayTypeSources = displayTypes || [];
            this.sources.sourceNewsSources = sources || [];
            this.fieldSums = fieldSums || [];

            // region update ui request
            this.isNotSearchInCategoryMainTree = !request.isSearchInCategoryMainTree;
            this.isNotSearchInCategorySubTree = !request.isSearchInCategorySubTree;
            // endregion

            //#region mapping source
            if (this.sources.authorSources.length === 0 && authorsFilter?.length > 0) {
                this.sources.authorSources = authorsFilter;
            }

            if (this.sources.categoryMainSources.length === 0 && categoryMainsFilter?.length > 0) {
                this.sources.categoryMainSources = categoryMainsFilter;
            }

            if (this.sources.subCateSources.length === 0 && categorySubsFilter?.length > 0) {
                this.sources.subCateSources = categorySubsFilter;
            }

            if (this.sources.createUserSources.length === 0 && createdUsersFilter?.length > 0) {
                this.sources.createUserSources = createdUsersFilter;
            }
            //#endregion

            if (isPushQueryParams) {
                console.log({
                    queryParams: { ...request, ...this.getRequestByTabActive(true) },
                    queryParamsHandling: '',
                    replaceUrl: true,
                    relativeTo: this.activatedRoute,
                });
                await this.router.navigate([], {
                    queryParams: { ...request, ...this.getRequestByTabActive(true) },
                    queryParamsHandling: '',
                    replaceUrl: true,
                    relativeTo: this.activatedRoute,
                });
            }

            this.setOfCheckedId.clear();
            this.refreshCheckedStatus();
        }
        this.cdr.detectChanges();
    }

    onRequestModelChange() {
        this.isChangeRequestSearch = true;
    }

    async onSelectNavStatus(tabActive: NewsGroupConditionModel) {
        this.tableSelected = tabActive;
        this.requestSearch.tabActive = tabActive.tabName;
        this.onRequestModelChange();
        await this.onSearch(true);
    }

    async onClearFilter() {
        this.date = [];
        this.isNotSearchInCategoryMainTree = false;
        this.isNotSearchInCategorySubTree = false;
        this.requestSearch = cloneDeep(this.cloneRequestSearch);
        await this.onSearch(true);
    }

    async onPageSizeChange(pageSize: number) {
        this.requestSearch.pageSize = pageSize;
        await this.onSearch(true);
    }

    setDateFromUrl(query: Partial<NewsOnlineGetsRequest>) {
        if (query.fromPublishDate) {
            this.date[0] = this.getDateUtc(new Date(query.fromPublishDate));
        }
        if (query.toPublishDate) {
            this.date[1] = this.getDateUtc(new Date(query.toPublishDate));
        }

        if (query.createdDateFrom) {
            this.date[0] = this.getDateUtc(new Date(query.createdDateFrom));
        }
        if (query.createdDateTo) {
            this.date[1] = this.getDateUtc(new Date(query.createdDateTo));
        }

        if (query.fromUpdatedDate) {
            this.date[0] = this.getDateUtc(new Date(query.fromUpdatedDate));
        }
        if (query.toUpdatedDate) {
            this.date[1] = this.getDateUtc(new Date(query.toUpdatedDate));
        }
    }

    getRequestByTabActive(isQueryParam = false) {
        let dateFormat1: any = this.date[0];
        let dateFormat2: any = this.date[1];

        if (isQueryParam) {
            dateFormat1 = isDate(this.date[0])
                ? format(this.date[0], this.dateFormatServer)
                : undefined;
            dateFormat2 = isDate(this.date[1])
                ? format(this.date[1], this.dateFormatServer)
                : undefined;
        }

        let request: Partial<
            Pick<
                NewsOnlineGetsRequest,
                | 'createdDateTo'
                | 'createdDateFrom'
                | 'fromPublishDate'
                | 'toPublishDate'
                | 'fromUpdatedDate'
                | 'toUpdatedDate'
                | 'sortField'
                | 'sortType'
            >
        >;

        let dateType: 'updatedDate' | 'createdDate' | 'publishDate' = 'updatedDate';
        if (this.requestSearch.isGetByCurrentUser || !this.requestSearch.tabActive) {
            dateType = 'createdDate';
        } else {
            switch (this.requestSearch.tabActive) {
                case 'PublishTimer':
                case 'Publish':
                    {
                        dateType = 'publishDate';
                    }
                    break;
                case 'All':
                case 'New':
                    {
                        dateType = 'createdDate';
                    }
                    break;
                default:
                    {
                        dateType = 'updatedDate';
                    }
                    break;
            }
        }

        switch (dateType) {
            case 'publishDate':
                {
                    request = {
                        fromPublishDate: dateFormat1,
                        toPublishDate: dateFormat2,
                        createdDateFrom: undefined,
                        createdDateTo: undefined,
                        fromUpdatedDate: undefined,
                        toUpdatedDate: undefined,

                        sortField: NewsAdminSortFieldEnum.PublishDate,
                        sortType: NewsAdminSortTypeEnum.Desc,
                    };
                    this.labelDateByRequest = 'search.publish.date';
                }
                break;
            case 'createdDate':
                {
                    request = {
                        fromPublishDate: undefined,
                        toPublishDate: undefined,
                        createdDateFrom: dateFormat1,
                        createdDateTo: dateFormat2,
                        fromUpdatedDate: undefined,
                        toUpdatedDate: undefined,

                        sortField: NewsAdminSortFieldEnum.CreateDate,
                        sortType: NewsAdminSortTypeEnum.Desc,
                    };
                    this.labelDateByRequest = 'search.created.date';
                }
                break;
            default:
                {
                    request = {
                        fromPublishDate: undefined,
                        toPublishDate: undefined,
                        createdDateFrom: undefined,
                        createdDateTo: undefined,
                        fromUpdatedDate: dateFormat1,
                        toUpdatedDate: dateFormat2,

                        sortField: NewsAdminSortFieldEnum.UpdatedDate,
                        sortType: NewsAdminSortTypeEnum.Desc,
                    };
                    this.labelDateByRequest = 'search.updated.date';
                }
                break;
        }
        return request;
    }

    onChangeNotInOptionTypes(checked: boolean, option: NewsOptionEnum) {
        if (checked) {
            this.requestSearch.notInOptionTypes!.push(option);
        } else {
            this.requestSearch.notInOptionTypes = this.requestSearch.notInOptionTypes!.filter(
                (item) => item !== option
            );
        }
    }

    onTabScrollToActive() {
        if (!this.responsive.isDesktop) {
            const elementTabSelected = this.tabElement.nativeElement.querySelector('.active');
            if (elementTabSelected) {
                this.isTabScrollToActive = true;
                elementTabSelected.scrollIntoView({
                    behavior: 'auto',
                    inline: 'center',
                    block: 'nearest',
                });
            }
        }
    }

    async redirectToAddOrChangePage(newsSimpleModel?: NewsOnlineSimpleModel) {
        if (newsSimpleModel) {
            const command = [
                `/news/${this.isFAQ ? 'change-faq' : 'change'}`,
                newsSimpleModel.id,
                newsSimpleModel.displayType,
            ];
            await this.router.navigate(command);
        } else {
            await this.router.navigate([`/news/${this.isFAQ ? 'add-faq' : 'add'}/1`]);
        }
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
            this.newsArticleModels.length > 0 &&
            this.newsArticleModels.every(({ id }) => this.setOfCheckedId.has(id));
        this.indeterminate =
            !this.checkedAll &&
            this.newsArticleModels.some(({ id }) => this.setOfCheckedId.has(id));
    }

    onAllChecked(checked: boolean): void {
        this.newsArticleModels.forEach(({ id }) => this.updateCheckedSet(id, checked));
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

    async onSyncToEs() {
        const request: NewsSyncToESRequest = {
            ids: Array.from(this.setOfCheckedId),
        };
        const response: BaseResponse<null> = await this.onAction(
            true,
            this.newsOnlineService.syncToES.bind(this.newsOnlineService),
            request
        );
        this.handleMessageErrorByStatus(response);
        if (response.status) {
            this.showMessageSuccess(this.translate.instant('sync.to.es.success'));
        }
    }

    onPropertyShow(newsDisplayPropertyEnum: NewsDisplayPropertyEnum) {
        if (!this.formDisplayConfig?.displayProperties) {
            return true;
        }
        return this.formDisplayConfig.displayProperties.some(
            (item) => item === newsDisplayPropertyEnum
        );
    }

    onColumnShow(newsDisplayColumnEnum: NewsDisplayColumnEnum) {
        if (!this.formDisplayConfig?.displayColumns) {
            return true;
        }
        return this.formDisplayConfig.displayColumns.some((item) => item === newsDisplayColumnEnum);
    }

    onCopyLink(item: NewsOnlineSimpleModel) {
        this.clipboard.copy(`${this.currentWebsiteDomain}${item.detailUrl}`);
    }

    onOpenPublicUrl(item: NewsOnlineSimpleModel, preview = false) {
        let url;
        if (preview) {
            url = `${this.currentWebsiteDomain}${item.previewUrl}`;
        } else {
            url = `${this.currentWebsiteDomain}${item.detailUrl}`;
        }
        window.open(url, '_blank');
    }

    async onChangeStatus(
        newsOnlineSimpleModel: NewsOnlineSimpleModel,
        actionTypePermission: KeyValueTypeIntModel<NewsActionTypeEnum>
    ) {
        const request: NewsOnlineStatusChangeRequest = {
            ...newsOnlineSimpleModel,
            version: newsOnlineSimpleModel.version!,
            actionType: actionTypePermission.id,
        };
        await this.callApiChangeStatus(request, actionTypePermission);
    }

    async callApiChangeStatus(
        request: NewsOnlineStatusChangeRequest,
        actionTypePermission: KeyValueTypeIntModel<NewsActionTypeEnum>,
        fullRequest = false
    ) {
        let newRequest: NewsOnlineStatusChangeRequest = {
            version: request.version,
            id: request.id,
            actionType: request.actionType,
        };
        if (fullRequest) {
            newRequest = {
                ...request,
                ...newRequest,
            };
        }
        const response: BaseResponse<string> = await this.onAction(
            true,
            this.newsOnlineService.normalStatusChange.bind(this.newsOnlineService),
            newRequest
        );
        this.handleMessageErrorByStatus(response);
        if (response.status) {
            this.showMessageSuccess(
                this.translate.instant(
                    'change.status.' +
                        (NewsActionTypeEnum[request.actionType!] || request.actionType) +
                        '.success'
                )
            );
            await this.onSearch();
        } else if (response.messages.includes(MESSAGE_ERROR_VERSION_CHANGED)) {
            this.handelErrorConflictVersion(async () => {
                await this.callApiChangeStatus(
                    { ...request, isOverwrite: true },
                    actionTypePermission,
                    true
                );
            });
        }
    }

    getDisplayAuthor(authors?: AuthorModel[]) {
        return authors?.map((x) => x.userDisplayName).join(', ') || '';
    }

    protected readonly NewsOptionEnum = NewsOptionEnum;
}
