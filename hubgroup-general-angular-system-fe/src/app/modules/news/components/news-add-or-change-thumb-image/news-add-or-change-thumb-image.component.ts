import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonService } from 'src/app/shared/common.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NewsBaseComponent } from '../../../../shared/base-components/news-base.component';
import {
    MediaThumbChangeEnum,
    NewsDisplayTypeEnum,
} from '@hubgroup-share-system-fe/enums/news.enum';
import { ImageCropComponentComponent } from '../../../../shared/components/image-crop-component/image-crop-component.component';
import {
    AvatarIconKeyValueTypeStringModel,
    BaseResponse,
} from '@hubgroup-share-system-fe/types/common.type';
import { FileUploadResponse, ImageModel } from '@hubgroup-share-system-fe/types/file.type';
import { FileStyleEnum } from '@hubgroup-share-system-fe/enums/file-manager.enum';
import { FileService } from '../../../../shared/services/file.service';
import { Common } from '../../../../shared/common';
import {
    NewsDetectChangeType,
    NewsOnlineAddOrChangeModelClient,
} from '@hubgroup-share-system-fe/types/news-online-client.type';
import { AngularEnvironmentService, AngularSharedService } from 'nexussoft-angular-shared';
import { IconConfigAvatarPositionEnum } from '@hubgroup-share-system-fe/enums/icon-config.enum';

