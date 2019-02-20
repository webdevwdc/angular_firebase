import { CoOrdinatorModule } from './co-ordinator.module';

describe('CoOrdinatorModule', () => {
  let coOrdinatorModule: CoOrdinatorModule;

  beforeEach(() => {
    coOrdinatorModule = new CoOrdinatorModule();
  });

  it('should create an instance', () => {
    expect(coOrdinatorModule).toBeTruthy();
  });
});
