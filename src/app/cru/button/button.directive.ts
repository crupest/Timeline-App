import { Directive, Input, HostBinding } from '@angular/core';

@Directive({
  selector: '[cruButton]'
})
export class CruButtonDirective {
  @Input('cruButton')
  public type: 'normal' | 'dangerous' | 'create' = 'normal';

  @HostBinding('class.cru-button')
  public readonly classCommon: boolean = true;

  @HostBinding('class.dangerous')
  public get classDangerous(): boolean {
    return this.type === 'dangerous';
  }

  @HostBinding('class.create')
  public get classCreate(): boolean {
    return this.type === 'create';
  }

  @HostBinding('class.normal')
  public get classNormal(): boolean {
    return this.type === 'normal';
  }
}
