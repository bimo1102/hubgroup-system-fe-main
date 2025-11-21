import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonService } from 'src/app/shared/common.service';
import {
    AvatarIconKeyValueTypeStringModel,
    BaseResponse,
    KeyValueTypeIntModel,
    KeyValueTypeStringModel,
} from '@hubgroup-share-system-fe/types/common.type';
import { NzModalService } from 'ng-zorro-antd/modal';
import {
    NewsOnlineChangeRequest,
    NewsOnlineInitAddOrChangeRequest,
    NewsOnlineStatusChangeRequest,
    ParentModel,
    RelatedNewsModel,
    RelatedNewsRequest,
} from '@hubgroup-share-system-fe/types/news-online.type';
import { NgForm } from '@angular/forms';
import {
    NewsActionTypeEnum,
    NewsDisplayTypeEnum,
    NewsOptionEnum,
    NewsStatusEnum,
    PodcastUpdateOptionEnum,
    SeoSettingEnum,
} from '@hubgroup-share-system-fe/enums/news.enum';
import { ActivatedRoute, Router } from '@angular/router';
import {
    CONFIG_MODAL_CONFIRM_BACK,
    MESSAGE_ERROR_VERSION_CHANGED,
    NEWS_DETAIL_VALIDATE,
    NEWS_VALIDATE_MESSAGE,
} from '../../../shared/constant/news.constant';
import { BehaviorSubject } from 'rxjs';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { NewsBaseComponent } from '../../../shared/base-components/news-base.component';
import { NewsOnlineService } from '../../../shared/services/news-online.service';
import {
    InitAddOrChangeResponseType,
    NewsDetectChangeType,
    NewsOnlineAddOrChangeModelClient,
} from '@hubgroup-share-system-fe/types/news-online-client.type';
import { SourceKeyValueModel } from '@hubgroup-share-system-fe/types/news.type';
import { cloneDeep, isEmpty, omit } from 'lodash';
import { StatusEnum, ValidateClientEnum } from '@hubgroup-share-system-fe/enums/common.enum';
import { Common } from '../../../shared/common';
import { EventSubKeyValueTypeStringModel } from '@hubgroup-share-system-fe/types/event.type';
import { ActionTypePermissionAttributeEnum } from '@hubgroup-share-system-fe/enums/newspaper.enum';
import { AngularEnvironmentService, AngularSharedService } from 'nexussoft-angular-shared';
import { LanguageService } from '../../../shared/services/language.service';
import { LanguageTypeEnum } from '@hubgroup-share-system-fe/enums/language.enum';
import { LanguageModel } from '@hubgroup-share-system-fe/types/language.type';

