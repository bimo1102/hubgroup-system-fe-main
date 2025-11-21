import { AppointmentTypeOptionEnum } from '@hubgroup-share-system-fe/enums/appointment-type.enum';
import { StatusEnum } from '@hubgroup-share-system-fe/enums/common.enum';
import axiosInstance from '@hubgroup-share-system-fe/react/services/axios-instance';
import {
    AppointmentTypeAddRequest,
    AppointmentTypeChangeRequest,
    AppointmentTypeGetByIdRequest,
    AppointmentTypeGetsRequest,
    AppointmentTypeModel,
    DealerAppointmentTypeMappingAddOrChangeRequest,
} from '@hubgroup-share-system-fe/types/appointment-type.type';
import { BaseResponse, KeyValueTypeIntModel } from '@hubgroup-share-system-fe/types/common.type';
import { AxiosResponse } from 'axios';

class AppointmentTypeService {
    private APPOINTMENT_TYPE_GETS_URL: string = '/AppointmentType/Gets';
    private APPOINTMENT_TYPE_ADD_URL: string = '/AppointmentType/Add';
    private APPOINTMENT_TYPE_CHANGE_URL: string = '/AppointmentType/Change';
    private APPOINTMENT_TYPE_GET_URL: string = '/AppointmentType/GetById';

    async gets(request: AppointmentTypeGetsRequest): Promise<
        AxiosResponse<
            BaseResponse<{
                totalRow: number;
                models: Array<AppointmentTypeModel>;
                statuses: Array<KeyValueTypeIntModel<StatusEnum>>;
                appointmentTypeOptionEnums: Array<KeyValueTypeIntModel<AppointmentTypeOptionEnum>>;
            }>
        >
    > {
        return axiosInstance.post(this.APPOINTMENT_TYPE_GETS_URL, request);
    }

    async add(request: AppointmentTypeAddRequest): Promise<AxiosResponse<BaseResponse<string>>> {
        return axiosInstance.post(this.APPOINTMENT_TYPE_ADD_URL, request);
    }

    async change(request: AppointmentTypeChangeRequest): Promise<AxiosResponse<BaseResponse<null>>> {
        return axiosInstance.post(this.APPOINTMENT_TYPE_CHANGE_URL, request);
    }

    async getById(request: AppointmentTypeGetByIdRequest): Promise<
        AxiosResponse<
            BaseResponse<{
                models?: AppointmentTypeModel;
                statuses: Array<KeyValueTypeIntModel<StatusEnum>>;
                appointmentTypeOptionEnums: Array<KeyValueTypeIntModel<AppointmentTypeOptionEnum>>;
            }>
        >
    > {
        return axiosInstance.post(this.APPOINTMENT_TYPE_GET_URL, request);
    }

    dealerAppointmentTypeMappingAddOrChange(
        request: DealerAppointmentTypeMappingAddOrChangeRequest
    ): Promise<AxiosResponse<BaseResponse<null>>> {
        return axiosInstance.post('/AppointmentType/DealerAppointmentTypeMappingAddOrChange', request);
    }
}

export default new AppointmentTypeService();
