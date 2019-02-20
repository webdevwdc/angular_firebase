import { TestBed, inject } from '@angular/core/testing';

import { CoOrdinatorService } from './co-ordinator.service';

describe('CoOrdinatorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoOrdinatorService]
    });
  });

  it('should be created', inject([CoOrdinatorService], (service: CoOrdinatorService) => {
    expect(service).toBeTruthy();
  }));
});
