import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicPipe } from './dynamic.pipe';

describe('DynamicPipe', () => {
  let component: DynamicPipe;
  let fixture: ComponentFixture<DynamicPipe>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicPipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicPipe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
