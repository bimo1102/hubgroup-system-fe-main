import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TagsComponent } from './tags.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbNavModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { TagsAddOrChangeComponent } from './tags-add-or-change/tags-add-or-change.component';
import { TagsNewsMappingComponent } from './tags-news-mapping/tags-news-mapping.component';
import { ComponentShareModule } from '../../shared/components/component-share.module';
import { NzDropdownButtonDirective, NzDropDownDirective, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { NzFlexDirective } from 'ng-zorro-antd/flex';
import { NzMenuDirective } from 'ng-zorro-antd/menu';
import { NzAffixComponent } from 'ng-zorro-antd/affix';
import { NzSwitchComponent } from 'ng-zorro-antd/switch';

@NgModule({
    declarations: [
        TagsComponent,
        TagsAddOrChangeComponent,
        TagsNewsMappingComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild([
            {
                path: '',
                component: TagsComponent,
            },
        ]),
        ComponentShareModule,
        NzFlexDirective,
        NzAffixComponent,
        NzSwitchComponent,
    ],
    providers: [],
})
export class TagsModule {
}
