import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { SiteInformation, Theme } from 'tanam-models';
import { SiteService } from '../../services/site.service';
import { ThemeService } from '../../services/theme.service';

// https://stackoverflow.com/a/26987741/7967164
const REGEX_DOMAIN = '^(((?!-))(xn--|_{1,1})?[a-z0-9-]{0,61}[a-z0-9]{1,1}\.)*(xn--)?([a-z0-9\-]{1,61}|[a-z0-9-]{1,30}\.[a-z]{2,})$';

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
  ) { }

  ngOnInit() {
    this.settingsSubscription = this.siteSettingsService.getSiteInfo().subscribe(settings => {
      console.log(`[SettingsSiteComponent] site settings: ${JSON.stringify(settings)}`);
      this.settingsForm.get('primaryDomain').setValue(settings.primaryDomain);
      while (this.domainsFormArray.length > 0) {
        this.domainsFormArray.removeAt(0);
      }
      for (const domain of settings.domains) {
        console.log(domain);
        this.addDomain(domain);
      }
      this.settingsForm.setValue({
        title: settings.title,
        theme: settings.theme
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
    return this.siteSettingsService.save(formData as SiteInformation);
  }
}
