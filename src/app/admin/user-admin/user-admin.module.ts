import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CruModule } from '../../cru/cru.module';

import { UserAdminComponent } from './user-admin.component';
import { ChangePasswordDialogComponent } from './change-password-dialog/change-password-dialog.component';
import { OperatingDialogComponent } from './operating-dialog/operating-dialog.component';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { CreateDialogComponent } from './create-dialog/create-dialog.component';
import { ChangePermissionDialogComponent } from './change-permission-dialog/change-permission-dialog.component';

@NgModule({
  declarations: [
    UserAdminComponent,
    ChangePasswordDialogComponent,
    OperatingDialogComponent,
    DeleteDialogComponent,
    CreateDialogComponent,
    ChangePermissionDialogComponent
  ],
  imports: [CommonModule, FormsModule, CruModule],
  exports: [UserAdminComponent],
  entryComponents: [ChangePasswordDialogComponent, DeleteDialogComponent, CreateDialogComponent]
})
export class UserAdminModule {}
