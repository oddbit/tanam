import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'tanam-theme-template-edit',
  templateUrl: './theme-template-edit.component.html',
  styleUrls: ['./theme-template-edit.component.scss']
})
export class ThemeTemplateEditComponent implements OnInit {
  readonly templateId = this.route.snapshot.paramMap.get('templateId');
  readonly themeId = this.route.snapshot.paramMap.get('themeId');

  constructor(
    private readonly route: ActivatedRoute,
  ) { }

  ngOnInit() {
  }
}
