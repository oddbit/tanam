import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { ContentType, ContentTypeEntry } from '../app.definitions';
import { Observable } from 'rxjs';

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
  ) {
    this.contentTypeId = route.snapshot.paramMap.get('type');
    this.contentType$ = firestore
      .collection('tanam-content').doc<ContentType>(this.contentTypeId)
      .valueChanges();

    this.contentTypeFields$ = firestore
      .collection('tanam-content').doc(this.contentTypeId)
      .collection<ContentTypeEntry>('fields', ref => ref.orderBy('order', 'asc'))
      .valueChanges();
  }

  ngOnInit() {
  }

  exitDetails() {
    this.router.navigateByUrl(`/admin/content/${this.contentTypeId}`);
  }
}
