import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelateListComponent } from './relate-list.component';

describe('RelateListComponent', () => {
  let component: RelateListComponent;
  let fixture: ComponentFixture<RelateListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelateListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
