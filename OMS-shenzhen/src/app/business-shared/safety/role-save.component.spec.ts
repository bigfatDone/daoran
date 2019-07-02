import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TmpConfigSaveComponent } from './tmp-config-save.component';

describe('TmpConfigSaveComponent', () => {
  let component: TmpConfigSaveComponent;
  let fixture: ComponentFixture<TmpConfigSaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TmpConfigSaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TmpConfigSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
