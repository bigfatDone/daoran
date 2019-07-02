import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderRuleITypePipe } from './order-ruleSource.pipe';

describe('OrderRuleITypePipe', () => {
  let component: OrderRuleITypePipe;
  let fixture: ComponentFixture<OrderRuleITypePipe>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderRuleITypePipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderRuleITypePipe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
