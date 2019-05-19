import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { catchError, switchMap, filter, map } from 'rxjs/operators';

import { LoginInfo, UserDetails } from '../entities';
import {
  kCreateTokenUrl, kVerifyTokenUrl, CreateTokenRequest,
  CreateTokenResponse, VerifyTokenRequest, VerifyTokenResponse, UserInfo
} from './http-entities';

import { WINDOW, API_BASE_URL } from '../../inject-tokens';
import { BadCredentialsError, BadServerResponseError, AlreadyLoginError, NoLoginError } from './errors';


export const TOKEN_STORAGE_KEY = 'token';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private createTokenUrl: string;
  private verifyTokenUrl: string;

  private token: string | null = null;
  private userSubject = new BehaviorSubject<UserDetails | null | undefined>(undefined);

  public readonly user$: Observable<UserDetails | null> =
    this.userSubject.pipe(filter(value => value !== undefined)) as Observable<UserDetails | null>;

  public get currentUser(): UserDetails | null | undefined {
    return this.userSubject.value;
  }

  public constructor(
    @Inject(WINDOW) private window: Window,
    @Inject(API_BASE_URL) private apiBaseUrl: string,
    private httpClient: HttpClient
  ) {
    this.createTokenUrl = apiBaseUrl + kCreateTokenUrl;
    this.verifyTokenUrl = apiBaseUrl + kVerifyTokenUrl;
  }

  private checkLogin(): void {
    if (this.token === null) {
      throw new NoLoginError();
    }
  }

  private verifyToken(token: string): Observable<UserInfo | null> {
    return this.httpClient.post<VerifyTokenResponse>(
      this.verifyTokenUrl,
      <VerifyTokenRequest>{ token: token }
    ).pipe(switchMap(result => {
      if (result.isValid) {
        const { userInfo } = result;
        if (userInfo) {
          return of(userInfo);
        } else {
          return throwError(new BadServerResponseError('IsValid is true but UserInfo is null.'));
        }
      } else {
        return of(null);
      }
    }));
  }

  private generateUserDetails(userInfo: UserInfo): UserDetails {
    const t = this;
    return {
      username: userInfo.username,
      isAdmin: userInfo.isAdmin,
      get avatarUrl() {
        return t.generateAvartarUrl(this.username);
      }
    };
  }

  public checkSavedLoginState(): void {
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
        error: e => {
          this.userSubject.next(null);
          console.error(e);
        }
      });
    }
  }

  public login(info: LoginInfo): Observable<UserDetails> {
    if (this.token) {
      throw new AlreadyLoginError();
    }

    return this.httpClient.post<CreateTokenResponse>(
      this.createTokenUrl,
      <CreateTokenRequest>info
    ).pipe(switchMap(result => {
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
          return throwError(new BadServerResponseError(
            'Create token request succeeded but token or userInfo is null.'));
        }
      } else {
        return throwError(new BadCredentialsError());
      }
    }));
  }

  public logout(): void {
    this.checkLogin();
    this.window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    this.token = null;
    this.userSubject.next(null);
  }

  public generateAvartarUrl(username: string): string {
    this.checkLogin();
    return `${this.apiBaseUrl}user/${username}/avatar?token=${this.token}`;
  }

  public getUserDetails(username: string): Observable<UserDetails | null> {
    this.checkLogin();
    return this.httpClient.get<UserInfo>(
      `${this.apiBaseUrl}user/${username}?token=${this.token}`
    ).pipe(
      map(result => this.generateUserDetails(result)),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return of(null);
        } else {
          return throwError(error);
        }
      })
    );
  }
}
