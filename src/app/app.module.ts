import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { TodoModule } from './todo/todo.module';
import { HomeModule } from './home/home.module';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';

import { CruDialogModule } from './cru/dialog/dialog';

import { WINDOW } from './inject-tokens';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HomeModule, TodoModule, UserModule, AdminModule,
    CruDialogModule,
    RouterModule.forRoot([
      { path: '', redirectTo: '/home', pathMatch: 'full' },
    ])
  ],
  providers: [
    { provide: WINDOW, useValue: window }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
