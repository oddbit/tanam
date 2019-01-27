import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ContentTemplateService } from '../../../services/content-template.service';
import { TanamTheme, ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-content-template-overview',
  templateUrl: './content-template-overview.component.html',
  styleUrls: ['./content-template-overview.component.scss']
})
export class ContentTemplateOverviewComponent implements OnInit {
  theme$: Observable<TanamTheme>;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly themeService: ThemeService,
    private readonly contentTemplateService: ContentTemplateService,
  ) { }

  ngOnInit() {
    this.theme$ = this.route.paramMap.pipe(switchMap(params => {
      const themeId = params.get('themeId');
      return this.themeService.getTheme(themeId);
    }));
  }

  async createNewTemplate(theme: TanamTheme) {
    const newId = await this.contentTemplateService.createTemplateInTheme(theme);
    this.router.navigateByUrl(`/_/admin/templates/${newId}`);
  }
}
