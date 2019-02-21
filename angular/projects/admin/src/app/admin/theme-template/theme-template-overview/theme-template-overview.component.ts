import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Theme } from 'tanam-models';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'tanam-theme-template-overview',
  templateUrl: './theme-template-overview.component.html',
  styleUrls: ['./theme-template-overview.component.scss']
})
export class ThemeTemplateOverviewComponent implements OnInit {
  theme$: Observable<Theme>;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly siteThemeservice: ThemeService,
  ) { }

  ngOnInit() {
    this.theme$ = this.route.paramMap.pipe(switchMap(params => {
      const themeId = params.get('themeId');
      return this.siteThemeservice.getTheme(themeId);
    }));
  }

  async createNewTemplate(theme: Theme) {
    // TODO: Implement new way of creating template
    // const newId = await this.themeTemplateService.createTemplateInTheme(theme);
    // this.router.navigateByUrl(`/_/admin/templates/${newId}`);
  }

  editTheme(theme: Theme) {
    this.router.navigateByUrl(`/_/admin/theme/${theme.id}/edit`);
  }
}
