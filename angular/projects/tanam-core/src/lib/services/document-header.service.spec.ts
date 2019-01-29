import { TestBed } from '@angular/core/testing';
import { DocumentHeaderService } from './document-header.service';


describe('DocumentHeaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DocumentHeaderService = TestBed.get(DocumentHeaderService);
    expect(service).toBeTruthy();
  });
});
