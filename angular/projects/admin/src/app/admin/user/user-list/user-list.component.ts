import { Component } from '@angular/core';
import { IPageInfo } from 'ngx-virtual-scroller';
import { UserService } from '../../../services/user.service';
import { map, tap } from 'rxjs/operators';
import { ITanamUser, TanamUserRoleType } from 'tanam-models/user.models';

interface TanamRoleOptions {
  value: TanamUserRoleType;
  text: string;
}

@Component({
  selector: 'tanam-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {
  constructor(
    private readonly userService: UserService,
  ) {
  }
  readonly roles: TanamRoleOptions[] = [
    {
      value: 'admin',
      text: 'Admin'
    },
    {
      value: 'superAdmin',
      text: 'Super Admin',
    },
    {
      value: 'publisher',
      text: 'Publisher'
    }
  ];

  items: ITanamUser[] = [];
  limit = 20;
  isLoading: boolean;
  isLastItem: boolean;

  static sortItems(a: any, b: any) {
    const itemA = a.name.toLowerCase();
    const itemB = b.name.toLowerCase();
    if (itemA < itemB) {
      return -1;
    } else if (itemA > itemB) {
      return 1;
    } else {
      return 0;
    }
  }

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
    this.userService.getUsers({
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
          return mergedItems.reduce((acc, cur) => ({...acc, [cur.name]: cur}), {});
        }),
        map(v => Object.values(v).sort(UserListComponent.sortItems))
      ).subscribe((items: any) => {
      this.items = [...items];
      this.isLoading = false;
    });
  }
}
