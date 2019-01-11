import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

export interface DomainSettings {
  isCustomDomain: boolean;
  primaryDomain: string;
  domains: string[];
}

@Component({
  selector: 'app-admin-settings-domain',
  templateUrl: './admin-settings-domain.component.html',
  styleUrls: ['./admin-settings-domain.component.scss']
})
export class AdminSettingsDomainComponent implements OnInit {
  readonly defaultHostingDomain: string;
  private _settingsDocumentRef: AngularFirestoreDocument;
  private _isLoading: boolean;
  private _settingsForm: FormGroup;

  constructor(afs: AngularFirestore, private formBuilder: FormBuilder) {
    this._isLoading = true;
    this.defaultHostingDomain = `${afs.firestore.app.options['projectId']}.firebaseapp.com`;
    this._settingsDocumentRef = afs.collection('tanam-settings').doc<DomainSettings>('domain');

    this._settingsDocumentRef.valueChanges().subscribe((data: DomainSettings) => {
      console.log(`[AdminSettingsDomainComponent] firestore doc: ${JSON.stringify(data)}`);
      const sortedDomains = this.sortDomains(data.domains.map(this.sanitizeDomain));
      this.selectedDomainForm.setValue(sortedDomains.indexOf(data.primaryDomain));
      while (this.domainsFormArray.length > 0) {
        this.domainsFormArray.removeAt(0);
      }
      for (const domain of sortedDomains) {
        this.addDomain(domain);
      }

      this._isLoading = false;
    });
  }

  ngOnInit() {
    this._settingsForm = this.formBuilder.group({
      selectedDomain: [null, [Validators.required]],
      domains: this.formBuilder.array([], [
        Validators.required,
        Validators.minLength(1),
      ]),
    });

  }

  get isLoading() {
    return this._isLoading;
  }

  get settingsForm() {
    return this._settingsForm;
  }

  get selectedDomainForm() {
    return this.settingsForm.get('selectedDomain');
  }

  get domainsFormArray() {
    return this.settingsForm.get('domains') as FormArray;
  }

  addDomain(domain?: string) {
    console.log(`[AdminSettingsDomainComponent:addDomain] ${JSON.stringify(domain)}`);
    const newDomainLine = this.formBuilder.group({
      name: [domain, [Validators.required]],
    });

    this.domainsFormArray.push(newDomainLine);
  }

  removeDomain(index: number) {
    if (index > 0) {
      this.domainsFormArray.removeAt(index);
      this.saveChanges();
    }
  }

  async saveChanges() {
    const formData = this.settingsForm.value;
    if (this.settingsForm.invalid) {
      console.log('[AdminSettingsDomainComponent:saveChanges] Form is not valid. Can not save data.');
      return;
    }

    const domains = formData.domains.map(domain => domain['name']);
    const primaryDomain = domains[formData.selectedDomain];
    const formSettingsData: DomainSettings = {
      primaryDomain,
      isCustomDomain: primaryDomain !== this.defaultHostingDomain,
      domains: this.sortDomains(domains.map(this.sanitizeDomain)),
    };

    console.log(`[AdminSettingsDomainComponent:saveChanges] ${JSON.stringify(formSettingsData)}`);
    this._isLoading = true;
    try {
      await this._settingsDocumentRef.update(formSettingsData);
    } catch (err) {
      console.error(JSON.stringify(err));
    } finally {
      this._isLoading = false;
    }
  }

  private sortDomains(domains: string[]) {
    const defaultDomainIndex = domains.indexOf(this.defaultHostingDomain);
    if (domains.length > 0 && defaultDomainIndex > 0) {
      // Move the default hosting domain to index ZERO
      domains.splice(defaultDomainIndex, 1);
      domains.splice(0, 0, this.defaultHostingDomain);
    }

    if (domains.length === 0 || defaultDomainIndex === -1) {
      // Array doesn't contain the default hosting domain. Insert it.
      domains.splice(0, 0, this.defaultHostingDomain);
    }

    return domains;
  }

  private sanitizeDomain(domain: string) {
    // Make sure that the format is only subdomain.domain.tld
    // and not including https:// or any paths like mydomain.com/abc
    return domain;
  }
}
