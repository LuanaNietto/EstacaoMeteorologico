const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3001;
const ADDRESS = '0.0.0.0';
const db = new sqlite3.Database('./weather.db');

db.run(`
  CREATE TABLE IF NOT EXISTS weather_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    temperature REAL,
    humidity REAL,
    timestamp INTEGER
  )
`);

app.use(cors());
app.use(express.json());

let weatherData = {
  temperature: 0,
  humidity: 0,
  pressure: 0,
  windSpeed: 0,
  rainProbability: 0,
  uvIndex: 0,
  timestamp: Date.now(),
};

// Endpoint para receber dados (POST)
app.post('/api/weather', (req, res) => {
  const { temperature, humidity } = req.body;
  weatherData = {
    ...weatherData,
    temperature,
    humidity,
    timestamp: Date.now(),
  };
  db.run(
    'INSERT INTO weather_history (temperature, humidity, timestamp) VALUES (?, ?, ?)',
    [temperature, humidity, Date.now()]
  );
  res.json({ status: 'ok' });
});

// Endpoint para fornecer dados (GET)
app.get('/api/weather', (req, res) => {
  if (weatherData.temperature === 0 && weatherData.humidity === 0) {
    db.get(
      `SELECT temperature, humidity, timestamp FROM weather_history ORDER BY timestamp DESC LIMIT 1`,
      (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row) {
          weatherData = {
            temperature: row.temperature,
            humidity: row.humidity,
            pressure: 0, // Placeholder, adjust as needed
            windSpeed: 0, // Placeholder, adjust as needed
            rainProbability: 0, // Placeholder, adjust as needed
            uvIndex: 0, // Placeholder, adjust as needed
            timestamp: row.timestamp,
          };
        }
      }
    )
  }
  res.json(weatherData);
});

app.get('/api/weather/minmax', (req, res) => {
  const since = Date.now() - 24 * 60 * 60 * 1000;
  db.all(
    `SELECT temperature, humidity, timestamp FROM weather_history WHERE timestamp >= ? ORDER BY timestamp ASC`,
    [since],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });

      // Format data as WeatherHistoryData
      const temperature = [];
      const humidity = [];
      // You can add pressure, windSpeed, rainProbability, uvIndex if you store them
      rows.forEach(row => {
        const time = new Date(row.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        temperature.push({ time, value: row.temperature });
        humidity.push({ time, value: row.humidity });
      });

      const history = {
        temperature,
        humidity,
        pressure: [],
        windSpeed: [],
        rainProbability: [],
        uvIndex: []
      };

      res.json(history);
    }
  );
});

app.listen(PORT, ADDRESS, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});