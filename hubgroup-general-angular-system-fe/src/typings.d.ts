declare global {
    interface Window {
        ReceptionModuleUrl: string;
        NewsModuleUrl: string;

        [key: string]: string;
    }

    module 'FileManagerModule/*' {
        export class FileManagerModule {
        }
    }
    module 'SSOModule/*';
    module 'React_remote/*';
}

export {};
