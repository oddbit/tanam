import { TestBed, async, inject } from '@angular/core/testing';

import { PublisherGuard } from './publisher.guard';

describe('PublisherGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PublisherGuard]
    });
  });

  it('should ...', inject([PublisherGuard], (guard: PublisherGuard) => {
    expect(guard).toBeTruthy();
  }));
});
