import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';
import avatarImage from './avatar.png'; 

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleAvatarClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="navbar-container">
      <div className="navbar-left">
        <h2>My Plants</h2>
        <p>Monitor & Manage Your Plants</p>
      </div>

      <div className="navbar-right">
        <img
          src={avatarImage}
          alt="avatar"
          className="avatar-img"
          onClick={handleAvatarClick}
        />
      </div>

      <div className={`sidebar-menu ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <img
            src={avatarImage}
            alt="avatar"
            className="sidebar-avatar"
          />
          <p>@plantlover984</p>
          <Link to="/profile" className="sidebar-profile-link" onClick={() => setIsOpen(false)}>
            View profile
          </Link>
        </div>
        <ul className="sidebar-links">
          <li>
            <Link to="/home" onClick={() => setIsOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/guide" onClick={() => setIsOpen(false)}>
              Plant Icon Guide
            </Link>
          </li>
          <li>
            <Link to="/contact" onClick={() => setIsOpen(false)}>
              Contact Us
            </Link>
          </li>
          <li>
            <Link to="/login" onClick={() => {
              localStorage.removeItem('access_token');
              setIsOpen(false);}}>
              <strong>Logout</strong>
            </Link>
          </li>
        </ul>
      </div>

      {isOpen && <div className="overlay" onClick={handleAvatarClick}></div>}
    </div>
  );
};

export default NavBar;