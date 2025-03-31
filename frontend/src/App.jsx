import React, { useState, useEffect } from 'react';
import { simulateSensorData } from './simulateData';

function App() {
  const [plantData, setPlantData] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const data = simulateSensorData();
      console.log('Simulated Data:', data);
      setPlantData(data);
    }, 60000);  // updates every minute

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>Plant Data Simulation</h1>
      {plantData.map((data, index) => (
        <div key={index}>
          <h2>{data.plantId}</h2>
          <p>Temperature: {data.temperature.toFixed(2)}°C</p>
          <p>Humidity: {data.humidity.toFixed(2)}%</p>
          <p>Water Amount: {data.waterAmount.toFixed(2)}%</p>
          <p>Sunlight Exposure: {data.sunlightExposure.toFixed(2)}%</p>
        </div>
      ))}
    </div>
  );
}

export default App;
