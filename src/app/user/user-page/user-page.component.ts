import { Component } from '@angular/core';

import { throwError, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { UserInfo } from '../entities';

import { UserService } from '../user-service/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent {

  constructor(private userService: UserService, private activatedRoute: ActivatedRoute) {
    userService.firstCheck(() => {
      return activatedRoute.paramMap.pipe(switchMap(params => {
        const username = params.get('username');
        if (username == null) {
          return throwError(new Error('No username param in route.'));
        } else {
          return of(username);
        }
      }), tap(username => this.username = username), switchMap(username => {
        const currentUserInfo = userService.currentUserInfo;
        if (currentUserInfo && currentUserInfo.username === username) {
          return of(currentUserInfo);
        } else {
          return userService.getUserInfo(username);
        }
      }));
    }).subscribe(userInfo => this.userInfo = userInfo);
  }

  username: string | undefined;
  userInfo: UserInfo | null | undefined;
}
