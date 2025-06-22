export interface WeatherData {
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  rainProbability: number;
  uvIndex: number;
  timestamp: number;
}

export type WeatherDataPoint = {
  value: number;
  time: string;
};

export type WeatherHistoryData = {
  temperature: WeatherDataPoint[];
  humidity: WeatherDataPoint[];
  pressure: WeatherDataPoint[];
  windSpeed: WeatherDataPoint[];
  rainProbability: WeatherDataPoint[];
  uvIndex: WeatherDataPoint[];
};
