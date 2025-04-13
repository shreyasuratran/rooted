import React, { useState, useEffect } from 'react';
import './Profile.css';
import { Link } from 'react-router-dom';
import { useUser } from '../components/UserContext';

const Profile = () => {
  const { user } = useUser();
  const defaultAvatar = "https://www.gravatar.com/avatar/?d=mp";
  
  const [profilePic, setProfilePic] = useState(() => {
    return localStorage.getItem("profile_picture") || user?.profile_picture || "";
  });

  useEffect(() => {
    if (profilePic) {
      localStorage.setItem("profile_picture", profilePic);
    }
  }, [profilePic]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePic(reader.result); // base64 string
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <Link to="/rooted" className="back-arrow">←</Link>
        <h1>My Profile</h1>
      </div>

      <div className="profile-card">
        <label htmlFor="upload-avatar" className="upload-wrapper">
          <img
            src={profilePic || defaultAvatar}
            alt="Profile Avatar"
            className="profile-avatar"
          />
          <p className="upload-text">
            {profilePic ? 'Change profile image' : 'Add profile image'}
          </p>
        </label>
        <input
          id="upload-avatar"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />

        <h2>{user?.first_name} {user?.last_name}</h2>
        <p className="profile-detail"><strong>Email:</strong> {user?.email}</p>
        <p className="profile-detail"><strong>Joined:</strong> {new Date(user?.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
        })}</p>
      </div>
    </div>
  );
};

export default Profile;
