import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Theme } from 'tanam-models';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'tanam-theme-form',
  templateUrl: './theme-form.component.html',
  styleUrls: ['./theme-form.component.scss']
})
export class ThemeFormComponent implements OnInit, OnDestroy {
  @Input() themeId: string;
  @Input() afterSaveRoute: string;
  @Input() onCancelRoute: string;

  theme: Theme;
  readonly themeForm: FormGroup = this.fb.group({
    title: [null, Validators.required],
    description: [null, Validators.required],
  });
  themeSubscription: Subscription;

  constructor(
    private readonly fb: FormBuilder,
    private readonly siteThemeService: ThemeService,
    private readonly router: Router,
  ) { }

  ngOnInit() {
    this.themeSubscription = this.siteThemeService.getTheme(this.themeId)
      .subscribe(theme => {
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
}
