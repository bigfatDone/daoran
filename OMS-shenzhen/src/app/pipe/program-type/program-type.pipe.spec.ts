import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramTypePipe } from './program-type.pipe';

describe('ProgramTypePipe', () => {
  let component: ProgramTypePipe;
  let fixture: ComponentFixture<ProgramTypePipe>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgramTypePipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramTypePipe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
