import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEntryKindComponent } from './add-entry-kind.component';

describe('AddEntryKindComponent', () => {
  let component: AddEntryKindComponent;
  let fixture: ComponentFixture<AddEntryKindComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEntryKindComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEntryKindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
