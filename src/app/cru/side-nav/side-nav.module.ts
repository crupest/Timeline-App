import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CruSideNavComponent } from './side-nav/side-nav.component';
import { CruSideNavItemComponent } from './side-nav-item/side-nav-item.component';

@NgModule({
  declarations: [
    CruSideNavComponent,
    CruSideNavItemComponent
  ],
  imports: [CommonModule, RouterModule],
  exports: [
    CruSideNavComponent,
    CruSideNavItemComponent
  ]
})
export class CruSideNavModule {}
