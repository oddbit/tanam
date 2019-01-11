import { TestBed } from '@angular/core/testing';

import { ContentTypeFieldService } from './content-type-field.service';

describe('ContentTypeFieldService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContentTypeFieldService = TestBed.get(ContentTypeFieldService);
    expect(service).toBeTruthy();
  });
});
