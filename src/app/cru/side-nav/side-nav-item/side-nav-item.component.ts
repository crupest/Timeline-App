import { Component, Input } from '@angular/core';

@Component({
  selector: 'cru-side-nav-item',
  templateUrl: './side-nav-item.component.html',
  styleUrls: ['./side-nav-item.component.css']
})
export class CruSideNavItemComponent {
  @Input() public link: string | any;
}
