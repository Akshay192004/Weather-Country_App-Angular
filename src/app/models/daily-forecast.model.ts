export interface DailyForecast {
    date: number;
    minTemp: number;
    maxTemp: number;
    humidity: number;
    description: string;
    icon: string;
    main: string;
    precipitation: number;
    windSpeed: number;
  }