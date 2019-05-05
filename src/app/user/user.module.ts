import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { RequireNoLoginGuard } from './auth-guard/auth.guard';
import { LoginPageComponent } from './login-page/login-page.component';
import { UtilityModule } from '../utilities/utility.module';

@NgModule({
  declarations: [LoginPageComponent],
  imports: [
    RouterModule.forChild([
      { path: 'login', canActivate: [RequireNoLoginGuard], component: LoginPageComponent},
    ]),
    CommonModule, HttpClientModule, ReactiveFormsModule, BrowserAnimationsModule,
    UtilityModule
  ],
  exports: [RouterModule],
})
export class UserModule { }
