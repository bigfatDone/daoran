import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GwTaskStatesPipe } from './gw-taskStates.pipe';

describe('GwTaskStatesPipe', () => {
  let component: GwTaskStatesPipe;
  let fixture: ComponentFixture<GwTaskStatesPipe>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GwTaskStatesPipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GwTaskStatesPipe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
