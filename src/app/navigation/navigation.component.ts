import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { ContentTypeService } from '../content-type/content-type.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  readonly contentTypes$: Observable<any[]>;
  readonly isHandset$: Observable<boolean>;

  constructor(
    readonly breakpointObserver: BreakpointObserver,
    readonly cts: ContentTypeService,
  ) {
    this.isHandset$ = breakpointObserver.observe(Breakpoints.Handset).pipe(map(result => result.matches));
    this.contentTypes$ = cts.getContentTypes();
  }
}
