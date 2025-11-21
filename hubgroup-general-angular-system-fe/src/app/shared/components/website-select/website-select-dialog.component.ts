import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { environment } from '../../../../environments/environment';
import { TytHttpClient } from '../../tyt-http-client.service';
import { CompanyAndWebsiteModel } from '@hubgroup-share-system-fe/types/account.type';
import { KeyValueTypeStringModel } from '@hubgroup-share-system-fe/types/common.type';
import { AngularEnvironmentService } from 'nexussoft-angular-shared';

@Component({
    selector: 'app-news-website-select-dialog',
    templateUrl: './website-select-dialog.component.html',
})
export class WebsiteSelectDialogComponent implements OnInit {
    serverWebsite: any = {};

    clientWebsiteName = '';

    companyId: string = '';
    companies: Array<CompanyAndWebsiteModel> = [];

    websites: any[] = [];
    websiteId: string = '';

    constructor(
        private authenticationService: AuthenticationService,
        private tytHttpClient: TytHttpClient,
        private angularEnvironmentService: AngularEnvironmentService
    ) {}

    async ngOnInit() {
        this.clientWebsiteName = this.angularEnvironmentService.environment.clientWebsiteName || '';
        await this.onGetUserInfo();
    }

    async onGetUserInfo() {
        let response = await this.tytHttpClient.post(environment.ssoUrl + '/account/info', {});
        if (response.status && response.data) {
            const dataResponse = response.data;
            this.companies = dataResponse.companies || [];
            this.serverWebsite = response.data.website || {};

            this.setWebsiteByCompany(dataResponse.company?.id, dataResponse.website);
        }
    }

    async onCompanyModelChange(companyId: string) {
        this.setWebsiteByCompany(companyId);
    }

    setWebsiteByCompany(companyId?: string, website?: KeyValueTypeStringModel) {
        const companyFound = this.companies.find((item) => item.id === companyId);
        this.companyId = companyFound ? companyFound.id : this.companies[0].id;
        this.websites = (companyFound ? companyFound.websites : this.companies[0].websites) || [];

        this.websiteId = website ? website.id : this.websites.length > 0 ? this.websites[0].id : '';
    }

    onWebsiteChange() {
        this.authenticationService
            .websiteSelected({ websiteId: this.websiteId })
            .then((response) => {
                if (response.status) {
                    location.reload();
                } else {
                    console.log(response.messages);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }
}
