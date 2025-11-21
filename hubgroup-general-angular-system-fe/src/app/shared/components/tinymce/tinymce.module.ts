import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';
import { TinyMceEditorWrapperComponent } from './tinymce.component';
import { CommonModule } from '@angular/common';
import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { NzAffixComponent } from 'ng-zorro-antd/affix';
import { ComponentShareModule } from '../component-share.module';
import { NzFlexDirective } from 'ng-zorro-antd/flex';
import { NzSwitchComponent } from 'ng-zorro-antd/switch';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSkeletonComponent } from 'ng-zorro-antd/skeleton';

@NgModule({
	declarations: [
		TinyMceEditorWrapperComponent,
	],
    imports: [
        FormsModule,
        EditorModule,
        CommonModule,
        NzSpinComponent,
        NzAffixComponent,
        ComponentShareModule,
        NzFlexDirective,
        NzSwitchComponent,
        NzCheckboxModule,
        NzSkeletonComponent,
    ],
	exports: [
        TinyMceEditorWrapperComponent,
	],
    providers: [
        // { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
    ]
})
export class TinyMceWrapperModule {
}
