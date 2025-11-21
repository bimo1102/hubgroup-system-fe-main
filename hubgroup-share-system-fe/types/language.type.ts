import {StatusEnum} from "../enums/common.enum";
import {LanguageTypeEnum} from "../enums/language.enum";

export interface LanguageModel {
    id: string;
    name: string;
    culture: string;
    uniqueSeoCode: string;
    flagImageFileName: string;
    rtl: number;
    limitedToStores: number;
    defaultCurrencyId: string;
    status: StatusEnum;
    displayOrder: number;
    type: LanguageTypeEnum;
    createdDate: string;
    dateFormat: string;
    numberFormat: string;
    typeName: string;
    statusName: string;
    imageUrl?: string;
    isDefault?: boolean;
}