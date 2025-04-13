import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';
import avatarImage from './avatar.png';
import rootedLogo from './rootedLogo.png'; 
import { useUser } from './UserContext';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();

  // Get saved image from localStorage
  const localProfilePic = localStorage.getItem("profile_picture");

  const handleAvatarClick = () => {
    setIsOpen(!isOpen);
  };

  const avatarSrc = localProfilePic || user?.profile_picture || avatarImage;

  return (
    <div className="navbar-container">
      <div className="navbar-left">
        <img src={rootedLogo} alt="Rooted Logo" className="logo-img" />
        <span className="brand-name">rooted</span>
      </div>

      <div className="navbar-right">
        <img
          src={avatarSrc}
          alt="Profile"
          className="avatar-img"
          onClick={handleAvatarClick}
        />
      </div>

      <div className={`sidebar-menu ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <img
            src={avatarSrc}
            alt="Profile Avatar"
            className="sidebar-avatar"
          />
          <p>{user?.first_name} {user?.last_name}</p>
          <Link to="/rooted/profile" className="sidebar-profile-link" onClick={() => setIsOpen(false)}>
            View profile
          </Link>
        </div>
        <ul className="sidebar-links">
          <li><Link to="/rooted" onClick={() => setIsOpen(false)}>Home</Link></li>
          <li><Link to="/rooted/guide" onClick={() => setIsOpen(false)}>Plant Icon Guide</Link></li>
          <li><Link to="/rooted/contact" onClick={() => setIsOpen(false)}>Contact Us</Link></li>
          <li>
            <Link to="/rooted/login" onClick={() => {
              localStorage.removeItem('access_token');
              setIsOpen(false);
            }}>
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
