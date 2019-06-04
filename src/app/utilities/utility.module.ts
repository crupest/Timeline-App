import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebounceClickDirective } from './debounce-click.directive';
import { LoadingComponent } from './loading/loading.component';
import { MaterialIconComponent } from './material-icon/material-icon.component';

@NgModule({
  declarations: [DebounceClickDirective, LoadingComponent, MaterialIconComponent],
  imports: [CommonModule],
  exports: [DebounceClickDirective, LoadingComponent, MaterialIconComponent]
})
export class UtilityModule { }
