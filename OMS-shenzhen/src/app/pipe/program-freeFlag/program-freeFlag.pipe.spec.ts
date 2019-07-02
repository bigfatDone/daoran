import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramFreeFlagPipe } from './program-freeFlag.pipe';

describe('ProgramFreeFlagPipe', () => {
  let component: ProgramFreeFlagPipe;
  let fixture: ComponentFixture<ProgramFreeFlagPipe>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgramFreeFlagPipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramFreeFlagPipe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
