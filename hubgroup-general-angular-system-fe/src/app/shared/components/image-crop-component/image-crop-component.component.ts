import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NZ_MODAL_DATA, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ModuleBaseComponent } from '../../base-components/module-base-component';
import { CommonService } from '../../common.service';
import { Common } from '../../common';
import { AngularSharedService } from 'nexussoft-angular-shared';

@Component({
    selector: 'app-news-image-crop-component',
    templateUrl: './image-crop-component.component.html',
    styles: [`.table-choice-position {
        width: 75px !important;
    }

    td {
        cursor: pointer;
    }

    td.selected-col {
        background-color: #FFFFFF;
    }
    `],
})
export class ImageCropComponentComponent extends ModuleBaseComponent implements OnInit, OnDestroy {

    constructor(
        cdr: ChangeDetectorRef,
        translate: TranslateService,
        commonService: CommonService,
        modalService: NzModalService,
        messageService: NzMessageService,
        angularSharedService: AngularSharedService,
        private modal: NzModalRef,
    ) {
        super(cdr, translate, commonService, modalService, messageService, angularSharedService);
    }

    readonly nzModalData = inject<{ ratio: number, imageUrl: string }>(NZ_MODAL_DATA);
    imageUrl: string;
    showCropper = false;
    imageChangedEvent: any = '';
    croppedImage: any = '';
    position: number = 1;
    cropWidth = 0;
    cropHeight = 0;
    rootWidth = 0;
    rootHeight = 0;
    ratio: number = this.nzModalData.ratio || 1;
    naturalWidth = 0;
    naturalHeight = 0;
    cropper = {
        x1: 0,
        y1: 0,
        x2: this.cropWidth,
        y2: this.cropHeight,
    };

    ngOnInit(): void {
        const currentTimestamp = new Date().getTime();
        if (this.nzModalData.imageUrl.match(/\?./)) {
            this.imageUrl = this.nzModalData.imageUrl + '&t=' + currentTimestamp;
        } else {
            this.imageUrl = this.nzModalData.imageUrl + '?t=' + currentTimestamp;
        }


    }

    imageCropped(image: any) {
        this.croppedImage = image;
    }

    imageLoaded() {
        this.showCropper = true;
        Common.getMetaData(this.imageUrl, ({ imageElement }) => {
            this.naturalWidth = imageElement.naturalWidth;
            this.naturalHeight = imageElement.naturalHeight;
            this.onSelectPosition();
        });
    }

    loadImageFailed() {
    }

    onSelectPosition() {
        if (this.naturalWidth === 0) {
            return;
        }
        const cropperImg = document.querySelector('#img_cropper');
        // ảnh nhỏ hơn khung crop thì tính theo ảnh, ngược lại thì tính theo khung
        if (cropperImg == null) {
            this.rootWidth = 0;
            this.rootHeight = 0;
        } else {
            this.rootWidth = cropperImg?.clientWidth < this.naturalWidth ? cropperImg?.clientWidth : this.naturalWidth;
            this.rootHeight = cropperImg?.clientHeight < this.naturalHeight ? cropperImg?.clientHeight : this.naturalHeight;
        }
        if (this.rootWidth < Math.round(this.rootHeight * this.ratio)) {
            this.cropWidth = this.rootWidth;
            this.cropHeight = Math.round(this.rootWidth / this.ratio);
        } else {
            this.cropWidth = Math.round(this.rootHeight * this.ratio);
            this.cropHeight = this.rootHeight;
        }
        if (this.rootWidth === 0 || this.rootHeight === 0) {
            return;
        }
        let x1 = 0;
        let x2 = 0;
        let y1 = 0;
        let y2 = 0;
        switch (+this.position) {
            case 1:
                x1 = 0;
                y1 = 0;
                x2 = this.cropWidth;
                y2 = this.cropHeight;
                break;
            case 2:
                x1 = this.rootWidth / 2 - this.cropWidth / 2;
                y1 = 0;
                x2 = this.rootWidth / 2 + this.cropWidth / 2;
                y2 = this.cropHeight;
                break;
            case 3:
                x1 = this.rootWidth - this.cropWidth;
                y1 = 0;
                x2 = this.rootWidth;
                y2 = this.cropHeight;
                break;
            case 4:
                x1 = 0;
                y1 = this.rootHeight / 2 - this.cropHeight / 2;
                x2 = this.cropWidth;
                y2 = this.rootHeight / 2 + this.cropHeight / 2;
                break;
            case 5:
                x1 = this.rootWidth / 2 - this.cropWidth / 2;
                y1 = this.rootHeight / 2 - this.cropHeight / 2;
                x2 = this.rootWidth / 2 + this.cropWidth / 2;
                y2 = this.rootHeight / 2 + this.cropHeight / 2;
                break;
            case 6:
                x1 = this.rootWidth - this.cropWidth;
                y1 = this.rootHeight / 2 - this.cropHeight / 2;
                x2 = this.rootWidth;
                y2 = this.rootHeight / 2 + this.cropHeight / 2;
                break;
            case 7:
                x1 = 0;
                y1 = this.rootHeight - this.cropHeight;
                x2 = this.cropWidth;
                y2 = this.rootHeight;
                break;
            case 8:
                x1 = this.rootWidth / 2 - this.cropWidth / 2;
                y1 = this.rootHeight - this.cropHeight;
                x2 = this.rootWidth / 2 + this.cropWidth / 2;
                y2 = this.rootHeight;
                break;
            case 9:
                x1 = this.rootWidth - this.cropWidth;
                y1 = this.rootHeight - this.cropHeight;
                x2 = this.rootWidth;
                y2 = this.rootHeight;
                break;
        }
        setTimeout(() => {
            this.cropper = {
                x1,
                y1,
                x2,
                y2,
            };
        }, 100);
    }

    onSelectedPosOnImage(pos: number) {
        this.position = pos;
        this.onSelectPosition();
    }

    onSave() {
        this.modal.close({
            x1: Math.round(this.croppedImage?.imagePosition?.x1 ?? 0.0),
            y1: Math.round(this.croppedImage?.imagePosition?.y1 ?? 0.0),
            x2: Math.round(this.croppedImage?.imagePosition?.x2 ?? 0.0),
            y2: Math.round(this.croppedImage?.imagePosition?.y2 ?? 0.0),
        });
    }

    onClose() {
        this.modal.destroy();
    }
}
