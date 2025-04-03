import React from 'react';
import './Profile.css';
import { Link } from 'react-router-dom';

const Profile = () => {
  const user = {
    name: 'Asha Greenleaf',
    username: '@plantlover984',
    email: 'asha.greenleaf@example.com',
    location: 'Austin, TX',
    joined: 'March 2024',
    avatar: '/avatar.jpeg',
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <Link to="/" className="back-arrow">←</Link>
        <h1>My Profile</h1>
      </div>

      <div className="profile-card">
        <img src={user.avatar} alt="Profile Avatar" className="profile-avatar" />
        <h2>{user.name}</h2>
        <p className="username">{user.username}</p>
        <p className="profile-detail"><strong>Email:</strong> {user.email}</p>
        <p className="profile-detail"><strong>Location:</strong> {user.location}</p>
        <p className="profile-detail"><strong>Joined:</strong> {user.joined}</p>
      </div>
    </div>
  );
};

export default Profile;