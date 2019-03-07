import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcedureOrdersComponent } from './procedure-orders.component';

describe('ProcedureOrdersComponent', () => {
  let component: ProcedureOrdersComponent;
  let fixture: ComponentFixture<ProcedureOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcedureOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcedureOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
