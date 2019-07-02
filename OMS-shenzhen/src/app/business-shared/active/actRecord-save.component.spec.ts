import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActRecordSaveComponent } from './actRecord-save.component';

describe('ActRecordSaveComponent', () => {
  let component: ActRecordSaveComponent;
  let fixture: ComponentFixture<ActRecordSaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActRecordSaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActRecordSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
