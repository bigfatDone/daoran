import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementUploadImgComponent } from './element-uploadImg.component';

describe('ElementUploadImgComponent', () => {
  let component: ElementUploadImgComponent;
  let fixture: ComponentFixture<ElementUploadImgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElementUploadImgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementUploadImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
