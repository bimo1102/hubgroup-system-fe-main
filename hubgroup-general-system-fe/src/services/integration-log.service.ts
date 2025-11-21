import axiosClient from '@hubgroup-share-system-fe/react/services/axios-instance';
import { BaseResponse } from '@hubgroup-share-system-fe/types/common.type';
import { AxiosResponse } from 'axios';
import {
    GetFieldValueRequest,
    IntegrationLogByIdRequest,
    IntegrationLogModel,
    IntegrationLogRequest,
} from '@hubgroup-share-system-fe/types/integration-log.type';
const axiosInstance = axiosClient();
class IntegrationLogService {
    private INTEGRATION_LOG_GETS_URL: string = '/IntegrationLog/Search';
    private INTEGRATION_LOG_GET_BY_ID_URL: string = '/IntegrationLog/SearchById';
    private FIELD_VALUE_GET_URL: string = '/IntegrationLog/GetFieldVale';

    async gets(request: IntegrationLogRequest): Promise<
        AxiosResponse<
            BaseResponse<{
                totalRow: number;
                data: Array<IntegrationLogModel>;
            }>
        >
    > {
        return axiosInstance.post(this.INTEGRATION_LOG_GETS_URL, request);
    }

    async getById(request: IntegrationLogByIdRequest): Promise<
        AxiosResponse<
            BaseResponse<{
                data: IntegrationLogModel;
            }>
        >
    > {
        return axiosInstance.post(this.INTEGRATION_LOG_GET_BY_ID_URL, request);
    }

    async getFieldValue(request: GetFieldValueRequest): Promise<
        AxiosResponse<
            BaseResponse<{
                data: any;
            }>
        >
    > {
        return axiosInstance.post(this.FIELD_VALUE_GET_URL, request);
    }
}

export default new IntegrationLogService();
