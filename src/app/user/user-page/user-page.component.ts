import { Component } from '@angular/core';

import { of } from 'rxjs';
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
  public constructor(private userService: UserService, activatedRoute: ActivatedRoute, private router: Router) {
    activatedRoute.paramMap.pipe(switchMap(params => {
      const username = params.get('username')!;
      this.username = username;
      const currentUser = userService.currentUser!;
      if (username === currentUser.username) {
        this.isSelf = true;
        return of(currentUser);
      } else {
        return userService.getUserDetails(username);
      }
    })).subscribe(user => {
        this.user = user;
    }, error => console.error(error));
  }

  public isSelf = false;
  public username!: string;
  public user: UserDetails | null | undefined;

  public logout(): void {
    this.userService.logout();
    this.router.navigate(['/']);
  }
}
