import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load — check if a token exists and verify it
  useEffect(() => {
    const token = sessionStorage.getItem('pt_token');
    if (token) {
      authApi.me()
        .then((res) => setUser(res.data))
        .catch(() => sessionStorage.removeItem('pt_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    const { token, user } = res.data;
    sessionStorage.setItem('pt_token', token);
    setUser(user);
    return user;
  };

  const register = async (name, email, password) => {
    const res = await authApi.register({ name, email, password });
    const { token, user } = res.data;
    sessionStorage.setItem('pt_token', token);
    setUser(user);
    return user;
  };

  const logout = () => {
    sessionStorage.removeItem('pt_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      loading,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};