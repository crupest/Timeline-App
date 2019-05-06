import { UserCredentials, UserInfo } from '../entities';

export const kCreateTokenUrl = 'token/create';
export const kVerifyTokenUrl = 'token/verify';

export type CreateTokenRequest = UserCredentials;

export interface CreateTokenResponse {
  success: boolean;
  token?: string;
  userInfo?: UserInfo;
}

export interface VerifyTokenRequest {
  token: string;
}

export interface VerifyTokenResponse {
  isValid: boolean;
  userInfo?: UserInfo;
}
