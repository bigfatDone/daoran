import { TestBed, inject } from '@angular/core/testing';

import { GatewayBusinessService } from './gateway-business.service';

describe('GatewayBusinessService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GatewayBusinessService]
    });
  });

  it('should be created', inject([GatewayBusinessService], (service: GatewayBusinessService) => {
    expect(service).toBeTruthy();
  }));
});
