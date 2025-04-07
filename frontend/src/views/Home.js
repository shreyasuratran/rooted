import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [plants, setPlants] = useState(() => {
    const saved = localStorage.getItem('plants');
    if (saved) {
      try {
        return JSON.parse(saved); // Use existing localStorage data if valid
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
      }
    }
    const initialPlants = [
      {
        id: 1,
        name: 'Fiddle-Leaf Fig',
        type: 'Ficus lyrata',
        water: 78,
        humidity: 85,
        temperature: 22,
        updatedAt: '03:12 PM',
        image: '',
      },
      {
        id: 2,
        name: 'Snake Plant',
        type: 'Sansevieria trifasciata',
        water: 31,
        humidity: 65,
        temperature: 24,
        updatedAt: '01:45 PM',
        image: '',
      }
    ];
    localStorage.setItem('plants', JSON.stringify(initialPlants));
    return initialPlants;
  });
  
  const [showForm, setShowForm] = useState(false);
  const [newPlant, setNewPlant] = useState({
    name: '',
    type: '',
    water: '',
    humidity: '',
    temperature: '',
    image: '',
  });

  const handleInputChange = (e) => {
    setNewPlant({ ...newPlant, [e.target.name]: e.target.value });
  };

  const handleAddPlant = (e) => {
    e.preventDefault();
    const updatedPlants = [
      ...plants,
      {
        ...newPlant,
        id: plants.length + 1,
        updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
    setPlants(updatedPlants);
    localStorage.setItem('plants', JSON.stringify(updatedPlants));
    setNewPlant({ name: '', type: '', water: '', humidity: '', temperature: '', image: '' });
    setShowForm(false);
  };

  return (
    <div className="home-container">
      <section className="attention-section">
        <h2>Needs Attention</h2>

        <div className="attention-card attention-water">
          <h3>Snake Plant Needs Care</h3>
          <p>Your Snake Plant will need water soon.</p>
        </div>

        <div className="attention-card attention-critical">
          <h3>Monstera Needs Care</h3>
          <p>Urgent: Your Monstera is critically dry.</p>
        </div>
      </section>

      <section className="plant-list">
        {plants.map((plant) => (
          <Link
            to={`/plant/${plant.id}`}
            key={plant.id}
            className="plant-card"
          >
            <div className="plant-image">
              <img
                src={plant.image || 'https://via.placeholder.com/100'}
                alt={plant.name}
              />
              <div
                className="status-dot"
                style={{
                  backgroundColor: plant.water < 50 ? 'orange' : 'green',
                }}
              ></div>
            </div>
            <div className="plant-info">
              <h3>{plant.name}</h3>
              <p className="plant-type">{plant.type}</p>
              <div className="plant-stats">
                <div className="stat-item">
                  <span className="water-icon">💧</span>
                  {plant.water}%
                </div>
                <div className="stat-item">
                  <span className="humidity-icon">☀️</span>
                  {plant.humidity}%
                </div>
                <div className="stat-item">
                  <span className="temp-icon">🌡</span>
                  {plant.temperature}°C
                </div>
              </div>
              <p className="updated-time">Updated {plant.updatedAt}</p>
            </div>
          </Link>
        ))}
      </section>

      <button className="fab-button" onClick={() => setShowForm(true)}>+</button>

      {showForm && (
        <div className="add-plant-modal">
          <form className="add-plant-form" onSubmit={handleAddPlant}>
            <h3>Add New Plant</h3>
            <input type="text" name="name" placeholder="Plant Name" value={newPlant.name} onChange={handleInputChange} required />
            <input type="text" name="type" placeholder="Plant Type" value={newPlant.type} onChange={handleInputChange} required />
            <input type="number" name="water" placeholder="Water (%)" value={newPlant.water} onChange={handleInputChange} required />
            <input type="number" name="humidity" placeholder="Humidity (%)" value={newPlant.humidity} onChange={handleInputChange} required />
            <input type="number" name="temperature" placeholder="Temperature (°C)" value={newPlant.temperature} onChange={handleInputChange} required />
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