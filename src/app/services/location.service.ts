import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Country } from "../models/country.model";
import { BehaviorSubject, catchError, map, Observable, of, throwError } from "rxjs";
import { UserLocation } from "../models/user-location.model";
import { HttpClient } from "@angular/common/http";
import { City } from "../models/city.model";


@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private readonly GEO_API_URL = 'https://api.openweathermap.org/geo/1.0';
  private readonly API_KEY = environment.weatherApiKey;
  
  // Predefined list of common countries
  private countries: Country[] = [
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'IN', name: 'India' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'JP', name: 'Japan' },
    { code: 'CN', name: 'China' },
    { code: 'BR', name: 'Brazil' }
  ];
  
  private selectedLocationSubject = new BehaviorSubject<UserLocation | null>(null);
  selectedLocation$ = this.selectedLocationSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadSavedLocation();
  }

  getCountries(): Observable<Country[]> {
    return of(this.countries);
  }

  searchCities(query: string, countryCode: string): Observable<City[]> {
    if (!query || query.length < 2) {
      return of([]);
    }
    
    return this.http.get<any[]>(`${this.GEO_API_URL}/direct?q=${query}&limit=5&appid=${this.API_KEY}`).pipe(
      map(results => results
        .filter(result => result.country === countryCode)
        .map(city => ({
          id: `${city.lat}-${city.lon}`,
          name: city.name,
          countryCode: city.country,
          lat: city.lat,
          lon: city.lon
        }))
      ),
      catchError(error => {
        console.error('Error searching cities:', error);
        return of([]);
      })
    );
  }

  setSelectedLocation(location: UserLocation): void {
    this.selectedLocationSubject.next(location);
    this.saveLocationToStorage(location);
  }

  getUserLocation(): Observable<UserLocation | null> {
    return new Observable<UserLocation | null>(observer => {
      if (!navigator.geolocation) {
        observer.error('Geolocation is not supported by your browser');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        position => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          
          this.http.get<any[]>(`${this.GEO_API_URL}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${this.API_KEY}`).pipe(
            catchError(error => {
              console.error('Error in reverse geocoding:', error);
              return throwError(() => new Error('Failed to get location information. Please try entering your location manually.'));
            })
          ).subscribe({
            next: (results) => {
              if (results && results.length > 0) {
                const result = results[0];
                
                const city: City = {
                  id: `${result.lat}-${result.lon}`,
                  name: result.name,
                  countryCode: result.country,
                  lat: result.lat,
                  lon: result.lon
                };
                
                // Find country name from our predefined list
                const country = this.countries.find(c => c.code === result.country);
                
                if (country) {
                  const location: UserLocation = {
                    country,
                    city
                  };
                  
                  this.setSelectedLocation(location);
                  observer.next(location);
                } else {
                  observer.next(null);
                }
              } else {
                observer.next(null);
              }
              observer.complete();
            },
            error: (err) => {
              observer.error(err);
            }
          });
        },
        error => {
          console.error('Error getting user position:', error);
          observer.error(new Error('Unable to determine your location. Please check your browser permissions.'));
        },
        { timeout: 10000, enableHighAccuracy: false }
      );
    });
  }

  private saveLocationToStorage(location: UserLocation): void {
    try {
      localStorage.setItem('weatherApp_location', JSON.stringify(location));
    } catch (e) {
      console.error('Failed to save location to localStorage:', e);
    }
  }

  private loadSavedLocation(): void {
    try {
      const savedLocation = localStorage.getItem('weatherApp_location');
      if (savedLocation) {
        const location: UserLocation = JSON.parse(savedLocation);
        this.selectedLocationSubject.next(location);
      }
    } catch (e) {
      console.error('Failed to load location from localStorage:', e);
      // If there's an error, clear the corrupted data
      localStorage.removeItem('weatherApp_location');
    }
  }
}
