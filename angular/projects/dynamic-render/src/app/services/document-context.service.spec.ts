import { TestBed } from '@angular/core/testing';

import { DocumentContextService } from './document-context.service';

describe('DocumentContextService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DocumentContextService = TestBed.get(DocumentContextService);
    expect(service).toBeTruthy();
  });
});
