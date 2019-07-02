import { TestBed, inject } from '@angular/core/testing';

import { CommonBusinessService } from './common-business.service';

describe('CommonBusinessService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommonBusinessService]
    });
  });

  it('should be created', inject([CommonBusinessService], (service: CommonBusinessService) => {
    expect(service).toBeTruthy();
  }));
});
