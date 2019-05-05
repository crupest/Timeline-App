import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { UserService } from '../user-service/user.service';


export type LoginMessage = string | undefined;

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  constructor(private userService: UserService) { }

  message: LoginMessage;

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
    console.log('login');
    /*
    this.userService.login(this.form.value).subscribe(_ => {
      this.userService.userRouteNavigate(['success', { fromlogin: 'true' }]);
    }, (error: Error) => this.message = error.message);
    */
  }
}
