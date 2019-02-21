import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ContentTypeService } from '../../../services/content-type.service';

@Component({
  selector: 'app-content-type-edit',
  templateUrl: './content-type-edit.component.html',
  styleUrls: ['./content-type-edit.component.scss']
})
export class ContentTypeEditComponent {
  documentType$ = this.route.paramMap.pipe(switchMap(params => this.cts.getContentType(params.get('typeId'))));

  constructor(
    private readonly route: ActivatedRoute,
    private readonly cts: ContentTypeService,
  ) { }
}
