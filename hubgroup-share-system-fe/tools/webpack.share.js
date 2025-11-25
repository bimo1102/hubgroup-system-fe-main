export const CommonSharedLibrary = configs => {
    const eager = configs?.eager || false;
    return {
        '@angular/core': { singleton: true, eager: eager },
        '@angular/router': { singleton: true, eager: eager },
        '@angular/forms': {
            singleton: true,
            eager: eager,
            requiredVersion: '^18.1.0',
        },
        '@ngx-translate/core': { singleton: true, eager: eager },
        '@angular/common': {
            singleton: true,
            eager: eager,
            strictVersion: true,
            requiredVersion: '^18.1.0',
        },
        '@angular/common/http': { singleton: true, eager: eager },
        '@angular/material': { singleton: true, eager: eager },
        rxjs: {
            singleton: true,
            eager: eager,
            strictVersion: true,
            requiredVersion: '~7.8.0',
        },
        'ng-inline-svg-2': { singleton: true, eager: eager },
        // 'lodash': { singleton: true, eager: eager},
        'ng-zorro-antd/modal': { singleton: true, eager: eager },
        'ng-zorro-antd/image': { singleton: true, eager: eager },
        'ng-zorro-antd/icon': { singleton: true, eager: eager },
        'ng-zorro-antd/message': { singleton: true, eager: eager },
        'ng-zorro-antd/i18n': { singleton: true, eager: eager },
        '@monaco-editor/react': { singleton: true, eager: eager },
        // '@ant-design/icons-angular/icons': {
        //     singleton: true,
        //     eager: eager,
        //     strictVersion: true,
        //     requiredVersion: '',
        // },
        '@angular/cdk/': {
            singleton: true,
            eager: eager,
            strictVersion: false,
            requiredVersion: '',
        },
        // '@ng-bootstrap/ng-bootstrap': { singleton: true, eager: eager},
        // 'bootstrap': { singleton: true, eager: eager},
        // 'bootstrap-icons': { singleton: true, eager: eager},
        // '@microsoft/signalr': { singleton: true, eager: eager},
        'ag-grid-enterprise': { singleton: true, eager: eager },
        'ag-grid-community': { singleton: true, eager: eager },
        'ag-grid-angular': { singleton: true, eager: eager },
        'ag-grid-react': { singleton: true, eager: eager },
        // 'axios': { singleton: true, eager: eager},
        // 'ngx-image-cropper': { singleton: true, eager: eager},
        'nexussoft-angular-shared': { singleton: true, eager: eager },
        react: {
            singleton: true,
            eager: eager,
        },
        'react-dom/client': {
            singleton: true,
            eager: eager,
        },
        'react-redux': { singleton: true, eager: eager },
        redux: { singleton: true, eager: eager },
        '@reduxjs/toolkit': { singleton: true, eager: eager },
        i18next: { singleton: true, eager: eager },
        antd: { singleton: true, eager: eager },
        'react-i18next': { singleton: true, eager: eager },
        '@tinymce/tinymce-react': { singleton: true, eager: eager },

        // 'zone.js': {
        //     singleton: true,
        //     eager: eager
        // }
        // 'antd/': {
        //     singleton: true,
        //     eager: eager,
        // },
    };
};

export const CommonRules = {};
