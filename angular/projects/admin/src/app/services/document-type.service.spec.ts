import { TestBed } from '@angular/core/testing';
import { DocumentTypeService } from './document-type.service';


describe('DocumentTypeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DocumentTypeService = TestBed.get(DocumentTypeService);
    expect(service).toBeTruthy();
  });
});
