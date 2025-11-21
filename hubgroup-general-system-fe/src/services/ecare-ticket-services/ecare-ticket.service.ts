import { AxiosResponse } from 'axios';

import { StatusEnum } from '@hubgroup-share-system-fe/enums/common.enum';
import { ECareSearchByPhoneOrPlateOrVinEnum } from '@hubgroup-share-system-fe/enums/ecare-ticket.enum';
import axiosClient from '@hubgroup-share-system-fe/react/services/axios-instance';
import { BaseResponse, KeyValueTypeIntModel } from '@hubgroup-share-system-fe/types/common.type';
import {
    ConfigByCodeRequest,
    ConfigByParentIdRequest,
    ConfigItem,
    CustomerType,
    Dealer,
    DealerRequest,
    EcareTicketAddRequest,
    EcareTicketChangeRequest,
    EcareTicketDeleteRequest,
    EcareTicketDetailModel,
    EcareTicketGetByIdRequest,
    EcareTicketGetsRequest,
    EcareTicketListModel,
    EcateTicketSyncToEs,
    GetContractServiceModel,
    GetContractServiceRequest,
    GetCsExpiredDateByVinRequest,
    GetCsExpiredDateByVinResponse,
    GetEngineStatusByVinRequest,
    GetEngineStatusByVinResponse,
    GetJudgeByVinRequest,
    GetNotiECallRequest,
    GetSimStatusModel,
    GetSimStatusRequest,
    GetSQVehicleByIdResponse,
    GetTicketsFromEsToMerg,
    MassTicketRequest,
    MergeTicketRequest,
    PartWngListModel,
    SearchByPhoneOrCarPlateModel,
    StartOrStopEngineRequest,
    StolenTrackingModel,
    StolenTrackingRequest,
    Summary,
    User,
    Vehicle,
} from '@hubgroup-share-system-fe/types/ecare-ticket.type';

const axiosInstance = axiosClient();

class EcareTicketService {
    private ECARE_TICKET_GETS_URL: string = '/ECareTicket/GetTicketsFromEs';
    private ECARE_TICKET_GETS_ECARE_URL: string = '/ECareTicket/GetTicketsFromEsEcare';
    private ECARE_TICKET_GETS_ECALL_URL: string = '/ECareTicket/GetTicketsFromEsEcall';
    private ECARE_TICKET_GETS_TMV_URL: string = '/ECareTicket/GetTicketsFromEsTmv';
    private ECARE_TICKET_SYNC_TICKET_TO_ES_URL: string = '/ECareTicket/SyncTicketToEs';
    private ECARE_TICKET_ADD_URL: string = '/ECareTicket/AddTicket';
    private ECARE_TICKET_CHANGE_URL: string = '/ECareTicket/ChangeTicket';
    private ECARE_TICKET_DELETE_URL: string = '/ECareTicket/DeleteTicket';
    private ECARE_TICKET_GET_URL: string = '/ECareTicket/GetById';
    private ECARE_TICKET_GET_CONFIG_URL: string = '/ECareTicket/GetConfigByGroupCode';
    private ECARE_TICKET_GET_USER_URL: string = '/ECareTicket/GetUser';
    private ECARE_TICKET_GET_CUSTOMER_TYPE_URL: string = '/ECareTicket/GetMSVCustomerType';
    private ECARE_TICKET_GET_DEALER_URL: string = '/ECareTicket/GetDealer';
    private ECARE_TICKET_GET_BY_PHONE_OR_CAR_PLATE_OR_VIN_URL: string = '/ECareTicket/SearchByPhoneOrPlateOrVin';
    private ECARE_TICKET_GET_SQ_VEHICLE_BY_ID_URL: string = '/ECareTicket/GetSQVehicleById';
    private ECARE_TICKET_GET_SQ_VEHICLE_BY_CUSTOMER_ID_URL: string = '/ECareTicket/GetSQVehicleByCustId';
    private ECARE_MERGE_TICKET_URL: string = '/ECareTicket/MergeTicket';
    private ECARE_MASS_TICKET_URL: string = '/ECareTicket/MassTicket';
    private ECARE_TICKET_GET_CONFIG_BY_PARENT_ID_URL: string = '/ECareTicket/GetConfigByParentId';
    private ECARE_TICKET_STOLEN_TRACKING_URL: string = '/ECareTicket/StartOrStopStolenTracking';
    private ECARE_TICKET_GET_SIM_STATUS_URL: string = '/ECareTicket/GetSimStatus';
    private ECARE_TICKET_GET_CONTRACT_SERVICE_URL: string = '/ECareTicket/GetContractService';
    private ECARE_TICKET_START_OR_STOP_ENGINE_URL: string = '/ECareTicket/StopOrCancelEngine';
    private ECARE_TICKET_GET_JUDGE_BY_VIN_URL: string = '/ECareTicket/GetJudgeByVin';
    private ECARE_TICKET_GET_NOTI_ECALL_URL: string = '/ECareTicket/GetNotiECall';
    private ECARE_TICKET_GETS_TICKET_FROM_ES_TO_MERGE: string = '/ECareTicket/GetTicketsFromEsToMerg';
    private ECARE_TICKET_GET_CS_EXPRIRED_DATE_BY_VIN: string = '/ECareTicket/GetCsExpiredDateByVin';
    private ECARE_TICKET_GET_VEHICLE_POSITION: string = '/ECareTicket/GetVehiclePosition';
    private ECARE_TICKET_GET_ENGINE_STATUS_BY_VIN: string = '/ECareTicket/GetEngineStatusByVin';

