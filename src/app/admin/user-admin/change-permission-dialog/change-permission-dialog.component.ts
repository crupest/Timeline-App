import { Component, Inject } from '@angular/core';

import { CRU_DIALOG_DATA } from 'src/app/cru/dialog/dialog';

import { OperatingStep } from '../operating-dialog/operating-dialog.component';

import { UserInfo } from '../entity';
import { UserAdminService } from '../user-admin.service';

export type ChangePermissionDialogData = UserInfo;

@Component({
  selector: 'app-change-permission-dialog',
  templateUrl: './change-permission-dialog.component.html',
  styleUrls: ['./change-permission-dialog.component.scss']
})
export class ChangePermissionDialogComponent {
  public constructor(
    @Inject(CRU_DIALOG_DATA) public data: ChangePermissionDialogData,
    private service: UserAdminService
  ) {}

  public step: OperatingStep = 'input';

  public submit(): void {
    this.step = 'process';
    this.service.changeUserPermission(this.data.username, this.data.isAdmin).subscribe(
      _ => {
        this.step = 'done';
      },
      _ => {
        this.step = 'error';
      }
    );
  }
}
