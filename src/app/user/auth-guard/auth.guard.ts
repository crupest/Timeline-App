import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

import { UserService } from '../user-service/user.service';

export type AuthStrategy = 'all' | 'requirelogin' | 'requirenologin' | string[];

export abstract class AuthGuard implements CanActivate {

  constructor(protected userService: UserService) { }

  onAuthFailed() { }

  abstract get authStrategy(): AuthStrategy;

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const { authStrategy } = this;

    if (authStrategy === 'all') {
      return true;
    }

    return this.userService.userInfo$.pipe(take(1), map(userInfo => {
      if (userInfo === null) {
        if (authStrategy === 'requirenologin') {
          return true;
        }
      } else {
        if (authStrategy === 'requirelogin') {
          return true;
        } else if (authStrategy instanceof Array) {
          const { roles } = userInfo;
          if (authStrategy.every(value => roles.includes(value))) {
            return true;
          }
        }
      }

      // reach here means auth fails
      this.onAuthFailed();
      return false;
    }));
  }
}

@Injectable({
  providedIn: 'root'
})
export class RequireLoginGuard extends AuthGuard {
  readonly authStrategy: AuthStrategy = 'requirelogin';

  // never remove this constructor or you will get an injection error.
  constructor(userService: UserService) {
    super(userService);
  }
}

@Injectable({
  providedIn: 'root'
})
export class RequireNoLoginGuard extends AuthGuard {
  readonly authStrategy: AuthStrategy = 'requirenologin';

  // never remove this constructor or you will get an injection error.
  constructor(userService: UserService) {
    super(userService);
  }
}