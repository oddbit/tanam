import { Component } from '@angular/core';
import { IPageInfo } from 'ngx-virtual-scroller';
import { UserService } from '../../../services/user.service';
import { tap, map } from 'rxjs/operators';
import { TanamUserInvited } from '../../../../../../../../functions/src/models';

@Component({
  selector: 'tanam-user-invited',
  templateUrl: './user-invited.component.html',
  styleUrls: ['./user-invited.component.scss']
})
export class UserInvitedComponent {
  items: TanamUserInvited[] = [];
  limit = 20;
  isLoading: boolean;
  isLastItem: boolean;

  constructor(
    private readonly userService: UserService,
  ) { }

  async fetchMore(event: IPageInfo) {
    if (event.endIndex !== this.items.length - 1 || this.isLastItem) {
      return;
    }
    this.isLoading = true;
    const lastItem = this.items.length > 0 ? this.items[this.items.length - 1].uid : null;
    let lastVisible = null;
    if (lastItem) {
      lastVisible = await this.userService.getReference(lastItem);
    }
    this.fetchItems(lastVisible);
  }

  fetchItems(lastVisible: firebase.firestore.DocumentSnapshot) {
    this.isLoading = true;
    this.userService.getUserInvited({
      startAfter: lastVisible
    })
      .pipe(
        tap(items => {
          if (!items.length || items.length < this.limit) {
            this.isLastItem = true;
          }
        }),
        map(items => {
          const mergedItems = [...this.items, ...items];
          return mergedItems.reduce((acc, cur) => ({ ...acc, [cur.email]: cur }), {});
        }),
        map(v => Object.values(v))
      ).subscribe((items: any) => {
        this.items = [...items];
        this.isLoading = false;
      });
  }
}
