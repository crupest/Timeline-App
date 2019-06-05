import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';

import { API_BASE_URL } from 'src/app/inject-tokens';

import { UserInfo } from './entity';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserAdminService {
  public constructor(@Inject(API_BASE_URL) baseApiUrl: string, private httpClient: HttpClient) {}

  public getUserList(): Observable<UserInfo[]> {
    return of([
      {
        username: 'user1',
        isAdmin: true
      },
      {
        username: 'useruseruseruser2',
        isAdmin: false
      }
    ]).pipe(delay(2000));
  }

  public setUserAdmin(value: boolean): Observable<boolean> {
    return of(value).pipe(delay(2000));
  }
}
