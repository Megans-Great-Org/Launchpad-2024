import {
  populateCurrentWeather,
  populateHourlyWeather,
} from './domManipulation';

import { CityInterface, CurrentWeatherDataInterface, HourlyWeatherDataInterface } from '././interfaces';

export async function getWeatherData(city : CityInterface) {
	const locationContainer = document.getElementById('location-container');
	if (locationContainer) locationContainer.classList.remove('show');

	const baseUrl = 'https://api.open-meteo.com/v1/forecast';
		
	const params = new URLSearchParams();
	params.append('latitude', `${city.lat}`);
	params.append('longitude', `${city.lng}`);
	params.append('current', 'temperature_2m,weather_code');
	params.append('hourly', 'temperature_2m,weather_code');
	params.append('daily', 'weather_code,temperature_2m_max,temperature_2m_min');
	params.append('timezone', 'Africa/Cairo');
	params.append('forecast_days', '1');

	const url = `${baseUrl}?${params.toString()}`;

	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		const data = await response.json();
		if (data?.current?.temperature && data?.current?.temperature && data?.daily?.temperature_2m_max && data?.daily?.temperature_2m_min) {
		const currentWeatherData: CurrentWeatherDataInterface = {
			temperature: data.current.temperature_2m,
			temperatureMax: data.daily.temperature_2m_max,
			temperatureMin: data.daily.temperature_2m_min,
			weatherCode: data.current.weather_code,
		};

		const hourlyWeatherData: HourlyWeatherDataInterface = {
			dataList: data.hourly.map((hourlyData: any) => ({
				temperature: hourlyData.temperature_2m,
				weatherCode: hourlyData.weather_code,
			})),
		};

		populateCurrentWeather(currentWeatherData, city);
		populateHourlyWeather(hourlyWeatherData, currentWeatherData);
	}
		console.log(data); 
	} catch (error) {
		console.error('There was a problem with the fetch operation:', error);
	}
}

export default getWeatherData;