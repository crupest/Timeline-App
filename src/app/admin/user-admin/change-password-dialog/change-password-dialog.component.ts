import { Component, OnInit, Inject } from '@angular/core';

import { CRU_DIALOG_DATA } from 'src/app/cru/dialog/dialog';

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.css']
})
export class ChangePasswordDialogComponent implements OnInit {
  public constructor(@Inject(CRU_DIALOG_DATA) public data: {username: string}) {}

  public ngOnInit(): void {}
}
