import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ContentTypeService, ContentType } from '../content-type/content-type.service';
import { ContentTypeEntryService, ContentTypeEntry } from '../content-type-entry.service';

@Component({
  selector: 'app-content-type',
  templateUrl: './content-type.component.html',
  styleUrls: ['./content-type.component.scss']
})
export class ContentTypeOverviewComponent implements OnInit {
  readonly contentTypeId;
  contentType$: Observable<ContentType>;
  contentTypeEntries$: Observable<ContentTypeEntry[]>;

  constructor(
    private readonly router: Router,
    readonly firestore: AngularFirestore,
    readonly route: ActivatedRoute,
    readonly cts: ContentTypeService,
    readonly ctes: ContentTypeEntryService,
  ) {
    this.contentTypeId = route.snapshot.paramMap.get('type');
    this.contentType$ = cts.getContentType(this.contentTypeId);
    this.contentTypeEntries$ = ctes.getContentTypeFields(this.contentTypeId, {
      limit: 20,
      orderBy: {
        field: 'updateTime',
        sortOrder: 'desc',
      },
    });
  }

  ngOnInit() {
  }

  navigateToContentTypeDetails() {
    this.router.navigateByUrl(`/admin/content/${this.contentTypeId}/details`);
  }
}
