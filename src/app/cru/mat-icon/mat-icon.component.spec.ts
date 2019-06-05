import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CruMatIconComponent } from './mat-icon.component';

@Component({
  template: '<cru-mat-icon>check</cru-mat-icon>'
})
export class MaterialIconTestComponent {}

describe('MaterialIconComponent', () => {
  let component: CruMatIconComponent;
  let fixture: ComponentFixture<CruMatIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CruMatIconComponent, MaterialIconTestComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CruMatIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('default style should work', () => {
    const debugI = fixture.debugElement.query(By.css('i'));
    expect(debugI.styles['font-size']).toBe('inherit');
    expect(debugI.styles.color).toBe('inherit');
  });

  it('default style should work', () => {
    const debugI = fixture.debugElement.query(By.css('i'));
    expect(debugI.styles['font-size']).toBe('inherit');
    expect(debugI.styles.color).toBe('inherit');
  });

  it('inherit style should work', () => {
    const hostElement: HTMLElement = fixture.debugElement.nativeElement;
    hostElement.style.fontSize = '20px';
    hostElement.style.color = 'red';
    const debugI = fixture.debugElement.query(By.css('i'));
    expect(window.getComputedStyle(debugI.nativeElement).fontSize).toBe('20px');
    expect(window.getComputedStyle(debugI.nativeElement).color).toBe('rgb(255, 0, 0)');
  });

  it('input style should work', () => {
    component.size = '30px';
    component.color = 'blue';
    fixture.detectChanges();
    const debugI = fixture.debugElement.query(By.css('i'));
    expect(debugI.styles['font-size']).toBe('30px');
    expect(debugI.styles.color).toBe('blue');
  });

  it('content should work', () => {
    const testFixture = TestBed.createComponent(MaterialIconTestComponent);
    expect(
      (testFixture.debugElement.query(By.css('i')).nativeElement as HTMLElement).textContent
    ).toBe('check');
  });
});
