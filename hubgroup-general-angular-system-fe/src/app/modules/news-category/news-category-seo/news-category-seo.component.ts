import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    inject,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../../shared/common.service';
import { NZ_MODAL_DATA, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../../auth';
import { ModuleBaseComponent } from '../../../shared/base-components/module-base-component';
import { NewsCategoryService } from '../../../shared/services/news-category.service';
import { AngularSharedService } from 'nexussoft-angular-shared';
import { BaseResponse, ObjectGetByIdRequest } from '@hubgroup-share-system-fe/types/common.type';
import {
    NewsCategoryChangeSeoRequest,
    NewsCategorySeoModel,
} from '@hubgroup-share-system-fe/types/news-category.type';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { SeoOptionModel } from '@hubgroup-share-system-fe/types/seo.type';
import { NgForm } from '@angular/forms';
import { MediaTypeEnum } from '@hubgroup-share-system-fe/enums/media.enum';
import { MediaModel } from '@hubgroup-share-system-fe/types/media.type';
import { FileSystemTypeEnum } from '@hubgroup-share-system-fe/enums/file-manager.enum';

@Component({
    selector: 'app-news-category-seo-modal',
    templateUrl: 'news-category-seo.component.html',
})
export class NewsCategorySeoComponent extends ModuleBaseComponent implements OnInit, OnDestroy {
    constructor(
        cdr: ChangeDetectorRef,
        translate: TranslateService,
        commonService: CommonService,
        modalService: NzModalService,
        messageService: NzMessageService,
        angularSharedService: AngularSharedService,
        private authService: AuthService,
        private nzModalRef: NzModalRef,
        private newsCategoryService: NewsCategoryService
    ) {
        super(cdr, translate, commonService, modalService, messageService, angularSharedService);
    }

    private readonly nzModalData = inject<{
        id: string;
    }>(NZ_MODAL_DATA);

    request: ObjectGetByIdRequest = {
        id: '',
    };
    categorySeoModel: Partial<NewsCategorySeoModel> = {};

    mediaAvatar: MediaModel = {
        type: MediaTypeEnum.NewsCategoryAvatar,
        url: '',
        isChanged: false,
    };
    mediaCover: MediaModel = {
        type: MediaTypeEnum.NewsCategoryFacebookShare,
        url: '',
        isChanged: false,
    };

    mediaObjects: MediaModel[] = [];
    target: HTMLElement;

    async ngOnInit() {
        const subscription = this.nzModalRef.afterOpen.subscribe(() => {
            this.target = this.nzModalRef.getElement();
        });
        this.unsubscribe.push(subscription);

        this.request.id = this.nzModalData.id || '';
        await this.onGetSeoModelByCategoryId();
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }

    async onGetSeoModelByCategoryId() {
        const response: BaseResponse<{
            model: NewsCategorySeoModel;
        }> = await this.onAction(
            true,
            this.newsCategoryService.getSeoById.bind(this.newsCategoryService),
            this.request,
            { callback: this.onGetSeoModelByCategoryId.bind(this) }
        );
        this.handleMessageErrorByStatus(response);
        if (response.status) {
            this.categorySeoModel = response.data?.model || {};
            if (!this.categorySeoModel.seoOption) {
                this.categorySeoModel.seoOption = {} as SeoOptionModel;
            }
            if (!this.categorySeoModel.facebookOption) {
                this.categorySeoModel.facebookOption = {};
            }

            if (this.categorySeoModel.medias!?.length > 0) {
                this.categorySeoModel.medias!.forEach((media) => {
                    if (media.type === MediaTypeEnum.NewsCategoryAvatar) {
                        this.mediaAvatar = { ...media };
                    } else if (media.type === MediaTypeEnum.NewsCategoryFacebookShare) {
                        this.mediaCover = { ...media };
                    }
                });
            }
            this.mediaObjects = [this.mediaAvatar, this.mediaCover];
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
            const request: NewsCategoryChangeSeoRequest = {
                ...this.categorySeoModel,
                medias: this.mediaObjects,
            };
            const response: BaseResponse<null> = await this.onAction(
                true,
                this.newsCategoryService.changeSeo.bind(this.newsCategoryService),
                request
            );
            this.handleMessageErrorByStatus(response);
            if (response.status) {
                this.nzModalRef.close();
            }
        } else {
            this.showMessageWarning(this.translate.instant('please.fill.data'));
        }
    }

    onClose() {
        this.nzModalRef.close();
    }

    onOpenFileManager(type = 16) {
        // const dialog = this.dialog.open(FileManagerMicroComponent, {
        //     panelClass: 'file-manager-dialog',
        //     maxWidth: '100vw',
        //     maxHeight: '100vh',
        //     height: '100%',
        //     width: '100%',
        //     data: {},
        //     disableClose: true,
        // });
        // dialog.afterClosed().subscribe((result) => {
        //     if (result) {
        //         if (Array.isArray(result)) {
        //             this.medias.forEach(item => {
        //                 if (type === item.type) {
        //                     item.url = result[0].thumbnailUrl;
        //                     item.isChanged = true;
        //                 }
        //             });
        //             if (type === 16) {
        //                 this.changeImageDimension(result[0].thumbnailUrl, 0, 0, 0, 0, 1.5, (newUrl) => {
        //                     this.imageAvatarCrop = newUrl;
        //                     this.cdr.detectChanges();
        //                 });
        //             } else if (type === 17) {
        //                 this.changeImageDimension(result[0].thumbnailUrl, 0, 0, 0, 0, 1.91, (newUrl) => {
        //                     this.imageFacebookShareCrop = newUrl;
        //                     this.cdr.detectChanges();
        //                 });
        //             }
        //         }
        //         this.cdr.detectChanges();
        //     }
        // });
    }

    showEditorImage(item: any) {
        // const dialog = this.dialog.open(ImageCropComponentComponent, {
        //     panelClass: 'my-full-screen-dialog',
        //     maxWidth: '90vw',
        //     maxHeight: '90vh',
        //     height: '100%',
        //     width: '100%',
        //     data: {
        //         imageUrl: item.url,
        //         ratio: item.type === 16 ? 1.5 : 1.91,
        //     },
        //     disableClose: true,
        // });
        // dialog.afterClosed().subscribe((result) => {
        //     if (result == null || result?.length === 0) {
        //         return;
        //     }
        //     if (item.type === 16) {
        //         this.changeImageDimension(item.url, result.x1, result.y1, result.x2, result.y2, 1.5, (newUrl) => {
        //             this.imageAvatarCrop = newUrl;
        //             this.cdr.detectChanges();
        //         });
        //     } else if (item.type === 17) {
        //         this.changeImageDimension(item.url, result.x1, result.y1, result.x2, result.y2, 1.91, (newUrl) => {
        //             this.imageFacebookShareCrop = newUrl;
        //             this.cdr.detectChanges();
        //         });
        //     }
        // });
    }

    // changeImageDimension(url, x1, y1, x2, y2, ratio, callback) {
    // let w = x2 - x1;
    // let h = y2 - y1;
    // this.getMeta(url, (err, img) => {
    //     if (x2 === 0 && y2 === 0) {
    //         const rootWidth = img.naturalWidth;
    //         const rootHeight = img.naturalHeight;
    //         if (rootWidth < Math.round(rootHeight * ratio)) {
    //             w = rootWidth;
    //             h = Math.round(rootWidth / ratio);
    //         } else {
    //             w = Math.round(rootHeight * ratio);
    //             h = rootHeight;
    //         }
    //         x2 = x1 + w;
    //         y2 = y1 + h;
    //     }
    //     let imageCropUrl = '';
    //     setTimeout(() => {
    //         if (Common.getFileExtension(url) === 'gif') {
    //             imageCropUrl = `${url}?x=${x1}&y=${y1}&w=${w}&h=${h}`;
    //         } else {
    //             imageCropUrl = `${url}?a=${x1}&b=${y1}&c=${x2}&d=${y2}`;
    //         }
    //         this.action(this.fileManagerService.downloadFileFromOutside({
    //             FileUrl: imageCropUrl,
    //         }), (response) => {
    //             callback(response.fullUrl);
    //         });
    //     }, 200);
    // });
    // }

    // getMeta = (url, cb) => {
    //     const img = new Image();
    //     img.onload = () => cb(null, img);
    //     img.onerror = (err) => cb(err);
    //     img.src = url;
    // };

    protected readonly MediaTypeEnum = MediaTypeEnum;
}
