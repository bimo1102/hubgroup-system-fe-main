import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Common } from '../../../shared/common';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonService } from '../../../shared/common.service';
import { NZ_MODAL_DATA, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ModuleBaseComponent } from '../../../shared/base-components/module-base-component';
import { NewsCategoryService } from '../../../shared/services/news-category.service';
import { NgForm } from '@angular/forms';
import {
    NewsCategoryAutocompleteRequest,
    NewsCategoryChangeRequest,
    NewsCategoryModel,
} from '@hubgroup-share-system-fe/types/news-category.type';
import { Subject } from 'rxjs';
import { NewsStatusEnum } from '@hubgroup-share-system-fe/enums/news.enum';
import {
    BaseResponse,
    KeyValueTypeStringModel,
    ObjectGetByIdRequest,
} from '@hubgroup-share-system-fe/types/common.type';
import { SeoOptionModel } from '@hubgroup-share-system-fe/types/seo.type';
import { NzFormatEmitEvent, NzTreeComponent, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { AngularSharedService } from 'nexussoft-angular-shared';
import { cloneDeep } from 'lodash';

@Component({
    selector: 'app-news-category-add-or-change-modal',
    templateUrl: 'news-category-add-or-change.component.html',
})
export class NewsCategoryAddOrChangeComponent
    extends ModuleBaseComponent
    implements OnInit, OnDestroy
{
    constructor(
        cdr: ChangeDetectorRef,
        translate: TranslateService,
        commonService: CommonService,
        modalService: NzModalService,
        messageService: NzMessageService,
        angularSharedService: AngularSharedService,
        private newsCategoryService: NewsCategoryService,
        private nzModalRef: NzModalRef
    ) {
        super(cdr, translate, commonService, modalService, messageService, angularSharedService);
    }

    private readonly nzModalData = inject<{
        id: string;
        nodes: Array<NzTreeNodeOptions>;
    }>(NZ_MODAL_DATA);

    protected readonly requestGroupCategoryAutocomplete$ = new Subject<
        Partial<NewsCategoryAutocompleteRequest>
    >();
    protected readonly requestCategoryRelatedAutocomplete$ = new Subject<
        Partial<NewsCategoryAutocompleteRequest>
    >();
    protected readonly NewsStatusEnum = NewsStatusEnum;
    @ViewChild('nzTreeParentComponent', { static: false }) nzTreeParentComponent!: NzTreeComponent;
    target: HTMLElement;
    categoryModel: Partial<NewsCategoryModel> = {};

    isAdd: boolean = true;
    isCanUpdateSeoUrl: boolean = true;

    groupsSources: any[] = [];
    groupIds: string[] = [];

    categoryRelates: Array<KeyValueTypeStringModel> = [];
    categoryRelatedSources: Array<KeyValueTypeStringModel> = [];

    isRelAllChild: boolean = true;

    parentCheckedKeys: string[] = [];
    searchNodeValue: string = '';

    nodes: NzTreeNodeOptions[] = [];

    async ngOnInit() {
        const subscription = this.nzModalRef.afterOpen.subscribe(() => {
            this.target = this.nzModalRef.getElement();
        });
        this.unsubscribe.push(subscription);

        if (this.nzModalData.nodes) {
            this.nodes = cloneDeep(this.nzModalData.nodes);
        }
        if (this.nzModalData.id) {
            this.isAdd = false;
        }

        this.setupAutocomplete<NewsCategoryAutocompleteRequest>(
            this.requestCategoryRelatedAutocomplete$,
            {
                service: this.newsCategoryService.autocompleteAllTree.bind(
                    this.newsCategoryService
                ),
            },
            (sources) => {
                this.categoryRelatedSources = sources;
            }
        );

        this.setupAutocomplete<NewsCategoryAutocompleteRequest>(
            this.requestGroupCategoryAutocomplete$,
            {
                service: this.newsCategoryService.autocompleteAllTree.bind(
                    this.newsCategoryService
                ),
            },
            (sources) => {
                this.groupsSources = sources;
            }
        );

        await this.onGetById();
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }

    onCategoryToggleSelect(event: NzFormatEmitEvent) {
        this.parentCheckedKeys = event.keys || [];
    }

    onParentCheck(event: NzFormatEmitEvent) {
        if (event.keys) {
            this.parentCheckedKeys = [event.keys[event.keys.length - 1]];
        }
    }

    async onGetById() {
        const request: ObjectGetByIdRequest = {
            id: this.nzModalData.id || '',
        };
        const response: BaseResponse<{
            model: NewsCategoryModel;
            parent: KeyValueTypeStringModel;
        }> = await this.onAction(
            true,
            this.newsCategoryService.getById.bind(this.newsCategoryService),
            request,
            { callback: this.onGetById.bind(this) }
        );
        this.handleMessageErrorByStatus(response);
        if (response.status) {
            if (response.data?.parent) {
                this.parentCheckedKeys = [response.data.parent.id];
            }
            this.categoryModel = response.data?.model || {};

            if (!this.categoryModel.seoOption) {
                this.categoryModel.seoOption = {} as SeoOptionModel;
            }

            this.categoryRelates = this.categoryModel?.relateds || [];
            this.categoryRelatedSources = this.categoryModel?.relateds || [];

            if (this.categoryModel.id) {
                const nodeMatch = this.nzTreeParentComponent.getTreeNodeByKey(
                    this.categoryModel.id
                );
                if (nodeMatch) {
                    nodeMatch.isDisabled = true;
                }
            }
        }
    }

    onChangeTitle() {
        if (this.isAdd) {
            this.categoryModel.seoOption!.title = this.categoryModel.name;
            if (this.isCanUpdateSeoUrl) {
                this.categoryModel.seoOption!.url = Common.removeVietnameseTones(
                    this.categoryModel.name || ''
                )
                    .toLowerCase()
                    .replace(/\s+/g, '');
            }
        }
    }

    onChangeSeoTitle() {
        if (this.isAdd && this.isCanUpdateSeoUrl) {
            this.categoryModel.seoOption!.url = Common.removeVietnameseTones(
                this.categoryModel.seoOption!.title
            )
                .toLowerCase()
                .replace(/\s+/g, '');
        }
    }

    onChangeSeoUrl() {
        if (this.isAdd) {
            this.isCanUpdateSeoUrl = false;
        }
    }

    onChangeSeoCanonicalUrl() {
        if (this.isAdd) {
            this.isCanUpdateSeoUrl = false;
        }
    }

    onAddCateRelates() {
        this.categoryRelates.push({} as KeyValueTypeStringModel);
    }

    onRemoveCategoryRelated(index: number) {
        this.categoryRelates.splice(index, 1);
    }

    dropRelates(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.categoryRelates, event.previousIndex, event.currentIndex);
    }

    async onSave(form: NgForm) {
        let action;
        let key;
        const formValid = this.formValidate(form);
        if (formValid) {
            if (this.isAdd) {
                action = this.newsCategoryService.add.bind(this.newsCategoryService);
                key = 'add.success';
            } else {
                action = this.newsCategoryService.change.bind(this.newsCategoryService);
                key = 'update.success';
            }

            const request: Partial<NewsCategoryChangeRequest> = {
                ...this.categoryModel,
                relatedIds: this.categoryRelates.map((item) => item.id),
                groupIds: this.groupIds,
                isRelAllChild: this.isRelAllChild,
                status: !!this.categoryModel.isActive,
                parentId: this.parentCheckedKeys.length > 0 ? this.parentCheckedKeys[0] : '',
                optionObjects: this.categoryModel.optionsDisplay || [],
            };

            const response: BaseResponse<null> = await this.onAction(true, action, request);
            this.handleMessageErrorByStatus(response);
            if (response.status) {
                this.showMessageSuccess(this.translate.instant(key));
                this.nzModalRef.close();
            }
        } else {
            this.showMessageWarning(this.translate.instant('please.fill.data'));
        }
    }

    onClose() {
        this.nzModalRef.close();
    }
}
