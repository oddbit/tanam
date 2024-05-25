import {IdTokenResult, UserInfo} from "firebase/auth";
import React, {createContext, useContext, useState} from 'react';

export interface IAuthUser {
  id: string;
  displayName: string;
  email: string;
  imageUrl?: string;
}

export interface AuthUserState {
  token: IdTokenResult | null;
  accessToken: string | null;
  refreshToken: string | null;
  userInfo: UserInfo | null;
}

const AuthUserStateContext = createContext<{ state: AuthUserState; setState: React.Dispatch<React.SetStateAction<AuthUserState>> } | undefined>(undefined);

export const AuthUserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthUserState>({
    token: null,
    accessToken: null,
    refreshToken: null,
    userInfo: null
  });

  return (
    <AuthUserStateContext.Provider value={{ state, setState }}>
      {children}
    </AuthUserStateContext.Provider>
  );
};

export const useAuthUserState = () => {
  const context = useContext(AuthUserStateContext);
  if (!context) {
    throw new Error('useAuthUserState must be used within a AuthUserProvider');
  }
  return context;
};