import { Component, OnInit, Inject } from '@angular/core';
import { CRU_DIALOG_DATA } from 'src/app/cru/dialog/dialog';
import { UserAdminService } from '../user-admin.service';
import { OperatingStep } from '../operating-dialog/operating-dialog.component';

export interface DeleteDialogData {
  username: string;
}

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.css']
})
export class DeleteDialogComponent implements OnInit {
  public constructor(
    @Inject(CRU_DIALOG_DATA) public data: DeleteDialogData,
    private service: UserAdminService
  ) {}

  public step: OperatingStep = 'input';

  public ngOnInit(): void {}

  public submit(): void {
    this.step = 'process';
    this.service.deleteUser(this.data.username).subscribe(
      _ => {
        this.step = 'done';
      },
      _ => {
        this.step = 'error';
      }
    );
  }
}
