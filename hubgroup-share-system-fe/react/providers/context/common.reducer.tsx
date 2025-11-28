import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { isNumber } from 'lodash';
import { UserInfoResponse } from '../../../types/account.type';
import {
    BaseResponse,
    KeyValueTypeStringModel,
} from '../../../types/common.type';
import { FederationAppInitProps } from '../../../types/federation.type';
import {
    CommonReducerState,
    LoadingActionSliceState,
} from '../../../types/redux.type';

const commonReducer = createSlice({
    name: 'commonReducer',
    initialState: {
        process: {
            listLoading: false,
            actionLoading: {
                get: false,
                post: false,
                put: false,
                delete: false,
            },
        },
        error: {
            messages: [],
            statusCode: null,
        },
        federationResolver: {},
        onShowDialogModalLarge: null,
        onShowDialogModalMedium: null,
        onShowDialogModalSmall: null,
        moduleConfig: {
            moduleName: null,
            prefixClass: null,
            appVersion: null,
        },
    } as CommonReducerState,
    reducers: {
        onStartCall(
            state,
            action: PayloadAction<{
                callType: 'list' | keyof LoadingActionSliceState;
            }>
        ) {
            const { callType } = action.payload;
            if (callType == 'list') {
                if (Object.keys(state.federationResolver).length > 0) {
                    state.federationResolver.setLoading();
                }
                state.process.listLoading = true;
            } else state.process.actionLoading[callType] = true;
            state.error.messages = [];
            state.error.statusCode = null;
        },
        onEndCall(
            state,
            action: PayloadAction<{
                callType: 'list' | keyof LoadingActionSliceState;
                errors?: BaseResponse & { message: string };
                callbackError?: Function;
            }>
        ) {
            const { callType, errors, callbackError } = action.payload;
            if (callType == 'list') {
                if (Object.keys(state.federationResolver).length > 0) {
                    state.federationResolver.unSetLoading();
                    state.process.listLoading = false;
                }
            } else state.process.actionLoading[callType] = false;
            if (errors) {
                if (errors?.message) state.error.messages.push(errors.message);
                if (
                    errors?.messages &&
                    Array.isArray(errors.messages) &&
                    errors.messages.length > 0
                ) {
                    state.error.messages = [
                        ...state.error.messages,
                        ...errors.messages,
                    ];
                }
            }
            // handle error update status to general FE and refetching callback
            const callback =
                callbackError && typeof callbackError == 'function'
                    ? callbackError
                    : null;
            if (Object.keys(state.federationResolver).length > 0) {
                if (
                    errors?.responseStatus &&
                    isNumber(errors?.responseStatus)
                ) {
                    state.federationResolver.updateResponseStatus(
                        errors.responseStatus,
                        callback
                    );
                } else if (errors?.status && isNumber(errors?.status)) {
                    state.federationResolver.updateResponseStatus(
                        errors?.status,
                        callback
                    );
                }
            }
        },
        onGetFederationResolver(
            state,
            action: PayloadAction<FederationAppInitProps>
        ) {
            state.federationResolver = action.payload;
        },
        setUserInfo(state, action: PayloadAction<UserInfoResponse>) {
            state.federationResolver.currentUser = action.payload;
        },
        setDealersHasPermission(
            state,
            action: PayloadAction<Array<KeyValueTypeStringModel>>
        ) {
            state.federationResolver.dealersHasPermission = action.payload;
        },
        onUpdateParams(state, action: PayloadAction<any>) {
            if (Object.keys(state.federationResolver).length > 0) {
                state.federationResolver.params = action.payload;
            }
        },
        initConfig(
            state,
            action: PayloadAction<
                Pick<
                    CommonReducerState,
                    | 'onShowDialogModalLarge'
                    | 'onShowDialogModalMedium'
                    | 'onShowDialogModalSmall'
                >
            >
        ) {
            const payload = action.payload;
            state.onShowDialogModalLarge = payload.onShowDialogModalLarge;
            state.onShowDialogModalMedium = payload.onShowDialogModalMedium;
            state.onShowDialogModalSmall = payload.onShowDialogModalSmall;
        },
        onInitModuleConfig(
            state,
            action: PayloadAction<CommonReducerState['moduleConfig']>
        ) {
            state.moduleConfig = action.payload;
        },
    },
});

export const commonActions = commonReducer.actions;
export default commonReducer.reducer;
