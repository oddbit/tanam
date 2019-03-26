import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'tanam-file-picker-dialog',
  templateUrl: './file-picker-dialog.component.html',
  styleUrls: ['./file-picker-dialog.component.scss']
})
export class FilePickerDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<FilePickerDialogComponent>) {}

  private images = [];
  private selectedImage = '';

  ngOnInit() {
    for (let index = 0; index < 10 ; index++) {
      this.images.push(
        {
          id: `image${index}`,
          src: `http://lorempixel.com/400/200/sports/${index}/`
        });
    }
  }

  selectImage(image: any) {
    this.selectedImage = image;
  }

  chooseFile() {
    console.log(this.selectedImage);
    this.dialogRef.close();
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
