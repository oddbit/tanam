import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { DocumentType } from 'tanam-models';
import { ContentEntryService } from '../../../services/content-entry.service';
import { ContentEntryListDataSource } from './content-entry-list-datasource';

@Component({
  selector: 'app-content-entry-list',
  templateUrl: './content-entry-list.component.html',
  styleUrls: ['./content-entry-list.component.scss']
})
export class ContentEntryListComponent implements OnInit, OnDestroy {
  @Input() documentType$: Observable<DocumentType>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: ContentEntryListDataSource;
  private _documentTypeSubscription: Subscription;

  constructor(
    private readonly router: Router,
    private readonly contentEntryService: ContentEntryService,
  ) { }

  displayedColumns = ['title', 'updated'];

  ngOnInit() {
    this._documentTypeSubscription = this.documentType$.subscribe(documentType => {
      this.dataSource = new ContentEntryListDataSource(documentType, this.contentEntryService, this.paginator, this.sort);
    });
  }

  ngOnDestroy() {
    if (this._documentTypeSubscription && !this._documentTypeSubscription.closed) {
      this._documentTypeSubscription.unsubscribe();
    }
  }

  editEntry(entryId: string) {
    const url = `/_/admin/entries/${entryId}`;
    this.router.navigateByUrl(url);
  }
}
