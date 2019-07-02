import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TmpInfoSaveComponent } from './tmp-info-save.component';

describe('TmpInfoSaveComponent', () => {
  let component: TmpInfoSaveComponent;
  let fixture: ComponentFixture<TmpInfoSaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TmpInfoSaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TmpInfoSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
