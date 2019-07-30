import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, CollectionReference, Query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import {
  ADMIN_THEMES,
  AdminTheme,
  ITanamUser,
  ITanamUserInvite,
  TanamSite,
  TanamUser,
  TanamUserInvite,
  TanamUserRoleType,
  UserQueryOptions,
} from 'tanam-models';
import { AppConfigService } from './app-config.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { SiteService } from './site.service';
import { AngularUserInvite, AngularTanamUser } from '../app.models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private readonly fireAuth: AngularFireAuth,
    private readonly firestore: AngularFirestore,
    private readonly appConfig: AppConfigService,
    private readonly fbApp: FirebaseApp,
    private readonly overlayContainer: OverlayContainer,
    private readonly siteService: SiteService,
  ) {
  }

  getCurrentUser(): Observable<TanamUser> {
    const firebaseUser = this.fireAuth.auth.currentUser;
    return this.getUser(firebaseUser.uid)
      .pipe(map(user => {
        user.photoUrl = user.photoUrl || firebaseUser.photoURL;
        return user;
      }));
  }

  getUser(uid: string): Observable<TanamUser> {
    return this.siteService.getCurrentSite().pipe(
      switchMap((site) =>
        this.firestore
          .collection('tanam').doc(site.id)
          .collection('users').doc<ITanamUser>(uid)
          .valueChanges()
          .pipe(
            map((user) => new TanamUser(user)),
          )
      ),
    );
  }

  async deleteUser(user: AngularTanamUser) {
    const tanamSite = await this._currentSite;
    return this.firestore
      .collection('tanam').doc(tanamSite.id)
      .collection('users')
      .doc(user.id || user.uid).delete();
  }

  hasRole(role: TanamUserRoleType): Observable<boolean> {
    return this.getCurrentUser()
      .pipe(map(user => user.roles.indexOf(role) !== -1))
      .pipe(tap(result => console.log(`[UserService:hasRole] ${role}: ${result}`)));
  }

  getUserTheme(): Observable<string> {
    const firebaseUser = this.fireAuth.auth.currentUser;
    return this.siteService.getCurrentSite().pipe(
      switchMap((site) =>
        this.firestore
          .collection('tanam').doc(site.id)
          .collection('users').doc<ITanamUser>(firebaseUser.uid)
          .valueChanges()
          .pipe(
            map(tanamUser => !!tanamUser.prefs ? tanamUser.prefs : { theme: 'default' }),
            map((prefs: { theme: AdminTheme }) => ADMIN_THEMES[prefs.theme] || ADMIN_THEMES['default']),
            tap(theme => console.log(`[UserPrefsService:getAdminTheme] theme: ${theme}`)),
          )
      ),
    );
  }

  async setUserTheme(theme: AdminTheme) {
    const firebaseUser = this.fireAuth.auth.currentUser;
    const tanamSite = await this._currentSite;
    const docRef = this.firestore
      .collection('tanam').doc(tanamSite.id)
      .collection('users').doc<ITanamUser>(firebaseUser.uid);

    return this.fbApp.firestore().runTransaction<void>(async (trx) => {
      const trxDoc = await trx.get(docRef.ref);
      const trxUser = trxDoc.data() as ITanamUser;

      const prefs = { ...trxUser.prefs, theme };

      trx.update(docRef.ref, { prefs });
    });
  }

  overlayTheme() {
    const overlayContainerClasses = this.overlayContainer.getContainerElement().classList;
    const themeClassesToRemove = Array.from(overlayContainerClasses).filter((item: string) => item.includes('-theme'));
    if (themeClassesToRemove.length) {
      overlayContainerClasses.remove(...themeClassesToRemove);
    }

    this.getUserTheme().subscribe(val => {
      this.overlayContainer.getContainerElement().classList.add(val);
    });
  }

  getUsers(queryOpts: UserQueryOptions) {
    const queryFn = (ref: CollectionReference) => {
      if (queryOpts) {
        let query: Query = ref;
        if (queryOpts.orderBy) {
          query = query.orderBy(queryOpts.orderBy.field, queryOpts.orderBy.sortOrder);
        }
        if (queryOpts.startAfter) {
          query = query.startAfter(queryOpts.startAfter);
        }
        if (queryOpts.limit) {
          query = query.limit(queryOpts.limit);
        }
        return query;
      }
      return ref;
    };


    return this.siteService.getCurrentSite().pipe(
      switchMap((site) =>
        this.firestore
          .collection('tanam').doc(site.id)
          .collection<ITanamUser>('users', queryFn)
          .valueChanges()
          .pipe(
            map((users) => users.map((user) => new TanamUser(user))),
          )
      ),
    );
  }

  getUserInviteds(queryOpts: UserQueryOptions): Observable<TanamUserInvite[]> {
    const queryFn = (ref: CollectionReference) => {
      if (queryOpts) {
        let query: Query = ref;
        if (queryOpts.orderBy) {
          query = query.orderBy(queryOpts.orderBy.field, queryOpts.orderBy.sortOrder);
        }
        if (queryOpts.startAfter) {
          query = query.startAfter(queryOpts.startAfter);
        }
        if (queryOpts.limit) {
          query = query.limit(queryOpts.limit);
        }
        return query;
      }
      return ref;
    };

    return this.siteService.getCurrentSite().pipe(
      switchMap((site) =>
        this.firestore
          .collection('tanam').doc(site.id)
          .collection<ITanamUserInvite>('user-invites', queryFn)
          .valueChanges()
          .pipe(
            map((roles) => roles.map((role) => new TanamUserInvite(role))),
          )
      ),
    );
  }

  async inviteUser(userInvite: AngularUserInvite) {
    const tanamSite = await this._currentSite;
    return this.firestore
      .collection('tanam').doc(tanamSite.id)
      .collection('users').ref.where('email', '==', userInvite.email)
      .get().then(async users => {
        if (users.size > 0) {
          return 'userAlreadyCreated';
        }
        this.sendUserInvitation(userInvite);
        userInvite.id = userInvite.email;
        await this.firestore
          .collection('tanam').doc(tanamSite.id)
          .collection('user-invites').doc(userInvite.email)
          .set(userInvite.toJson());
        return 'userInvited';
      });
  }

  async updateUserRoles(id: string, collection: string, roles: TanamUserRoleType[]) {
    const tanamSite = await this._currentSite;
    return this.firestore
      .collection('tanam').doc(tanamSite.id)
      .collection(collection).doc(id).update({
        roles: roles
      });
  }

  async deleteUserInviteds(userRole: ITanamUserInvite) {
    const tanamSite = await this._currentSite;
    return this.firestore
      .collection('tanam').doc(tanamSite.id)
      .collection('user-invites')
      .doc(userRole.email).delete();
  }

  async sendUserInvitation(userInvite: AngularUserInvite) {
    const tanamSite = await this._currentSite;
    this.siteService.getCurrentSite().subscribe(settings => {
      const actionCodeSettings = {
        url: `https://${settings.primaryDomain}/_/login`,
        handleCodeInApp: true,
      };
      firebase.auth().sendSignInLinkToEmail(userInvite.email, actionCodeSettings)
        .catch(function (error) {
          console.log(error);
        });
    });
  }

  async getReference(id: string) {
    if (!id) {
      return;
    }

    const tanamSite = await this._currentSite;
    return this.firestore
      .collection('tanam').doc(tanamSite.id)
      .collection('users').doc(id).ref.get();
  }


  get _currentSite(): Promise<TanamSite> {
    return this.siteService.getCurrentSite().pipe(take(1)).toPromise();
  }

}
