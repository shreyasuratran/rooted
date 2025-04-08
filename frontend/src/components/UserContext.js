import { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store name, email, etc.

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Access from anywhere
export const useUser = () => useContext(UserContext);