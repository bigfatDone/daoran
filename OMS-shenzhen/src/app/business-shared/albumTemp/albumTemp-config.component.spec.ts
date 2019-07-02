import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumTempConfigComponent } from './albumTemp-config.component';

describe('ArticleListComponent', () => {
  let component: AlbumTempConfigComponent;
  let fixture: ComponentFixture<AlbumTempConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlbumTempConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumTempConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
