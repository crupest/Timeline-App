import { Component, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent {
  @Input() public size: string = '50px';
  @Input() @HostBinding('class.center') public center: boolean = false;
}
