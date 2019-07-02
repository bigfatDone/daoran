import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PctureUploadingComponent } from './picture-uploading.component';

describe('PctureUploadingComponent', () => {
  let component: PctureUploadingComponent;
  let fixture: ComponentFixture<PctureUploadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PctureUploadingComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PctureUploadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
