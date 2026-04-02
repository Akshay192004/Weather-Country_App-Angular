import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserLocation } from '../../models/user-location.model';
import { Country } from '../../models/country.model';
import { City } from '../../models/city.model';
import { LocationService } from '../../services/location.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';


@Component({
  selector: 'app-location-selector',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './location-selector.component.html',
  styleUrls: ['./location-selector.component.scss']
})
export class LocationSelectorComponent implements OnInit {
  @Output() locationSelected = new EventEmitter<UserLocation>();
  
  locationForm: FormGroup;
  countries: Country[] = [];
  cities: City[] = [];
  
  isLoadingCities = false;
  citySearchInput = '';
  showCityDropdown = false;
  
  constructor(
    private fb: FormBuilder,
    private locationService: LocationService
  ) {
    this.locationForm = this.fb.group({
      country: ['', Validators.required],
      city: ['', Validators.required]
    });
  }
  
  ngOnInit(): void {
    // Load countries
    this.locationService.getCountries().subscribe(countries => {
      this.countries = countries;
    });
    
    // Handle country changes
    this.locationForm.get('country')?.valueChanges.subscribe(countryCode => {
      // Reset city when country changes
      this.locationForm.get('city')?.setValue('');
      this.citySearchInput = '';
      this.cities = [];
    });
    
    // Initialize form with saved location if exists
    this.locationService.selectedLocation$.subscribe(location => {
      if (location) {
        this.locationForm.patchValue({
          country: location.country.code
        });
        this.citySearchInput = location.city.name;
      }
    });
  }
  
  onCitySearchInputChange(): void {
    const countryCode = this.locationForm.get('country')?.value;
    if (!countryCode || this.citySearchInput.length < 2) {
      this.showCityDropdown = false;
      return;
    }
    
    this.isLoadingCities = true;
    this.showCityDropdown = true;
    
    // Debounce search to avoid too many API calls
    setTimeout(() => {
      this.locationService.searchCities(this.citySearchInput, countryCode)
        .pipe(
          debounceTime(300),
          distinctUntilChanged()
        )
        .subscribe({
          next: (cities) => {
            this.cities = cities;
            this.isLoadingCities = false;
            this.showCityDropdown = cities.length > 0;
          },
          error: () => {
            this.isLoadingCities = false;
            this.showCityDropdown = false;
          }
        });
    }, 500);
  }
  
  onCitySelected(city: City): void {
    this.citySearchInput = city.name;
    this.showCityDropdown = false;
    
    const countryCode = this.locationForm.get('country')?.value;
    const selectedCountry = this.countries.find(c => c.code === countryCode);
    
    if (selectedCountry) {
      const location: UserLocation = {
        country: selectedCountry,
        city: city
      };
      
      this.locationSelected.emit(location);
    }
  }
  
  useCurrentLocation(): void {
    this.locationService.getUserLocation().subscribe({
      next: (location) => {
        if (location) {
          this.locationForm.patchValue({
            country: location.country.code
          });
          this.citySearchInput = location.city.name;
          
          this.locationSelected.emit(location);
        }
      },
      error: (err) => {
        console.error('Failed to get user location:', err);
        // Handle error here
      }
    });
  }
  
  onSearchSubmit(): void {
    const countryCode = this.locationForm.get('country')?.value;
    
    if (countryCode && this.citySearchInput) {
      this.isLoadingCities = true;
      this.locationService.searchCities(this.citySearchInput, countryCode).subscribe({
        next: (cities) => {
          this.isLoadingCities = false;
          
          if (cities.length > 0) {
            // Use the first result
            const selectedCountry = this.countries.find(c => c.code === countryCode);
            
            if (selectedCountry) {
              const location: UserLocation = {
                country: selectedCountry,
                city: cities[0]
              };
              
              this.locationSelected.emit(location);
            }
          }
        },
        error: () => {
          this.isLoadingCities = false;
        }
      });
    }
  }
}
