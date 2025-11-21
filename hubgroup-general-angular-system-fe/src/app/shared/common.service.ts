import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
    AuthReloadEnum,
    LocaleModuleEnum,
    UserBehaviorStatusEnum,
} from '@hubgroup-share-system-fe/enums/common.enum';
import { LanguageService } from './services/language.service';
import { AngularSharedService } from 'nexussoft-angular-shared';
import { LocaleService } from './services/locale.service';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class CommonService {
    reloadStatus$: Observable<AuthReloadEnum>;
    reloadStatusSubject: BehaviorSubject<AuthReloadEnum>;

    urlRedirectApplicationExist: string = '/dashboard';

    isSkeletonSubject$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    userBehaviorStatusSubject$ = new BehaviorSubject<UserBehaviorStatusEnum>(
        UserBehaviorStatusEnum.Active
    );

    get currentSkeleton(): boolean {
        return this.isSkeletonSubject$.value;
    }

    set currentSkeleton(value: boolean) {
        if (value !== this.currentSkeleton) {
            this.isSkeletonSubject$.next(value);
        }
    }

    get currentReloadValue(): number {
        return this.reloadStatusSubject.value;
    }

    set currentReloadValue(value: number) {
        if (value != this.currentReloadValue) {
            this.reloadStatusSubject.next(value);
        }
    }

    get userBehaviorStatus() {
        return this.userBehaviorStatusSubject$.value;
    }

    set userBehaviorStatus(status) {
        this.userBehaviorStatusSubject$.next(status);
    }

    constructor(
        private languageService: LanguageService,
        private localeService: LocaleService,
        private angularSharedService: AngularSharedService
    ) {
        this.reloadStatusSubject = new BehaviorSubject<number>(0);
        this.reloadStatus$ = this.reloadStatusSubject.asObservable();
    }

    async handleLocale() {
        const moduleLanguageKey =
            (LocaleModuleEnum[environment.localeModule] || environment.localeModule) +
            this.angularSharedService.languageSelected.value;

        const locale = this.angularSharedService.locales[moduleLanguageKey];
        if (locale && !this.localeService.isInitLocale) {
            // this.localeService.setLocale(this.angularSharedService.languageSelected.value, locale);
        } else {
            await this.languageService.initLanguage(moduleLanguageKey);
        }
    }
}
