import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './PlantDetails.css';

const PlantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plant, setPlant] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    water: '',
    humidity: '',
    temperature: '',
    image: ''
  });

  useEffect(() => {
    const savedPlants = JSON.parse(localStorage.getItem('plants')) || [];
    const matchedPlant = savedPlants.find(p => String(p.id) === String(id));
    setPlant(matchedPlant);

    if (matchedPlant) {
      setFormData({
        name: matchedPlant.name,
        type: matchedPlant.type,
        water: matchedPlant.water,
        humidity: matchedPlant.humidity,
        temperature: matchedPlant.temperature,
        image: matchedPlant.image
      });
    }
  }, [id]);

  const handleDelete = () => {
    const savedPlants = JSON.parse(localStorage.getItem('plants')) || [];
    const updatedPlants = savedPlants.filter(p => String(p.id) !== id);
    localStorage.setItem('plants', JSON.stringify(updatedPlants));
    navigate('/');
  };

  const handleEditToggle = () => {
    setIsEditing(true);
  };

  const handleFormChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const savedPlants = JSON.parse(localStorage.getItem('plants')) || [];
    const updatedPlants = savedPlants.map(p =>
      String(p.id) === id ? { ...p, ...formData } : p
    );
    localStorage.setItem('plants', JSON.stringify(updatedPlants));
    setPlant({ ...plant, ...formData });
    setIsEditing(false);
  };

  if (!plant) return <div style={{ padding: "1rem" }}>🌱 Plant not found.</div>;

  return (
    <div className="plant-details-container">
      {isEditing ? (
        <form onSubmit={handleFormSubmit} className="edit-form">
          <input name="name" value={formData.name} onChange={handleFormChange} placeholder="Name" required />
          <input name="type" value={formData.type} onChange={handleFormChange} placeholder="Type" required />
          <input name="water" value={formData.water} onChange={handleFormChange} placeholder="Water %" required />
          <input name="humidity" value={formData.humidity} onChange={handleFormChange} placeholder="Humidity %" required />
          <input name="temperature" value={formData.temperature} onChange={handleFormChange} placeholder="Temperature" required />
          <input name="image" value={formData.image} onChange={handleFormChange} placeholder="Image URL" />
          <button type="submit">Save</button>
        </form>
      ) : (
        <>
          <Link to="/rooted" className="back-button">←</Link>
          <div className="top-section-container">
            <div className="plant-header">
              <div className="plant-title">
                <h1>{plant.name}</h1>
                <p>{plant.type}</p>
              </div>
              <div className="icons">
                <button className="edit-btn" onClick={handleEditToggle}>✏️</button>
                <button className="delete-btn" onClick={handleDelete}>🗑️</button>
              </div>
            </div>
            <div className="image-and-recs">
              <img src={plant.image || 'https://via.placeholder.com/120'} alt={plant.name} className="plant-image" />
              <div className="recommendations">
                <h3>Recommendations</h3>
                <div className="rec-box blue">Watering needed soon.</div>
                <div className="rec-box yellow">Light adjustment.</div>
              </div>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-box blue">💧 Moisture<br /><strong>{plant.water || plant.moisture}%</strong></div>
            <div className="stat-box yellow">☀️ Sunlight<br /><strong>{plant.sunlight || 65}%</strong></div>
            <div className="stat-box red">🌡️ Temperature<br /><strong>{plant.temperature}°C</strong></div>
            <div className="stat-box green">💨 Humidity<br /><strong>{plant.humidity}%</strong></div>
          </div>

          <div className="care-history">
            <h3>Care History</h3>
            <ul>
              <li><span className="dot green-dot"></span><div><strong>Watered</strong><br /><span>5 days ago, 07:34 PM</span></div></li>
              <li><span className="dot"></span><div><strong>Fertilized</strong><br /><span>March 11, 2025, 09:45 AM</span></div></li>
              <li><span className="dot"></span><div><strong>Repotted</strong><br /><span>March 02, 2025, 10:21 AM</span></div></li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default PlantDetails;