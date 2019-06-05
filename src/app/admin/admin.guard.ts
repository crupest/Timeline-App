import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { UserService } from '../user/user-service/user.service';
import { AuthGuard, AuthStrategy } from '../user/auth-guard/auth.guard';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard extends AuthGuard {
  public constructor(userService: UserService, private router: Router) {
    super(userService);
  }

  public readonly authStrategy: AuthStrategy = 'admin';

  public onAuthFailed(_next: ActivatedRouteSnapshot, _state: RouterStateSnapshot): void {
    this.router.navigate(['/','forbidden']);
  }
}
