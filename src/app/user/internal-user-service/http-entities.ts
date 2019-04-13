import { UserCredentials, UserInfo } from '../entities';

export const kCreateTokenUrl = 'User/CreateToken';
export const kValidateTokenUrl = 'User/ValidateToken';

export type CreateTokenRequest = UserCredentials;

export interface CreateTokenResponse {
  success: boolean;
  token?: string;
  userInfo?: UserInfo;
}

export interface ValidateTokenRequest {
  token: string;
}

export interface ValidateTokenResponse {
  isValid: boolean;
  userInfo?: UserInfo;
}
