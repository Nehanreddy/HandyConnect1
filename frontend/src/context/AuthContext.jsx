import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored && stored !== 'undefined') {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error("❌ Error reading user from localStorage:", e);
    }
  }, []);

  const login = (userData) => {
    if (userData?.token) {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } else {
      console.warn("⚠️ Tried to login but no token was provided:", userData);
    }
  };

const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token'); // <- remove this extra token too
  setUser(null);

  delete API.defaults.headers.common['Authorization'];
};


  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
