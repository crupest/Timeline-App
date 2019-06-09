import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CruButtonModule } from './button/button.module';
import { CruLoadingModule } from './loading/loading.module';
import { CruIconButtonModule } from './icon-button/icon-button.module';
import { CruMatIconModule } from './mat-icon/mat-icon.module';
import { CruSideNavModule } from './side-nav/side-nav.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    CruButtonModule,
    CruIconButtonModule,
    CruLoadingModule,
    CruMatIconModule,
    CruSideNavModule
  ],
  exports: [
    CruButtonModule,
    CruLoadingModule,
    CruButtonModule,
    CruIconButtonModule,
    CruMatIconModule,
    CruSideNavModule
  ]
})
export class CruModule {}
