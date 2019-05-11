export interface LoginInfo  {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface UserDetails {
  readonly username: string;
  readonly avatarUrl: string;
  readonly isAdmin: boolean;
}
