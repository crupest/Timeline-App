import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../user-service/user.service';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  constructor(private userService: UserService, route: ActivatedRoute, private router: Router) {
    route.queryParamMap.subscribe(map => {
      this.redirect = map.get('from');
    });
  }

  message: string | undefined;
  logining = false;

  redirect: string | null = null;

  form = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
    rememberMe: new FormControl(false)
  });

  ngOnInit() {
    if (this.userService.currentUserInfo) {
      throw new Error('Route error! Already login!');
    }
  }

  onLoginButtonClick() {
    this.logining = true;
    this.userService.login(this.form.value).subscribe(_ => {
      if (this.redirect) {
        this.router.navigateByUrl(this.redirect);
      } else {
        this.router.navigate(['home']);
      }
    }, (error: Error) => {
      this.message = error.message;
      this.logining = false;
    });
  }
}
