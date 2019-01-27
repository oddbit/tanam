import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';

const routes: Routes = [
  { path: '**', component: AppComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { enableTracing: environment.logging.routing }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
