import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../../services/theme.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-theme-overview',
  templateUrl: './theme-overview.component.html',
  styleUrls: ['./theme-overview.component.scss']
})
export class ThemeOverviewComponent implements OnInit {
  readonly createTypeForm: FormGroup = this.formBuilder.group({
    title: [null, [Validators.required]],
  });

  constructor(
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly themeService: ThemeService,
  ) { }

  ngOnInit() {
  }

  createNewType() {
    this.themeService.createTheme().then(id => {
      this.router.navigateByUrl(`/_/admin/themes/${id}`);
    });
  }
}
