import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ThemeService } from '../../../services/theme.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'tanam-theme-edit',
  templateUrl: './theme-edit.component.html',
  styleUrls: ['./theme-edit.component.scss']
})
export class ThemeEditComponent {
  readonly theme$ = this.route.paramMap.pipe(switchMap(params => this.themeService.getTheme(params.get('themeId'))));
  readonly themeId = this.route.snapshot.paramMap.get('themeId');
  readonly onCancelRoute = `/_/admin/theme/${this.themeId}`;
  readonly afterSaveRoute = `/_/admin/theme/${this.themeId}`;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly themeService: ThemeService,
  ) { }
}
