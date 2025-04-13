import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './components/UserContext';
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
      <UserProvider> 
        <Routes>
          <Route path="/rooted/login" element={<Login />} />
          <Route path="/rooted/register" element={<CreateAccount />} />
          <Route path="/rooted" element={<PrivateRoute> <NavBar /><Home /> </PrivateRoute>} />
          <Route path="/rooted/plant/:id" element={<PrivateRoute> <NavBar /><PlantDetails /> </PrivateRoute>} />
          <Route path="/rooted/guide" element={<PrivateRoute> <NavBar /><Guide /> </PrivateRoute>} />
          <Route path="/rooted/contact" element={<PrivateRoute> <NavBar /><ContactUs /> </PrivateRoute>} />
          <Route path="/rooted/profile" element={<PrivateRoute> <NavBar /><Profile /> </PrivateRoute>} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;