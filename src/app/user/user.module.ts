import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { RequireNoLoginGuard, RequireLoginGuard } from './auth-guard/auth.guard';
import { LoginPageComponent } from './login-page/login-page.component';
import { UserPageComponent } from './user-page/user-page.component';

@NgModule({
  declarations: [LoginPageComponent, UserPageComponent],
  imports: [
    RouterModule.forChild([
      { path: 'login', canActivate: [RequireNoLoginGuard], component: LoginPageComponent},
      { path: 'user/:username', canActivate: [RequireLoginGuard], component: UserPageComponent}
    ]),
    CommonModule, HttpClientModule, ReactiveFormsModule, BrowserAnimationsModule
  ],
  exports: [RouterModule],
})
export class UserModule { }