    async gets(request: EcareTicketGetsRequest): Promise<
        AxiosResponse<
            BaseResponse<{
                totalRow: number;
                models: Array<EcareTicketListModel>;
                statuses: Array<KeyValueTypeIntModel<StatusEnum>>;
                summary: Summary;
            }>
        >
    > {
        return axiosInstance.post(this.ECARE_TICKET_GETS_URL, request);
    }
    async getsEcare(request: EcareTicketGetsRequest): Promise<
        AxiosResponse<
            BaseResponse<{
                totalRow: number;
                models: Array<EcareTicketListModel>;
                statuses: Array<KeyValueTypeIntModel<StatusEnum>>;
                summary: Summary;
            }>
        >
    > {
        return axiosInstance.post(this.ECARE_TICKET_GETS_ECARE_URL, request);
    }
    async getsEcall(request: EcareTicketGetsRequest): Promise<
        AxiosResponse<
            BaseResponse<{
                totalRow: number;
                models: Array<EcareTicketListModel>;
                statuses: Array<KeyValueTypeIntModel<StatusEnum>>;
                summary: Summary;
            }>
        >
    > {
        return axiosInstance.post(this.ECARE_TICKET_GETS_ECALL_URL, request);
    }
    async getsTmv(request: EcareTicketGetsRequest): Promise<
        AxiosResponse<
            BaseResponse<{
                totalRow: number;
                models: Array<EcareTicketListModel>;
                statuses: Array<KeyValueTypeIntModel<StatusEnum>>;
                summary: Summary;
            }>
        >
    > {
        return axiosInstance.post(this.ECARE_TICKET_GETS_TMV_URL, request);
    }
    async getsTicketToMerge(request: GetTicketsFromEsToMerg): Promise<
        AxiosResponse<
            BaseResponse<{
                totalRow: number;
                models: Array<EcareTicketListModel>;
                statuses: Array<KeyValueTypeIntModel<StatusEnum>>;
                summary: Summary;
            }>
        >
    > {
        return axiosInstance.post(this.ECARE_TICKET_GETS_TICKET_FROM_ES_TO_MERGE, request);
    }
    async syncTicketToEs(request: EcateTicketSyncToEs): Promise<AxiosResponse<BaseResponse<null>>> {
        return axiosInstance.post(this.ECARE_TICKET_SYNC_TICKET_TO_ES_URL, request);
    }
    async add(request: EcareTicketAddRequest): Promise<AxiosResponse<BaseResponse<string>>> {
        return axiosInstance.post(this.ECARE_TICKET_ADD_URL, request);
    }
    async change(request: EcareTicketChangeRequest): Promise<AxiosResponse<BaseResponse<null>>> {
        return axiosInstance.post(this.ECARE_TICKET_CHANGE_URL, request);
    }
    async delete(request: EcareTicketDeleteRequest): Promise<AxiosResponse<BaseResponse<null>>> {
        return axiosInstance.post(this.ECARE_TICKET_DELETE_URL, request);
    }
    async getById(request: EcareTicketGetByIdRequest): Promise<
        AxiosResponse<
            BaseResponse<{
                model?: EcareTicketDetailModel;
                statuses: Array<KeyValueTypeIntModel<StatusEnum>>;
            }>
        >
    > {
        return axiosInstance.post(this.ECARE_TICKET_GET_URL, request);
    }
    async getConfigByCode(request: ConfigByCodeRequest): Promise<
        AxiosResponse<
            BaseResponse<{
                models: ConfigItem[];
                statuses: Array<KeyValueTypeIntModel<StatusEnum>>;
            }>
        >
    > {
        return axiosInstance.post(this.ECARE_TICKET_GET_CONFIG_URL, request);
    }
    async getConfigByParentIdCode(request: ConfigByParentIdRequest): Promise<
        AxiosResponse<
            BaseResponse<{
                model: ConfigItem[];
                statuses: Array<KeyValueTypeIntModel<StatusEnum>>;
            }>
        >
    > {
        return axiosInstance.post(this.ECARE_TICKET_GET_CONFIG_BY_PARENT_ID_URL, request);
    }
    async getUser(request: { DepartmentId: string }): Promise<
        AxiosResponse<
            BaseResponse<{
                models: User[];
                statuses: Array<KeyValueTypeIntModel<StatusEnum>>;
            }>
        >
    > {
        return axiosInstance.post(this.ECARE_TICKET_GET_USER_URL, request);
    }
    async getMSVCustomerType(): Promise<
        AxiosResponse<
            BaseResponse<{
                model: CustomerType[];
                statuses: Array<KeyValueTypeIntModel<StatusEnum>>;
            }>
        >
    > {
        return axiosInstance.get(this.ECARE_TICKET_GET_CUSTOMER_TYPE_URL);
    }
    async getDealer(request: DealerRequest): Promise<
        AxiosResponse<
            BaseResponse<{
                models: Dealer[];
                totalRow: number;
                statuses: Array<KeyValueTypeIntModel<StatusEnum>>;
            }>
        >
    > {
        return axiosInstance.post(this.ECARE_TICKET_GET_DEALER_URL, request);
    }
    async searchByPhoneOrCarPlateOrVin(request: { keyword: string; type: ECareSearchByPhoneOrPlateOrVinEnum }): Promise<
        AxiosResponse<
            BaseResponse<{
                data: SearchByPhoneOrCarPlateModel;
                statuses: Array<KeyValueTypeIntModel<StatusEnum>>;
            }>
        >
    > {
        return axiosInstance.post(this.ECARE_TICKET_GET_BY_PHONE_OR_CAR_PLATE_OR_VIN_URL, request);
    }
    async getSQVehicleByCustId(request: { id: number }): Promise<
        AxiosResponse<
            BaseResponse<{
                models: Vehicle[];
                statuses: Array<KeyValueTypeIntModel<StatusEnum>>;
            }>
        >
    > {
        return axiosInstance.post(this.ECARE_TICKET_GET_SQ_VEHICLE_BY_CUSTOMER_ID_URL, request);
    }
    async getSQVehicleById(request: { id: number }): Promise<
        AxiosResponse<
            BaseResponse<{
                data: GetSQVehicleByIdResponse;
                statuses: Array<KeyValueTypeIntModel<StatusEnum>>;
            }>
        >
    > {
        return axiosInstance.post(this.ECARE_TICKET_GET_SQ_VEHICLE_BY_ID_URL, request);
    }
    async mergeTicket(request: MergeTicketRequest): Promise<AxiosResponse<BaseResponse<null>>> {
        return axiosInstance.post(this.ECARE_MERGE_TICKET_URL, request);
    }
    async massTicket(request: MassTicketRequest): Promise<AxiosResponse<BaseResponse<null>>> {
        return axiosInstance.post(this.ECARE_MASS_TICKET_URL, request);
    }
    async stolenTracking(request: StolenTrackingRequest): Promise<
        AxiosResponse<
            BaseResponse<{
                model: StolenTrackingModel;
            }>
        >
    > {
        return axiosInstance.post(this.ECARE_TICKET_STOLEN_TRACKING_URL, request);
    }
    async getVehiclePosition(request: { vIN: string }): Promise<
        AxiosResponse<
            BaseResponse<{
                model: StolenTrackingModel;
            }>
        >
    > {
        return axiosInstance.post(this.ECARE_TICKET_GET_VEHICLE_POSITION, request);
    }
    async getSimStatus(
        request: GetSimStatusRequest
    ): Promise<AxiosResponse<BaseResponse<{ model: GetSimStatusModel }>>> {
        return axiosInstance.post(this.ECARE_TICKET_GET_SIM_STATUS_URL, request);
    }
    async getContractService(
        request: GetContractServiceRequest
    ): Promise<AxiosResponse<BaseResponse<{ model: GetContractServiceModel }>>> {
        return axiosInstance.post(this.ECARE_TICKET_GET_CONTRACT_SERVICE_URL, request);
    }
    async startOrStopEngine(request: StartOrStopEngineRequest): Promise<AxiosResponse<BaseResponse<null>>> {
        return axiosInstance.post(this.ECARE_TICKET_START_OR_STOP_ENGINE_URL, request);
    }
    async getJudgeByVin(
        request: GetJudgeByVinRequest
    ): Promise<AxiosResponse<BaseResponse<{ models: Array<PartWngListModel> }>>> {
        return axiosInstance.post(this.ECARE_TICKET_GET_JUDGE_BY_VIN_URL, request);
    }
    async getNotiECall(request: GetNotiECallRequest): Promise<AxiosResponse<BaseResponse<{ model: string }>>> {
        return axiosInstance.post(this.ECARE_TICKET_GET_NOTI_ECALL_URL, request);
    }
    async getCsExpiredDateByVin(
        request: GetCsExpiredDateByVinRequest
    ): Promise<AxiosResponse<BaseResponse<{ data: GetCsExpiredDateByVinResponse }>>> {
        return axiosInstance.post(this.ECARE_TICKET_GET_CS_EXPRIRED_DATE_BY_VIN, request);
    }
    async GetEngineStatusByVin(
        request: GetEngineStatusByVinRequest
    ): Promise<AxiosResponse<BaseResponse<{ model: GetEngineStatusByVinResponse }>>> {
        return axiosInstance.post(this.ECARE_TICKET_GET_ENGINE_STATUS_BY_VIN, request);
    }
}

export default new EcareTicketService();
