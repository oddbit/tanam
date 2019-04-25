import { TestBed } from '@angular/core/testing';

import { DialogConfirmService } from './dialogConfirm.service';

describe('DialogConfirmService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DialogConfirmService = TestBed.get(DialogConfirmService);
    expect(service).toBeTruthy();
  });
});
