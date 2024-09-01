import React, { createContext, ReactNode, useState } from 'react';
import { useRouter } from 'next/navigation'
import api from '@/services/api';
import EchoService from '@/services/echo';
import AuthService from '@/services/api/auth';
import { IAuthContextData } from '@/contexts/auth/interfaces';
import { IUser } from '@/interfaces/user';

const AuthContext = createContext<IAuthContextData>(
  {} as IAuthContextData
);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // The access token for the authenticated user.
  const [accessToken, setAccessToken] = useState('');

  // The authenticated user.
  const [user, setUser] = useState({} as IUser);

  // router used to redirect the user.
  const router = useRouter();

  async function signIn(email: string, password: string) {
    try {
      const response = await AuthService.signIn({ email, password });
      const { access_token, user } = response.data.data;
      saveSignIn(access_token, user);
    } catch (error) {
      throw error;
    }
  }

  function saveSignIn(accessToken: string, user: IUser, withRedirect = true) {
    if(accessToken && user) {
      setAccessToken(accessToken);
      setUser(user);

      // Save access token in local storage.
      localStorage.setItem('@toolzz:accessToken', accessToken);

      // Set authorization header.
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      // initialize echo service
      EchoService.initialize(accessToken);

      if(withRedirect) {
        router.push('/');
      }
    } else {
      throw new Error('Not provided access token or user');
    }
  }

  async function checkAuthentication() {
    const accessToken = localStorage.getItem('@toolzz:accessToken');
    if(accessToken) {
      const response = await AuthService.getMyData(accessToken);
      const user = response.data.data;
      saveSignIn(accessToken, user, false);
    }
  }

  async function signUp(name: string, email: string, password: string) {
    try {
      const response = await AuthService.signUp({ name, email, password });
      const { access_token, user } = response.data.data;
      saveSignIn(access_token, user);
    } catch (error) {
      throw error;
    }
  }

  async function signOut() {
    try {
      await AuthService.signOut();

      localStorage.removeItem('@toolzz:accessToken');

      setAccessToken('');
      setUser({} as IUser);
      delete api.defaults.headers.common['Authorization'];
      
      EchoService.disconnect();

      router.push('/sign-in');
    } catch (error) {
      throw error;
    }
  }

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated: !!accessToken, 
        accessToken, 
        user, 
        signIn,
        signUp,
        signOut,
        checkAuthentication
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider };