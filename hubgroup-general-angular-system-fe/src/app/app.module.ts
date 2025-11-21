import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClipboardModule } from 'ngx-clipboard';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './modules/auth';
import { CommonService } from './shared/common.service';
import { NZ_DATE_LOCALE, NZ_I18N, vi_VN } from 'ng-zorro-antd/i18n';
import { NZ_ICONS, NzIconModule } from 'ng-zorro-antd/icon';
import * as AllIcons from '@ant-design/icons-angular/icons';
import { IconDefinition } from '@ant-design/icons-angular';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { LoginDialogComponent } from './shared/components/login/login-dialog.component';
import { OtpDialogComponent } from './shared/components/otp/otp-dialog.component';
import { ComponentShareModule } from './shared/components/component-share.module';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { AuthGuard } from './modules/auth/services/auth.guard';
import { CustomFormatPipe } from './shared/pipe/custom-format.pipe';
import { vi as viDate } from 'date-fns/locale';
import { provideHttpClient } from '@angular/common/http';

const antDesignIcons = AllIcons as {
    [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key]);
registerLocaleData(en);

function appInitializer(authService: AuthService) {
    return async () => {
        await authService.getUserByToken();
    };
}

@NgModule({
    declarations: [AppComponent,
        LoginDialogComponent,
        OtpDialogComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
        ClipboardModule,
        AppRoutingModule,
        InlineSVGModule.forRoot(),
        NzIconModule.forChild(icons),
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        NzSpinModule,
        NzModalModule,
        NzMessageModule,
        NzFormModule,
        NzRadioModule,
        NzAlertModule,
        NzInputModule,
        NzButtonModule,
        NzSelectModule,
        NzTagModule,
        ComponentShareModule,
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializer,
            multi: true,
            deps: [AuthService],
        },
        { provide: NZ_I18N, useValue: vi_VN },
        { provide: NZ_ICONS, useValue: icons },
        { provide: NZ_DATE_LOCALE, useValue: viDate },
        provideHttpClient(),
        AuthGuard,
        CommonService,
        CustomFormatPipe,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
}
