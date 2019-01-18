import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ThemeService } from '../../../services/theme.service';
import { SiteSettingsService, SiteInfoSettings } from '../../../services/site-settings.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-site-form',
  templateUrl: './site-form.component.html',
  styleUrls: ['./site-form.component.scss']
})
export class SiteFormComponent implements OnInit, OnDestroy {
  pageTitleFormatOptions: String[];

  readonly siteName$ = this.siteSettingsService.getSiteName();
  readonly themes$ = this.themeService.getThemes();
  readonly settingsForm = this.formBuilder.group({
    title: [null, [Validators.required]],
    pageTitleFormat: [null, [Validators.required]],
    theme: [null, [Validators.required]],
  });

  private settingsSubscription: Subscription;

  constructor(
    private readonly siteSettingsService: SiteSettingsService,
    private readonly themeService: ThemeService,
    private readonly formBuilder: FormBuilder,
  ) { }


  ngOnInit() {
    this.settingsSubscription = this.siteSettingsService.getSiteSettings().subscribe(settings => {
      console.log(`[SettingsSiteComponent] site settings: ${JSON.stringify(settings)}`);
      this.settingsForm.setValue({
        title: settings.title,
        pageTitleFormat: settings.pageTitleFormat,
        theme: settings.theme,
      });
    });

    this.onTitleChanges();
  }

  onTitleChanges(): void {
    this.settingsForm.valueChanges.subscribe(value => {
      const { title } = value;
      this.pageTitleFormatOptions = [
        title + ' | My Blog Post',
        title + ' • My Blog Post',
        title
      ];
    });
  }

  ngOnDestroy() {
    if (this.settingsSubscription && !this.settingsSubscription.closed) {
      this.settingsSubscription.unsubscribe();
    }
  }

  saveSettings() {
    const formData = this.settingsForm.value;
    return this.siteSettingsService.saveSiteSettings(formData as SiteInfoSettings);
  }
}
