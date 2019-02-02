import { TestBed } from '@angular/core/testing';
import { ContentFileService } from './content-file.service';


describe('FileService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContentFileService = TestBed.get(ContentFileService);
    expect(service).toBeTruthy();
  });
});
