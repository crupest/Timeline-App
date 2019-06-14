import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CruButtonModule } from './button/button.module';
import { CruDialogModule } from './dialog/dialog';
import { CruIconButtonModule } from './icon-button/icon-button.module';
import { CruLoadingModule } from './loading/loading.module';
import { CruMatIconModule } from './mat-icon/mat-icon.module';
import { CruSideNavModule } from './side-nav/side-nav.module';
import { DialogBoxComponent } from './dialog/dialog-box/dialog-box.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    CruButtonModule,
    CruDialogModule,
    CruIconButtonModule,
    CruLoadingModule,
    CruMatIconModule,
    CruSideNavModule
  ],
  exports: [
    CruButtonModule,
    CruDialogModule,
    CruIconButtonModule,
    CruLoadingModule,
    CruMatIconModule,
    CruSideNavModule
  ],
  declarations: [DialogBoxComponent]
})
export class CruModule {}
