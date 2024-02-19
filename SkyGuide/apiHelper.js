import {
  populateCurrentWeather,
  populateHourlyWeather,
} from './domManipulation';

export function getWeatherData(city) {
  const locationContainer = document.getElementById('location-container');
  locationContainer.classList.remove('show');
  const params = {
    latitude: city.lat,
    longitude: city.lng,
    current: ['temperature_2m', 'weather_code'],
    hourly: ['temperature_2m', 'weather_code'],
    daily: ['weather_code', 'temperature_2m_max', 'temperature_2m_min'],
    timezone: 'Africa/Cairo',
    forecast_days: 1,
  };
  const queryString = new URLSearchParams(params).toString();
  const url = `https://api.open-meteo.com/v1/forecast?${queryString}`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      populateCurrentWeather(data, city);
      populateHourlyWeather(data);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  setTimeout(function () {
    locationContainer.classList.add('show');
  }, 300);
}

export default getWeatherData;
