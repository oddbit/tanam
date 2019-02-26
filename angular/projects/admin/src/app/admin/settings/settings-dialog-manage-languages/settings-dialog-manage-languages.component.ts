import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SiteService } from '../../../services/site.service';

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
    private dialogRef: MatDialogRef<SettingsDialogManageLanguagesComponent >,
    private readonly siteSettingsService: SiteService,
    private readonly formBuilder: FormBuilder,

  ) { }


  ngOnInit() {
    this.siteSettingsService.getSiteInfo().subscribe(settings => {
      for (const language of settings.languages) {
        this.addLanguage(language);
      }
    });
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
    const languages = {
      languages: ['en', 'id', 'tes'],
      status: 'submit'
    };
    this.dialogRef.close(languages);
  }

}
