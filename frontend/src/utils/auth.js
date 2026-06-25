const TOKEN_KEY = 'taskflow_jwt_token';

/**
 * Saves JWT token in local storage
 * @param {string} token 
 */
export const saveToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

/**
 * Retrieves JWT token from local storage
 * @returns {string|null}
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Removes JWT token from local storage
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Checks if a JWT token is present in local storage
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return !!getToken();
};
