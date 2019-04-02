import { UserRole } from '.';

export interface TanamConfig {
    firebaseApp: any;
    loginProviders?: string[];
    users: { [key: string]: UserRole };
}
