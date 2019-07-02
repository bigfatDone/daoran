import { TestBed, inject } from '@angular/core/testing';

import { MenuBusinessService } from './menu-business.service';

describe('MenuBusinessService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MenuBusinessService]
    });
  });

  it('should be created', inject([MenuBusinessService], (service: MenuBusinessService) => {
    expect(service).toBeTruthy();
  }));
});
