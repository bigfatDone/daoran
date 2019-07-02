import { TestBed, inject } from '@angular/core/testing';

import { PageBusinessService } from './page-business.service';

describe('PageBusinessService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PageBusinessService]
    });
  });

  it('should be created', inject([PageBusinessService], (service: PageBusinessService) => {
    expect(service).toBeTruthy();
  }));
});
