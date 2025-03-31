// Function to generate random numbers within a range
const getRandom = (min, max) => Math.random() * (max - min) + min;

// Simulate sensor data for multiple plants
export function simulateSensorData() {
  const plants = {
    plant1: { minTemp: 15, maxTemp: 25, minHum: 50, maxHum: 70 },
    plant2: { minTemp: 20, maxTemp: 30, minHum: 40, maxHum: 60 },
    plant3: { minTemp: 18, maxTemp: 28, minHum: 55, maxHum: 75 }
  };

  let dataToSend = [];
  Object.keys(plants).forEach(plantId => {
    const { minTemp, maxTemp, minHum, maxHum } = plants[plantId];
    const temperature = getRandom(minTemp, maxTemp);
    const humidity = getRandom(minHum, maxHum);
    const waterAmount = getRandom(20, 80);
    const sunlightExposure = getRandom(0, 100);

    const data = {
      plantId,
      temperature,
      humidity,
      waterAmount,
      sunlightExposure
    };
    dataToSend.push(data);
  });

  return dataToSend;
}
