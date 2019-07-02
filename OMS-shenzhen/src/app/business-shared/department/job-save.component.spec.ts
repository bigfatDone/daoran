import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobSaveComponent } from './job-save.component';

describe('JobSaveComponent', () => {
  let component: JobSaveComponent;
  let fixture: ComponentFixture<JobSaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobSaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
