import { Directive, Output, Input, EventEmitter, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Directive({
  selector: '[appDebounceClick]'
})
export class DebounceClickDirective implements OnInit, OnDestroy {

  private subscription: Subscription | undefined;

  @Output('appDebounceClick')
  public clickEvent = new EventEmitter<any>();

  // tslint:disable-next-line:no-input-rename
  @Input('appDebounceClickTime')
  public set debounceTime(value: number) {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = fromEvent(<HTMLElement>this.element.nativeElement, 'click').pipe(
      debounceTime(value)
    ).subscribe(o => this.clickEvent.emit(o));
  }

  public constructor(private element: ElementRef) {
  }

  public ngOnInit(): void {
    if (!this.subscription) {
      this.subscription = fromEvent(<HTMLElement>this.element.nativeElement, 'click').pipe(
        debounceTime(500)
      ).subscribe(o => this.clickEvent.emit(o));
    }
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
