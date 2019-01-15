import { TestBed } from '@angular/core/testing';

import { UserConfigService } from './user-config.service';

describe('UserConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserConfigService = TestBed.get(UserConfigService);
    expect(service).toBeTruthy();
  });
});
