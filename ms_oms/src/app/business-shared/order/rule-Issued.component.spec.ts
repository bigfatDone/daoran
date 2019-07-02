import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleIssuedComponent } from './rule-Issued.component';

describe('RuleIssuedComponent', () => {
  let component: RuleIssuedComponent;
  let fixture: ComponentFixture<RuleIssuedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuleIssuedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleIssuedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
