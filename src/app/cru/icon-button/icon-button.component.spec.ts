import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CruIconButtonComponent } from './icon-button.component';

describe('IconButtonComponent', () => {
  let component: CruIconButtonComponent;
  let fixture: ComponentFixture<CruIconButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CruIconButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CruIconButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
