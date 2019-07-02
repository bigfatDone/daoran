import { TestBed, inject } from '@angular/core/testing';

import { PointBusinessService } from './point-business.service';

describe('PointBusinessService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PointBusinessService]
    });
  });

  it('should be created', inject([PointBusinessService], (service: PointBusinessService) => {
    expect(service).toBeTruthy();
  }));
});
