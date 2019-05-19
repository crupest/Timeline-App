import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../user-service/user.service';
import { BadCredentialsError } from '../user-service/errors';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {

  public constructor(private userService: UserService, route: ActivatedRoute, private router: Router) {
    route.queryParamMap.subscribe(map => {
      this.redirect = map.get('from');
    });
  }

  public logining = false;
  public error: 'badcredentials' | 'unknown' | null = null;

  public redirect: string | null = null;

  public form = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
    rememberMe: new FormControl(false)
  });

  public onLoginButtonClick(): void {
    this.logining = true;
    this.userService.login(this.form.value).subscribe(_ => {
      if (this.redirect) {
        this.router.navigateByUrl(this.redirect);
      } else {
        this.router.navigate(['home']);
      }
    }, (error: Error) => {
      this.logining = false;
      if (error instanceof BadCredentialsError) {
        this.error = 'badcredentials';
      } else {
        this.error = 'unknown';
        console.error(error);
      }
    });
  }
}
