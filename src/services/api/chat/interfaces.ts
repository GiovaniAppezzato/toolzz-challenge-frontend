import { IMessage } from "@/interfaces/message";
import { IUser } from "@/interfaces/user";

export interface IGetUsersForConversationResponse {
  data: IUser[]
}

export interface IGetMessagesParams {
  user_id: string|number;
  search?: string|null;
  page?: number;
}

export interface IGetMessagesResponse {
  data: IMessage[];
  links: [
    first: string,
    last: string,
    prev: string|null,
    next: string|null
  ]
  meta: {
    current_page: number;
    last_page: number;
    from: number;
    per_page: number;
    to: number;
    total: number;
  }
}

export interface ISendMessageParams {
  receiver_id: string|number;
  content: string;
}

export interface ISendMessageResponse {
  data: IMessage;
}

export interface ISetMessagesAsReadParams {
  user_id: string|number;
}

