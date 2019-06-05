import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CruLoadingComponent } from './loading/loading.component';
import { CruMatIconComponent } from './mat-icon/mat-icon.component';
import { CruIconButtonComponent } from './icon-button/icon-button.component';

@NgModule({
  declarations: [CruLoadingComponent, CruMatIconComponent, CruIconButtonComponent],
  imports: [CommonModule],
  exports: [CruLoadingComponent, CruMatIconComponent, CruIconButtonComponent]
})
export class CruModule {}
