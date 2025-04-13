import { useEffect, useState, createContext, useContext } from 'react';
import api from '../utils/axios'; // your axios instance

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const res = await api.get('/users/me'); // or your auth/me endpoint
          setUser(res.data);
        } catch (err) {
          console.error("Failed to auto-load user:", err);
          localStorage.removeItem('access_token');
        }
      }
    };

    fetchProfile();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);