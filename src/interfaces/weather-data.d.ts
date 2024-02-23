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