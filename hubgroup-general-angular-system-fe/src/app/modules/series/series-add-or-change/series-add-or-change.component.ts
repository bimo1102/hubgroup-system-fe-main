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
import { MediaModel } from '@hubgroup-share-system-fe/types/media.type';
import { MediaTypeEnum } from '@hubgroup-share-system-fe/enums/media.enum';
import { Subject } from 'rxjs';
import { NewsCategoryAutocompleteRequest } from '@hubgroup-share-system-fe/types/news-category.type';
import { NewsCategoryService } from '../../../shared/services/news-category.service';
import { FileSystemTypeEnum } from '@hubgroup-share-system-fe/enums/file-manager.enum';
import { SeriesService } from '../../../shared/services/series.service';
import { SeriesChangeRequest, SeriesModel } from '@hubgroup-share-system-fe/types/series.type';

@Component({
    selector: 'app-news-series-add-or-change',
    templateUrl: 'series-add-or-change.component.html',
})
export class SeriesAddOrChangeComponent extends ModuleBaseComponent implements OnInit, OnDestroy {
    constructor(
        protected cdr: ChangeDetectorRef,
        protected translate: TranslateService,
        protected commonService: CommonService,
        protected modalService: NzModalService,
        protected messageService: NzMessageService,
        protected angularSharedService: AngularSharedService,
        private nzModalRef: NzModalRef,
        private seriesService: SeriesService,
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
    seriesModel: Partial<SeriesModel & SeriesChangeRequest> = {};
    date: Array<any> = [];

    protected readonly requestCategoryMainAutocomplete$ = new Subject<
        Partial<NewsCategoryAutocompleteRequest>
    >();
    categoryMainSources: Array<KeyValueTypeStringModel> = [];

    mediaAvatar: MediaModel = {
        type: MediaTypeEnum.SeriesAvatar,
        url: '',
        isChanged: false,
    };
    mediaCover: MediaModel = {
        type: MediaTypeEnum.SeriesCover,
        url: '',
        isChanged: false,
    };
    mediaCoverMobile: MediaModel = {
        type: MediaTypeEnum.SeriesCoverMobile,
        url: '',
        isChanged: false,
    };
    mediaFacebookShare: MediaModel = {
        type: MediaTypeEnum.SeriesFacebookShare,
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
            model: SeriesModel;
            categoriesByZone: Array<KeyValueTypeStringModel>;
        }> = await this.onAction(true, this.seriesService.get.bind(this.seriesService), request, {
            callback: this.onGetById.bind(this),
        });
        this.handleMessageErrorByStatus(response);
        if (response.status) {
            this.seriesModel = response.data?.model || {
                status: StatusEnum.New,
                configOptionObjects: [],
            };

            if (!this.seriesModel.facebookOption) {
                this.seriesModel.facebookOption = {};
            }

            if (this.seriesModel.medias!?.length > 0) {
                this.seriesModel.medias!.forEach((media) => {
                    if (media.type === MediaTypeEnum.SeriesAvatar) {
                        this.mediaAvatar = { ...media };
                    } else if (media.type === MediaTypeEnum.SeriesCover) {
                        this.mediaCover = { ...media };
                    } else if (media.type === MediaTypeEnum.SeriesCoverMobile) {
                        this.mediaCoverMobile = { ...media };
                    } else if (media.type === MediaTypeEnum.SeriesFacebookShare) {
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

    async onSave(form: NgForm) {
        const formValid = this.formValidate(form);
        if (formValid) {
            const request = {
                ...this.seriesModel,
                medias: this.mediaObjects,
                categoryIds: [],
                positionIds: [],
                optionObjects: this.seriesModel.optionsDisplay || [],
            } as SeriesChangeRequest;

            let action;
            let key;
            if (this.isChange) {
                key = 'change.success';
                action = this.seriesService.change;
            } else {
                key = 'add.success';
                action = this.seriesService.add;
            }
            const response: BaseResponse<null> = await this.onAction(
                true,
                action.bind(this.seriesService),
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

    protected readonly MediaTypeEnum = MediaTypeEnum;
}
