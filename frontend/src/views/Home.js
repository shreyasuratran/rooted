import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import './Home.css';
const UNSPLASH_ACCESS_KEY = 'JPQ618WPRpM8GZ9Z6H3xVpvz9xzLAt5bBu6_O-oUQ7U';

const Home = () => {
  const [plants, setPlants] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newPlant, setNewPlant] = useState({ name: '', type: '', image: '' });
  const [suggestedImages, setSuggestedImages] = useState([]);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await api.get('/plants/');
        setPlants(response.data);
      } catch (error) {
        console.error('Error fetching plants:', error);
      }
    };

    fetchPlants();
    const intervalId = setInterval(fetchPlants, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlant((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPlant = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/plants/', { ...newPlant });
      setPlants((prev) => [...prev, response.data]);
      setNewPlant({ name: '', type: '', image: '' });
      setSuggestedImages([]);
      setShowForm(false);
    } catch (error) {
      console.error('Error adding plant:', error);
    }
  };

  const fetchImageSuggestions = async () => {
  /**
   * Handle deleting a plant.
   * @param {number} id - the plant id
   * @returns {Promise<void>}
   */
    if (!newPlant.type || newPlant.type.length < 2) return;
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${newPlant.type}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=6`
      );
      const data = await response.json();
      setSuggestedImages(data.results.map((img) => img.urls.small));
    } catch (err) {
      console.error('Failed to fetch images:', err);
    }
  };

  return (
    <div className="home-container">
      <h1 className="home-title">My Plants</h1>
      <hr className="section-divider" />

      <section className="attention-section">
        <h2 className="attention-title">Needs Attention</h2>
        <div className="attention-scroll">
          {plants
            .flatMap((plant) => {
              const alerts = [];
              if (plant.moisture < 30)
                alerts.push({ id: `${plant.id}-moisture`, message: `${plant.name} needs water!`, className: 'attention-critical' });
              else if (plant.moisture < 50)
                alerts.push({ id: `${plant.id}-moisture-soon`, message: `${plant.name} will need water soon.`, className: 'attention-water' });
              if (plant.humidity < 40)
                alerts.push({ id: `${plant.id}-humidity`, message: `${plant.name} needs more humidity.`, className: 'attention-water' });
              if (plant.temperature < 18 || plant.temperature > 28)
                alerts.push({ id: `${plant.id}-temp`, message: `${plant.name} is not in optimal temperature.`, className: 'attention-temp' });
              return alerts;
            })
            .map((alert) => (
              <div key={alert.id} className={`attention-card ${alert.className}`}>
                <h3>{alert.message}</h3>
              </div>
            ))}
        </div>
      </section>

      <section className="plant-list">
        {plants.map((plant) => (
          <Link to={`/rooted/plant/${plant.id}`} key={plant.id} className="plant-card">
            <div className="plant-image">
              <img src={plant.image || 'https://via.placeholder.com/100'} alt={plant.name} />
              <div className="status-dot" style={{ backgroundColor: plant.moisture < 50 ? 'orange' : 'green' }}></div>
            </div>
            <div className="plant-info">
              <h3>{plant.name}</h3>
              <p className="plant-type">{plant.type}</p>
              <div className="plant-stats">
                <div className="stat-item">
                  <span>💧</span>
                  <strong>{plant.moisture}%</strong>
                  <div className="stat-label">Moisture</div>
                </div>
                <div className="stat-item">
                  <span>💨</span>
                  <strong>{plant.humidity}%</strong>
                  <div className="stat-label">Humidity</div>
                </div>
                <div className="stat-item">
                  <span>🌡️</span>
                  <strong>{plant.temperature}°C</strong>
                  <div className="stat-label">Temp</div>
                </div>
              </div>
              <p className="updated-time">
                Last Updated {new Date(plant.updated_at.replace(' ', 'T') + 'Z').toLocaleString('en-US', {
                  hour: '2-digit', minute: '2-digit', hour12: true, month: 'short', day: 'numeric'
                })}
              </p>
            </div>
          </Link>
        ))}
      </section>

      <button className="fab-button" onClick={() => setShowForm(true)}>+</button>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <form className="add-plant-form" onSubmit={handleAddPlant}>
              <button type="button" className="modal-close-btn" onClick={() => setShowForm(false)}>×</button>
              <h3>Add New Plant</h3>
              <input type="text" name="name" placeholder="Plant Name" value={newPlant.name} onChange={handleInputChange} required />
              <input type="text" name="type" placeholder="Plant Type" value={newPlant.type} onChange={handleInputChange} required />
              <button type="button" className="lookup-button" onClick={fetchImageSuggestions}>🔍 Look Up Image</button>
              <input type="text" name="image" placeholder="Image URL (optional)" value={newPlant.image} onChange={handleInputChange} />
              {suggestedImages.length > 0 && (
                <div className="image-suggestions">
                  <p>Suggested Images:</p>
                  <div className="image-grid">
                    {suggestedImages.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt="Suggested plant"
                        onClick={() => setNewPlant((prev) => ({ ...prev, image: url }))}
                        className={`image-option ${newPlant.image === url ? 'selected' : ''}`}
                      />
                    ))}
                  </div>
                </div>
              )}
              <button type="submit">Add Plant</button>
              <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;