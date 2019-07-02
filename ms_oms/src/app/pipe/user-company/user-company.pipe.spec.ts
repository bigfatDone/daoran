import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCompanyPipe } from './user-company.pipe';

describe('UserCompanyPipe', () => {
  let component: UserCompanyPipe;
  let fixture: ComponentFixture<UserCompanyPipe>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserCompanyPipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCompanyPipe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
