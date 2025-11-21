import { StatusEnum } from '@hubgroup-share-system-fe/enums/common.enum';
import { AddressTypeEnum } from '@hubgroup-share-system-fe/enums/dealer.enum';
import axiosInstance from '@hubgroup-share-system-fe/react/services/axios-instance';
import { AppointmentTypeGetsRequest } from '@hubgroup-share-system-fe/types/appointment-type.type';
import { BaseResponse, KeyValueTypeIntModel } from '@hubgroup-share-system-fe/types/common.type';
import { DealerModel } from '@hubgroup-share-system-fe/types/dealer.type';
import { AxiosResponse } from 'axios';

class DealerService {
    async gets(request: AppointmentTypeGetsRequest): Promise<
        AxiosResponse<
            BaseResponse<{
                totalRow: number;
                models: Array<DealerModel>;
                statuses: Array<KeyValueTypeIntModel<StatusEnum>>;
                addressTypeEnums: Array<KeyValueTypeIntModel<AddressTypeEnum>>;
            }>
        >
    > {
        return axiosInstance.post('/Dealer/Gets', request);
    }
}

export default new DealerService();
