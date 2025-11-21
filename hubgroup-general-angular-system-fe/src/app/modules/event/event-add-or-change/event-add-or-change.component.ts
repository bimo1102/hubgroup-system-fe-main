import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../../shared/common.service';
import { NZ_MODAL_DATA, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AngularSharedService } from 'nexussoft-angular-shared';
import { ModuleBaseComponent } from '../../../shared/base-components/module-base-component';
import { StatusEnum } from '@hubgroup-share-system-fe/enums/common.enum';
import {
    BaseResponse,
    KeyValueTypeStringModel,
    ObjectGetByIdRequest,
} from '@hubgroup-share-system-fe/types/common.type';
import { NgForm } from '@angular/forms';
import { EventService } from '../../../shared/services/event.service';
import { EventChangeRequest, EventModel } from '@hubgroup-share-system-fe/types/event.type';
import { Common } from '../../../shared/common';
import { MediaModel } from '@hubgroup-share-system-fe/types/media.type';
import { MediaTypeEnum } from '@hubgroup-share-system-fe/enums/media.enum';
import { Subject } from 'rxjs';
import { NewsCategoryAutocompleteRequest } from '@hubgroup-share-system-fe/types/news-category.type';
import { NewsCategoryService } from '../../../shared/services/news-category.service';
import {
    FileSystemTypeEnum,
    FileUploadType,
} from '@hubgroup-share-system-fe/enums/file-manager.enum';

@Component({
    selector: 'app-news-series-add-or-change',
    templateUrl: 'event-add-or-change.component.html',
})
export class EventAddOrChangeComponent extends ModuleBaseComponent implements OnInit, OnDestroy {
    constructor(
        protected cdr: ChangeDetectorRef,
        protected translate: TranslateService,
        protected commonService: CommonService,
        protected modalService: NzModalService,
        protected messageService: NzMessageService,
        protected angularSharedService: AngularSharedService,
        private nzModalRef: NzModalRef,
        private eventService: EventService,
        private newsCategoryService: NewsCategoryService
    ) {
        super(cdr, translate, commonService, modalService, messageService, angularSharedService);
    }

    protected readonly StatusEnum = StatusEnum;
    target: HTMLElement;
    isChange: boolean = false;

    private readonly nzModalData = inject<{
        id: string;
    }>(NZ_MODAL_DATA);
    eventModel: Partial<EventModel & EventChangeRequest> = {};
    date: Array<any> = [];

    protected readonly requestCategoryMainAutocomplete$ = new Subject<
        Partial<NewsCategoryAutocompleteRequest>
    >();
    categoryMainSources: Array<KeyValueTypeStringModel> = [];

    mediaAvatar: MediaModel = {
        type: MediaTypeEnum.EventAvatar,
        url: '',
        isChanged: false,
    };
    mediaCover: MediaModel = {
        type: MediaTypeEnum.EventCover,
        url: '',
        isChanged: false,
    };
    mediaCoverMobile: MediaModel = {
        type: MediaTypeEnum.EventCoverMobile,
        url: '',
        isChanged: false,
    };
    mediaFacebookShare: MediaModel = {
        type: MediaTypeEnum.EventFacebookShare,
        url: '',
        isChanged: false,
    };

    mediaObjects: Array<MediaModel> = [];

    async ngOnInit() {
        const subscription = this.nzModalRef.afterOpen.subscribe(() => {
            this.target = this.nzModalRef.getElement();
        });
        this.unsubscribe.push(subscription);

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

        this.isChange = !!this.nzModalData?.id;
        await this.onGetById();
    }

    async onGetById() {
        const request: ObjectGetByIdRequest = {
            id: this.nzModalData.id || '',
        };
        const response: BaseResponse<{
            model: EventModel;
            isAdministrator: boolean;
            categoriesByZone: Array<KeyValueTypeStringModel>;
        }> = await this.onAction(true, this.eventService.get.bind(this.eventService), request, {
            callback: this.onGetById.bind(this),
        });
        this.handleMessageErrorByStatus(response);
        if (response.status) {
            this.eventModel = response.data?.model || {
                status: StatusEnum.New,
                configOptionObjects: [],
            };

            if (this.eventModel.beginDate && this.eventModel.endDate) {
                this.date = [
                    this.getDateUtc(new Date(this.eventModel.beginDate)),
                    this.getDateUtc(new Date(this.eventModel.endDate)),
                ];
            }

            if (!this.eventModel.facebookOption) {
                this.eventModel.facebookOption = {};
            }

            if (!this.eventModel.subs) {
                this.eventModel.subs = [];
            }

            if (this.eventModel.medias!?.length > 0) {
                this.eventModel.medias!.forEach((media) => {
                    if (media.type === MediaTypeEnum.EventAvatar) {
                        this.mediaAvatar = { ...media };
                    } else if (media.type === MediaTypeEnum.EventCover) {
                        this.mediaCover = { ...media };
                    } else if (media.type === MediaTypeEnum.EventCoverMobile) {
                        this.mediaCoverMobile = { ...media };
                    } else if (media.type === MediaTypeEnum.EventFacebookShare) {
                        this.mediaFacebookShare = { ...media };
                    }
                });
            }

            this.mediaObjects = [
                this.mediaAvatar,
                this.mediaCover,
                this.mediaCoverMobile,
                this.mediaFacebookShare,
            ];
        }
    }

    onOpenFileManagerModal(media: MediaModel) {
        this.showFileManagerDialog(
            {
                fileType: FileSystemTypeEnum.AllImage,
            },
            (images) => {
                if (images!?.length > 0) {
                    media.url = images![0].fullUrl;
                    media.isChanged = true;
                }
            }
        );
    }

    onSubAdd() {
        this.eventModel.subs!.push({});
    }

    onSubRemove(index: number) {
        this.eventModel.subs!.splice(index, 1);
    }

    async onSave(form: NgForm) {
        const formValid = this.formValidate(form);
        if (formValid) {
            this.eventModel.beginDate = Common.formatDateToBackend(this.date[0], Common.DateFormat);
            this.eventModel.endDate = Common.formatDateToBackend(this.date[1], Common.DateFormat);

            const request: EventChangeRequest = {
                ...this.eventModel,
                isSpecialEvent: !!this.eventModel.isSpecialEvent,
                medias: this.mediaObjects,
                subs: this.eventModel.subs?.filter((item) => item.name) || [],
            };

            let action;
            let key;
            if (this.isChange) {
                key = 'change.success';
                action = this.eventService.change;
            } else {
                key = 'add.success';
                action = this.eventService.add;
            }
            const response: BaseResponse<null> = await this.onAction(
                true,
                action.bind(this.eventService),
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

    protected readonly FileUploadType = FileUploadType;
    protected readonly MediaTypeEnum = MediaTypeEnum;
}
