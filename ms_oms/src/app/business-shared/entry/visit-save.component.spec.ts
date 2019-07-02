import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitSaveComponent } from './visit-save.component';

describe('VisitSaveComponent', () => {
  let component: VisitSaveComponent;
  let fixture: ComponentFixture<VisitSaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitSaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
