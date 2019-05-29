import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebounceClickDirective } from './debounce-click.directive';
import { LoadingComponent } from './loading/loading.component';

@NgModule({
  declarations: [DebounceClickDirective, LoadingComponent],
  imports: [CommonModule],
  exports: [DebounceClickDirective, LoadingComponent]
})
export class UtilityModule { }
