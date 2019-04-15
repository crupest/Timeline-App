import { UserCredentials, UserInfo } from '../entities';

export const kCreateTokenUrl = 'User/CreateToken';
export const kVerifyTokenUrl = 'User/VerifyToken';

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
