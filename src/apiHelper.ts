import { CityInterface, CurrentWeatherDataInterface, HourlyWeatherDataInterface, WeatherDataResponseInterface } from '././interfaces';

export async function getWeatherData(city : CityInterface): Promise<[CurrentWeatherDataInterface, HourlyWeatherDataInterface]>{
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
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error('Unable to get response');
		}
		const data : WeatherDataResponseInterface = await response.json();
		if (data?.current?.temperature_2m && data?.current?.temperature_2m && data?.daily?.temperature_2m_max.length>0 && data?.daily?.temperature_2m_min.length>0) {
			const currentWeatherData: CurrentWeatherDataInterface = {
				temperature : data.current.temperature_2m,
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

			return [currentWeatherData, hourlyWeatherData];
		}
	} catch (error) {
		console.error('There was a problem with the fetch operation:', error);
		throw error;
	}
	throw new Error('Weather data could not be fetched');
}

export default getWeatherData;