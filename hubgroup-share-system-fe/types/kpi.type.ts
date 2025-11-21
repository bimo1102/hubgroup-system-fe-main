import { KeyValueTypeLongModel } from './common.type';
import { NewsDisplayTypeEnum, NewsOptionEnum } from '../enums/news.enum';

export interface BypassCheckViewKpiDefaultModel {
    websiteId?: string;
    categoryIds?: string[];
    sourceIds?: string[];
    displayTypes?: NewsDisplayTypeEnum[];
    newsOptions?: NewsOptionEnum[];
    newsOptionBypassReasons?: KeyValueTypeLongModel[];
}
