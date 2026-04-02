import { City } from "./city.model";
import { Country } from "./country.model";

export interface UserLocation {
    country: Country;
    city: City;
  }