import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TmpConfigListComponent } from './tmp-config-list.component';

describe('TmpConfigListComponent', () => {
  let component: TmpConfigListComponent;
  let fixture: ComponentFixture<TmpConfigListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TmpConfigListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TmpConfigListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
