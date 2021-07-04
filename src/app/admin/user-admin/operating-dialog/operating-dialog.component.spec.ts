import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatingDialogComponent } from './operating-dialog.component';

describe('OperationDialogComponent', () => {
  let component: OperatingDialogComponent;
  let fixture: ComponentFixture<OperatingDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperatingDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
