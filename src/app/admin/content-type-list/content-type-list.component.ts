import { Component, OnInit } from '@angular/core';
import { ContentTypeService, ContentType } from '../../services/content-type.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-content-type-list',
  templateUrl: './content-type-list.component.html',
  styleUrls: ['./content-type-list.component.scss']
})
export class ContentTypeListComponent implements OnInit {
  readonly contentTypes$ = this.cts.getContentTypes();

  constructor(private readonly cts: ContentTypeService) { }

  ngOnInit() { }
}
