import { ChangeDetectorRef, inject, Injectable, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../common.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ModuleBaseComponent } from './module-base-component';
import {
    AutoCompleteRequest,
    KeyValueTypeIntModel,
    KeyValueTypeOptgroupModel,
} from '@hubgroup-share-system-fe/types/common.type';
import { Subject } from 'rxjs';
import { UserAutocompleteRequest } from '@hubgroup-share-system-fe/types/user.type';
import { NewsActionTypeEnum, NewsDisplayTypeEnum } from '@hubgroup-share-system-fe/enums/news.enum';
import { NewsCategoryService } from '../services/news-category.service';
import { NewsCategoryAutocompleteRequest } from '@hubgroup-share-system-fe/types/news-category.type';
import { CONFIG_MODAL_CONFIRM_OVERWRITE } from '../constant/news.constant';
import { environment } from '../../../environments/environment';
import { isArray } from 'lodash';
import { ActionTypePermissionAttributeEnum } from '@hubgroup-share-system-fe/enums/newspaper.enum';
import { NewsFormSourcesType } from '@hubgroup-share-system-fe/types/news-online-client.type';
import { NewsTypeService } from '../services/news-type.service';
import { ConfirmModalComponent } from '../components/confirm-modal/confirm-modal.component';
import { EventService } from '../services/event.service';
import { TagService } from '../services/tag.service';
import { SeriesService } from '../services/series.service';
import { EventSearchRequest } from '@hubgroup-share-system-fe/types/event.type';
import { SeriesSearchRequest } from '@hubgroup-share-system-fe/types/series.type';
import { AngularSharedService } from 'nexussoft-angular-shared';
import { UserService } from '../services/user.service';
import { ProvinceService } from '../services/province.service';

@Injectable({ providedIn: 'root' })
export class NewsBaseComponent extends ModuleBaseComponent implements OnDestroy {
    constructor(
        protected cdr: ChangeDetectorRef,
        protected translate: TranslateService,
        protected commonService: CommonService,
        protected modalService: NzModalService,
        protected messageService: NzMessageService,
        protected angularSharedService: AngularSharedService
    ) {
        super(cdr, translate, commonService, modalService, messageService, angularSharedService);

        const newsCategoryService = inject(NewsCategoryService);
        const newsTypeService = inject(NewsTypeService);

        const eventService = inject(EventService);
        const seriesService = inject(SeriesService);
        const tagService = inject(TagService);

        const userService = inject(UserService);
        const provinceService = inject(ProvinceService);

        this.setupAutocomplete<NewsCategoryAutocompleteRequest>(
            this.requestCategoryMainAutocomplete$,
            {
                request: {
                    displayType: NewsDisplayTypeEnum.Normal,
                },
                service: newsCategoryService.autocompleteAllTree.bind(newsCategoryService),
            },
            (sources) => {
                this.sources.categoryMainSources = sources;
            }
        );
        this.setupAutocomplete<NewsCategoryAutocompleteRequest>(
            this.requestCategoryMultipleWebsiteAutocomplete$,
            {
                request: {},
                service: newsCategoryService.autocompleteAllTreeByWebsite.bind(newsCategoryService),
            },
            (sources) => {
                this.sources.categoryMainSources = sources;
            }
        );

        this.setupAutocomplete<NewsCategoryAutocompleteRequest>(
            this.requestSubCateAutocomplete$,
            {
                service: newsCategoryService.autocompleteAllTree.bind(newsCategoryService),
            },
            (sources) => {
                this.sources.subCateSources = sources;
            }
        );

        this.setupAutocomplete<AutoCompleteRequest, KeyValueTypeOptgroupModel>(
            this.requestNewsTypeAutocomplete$,
            {
                service: newsTypeService.autocompleteSource.bind(newsTypeService),
            },
            (sources) => {
                this.sources.newsTypeSources = sources;
            }
        );

        this.setupAutocomplete<AutoCompleteRequest>(
            this.requestTagAutocomplete$,
            {
                service: tagService.autocomplete.bind(tagService),
            },
            (sources) => {
                this.sources.tagSources = sources;
            }
        );
        this.setupAutocomplete<EventSearchRequest>(
            this.requestEventAutocomplete$,
            {
                service: eventService.autocomplete.bind(eventService),
            },
            (sources) => {
                this.sources.eventSources = sources;
            }
        );
        this.setupAutocomplete<SeriesSearchRequest>(
            this.requestSeriesAutocomplete$,
            {
                service: seriesService.autocomplete.bind(seriesService),
            },
            (sources) => {
                this.sources.seriesSources = sources;
            }
        );

        this.setupAutocomplete<UserAutocompleteRequest>(
            this.requestCreateUserAutocomplete$,
            {
                service: userService.autocompleteFull.bind(userService),
            },
            (sources) => {
                this.sources.createUserSources = sources;
            }
        );

        this.setupAutocomplete<AutoCompleteRequest, KeyValueTypeIntModel>(
            this.requestProvinceAutocomplete$,
            {
                service: provinceService.provinceAutocomplete.bind(provinceService),
            },
            (sources) => {
                this.sources.provinceSources = sources;
            }
        );
    }

