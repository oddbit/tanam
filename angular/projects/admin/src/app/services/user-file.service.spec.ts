import { TestBed } from '@angular/core/testing';
import { UserFileService } from './user-file.service';


describe('FileService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserFileService = TestBed.get(UserFileService);
    expect(service).toBeTruthy();
  });
});
