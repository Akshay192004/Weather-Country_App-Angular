import { Routes } from '@angular/router';
import { WeatherDashboardComponent } from './components/weather-dashboard/weather-dashboard.component';

export const routes: Routes = [
  { path: '', component: WeatherDashboardComponent },
  { path: '**', redirectTo: '' }
];
