import { useState, useEffect } from 'react';

const useAuth = () => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const persistToken = (value) => {
    if (value) {
      localStorage.setItem('token', value);
    } else {
      localStorage.removeItem('token');
    }
    setToken(value);
  };

  useEffect(() => {
    const syncToken = () => setToken(localStorage.getItem('token'));
    window.addEventListener('storage', syncToken);
    return () => window.removeEventListener('storage', syncToken);
  }, []);

  return {
    token,
    setToken: persistToken,
    logout: () => persistToken(null)
  };
};

export default useAuth;
