import { Component } from '@angular/core';
import { IPageInfo } from 'ngx-virtual-scroller';
import { UserService } from '../../../services/user.service';
import { map, tap } from 'rxjs/operators';
import { TanamUser, TanamUserRoleType } from 'tanam-models/user.models';
import { AngularTanamUser } from '../../../app.models';
import { DialogService } from '../../../services/dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private dialogService: DialogService,
    private snackBar: MatSnackBar
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

  items: TanamUser[] = [];
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
          return mergedItems.reduce((acc, cur) => ({ ...acc, [cur.name]: cur }), {});
        }),
        map(v => Object.values(v).sort(UserListComponent.sortItems))
      ).subscribe((items: any) => {
        this.items = [...items];
        this.isLoading = false;
      });
  }

  deleteUser(user: AngularTanamUser) {
    console.log(user);
    this.dialogService.openDialogConfirm({
      title: 'Delete Content Type',
      message: `Are you sure to delete user "${user.email}" ?`,
      buttons: ['cancel', 'yes'],
      icon: 'warning'
    }).afterClosed().subscribe(async res => {
      if (res === 'yes') {
        this.snackBar.open('Deleting..', 'Dismiss', { duration: 2000 });
        await this.userService.deleteUser(new AngularTanamUser(user));
        this.items = this.items.filter(item => item.id !== user.id);
        this.snackBar.open('Deleted', 'Dismiss', { duration: 2000 });
      }
    });
  }
}
