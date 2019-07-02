import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllotRoleComponent } from './allot-role.component';

describe('ElementPageCheckComponent', () => {
  let component: AllotRoleComponent;
  let fixture: ComponentFixture<AllotRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllotRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllotRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
