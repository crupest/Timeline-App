export const kCreateTokenUrl = 'token/create';
export const kVerifyTokenUrl = 'token/verify';

export interface UserInfo {
  username: string;
  isAdmin: boolean;
}

export interface CreateTokenRequest {
  username: string;
  password: string;
}

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
