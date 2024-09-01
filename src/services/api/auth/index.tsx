import api from "@/services/api";
import { ISignInParams, ISignInResponse, IGetMyDataResponse, ISignUpParams, ISignUpResponse } from "@/services/api/auth/interfaces";

export default class AuthService {
  static async signIn(params: ISignInParams) {
    return api.post<ISignInResponse>("/sign-in", params);
  }
  static async signUp(params: ISignUpParams) {
    return api.post<ISignUpResponse>("/sign-up", params);
  }

  static async signOut() {
    return api.delete("/sign-out");
  }

  static async getMyData(accessToken: string) { 
    return api.get<IGetMyDataResponse>("/show-me", { headers: { Authorization: `Bearer ${accessToken}` } });
  }
}