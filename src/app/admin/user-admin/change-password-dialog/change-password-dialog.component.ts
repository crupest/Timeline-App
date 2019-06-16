import { Component, OnInit, Inject } from '@angular/core';

import {
  CRU_DIALOG_DATA,
  CRU_DIALOG_CONTROLLER,
  DialogController
} from 'src/app/cru/dialog/dialog';
import { UserAdminService } from '../user-admin.service';

export interface ChangePasswordDialogData {
  username: string;
}

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.css']
})
export class ChangePasswordDialogComponent implements OnInit {
  public constructor(
    @Inject(CRU_DIALOG_DATA) public data: ChangePasswordDialogData,
    @Inject(CRU_DIALOG_CONTROLLER) private controller: DialogController,
    private service: UserAdminService
  ) {}

  public step: 'init' | 'process' | 'done' | 'error' = 'init';

  public ngOnInit(): void {}

  public close(): void {
    this.controller.close();
  }

  public doIt(): void {
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
