import { Component, Inject } from '@angular/core';

import { CRU_DIALOG_DATA } from 'src/app/cru/dialog/dialog';

import { OperatingStep } from '../operating-dialog/operating-dialog.component';

import { UserAdminService } from '../user-admin.service';

export interface ChangePasswordDialogData {
  username: string;
}

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.css']
})
export class ChangePasswordDialogComponent {
  public constructor(
    @Inject(CRU_DIALOG_DATA) public data: ChangePasswordDialogData,
    private service: UserAdminService
  ) {}

  public step: OperatingStep = 'input';

  public submit(): void {
    this.step = 'process';
    this.service.changeUserPassword(this.data.username, '').subscribe(
      _ => {
        this.step = 'done';
      },
      _ => {
        this.step = 'error';
      }
    );
  }
}
