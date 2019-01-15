import { TestBed } from '@angular/core/testing';

import { ContentTemplateService } from './content-template.service';

describe('ContentTemplateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContentTemplateService = TestBed.get(ContentTemplateService);
    expect(service).toBeTruthy();
  });
});
