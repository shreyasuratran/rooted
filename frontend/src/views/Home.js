import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import './Home.css';

const Home = () => {
  const [plants, setPlants] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newPlant, setNewPlant] = useState({ name: '', type: '', image: '' });
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [activeTab, setActiveTab] = useState("manual");
  const [showAllAlerts, setShowAllAlerts] = useState(false);

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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploadLoading(true);
    setUploadError('');

    try {
      const response = await api.post("/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const imageURL = response.data.url;
      setNewPlant((prev) => ({ ...prev, image: imageURL }));
    } catch (error) {
      console.error("Error uploading plant image:", error);
      setUploadError("Failed to upload image.");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleSmartUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploadLoading(true);
    setUploadError('');

    try {
      const response = await api.post("/upload/recognize", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const { name, type, url } = response.data;
      setNewPlant((prev) => ({
        ...prev,
        name: name || prev.name,
        type: type || prev.type,
        image: url || prev.image
      }));
    } catch (error) {
      console.error("Error with smart recognition:", error);
      setUploadError("Smart recognition failed.");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleAddPlant = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/plants/', { ...newPlant });
      setPlants((prev) => [...prev, response.data]);
      setNewPlant({ name: '', type: '', image: '' });
      setShowForm(false);
      setUploadError('');
      setActiveTab("manual");
    } catch (error) {
      console.error('Error adding plant:', error);
    }
  };

  const alerts = plants.flatMap((plant) => {
    const list = [];
    if (plant.moisture < 30)
      list.push({ id: `${plant.id}-moisture`, message: `${plant.name} needs water!`, className: 'attention-critical' });
    else if (plant.moisture < 50)
      list.push({ id: `${plant.id}-moisture-soon`, message: `${plant.name} will need water soon.`, className: 'attention-water' });
    if (plant.humidity < 40)
      list.push({ id: `${plant.id}-humidity`, message: `${plant.name} needs more humidity.`, className: 'attention-water' });
    if (plant.temperature < 18 || plant.temperature > 28)
      list.push({ id: `${plant.id}-temp`, message: `${plant.name} is not in optimal temperature.`, className: 'attention-temp' });
    return list;
  });

  const formatAlert = (msg) => {
    const [first, ...rest] = msg.split(" ");
    return (
      <h3>
        <span className="plant-name">{first}</span> {rest.join(" ")}
      </h3>
    );
  };

  return (
    <div className="home-container">
      <h1 className="home-title">My Plants</h1>
      <hr className="section-divider" />

      <section className="attention-section">
        <h2 className="attention-title">Needs Attention</h2>
        <div className="attention-scroll">
          {alerts.length === 0 ? (
            <div className="no-attention-msg">Your plants are doing great! 🌿</div>
          ) : (
            alerts.slice(0, 2).map((alert) => (
              <div key={alert.id} className={`attention-card ${alert.className}`}>
                {formatAlert(alert.message)}
              </div>
            ))
          )}
          {alerts.length > 2 && (
            <button className="see-more-btn" onClick={() => setShowAllAlerts(true)}>
              <span className="icon">🌿</span> +{alerts.length - 2} more...
            </button>
          )}
        </div>
      </section>

      <section className="plant-list">
        {plants.length === 0 ? (
          <p className="no-plants-msg">Add your first plant by clicking the green plus ⬇️</p>
        ) : (
          plants.map((plant) => (
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
                    <strong>{plant.moisture ? plant.moisture + '%' : 'Sensing...'}</strong>
                    <div className="stat-label">Moisture</div>
                  </div>
                  <div className="stat-item">
                    <span>💨</span>
                    <strong>{plant.humidity ? plant.humidity + '%' : 'Sensing...'}</strong>
                    <div className="stat-label">Humidity</div>
                  </div>
                  <div className="stat-item">
                    <span>🌡️</span>
                    <strong>{plant.temperature ? plant.temperature + '°C' : 'Sensing...'}</strong>
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
          ))
        )}
      </section>

      <button className="fab-button" onClick={() => setShowForm(true)}>+</button>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowForm(false)}>×</button>
            <h3>Add New Plant</h3>

            <div className="tab-header">
              <button
                type="button"
                className={activeTab === "manual" ? "active tab" : "tab"}
                onClick={() => {
                  if (activeTab === "smart") setNewPlant({ name: '', type: '', image: '' });
                  setActiveTab("manual");
                }}
              >
                Manual
              </button>
              <button
                type="button"
                className={activeTab === "smart" ? "active tab" : "tab"}
                onClick={() => {
                  if (activeTab === "manual") setNewPlant({ name: '', type: '', image: '' });
                  setActiveTab("smart");
                }}
              >
                Smart
              </button>
            </div>

            <form className="add-plant-form" onSubmit={handleAddPlant}>
              {activeTab === "manual" && (
                <>
                  <input
                    type="text"
                    name="name"
                    placeholder="Plant Name"
                    value={newPlant.name}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="text"
                    name="type"
                    placeholder="Plant Type"
                    value={newPlant.type}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    required={!newPlant.image}
                  />
                  {uploadLoading && <p>Uploading image...</p>}
                  {uploadError && <p style={{ color: 'red' }}>{uploadError}</p>}
                  {newPlant.image && (
                    <div className="image-preview">
                      <img src={newPlant.image} alt="Uploaded Plant" style={{ maxWidth: "100px" }} />
                    </div>
                  )}
                </>
              )}
              {activeTab === "smart" && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSmartUpload}
                    required
                  />
                  {uploadLoading && <p>Recognizing plant...</p>}
                  {uploadError && <p style={{ color: 'red' }}>{uploadError}</p>}
                  {newPlant.name && (
                    <>
                      <input
                        type="text"
                        name="name"
                        placeholder="Plant Name"
                        value={newPlant.name}
                        onChange={handleInputChange}
                        required
                      />
                      <input
                        type="text"
                        name="type"
                        placeholder="Plant Type"
                        value={newPlant.type}
                        onChange={handleInputChange}
                        required
                      />
                    </>
                  )}
                  {newPlant.image && (
                    <div className="image-preview">
                      <img src={newPlant.image} alt="Recognized Plant" style={{ maxWidth: "100px" }} />
                    </div>
                  )}
                </>
              )}
              <button type="submit">Add Plant</button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setNewPlant({ name: '', type: '', image: '' });
                }}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {showAllAlerts && (
        <div className="modal-overlay" onClick={() => setShowAllAlerts(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowAllAlerts(false)}>×</button>
            <h3>All Plant Alerts</h3>
            <div className="all-alerts-list">
              {alerts.map((alert) => (
                <div key={alert.id} className={`attention-card ${alert.className}`}>
                  {formatAlert(alert.message)}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
