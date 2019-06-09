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
        username: "itsanadmin",
        isAdmin: true
      },
      {
        username: 'itsauser',
        isAdmin: false
      },
      {
        username: 'anotheruser',
        isAdmin: false
      }
    ]).pipe(delay(1000));
  }

  private debug(message: string): void {
    console.debug('UserAdminService a request is made : ' + message);
  }

  // Set a user's permission.
  public setUserAdmin(username: string, isAdmin: boolean): Observable<boolean> {
    this.debug(`Set user ${username} as ${isAdmin ? 'ADMIN' : 'USER'}.`);
    return of(isAdmin).pipe(delay(2000));
  }

  public changeUserPassword(username: string, password: string): Observable<boolean> {
    this.debug(`Change user ${username} 's password to ${password}.`);
    return of(true).pipe(delay(2000));
  }

  // Delete a user.
  public deleteUser(username: string): Observable<boolean> {
    this.debug(`Delete user ${username}.`);
    return of(true).pipe(delay(2000));
  }
}
