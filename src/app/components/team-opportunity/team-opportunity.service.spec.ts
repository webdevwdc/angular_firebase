import { TestBed, inject } from '@angular/core/testing';

import { TeamOpportunityService } from './team-opportunity.service';

describe('TeamOpportunityService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TeamOpportunityService]
    });
  });

  it('should be created', inject([TeamOpportunityService], (service: TeamOpportunityService) => {
    expect(service).toBeTruthy();
  }));
});
