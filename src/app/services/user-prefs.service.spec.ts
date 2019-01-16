import { TestBed } from '@angular/core/testing';

import { UserPrefsService } from './user-prefs.service';

describe('UserPrefsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserPrefsService = TestBed.get(UserPrefsService);
    expect(service).toBeTruthy();
  });
});
