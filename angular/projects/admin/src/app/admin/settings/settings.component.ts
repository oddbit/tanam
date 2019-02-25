import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { SiteInformation, Theme } from 'tanam-models';
import { SiteService } from '../../services/site.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'tanam-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  readonly siteName$: Observable<string> = this.siteSettingsService.getSiteName();
  readonly themes$: Observable<Theme[]> = this.themeService.getThemes();
  readonly settingsForm: FormGroup = this.formBuilder.group({
    title: [null, [Validators.required]],
    theme: [null, [Validators.required]],
  });

  private settingsSubscription: Subscription;

  constructor(
    private readonly siteSettingsService: SiteService,
    private readonly themeService: ThemeService,
    private readonly formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.settingsSubscription = this.siteSettingsService.getSiteInfo().subscribe(settings => {
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
    return this.siteSettingsService.save(formData as SiteInformation);
  }
}
