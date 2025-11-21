export const environment = {
    production: false,
    appVersion: 'staging',
    USERDATA_KEY: 'auth-staging',
    loginUrl: '',
    gtag: '',
    ssoUrl: 'https://account-staging.toyotavn.com.vn/api',
    apiUrl: 'https://platform-staging.toyotavn.com.vn',
    whiteListDomainListenMicroFrontendIframe: '',
    baseHref: '',
    origin: 'http://localhost:4401',

    SSOModuleUrl: 'https://platform-staging.toyotavn.com.vn/sso-fe',
    // FileManagerModuleUrl: 'http://localhost:4405',
    FileManagerModuleUrl: 'https://platform-staging.toyotavn.com.vn/file-manager-fe',

    multiple: [
        {
            websites: [''],
            apiRouter: 'api',
            apiUrl: 'https://platform-staging.toyotavn.com.vn',
            apiRmsUrl: 'http://192.168.204.16:31002/api',
            cdnDomain: '',
            apiCDNUrl: '',
            notifiesUrl: 'notifies',
            websiteName: 'News 1.0',
            embedDomain: '',

            cmsDataMenuVmsPrefixes: [],
            systemOption: 9,
            cmsDataMenuPosition: 30,
            cmsNewsMenuPosition: 1,
            previewDomain: '',
            formDisplayConfigs: null,
            logoUrl: 'https://tmss-standby.toyotavn.com.vn/assets/common/images/app-logo-on-dark.svg',
        },
    ],

};
