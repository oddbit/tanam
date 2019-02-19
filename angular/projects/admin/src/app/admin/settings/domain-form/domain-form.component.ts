import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SiteInformation } from 'tanam-models';
import { SiteService } from '../../../services/site.service';

// https://stackoverflow.com/a/26987741/7967164
const REGEX_DOMAIN = '^(((?!-))(xn--|_{1,1})?[a-z0-9-]{0,61}[a-z0-9]{1,1}\.)*(xn--)?([a-z0-9\-]{1,61}|[a-z0-9-]{1,30}\.[a-z]{2,})$';

@Component({
  selector: 'app-domain-form',
  templateUrl: './domain-form.component.html',
  styleUrls: ['./domain-form.component.scss']
})
export class DomainFormComponent implements OnInit, OnDestroy {
  readonly settingsForm: FormGroup = this.formBuilder.group({
    primaryDomain: [null, [Validators.required]],
    domains: this.formBuilder.array([], [
      Validators.required,
      Validators.minLength(1),
    ]),
  });

  private settingsSubscription: Subscription;

  constructor(
    private readonly siteService: SiteService,
    private readonly formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    const domainSettings$ = this.siteService.getSiteInfo();
    this.settingsSubscription = domainSettings$.subscribe((data: SiteInformation) => {
      console.log(`[SettingsDomainComponent] firestore doc: ${JSON.stringify(data)}`);

      this.settingsForm.get('primaryDomain').setValue(data.primaryDomain);
      while (this.domainsFormArray.length > 0) {
        this.domainsFormArray.removeAt(0);
      }
      for (const domain of data.domains) {
        this.addDomain(domain);
      }
    });

  }

  ngOnDestroy() {
    if (this.settingsSubscription && !this.settingsSubscription.closed) {
      this.settingsSubscription.unsubscribe();
    }
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

  saveSettings() {
    const formData = this.settingsForm.value;

    if (this.settingsForm.invalid) {
      console.log('[SettingsDomainComponent:saveChanges] Form is not valid. Can not save data.');
      return;
    }


    return this.siteService.save({
      primaryDomain: formData.primaryDomain,
      domains: formData.domains.map((domain: any) => domain['name']),
    } as SiteInformation);
  }

  private getDomainNameAt(index: number) {
    return this.domainsFormArray.at(index).value['name'];
  }
}
