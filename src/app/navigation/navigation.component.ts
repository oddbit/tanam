import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ContentTypeService } from '../content-type/content-type.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));
  contentTypes$ = this.cts.getContentTypes();

  constructor(
    private readonly breakpointObserver: BreakpointObserver,
    private readonly cts: ContentTypeService,
  ) { }
}
