import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AwardSaveComponent } from './award-save.component';

describe('AwardSaveComponent', () => {
  let component: AwardSaveComponent;
  let fixture: ComponentFixture<AwardSaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AwardSaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwardSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
