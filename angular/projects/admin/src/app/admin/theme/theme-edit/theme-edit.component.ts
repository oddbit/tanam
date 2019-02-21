import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'tanam-theme-edit',
  templateUrl: './theme-edit.component.html',
  styleUrls: ['./theme-edit.component.scss']
})
export class ThemeEditComponent implements OnInit {
  readonly themeId = this.route.snapshot.paramMap.get('themeId');
  readonly onCancelRoute = `/_/admin/themes/${this.themeId}`;
  readonly afterSaveRoute = `/_/admin/themes/${this.themeId}`;

  constructor(private readonly route: ActivatedRoute) { }

  ngOnInit() {
  }

}
