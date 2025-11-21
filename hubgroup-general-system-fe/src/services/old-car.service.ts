import axiosClient from '@hubgroup-share-system-fe/react/services/axios-instance';
import { BaseResponse } from '@hubgroup-share-system-fe/types/common.type';
import {
    GetCarTypeRequest,
    GetAttributeResponseType,
    GetCarTypeResponse,
    GetModelByCarResponseType,
    GetModelByCarTypeRequest,
    OldCarGetsResponseType,
    OldCarGetsRequestType,
    GetAttributeByModelRequest,
    IGetAttributeByModelResponse,
    IAddOrChangeRequestType,
} from '@hubgroup-share-system-fe/types/old-car.type';
import { AxiosInstance, AxiosResponse } from 'axios';

class OldCarService {
    private HttpClient: AxiosInstance = axiosClient(process.env.BASE_URL);
    private GetCarTypeUrl: string = '/pmsapi/UsedCar/CarBodyTypeGet';
    private GetModelByCarTypeUrl: string = '/pmsapi/UsedCar/ProductAutoComplete';
    private GetAttributeByModelUrl: string = '/pmsapi/UsedCar/AttributeSelect';
    private OldCarGetsUrl: string = '/api/UsedCar/Gets';
    private OldCarGetUrl: string = '/api/UsedCar/Get';
    private OldCarDeleteUrl: string = '/api/UsedCar/Delete';
    private OldCarAddOrChangeUrl: string = '/api/UsedCar/AddOrChange';

    public GetCarType(request: GetCarTypeRequest): Promise<AxiosResponse<BaseResponse<GetCarTypeResponse>>> {
        return this.HttpClient.post<BaseResponse<GetCarTypeResponse>>(this.GetCarTypeUrl, request);
    }
    public GetModelByCarType(
        request: GetModelByCarTypeRequest
    ): Promise<AxiosResponse<BaseResponse<Array<GetModelByCarResponseType>>>> {
        return this.HttpClient.post<BaseResponse<Array<GetModelByCarResponseType>>>(this.GetModelByCarTypeUrl, request);
    }
    public GetAttributeByModel(
        request: GetAttributeByModelRequest
    ): Promise<AxiosResponse<BaseResponse<IGetAttributeByModelResponse[]>>> {
        return this.HttpClient.post<BaseResponse<IGetAttributeByModelResponse[]>>(this.GetAttributeByModelUrl, request);
    }
    public OldCarGets(request: OldCarGetsRequestType): Promise<AxiosResponse<BaseResponse<OldCarGetsResponseType>>> {
        return this.HttpClient.post<BaseResponse<OldCarGetsResponseType>>(this.OldCarGetsUrl, request);
    }
    public OldCarGet(request: { Id: string }): Promise<AxiosResponse<BaseResponse<OldCarGetsResponseType>>> {
        return this.HttpClient.post<BaseResponse<OldCarGetsResponseType>>(this.OldCarGetUrl, request);
    }
    public AddOrChange(request: IAddOrChangeRequestType): Promise<AxiosResponse<BaseResponse>> {
        return this.HttpClient.post<BaseResponse>(this.OldCarAddOrChangeUrl, request);
    }
    public OldCarDelete(request: { Id: string }): Promise<AxiosResponse<BaseResponse>> {
        return this.HttpClient.post<BaseResponse>(this.OldCarDeleteUrl, request);
    }
}

export default new OldCarService();
