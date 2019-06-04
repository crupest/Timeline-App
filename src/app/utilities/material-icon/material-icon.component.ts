import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-material-icon',
  templateUrl: './material-icon.component.html',
  styleUrls: ['./material-icon.component.css']
})
export class MaterialIconComponent {
  @Input() public size: string = 'inherit';
  @Input() public color: string = 'inherit';
}
