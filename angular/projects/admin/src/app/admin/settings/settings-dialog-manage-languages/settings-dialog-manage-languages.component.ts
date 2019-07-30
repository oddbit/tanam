import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { languageOptions } from '../settings.languages';
import { UserService } from '../../../services/user.service';

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
  ) {}


  ngOnInit() {
    this.sortLanguages(this.data.languages, this.data.defaultLanguage);
    for (let index = 0; index < this.data.languages.length; index++) {
      this.addLanguage(this.data.languages[index], index);
    }
    this.languages = this.languageOptions;
  }

  get languagesFormArray() {
    return this.languagesForm.get('languages') as FormArray;
  }

  addLanguage(language: string = this.languageOptions[0].id, index?: number) {
    console.log(`[SettingsLanguageComponent:addLanguage] ${JSON.stringify(language)}`);
    const isDisable = index === 0;
    const newLanguageLine = this.formBuilder.group({
      name: [
        {value: language, disabled: isDisable}, Validators.required,
      ],
    });

    this.languagesFormArray.push(newLanguageLine);
  }

  removeLanguage(index: number) {
    this.languagesFormArray.removeAt(index);
  }

  save() {
    const languagesArray = this.languagesForm.getRawValue().languages;
    const languages = {
      languages: languagesArray.map((language: any) => language['name']),
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
