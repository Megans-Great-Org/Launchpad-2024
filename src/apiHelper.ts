import {
  CityInterface,
  CurrentWeatherDataInterface,
  HourlyWeatherDataInterface,
  WeatherDataResponseInterface,
  CombinedWeatherDataInterface,
} from '././interfaces';
import { EMPTY, Subject, combineLatest, interval, of, retry } from 'rxjs';
import { catchError, startWith, switchMap, map } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal/Observable/innerFrom';
import { fromFetch } from 'rxjs/fetch';

const timeInterval$ = interval(600000); //10 minutes

export const updateCitySubject$ = new Subject<CityInterface>();

export const weatherData$ = combineLatest([
  updateCitySubject$,
  timeInterval$.pipe(startWith(0)),
]).pipe(
  map(([city, _]) => {
    const baseUrl = 'https://api.open-meteo.com/v1/forecast';

    const params = new URLSearchParams();
    params.append('latitude', `${city.lat}`);
    params.append('longitude', `${city.lng}`);
    params.append('current', 'temperature_2m,weather_code');
    params.append('hourly', 'temperature_2m,weather_code');
    params.append(
      'daily',
      'weather_code,temperature_2m_max,temperature_2m_min',
    );
    params.append('timezone', 'Africa/Cairo');
    params.append('forecast_days', '1');

    return {
      url: `${baseUrl}?${params.toString()}`,
      cityName: city.cityName,
    };
  }),
  switchMap((cityFetchMetadata) =>
    fromFetch(cityFetchMetadata.url).pipe(
      switchMap((response) =>
        fromPromise<WeatherDataResponseInterface>(response.json()),
      ),
      switchMap((data) => {
        if (
          !data?.current?.temperature_2m &&
          !data?.current?.weather_code &&
          !(data?.daily?.temperature_2m_max?.length > 0) &&
          !(data?.daily?.temperature_2m_min?.length > 0)
        ) {
          throw new Error('Data is not complete or valid');
        }
        const currentWeatherData: CurrentWeatherDataInterface = {
          temperature: data.current.temperature_2m,
          temperatureMax: data.daily.temperature_2m_max[0],
          temperatureMin: data.daily.temperature_2m_min[0],
          weatherCode: data.current.weather_code,
        };

        const hourlyWeatherData: HourlyWeatherDataInterface = {
          dataList: data.hourly.temperature_2m.map((temperature, index) => {
            return {
              temperature,
              weatherCode: data.hourly.weather_code[index],
            };
          }),
        };

        const returnValue: CombinedWeatherDataInterface = {
          current: currentWeatherData,
          hourly: hourlyWeatherData,
          cityName: cityFetchMetadata.cityName,
        };

        return of(returnValue);
      }),
      retry(3),
      catchError((error) => {
        console.error('Could not connect to API', error);
        return EMPTY;
      }),
    ),
  ),
);
