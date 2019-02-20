import { AssociateModule } from './associate.module';

describe('AssociateModule', () => {
  let associateModule: AssociateModule;

  beforeEach(() => {
    associateModule = new AssociateModule();
  });

  it('should create an instance', () => {
    expect(associateModule).toBeTruthy();
  });
});
