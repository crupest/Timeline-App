import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.css']
})
export class ChangePasswordDialogComponent implements OnInit {
  public constructor() {}

  public data!: { username: string };

  public ngOnInit(): void {}
}
