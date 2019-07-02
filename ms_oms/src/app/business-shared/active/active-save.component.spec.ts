import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveSaveComponent } from './active-save.component';

describe('ActiveSaveComponent', () => {
  let component: ActiveSaveComponent;
  let fixture: ComponentFixture<ActiveSaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveSaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
