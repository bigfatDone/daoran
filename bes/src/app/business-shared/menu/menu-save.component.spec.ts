import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuSaveComponent } from './menu-save.component';

describe('MenuSaveComponent', () => {
  let component: MenuSaveComponent;
  let fixture: ComponentFixture<MenuSaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuSaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
