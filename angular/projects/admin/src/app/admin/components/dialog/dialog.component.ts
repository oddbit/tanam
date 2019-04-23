import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'tanam-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DialogComponent>
  ) { }

  ngOnInit() {
    console.log(this.data);
  }

  closeDialog() {
    this.dialogRef.close('close');
  }

  delete() {
    this.dialogRef.close('delete');
  }

}
