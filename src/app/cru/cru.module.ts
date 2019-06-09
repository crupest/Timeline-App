import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CruButtonDirective } from './button/button.directive';
import { CruLoadingComponent } from './loading/loading.component';
import { CruMatIconComponent } from './mat-icon/mat-icon.component';
import { CruIconButtonComponent } from './icon-button/icon-button.component';
import { CruSideNavComponent } from './side-nav/side-nav.component';
import { CruSideNavItemComponent } from './side-nav-item/side-nav-item.component';

@NgModule({
  declarations: [
    CruLoadingComponent,
    CruMatIconComponent,
    CruIconButtonComponent,
    CruButtonDirective,
    CruSideNavComponent,
    CruSideNavItemComponent
  ],
  imports: [CommonModule, RouterModule],
  exports: [
    CruLoadingComponent,
    CruMatIconComponent,
    CruIconButtonComponent,
    CruButtonDirective,
    CruSideNavComponent,
    CruSideNavItemComponent
  ]
})
export class CruModule {}
