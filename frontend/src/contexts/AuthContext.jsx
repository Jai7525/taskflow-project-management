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
      // For now, set a basic mock user payload from token or default
      setUser({ id: 1, email: 'user@example.com', name: 'TaskFlow User' });
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
    setUser(userData || { id: 1, email: 'user@example.com', name: 'TaskFlow User' });
  };

  /**
   * Logs out user by clearing state and storage
   */
  const logout = () => {
    removeToken();
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
