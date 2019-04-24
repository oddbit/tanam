import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'tanam-media-dialog-detail',
  templateUrl: './media-dialog-detail.component.html',
  styleUrls: ['./media-dialog-detail.component.scss']
})
export class MediaDialogDetailComponent {

    constructor(
      @Inject(MAT_DIALOG_DATA) public data: any,
      private dialogRef: MatDialogRef<MediaDialogDetailComponent>
    ) { }

    closeDialog() {
      this.dialogRef.close();
    }

}
