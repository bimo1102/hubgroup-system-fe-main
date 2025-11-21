import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { ButtonAddComponent } from './buttons/button-add.component';
import { TranslationModule } from '../../modules/i18n';
import { CdkDropList } from '@angular/cdk/drag-drop';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { ButtonIconComponent } from './buttons/button-icon.component';
import { ButtonCloseComponent } from './buttons/button-close.component';
import { ButtonDeleteComponent } from './buttons/button-delete.component';
import { ButtonSearchComponent } from './buttons/button-search.component';
import { ButtonIconConfirmComponent } from './buttons/button-icon-confirm.component';
import { SharedModule } from '../../_metronic/shared/shared.module';
import { ButtonRefreshComponent } from './buttons/button-refresh.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { ButtonReloadComponent } from './buttons/button-reload.component';
import { NzProgressComponent } from 'ng-zorro-antd/progress';
import { NzFlexDirective } from 'ng-zorro-antd/flex';
import { ButtonChangeComponent } from './buttons/button-change.component';
import { ButtonSaveComponent } from './buttons/button-save.component';
import { NotFoundComponent } from './notfound/not-found.component';
import { RouterLink } from '@angular/router';
import { NgbCollapse, NgbProgressbar } from '@ng-bootstrap/ng-bootstrap';
import { NzSkeletonComponent } from 'ng-zorro-antd/skeleton';
import { ButtonUploadComponent } from './buttons/button-upload.component';
import { ButtonPreviewComponent } from './buttons/button-preview.component';
import { NzAffixComponent } from 'ng-zorro-antd/affix';
import { ButtonImageComponent } from './buttons/button-image.component';
import { ImageCropComponentComponent } from './image-crop-component/image-crop-component.component';
import { ImageCropperComponent } from 'ngx-image-cropper';
import { SymbolUserComponent } from './symbol-user/symbol-user.component';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';
import { ButtonDownloadComponent } from './buttons/button-download.component';
import { NzSwitchComponent } from 'ng-zorro-antd/switch';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { DateRangePickerComponent } from './date-range-picker/date-range-picker.component';
import { NewsRelatedModalComponent } from './news-related-modal/news-related-modal.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { IdleTimeOutComponent } from './idle-time-out/idle-time-out.component';
import { IdleTimeOutWarningComponent } from './idle-time-out-warning/idle-time-out-warning.component';
import { WebsiteSelectDialogComponent } from './website-select/website-select-dialog.component';
import { ReactWrapperComponent } from './federation-wrappers/react-wrapper/react-wrapper.component';
import { SwitchComponent } from './switch/switch.component';
import { NewsAddRelatedModalComponent } from './news-related-modal/news-add-related-modal.component';
import { FileManagerDialogComponent } from './file-manager-dialog/file-manager-dialog.component';
import { AngularWrapperComponent } from './federation-wrappers/angular-wrapper/angular-wrapper.component';

@NgModule({
    declarations: [
        ButtonAddComponent,
        ConfirmModalComponent,
        ButtonIconComponent,
        ButtonCloseComponent,
        ButtonDeleteComponent,
        ButtonSearchComponent,
        ButtonIconConfirmComponent,
        ButtonRefreshComponent,
        ButtonReloadComponent,
        FileUploadComponent,
        ButtonChangeComponent,
        ButtonSaveComponent,
        NotFoundComponent,
        ButtonUploadComponent,
        ButtonPreviewComponent,
        ButtonImageComponent,
        ImageCropComponentComponent,
        SymbolUserComponent,
        ButtonDownloadComponent,
        NewsRelatedModalComponent,
        DatePickerComponent,
        DateRangePickerComponent,
        IdleTimeOutComponent,
        IdleTimeOutWarningComponent,
        WebsiteSelectDialogComponent,
        ReactWrapperComponent,
        SwitchComponent,
        NewsAddRelatedModalComponent,
        AngularWrapperComponent,
        FileManagerDialogComponent,
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NzIconModule,
        ButtonAddComponent,
        NzSelectModule,
        NzInputNumberModule,
        NzButtonModule,
        NzFormModule,
        NzInputNumberModule,
        NzInputModule,
        TranslationModule,
        NzCheckboxModule,
        NzAlertModule,
        InlineSVGModule,
        NzPopconfirmModule,
        NzTableModule,
        NzGridModule,
        NzSpinModule,
        NzUploadModule,
        NzRadioModule,
        NzTreeSelectModule,
        NzDatePickerModule,
        ButtonIconComponent,
        ButtonCloseComponent,
        ButtonDeleteComponent,
        ButtonSearchComponent,
        ButtonIconConfirmComponent,
        ButtonRefreshComponent,
        FileUploadComponent,
        ButtonReloadComponent,
        ButtonChangeComponent,
        ButtonSaveComponent,
        NotFoundComponent,
        ButtonUploadComponent,
        ButtonPreviewComponent,
        ButtonImageComponent,
        SymbolUserComponent,
        ButtonDownloadComponent,
        DatePickerComponent,
        DateRangePickerComponent,
        ReactWrapperComponent,
        SwitchComponent,
        NewsAddRelatedModalComponent,
        AngularWrapperComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        TranslationModule,
        ReactiveFormsModule,
        NzIconModule,
        NzButtonModule,
        NzInputModule,
        NzSpinModule,
        NzPopconfirmModule,
        NzSelectModule,
        InlineSVGModule,
        CdkDropList,
        NzTabsModule,
        NzDividerModule,
        NzUploadModule,
        SharedModule,
        NzProgressComponent,
        NzFlexDirective,
        NzTableModule,
        RouterLink,
        NgbCollapse,
        NzFormModule,
        NzDatePickerModule,
        NzInputNumberModule,
        NzSkeletonComponent,
        NzAffixComponent,
        ImageCropperComponent,
        NzTooltipDirective,
        NzAlertModule,
        NzCheckboxModule,
        NzSwitchComponent,
        NgbProgressbar,
        NzRadioModule,
    ],
})


export class ComponentShareModule {
}
