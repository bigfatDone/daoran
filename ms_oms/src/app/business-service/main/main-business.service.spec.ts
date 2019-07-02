import { TestBed, inject } from '@angular/core/testing';

import { MainBusinessService } from './main-business.service';

describe('MainBusinessService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MainBusinessService]
    });
  });

  it('should be created', inject([MainBusinessService], (service: MainBusinessService) => {
    expect(service).toBeTruthy();
  }));
});
