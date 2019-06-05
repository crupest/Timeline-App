import { Component, Input } from '@angular/core';

@Component({
  selector: 'cru-mat-icon',
  templateUrl: './mat-icon.component.html',
  styleUrls: ['./mat-icon.component.css']
})
export class CruMatIconComponent {
  @Input() public size: string = 'inherit';
  @Input() public color: string = 'inherit';
}
