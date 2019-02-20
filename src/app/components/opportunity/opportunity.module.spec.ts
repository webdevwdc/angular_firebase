import { OpportunityModule } from './opportunity.module';

describe('OpportunityModule', () => {
  let opportunityModule: OpportunityModule;

  beforeEach(() => {
    opportunityModule = new OpportunityModule();
  });

  it('should create an instance', () => {
    expect(opportunityModule).toBeTruthy();
  });
});
