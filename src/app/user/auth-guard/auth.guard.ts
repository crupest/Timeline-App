import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take, map, tap } from 'rxjs/operators';

import { UserService } from '../user-service/user.service';

export type AuthStrategy = 'all' | 'nologin' | 'user' | 'admin';

export abstract class AuthGuard implements CanActivate {

  protected constructor(protected userService: UserService) { }

  public onAuthFailed(_next: ActivatedRouteSnapshot, _state: RouterStateSnapshot): void { }

  public abstract get authStrategy(): AuthStrategy;

  public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const { authStrategy } = this;

    if (authStrategy === 'all') {
      return true;
    }

    return this.userService.user$.pipe(take(1), map(userDetails => {
      if (authStrategy === 'nologin' && userDetails === null) {
        return true;
      } else if (authStrategy === 'user' && userDetails !== null) {
        return true;
      } else if (authStrategy === 'admin' && userDetails !== null && userDetails.isAdmin) {
        return true;
      } else {
        return false;
      }
    }), tap(result => {
      if (!result) {
        this.onAuthFailed(next, state);
      }
    }));
  }
}

@Injectable({
  providedIn: 'root'
})
export class RequireLoginGuard extends AuthGuard {
  public readonly authStrategy: AuthStrategy = 'user';

  // never remove this constructor or you will get an injection error.
  public constructor(userService: UserService, private router: Router) {
    super(userService);
  }

  public onAuthFailed(_next: ActivatedRouteSnapshot, state: RouterStateSnapshot): void {
    this.router.navigate(['login'], {
      queryParams: {
        'from': state.url
      }
    });
  }
}

@Injectable({
  providedIn: 'root'
})
export class RequireNoLoginGuard extends AuthGuard {
  public readonly authStrategy: AuthStrategy = 'nologin';

  // never remove this constructor or you will get an injection error.
  public constructor(userService: UserService) {
    super(userService);
  }
}
