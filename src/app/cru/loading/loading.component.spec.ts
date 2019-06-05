import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CruLoadingComponent } from './loading.component';

describe('LoadingComponent', () => {
  let component: CruLoadingComponent;
  let fixture: ComponentFixture<CruLoadingComponent>;
  let animationContainer: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CruLoadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CruLoadingComponent);
    component = fixture.componentInstance;
    animationContainer = fixture.debugElement.query(By.css('.loading-animation-container'));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('size should work', () => {
    expect(animationContainer.styles.width).toBe('50px');
    expect(animationContainer.styles.height).toBe('50px');
    component.size = '100px';
    fixture.detectChanges();
    expect(animationContainer.styles.width).toBe('100px');
    expect(animationContainer.styles.height).toBe('100px');
  });

  it('center should work', () => {
    expect(fixture.debugElement.classes.center).toBe(false);
    component.center = true;
    fixture.detectChanges();
    expect(fixture.debugElement.classes.center).toBe(true);
  });
});
