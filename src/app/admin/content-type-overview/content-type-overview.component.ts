import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ContentTypeService, ContentType } from '../content-type/content-type.service';
import { ContentEntryService } from '../content-entry/content-entry.service';

@Component({
  selector: 'app-content-type-overview',
  templateUrl: './content-type-overview.component.html',
  styleUrls: ['./content-type-overview.component.scss']
})
export class ContentTypeOverviewComponent implements OnInit {
  readonly contentTypeId;
  contentType$: Observable<ContentType>;

  constructor(
    private readonly router: Router,
    readonly firestore: AngularFirestore,
    readonly route: ActivatedRoute,
    readonly cts: ContentTypeService,
    readonly ctes: ContentEntryService,
  ) {
    this.contentTypeId = route.snapshot.paramMap.get('typeId');
    this.contentType$ = cts.getContentType(this.contentTypeId);
  }

  ngOnInit() {
  }

  navigateToContentTypeDetails() {
    this.router.navigateByUrl(`/admin/content/type/${this.contentTypeId}/edit`);
  }

  async createNewEntry() {
    const doc = await this.ctes.createContentEntry(this.contentTypeId);
    this.router.navigateByUrl(`/admin/content/entry/${this.contentTypeId}/${doc.ref.id}/edit`);
  }
}
