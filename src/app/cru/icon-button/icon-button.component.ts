import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cru-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.css']
})
export class CruIconButtonComponent {
  @Output() public readonly click: EventEmitter<MouseEvent> = new EventEmitter();

  public onButtonClick(event: MouseEvent): void {
    this.click.emit(event);
  }
}
