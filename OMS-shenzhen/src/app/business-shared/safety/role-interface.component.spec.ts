import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllotRoleCheckComponent } from './allot-role-check.component';

describe('ElementPageCheckComponent', () => {
  let component: AllotRoleCheckComponent;
  let fixture: ComponentFixture<AllotRoleCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllotRoleCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllotRoleCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
