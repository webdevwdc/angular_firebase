import { TeamContractsModule } from './team-contracts.module';

describe('TeamContractsModule', () => {
  let teamContractsModule: TeamContractsModule;

  beforeEach(() => {
    teamContractsModule = new TeamContractsModule();
  });

  it('should create an instance', () => {
    expect(teamContractsModule).toBeTruthy();
  });
});
