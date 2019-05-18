import { Component } from '@angular/core';

import { throwError, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

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
    activatedRoute.paramMap.pipe(switchMap(params => {
      const username = params.get('username');
      if (username == null) {
        return throwError(new Error('No username param in route.'));
      } else {
        this.username = username;
        return of(username);
      }
    }), switchMap(username => {
      const currentUser = userService.currentUser;
      if (!currentUser) {
        return throwError(new Error('No login.'));
      }
      if (username === currentUser.username) {
        this.isSelf = true;
        return of(currentUser);
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
    }, error => console.error(error));
  }

  state: 'loading' | 'notexist' | 'ok' = 'loading';
  isSelf = false;
  username!: string;
  user!: UserDetails;

  logout() {
    this.userService.logout();
    this.router.navigate(['/']);
  }
}
