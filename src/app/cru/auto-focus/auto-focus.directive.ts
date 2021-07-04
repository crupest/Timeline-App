import { Directive, OnInit, ElementRef } from '@angular/core';

@Directive({
  selector: '[cruAutoFocus]'
})
export class CruAutoFocusDirective implements OnInit {
  public constructor(private element: ElementRef) {}

  public ngOnInit(): void {
    this.element.nativeElement.focus();
  }
}
