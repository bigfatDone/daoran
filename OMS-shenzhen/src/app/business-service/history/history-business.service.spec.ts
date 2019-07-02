import { TestBed, inject } from '@angular/core/testing';

import { HistoryBusinessService } from './history-business.service';

describe('HistoryBusinessService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HistoryBusinessService]
    });
  });

  it('should be created', inject([HistoryBusinessService], (service: HistoryBusinessService) => {
    expect(service).toBeTruthy();
  }));
});
