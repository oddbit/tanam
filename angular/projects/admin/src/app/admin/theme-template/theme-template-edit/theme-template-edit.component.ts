import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ThemeTemplateService } from '../../../services/theme-template.service';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'tanam-theme-template-edit',
  templateUrl: './theme-template-edit.component.html',
  styleUrls: ['./theme-template-edit.component.scss']
})
export class ThemeTemplateEditComponent {
  readonly theme$ = this.route.paramMap.pipe(switchMap(params => this.themeService.getTheme(params.get('themeId'))));
  readonly template$ = this.route.paramMap.pipe(switchMap(params =>
    this.themeTemplateService.getTemplate(params.get('themeId'), params.get('templateId')))
  );

  readonly templateId = this.route.snapshot.paramMap.get('templateId');
  readonly themeId = this.route.snapshot.paramMap.get('themeId');

  constructor(
    private readonly route: ActivatedRoute,
    private readonly themeService: ThemeService,
    private readonly themeTemplateService: ThemeTemplateService,
  ) { }
}
