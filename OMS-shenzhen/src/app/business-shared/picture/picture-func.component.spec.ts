import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PctureFuncComponent } from './picture-func.component';

describe('PctureFuncComponent', () => {
  let component: PctureFuncComponent;
  let fixture: ComponentFixture<PctureFuncComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PctureFuncComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PctureFuncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
