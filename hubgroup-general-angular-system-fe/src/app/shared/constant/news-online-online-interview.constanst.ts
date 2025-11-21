import { StatusEnum } from '../enums/common.enum';
import {
    ContentOnlineInterviewAnswerRequest,
    ContentOnlineInterviewGuestChangeRequest,
    ContentOnlineInterviewQuestionRequest,
} from '../types/news-online-online-interview.type';

export const guestDefault: ContentOnlineInterviewGuestChangeRequest = {
    articleId: '',
    fullName: '',
    title: '',
    avatarUrl: '',
};

export const answerDefault: ContentOnlineInterviewAnswerRequest = {
    id: '',
    status: StatusEnum.New,
    guestId: '',
    content: '',
};

export const questionAndAnswerDefault: ContentOnlineInterviewQuestionRequest = {
    commentId: '',
    content: '',
    id: '',
    status: StatusEnum.New,
    answers: [
        answerDefault,
    ],
};

