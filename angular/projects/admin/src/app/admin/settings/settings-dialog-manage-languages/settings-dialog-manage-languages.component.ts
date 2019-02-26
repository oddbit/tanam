import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tanam-settings-dialog-manage-languages',
  templateUrl: './settings-dialog-manage-languages.component.html',
  styleUrls: ['./settings-dialog-manage-languages.component.scss']
})
export class SettingsDialogManageLanguagesComponent implements OnInit {

  readonly languagesForm: FormGroup = this.formBuilder.group({
    languages: this.formBuilder.array([], [Validators.required]),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SettingsDialogManageLanguagesComponent >,
    private readonly formBuilder: FormBuilder,

  ) { }


  ngOnInit() {
    for (const language of this.data) {
      this.addLanguage(language);
    }
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

  save() {
    const formData = this.languagesForm.value;
    const languages = {
      languages: formData.languages.map((language: any) => language['name']),
      status: 'submit'
    };
    this.dialogRef.close(languages);
  }

}
