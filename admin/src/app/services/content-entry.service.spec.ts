import { TestBed } from '@angular/core/testing';

import { ContentEntryService } from './content-entry.service';

describe('ContentEntryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContentEntryService = TestBed.get(ContentEntryService);
    expect(service).toBeTruthy();
  });
});
