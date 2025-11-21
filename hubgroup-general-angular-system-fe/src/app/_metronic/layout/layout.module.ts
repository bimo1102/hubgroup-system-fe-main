import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { RouterModule, Routes } from '@angular/router';
import {
    NgbDropdownModule,
    NgbProgressbarModule,
    NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '../../modules/i18n';
import { LayoutComponent } from './layout.component';
import { ExtrasModule } from '../partials/layout/extras/extras.module';
import { Routing } from '../../pages/routing';
import { AsideComponent } from './components/aside/aside.component';
import { HeaderComponent } from './components/header/header.component';
import { ContentComponent } from './components/content/content.component';
import { FooterComponent } from './components/footer/footer.component';
import { ScriptsInitComponent } from './components/scripts-init/scripts-init.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { AsideMenuComponent } from './components/aside/aside-menu/aside-menu.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { PageTitleComponent } from './components/header/page-title/page-title.component';
import { HeaderMenuComponent } from './components/header/header-menu/header-menu.component';
// import {
//   DropdownMenusModule,
// } from '../partials';
import { ThemeModeModule } from '../partials/layout/theme-mode-switcher/theme-mode.module';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SidebarLogoComponent } from './components/sidebar/sidebar-logo/sidebar-logo.component';
import { SidebarMenuComponent } from './components/sidebar/sidebar-menu/sidebar-menu.component';
import { SidebarFooterComponent } from './components/sidebar/sidebar-footer/sidebar-footer.component';
import { NavbarComponent } from './components/header/navbar/navbar.component';
import { AccountingComponent } from './components/toolbar/accounting/accounting.component';
import { ClassicComponent } from './components/toolbar/classic/classic.component';
import { ExtendedComponent } from './components/toolbar/extended/extended.component';
import { ReportsComponent } from './components/toolbar/reports/reports.component';
import { SaasComponent } from './components/toolbar/saas/saas.component';
import { SharedModule } from '../shared/shared.module';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { ComponentShareModule } from '../../shared/components/component-share.module';
import { ApplicationSelectorComponent } from './components/topbar/application-selector/application-selector.component';
import {
    ApplicationSelectorListComponent,
} from './components/topbar/application-selector/application-selector-list.component';
import { WebsiteSelectorListComponent } from './components/topbar/website-selector/website-selector-list.component';
import { WebsiteSelectorComponent } from './components/topbar/website-selector/website-selector.component';
import { NzDropDownDirective, NzDropdownMenuComponent, NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuDirective } from 'ng-zorro-antd/menu';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: Routing,
    },
];

@NgModule({
    declarations: [
        LayoutComponent,
        AsideComponent,
        HeaderComponent,
        ContentComponent,
        FooterComponent,
        ScriptsInitComponent,
        ToolbarComponent,
        AsideMenuComponent,
        TopbarComponent,
        PageTitleComponent,
        HeaderMenuComponent,
        SidebarComponent,
        SidebarLogoComponent,
        SidebarMenuComponent,
        SidebarFooterComponent,
        NavbarComponent,
        AccountingComponent,
        ClassicComponent,
        ExtendedComponent,
        ReportsComponent,
        SaasComponent,
        ApplicationSelectorComponent,
        ApplicationSelectorListComponent,
        WebsiteSelectorListComponent,
        WebsiteSelectorComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        TranslationModule,
        InlineSVGModule,
        NgbDropdownModule,
        NgbProgressbarModule,
        ExtrasModule,
        //DropdownMenusModule,
        NgbTooltipModule,
        TranslateModule,
        ThemeModeModule,
        SharedModule,
        NzSpinModule,
        ComponentShareModule,
        NzDropDownModule
    ],
    exports: [RouterModule],
})
export class LayoutModule {
}
