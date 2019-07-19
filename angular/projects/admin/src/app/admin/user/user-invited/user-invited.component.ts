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
          return mergedItems.reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {});
        }),
        map(v => Object.values(v))
      ).subscribe((items: any) => {
        this.items = [...items];
        this.isLoading = false;
      });
  }

  async resendUserInvitation(user: TanamUserInvited) {
    this.snackBar.open('Sending Invitation', 'Dismiss', {
      duration: 2000,
    });
    await this.userService.sendUserInvitation(user.email);
    this.snackBar.open('Sent', 'Dismiss', {
      duration: 2000,
    });
  }

  deleteInvitedUser(user: TanamUserInvited) {
    this.dialogService.openDialogConfirm({
      title: 'Delete User',
      message: `Are you sure to delete "${user.email}" ?`,
      buttons: ['cancel', 'yes'],
      icon: 'warning'
    }).afterClosed().subscribe(async res => {
      if (res === 'yes') {
        this.snackBar.open('Deleting User...', 'Dismiss', {
          duration: 2000
        });
        await this.userService.removeInvitedUser(user);
        this.items = this.items.filter(item => item.id !== user.id);
        this.snackBar.open('User deleted', 'Dismiss', {
          duration: 2000
        });
      }
    });
  }
}
