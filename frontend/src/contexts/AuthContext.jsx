import React, { createContext, useState, useEffect, useContext } from 'react';
import { getToken, saveToken, removeToken, isAuthenticated } from '../utils/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(getToken());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If a token exists in local storage, set context state
    const storedToken = getToken();
    if (storedToken) {
      setTokenState(storedToken);
      try {
        const storedUser = localStorage.getItem('taskflow_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser({ id: 1, email: 'user@example.com', name: 'TaskFlow User' });
        }
      } catch (e) {
        setUser({ id: 1, email: 'user@example.com', name: 'TaskFlow User' });
      }
    }
    setLoading(false);
  }, []);

  /**
   * Updates state with new authentication credentials
   * @param {string} newToken 
   * @param {object} userData 
   */
  const login = (newToken, userData) => {
    saveToken(newToken);
    setTokenState(newToken);
    if (userData) {
      localStorage.setItem('taskflow_user', JSON.stringify(userData));
      setUser(userData);
    } else {
      const fallbackUser = { id: 1, email: 'user@example.com', name: 'TaskFlow User' };
      localStorage.setItem('taskflow_user', JSON.stringify(fallbackUser));
      setUser(fallbackUser);
    }
  };

  /**
   * Logs out user by clearing state and storage
   */
  const logout = () => {
    removeToken();
    localStorage.removeItem('taskflow_user');
    setTokenState(null);
    setUser(null);
  };

  const value = {
    token,
    user,
    loading,
    isAuthenticated: !!token,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
