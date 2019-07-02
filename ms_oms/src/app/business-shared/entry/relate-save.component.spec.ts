import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelateSaveComponent } from './relate-save.component';

describe('RelateSaveComponent', () => {
  let component: RelateSaveComponent;
  let fixture: ComponentFixture<RelateSaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelateSaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelateSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
