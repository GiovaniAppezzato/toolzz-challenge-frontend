import { IUser } from "@/interfaces/user";

export interface ISignInParams {
  email: string;
  password: string;
}

export interface ISignInResponse {
  data: {
    access_token: string;
    user: IUser;
  }
}

export interface IGetMyDataResponse {
  data: IUser
}

export interface ISignUpParams {
  name: string;
  email: string;
  password: string;
}

export interface ISignUpResponse {
  data: {
    access_token: string;
    user: IUser;
  }
}