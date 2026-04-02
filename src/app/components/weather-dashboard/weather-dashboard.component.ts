import { CommonModule, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocationSelectorComponent } from '../location-selector/location-selector.component';
import { CurrentWeatherComponent } from '../current-weather/current-weather.component';
import { HourlyForecastComponent } from '../hourly-forecast/hourly-forecast.component';
import { DailyForecastComponent } from '../daily-forecast/daily-forecast.component';
import { WeatherData } from '../../models/weather-data.model';
import { Subscription, take } from 'rxjs';
import { WeatherService } from '../../services/weather.service';
import { LocationService } from '../../services/location.service';
import { UserLocation } from '../../models/user-location.model';

@Component({
  selector: 'app-weather-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    LocationSelectorComponent,
    CurrentWeatherComponent,
    HourlyForecastComponent,
    DailyForecastComponent
  ],
  templateUrl: './weather-dashboard.component.html',
  styleUrls: ['./weather-dashboard.component.scss']
})
export class WeatherDashboardComponent implements OnInit, OnDestroy {
  weatherData: WeatherData | null = null;
  isLoading = true;
  error: string | null = null;
  
  private locationSubscription: Subscription | null = null;
  
  constructor(
    private weatherService: WeatherService,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    // Subscribe to selected location changes
    this.locationSubscription = this.locationService.selectedLocation$.subscribe(
      (location: UserLocation | null) => {
        if (location) {
          this.loadWeatherData(location);
        } else {
          // Try to get user's location automatically
          this.detectUserLocation();
        }
      }
    );
  }
  
  loadWeatherData(location: UserLocation): void {
    this.isLoading = true;
    this.error = null;
    
    this.weatherService.getWeatherByCity(location.city.name, location.country.code)
      .subscribe({
        next: (data) => {
          this.weatherData = data;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = `Failed to load weather data: ${err.message}`;
          this.isLoading = false;
        }
      });
  }
  
  detectUserLocation(): void {
    this.isLoading = true;
    this.error = null;
    
    this.locationService.getUserLocation()
      .subscribe({
        next: (location: UserLocation | null) => {
          if (location) {
            this.loadWeatherData(location);
          } else {
            this.isLoading = false;
            this.error = 'Could not detect your location. Please select manually.';
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.error = `Could not detect your location: ${err.message}`;
        }
      });
  }

  onLocationSelected(location: UserLocation): void {
    this.locationService.setSelectedLocation(location);
  }
  
  retryWeatherData(): void {
    // Fix: Use take(1) to get the current value from the Observable
    this.locationService.selectedLocation$.pipe(take(1)).subscribe(currentLocation => {
      if (currentLocation) {
        this.loadWeatherData(currentLocation);
      } else {
        this.detectUserLocation();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.locationSubscription) {
      this.locationSubscription.unsubscribe();
    }
  }
}







