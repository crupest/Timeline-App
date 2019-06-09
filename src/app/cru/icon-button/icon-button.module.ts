import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CruMatIconModule } from '../mat-icon/mat-icon.module';

import { CruIconButtonComponent } from './icon-button.component';

@NgModule({
  declarations: [CruIconButtonComponent],
  imports: [CommonModule, CruMatIconModule],
  exports: [CruIconButtonComponent]
})
export class CruIconButtonModule {}
