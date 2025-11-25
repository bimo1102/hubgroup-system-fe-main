import { AxiosError, AxiosResponse } from 'axios';
import { commonActions } from './common.reducer';
import { BaseResponse } from '../../../types/common.type';
import { LoadingActionSliceState } from '../../../types/redux.type';
import { Dispatch } from '@reduxjs/toolkit';
import commonService from '../../services/common.service';

export const mergeLoadingActions = async <T = unknown>({
    callType,
    callback,
    dispatchRef,
    isLoading = true,
    refetchCallback,
}: {
    callType?: 'list' | keyof LoadingActionSliceState;
    callback: () => Promise<AxiosResponse<BaseResponse<T>, any>>;
    dispatchRef: any;
    isLoading?: boolean;
    refetchCallback?: () => void;
}) => {
    try {
        if (isLoading) dispatchRef(commonActions.onStartCall({ callType }));
        const response = await callback();
        if (isLoading) {
            dispatchRef(
                commonActions.onEndCall({
                    callType,
                    callbackError: callback,
                    errors:
                        response?.data?.status == false
                            ? response?.data
                            : (null as any),
                })
            );
        }
        if (response instanceof AxiosError) {
            dispatchRef(commonActions.onEndCall({
                callType,
                errors: response as any,
                callbackError: refetchCallback
            }));
        }
        return response;
    } catch (error) {
        dispatchRef(
            commonActions.onEndCall({
                callType,
                errors: (error?.data?.responseStatus || error?.data?.responseStatus === 0) ? error.data : error,
                callbackError: refetchCallback
            })
        );
        return error;
    }
};

export const onGetsLocaleResourcesByLanguage =
    (request: any) => (dispatch: Dispatch) => {
        return mergeLoadingActions({
            callType: 'get',
            async callback() {
                const response =
                    await commonService.onGetsLocaleResourcesByLanguage(
                        request
                    );
                return response;
            },
            dispatchRef: dispatch,
            isLoading: true,
        });
    };
