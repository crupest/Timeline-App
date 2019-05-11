import { Component } from '@angular/core';

import { throwError, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { UserDetails } from '../entities';
import { UserService } from '../user-service/user.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent {

  constructor(private userService: UserService, activatedRoute: ActivatedRoute, private router: Router) {
    userService.user$.pipe(take(1)).subscribe(u => {
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
            return userService.getUserDetails(username);
          }
        })).subscribe(user => {
          if (user === null) {
            this.state = 'notexist';
          } else {
            this.user = user;
            this.state = 'ok';
          }
        });
      }
    });
  }

  state: 'loading' | 'nologin' | 'notexist' | 'ok' = 'loading';
  isSelf = false;
  username!: string;
  user!: UserDetails;

  logout() {
    this.userService.logout();
    this.router.navigate(['/']);
  }
}
