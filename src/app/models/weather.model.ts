export interface CurrentWeather {
    temperature: number;
    feelsLike: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    windDirection: number;
    description: string;
    icon: string;
    main: string;
    timestamp: number;
  }
  
  export interface DailyForecast {
    date: number;
    minTemp: number;
    maxTemp: number;
    humidity: number;
    description: string;
    icon: string;
    main: string;
    precipitation: number;
    windSpeed: number;
  }
  
  export interface HourlyForecast {
    time: number;
    temperature: number;
    feelsLike: number;
    icon: string;
    description: string;
    precipitation: number;
  }
  
  export interface WeatherData {
    current: CurrentWeather;
    hourly: HourlyForecast[];
    daily: DailyForecast[];
    location: {
      name: string;
      country: string;
      lat: number;
      lon: number;
    };
  }