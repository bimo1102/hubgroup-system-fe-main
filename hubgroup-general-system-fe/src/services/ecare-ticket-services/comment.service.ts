import { AxiosResponse } from 'axios';

import axiosClient from '@hubgroup-share-system-fe/react/services/axios-instance';
import { BaseResponse } from '@hubgroup-share-system-fe/types/common.type';
import {
    AddCommentRequest,
    CommentModel,
    CommentSummary,
    GetCommentByTicketIdRequest,
} from '@hubgroup-share-system-fe/types/ecare-ticket.type';

const axiosInstance = axiosClient();

class CommentService {
    private GET_COMMENT_BY_TICKETID_URL: string = '/ECareTicket/GetCommentByTicketId';
    private ADD_COMMENT_URL: string = '/ECareTicket/AddComment';
    async getByTicketId(request: GetCommentByTicketIdRequest): Promise<
        AxiosResponse<
            BaseResponse<{
                models: Array<CommentModel>;
                commentSummary: CommentSummary;
            }>
        >
    > {
        return axiosInstance.post(this.GET_COMMENT_BY_TICKETID_URL, request);
    }

    async add(request: AddCommentRequest): Promise<AxiosResponse<BaseResponse<string>>> {
        return axiosInstance.post(this.ADD_COMMENT_URL, request);
    }
}

export default new CommentService();
