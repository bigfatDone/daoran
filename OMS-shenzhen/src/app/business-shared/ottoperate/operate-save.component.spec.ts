import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionSaveComponent } from './version-save.component';

describe('BannerSaveComponent', () => {
  let component: VersionSaveComponent;
  let fixture: ComponentFixture<VersionSaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VersionSaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VersionSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
