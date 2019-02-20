import { TeamOpportunityModule } from './team-opportunity.module';

describe('TeamOpportunityModule', () => {
  let teamOpportunityModule: TeamOpportunityModule;

  beforeEach(() => {
    teamOpportunityModule = new TeamOpportunityModule();
  });

  it('should create an instance', () => {
    expect(teamOpportunityModule).toBeTruthy();
  });
});
