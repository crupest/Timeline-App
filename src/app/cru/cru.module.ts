import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CruAutoFocusModule } from './auto-focus/auto-focus.module';
import { CruButtonModule } from './button/button.module';
import { CruDialogModule } from './dialog/dialog';
import { CruIconButtonModule } from './icon-button/icon-button.module';
import { CruLoadingModule } from './loading/loading.module';
import { CruMatIconModule } from './mat-icon/mat-icon.module';
import { CruSideNavModule } from './side-nav/side-nav.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    CruAutoFocusModule,
    CruButtonModule,
    CruDialogModule,
    CruIconButtonModule,
    CruLoadingModule,
    CruMatIconModule,
    CruSideNavModule
  ],
  exports: [
    CruAutoFocusModule,
    CruButtonModule,
    CruDialogModule,
    CruIconButtonModule,
    CruLoadingModule,
    CruMatIconModule,
    CruSideNavModule
  ]
})
export class CruModule {}
