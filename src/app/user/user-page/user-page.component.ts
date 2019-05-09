import { Component } from '@angular/core';

import { throwError, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { UserInfo } from '../entities';

import { UserService } from '../user-service/user.service';
import { ActivatedRoute, Router } from '@angular/router';

export interface UserDetails extends UserInfo {
  avatar: string;
  readonly isAdmin: boolean;
}

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent {

  constructor(private userService: UserService, private activatedRoute: ActivatedRoute, private router: Router) {
    userService.userInfo$.pipe(take(1)).subscribe(u => {
      if (u == null) {
        this.state = 'nologin';
      } else {
        activatedRoute.paramMap.pipe(switchMap(params => {
          const username = params.get('username');
          if (username == null) {
            return throwError(new Error('No username param in route.'));
          } else {
            return of(username);
          }
        }), switchMap(username => {
          this.username = username;
          if (u && u.username === username) {
            this.isSelf = true;
            return of(u);
          } else {
            return userService.getUserInfo(username);
          }
        })).subscribe(userInfo => {
          if (userInfo === null) {
            this.state = 'notexist';
          } else {
            this.user = {
              ...userInfo,
              avatar: this.userService.getAvartarUrl(userInfo.username),
              isAdmin: userInfo.roles.includes('admin')
            };
            this.state = 'ok';
          }
        });
      }
    });
  }

  state: 'loading' | 'nologin' | 'notexist' | 'ok' = 'loading';
  isSelf = false;
  username: string | undefined;
  user: UserDetails | undefined;

  logout() {
    this.userService.logout();
    this.router.navigate(['/']);
  }
}