@Component({
    selector: 'app-news-add-or-change-base',
    templateUrl: './news-add-or-change-base.component.html',
})
export class NewsAddOrChangeBaseComponent extends NewsBaseComponent implements OnInit, OnDestroy {
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
        private angularEnvironmentService: AngularEnvironmentService,
        private languageService: LanguageService
    ) {
        super(cdr, translate, commonService, modalService, messageService, angularSharedService);
    }

    protected readonly NewsDisplayTypeEnum = NewsDisplayTypeEnum;
    protected readonly NewsActionTypeEnum = NewsActionTypeEnum;
    protected readonly NewsStatusEnum = NewsStatusEnum;
    protected readonly NEWS_DETAIL_VALIDATE = NEWS_DETAIL_VALIDATE;
    protected readonly StatusEnum = StatusEnum;
    protected readonly ActionTypePermissionAttributeEnum = ActionTypePermissionAttributeEnum;

    protected readonly detectChange$ = new BehaviorSubject<NewsDetectChangeType>({
        isChange: false,
        data: '',
    });

    @ViewChild('addOrChangeForm') addOrChangeForm: NgForm;

    newsModel: Partial<NewsOnlineAddOrChangeModelClient> = {
        isAdd: true,
    };

    languageSources: Array<KeyValueTypeStringModel> = [];
    avatarIconSources: Array<AvatarIconKeyValueTypeStringModel> = [];
    newsSources: Array<SourceKeyValueModel> = [];

    seoSettings: Array<KeyValueTypeIntModel<SeoSettingEnum>> = [];

    subEvents: Array<EventSubKeyValueTypeStringModel> = [];

    relatedArticles: Array<RelatedNewsModel> = [];

    isAdministrator: boolean = false;

    actionTypesHasPermission: Array<KeyValueTypeIntModel<NewsActionTypeEnum>> = [];

    isInitAdOrChange: boolean = false;

    ui: { isHiddenToolbar: boolean; displayTypeText: string } = {
        isHiddenToolbar: false,
        displayTypeText: '',
    };

    isFAQ: boolean = false;

    async ngOnInit() {
        const subscription = this.activatedRoute.paramMap.subscribe(async (param) => {
            this.newsModel.displayType = NewsDisplayTypeEnum.Normal;
            this.newsModel.id = param.get('articleId') || '';
            this.newsModel.displayType = Number(param.get('displayType') || '');

            const { data } = this.activatedRoute.snapshot;
            this.isFAQ = !!data.isFAQ;
            await this.onInit();
        });

        this.unsubscribe.push(subscription);
    }

    async ngOnDestroy() {
        super.ngOnDestroy();
    }

    async onInit() {
        const request: NewsOnlineInitAddOrChangeRequest = {
            id: this.newsModel.id || '',
            displayType: this.newsModel.displayType,
        };
        let response: BaseResponse<InitAddOrChangeResponseType> = await this.onAction(
            true,
            this.newsOnlineService.normalInitAddOrChange.bind(this.newsOnlineService),
            request,
            {
                callback: this.onInit.bind(this),
            }
        );
        this.handleMessageErrorByStatus(response);

        if (response.status) {
            const { news: newsResponse, options } = response.data || {};

            const isOptionFAQ = options.some(
                (item) => item.id === NewsOptionEnum.FAQ && item.checked
            );
            if (
                (isOptionFAQ &&
                    this.activatedRoute?.snapshot?.routeConfig?.path !==
                        'change-faq/:articleId/:displayType') ||
                (newsResponse.displayType &&
                    newsResponse.displayType > 0 &&
                    this.newsModel.displayType !== newsResponse.displayType)
            ) {
                await this.router.navigate([
                    `/news/${isOptionFAQ ? 'change-faq' : 'change'}`,
                    newsResponse.id,
                    newsResponse.displayType,
                ]);
                return;
            }

            await this.initData(response.data);

            this.detectDataModelChange({ isChange: false });

            if (!this.isInitAdOrChange && this.newsModel.id) {
                this.isInitAdOrChange = true;
                await this.getLanguages();
            }
            this.cdr.detectChanges();
        }
    }

    async initData(response: InitAddOrChangeResponseType) {
        const {
            news: newsResponse,
            icons,
            avatarIcons,
            sources,
            displayTypes,
            groupNewsTypes,
            isAdministrator,
            actionTypesHasPermission,
            options,
            seoSettings,
        } = response || {};

        this.actionTypesHasPermission = actionTypesHasPermission || [];
        this.newsModel = newsResponse || {};

        if (newsResponse.province) {
            this.sources.provinceSources = Common.initSourcesAutoComplete(
                this.sources.provinceSources,
                [newsResponse.province]
            );
            this.newsModel.provinceId = newsResponse.province.id;
        }

        if (newsResponse.type) {
            this.newsModel.typeId = newsResponse.type.id;
        }

        this.sources = {
            ...this.sources,
            newsOptionSources: options || [],
            newsIconSources: icons || [],
            newsDisplayTypeSources: displayTypes || [],
        };
        this.sources.tagSources = Common.initSourcesAutoComplete(
            this.sources.tagSources,
            newsResponse.tags
        );
        this.sources.eventSources = Common.initSourcesAutoComplete(
            this.sources.eventSources,
            newsResponse.events
        );
        this.sources.seriesSources = Common.initSourcesAutoComplete(
            this.sources.seriesSources,
            newsResponse.series
        );

        if (newsResponse.language) {
            this.newsModel.languageCulture = newsResponse.language.id;
        }

        this.newsSources = sources || [];
        this.sources.newsTypeSources = groupNewsTypes || [];
        this.avatarIconSources = avatarIcons || [];

        this.ui.displayTypeText =
            this.sources.newsDisplayTypeSources.find(
                (item) => item.id === this.newsModel.displayType
            )?.text || '';

        this.isAdministrator = isAdministrator;

        if (this.isFAQ) {
            this.newsModel.options = (this.newsModel.options || 0) | NewsOptionEnum.FAQ;
        }

        //#region mapping data by news option
        if (this.sources.newsOptionSources?.length > 0) {
            this.sources.newsOptionSources.forEach((option) => {
                option.checked = this.getIsCheckNewsOption(option.id);
            });
        }
        //#endregion

        if (isEmpty(newsResponse.relatedArticles)) {
            this.newsModel.relatedArticles = [];
        } else {
            this.relatedArticles = newsResponse.relatedArticles!.filter(
                (item) => !item.isPodcast && !item.isVideo
            );
        }

        if (isEmpty(newsResponse.categoryMain)) {
            this.newsModel.categoryMain = {};
        }
        if (isEmpty(newsResponse.categorySubs)) {
            this.newsModel.categorySubs = [{}, {}];
        }

        if (newsResponse.tags!?.length > 0) {
            this.newsModel.tagIds = newsResponse.tags!.map((item) => item.id);
        }
        this.subEvents = [];
        if (newsResponse.events!?.length > 0) {
            this.newsModel.eventId = this.newsModel.events![0].id;
            const firstEvent = this.newsModel.events![0];

            if (firstEvent.isSpecialEvent && firstEvent.subs) {
                this.subEvents = firstEvent.subs;
            }
        }
        if (newsResponse.series!?.length > 0) {
            this.newsModel.seriesId = this.newsModel.series![0].id;
        }
        if (seoSettings?.length > 0) {
            this.seoSettings = seoSettings.map((item) => ({
                ...item,
                checked: !!(
                    this.newsModel.seoSetting && (item.id & this.newsModel.seoSetting) == item.id
                ),
            }));
        }

        // this.formValidate(this.addOrChangeForm);
    }

    async getLanguages() {
        const response: BaseResponse<Array<LanguageModel>> = await this.onAction(
            true,
            this.languageService.display.bind(this.languageService),
            LanguageTypeEnum.Data,
            {
                keepParams: true,
            }
        );
        this.handleMessageErrorByStatus(response);
        if (response.status) {
            this.languageSources =
                response.data?.map((item) => {
                    if (item.isDefault && this.newsModel.isAdd) {
                        this.newsModel.languageCulture = item.id;
                    }
                    return {
                        id: item.culture,
                        value: item.culture,
                        text: item.name,
                    };
                }) || [];
        }
    }

    async onBack(form: NgForm, formElement: HTMLFormElement) {
        if (this.getCurrentDataModelIsChange()) {
            this.onShowDialogModalSmall(
                '',
                ConfirmModalComponent,
                {},
                {
                    ...CONFIG_MODAL_CONFIRM_BACK,
                },
                async (result?: { yes1: boolean; yes2: boolean }) => {
                    if (result?.yes1) {
                        await this.onSaveAndBack(form, formElement);
                    }
                }
            );
        } else {
            await this.router.navigate(['/news']);
        }
    }

    getIsCheckNewsOption(type: NewsOptionEnum) {
        return this.newsModel?.options ? (this.newsModel.options & type) == type : false;
    }

    onSourceModelChange() {
        this.newsModel.typeId = '';
        this.onSearchAutocompleteNewsType('');
    }

    onSearchAutocompleteNewsType(keyword: string) {
        this.requestNewsTypeAutocomplete$.next({
            keyword: keyword,
            sourceId: this.newsModel.sourceId,
        });
    }

    //#region SEO
    onSeoTitleChange() {
        if (this.newsModel.seoTitle && this.newsModel.status !== NewsStatusEnum.Publish) {
            this.newsModel.seoUrl = Common.removeVietnameseTones(this.newsModel.seoTitle);
        }
    }

    //#endregion

    onOpenParentNews(parentNews: ParentModel) {
        if (parentNews.websiteId !== this.angularEnvironmentService.environment.clientWebsiteId) {
            this.showMessageWarning(
                this.translate.instant('news.copy.open.link.wrong.website.warning')
            );
            return;
        }
        this.onArticleOpenNewTab({ id: parentNews.id, type: parentNews.displayType! });
    }

    onEventModelChange(eventId: string) {
        const eventFound = this.sources.eventSources.find((item) => item.id === eventId);
        this.subEvents = eventFound?.isSpecialEvent && eventFound.subs ? eventFound.subs : [];
    }

    // region detect data change
    detectDataModelChange(param: NewsDetectChangeType = { isChange: true }) {
        this.detectChange$.next(param);
    }

    getCurrentDataModelIsChange() {
        return this.detectChange$.value.isChange;
    }

    // endregion

    //#region mapping data - validate - save
    mappingDataToRequest() {
        const newsModelRequest = cloneDeep(this.newsModel);

        const options = this.sources.newsOptionSources
            .filter((item) => item.checked)
            .reduce((accumulator, currentValue) => {
                return accumulator | currentValue.id;
            }, 0);
        const seoSetting = this.seoSettings
            .filter((item) => item.checked)
            .reduce((accumulator, currentValue) => {
                return accumulator | currentValue.id;
            }, 0);

        if (!isEmpty(newsModelRequest.categoryMain)) {
            newsModelRequest.categoryMain = {
                ...newsModelRequest.categoryMain,
            };
        } else {
            newsModelRequest.categoryMain = undefined;
        }

        if (newsModelRequest?.categorySubs!?.length > 0) {
            newsModelRequest.categorySubs = newsModelRequest.categorySubs!.filter(
                (item) => item.categoryId
            );
        }

        let relatedNews: Array<RelatedNewsRequest> = [
            ...this.relatedArticles?.map((item, index) => ({
                id: item.id,
                priority: index,
                isPodcast: false,
                isVideo: false,
            })),
        ];

        const keyExcludeNewsModel: Array<keyof NewsOnlineAddOrChangeModelClient> = [
            'parent',
            'type',
            'tags',
            'series',
            'relatedArticles',
            'component',
        ];
        const request: NewsOnlineChangeRequest = {
            ...(omit(newsModelRequest, keyExcludeNewsModel) as NewsOnlineChangeRequest),

            eventIds: newsModelRequest.eventId ? [newsModelRequest.eventId] : [],
            seriesIds: newsModelRequest.seriesId ? [newsModelRequest.seriesId] : [],
            options: options as NewsOptionEnum,
            seoSetting: seoSetting as SeoSettingEnum,
            relatedNews,
            subsEventIds: this.subEvents.filter((item) => item.checked).map((item) => item.id!),
            publishDate: newsModelRequest.publishDate
                ? (Common.getFormattedDateTime(newsModelRequest.publishDate!) as string)
                : undefined,
        };
        return request;
    }

    validate(actionType?: NewsActionTypeEnum) {
        let status: boolean = true;
        let message: string = '';
        let errorType: ValidateClientEnum = ValidateClientEnum.Default;
        let idScrollTo: string = '';

        if (
            actionType === NewsActionTypeEnum.Publish ||
            actionType === NewsActionTypeEnum.PublishDirect ||
            actionType === NewsActionTypeEnum.SendToPublish ||
            actionType === NewsActionTypeEnum.SendToEditor
        ) {
            if (
                !this.newsModel.content &&
                this.newsModel.displayType !== NewsDisplayTypeEnum.OutSystem
            ) {
                message = this.translate.instant(NEWS_VALIDATE_MESSAGE.content);
                status = false;
            }
        }

        return {
            status,
            message,
            errorType,
            idScrollTo,
        };
    }

    async onSaveAndBack(form: NgForm, formElement: HTMLFormElement) {
        await this.onSave(form, formElement);
        await this.onBack(form, formElement);
    }

    async onSave(form: NgForm, formElement: HTMLFormElement) {
        let isValidateForm: boolean = false;
        // is validating form by status -> pending;
        const formValid = !isValidateForm || this.formValidate(form);
        if (formValid) {
            const validate = this.validate();

            if (!validate.status) {
                this.showMessageWarning(validate.message);
                const elementErrorScroll = validate.idScrollTo
                    ? formElement.querySelector(`#${validate.idScrollTo}`)
                    : null;
                if (elementErrorScroll) {
                    Common.scrollIntoView(elementErrorScroll);
                }
                return;
            }
            const request = this.mappingDataToRequest();
            await this.callApiSave(request);
        } else {
            this.handleMessageFormInvalid(form, formElement);
        }
    }

    async callApiSave(request: NewsOnlineChangeRequest) {
        let action;
        let keyNotificationSuccess;

        if (this.newsModel.isAdd) {
            action = this.newsOnlineService.normalAdd;
            keyNotificationSuccess = 'add.success';
        } else {
            action = this.newsOnlineService.normalChange;
            keyNotificationSuccess = 'update.success';
        }

        if (!action) return;

        const response: BaseResponse<null> = await this.onAction(
            true,
            action.bind(this.newsOnlineService),
            request
        );
        this.handleMessageErrorByStatus(response);
        if (response.status) {
            if (this.newsModel.isAdd) {
                await this.router.navigate([
                    '/news/change',
                    this.newsModel.id,
                    this.newsModel.displayType,
                ]);
            } else {
                await this.onInit();
            }
            this.showMessageSuccess(this.translate.instant(keyNotificationSuccess));
        } else if (response.messages.includes(MESSAGE_ERROR_VERSION_CHANGED)) {
            this.handelErrorConflictVersion(async () => {
                await this.callApiSave({ ...request, isOverwrite: true });
            });
        }
        this.cdr.detectChanges();
    }

    async onChangeStatus(
        actionTypePermission: KeyValueTypeIntModel<NewsActionTypeEnum>,
        formElement: HTMLFormElement
    ) {
        const request: NewsOnlineStatusChangeRequest = {
            ...this.mappingDataToRequest(),
            version: this.newsModel.version!,
            actionType: actionTypePermission.id,
        };

        const validate = this.validate(actionTypePermission.id);
        if (!validate.status) {
            this.showMessageWarning(validate.message);
            const elementErrorScroll = validate.idScrollTo
                ? formElement.querySelector(`#${validate.idScrollTo}`)
                : null;
            if (elementErrorScroll) {
                Common.scrollIntoView(elementErrorScroll);
            }
            return;
        }

        if (this.getCurrentDataModelIsChange()) {
            this.onShowDialogModalSmall(
                '',
                ConfirmModalComponent,
                {},
                {
                    title: this.translate.instant(
                        ('Are you sure ' + (actionTypePermission.text || '?')).toLowerCase()
                    ),
                    description: this.translate.instant('Process this action') + '?',
                    textYesButton: 'save.and.continue',
                    textYesButton2: 'not.save.and.continue',
                    isShowBtnYes2: true,
                },
                async (result?: {
                    yes1: boolean;
                    yes2: boolean;
                    podcastUpdateOption: PodcastUpdateOptionEnum;
                }) => {
                    if (result?.yes1 || result?.yes2) {
                        await this.callApiChangeStatus(
                            { ...request, hasChange: result.yes1 },
                            actionTypePermission,
                            true
                        );
                    }
                }
            );
        } else {
            this.onShowDialogModalSmall(
                '',
                ConfirmModalComponent,
                {},
                {
                    title: this.translate.instant(
                        actionTypePermission.text.length > 0
                            ? ('Are you sure ' + actionTypePermission.text).toLowerCase()
                            : 'Are you sure ?'.toLowerCase()
                    ),
                    description: this.translate.instant('Process this action') + '?',
                    textYesButton: 'Continue',
                },
                async (result?: { yes1: boolean }) => {
                    if (result?.yes1) {
                        await this.callApiChangeStatus(request, actionTypePermission);
                    }
                }
            );
        }
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
            await this.onInit();
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

    //#endregion

    protected readonly NewsOptionEnum = NewsOptionEnum;
}
