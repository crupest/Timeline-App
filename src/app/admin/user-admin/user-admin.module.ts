import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CruModule } from '../../cru/cru.module';

import { UserAdminComponent } from './user-admin.component';
import { ChangePasswordDialogComponent } from './change-password-dialog/change-password-dialog.component';

@NgModule({
  declarations: [UserAdminComponent, ChangePasswordDialogComponent],
  imports: [CommonModule, CruModule],
  exports: [UserAdminComponent],
  entryComponents: [ChangePasswordDialogComponent]
})
export class UserAdminModule {}
