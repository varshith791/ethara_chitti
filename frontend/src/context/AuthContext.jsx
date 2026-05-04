import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('ttmUser');
    const storedToken = localStorage.getItem('ttmToken');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      api.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
    }
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('ttmUser', JSON.stringify(userData));
    localStorage.setItem('ttmToken', token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ttmUser');
    localStorage.removeItem('ttmToken');
    delete api.defaults.headers.common.Authorization;
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
