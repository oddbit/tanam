import { TestBed } from '@angular/core/testing';

import { DynamicPageService } from './dynamic-page.service';

describe('DynamicPageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DynamicPageService = TestBed.get(DynamicPageService);
    expect(service).toBeTruthy();
  });
});
