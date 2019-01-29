import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-navigation-list-item',
  templateUrl: './navigation-list-item.component.html',
  styleUrls: ['./navigation-list-item.component.scss']
})
export class NavigationListItemComponent implements OnInit {
  @Input() icon: string;
  @Input() isExpanded: string;
  @Input() title: string;
  @Input() routerLink: string;

  constructor() { }

  ngOnInit() {
  }
}
