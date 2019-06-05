import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CruModule } from '../cru/cru.module';

import { TodoItemComponent } from './todo-item/todo-item.component';
import { TodoPageComponent } from './todo-page/todo-page.component';

@NgModule({
  declarations: [TodoItemComponent, TodoPageComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CruModule,
    RouterModule.forChild([{ path: 'todo', component: TodoPageComponent }])
  ],
  exports: [RouterModule]
})
export class TodoModule {}
