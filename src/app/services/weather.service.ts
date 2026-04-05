import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, forkJoin, of } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import { WeatherData } from '../models/weather-data.model';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private readonly API_URL = 'https://api.openweathermap.org/data/2.5';
  private readonly API_KEY = environment.weatherApiKey;
  private readonly COUNTRIES_API_URL = 'https://restcountries.com/v3.1';
  private readonly FLAG_API_URL = 'https://flagcdn.com';

  constructor(private http: HttpClient) {}

  getCountryData(countryCode: string): Observable<any> {
    return this.http.get<any>(`${this.COUNTRIES_API_URL}/alpha/${countryCode}`);
  }

  private getFlagUrl(countryCode: string): string {
    if (!countryCode || countryCode.length !== 2) {
      return '';
    }
    // Use FlagCDN for reliable flag images
    return `${this.FLAG_API_URL}/32x24/${countryCode.toLowerCase()}.png`;
  }

  getWeatherByCoordinates(lat: number, lon: number): Observable<WeatherData> {

    const current$ = this.http.get<any>(
      `${this.API_URL}/weather?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=metric`
    );

    const forecast$ = this.http.get<any>(
      `${this.API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=metric`
    );

    return forkJoin([current$, forecast$]).pipe(
      map(([currentData, forecastData]) => {
        // Try to get country data if country code is available
        if (currentData.sys?.country) {
          return this.getCountryData(currentData.sys.country).pipe(
            map(countryData => this.transformData(currentData, forecastData, countryData[0])),
            catchError(() => of(this.transformData(currentData, forecastData)))
          );
        } else {
          return of(this.transformData(currentData, forecastData));
        }
      }),
      mergeMap(obs => obs),
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

    const country$ = this.getCountryData(countryCode);

    return forkJoin([current$, forecast$, country$]).pipe(
      map(([currentData, forecastData, countryData]) => {
        return this.transformData(currentData, forecastData, countryData[0]);
      }),
      catchError(error => {
        console.error('Error fetching country data:', error);
        // Still return weather data even if country data fails
        return forkJoin([current$, forecast$]).pipe(
          map(([currentData, forecastData]) => {
            return this.transformData(currentData, forecastData);
          })
        );
      })
    );
  }

  private transformData(currentData: any, forecastData: any, countryData?: any): WeatherData {

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
      daily,
      location: {
        name: currentData.name,
        country: currentData.sys.country,
        lat: currentData.coord.lat,
        lon: currentData.coord.lon,
        flag: this.getFlagUrl(currentData.sys.country)
      }
    };
  }
}