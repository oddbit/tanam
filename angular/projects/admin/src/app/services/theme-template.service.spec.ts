import { TestBed } from '@angular/core/testing';
import { ThemeTemplateService } from './theme-template.service';


describe('ThemeTemplateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ThemeTemplateService = TestBed.get(ThemeTemplateService);
    expect(service).toBeTruthy();
  });
});
