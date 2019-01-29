import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DynamicPageComponent } from './dynamic-page/dynamic-page.component';

const routes: Routes = [
  { path: ':typePrefix/:entryPath', component: DynamicPageComponent },
  { path: '**', component: DynamicPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
