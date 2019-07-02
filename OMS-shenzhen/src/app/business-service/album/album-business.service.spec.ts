import { TestBed, inject } from '@angular/core/testing';

import { ProgramBusinessService } from './program-business.service';

describe('ProgramBusinessService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProgramBusinessService]
    });
  });

  it('should be created', inject([ProgramBusinessService], (service: ProgramBusinessService) => {
    expect(service).toBeTruthy();
  }));
});
