import { AxiosResponse } from 'axios';
import axiosClient from './axios-instance';

const axiosInstance = axiosClient();
class CommonService {
    private LOCALE_RESOURCE_GETS: string =
        '/LocaleStringResource/GetByLanguage';

    onGetsLocaleResourcesByLanguage(request: any): Promise<AxiosResponse<any>> {
        return axiosInstance.get(this.LOCALE_RESOURCE_GETS, {
            params: request,
        });
    }
}

export default new CommonService();
