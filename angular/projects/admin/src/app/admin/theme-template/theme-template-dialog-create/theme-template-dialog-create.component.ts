import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { DocumentTypeService } from '../../../services/document-type.service';
import { DocumentTypeDialogCreateComponent } from '../../document-type/document-type-dialog-create/document-type-dialog-create.component';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ThemeTemplateService } from '../../../services/theme-template.service';

@Component({
  selector: 'tanam-theme-template-dialog-create',
  templateUrl: './theme-template-dialog-create.component.html',
  styleUrls: ['./theme-template-dialog-create.component.scss']
})
export class ThemeTemplateDialogCreateComponent {
  readonly createTemplateForm: FormGroup = this.formBuilder.group({
    title: [null, [Validators.required]],
    selector: [null, [Validators.required]],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ThemeTemplateDialogCreateComponent>,
    private readonly formBuilder: FormBuilder,
    private router: Router,
    private templateService: ThemeTemplateService
  ) { }

  async createNewTemplate () {
    const formData = this.createTemplateForm.value;
    this.router.navigateByUrl(`_/admin/theme/${this.data.theme.id}/templates/${formData.selector}`);
    await this.templateService.createTemplateInTheme(this.data.theme, formData.title, formData.selector);
    this.dialogRef.close();
  }
}
