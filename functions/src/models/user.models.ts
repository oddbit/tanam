
export type UserRole = 'superAdmin' | 'admin' | 'publisher' | 'designer' | 'reviewer';

export interface UserPrefs {
  theme: string;
  language: string;
}

export interface TanamUser {
  uid: string;
  name: string;
  roles: UserRole[];
  prefs: UserPrefs;
  photoUrl?: string;
}