@Component({
    selector: 'app-news-add-or-change-thumb-image',
    templateUrl: './news-add-or-change-thumb-image.component.html',
})
export class NewsAddOrChangeThumbImageComponent
    extends NewsBaseComponent
    implements OnInit, OnChanges, OnDestroy
{
    constructor(
        cdr: ChangeDetectorRef,
        translate: TranslateService,
        commonService: CommonService,
        modalService: NzModalService,
        messageService: NzMessageService,
        angularSharedService: AngularSharedService,
        private fileService: FileService,
        private angularEnvironmentService: AngularEnvironmentService
    ) {
        super(cdr, translate, commonService, modalService, messageService, angularSharedService);
    }

    protected readonly MediaThumbChangeEnum = MediaThumbChangeEnum;
    protected readonly NewsDisplayTypeEnum = NewsDisplayTypeEnum;

    @Input() isTypeQuestionAndAnswer: boolean = false;
    @Input() newsModel: Partial<NewsOnlineAddOrChangeModelClient> = {};
    @Input() avatarIconsSources: Array<AvatarIconKeyValueTypeStringModel> = [];

    @Input() editable: boolean = true;

    @Output() detectDataChangeFunc = new EventEmitter<NewsDetectChangeType>();

    iconAvatarUrl: string = '';
    iconAvatarClass = 'd-none w-50px';

    async ngOnInit() {}

    ngOnChanges(_changes: SimpleChanges) {
        this.onIconAvatarChange();
    }

    async ngOnDestroy() {
        super.ngOnDestroy();
    }

    onOpenFileManagerModal(type: MediaThumbChangeEnum) {
        this.showFileManagerDialog({}, (imageModels) => {
            if (imageModels && imageModels.length > 0) {
                this.handleMedia(type, imageModels);
            }
        });
    }

    onOpenFileCropModal(imageUrl: string, type: MediaThumbChangeEnum) {
        this.onShowDialogModalSmall(
            '',
            ImageCropComponentComponent,
            {},
            {
                imageUrl,
            },
            async (position: { x1: number; y1: number; x2: number; y2: number }) => {
                if (position) {
                    if (type === MediaThumbChangeEnum.Avatar) {
                        if (
                            this.angularEnvironmentService.environment.cdnDomain &&
                            !imageUrl.includes(this.angularEnvironmentService.environment.cdnDomain)
                        ) {
                            const response: BaseResponse<FileUploadResponse> = await this.onAction(
                                true,
                                this.fileService.downloadFromOutside.bind(this.fileService),
                                { fileUrl: imageUrl }
                            );
                            this.handleMessageErrorByStatus(response);
                            if (response.status && response.data) {
                                this.newsModel.avatarUrl = response.data.fullUrl;
                                this.newsModel.avatarOriginUrl = response.data.originFullUrl;
                            }
                        } else {
                            this.changeImageDimension(
                                imageUrl,
                                position.x1,
                                position.y1,
                                position.x2,
                                position.y2,
                                1.5,
                                (file) => {
                                    this.newsModel.avatarUrl = file.fullUrl;
                                    this.newsModel.avatarOriginUrl = file.originFullUrl;
                                }
                            );
                        }
                    } else if (type === MediaThumbChangeEnum.Facebook) {
                        this.changeImageDimension(
                            imageUrl,
                            position.x1,
                            position.y1,
                            position.x2,
                            position.y2,
                            1.91,
                            (file) => {
                                this.newsModel.facebookImageUrl = file.fullUrl;
                                this.newsModel.facebookImageOriginUrl = file.originFullUrl;
                            }
                        );
                    }
                    this.cdr.detectChanges();
                }
            }
        );
    }

    handleMedia(type: MediaThumbChangeEnum, imageModels: Array<Partial<ImageModel>>) {
        const image = imageModels[0];
        if (!image.thumbnailUrl) return;
        if (type === MediaThumbChangeEnum.Avatar) {
            this.newsModel.avatarOriginImageId = image.id;
            this.newsModel.avatarUrl = image.thumbnailUrl;

            // region v1
            if (!this.newsModel.facebookImageUrl) {
                setTimeout(() => {
                    this.handleMedia(MediaThumbChangeEnum.Facebook, imageModels);
                }, 500);
            }
            this.detectDataChangeFunc.emit({ isChange: true });
            // endregion

            this.changeImageDimension(image.thumbnailUrl, 0, 0, 0, 0, 1.5, (file) => {
                // this.newsModel.avatarImageId = file.id;
                this.newsModel.avatarUrl = file.fullUrl;
                this.newsModel.avatarOriginUrl = file.originFullUrl;

                if (!this.newsModel.facebookImageUrl) {
                    setTimeout(() => {
                        this.handleMedia(MediaThumbChangeEnum.Facebook, imageModels);
                    }, 500);
                }
                this.detectDataChangeFunc.emit({ isChange: true });
            });
        } else if (type === MediaThumbChangeEnum.Facebook) {
            this.newsModel.facebookImageOriginId = image.id;
            this.newsModel.facebookImageUrl = image.thumbnailUrl;

            // region v1
            this.detectDataChangeFunc.emit({ isChange: true });
            // endregion

            this.changeImageDimension(image.thumbnailUrl, 0, 0, 0, 0, 1.91, (file) => {
                this.newsModel.facebookImageUrl = file.fullUrl;
                this.newsModel.facebookImageOriginUrl = file.originFullUrl;
                this.detectDataChangeFunc.emit({ isChange: true });
            });
        }
        this.cdr.detectChanges();
    }

    changeImageDimension(
        url: string,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        ratio: number,
        callback: (file: FileUploadResponse) => void
    ) {
        return;
        let w = x2 - x1;
        let h = y2 - y1;
        Common.getMetaData(
            url,
            ({ imageElement }) => {
                this.unSetLoading();
                if (x2 === 0 && y2 === 0) {
                    const rootWidth = imageElement.naturalWidth;
                    const rootHeight = imageElement.naturalHeight;
                    if (rootWidth < Math.round(rootHeight * ratio)) {
                        w = rootWidth;
                        h = Math.round(rootWidth / ratio);
                    } else {
                        w = Math.round(rootHeight * ratio);
                        h = rootHeight;
                    }
                    x2 = x1 + w;
                    y2 = y1 + h;
                }
                let imageCropUrl = '';
                setTimeout(async () => {
                    if (Common.getFileExtension(url) === 'gif') {
                        imageCropUrl = url.includes('?')
                            ? `${url}&x=${x1}&y=${y1}&w=${w}&h=${h}`
                            : `${url}?x=${x1}&y=${y1}&w=${w}&h=${h}`;
                    } else {
                        imageCropUrl = url.includes('?')
                            ? `${url}&a=${x1}&b=${y1}&c=${x2}&d=${y2}`
                            : `${url}?a=${x1}&b=${y1}&c=${x2}&d=${y2}`;
                    }
                    const response: BaseResponse<FileUploadResponse> = await this.onAction(
                        true,
                        this.fileService.downloadFromOutside.bind(this.fileService),
                        { fileUrl: imageCropUrl }
                    );
                    this.handleMessageErrorByStatus(response);
                    if (response.status && response.data) {
                        callback(response.data);
                    }
                }, 200);
            },
            () => this.setLoading()
        );
    }

    onIconAvatarChange() {
        const iconFound = this.avatarIconsSources.find((p) => p.id === this.newsModel.avatarIconId);
        if (iconFound) {
            this.iconAvatarUrl = iconFound.url;
            this.newsModel.avatarIconPosition = iconFound.avatarPosition;

            switch (iconFound.avatarPosition) {
                case IconConfigAvatarPositionEnum.Default:
                case IconConfigAvatarPositionEnum.Image:
                case IconConfigAvatarPositionEnum.Video:
                case IconConfigAvatarPositionEnum.Podcast:
                case IconConfigAvatarPositionEnum.Chart:
                    this.iconAvatarClass = 'start-0 bottom-0 ms-3 mb-3 w-50px';
                    break;
                case IconConfigAvatarPositionEnum.Emagazine:
                case IconConfigAvatarPositionEnum.Infographic:
                case IconConfigAvatarPositionEnum.PhotoStory:
                    this.iconAvatarClass = 'end-0 bottom-0 me-3 mb-3 w-125px';
                    break;
                default:
                    this.iconAvatarClass = 'start-0 bottom-0 ms-3 mb-3 w-50px';
                    break;
            }
        } else {
            this.iconAvatarClass = 'd-none';
            this.iconAvatarUrl = '';
        }
    }

    onReloadFacebookImage() {
        this.newsModel.facebookImageOriginId = this.newsModel.avatarOriginImageId;
        // v2 this.newsModel.facebookImageUrl = this.newsModel.avatarOriginUrl;

        // region v1
        this.newsModel.facebookImageUrl = this.newsModel.avatarUrl;
        this.detectDataChangeFunc.emit({ isChange: true });

        // endregion

        if (this.newsModel.facebookImageUrl) {
            this.changeImageDimension(this.newsModel.facebookImageUrl, 0, 0, 0, 0, 1.91, (file) => {
                this.newsModel.facebookImageUrl = file.fullUrl;
                this.newsModel.facebookImageOriginUrl = file.originFullUrl;
                this.detectDataChangeFunc.emit({ isChange: true });
            });
        }
    }
}
