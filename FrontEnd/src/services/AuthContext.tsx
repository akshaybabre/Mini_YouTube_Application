import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../services/firebase';
import { signInWithPopup, User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import axios from 'axios';
import { useCookies } from 'react-cookie';

interface AuthContextType {
  user: User | { id: string; email: string; username: string; role: string } | null;
  signup: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  googleAuth: () => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<
    User | { id: string; email: string; username: string; role: string } | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();
  const db = getFirestore();
  const [, setCookie, removeCookie] = useCookies(['userName', 'userEmail']);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (isLoggingOut) {
        setLoading(false);
        setIsAdminAuthenticated(false);
        return;
      }

      const adminToken = localStorage.getItem('adminToken');
      if (adminToken) {
        try {
          const response = await axios.get('https://mini-youtube-fdhn.onrender.com/api/admin/profile', {
            headers: { Authorization: `Bearer ${adminToken}` },
          });
          const adminData = response.data;
          setUser({
            id: adminData.id,
            email: adminData.email,
            username: adminData.name,
            role: 'admin',
          });
          setCookie('userName', adminData.name || 'Admin', {
            path: '/',
            maxAge: 7 * 24 * 60 * 60,
          });
          setCookie('userEmail', adminData.email || '', {
            path: '/',
            maxAge: 7 * 24 * 60 * 60,
          });

          setIsAdminAuthenticated(true);

          if (
            window.location.pathname === '/' ||
            window.location.pathname === '/login' ||
            window.location.pathname === '/signup' ||
            window.location.pathname === '/admin'
          ) {
            navigate('/adminDash');
          }
          setLoading(false);
          return;
        } catch (err) {
          console.error('Admin auth error:', err);
          setUser(null);
          setIsAdminAuthenticated(false);
          setLoading(false);
          return;
        }
      }

      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.exists() ? userDoc.data() : {};
          setCookie('userName', userData.name || firebaseUser.displayName || 'User', {
            path: '/',
            maxAge: 7 * 24 * 60 * 60,
          });
          setCookie('userEmail', firebaseUser.email || '', {
            path: '/',
            maxAge: 7 * 24 * 60 * 60,
          });

          const token = await firebaseUser.getIdToken();
          localStorage.setItem('userToken', token);

          const response = await axios.post(
            'https://mini-youtube-fdhn.onrender.com/api/auth/login',
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          setUser({
            id: response.data.user.id,
            email: response.data.user.email,
            username: response.data.user.username,
            role: response.data.user.role,
          });

          if (window.location.pathname === '/' || window.location.pathname === '/login') {
            navigate('/userDash');
          }
        } catch (err: any) {
          console.error('Auth state error:', err);
          localStorage.removeItem('userToken');
          setUser(null);
          navigate('/');
        }
      } else {
        const token = localStorage.getItem('userToken');
        if (token) {
          try {
            const response = await axios.get('https://mini-youtube-fdhn.onrender.com/api/auth/me', {
              headers: { Authorization: `Bearer ${token}` },
            });
            setUser({
              id: response.data.id,
              email: response.data.email,
              username: response.data.username,
              role: response.data.role,
            });

            if (window.location.pathname === '/' || window.location.pathname === '/login') {
              navigate('/userDash');
            }
          } catch (err) {
            console.error('JWT auth error:', err);
            localStorage.removeItem('userToken');
            setUser(null);
            if (
              !isAdminAuthenticated &&
              window.location.pathname !== '/' &&
              window.location.pathname !== '/login' &&
              window.location.pathname !== '/signup' &&
              window.location.pathname !== '/admin'
            ) {
              navigate('/');
            }
          }
        } else {
          if (!isAdminAuthenticated) {
            setUser(null);
            if (
              window.location.pathname !== '/' &&
              window.location.pathname !== '/login' &&
              window.location.pathname !== '/signup' &&
              window.location.pathname !== '/admin'
            ) {
              navigate('/');
            }
          }
        }
        if (!isAdminAuthenticated) {
          removeCookie('userName', { path: '/' });
          removeCookie('userEmail', { path: '/' });
        }
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [setCookie, removeCookie, isLoggingOut]);

  const signup = async (email: string, password: string, name: string) => {
    setLoading(true);
    setError(null);

    try {
      const mongoCheck = await axios.post('https://mini-youtube-fdhn.onrender.com/api/manual/check-user', { email });
      if (mongoCheck.data.exists) {
        throw new Error(
          'This email is already registered. Please use a different email or log in.'
        );
      }

      const userId = `${email.split('@')[0]}-${Date.now()}`;

      const response = await axios.post('https://mini-youtube-fdhn.onrender.com/api/manual/signup', {
        userId,
        username: name,
        email,
        password,
      });

      const { token, user: userData } = response.data;

      localStorage.setItem('userToken', token);
      setCookie('userName', name, { path: '/', maxAge: 7 * 24 * 60 * 60 });
      setCookie('userEmail', email, { path: '/', maxAge: 7 * 24 * 60 * 60 });

      setUser({
        id: userData.id,
        email: userData.email,
        username: userData.username,
        role: userData.role,
      });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('https://mini-youtube-fdhn.onrender.com/api/manual/login', {
        email,
        password,
      });

      const { token, user: userData } = response.data;

      localStorage.setItem('userToken', token);
      setCookie('userName', userData.username || 'User', { path: '/', maxAge: 7 * 24 * 60 * 60 });
      setCookie('userEmail', email, { path: '/', maxAge: 7 * 24 * 60 * 60 });

      setUser({
        id: userData.id,
        email: userData.email,
        username: userData.username,
        role: userData.role,
      });
      navigate('/userDash');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const googleAuth = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      let userData;
      if (!userDoc.exists()) {
        userData = {
          email: user.email,
          role: 'user',
          name: user.displayName || 'Google User',
          createdAt: new Date().toISOString(),
        };
        await setDoc(doc(db, 'users', user.uid), userData);
      } else {
        userData = userDoc.data();
        if (userData.role !== 'user') {
          setError('Access denied. Only users can log in here.');
          await auth.signOut();
          return;
        }
      }

      const token = await user.getIdToken();
      localStorage.setItem('userToken', token);

      await axios.post(
        'https://mini-youtube-fdhn.onrender.com/api/auth/login',
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCookie('userName', userData.name || user.displayName || 'Google User', {
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
      });
      setCookie('userEmail', user.email || '', { path: '/', maxAge: 7 * 24 * 60 * 60 });

      setUser(user);
      navigate('/userDash');
    } catch (err: any) {
      setError('Google authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    setIsLoggingOut(true);
    try {
      await auth.signOut();
      localStorage.removeItem('userToken');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('admin');
      removeCookie('userName', { path: '/' });
      removeCookie('userEmail', { path: '/' });
      setUser(null);
      setIsAdminAuthenticated(false);
      navigate('/', { replace: true });
    } catch (err: any) {
      setError('Logout failed. Please try again.');
    } finally {
      setLoading(false);
      setIsLoggingOut(false);
    }
  };

  const value: AuthContextType = {
    user,
    signup,
    login,
    googleAuth,
    logout,
    error,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};