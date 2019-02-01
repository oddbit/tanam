import { TestBed } from '@angular/core/testing';

import { PublishedDocumentService } from './published-document.service';

describe('PublishedDocumentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PublishedDocumentService = TestBed.get(PublishedDocumentService);
    expect(service).toBeTruthy();
  });
});
