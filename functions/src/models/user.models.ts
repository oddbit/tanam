import { AdminTheme } from './theme.models';

export type UserRole = 'superAdmin' | 'admin' | 'publisher' | 'designer' | 'reviewer';

export interface UserPrefs {
  theme: AdminTheme;
  language: string;
}

export interface TanamUser {
  uid: string;
  name: string;
  roles: UserRole[];
  prefs: UserPrefs;
  photoUrl?: string;
}
