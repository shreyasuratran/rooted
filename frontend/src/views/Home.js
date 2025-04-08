import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios'; // make sure this is correct
import './Home.css';

const Home = () => {
  const [plants, setPlants] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newPlant, setNewPlant] = useState({
    name: '',
    type: '',
    image: '',
  });

  // Fetch plants from backend on component mount
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await api.get('/plants');
        setPlants(response.data);
      } catch (error) {
        console.error('Error fetching plants:', error);
      }
    };

    fetchPlants();

    const intervalId = setInterval(fetchPlants, 10000); // 60000 ms = 60 sec
    return () => clearInterval(intervalId);

  }, []);

  const handleInputChange = (e) => {
    setNewPlant({ ...newPlant, [e.target.name]: e.target.value });
  };

  const handleAddPlant = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/plants', {
        ...newPlant,
      });
      setPlants((prev) => [...prev, response.data]);
      setNewPlant({ name: '', type: '', moisture: '', humidity: '', temperature: '', image: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error adding plant:', error);
    }
  };

  return (
    <div className="home-container">
      {/* Attention Section */}
      <section className="attention-section">
        <h2>Needs Attention</h2>
        <div className="attention-scroll">
          {plants
            .flatMap((plant) => {
              const alerts = [];
              if (plant.moisture < 30) {
                alerts.push({
                  id: `${plant.id}-moisture`,
                  message: `${plant.name} needs water!`,
                  className: 'attention-critical',
                });
              } else if (plant.moisture < 50) {
                alerts.push({
                  id: `${plant.id}-moisture-soon`,
                  message: `${plant.name} will need water soon.`,
                  className: 'attention-water',
                });
              }
              if (plant.humidity < 40) {
                alerts.push({
                  id: `${plant.id}-humidity`,
                  message: `${plant.name} needs more humidity.`,
                  className: 'attention-water',
                });
              }
              if (plant.temperature < 18 || plant.temperature > 28) {
                alerts.push({
                  id: `${plant.id}-temp`,
                  message: `${plant.name} is not in optimal temperature.`,
                  className: 'attention-temp',
                });
              }
              return alerts;
            })
            .map((alert) => (
              <div key={alert.id} className={`attention-card ${alert.className}`}>
                <h3>{alert.message}</h3>
              </div>
            ))}
        </div>
      </section>

      {/* Plant List Section */}
      <section className="plant-list">
        {plants.map((plant) => (
          <Link to={`/plant/${plant.id}`} key={plant.id} className="plant-card">
            <div className="plant-image">
              <img
                src={plant.image || 'https://via.placeholder.com/100'}
                alt={plant.name}
              />
              <div
                className="status-dot"
                style={{
                  backgroundColor: plant.moisture < 50 ? 'orange' : 'green',
                }}
              ></div>
            </div>
            <div className="plant-info">
              <h3>{plant.name}</h3>
              <p className="plant-type">{plant.type}</p>
              <div className="plant-stats">
                <div className="stat-item">
                  <span className="water-icon">💧</span>
                  {plant.moisture}%
                </div>
                <div className="stat-item">
                  <span className="humidity-icon">💨</span>
                  {plant.humidity}%
                </div>
                <div className="stat-item">
                  <span className="temp-icon">🌡</span>
                  {plant.temperature}°C
                </div>
              </div>
              <p className="updated-time">
                Updated {new Date(plant.updated_at).toLocaleString('en-US', {
                  timeZone: 'America/Chicago', // Central Time (CT)
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
          </Link>
        ))}
      </section>

      {/* Floating Action Button */}
      <button className="fab-button" onClick={() => setShowForm(true)}>+</button>

      {/* Add Plant Modal */}
      {showForm && (
        <div className="add-plant-modal">
          <form className="add-plant-form" onSubmit={handleAddPlant}>
            <h3>Add New Plant</h3>
            <input type="text" name="name" placeholder="Plant Name" value={newPlant.name} onChange={handleInputChange} required />
            <input type="text" name="type" placeholder="Plant Type" value={newPlant.type} onChange={handleInputChange} required />
            <input type="text" name="image" placeholder="Image URL (optional)" value={newPlant.image} onChange={handleInputChange} />
            <button type="submit">Add Plant</button>
            <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Home;