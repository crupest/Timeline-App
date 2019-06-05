import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { CruModule } from '../cru/cru.module';

import { LoginPageComponent } from './login-page/login-page.component';
import { UserPageComponent } from './user-page/user-page.component';

import { RequireNoLoginGuard, RequireLoginGuard } from './auth-guard/auth.guard';

@NgModule({
  declarations: [LoginPageComponent, UserPageComponent],
  imports: [
    RouterModule.forChild([
      { path: 'login', canActivate: [RequireNoLoginGuard], component: LoginPageComponent},
      { path: 'user/:username', canActivate: [RequireLoginGuard], component: UserPageComponent}
    ]),
    CommonModule, HttpClientModule, ReactiveFormsModule,
    CruModule
  ],
  exports: [RouterModule],
})
export class UserModule { }
