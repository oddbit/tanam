import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-content-template-edit',
  templateUrl: './content-template-edit.component.html',
  styleUrls: ['./content-template-edit.component.scss']
})
export class ContentTemplateEditComponent implements OnInit {
  readonly templateId = this.route.snapshot.paramMap.get('templateId');
  constructor(
    private readonly route: ActivatedRoute,
  ) { }

  ngOnInit() {
  }
}
