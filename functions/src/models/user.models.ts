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
  invited: firebase.firestore.Timestamp | Date;
  role: UserRole;
  updated: any;
  uid?: string;
  id: string
}

export interface TanamUserInvitation {
  email: string;
  role: UserRole;
}

export interface UserQueryOptions {
  limit?: number;
  orderBy?: {
    field: string,
    sortOrder: 'asc' | 'desc',
  };
  startAfter?: any; // firebase.firestore.DocumentSnapshot
}
