import { TestBed } from '@angular/core/testing';

import { CalculationsServiceService } from './calculations-service.service';

describe('CalculationsServiceService', () => {
  let service: CalculationsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculationsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
