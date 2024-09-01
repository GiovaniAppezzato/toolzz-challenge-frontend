import { IUser } from "@/interfaces/user";

export interface IGetUsersResponse {
  data: IUser[]
}

export interface IGetUserResponse {
  data: IUser
}

export interface ICreateUserParams {
  name: string;
  email: string;
  password: string;
  photo?: string|null;
}

export interface ICreateUserResponse {
  data: IUser
}

export interface IUpdateUserParams {
  id: string|number;
  name: string;
  email: string;
  password?: string|null;
  photo?: string|null;
}

export interface IUpdateUserResponse {
  data: IUser
}