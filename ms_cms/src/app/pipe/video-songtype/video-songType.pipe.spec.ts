import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTypePipe } from './user-type.pipe';

describe('UserTypePipe', () => {
  let component: UserTypePipe;
  let fixture: ComponentFixture<UserTypePipe>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserTypePipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTypePipe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
