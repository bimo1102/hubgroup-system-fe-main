import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NewsCategoryAddOrChangeComponent } from './news-category-add-or-change/news-category-add-or-change.component';
import { NewsCategorySeoComponent } from './news-category-seo/news-category-seo.component';
import { CommonService } from '../../shared/common.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ModuleBaseComponent } from '../../shared/base-components/module-base-component';
import { NewsCategoryService } from '../../shared/services/news-category.service';
import { BaseResponse } from '@hubgroup-share-system-fe/types/common.type';
import {
    NewsCategoryListModel,
    NewsCategoryModel,
    NewsCategoryStatusChangeRequest,
} from '@hubgroup-share-system-fe/types/news-category.type';
import { NzFormatEmitEvent, NzTreeComponent, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { StatusEnum } from '@hubgroup-share-system-fe/enums/common.enum';
import { AngularAuthService, AngularSharedService } from 'nexussoft-angular-shared';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';

@Component({
    selector: 'app-news-category',
    templateUrl: './news-category.component.html',
})
export class NewsCategoryComponent extends ModuleBaseComponent implements OnInit, OnDestroy {
    constructor(
        cdr: ChangeDetectorRef,
        translate: TranslateService,
        commonService: CommonService,
        modalService: NzModalService,
        messageService: NzMessageService,
        angularSharedService: AngularSharedService,
        private newsCategoryService: NewsCategoryService,
        protected angularAuthService: AngularAuthService
    ) {
        super(cdr, translate, commonService, modalService, messageService, angularSharedService);
    }

    protected readonly StatusEnum = StatusEnum;

    @ViewChild('nzTreeComponent', { static: false }) nzTreeComponent!: NzTreeComponent;
    categories: Array<NewsCategoryModel> = [];
    selectedItem?: NzTreeNodeOptions & NewsCategoryModel;

    selectedKeys: string[] = [];
    expandKeys: string[] = [];
    searchValue = '';

    nodes: NzTreeNodeOptions[] = [];

    isLoadingSwitchStatus: boolean = false;

    async ngOnInit() {
        await this.onSearch();
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }

    recursiveMap(data: Array<NewsCategoryModel>): Array<NzTreeNodeOptions> {
        return data.map((item) => ({
            ...item,
            key: item.id!,
            title: item.text,
            isLeaf: !(item.children && item.children.length > 0),
            children: item.children ? this.recursiveMap(item.children) : undefined,
        }));
    }

    async onSearch() {
        const response: BaseResponse<NewsCategoryListModel> = await this.onAction(
            true,
            this.newsCategoryService.gets.bind(this.newsCategoryService),
            {},
            {
                callback: this.onSearch.bind(this),
            }
        );
        this.handleMessageErrorByStatus(response);
        if (response.status) {
            this.categories = response?.data?.models || [];
            this.totalRow = response?.data?.totalRow || 0;
            this.nodes = this.recursiveMap(this.categories);
            this.expandKeys = [...this.expandKeys];
            this.selectedKeys = [...this.selectedKeys];
        }
    }

    onExpand(event: NzFormatEmitEvent) {
        this.expandKeys = event.keys || [];
    }

    onCategoryToggleSelect(event: NzFormatEmitEvent): void {
        this.selectedKeys = event.keys || [];
        if (event.keys!?.length > 0) {
            this.selectedItem = event.node?.origin as any;
        } else {
            this.selectedItem = undefined;
        }
    }

    async onAddOrChange(item?: NzTreeNodeOptions) {
        this.onShowDialogModalSmall(
            '',
            NewsCategoryAddOrChangeComponent,
            {},
            {
                id: item?.key || '',
                nodes: this.nodes,
            },
            async () => {
                await this.onSearch();
            }
        );
    }

    async onSeoEdit(item?: NzTreeNodeOptions) {
        this.onShowDialogModalSmall(
            '',
            NewsCategorySeoComponent,
            {},
            {
                id: item?.key || '',
            },
            async () => {}
        );
    }

    onToggleActiveStatus() {
        this.onShowDialogModalSmall(
            '',
            ConfirmModalComponent,
            {},
            {
                title: 'category.change.status',
                description: 'are.you.sure',
            },
            async (result?: { yes1: boolean }) => {
                if (result?.yes1) {
                    this.isLoadingSwitchStatus = true;
                    const newStatus =
                        this.selectedItem!.status === StatusEnum.Active
                            ? StatusEnum.InActive
                            : StatusEnum.Active;
                    await this.onStatusChange(this.selectedItem!.id, newStatus, false);
                    this.selectedItem!.status = newStatus;
                    this.isLoadingSwitchStatus = false;
                }
            }
        );
    }

    async onStatusChange(id: string, status: StatusEnum, isRefreshData: boolean = true) {
        const request: NewsCategoryStatusChangeRequest = {
            id,
            status,
        };
        const response: BaseResponse<null> = await this.onAction(
            true,
            this.newsCategoryService.statusChange.bind(this.newsCategoryService),
            request
        );
        this.handleMessageErrorByStatus(response);
        if (response.status) {
            this.showMessageSuccess(this.translate.instant('change.status.success'));
            if (isRefreshData) {
                await this.onSearch();
            }
            if (status === StatusEnum.Deleted) {
                this.selectedItem = undefined;
                this.selectedKeys = [];
            }
        }
    }
}
