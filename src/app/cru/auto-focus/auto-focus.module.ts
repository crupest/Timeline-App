import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CruAutoFocusDirective } from './auto-focus.directive';

@NgModule({
  declarations: [CruAutoFocusDirective],
  imports: [CommonModule],
  exports: [CruAutoFocusDirective]
})
export class CruAutoFocusModule {}
