import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioDetailComponent } from './audio-detail.component';

describe('AudioDetailComponent', () => {
  let component: AudioDetailComponent;
  let fixture: ComponentFixture<AudioDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AudioDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
