import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'tanam-navigation-list-item',
  templateUrl: './navigation-list-item.component.html',
  styleUrls: ['./navigation-list-item.component.scss']
})
export class NavigationListItemComponent implements OnInit {
  @Input() id: string;
  @Input() icon: string;
  @Input() isExpanded: boolean;
  @Input() title: string;
  @Input() routerLink: string;

  constructor() { }

  ngOnInit() {
  }
}
