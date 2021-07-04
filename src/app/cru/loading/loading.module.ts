import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CruLoadingComponent } from './loading.component';

@NgModule({
  declarations: [CruLoadingComponent],
  imports: [CommonModule],
  exports: [CruLoadingComponent]
})
export class CruLoadingModule {}
