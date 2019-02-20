import { TestBed, inject } from '@angular/core/testing';

import { ProjectTypeService } from './project-type.service';

describe('ProjectTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectTypeService]
    });
  });

  it('should be created', inject([ProjectTypeService], (service: ProjectTypeService) => {
    expect(service).toBeTruthy();
  }));
});
