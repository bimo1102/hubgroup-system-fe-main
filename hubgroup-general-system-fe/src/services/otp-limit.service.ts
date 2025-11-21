import axiosClient from '@hubgroup-share-system-fe/react/services/axios-instance';
import { OtpLimitRequest, OtpLimitModel } from '@hubgroup-share-system-fe/types/otp-limit.type';
import { BaseResponse, KeyValueTypeIntModel } from '@hubgroup-share-system-fe/types/common.type';
import { AxiosResponse } from 'axios';
const axiosInstance = axiosClient();
class OTPLimitService {
    private OTP_LIMIT_GETS_URL: string = '/OtpLimit/GetOtpInfoByKeyword';

    async gets(request: OtpLimitRequest): Promise<
        AxiosResponse<
            BaseResponse<{
                totalRow: number;
                model: Array<OtpLimitModel>;
            }>
        >
    > {
        return axiosInstance.post(this.OTP_LIMIT_GETS_URL, request);
    }
}

export default new OTPLimitService();
