import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CruButtonDirective } from './button/button.directive';
import { CruLoadingComponent } from './loading/loading.component';
import { CruMatIconComponent } from './mat-icon/mat-icon.component';
import { CruIconButtonComponent } from './icon-button/icon-button.component';

@NgModule({
  declarations: [CruLoadingComponent, CruMatIconComponent, CruIconButtonComponent, CruButtonDirective],
  imports: [CommonModule],
  exports: [CruLoadingComponent, CruMatIconComponent, CruIconButtonComponent, CruButtonDirective]
})
export class CruModule {}
