import { CurrentWeather } from "./current-weather.model";
import { DailyForecast } from "./daily-forecast.model";
import { HourlyForecast } from "./hourly-forecast.model";

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