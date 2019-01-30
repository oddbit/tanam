import { TestBed } from '@angular/core/testing';

import { TanamConfigService } from './tanam-config.service';

describe('TanamConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TanamConfigService = TestBed.get(TanamConfigService);
    expect(service).toBeTruthy();
  });
});
