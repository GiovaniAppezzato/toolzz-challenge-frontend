import api from "..";
import { 
  IGetUsersForConversationResponse,
  IGetMessagesParams,
  IGetMessagesResponse,
  ISendMessageParams,
  ISendMessageResponse,
  ISetMessagesAsReadParams
} from "@/services/api/chat/interfaces";
import { createQueryParams } from "@/utilities/utils";

export default class ChatService {
  static async getUsersForConversation() {
    return api.get<IGetUsersForConversationResponse>("/get-users-for-conversation");
  }

  static async getMessages(params: IGetMessagesParams) {
    return api.get<IGetMessagesResponse>(`/get-messages?${createQueryParams({...params })}`);
  }

  static async sendMessage(params: ISendMessageParams) {
    return api.post<ISendMessageResponse>(`/send-message`, params);
  }

  static async setMessagesAsRead(params: ISetMessagesAsReadParams) {
    return api.post(`/read-messages`, params);
  }
}