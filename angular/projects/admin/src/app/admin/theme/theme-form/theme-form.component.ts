import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Theme } from 'tanam-models';
import { ThemeService } from '../../../services/theme.service';
import { DialogService } from '../../../services/dialog.service';
import { SiteService } from '../../../services/site.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'tanam-theme-form',
  templateUrl: './theme-form.component.html',
  styleUrls: ['./theme-form.component.scss']
})
export class ThemeFormComponent implements OnInit, OnDestroy {
  @Input() themeId: string;
  @Input() afterSaveRoute: string;
  @Input() onCancelRoute: string;

  activeTheme: string;
  theme: Theme;
  readonly themeForm: FormGroup = this.fb.group({
    title: [null, Validators.required],
    description: [null, Validators.required],
  });
  themeSubscription: Subscription;
  activeThemeSubscription: Subscription;

  constructor(
    private readonly fb: FormBuilder,
    private readonly siteThemeService: ThemeService,
    private readonly router: Router,
    private readonly dialogService: DialogService,
    private readonly siteService: SiteService,
    private readonly snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.themeSubscription = this.siteThemeService.getTheme(this.themeId)
      .subscribe(theme => {
        this.themeForm.patchValue({
          title: theme.title,
          description: theme.description,
        });
        this.theme = theme;
      });
    this.activeThemeSubscription = this.siteService.getTheme()
      .subscribe(theme => {
        this.activeTheme = theme;
      });
  }

  ngOnDestroy() {
    if (this.themeSubscription && !this.themeSubscription.closed) {
      this.themeSubscription.unsubscribe();
    }
    this.activeThemeSubscription.unsubscribe();
  }

  cancelEditing() {
    this.router.navigateByUrl(this.onCancelRoute);
  }

  saveTheme() {
    const formData = this.themeForm.value;
    if (this.themeForm.errors) {
      return;
    }

    this.siteThemeService.update({
      id: this.themeId,
      title: formData.title,
      description: formData.description,
    } as Theme);

    if (this.afterSaveRoute) {
      this.router.navigateByUrl(this.afterSaveRoute);
    }
  }

  deleteTheme() {
    this.dialogService.openDialogConfirm({
      title: 'Delete Theme',
      message: `Are you sure to delete the "${this.theme.title}" ?`,
      buttons: ['cancel', 'yes'],
      icon: 'warning'
    }).afterClosed().subscribe(async res => {
      if (res === 'yes') {
        this.themeSubscription.unsubscribe();
        this.activeThemeSubscription.unsubscribe();
        this.snackBar.open('Deleting Theme', 'Dismiss', { duration: 2000 });
        try {
          await this.siteThemeService.deleteTheme(this.themeId, this.activeTheme);
          this.snackBar.open('Theme Deleted', 'Dismiss', { duration: 1000 });
          this.router.navigateByUrl('/_/admin/themes');
        } catch (error) {
          this.snackBar.open(error.message, 'Dismiss', { duration: 5000 });
        }
      }
    });
  }
}
