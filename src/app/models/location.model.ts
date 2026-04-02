export interface Country {
    code: string;
    name: string;
  }
  
  export interface City {
    id: string;
    name: string;
    countryCode: string;
    lat: number;
    lon: number;
  }
  
  export interface UserLocation {
    country: Country;
    city: City;
  }