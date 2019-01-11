import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ContentTypeService } from '../content-type.service';
import { ContentTypeFieldService } from '../content-type-field.service';

@Component({
  selector: 'app-content-type-details',
  templateUrl: './content-type-details.component.html',
  styleUrls: ['./content-type-details.component.scss']
})
export class ContentTypeDetailsComponent implements OnInit {
  readonly contentTypeId: string;
  readonly contentType$: Observable<any>;
  readonly contentTypeFields$: Observable<any[]>;

  constructor(
    private readonly router: Router,
    readonly firestore: AngularFirestore,
    readonly route: ActivatedRoute,
    readonly cts: ContentTypeService,
    readonly ctfs: ContentTypeFieldService,
  ) {
    this.contentTypeId = route.snapshot.paramMap.get('type');
    this.contentType$ = cts.getContentType(this.contentTypeId);
    this.contentTypeFields$ = ctfs.getContentTypeFields(this.contentTypeId);
  }

  ngOnInit() {
  }

  navigateToContentTypeOverview() {
    this.router.navigateByUrl(`/admin/content/${this.contentTypeId}`);
  }
}
