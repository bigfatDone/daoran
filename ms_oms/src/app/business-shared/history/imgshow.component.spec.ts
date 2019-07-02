import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgshowComponent } from './imgshow.component';

describe('ImgshowComponent', () => {
  let component: ImgshowComponent;
  let fixture: ComponentFixture<ImgshowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImgshowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImgshowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
