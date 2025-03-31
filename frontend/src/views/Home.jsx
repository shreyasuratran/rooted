import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; 

const Home = () => {
  //added in the data from the mockup but when backend is connected we can swtich it
  const plants = [
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

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="header-text">
          <h1>My Plants</h1>
          <p>Monitor & Manage Your Plants</p>
        </div>
        <div className="profile-avatar">
          <img
            src="https://via.placeholder.com/40" 
            alt="Profile avatar"
            className="avatar-img"
          />
        </div>
      </header>

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
              <img src={plant.image || 'https://via.placeholder.com/100'} alt={plant.name} />
              <div className="status-dot" style={{ backgroundColor: plant.water < 50 ? 'orange' : 'green' }}></div>
            </div>
            <div className="plant-info">
              <h3>{plant.name}</h3>
              <p className="plant-type">{plant.type}</p>
              <div className="plant-stats">
                <div className="stat-item">
                  <span className="water-icon">💧</span>{plant.water}%
                </div>
                <div className="stat-item">
                  <span className="humidity-icon">☀️</span>{plant.humidity}%
                </div>
                <div className="stat-item">
                  <span className="temp-icon">🌡</span>{plant.temperature}°C
                </div>
              </div>
              <p className="updated-time">Updated {plant.updatedAt}</p>
            </div>
          </Link>
        ))}
      </section>

      <button className="fab-button">+</button>
    </div>
  );
};

export default Home;
