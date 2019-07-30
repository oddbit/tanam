import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { ThemeTemplate } from 'tanam-models';
import { ThemeTemplateService } from '../../../services/theme-template.service';


@Component({
  selector: 'tanam-theme-template-dialog-list-template',
  templateUrl: './theme-template-dialog-list-template.component.html',
  styleUrls: ['./theme-template-dialog-list-template.component.scss']
})
export class ThemeTemplateDialogListTemplateComponent {

  readonly templates$: Observable<ThemeTemplate[]> = this.themeTemplateService.getTemplatesForTheme(this.data.themeId);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly themeTemplateService: ThemeTemplateService,
    private snackBar: MatSnackBar
    ) { }

  copyTemplate(templateSelector: string) {
    const txtArea = document.createElement('textarea');
    txtArea.id = 'txt';
    txtArea.style.position = 'fixed';
    txtArea.style.top = '0';
    txtArea.style.left = '0';
    txtArea.style.opacity = '0';
    txtArea.value = `{>"${templateSelector}"/}` ;
    document.body.appendChild(txtArea);
    txtArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        this.snackBar.open('Template copied to clipboard', 'Dismiss', {duration: 1000});
        return true;
      }
    } catch (err) {
      console.log('Oops, unable to copy');
    } finally {
      document.body.removeChild(txtArea);
    }
    return false;
  }

}
