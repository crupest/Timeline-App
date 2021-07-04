import { Component, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'cru-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class CruLoadingComponent {
  @Input() public size: string = '50px';
  @Input() @HostBinding('class.center') public center: boolean = false;
}
