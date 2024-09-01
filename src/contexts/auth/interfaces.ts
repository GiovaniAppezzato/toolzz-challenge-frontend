import { IUser } from "@/interfaces/user";

export interface IAuthContextData {
  isAuthenticated: boolean;
  accessToken: string;
  user: IUser;
  signIn(email: string, password: string): Promise<void>;
  signUp(name: string, email: string, password: string): Promise<void>;
  signOut(): Promise<void>;
  checkAuthentication(): Promise<void>;
}