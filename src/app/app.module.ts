import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { environment } from '../environments/environment';

import { AppComponent } from './app.component';

import { TodoModule } from './todo/todo.module';
import { HomeModule } from './home/home.module';
import { UserModule } from './user/user.module';

import { WINDOW, API_BASE_URL } from './inject-tokens';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    HomeModule, TodoModule, UserModule,
    RouterModule.forRoot([
      { path: '', redirectTo: '/home', pathMatch: 'full' },
    ])
  ],
  providers: [
    { provide: WINDOW, useValue: window },
    {
      provide: API_BASE_URL, useValue: environment.production ?
        'https://api.crupest.xyz/' : 'http://localhost:5000/'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
