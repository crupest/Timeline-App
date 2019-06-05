import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AdminGuard } from './admin.guard';

import { ForbiddenComponent } from './forbidden/forbidden.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { UserAdminComponent } from './user-admin/user-admin.component';

@NgModule({
  declarations: [ForbiddenComponent, AdminPageComponent, UserAdminComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: 'forbidden' },
      {
        path: 'admin',
        canActivate: [AdminGuard],
        component: AdminPageComponent,
        children: [{ path: 'user', component: UserAdminComponent }]
      }
    ])
  ]
})
export class AdminModule {}
