import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEntryKindvalueComponent } from './add-entry-kindvalue.component';

describe('AddEntryKindvalueComponent', () => {
  let component: AddEntryKindvalueComponent;
  let fixture: ComponentFixture<AddEntryKindvalueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEntryKindvalueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEntryKindvalueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
