import { WeatherData, WeatherHistoryData } from "../types";

export function generateWeatherData(): WeatherData {
  return {
    temperature: parseFloat((Math.random() * 15 + 15).toFixed(1)), // 15-30°C
    humidity: parseFloat((Math.random() * 40 + 40).toFixed(1)), // 40-80%
    pressure: parseFloat((Math.random() * 20 + 1000).toFixed(1)), // 1000-1020 hPa
    windSpeed: parseFloat((Math.random() * 20).toFixed(1)), // 0-20 km/h
    rainProbability: parseFloat((Math.random() * 100).toFixed(1)), // 0-100%
    uvIndex: Math.floor(Math.random() * 11), // 0-10
    timestamp: Date.now(),
  };
}

export function generateHistoricalData(hours: number): WeatherHistoryData {
  const now = new Date();
  const data: WeatherHistoryData = {
    temperature: [],
    humidity: [],
    pressure: [],
    windSpeed: [],
    rainProbability: [],
    uvIndex: [],
  };

  for (let i = hours; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const hourOfDay = time.getHours();
    let baseTemp = 20;
    if (hourOfDay >= 10 && hourOfDay <= 14) {
      baseTemp = 27;
    } else if (hourOfDay >= 6 && hourOfDay < 10) {
      baseTemp = 23;
    } else if (hourOfDay >= 15 && hourOfDay <= 18) {
      baseTemp = 25;
    } else {
      baseTemp = 18;
    }
    
    data.temperature.push({
      time: timeString,
      value: parseFloat((baseTemp + Math.random() * 3 - 1.5).toFixed(1)),
    });

    data.humidity.push({
      time: timeString,
      value: parseFloat((80 - (baseTemp - 18) * 2 + Math.random() * 10 - 5).toFixed(1)),
    });

    data.pressure.push({
      time: timeString,
      value: parseFloat((1010 + Math.sin(i / 3) * 5 + Math.random() * 2 - 1).toFixed(1)),
    });

    data.windSpeed.push({
      time: timeString,
      value: parseFloat((5 + Math.random() * 10).toFixed(1)),
    });

    data.rainProbability.push({
      time: timeString,
      value: parseFloat((Math.random() * 70).toFixed(1)),
    });

    const uvBase = hourOfDay >= 10 && hourOfDay <= 15 ? 8 : hourOfDay >= 7 && hourOfDay <= 18 ? 5 : 0;
    data.uvIndex.push({
      time: timeString,
      value: Math.max(0, Math.min(10, Math.floor(uvBase + Math.random() * 2 - 1))),
    });
  }

  return data;
}
