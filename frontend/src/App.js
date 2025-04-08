import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import NavBar from './components/NavBar'; 

import Home from './views/Home';
import PlantDetails from './views/PlantDetails';
import Guide from './views/Guide';
import ContactUs from './views/ContactUs';
import Profile from './views/Profile';
import Login from './views/Login';
import CreateAccount from './views/CreateAccount';

function App() {
  return (
    <BrowserRouter>
      
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<CreateAccount />} />
        <Route path="/rooted" element={<PrivateRoute> <NavBar /><Home /> </PrivateRoute>} />
        <Route path="/home" element={<PrivateRoute> <NavBar /><Home /> </PrivateRoute>} />
        <Route path="/plant/:id" element={<PrivateRoute> <NavBar /><PlantDetails /> </PrivateRoute>} />
        <Route path="/guide" element={<PrivateRoute> <NavBar /><Guide /> </PrivateRoute>} />
        <Route path="/contact" element={<PrivateRoute> <NavBar /><ContactUs /> </PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute> <NavBar /><Profile /> </PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;