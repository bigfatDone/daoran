import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramNodesPipe } from './program-nodes.pipe';

describe('ProgramNodesPipe', () => {
  let component: ProgramNodesPipe;
  let fixture: ComponentFixture<ProgramNodesPipe>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgramNodesPipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramNodesPipe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
