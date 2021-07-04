import { Component, Inject } from '@angular/core';

import { CRU_DIALOG_DATA } from 'src/app/cru/dialog/dialog';

import { UserInfo } from '../entity';
import { OperatingStep } from '../operating-dialog/operating-dialog.component';
import { UserAdminService } from '../user-admin.service';

export type CreateDialogData = UserInfo;

@Component({
  selector: 'app-create-dialog',
  templateUrl: './create-dialog.component.html',
  styleUrls: ['./create-dialog.component.scss']
})
export class CreateDialogComponent {
  public constructor(
    @Inject(CRU_DIALOG_DATA) public data: CreateDialogData,
    private service: UserAdminService
  ) {}

  public step: OperatingStep = 'input';

  public submit(): void {
    this.step = 'process';
    this.service.createUser(this.data).subscribe(
      _ => {
        this.step = 'done';
      },
      _ => {
        this.step = 'error';
      }
    );
  }
}
