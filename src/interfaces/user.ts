import { IFile } from "./common";
import { IMessage } from "./message";

export interface IUser {
  id: number;
  name: string;
  email: string;
  photo?: IFile;
  created_at: string;
  updated_at: string;
  unread_messages_count?: number;
  last_message?: string;
}