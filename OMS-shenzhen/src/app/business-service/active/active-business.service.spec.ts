import { TestBed, inject } from '@angular/core/testing';

import { ActiveBusinessService } from './active-business.service';

describe('ProgramBusinessService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActiveBusinessService]
    });
  });

  it('should be created', inject([ActiveBusinessService], (service: ActiveBusinessService) => {
    expect(service).toBeTruthy();
  }));
});
