import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TmpInfoListComponent } from './tmp-info-list.component';

describe('TmpInfoListComponent', () => {
  let component: TmpInfoListComponent;
  let fixture: ComponentFixture<TmpInfoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TmpInfoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TmpInfoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
