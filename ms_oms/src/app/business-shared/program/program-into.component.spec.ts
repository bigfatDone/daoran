import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramIntoComponent } from './program-into.component';

describe('ProgramIntoComponent', () => {
  let component: ProgramIntoComponent;
  let fixture: ComponentFixture<ProgramIntoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgramIntoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramIntoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
