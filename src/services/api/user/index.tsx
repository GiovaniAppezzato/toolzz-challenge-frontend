import api from "..";
import { 
  IGetUsersResponse, 
  IGetUserResponse, 
  ICreateUserParams, 
  ICreateUserResponse,
  IUpdateUserParams,
  IUpdateUserResponse
} from "@/services/api/user/interfaces";
import { removeProp } from "@/utilities/utils";

export default class UserService {
  static async getUsers() {
    return api.get<IGetUsersResponse>("/users");
  }

  static async getUser(id: string) {
    return api.get<IGetUserResponse>(`/users/${id}`);
  }


  static async create(params: ICreateUserParams) {
    return api.post<ICreateUserResponse>("/users", params);
  }

  static async update(params: IUpdateUserParams) {
    const { id } = params;
    return api.put<IUpdateUserResponse>(`/users/${id}`, removeProp(params, "id"));
  }

  static async delete(id: string) {
    return api.delete(`/users/${id}`);
  }
}