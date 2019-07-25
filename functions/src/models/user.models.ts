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

export interface ITanamUserInvite extends ITanamBase {
  roles: TanamUserRoleType[];
  email: string;
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

export class TanamUserInvite extends TanamBase implements ITanamUserInvite {
  roles: TanamUserRoleType[];
  email: string;

  constructor(json: ITanamUserInvite) {
    super(json);
    this.roles = json.roles;
    this.email = json.email;
  }

  toJson(): ITanamUserInvite {
    console.log(`[${TanamUserInvite.name}.toJson]`);

    const json = {
      ...super.toJson(),
      email: this.email,
      roles: this.roles,
    } as ITanamUserInvite;

    for (const key in json) {
      if (json.hasOwnProperty(key)) {
        json[key] = typeof json[key] === "undefined" ? null : json[key];
      }
    }

    return json;
  }

  toString() {
    return `${TanamUserInvite.name}(${this.email}: ${this.roles})`;
  }
}
