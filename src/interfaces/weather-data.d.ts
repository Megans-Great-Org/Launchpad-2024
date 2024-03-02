export interface WeatherDataInterface {
  weatherCode: number;
  temperature: number;
}

export interface HourlyWeatherDataInterface {
  dataList: WeatherDataInterface[];
}

export interface CurrentWeatherDataInterface extends WeatherDataInterface {
  temperatureMax: number;
  temperatureMin: number;
}

export interface WeatherDataResponseInterface {
  latitude: number;
  longitude: number;
  current: {
    temperature_2m: number;
    weather_code: number;
  };
  daily: {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number;
  };
  hourly: {
    temperature_2m: number[];
    weather_code: number[];
  };
}

export interface CombinedWeatherDataInterface {
  current: CurrentWeatherDataInterface;
  hourly: HourlyWeatherDataInterface;
  cityName: string;
}
