import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { SiteInformation, Theme } from 'tanam-models';
import { SiteService } from '../../services/site.service';
import { ThemeService } from '../../services/theme.service';
import { MatDialog } from '@angular/material';
import { SettingsDialogManageLanguagesComponent } from './settings-dialog-manage-languages/settings-dialog-manage-languages.component';

// https://stackoverflow.com/a/26987741/7967164
const REGEX_DOMAIN = '^(((?!-))(xn--|_{1,1})?[a-z0-9-]{0,61}[a-z0-9]{1,1}\.)*(xn--)?([a-z0-9\-]{1,61}|[a-z0-9-]{1,30}\.[a-z]{2,})$';

@Component({
  selector: 'tanam-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  languages: String[] = [];
  readonly siteName$: Observable<string> = this.siteSettingsService.getSiteName();
  readonly themes$: Observable<Theme[]> = this.themeService.getThemes();
  readonly settingsForm: FormGroup = this.formBuilder.group({
    title: [null, [Validators.required]],
    theme: [null, [Validators.required]],
    defaultLanguage: [null, [Validators.required]],
    primaryDomain: [null, [Validators.required]],
    domains: this.formBuilder.array([], [
      Validators.required,
      Validators.minLength(1),
    ]),
  });

  private settingsSubscription: Subscription;

  constructor(
    private readonly siteSettingsService: SiteService,
    private readonly themeService: ThemeService,
    private readonly formBuilder: FormBuilder,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.settingsSubscription = this.siteSettingsService.getSiteInfo().subscribe(settings => {
      console.log(`[SettingsSiteComponent] site settings: ${JSON.stringify(settings)}`);
      while (this.domainsFormArray.length > 0) {
        this.domainsFormArray.removeAt(0);
      }
      for (const domain of settings.domains) {
        this.addDomain(domain);
      }
      this.languages = settings.languages;
      this.settingsForm.setValue({
        title: settings.title,
        theme: settings.theme,
        defaultLanguage: settings.defaultLanguage,
        primaryDomain: settings.primaryDomain,
        domains: settings.domains,
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
      // Removed the selected primary domain. Reset to default hosting as selected
      this.settingsForm.get('primaryDomain').setValue(this.getDomainNameAt(0));
    }

    this.domainsFormArray.removeAt(index);
  }

  dialogLanguage() {
    const dialogRef = this.dialog.open(SettingsDialogManageLanguagesComponent, {
      data: this.languages
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.status === 'submit') {
          this.languages = result.languages;
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

  saveSettings() {
    const formData = this.settingsForm.value;
    return this.siteSettingsService.save({
      title: formData.title,
      theme: formData.theme,
      defaultLanguage: formData.defaultLanguage,
      languages: this.languages,
      primaryDomain: formData.primaryDomain,
      domains: formData.domains.map((domain: any) => domain['name']),
    } as SiteInformation);
  }
}
