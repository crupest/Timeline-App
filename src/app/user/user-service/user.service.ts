import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { catchError, switchMap, tap, filter, map } from 'rxjs/operators';

import { LoginInfo, UserDetails } from '../entities';
import {
  kCreateTokenUrl, kVerifyTokenUrl, CreateTokenRequest,
  CreateTokenResponse, VerifyTokenRequest, VerifyTokenResponse, UserInfo
} from './http-entities';

import { WINDOW, API_BASE_URL } from '../../inject-tokens';
import { BadCredentialsError, UnknownError, ServerLogicError } from './errors';


export const TOKEN_STORAGE_KEY = 'token';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  createTokenUrl: string;
  verifyTokenUrl: string;

  private token: string | null = null;
  private userSubject = new BehaviorSubject<UserDetails | null | undefined>(undefined);

  readonly user$: Observable<UserDetails | null> =
    this.userSubject.pipe(filter(value => value !== undefined)) as Observable<UserDetails | null>;

  get currentUserInfo(): UserDetails | null | undefined {
    return this.userSubject.value;
  }

  constructor(
    @Inject(WINDOW) private window: Window,
    @Inject(API_BASE_URL) private apiBaseUrl: string,
    private httpClient: HttpClient
  ) {
    this.createTokenUrl = apiBaseUrl + kCreateTokenUrl;
    this.verifyTokenUrl = apiBaseUrl + kVerifyTokenUrl;
  }

  private verifyToken(token: string): Observable<UserInfo | null> {
    return this.httpClient.post<VerifyTokenResponse>(this.verifyTokenUrl, <VerifyTokenRequest>{ token: token }).pipe(
      switchMap(result => {
        if (result.isValid) {
          const { userInfo } = result;
          if (userInfo) {
            return of(userInfo);
          } else {
            return throwError(new ServerLogicError('IsValid is true but UserInfo is null.'));
          }
        } else {
          return of(null);
        }
      }),
      tap({
        error: error => {
          console.error('Failed to verify token. Error is ', error);
        }
      }),
    );
  }

  private generateUserDetails(userInfo: UserInfo): UserDetails {
    const t = this;
    return <UserDetails>{
      username: userInfo.username,
      isAdmin: userInfo.roles.includes('admin'),
      get avatarUrl() {
        return t.generateAvartarUrl(this.username);
      }
    };
  }

  checkSavedLoginState() {
    const savedToken = this.window.localStorage.getItem(TOKEN_STORAGE_KEY);
    if (savedToken === null) {
      this.userSubject.next(null);
    } else {
      this.verifyToken(savedToken).subscribe({
        next: userInfo => {
          if (userInfo === null) {
            this.window.localStorage.removeItem(TOKEN_STORAGE_KEY);
            this.userSubject.next(null);
          } else {
            this.token = savedToken;
            this.userSubject.next(this.generateUserDetails(userInfo));
          }
        },
        error: _ => this.userSubject.next(null)
      });
    }
  }

  login(info: LoginInfo): Observable<UserDetails> {
    if (this.token) {
      throw new Error('Already login.');
    }

    return this.httpClient.post<CreateTokenResponse>(this.createTokenUrl, <CreateTokenRequest>info).pipe(
      catchError((error: HttpErrorResponse) => {
          console.error('An unknown error occurred when login. Error is ', error);
          return throwError(new UnknownError(error));
      }),
      switchMap(result => {
        if (result.success) {
          if (result.token && result.userInfo) {
            this.token = result.token;
            if (info.rememberMe) {
              this.window.localStorage.setItem(TOKEN_STORAGE_KEY, result.token);
            }
            const userDetails = this.generateUserDetails(result.userInfo);
            this.userSubject.next(userDetails);
            return of(userDetails);
          } else {
            const e = new ServerLogicError('Create token request succeeded but token or userInfo is null.');
            console.error(e);
            return throwError(e);
          }
        } else {
          const e = new BadCredentialsError();
          console.error(e);
          return throwError(e);
        }
      })
    );
  }

  logout() {
    if (this.currentUserInfo === null) {
      throw new Error('No login now. You can\'t logout.');
    }

    this.window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    this.token = null;
    this.userSubject.next(null);
  }

  generateAvartarUrl(username: string): string {
    if (this.currentUserInfo == null) {
      throw new Error('Not login.');
    }
    return `${this.apiBaseUrl}user/${username}/avatar?token=${this.token}`;
  }

  getUserDetails(username: string): Observable<UserDetails | null> {
    return this.httpClient.get<UserInfo>(`${this.apiBaseUrl}user/${username}?token=${this.token}`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return of(null);
        } else {
          return throwError(error);
        }
      }),
      map(result => {
        if (result === null) {
          return null;
        } else {
          return this.generateUserDetails(result);
        }
      })
    );
  }
}
