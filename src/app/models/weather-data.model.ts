import { CurrentWeather } from "./current-weather.model";
import { DailyForecast } from "./daily-forecast.model";

export interface WeatherData {
    current: CurrentWeather;
    daily: DailyForecast[];
    location: {
      name: string;
      country: string;
      lat: number;
      lon: number;
      flag?: string;
    };
  }