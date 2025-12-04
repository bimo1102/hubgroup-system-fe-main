import StatusResponseEnum from '../enums/status-response.enum';
import { DataObservableTypeEnum } from '../enums/federation.enum';
import { UserInfoResponse } from './account.type';
import { SignalStatusEnum } from '../enums/signal-message.enum';
import { SignalMessageResponse } from './signal-message.type';
import { ThemeTypeConfigEnum } from '../enums/themes.enum';
import { KeyValueTypeStringModel } from '../types/common.type';

export type FederationAppInitProps = {
    disableGlobalStylesInReactMFE?: boolean;
    currentUser?: UserInfoResponse;
    dealersHasPermission?: Array<KeyValueTypeStringModel>;
    currentLanguageSelected?: string;
    localeResources?: Record<string, string>;
    moduleLocaleKey?: string;
    currentTheme?: ThemeTypeConfigEnum;
    updateLocale?: (
        moduleLocaleKey: string,
        locale: Record<string, string>
    ) => void;
    navigate?: (
        commands: string[],
        extras?: {
            queryParams?: { [p: string]: any };
            queryParamsHandling?: any;
            replaceUrl?: boolean;
            fragment?: string;
        }
    ) => Promise<boolean>;
    updateResponseStatus?: (
        status: StatusResponseEnum,
        callBackFunc?: Function
    ) => void;
    setLoading: (isMultipleProcess?: boolean) => void;
    unSetLoading: () => void;
    data$: any;
    queryParams: any;
    params: any;
    responsive: {
        isDesktop: boolean;
        isXXl: boolean;
        isXl: boolean;
        isLg: boolean;
        isMobile: boolean;
    };
    setUpParams: <T extends object>(
        request: T,
        keyInclude: Array<keyof T>,
        keyConvert?: {
            convertToNumber?: Array<Partial<keyof T>>;
            convertToArrayNumber?: Array<Partial<keyof T>>;
            convertToArray?: Array<Partial<keyof T>>;
            convertToBoolean?: Array<Partial<keyof T>>;
            convertRevertToBoolean?: Array<Partial<keyof T>>;
        }
    ) => { [key in keyof T]: T[key] };

    signalR: {
        status: SignalStatusEnum;
        onConnectSubscribe$: any;

        onProcess: (
            method: string,
            uniqueKey: string,
            func: (data: SignalMessageResponse) => void
        ) => void;
        onEndProcess: (key: string) => void;

        onJoinToGroup: (key: string) => Promise<void>;
        onLeaveFromGroup: (key: string) => Promise<void>;

        onSend: (method: string, message: string) => Promise<void>;
    };
    basename: string;
};

export type FederationDataObservableType = {
    type: DataObservableTypeEnum;
    data: any;
};
