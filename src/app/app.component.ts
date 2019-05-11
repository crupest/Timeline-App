import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { UserService } from './user/user-service/user.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  // never remove userService because we need it explicit constructing.
  constructor(private userService: UserService) {
  }

  private subscription!: Subscription;
  username: string | null = null;
  avatarUrl: string | null = null;

  ngOnInit() {
    this.userService.checkSavedLoginState();
    this.subscription = this.userService.user$.subscribe(userInfo => {
      if (userInfo == null) {
        this.username = null;
        this.avatarUrl = null;
      } else {
        this.username = userInfo.username;
        this.avatarUrl = this.userService.generateAvartarUrl(userInfo.username);
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
