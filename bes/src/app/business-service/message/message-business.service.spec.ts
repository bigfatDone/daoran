import { TestBed, inject } from '@angular/core/testing';

import { ArtistsBusinessService } from './artists-business.service';

describe('ArtistsBusinessService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArtistsBusinessService]
    });
  });

  it('should be created', inject([ArtistsBusinessService], (service: ArtistsBusinessService) => {
    expect(service).toBeTruthy();
  }));
});