    isFormLoading: boolean = false;

    protected readonly requestCategoryMainAutocomplete$ = new Subject<
        Partial<NewsCategoryAutocompleteRequest>
    >();
    protected readonly requestCategoryMultipleWebsiteAutocomplete$ = new Subject<
        Partial<NewsCategoryAutocompleteRequest>
    >();

    protected readonly requestSubCateAutocomplete$ = new Subject<
        Partial<NewsCategoryAutocompleteRequest>
    >();

    protected readonly requestCreateUserAutocomplete$ = new Subject<
        Partial<UserAutocompleteRequest>
    >();

    protected readonly requestProvinceAutocomplete$ = new Subject<Partial<AutoCompleteRequest>>();

    protected readonly requestNewsTypeAutocomplete$ = new Subject<Partial<AutoCompleteRequest>>();

    protected readonly requestTagAutocomplete$ = new Subject<Partial<AutoCompleteRequest>>();
    protected readonly requestEventAutocomplete$ = new Subject<Partial<EventSearchRequest>>();
    protected readonly requestSeriesAutocomplete$ = new Subject<Partial<SeriesSearchRequest>>();

    protected sources: NewsFormSourcesType = {
        categoryMainSources: [],

        newsDisplayTypeSources: [],
        sourceNewsSources: [],
        provinceSources: [],

        subCateSources: [],
        authorSources: [],
        createUserSources: [],

        newsOptionSources: [],
        newsIconSources: [],
        pseudonymSources: [],

        newsStatusSources: [],

        newsTypeSources: [],

        tagSources: [],
        eventSources: [],
        seriesSources: [],
    };

    protected readonly listPageSize = [5, 10, 15, 25, 50, 100, 500, 1000];
    protected readonly listNewsDisplayTypeEditable: Array<NewsDisplayTypeEnum> = [
        NewsDisplayTypeEnum.Normal,
        NewsDisplayTypeEnum.OutSystem,
    ];

    ngOnDestroy() {
        // console.log('news-base destroy')
        super.ngOnDestroy();
    }

    handelErrorConflictVersion(callBack: () => Promise<void>) {
        this.onShowDialogModalSmall(
            '',
            ConfirmModalComponent,
            {},
            {
                ...CONFIG_MODAL_CONFIRM_OVERWRITE,
                linkOpenPreview: location.href,
            },
            async (result: { yes1: boolean; yes2: boolean }) => {
                if (result.yes1) {
                    await callBack();
                }
            }
        );
    }

    getLinkOpenArticle({
        id,
        type,
    }: {
        id: string;
        type: NewsDisplayTypeEnum;
        websiteId?: string;
    }) {
        let path;
        const baseHref = environment.baseHref || '';
        switch (type) {
            default:
                // window.location.origin + baseHref +
                path = `/news/change/${id}/${type}`;
                break;
        }
        return path;
    }

    onArticleOpenNewTab(param: { id: string; type: NewsDisplayTypeEnum; websiteId?: string }) {
        window.open(this.getLinkOpenArticle(param), '_blank');
    }

    checkAttributeFromActionType(
        actionTypePermission: KeyValueTypeIntModel<NewsActionTypeEnum>,
        attribute: ActionTypePermissionAttributeEnum = ActionTypePermissionAttributeEnum.Remove
    ) {
        return isArray(actionTypePermission.ext3) && actionTypePermission.ext3.includes(attribute);
    }
}
