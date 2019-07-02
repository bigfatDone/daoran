import { TestBed, inject } from '@angular/core/testing';

import { OrderBusinessService } from './order-business.service';

describe('OrderBusinessService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrderBusinessService]
    });
  });

  it('should be created', inject([OrderBusinessService], (service: OrderBusinessService) => {
    expect(service).toBeTruthy();
  }));
});
