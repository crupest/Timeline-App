import { Component, OnInit, OnDestroy } from '@angular/core';

import {Observable, Subscription } from 'rxjs';

import { UserService } from './user/user-service/user.service';
import { map } from 'rxjs/operators';


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
  avatarUrl: string | null = null;

  ngOnInit() {
    this.subscription = this.userService.userInfo$.pipe(map(userInfo => {
      if (userInfo == null) {
        return null;
      } else {
        return this.userService.getAvartar(userInfo.username);
      }
    })).subscribe(url => this.avatarUrl = url);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
