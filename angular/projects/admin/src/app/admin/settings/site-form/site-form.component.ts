import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { SiteInfoSettings, SiteSettingsService, SiteThemeService, TanamTheme } from 'tanam-core';

@Component({
  selector: 'app-site-form',
  templateUrl: './site-form.component.html',
  styleUrls: ['./site-form.component.scss']
})
export class SiteFormComponent implements OnInit, OnDestroy {
  readonly siteName$: Observable<string> = this.siteSettingsService.getSiteName();
  readonly themes$: Observable<TanamTheme[]> = this.themeService.getThemes();
  readonly settingsForm: FormGroup = this.formBuilder.group({
    title: [null, [Validators.required]],
    theme: [null, [Validators.required]],
  });

  private settingsSubscription: Subscription;

  constructor(
    private readonly siteSettingsService: SiteSettingsService,
    private readonly themeService: SiteThemeService,
    private readonly formBuilder: FormBuilder,
  ) { }


  ngOnInit() {
    this.settingsSubscription = this.siteSettingsService.getSiteSettings().subscribe(settings => {
      console.log(`[SettingsSiteComponent] site settings: ${JSON.stringify(settings)}`);
      this.settingsForm.setValue({
        title: settings.title,
        theme: settings.theme,
      });
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
