import { Injectable } from '@angular/core';
import { TytHttpClient } from '../tyt-http-client.service';
import { BehaviorSubject } from 'rxjs';
import { isEmpty } from 'lodash';
import { TranslationService } from '../../modules/i18n';
import { LocaleService } from './locale.service';
import { LanguageModel } from '@hubgroup-share-system-fe/types/language.type';
import { LanguageTypeEnum } from '@hubgroup-share-system-fe/enums/language.enum';
import { BaseResponse } from '@hubgroup-share-system-fe/types/common.type';

@Injectable({ providedIn: 'root' })
export class LanguageService {
    constructor(
        private httpClient: TytHttpClient,
        private translationService: TranslationService,
        private localeService: LocaleService
    ) {}

    private languagesSubject = new BehaviorSubject<Array<LanguageModel>>([]);
    languages$ = this.languagesSubject.asObservable();

    languageSelected?: Partial<LanguageModel>;

    get languagesValue(): any {
        return this.languagesSubject.value;
    }

    set languagesValue(language: any) {
        this.languagesSubject.next(language);
    }

    display(languageType: LanguageTypeEnum): Promise<BaseResponse<Array<LanguageModel>>> {
        return this.httpClient.get(`/Language/Display?type=${languageType}`);
    }

    async initLanguage(moduleLocaleKey: string = 'vi') {
        if (this.languagesValue.length === 0 && isEmpty(this.languageSelected)) {
            await this.getLanguages(moduleLocaleKey);
        }
    }

    async getLanguages(moduleLocaleKey: string = 'vi') {
        // this.display().then(response => {
        // if (response.status) {
        // this.languages = response.data || [];
        // if (this.languages?.length > 0) {
        //     this.languages = this.languages.sort(function(a: any, b: any) {
        //         return a.displayOrder - b.displayOrder;
        //     });
        //     const isSetDefault = this.translationService.setDefaultLanguage(this.languages[0].uniqueSeoCode);
        //     if (isSetDefault) {
        //         this.languages[0].active = true;
        //         this.languageSelected = this.languages[0];
        //     } else {
        //         let selectedLanguage = this.translationService.getSelectedLanguage() || 'vn';
        //         for (let item of this.languages) {
        //             if (item.uniqueSeoCode == selectedLanguage) {
        //                 item.active = true;
        //                 this.languageSelected = item;
        //             }
        //         }
        //     }
        // }
        // }
        // });
        if (!this.languageSelected?.uniqueSeoCode) {
            this.languageSelected = { uniqueSeoCode: 'vi' };
        }
        this.languagesValue = [];
        await this.localeService.getLocale(
            this.languageSelected?.uniqueSeoCode || 'vi',
            moduleLocaleKey
        );
    }

    setLanguage(lang: string) {
        // this.languages.forEach((language: any) => {
        //     if (language.lang === lang) {
        //         language.active = true;
        //         this.languageSelected = language;
        //     } else {
        //         language.active = false;
        //     }
        // });
        // this.languagesValue = this.languages;
    }
}
