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
    this.dialogService.pushDialog(ChangePasswordDialogComponent, {
      overlayCloseOnClick: false,
      data: {
        username
      }
    });
  }

  public itemKeyDown(event: KeyboardEvent, index: number): void {
    if (event.code === 'ArrowDown' && index < this.users!.length - 1) {
      ((event.currentTarget as HTMLElement).nextElementSibling as HTMLElement).focus();
    }
    if (event.code === 'ArrowUp' && index > 0) {
      ((event.currentTarget as HTMLElement).previousElementSibling as HTMLElement).focus();
    }
  }
}
