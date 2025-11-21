import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconConfigComponent } from './icon-config.component';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconConfigAddOrChangeComponent } from './icon-config-add-or-change/icon-config-add-or-change.component';
import { ComponentShareModule } from '../../shared/components/component-share.module';
import { NzFlexDirective } from 'ng-zorro-antd/flex';
import { NzAffixComponent } from 'ng-zorro-antd/affix';
import { CustomDirectiveModule } from '../../shared/directive/custom-directive.module';

@NgModule({
    declarations: [
        IconConfigComponent,
        IconConfigAddOrChangeComponent,
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: IconConfigComponent,
            },
        ]),
        ComponentShareModule,
        FormsModule,
        MatDialogModule,
        ReactiveFormsModule,
        NzFlexDirective,
        NzAffixComponent,
        CustomDirectiveModule,
    ],
    providers: [],
})

export class IconConfigModule {
}
