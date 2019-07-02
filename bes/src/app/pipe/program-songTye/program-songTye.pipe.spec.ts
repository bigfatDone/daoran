import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramArtAreaPipe } from './program-artArea.pipe';

describe('ProgramArtAreaPipe', () => {
  let component: ProgramArtAreaPipe;
  let fixture: ComponentFixture<ProgramArtAreaPipe>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgramArtAreaPipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramArtAreaPipe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
