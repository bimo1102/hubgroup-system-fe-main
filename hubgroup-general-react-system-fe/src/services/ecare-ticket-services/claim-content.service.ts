import { AxiosResponse } from 'axios';

import { StatusEnum } from '@hubgroup-share-system-fe/enums/common.enum';
import axiosClient from '@hubgroup-share-system-fe/react/services/axios-instance';
import { BaseResponse, KeyValueTypeIntModel } from '@hubgroup-share-system-fe/types/common.type';
import {
    ClaimContentAddRequest,
    ClaimContentChangeRequest,
    ClaimContentDeleteRequest,
    ClaimContentGetByIdRequest,
    ClaimContentGetByTicketIdRequest,
    ClaimContentModel,
} from '@hubgroup-share-system-fe/types/ecare-ticket.type';

const axiosInstance = axiosClient();

class claimContentService {
    private CLAIM_CONTENT_GET_BY_TICKETID_URL: string = '/ECareTicket/GetClaimContentByTicketId';
    private CLAIM_CONTENT_ADD_URL: string = '/ECareTicket/AddClaimContent';
    private CLAIM_CONTENT_CHANGE_URL: string = '/ECareTicket/ChangeClaimContent';
    private CLAIM_CONTENT_DELETE_URL: string = '/ECareTicket/DeleteClaimContent';
    private CLAIM_CONTENT_GET_URL: string = '/ECareTicket/GetClaimContentById';
    async getByTicketId(request: ClaimContentGetByTicketIdRequest): Promise<
        AxiosResponse<
            BaseResponse<{
                models: Array<ClaimContentModel>;
                statuses: Array<KeyValueTypeIntModel<StatusEnum>>;
            }>
        >
    > {
        return axiosInstance.post(this.CLAIM_CONTENT_GET_BY_TICKETID_URL, request);
    }

    async add(request: ClaimContentAddRequest): Promise<AxiosResponse<BaseResponse<string>>> {
        return axiosInstance.post(this.CLAIM_CONTENT_ADD_URL, request);
    }

    async change(request: ClaimContentChangeRequest): Promise<AxiosResponse<BaseResponse<null>>> {
        return axiosInstance.post(this.CLAIM_CONTENT_CHANGE_URL, request);
    }

    async delete(request: ClaimContentDeleteRequest): Promise<AxiosResponse<BaseResponse<null>>> {
        return axiosInstance.post(this.CLAIM_CONTENT_DELETE_URL, request);
    }

    async getById(request: ClaimContentGetByIdRequest): Promise<
        AxiosResponse<
            BaseResponse<{
                models?: ClaimContentModel;
                statuses: Array<KeyValueTypeIntModel<StatusEnum>>;
            }>
        >
    > {
        return axiosInstance.post(this.CLAIM_CONTENT_GET_URL, request);
    }
}

export default new claimContentService();
