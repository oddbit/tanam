import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '../environments/environment';
import { DynamicPageComponent } from './site/dynamic-page/dynamic-page.component';

const routes: Routes = [
  // Other modules must declare their routes first, because our base case is to try and render everything
  { path: ':typePrefix/:entryPath', component: DynamicPageComponent },
  { path: '**', component: DynamicPageComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { enableTracing: environment.debugRouting }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
