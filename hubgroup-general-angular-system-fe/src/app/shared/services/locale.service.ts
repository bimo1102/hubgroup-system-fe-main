import { Injectable } from '@angular/core';
import { TytHttpClient } from '../tyt-http-client.service';
import { Locale, TranslationService } from '../../modules/i18n';
import { AngularSharedService } from 'nexussoft-angular-shared';
import { LocaleModuleEnum } from '@hubgroup-share-system-fe/enums/common.enum';

@Injectable({ providedIn: 'root' })
export class LocaleService {
    constructor(
        private httpClient: TytHttpClient,
        private angularSharedService: AngularSharedService,
        private translationService: TranslationService
    ) {}

    isInitLocale: boolean = false;

    getByLanguage(lang: string, module: LocaleModuleEnum = LocaleModuleEnum.NewsModule) {
        return this.httpClient.get(
            `/LocaleStringResource/GetByLanguage?lang=${lang}&module=${module}`
        );
    }

    async getLocale(uniqueSeoCode: string, moduleLocaleKey: string) {
        if (uniqueSeoCode?.length > 0) {
            let response: Locale = await this.getByLanguage(uniqueSeoCode);
            this.angularSharedService.locales[moduleLocaleKey] = response;
            this.setLocale(uniqueSeoCode, response);
        }
    }

    setLocale(uniqueSeoCode: string, locale: Locale) {
        this.translationService.setLanguage(uniqueSeoCode);
        this.translationService.loadTranslations(locale);
        this.isInitLocale = true;
    }
}
