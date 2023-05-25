import { TestBed } from '@angular/core/testing';

import { EventStreamsService } from './event-streams.service';

describe('EventStreamsService', () => {
  let service: EventStreamsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventStreamsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
