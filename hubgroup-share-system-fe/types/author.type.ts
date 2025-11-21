import { AuthorPositionEnum } from '../enums/author.enum';

export interface AuthorRequest {
    userId?: string;
    authorType?: AuthorPositionEnum;
    isDisplayAsAuthor: boolean;
}
