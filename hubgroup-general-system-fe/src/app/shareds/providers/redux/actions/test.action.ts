import { mergeLoadingActions } from '@hubgroup-share-system-fe/react/providers/context/common.action';
import { KeyValueTypeIntModel } from '@hubgroup-share-system-fe/types/common.type';
import { Dispatch } from 'GeneralApplication/store';
import additionalInformationService from 'src/services/auth.service';

export const additionalInformationGetById = (request: any) => async (dispatch: Dispatch) => {
    return mergeLoadingActions<{
        models?: any;
        statuses: Array<KeyValueTypeIntModel<any>>;
    }>({
        callType: 'additionalInformationDetail',
        dispatchRef: dispatch,
        callback: async () => {
            return await additionalInformationService.getByTicketId(request);
        },
    });
};
