import React from 'react';
import './Profile.css';
import { Link } from 'react-router-dom';
import { useUser } from '../components/UserContext';

const Profile = () => {
  const { user } = useUser();

  return (
    <div className="profile-container">
      <div className="profile-header">
        <Link to="/rooted" className="back-arrow">←</Link>
        <h1>My Profile</h1>
      </div>

      <div className="profile-card">
        <img src={user?.profile_picture} alt="Profile Avatar" className="profile-avatar" />
        <h2>{user?.first_name} {user?.last_name}</h2>
        <p className="profile-detail"><strong>Email:</strong> {user?.email}</p>
        <p className="profile-detail"><strong>Joined:</strong> {new Date(user?.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long', // or 'short' for "Apr"
        })}</p>
      </div>
    </div>
  );
};

export default Profile;