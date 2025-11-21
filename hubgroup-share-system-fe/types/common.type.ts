export interface BaseResponse<T = unknown> {
  data: T;
  errorCode: number;
  messages: any[];
  serverTime: string;
  serverTimeUtc: string;
  status: boolean;
  version: number;
  responseStatus?: number;
}

export type ResultDialogConfirmType = {
  [key in "yes1" | "yes2"]: boolean;
};

export interface KeyValueTypeStringModel {
  value: string;
  id: string;
  text?: string;
  checked?: boolean;
  selected?: boolean;
  label?: string;
  ext?: any;
  ext2?: any;
}

export interface KeyValueTypeLongModel<T = number> {
  value: T;
  id: T;
  text?: string;
  checked: boolean;
}

export interface KeyValueTypeIntModel<T = number> {
  value: T;
  id: T;
  text: string;
  checked?: boolean;
  level?: number;
  label?: string;
  selected?: boolean;
  ext?: any;
  ext2?: any;
  ext3?: any;
}

export interface KeyValueTypeOptgroupModel {
  text?: string;
  children?: KeyValueTypeStringModel[];
}

export interface AvatarIconKeyValueTypeStringModel
  extends KeyValueTypeStringModel {
  url: string;
  avatarPosition: any; //IconConfigAvatarPositionEnum;
}

export interface AutoCompleteRequest {
  keyword: string;
  countryId?: string;
  sourceId?: string;
  websiteId?: string;
  sourceType?: any;
  currentId?: string;
}

export interface BasePagingRequest {
  pageIndex: number;
  pageSize: number;
}

export interface IDataPostMessage<
  TType = EventPostMessageType,
  TId = unknown,
  TData = any,
  TConfig = any
> {
  type: TType;
  idIframe: TId;
  dataPostMessage?: TData;
  configs?: TConfig;
}

export type IdIframeType =
  | "tyt-emagazine-editor"
  | "tyt-file-manager"
  | "tyt-wiki"
  | "tyt-collage"
  | "tyt-animation"
  | "tyt-chart-manager-editor"
  | "tyt-table-manager-editor"
  | "tyt-map-manager-editor";
export type EventPostMessageType =
  | "ssoIframeLoaded"
  | "iframeInitSuccess"
  | "senMessagePageToIframeAfterIframeInit"
  | "sendMessageIframeAfterLoginSucess"
  | "sendTokenAfterCallback";
export type SaveEventPostMessageType =
  | EventPostMessageType
  | "senMessageIframeToPageOnSave";
export type SelectEventPostMessageType =
  | EventPostMessageType
  | "senMessageIframeToPageOnSelect";

export interface IEnvironment {
  clientWebsiteId: string;
  apiRouter?: string;
  apiUrl?: string;
  apiRmsUrl?: string;
  apiCDNUrl?: string;
  cdnDomain?: string;
  notifiesUrl?: string;
  websiteName?: string;
  embedDomain?: string;
  systemOption?: number;
  cmsDataMenuPosition?: number;
  cmsDataMenuVmsPrefixes?: any;
  cmsNewsMenuPosition?: number;
  formDisplayConfigs?: any;
  previewDomain?: string;
  clientWebsiteName?: string;

  logoUrl?: string;
}

export type FilterFormSearchAdvanceFieldKeyType =
  | "keyword"
  | "publishDate"
  | "category"
  | "displayType"
  | "event"
  | "series"
  | "tag"
  | "author"
  | "subCategory"
  | "userNeed"
  | "wordCount";

export interface SystemBaseReadModel extends BaseReadModel {
  numericalOrder: number;
  id: string;
  code: string;
  createdUid: string;
  createdDate: string;
  createdDateUtc: string;
  updatedUid: string;
  updatedDate: string;
  updatedDateUtc: string;
  version: number;
  loginUid: string;
  totalRow: number;
  websiteId?: string;
}

export interface BaseReadModel {
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
}

export type ModelClientType<T> = T & {
  uuId: string;
};

export interface ObjectsGetByIdsRequest {
  ids: string[];
  websiteId?: string;
}

export interface BasePagingModel {
  totalRow: number;
  pageIndex: number;
  pageSize: number;
  offSet: number;
}

export enum SourceSettingEnum {
  PlanEspecially = 1,
  IsClone = 2,
}

export enum ActiveStatusEnum {
  New = 0,
  Approved = 1,
  Rejected = 2,
  Changed = 3,
  Cancel = -1,
}

export interface NewsBaseReadModel extends BaseReadModel {
  numericalOrder: number;
  id: string;
  code: string;
  createdUid: string;
  createdDate: string;
  createdDateUtc: string;
  updatedUid: string;
  updatedDate: string;
  updatedDateUtc: string;
  version: number;
  loginUid: string;
  totalRow: number;
  websiteId: string;
}

export interface ObjectGetByIdRequest {
  id: string;
  displayType?: any; //NewsDisplayTypeEnum;
  multiplePageContentId?: string;
  saveBeforeChangeStatus?: boolean;
  isCustomerAccountSystem?: boolean;
}

export interface TimePickerType {
  hour: number;
  minute: number;
  second: number;
}
export const safe = <T>(value: T | undefined | null, fallback: T) =>
  value ?? fallback;

export type Option = {
  label: string;
  value: string | number;
};
