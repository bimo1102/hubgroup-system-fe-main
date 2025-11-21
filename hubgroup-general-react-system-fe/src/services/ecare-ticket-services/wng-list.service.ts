import { AxiosResponse } from 'axios';

import axiosClient from '@hubgroup-share-system-fe/react/services/axios-instance';
import { BaseResponse } from '@hubgroup-share-system-fe/types/common.type';
import {
    DeleteWngListRequest,
    GetWngByIdRequest,
    GetWngListByTicketIdRequest,
    GetWngListHistoryRequest,
    GetWngListMasterRequest,
    WngChangeRequest,
    WngHistoryModel,
    WngListAddRequest,
    WngMasterModel,
    WngModel,
} from '@hubgroup-share-system-fe/types/ecare-ticket.type';

const axiosInstance = axiosClient();

class wngListService {
    private WNG_LIST_GET_BY_TICKETID_URL: string = '/ECareTicket/GetWngListByTicketId';
    private WNG_LIST_ADD_URL: string = '/ECareTicket/AddWng';
    private WNG_LIST_CHANGE_URL: string = '/ECareTicket/ChangeWng';
    private WNG_LIST_DELETE_URL: string = '/ECareTicket/DeleteWng';
    private WNG_LIST_GET_URL: string = '/ECareTicket/GetWngListById';
    private WNG_LIST_HISTORY_GET_URL: string = '/ECareTicket/GetWngListHistory';
    private WNG_LIST_MASTER_GET_URL: string = '/ECareTicket/GetWngListMaster';
    async getByTicketId(request: GetWngListByTicketIdRequest): Promise<
        AxiosResponse<
            BaseResponse<{
                models: Array<WngModel>;
            }>
        >
    > {
        return axiosInstance.post(this.WNG_LIST_GET_BY_TICKETID_URL, request);
    }

    async getListWngHistory(request: GetWngListHistoryRequest): Promise<
        AxiosResponse<
            BaseResponse<{
                models: Array<WngHistoryModel>;
                totalRow: number;
            }>
        >
    > {
        return axiosInstance.post(this.WNG_LIST_HISTORY_GET_URL, request);
    }

    async getListWngMaster(request: GetWngListMasterRequest): Promise<
        AxiosResponse<
            BaseResponse<{
                models: Array<WngMasterModel>;
                totalRow: number;
            }>
        >
    > {
        return axiosInstance.post(this.WNG_LIST_MASTER_GET_URL, request);
    }

    async getById(request: GetWngByIdRequest): Promise<
        AxiosResponse<
            BaseResponse<{
                models?: WngModel;
            }>
        >
    > {
        return axiosInstance.post(this.WNG_LIST_GET_URL, request);
    }

    async add(request: WngListAddRequest): Promise<AxiosResponse<BaseResponse<string>>> {
        return axiosInstance.post(this.WNG_LIST_ADD_URL, request);
    }

    async change(request: WngChangeRequest): Promise<AxiosResponse<BaseResponse<null>>> {
        return axiosInstance.post(this.WNG_LIST_CHANGE_URL, request);
    }

    async delete(request: DeleteWngListRequest): Promise<AxiosResponse<BaseResponse<null>>> {
        return axiosInstance.post(this.WNG_LIST_DELETE_URL, request);
    }
}

export default new wngListService();
