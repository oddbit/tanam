import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ContentType, ContentTypeEntry } from '../app.definitions';

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
  ) {
    this.contentTypeId = route.snapshot.paramMap.get('type');

    this.contentType$ = firestore
      .collection('tanam-content').doc<ContentType>(this.contentTypeId)
      .valueChanges();

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
