import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CruModule } from '../cru/cru.module';

import { UserAdminModule } from './user-admin/user-admin.module';

import { ForbiddenPageComponent } from './forbidden-page/forbidden-page.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { UserAdminComponent } from './user-admin/user-admin.component';

import { AdminGuard } from './admin.guard';

@NgModule({
  declarations: [ForbiddenPageComponent, AdminPageComponent],
  imports: [
    CommonModule,
    CruModule,
    UserAdminModule,
    RouterModule.forChild([
      { path: 'forbidden', component: ForbiddenPageComponent },
      {
        path: 'admin',
        canActivate: [AdminGuard],
        component: AdminPageComponent,
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'user' },
          { path: 'user', component: UserAdminComponent }
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class AdminModule {}
