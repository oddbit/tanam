import { Component, OnInit, Inject, Optional } from '@angular/core';
import { RESPONSE } from '@nguniversal/express-engine/tokens';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
  readonly path = this.route.snapshot.url.map(s => s.path).join('/');

  constructor(
    @Optional() @Inject(RESPONSE) private readonly response: any,
    private readonly route: ActivatedRoute,
  ) { }

  ngOnInit() {
    console.log(`[NotFoundComponent:ngOnInit] 404 - NOT FOUND: ${this.path}`);

    if (this.response) {
      this.response.status = 404;
      this.response.statusMessage = 'Not found';
    }
  }
}
