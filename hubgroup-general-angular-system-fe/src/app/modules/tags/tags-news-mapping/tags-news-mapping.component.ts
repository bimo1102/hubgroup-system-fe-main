import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NZ_MODAL_DATA, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { CommonService } from 'src/app/shared/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AngularSharedService } from 'nexussoft-angular-shared';
import { TagService } from '../../../shared/services/tag.service';
import { ModuleBaseComponent } from '../../../shared/base-components/module-base-component';
import { StatusEnum } from '@hubgroup-share-system-fe/enums/common.enum';
import { NewsSearchRequest, NewsSimpleModel } from '@hubgroup-share-system-fe/types/news.type';
import { NewsOnlineService } from '../../../shared/services/news-online.service';
import {
    BaseResponse,
    KeyValueTypeIntModel,
    KeyValueTypeStringModel,
} from '@hubgroup-share-system-fe/types/common.type';
import { NewsAddRelatedTypeEnum, NewsStatusEnum } from '@hubgroup-share-system-fe/enums/news.enum';
import { Subject } from 'rxjs';
import { NewsCategoryAutocompleteRequest } from '@hubgroup-share-system-fe/types/news-category.type';
import { NewsCategoryService } from '../../../shared/services/news-category.service';
import {
    TagConvertRequest,
    TagModel,
    TagsRemoveFromNewsRequest,
} from '@hubgroup-share-system-fe/types/tag.type';
import { NewsAddRelatedModalComponent } from '../../../shared/components/news-related-modal/news-add-related-modal.component';

@Component({
    selector: 'app-news-tags-mapping',
    templateUrl: 'tags-news-mapping.component.html',
})
export class TagsNewsMappingComponent extends ModuleBaseComponent implements OnDestroy, OnInit {
    constructor(
        protected cdr: ChangeDetectorRef,
        protected translate: TranslateService,
        protected commonService: CommonService,
        protected modalService: NzModalService,
        protected messageService: NzMessageService,
        protected angularSharedService: AngularSharedService,
        private tagService: TagService,
        private newsOnlineService: NewsOnlineService,
        private nzModalRef: NzModalRef,
        private newsCategoryService: NewsCategoryService
    ) {
        super(cdr, translate, commonService, modalService, messageService, angularSharedService);
    }

    private readonly nzModalData = inject<{
        tagModel: TagModel;
    }>(NZ_MODAL_DATA);

    tagModel?: TagModel;

    target: HTMLElement;
    checkedAll = false;
    indeterminate = false;
    setOfCheckedId = new Set<string>();

    protected readonly requestCategoryAutocomplete$ = new Subject<
        Partial<NewsCategoryAutocompleteRequest>
    >();
    categorySources: Array<KeyValueTypeStringModel> = [];
    requestSearch: Partial<NewsSearchRequest> = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
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

        if (this.nzModalData.tagModel) {
            this.tagModel = this.nzModalData.tagModel;
            this.requestSearch.tagIds = [this.nzModalData.tagModel.id];
            await this.onPostGets();
        }
    }

    ngOnDestroy() {
        this.clearAllTimeout();
        super.ngOnDestroy();
    }

    async onPostGets(isResetPageIndex: boolean = false, isMultipleProcess: boolean = false) {
        if (isResetPageIndex && this.isChangeRequestSearch) {
            this.requestSearch.pageIndex = 0;
        }

        const response: BaseResponse<{
            news: Array<NewsSimpleModel>;
            icons: Array<KeyValueTypeStringModel>;
            sources: Array<KeyValueTypeStringModel>;
            displayTypes: Array<KeyValueTypeStringModel>;
            statuses: Array<KeyValueTypeIntModel<NewsStatusEnum>>;
            totalRow: number;
        }> = await this.onAction(
            true,
            this.newsOnlineService.gets.bind(this.newsOnlineService),
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

            this.onClearAll();
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

    onClearAll() {
        this.setOfCheckedId.clear();
        this.refreshCheckedStatus();
    }

    async onPageIndexChange(pageIndex: number) {
        this.requestSearch.pageIndex = pageIndex - 1;
        await this.onPostGets();
    }

    async onRemoveTagFromNewsConfirm() {
        if (this.setOfCheckedId.size === 0) {
            this.showMessageError(this.translate.instant("you.haven't.selected.any.article.yet"));
            return;
        }

        const request: TagsRemoveFromNewsRequest = {
            id: this.tagModel!.id,
            newsIds: Array.from(this.setOfCheckedId),
        };

        const response: BaseResponse<null> = await this.onAction(
            true,
            this.tagService.removeTagFromNews.bind(this.tagService),
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
                id: this.tagModel!.id,
                type: NewsAddRelatedTypeEnum.Tag,
            },
            () => {
                this.clearAllTimeout();
                this.timeoutGets = setTimeout(async () => {
                    await this.onPostGets(false, true);
                }, 2000);
            }
        );
    }

    async onTagConvert() {
        const request: TagConvertRequest = {
            fromTagId: this.tagModel!.id,
            toTagId: this.requestSearch.keyword!,
        };
        const response: BaseResponse<null> = await this.onAction(
            true,
            this.tagService.tagConvert.bind(this.tagService),
            request
        );
        this.handleMessageErrorByStatus(response);
        if (response.status) {
            this.showMessageSuccess(this.translate.instant('tag.covert.success'));
        }
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

    protected readonly StatusEnum = StatusEnum;
}
