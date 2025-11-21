import { MessageInstance } from 'antd/lib/message/interface';
import { AxiosResponse } from 'axios';
import React, { createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseResponse } from '../../../types/common.type';
import { FederationAppInitProps } from '../../../types/federation.type';

type Props = {
    children: React.ReactNode;
    messages: MessageInstance;
};

type MasterLayoutContextProps = {
    onShowMessageError: (message: string) => void;
    onShowMessageSuccess: (message: string) => void;
    onShowMessageWarning: (message: string) => void;
    getMessageByResponse: (response: AxiosResponse<BaseResponse<any>>) => {
        message: string;
        status: boolean;
    };
    navigate: FederationAppInitProps['navigate'];
    setUpParams: FederationAppInitProps['setUpParams'];
    signalR: FederationAppInitProps['signalR'];
};

const initMasterLayoutContextPropsState: MasterLayoutContextProps = {
    onShowMessageError: () => {
    },
    onShowMessageSuccess: () => {
    },
    onShowMessageWarning: () => {
    },
    getMessageByResponse: () => ({ message: '', status: true }),
    navigate: () => {
        return new Promise<boolean>((resolve) => {
            resolve(false);
        });
    },
    setUpParams: ({ }, []) => ({} as any),
    signalR: {} as any
};

const MasterLayoutContext = createContext<MasterLayoutContextProps>(
    initMasterLayoutContextPropsState
);

const useMasterLayout = () => {
    return useContext(MasterLayoutContext);
};

const MasterLayout: React.FC<Props & FederationAppInitProps> = ({
    messages,
    children,
    navigate,
    setUpParams,
    signalR
}): React.ReactNode => {
    const { t } = useTranslation();
    const getMessageByResponse = (
        response: AxiosResponse<BaseResponse<any>>
    ) => {
        const messageString =
            response?.data?.messages?.map(message => t(message)).join(', ') ||
            '';
        return {
            message: messageString,
            status: !!response?.data?.status
        };
    };

    const onShowMessageWarning = (message: string) => {
        messages.warning(message);
    };

    const onShowMessageError = (message: string) => {
        messages.error(message);
    };

    const onShowMessageSuccess = (message: string) => {
        messages.success(message);
    };

    return (
        <MasterLayoutContext.Provider
            value={{
                onShowMessageSuccess,
                onShowMessageError,
                getMessageByResponse,
                onShowMessageWarning,
                navigate,
                setUpParams,
                signalR
            }}>
            {children}
        </MasterLayoutContext.Provider>
    );
};

export { MasterLayout, useMasterLayout };
