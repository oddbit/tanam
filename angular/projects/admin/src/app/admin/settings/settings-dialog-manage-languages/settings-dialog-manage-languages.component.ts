import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { languageOptions } from '../settings.languages';

export interface LanguageOptions {
  id: string; // en, id, se...
  title: string; // English title
  nativeTitle: string; // Untranslated title of the language in its own local alphabet and language
}

@Component({
  selector: 'tanam-settings-dialog-manage-languages',
  templateUrl: './settings-dialog-manage-languages.component.html',
  styleUrls: ['./settings-dialog-manage-languages.component.scss']
})
export class SettingsDialogManageLanguagesComponent implements OnInit {
  languages: LanguageOptions[] = [];
  readonly languageOptions: LanguageOptions[] = languageOptions;
  readonly languagesForm: FormGroup = this.formBuilder.group({
    languages: this.formBuilder.array([], [Validators.required]),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SettingsDialogManageLanguagesComponent >,
    private readonly formBuilder: FormBuilder,

  ) { }


  ngOnInit() {
    this.sortLanguages(this.data.languages, this.data.defaultLanguage);
    for (const language of this.data.languages) {
      this.addLanguage(language);
    }
    this.languages = this.languageOptions;
  }

  get languagesFormArray() {
    return this.languagesForm.get('languages') as FormArray;
  }

  addLanguage(language?: string) {
    console.log(`[SettingsLanguageComponent:addLanguage] ${JSON.stringify(language)}`);
    const newLanguageLine = this.formBuilder.group({
      name: [
        language, [
          Validators.required,
        ],
      ],
    });

    this.languagesFormArray.push(newLanguageLine);
  }

  removeLanguage(index: number) {
    this.languagesFormArray.removeAt(index);
  }

  save() {
    const formData = this.languagesForm.value;
    const languages = {
      languages: formData.languages.map((language: any) => language['name']),
      status: 'submit'
    };
    this.dialogRef.close(languages);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  private sortLanguages (languages: string[], defaultLanguage: string) {
    languages.splice(languages.indexOf(defaultLanguage), 1);
    languages.splice(0, 0, defaultLanguage);
  }

}
