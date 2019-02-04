import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SiteTheme } from 'tanam-models';
import { SiteThemeService } from '../../../services/site-theme.service';

@Component({
  selector: 'app-theme-form',
  templateUrl: './theme-form.component.html',
  styleUrls: ['./theme-form.component.scss']
})
export class ThemeFormComponent implements OnInit, OnDestroy {
  @Input() themeId: string;
  @Input() afterSaveRoute: string;
  @Input() onCancelRoute: string;

  theme: SiteTheme;
  readonly themeForm: FormGroup = this.fb.group({
    title: [null, Validators.required],
    description: [null, Validators.required],
    styles: this.fb.array([]),
    scripts: this.fb.array([]),
  });
  themeSubscription: Subscription;

  get stylesFieldForms() {
    return this.themeForm.get('styles') as FormArray;
  }

  get scriptsFieldForms() {
    return this.themeForm.get('scripts') as FormArray;
  }

  constructor(
    private readonly fb: FormBuilder,
    private readonly siteThemeService: SiteThemeService,
    private readonly router: Router,
  ) { }

  ngOnInit() {
    this.themeSubscription = this.siteThemeService.getTheme(this.themeId)
      .subscribe(theme => {
        this.theme = theme;

        this.clearFields('styles');
        for (const val of theme.styles) {
          this.addField('styles', val);
        }

        this.clearFields('scripts');
        for (const val of theme.scripts) {
          this.addField('scripts', val);
        }

        this.themeForm.patchValue({
          title: theme.title,
          description: theme.description,
        });
      });
  }

  ngOnDestroy() {
    if (this.themeSubscription && !this.themeSubscription.closed) {
      this.themeSubscription.unsubscribe();
    }
  }

  addField(formArrayName: string, val?: string) {
    const value = val ? val : '';
    const formField = this.fb.control(value, Validators.required);

    if (formArrayName === 'styles') {
      this.stylesFieldForms.push(formField);
    } else if (formArrayName === 'scripts') {
      this.scriptsFieldForms.push(formField);
    }
  }

  deleteField(formArrayName: string, index: number) {
    if (formArrayName === 'styles') {
      this.stylesFieldForms.removeAt(index);
    } else if (formArrayName === 'scripts') {
      this.scriptsFieldForms.removeAt(index);
    }
  }

  clearFields(formArrayName: string) {
    if (formArrayName === 'styles') {
      while (this.stylesFieldForms.length > 0) {
        this.deleteField(formArrayName, 0);
      }
    } else if (formArrayName === 'scripts') {
      while (this.scriptsFieldForms.length > 0) {
        this.deleteField(formArrayName, 0);
      }
    }
  }

  cancelEditing() {
    this.router.navigateByUrl(this.onCancelRoute);
  }

  onSave() {
    const formData = this.themeForm.value;
    if (this.themeForm.errors) {
      return;
    }

    this.siteThemeService.update({
      id: this.themeId,
      title: formData.title,
      description: formData.description,
      styles: formData.styles,
      scripts: formData.scripts,
    } as SiteTheme);

    if (this.afterSaveRoute) {
      this.router.navigateByUrl(this.afterSaveRoute);
    }
  }
}
