import { TestBed } from '@angular/core/testing';
import { SiteThemeService } from './site-theme.service';

describe('ThemeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SiteThemeService = TestBed.get(SiteThemeService);
    expect(service).toBeTruthy();
  });
});
