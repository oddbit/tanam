import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';

@Component({
  selector: 'tanam-settings-dialog-manage-languages',
  templateUrl: './settings-dialog-manage-languages.component.html',
  styleUrls: ['./settings-dialog-manage-languages.component.scss']
})
export class SettingsDialogManageLanguagesComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<SettingsDialogManageLanguagesComponent >,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  save() {
    const languages = {
      languages: ['en', 'id', 'tes'],
      status: 'submit'
    };
    this.dialogRef.close(languages);
  }

}
