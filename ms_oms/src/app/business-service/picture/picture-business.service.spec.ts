import { TestBed, inject } from '@angular/core/testing';

import { PictureBusinessService } from './picture-business.service';

describe('PictureBusinessService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PictureBusinessService]
    });
  });

  it('should be created', inject([PictureBusinessService], (service: PictureBusinessService) => {
    expect(service).toBeTruthy();
  }));
});
