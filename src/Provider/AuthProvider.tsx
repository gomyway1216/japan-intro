import React, { createContext, useEffect, useState, useContext, ReactNode } from 'react';
import { auth, signInWithEmail, signOutUser } from '../api/firebaseConnect';
import { IUser, AuthProviderProps } from '../types';


const AuthContext = createContext<{
  currentUser: IUser | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}>({
  currentUser: null,
  signIn: async () => { },
  signOut: async () => { }
});

export const useAuth = () => {
  return useContext(AuthContext);
};



export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  const signIn = async (email: string, password: string) => {
    await signInWithEmail(email, password);
  };

  const signOut = () => {
    signOutUser();
    return Promise.resolve();
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const { email, uid } = user;
        setCurrentUser({ email: email as string, uid });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
