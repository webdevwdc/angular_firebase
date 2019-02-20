import { ShiftModule } from './shift.module';

describe('ShiftModule', () => {
  let shiftModule: ShiftModule;

  beforeEach(() => {
    shiftModule = new ShiftModule();
  });

  it('should create an instance', () => {
    expect(shiftModule).toBeTruthy();
  });
});
