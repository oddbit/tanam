import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from 'src/environments/environment';
import { RenderTemplateComponent } from './render-template/render-template.component';

const routes: Routes = [
  // Other modules must declare their routes first, because our base case is to try and render everything
  { path: '**', component: RenderTemplateComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    { enableTracing: !environment.production },
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
