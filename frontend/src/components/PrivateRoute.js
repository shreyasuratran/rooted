// components/PrivateRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { isTokenValid } from '../utils/auth';

const PrivateRoute = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const validate = async () => {
      const result = await isTokenValid();
      setValid(result);
      setChecking(false);
    };
    validate();
  }, []);

  if (checking) return <div>Loading...</div>; // Or a loader/spinner

  return valid ? children : <Navigate to="/login" />;
};

export default PrivateRoute;