import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import './PlantDetails.css';
import { formatDistanceToNow, format } from 'date-fns';


const PlantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plant, setPlant] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [needsWater, setNeedsWater] = useState(false);
  const [needsHumidity, setNeedsHumidity] = useState(false);
  const [adjustLight, setAdjustLight] = useState(false);
  const [adjustTemp, setAdjustTemp] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    moisture: '',
    humidity: '',
    temperature: '',
    image: ''
  });
  const [activeInfo, setActiveInfo] = useState(null);

  const infoContent = {
    water: {
      title: "Water",
      body: "Water percentage represents how moist the soil is."
    },
    sunlight: {
      title: "Sunlight",
      body: "This value shows how much light your plant receives."
    },
    temperature: {
      title: "Temperature",
      body: "Plants thrive in stable temperatures between 18–28°C."
    },
    humidity: {
      title: "Humidity",
      body: "Humidity measures moisture in the air."
    }
  };

  useEffect(() => {
    if (!plant) return;
  
    setNeedsWater(plant.moisture < 50);
    setNeedsHumidity(plant.humidity < 40);
    setAdjustLight(plant.sunlight < 40 || plant.sunlight > 90);
    setAdjustTemp(plant.temperature < 18 || plant.temperature > 28);
  }, [plant]);

  // Fetch plant from API
  useEffect(() => {
    const fetchPlant = async () => {
      try {
        const response = await api.get(`/plants/${id}`);
        setPlant(response.data);
        setFormData({
          name: response.data.name,
          type: response.data.type,
          moisture: response.data.moisture,
          humidity: response.data.humidity,
          temperature: response.data.temperature,
          image: response.data.image
        });
      } catch (error) {
        console.error('Error fetching plant:', error);
      }
    };
    fetchPlant();

    const intervalId = setInterval(fetchPlant, 10000); // 60000 ms = 60 sec
    return () => clearInterval(intervalId);

  }, [id]);



  const fixConditions = async(e) => {
    e.preventDefault();
    try {
      const payload = {
        ...(needsWater && { moisture: Math.floor(Math.random() * 30 + 70 )}),
        ...(needsHumidity && { humidity: Math.floor(Math.random() * 20 + 40 )}),
        ...(adjustTemp && { temperature: Math.floor(Math.random() * 10 + 18 )}),
        ...(adjustLight && { sunlight: Math.floor(Math.random() * 30 + 70 )}),
      };
      if (Object.keys(payload).length !== 0) {
        const response = await api.put(`/plants/${id}`, payload);
        setPlant(response.data);
      }
    } catch (error) {
      console.error('Error updating plant:', error);
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/plants/${id}`);
      navigate('/home');
    } catch (error) {
      console.error('Error deleting plant:', error);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(true);
  };

  const handleFormChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/plants/${id}`, formData);
      setPlant(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating plant:', error);
    }
  };

  if (!plant) return <div style={{ padding: "1rem" }}>🌱 Plant not found.</div>;

  return (
    <div className="plant-details-container">
      {isEditing ? (
        <form onSubmit={handleFormSubmit} className="edit-form">
          <input name="name" value={formData.name} onChange={handleFormChange} placeholder="Name" required />
          <input name="type" value={formData.type} onChange={handleFormChange} placeholder="Type" required />
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
              <div className="recommendations">
                <img src={plant.image || 'https://via.placeholder.com/120'} alt={plant.name} className="plant-image" />
                <button className='secondary-button' onClick={fixConditions}>Fix Conditions</button>
              </div>
              <div className="recommendations">
                <h3>Recommendations:</h3>
                {needsWater && <div className="rec-box blue">Water plant.</div>}
                {needsHumidity && <div className="rec-box blue">Adjust humidity.</div>}
                {adjustTemp && <div className="rec-box yellow">Watering needed soon.</div>}
                {adjustLight && <div className="rec-box yellow">Light adjustment.</div>}
              </div>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-box blue" onClick={() => setActiveInfo('water')}>
              <div className="stat-content">
                💧 Moisture<br />
                <strong>{plant.moisture}%</strong>
              </div>
            </div>
            <div className="stat-box yellow" onClick={() => setActiveInfo('sunlight')}>
              <div className="stat-content">
                ☀️ Sunlight<br />
                <strong>{plant.sunlight}%</strong>
              </div>
            </div>
            <div className="stat-box red" onClick={() => setActiveInfo('temperature')}>
              <div className="stat-content">
                🌡️ Temperature<br />
                <strong>{plant.temperature}°C</strong>
              </div>
            </div>
            <div className="stat-box green" onClick={() => setActiveInfo('humidity')}>
              <div className="stat-content">
                💨 Humidity<br />
                <strong>{plant.humidity}%</strong>
              </div>
            </div>
          </div>

          <div className="care-history">
            <h3>History</h3>
            <ul>
              <li>
                <div>
                  <strong>Updated</strong><br />
                  {plant.updated_at
                    ? <span>{formatDistanceToNow(new Date(plant.updated_at), { addSuffix: true })}, {format(new Date(plant.updated_at), 'hh:mm a')}</span>
                    : <span>Never</span>}
                </div>
              </li>
              <li>
                <div>
                  <strong>Watered</strong><br />
                  {plant.last_watered
                    ? <span>{formatDistanceToNow(new Date(plant.last_watered), { addSuffix: true })}, {format(new Date(plant.last_watered), 'hh:mm a')}</span>
                    : <span>Never</span>}
                </div>
              </li>
              <li>
                <div>
                  <strong>Fertilized</strong><br />
                  {plant.last_fertilized
                    ? <span>{formatDistanceToNow(new Date(plant.last_fertilized), { addSuffix: true })}, {format(new Date(plant.last_fertilized), 'hh:mm a')}</span>
                    : <span>Never</span>}
                </div>
              </li>
              <li>
                <div>
                  <strong>Repotted</strong><br />
                  {plant.last_repotted
                    ? <span>{formatDistanceToNow(new Date(plant.last_repotted), { addSuffix: true })}, {format(new Date(plant.last_repotted), 'hh:mm a')}</span>
                    : <span>Never</span>}
                </div>
              </li>
            </ul>
          </div>
        </>
      )}

      {activeInfo && (
        <div className="info-modal-overlay" onClick={() => setActiveInfo(null)}>
          <div className="info-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{infoContent[activeInfo].title}</h3>
            <p>{infoContent[activeInfo].body}</p>
            <button onClick={() => setActiveInfo(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantDetails;