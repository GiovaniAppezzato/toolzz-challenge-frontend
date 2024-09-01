import { IUser } from "@/interfaces/user";

export interface IMessage {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  created_at: string;
  sender?: IUser;
  receiver?: IUser;
}