import { TestBed, inject } from '@angular/core/testing';

import { WebsiteBusinessService } from './website-business.service';

describe('WebsiteBusinessService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WebsiteBusinessService]
    });
  });

  it('should be created', inject([WebsiteBusinessService], (service: WebsiteBusinessService) => {
    expect(service).toBeTruthy();
  }));
});
