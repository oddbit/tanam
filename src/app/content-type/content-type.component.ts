import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ContentTypeEntry } from '../app.definitions';
import { ContentTypeService, ContentType } from '../content-type.service';

@Component({
  selector: 'app-content-type',
  templateUrl: './content-type.component.html',
  styleUrls: ['./content-type.component.scss']
})
export class ContentTypeComponent implements OnInit {
  readonly contentTypeId;
  contentType$: Observable<ContentType>;
  contentTypeEntries$: Observable<ContentTypeEntry[]>;

  constructor(
    private readonly router: Router,
    readonly firestore: AngularFirestore,
    readonly route: ActivatedRoute,
    readonly cts: ContentTypeService,
  ) {
    this.contentTypeId = route.snapshot.paramMap.get('type');
    this.contentType$ = cts.getContentType(this.contentTypeId);

    this.contentTypeEntries$ = firestore
      .collection('tanam-content').doc(this.contentTypeId)
      .collection<ContentTypeEntry>('entries', ref => ref.orderBy('updateTime').limit(20))
      .valueChanges();
  }

  ngOnInit() {
  }

  editContentType() {
    this.router.navigateByUrl(`/admin/content/${this.contentTypeId}/details`);
  }
}
