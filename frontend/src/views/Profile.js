import React, { useState, useEffect } from 'react';
import './Profile.css';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import { useUser } from '../components/UserContext';

const Profile = () => {
  const { user, setUser } = useUser();
  const defaultAvatar = "https://www.gravatar.com/avatar/?d=mp";
  
  // Initialize profilePic from the user data.
  const [profilePic, setProfilePic] = useState(user?.profile_picture || defaultAvatar);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Update profilePic when the user context changes
  useEffect(() => {
    setProfilePic(user?.profile_picture || defaultAvatar);
  }, [user]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Prepare form data for file upload
    const formData = new FormData();
    formData.append("file", file);

    setUploadLoading(true);
    setUploadError("");

    try {
      // Upload the file to S3 via your /upload/ endpoint
      const uploadResponse = await api.post("/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      
      console.log("Upload response:", uploadResponse.data);
      
      // Assume the response returns the image URL as "url"
      const imageURL = uploadResponse.data.url;
      if (!imageURL) {
        throw new Error("No image URL returned from upload endpoint");
      }
      console.log("Generated image URL:", imageURL);

      // Update the user's profile with the new image URL
      const updateResponse = await api.put("/users/me", {
        profile_picture: imageURL
      });
      console.log("User update response:", updateResponse.data);

      // Optionally update user context with new profile data
      if (setUser && updateResponse.data) {
        setUser(updateResponse.data);
      }

      // Update the local state to show the new profile picture
      setProfilePic(imageURL);
      
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadError("Upload failed. Please try again.");
    } finally {
      setUploadLoading(false);
    }
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
            src={profilePic}
            alt="Profile Avatar"
            className="profile-avatar"
          />
          <p className="upload-text">
            {profilePic && profilePic !== defaultAvatar ? 'Change profile image' : 'Add profile image'}
          </p>
        </label>
        <input
          id="upload-avatar"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploadLoading}
          style={{ display: 'none' }}
        />

        {uploadError && <p className="error">{uploadError}</p>}

        <h2>{user?.first_name} {user?.last_name}</h2>
        <p className="profile-detail"><strong>Email:</strong> {user?.email}</p>
        <p className="profile-detail">
          <strong>Joined:</strong> {new Date(user?.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
          })}
        </p>
      </div>
    </div>
  );
};

export default Profile;