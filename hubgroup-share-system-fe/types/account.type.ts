import { BaseReadModel, KeyValueTypeStringModel } from "./common.type";
import {
  AccountStatusEnum,
  AccountTypeEnum,
  OtpTypeEnum,
} from "../enums/user.enum";
import { LoginTypeEnum } from "../enums/account.enum";
import { StatusEnum } from "../enums/common.enum";

export interface AccountChangeFromSettingsRequest {
  formId: string;
  displayColumns?: number[];
  displayProperties?: number[];
}

export interface UserInfoResponse {
  id: string;
  email: string;
  phoneNumber: string;
  fullName: string;
  isAdministrator: boolean;
  permissions?: Array<string>;
  dealer?: KeyValueTypeStringModel;
}

export interface AccountSettingFormDisplayConfigModel {
  formId: string;
  displayColumns?: number[];
  displayProperties?: number[];
}

export interface CompanyAndWebsiteModel extends KeyValueTypeStringModel {
  websites?: KeyValueTypeStringModel[];
}

export interface LoginRequest {
  userName?: string;
  password?: string;
  recaptcha?: string;
  rememberMe?: boolean;
  deviceInfo?: string;
  loginType: LoginTypeEnum;
  accountType: AccountTypeEnum;
}

export interface UserLoginResponse {
  id: string;
  otpType: OtpTypeEnum;
  sessionId: string;
  isNeedOtpVerify: boolean;
}

export interface UserLoginCompletedResponse extends UserLoginResponse {
  token: string;
  minuteExpire: number;
  refreshToken: string;
}

export interface ChangePasswordRequest {
  password?: string;
  newPassword?: string;
  confirmPassword?: string;
  recaptcha?: string;
  oTP?: string;
  oTPKey?: string;
}

export interface ChangePhoneNumberRequest {
  phoneNumber?: string;
  oTP?: string;
  recaptcha?: string;
  oTPKey?: string;
}

export interface SendOtpRequest {
  oTPKey?: string;
  isChangePhoneNumber?: boolean;
  phoneNumber?: string;
}

export interface AccountGetsByDepartmentIdsRequest {
  departmentId?: string;
  departmentIds?: string[];
  keyWord?: string;
  pageIndex: number;
  pageSize: number;
  status?: StatusEnum;
}

export interface AccountBaseReadModel extends BaseReadModel {
  numericalOrder: number;
  id: string;
  code?: string;
  createdUid: string;
  createdDate: string;
  createdDateUtc: string;
  updatedUid: string;
  updatedDate: string;
  updatedDateUtc: string;
  version: number;
  loginUid: string;
  totalRow: number;
  shardId: string;
}
