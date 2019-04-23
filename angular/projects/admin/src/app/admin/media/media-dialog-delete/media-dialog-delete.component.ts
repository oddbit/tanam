import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'tanam-media-dialog-delete',
  templateUrl: './media-dialog-delete.component.html',
  styleUrls: ['./media-dialog-delete.component.scss']
})
export class MediaDialogDeleteComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<MediaDialogDeleteComponent >
  ) { }

  closeDialog() {
    this.dialogRef.close('close');
  }

  delete() {
    this.dialogRef.close('delete');
  }

}
