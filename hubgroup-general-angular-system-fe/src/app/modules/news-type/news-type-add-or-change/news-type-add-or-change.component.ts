import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../../shared/common.service';
import { NZ_MODAL_DATA, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AngularSharedService } from 'nexussoft-angular-shared';
import { ModuleBaseComponent } from '../../../shared/base-components/module-base-component';
import {
    AutoCompleteRequest,
    BaseResponse,
    KeyValueTypeOptgroupModel,
    KeyValueTypeStringModel,
} from '@hubgroup-share-system-fe/types/common.type';
import { StatusEnum } from '@hubgroup-share-system-fe/enums/common.enum';
import { NgForm } from '@angular/forms';
import { NewsTypeService } from '../../../shared/services/news-type.service';
import {
    NewsTypeModel,
    NewsTypeUpdateRequest,
} from '@hubgroup-share-system-fe/types/news-type.type';
import { Subject } from 'rxjs';
import { NewsCategoryAutocompleteRequest } from '@hubgroup-share-system-fe/types/news-category.type';
import { SourcesService } from '../../../shared/services/news-source.service';
import { SourcesSearchRequest } from '@hubgroup-share-system-fe/types/sources.type';
import { Common } from '../../../shared/common';

@Component({
    selector: 'app-news-type-add-or-change',
    templateUrl: './news-type-add-or-change.component.html',
})
export class NewsTypeAddOrChangeComponent extends ModuleBaseComponent implements OnInit, OnDestroy {
    constructor(
        protected cdr: ChangeDetectorRef,
        protected translate: TranslateService,
        protected commonService: CommonService,
        protected modalService: NzModalService,
        protected messageService: NzMessageService,
        protected angularSharedService: AngularSharedService,
        private newsTypeService: NewsTypeService,
        private sourcesService: SourcesService,
        private nzModalRef: NzModalRef
    ) {
        super(cdr, translate, commonService, modalService, messageService, angularSharedService);
    }

    private readonly nzModalData = inject<{
        id: string;
    }>(NZ_MODAL_DATA);

    target: HTMLElement;
    isChange: boolean = false;

    request: { id: string } = {
        id: '',
    };
    newsTypeModel: Partial<NewsTypeModel & NewsTypeUpdateRequest> = {};

    protected readonly requestNewsTypeParentAutocomplete$ = new Subject<
        Partial<AutoCompleteRequest>
    >();
    newsTypeParentSources: Array<KeyValueTypeStringModel> = [];

    protected readonly requestSourceMappingAutocomplete$ = new Subject<
        Partial<SourcesSearchRequest>
    >();
    sourceMappingSources: Array<KeyValueTypeStringModel> = [];

    async ngOnInit() {
        const subscription = this.nzModalRef.afterOpen.subscribe(() => {
            this.target = this.nzModalRef.getElement();
        });
        this.unsubscribe.push(subscription);

        this.setupAutocomplete(
            this.requestNewsTypeParentAutocomplete$,
            {
                service: this.newsTypeService.autocompleteParent.bind(this.newsTypeService),
            },
            (sources) => {
                this.newsTypeParentSources = sources;
            }
        );

        this.setupAutocomplete<SourcesSearchRequest>(
            this.requestSourceMappingAutocomplete$,
            {
                service: this.sourcesService.autocomplete.bind(this.sourcesService),
            },
            (sources) => {
                this.sourceMappingSources = sources;
            }
        );

        this.request.id = this.nzModalData?.id || '';
        this.isChange = !!this.nzModalData?.id;

        await this.getById();
    }

    async getById() {
        const response: BaseResponse<{
            models: NewsTypeModel;
        }> = await this.onAction(
            true,
            this.newsTypeService.getById.bind(this.newsTypeService),
            this.request,
            {
                callback: this.getById.bind(this),
            }
        );
        this.handleMessageErrorByStatus(response);
        if (response.status) {
            this.newsTypeModel = response.data?.models || {
                status: StatusEnum.Active,
            };

            if (this.newsTypeModel.selectedParentIds!?.length > 0) {
                this.newsTypeParentSources = this.newsTypeModel.selectedParentIds!;
            }

            if (this.newsTypeModel.selectedSourceIds!?.length > 0) {
                this.sourceMappingSources = this.newsTypeModel.selectedSourceIds!;
            }
        }
    }

    async onSave(form: NgForm) {
        const formValid = this.formValidate(form);
        if (formValid) {
            const request = {
                ...this.newsTypeModel,
                priority: this.newsTypeModel.priority || undefined,
            } as NewsTypeUpdateRequest;

            let action;
            let key;
            if (this.isChange) {
                action = this.newsTypeService.update;
                key = 'change.success';
            } else {
                action = this.newsTypeService.insert;
                key = 'add.success';
            }

            const response: BaseResponse<null> = await this.onAction(
                true,
                action.bind(this.newsTypeService),
                request
            );
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
