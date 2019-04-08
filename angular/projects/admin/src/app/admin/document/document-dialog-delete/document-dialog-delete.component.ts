import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'tanam-document-dialog-delete',
  templateUrl: './document-dialog-delete.component.html',
  styleUrls: ['./document-dialog-delete.component.scss']
})
export class DocumentDialogDeleteComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DocumentDialogDeleteComponent >
  ) { }

  closeDialog() {
    this.dialogRef.close('close');
  }

  delete() {
    this.dialogRef.close('delete');
  }

}
