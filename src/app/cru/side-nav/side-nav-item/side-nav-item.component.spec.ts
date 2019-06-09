import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CruSideNavItemComponent } from './side-nav-item.component';

describe('SideNavItemComponent', () => {
  let component: CruSideNavItemComponent;
  let fixture: ComponentFixture<CruSideNavItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CruSideNavItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CruSideNavItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
