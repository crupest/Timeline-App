import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CruSideNavComponent } from './side-nav.component';

describe('SideNavComponent', () => {
  let component: CruSideNavComponent;
  let fixture: ComponentFixture<CruSideNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CruSideNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CruSideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
