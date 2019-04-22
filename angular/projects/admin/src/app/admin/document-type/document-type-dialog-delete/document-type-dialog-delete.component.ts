import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'tanam-document-type-dialog-delete',
  templateUrl: './document-type-dialog-delete.component.html',
  styleUrls: ['./document-type-dialog-delete.component.scss']
})
export class DocumentTypeDialogDeleteComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DocumentTypeDialogDeleteComponent>
  ) { }

  closeDialog() {
    this.dialogRef.close('close');
  }

  delete() {
    this.dialogRef.close('delete');
  }

}
