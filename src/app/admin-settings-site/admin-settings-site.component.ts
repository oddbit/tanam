import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface SiteSettings {
  title: string;
  theme: string;
}

@Component({
  selector: 'app-admin-settings-site',
  templateUrl: './admin-settings-site.component.html',
  styleUrls: ['./admin-settings-site.component.scss']
})
export class AdminSettingsSiteComponent implements OnInit {
  private _isLoading: boolean;
  private _settingsForm: FormGroup;
  private _settingsDocumentRef: AngularFirestoreDocument;
  readonly themes: Observable<any[]>;

  constructor(firestore: AngularFirestore, private formBuilder: FormBuilder) {
    this._isLoading = true;
    this._settingsDocumentRef = firestore.collection('tanam-settings').doc<SiteSettings>('site');
    this._settingsDocumentRef.valueChanges().subscribe((data: SiteSettings) => {
      console.log(`[AdminSettingsSiteComponent] site settings: ${JSON.stringify(data)}`);
      this._settingsForm.setValue({
        title: data.title,
        theme: data.theme,
      });
      this._isLoading = false;
    });

    this.themes = firestore.collection('tanam-themes')
      .snapshotChanges().pipe(map(actions => actions.map(x => {
        console.log(`[AdminSettingsSiteComponent] theme: ${JSON.stringify(x.payload.doc.id)}`);
        return { id: x.payload.doc.id, ...x.payload.doc.data() };
      })));
  }

  ngOnInit() {
    this._settingsForm = this.formBuilder.group({
      title: [null, [Validators.required]],
      theme: [null, [Validators.required]],
    });
  }

  get isLoading() {
    return this._isLoading;
  }

  get settingsForm() {
    return this._settingsForm;
  }

  async saveChanges() {
    const formData = this.settingsForm.value;

    const formSettingsData: SiteSettings = {
      title: formData.title,
      theme: formData.theme,
    };

    console.log(`[AdminSettingsSiteComponent:saveChanges] ${JSON.stringify(formSettingsData)}`);
    this._isLoading = true;
    try {
      await this._settingsDocumentRef.update(formSettingsData);
    } catch (err) {
      console.error(JSON.stringify(err));
    } finally {
      this._isLoading = false;
    }
  }
}
