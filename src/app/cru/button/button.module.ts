import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CruButtonDirective } from './button.directive';

@NgModule({
  declarations: [CruButtonDirective],
  imports: [CommonModule],
  exports: [CruButtonDirective]
})
export class CruButtonModule {}
