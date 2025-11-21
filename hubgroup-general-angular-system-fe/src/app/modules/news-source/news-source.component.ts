import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NewsSourceAddOrChangeComponent } from './news-source-add-or-change/news-source-add-or-change.component';
import { ModuleBaseComponent } from '../../shared/base-components/module-base-component';
import { CommonService } from '../../shared/common.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AngularSharedService } from 'nexussoft-angular-shared';
import { SourcesService } from '../../shared/services/news-source.service';
import { BaseResponse } from '@hubgroup-share-system-fe/types/common.type';
import { SourcesModel, SourcesSearchRequest } from '@hubgroup-share-system-fe/types/sources.type';

@Component({
    selector: 'app-news-source',
    templateUrl: './news-source.component.html',
})
export class NewsSourceComponent extends ModuleBaseComponent implements OnInit, OnDestroy {
    constructor(
        protected cdr: ChangeDetectorRef,
        protected translate: TranslateService,
        protected commonService: CommonService,
        protected modalService: NzModalService,
        protected messageService: NzMessageService,
        protected angularSharedService: AngularSharedService,
        private sourcesService: SourcesService
    ) {
        super(cdr, translate, commonService, modalService, messageService, angularSharedService);
    }

    sourcesModels: Array<SourcesModel> = [];
    requestSearch: SourcesSearchRequest = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        name: '',
    };
    isChangeRequestSearch: boolean = false;

    async ngOnInit() {
        await this.onSearch();
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }

    async onSearch(resetPageIndex = false) {
        if (resetPageIndex && this.isChangeRequestSearch) {
            this.requestSearch.pageIndex = 0;
        }
        const response: BaseResponse<{
            models: Array<SourcesModel>;
            totalRow: number;
        }> = await this.onAction(
            true,
            this.sourcesService.gets.bind(this.sourcesService),
            this.requestSearch,
            {
                callback: () => this.onSearch.call(this, resetPageIndex),
            }
        );
        this.handleMessageErrorByStatus(response);
        if (response.status) {
            this.isChangeRequestSearch = false;

            this.sourcesModels = response.data?.models ?? [];
            this.totalRow = response.data?.totalRow;
        }
    }

    onRequestModelChange() {
        this.isChangeRequestSearch = true;
    }

    async onPageSizeChange(pageSize: number) {
        this.requestSearch.pageSize = pageSize;
        await this.onSearch(true);
    }

    onOpenInsertOrUpdateModal(item?: SourcesModel) {
        this.onShowDialogModalSmall(
            '',
            NewsSourceAddOrChangeComponent,
            {},
            {
                id: item?.id,
            },
            async () => {
                await this.onSearch();
            }
        );
    }

    async onPageIndexChange(pageIndex: number) {
        this.requestSearch.pageIndex = pageIndex - 1;
        await this.onSearch();
    }
}
