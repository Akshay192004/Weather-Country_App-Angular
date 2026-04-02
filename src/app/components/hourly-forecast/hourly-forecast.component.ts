import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { HourlyForecast } from '../../models/hourly-forecast.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hourly-forecast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hourly-forecast.component.html',
  styleUrls: ['./hourly-forecast.component.scss']
})
export class HourlyForecastComponent implements AfterViewInit {
  @Input() hourlyForecast!: HourlyForecast[];
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  
  canScrollLeft = false;
  canScrollRight = true;
  
  ngAfterViewInit(): void {
    setTimeout(() => this.checkScrollButtons(), 100);
  }
  
  scrollLeft(): void {
    const container = this.scrollContainer.nativeElement;
    container.scrollBy({ left: -300, behavior: 'smooth' });
    setTimeout(() => this.checkScrollButtons(), 500);
  }
  
  scrollRight(): void {
    const container = this.scrollContainer.nativeElement;
    container.scrollBy({ left: 300, behavior: 'smooth' });
    setTimeout(() => this.checkScrollButtons(), 500);
  }
  
  checkScrollButtons(): void {
    const container = this.scrollContainer.nativeElement;
    this.canScrollLeft = container.scrollLeft > 0;
    this.canScrollRight = container.scrollLeft < (container.scrollWidth - container.clientWidth - 10);
  }
  
  getWeatherIconUrl(icon: string): string {
    return `https://openweathermap.org/img/wn/${icon}.png`;
  }
  
  formatTime(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
