import { AdminTheme } from './theme.models';

export type UserRole = 'superAdmin' | 'admin' | 'publisher' | 'designer' | 'reviewer';

export interface UserPrefs {
  theme: AdminTheme;
  language: string;
}

export interface TanamUser {
  uid: string;
  email: string;
  name: string;
  roles: UserRole[];
  prefs: UserPrefs;
  photoUrl?: string;
}

export interface TanamUserInvited {
  email: string;
  invited: any;
  role: UserRole;
  uid: string;
  updated: any;
}

export interface UserQueryOptions {
  limit?: number;
  orderBy?: {
    field: string,
    sortOrder: 'asc' | 'desc',
  };
  startAfter?: any; // firebase.firestore.DocumentSnapshot
}

export interface ITanamUserRole {
  uid?: string;
  name?: string;
  email: string;
  created: Date | any; // firebase.firestore.FieldValue | firebase.firestore.TimeStamp
  updated: Date | any;  // firebase.firestore.FieldValue | firebase.firestore.TimeStamp
  role: UserRole;
}


export class TanamUserRole implements ITanamUserRole {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  created: Date | any;
  updated: Date | any;

  constructor(json: ITanamUserRole) {
    this.uid = json.uid;
    this.name = json.name;
    this.email = json.email;
    this.role = json.role;
    this.created = json.created;
    this.updated = json.updated;
  }

  toJson(): ITanamUserRole {
    return {
      uid: this.uid || null,
      name: this.name || null,
      email: this.email,
      role: this.role,
      created: this.created,
      updated: this.updated,
    } as ITanamUserRole;
  }

  toString() {
    return `${TanamUserRole.name}(${this.email}: ${this.role})`;
  }
}
