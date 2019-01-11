import { TestBed } from '@angular/core/testing';

import { ContentTypeEntryService } from './content-type-entry.service';

describe('ContentTypeEntryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContentTypeEntryService = TestBed.get(ContentTypeEntryService);
    expect(service).toBeTruthy();
  });
});
