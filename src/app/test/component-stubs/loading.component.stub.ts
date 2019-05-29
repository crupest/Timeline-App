import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  template: ''
})
export class LoadingStubComponent {
  @Input() public size: string = '50px';
  @Input() public center: boolean = false;
}
