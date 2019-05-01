import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { ThemeTemplate } from 'tanam-models';
import { ThemeTemplateService } from '../../../services/theme-template.service';


@Component({
  selector: 'tanam-theme-template-dialog-list-template',
  templateUrl: './theme-template-dialog-list-template.component.html',
  styleUrls: ['./theme-template-dialog-list-template.component.scss']
})
export class ThemeTemplateDialogListTemplateComponent implements OnInit {

  readonly templates$: Observable<ThemeTemplate[]> = this.themeTemplateService.getTemplatesForTheme(this.data.themeId);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly themeTemplateService: ThemeTemplateService,
    private snackBar: MatSnackBar
    ) { }

  ngOnInit() {
  }

}
