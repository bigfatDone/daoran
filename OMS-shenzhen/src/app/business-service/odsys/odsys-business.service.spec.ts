import { TestBed, inject } from '@angular/core/testing';

import { OdsysBusinessService } from './odsys-business.service';

describe('OdsysBusinessService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OdsysBusinessService]
    });
  });

  it('should be created', inject([OdsysBusinessService], (service: OdsysBusinessService) => {
    expect(service).toBeTruthy();
  }));
});
