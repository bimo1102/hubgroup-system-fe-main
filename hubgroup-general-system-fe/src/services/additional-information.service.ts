import { AxiosResponse } from 'axios';

import { StatusEnum } from '@hubgroup-share-system-fe/enums/common.enum';
import axiosClient from '@hubgroup-share-system-fe/react/services/axios-instance';
import { BaseResponse, KeyValueTypeIntModel } from '@hubgroup-share-system-fe/types/common.type';
import {
    AdditionalInfomationChangeRequest,
    AdditionalInfomationDeleteRequest,
    AdditionalInfomationGetByIdRequest,
    AdditionalInfomationGetByTicketIdRequest,
    AdditionalInformationAddRequest,
    AdditionalInformationModel,
} from '@hubgroup-share-system-fe/types/ecare-ticket.type';

const axiosInstance = axiosClient();

class additionalInformationService {
    private ADDITIONAL_INFORMATION_GET_BY_TICKETID_URL: string = '/ECareTicket/GetAdditionalByTicketId';
    private ADDITIONAL_INFORMATION_ADD_URL: string = '/ECareTicket/InsertAdditional';
    private ADDITIONAL_INFORMATION_CHANGE_URL: string = '/ECareTicket/ChangeAdditional';
    private ADDITIONAL_INFORMATION_GET_URL: string = '/ECareTicket/GetAdditionalById';
    private ADDITIONAL_INFORMATION_DELETE_URL: string = '/ECareTicket/DeleteAdditional';
    async getByTicketId(request: AdditionalInfomationGetByTicketIdRequest): Promise<
        AxiosResponse<
            BaseResponse<{
                models: Array<AdditionalInformationModel>;
                statuses: Array<KeyValueTypeIntModel<StatusEnum>>;
            }>
        >
    > {
        return axiosInstance.post(this.ADDITIONAL_INFORMATION_GET_BY_TICKETID_URL, request);
    }

    async add(request: AdditionalInformationAddRequest): Promise<AxiosResponse<BaseResponse<string>>> {
        return axiosInstance.post(this.ADDITIONAL_INFORMATION_ADD_URL, request);
    }

    async change(request: AdditionalInfomationChangeRequest): Promise<AxiosResponse<BaseResponse<null>>> {
        return axiosInstance.post(this.ADDITIONAL_INFORMATION_CHANGE_URL, request);
    }

    async delete(request: AdditionalInfomationDeleteRequest): Promise<AxiosResponse<BaseResponse<null>>> {
        return axiosInstance.post(this.ADDITIONAL_INFORMATION_DELETE_URL, request);
    }

    async getById(request: AdditionalInfomationGetByIdRequest): Promise<
        AxiosResponse<
            BaseResponse<{
                models?: AdditionalInformationModel;
                statuses: Array<KeyValueTypeIntModel<StatusEnum>>;
            }>
        >
    > {
        return axiosInstance.post(this.ADDITIONAL_INFORMATION_GET_URL, request);
    }
}

export default new additionalInformationService();
