import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DocumentTypeDialogCreateComponent } from '../document-type-dialog-create/document-type-dialog-create.component';

@Component({
  selector: 'tanam-document-type-overview',
  templateUrl: './document-type-overview.component.html',
  styleUrls: ['./document-type-overview.component.scss']
})
export class DocumentTypeOverviewComponent {

  constructor(private dialog: MatDialog) {}

  createNewTypeDialog() {
    this.dialog.open(DocumentTypeDialogCreateComponent);
  }
}
