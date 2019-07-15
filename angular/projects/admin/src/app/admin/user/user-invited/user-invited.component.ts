import { Component, Input } from '@angular/core';
import { IPageInfo } from 'ngx-virtual-scroller';
import { UserService } from '../../../services/user.service';
import { tap, map } from 'rxjs/operators';
import { TanamUserInvited, UserRole } from '../../../../../../../../functions/src/models';
import { DialogService } from '../../../services/dialog.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'tanam-user-invited',
  templateUrl: './user-invited.component.html',
  styleUrls: ['./user-invited.component.scss']
})
export class UserInvitedComponent {
  @Input() defaultRole: UserRole;
  @Input() roles: [];

  items: TanamUserInvited[] = [];
  limit = 20;
  isLoading: boolean;
  isLastItem: boolean;

  constructor(
    private readonly userService: UserService,
    private dialogService: DialogService,
    private snackBar: MatSnackBar
  ) { }

  async fetchMore(event: IPageInfo) {
    if (event.endIndex !== this.items.length - 1 || this.isLastItem) {
      return;
    }
    this.isLoading = true;
    const lastItem = this.items.length > 0 ? this.items[this.items.length - 1].email : null;
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

  deleteInvitedUser(user: TanamUserInvited) {
    this.dialogService.openDialogConfirm({
      title: 'Delete File',
      message: `Are you sure to delete "${user.email}" ?`,
      buttons: ['cancel', 'yes'],
      icon: 'warning'
    }).afterClosed().subscribe(async res => {
      if (res === 'yes') {
        this.snackBar.open('Deleting file...', 'Dismiss', {
          duration: 2000
        });
        await this.userService.removeInvitedUser(user);
        this.items = this.items.filter(item => item.email !== user.email);
        this.snackBar.open('User role deleted', 'Dismiss', {
          duration: 2000
        });
      }
    });
  }
}
