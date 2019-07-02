import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderRuleWeekPipe } from './order-ruleWeek.pipe';

describe('OrderRuleWeekPipe', () => {
  let component: OrderRuleWeekPipe;
  let fixture: ComponentFixture<OrderRuleWeekPipe>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderRuleWeekPipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderRuleWeekPipe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
