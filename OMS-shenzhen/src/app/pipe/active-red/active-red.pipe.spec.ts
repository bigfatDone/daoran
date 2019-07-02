import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JumpUserStatusPipe } from './jump-userStatus.pipe';

describe('JumpUserStatusPipe', () => {
  let component: JumpUserStatusPipe;
  let fixture: ComponentFixture<JumpUserStatusPipe>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JumpUserStatusPipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JumpUserStatusPipe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
