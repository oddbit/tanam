import { AdminTheme } from './theme.models';
import { ITanamBase, TanamBase } from "./base";

export type TanamUserRoleType = 'superAdmin' | 'admin' | 'publisher' | 'designer' | 'reviewer';

export interface UserPrefs {
  theme: AdminTheme;
  language: string;
}

export interface ITanamUser extends ITanamBase {
  email: string;
  name: string;
  roles: TanamUserRoleType[];
  prefs: UserPrefs;
  photoUrl?: string;
}

export interface UserQueryOptions {
  limit?: number;
  orderBy?: {
    field: string,
    sortOrder: 'asc' | 'desc',
  };
  startAfter?: any; // firebase.firestore.DocumentSnapshot
}

export interface ITanamUserRole extends ITanamBase {
  uid?: string;
  name?: string;
  email: string;
  role: TanamUserRoleType;
}

export class TanamUser extends TanamBase implements ITanamUser {
  email: string;
  name: string;
  photoUrl: string;
  prefs: UserPrefs;
  roles: TanamUserRoleType[];

  constructor(json: ITanamUser) {
    super({
      ...json,
      id: json.id || json['uid'],
    });
    this.email = json.email;
    this.name = json.name;
    this.photoUrl = json.photoUrl;
    this.prefs = json.prefs;
    this.roles = !!json.roles ? json.roles.slice() : [];
  }

  get uid() {
    return this.id;
  }

  toJson() {
    return {
      ...super.toJson(),
      email: this.email || null,
      name: this.name || null,
      photoUrl: this.photoUrl || null,
      prefs: this.prefs || null,
      roles: this.roles.slice(),
    } as ITanamUser;
  }

  toString() {
    return `${TanamUser.name}(${this.uid})`;
  }
}

export class TanamUserRole extends TanamBase implements ITanamUserRole {
  uid: string;
  name: string;
  email: string;
  role: TanamUserRoleType;

  constructor(json: ITanamUserRole) {
    super(json);
    this.uid = json.uid;
    this.name = json.name;
    this.email = json.email;
    this.role = json.role;
  }

  unchangedRoleAuth(otherRole: TanamUserRole) {
    if (!otherRole) {
      // Has different role if comparing to a null object
      // Is not different if this role is not linked to a user since changes
      // doesn't affect anything before connected to a user
      return !this.uid;
    }

    return otherRole.uid === this.uid && otherRole.role === this.role;
  }

  toJson(): ITanamUserRole {
    console.log(`[${TanamUserRole.name}.toJson]`);
    return {
      ...super.toJson(),
      uid: this.uid || null,
      name: this.name || null,
      email: this.email,
      role: this.role,
    } as ITanamUserRole;
  }

  toString() {
    return `${TanamUserRole.name}(${this.email}: ${this.role})`;
  }
}
