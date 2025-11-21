import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EventAddOrChangeComponent } from './event-add-or-change/event-add-or-change.component';
import { EventNewsMappingComponent } from './event-news-mapping/event-news-mapping.component';
import { CommonService } from '../../shared/common.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AngularSharedService } from 'nexussoft-angular-shared';
import { ModuleBaseComponent } from '../../shared/base-components/module-base-component';
import { StatusEnum } from '@hubgroup-share-system-fe/enums/common.enum';
import { NewsDisplayTypeEnum } from '@hubgroup-share-system-fe/enums/news.enum';
import { BaseResponse, KeyValueTypeStringModel } from '@hubgroup-share-system-fe/types/common.type';
import { Common } from '../../shared/common';
import { EventService } from '../../shared/services/event.service';
import {
    EventModel,
    EventSearchRequest,
    EventStatusChangeRequest,
    EventSyncRequest,
} from '@hubgroup-share-system-fe/types/event.type';
import { Subject } from 'rxjs';
import { NewsCategoryAutocompleteRequest } from '@hubgroup-share-system-fe/types/news-category.type';
import { SpecialEventFilterEnum } from '@hubgroup-share-system-fe/enums/event.enum';
import { NewsCategoryService } from '../../shared/services/news-category.service';
import { join } from 'lodash';

@Component({
    selector: 'app-news-event',
    templateUrl: './event.component.html',
})
export class EventComponent extends ModuleBaseComponent implements OnInit, OnDestroy {
    constructor(
        protected cdr: ChangeDetectorRef,
        protected translate: TranslateService,
        protected commonService: CommonService,
        protected modalService: NzModalService,
        protected messageService: NzMessageService,
        protected angularSharedService: AngularSharedService,
        private eventService: EventService,
        private newsCategoryService: NewsCategoryService
    ) {
        super(cdr, translate, commonService, modalService, messageService, angularSharedService);
    }

    protected StatusEnum = StatusEnum;
    protected readonly NewsDisplayTypeEnum = NewsDisplayTypeEnum;
    protected readonly SpecialEventFilterEnum = SpecialEventFilterEnum;
    protected readonly join = join;

    requestSearch: Partial<EventSearchRequest> = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isSpecialEvent: SpecialEventFilterEnum.All,
    };
    isChangeRequestSearch: boolean = false;
    date: any[] = [];
    protected readonly requestCategoryMainAutocomplete$ = new Subject<
        Partial<NewsCategoryAutocompleteRequest>
    >();
    categoryMainSources: Array<KeyValueTypeStringModel> = [];

    eventModels: EventModel[] = [];

    loadingSwitchStatusObj: Record<string, boolean | undefined> = {};

    checkedAll = false;
    indeterminate = false;
    setOfCheckedId = new Set<string>();

    timeoutGets: ReturnType<typeof setTimeout> | null = null;

    async ngOnInit() {
        this.setupAutocomplete<NewsCategoryAutocompleteRequest>(
            this.requestCategoryMainAutocomplete$,
            {
                service: this.newsCategoryService.autocompleteAllTree.bind(
                    this.newsCategoryService
                ),
            },
            (sources) => {
                this.categoryMainSources = sources;
            }
        );

        await this.onSearch();
    }

    ngOnDestroy() {
        this.clearAllTimeout();
        super.ngOnDestroy();
    }

    async onSearch(resetPageIndex = false, isMultipleProcess: boolean = false) {
        if (resetPageIndex && this.isChangeRequestSearch) {
            this.requestSearch.pageIndex = 0;
        }
        this.requestSearch.fromDate = Common.formatDateToBackend(this.date[0], Common.DateFormat);
        this.requestSearch.toDate = Common.formatDateToBackend(this.date[1], Common.DateFormat);

        const response: BaseResponse<{
            totalRow: number;
            models: Array<EventModel>;
        }> = await this.onAction(
            true,
            this.eventService.gets.bind(this.eventService),
            this.requestSearch,
            {
                callback: () => this.onSearch.call(this, resetPageIndex, isMultipleProcess),
                multipleProcess: isMultipleProcess,
            }
        );
        this.handleMessageErrorByStatus(response);
        if (response) {
            this.isChangeRequestSearch = false;

            this.eventModels = response.data?.models || [];
            this.totalRow = response.data?.totalRow || 0;
            this.setOfCheckedId.clear();
            this.refreshCheckedStatus();
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
            this.eventModels.length > 0 &&
            this.eventModels.every(({ id }) => this.setOfCheckedId.has(id!));
        this.indeterminate =
            !this.checkedAll && this.eventModels.some(({ id }) => this.setOfCheckedId.has(id!));
    }

    onAllChecked(checked: boolean): void {
        this.eventModels.forEach(({ id, totalPost }) => {
            if (totalPost <= 3) {
                this.updateCheckedSet(id!, checked);
            }
        });
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

    async onPageSizeChange(pageSize: number) {
        this.requestSearch.pageSize = pageSize;
        await this.onSearch(true);
    }

    onOpenAddOrChangeModal(item?: any) {
        this.onShowDialogModalSmall(
            '',
            EventAddOrChangeComponent,
            {},
            { id: item?.id || '' },
            () => {
                this.clearAllTimeout();
                this.timeoutGets = setTimeout(async () => {
                    await this.onSearch(false, true);
                }, 1000);
            }
        );
    }

    async onSyncAll() {
        const request: EventSyncRequest = {
            id: '',
        };
        const response: BaseResponse<null> = await this.onAction(
            true,
            this.eventService.sync.bind(this.eventService),
            request
        );
        this.handleMessageErrorByStatus(response);
        if (response.status) {
            this.showMessageSuccess('sync.success');
        }
    }

    onViewMappingModal(item: any) {
        this.onShowDialogModalMedium(
            '',
            EventNewsMappingComponent,
            {},
            {
                eventModel: item,
            },
            () => {
                this.clearAllTimeout();
                this.timeoutGets = setTimeout(async () => {
                    await this.onSearch(false, true);
                }, 1000);
            }
        );
    }

    async onStatusChange(id: string, status: StatusEnum, isLoading: boolean = false) {
        if (!isLoading) {
            this.loadingSwitchStatusObj[id] = true;
        }
        const request: EventStatusChangeRequest = {
            id,
            status,
        };
        const response: BaseResponse<null> = await this.onAction(
            isLoading,
            this.eventService.changeStatus.bind(this.eventService),
            request
        );
        this.handleMessageErrorByStatus(response);
        if (response.status) {
            this.clearAllTimeout();
            this.timeoutGets = setTimeout(async () => {
                await this.onSearch(false, true);
            }, 1000);
        }
        if (!isLoading) {
            this.loadingSwitchStatusObj[id] = false;
        }
    }

    clearAllTimeout() {
        if (this.timeoutGets) {
            clearTimeout(this.timeoutGets);
            this.timeoutGets = null;
        }
    }
}
