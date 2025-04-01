// A guide or help page with information about how to care for the plants or use the app.
import React from 'react';
import './Guide.css';
import { Link } from 'react-router-dom';

const Guide = () => {
  return (
    <div className="guide-container">
      <div className="guide-header">
        <Link to="/" className="back-arrow">←</Link>
        <h1>Plant Care Guide</h1>
        <p className="subtitle">Understand Your Plants Needs.</p>
      </div>

      <section className="color-section">
        <h2>Pot Colors</h2>
        <div className="color-grid">
          <div className="color-card">
            <div className="dot green-dot"></div>
            <div>
              <strong>Green</strong>
              <p>Plant is healthy and thriving.</p>
            </div>
          </div>
          <div className="color-card">
            <div className="dot amber-dot"></div>
            <div>
              <strong>Amber</strong>
              <p>Plant needs attention soon.</p>
            </div>
          </div>
          <div className="color-card">
            <div className="dot red-dot"></div>
            <div>
              <strong>Red</strong>
              <p>Urgent care is needed.</p>
            </div>
          </div>
          <div className="color-card">
            <div className="dot gray-dot"></div>
            <div>
              <strong>Gray</strong>
              <p>Plant is dormant or in rest state.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="metric-section">
        <h2>Plant Care Metrics</h2>
        <div className="metrics-grid">
          <div className="metric-card">
            <span className="icon">💧</span>
            <div>
              <strong>Moisture</strong>
              <p>The moisture sensor measures how wet/dry soil is. Optimal moisture varies by plant.</p>
            </div>
          </div>
          <div className="metric-card">
            <span className="icon">☀️</span>
            <div>
              <strong>Sunlight</strong>
              <p>The light sensor tracks how much light your plant gets. We want it not too bright and not too dim.</p>
            </div>
          </div>
          <div className="metric-card">
            <span className="icon">🌡️</span>
            <div>
              <strong>Temperature</strong>
              <p>The temperature sensor measures the temperature around your plant. Plants do well from 18–24°C.</p>
            </div>
          </div>
          <div className="metric-card">
            <span className="icon">💨</span>
            <div>
              <strong>Humidity</strong>
              <p>The humidity sensor measures moisture in the air. Most indoor plants prefer 40–60%.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Guide;
