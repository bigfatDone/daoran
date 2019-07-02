import { TestBed, inject } from '@angular/core/testing';

import { JumpBusinessService } from './jump-business.service';

describe('JumpBusinessService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JumpBusinessService]
    });
  });

  it('should be created', inject([JumpBusinessService], (service: JumpBusinessService) => {
    expect(service).toBeTruthy();
  }));
});
