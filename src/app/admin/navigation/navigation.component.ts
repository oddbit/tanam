import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ContentTypeService } from '../../services/content-type.service';

interface SideMenuItem {
  name: string;
  icon: string;
  link: string;
}
@Component({
  selector: 'app-admin-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  contentTypes$ = this.cts.getContentTypes();

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  // sideMenuItems: SideMenuItem[] = [
  //   {
  //     name: 'Main',
  //     subMenuItems: [
  //       {
  //         name: 'Dashboard',
  //         icon: 'dashboard',
  //         link: '/admin/dashboard',
  //       },
  //     ],
  //   },
  //   {
  //     name: 'Content',
  //     subMenuItems: [
  //       {
  //         name: 'Dashboard',
  //         icon: 'dashboard',
  //         link: '/admin/dashboard',
  //       },
  //     ],
  //   },
  // ];

  constructor(
    private readonly breakpointObserver: BreakpointObserver,
    private readonly cts: ContentTypeService,
  ) { }
}
