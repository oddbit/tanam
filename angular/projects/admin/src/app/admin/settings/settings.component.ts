import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Theme } from 'tanam-models';
import { SiteService } from '../../services/site.service';
import { ThemeService } from '../../services/theme.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SettingsDialogManageLanguagesComponent } from './settings-dialog-manage-languages/settings-dialog-manage-languages.component';
import { languageOptions } from './settings.languages';
import { AppAuthService } from '../../services/app-auth.service';
import { AngularTanamSite } from '../../app.models';

// https://stackoverflow.com/a/26987741/7967164
const REGEX_DOMAIN = '^(((?!-))(xn--|_{1,1})?[a-z0-9-]{0,61}[a-z0-9]{1,1}\.)*(xn--)?([a-z0-9\-]{1,61}|[a-z0-9-]{1,30}\.[a-z]{2,})$';

@Component({
  selector: 'tanam-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  get languages() {
    return this.settingsForm.value.languages;
  }

  langOptions = languageOptions;
  analyticsName = '';
  readonly siteName$: Observable<string> = this.siteSettingsService.getSiteName();
  readonly themes$: Observable<Theme[]> = this.themeService.getThemes({ orderBy: { field: 'updated', sortOrder: 'desc' } });
  readonly settingsForm: FormGroup = this.formBuilder.group({
    title: [null, [Validators.required]],
    theme: [null, [Validators.required]],
    defaultLanguage: [null, [Validators.required]],
    primaryDomain: [null, [Validators.required]],
    analytics: [null],
    languages: [null],
    id: [null],
    domains: this.formBuilder.array([], [
      Validators.required,
      Validators.minLength(1),
    ]),
  });

  private settingsSubscription: Subscription;

  constructor(
    private readonly authService: AppAuthService,
    private readonly siteSettingsService: SiteService,
    private readonly themeService: ThemeService,
    private readonly formBuilder: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
  }

  ngOnInit() {
    this.settingsSubscription = this.siteSettingsService.getCurrentSite().subscribe(settings => {
      console.log(`[SettingsSiteComponent] site settings: ${JSON.stringify(settings)}`);
      while (this.domainsFormArray.length > 0) {
        this.domainsFormArray.removeAt(0);
      }
      for (const domain of settings.domains) {
        this.addDomain(domain);
      }

      this.settingsForm.valueChanges.subscribe(form => {
        const analyticsCode = (form.analytics as string).trim().toUpperCase();
        if (analyticsCode.startsWith('UA')) {
          this.analyticsName = 'Google Analytics';
        } else if (analyticsCode.startsWith('GTM')) {
          this.analyticsName = 'Google Tag Manager';
        } else {
          this.analyticsName = 'Analytics code not supported';
        }
      });

      this.settingsForm.patchValue({
        id: settings.id,
        title: settings.title,
        theme: settings.theme,
        defaultLanguage: settings.defaultLanguage,
        primaryDomain: settings.primaryDomain,
        analytics: settings.analytics,
        domains: settings.domains,
        languages: this.langOptions.filter(lang => {
          return settings.languages.includes(lang.id);
        })
      });

    });
  }

  get domainsFormArray() {
    return this.settingsForm.get('domains') as FormArray;
  }

  addDomain(domain?: string) {
    console.log(`[SettingsDomainComponent:addDomain] ${JSON.stringify(domain)}`);
    const newDomainLine = this.formBuilder.group({
      name: [
        domain, [
          Validators.required,
          Validators.pattern(REGEX_DOMAIN),
        ],
      ],
    });

    this.domainsFormArray.push(newDomainLine);
  }

  removeDomain(index: number) {
    if (index === 0) {
      return;
    }

    const removedDomain = this.getDomainNameAt(index);
    if (removedDomain === this.settingsForm.value.primaryDomain) {
      this.settingsForm.get('primaryDomain').setValue(this.getDomainNameAt(0));
    }

    this.domainsFormArray.removeAt(index);
  }

  dialogLanguage() {
    const dialogRef = this.dialog.open(SettingsDialogManageLanguagesComponent, {
      data: {
        languages: this.settingsForm.value.languages.map(lang => lang.id),
        defaultLanguage: this.settingsForm.value.defaultLanguage
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'submit') {
        this.settingsForm.controls['languages'].setValue(this.langOptions.filter(lang => {
          return result.languages.includes(lang.id);
        }));

        if (!result.languages.includes(this.settingsForm.value.defaultLanguage)) {
          this.settingsForm.patchValue({ defaultLanguage: result.languages[0] });
        }
      }
    });
  }

  private getDomainNameAt(index: number) {
    return this.domainsFormArray.at(index).value['name'];
  }

  ngOnDestroy() {
    if (this.settingsSubscription && !this.settingsSubscription.closed) {
      this.settingsSubscription.unsubscribe();
    }
  }

  logout() {
    return this.authService.logOut();
  }

  async saveSettings() {
    const formData = this.settingsForm.value;
    await this.siteSettingsService.save(new AngularTanamSite({
      ...formData,
      languages: formData.languages.map((lang: any) => lang['id']),
      domains: formData.domains.map((domain: any) => domain['name'])
    }));
    this.snackBar.open('Settings saved', 'Dismiss', {
      duration: 2000,
    });
  }
}
