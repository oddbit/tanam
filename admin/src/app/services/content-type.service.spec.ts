import { TestBed } from '@angular/core/testing';

import { ContentTypeService } from './content-type.service';

describe('ContentTypeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContentTypeService = TestBed.get(ContentTypeService);
    expect(service).toBeTruthy();
  });
});
