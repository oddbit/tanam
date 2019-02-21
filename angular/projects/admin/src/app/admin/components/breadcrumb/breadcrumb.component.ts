import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'tanam-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  @Input()
  title: string;

  @Input()
  routerLink: string;

  constructor() { }

  ngOnInit() {
  }
}
