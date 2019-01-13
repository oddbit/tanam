import { Component, OnInit, Inject, Optional } from '@angular/core';
import { RESPONSE } from '@nguniversal/express-engine/tokens';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  constructor(
    @Optional() @Inject(RESPONSE) private readonly response: any
  ) { }

  ngOnInit() {
    if (this.response) {
      this.response.status = 404;
      this.response.statusMessage = 'Not found';
    }
  }
}
