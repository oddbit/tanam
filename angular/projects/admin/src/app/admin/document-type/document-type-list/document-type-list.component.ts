import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentTypeService } from '../../../services/document-type.service';
import { map, tap } from 'rxjs/operators';
import { DocumentType } from '../../../../../../../../functions/src/models';
import { IPageInfo } from 'ngx-virtual-scroller';

@Component({
  selector: 'tanam-document-type-list',
  templateUrl: './document-type-list.component.html',
  styleUrls: ['./document-type-list.component.scss']
})
export class DocumentTypeListComponent {
  items: DocumentType[] = [];
  limit = 20;
  isLoading: boolean;
  isLastItem: boolean;

  constructor(
    private readonly router: Router,
    private readonly documentTypeService: DocumentTypeService,
  ) { }

  editDocumentType(documentTypeId: string) {
    const url = `/_/admin/type/${documentTypeId}/edit`;
    this.router.navigateByUrl(url);
  }

  async fetchMore(event: IPageInfo) {
    if (event.endIndex !== this.items.length - 1 || this.isLastItem) {
      return;
    }
    this.isLoading = true;
    const lastItem = this.items.length > 0 ? this.items[this.items.length - 1].id : null;
    let lastVisible = null;
    if (lastItem) {
      lastVisible = await this.documentTypeService.getReference(lastItem);
    }
    this.fetchItems(lastVisible);
  }

  fetchItems(lastVisible: firebase.firestore.DocumentSnapshot) {
    this.documentTypeService.getDocumentTypes({
      startAfter: lastVisible,
      limit: this.limit,
      orderBy: {
        field: 'title',
        sortOrder: 'asc'
      }
    }).pipe(
      tap(assets => {
        if (!assets.length || assets.length < this.limit) {
          this.isLastItem = true;
        }
      }),
      map(assets => {
        const mergedassets = [...this.items, ...assets];
        return mergedassets.reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {});
      }),
      map(v => Object.values(v).sort(this.sortItems))
    ).subscribe((items: DocumentType[]) => {
      this.items = [...items];
      this.isLoading = false;
    });
  }

  sortItems(a: DocumentType, b: DocumentType) {
    const itemA = a.title.toLowerCase();
    const itemB = b.title.toLowerCase();
    if (itemA > itemB) {
      return 1;
    } else if (itemA < itemB) {
      return -1;
    } else {
      return 0;
    }
  }
}
