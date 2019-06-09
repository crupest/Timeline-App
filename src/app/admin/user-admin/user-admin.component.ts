import { Component } from '@angular/core';

import { CruDialogService } from 'src/app/cru/dialog/dialog';

import { UserInfo } from './entity';
import { UserAdminService } from './user-admin.service';
import { ChangePasswordDialogComponent } from './change-password-dialog/change-password-dialog.component';

@Component({
  selector: 'app-user-admin',
  templateUrl: './user-admin.component.html',
  styleUrls: ['./user-admin.component.css']
})
export class UserAdminComponent {
  public constructor(private service: UserAdminService, private dialogService: CruDialogService) {
    service.getUserList().subscribe(next => {
      this.users = next;
    });
  }

  public users: UserInfo[] | undefined;

  public changePassword(username: string): void {
    this.dialogService.pushDialog(ChangePasswordDialogComponent);
  }
}
