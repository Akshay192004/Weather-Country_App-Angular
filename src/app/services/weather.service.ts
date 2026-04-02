import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { WeatherData } from '../models/weather-data.model';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private readonly API_URL = 'https://api.openweathermap.org/data/2.5';
  private readonly API_KEY = environment.weatherApiKey;

  constructor(private http: HttpClient) {}

  getWeatherByCoordinates(lat: number, lon: number): Observable<WeatherData> {

    const current$ = this.http.get<any>(
      `${this.API_URL}/weather?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=metric`
    );

    const forecast$ = this.http.get<any>(
      `${this.API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=metric`
    );

    return forkJoin([current$, forecast$]).pipe(
      map(([currentData, forecastData]) => {
        return this.transformData(currentData, forecastData);
      }),
      catchError(error => {
        console.error('Error fetching weather data:', error);
        return throwError(() => new Error('Failed to load weather data.'));
      })
    );
  }

  getWeatherByCity(cityName: string, countryCode: string): Observable<WeatherData> {

    const current$ = this.http.get<any>(
      `${this.API_URL}/weather?q=${cityName},${countryCode}&appid=${this.API_KEY}&units=metric`
    );

    const forecast$ = this.http.get<any>(
      `${this.API_URL}/forecast?q=${cityName},${countryCode}&appid=${this.API_KEY}&units=metric`
    );

    return forkJoin([current$, forecast$]).pipe(
      map(([currentData, forecastData]) => {
        return this.transformData(currentData, forecastData);
      }),
      catchError(error => {
        console.error('Error fetching weather data:', error);
        return throwError(() => new Error('Failed to load weather data.'));
      })
    );
  }

  private transformData(currentData: any, forecastData: any): WeatherData {

    // ✅ Current weather
    const current = {
      temperature: currentData.main.temp,
      feelsLike: currentData.main.feels_like,
      humidity: currentData.main.humidity,
      pressure: currentData.main.pressure,
      windSpeed: currentData.wind.speed,
      windDirection: currentData.wind.deg,
      description: currentData.weather[0].description,
      icon: currentData.weather[0].icon,
      main: currentData.weather[0].main,
      timestamp: currentData.dt
    };

    // ✅ Hourly (next 24 hours → 8 items, 3-hour interval)
    const hourly = forecastData.list.slice(0, 8).map((item: any) => ({
      time: item.dt,
      temperature: item.main.temp,
      feelsLike: item.main.feels_like,
      icon: item.weather[0].icon,
      description: item.weather[0].description,
      precipitation: item.pop * 100
    }));

    // ✅ Daily (every 24 hours → pick every 8th item)
    const daily = forecastData.list
      .filter((_: any, index: number) => index % 8 === 0)
      .map((item: any) => ({
        date: item.dt,
        minTemp: item.main.temp_min,
        maxTemp: item.main.temp_max,
        humidity: item.main.humidity,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        main: item.weather[0].main,
        precipitation: item.pop * 100,
        windSpeed: item.wind.speed
      }));

    return {
      current,
      hourly,
      daily,
      location: {
        name: currentData.name,
        country: currentData.sys.country,
        lat: currentData.coord.lat,
        lon: currentData.coord.lon
      }
    };
  }
}