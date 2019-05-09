import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError, BehaviorSubject, of, concat} from 'rxjs';
import { catchError, switchMap, tap, filter, first, skip } from 'rxjs/operators';

import { UserCredentials, UserInfo } from '../entities';
import {
  kCreateTokenUrl, kVerifyTokenUrl, CreateTokenRequest,
  CreateTokenResponse, VerifyTokenRequest, VerifyTokenResponse
} from './http-entities';
import { WINDOW, API_BASE_URL } from '../../inject-tokens';
import { AlreadyLoginError, BadCredentialsError, BadNetworkError, UnknownError, ServerLogicError } from './errors';

export const TOKEN_STORAGE_KEY = 'token';

export interface LoginInfo extends UserCredentials {
  rememberMe: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  createTokenUrl: string;
  verifyTokenUrl: string;

  private token: string | null = null;
  private userInfoSubject = new BehaviorSubject<UserInfo | null | undefined>(undefined);

  readonly userInfo$: Observable<UserInfo | null> =
    this.userInfoSubject.pipe(filter(value => value !== undefined)) as Observable<UserInfo | null>;

  private afterFirstCheck$: Observable<any> = this.userInfo$.pipe(first(), skip(1));

  get currentUserInfo(): UserInfo | null | undefined {
    return this.userInfoSubject.value;
  }

  constructor(
    @Inject(WINDOW) private window: Window,
    @Inject(API_BASE_URL) private api_base_url: string,
    private httpClient: HttpClient
  ) {
    this.createTokenUrl = api_base_url + kCreateTokenUrl;
    this.verifyTokenUrl = api_base_url + kVerifyTokenUrl;

    const savedToken = this.window.localStorage.getItem(TOKEN_STORAGE_KEY);
    if (savedToken === null) {
      this.userInfoSubject.next(null);
    } else {
      this.verifyToken(savedToken).subscribe(result => {
        if (result === null) {
          this.window.localStorage.removeItem(TOKEN_STORAGE_KEY);
          this.userInfoSubject.next(null);
        } else {
          this.token = savedToken;
          this.userInfoSubject.next(result);
        }
      }, _ => {
        this.userInfoSubject.next(null);
      });
    }
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
          console.error('Failed to verify token.');
          console.error(error);
        }
      }),
    );
  }

  login(info: LoginInfo): Observable<UserInfo> {
    if (this.token) {
      return throwError(new AlreadyLoginError());
    }

    return this.httpClient.post<CreateTokenResponse>(this.createTokenUrl, <CreateTokenRequest>info).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof ErrorEvent) {
          console.error('An error occurred when login: ' + error.error.message);
          return throwError(new BadNetworkError());
        } else {
          console.error('An unknown error occurred when login: ' + error);
          return throwError(new UnknownError(error));
        }
      }),
      switchMap(result => {
        if (result.success) {
          if (result.token && result.userInfo) {
            this.token = result.token;
            if (info.rememberMe) {
              this.window.localStorage.setItem(TOKEN_STORAGE_KEY, result.token);
            }
            this.userInfoSubject.next(result.userInfo);
            return of(result.userInfo);
          } else {
            console.error('An error occurred when login: server return wrong data.');
            return throwError(new ServerLogicError('Token or userInfo is null.'));
          }
        } else {
          console.error('An error occurred when login: wrong credentials.');
          return throwError(new BadCredentialsError());
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
    this.userInfoSubject.next(null);
  }

  // return avartar url
  getAvartar(username: string): string {
    if (this.currentUserInfo == null) {
      throw new Error('Not login.');
    }
    return `${this.api_base_url}user/${username}/avatar?token=${this.token}`;
  }

  getUserInfo(username: string): Observable<UserInfo | null> {
    return this.httpClient.get<UserInfo>(`${this.api_base_url}user/${username}?token=${this.token}`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return of(null);
        } else {
          return throwError(error);
        }
      })
    );
  }

  firstCheck<T>(real: Observable<T>): Observable<T> {
    return concat((this.afterFirstCheck$ as Observable<T>), real);
  }
}
