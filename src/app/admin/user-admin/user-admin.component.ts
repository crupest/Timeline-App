import { Component } from '@angular/core';

import { CruDialogService } from 'src/app/cru/dialog/dialog';

import { UserInfo } from './entity';
import { UserAdminService } from './user-admin.service';

import {
  ChangePasswordDialogComponent,
  ChangePasswordDialogData
} from './change-password-dialog/change-password-dialog.component';
import { DeleteDialogComponent, DeleteDialogData } from './delete-dialog/delete-dialog.component';
import { CreateDialogComponent, CreateDialogData } from './create-dialog/create-dialog.component';
import {
  ChangePermissionDialogData,
  ChangePermissionDialogComponent
} from './change-permission-dialog/change-permission-dialog.component';

import { OperatingResult } from './operating-dialog/operating-dialog.component';

@Component({
  selector: 'app-user-admin',
  templateUrl: './user-admin.component.html',
  styleUrls: ['./user-admin.component.scss']
})
export class UserAdminComponent {
  public constructor(private service: UserAdminService, private dialogService: CruDialogService) {
    service.getUserList().subscribe(next => {
      this.users = next;
    });
  }

  public users: UserInfo[] | undefined;

  public newUser: UserInfo | null = null;

  public prepareCreatingUser(): void {
    this.newUser = {
      username: '',
      isAdmin: false
    };
  }

  public toggleNewUserAdmin(): void {
    this.newUser!.isAdmin = !this.newUser!.isAdmin;
  }

  public create(): void {
    this.dialogService
      .pushDialog(CreateDialogComponent, {
        overlayCloseOnClick: false,
        data: this.newUser as CreateDialogData
      })
      .close$.subscribe(info => {
        if ((info.data as OperatingResult) === 'success') {
          delete this.newUser;
        }
      });
  }

  public changePassword(username: string): void {
    this.dialogService.pushDialog(ChangePasswordDialogComponent, {
      overlayCloseOnClick: false,
      data: {
        username
      } as ChangePasswordDialogData
    });
  }

  public delete(username: string): void {
    this.dialogService.pushDialog(DeleteDialogComponent, {
      overlayCloseOnClick: false,
      data: {
        username
      } as DeleteDialogData
    });
  }

  public changePermission(username: string, isAdmin: boolean): void {
    this.dialogService.pushDialog(ChangePermissionDialogComponent, {
      overlayCloseOnClick: false,
      data: {
        username,
        isAdmin
      } as ChangePermissionDialogData
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
